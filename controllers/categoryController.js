const Category = require("../models/Category");
const path = require("path");

//  Create Category with image, features & description
const createCategory = async (req, res) => {
  try {
    const { name, description, features } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const parsedFeatures = Array.isArray(features) ? features : JSON.parse(features || "[]");

    const category = new Category({
      name,
      description,
      features: parsedFeatures,
      image: imagePath,
    });

    await category.save();

    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    console.error(" Error creating category:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Edit/Update existing Category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, features } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (features) {
      updateData.features = Array.isArray(features) ? features : JSON.parse(features);
    }
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category: updatedCategory });
  } catch (error) {
    console.error("🔥 Error editing category:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

//  Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("🔥 Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {
  createCategory,
  editCategory,
  getCategories,
};
