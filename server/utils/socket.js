const socketio = require("socket.io");
const jwt = require("jsonwebtoken");

const ADMIN_ROOM = "admins";

// Socket.IO is push-only: all saving happens in the REST routes,
// which then use sendToSession / broadcastToAdmins to notify clients.
class SocketServer {
  constructor(server, allowedOrigins) {
    this.io = socketio(server, {
      cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true },
    });
  }

  initialize() {
    this.io.on("connection", (socket) => {
      // Visitor joins their own room to receive admin replies
      socket.on("join_session", (sessionId) => {
        if (typeof sessionId === "string" && sessionId) socket.join(sessionId);
      });

      // Admin joins the admin room after a token check
      socket.on("admin_connect", (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.isAdmin) socket.join(ADMIN_ROOM);
        } catch {
          socket.emit("admin_auth_error");
        }
      });
    });
  }

  sendToSession(sessionId, event, data) {
    this.io.to(sessionId).emit(event, data);
  }

  broadcastToAdmins(event, data) {
    this.io.to(ADMIN_ROOM).emit(event, data);
  }
}

module.exports = SocketServer;