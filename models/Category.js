const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: false },
    features: [{ type: String }], // Bullet points like "What You Get"
    description: { type: String }, // For "Sourcing" content
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);