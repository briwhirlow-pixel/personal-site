import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';

console.log('Testing local bg removal on swoop.png...');
const start = Date.now();

try {
  const input = fs.readFileSync('C:/Users/crown/Desktop/Claude/personal-site/public/images/swoop.png');
  const blob = await removeBackground(new Blob([input], { type: 'image/png' }));
  const buf = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync('C:/Users/crown/Desktop/Claude/personal-site/public/images/_test-swoop-cut.png', buf);
  const dur = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`✓ Done in ${dur}s · ${buf.length} bytes → _test-swoop-cut.png`);
} catch (e) {
  console.error('✗ Failed:', e.message);
  console.error(e.stack?.split('\n').slice(0, 5).join('\n'));
}
