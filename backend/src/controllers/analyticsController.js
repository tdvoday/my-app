const User = require("../model/User");
const Appointment = require("../model/Appointment");
const Payment = require("../model/Payment");
const Department = require("../model/Department");
const Schedule = require("../model/Schedule");

/**
 * ANALYTICS CONTROLLER
 * - Lấy dữ liệu phân tích cho admin dashboard
 * - Bao gồm số liệu thống kê, biểu đồ, v.v.
 */

/**
 * GET DASHBOARD STATISTICS - Lấy thống kê tổng quát
 */
exports.getDashboardStatistics = async (req, res) => {
  try {
    // Count users by role
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Count appointments by status
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
    });
    const confirmedAppointments = await Appointment.countDocuments({
      status: "confirmed",
    });
    const completedAppointments = await Appointment.countDocuments({
      status: "completed",
    });
    const cancelledAppointments = await Appointment.countDocuments({
      status: "cancelled",
    });

    // Payment statistics
    const totalPayments = await Payment.countDocuments();
    const paidPayments = await Payment.countDocuments({ status: "paid" });
    const pendingPayments = await Payment.countDocuments({ status: "pending" });
    const refundedPayments = await Payment.countDocuments({
      status: "refunded",
    });

    // Calculate total revenue from paid payments
    const paidPaymentData = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);
    const totalRevenue = paidPaymentData[0]?.totalAmount || 0;

    // Count departments
    const totalDepartments = await Department.countDocuments();

    // Get average doctor rating
    const doctorRatingData = await User.aggregate([
      { $match: { role: "doctor" } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const averageDoctorRating = doctorRatingData[0]?.avgRating || 0;

    res.json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        users: {
          totalPatients,
          totalDoctors,
          totalAdmins,
        },
        appointments: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
          total:
            pendingAppointments +
            confirmedAppointments +
            completedAppointments +
            cancelledAppointments,
        },
        payments: {
          paid: paidPayments,
          pending: pendingPayments,
          refunded: refundedPayments,
          total: totalPayments,
          totalRevenue,
        },
        departments: totalDepartments,
        averageDoctorRating: averageDoctorRating.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET APPOINTMENT STATISTICS - Lấy thống kê lịch hẹn
 */
exports.getAppointmentStatistics = async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;

    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (department) {
      query.departmentId = department;
    }

    // Get appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get appointments by department
    const appointmentsByDepartment = await Appointment.aggregate([
      { $match: query },
      {
        $group: { _id: "$departmentId", count: { $sum: 1 } },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
    ]);

    // Get appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      { $match: query },
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get total appointments count
    const totalAppointments = await Appointment.countDocuments(query);

    res.json({
      message: "Appointment statistics retrieved successfully",
      data: {
        totalAppointments,
        byStatus: appointmentsByStatus,
        byDepartment: appointmentsByDepartment,
        topDoctors: appointmentsByDoctor,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET REVENUE STATISTICS - Lấy thống kê doanh thu
 */
exports.getRevenueStatistics = async (req, res) => {
  try {
    const { startDate, endDate, method } = req.query;

    let query = { status: "paid" };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    if (method) {
      query.method = method;
    }

    // Get revenue by method
    const revenueByMethod = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$method",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get daily revenue
    const dailyRevenue = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get total revenue
    const totalRevenueData = await Payment.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;
    const totalTransactions = totalRevenueData[0]?.count || 0;

    res.json({
      message: "Revenue statistics retrieved successfully",
      data: {
        totalRevenue,
        totalTransactions,
        averageTransactionValue:
          totalTransactions > 0
            ? (totalRevenue / totalTransactions).toFixed(2)
            : 0,
        byMethod: revenueByMethod,
        dailyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET DOCTOR PERFORMANCE - Lấy hiệu suất của bác sĩ
 */
exports.getDoctorPerformance = async (req, res) => {
  try {
    const { departmentId } = req.query;

    let query = { role: "doctor" };

    if (departmentId) {
      query.departmentId = departmentId;
    }

    // Get doctors with appointment and rating stats
    const doctorPerformance = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "appointments",
          localField: "_id",
          foreignField: "doctorId",
          as: "appointments",
        },
      },
      {
        $project: {
          name: 1,
          specialty: 1,
          hospital: 1,
          rating: 1,
          totalAppointments: { $size: "$appointments" },
          completedAppointments: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "appointment",
                cond: { $eq: ["$$appointment.status", "completed"] },
              },
            },
          },
          pendingAppointments: {
            $size: {
              $filter: {
                input: "$appointments",
                as: "appointment",
                cond: { $eq: ["$$appointment.status", "pending"] },
              },
            },
          },
        },
      },
      { $sort: { totalAppointments: -1 } },
    ]);

    res.json({
      message: "Doctor performance retrieved successfully",
      count: doctorPerformance.length,
      data: doctorPerformance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET PATIENT STATISTICS - Lấy thống kê bệnh nhân
 */
exports.getPatientStatistics = async (req, res) => {
  try {
    // Total patients
    const totalPatients = await User.countDocuments({ role: "patient" });

    // New patients (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newPatientsLast30Days = await User.countDocuments({
      role: "patient",
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Patients with completed appointments
    const patientWithAppointments = await Appointment.distinct("patientId");
    const patientsWithAppointmentCount = patientWithAppointments.length;

    // Active patients (with appointment in last 30 days)
    const activePatientsCount = await Appointment.distinct("patientId", {
      createdAt: { $gte: thirtyDaysAgo },
    }).then((ids) => ids.length);

    // Top departments by patients
    const topDepartments = await Appointment.aggregate([
      {
        $group: {
          _id: "$departmentId",
          patientCount: { $addToSet: "$patientId" },
        },
      },
      {
        $project: {
          _id: 1,
          patientCount: { $size: "$patientCount" },
        },
      },
      { $sort: { patientCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "department",
        },
      },
    ]);

    res.json({
      message: "Patient statistics retrieved successfully",
      data: {
        totalPatients,
        newPatientsLast30Days,
        patientsWithAppointmentCount,
        activePatientsLast30Days: activePatientsCount,
        topDepartments,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET SYSTEM HEALTH - Lấy trạng thái của hệ thống
 */
exports.getSystemHealth = async (req, res) => {
  try {
    // Database statistics
    const totalUsers = await User.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalDepartments = await Department.countDocuments();
    const totalSchedules = await Schedule.countDocuments();

    // Recent errors/issues (if any tracking is in place)
    // This would need error logging implementation

    res.json({
      message: "System health retrieved successfully",
      data: {
        databaseStatus: "connected",
        collections: {
          users: totalUsers,
          appointments: totalAppointments,
          payments: totalPayments,
          departments: totalDepartments,
          schedules: totalSchedules,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, databaseStatus: "error" });
  }
};
