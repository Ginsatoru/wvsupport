// One-time: shrink images already in server/uploads to the same sizes new uploads get.
// Files keep their name and format, so nothing in the database changes.
//   node scripts/shrinkUploads.js --dry   → only report what would change
//   node scripts/shrinkUploads.js         → shrink
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const sharp = require("sharp");
const { SIZES } = require("../middleware/optimizeImages");

const UPLOADS = path.join(__dirname, "..", "uploads");
const DRY = process.argv.includes("--dry");
const FORMATS = { ".webp": "webp", ".jpg": "jpeg", ".jpeg": "jpeg", ".png": "png" };
const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

// File names by use: logos / icons / flags / avatars (small) and hero images (big)
const fileGroups = async () => {
  const logos = new Set();
  const hero = new Set();
  const addTo = (set) => (value) =>
    typeof value === "string" && value.includes("uploads/") && set.add(path.basename(value));
  const db = mongoose.connection.db;
  const [partners, work, nav, tech, heroes] = await Promise.all([
    db.collection("partners").find().toArray(),
    db.collection("workcontents").findOne(),
    db.collection("navcontents").findOne(),
    db.collection("techcontents").findOne(),
    db.collection("frontendcontents").find().toArray(),
  ]);
  partners.forEach((p) => addTo(logos)(p.image));
  (work?.tools || []).forEach((t) => addTo(logos)(t.logo));
  Object.values(nav?.languages || {}).forEach((l) => addTo(logos)(l?.flag));
  (tech?.avatars || []).forEach(addTo(logos));
  heroes.forEach((h) => [h.backgroundImage, h.personImage].forEach(addTo(hero)));
  return { logos, hero };
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const { logos, hero } = await fileGroups();
  const entries = await fs.readdir(UPLOADS, { withFileTypes: true });
  let before = 0;
  let after = 0;
  let changed = 0;

  for (const entry of entries) {
    const format = FORMATS[path.extname(entry.name).toLowerCase()];
    if (!entry.isFile() || !format) continue;

    const file = path.join(UPLOADS, entry.name);
    const maxSize = logos.has(entry.name) ? SIZES.LOGO_SIZE : hero.has(entry.name) ? SIZES.HERO_SIZE : SIZES.PHOTO_SIZE;
    try {
      const { width = 0, height = 0 } = await sharp(file).metadata();
      if (Math.max(width, height) <= maxSize) continue;

      const size = (await fs.stat(file)).size;
      const output = await sharp(file)
        .rotate()
        .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
        .toFormat(format, format === "png" ? { compressionLevel: 9 } : { quality: SIZES.QUALITY })
        .toBuffer();
      if (output.length >= size) continue; // never make a file bigger

      before += size;
      after += output.length;
      changed += 1;
      console.log(`${DRY ? "would shrink" : "shrunk"}  ${entry.name}  ${width}x${height} → max ${maxSize}px  ${kb(size)} → ${kb(output.length)}`);
      if (!DRY) {
        await fs.writeFile(`${file}.tmp`, output);
        await fs.rename(`${file}.tmp`, file);
      }
    } catch (err) {
      console.warn(`skipped ${entry.name}: ${err.message}`);
    }
  }

  console.log(`\n${DRY ? "Would shrink" : "Shrunk"} ${changed} file(s): ${kb(before)} → ${kb(after)}`);
  await mongoose.disconnect();
})();