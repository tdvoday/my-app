// Routes: Thanh toán VNPay
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public (VNPay callback - no auth needed)
router.get("/vnpay-callback", paymentController.vnpayCallback);

// Patient
router.post(
  "/create-vnpay-url",
  authMiddleware,
  authorizeRoles("patient"),
  paymentController.createVNPayURL,
);
router.get(
  "/:paymentId/download-invoice",
  authMiddleware,
  authorizeRoles("patient", "doctor", "admin"),
  paymentController.downloadPaymentInvoice,
);

// Patient/Doctor/Admin
router.get(
  "/:appointmentId/status",
  authMiddleware,
  authorizeRoles("patient", "doctor", "admin"),
  paymentController.getPaymentStatus,
);

// Admin
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  paymentController.getPaymentHistory,
);
router.post(
  "/:paymentId/refund",
  authMiddleware,
  authorizeRoles("admin"),
  paymentController.refundPayment,
);

module.exports = router;
