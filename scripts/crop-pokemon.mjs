import sharp from 'sharp';
import path from 'node:path';

const SRC = 'C:/Users/crown/Desktop/Claude/personal-site/public/images/pokemon-starters.jpg';
const OUT = 'C:/Users/crown/Desktop/Claude/personal-site/public/images/';

// Source is 1228x523. Top ~155px is the Pokemon wordmark, bottom ~368px is the
// three watercolor panels (Bulbasaur green | Charmander orange | Squirtle blue).
// Each panel ≈ 409 wide. Crop just the bottom region into 3 panels, full height.

const TOP_CROP = 155;        // y offset to skip the wordmark
const PANEL_H  = 523 - TOP_CROP; // 368px tall
const PANEL_W  = Math.round(1228 / 3); // ~409px each

const panels = [
  { name: 'pokemon-bulbasaur',  left: 0,                  width: PANEL_W },
  { name: 'pokemon-charmander', left: PANEL_W,            width: PANEL_W },
  { name: 'pokemon-squirtle',   left: PANEL_W * 2,        width: 1228 - PANEL_W * 2 },
];

for (const p of panels) {
  const outPath = path.join(OUT, `${p.name}.png`);
  await sharp(SRC)
    .extract({ left: p.left, top: TOP_CROP, width: p.width, height: PANEL_H })
    .png()
    .toFile(outPath);
  const m = await sharp(outPath).metadata();
  console.log(`  ${p.name}.png  →  ${m.width}x${m.height}`);
}
