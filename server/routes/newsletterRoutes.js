const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

// Public: subscribe
router.post("/", newsletterController.subscribeEmail);

// Admin only
router.get("/", verifyAdmin, newsletterController.getAllEmails);
router.patch("/seen", verifyAdmin, newsletterController.markSeen);

module.exports = router;