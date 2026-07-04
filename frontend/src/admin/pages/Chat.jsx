import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { FiSend, FiSearch, FiPaperclip, FiSmile } from "react-icons/fi";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import API from "../../api/axios";

const socket = io("http://localhost:5000", {
  query: { role: "admin" },
});

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Tick({ status }) {
  if (status === "read")
    return <BsCheck2All className="text-blue-500 text-xs" />;
  if (status === "delivered")
    return <BsCheck2All className="text-gray-400 text-xs" />;
  return <BsCheck2 className="text-gray-400 text-xs" />;
}

export default function Chat() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState({});
  const [mobileView, setMobileView] = useState("list");

  const bottomRef = useRef(null);

  // INIT
  useEffect(() => {
    socket.emit("admin-join");
  }, []);

  // ROOMS
  useEffect(() => {
    (async () => {
      const res = await API.get("/chat/rooms");
      setRooms(res.data.rooms || []);
    })();
  }, []);

  // SELECT ROOM
  useEffect(() => {
    if (!selectedRoom) return;

    socket.emit("join-room", selectedRoom);
     socket.emit("room-read", { roomId: selectedRoom }); 

    (async () => {
      const res = await API.get(`/chat/${selectedRoom}`);
      setMessages(res.data.messages || []);
    })();
  }, [selectedRoom]);

  // SOCKET
  useEffect(() => {
    const onMessage = (msg) => {
      if (msg.roomId !== selectedRoom) return;

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receive-message", onMessage);

    socket.on("typing", ({ roomId, isTyping }) => {
      setTyping((p) => ({ ...p, [roomId]: isTyping }));
    });

    return () => {
      socket.off("receive-message", onMessage);
      socket.off("typing");
    };
  }, [selectedRoom]);

  // SEND
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", {
      roomId: selectedRoom,
      sender: "admin",
      text,
    });

    setText("");
  };

  // FILTER
  const filteredRooms = useMemo(() => {
    if (!search) return rooms;
    return rooms.filter((r) =>
      r.customerName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [rooms, search]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-[600px] flex bg-gradient-to-br from-gray-100 to-gray-200">
      {/* ================= LEFT PANEL ================= */}
      <div
        className={`w-full md:w-80 bg-white border-r flex flex-col
        ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}
      >
        {/* HEADER */}
        <div className="p-4 bg-green-600 text-white font-semibold text-lg">
          Live Chats
        </div>

        {/* SEARCH */}
        <div className="p-2 border-b">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
            <FiSearch className="text-gray-500" />
            <input
              className="w-full ml-2 bg-transparent outline-none text-sm"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ROOMS */}
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((r) => (
            <div
              key={r.roomId}
              onClick={() => {
                setSelectedRoom(r.roomId);
                setMobileView("chat");

                setRooms((prev) =>
                  prev.map((room) =>
                    room.roomId === r.roomId ? { ...room, unread: 0 } : room,
                  ),
                );
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition ${
                selectedRoom === r.roomId ? "bg-gray-200" : ""
              }`}
            >
              {/* avatar */}
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                {r.customerName?.charAt(0)}
              </div>

              {/* info */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">{r.customerName}</p>
                  {r.unread > 0 && (
                    <span className="bg-green-500 text-white text-xs px-2 rounded-full">
                      {r.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {r.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CHAT PANEL ================= */}
      <div
        className={`flex-1 flex flex-col
        ${mobileView === "list" ? "hidden md:flex" : "flex"}`}
      >
        {/* HEADER */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            className="md:hidden text-xl"
            onClick={() => setMobileView("list")}
          >
            ←
          </button>

          <div>
            <p className="font-semibold text-sm">
              {rooms.find((r) => r.roomId === selectedRoom)?.customerName ||
                "Select Chat"}
            </p>
            <p className="text-xs text-green-500">
              {typing[selectedRoom] ? "typing..." : "online"}
            </p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e5ddd5]">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`flex ${
                m.sender === "admin" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl shadow text-sm ${
                  m.sender === "admin"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {m.text}

                <div className="flex justify-end gap-1 text-[10px] mt-1 opacity-70">
                  {formatTime(m.createdAt)}
                  {m.sender === "admin" && <Tick status={m.status} />}
                </div>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="bg-white border-t p-2 flex items-center gap-2">
          <button className="text-xl text-gray-500">
            <FiPaperclip />
          </button>

          <button className="text-xl text-gray-500">
            <FiSmile />
          </button>

          <input
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-green-500 text-white p-3 rounded-full"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}
