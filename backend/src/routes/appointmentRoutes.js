// Routes: Lịch hẹn khám bệnh
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Patient - Create and view appointments
router.post(
  "/",
  authMiddleware,
  authorizeRoles("patient"),
  appointmentController.createAppointment,
);
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("patient"),
  appointmentController.getMyAppointments,
);
router.post(
  "/:appointmentId/cancel",
  authMiddleware,
  authorizeRoles("patient", "doctor"),
  appointmentController.cancelAppointment,
);
router.get(
  "/:appointmentId/download-pdf",
  authMiddleware,
  authorizeRoles("patient", "doctor", "admin"),
  appointmentController.downloadAppointmentPDF,
);

// Doctor - View and manage appointments
router.get(
  "/doctor",
  authMiddleware,
  authorizeRoles("doctor"),
  appointmentController.getDoctorAppointments,
);
router.put(
  "/:appointmentId/status",
  authMiddleware,
  authorizeRoles("doctor", "admin"),
  appointmentController.updateAppointmentStatus,
);

// Public - Get appointment details
router.get(
  "/:appointmentId",
  authMiddleware,
  appointmentController.getAppointmentById,
);

module.exports = router;
