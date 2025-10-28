const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permission.controller");
const auth = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// READ (viewer can access)
router.get("/", auth, checkRole(["admin", "editor", "viewer"]), permissionController.getPermissions);
router.get("/:id", auth, checkRole(["admin", "editor", "viewer"]), permissionController.getPermissionById);

// CREATE (no viewer)
router.post("/", auth, checkRole(["admin", "editor"]), permissionController.createPermission);

// UPDATE (no viewer)
router.put("/:id", auth, checkRole(["admin", "editor"]), permissionController.updatePermission);

// DELETE (only admin)
router.delete("/:id", auth, checkRole(["admin"]), permissionController.deletePermission);

module.exports = router;
