const mongoose = require("mongoose");

// Payment - Thanh toán lịch khám
const paymentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    }, // Lịch hẹn
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Bệnh nhân
    amount: { type: Number, required: true }, // Số tiền
    currency: { type: String, default: "VND" }, // Tiền tệ
    method: { type: String, enum: ["vnpay", "cash"], default: "vnpay" }, // Phương thức
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    }, // Trạng thái
    transactionCode: String, // Mã giao dịch
    transactionDate: Date, // Ngày giao dịch
    responseCode: String, // Mã phản hồi VNPay
    message: String, // Thông báo
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
