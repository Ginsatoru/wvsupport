const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Team photos (unchanged) ──
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

// ── Chat + contact attachments ──
// Extension comes from the MIME type (not the original name) so nothing can be saved as .html/.js
const CHAT_FILE_TYPES = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

const CONTACT_FILE_TYPES = {
  ...CHAT_FILE_TYPES,
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "text/csv": ".csv",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB each, max 5 per message

const uploadDir = (folder) => path.join(__dirname, "../uploads", folder);
const uniqueName = (prefix, ext) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

const createUpload = ({ folder, prefix, types }) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(uploadDir(folder), { recursive: true });
        cb(null, uploadDir(folder));
      },
      filename: (req, file, cb) => cb(null, uniqueName(prefix, types[file.mimetype])),
    }),
    limits: { fileSize: MAX_FILE_SIZE, files: 5 },
    fileFilter: (req, file, cb) =>
      types[file.mimetype] ? cb(null, true) : cb(new Error(`File type ${file.mimetype} is not allowed`)),
  });

const setupChatUpload = () => createUpload({ folder: "chat", prefix: "chat", types: CHAT_FILE_TYPES });
const setupContactUpload = () =>
  createUpload({ folder: "attachments", prefix: "contact", types: CONTACT_FILE_TYPES });

module.exports = {
  setupMulter,
  setupChatUpload,
  setupContactUpload,
  CONTACT_FILE_TYPES,
  MAX_FILE_SIZE,
  uploadDir,
  uniqueName,
};