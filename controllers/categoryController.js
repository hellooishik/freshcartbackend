const Category = require("../models/Category");
const path = require("path");

// Create a new category with image upload
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`; // Ensure image URL is accessible

    const category = new Category({ name, description, image: imagePath });
    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("🔥 Error creating category:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("🔥 Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = { createCategory, getCategories };
