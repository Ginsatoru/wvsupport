import React, { useState, useRef, useEffect } from "react";
import { RiChat3Fill } from "react-icons/ri";
import logo from "./Images/logo.png";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);

  const messagesEndRef = useRef(null);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Initialize chat session
  useEffect(() => {
    // Get or create session ID
    let session = localStorage.getItem("chatSessionId");
    if (!session) {
      session = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatSessionId", session);
    }
    setSessionId(session);

    // Join session room
    socket.emit("join_session", session);

    // Load previous messages from server
    const loadMessages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${session}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    loadMessages();

    // Socket event handlers
    const handleConnect = () => {
      setIsConnected(true);
      // Rejoin session if reconnected
      if (sessionId) socket.emit("join_session", sessionId);
    };

    const handleAdminReply = (reply) => {
      addMessageToState({
        name: "Admin",
        content: reply.content,
        time: formatTimestamp(reply.timestamp || new Date()),
        isAdmin: true,
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("admin_reply", handleAdminReply);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect");
      socket.off("admin_reply", handleAdminReply);
    };
  }, []);

  const addMessageToState = (msg) => {
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");

    try {
      const now = new Date();
      const time = formatTimestamp(now);

      const newMessage = {
        sessionId,
        name: name.trim() || email.trim() || "Guest",
        email: email.trim(),
        content: message.trim(),
        timestamp: now,
        time,
        isAdmin: false,
      };

      // Emit to server
      socket.emit("client_message", newMessage);
      addMessageToState(newMessage);

      // Auto-reply from admin only for first message
      if (!hasSentFirstMessage) {
        setTimeout(() => {
          addMessageToState({
            name: "Admin",
            content: "Thank you for reaching out to us. Our team will respond to your message shortly.",
            time: formatTimestamp(new Date()),
            isAdmin: true,
          });
        }, 1500);
        setHasSentFirstMessage(true);
      }

      // Save to database
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to send message");
      }

      setMessage("");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chat Toggle Button - Responsive positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 bg-[#0f8abe] rounded-full p-3 sm:p-4 text-white cursor-pointer z-[1002] flex items-center justify-center shadow-lg hover:bg-[#0d7ba8] transition-colors"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <RiChat3Fill size={20} className="sm:w-6 sm:h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-[80px] sm:right-4 z-[1001] animate-[fadeIn_0.3s_ease-in-out]">
          {/* Mobile overlay */}
          <div className="sm:hidden absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          {/* Chat container - Full screen on mobile, floating on desktop */}
          <div 
            className="absolute inset-0 sm:relative sm:inset-auto w-full h-full sm:w-[350px] sm:h-[450px] md:w-[380px] md:h-[600px] bg-white sm:rounded-xl shadow-xl flex flex-col overflow-hidden font-normal"
            style={{ fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            
            {/* Header */}
            <div 
              className="flex justify-between items-center p-3 bg-[#0f8abe] text-white"
              style={{ fontFamily: 'inherit' }}
            >
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-5" />
                <span className="text-lg font-semibold" style={{ fontFamily: 'inherit' }}>Chat with us</span>
              </div>
              {/* Close button for mobile */}
              <button 
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-white hover:text-gray-200 text-xl font-bold p-1"
                style={{ fontFamily: 'inherit' }}
              >
                ×
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-3 overflow-y-auto bg-gray-100" style={{ fontFamily: 'inherit' }}>
              {messages.length === 0 ? (
                <div 
                  className="text-center text-gray-600 py-5 italic text-sm px-4"
                  style={{ fontFamily: 'inherit' }}
                >
                  Got any questions? We are here to help.
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`my-2 p-3 rounded-xl animate-[fadeInMessage_0.4s_ease_forwards] max-w-[85%] ${
                      msg.isAdmin
                        ? "mr-4 sm:mr-16 bg-white text-gray-800 self-start"
                        : "ml-4 sm:ml-16 bg-[#0f8abe] text-white self-end"
                    }`}
                    style={{ fontFamily: 'inherit' }}
                  >
                    <div className="mb-1" style={{ fontFamily: 'inherit' }}>
                      <strong 
                        className={`text-xs font-bold ${msg.isAdmin ? "text-gray-800" : "text-white"}`}
                        style={{ fontFamily: 'inherit' }}
                      >
                        {msg.name}:
                      </strong>
                    </div>
                    <div 
                      className={`text-sm leading-relaxed ${msg.isAdmin ? "text-gray-700" : "text-white"}`}
                      style={{ fontFamily: 'inherit' }}
                    >
                      {msg.content}
                    </div>
                    <div 
                      className={`text-xs text-right mt-1 ${
                        msg.isAdmin ? "text-gray-500" : "text-white/80"
                      }`}
                      style={{ fontFamily: 'inherit' }}
                    >
                      {msg.time}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form 
              onSubmit={handleSubmit} 
              className="p-3 bg-white border-t border-gray-200 space-y-2"
              style={{ fontFamily: 'inherit' }}
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 h-8 border border-gray-300 rounded text-sm focus:border-[#0f8abe] focus:outline-none"
                style={{ fontFamily: 'inherit' }}
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 h-8 border border-gray-300 rounded text-sm focus:border-[#0f8abe] focus:outline-none"
                style={{ fontFamily: 'inherit' }}
              />
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#0f8abe] focus:outline-none min-h-[60px] max-h-[100px] resize-none"
                style={{ fontFamily: 'inherit' }}
              />
              <button
                type="submit"
                disabled={status === "sending" || message.trim() === ""}
                className={`w-full py-2 text-white rounded flex items-center justify-center text-sm ${
                  status === "sending" || message.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0f8abe] hover:bg-[#0d7ba8] cursor-pointer"
                }`}
                style={{ fontFamily: 'inherit' }}
              >
                {status === "sending" ? (
                  <>
                    Sending
                    <div className="ml-2 border-2 border-white border-t-[#0d7ba8] rounded-full w-3.5 h-3.5 animate-spin"></div>
                  </>
                ) : (
                  "Send"
                )}
              </button>
              {status === "error" && (
                <div 
                  className="mt-2 px-3 py-2 bg-red-100 text-red-800 text-sm text-center rounded"
                  style={{ fontFamily: 'inherit' }}
                >
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeInMessage {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ChatBox;
