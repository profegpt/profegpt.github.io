/**
 * Where the site lives.
 *
 * Everywhere today the site is at the root of its host: /es/chat is /es/chat,
 * on the Node server, on Apps Script, and on GitHub Pages at
 * https://profegpt.github.io. But a GitHub Pages *project* site is served under
 * the repository's name — /profegpt/es/chat — and then every address the app
 * reads or writes needs that prefix in front of it. This is what handles it,
 * so the site can move under a prefix by changing pages/config.json alone.
 *
 * The prefix is a <meta name="profegpt-base"> that only the Pages build puts
 * into the page (scripts/build-pages.mjs). Without it the base is empty and
 * nothing changes, which is the case everywhere else.
 *
 * The app itself only ever thinks in unprefixed paths. Addresses are taken off
 * the prefix as they are read and given it back as they are written, here and
 * nowhere else.
 */

function readBase() {
  // Tests run the modules in Node, with no document or only a stand-in one.
  if (typeof document === 'undefined' || typeof document.querySelector !== 'function') return '';
  const meta = document.querySelector('meta[name="profegpt-base"]');
  return String(meta?.content ?? '').replace(/\/+$/, '');
}

export const BASE = readBase();

/** `/es/chat` → `/profegpt/es/chat` on Pages, unchanged elsewhere. */
export function withBase(path) {
  return `${BASE}${path}`;
}

/** The address as the app thinks of it: `/profegpt/es/chat` → `/es/chat`. */
export function withoutBase(pathname) {
  const path = String(pathname ?? '/');
  if (!BASE) return path;
  if (path === BASE) return '/';
  return path.startsWith(`${BASE}/`) ? path.slice(BASE.length) : path;
}
