const Appointment = require("../model/Appointment");
const Schedule = require("../model/Schedule");
const { sendAppointmentConfirmationEmail } = require("../utils/emailService");
const { generateAppointmentPDF } = require("../utils/pdfService");

/**
 * CREATE APPOINTMENT: Patient books consultation
 * - Validate doctor and schedule
 * - Create appointment record
 * - Update schedule booking count
 * - Send confirmation email
 */
exports.createAppointment = async (req, res) => {
  try {
    const { scheduleId, reason, departmentId } = req.body;
    const patientId = req.user.id;

    // Validate schedule
    if (!scheduleId) {
      return res.status(400).json({ message: "Schedule ID is required" });
    }

    const schedule = await Schedule.findById(scheduleId).populate("doctorId");
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Check if schedule has available slots
    if (schedule.booked >= schedule.capacity) {
      return res
        .status(400)
        .json({ message: "No available slots in this schedule" });
    }

    // Check if patient already has appointment for this schedule
    const existingAppointment = await Appointment.findOne({
      scheduleId,
      patientId,
    });
    if (existingAppointment) {
      return res.status(400).json({
        message: "You already have an appointment for this schedule",
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId,
      doctorId: schedule.doctorId._id,
      scheduleId,
      departmentId: departmentId || schedule.departmentId,
      date: schedule.date,
      time: schedule.startTime,
      reason,
      status: "pending",
    });

    await appointment.save();
    await appointment.populate("doctorId", "name specialty hospital");
    await appointment.populate("patientId", "name email");

    // Update schedule booking count
    schedule.booked += 1;
    await schedule.save();

    // Send confirmation email
    await sendAppointmentConfirmationEmail(
      appointment.patientId.email,
      appointment.patientId.name,
      appointment.doctorId.name,
      schedule.date.toLocaleDateString(),
      schedule.startTime,
      schedule.departmentId,
    );

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET MY APPOINTMENTS: Get patient's appointments
 * - Get all appointments for logged-in patient
 * - Populate doctor and department info
 * - Sort by date descending
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { status } = req.query;

    let query = { patientId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("doctorId", "name specialty hospital phone rating avatar")
      .populate("scheduleId")
      .populate("departmentId", "name code")
      .sort({ date: -1 });

    res.json({
      message: "Appointments retrieved successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET DOCTOR APPOINTMENTS: Get doctor's appointments
 * - Get all appointments for logged-in doctor
 * - Populate patient info
 * - Sort by date descending
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { status } = req.query;

    let query = { doctorId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email phone")
      .populate("scheduleId")
      .populate("departmentId", "name code")
      .sort({ date: -1 });

    res.json({
      message: "Doctor appointments retrieved successfully",
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE APPOINTMENT STATUS: Update appointment status (Doctor/Admin)
 * - Allow doctor or admin to update status
 * - Validate status value
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check authorization (only doctor of appointment or admin can update)
    if (
      req.user.role !== "admin" &&
      appointment.doctorId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You don't have permission to update this appointment",
      });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    res.json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CANCEL APPOINTMENT: Cancel appointment
 * - Allow patient or doctor to cancel
 * - Free up schedule slot
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check authorization
    if (
      req.user.role === "patient" &&
      appointment.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only cancel your own appointments",
      });
    }

    if (
      req.user.role === "doctor" &&
      appointment.doctorId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only cancel appointments assigned to you",
      });
    }

    // Check if already cancelled or completed
    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        message: `Cannot cancel a ${appointment.status} appointment`,
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    // Free up schedule slot
    if (appointment.scheduleId) {
      const schedule = await Schedule.findById(appointment.scheduleId);
      if (schedule && schedule.booked > 0) {
        schedule.booked -= 1;
        await schedule.save();
      }
    }

    res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET APPOINTMENT BY ID: Get appointment details
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name specialty hospital phone rating")
      .populate("patientId", "name email phone")
      .populate("scheduleId")
      .populate("departmentId", "name code");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DOWNLOAD APPOINTMENT PDF: Generate and download appointment PDF
 */
exports.downloadAppointmentPDF = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId")
      .populate("patientId")
      .populate("departmentId");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check authorization
    if (
      req.user.role === "patient" &&
      appointment.patientId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only download your own appointments",
      });
    }

    // Generate PDF
    const pdfResult = await generateAppointmentPDF(appointment);

    if (pdfResult.success) {
      res.download(pdfResult.filePath);
    } else {
      res.status(500).json({ message: pdfResult.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
