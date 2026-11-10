import { el, icon } from '../lib/dom.js';
import { lang, t } from '../lib/i18n.js';
import { page } from '../lib/study.js';
import { nextMidnight, wordOfDay } from '../lib/word-of-day.js';

/**
 * The word of the day, as a card.
 *
 * Every language's front page shows its own, between the hero and the
 * translator; the home page shows the three priority languages' words in turn
 * (see gallery below). The Spanish card alone carries a button that tells the
 * story behind the word: where it came from, what is hidden inside it. The
 * other languages' words were chosen for having one, but the card leaves it
 * to the reader to find.
 *
 * The gloss follows the interface language where it can: English when the
 * chrome is English, otherwise the word's own language.
 */
export function wordCard(language, { label = null } = {}) {
  const entry = wordOfDay(language);
  if (!entry) return el('div', {});
  const english = lang() === 'en';
  const gloss = english ? entry.gloss.en : (entry.gloss[language] ?? entry.gloss.en);

  const card = el('article', { class: 'wotd', 'data-language': language },
    el('p', { class: 'wotd__label' }, t('word.title'), label ? el('span', { class: 'wotd__language' }, label) : null),
    el('h2', { class: 'wotd__word', lang: language }, entry.word),
    el('p', { class: 'wotd__gloss' }, gloss),
  );

  const actions = el('div', { class: 'wotd__actions' },
    el('a', {
      class: 'btn btn--sm',
      href: `${page('/diccionario', language)}?q=${encodeURIComponent(entry.word)}`,
      'data-link': '',
    }, t('word.look'), icon('M5 12h14m0 0-6-6m6 6-6 6', { size: 14 })));

  if (entry.story) {
    const story = el('p', { class: 'wotd__story', hidden: true }, english ? entry.story.en : (entry.story[language] ?? entry.story.en));
    const toggle = el('button', {
      class: 'btn btn--sm btn--primary',
      type: 'button',
      'aria-expanded': 'false',
      onclick: () => {
        const open = story.hidden;
        story.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.replaceChildren(open ? t('word.hide') : t('word.story'));
      },
    }, t('word.story'));
    actions.prepend(toggle);
    card.append(actions, story);
  } else {
    card.append(actions);
  }
  return card;
}

/**
 * The home page's gallery: the words of the day of the priority languages,
 * one at a time, turning every few seconds, with a chip per language to pick
 * one by hand. Picking a chip stops the turning; so does resting the mouse on
 * the card, and so does a reader who asked for reduced motion.
 *
 * Returns the element and a teardown that stops the timers.
 */
export function wordGallery(languages, { names = {} } = {}) {
  const stage = el('div', { class: 'wotd-gallery__stage', 'aria-live': 'polite' });
  const chips = languages.map((code, index) => el('button', {
    class: 'wotd-gallery__chip',
    type: 'button',
    'data-code': code,
    onclick: () => { stopped = true; show(index); },
  }, names[code] ?? code.toUpperCase()));
  const wrap = el('div', { class: 'wotd-gallery' }, stage, el('div', { class: 'wotd-gallery__chips', role: 'tablist' }, ...chips));

  let current = -1;
  let stopped = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  let timer = null;
  let midnight = null;

  function show(index) {
    if (index === current) return;
    current = index;
    const card = wordCard(languages[index], { label: names[languages[index]] ?? languages[index] });
    card.classList.add('wotd--enter');
    stage.replaceChildren(card);
    chips.forEach((chip, i) => {
      chip.classList.toggle('is-active', i === index);
      chip.setAttribute('aria-selected', String(i === index));
    });
  }

  function tick() {
    if (!stopped && !wrap.matches(':hover') && !wrap.contains(document.activeElement)) {
      show((current + 1) % languages.length);
    }
    timer = setTimeout(tick, 6000);
  }

  show(0);
  timer = setTimeout(tick, 6000);
  // A tab left open past midnight gets the new words without a reload.
  midnight = setTimeout(() => { current = -1; show(0); }, Math.max(1000, nextMidnight() - Date.now() + 1000));

  return {
    element: wrap,
    stop() { clearTimeout(timer); clearTimeout(midnight); },
  };
}
