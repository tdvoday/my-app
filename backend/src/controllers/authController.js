const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");

/**
 * REGISTER: Create new patient account
 * - Validate input
 * - Hash password
 * - Generate verification token
 * - Send verification email
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // DEV MODE: auto verify email
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "patient",
      isEmailVerified: true,
      status: "active",
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * VERIFY EMAIL: Verify user's email address
 * - Validate token
 * - Mark email as verified
 */
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    // Hash the token to compare
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token
    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN: Verify credentials and generate JWT token
 * - Check if email exists
 * - Verify password
 * - Generate JWT token
 * - Return user info and token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Check if account is locked or inactive
    if (user.status === "locked") {
      return res.status(403).json({ message: "Account is locked" });
    }

    if (user.status === "inactive" && user.role === "patient") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Check if email is verified (for patients)
    if (user.role === "patient" && !user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        specialty: user.specialty,
        hospital: user.hospital,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * FORGOT PASSWORD: Generate password reset token
 * - Find user by email
 * - Generate reset token
 * - Send reset email
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.emailVerificationToken = resetTokenHash;
    user.emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send reset email
    const emailResult = await sendPasswordResetEmail(
      email,
      user.name,
      resetToken,
    );

    res.json({
      message: "Password reset email sent",
      emailSent: emailResult.success,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * RESET PASSWORD: Reset user password with token
 * - Validate token
 * - Hash new password
 * - Update password
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ASSIGN DOCTOR ROLE: Grant doctor privileges to patient (Admin only)
 * - Validate input
 * - Update user role to doctor
 * - Update doctor-specific fields
 */
exports.assignDoctorRole = async (req, res) => {
  try {
    const { userId, specialty, hospital, phone, certificate, experience, bio } =
      req.body;

    if (!userId || !specialty || !hospital) {
      return res.status(400).json({
        message: "UserId, specialty, and hospital are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.role = "doctor";
    user.specialty = specialty;
    user.hospital = hospital;
    user.phone = phone;
    user.certificate = certificate;
    user.experience = experience;
    user.bio = bio;

    await user.save();

    res.json({
      message: "Doctor role assigned successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialty: user.specialty,
        hospital: user.hospital,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
