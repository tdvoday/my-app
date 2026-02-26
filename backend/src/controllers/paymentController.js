// Import models
const Payment = require("../model/Payment");
const Appointment = require("../model/Appointment");
const { sendPaymentNotificationEmail } = require("../utils/emailService");
const { generatePaymentInvoicePDF } = require("../utils/pdfService");

/**
 * CREATE VNPAY URL - Tạo URL thanh toán VNPay
 * - Cần patient token
 * - Tạo đơn thanh toán
 * - Trả về URL để redirect sang VNPay
 */
exports.createVNPayURL = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;
    const patientId = req.user.id;

    // Validate input
    if (!appointmentId || !amount) {
      return res.status(400).json({
        message: "Appointment ID and amount are required",
      });
    }

    // Kiểm tra appointment có tồn tại không
    const appointment =
      await Appointment.findById(appointmentId).populate("patientId");
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Kiểm tra appointment thuộc về patient
    if (appointment.patientId._id.toString() !== patientId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Kiểm tra appointment chưa thanh toán
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({ message: "Appointment already paid" });
    }

    // Tạo payment record
    const payment = new Payment({
      appointmentId,
      patientId,
      amount,
      currency: "VND",
      method: "vnpay",
      status: "pending",
    });

    await payment.save();

    // TODO: Tích hợp VNPay API thực tế
    // Tạm thời chỉ trả về payment URL giả
    const paymentUrl = `https://sandbox.vnpayment.vn/paygate?paymentId=${payment._id}`;

    res.json({
      message: "VNPay URL created successfully",
      data: {
        paymentUrl,
        paymentId: payment._id,
        transactionCode: payment._id.toString(),
        amount,
        appointmentId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * VNPAY CALLBACK - Xử lý callback từ VNPay
 * - VNPay server sẽ gọi endpoint này
 * - Verify chữ ký
 * - Cập nhật payment status
 * - Cập nhật appointment status
 * - Gửi email thông báo
 */
exports.vnpayCallback = async (req, res) => {
  try {
    const { vnp_ResponseCode, vnp_TxnRef } = req.query;

    if (!vnp_ResponseCode || !vnp_TxnRef) {
      return res.status(400).json({
        message: "Missing required callback parameters",
      });
    }

    // Tìm payment record
    const payment = await Payment.findById(vnp_TxnRef).populate(
      "appointmentId",
      "patientId",
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Kiểm tra phản hồi từ VNPay
    if (vnp_ResponseCode === "00") {
      // Thanh toán thành công
      payment.status = "paid";
      payment.responseCode = vnp_ResponseCode;
      payment.transactionDate = new Date();
      await payment.save();

      // Cập nhật appointment status
      const appointment = await Appointment.findById(
        payment.appointmentId,
      ).populate("patientId");
      if (appointment) {
        appointment.paymentStatus = "paid";
        appointment.status = "confirmed";
        await appointment.save();

        // Send payment notification email
        await sendPaymentNotificationEmail(
          appointment.patientId.email,
          appointment.patientId.name,
          appointment._id,
          payment.amount,
          "paid",
          payment._id.toString(),
        );
      }

      // Redirect đến success page
      res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/payment-success?appointmentId=${payment.appointmentId}`,
      );
    } else {
      // Thanh toán thất bại
      payment.status = "failed";
      payment.responseCode = vnp_ResponseCode;
      await payment.save();

      // Cập nhật appointment status
      const appointment = await Appointment.findById(
        payment.appointmentId,
      ).populate("patientId");
      if (appointment) {
        appointment.paymentStatus = "failed";
        await appointment.save();

        // Send payment failure email
        await sendPaymentNotificationEmail(
          appointment.patientId.email,
          appointment.patientId.name,
          appointment._id,
          payment.amount,
          "failed",
          payment._id.toString(),
        );
      }

      // Redirect đến failure page
      res.redirect(
        `${
          process.env.CLIENT_URL || "http://localhost:3000"
        }/payment-failed?appointmentId=${payment.appointmentId}`,
      );
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET PAYMENT STATUS - Lấy trạng thái thanh toán
 * - Patient, Doctor, hoặc Admin có thể xem
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    // Tìm payment record
    const payment = await Payment.findOne({
      appointmentId,
    }).populate("appointmentId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Kiểm tra quyền truy cập
    const appointment = await Appointment.findById(appointmentId);
    if (
      req.user.id !== appointment.patientId.toString() &&
      req.user.id !== appointment.doctorId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      message: "Payment status retrieved successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET PAYMENT HISTORY - Lấy lịch sử thanh toán (Admin only)
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const { status, patientId, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (patientId) {
      query.patientId = patientId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Lấy tất cả payment
    const payments = await Payment.find(query)
      .populate("patientId", "name email phone")
      .populate("appointmentId", "date time reason fee")
      .sort({ createdAt: -1 });

    // Calculate statistics
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      message: "Payment history retrieved successfully",
      count: payments.length,
      statistics: {
        totalAmount,
        paidAmount,
        pendingAmount,
        refundedAmount: payments
          .filter((p) => p.status === "refunded")
          .reduce((sum, p) => sum + p.amount, 0),
      },
      payments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * REFUND PAYMENT - Hoàn tiền (Admin only)
 * - Chỉ có thể hoàn tiền cho payment đã thanh toán
 * - Cập nhật payment status
 * - Cập nhật appointment status
 */
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Tìm payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Chỉ có thể hoàn tiền nếu đã thanh toán
    if (payment.status !== "paid") {
      return res.status(400).json({
        message: `Cannot refund a ${payment.status} payment`,
      });
    }

    // Cập nhật trạng thái
    payment.status = "refunded";
    payment.message = reason || "Refund processed";
    await payment.save();

    // Cập nhật appointment status
    const appointment = await Appointment.findById(
      payment.appointmentId,
    ).populate("patientId");
    if (appointment) {
      appointment.paymentStatus = "refunded";
      appointment.status = "cancelled";
      await appointment.save();

      // Send refund notification email
      await sendPaymentNotificationEmail(
        appointment.patientId.email,
        appointment.patientId.name,
        appointment._id,
        payment.amount,
        "refunded",
        payment._id.toString(),
      );
    }

    res.json({
      message: "Payment refunded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DOWNLOAD PAYMENT INVOICE - Download payment invoice as PDF
 */
exports.downloadPaymentInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check authorization
    if (
      req.user.role === "patient" &&
      payment.patientId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only download your own payment invoices",
      });
    }

    // Generate PDF
    const pdfResult = await generatePaymentInvoicePDF(payment);

    if (pdfResult.success) {
      res.download(pdfResult.filePath);
    } else {
      res.status(500).json({ message: pdfResult.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
