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
        cb(null, uploadDir); // Save directly to uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Serve images statically
router.use('/uploads', express.static(uploadDir));

// Create Category with Image Upload
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ msg: "Image is required" });
        }

        const imageUrl = `/uploads/${req.file.filename}`; // Relative path for API response

        const category = new Category({ name, description, image: imageUrl });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        console.error("🔥 Error creating category:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// Get All Categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error("🔥 Error fetching categories:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

module.exports = router;
