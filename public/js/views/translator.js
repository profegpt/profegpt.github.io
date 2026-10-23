import { el, icon, ICONS, clear, debounce, postJson } from '../lib/dom.js';
import { art } from '../lib/art.js';
import { pick, t } from '../lib/i18n.js';
import { page, studyLang } from '../lib/study.js';

/**
 * The two sides of the translator: the language the site is about, and English.
 * `--es` is the study language's marker colour whichever language that is —
 * the palette has one accent per side of the pane, not one per language.
 */
const LANGUAGES = () => ({
  [studyLang()]: {
    label: t('translator.studyName'),
    colour: 'var(--es)',
    placeholder: 'translator.placeholderStudy',
    out: 'translator.outStudy',
  },
  en: {
    label: t('translator.englishName'),
    colour: 'var(--en)',
    placeholder: 'translator.placeholderEn',
    out: 'translator.outEn',
  },
});

const MAX_CHARS = 500;

/**
 * A language's front page: the hero, the translator, the dictionary search and
 * the way into the other pages. It sits at /es, /fr and /it; the bare / above
 * them is the home page, where the language is chosen (views/home.js).
 */
export function renderTranslatorPage(main) {
  // The name in Duolingo's huge lowercase green, the language under it, and
  // the language's landmark on the right.
  const hero = el('section', { class: 'hero shell' },
    el('div', { class: 'hero__copy' },
      el('h1', { class: 'hero__title' },
        el('span', {}, 'profegpt'),
        el('span', {}, t('translator.studyName'))),
      el('p', { class: 'hero__sub' }, t('hero.sub')),
      el('div', { class: 'hero__cta' },
        el('a', { class: 'btn btn--primary', href: `${page()}#traductor`, 'data-link': '' }, t('hero.ctaTranslate')),
        el('a', { class: 'btn', href: page('/chat'), 'data-link': '' }, t('hero.ctaChat')))),
    el('div', { class: 'hero__art' }, art(studyLang())));

  const translator = el('section', { class: 'translator shell', id: 'traductor' });
  buildTranslator(translator);

  const finder = buildFinder();

  const features = el('section', { class: 'features shell' },
    el('div', { class: 'features__grid' },
      feature('conjugator', page('/conjugacion'), t('features.conjugation'), t('features.conjugationBody')),
      feature('dictionary', page('/diccionario'), t('features.dictionary'), t('features.dictionaryBody')),
      feature('chat', page('/chat'), t('features.chat'), t('features.chatBody'))));

  main.append(hero, el('hr', { class: 'rule' }), translator, finder, features);
}

/** One of Duolingo's investor-site cards: a tilted picture, then the words. */
function feature(picture, href, title, body) {
  return el('a', { class: 'feature', href, 'data-link': '' },
    art(picture, { className: 'feature__art' }),
    el('div', {},
      el('h3', {}, title),
      el('p', {}, body)));
}

/** Send the visitor to the dictionary page with the query already applied. */
function openDictionary(word) {
  const query = String(word || '').trim();
  if (!query) return;
  history.pushState({}, '', `${page('/diccionario')}?q=${encodeURIComponent(query)}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// ---------------------------------------------------------------------------

function buildFinder() {
  const input = el('input', {
    type: 'search',
    name: 'q',
    placeholder: t('finder.samples').split(',')[0],
    autocomplete: 'off',
    spellcheck: false,
    'aria-label': t('finder.label'),
  });

  const form = el('form', { class: 'finder__form' },
    input,
    el('button', { class: 'btn btn--primary', type: 'submit' }, t('finder.button')));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openDictionary(input.value);
  });

  const hints = el('div', { class: 'finder__hints' },
    el('span', {}, t('finder.tryWith')),
    ...t('finder.samples').split(',').map((word) =>
      el('button', { type: 'button', onclick: () => openDictionary(word) }, word)));
  fitOnOneLine(hints);

  return el('section', { class: 'finder', id: 'buscador' },
    el('div', { class: 'shell' },
      el('div', { class: 'finder__grid' },
        el('div', {},
          el('p', { class: 'eyebrow' }, t('finder.eyebrow')),
          el('h2', {}, t('finder.title')),
          el('p', { class: 'finder__lead' }, t('finder.lead'))),
        el('div', {},
          form,
          hints))));
}

/**
 * Keep the sample words to a single line: as many as fit, never a second row.
 *
 * Measured rather than clipped with CSS, because a button clipped out of sight
 * can still be reached with Tab. Every word is shown, then any that wrapped
 * below the first line is hidden — again whenever the width changes, so a
 * wide screen offers more of them and a phone fewer.
 */
function fitOnOneLine(row) {
  const fit = () => {
    const items = [...row.children];
    for (const item of items) item.hidden = false;
    const top = items[0]?.offsetTop ?? 0;
    for (const item of items) if (item.offsetTop > top + 4) item.hidden = true;
  };
  new ResizeObserver(fit).observe(row);
}

function buildTranslator(root) {
  const state = { from: 'en', to: studyLang(), pending: null };

  const input = el('textarea', { spellcheck: false, maxLength: MAX_CHARS, 'aria-label': t('translator.sourceLabel') });

  const output = el('div', {
    class: 'pane__out',
    'aria-live': 'polite',
    'data-placeholder': t('translator.outStudy'),
  });

  const sourceLang = el('span', {});
  const targetLang = el('span', {});
  const sourceDot = el('span', { class: 'pane__dot' });
  const targetDot = el('span', { class: 'pane__dot' });
  const counter = el('span', {}, `0 / ${MAX_CHARS}`);
  const status = el('span', {}, t('translator.ready'));
  const engine = el('span', {}, '');

  /**
   * Read the translation aloud, in the language it is in — the side's own, or
   * English when the translation went into English.
   *
   * One clip per translation, kept until the text changes: pressing it twice
   * hears it again rather than paying for it again. ElevenLabs' free month is
   * shared by the whole site, so the server caps a sentence at 200 characters
   * and caches every one; past the cap the button is simply disabled. Without
   * a key it takes itself away, as the dictionary's speaker does.
   */
  let clip = null;
  let clipText = '';
  const listen = el('button', {
    class: 'speak speak--sm',
    type: 'button',
    title: t('translator.listen'),
    'aria-label': t('translator.listen'),
  }, icon(ICONS.speaker, { size: 15 }));

  listen.addEventListener('click', async () => {
    const text = output.textContent.trim();
    if (!text || listen.classList.contains('is-loading')) return;
    if (clip && clipText === text) { clip.currentTime = 0; clip.play().catch(() => {}); return; }

    listen.classList.add('is-loading');
    listen.classList.remove('speak--failed');
    try {
      const english = state.to === 'en' ? '&lang=en' : '';
      const response = await fetch(`/api/speak?text=${encodeURIComponent(text)}&study=${studyLang()}${english}`);
      if (!response.ok) {
        if (response.status === 503) { listen.remove(); return; }
        const failure = await response.json().catch(() => ({}));
        listen.classList.add('speak--failed');
        listen.title = failure.spent ? t('dictionary.speakSpent') : t('dictionary.speakFailed');
        return;
      }
      clip = new Audio(URL.createObjectURL(await response.blob()));
      clipText = text;
      await clip.play().catch(() => {});
    } catch {
      listen.classList.add('speak--failed');
      listen.title = t('dictionary.speakFailed');
    } finally {
      listen.classList.remove('is-loading');
    }
  });

  /** Nothing to read, or too long to spend the month on: the button waits. */
  function paintListen() {
    const text = output.textContent.trim();
    listen.disabled = !text || text.length > 200;
    listen.title = t('translator.listen');
    listen.classList.remove('speak--failed');
  }
  // However the translation changes — translated, cleared, swapped — the
  // button follows it.
  new MutationObserver(paintListen).observe(output, { childList: true, characterData: true, subtree: true });
  paintListen();

  const copy = el('button', { class: 'btn btn--sm', type: 'button', title: t('translator.copy') },
    icon(ICONS.copy, { size: 13 }), t('translator.copy'));

  copy.addEventListener('click', async () => {
    if (!output.textContent.trim()) return;
    try {
      await navigator.clipboard.writeText(output.textContent);
      copy.lastChild.textContent = t('translator.copied');
      setTimeout(() => { copy.lastChild.textContent = t('translator.copy'); }, 1400);
    } catch {
      copy.lastChild.textContent = t('translator.copyFailed');
      setTimeout(() => { copy.lastChild.textContent = t('translator.copy'); }, 1400);
    }
  });

  const swap = el('button', {
    class: 'swap',
    type: 'button',
    title: t('translator.swapTitle'),
    'aria-label': t('translator.swap'),
  }, icon(ICONS.swap, { size: 18 }));

  const sourcePane = el('div', { class: 'pane pane--source' },
    el('div', { class: 'pane__bar' },
      el('span', { class: 'pane__lang' }, sourceDot, sourceLang),
      el('button', { class: 'btn btn--sm', type: 'button', onclick: () => { input.value = ''; sync(); } }, t('translator.clear'))),
    el('div', { class: 'pane__body' }, input),
    el('div', { class: 'pane__foot' }, counter, status));

  const notes = el('div', { class: 'idioms' });

  const targetPane = el('div', { class: 'pane' },
    el('div', { class: 'pane__bar' },
      el('span', { class: 'pane__lang' }, targetDot, targetLang),
      el('span', { class: 'pane__tools' }, listen, copy)),
    el('div', { class: 'pane__body' }, output),
    notes,
    el('div', { class: 'pane__foot' }, engine, el('span', {})));

  /** Idioms are worth pointing at: the pairing is the thing being taught. */
  function paintNotes(list) {
    clear(notes);
    for (const note of list || []) {
      notes.appendChild(el('div', { class: 'idioms__item' },
        el('p', { class: 'idioms__pair' },
          el('span', {}, note.source),
          el('span', { class: 'idioms__arrow' }, ' = '),
          el('b', {}, note.target)),
        el('p', { class: 'idioms__meaning' }, pick(note.meaning))));
    }
  }

  root.append(
    el('div', { class: 'translator__head' },
      el('div', {},
        el('p', { class: 'eyebrow' }, t('translator.eyebrow')),
        el('h2', {}, t('translator.title')),
        el('p', {}, t('translator.lead'))),
      el('button', { class: 'btn btn--primary', type: 'button', onclick: () => translate(true) }, t('translator.button'))),
    el('div', { class: 'trio' }, sourcePane, swap, targetPane),
  );

  // --- behaviour -----------------------------------------------------------

  function paintLanguages() {
    const languages = LANGUAGES();
    const source = languages[state.from];
    const target = languages[state.to];
    sourceLang.textContent = source.label;
    targetLang.textContent = target.label;
    sourceDot.style.background = source.colour;
    targetDot.style.background = target.colour;
    input.placeholder = t(source.placeholder);
    output.dataset.placeholder = t(target.out);
  }

  function sync() {
    counter.textContent = `${input.value.length} / ${MAX_CHARS}`;
    if (!input.value.trim()) {
      clear(output);
      clear(notes);
      engine.textContent = '';
      status.textContent = t('translator.ready');
      return;
    }
    scheduleTranslate();
  }

  async function translate(force = false) {
    const text = input.value.trim();
    if (!text) return;

    state.pending?.abort();
    const controller = new AbortController();
    state.pending = controller;

    clear(status);
    status.append(el('span', { class: 'spinner' }), ` ${t('translator.working')}`);

    try {
      const data = await postJson(
        '/api/translate',
        { text, from: state.from, study: studyLang() },
        { signal: controller.signal },
      );
      if (controller.signal.aborted) return;
      output.textContent = data.translation || '';
      paintNotes(data.notes);
      engine.textContent = data.engine ? t('translator.engine', { engine: data.engine }) : '';
      status.textContent = force ? t('translator.done') : t('translator.ready');
    } catch (error) {
      if (controller.signal.aborted || error.name === 'AbortError') return;
      clear(status);
      /**
       * DeepL could not answer, and nothing else is asked. The old
       * translation is cleared rather than left standing under the new
       * sentence — it would read as the answer to it — and the reason is said
       * once, plainly, where the translation would have been.
       */
      if (error.data?.unavailable) {
        clear(output);
        clear(notes);
        engine.textContent = '';
        notes.appendChild(el('p', { class: 'translator__down' },
          el('b', {}, t('translator.unavailableTitle')),
          ` ${t('translator.unavailable')}`));
        status.textContent = t('translator.ready');
        return;
      }
      status.append(el('span', { class: 'error' }, error.message));
    } finally {
      if (state.pending === controller) state.pending = null;
    }
  }

  /**
   * One pass, once typing pauses.
   *
   * The wait is longer than it looks, and deliberately. Every pause is a
   * different prefix and so a different cache miss, and DeepL bills by the
   * character against a monthly allowance the whole class shares — so a beat
   * more patience here is a lesson's worth of headroom there.
   */
  const scheduleTranslate = debounce(() => translate(), 900);

  swap.addEventListener('click', () => {
    scheduleTranslate.cancel();
    state.pending?.abort();

    // Keep what is on screen: the translation becomes the new source text.
    const previousOutput = output.textContent;
    const previousInput = input.value;
    [state.from, state.to] = [state.to, state.from];
    input.value = previousOutput;
    output.textContent = previousOutput ? previousInput : '';

    paintLanguages();
    counter.textContent = `${input.value.length} / ${MAX_CHARS}`;

    swap.classList.toggle('is-turning');
    input.focus();

    if (input.value.trim()) translate();
    else { clear(output); clear(notes); engine.textContent = ''; status.textContent = t('translator.ready'); }
  });

  input.addEventListener('input', sync);
  input.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      scheduleTranslate.cancel();
      translate(true);
    }
  });

  paintLanguages();
  sync();
}
