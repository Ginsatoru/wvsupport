const TeamMember = require('../models/TeamMember');
const path = require('path');
const fs = require('fs');

exports.createTeamMember = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, position } = req.body;
    
    // Handle contacts - they can come as nested object or flat fields with brackets
    let contacts = {};
    if (req.body.contacts) {
      // If contacts come as nested object
      contacts = {
        telegram: req.body.contacts.telegram || '',
        email: req.body.contacts.email || '',
        phone: req.body.contacts.phone || ''
      };
    } else {
      // If contacts come with bracket notation (contacts[email], etc.)
      contacts = {
        telegram: req.body['contacts[telegram]'] || '',
        email: req.body['contacts[email]'] || '',
        phone: req.body['contacts[phone]'] || ''
      };
    }

    // Validation
    if (!name || !position || !contacts.email) {
      if (req.file) {
        // Clean up uploaded file if validation fails
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'position', 'email'],
        received: { name, position, email: contacts.email }
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        message: 'Image is required'
      });
    }

    const teamMember = new TeamMember({
      name,
      position,
      image: `/uploads/${req.file.filename}`,
      contacts
    });

    const newTeamMember = await teamMember.save();
    res.status(201).json(newTeamMember);
    
  } catch (err) {
    console.error('Error creating team member:', err);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path); // Clean up on error
      } catch (unlinkErr) {
        console.error('Error cleaning up file:', unlinkErr);
      }
    }
    res.status(400).json({ 
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  try {
    const { name, position } = req.body;
    
    // Handle contacts - same logic as create
    let contacts = {};
    if (req.body.contacts) {
      contacts = {
        telegram: req.body.contacts.telegram || '',
        email: req.body.contacts.email || '',
        phone: req.body.contacts.phone || ''
      };
    } else {
      contacts = {
        telegram: req.body['contacts[telegram]'] || '',
        email: req.body['contacts[email]'] || '',
        phone: req.body['contacts[phone]'] || ''
      };
    }

    const updateData = { name, position, contacts };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      
      // Optional: Clean up old image file
      const existingMember = await TeamMember.findById(req.params.id);
      if (existingMember && existingMember.image) {
        const oldImagePath = path.join(__dirname, '..', existingMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(updatedMember);
  } catch (err) {
    console.error('Error updating team member:', err);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path); // Clean up on error
      } catch (unlinkErr) {
        console.error('Error cleaning up file:', unlinkErr);
      }
    }
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
    
    if (!deletedMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Clean up image file
    if (deletedMember.image) {
      const imagePath = path.join(__dirname, '..', deletedMember.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    console.error('Error deleting team member:', err);
    res.status(500).json({ message: err.message });
  }
};