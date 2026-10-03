const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

// Runs after multer: shrinks each uploaded image and saves it as WebP.
// Longest side max 1920px (never enlarged), quality 80, rotated upright from phone EXIF.
// GIFs are left as they are (keeps animations). If anything fails, the original file is kept.
const MAX_SIZE = 1920;
const QUALITY = 80;

const uploadedFiles = (req) => [
  ...(req.file ? [req.file] : []),
  ...(Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat()),
];

const optimizeImages = async (req, res, next) => {
  for (const file of uploadedFiles(req)) {
    if (!file.mimetype.startsWith("image/") || file.mimetype === "image/gif") continue;

    const output = file.path.replace(/\.[^.]+$/, ".webp");
    const temp = `${output}.tmp`;
    try {
      await sharp(file.path)
        .rotate()
        .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(temp);
      await fs.unlink(file.path);
      await fs.rename(temp, output);

      file.path = output;
      file.filename = path.basename(output);
      file.mimetype = "image/webp";
      file.size = (await fs.stat(output)).size;
    } catch (err) {
      console.error("Image optimisation skipped:", err.message);
      await fs.unlink(temp).catch(() => {});
    }
  }
  next();
};

module.exports = optimizeImages;