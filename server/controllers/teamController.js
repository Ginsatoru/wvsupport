const TeamMember = require('../models/TeamMember');
const multer = require('multer');
const path = require('path');

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single('image');

exports.createTeamMember = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, position, bio, twitter, linkedin, github } = req.body;
      
      const newMember = new TeamMember({
        name,
        position,
        bio,
        image: req.file.path,
        socialLinks: {
          twitter,
          linkedin,
          github
        }
      });

      await newMember.save();
      res.status(201).json(newMember);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeamMember = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, position, bio, twitter, linkedin, github } = req.body;
      const updateData = {
        name,
        position,
        bio,
        socialLinks: {
          twitter,
          linkedin,
          github
        }
      };

      if (req.file) {
        updateData.image = req.file.path;
      }

      const updatedMember = await TeamMember.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedMember) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      res.json(updatedMember);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const deletedMember = await TeamMember.findByIdAndDelete(req.params.id);
    
    if (!deletedMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};