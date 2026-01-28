// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2) OR get token from cookie
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // 3) If no token
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in. Please log in first.",
      });
    }

    // 4) Verify token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    // 5) Check user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
      });
    }

    // 6) Grant access
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
