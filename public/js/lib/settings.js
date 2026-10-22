/**
 * The settings menu: the gear at the right-hand end of the header.
 *
 * Two things live in it, and both used to be buttons of their own in the
 * header — light and dark mode, and the teacher's padlock. Neither is something
 * a student reaches for mid-lesson, and the header has the page links and the
 * language switch to carry, so they are one click further away and the header
 * is quieter for it.
 *
 * Light and dark are offered as a choice of two rather than a toggle: a toggle
 * shows an icon for the mode you are *not* in, which reads backwards half the
 * time. Here the one you are in is marked.
 */

import { el, clear, icon, ICONS } from './dom.js';
import { t } from './i18n.js';
import { applyTheme, currentTheme } from './theme.js';
import { lockForm, onLockChange, isSiteLocked } from './site-lock.js';

export function mountSettings(holder) {
  const button = el('button', {
    class: 'nav__settings',
    type: 'button',
    'aria-haspopup': 'true',
    'aria-expanded': 'false',
  }, icon(ICONS.gear, { size: 18 }));

  let panel = null;

  function label() {
    button.setAttribute('aria-label', t('settings.label'));
    button.title = t('settings.label');
    button.classList.toggle('is-locked', isSiteLocked());
  }

  function close() {
    panel?.remove();
    panel = null;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKey);
  }

  const onOutside = (event) => { if (!holder.contains(event.target)) close(); };
  const onKey = (event) => { if (event.key === 'Escape') { close(); button.focus(); } };

  function themeChoice(theme, shape) {
    const choice = el('button', {
      type: 'button',
      role: 'menuitemradio',
      'aria-checked': String(currentTheme() === theme),
      class: `settings__choice${currentTheme() === theme ? ' is-active' : ''}`,
      onclick: () => { applyTheme(theme); paintThemes(); },
    }, icon(shape, { size: 15 }), t(`settings.${theme}`));
    choice.dataset.theme = theme;
    return choice;
  }

  function paintThemes() {
    for (const choice of panel?.querySelectorAll('.settings__choice') ?? []) {
      const on = choice.dataset.theme === currentTheme();
      choice.classList.toggle('is-active', on);
      choice.setAttribute('aria-checked', String(on));
    }
  }

  function open() {
    const { form } = lockForm(close);
    panel = el('div', { class: 'settings', role: 'menu', 'aria-label': t('settings.label') },
      el('p', { class: 'settings__title' }, t('settings.appearance')),
      el('div', { class: 'settings__choices' },
        themeChoice('light', ICONS.sun),
        themeChoice('dark', ICONS.moon)),
      el('p', { class: 'settings__title settings__title--rule' },
        icon(ICONS.lock, { size: 13 }), t('lock.title')),
      form);
    holder.appendChild(panel);
    button.setAttribute('aria-expanded', 'true');

    // Deferred so the click that opened the menu does not immediately shut it.
    setTimeout(() => {
      document.addEventListener('pointerdown', onOutside, true);
      document.addEventListener('keydown', onKey);
    }, 0);
  }

  button.addEventListener('click', () => (panel ? close() : open()));

  clear(holder);
  holder.appendChild(button);
  label();

  window.addEventListener('langchange', () => { close(); label(); });
  window.addEventListener('studychange', () => { close(); label(); });
  window.addEventListener('themechange', paintThemes);
  onLockChange(label);
}
