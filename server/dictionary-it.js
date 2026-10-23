/**
 * The Italian dictionary.
 *
 * As with French, there is no queryable authority: the Accademia della Crusca
 * answers questions rather than publishing a dictionary, and the commercial
 * dictionaries (Treccani, Zingarelli, Hoepli) publish no API and do not license
 * their text for reuse.
 *
 * So definitions come from the Wikizionario — the Italian Wiktionary — read as
 * wikitext and normalised into exactly the shape the French lookup returns,
 * which is itself the shape the RAE route returns. The page and the tutor never
 * learn which dictionary answered.
 *
 * The Wikizionario's markup is its own, not a dialect of the Wiktionnaire's, so
 * none of the French parser could be reused beyond the generic template and
 * link handling. The differences that matter are noted where they are handled.
 */

import { accentedForm } from './accents.js';
import { throttle, USER_AGENT } from './throttle.js';

const WIKIZIONARIO = 'https://it.wiktionary.org/w/api.php';

/**
 * Part-of-speech section templates → the categories the dictionary page knows.
 *
 * On the Wikizionario a part of speech is not a heading but a bare template on
 * a line of its own — `{{-sost-|it}}` — carrying the language as its argument.
 * The argument is what tells a part of speech from the page-level sections:
 * `{{-pron-}}` with no language is the *pronunciation*, while the pronoun is
 * `{{-pronome-|it}}`. Only templates listed here open an entry.
 *
 * The `form` variants (`-verb form-`, `-sost form-`) are inflected forms — the
 * page for *mangio* says it is the first person of *mangiare* — and are kept,
 * as the French parser keeps the Wiktionnaire's `flexion` sections: someone who
 * looks up the form they met should be told what it is a form of.
 */
const PARTS_OF_SPEECH = {
  sost: 'noun',
  'sost form': 'noun',
  nome: 'proper noun',
  verb: 'verb',
  'verb form': 'verb',
  'voce verb': 'verb',
  'participio passato': 'verb',
  'participio presente': 'verb',
  agg: 'adjective',
  'agg form': 'adjective',
  'agg num': 'numeral',
  card: 'numeral',
  ord: 'numeral',
  'agg dim': 'determiner',
  'agg poss': 'determiner',
  avv: 'adverb',
  pronome: 'pronoun',
  'pronome form': 'pronoun',
  'pron dim': 'pronoun',
  'pron indef': 'pronoun',
  'pron interrog': 'pronoun',
  'pron poss': 'pronoun',
  'pron rel': 'pronoun',
  'pron rifl': 'pronoun',
  prep: 'preposition',
  cong: 'conjunction',
  inter: 'interjection',
  art: 'article',
  'loc nom': 'expression',
  'loc verb': 'expression',
  'loc agg': 'expression',
  'loc avv': 'expression',
  'loc prep': 'expression',
  'loc cong': 'expression',
  'loc inter': 'expression',
  espr: 'expression',
};

/**
 * The Wikizionario's own register and domain templates, with the label each one
 * prints. These come from its "Template ambito" category rather than from
 * guesswork, which matters: `{{Lett}}` reads like *letterario* and in fact
 * means *letteralmente*, and `{{Ant}}` is *per antonomasia*, not *antico*.
 * Domain labels proper go through `{{Term|…}}`, handled separately.
 */
const USAGE_TEMPLATES = {
  fig: 'figurato',
  est: 'per estensione',
  lett: 'letteralmente',
  pop: 'popolare',
  coll: 'colloquiale',
  spreg: 'spregiativo',
  vulg: 'volgare',
  obs: 'obsoleto',
  ant: 'per antonomasia',
  teen: 'linguaggio giovanile',
  sndc: 'per sineddoche',
  yprb: 'per iperbole',
  'spec pl': 'specialmente al plurale',
  pers: 'riferito solo a persone',
  dim: 'diminutivo',
  accr: 'accrescitivo',
  vezz: 'vezzeggiativo',
  pegg: 'peggiorativo',
  narr: 'narrativa',
};

/**
 * Verb kinds. Each prints a sub-heading ("Transitivo") and usually stands on a
 * line of its own under `{{-verb-|it}}`, applying to every sense below it until
 * the next one — *essere* has an `{{Ausiliare}}` block and then an
 * `{{Intransitivo}}` block inside the one verb section.
 */
const VERB_TEMPLATES = {
  transitivo: 'transitive',
  intransitivo: 'intransitive',
  riflessivo: 'pronominal',
  ausiliare: 'auxiliary',
};

/**
 * Language codes the etymology templates use. On the Wikizionario the language
 * is a bare template — `dal {{la}} ''casa''` — which prints its name in
 * Italian, so the prose reads "dal latino casa" only if the name is put back.
 */
const SOURCE_LANGUAGES = {
  la: 'latino', grc: 'greco antico', el: 'greco', fr: 'francese', fro: 'francese antico',
  frm: 'francese medio', en: 'inglese', ang: 'inglese antico', de: 'tedesco', goh: 'alto tedesco antico',
  nl: 'olandese', es: 'spagnolo', pt: 'portoghese', ca: 'catalano', oc: 'occitano',
  pro: 'provenzale antico', ar: 'arabo', he: 'ebraico', tr: 'turco', ru: 'russo', sa: 'sanscrito',
  fa: 'persiano', got: 'gotico', frk: 'francone', lng: 'longobardo', non: 'norreno',
  gem: 'germanico', ine: 'indoeuropeo', ja: 'giapponese', zh: 'cinese', it: 'italiano',
  vec: 'veneto', nap: 'napoletano', scn: 'siciliano', lij: 'ligure', lmo: 'lombardo',
  pms: 'piemontese', sc: 'sardo', fur: 'friulano', etr: 'etrusco', ett: 'etrusco',
};

/** Words a headword line uses to state gender and number, and nothing else. */
const GRAMMAR_WORDS = new Set(['m', 'f', 'n', 'e', 'sing', 'pl', 'plur', 'plurale', 'inv', 'solo', 'sempre']);

/** The words a synonym list uses to say which part of speech a line is for. */
const LIST_TAGS = {
  sostantivo: 'noun', verbo: 'verb', aggettivo: 'adjective', avverbio: 'adverb',
  pronome: 'pronoun', preposizione: 'preposition', congiunzione: 'conjunction',
  interiezione: 'interjection', articolo: 'article',
};

// ---------------------------------------------------------------------------
// wikitext
// ---------------------------------------------------------------------------

/** References and formatting tags, which are markup rather than text. */
function stripHtml(text) {
  return String(text)
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '');
}

/**
 * Images and categories, removed whole.
 *
 * The Wikizionario drops pictures into the middle of definitions —
 * `… abitazione [[File:Casa.jpg|thumb|una casa in [[pietra]]]]` — and the
 * caption has links of its own, so a simple `[[…]]` pattern stops at the first
 * inner `]]` and leaves "una casa in pietra" glued onto the definition. Hence a
 * scan that counts brackets.
 */
function stripFiles(text) {
  let out = String(text);
  const opener = /\[\[\s*(?:File|Immagine|Image|Categoria|Category)\s*:/i;
  for (let match = opener.exec(out); match; match = opener.exec(out)) {
    let depth = 0;
    let end = out.length;
    for (let i = match.index; i < out.length - 1; i += 1) {
      const two = out.slice(i, i + 2);
      if (two === '[[') { depth += 1; i += 1; continue; }
      if (two === ']]') {
        depth -= 1; i += 1;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    out = out.slice(0, match.index) + out.slice(end);
  }
  return out;
}

/** `[[destinazione|testo]]` → testo, `[[parola]]` → parola, and emphasis dropped. */
function unlink(text) {
  return String(text)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    // Bold-italic, bold and italic nest freely ('''''Il''' nonno'') and are
    // not always balanced, so the marks are removed rather than matched.
    .replace(/'{2,}/g, '');
}

/**
 * Split a template's arguments, respecting the templates and links nested
 * inside it — `{{Vd|curva d'inseguimento}}` has one, `{{Term|matematica|it|aritmetica}}` three.
 */
function splitArgs(body) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < body.length; i += 1) {
    const two = body.slice(i, i + 2);
    if (two === '{{' || two === '[[') { depth += 1; current += two; i += 1; continue; }
    if (two === '}}' || two === ']]') { depth -= 1; current += two; i += 1; continue; }
    if (body[i] === '|' && depth === 0) { parts.push(current); current = ''; continue; }
    current += body[i];
  }
  parts.push(current);
  return parts.map((part) => part.trim());
}

/**
 * Replace the innermost `{{…}}` repeatedly, so nested templates unwind from
 * the inside out. `render` decides what each one becomes; anything it returns
 * null for disappears.
 */
function expandTemplates(text, render) {
  let out = String(text);
  for (let pass = 0; pass < 8; pass += 1) {
    const next = out.replace(/\{\{([^{}]*)\}\}/g, (_match, body) => {
      const args = splitArgs(body);
      return render(args[0].toLowerCase().trim(), args.slice(1)) ?? '';
    });
    if (next === out) break;
    out = next;
  }
  return out.replace(/\{\{|\}\}/g, '');
}

/** Whitespace and the space-before-punctuation that template removal leaves behind. */
function tidy(text) {
  return String(text)
    .replace(/\s+/g, ' ')
    // Italian, unlike French, puts no space before any punctuation mark.
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .trim();
}

/**
 * Clean a definition line, pulling its labels out as they go.
 * @param {string} word  the headword, which `{{Pn}}` stands for
 */
function readDefinition(line, word) {
  const labels = [];
  const verbKinds = [];
  let missing = false;

  const expanded = expandTemplates(stripFiles(line), (name, args) => {
    // {{Pn}} is "this page's name" — the word itself, wherever it is used.
    if (name === 'pn') return word;
    if (USAGE_TEMPLATES[name]) { labels.push(USAGE_TEMPLATES[name]); return null; }
    if (VERB_TEMPLATES[name]) { verbKinds.push(VERB_TEMPLATES[name]); return null; }
    // {{Term|architettura|it}} — a domain or register; the language is noise.
    if (name === 'term') {
      // Sometimes linked: {{Term|[[anatomia]]|it}}.
      const label = args.find((arg) => arg && arg !== 'it' && !arg.includes('='));
      if (label) labels.push(unlink(label));
      return null;
    }
    if (name === 'glossa') { if (args[0]) labels.push(args[0]); return null; }
    if (name === 'vd') return args[0] ? `vedi ${args[1] || args[0]}` : null;
    if (name === 'taxon') return args[0] ?? null;
    if (name === 'w') return args[1] || args[0] || null;
    // "definition missing" — a placeholder sense, which is worse than none.
    if (name === 'nodef') { missing = true; return null; }
    return null;
  });

  const description = tidy(stripHtml(unlink(expanded)))
    .replace(/^[\s,.;:]+/, '')
    // A trailing colon introduced examples that are not shown here.
    .replace(/\s*[.:]$/, '')
    .trim();

  return {
    description: missing ? '' : description,
    usage: [...new Set(labels)].join(', '),
    verbCategory: verbKinds.join(', '),
  };
}

/**
 * Gender from the italic marks on a headword line.
 *
 * `{{Pn|w}} ''f sing''`, `{{Pn}} ''m'' e ''f sing''`, `{{Pn}} ''m e f''`: the
 * gender is whatever m and f appear in italics. Bold is removed first because
 * a headword in bold (`'''E, e'''`) would otherwise read as italics around an
 * "e" — and "e" is also the "and" of "m e f".
 */
function readGender(line) {
  const italics = [...String(line).replace(/'''[^']*'''/g, '').matchAll(/''([^']+)''/g)]
    .map((match) => match[1]).join(' ');
  const tokens = italics.toLowerCase().split(/[\s.,]+/);
  const masculine = tokens.includes('m');
  const feminine = tokens.includes('f');
  if (masculine && feminine) return 'masculine_and_feminine';
  if (masculine) return 'masculine';
  if (feminine) return 'feminine';
  return '';
}

/**
 * Whether a `#` line is the headword rather than a definition.
 *
 * Most pages put the headword on its own line and number the senses with `#`,
 * but some — *casa* among them — number the headword itself
 * (`# {{Pn|w}} ''f sing'' {{Linkp|case}}`) and put the senses one level down on
 * `#*`, which everywhere else is an example. A `#` line that is nothing but the
 * headword, gender and plural is the sign of that layout.
 */
function isHeadwordLine(line) {
  const rest = String(line)
    .replace(/\{\{\s*(?:Pn|Linkp|Tabs|It-decl[^|}]*|\d)\b[^{}]*\}\}/gi, '')
    .replace(/''([^']*)''/g, (match, inner) => (
      inner.toLowerCase().split(/[\s.,]+/).filter(Boolean).every((token) => GRAMMAR_WORDS.has(token))
        ? ''
        : match));
  return !/[\p{L}\p{N}]/u.test(stripHtml(unlink(rest)));
}

// ---------------------------------------------------------------------------
// the entry
// ---------------------------------------------------------------------------

/** Everything under `== {{-it-}} ==`, and nothing from any other language. */
function italianSection(wikitext) {
  const start = /^==\s*\{\{-it-\}\}\s*==\s*$/m.exec(wikitext);
  if (!start) return null;
  const rest = wikitext.slice(start.index + start[0].length);
  // Any level-two heading ends it: the next language, or "Altri progetti".
  const end = /^==[^=]/m.exec(rest);
  return end ? rest.slice(0, end.index) : rest;
}

/**
 * The section's blocks, split on the section templates.
 *
 * Sections on the Wikizionario are not `===` headings but templates alone on a
 * line — `{{-sost-|it}}`, `{{-etim-}}`, `{{-sin-}}` — so the page is cut at each
 * of those and every piece is named by its template.
 */
function blocks(section) {
  const markers = [...section.matchAll(/^\{\{\s*-([^{}|]+?)-\s*(\|[^{}]*)?\}\}[ \t]*$/gm)];
  return markers.map((marker, i) => ({
    name: marker[1].trim().toLowerCase(),
    language: (marker[2] ?? '').split('|')[1]?.trim() ?? '',
    body: section.slice(marker.index + marker[0].length,
      i + 1 < markers.length ? markers[i + 1].index : section.length),
  }));
}

function readEtymology(body) {
  // The first line that says something; later lines are often a second
  // dictionary's competing account ("Treccani: …"), and the first one will do.
  const first = body.split('\n').map((line) => line.trim())
    .find((line) => line && !/^\{\{[^{}]*\}\}$/.test(line) && !line.startsWith('*'));
  if (!first) return '';

  // `:''(sostantivo)'' dal …` — a page with two etymologies labels each with
  // the part of speech it is for; the label is not part of the account.
  const line = first.replace(/^:+\s*/, '').replace(/^'{2,3}\s*\([^)]*\)\s*'{2,3}\s*/, '');

  const expanded = expandTemplates(stripFiles(line), (name, args) => {
    if (SOURCE_LANGUAGES[name]) return SOURCE_LANGUAGES[name];
    if (name === 'w') return args[1] || args[0] || null;
    return null;
  });

  return tidy(stripHtml(unlink(expanded))).slice(0, 300);
}

/**
 * Synonym or antonym lists, kept with the part of speech they belong to.
 *
 * The Wikizionario keeps one synonyms section for the whole page, below every
 * part of speech, and marks which lines are for which with a qualifier —
 * `'''(sostantivo)''' causa, motivo` — that holds until the next one. Lines
 * before any such mark are for the first entry. Each line is itself a
 * comma-separated list, often opened by a sense qualifier in italics, which
 * says which meaning the words are for and is not one of them.
 *
 * @returns {Map<string|null, string[]>} category (null = unmarked) → words
 */
function readList(body) {
  const lists = new Map();
  let tag = null;

  for (const raw of body.split('\n')) {
    if (!/^\*/.test(raw)) continue;
    let line = raw.replace(/^\*+\s*/, '');

    const marked = /^'{2,3}\s*\(([^)]*)\)\s*'{2,3}/.exec(line);
    const named = marked && LIST_TAGS[marked[1].trim().toLowerCase()];
    if (named) tag = named;

    line = stripFiles(line)
      .replace(/'{2,3}\s*\([^)]*\)\s*'{2,3}/g, '')
      .replace(/\([^)]*\)/g, '')
      // and one left open — "(per es. palazzo" — runs to the end of the line.
      .replace(/\([^)]*$/, '');
    line = expandTemplates(line, () => null);

    // Commas separate the words, and now and then a full stop typed for one.
    const words = stripHtml(unlink(line)).split(/[,;]|\.\s/)
      .map((word) => word.split(/[:(]/)[0].replace(/\s+/g, ' ').trim().replace(/[.?!]+$/, '').trim())
      .filter((word) => word && word.length < 40 && !/^(es|per es)\b/.test(word));

    const list = lists.get(tag) ?? [];
    for (const word of words) if (!list.includes(word)) list.push(word);
    lists.set(tag, list);
  }
  return lists;
}

/** Hand the lists to the entries they belong to: the first sense of each. */
function attachList(entries, lists, key) {
  for (const [tag, words] of lists) {
    const entry = (tag && entries.find((item) => item.category === tag)) || entries[0];
    if (!entry?.senses.length) continue;
    const sense = entry.senses[0];
    sense[key] = [...new Set([...sense[key], ...words])].slice(0, 8);
  }
}

/** The senses under one part-of-speech template. */
function readSenses(body, category, word, startAt) {
  const lines = body.split('\n');

  // The headword line is among the first few: unnumbered by preference, since
  // a definition can mention {{Pn}} too, and numbered only in the casa layout.
  const opening = lines.slice(0, 6);
  const headword = opening.find((line) => !line.startsWith('#')
      && (/\{\{\s*Pn\b/i.test(line) || /^\s*'''/.test(line)))
    ?? opening.find((line) => /^#[^#*:]/.test(line) && isHeadwordLine(line.replace(/^#\s*/, '')))
    ?? '';
  const gender = readGender(headword);

  const senses = [];
  let number = startAt;
  let verbKind = '';
  let headwordNumbered = false;

  const add = (text) => {
    const { description, usage, verbCategory } = readDefinition(text, word);
    if (!description || description.length < 2) return;
    number += 1;
    senses.push({
      number,
      category,
      verbCategory: verbCategory || verbKind,
      gender,
      usage,
      description,
      usageNotes: [],
      synonyms: [],
      antonyms: [],
    });
  };

  for (const line of lines) {
    // {{Intransitivo|it}} alone on a line: every sense below is intransitive.
    const kind = /^\{\{\s*([A-Za-z]+)\s*(\|[^{}]*)?\}\}\s*$/.exec(line.trim());
    if (kind && VERB_TEMPLATES[kind[1].toLowerCase()]) {
      verbKind = VERB_TEMPLATES[kind[1].toLowerCase()];
      continue;
    }

    if (/^#[^#*:]/.test(line) || line.trim() === '#') {
      const text = line.replace(/^#\s*/, '');
      if (isHeadwordLine(text)) { headwordNumbered = true; continue; }
      headwordNumbered = false;
      add(text);
      continue;
    }

    // The casa layout: under a numbered headword, `#*` lines are the senses —
    // unless they are in italics, which is how an example is written in
    // either layout.
    if (headwordNumbered && /^#\*[^*:]/.test(line)) {
      const text = line.replace(/^#\*\s*/, '');
      if (!text.startsWith("''")) add(text);
    }
  }

  return { gender, senses };
}

/**
 * The etymology and the entries — one per part of speech, each with its
 * numbered senses — of the Italian section of a page, or null if it has none.
 *
 * Exported for the tests, which feed it wikitext rather than the network.
 * @param {string} wikitext  the whole page
 * @param {string} word      the page title, which `{{Pn}}` stands for
 */
export function readItalianEntry(wikitext, word) {
  const section = italianSection(String(wikitext ?? ''));
  if (!section) return null;

  const entries = [];
  let origin = '';
  let synonyms = new Map();
  let antonyms = new Map();
  let number = 0;

  for (const block of blocks(section)) {
    const category = PARTS_OF_SPEECH[block.name];
    if (category && block.language === 'it') {
      const { gender, senses } = readSenses(block.body, category, word, number);
      number += senses.length;
      if (senses.length) entries.push({ category, gender, senses });
      continue;
    }
    if (block.name === 'etim' && !origin) origin = readEtymology(block.body);
    if (block.name === 'sin') synonyms = readList(block.body);
    if (block.name === 'ant') antonyms = readList(block.body);
  }

  attachList(entries, synonyms, 'synonyms');
  attachList(entries, antonyms, 'antonyms');

  return { origin, entries };
}

// ---------------------------------------------------------------------------
// lookup
// ---------------------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

async function wiki(params, attempt = 0) {
  const url = new URL(WIKIZIONARIO);
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  url.searchParams.set('origin', '*');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  // The same queue as the Wiktionnaire and the corpus: Wikimedia limits by
  // address across all its wikis, so a separate queue per wiki would only let
  // two bursts collide. See server/throttle.js.
  const response = await throttle('wikimedia', 180, () => fetch(url, {
    headers: { accept: 'application/json', 'user-agent': USER_AGENT },
    signal: AbortSignal.timeout(15000),
  }));

  // A short wait clears a brief throttle; anything longer is surfaced as a
  // rate limit, so the page can say so rather than reporting a broken dictionary.
  if (response.status === 429 || response.status >= 500) {
    if (attempt < 2) {
      await wait(700 * (attempt + 1));
      return wiki(params, attempt + 1);
    }
    if (response.status === 429) {
      const error = new Error('Il dizionario sta limitando le consultazioni. Riprova tra un istante.');
      error.status = 429;
      throw error;
    }
  }

  if (!response.ok) throw new Error(`Il Wikizionario ha risposto ${response.status}`);
  return response.json();
}

/** Words to offer when the one asked for is not there. */
async function suggestions(word) {
  try {
    const body = await wiki({ action: 'opensearch', search: word, limit: '6', namespace: '0' });
    return (body?.[1] || []).filter((item) => item.toLowerCase() !== word.toLowerCase()).slice(0, 5);
  } catch {
    return [];
  }
}

/**
 * The same word with its accents back, if that is what was meant.
 *
 * Italian marks only a final stressed vowel, so the words that lose an accent
 * are the very common ones — *città*, *perché*, *caffè*, *più* — and students
 * type them without. The search index folds accents where opensearch does not.
 *
 * Where both a grave and an acute spelling come back, the search's own order
 * decides; *perchè* is a common misspelling with a page of its own, but it
 * ranks below *perché*.
 */
async function accentedTitle(word) {
  try {
    const body = await wiki({
      action: 'query', list: 'search', srsearch: word, srlimit: '8', format: 'json',
    });
    const titles = (body?.query?.search ?? []).map((hit) => hit.title);
    // Standard spelling puts a grave accent on a, i, o and u — più, città —
    // and an acute only ever on e. The wiki also keeps pages for the rarer
    // acute spellings (*piú*, "variante ricercata"), and the search can rank
    // one first, so those go to the back. Between è and é there is no rule to
    // apply (caffè, perché), and the search's order stands.
    const unusual = (title) => /[áíóú]/i.test(title);
    const ordered = [...titles.filter((title) => !unusual(title)), ...titles.filter(unusual)];
    return accentedForm(word, ordered);
  } catch {
    return null;
  }
}

/**
 * Look an Italian word up.
 * @returns {Promise<{found: boolean, word?: string, entries?: Array, origin?: string, suggestions?: string[], corrected?: {from: string, to: string}}>}
 */
export async function fetchWikizionario(word, { corrected = null } = {}) {
  // redirects=1 for the same reason as the French: an elided form typed with a
  // straight apostrophe, or a spelling variant, is a redirect on the wiki.
  const body = await wiki({
    action: 'parse', page: word, prop: 'wikitext', redirects: '1',
  });

  // Tried once, and only when the word as typed is not there at all: someone
  // who wrote "citta" meant "città".
  const retry = async () => {
    if (corrected) return { found: false, suggestions: await suggestions(word) };
    const accented = await accentedTitle(word);
    if (!accented) return { found: false, suggestions: await suggestions(word) };
    const second = await fetchWikizionario(accented, { corrected: word });
    return second.found ? { ...second, corrected: { from: word, to: accented } } : second;
  };

  if (body.error) {
    if (body.error.code === 'missingtitle' || body.error.code === 'nosuchpageid') return retry();
    throw new Error(body.error.info || 'Il Wikizionario ha rifiutato la richiesta.');
  }

  const wikitext = body?.parse?.wikitext;
  if (!wikitext) return retry();

  const title = body.parse.title || word;
  // The page may exist with no Italian in it — "maison" is French on
  // it.wiktionary — and answering with that would be worse than not finding it.
  const entry = readItalianEntry(wikitext, title);
  if (!entry?.entries.length) return retry();

  return {
    found: true,
    word: title,
    origin: entry.origin,
    entries: entry.entries,
  };
}

export const WIKIZIONARIO_CREDIT = {
  name: 'Wikizionario',
  url: 'https://it.wiktionary.org',
  licence: 'CC BY-SA',
};
