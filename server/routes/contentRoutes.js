const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ContentSection = require('../models/FrontendContent');
const {
  getActiveHeroContent,
  getAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  toggleHeroActive
} = require('../controllers/contentController');

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin (either hardcoded admin or admin from DB)
    if (decoded.isAdmin || (decoded.email === 'admin@wvsupport.com')) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `hero-${uniqueSuffix}${extension}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: "Content routes working!",
    timestamp: new Date(),
    uploadsDir: uploadsDir,
    uploadsDirExists: fs.existsSync(uploadsDir)
  });
});

// ======================
// HERO CONTENT ROUTES
// ======================

// Public route - Get active hero content for frontend
router.get('/hero/active', getActiveHeroContent);

// Admin routes - Protected with verifyAdmin middleware
router.get('/hero/admin/all', verifyAdmin, getAllHeroContent);
router.post('/hero/admin', verifyAdmin, upload.single('backgroundImage'), createHeroContent);
router.put('/hero/admin/:id', verifyAdmin, upload.single('backgroundImage'), updateHeroContent);
router.delete('/hero/admin/:id', verifyAdmin, deleteHeroContent);
router.patch('/hero/admin/:id/toggle-active', verifyAdmin, toggleHeroActive);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }

  // Generic error
  res.status(500).json({
    success: false,
    message: error.message || 'An error occurred during file upload'
  });
});

module.exports = router;