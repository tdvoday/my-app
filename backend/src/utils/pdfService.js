const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * PDF SERVICE - Utility để tạo PDF cho đặc điểm khác nhau
 * - Tạo PDF cho lịch hẹn
 * - Tạo PDF cho hóa đơn thanh toán
 * - Tạo PDF cho bản ghi y tế
 */

/**
 * GENERATE APPOINTMENT PDF
 * - Tạo PDF cho lịch hẹn bác sĩ
 */
const generateAppointmentPDF = async (appointmentData) => {
  try {
    const fileName = `appointment_${appointmentData._id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../../uploads/pdfs", fileName);

    // Tạo thư mục nếu chưa tồn tại
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("Medical Appointment Receipt", { align: "center" });
    doc.moveTo(50, 50).lineTo(550, 50).stroke();
    doc.moveTo(0, 550).lineTo(600, 550).stroke();

    // Appointment Details
    doc.fontSize(12).text("", 50, 80);
    doc.text(`Appointment ID: ${appointmentData._id}`, 50, 100);
    doc.text(`Date: ${appointmentData.date}`, 50, 120);
    doc.text(`Time: ${appointmentData.time}`, 50, 140);
    doc.text(
      `Department: ${appointmentData.departmentId?.name || "N/A"}`,
      50,
      160,
    );

    // Patient Information
    doc.fontSize(14).text("Patient Information", 50, 200);
    doc.fontSize(12);
    doc.text(`Name: ${appointmentData.patientId?.name || "N/A"}`, 50, 220);
    doc.text(`Email: ${appointmentData.patientId?.email || "N/A"}`, 50, 240);
    doc.text(`Phone: ${appointmentData.patientId?.phone || "N/A"}`, 50, 260);

    // Doctor Information
    doc.fontSize(14).text("Doctor Information", 50, 300);
    doc.fontSize(12);
    doc.text(`Name: ${appointmentData.doctorId?.name || "N/A"}`, 50, 320);
    doc.text(
      `Specialty: ${appointmentData.doctorId?.specialty || "N/A"}`,
      50,
      340,
    );
    doc.text(
      `Hospital: ${appointmentData.doctorId?.hospital || "N/A"}`,
      50,
      360,
    );

    // Appointment Details
    doc.fontSize(14).text("Appointment Details", 50, 400);
    doc.fontSize(12);
    doc.text(`Reason: ${appointmentData.reason || "Regular Checkup"}`, 50, 420);
    doc.text(`Fee: ${appointmentData.fee || 0} VND`, 50, 440);
    doc.text(`Status: ${appointmentData.status}`, 50, 460);
    doc.text(`Payment Status: ${appointmentData.paymentStatus}`, 50, 480);

    // Footer
    doc
      .fontSize(10)
      .text(
        "This is an official document from Medical Booking System",
        50,
        550,
        {
          align: "center",
        },
      );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 50, 565, {
      align: "center",
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve({
          success: true,
          fileName,
          filePath,
          message: "PDF generated successfully",
        });
      });
      stream.on("error", (error) => {
        reject({ success: false, message: error.message });
      });
    });
  } catch (error) {
    console.error("Error generating appointment PDF:", error);
    return { success: false, message: error.message };
  }
};

/**
 * GENERATE PAYMENT INVOICE PDF
 * - Tạo PDF cho hóa đơn thanh toán
 */
const generatePaymentInvoicePDF = async (paymentData) => {
  try {
    const fileName = `invoice_${paymentData._id}_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../../uploads/pdfs", fileName);

    // Tạo thư mục nếu chưa tồn tại
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("Payment Invoice", { align: "center" });
    doc.moveTo(50, 50).lineTo(550, 50).stroke();

    // Invoice Details
    doc.fontSize(12).text("", 50, 80);
    doc.text(`Invoice ID: ${paymentData._id}`, 50, 100);
    doc.text(`Payment Method: ${paymentData.method}`, 50, 120);
    doc.text(`Status: ${paymentData.status}`, 50, 140);
    doc.text(
      `Date: ${paymentData.transactionDate || new Date().toDateString()}`,
      50,
      160,
    );

    // Amount Details
    doc.fontSize(14).text("Amount Details", 50, 200);
    doc.fontSize(12);
    doc.text(`Amount: ${paymentData.amount} ${paymentData.currency}`, 50, 220);
    doc.text(`Appointment ID: ${paymentData.appointmentId}`, 50, 240);

    // Transaction Information
    if (paymentData.transactionCode) {
      doc.fontSize(14).text("Transaction Information", 50, 280);
      doc.fontSize(12);
      doc.text(`Transaction Code: ${paymentData.transactionCode}`, 50, 300);
    }

    // Footer
    doc.fontSize(10).text("Thank you for your payment", 50, 500, {
      align: "center",
    });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 50, 515, {
      align: "center",
    });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on("finish", () => {
        resolve({
          success: true,
          fileName,
          filePath,
          message: "Invoice PDF generated successfully",
        });
      });
      stream.on("error", (error) => {
        reject({ success: false, message: error.message });
      });
    });
  } catch (error) {
    console.error("Error generating payment invoice PDF:", error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  generateAppointmentPDF,
  generatePaymentInvoicePDF,
};
