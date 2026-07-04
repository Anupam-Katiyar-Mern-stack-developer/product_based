const express = require("express");
const router = express.Router();



const {
  AddCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");
const upload = require("../config/multerCloudinary");

router.post("/add", upload.single("image"), AddCategory);

router.put("/update/:id", upload.single("image"), updateCategory);

router.get("/", getAllCategory);  

router.get("/:id", getSingleCategory);

router.delete("/delete/:id", deleteCategory);;

module.exports = router;