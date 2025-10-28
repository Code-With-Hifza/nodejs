const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");

// Helper function to check permission
const checkPermission = (req, permission) => {
  if (!req.user.permissions.includes(permission)) {
    const err = new Error("Access denied");
    err.status = 403;
    throw err;
  }
};

// 🟢 Create User (Register)
exports.createUser = async (req, res) => {
  try {
    checkPermission(req, "create_user"); // Only if user has create_user permission

    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 🟢 Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("roles");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, roles: user.roles.map(r => r._id) },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get All Users
exports.getUsers = async (req, res) => {
  try {
    checkPermission(req, "read_user"); // Only users with read permission
    const users = await User.find().populate("roles");
    res.status(200).json(users);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 🟢 Get Single User
exports.getUserById = async (req, res) => {
  try {
    checkPermission(req, "read_user");
    const user = await User.findById(req.params.id).populate("roles");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 🟢 Update User
exports.updateUser = async (req, res) => {
  try {
    checkPermission(req, "update_user");

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 🟢 Delete User
exports.deleteUser = async (req, res) => {
  try {
    checkPermission(req, "delete_user");

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// 🟢 Assign Role to User
exports.assignRole = async (req, res) => {
  try {
    checkPermission(req, "assign_role");

    const { userId, roleId } = req.body;

    const user = await User.findById(userId);
    const role = await Role.findById(roleId);

    if (!user || !role) return res.status(404).json({ message: "User or Role not found" });

    if (!user.roles.includes(roleId)) {
      user.roles.push(roleId);
      await user.save();
    }

    res.status(200).json({ message: "Role assigned to user", user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
