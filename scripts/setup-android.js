// One command to prepare the Android project:
//  1. creates the android/ folder (first time only)
//  2. installs the Bully Escape launcher icons from android-res/
//  3. copies the game (www/) into the Android project
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });

if (!fs.existsSync(path.join(root, 'android'))) run('npx cap add android');

const src = path.join(root, 'android-res');
const dst = path.join(root, 'android', 'app', 'src', 'main', 'res');
(function copy(s, d) {
  for (const e of fs.readdirSync(s, { withFileTypes: true })) {
    const sp = path.join(s, e.name), dp = path.join(d, e.name);
    if (e.isDirectory()) { fs.mkdirSync(dp, { recursive: true }); copy(sp, dp); }
    else fs.copyFileSync(sp, dp);
  }
})(src, dst);
console.log('App icons installed.');

run('npx cap sync android');
console.log('\nDone. Open the project in Android Studio with:  npm run open');
