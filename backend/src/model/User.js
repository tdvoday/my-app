// Import mongoose
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Tên người dùng (bắt buộc)
    name: {
      type: String,
      required: true,
    },
    // Email (bắt buộc, không được trùng)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Mật khẩu đã hash bằng bcrypt (bắt buộc)
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient", // Mặc định khi đăng ký là patient
    },

    // Các trường thông tin chung
    phone: String,

    // ========== EMAIL VERIFICATION ==========
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // ========== TRƯỜNG BẮT BUỘC CHO DOCTOR ==========
    // Chuyên khoa (vd: "Nội", "Ngoại", "Nhi", "Tai Mũi Họng")
    specialty: String,
    // Nơi làm việc
    hospital: String,
    // Chứng chỉ hành nghề
    certificate: String,
    // Năm kinh nghiệm
    experience: Number,
    // Tiểu sử chuyên môn
    bio: String,
    // Ảnh đại diện
    avatar: String,
    // Điểm đánh giá (trung bình từ các đánh giá)
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // Trạng thái tài khoản (active/inactive/locked)
    status: {
      type: String,
      enum: ["active", "inactive", "locked"],
      default: "active",
    },
    // Khoa/Bộ phận làm việc (reference tới Department)
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  // Tự động thêm createdAt và updatedAt
  { timestamps: true },
);

// Export model
module.exports = mongoose.model("User", userSchema);
