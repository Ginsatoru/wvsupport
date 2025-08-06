const socketio = require('socket.io');
const Message = require('../models/Message'); // Make sure to import your Message model

class SocketServer {
  constructor(server) {
    this.io = socketio(server, {
      cors: {
        origin: "http://wvsupportservices.com",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    this.userRooms = new Map(); // Track user rooms: socket.id -> userId
    this.adminSockets = new Set(); // Track admin sockets
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join user room (for both regular users and admins)
      socket.on('join_session', (sessionId) => {
        socket.join(sessionId);
        this.userRooms.set(socket.id, sessionId);
        console.log(`Client joined session room: ${sessionId}`);
      });

      // Handle admin connection
      socket.on('admin_connect', () => {
        this.adminSockets.add(socket.id);
        console.log('Admin connected:', socket.id);
      });

      // Handle user messages
      socket.on('client_message', async (message) => {
        try {
          console.log('Received message from client:', message);
          
          // Save to database
          const savedMessage = await Message.findOneAndUpdate(
            { sessionId: message.sessionId },
            { 
              $push: { 
                messages: {
                  sender: 'user',
                  content: message.content,
                  timestamp: message.timestamp,
                  name: message.name,
                  email: message.email
                }
              },
              $setOnInsert: {
                sessionId: message.sessionId,
                status: 'open',
                createdAt: new Date()
              }
            },
            { upsert: true, new: true }
          );

          // Broadcast to all admins
          this.io.emit('new_message', savedMessage);
          
          // Also send to the user's specific room for confirmation
          this.io.to(message.sessionId).emit('message_confirmation', {
            status: 'delivered',
            timestamp: new Date()
          });

        } catch (error) {
          console.error('Error handling client message:', error);
          socket.emit('message_error', {
            error: 'Failed to save message'
          });
        }
      });

      // Handle admin replies
      socket.on('admin_reply', async ({ sessionId, reply }) => {
        try {
          console.log('Received admin reply:', reply);
          
          // Save to database
          const updatedChat = await Message.findOneAndUpdate(
            { sessionId },
            { 
              $push: { messages: reply },
              $set: { status: 'replied', updatedAt: new Date() }
            },
            { new: true }
          );

          // Send to specific user session
          this.io.to(sessionId).emit('admin_reply', reply);
          
          // Also update all admins with the latest message
          this.io.emit('message_updated', updatedChat);

        } catch (error) {
          console.error('Error handling admin reply:', error);
          socket.emit('reply_error', {
            error: 'Failed to send reply'
          });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const sessionId = this.userRooms.get(socket.id);
        if (sessionId) {
          console.log(`Client from session ${sessionId} disconnected`);
          this.userRooms.delete(socket.id);
        }
        
        if (this.adminSockets.has(socket.id)) {
          console.log('Admin disconnected:', socket.id);
          this.adminSockets.delete(socket.id);
        }
      });
    });
  }

  // Utility method to send to specific user
  sendToUser(userId, event, data) {
    this.io.to(userId).emit(event, data);
  }

  // Utility method to broadcast to all admins
  broadcastToAdmins(event, data) {
    this.adminSockets.forEach(adminId => {
      this.io.to(adminId).emit(event, data);
    });
  }
}

module.exports = SocketServer;
