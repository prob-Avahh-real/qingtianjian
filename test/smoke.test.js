import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const proj = path.join(root, '..');

test('project smoke: critical files and Capacitor assets exist', () => {
  const need = [
    'index.html',
    'wearable-input.js',
    'package.json',
    'capacitor.config.json',
    'www/index.html',
    'www/wearable-input.js',
    'android/app/src/main/assets/public/index.html',
    'android/app/src/main/assets/public/wearable-input.js',
  ];
  for (const rel of need) {
    const p = path.join(proj, rel);
    assert.ok(fs.existsSync(p), `missing ${rel}`);
  }
});

test('wearable input (ring + cane) and watch responsive CSS are integrated and synced', () => {
  const srcHtml = fs.readFileSync(path.join(proj, 'index.html'), 'utf8');
  assert.match(srcHtml, /DeviceOrientationEvent/);
  assert.match(srcHtml, /DeviceMotionEvent/);
  assert.match(srcHtml, /requestPermission/);
  assert.match(srcHtml, /@media\s*\(max-width:\s*280px\),\s*\(max-height:\s*300px\)/);

  const wwwHtml = fs.readFileSync(path.join(proj, 'www/index.html'), 'utf8');
  const androidHtml = fs.readFileSync(
    path.join(proj, 'android/app/src/main/assets/public/index.html'),
    'utf8'
  );
  assert.equal(srcHtml, wwwHtml, 'www/index.html must match root index.html');
  assert.equal(srcHtml, androidHtml, 'android public index.html must match root index.html');
});

test('package.json has name', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(proj, 'package.json'), 'utf8'));
  assert.ok(pkg.name);
});
