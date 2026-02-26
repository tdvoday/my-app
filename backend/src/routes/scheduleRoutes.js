// Routes: Lịch khám bệnh
const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public
router.get("/available/:doctorId", scheduleController.getAvailableSchedules);
router.get("/doctor/:doctorId", scheduleController.getDoctorSchedules);

// Admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  scheduleController.createSchedule,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  scheduleController.updateSchedule,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  scheduleController.deleteSchedule,
);

module.exports = router;
