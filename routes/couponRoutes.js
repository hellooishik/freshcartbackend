const express = require("express");
const { createCoupon, getAllCoupons, deleteCoupon } = require("../controllers/couponController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new coupon (Admin only)
router.post("/", protect, isAdmin, createCoupon);

// ✅ Get all coupons (Admin only)
router.get("/", protect, isAdmin, getAllCoupons);

// ✅ Delete a coupon (Admin only)
router.delete("/:id", protect, isAdmin, deleteCoupon);

module.exports = router;
