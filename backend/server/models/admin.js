const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  otpVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model("Admin", adminSchema);
