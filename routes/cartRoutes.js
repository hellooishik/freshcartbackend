const express = require("express");
const { addToCart, getCart, removeFromCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get user's cart
router.get("/", protect, getCart);

// ✅ Add item to cart
router.post("/add", protect, addToCart);

// ✅ Remove an item from cart
router.delete("/remove/:productId", protect, removeFromCart);

// ✅ Clear the entire cart
router.delete("/clear", protect, clearCart);

module.exports = router;
