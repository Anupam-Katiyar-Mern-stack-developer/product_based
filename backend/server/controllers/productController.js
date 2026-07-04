const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");


// ===============================
// ADD PRODUCT
// ===============================
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      description,
      specification,
    } = req.body;

    if (!req.files?.image) {
      return res.status(400).json({
        success: false,
        message: "Main Image is required",
      });
    }

    // Main Image
    const mainImage = req.files.image[0];

    // Gallery Images
    let galleryImages = [];

    if (req.files.images) {
      galleryImages = req.files.images.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const product = await Product.create({
      productName,
      category,
      description,
      specification,

      image: mainImage.path,
      imagePublicId: mainImage.filename,

      images: galleryImages,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
 

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL PRODUCTS
// ===============================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// SINGLE PRODUCT
// ===============================
const singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// ===============================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    product.productName =
      req.body.productName || product.productName;

    product.category =
      req.body.category || product.category;

    product.description =
      req.body.description || product.description;

    product.specification =
      req.body.specification || product.specification;

    // ===============================
    // Update Main Image
    // ===============================
    if (req.files?.image) {

      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      product.image = req.files.image[0].path;
      product.imagePublicId = req.files.image[0].filename;
    }

    // ===============================
    // Update Gallery Images
    // ===============================
    if (req.files?.images) {

      // Delete old gallery images
      if (product.images.length > 0) {

        for (const img of product.images) {

          if (img.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
          }

        }

      }

      // Save New Gallery Images
      product.images = req.files.images.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {


    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===============================
// DELETE PRODUCT
// ===============================
const deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });

    }

    // Delete Main Image
    if (product.imagePublicId) {

      await cloudinary.uploader.destroy(product.imagePublicId);

    }

    // Delete Gallery Images
    if (product.images.length > 0) {

      for (const img of product.images) {

        if (img.publicId) {

          await cloudinary.uploader.destroy(img.publicId);

        }

      }

    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {

    

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===============================
// PRODUCTS BY CATEGORY
// ===============================
const getProductsByCategory = async (req, res) => {

  try {

    const products = await Product.find({
      category: req.params.categoryId,
    })
      .populate("category")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

   

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  addProduct,
  getProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};