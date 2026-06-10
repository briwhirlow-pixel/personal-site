import fs from 'node:fs';
import path from 'node:path';

const JSONL = 'C:/Users/crown/.claude/projects/c--Users-crown-Desktop-Claude-personal-site/2014144b-9a09-4362-85c0-e62a8b4d382d.jsonl';
const OUT  = 'C:/Users/crown/Desktop/Claude/personal-site/public/images/';

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
console.log(`Latest image (last in chat):`);

const last = images[images.length - 1];
const ext = last.media_type.split('/')[1] === 'jpeg' ? 'jpg' : (last.media_type.split('/')[1] || 'png');
const buf = Buffer.from(last.data, 'base64');

// Save as the new webslinger image (replaces static photo)
const outName = `webslinger.${ext}`;
fs.writeFileSync(path.join(OUT, outName), buf);
console.log(`  ${buf.length} bytes → ${outName} (${last.media_type})`);
