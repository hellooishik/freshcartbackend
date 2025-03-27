const User = require("../models/User");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

// ✅ Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Hide passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// ✅ Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// ✅ Create a discount coupon (Admin only)
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, expiryDate } = req.body;

    if (!code || !discount || !expiryDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const newCoupon = new Coupon({ code, discount, expiryDate });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ message: "Failed to create coupon", error: error.message });
  }
};
