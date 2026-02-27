require("dotenv").config();

// Import các module cần thiết
const express = require("express");
const cors = require("cors"); // Cho phép cross-origin requests
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db"); // Function kết nối MongoDB

// Import models
const User = require("./model/User");

// Import routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Hàm tạo admin default
const createDefaultAdmin = async () => {
  try {
    // Kiểm tra xem đã có admin nào chưa
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("✓ Admin account already exists");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Tạo admin account mặc định
    const admin = await User.create({
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      phone: "0987654321",
      role: "admin",
      isEmailVerified: true,
      status: "active",
    });

    console.log("\n╔════════════════════════════════════════╗");
    console.log("║     DEFAULT ADMIN ACCOUNT CREATED      ║");
    console.log("╠════════════════════════════════════════╣");
    console.log("║ Email:    admin@example.com            ║");
    console.log("║ Password: admin123                     ║");
    console.log("╚════════════════════════════════════════╝\n");
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

// Khởi tạo Express application
const app = express();

// Cho phép cross-origin requests từ các domain khác
app.use(cors());
// Parse JSON body của request
app.use(express.json());

connectDB();

// Tạo admin default khi server start
createDefaultAdmin();

// Routes xác thực
app.use("/api/auth", authRoutes);
// Routes lịch hẹn
app.use("/api/appointments", appointmentRoutes);
// Routes khoa khám bệnh
app.use("/api/departments", departmentRoutes);
// Routes lịch khám bệnh
app.use("/api/schedules", scheduleRoutes);
// Routes quản lý bác sĩ
app.use("/api/doctors", doctorRoutes);
// Routes thanh toán VNPay
app.use("/api/payments", paymentRoutes);
// Routes analytics (Admin)
app.use("/api/analytics", analyticsRoutes);
// Routes profile
app.use("/api/profile", profileRoutes);

//Kiểm tra server có chạy không
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

const PORT = process.env.PORT || 5000;

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
