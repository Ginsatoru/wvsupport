// utils/websocket.js
const WebSocket = require('ws');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
    this.setup();
  }

  setup() {
    this.wss.on('connection', (ws, req) => {
      // Authenticate connection
      this.authenticate(ws, req);
      
      ws.on('message', (message) => this.handleMessage(ws, message));
      ws.on('close', () => this.handleClose(ws));
      ws.on('error', (error) => this.handleError(ws, error));
    });

    // Setup heartbeat
    this.heartbeatInterval = setInterval(() => this.heartbeat(), 30000);
  }

  authenticate(ws, req) {
    try {
      const token = req.url.split('token=')[1];
      if (!token) throw new Error('No token provided');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded;
      this.clients.add(ws);
      
      ws.send(JSON.stringify({
        type: 'connection',
        status: 'authenticated',
        user: decoded.email
      }));
      
      console.log(`Client connected: ${decoded.email}`);
    } catch (error) {
      console.error('Authentication failed:', error.message);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Authentication failed',
        error: error.message
      }));
      ws.close();
    }
  }

  async handleMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'new_message':
          await this.handleNewMessage(data);
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        default:
          throw new Error('Unknown message type');
      }
    } catch (error) {
      console.error('Message handling error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message',
        error: error.message
      }));
    }
  }

  async handleNewMessage(data) {
    const newMessage = await Message.create({
      content: data.content,
      name: data.name,
      email: data.email,
      isAdminReply: false
    });

    this.broadcast({
      ...newMessage.toObject(),
      type: 'new_message',
      time: new Date().toLocaleTimeString()
    });
  }

  handleClose(ws) {
    console.log(`Client disconnected: ${ws.user?.email || 'Unknown'}`);
    this.clients.delete(ws);
  }

  handleError(ws, error) {
    console.error(`Client error (${ws.user?.email || 'Unknown'}):`, error);
    this.clients.delete(ws);
  }

  heartbeat() {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    });
  }

  broadcast(message) {
    const messageString = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  }

  shutdown() {
    clearInterval(this.heartbeatInterval);
    this.wss.close();
  }
}

module.exports = WebSocketServer;