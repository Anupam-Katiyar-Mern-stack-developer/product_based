const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },

    sender: {
      type: String,
      enum: ["customer", "admin"],
      required: true,
    },

    text: {
      type: String,
      default: "",
    },

    attachment: {
      fileName: String,
      fileUrl: String,
      fileType: String,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
