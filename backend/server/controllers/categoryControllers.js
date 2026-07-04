const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ====================
// Add Category
// ====================

const AddCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    const image = req.file ? req.file.path : "";

    const category = await Category.create({
      categoryName,
      description,
      image,
    });

    res.status(201).json(category);
  } catch (err) {
   
    res.status(500).json({ message: err.message });
  }
};
// ====================
// Get All Categories
// ====================
const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ====================
// Get Single Category
// ====================
const getSingleCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ STEP: VALIDATION (IMPORTANT)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ category });
  } catch (err) {
    
    res.status(500).json({ message: err.message });
  }
};

// ====================
// Update Category
// ====================
 const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    category.categoryName = req.body.categoryName || category.categoryName;
    category.description = req.body.description || category.description;

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    res.json({ message: "Updated successfully", category });
  } catch (err) {
 
    res.status(500).json({ message: err.message });
  }
};

// ====================
// Delete Category
// ====================
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category Not Found",
      });
    }

    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AddCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
