const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

// Runs after multer: shrinks each uploaded image and saves it as WebP (quality 80),
// rotated upright from phone EXIF, never enlarged. GIFs are left as they are (animations).
// If anything fails, the original file is kept.
//   Photos:                       longest side max 1600px
//   Logos / icons / flags / avatars: longest side max 400px (shown at ~35–140px)
const PHOTO_SIZE = 1600;
const LOGO_SIZE = 400;
const QUALITY = 80;
const LOGO_FIELDS = /^(avatar|tool|flag)/; // e.g. avatar0, tool2, flag_en

const uploadedFiles = (req) => [
  ...(req.file ? [req.file] : []),
  ...(Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat()),
];

const createOptimizer = ({ allLogos = false } = {}) => async (req, res, next) => {
  for (const file of uploadedFiles(req)) {
    if (!file.mimetype.startsWith("image/") || file.mimetype === "image/gif") continue;

    const maxSize = allLogos || LOGO_FIELDS.test(file.fieldname) ? LOGO_SIZE : PHOTO_SIZE;
    const output = file.path.replace(/\.[^.]+$/, ".webp");
    const temp = `${output}.tmp`;
    try {
      await sharp(file.path)
        .rotate()
        .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
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

// Default: photos (logo-named fields still get the small size)
module.exports = createOptimizer();
// Every file is a logo (partner logos)
module.exports.forLogos = createOptimizer({ allLogos: true });
module.exports.SIZES = { PHOTO_SIZE, LOGO_SIZE, QUALITY };