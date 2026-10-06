// Compress oversized .webp images in the uploads folder (same filenames, so CMS links keep working).
// Usage:
//   node compress-uploads.cjs "<path to uploads folder>" --dry   (preview only, changes nothing)
//   node compress-uploads.cjs "<path to uploads folder>"         (compress; originals saved to ../uploads_backup)
// Needs: npm i sharp

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dir = process.argv[2];
const dry = process.argv.includes("--dry");

const MAX_WIDTH = 1600; // px, never enlarges smaller images
const MIN_BYTES = 100 * 1024; // files at or below 100 kB are left alone
const QUALITY = 75;

const kb = (n) => `${Math.round(n / 1024)} kB`;

if (!dir || !fs.existsSync(dir)) {
  console.log('Usage: node compress-uploads.cjs "<uploads folder>" [--dry]');
  process.exit(1);
}

const backupDir = path.join(path.dirname(path.resolve(dir)), "uploads_backup");

(async () => {
  if (!dry) fs.mkdirSync(backupDir, { recursive: true });
  let saved = 0;

  for (const name of fs.readdirSync(dir)) {
    if (!/\.webp$/i.test(name)) continue;
    const file = path.join(dir, name);
    if (!fs.statSync(file).isFile()) continue;
    const size = fs.statSync(file).size;
    if (size <= MIN_BYTES) continue;

    try {
      const meta = await sharp(file).metadata();
      if (meta.pages && meta.pages > 1) {
        console.log(`skip  ${name} (animated)`);
        continue;
      }

      const out = await sharp(file)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      if (out.length >= size * 0.9) {
        console.log(`skip  ${name} (${kb(size)} -> ${kb(out.length)}, not worth it)`);
        continue;
      }

      console.log(`${dry ? "would" : "done "} ${name}: ${kb(size)} -> ${kb(out.length)}`);
      if (!dry) {
        fs.copyFileSync(file, path.join(backupDir, name));
        fs.writeFileSync(file, out);
      }
      saved += size - out.length;
    } catch (e) {
      console.log(`error ${name}: ${e.message}`);
    }
  }

  console.log(`\n${dry ? "Would save" : "Saved"} ${kb(saved)} in total.`);
  if (!dry) console.log(`Originals backed up in: ${backupDir}`);
})();
