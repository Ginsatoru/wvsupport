const multer = require("multer");
const path = require("path");
const fs = require("fs");

const setupMulter = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, "team-" + uniqueSuffix + ext);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"), false);
      }
    },
  });

  return upload;
};

// ── Live chat attachments: images + PDF, 10MB each, max 5 per message ──
// Extension comes from the MIME type (not the original name) so nothing can be saved as .html/.js
const CHAT_FILE_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const setupChatUpload = () =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads/chat");
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "chat-" + uniqueSuffix + CHAT_FILE_TYPES[file.mimetype]);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024, files: 5 },
    fileFilter: (req, file, cb) =>
      CHAT_FILE_TYPES[file.mimetype]
        ? cb(null, true)
        : cb(new Error("Only images (JPG, PNG, GIF, WEBP) and PDFs are allowed")),
  });

module.exports = { setupMulter, setupChatUpload };