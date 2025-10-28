const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Only logged-in users can access these routes
router.use(authMiddleware);

// Anyone can read users (viewer included)
router.get("/", roleMiddleware(["admin", "editor", "viewer"]), userController.getUsers);
router.get("/:id", roleMiddleware(["admin", "editor", "viewer"]), userController.getUserById);

// Only admin/editor can modify users
router.post("/", roleMiddleware(["admin", "editor"]), userController.createUser);
router.put("/:id", roleMiddleware(["admin", "editor"]), userController.updateUser);
router.delete("/:id", roleMiddleware(["admin", "editor"]), userController.deleteUser);

// Assign role only for admin
router.post("/assign-role", roleMiddleware(["admin"]), userController.assignRole);

module.exports = router;
