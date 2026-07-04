const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    specification: {
      type: String,
      default: "",
    },

    // Main Image
    image: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    // Gallery Images
    images: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);