/**
 * The settings menu: the gear at the right-hand end of the header.
 *
 * Two choices live in it: light or dark, and the language the interface is
 * written in — the language the site is about, or English. Neither is
 * something a reader reaches for mid-lesson, so both sit one click away and
 * the header carries only the page links.
 *
 * Each is a choice of two rather than a toggle: a toggle shows the option you
 * are *not* on, which reads backwards half the time. Here the one you are on
 * is marked.
 *
 * The teacher's padlock used to live here too; see docs/teacher-lock.md.
 */

import { el, icon, ICONS } from './dom.js';
import { lang, languageOptions, setLang, t } from './i18n.js';
import { applyTheme, currentTheme } from './theme.js';

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

  /** One button of a pair, marked when it is the current choice. */
  function choice(isOn, onPick, content, label = null) {
    return el('button', {
      type: 'button',
      role: 'menuitemradio',
      'aria-checked': String(isOn),
      'aria-label': label,
      title: label,
      class: `settings__choice${isOn ? ' is-active' : ''}`,
      onclick: onPick,
    }, content);
  }

  function build() {
    const [study, english] = languageOptions();
    return el('div', { class: 'settings', role: 'menu', 'aria-label': t('settings.label') },
      el('p', { class: 'settings__title' }, t('settings.appearance')),
      el('div', { class: 'settings__choices' },
        // The sun and the moon say it without words, which in some languages
        // ran to a second line; the words stay as the buttons' labels.
        choice(currentTheme() === 'light', () => { applyTheme('light'); repaint(); },
          icon(ICONS.sun, { size: 20 }), t('settings.light')),
        choice(currentTheme() === 'dark', () => { applyTheme('dark'); repaint(); },
          icon(ICONS.moon, { size: 20 }), t('settings.dark'))),
      el('p', { class: 'settings__title settings__title--rule' }, t('nav.langLabel')),
      el('div', { class: 'settings__choices' },
        // The language the site is about, in its own name, and English. The
        // interface follows at once; the menu stays open, now in that language.
        choice(lang() === study, () => { setLang(study); }, t('translator.studyName')),
        choice(lang() === english, () => { setLang(english); }, 'English')));
  }

  function open() {
    panel = build();
    holder.appendChild(panel);
    button.setAttribute('aria-expanded', 'true');

    // Deferred so the click that opened the menu does not immediately shut it.
    setTimeout(() => {
      document.addEventListener('pointerdown', onOutside, true);
      document.addEventListener('keydown', onKey);
    }, 0);
  }

  /** Rebuilt in place, so a choice is marked — and worded — as soon as it is made. */
  function repaint() {
    label();
    if (!panel) return;
    const next = build();
    panel.replaceWith(next);
    panel = next;
  }

  button.addEventListener('click', () => (panel ? close() : open()));

  holder.replaceChildren(button);
  label();

  window.addEventListener('langchange', repaint);
  window.addEventListener('studychange', () => { close(); label(); });
  window.addEventListener('themechange', repaint);
}
