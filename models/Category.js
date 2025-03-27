const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: false }, // Add this field to store image URL or path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
