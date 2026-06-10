import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';

const DIR = 'C:/Users/crown/Desktop/Claude/personal-site/public/images/';

const TARGETS = [
  { in: 'swoop.png',              out: 'swoop-cut.png' },
  { in: 'webslinger.png',         out: 'webslinger-cut.png' },
  { in: 'phanatic.png',           out: 'phanatic-cut.png' },
  { in: 'pokemon-bulbasaur.png',  out: 'bulbasaur-cut.png' },
  { in: 'pokemon-charmander.png', out: 'charmander-cut.png' },
  { in: 'pokemon-squirtle.png',   out: 'squirtle-cut.png' },
];

for (const t of TARGETS) {
  const start = Date.now();
  try {
    const input = fs.readFileSync(DIR + t.in);
    const blob = await removeBackground(new Blob([input], { type: 'image/png' }));
    const buf = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(DIR + t.out, buf);
    const dur = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`✓ ${t.in.padEnd(28)} → ${t.out.padEnd(22)} · ${dur}s · ${(buf.length / 1024).toFixed(0)}KB`);
  } catch (e) {
    console.error(`✗ ${t.in}: ${e.message}`);
  }
}
