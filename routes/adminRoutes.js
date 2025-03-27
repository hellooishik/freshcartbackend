const express = require("express");
const router = express.Router();
const { getAllUsers, getAllOrders, createCoupon } = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// ✅ Admin Routes - Only accessible by Admins
router.get("/users", protect, isAdmin, getAllUsers); // Get all users
router.get("/orders", protect, isAdmin, getAllOrders); // Get all orders
router.post("/coupons", protect, isAdmin, createCoupon); // Create discount coupon

module.exports = router;
