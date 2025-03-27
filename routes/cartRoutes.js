const express = require("express");
const { addToCart, getCart, removeFromCart, clearCart, createSession } = require("../controllers/cartController");

const router = express.Router();

// ✅ Generate session ID
router.get("/session", createSession);

// ✅ Get user's cart using sessionId
router.get("/", getCart);

// ✅ Add item to cart using sessionId
router.post("/add", addToCart);

// ✅ Remove an item from cart using sessionId
router.delete("/remove/:productId", removeFromCart);

// ✅ Clear the entire cart using sessionId
router.delete("/clear", clearCart);

module.exports = router;
