const Permission = require("../models/Permission");
const Role = require("../models/Role");


// Create Permission
exports.createPermission = async (req, res) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Permissions
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Single Permission
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update Permission
exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ message: "Permission updated", permission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Permission
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ message: "Permission deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Assign Permission to Role
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    const role = await Role.findById(roleId);
    const permission = await Permission.findById(permissionId);

    if (!role || !permission) {
      return res.status(404).json({ message: "Role or Permission not found" });
    }

    // Add permission if not already assigned
    if (!role.permissions.includes(permissionId)) {
      role.permissions.push(permissionId);
      await role.save();
    }

    res.status(200).json({ message: "Permission assigned to role successfully", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
