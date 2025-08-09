const express = require('express');
const router = express.Router();
const { setupMulter } = require('../config/multer');
const teamController = require('../controllers/teamController');

const upload = setupMulter();

// Get all team members
router.get('/', teamController.getAllTeamMembers);

// Add new team member
router.post('/', upload.single('image'), teamController.createTeamMember);

// Update team member
router.put('/:id', upload.single('image'), teamController.updateTeamMember);

// Delete team member
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;