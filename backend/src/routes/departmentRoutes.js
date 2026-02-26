// Routes: Kh\u00f3a kh\u00e1m b\u1ec7nh
const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Public
router.get("/", departmentController.getAllDepartments);
router.get("/:id", departmentController.getDepartmentById);

// Admin only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  departmentController.createDepartment,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  departmentController.updateDepartment,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  departmentController.deleteDepartment,
);

module.exports = router;
