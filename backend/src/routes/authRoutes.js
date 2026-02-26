// Routes: Xác thực & đăng nhập
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Admin only
router.post(
  "/assign-doctor",
  authMiddleware,
  authorizeRoles("admin"),
  authController.assignDoctorRole,
);

module.exports = router;
