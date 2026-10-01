const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Every upload: allowed MIME types only, and the saved extension comes from that list
// (never from the uploaded file name), so nothing can be stored as .html, .js or .svg.

// CMS images (hero, logos, gallery, …) — no SVG: it can contain scripts
const IMAGE_FILE_TYPES = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
};

// Chat attachments
const CHAT_FILE_TYPES = {
  ...IMAGE_FILE_TYPES,
  "application/pdf": ".pdf",
};

// Contact (email) attachments
const CONTACT_FILE_TYPES = {
  ...CHAT_FILE_TYPES,
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "text/plain": ".txt",
  "text/csv": ".csv",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

const uploadDir = (folder = "") => path.join(__dirname, "../uploads", folder);
const uniqueName = (prefix, ext) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

const createUpload = ({ folder = "", prefix, types, maxFiles = 5 }) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(uploadDir(folder), { recursive: true });
        cb(null, uploadDir(folder));
      },
      filename: (req, file, cb) => cb(null, uniqueName(prefix, types[file.mimetype])),
    }),
    limits: { fileSize: MAX_FILE_SIZE, files: maxFiles },
    fileFilter: (req, file, cb) =>
      types[file.mimetype] ? cb(null, true) : cb(new Error(`File type ${file.mimetype} is not allowed`)),
  });

// CMS images → uploads/upload-<id>.<ext> (gallery saves can carry up to 30 files)
const setupImageUpload = () => createUpload({ prefix: "upload", types: IMAGE_FILE_TYPES, maxFiles: 30 });
const setupChatUpload = () => createUpload({ folder: "chat", prefix: "chat", types: CHAT_FILE_TYPES });
const setupContactUpload = () => createUpload({ folder: "attachments", prefix: "contact", types: CONTACT_FILE_TYPES });

module.exports = {
  setupImageUpload,
  setupChatUpload,
  setupContactUpload,
  CONTACT_FILE_TYPES,
  MAX_FILE_SIZE,
  uploadDir,
  uniqueName,
};