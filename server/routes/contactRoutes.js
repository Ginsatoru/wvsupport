const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const rateLimit = require("../middleware/rateLimit");
const {
  sendContactMessage,
  getAllMessages,
  replyToMessage,
  markAsRead,
  toggleStar,
  deleteMessage,
  closeMessage,
  reopenMessage,
  uploadAttachments,
} = require("../controllers/contactController");

const router = express.Router();

// Public: contact form (5 per 10 minutes per IP)
router.post("/", rateLimit({ windowMs: 10 * 60 * 1000, max: 5 }), sendContactMessage);

// Admin only
router.get("/admin/messages", verifyAdmin, getAllMessages);
router.patch("/admin/messages/:id/reply", verifyAdmin, uploadAttachments, replyToMessage);
router.patch("/admin/messages/:id/read", verifyAdmin, markAsRead);
router.patch("/admin/messages/:id/star", verifyAdmin, toggleStar);
router.patch("/admin/messages/:id/close", verifyAdmin, closeMessage);
router.patch("/admin/messages/:id/reopen", verifyAdmin, reopenMessage);
router.delete("/admin/messages/:id", verifyAdmin, deleteMessage);

module.exports = router;