import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import {
  FiMessageCircle,
  FiSend,
  FiX,
  FiSmile,
  FiPaperclip,
  FiFile,
} from "react-icons/fi";

import { BsCheck2, BsCheck2All } from "react-icons/bs";
import API from "../api/axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api/chat`,
});

const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "😘",
  "😎",
  "🤔",
  "😭",
  "🔥",
  "❤️",
  "🎉",
  "👍",
  "🙏",
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoomId() {
  let room = localStorage.getItem("chatRoom");

  if (!room) {
    room =
      crypto.randomUUID?.() ||
      `room_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    localStorage.setItem("chatRoom", room);
  }

  return room;
}

function MessageTick({ status }) {
  if (status === "read") {
    return <BsCheck2All className="text-sky-500" size={15} />;
  }

  if (status === "delivered") {
    return <BsCheck2All className="text-gray-400" size={15} />;
  }

  return <BsCheck2 className="text-gray-400" size={15} />;
}

export default function ChatWidget() {
  // ==========================
  // Socket
  // ==========================
  const socket = useMemo(() => {
    return io(API_URL, {
      transports: ["websocket"],
    });
  }, []);

  // ==========================
  // States
  // ==========================
  const [open, setOpen] = useState(false);

  const [customerName, setCustomerName] = useState(
    localStorage.getItem("customerName") || "",
  );

  const [nameInput, setNameInput] = useState("");

  const [roomId] = useState(getRoomId());

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [typing, setTyping] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [unreadCount, setUnreadCount] = useState(0);

  // ==========================
  // Refs
  // ==========================
  const bottomRef = useRef(null);

  const fileInputRef = useRef(null);

  const emojiRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const joinedRef = useRef(false);

  // ==========================
  // Join Room
  // ==========================
  useEffect(() => {
    if (!customerName) return;

    if (joinedRef.current) return;

    socket.emit("customer-join", {
      roomId,
      customerName,
    });

    joinedRef.current = true;
  }, [customerName]);

  // ==========================
  // Auto Scroll
  // ==========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================
  // Load History
  // ==========================
  const loadHistory = async () => {
    try {
      const res = await api.get(`/${roomId}`);

      setMessages(res.data.messages || []);
    } catch (err) {
      
    }
  };

  // ==========================
  // Load When Open
  // ==========================
  useEffect(() => {
    if (!open) return;

    if (!customerName) return;

    loadHistory();
  }, [open, customerName]);

  // ==========================
  // Save Name
  // ==========================
  const submitName = () => {
    if (!nameInput.trim()) return;

    localStorage.setItem("customerName", nameInput.trim());

    setCustomerName(nameInput.trim());
  };

  // ==========================
  // Typing
  // ==========================
  const handleTextChange = (value) => {
    setMessage(value);

    socket.emit("typing", {
      roomId,
      sender: "customer",
      typing: true,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        roomId,
        sender: "customer",
        typing: false,
      });
    }, 1200);
  };

  // ==========================
  // Add Emoji
  // ==========================
  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmoji(false);
  };

  // ==========================
  // Select File
  // ==========================
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile({
      file,
      name: file.name,
      type: file.type,
      preview: URL.createObjectURL(file),
    });

    e.target.value = "";
  };

  // ==========================
  // Remove File
  // ==========================
  const removeAttachment = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }

    setSelectedFile(null);
  };

  // ==========================
  // Send Message
  // ==========================
  const sendMessage = () => {
    if (!message.trim() && !selectedFile) return;

    const data = {
      roomId,
      sender: "customer",
      name: customerName,
      text: message.trim(),
      attachment: selectedFile
        ? {
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileUrl: selectedFile.preview,
          }
        : null,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    socket.emit("send-message", data);

    socket.emit("typing", {
      roomId,
      sender: "customer",
      typing: false,
    });

    setMessage("");
    setSelectedFile(null);
    setShowEmoji(false);
  };

  // ==========================
  // Receive Messages
  // ==========================
  useEffect(() => {
    const receiveMessage = (msg) => {
      if (msg.roomId !== roomId) return;

      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);

        if (exists) return prev;

        return [...prev, msg];
      });

      if (!open && msg.sender === "admin") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("receive-message", receiveMessage);

    return () => {
      socket.off("receive-message", receiveMessage);
    };
  }, [roomId, open]);

  // ==========================
  // Admin Typing
  // ==========================
  useEffect(() => {
    const typingHandler = (data) => {
      if (data.roomId !== roomId) return;

      if (data.sender === "admin") {
        setTyping(data.typing);
      }
    };

    socket.on("typing", typingHandler);

    return () => {
      socket.off("typing", typingHandler);
    };
  }, [roomId]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!open) return;

    socket.emit("mark-read", {
      roomId,
    });

    setUnreadCount(0);
  }, [open]);

  useEffect(() => {
    const receiveMessage = (msg) => {
      if (msg.roomId !== roomId) return;

      setMessages((prev) => {
        const exists = prev.find((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });

      // unread logic
      if (!open && msg.sender === "admin") {
        setUnreadCount((prev) => prev + 1);
      }

      // auto scroll if open
      if (open) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("receive-message", receiveMessage);

    return () => socket.off("receive-message", receiveMessage);
  }, [roomId, open]);

  useEffect(() => {
    const handler = (data) => {
      if (data.roomId !== roomId) return;

      if (data.sender === "admin") {
        setTyping(data.typing);

        // auto hide typing after delay safety
        if (data.typing) {
          setTimeout(() => setTyping(false), 2000);
        }
      }
    };

    socket.on("typing", handler);

    return () => socket.off("typing", handler);
  }, [roomId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!customerName) return;
    if (joinedRef.current) return;

    socket.emit("customer-join", {
      roomId,
      customerName,
    });

    joinedRef.current = true;
  }, [customerName, roomId]);

  useEffect(() => {
    socket.on("messages-read", () => {
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          status: "read",
        })),
      );
    });

    return () => socket.off("messages-read");
  }, []);

  const getAIReply = async () => {
    if (!message.trim()) return;

    try {
      const res = await API.post("/ai/reply", {
        message: message,
      });

      const aiMsg = {
        _id: Date.now(),
        sender: "ai",
        text: res.data.reply,
        createdAt: new Date().toISOString(),
        status: "read",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      
    }
  };

  // ==========================
  // JSX START
  // ==========================
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}

      {open && (
        <div
          className="
                fixed
                inset-0

                sm:inset-auto
                sm:bottom-20
                sm:right-0

                w-full
                h-full

                sm:w-[380px]
                sm:h-[650px]

                bg-white

                sm:rounded-2xl

                shadow-2xl

                flex

                flex-col

                overflow-hidden
            "
        >
          {/* Header */}

          <div className="bg-[#111827] text-white px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Customer Support</h2>

              <p className="text-xs text-green-400">
                {typing ? "Typing..." : "Online"}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* ==========================
                Customer Name Screen
            ========================== */}

          {!customerName ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
              <div className="w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-2">Welcome 👋</h2>

                <p className="text-sm text-gray-500 mb-6">
                  Enter your name to start chatting.
                </p>

                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitName()}
                  placeholder="Your Name"
                  className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-yellow-400
                    "
                />

                <button
                  onClick={submitName}
                  className="
                        mt-4
                        w-full
                        py-3
                        rounded-xl
                        bg-yellow-500
                        hover:bg-yellow-600
                        font-semibold
                        transition
                    "
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ==========================
                    Messages
                ========================== */}

              <div
                className="
                    flex-1
                    overflow-y-auto
                    p-4
                    bg-[#F7F5EF]
                    "
              >
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No Messages Yet 👋
                  </div>
                )}

                {messages.map((msg) => {
                  const mine = msg.sender === "customer";

                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-3 ${
                        mine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                            max-w-[85%]
                            sm:max-w-[75%]
                            rounded-2xl
                            px-4
                            py-3
                            shadow-sm
                            ${
                              mine
                                ? "bg-yellow-200 rounded-br-md"
                                : "bg-white rounded-bl-md"
                            }
                            `}
                      >
                        {/* ==========================
                                Image Preview
                            ========================== */}

                        {msg.attachment &&
                          msg.attachment.fileType?.startsWith("image/") && (
                            <img
                              src={msg.attachment.fileUrl}
                              alt={msg.attachment.fileName}
                              className="
                                    w-full
                                    max-h-60
                                    object-cover
                                    rounded-xl
                                    mb-2
                                "
                            />
                          )}

                        {/* ==========================
                                Document Preview
                            ========================== */}

                        {msg.attachment &&
                          !msg.attachment.fileType?.startsWith("image/") && (
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 mb-2">
                              <FiFile size={18} className="text-gray-500" />

                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs truncate">
                                  {msg.attachment.fileName}
                                </p>
                              </div>
                            </div>
                          )}

                        {/* ==========================
                                Message Text
                            ========================== */}

                        {msg.text && (
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                        )}

                        {/* ==========================
                                Time + Tick
                            ========================== */}

                        <div className="flex items-center justify-end gap-1 mt-2">
                          <span className="text-[11px] text-gray-500">
                            {formatTime(msg.createdAt)}
                          </span>

                          {mine && <MessageTick status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={bottomRef} />
              </div>
              {/* ==========================
                    Attachment Preview
                ========================== */}

              {selectedFile && (
                <div className="border-t p-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedFile.type.startsWith("image/") ? (
                      <img
                        src={selectedFile.preview}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <FiFile size={22} />
                    )}

                    <span className="text-xs truncate max-w-[180px]">
                      {selectedFile.name}
                    </span>
                  </div>

                  <button onClick={removeAttachment} className="text-red-500">
                    <FiX size={18} />
                  </button>
                </div>
              )}

              {/* ==========================
                    Input Area
                ========================== */}

              <div className="border-t p-3 bg-white">
                {showEmoji && (
                  <div
                    ref={emojiRef}
                    className="grid grid-cols-5 gap-2 mb-3 max-h-40 overflow-y-auto"
                  >
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-gray-100 rounded p-1"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={() => setShowEmoji(!showEmoji)}>
                    <FiSmile size={22} />
                  </button>

                  <button onClick={() => fileInputRef.current.click()}>
                    <FiPaperclip size={22} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                  />

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="
                        flex-1
                        border
                        rounded-full
                        px-4
                        py-2
                        outline-none
                        "
                  />

                  <button
                    onClick={getAIReply}
                    className="
    h-10
    px-3
    rounded-full
    bg-blue-500
    text-white
    text-xs
    flex
    items-center
    gap-1
  "
                  >
                    🤖 AI
                  </button>

                  <button
                    onClick={sendMessage}
                    className="
                        h-10
                        w-10
                        rounded-full
                        bg-yellow-500
                        flex
                        items-center
                        justify-center
                        "
                  >
                    <FiSend size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}

      <button
        onClick={() => {
          setOpen((prev) => !prev);

          if (!open) {
            setUnreadCount(0);
          }
        }}
        className="
            h-14
            w-14
            rounded-full
            bg-yellow-500
            shadow-xl
            flex
            items-center
            justify-center
            relative
            "
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}

        {unreadCount > 0 && !open && (
          <span
            className="
                absolute
                -top-1
                -right-1
                bg-red-500
                text-white
                text-[10px]
                min-w-[18px]
                h-[18px]
                rounded-full
                flex
                items-center
                justify-center
                "
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
