const mongoose = require("mongoose");

// Schedule - Lịch khám của bác sĩ
const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Bác sĩ
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    }, // Khoa
    date: { type: Date, required: true }, // Ngày
    startTime: { type: String, required: true }, // Giờ bắt đầu
    endTime: { type: String, required: true }, // Giờ kết thúc
    capacity: { type: Number, required: true, default: 1 }, // Số chỗ
    booked: { type: Number, default: 0 }, // Số đã đặt
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Trạng thái
  },
  { timestamps: true },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
