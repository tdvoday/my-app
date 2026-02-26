// Import models
const User = require("../model/User");

/**
 * GET ALL DOCTORS - Lấy danh sách tất cả bác sĩ
 * - Public endpoint (không cần authentication)
 * - Có thể filter theo departmentId hoặc specialty
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const { departmentId, specialty } = req.query;

    // Xây dựng query
    let query = {
      role: "doctor",
      status: "active",
    };

    if (departmentId) {
      query.departmentId = departmentId;
    }

    if (specialty) {
      query.specialty = new RegExp(specialty, "i"); // Case-insensitive search
    }

    // Lấy danh sách bác sĩ
    const doctors = await User.find(query)
      .select("-password") // Không lấy password
      .populate("departmentId", "name code")
      .sort({ rating: -1, createdAt: -1 });

    res.json({
      message: "Doctors retrieved successfully",
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET DOCTOR BY ID - Lấy thông tin chi tiết bác sĩ
 * - Public endpoint (không cần authentication)
 */
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm bác sĩ
    const doctor = await User.findById(id)
      .select("-password")
      .populate("departmentId", "name code");

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({
      message: "Doctor retrieved successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE DOCTOR INFO - Cập nhật thông tin bác sĩ (Admin or Self)
 * - Cần admin token hoặc là doctor chính mình
 */
exports.updateDoctorInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { specialty, certificate, experience, hospital, bio, avatar } =
      req.body;

    // Tìm bác sĩ
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Chỉ admin hoặc chính doctor mới được cập nhật
    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Cập nhật thông tin
    if (specialty) doctor.specialty = specialty;
    if (certificate) doctor.certificate = certificate;
    if (experience) doctor.experience = experience;
    if (hospital) doctor.hospital = hospital;
    if (bio) doctor.bio = bio;
    if (avatar) doctor.avatar = avatar;

    await doctor.save();

    res.json({
      message: "Doctor information updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * RATE DOCTOR - Đánh giá bác sĩ (Patient only)
 * - Cần patient token
 */
exports.rateDoctorFunction = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { rating } = req.body;

    // Kiểm tra rating hợp lệ (1-5)
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Tìm bác sĩ
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // TODO: Lưu rating vào database (tạo Rating model ở Phase 2)
    // Tạm thời chỉ trả về thành công

    res.json({
      message: "Rating submitted successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DEACTIVATE DOCTOR - Vô hiệu hóa bác sĩ (Admin only)
 * - Cần admin token
 */
exports.deactivateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm bác sĩ
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Vô hiệu hóa
    doctor.status = "inactive";
    await doctor.save();

    res.json({
      message: "Doctor deactivated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ACTIVATE DOCTOR - Kích hoạt bác sĩ (Admin only)
 */
exports.activateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm bác sĩ
    const doctor = await User.findById(id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Kích hoạt
    doctor.status = "active";
    await doctor.save();

    res.json({
      message: "Doctor activated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
