const NewsPopup = require('../models/NewsPopup');
const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  const full = path.join(__dirname, '..', filePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);
};

const imageUrl = (req, img) =>
  img?.startsWith('http') ? img : `${req.protocol}://${req.get('host')}/${img}`;

// Public — get active non-expired popup
exports.getActive = async (req, res) => {
  try {
    const popup = await NewsPopup.findOne({
      isActive: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });

    if (!popup) return res.json({ success: true, data: null });

    res.json({ success: true, data: { ...popup.toObject(), image: imageUrl(req, popup.image) } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — get all
exports.getAll = async (req, res) => {
  try {
    const popups = await NewsPopup.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: popups.map(p => ({ ...p.toObject(), image: imageUrl(req, p.image) })),
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — create
exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const { title, message, isActive, expiresAt } = req.body;
    const popup = await NewsPopup.create({
      title,
      message,
      image: `uploads/${req.file.filename}`,
      isActive: isActive === 'true',
      expiresAt: expiresAt || null,
    });
    res.status(201).json({ success: true, data: { ...popup.toObject(), image: imageUrl(req, popup.image) } });
  } catch (e) {
    if (req.file) deleteFile(`uploads/${req.file.filename}`);
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — update
exports.update = async (req, res) => {
  try {
    const popup = await NewsPopup.findById(req.params.id);
    if (!popup) return res.status(404).json({ success: false, message: 'Not found' });

    const { title, message, isActive, expiresAt } = req.body;
    if (title !== undefined) popup.title = title;
    if (message !== undefined) popup.message = message;
    if (isActive !== undefined) popup.isActive = isActive === 'true';
    if (expiresAt !== undefined) popup.expiresAt = expiresAt || null;

    if (req.file) {
      deleteFile(popup.image);
      popup.image = `uploads/${req.file.filename}`;
    }

    await popup.save();
    res.json({ success: true, data: { ...popup.toObject(), image: imageUrl(req, popup.image) } });
  } catch (e) {
    if (req.file) deleteFile(`uploads/${req.file.filename}`);
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — delete
exports.remove = async (req, res) => {
  try {
    const popup = await NewsPopup.findById(req.params.id);
    if (!popup) return res.status(404).json({ success: false, message: 'Not found' });
    deleteFile(popup.image);
    await popup.deleteOne();
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Admin — toggle active
exports.toggle = async (req, res) => {
  try {
    const popup = await NewsPopup.findById(req.params.id);
    if (!popup) return res.status(404).json({ success: false, message: 'Not found' });
    popup.isActive = !popup.isActive;
    await popup.save();
    res.json({ success: true, data: popup });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};