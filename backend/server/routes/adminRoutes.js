const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    admin: req.admin,
  });
});

module.exports = router;
