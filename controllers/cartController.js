const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ✅ Get User Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product", "name price");
    if (!cart) return res.status(200).json({ message: "Cart is empty", products: [] });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message });
  }
};

// ✅ Add to Cart
exports.addToCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      let cart = await Cart.findOne({ user: req.user.id });
  
      if (!cart) {
        cart = new Cart({ user: req.user.id, products: [] });
      }
  
      const existingItem = cart.products.find((item) => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
  
      cart.totalPrice = cart.products.reduce((total, item) => total + item.quantity * product.price, 0);
      await cart.save();
  
      // ✅ Emit event for real-time cart update
      req.app.get("io").emit("cartUpdated", cart);
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart", error: error.message });
    }
  };

// ✅ Remove an Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter((item) => item.product.toString() !== productId);
    cart.totalPrice = cart.products.reduce((total, item) => total + item.quantity * item.product.price, 0);

    await cart.save();
    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error: error.message });
  }
};

// ✅ Clear Cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart", error: error.message });
  }
};
