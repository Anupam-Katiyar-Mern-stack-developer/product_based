const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

// =====================================
// Store Online Customers
// key   = roomId
// value = socket.id
// =====================================

const onlineUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    

    // =====================================
    // CUSTOMER JOIN
    // =====================================

    socket.on("customer-join", async ({ roomId, customerName }) => {
      try {
        socket.join(roomId);

        onlineUsers.set(roomId, socket.id);

        let room = await ChatRoom.findOne({
          roomId,
        });

        if (!room) {
          room = await ChatRoom.create({
            roomId,

            customerName,

            online: true,

            unread: 0,
          });
        } else {
          room.online = true;

          if (customerName && customerName.trim()) {
            room.customerName = customerName;
          }

          await room.save();
        }

        io.emit("online-users", [...onlineUsers.keys()]);

        
      } catch (err) {
        
      }
    });

    // =====================================
    // ADMIN CONNECT
    // =====================================
    socket.on("admin-join", () => {
      socket.join("admins");
     
    });

    // =====================================
    // ADMIN OPEN CUSTOMER CHAT
    // =====================================

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      
    });

    // =====================================
    // SEND MESSAGE
    // =====================================

    socket.on("send-message", async (data) => {
      try {
        const {
          roomId,

          sender,

          text,

          attachment,
        } = data;

        const isCustomerOnline = onlineUsers.has(roomId);

        const message = await Message.create({
          roomId,

          sender,

          text,

          attachment,

          status:
            sender === "customer"
              ? "sent"
              : isCustomerOnline
                ? "delivered"
                : "sent",
        });

        const updateData = {
          lastMessage: text || "📎 Attachment",

          lastMessageTime: new Date(),
        };

        if (sender === "customer") {
          updateData.$inc = {
            unread: 1,
          };
        }

        await ChatRoom.findOneAndUpdate(
          {
            roomId,
          },

          updateData,
        );

        // Send only once
        io.to(roomId).emit("receive-message", message);

        // Notify all admins so chat list updates instantly
        io.to("admins").emit("room-updated", {
          roomId,
          lastMessage: text || "📎 Attachment",
          lastMessageTime: message.createdAt,
        });
      } catch (err) {
        
      }
    });

    // =====================================
    // CUSTOMER / ADMIN TYPING
    // =====================================

    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("typing", data);
    });

    // =====================================
    // MARK MESSAGES AS READ
    // =====================================

    socket.on("mark-read", async ({ roomId }) => {
      try {
        await ChatRoom.findOneAndUpdate({ roomId }, { unread: 0 });

        await Message.updateMany(
          {
            roomId,
            sender: "customer",
            status: {
              $ne: "read",
            },
          },
          {
            status: "read",
          },
        );

        io.to(roomId).emit("messages-read");

        io.to("admins").emit("messages-read", {
          roomId,
        });
      } catch (err) {
        
      }
    });
    socket.on("room-read", async ({ roomId }) => {
      await ChatRoom.updateOne({ roomId }, { $set: { unread: 0 } });

      io.emit("room-updated"); // refresh sidebar
    });
    // =====================================
    // CUSTOMER DISCONNECT
    // =====================================

    socket.on("disconnect", async () => {
      try {
        for (const [roomId, socketId] of onlineUsers.entries()) {
          if (socketId !== socket.id) {
            continue;
          }

          onlineUsers.delete(roomId);

          await ChatRoom.findOneAndUpdate(
            { roomId },
            {
              online: false,
            },
          );

          io.emit("online-users", [...onlineUsers.keys()]);

          

          break;
        }

       
      } catch (err) {
       
      }
    });
  });
};
