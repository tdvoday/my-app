// Import mongoose
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // ID của bệnh nhân (reference tới User collection)
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ID của bác sĩ (reference tới User collection)
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // ID của lịch khám (reference tới Schedule collection)
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
    // ID của khoa (reference tới Department collection)
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    // Ngày khám (deprecated - dùng scheduleId thay vào)
    date: {
      type: Date,
      required: true,
    },
    // Giờ khám (deprecated - dùng scheduleId thay vào)
    time: {
      type: String,
      required: true,
    },
    // Lý do khám
    reason: {
      type: String,
    },
    // Ghi chú bác sĩ
    notes: String,
    // Phí khám
    fee: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    // Trạng thái thanh toán (pending/paid/failed/refunded)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  // Tự động thêm createdAt và updatedAt
  { timestamps: true },
);

// Export model
module.exports = mongoose.model("Appointment", appointmentSchema);
