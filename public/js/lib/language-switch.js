/**
 * The language switch in the header: ES | EN on the Spanish side of the site,
 * FR | EN on the French one, IT | EN on the Italian one.
 *
 * It only changes the language of the interface. Which language the site is
 * about is chosen on the home page — the wordmark goes back there — so this
 * no longer opens a menu of subjects, and neither half is behind a passcode.
 */

import { el, clear } from './dom.js';
import { lang, languageOptions, setLang, t } from './i18n.js';

export function mountLanguageSwitch(container) {
  let buttons = new Map();

  function paint() {
    for (const [code, button] of buttons) {
      button.classList.toggle('is-active', code === lang());
      button.setAttribute('aria-pressed', String(code === lang()));
    }
  }

  /** Rebuilt rather than repainted when the study language changes: ES becomes FR. */
  function build() {
    buttons = new Map();
    clear(container);
    container.setAttribute('aria-label', t('nav.langLabel'));

    for (const code of languageOptions()) {
      const button = el('button', {
        class: 'langswitch__option',
        type: 'button',
        onclick: () => { if (lang() !== code) setLang(code); },
      }, code.toUpperCase());
      buttons.set(code, button);
      container.appendChild(button);
    }

    paint();
  }

  build();
  window.addEventListener('langchange', paint);
  window.addEventListener('studychange', build);
  return build;
}
