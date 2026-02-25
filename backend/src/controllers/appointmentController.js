const Appointment = require("../model/Appointment");
const User = require("../model/User");

// User tạo lịch hẹn
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user.id;

    // Kiểm tra doctor có tồn tại không
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(400).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: "pending",
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User xem lịch hẹn của mình
exports.getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name specialty hospital phone")
      .sort({ date: -1 });

    res.json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Doctor xem lịch hẹn của mình
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name email phone")
      .sort({ date: -1 });

    res.json({
      message: "Doctor appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
