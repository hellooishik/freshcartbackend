const express = require("express");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Serve images statically
router.use("/uploads", express.static(uploadDir));

/**
 * @route   POST /api/category/
 * @desc    Create a new category
 */
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, description, features } = req.body;

        if (!name) return res.status(400).json({ msg: "Name is required" });
        if (!req.file) return res.status(400).json({ msg: "Image is required" });

        const imageUrl = `/uploads/${req.file.filename}`;
        const parsedFeatures = Array.isArray(features) ? features : JSON.parse(features || "[]");

        const newCategory = new Category({
            name,
            description,
            features: parsedFeatures,
            image: imageUrl,
        });

        await newCategory.save();
        res.status(201).json({ msg: "Category created", category: newCategory });
    } catch (err) {
        console.error("🔥 Error creating category:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

/**
 * @route   GET /api/category/
 * @desc    Get all categories
 */
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        console.error("🔥 Error fetching categories:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

/**
 * @route   PUT /api/category/:id
 * @desc    Edit a category
 */
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, description, features } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (features) {
            updateData.features = Array.isArray(features) ? features : JSON.parse(features || "[]");
        }
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.json({ msg: "Category updated successfully", category: updatedCategory });
    } catch (err) {
        console.error("🔥 Error updating category:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

module.exports = router;
