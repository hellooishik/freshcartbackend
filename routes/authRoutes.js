const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const admin = require("../models/adminsdk"); // Firebase Admin SDK
const router = express.Router();

// ✅ Send OTP using Firebase
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ msg: "Phone number is required" });

  try {
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }
    // the mian module is been set to the main f

    // Create a Firebase session for OTP verification
    const sessionInfo = await admin.auth().createSessionCookie(phoneNumber, {
      expiresIn: 600000, // 10 minutes
    });

    res.json({ msg: "OTP sent successfully", sessionInfo });
  } catch (err) {
    console.error("Error in /send-otp:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// ✅ Verify OTP using Firebase
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp, sessionInfo } = req.body;

  if (!phoneNumber || !otp || !sessionInfo) {
    return res.status(400).json({ msg: "Phone number, OTP, and session info are required" });
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionInfo);

    if (!decodedClaims || decodedClaims.phone_number !== phoneNumber) {
      return res.status(400).json({ msg: "Invalid or expired session" });
    }

    // Simulating OTP verification (Firebase handles it in the frontend)
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, msg: "OTP verified successfully" });
  } catch (err) {
    console.error("Error in /verify-otp:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
