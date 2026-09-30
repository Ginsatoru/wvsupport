const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const rateLimit = require("../middleware/rateLimit");
const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

// Public: subscribe (5 per hour per IP)
router.post("/", rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }), newsletterController.subscribeEmail);

// Admin only
router.get("/", verifyAdmin, newsletterController.getAllEmails);
router.patch("/seen", verifyAdmin, newsletterController.markSeen);

module.exports = router;