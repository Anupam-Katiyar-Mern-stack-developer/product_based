const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  addProduct,
  getProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/productController");

// ==========================
// Add Product
// ==========================
router.post(
  "/add",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  addProduct
);

// ==========================
// Get All Products
// ==========================
router.get("/", getProducts);

// ==========================
// Get Products By Category
// ==========================
router.get("/category/:categoryId", getProductsByCategory);

// ==========================
// Get Single Product
// ==========================
router.get("/:id", singleProduct);

// ==========================
// Update Product
// ==========================
router.put(
  "/update/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateProduct
);

// ==========================
// Delete Product
// ==========================
router.delete("/delete/:id", deleteProduct);

module.exports = router;