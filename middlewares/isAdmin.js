const User = require("../models/userModel");

module.exports = async function isAdmin(req, res, next) {
  try {
    const roll = req.headers.rollnumber;

    if (!roll) {
      return res.status(401).json({ message: "Roll number required" });
    }

    const user = await User.findOne({ rollNumber: roll.toLowerCase() });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied (not admin)" });
    }

    req.user = user; // attach user for later use
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
