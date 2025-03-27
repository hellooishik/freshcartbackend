const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { v4: uuidv4 } = require('uuid');

// ✅ Generate sessionId
exports.createSession = (req, res) => {
  const sessionId = uuidv4();
  res.status(200).json({ sessionId });
};

// ✅ Get Cart using sessionId
exports.getCart = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const cart = await Cart.findOne({ sessionId }).populate("items.productId", "name price");

    if (!cart) return res.status(200).json({ message: "Cart is empty", items: [] });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

// ✅ Add to Cart using sessionId
exports.addToCart = async (req, res) => {
  try {
    const { sessionId, productId, quantity, variation, price } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItem = cart.items.find((item) =>
      item.productId.toString() === productId && item.variation === variation
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variation, quantity, price });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add item to cart", error: error.message });
  }
};

// ✅ Remove Item using sessionId
exports.removeFromCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { productId } = req.params;

    let cart = await Cart.findOne({ sessionId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// ✅ Clear Cart using sessionId
exports.clearCart = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await Cart.findOneAndDelete({ sessionId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
