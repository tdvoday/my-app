const mongoose = require("mongoose");

// Department - Khoa khám bệnh
const departmentSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true }, // Mã khoa
    name: { type: String, required: true }, // Tên khoa
    description: String, // Mô tả
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // Trạng thái
  },
  { timestamps: true },
);

module.exports = mongoose.model("Department", departmentSchema);
