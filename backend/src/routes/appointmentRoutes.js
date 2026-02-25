const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// User đặt lịch
router.post(
  "/",
  authMiddleware,
  authorizeRoles("user"),
  appointmentController.createAppointment,
);

// User xem lịch của mình
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("user"),
  appointmentController.getMyAppointments,
);

// Doctor xem lịch của mình
router.get(
  "/doctor",
  authMiddleware,
  authorizeRoles("doctor"),
  appointmentController.getDoctorAppointments,
);

module.exports = router;
