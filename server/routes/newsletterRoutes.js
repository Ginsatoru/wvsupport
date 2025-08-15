const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Subscribe to newsletter
router.post('/', newsletterController.subscribeEmail);

// Get all emails (admin only)
router.get('/', newsletterController.getAllEmails);

module.exports = router;