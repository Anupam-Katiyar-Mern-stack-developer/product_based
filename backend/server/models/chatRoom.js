const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    online: {
      type: Boolean,
      default: false,
    },

    unread: {
      type: Number,
      default: 0,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);