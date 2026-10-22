/**
 * The teacher's padlock.
 *
 * The switch lives on the server, so throwing it seals the site for everyone
 * currently on it, not just this browser. Clients poll for the state, which is
 * how a locked room reaches someone who was already reading a page.
 *
 * Anyone with the passcode can unlock — including from the tape itself, so a
 * student who knows it is not stranded.
 *
 * The padlock used to sit on its own at the left of the header. It now lives in
 * the settings menu (lib/settings.js), which asks this module for its form.
 */

import { el, getJson, postJson } from './dom.js';
import { t } from './i18n.js';
import { sealWithTape } from './tape.js';

/**
 * How often the lock is asked about. On GitHub Pages each check is two
 * requests to Apps Script, against a quota every open page shares, so it is
 * twenty seconds rather than every few: a teacher's lock reaching a page within
 * twenty seconds is soon enough.
 */
const POLL_MS = 20000;

let locked = false;
let unseal = null;
const listeners = new Set();

function changed() {
  for (const listener of listeners) listener(locked);
}

/** Put the tape up, or take it down, to match the server. */
function applyState(next) {
  if (next === locked) return;
  locked = next;
  changed();

  if (!locked) {
    unseal?.();
    unseal = null;
    return;
  }

  if (unseal) return;
  unseal = sealWithTape(document.body, {
    title: t('lock.sealedTitle'),
    detail: t('lock.sealedDetail'),
    note: t('lock.sealedNote'),
    prompt: {
      placeholder: t('lock.passcode'),
      submit: t('tape.unlock'),
      wrong: t('lock.wrong'),
      onSubmit: async (value) => {
        try {
          const state = await postJson('/api/lock', { passcode: value, locked: false });
          locked = Boolean(state.locked);
          changed();
          if (!locked) unseal = null;
          return !locked;
        } catch {
          return false;
        }
      },
    },
  });
}

async function refresh() {
  try {
    const state = await getJson('/api/lock');
    applyState(Boolean(state.locked));
  } catch {
    // Server unreachable — leave whatever is on screen alone.
  }
}

/**
 * The passcode form, for the settings menu to hold.
 * @param {() => void} done  called once the lock has been thrown
 */
export function lockForm(done) {
  const field = el('input', {
    type: 'password',
    autocomplete: 'off',
    placeholder: t('lock.passcode'),
    'aria-label': t('lock.passcode'),
  });
  const error = el('p', { class: 'settings__error' });

  const form = el('form', { class: 'settings__lock' },
    el('p', { class: 'settings__detail' }, t('lock.detail')),
    el('div', { class: 'settings__row' },
      field,
      el('button', { class: 'btn btn--primary btn--sm', type: 'submit' }, t('lock.lockNow'))),
    error);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const state = await postJson('/api/lock', { passcode: field.value, locked: !locked });
      applyState(Boolean(state.locked));
      done?.();
    } catch {
      error.textContent = t('lock.wrong');
      field.value = '';
      field.focus();
    }
  });

  return { form, field };
}

export function mountSiteLock() {
  refresh();
  const timer = setInterval(refresh, POLL_MS);
  return () => clearInterval(timer);
}

export function isSiteLocked() {
  return locked;
}

export function onLockChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
