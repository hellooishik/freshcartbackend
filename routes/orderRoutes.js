const express = require("express");
const router = express.Router();
const { placeOrder, getOrderDetails, updateOrderStatus } = require("../controllers/orderController");

// Ensure functions are correctly imported
if (!placeOrder || !getOrderDetails || !updateOrderStatus) {
  console.error("❗ Error: Order Controller functions not imported properly.");
  process.exit(1);
}

// Define Routes
router.post("/place", placeOrder); // Place an order
router.get("/:id", getOrderDetails); // Get order details
router.patch("/:id/status", updateOrderStatus); // Update order status

module.exports = router;