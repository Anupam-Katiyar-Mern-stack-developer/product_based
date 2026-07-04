const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    specification: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    imageProvider: {
      type: String,
      default: "cloudinary",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Category", CategorySchema);
