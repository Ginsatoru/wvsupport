const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new team member
router.post('/', async (req, res) => {
  const { name, position, image, contacts } = req.body;

  // Add validation
  if (!name || !position || !image || !contacts || !contacts.email) {
    console.log('Validation failed. Received data:', req.body);
    return res.status(400).json({ 
      message: 'Missing required fields',
      required: ['name', 'position', 'image', 'contacts.email']
    });
  }

  const teamMember = new TeamMember({
    name,
    position,
    image,
    contacts
  });

  try {
    const newTeamMember = await teamMember.save();
    res.status(201).json(newTeamMember);
  } catch (err) {
    console.error('Database save error:', err);
    res.status(400).json({ 
      message: err.message,
      errorDetails: err.errors 
    });
  }
});

// Update team member
router.put('/:id', async (req, res) => {
  try {
    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete team member
router.delete('/:id', async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;