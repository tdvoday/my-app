// Routes: Analytics (Admin only)
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All analytics endpoints require admin authentication
router.use(authMiddleware, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard/statistics", analyticsController.getDashboardStatistics);

// Appointments analytics
router.get(
  "/appointments/statistics",
  analyticsController.getAppointmentStatistics,
);

// Revenue analytics
router.get("/revenue/statistics", analyticsController.getRevenueStatistics);

// Doctor performance
router.get("/doctors/performance", analyticsController.getDoctorPerformance);

// Patient statistics
router.get("/patients/statistics", analyticsController.getPatientStatistics);

// System health
router.get("/system/health", analyticsController.getSystemHealth);

module.exports = router;
