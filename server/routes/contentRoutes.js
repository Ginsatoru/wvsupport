const express = require('express');
const router = express.Router();
const ContentSection = require('../models/ContentSection');
const { auth } = require('../middleware/auth');

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: "Content routes working!" });
});

// Protected routes
router.use(auth);

// Get all content
router.get('/', async (req, res) => {
  try {
    const content = await ContentSection.find();
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create content
router.post('/', async (req, res) => {
  const content = new ContentSection({
    sectionType: req.body.sectionType,
    title: req.body.title,
    content: req.body.content
  });

  try {
    const newContent = await content.save();
    res.status(201).json(newContent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;