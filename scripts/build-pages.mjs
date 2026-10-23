/**
 * Build the GitHub Pages copy of the site into _site/.
 *
 *   node scripts/build-pages.mjs
 *
 * GitHub Pages serves files and nothing else, so this is the browser half of
 * the site with two changes, and the server half runs on Apps Script:
 *
 *   - It can live under a prefix. Today it does not: the repository is named
 *     profegpt.github.io, which GitHub serves at the root of profegpt.github.io,
 *     so "base" in pages/config.json is empty. Were it a project site again
 *     (say /profegpt), root-relative paths in the page and the stylesheet would
 *     get the prefix, and a <meta name="profegpt-base"> tells the app about it
 *     (public/js/lib/site.js). The app's modules import each other relatively
 *     and need nothing.
 *
 *   - /api/… goes to the Apps Script web app. pages/client.js is inlined ahead
 *     of the app to do that, with the address from pages/config.json.
 *
 * Every route is a client-side route, so 404.html is a copy of index.html:
 * GitHub Pages answers /it/chat with it, and the app reads the
 * address and draws the right page.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

/** Inside an inline <script>, the only sequence that matters is the one that ends it. */
const inlineSafe = (code) => code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`index.html: could not find ${label}`);
  return text.replace(from, () => to);
}

export function page(config) {
  const base = String(config.base).replace(/\/+$/, '');
  let html = read('public/index.html');

  html = replaceOnce(html, '<meta charset="utf-8" />',
    `<meta charset="utf-8" />\n  <meta name="profegpt-base" content="${base}" />`, 'the charset');

  // Root-relative links and sources get the prefix; protocol-relative ones do not.
  html = html.replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}/`);

  const settings = JSON.stringify({ base, api: config.api }).replace(/</g, '\\u003c');
  html = replaceOnce(
    html,
    `<script type="module" src="${base}/js/app.js"></script>`,
    [
      `<script>window.__PROFEGPT_PAGES__ = ${settings};</script>`,
      `<script>\n${inlineSafe(read('pages/client.js'))}\n</script>`,
      `<script type="module" src="${base}/js/app.js"></script>`,
    ].join('\n  '),
    'the app script',
  );
  return html;
}

export function styles(config) {
  const base = String(config.base).replace(/\/+$/, '');
  return read('public/styles.css').replace(/url\("\/(?!\/)/g, `url("${base}/`);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(source, target);
    else fs.copyFileSync(source, target);
  }
}

export function build({ out = path.join(ROOT, '_site'), config = JSON.parse(read('pages/config.json')), quiet = false } = {}) {
  if (typeof config.base !== 'string' || !config.api) throw new Error('pages/config.json needs "base" (may be empty) and "api"');

  fs.rmSync(out, { recursive: true, force: true });
  copyDir(path.join(ROOT, 'public'), out);

  const html = page(config);
  fs.writeFileSync(path.join(out, 'index.html'), html);
  fs.writeFileSync(path.join(out, '404.html'), html);
  fs.writeFileSync(path.join(out, 'styles.css'), styles(config));
  // No Jekyll: it would skip files and folders it considers private.
  fs.writeFileSync(path.join(out, '.nojekyll'), '');

  if (!quiet) {
    const files = [];
    const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true })
      .forEach((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : files.push(entry.name)));
    walk(out);
    console.log(`_site ← ${files.length} files, under ${config.base || '/'}, API at ${new URL(config.api).host}`);
  }
  return { out };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build();
}
