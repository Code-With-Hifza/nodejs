const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const { createRole, getRoles, assignPermissionToRole } = require("../controllers/permission.controller");



//  Role CRUD Routes

router.post("/", roleController.createRole);
router.get("/", roleController.getRoles);
router.get("/:id", roleController.getRoleById);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

// Assign Permission to Role

router.post("/assign", assignPermissionToRole);

module.exports = router;
