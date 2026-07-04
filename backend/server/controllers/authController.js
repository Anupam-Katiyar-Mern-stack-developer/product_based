const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    const admin = await Admin.findOne({ name });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      admin: { id: admin._id, name: admin.name },
    });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const sendOtp = async (req, res) => {
  try {
    const admin = await Admin.findOne({ name: process.env.ADMIN_NAME });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.otp = otp;
    admin.otpExpiry = Date.now() + 5 * 60 * 1000;
    admin.otpVerified = false; // 🔑 important: reset on every new OTP request

    await admin.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 465,
      secure: process.env.MAIL_SECURE === "true" ? true : true, // 465 = SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ dev only, remove in production once cert fixed
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Password Reset OTP",
      html: `
        <h2>Techmark Universal</h2>
        <h3>Your OTP is</h3>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const admin = await Admin.findOne({ name: process.env.ADMIN_NAME });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (!admin.otp) {
      return res.status(400).json({ success: false, message: "Please generate OTP first" });
    }

    if (admin.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    if (admin.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    admin.otpVerified = true;
    await admin.save();

    res.json({ success: true, message: "OTP Verified" });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const admin = await Admin.findOne({ name: process.env.ADMIN_NAME });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (!admin.otpVerified) {
      return res.status(400).json({
        success: false,
        message: "OTP Verification Required",
      });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.otp = null;
    admin.otpExpiry = null;
    admin.otpVerified = false;

    await admin.save();

    res.json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { login, sendOtp, verifyOtp, resetPassword };