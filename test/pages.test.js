/**
 * The GitHub Pages build: the site under /profegpt, talking to Apps Script.
 *
 * Built into a scratch directory and checked as files — the parts that go
 * wrong quietly are a path left without its prefix (a broken stylesheet or a
 * missing picture, only on Pages) and a deep link that 404s.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { build } from '../scripts/build-pages.mjs';

let passed = 0;
function test(name, run) {
  try {
    run();
    passed += 1;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

const config = { base: '/profegpt', api: 'https://script.google.com/macros/s/TEST/exec' };
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'profegpt-pages-'));
build({ out, config, quiet: true });

const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(out, 'styles.css'), 'utf8');

test('every root-relative link and source carries the prefix', () => {
  const bare = [...html.matchAll(/\b(?:href|src)="(\/[^"]*)"/g)].map((match) => match[1])
    .filter((value) => !value.startsWith('/profegpt/') && !value.startsWith('//'));
  assert.deepEqual(bare, []);
});

test('so does every picture in the stylesheet', () => {
  const bare = [...css.matchAll(/url\("(\/[^"]*)"\)/g)].map((match) => match[1])
    .filter((value) => !value.startsWith('/profegpt/'));
  assert.deepEqual(bare, []);
  assert.ok(css.includes('url("/profegpt/assets/art/'));
});

test('the app is told where it lives', () => {
  assert.ok(html.includes('<meta name="profegpt-base" content="/profegpt" />'));
});

test('the API client runs before the app, with the Apps Script address', () => {
  const settings = html.indexOf('window.__PROFEGPT_PAGES__');
  const client = html.indexOf('window.fetch = function');
  const app = html.indexOf('<script type="module" src="/profegpt/js/app.js">');
  assert.ok(settings > 0 && client > settings && app > client);
  assert.ok(html.includes(config.api));
});

test('a deep link is answered with the app, not a 404 page', () => {
  assert.equal(fs.readFileSync(path.join(out, '404.html'), 'utf8'), html);
});

test('Jekyll is switched off, and every drawing is shipped', () => {
  assert.ok(fs.existsSync(path.join(out, '.nojekyll')));
  for (const name of ['logo', 'mascot', 'es', 'fr', 'it', 'translator', 'conjugator', 'dictionary', 'chat', 'soon']) {
    assert.ok(fs.existsSync(path.join(out, 'assets/art', `${name}.svg`)), name);
  }
});

test('no key, and no server code, is in the site', () => {
  const files = [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .forEach((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : files.push(path.join(dir, entry.name))));
  walk(out);
  assert.ok(!files.some((file) => file.includes(`${path.sep}server${path.sep}`)));
  for (const file of files.filter((name) => /\.(?:js|html|css|json)$/.test(name))) {
    const text = fs.readFileSync(file, 'utf8');
    assert.ok(!/DEEPL_API_KEY\s*[:=]\s*['"][^'"]+|ELEVENLABS_API_KEY\s*[:=]\s*['"][^'"]+|sk_[a-f0-9]{20,}|:fx['"]/.test(text), file);
  }
});

fs.rmSync(out, { recursive: true, force: true });

// --- at the root of the host, as profegpt.github.io is -----------------------
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'profegpt-pages-root-'));
build({ out: root, config: { base: '', api: config.api }, quiet: true });
const rootHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('at the root, paths are left as they are', () => {
  assert.ok(rootHtml.includes('<script type="module" src="/js/app.js">'));
  assert.ok(rootHtml.includes('href="/styles.css"'));
  assert.ok(!rootHtml.includes('/profegpt/'));
});

test('and the app is told it has no prefix', () => {
  assert.ok(rootHtml.includes('<meta name="profegpt-base" content="" />'));
  assert.equal(fs.readFileSync(path.join(root, '404.html'), 'utf8'), rootHtml);
});

fs.rmSync(root, { recursive: true, force: true });
console.log(`✓ all ${passed} Pages checks passed`);
