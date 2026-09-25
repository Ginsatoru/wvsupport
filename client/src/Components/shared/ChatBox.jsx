import React, { useState, useRef, useEffect } from "react";
import {
  RiSendPlaneFill,
  RiCloseLine,
  RiMessage2Line,
  RiAttachment2,
  RiFileTextLine,
} from "react-icons/ri";
import logo from "../Images/logo.png";
import io from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const socket = io(API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const ACCEPTED_FILES = "image/jpeg,image/png,image/gif,image/webp,application/pdf";
const MAX_FILES = 5;

const GREETING = "Thank you for reaching out to us. Our team will respond to your message shortly.";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return (isNaN(date.getTime()) ? new Date() : date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSessionId = () => {
  let session = localStorage.getItem("chatSessionId");
  if (!session) {
    session = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem("chatSessionId", session);
  }
  return session;
};

// Images show as thumbnails, PDFs as a file link — both open in a new tab
const Attachments = ({ items }) => (
  <div className="cb-attachments">
    {items.map((a, i) => {
      const href = `${API_URL}${a.url}`;
      return a.type?.startsWith("image/") ? (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer">
          <img src={href} alt={a.name} className="cb-att-img" />
        </a>
      ) : (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="cb-att-file">
          <RiFileTextLine size={14} />
          <span>{a.name}</span>
        </a>
      );
    })}
  </div>
);

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [files, setFiles] = useState([]);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  useEffect(() => {
    const session = getSessionId();
    setSessionId(session);

    // Join own room now and again after any reconnect
    const joinSession = () => socket.emit("join_session", session);
    joinSession();

    fetch(`${API_URL}/api/messages/${session}`)
      .then((res) => (res.ok ? res.json() : { messages: [] }))
      .then((data) =>
        setMessages(
          (data.messages || []).map((m) => ({
            content: m.content,
            attachments: m.attachments || [],
            isAdmin: m.isAdmin,
            time: formatTimestamp(m.timestamp),
          }))
        )
      )
      .catch((err) => console.error("Failed to load messages:", err));

    const handleAdminReply = (reply) =>
      addMessage({
        content: reply.content,
        attachments: reply.attachments || [],
        isAdmin: true,
        time: formatTimestamp(reply.timestamp),
      });

    socket.on("connect", joinSession);
    socket.on("admin_reply", handleAdminReply);

    return () => {
      socket.off("connect", joinSession);
      socket.off("admin_reply", handleAdminReply);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
    e.target.value = "";
  };

  const removeFile = (index) => setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = message.trim();
    if ((!content && !files.length) || status === "sending") return;

    const isFirstMessage = !messages.some((m) => !m.isAdmin);
    setStatus("sending");
    setError("");

    try {
      // Multipart when there are files, plain JSON otherwise
      let request;
      if (files.length) {
        const formData = new FormData();
        formData.append("sessionId", sessionId);
        formData.append("content", content);
        files.forEach((file) => formData.append("attachments", file));
        request = { method: "POST", body: formData };
      } else {
        request = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, content }),
        };
      }

      const response = await fetch(`${API_URL}/api/messages`, request);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Failed to send message");

      addMessage({
        content,
        attachments: data.message?.attachments || [],
        isAdmin: false,
        time: formatTimestamp(new Date()),
      });
      setMessage("");
      setFiles([]);
      setStatus("idle");

      if (isFirstMessage) {
        setTimeout(
          () => addMessage({ content: GREETING, isAdmin: true, time: formatTimestamp(new Date()) }),
          1500
        );
      }
    } catch (err) {
      setStatus("error");
      setError(err.message);
      setTimeout(() => {
        setStatus("idle");
        setError("");
      }, 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

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
          transition: transform 0.2s ease, background 0.2s ease, bottom 0.2s ease;
        }
        .cb-toggle:hover { background: #0d7aaa; transform: scale(1.06); }

        /* Below the lg breakpoint, the site's mobile bottom nav bar occupies
           roughly the bottom ~90px of the viewport, so lift the toggle above it. */
        @media (max-width: 1024px) {
          .cb-toggle { bottom: 92px; right: 16px; }
        }

        /* ── Panel ── */
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
          transition: bottom 0.2s ease;
        }

        @media (max-width: 1024px) {
          .cb-panel { bottom: 154px; }
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
          .cb-toggle { bottom: 92px; right: 16px; }
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

        /* ── Header ── */
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

        /* ── Messages area ── */
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

        /* ── Empty state intro bubble ── */
        .cb-empty {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          animation: cb-msg-in 0.3s ease forwards;
        }

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
          white-space: pre-wrap;
        }
        .cb-bubble.user {
          background: #0f8abe;
          color: #ffffff;
          border-radius: 16px 16px 4px 16px;
        }
        .cb-bubble.admin {
          background: #f0f0f0;
          color: #1f2937;
          border-radius: 4px 16px 16px 16px;
        }
        /* ── Attachments ── */
        .cb-attachments { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; max-width: 230px; }
        .cb-bubble-col.user .cb-attachments { align-items: flex-end; }
        .cb-att-img {
          display: block;
          max-width: 200px;
          max-height: 160px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          object-fit: cover;
        }
        .cb-att-file {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #f0f0f0;
          border-radius: 10px;
          font-size: 12px;
          color: #0f8abe;
          text-decoration: none;
          max-width: 200px;
        }
        .cb-att-file span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* ── Picked files (before sending) ── */
        .cb-files { display: flex; flex-wrap: wrap; gap: 6px; }
        .cb-file-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          max-width: 180px;
          padding: 3px 6px 3px 10px;
          background: #f0f7fb;
          border: 1px solid #cfe6f2;
          border-radius: 999px;
          font-size: 11.5px;
          color: #0f8abe;
        }
        .cb-file-chip span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cb-file-chip button {
          display: flex;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
        }

        .cb-attach-btn {
          position: absolute;
          left: 7px;
          bottom: 6px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: transparent;
          color: #9ca3af;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
        }
        .cb-attach-btn:hover { color: #0f8abe; background: #eef6fa; }

        .cb-time {
          font-size: 10px;
          color: #b0b7c3;
          margin-top: 3px;
          padding: 0 2px;
        }

        /* ── Form / footer ── */
        .cb-form {
          padding: 10px 12px 12px;
          background: #ffffff;
          border-top: 1px solid #ebebeb;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex-shrink: 0;
        }

        /* ── Message input — pill shape ── */
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
          padding: 8px 44px 8px 40px;
          font-size: 13px;
          color: #111827;
          outline: none;
          resize: none;
          min-height: 40px;
          max-height: 100px;
          line-height: 21px; /* 8 + 21 + 8 + 3 (border) = 40px → text sits dead centre */
          transition: border-color 0.15s, background 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .cb-textarea::placeholder { color: #b0b7c3; font-size: 13px; }
        .cb-textarea:focus { border-color: #0f8abe; background: #ffffff; }

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
        <button
          className={`cb-toggle${isOpen ? " is-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open chat"
        >
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
                  <div className="cb-header-status">We typically reply in a few minutes</div>
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
                  <div className="cb-empty-bubble">Got any questions? We are here to help.</div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const side = msg.isAdmin ? "admin" : "user";
                  return (
                    <div key={i} className={`cb-bubble-wrap ${side}`}>
                      {msg.isAdmin && (
                        <div className="cb-support-avatar">
                          <img src={logo} alt="Support" />
                        </div>
                      )}
                      <div className={`cb-bubble-col ${side}`}>
                        {msg.content && <div className={`cb-bubble ${side}`}>{msg.content}</div>}
                        {msg.attachments?.length > 0 && <Attachments items={msg.attachments} />}
                        <div className="cb-time">{msg.time}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form */}
            <form className="cb-form" onSubmit={handleSubmit}>
              {files.length > 0 && (
                <div className="cb-files">
                  {files.map((file, i) => (
                    <div key={i} className="cb-file-chip">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => removeFile(i)} aria-label="Remove file">
                        <RiCloseLine size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="cb-textarea-wrap">
                <button
                  type="button"
                  className="cb-attach-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= MAX_FILES}
                  aria-label="Attach files"
                >
                  <RiAttachment2 size={15} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILES}
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
                <textarea
                  className="cb-textarea"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  type="submit"
                  className="cb-send-btn"
                  disabled={status === "sending" || (!message.trim() && !files.length)}
                  aria-label="Send message"
                >
                  {status === "sending" ? <div className="cb-spinner" /> : <RiSendPlaneFill size={12} />}
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