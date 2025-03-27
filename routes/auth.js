const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("../utils/otp");
const twilio = require("twilio");

const router = express.Router();

// Initialize Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Request OTP Route
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ msg: "Phone number is required" });

  try {
    let user = await User.findOne({ phoneNumber });

    // Register if user doesn't exist
    if (!user) {
      user = new User({ phoneNumber });
      await user.save();
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// ✅ Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) return res.status(400).json({ msg: "Phone number and OTP are required" });

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Clear OTP after verification
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, msg: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
