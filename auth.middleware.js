const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UserRole = require("../models/userrole");
const RolePermission = require("../models/rolepermission");
const Permission = require("../models/permission");

module.exports = async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    //  Find user by ID from token
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get user's roles
    const userRoles = await UserRole.find({ userId: user._id });
    const roleIds = userRoles.map(ur => ur.roleId);

    //  Get permissions for these roles
    const rolePerms = await RolePermission.find({ roleId: { $in: roleIds } });
    const permissionIds = rolePerms.map(rp => rp.permissionId);

    const permissions = await Permission.find({ _id: { $in: permissionIds } });

    // Attach user info and permissions to request object
    req.user = {
      id: user._id,
      roles: roleIds,
      permissions: permissions.map(p => p.name), // 'name' field must exist in Permission model
    };

    //  Continue to next middleware/controller
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
