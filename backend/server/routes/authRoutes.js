const express = require("express");
const router = express.Router();

const { login,sendOtp,verifyOtp,resetPassword } = require("../controllers/authController");

router.post("/login", login);

router.post("/forgot-password", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/reset-password", resetPassword);

module.exports = router;