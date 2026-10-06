const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

// Runs after multer: shrinks each uploaded image and saves it as WebP,
// rotated upright from phone EXIF, never enlarged. GIFs are left as they are (animations).
// If anything fails, the original file is kept.
//   Hero images:                     longest side max 1600px (can fill half a wide screen)
//   Photos (cards, sections, gallery): longest side max 1200px (shown ≤ ~730px wide)
//   Logos / icons / flags / avatars:   longest side max 400px (shown at ~35–140px)
const HERO_SIZE = 1600;
const PHOTO_SIZE = 1200;
const LOGO_SIZE = 400;
const QUALITY = 75;
const LOGO_FIELDS = /^(avatar|tool|flag)/; // e.g. avatar0, tool2, flag_en

const uploadedFiles = (req) => [
  ...(req.file ? [req.file] : []),
  ...(Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat()),
];

const createOptimizer = ({ allLogos = false, photoSize = PHOTO_SIZE } = {}) => async (req, res, next) => {
  for (const file of uploadedFiles(req)) {
    if (!file.mimetype.startsWith("image/") || file.mimetype === "image/gif") continue;

    const maxSize = allLogos || LOGO_FIELDS.test(file.fieldname) ? LOGO_SIZE : photoSize;
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
// Hero images (bigger)
module.exports.forHero = createOptimizer({ photoSize: HERO_SIZE });
module.exports.SIZES = { HERO_SIZE, PHOTO_SIZE, LOGO_SIZE, QUALITY };