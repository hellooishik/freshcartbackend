const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id } }, // ✅ Fix: Store `id` inside `user`
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create user
    user = await User.create({ name, email, password });

    res.status(201).json({ message: "Registration successful", token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate password
    const isMatch = password === user.password; // Direct string comparison

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
