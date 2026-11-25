// Copies three.js (installed by npm) into www/lib so the app works fully offline.
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'node_modules', 'three', 'build', 'three.min.js');
const dst = path.join(__dirname, '..', 'www', 'lib', 'three.min.js');
if (fs.existsSync(src)) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log('three.js copied to www/lib');
} else {
  console.log('three not installed yet - skipping');
}
