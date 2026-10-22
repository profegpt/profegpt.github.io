/**
 * Translation, by DeepL — with Wikipedia keeping names right.
 *
 * DeepL is the only engine that translates. Wikipedia is asked one narrow
 * question first: is this phrase the name of something, and what does the
 * other language call it? Machine translation renders names literally — "Cuban
 * Missile Crisis" becomes *crisis de los misiles cubanos*, which says the
 * missiles were Cuban when they were Soviet — and Wikipedia's cross-language
 * links hold the name each language actually uses. That is a lookup, not a
 * translation, and when Wikipedia has nothing to say DeepL's sentence stands.
 *
 * There used to be a chain beneath DeepL — Lingva, MyMemory and Apertium —
 * each one tried when the one above it declined. The lower rungs are what made the translator unreliable rather than
 * what kept it up: MyMemory returns stored translations of other people's
 * sentences ("Good morning Najlaa how are you?"), Apertium has no English–French
 * or English–Italian pair and goes through Catalan to get there ("Les rêves de
 * chat noirs"), and every answer they gave looked exactly as trustworthy on the
 * page as DeepL's did.
 *
 * A student copies what the box says. A wrong translation is taken home and
 * learned; a translator that says it is not working is simply tried again
 * later. So when DeepL cannot answer — no key, the month's characters spent,
 * the service down — this says so, and the page says the translator is
 * unavailable. No translation is better than a wrong one.
 *
 * No language model translates, either; the site has none.
 */

import { alreadyIdiomatic, findIdioms, wantsProgressive } from './idioms.js';
import { deepl } from './deepl.js';
import { USER_AGENT } from './throttle.js';

const WIKIPEDIA = (lang) => `https://${lang}.wikipedia.org/w/api.php`;

const normalise = (text) => String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^\p{L}\p{N}\s]/gu, '')
  .replace(/\s+/g, ' ')
  .trim();

/** Replace `find` in `text`, keeping the capitalisation that was already there. */
function substitute(text, find, replacement, { progressive = null, to = null } = {}) {
  const pattern = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  return text.replace(pattern, (match, offset) => {
    // An auxiliary already standing in front of the slot wants the gerund, not
    // a finite clause — "está lloviendo a cántaros", never "está llueve".
    const chosen = progressive && wantsProgressive(text.slice(0, offset), to)
      ? progressive
      : replacement;
    return /^\p{Ll}/u.test(match) ? chosen.charAt(0).toLowerCase() + chosen.slice(1) : chosen;
  });
}

/**
 * A phrase worth asking Wikipedia about: several words, but not prose.
 * Sentence punctuation inside the text means it is a sentence, not a title;
 * a single word is left to the ordinary engines, since the encyclopedia's
 * article for a common noun is often about the wrong thing.
 */
function looksLikeAName(text) {
  const trimmed = text.trim();
  if (trimmed.length > 80) return false;
  // A title does not end in a full stop, and does not contain sentence punctuation.
  if (/[.!?;:,]/.test(trimmed)) return false;
  if (/\n/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  return words.length >= 2 && words.length <= 8;
}

/**
 * Words a name does not begin or end with. Trims the candidate list sharply.
 *
 * The pronouns and the rest of "to be" are here for a reason worth writing
 * down: *am* was missing while *is*, *are*, *was* and *were* were present, and
 * Wikipedia has an article called "I Am". So every sentence a student is most
 * likely to write — "I am tired", "I am a student" — came back as "I Am
 * fatigué", the two commonest words in English restored as the title of an
 * album.
 */
const EDGE_WORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'from', 'by', 'with',
  'was', 'were', 'is', 'are', 'am', 'be', 'been', 'being', 'has', 'have', 'had', 'that',
  'this', 'these', 'those', 'it', 'as', 'do', 'does', 'did', 'not', 'no', 'so', 'very',
  'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'y', 'o', 'en', 'con',
  'por', 'para', 'que', 'fue', 'era', 'es', 'son', 'ser', 'muy', 'su', 'sus', 'se', 'al', 'lo',
  'yo', 'tu', 'él', 'ella', 'nosotros', 'ellos', 'estoy', 'soy', 'eres', 'está', 'están',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'suis', 'est', 'sont', 'les',
  'des', 'du', 'et', 'ou', 'ne', 'pas', 'mon', 'ma', 'mes', 'son', 'sa', 'ses', 'ce', 'cette',
  'il', 'lo', 'gli', 'le', 'uno', 'di', 'della', 'nel', 'e', 'non', 'che', 'per', 'io', 'lui',
  'lei', 'noi', 'voi', 'loro', 'sono', 'sei', 'è', 'siamo', 'era', 'mio', 'mia', 'suo', 'sua',
]);

/**
 * A name has to contain something that is not an everyday word.
 *
 * Guarding only the edges is not enough — it stops "I am tired" but not "am I
 * tired", and the failure is the same either way. A span made entirely of words
 * this common is a sentence fragment, whatever Wikipedia may also happen to
 * call an album.
 */
export function allEverydayWords(span) {
  const words = span.toLowerCase().match(/[\p{L}\p{N}'’-]+/gu) ?? [];
  return words.length > 0 && words.every((word) => EDGE_WORDS.has(word));
}

const MIN_NAME_WORDS = 2;
const MAX_NAME_WORDS = 5;
const MAX_CANDIDATES = 45;   // one Wikipedia request holds 50 titles
const MAX_NAMES = 3;

/**
 * Every phrase in the text that could be a name.
 *
 * Capitalisation is not required: a student types "the cuban missile crisis"
 * in lower case and still deserves the real name back. Instead every span of
 * two to five words is a candidate, minus those starting or ending on a
 * function word, and the encyclopedia decides which are real — all of them in
 * a single request.
 */
function nameCandidates(text) {
  const words = [...text.matchAll(/[\p{L}\p{N}''-]+/gu)];
  const spans = [];

  for (let size = MAX_NAME_WORDS; size >= MIN_NAME_WORDS; size -= 1) {
    for (let i = 0; i + size <= words.length; i += 1) {
      const first = words[i];
      const last = words[i + size - 1];
      if (EDGE_WORDS.has(first[0].toLowerCase())) continue;
      if (EDGE_WORDS.has(last[0].toLowerCase())) continue;
      const span = text.slice(first.index, last.index + last[0].length);
      if (allEverydayWords(span)) continue;
      spans.push(span);
    }
  }

  return [...new Set(spans)].slice(0, MAX_CANDIDATES);
}

/**
 * Ask Wikipedia which of these phrases are articles, and what each is called in
 * the other language — in one request rather than one per phrase.
 * @returns {Promise<Map<string, string>>} phrase as written → established name
 */
async function officialNames(phrases, from, to) {
  const found = new Map();
  if (!phrases.length) return found;

  const url = new URL(WIKIPEDIA(from));
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', phrases.join('|'));
  url.searchParams.set('prop', 'langlinks');
  url.searchParams.set('lllang', to);
  url.searchParams.set('redirects', '1');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');

  const response = await fetch(url, {
    headers: { accept: 'application/json', 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) return found;

  const query = (await response.json())?.query;
  if (!query) return found;

  // A title travels query -> normalised -> redirect before naming a page, and
  // the answer has to be traced back to the phrase the reader actually wrote.
  const step = (pairs) => new Map((pairs || []).map((pair) => [pair.from, pair.to]));
  const normalised = step(query.normalized);
  const redirected = step(query.redirects);

  const pages = new Map();
  for (const page of Object.values(query.pages || {})) {
    // A missing page is not a name at all; a page with no langlink is a name
    // the other language has never given itself a word for, so nothing to put in.
    if (page?.missing !== undefined) continue;
    if (!isProperName(page.title)) continue;
    pages.set(page.title, page?.langlinks?.[0]?.['*'] ?? null);
  }

  for (const phrase of phrases) {
    const resolved = redirected.get(normalised.get(phrase) ?? phrase)
      ?? normalised.get(phrase) ?? phrase;
    if (!pages.has(resolved)) continue;
    const link = pages.get(resolved);
    if (link) found.set(phrase, link);
  }

  return found;
}

/**
 * Wikipedia capitalises a title only where the words are proper nouns, so the
 * title itself says whether an article names something. "Cuban Missile Crisis"
 * and "Statue of Liberty" do; "Social studies" and "Train station" do not —
 * and without this check "history class" is an article too, and a sentence
 * about one comes back talking about social studies.
 */
function isProperName(title) {
  return (String(title).match(/\b\p{Lu}[\p{L}]*/gu) || []).length >= 2;
}

/** One phrase, for the whole-input path. */
async function officialName(phrase, from, to) {
  const found = await officialNames([phrase], from, to);
  return found.get(phrase) ?? null;
}

/** Drop names contained inside a longer one that also matched. */
function longestFirst(names) {
  const kept = [];
  for (const phrase of [...names.keys()].sort((a, b) => b.length - a.length)) {
    if (kept.some((existing) => normalise(existing).includes(normalise(phrase)))) continue;
    kept.push(phrase);
    if (kept.length >= MAX_NAMES) break;
  }
  return kept;
}

/**
 * Put the established names back into a finished translation.
 *
 * A translator renders a name literally wherever it appears, so "The Cuban
 * Missile Crisis was a serious event" becomes "La crisis de los misiles
 * cubanos fue…" — the wrong name, now buried in a sentence where the
 * whole-input lookup cannot see it. Each name is looked up, translated on its
 * own to learn how this engine renders it, and that rendering swapped for the
 * real name.
 */
async function restoreNames(source, translated, from, to, translateSpan) {
  const names = await officialNames(nameCandidates(source), from, to);
  if (!names.size) return translated;

  let result = translated;
  for (const phrase of longestFirst(names)) {
    const official = names.get(phrase);
    const literal = await translateSpan(phrase).catch(() => null);
    if (!literal || normalise(literal) === normalise(official)) continue;
    result = substitute(result, literal, official);
  }
  return result;
}

/**
 * The established name, rather than a literal rendering of one.
 * Falls through silently when the phrase is not an article title.
 */
async function namedEntity(text, from, to) {
  // Tested before anything is stripped: trimming a trailing full stop first
  // would let a sentence through the very gate meant to catch it.
  if (!looksLikeAName(text)) return null;

  // The same guard the in-sentence search uses. Wikipedia has an article called
  // "I Am", and without this a whole input of ordinary words could be answered
  // with a title instead of a translation.
  if (allEverydayWords(text)) return null;

  const phrase = text.trim().replace(/[¿¡]/g, '');

  const link = await officialName(phrase, from, to).catch(() => null);
  return link ? { text: link, engine: 'Wikipedia' } : null;
}

/**
 * Swap a word-for-word rendering of an idiom for the equivalent idiom.
 *
 * This is the one thing laid over DeepL's answer, and it is not a second
 * engine: the replacements are the site's own hand-checked pairs in
 * idioms.js, put in only where DeepL rendered the idiom literally.
 *
 * "Literally" has to mean *this* rendering, though, not this idiom in general.
 * The stored form is a citation, and a translation that has the idiom in some
 * other inflection has got it right: replacing *está lloviendo a cántaros* with
 * the citation form yields "está llueve a cántaros", which is worse than the
 * literal translation the feature exists to repair. So the idiom is only put in
 * where it is genuinely absent — checked twice, on the sentence and on the span
 * — and the note is shown either way, since the pairing is the thing being
 * taught.
 */
async function restoreIdioms(source, translated, from, to) {
  const idioms = findIdioms(source, from, to);
  if (!idioms.length) return { text: translated, notes: [] };

  let result = translated;
  const notes = [];

  for (const idiom of idioms) {
    notes.push({ source: idiom.source, target: idiom.say, meaning: idiom.meaning });

    // DeepL already said it idiomatically — leave its grammar alone.
    if (alreadyIdiomatic(result, idiom.say)) continue;

    // Trimmed: a span that comes back with a leading space will not match the
    // same words inside the sentence, and the repair silently does nothing.
    // eslint-disable-next-line no-await-in-loop
    const literal = (await deepl(idiom.phrase, from, to).catch(() => null))?.text?.trim();
    if (!literal) continue;
    if (alreadyIdiomatic(literal, idiom.say)) continue;
    if (normalise(literal) === normalise(idiom.say)) continue;

    result = substitute(result, literal, idiom.say, { progressive: idiom.progressive, to });
  }

  return { text: result, notes };
}

/**
 * Translate with DeepL — names put right by Wikipedia — or fail plainly.
 *
 * The error carries `unavailable: true` and a 503, so the page can tell the
 * reader the translator is down rather than showing them DeepL's own words.
 * Why DeepL declined is kept on the error for the server log.
 *
 * @returns {Promise<{text: string, engine: string, notes: Array}>}
 */
export async function translate(text, from, to) {
  // A whole input that is a name is answered with the name, and DeepL is not
  // asked at all.
  const named = await namedEntity(text, from, to);
  if (named) return { ...named, notes: [] };

  let result;
  try {
    result = await deepl(text, from, to);
  } catch (cause) {
    const error = new Error(`DeepL could not translate: ${cause.message}`);
    error.status = 503;
    error.unavailable = true;
    throw error;
  }

  const translateSpan = async (span) => (await deepl(span, from, to)).text;
  const withNames = await restoreNames(text, result.text, from, to, translateSpan)
    .catch(() => result.text);
  const withIdioms = await restoreIdioms(text, withNames, from, to)
    .catch(() => ({ text: withNames, notes: [] }));

  return {
    text: withIdioms.text.replace(/[ \t]{2,}/g, ' ').trim(),
    engine: result.engine,
    notes: withIdioms.notes,
  };
}
