const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

// ===============================
// SEND MESSAGE
// ===============================
exports.sendMessage = async (req, res) => {
  try {
    const { roomId, customerName, sender, text, attachment } = req.body;

    if (!roomId || !sender) {
      return res.status(400).json({
        success: false,
        message: "roomId and sender are required",
      });
    }

    let room = await ChatRoom.findOne({ roomId });

    if (!room) {
      room = await ChatRoom.create({
        roomId,
        customerName: customerName || "Guest",
      });
    }

    const message = await Message.create({
      roomId,
      sender,
      text,
      attachment,
      status: "sent",
    });

    room.lastMessage = text || "📎 Attachment";
    room.lastMessageTime = new Date();

    if (sender === "customer") {
      room.unread += 1;
    }

    await room.save();

    res.json({
      success: true,
      message,
    });
  } catch (err) {
   
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET ALL ROOMS
// ===============================
exports.getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find().sort({
      lastMessageTime: -1,
    });

    res.json({
      success: true,
      rooms,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET CHAT HISTORY
// ===============================
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({
      createdAt: 1,
    });

    res.json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// MARK AS READ
// ===============================
exports.markRead = async (req, res) => {
  try {
    await ChatRoom.findOneAndUpdate(
      {
        roomId: req.params.roomId,
      },
      {
        unread: 0,
      }
    );

    await Message.updateMany(
      {
        roomId: req.params.roomId,
      },
      {
        status: "read",
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};