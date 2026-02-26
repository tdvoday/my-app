const nodemailer = require("nodemailer");

/**
 * EMAIL SERVICE - Utility để gửi email
 * - Sử dụng nodemailer để gửi email qua SMTP
 * - Hỗ trợ các loại email: verification, appointment confirmation, payment notification, v.v.
 */

// Cấu hình transporter cho nodemailer
// Bạn cần cập nhật các thông tin sau trong .env hoặc hardcode nếu cần
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

/**
 * SEND VERIFICATION EMAIL
 * - Gửi email xác minh địa chỉ email
 * - Bao gồm link xác minh với token
 */
const sendVerificationEmail = async (email, name, token) => {
  try {
    const verificationLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@medical-booking.com",
      to: email,
      subject: "Email Verification - Medical Booking System",
      html: `
        <h2>Welcome to Medical Booking System!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p><a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <p>Best regards,<br/>Medical Booking Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: error.message };
  }
};

/**
 * SEND APPOINTMENT CONFIRMATION EMAIL
 * - Gửi email xác nhận lịch hẹn
 */
const sendAppointmentConfirmationEmail = async (
  email,
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
  department,
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@medical-booking.com",
      to: email,
      subject: "Appointment Confirmation - Medical Booking System",
      html: `
        <h2>Appointment Confirmed!</h2>
        <p>Hi ${patientName},</p>
        <p>Your appointment has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${doctorName}</li>
          <li><strong>Department:</strong> ${department}</li>
          <li><strong>Date:</strong> ${appointmentDate}</li>
          <li><strong>Time:</strong> ${appointmentTime}</li>
        </ul>
        <p>Please arrive 10 minutes before your appointment time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br/>Medical Booking Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Confirmation email sent" };
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    return { success: false, message: error.message };
  }
};

/**
 * SEND PAYMENT NOTIFICATION EMAIL
 * - Gửi email thông báo thanh toán
 */
const sendPaymentNotificationEmail = async (
  email,
  patientName,
  appointmentId,
  amount,
  paymentStatus,
  transactionCode,
) => {
  try {
    const statusText =
      paymentStatus === "paid" ? "Successfully Completed" : "Failed";
    const statusColor = paymentStatus === "paid" ? "#4CAF50" : "#FF6B6B";

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@medical-booking.com",
      to: email,
      subject: `Payment ${statusText} - Medical Booking System`,
      html: `
        <h2>Payment ${statusText}</h2>
        <p>Hi ${patientName},</p>
        <p>Your payment has been processed. Here are the details:</p>
        <ul>
          <li><strong>Appointment ID:</strong> ${appointmentId}</li>
          <li><strong>Amount:</strong> ${amount} VND</li>
          <li><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></li>
          <li><strong>Transaction Code:</strong> ${transactionCode}</li>
        </ul>
        <p>Thank you for using our service!</p>
        <p>Best regards,<br/>Medical Booking Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Payment notification email sent" };
  } catch (error) {
    console.error("Error sending payment notification email:", error);
    return { success: false, message: error.message };
  }
};

/**
 * SEND PASSWORD RESET EMAIL
 * - Gửi email để reset mật khẩu
 */
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetLink = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@medical-booking.com",
      to: email,
      subject: "Password Reset Request - Medical Booking System",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <p><a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>Best regards,<br/>Medical Booking Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendAppointmentConfirmationEmail,
  sendPaymentNotificationEmail,
  sendPasswordResetEmail,
};
