import fs from 'node:fs';
import path from 'node:path';

const JSONL = 'C:/Users/crown/.claude/projects/c--Users-crown-Desktop-Claude-personal-site/2014144b-9a09-4362-85c0-e62a8b4d382d.jsonl';
const OUT  = 'C:/Users/crown/Desktop/Claude/personal-site/public/images/';

// Filenames in conversation order. User sent:
//   1. Pokemon trio
//   2. Swoop (Eagles mascot)
//   3. Spider-Man
//   4. Phillie Phanatic
const NAMES = [
  'pokemon-starters',
  'swoop',
  'webslinger',
  'phanatic',
];

const raw = fs.readFileSync(JSONL, 'utf8');
const lines = raw.split('\n').filter(Boolean);

const images = [];
for (const line of lines) {
  let msg;
  try { msg = JSON.parse(line); } catch { continue; }

  const stack = [msg];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (node.type === 'image' && node.source && node.source.data && node.source.media_type) {
      images.push({ data: node.source.data, media_type: node.source.media_type });
      continue;
    }
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (v && typeof v === 'object') stack.push(v);
    }
  }
}

console.log(`Found ${images.length} image attachments in conversation history.`);

for (let i = 0; i < images.length && i < NAMES.length; i++) {
  const img = images[i];
  const ext = img.media_type.split('/')[1] === 'jpeg' ? 'jpg' : (img.media_type.split('/')[1] || 'bin');
  const filename = `${NAMES[i]}.${ext}`;
  const out = path.join(OUT, filename);
  const buf = Buffer.from(img.data, 'base64');
  fs.writeFileSync(out, buf);
  console.log(`  ${String(buf.length).padStart(8)} bytes  →  ${filename}  (${img.media_type})`);
}
