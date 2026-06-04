/**
 * Generates professional placeholder PNGs for handover / profile flows.
 * Run: npm run generate:assets
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_CARS = path.join(ROOT, 'src/assets/placeholders/cars');
const OUT_MISC = path.join(ROOT, 'src/assets/placeholders');

const ASSETS = [
  { dir: OUT_CARS, name: 'car-front.jpg', label: 'FRONT', rgb: [26, 54, 93] },
  { dir: OUT_CARS, name: 'car-back.jpg', label: 'REAR', rgb: [22, 48, 82] },
  { dir: OUT_CARS, name: 'car-left.jpg', label: 'LEFT', rgb: [30, 60, 100] },
  { dir: OUT_CARS, name: 'car-right.jpg', label: 'RIGHT', rgb: [18, 42, 74] },
  { dir: OUT_CARS, name: 'car-interior.jpg', label: 'INTERIOR', rgb: [40, 44, 52] },
  { dir: OUT_MISC, name: 'damage-scratch-1.jpg', label: 'SCRATCH', rgb: [120, 72, 48] },
  { dir: OUT_MISC, name: 'damage-dent-1.jpg', label: 'DENT', rgb: [90, 58, 42] },
  { dir: OUT_MISC, name: 'signature-sample.png', label: 'SIGNATURE', rgb: [248, 250, 252] },
  { dir: OUT_MISC, name: 'driver-avatar.png', label: 'DRIVER', rgb: [15, 118, 110] },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function drawLabel(png, label, rgb) {
  const { width, height, data } = png;
  const [r, g, b] = rgb;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const vignette = 1 - Math.hypot(x - width / 2, y - height / 2) / (width * 0.72);
      data[idx] = Math.min(255, Math.floor(r + vignette * 35 + (y / height) * 18));
      data[idx + 1] = Math.min(255, Math.floor(g + vignette * 28 + (x / width) * 12));
      data[idx + 2] = Math.min(255, Math.floor(b + vignette * 20));
      data[idx + 3] = 255;
    }
  }

  const barY = Math.floor(height * 0.78);
  for (let y = barY; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      data[idx] = 12;
      data[idx + 1] = 18;
      data[idx + 2] = 32;
      data[idx + 3] = 230;
    }
  }

  const text = label;
  const startX = Math.floor((width - text.length * 14) / 2);
  const startY = Math.floor(height * 0.82);
  for (let i = 0; i < text.length; i++) {
    const cx = startX + i * 14;
    for (let dy = 0; dy < 22; dy++) {
      for (let dx = 0; dx < 10; dx++) {
        const x = cx + dx;
        const y = startY + dy;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const idx = (width * y + x) << 2;
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
  }

  const titleY = Math.floor(height * 0.38);
  const sub = 'LEGEND DRIVER — PLACEHOLDER';
  const subX = Math.floor((width - sub.length * 7) / 2);
  for (let i = 0; i < sub.length; i++) {
    const cx = subX + i * 7;
    for (let dy = 0; dy < 10; dy++) {
      for (let dx = 0; dx < 5; dx++) {
        const x = cx + dx;
        const y = titleY + dy;
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        const idx = (width * y + x) << 2;
        data[idx] = 200;
        data[idx + 1] = 210;
        data[idx + 2] = 220;
        data[idx + 3] = 255;
      }
    }
  }
}

function writeAsset({ dir, name, label, rgb }) {
  ensureDir(dir);
  const width = 640;
  const height = 480;
  const png = new PNG({ width, height });
  drawLabel(png, label, rgb);
  const outPath = path.join(dir, name.replace(/\.jpg$/, '.png'));
  fs.writeFileSync(outPath, PNG.sync.write(png));
  return outPath;
}

ensureDir(OUT_CARS);
ensureDir(OUT_MISC);

const written = ASSETS.map(writeAsset);
console.log(`Generated ${written.length} placeholder images:`);
written.forEach(p => console.log(`  ${path.relative(ROOT, p)}`));
