const express = require("express");
const {
  sendContactMessage,
  getAllMessages,
  replyToMessage,
  markAsRead,
  toggleStar,
  deleteMessage,
  closeMessage,
  reopenMessage,
  uploadAttachments  // Import the multer middleware
} = require("../controllers/contactController");

const router = express.Router();

// Public route - send contact message
router.post("/", sendContactMessage);

// Admin routes - get all messages
router.get("/admin/messages", getAllMessages);

// Admin routes - reply to message WITH FILE UPLOAD SUPPORT
router.patch("/admin/messages/:id/reply", uploadAttachments, replyToMessage);

// Admin routes - mark as read
router.patch("/admin/messages/:id/read", markAsRead);

// Admin routes - toggle star
router.patch("/admin/messages/:id/star", toggleStar);

// Admin routes - delete message
router.delete("/admin/messages/:id", deleteMessage);

// Admin routes - close message
router.patch("/admin/messages/:id/close", closeMessage);

// Admin routes - reopen message
router.patch("/admin/messages/:id/reopen", reopenMessage);

module.exports = router;