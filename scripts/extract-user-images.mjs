import fs from 'node:fs';

const JSONL = 'C:/Users/crown/.claude/projects/c--Users-crown-Desktop-Claude-personal-site/2014144b-9a09-4362-85c0-e62a8b4d382d.jsonl';

const raw = fs.readFileSync(JSONL, 'utf8');
const lines = raw.split('\n').filter(Boolean);

const userImages = [];

function pushImg(block) {
  if (block?.type === 'image' && block.source?.data && block.source?.media_type) {
    userImages.push({ data: block.source.data, media_type: block.source.media_type });
  }
}

for (const line of lines) {
  let entry;
  try { entry = JSON.parse(line); } catch { continue; }

  // Path 1: standard role:user with content array
  const msg = entry.message;
  if (msg?.role === 'user' && Array.isArray(msg.content)) {
    for (const block of msg.content) {
      // Skip tool_result blocks — those are reads from disk, not uploads
      if (block?.type === 'tool_result') continue;
      pushImg(block);
    }
  }

  // Path 2: queued_command attachments (Claude Code paste-image flow)
  if (entry.attachment?.type === 'queued_command' && Array.isArray(entry.attachment.prompt)) {
    for (const block of entry.attachment.prompt) {
      pushImg(block);
    }
  }
}

console.log(`Found ${userImages.length} REAL user-uploaded images (skipping tool results).`);
for (let i = 0; i < userImages.length; i++) {
  const img = userImages[i];
  const buf = Buffer.from(img.data, 'base64');
  console.log(`  [${i}] ${img.media_type}  ·  ${buf.length} bytes`);
}

// Save each one numbered so we can see what's what
const OUT = 'C:/Users/crown/Desktop/Claude/personal-site/scripts/_user-uploads/';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
for (let i = 0; i < userImages.length; i++) {
  const img = userImages[i];
  const ext = img.media_type.split('/')[1] === 'jpeg' ? 'jpg' : (img.media_type.split('/')[1] || 'bin');
  fs.writeFileSync(`${OUT}user-${String(i).padStart(2, '0')}.${ext}`, Buffer.from(img.data, 'base64'));
}
console.log(`\nSaved to ${OUT}`);
