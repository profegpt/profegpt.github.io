# The teacher's lock (removed)

ProfeGPT used to have a padlock in the settings menu. A teacher typed a
passcode and **the whole site was sealed for everyone at once** — every open
page, on every student's screen — until someone with the passcode unlocked it.
It was removed in October 2026. This page records what it was and how it was
built, so it can be put back.

**All of its code is in commit `fed2944`** (the last commit before removal).
Restoring it is mostly `git checkout fed2944 -- <files>` plus re-wiring a few
call sites, listed below.

## What it did

- **One switch, held by the server**, not by the browser. Locking was a `POST`
  to `/api/lock` with the passcode; every page polled `GET /api/lock` and,
  when it came back `{ locked: true }`, covered itself. That is how a lock
  reached students already halfway through a page.
- **The passcode** was `TEACHER_PASSCODE` (default `AP_Lit` — change it if you
  restore this, the default is in a public repo), matched without regard to
  case or surrounding spaces. The same passcode unlocked it, including from the
  overlay itself, so nobody was stranded.
- **The overlay** was two crossed strips of yellow-and-ink caution tape over the
  page with a card in the middle: a title (*Class in session*), a line of
  explanation, and a passcode field. Underneath, nothing could be clicked.
- **The gear turned red** while the site was locked, so a teacher could see the
  room's state without opening the menu.
- **It forgot on restart**, deliberately: on Node the state was in memory, so a
  restart lifted it; on Apps Script it lived in CacheService, which forgets
  within six hours. Nobody could be locked out by a process nobody was watching.
- **Polling cost**: on GitHub Pages each check is two Apps Script requests, so
  the poll was every 20 seconds (it had been 8 on Node).

## The pieces, and where they lived (all at `fed2944`)

| file | role |
| --- | --- |
| `server/routes/lock.js` | `GET` returns `{ locked, since }`; `POST { passcode, locked? }` flips or sets it, 403 on a wrong passcode. State in a module-level `const lock = { locked, since }`. |
| `public/js/lib/site-lock.js` | polls `/api/lock` every `POLL_MS`, puts the tape up or down to match, and exports `lockForm()` (the passcode form for the settings menu), `mountSiteLock()`, `isSiteLocked()`, `onLockChange()`. |
| `public/js/lib/tape.js` | `sealWithTape(panel, { title, detail, note, prompt })` — the crossed-tape overlay, sized from the panel's diagonal, with the passcode form. |
| `test/lock.test.js` | the route against a real express app: locks, toggles, case-insensitive, old language passcodes refused. |

## Re-wiring

1. `git checkout fed2944 -- server/routes/lock.js public/js/lib/site-lock.js public/js/lib/tape.js test/lock.test.js`
2. **Server** — `server/index.js`: `import { router as lock } from './routes/lock.js';` and `app.use('/api/lock', lock);`.
3. **Apps Script** — `appscript/src/modules/app.js`: add `['/api/lock', 'server/routes/lock.js']` to `MOUNTS`. `appscript/build.mjs`: add `'server/routes/lock.js'` to `SERVER_ENTRIES`, and to `SERVER_PATCHES`:
   ```js
   'server/routes/lock.js': [[
     'const lock = { locked: false, since: null };',
     "const lock = persistentObject('lock', { locked: false, since: null });",
   ]],
   ```
   (`persistentObject` is still in `appscript/src/shim.js`.)
4. **App** — `public/js/app.js`: `import { mountSiteLock } from './lib/site-lock.js';` and call `mountSiteLock();` at start-up.
5. **Settings menu** — `public/js/lib/settings.js` at `fed2944` shows the section: a `settings__title--rule` heading with `ICONS.lock` and `t('lock.title')`, then `lockForm(close).form`; the gear's `is-locked` class came from `isSiteLocked()` via `onLockChange(label)`.
6. **Strings** — the `lock` and `tape` sections of each pack in `public/js/lib/i18n.js` at `fed2944` (`title`, `detail`, `passcode`, `lockNow`, `wrong`, `sealedTitle`, `sealedDetail`, `sealedNote`, `cancel`, and `tape.unlock`).
7. **Styles** — the `.tape*` rules, `.is-sealed body`, `.settings__row`, `.settings__error` and `.nav__settings.is-locked` in `public/styles.css` at `fed2944`.
8. **Config** — `TEACHER_PASSCODE` in `.env.example` and in the Apps Script script properties; `test/lock.test.js` back in the `npm test` list; the lock checks in `test/appscript.test.js` at `fed2944` (*the teacher lock survives between executions*).
