const Role = require("../models/Role");

//  Create Role
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role updated", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
