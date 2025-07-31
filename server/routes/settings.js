const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { auth, admin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

/**
 * @route   GET /api/settings
 * @desc    Get current site settings (public access)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    
    if (!settings) {
      // Initialize default settings if none exist
      const defaultSettings = await Settings.create({
        companyName: 'Your Company',
        address: '123 Main St',
        phoneNumber: '+1234567890',
        email: 'contact@example.com',
        mapEmbedCode: ''
      });
      return res.status(200).json(defaultSettings);
    }

    res.status(200).json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching settings.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update site settings (admin only)
 * @access  Private (admin)
 */
router.put('/', 
  auth, 
  admin,
  [
    body('companyName').optional().trim().escape(),
    body('address').optional().trim().escape(),
    body('phoneNumber').optional().trim(),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('mapEmbedCode').optional().trim()
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      // Get current settings or create new if none exist
      let settings = await Settings.findOne({});
      if (!settings) {
        settings = new Settings();
      }

      // Define allowed fields and update them
      const allowedFields = [
        'logo',
        'companyName', 
        'address',
        'phoneNumber',
        'email',
        'mapEmbedCode'
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          settings[field] = req.body[field];
        }
      });

      settings.lastUpdated = Date.now();

      // Save and return updated settings
      const savedSettings = await settings.save();
      
      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: savedSettings
      });

    } catch (err) {
      console.error('Error updating settings:', err);
      res.status(500).json({ 
        success: false,
        message: 'Failed to update settings',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }
);

module.exports = router;