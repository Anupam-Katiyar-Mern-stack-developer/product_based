const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getRooms,
  getMessages,
  markRead,
} = require("../controllers/chatController");

router.post("/message", sendMessage);

router.get("/rooms", getRooms);

router.get("/:roomId", getMessages);

router.put("/read/:roomId", markRead);

module.exports = router;