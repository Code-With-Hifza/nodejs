// middleware/role.middleware.js
module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    const userRoles = req.user?.roles?.map(role => role.name); // assuming role has a 'name' field
    if (!userRoles) return res.status(403).json({ message: "Access denied" });

    // Check if user has any of the allowed roles
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));
    if (!hasPermission) return res.status(403).json({ message: "Access denied" });

    next();
  };
};
