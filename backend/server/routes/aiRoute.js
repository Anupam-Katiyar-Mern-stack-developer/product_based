const express=require("express");
const router = express.Router();
const {aiReply} =require("../controllers/openAiController");

router.post("/ai/reply",aiReply);

module.exports= router;