// Import models
const Schedule = require("../model/Schedule");
const User = require("../model/User");

/**
 * GET AVAILABLE SCHEDULES - Lấy lịch khám còn trống
 * - Public endpoint (không cần authentication)
 * - Chỉ hiển thị slot có booked < capacity
 * - Lọc theo doctorId và optionally ngày
 */
exports.getAvailableSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    // Tìm lịch còn trống
    let query = {
      doctorId,
      status: "active",
    };

    // Nếu có date parameter
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const schedules = await Schedule.find(query)
      .populate("doctorId", "name specialty hospital")
      .populate("departmentId", "name code")
      .sort({ date: 1, startTime: 1 });

    // Thêm field 'available' để check còn slot không
    const schedulesWithAvailable = schedules.map((schedule) => ({
      ...schedule.toObject(),
      available: schedule.booked < schedule.capacity,
    }));

    res.json({
      message: "Available schedules retrieved successfully",
      schedules: schedulesWithAvailable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET DOCTOR SCHEDULES - Lấy tất cả lịch của bác sĩ
 * - Public endpoint
 */
exports.getDoctorSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Kiểm tra doctor có tồn tại không
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Lấy tất cả lịch của doctor
    const schedules = await Schedule.find({ doctorId })
      .populate("departmentId", "name code")
      .sort({ date: 1, startTime: 1 });

    res.json({
      message: "Doctor schedules retrieved successfully",
      schedules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE SCHEDULE - Tạo lịch khám (Admin only)
 * - Cần admin token
 */
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, departmentId, date, startTime, endTime, capacity } =
      req.body;

    // Kiểm tra doctor có tồn tại và có role = "doctor" không
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Doctor not found" });
    }

    // Tạo schedule mới
    const schedule = new Schedule({
      doctorId,
      departmentId,
      date,
      startTime,
      endTime,
      capacity: capacity || 1,
      booked: 0,
      status: "active",
    });

    await schedule.save();

    res.status(201).json({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE SCHEDULE - Cập nhật lịch khám (Admin only)
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, capacity, status } = req.body;

    // Tìm schedule
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Cập nhật thông tin
    if (date) schedule.date = date;
    if (startTime) schedule.startTime = startTime;
    if (endTime) schedule.endTime = endTime;
    if (capacity) schedule.capacity = capacity;
    if (status) schedule.status = status;

    await schedule.save();

    res.json({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE SCHEDULE - Xóa lịch khám (Admin only)
 */
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa schedule
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({
      message: "Schedule deleted successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
