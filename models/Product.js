const mongoose = require("mongoose");

const VariationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "1 Box (12 pcs)", "2 Box (24 pcs)"
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Percentage-based discount
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Base price for single unit
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true },
    sourcing: { type: String, required: false }, // Optional field for sourcing information
    variations: [VariationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);