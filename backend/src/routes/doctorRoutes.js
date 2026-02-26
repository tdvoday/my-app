// Routes: Quản lý bác sĩ
const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);

// Doctor/Admin
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("doctor", "admin"),
  doctorController.updateDoctorInfo,
);

// Patient
router.post(
  "/:id/rate",
  authMiddleware,
  authorizeRoles("patient"),
  doctorController.rateDoctorFunction,
);

// Admin only
router.patch(
  "/:id/deactivate",
  authMiddleware,
  authorizeRoles("admin"),
  doctorController.deactivateDoctor,
);
router.patch(
  "/:id/activate",
  authMiddleware,
  authorizeRoles("admin"),
  doctorController.activateDoctor,
);

module.exports = router;
