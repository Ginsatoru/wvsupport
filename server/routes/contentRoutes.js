const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getActiveHeroContent,
  getAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  toggleHeroActive
} = require('../controllers/contentController');
const newsPopupController = require('../controllers/newsPopupController');

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin || decoded.email === 'admin@wvsupport.com') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `upload-${unique}${path.extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files are allowed!'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Test
router.get('/test', (req, res) => res.json({ success: true, message: 'Content routes working!' }));

// ======================
// HERO ROUTES
// ======================
router.get('/hero/active', getActiveHeroContent);
router.get('/hero/admin/all', verifyAdmin, getAllHeroContent);
router.post('/hero/admin', verifyAdmin, upload.single('backgroundImage'), createHeroContent);
router.put('/hero/admin/:id', verifyAdmin, upload.single('backgroundImage'), updateHeroContent);
router.delete('/hero/admin/:id', verifyAdmin, deleteHeroContent);
router.patch('/hero/admin/:id/toggle-active', verifyAdmin, toggleHeroActive);

// ======================
// NEWS POPUP ROUTES
// ======================
router.get('/news-popup/active', newsPopupController.getActive);
router.get('/news-popup/admin/all', verifyAdmin, newsPopupController.getAll);
router.post('/news-popup/admin', verifyAdmin, upload.single('image'), newsPopupController.create);
router.put('/news-popup/admin/:id', verifyAdmin, upload.single('image'), newsPopupController.update);
router.delete('/news-popup/admin/:id', verifyAdmin, newsPopupController.remove);
router.patch('/news-popup/admin/:id/toggle', verifyAdmin, newsPopupController.toggle);

// ======================
// MULTER ERROR HANDLER
// ======================
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10MB.' });
  }
  if (error.message === 'Only image files are allowed!') return res.status(400).json({ success: false, message: 'Only image files are allowed!' });
  res.status(500).json({ success: false, message: error.message || 'Upload error' });
});

module.exports = router;