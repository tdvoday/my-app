// Routes: User Profile
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Authenticated users (all roles)
router.get("/me", authMiddleware, profileController.getMyProfile);
router.put("/me", authMiddleware, profileController.updateMyProfile);
router.post(
  "/change-password",
  authMiddleware,
  profileController.changePassword,
);

// Admin only - User management
router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.getAllUsers,
);
router.get(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.getUserById,
);
router.put(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.updateUser,
);
router.patch(
  "/:userId/deactivate",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.deactivateUser,
);
router.patch(
  "/:userId/activate",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.activateUser,
);
router.delete(
  "/:userId",
  authMiddleware,
  authorizeRoles("admin"),
  profileController.deleteUser,
);

module.exports = router;
