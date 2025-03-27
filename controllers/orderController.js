const Order = require("../models/Order");

// Place an order
const placeOrder = async (req, res) => {
  try {
    const { products, totalPrice, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    console.log("✅ Received User in Order:", req.user); // Debugging line

    const order = new Order({
      user: req.user.id, // ✅ Fix: Ensure `req.user.id` is set
      products,
      totalPrice,
      paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("🔥 Order Placement Error:", error.message);
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email") // ✅ Populate user data
      .populate("products.product", "name price"); // ✅ Fix: Populate product data properly

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("🔥 Error fetching order details:", error.message);
    res.status(500).json({ message: "Failed to fetch order details", error: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // ✅ Emit event for real-time order tracking
    req.app.get("io").emit("orderStatus", order);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
};

// ✅ Correct export
module.exports = {
  placeOrder,
  getOrderDetails,
  updateOrderStatus,
};
