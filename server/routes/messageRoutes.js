const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin)
      return res.status(403).json({ message: "Admin access required" });
    req.adminId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Create new message thread (user)
router.post("/", async (req, res) => {
  try {
    const { sessionId, name, email, content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Content is required" });

    const newMessage = await Message.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          messages: {
            sender: "user",
            content,
            name,
            email,
          },
        },
        $setOnInsert: {
          sessionId,
          user: {
            id: email || `guest_${Date.now()}`,
            name,
            email,
          },
          status: "open",
        },
      },
      { upsert: true, new: true }
    );

    // Notify all admins
    req.app.get("socket").broadcastToAdmins("new_message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get all message threads (admin only)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const messages = await Message.find(filter).sort({ updatedAt: -1 }).lean();

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// Get single message thread by sessionId (PUBLIC - for chat widget)
router.get("/:sessionId", async (req, res) => {
  try {
    const message = await Message.findOne({ sessionId: req.params.sessionId });

    if (!message) {
      // Return empty messages array for new sessions
      return res.json({ messages: [] });
    }

    // Return messages in the format expected by ChatBox component
    res.json({
      messages: message.messages.map((msg) => ({
        name: msg.sender === "admin" ? "Admin" : msg.name || "Guest",
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAdmin: msg.sender === "admin",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-specific route to get full thread details
router.get("/admin/:sessionId", verifyAdmin, async (req, res) => {
  try {
    const message = await Message.findOne({ sessionId: req.params.sessionId });
    if (!message) return res.status(404).json({ message: "Thread not found" });

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin reply to thread
router.post("/:sessionId/reply", verifyAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Reply content is required" });

    const reply = {
      sender: "admin",
      content,
      adminId: req.adminId,
      status: "delivered",
    };

    const updatedThread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      {
        $push: { messages: reply },
        $set: {
          status: "replied",
          assignedTo: req.adminId,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // Send reply to specific user session
    req.app
      .get("socket")
      .sendToUser(req.params.sessionId, "admin_reply", reply);

    res.json(updatedThread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update thread status
router.patch("/:sessionId/status", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["open", "replied", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedThread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $set: { status, updatedAt: new Date() } },
      { new: true }
    );

    if (!updatedThread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    res.json(updatedThread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete thread (admin)
router.delete("/:sessionId", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Message.findOneAndDelete({
      sessionId: req.params.sessionId,
    });
    if (!deleted) return res.status(404).json({ message: "Thread not found" });

    res.json({ message: "Thread deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
