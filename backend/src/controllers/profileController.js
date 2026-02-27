const User = require("../model/User");
const bcrypt = require("bcryptjs");

/**
 * PROFILE CONTROLLER
 * - Endpoints để các user (patient, doctor, admin) quản lý profile
 */

/**
 * GET MY PROFILE - Lấy thông tin profile của user đang đăng nhập
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("departmentId", "name code");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE MY PROFILE - Cập nhật profile của user đang đăng nhập
 */
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      avatar,
      specialty,
      hospital,
      bio,
      certificate,
      experience,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate phone if provided (at least 10 digits)
    if (phone) {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
        return res.status(400).json({
          message: "Phone number must have at least 10 digits",
        });
      }
    }

    // Update common fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    // Update doctor-specific fields
    if (user.role === "doctor") {
      if (specialty) user.specialty = specialty;
      if (hospital) user.hospital = hospital;
      if (bio) user.bio = bio;
      if (certificate) user.certificate = certificate;
      if (experience) user.experience = experience;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        specialty: user.specialty,
        hospital: user.hospital,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CHANGE PASSWORD - Đổi mật khẩu
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "Current password, new password and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET USER BY ID - Lấy thông tin user theo ID (Admin only)
 */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password")
      .populate("departmentId", "name code");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET ALL USERS - Lấy danh sách tất cả users (Admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .populate("departmentId", "name code")
      .sort({ createdAt: -1 });

    res.json({
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE USER - Cập nhật thông tin user (Admin only)
 */
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, status, role, specialty, hospital, departmentId } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate phone if provided (at least 10 digits)
    if (phone) {
      const phoneRegex = /^\d{10,}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
        return res.status(400).json({
          message: "Phone number must have at least 10 digits",
        });
      }
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (status) user.status = status;
    if (role) user.role = role;
    if (specialty) user.specialty = specialty;
    if (hospital) user.hospital = hospital;
    if (departmentId) user.departmentId = departmentId;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DEACTIVATE USER - Vô hiệu hóa user (Admin only)
 */
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "inactive";
    await user.save();

    res.json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ACTIVATE USER - Kích hoạt user (Admin only)
 */
exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "active";
    await user.save();

    res.json({
      message: "User activated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE USER - Xóa user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
