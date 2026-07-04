const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

connectDB();

// ---------------- HTTP SERVER ----------------
const server = http.createServer(app);

// ---------------- SOCKET ----------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

require("./socket/socket")(io);

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ----------------
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api", require("./routes/aiRoute"));
app.use("/api", require("./routes/chartRouter"));

// ---------------- HOME ----------------
app.get("/", (req, res) => {
  res.send("🚀 API Running...");
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server Running : http://localhost:${PORT}`);
});