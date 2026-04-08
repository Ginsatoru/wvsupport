import React, { useState, useRef, useEffect } from "react";
import { RiSendPlaneFill, RiCloseLine, RiMessage2Line } from "react-icons/ri";
import logo from "../Images/logo.png";
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

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  useEffect(() => {
    let session = localStorage.getItem("chatSessionId");
    if (!session) {
      session = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatSessionId", session);
    }
    setSessionId(session);
    socket.emit("join_session", session);

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

    const handleConnect = () => {
      setIsConnected(true);
      if (sessionId) socket.emit("join_session", sessionId);
    };

    const handleAdminReply = (reply) => {
      addMessageToState({
        name: "Support",
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

      socket.emit("client_message", newMessage);
      addMessageToState(newMessage);

      if (!hasSentFirstMessage) {
        setTimeout(() => {
          addMessageToState({
            name: "Support",
            content: "Thank you for reaching out to us. Our team will respond to your message shortly.",
            time: formatTimestamp(new Date()),
            isAdmin: true,
          });
        }, 1500);
        setHasSentFirstMessage(true);
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error((await response.text()) || "Failed to send message");

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && status !== "sending") handleSubmit(e);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        .cb-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

        /* ── Toggle button ── */
        .cb-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #0f8abe;
          border: none;
          color: #ffffff;
          cursor: pointer;
          z-index: 1002;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .cb-toggle:hover { background: #0d7aaa; transform: scale(1.06); }

        /* ── Panel — sized to match screenshot ── */
        .cb-panel {
          position: fixed;
          bottom: 82px;
          right: 20px;
          width: 420px;
          height: 660px;
          background: #ffffff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.18),
            0 2px 10px rgba(0, 0, 0, 0.10);
          animation: cb-slide-up 0.24s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
        }

        @media (max-width: 480px) {
          .cb-panel {
            inset: 0;
            width: 100%;
            height: 100%;
            border-radius: 0;
            bottom: auto;
            right: auto;
            animation: cb-fade-in 0.2s ease forwards;
          }
          .cb-toggle { bottom: 16px; right: 16px; }
          .cb-toggle.is-open { display: none; }
        }

        @keyframes cb-slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cb-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Header — matches screenshot blue ── */
        .cb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: #0f8abe;
          flex-shrink: 0;
          min-height: 64px;
        }
        .cb-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Blue circle avatar matching screenshot */
        .cb-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #0f8abe;
          border: 2px solid rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .cb-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1);
          padding: 6px;
        }

        .cb-header-title {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .cb-header-status {
          font-size: 11px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
          margin-top: 2px;
          line-height: 1.3;
        }

        .cb-close {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .cb-close:hover { background: rgba(255,255,255,0.2); }

        /* ── Messages area — pure white bg matching screenshot ── */
        .cb-messages {
          flex: 1;
          overflow-y: auto;
          padding: 18px 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #ffffff;
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .cb-messages::-webkit-scrollbar { width: 4px; }
        .cb-messages::-webkit-scrollbar-track { background: transparent; }
        .cb-messages::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }

        /* ── Empty state intro bubble — matches screenshot layout ── */
        .cb-empty {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          animation: cb-msg-in 0.3s ease forwards;
        }

        /* Small blue circle avatar next to intro bubble */
        .cb-support-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0f8abe;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .cb-support-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: brightness(0) invert(1);
          padding: 5px;
        }

        /* Intro bubble — light grey/white with rounded corners matching screenshot */
        .cb-empty-bubble {
          background: #f0f0f0;
          border-radius: 4px 16px 16px 16px;
          padding: 10px 14px;
          font-size: 13px;
          color: #1f2937;
          line-height: 1.5;
          max-width: 240px;
        }

        /* ── Message bubbles ── */
        .cb-bubble-wrap {
          display: flex;
          animation: cb-msg-in 0.28s ease forwards;
        }
        .cb-bubble-wrap.user { justify-content: flex-end; }
        .cb-bubble-wrap.admin { justify-content: flex-start; align-items: flex-start; gap: 8px; }

        @keyframes cb-msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cb-bubble-col {
          display: flex;
          flex-direction: column;
        }
        .cb-bubble-col.user { align-items: flex-end; }
        .cb-bubble-col.admin { align-items: flex-start; }

        .cb-bubble {
          max-width: 230px;
          padding: 9px 13px;
          font-size: 13px;
          line-height: 1.5;
          font-weight: 400;
          word-break: break-word;
        }
        /* User bubble — same blue as header */
        .cb-bubble.user {
          background: #0f8abe;
          color: #ffffff;
          border-radius: 16px 16px 4px 16px;
        }
        /* Admin bubble — light grey matching screenshot */
        .cb-bubble.admin {
          background: #f0f0f0;
          color: #1f2937;
          border-radius: 4px 16px 16px 16px;
        }
        .cb-time {
          font-size: 10px;
          color: #b0b7c3;
          margin-top: 3px;
          padding: 0 2px;
        }

        /* ── Form / footer — white, thin top border ── */
        .cb-form {
          padding: 8px 12px 12px;
          background: #ffffff;
          border-top: 1px solid #ebebeb;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
        }

        /* Name + Email row */
        .cb-inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          width: 100%;
        }

        .cb-input {
          width: 100%;
          background: #f7f7f7;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          padding: 0 10px;
          font-size: 12.5px;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Inter', sans-serif;
          height: 34px;
          display: block;
        }
        .cb-input::placeholder { color: #b0b7c3; font-size: 12px; }
        .cb-input:focus { border-color: #0f8abe; background: #ffffff; }

        /* ── Message input — pill shape matching screenshot ── */
        .cb-textarea-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .cb-textarea {
          width: 100%;
          background: #f7f7f7;
          border: 1.5px solid #e8e8e8;
          border-radius: 22px;
          padding: 9px 44px 9px 16px;
          font-size: 13px;
          color: #111827;
          outline: none;
          resize: none;
          min-height: 40px;
          max-height: 100px;
          line-height: 1.45;
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .cb-textarea::placeholder { color: #b0b7c3; font-size: 12.5px; }
        .cb-textarea:focus { border-color: #0f8abe; background: #ffffff; }

        /* Send button inside pill */
        .cb-send-btn {
          position: absolute;
          right: 7px;
          bottom: 6px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #0f8abe;
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .cb-send-btn:hover:not(:disabled) { background: #0d7aaa; transform: scale(1.08); }
        .cb-send-btn:disabled { background: #d1d5db; color: #9ca3af; cursor: not-allowed; transform: none; }

        .cb-spinner {
          width: 11px; height: 11px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: cb-spin 0.7s linear infinite;
        }
        @keyframes cb-spin { to { transform: rotate(360deg); } }

        .cb-error {
          font-size: 11px;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 5px 10px;
          text-align: center;
        }
      `}</style>

      <div className="cb-root">
        {/* Toggle */}
        <button className={`cb-toggle${isOpen ? " is-open" : ""}`} onClick={() => setIsOpen(!isOpen)} aria-label="Open chat">
          {isOpen ? <RiCloseLine size={22} /> : <RiMessage2Line size={22} />}
        </button>

        {/* Panel */}
        {isOpen && (
          <div className="cb-panel">

            {/* Header */}
            <div className="cb-header">
              <div className="cb-header-left">
                <div className="cb-avatar">
                  <img src={logo} alt="Logo" />
                </div>
                <div>
                  <div className="cb-header-title">WV Support</div>
                  <div className="cb-header-status">
                    We typically reply in a few minutes
                  </div>
                </div>
              </div>
              <button className="cb-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <RiCloseLine size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="cb-messages">
              {messages.length === 0 ? (
                <div className="cb-empty">
                  <div className="cb-support-avatar">
                    <img src={logo} alt="Support" />
                  </div>
                  <div className="cb-empty-bubble">
                    Got any questions? We are here to help.
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`cb-bubble-wrap ${msg.isAdmin ? "admin" : "user"}`}>
                    {msg.isAdmin && (
                      <div className="cb-support-avatar">
                        <img src={logo} alt="Support" />
                      </div>
                    )}
                    <div className={`cb-bubble-col ${msg.isAdmin ? "admin" : "user"}`}>
                      <div className={`cb-bubble ${msg.isAdmin ? "admin" : "user"}`}>
                        {msg.content}
                      </div>
                      <div className="cb-time">{msg.time}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form */}
            <form className="cb-form" onSubmit={handleSubmit}>
              <div className="cb-inputs-row">
                <input
                  className="cb-input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="cb-input"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="cb-textarea-wrap">
                <textarea
                  className="cb-textarea"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  required
                  rows={1}
                />
                <button
                  type="submit"
                  className="cb-send-btn"
                  disabled={status === "sending" || !message.trim()}
                  aria-label="Send message"
                >
                  {status === "sending" ? (
                    <div className="cb-spinner" />
                  ) : (
                    <RiSendPlaneFill size={12} />
                  )}
                </button>
              </div>

              {status === "error" && <div className="cb-error">{error}</div>}
            </form>

          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;