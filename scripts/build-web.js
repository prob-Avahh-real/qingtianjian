const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const targets = [
  path.join(root, 'www'),
  path.join(root, 'android', 'app', 'src', 'main', 'assets', 'public'),
  path.join(root, 'ios', 'App', 'App', 'public'),
];
const files = ['index.html', 'wearable-input.js'];

for (const f of files) {
  if (!fs.existsSync(path.join(root, f))) {
    console.error(`❌ missing ${f}`);
    process.exit(1);
  }
}

for (const dir of targets) {
  if (dir.endsWith('www') || fs.existsSync(path.dirname(dir))) {
    fs.mkdirSync(dir, { recursive: true });
    for (const f of files) {
      fs.copyFileSync(path.join(root, f), path.join(dir, f));
    }
  }
}
console.log('✅ ok');
