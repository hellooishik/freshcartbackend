const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const extractedToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

    console.log("✅ Decoded Token:", decoded); // ✅ Debugging line

    req.user = decoded.user; // ✅ Fix: Ensure `req.user` contains user data

    console.log("✅ Req User:", req.user); // ✅ Debugging line

    next();
  } catch (error) {
    console.error("🔥 JWT Verification Error:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};
exports.protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password"); // Exclude password
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Middleware to check admin role
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};