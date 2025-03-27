const express = require("express");
const { createRazorpayOrder, verifyRazorpayPayment, createStripePayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Razorpay Payment Routes
router.post("/razorpay", protect, createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

// ✅ Stripe Payment Route
router.post("/stripe", protect, createStripePayment);

module.exports = router;
