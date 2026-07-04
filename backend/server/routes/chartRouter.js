const express=require("express");
const router = express.Router();
const {getMessageStats} =require("../controllers/chatAnalytics");

router.get("/analytics/messages", getMessageStats);

module.exports= router;