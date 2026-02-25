const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },

    // Thông tin thêm cho bác sĩ
    specialty: String,
    hospital: String,
    phone: String,
    avatar: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
