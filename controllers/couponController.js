const Coupon = require("../models/Coupon");

// ✅ Create a new coupon
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

// ✅ Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch coupons", error: error.message });
  }
};

// ✅ Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete coupon", error: error.message });
  }
};
