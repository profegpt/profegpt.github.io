/**
 * The Dutch dictionary.
 *
 * As with French and Italian, there is no queryable authority: the Woordenlijst
 * of the Taalunie is a spelling list with no definitions in it, and Van Dale —
 * the dictionary a Dutch speaker would name — publishes no API and does not
 * license its text for reuse.
 *
 * So definitions come from the WikiWoordenboek — the Dutch Wiktionary — read as
 * wikitext and normalised into exactly the shape the Italian lookup returns,
 * which is the shape the French one returns and, before it, the RAE route. The
 * page and the tutor never learn which dictionary answered.
 *
 * The WikiWoordenboek's markup is its own. It shares the Wikizionario's habit
 * of making a section out of a bare template (`{{-noun-|nld}}`), but nearly
 * everything under that template is different: the headword and its gender are
 * one template (`{{-l-|n}}`), a register or field label is a template named
 * after the label itself (`{{informeel|nld}}`), an inflected form is a single
 * template with no definition line at all (`{{noun-pl|huis}}`), and synonyms
 * say which numbered sense they belong to. The differences that matter are
 * noted where they are handled.
 */

import { accentedForm } from './accents.js';
import { throttle, USER_AGENT } from './throttle.js';

const WIKIWOORDENBOEK = 'https://nl.wiktionary.org/w/api.php';

/**
 * Part-of-speech section templates → the categories the dictionary page knows.
 *
 * The list is the wiki's own "Woordsoortsjablonen" category rather than a
 * guess. As on the Wikizionario, the argument is what tells a part of speech
 * from a page-level section: `{{-abbr-|nld}}` opens an entry for an
 * abbreviation, while `{{-abbr-}}` with nothing after it is the list of
 * abbreviations *of* the word above. The argument is `nld`, or `0` where the
 * editors did not want the page put in a category — inflected forms mostly,
 * but real entries too (the *de* of "de facto" is `{{-prep-|0}}`).
 *
 * Affixes, letters and symbols have templates of their own and are left out:
 * nobody looks those up here, and the page has no name for them.
 */
const PARTS_OF_SPEECH = {
  noun: 'noun',
  name: 'proper noun',
  verb: 'verb',
  // A participle with an entry of its own: a deelwoord is a form of a verb.
  prcp: 'verb',
  adjc: 'adjective',
  adverb: 'adverb',
  'adverb-num': 'adverb',
  // The voornaamwoordelijk bijwoord — ervan, daarop — is an adverb by name.
  'pron-adv': 'adverb',
  // Partikels (toch, even, maar) are what school grammar calls bijwoorden.
  prtc: 'adverb',
  pronoun: 'pronoun',
  'pronom-pers': 'pronoun',
  'pronom-pos': 'pronoun',
  'pronom-dem': 'pronoun',
  'pronom-indef': 'pronoun',
  'pronom-int': 'pronoun',
  'pronom-int2': 'pronoun',
  'pronom-excl': 'pronoun',
  'pronom-rel': 'pronoun',
  'pronom-refl': 'pronoun',
  'pronom-rec': 'pronoun',
  'pronom-temp': 'pronoun',
  prep: 'preposition',
  'prep-form': 'preposition',
  // An achterzetsel is a preposition that follows its noun.
  post: 'preposition',
  conj: 'conjunction',
  interj: 'interjection',
  art: 'article',
  num: 'numeral',
  'num-indef': 'numeral',
  'num-distr': 'numeral',
  'num-int': 'numeral',
  'num-srt': 'numeral',
  ordn: 'numeral',
  'ordn-indef': 'numeral',
  cont: 'contraction',
  phrase: 'expression',
  // An abbreviation is not a part of speech the page has a name for, so the
  // entry carries none; its senses say "afkorting" in their own label.
  abbr: '',
};

/**
 * Templates that match the section pattern and are not sections.
 *
 * `{{-l-|n}}` is the headword line, and `{{-nlnoun-|…}}`, `{{-nlstam-|…}}` and
 * their kin are the inflection tables. Either can stand between a part of
 * speech and its senses, so cutting the page at them would orphan the senses.
 */
const isTable = (name) => name === 'l' || /^nl[a-z]/.test(name) || /-tab$/.test(name) || name === 'demo';

/**
 * Gender, as `{{-l-|…}}` spells it.
 *
 * `fm` is the wiki's code for "originally feminine, usually masculine in the
 * Netherlands" — the ordinary de-word, printed v/m. `mfn` is a word that takes
 * both *de* and *het*, which is what the page's "ambiguous" means. `p` is a
 * plural-only headword and has no gender to state.
 */
const GENDERS = {
  n: 'neuter',
  o: 'neuter',
  m: 'masculine',
  f: 'feminine',
  v: 'feminine',
  fm: 'masculine_and_feminine',
  mf: 'masculine_and_feminine',
  'm/v': 'masculine_and_feminine',
  'v/m': 'masculine_and_feminine',
  mfn: 'ambiguous',
  c: 'common',
  g: 'common',
};

/**
 * Verb kinds, each an inline template at the head of the sense it applies to.
 *
 * The wiki splits the intransitive verbs in two — *ergatief* (perfect with
 * zijn) and *inergatief* (perfect with hebben). The page has one key for both,
 * so the key is "intransitive" and the wiki's finer word is kept as a label
 * beside it: which auxiliary a verb takes is exactly what a learner needs.
 */
const VERB_TEMPLATES = {
  ov: 'transitive',
  ditr: 'transitive',
  intr: 'intransitive',
  erga: 'intransitive',
  inerg: 'intransitive',
  refl: 'reflexive',
  onpr: 'impersonal',
  copl: 'copulative',
  auxl: 'auxiliary',
  modl: 'auxiliary',
};

/** What the verb templates print beyond the kind the page has a key for. */
const VERB_LABELS = {
  ditr: 'ditransitief',
  erga: 'ergatief',
  inerg: 'inergatief',
  modl: 'modaal werkwoord',
  absol: 'absoluut',
};

/**
 * Labels whose template name is not what the template prints.
 *
 * A label on the WikiWoordenboek is a template named after itself —
 * `{{informeel|nld}}` prints "(informeel)" — so the name is the label and no
 * list of them is needed. These are the ones where that is not so.
 */
const LABEL_NAMES = {
  land: 'toponiem: land',
  rivier: 'toponiem: rivier',
  'naam-m': 'mannelijke naam',
  'naam-f': 'vrouwelijke naam',
  'naam-v': 'vrouwelijke naam',
};

/** Templates that print a label and take no language. */
const BARE_LABELS = {
  dimt: 'alleen verkleinwoord',
  singt: 'geen meervoud',
  nomact: 'naamwoord van handeling',
};

/** Templates that print running text, which belongs in the definition. */
const INLINE_TEXT = {
  seppart: 'bijwoordelijk deel van een scheidbaar werkwoord',
  pronadvpart: 'prepositioneel deel van een voornaamwoordelijk bijwoord',
  'versterkend voorvoegsel': 'versterkend voorvoegsel',
  erfwoord: 'erfwoord',
  'nv.nom': 'nominatief',
  'nv.gen': 'genitief',
  'nv.dat': 'datief',
  'nv.acc': 'accusatief',
  'nl.refl': 'reflexief',
  // Printed as "m", "v", "o", "enk" and "mv"; spelled out, since a definition
  // reading "genitief v en mv van het lidwoord" helps nobody.
  m: 'mannelijk',
  f: 'vrouwelijk',
  n: 'onzijdig',
  c: 'gemeenslachtig',
  s: 'enkelvoud',
  p: 'meervoud',
};

/**
 * Inflected forms.
 *
 * The page for *loopt* has no definition line: under `{{-verb-|0}}` stands
 * `{{2ps|lopen}}`, and the template writes the numbered lines itself. So the
 * lines are written here, in the template's own words, and the form is kept as
 * the Italian parser keeps the Wikizionario's `form` sections — someone who
 * looks up the form they met should be told what it is a form of.
 *
 * Each maker returns [label, text] pairs; `named` holds the template's
 * `key=value` arguments and `rest` its positional ones after the base word.
 */
const FORM_TEMPLATES = {
  '1ps': (base, named) => [
    ['', `eerste persoon enkelvoud tegenwoordige tijd van ${base}`],
    ...(named['no-imp'] ? [] : [['', `gebiedende wijs van ${base}`]]),
    ['bij inversie', `tweede persoon enkelvoud tegenwoordige tijd van ${base}`],
  ],
  '1ps-bijz': (base) => [['in een bijzin', `eerste persoon enkelvoud tegenwoordige tijd van ${base}`]],
  '2ps': (base) => [
    ['', `tweede persoon enkelvoud tegenwoordige tijd van ${base}`],
    ['', `derde persoon enkelvoud tegenwoordige tijd van ${base}`],
    ['verouderd', `gebiedende wijs meervoud van ${base}`],
  ],
  tps: (base) => [
    ['', `enkelvoud tegenwoordige tijd van ${base}`],
    ['', `gebiedende wijs van ${base}`],
  ],
  'ovt-enk': (base) => [['', `enkelvoud verleden tijd van ${base}`]],
  'ovt-mv': (base) => [['', `meervoud verleden tijd van ${base}`]],
  'ovt-onp': (base) => [['', `onpersoonlijke verleden tijd van ${base}`]],
  'aanv-w': (base) => [['', `aanvoegende wijs van ${base}`]],
  'volt-d': (base) => [['', `voltooid deelwoord van ${base}`]],
  'onv-d': (base, named) => [['', named.v
    ? `verbogen vorm van het onvoltooid deelwoord van ${base}`
    : `onvoltooid deelwoord van ${base}`]],
  'noun-pl': (base) => [['', `meervoud van het zelfstandig naamwoord ${base}`]],
  'noun-dim': (base) => [['', `verkleinwoord enkelvoud van het zelfstandig naamwoord ${base}`]],
  'noun-dim-pl': (base) => [['', `verkleinwoord meervoud van het zelfstandig naamwoord ${base}`]],
  'nl-adjc-form': (base, _named, rest) => {
    const form = { indecl: 'onverbogen vorm', decl: 'verbogen vorm', part: 'partitief' }[rest[0]];
    const degree = { pos: 'stellende', com: 'vergrotende', sup: 'overtreffende' }[rest[1]];
    return form && degree ? [['', `${form} van de ${degree} trap van ${base}`]] : [];
  },
};

/** A diminutive is a het-word whatever its base is, and the template says so. */
const FORM_GENDERS = { 'noun-dim': 'neuter' };

/**
 * Language codes the etymology uses. As on the Wikizionario the language is a
 * bare template — `via {{dum}} {{Q|huus|dum}}` — which prints its name, so the
 * prose reads "via Middelnederlands huus" only if the name is put back. Three
 * letters here, where the other wikis use two.
 */
const SOURCE_LANGUAGES = {
  nld: 'Nederlands', dum: 'Middelnederlands', odt: 'Oudnederlands', gem: 'Germaans',
  gmw: 'West-Germaans', ine: 'Indo-Europees', pie: 'Proto-Indo-Europees', frk: 'Oudfrankisch',
  lat: 'Latijn', grc: 'Oudgrieks', ell: 'Grieks', fra: 'Frans', fro: 'Oudfrans', frm: 'Middelfrans',
  deu: 'Duits', goh: 'Oudhoogduits', gmh: 'Middelhoogduits', nds: 'Nedersaksisch',
  gml: 'Middelnederduits', osx: 'Oudsaksisch', eng: 'Engels', ang: 'Angelsaksisch',
  enm: 'Middelengels', fry: 'Fries', ofs: 'Oudfries', afr: 'Afrikaans', lim: 'Limburgs',
  vls: 'West-Vlaams', zea: 'Zeeuws', non: 'Oudnoords', got: 'Gotisch', swe: 'Zweeds',
  dan: 'Deens', nor: 'Noors', isl: 'IJslands', spa: 'Spaans', ita: 'Italiaans', por: 'Portugees',
  cat: 'Catalaans', oci: 'Occitaans', pro: 'Oudprovençaals', cel: 'Keltisch', ara: 'Arabisch',
  heb: 'Hebreeuws', yid: 'Jiddisch', tur: 'Turks', fas: 'Perzisch', san: 'Sanskriet', hin: 'Hindi',
  rus: 'Russisch', pol: 'Pools', ces: 'Tsjechisch', hun: 'Hongaars', fin: 'Fins', msa: 'Maleis',
  ind: 'Indonesisch', jav: 'Javaans', jpn: 'Japans', zho: 'Chinees', pap: 'Papiaments',
  srn: 'Surinaams',
};

/**
 * A table's own entry, or undefined. Template names come from the page, and a
 * plain lookup would find `constructor` in every one of the tables above.
 */
const own = (table, key) => (Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined);

// ---------------------------------------------------------------------------
// wikitext
// ---------------------------------------------------------------------------

/**
 * Everything that is markup around the text rather than text, removed from the
 * whole page before it is read.
 *
 * References first, and the self-closing ones before the paired: `<ref
 * name="x"/>` would otherwise open a match that runs to the next `</ref>` and
 * take the prose in between with it. A gallery sits in the middle of the
 * senses of *bank*, and *één* is defined with a `<math>` formula.
 */
function stripBlocks(text) {
  return String(text)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<ref[^>/]*\/>/gi, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<(gallery|math|timeline|score)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/^\{\|[\s\S]*?^\|\}/gm, '');
}

/** What is left of the tags and entities inside a line. A line break is a pause. */
function stripHtml(text) {
  return String(text)
    .replace(/<br\s*\/?>/gi, '; ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:nbsp|ensp|emsp|thinsp);|&#(?:160|32);/g, ' ')
    .replace(/&#35;/g, '#');
}

/**
 * Images and categories, removed whole. A caption has links of its own, so a
 * simple `[[…]]` pattern stops at the first inner `]]`; hence a scan that
 * counts brackets. The Dutch names are *Bestand* and *Afbeelding*.
 */
function stripFiles(text) {
  let out = String(text);
  const opener = /\[\[\s*(?:Bestand|Afbeelding|File|Image|Categorie|Category)\s*:/i;
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

/** `[[doel|tekst]]` → tekst, `[[woord]]` → woord, `[http://… tekst]` → tekst. */
function unlinkOnly(text) {
  return String(text)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    // `[[water#Zelfstandig naamwoord]]` links to a section and shows the word.
    .replace(/\[\[([^\]#]+)(?:#[^\]]*)?\]\]/g, '$1')
    .replace(/\[\[|\]\]/g, '')
    .replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/\[https?:\/\/[^\]\s]*\]/g, '');
}

/**
 * Links and emphasis both. Bold-italic, bold and italic nest freely and are
 * not always balanced, so the marks are removed rather than matched.
 */
function unlink(text) {
  return unlinkOnly(text).replace(/'{2,}/g, '');
}

/** Split a template's arguments, respecting the templates and links nested inside it. */
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
 * null for disappears. It is given the name as written as well as lowercased,
 * because here the name is often the very label to print.
 */
function expandTemplates(text, render) {
  let out = String(text);
  for (let pass = 0; pass < 8; pass += 1) {
    const next = out.replace(/\{\{([^{}]*)\}\}/g, (_match, body) => {
      const args = splitArgs(body);
      return render(args[0].toLowerCase(), args.slice(1), args[0]) ?? '';
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
    // Dutch, like Italian, puts no space before any punctuation mark.
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\(\s*\)/g, '')
    // The pause a <br> became, after a mark that already is one.
    .replace(/([,.;:!?])\s*;/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The arguments that are not `key=value`, and the ones that are. */
function sortArgs(args) {
  const positional = [];
  const named = {};
  for (const arg of args) {
    const pair = /^([\p{L}\p{N}_-]+)\s*=([\s\S]*)$/u.exec(arg);
    if (pair) named[pair[1]] = pair[2].trim();
    else positional.push(arg);
  }
  return { positional, named };
}

/**
 * The templates that mean the same thing wherever they stand — a link to a
 * word, the page's own name, a language — rendered as the text they print.
 * Returns undefined for anything else, so the caller can go on to its own.
 */
function renderCommon(name, args, word) {
  // {{pn}} is "this page's name" — the word itself, wherever it is used.
  if (name === 'pn' || name === 'pagename') return word;
  // {{Q|huus|dum}} links to a word in a language — `"` meaning this very word
  // — and {{QZ|sin|odt|0|sīn}} shows its fourth argument in place of the first.
  if (name === 'q') return args[0] === '"' ? word : (args[0] ?? null);
  if (name === 'qz') return args[3] || args[0] || null;
  // {{WikiW|Persoon#Derde persoon|derde persoon}} links into the wiki's own
  // grammar pages; shown is the second argument, or the first.
  if (name === 'wikiw') return args[1] || (args[0] ?? '').split('#').pop() || null;
  // {{w|nl|Amstel (rivier)|Amstel}}: a Wikipedia in some language, the
  // article, and the text to show.
  if (name === 'w') return args[2] || args[1] || args[0] || null;
  if (name === 'species' || name === 'aut') return args[0] ?? null;
  if (name === 'fras') return args[1] ?? null;
  // {{№|3|…}} numbers a sense by hand; the text is what matters.
  if (name === '№') return args[1] ?? args[0] ?? null;
  if (name === 'samen' || name === 'samsam') {
    const { positional } = sortArgs(args);
    // The language, then for each part: the word, its part of speech, a gloss.
    const parts = positional.slice(1).filter((_part, i) => i % 3 === 0).filter(Boolean);
    if (parts.length < 2) return 'samenstelling';
    return `samenstelling van ${parts.slice(0, -1).join(', ')} en ${parts[parts.length - 1]}`;
  }
  if (name === 'suff') return args[1] ? `met het achtervoegsel ${args[1]}` : null;
  if (name === 'pref') return args[1] ? `met het voorvoegsel ${args[1]}` : null;
  return own(INLINE_TEXT, name);
}

/**
 * Whether a template is a label of the `{{informeel|nld}}` kind: a language
 * and nothing else positional. `{{toponiem|nld|land=Nederland}}` and the
 * stray `{{figuurlijk|nld|}}` are; `{{suff|nld|-ig}}` is not.
 */
function isLabel(args) {
  const { positional } = sortArgs(args);
  return positional[0] === 'nld' && positional.slice(1).every((arg) => !arg);
}

/** Start of a sense, with what must come off before a label can be looked for. */
const LEAD = /^[\s,;:]+/;

/**
 * A bracket with no italics that is a label all the same: a phrase that
 * places the sense ("in Vlaanderen en Limburg", "van de wind") or one word of
 * the shape labels have (figuurlijk, verouderd, informeel, spreektaal).
 */
const PLAIN_LABEL = /^(?:(?:in|van|bij|vooral|meestal|alleen|ook|niet|over|met|zonder|onder|voor|na|op|aan|als)\s+\S.*|\p{L}+(?:lijk|isch|eel|aal|end|erd|taal))$/u;

/** A definition that ends in an abbreviation, whose full stop is part of it. */
const ABBREVIATED = /(?:\b(?:etc|enz|bv|bijv|vgl)|\b\p{L}\.\p{L}(?:\.\p{L})?)\.$/u;

/**
 * Clean a definition line, pulling its labels out as they go.
 * @param {string} word  the headword, which `{{pn}}` and `~` stand for
 */
function readDefinition(line, word) {
  const labels = [];
  const verbKinds = [];
  let gender = '';

  // `#{{m}} platteland` under a headword that is both de and het: the gender
  // of this one sense, stated before anything else on the line.
  // After a line break inside a definition comes an aside — "Zie ook het
  // artikel op Wikipedia" — which is not the definition.
  let source = String(line).split(/<br\s*\/?>/i)[0];
  const stated = /^\s*\{\{\s*([mfnc])\s*\}\}(?!\s*(?:en\b|\/|\{\{))/.exec(source);
  if (stated) {
    gender = GENDERS[stated[1]];
    source = source.slice(stated[0].length);
  }

  const expanded = expandTemplates(stripFiles(source), (name, args, raw) => {
    const common = renderCommon(name, args, word);
    if (common !== undefined) return common;
    if (own(VERB_TEMPLATES, name) || own(VERB_LABELS, name)) {
      if (own(VERB_TEMPLATES, name)) verbKinds.push(VERB_TEMPLATES[name]);
      if (own(VERB_LABELS, name)) labels.push(VERB_LABELS[name]);
      return null;
    }
    if (own(BARE_LABELS, name)) { labels.push(BARE_LABELS[name]); return null; }
    // The label is the template's own name: {{bouwkunde|nld}} prints "(bouwkunde)".
    if (isLabel(args)) { labels.push(own(LABEL_NAMES, name) ?? raw.trim()); return null; }
    return null;
  });

  // Labels written by hand rather than with a template open a sense in
  // brackets, in italics as often as not: ''(Zuid-Nederlands)'' rennen,
  // (''oorspronkelijk'') …, (in Vlaanderen en Limburg) raar. Short ones are
  // labels; a long one is part of the explanation and stays where it is.
  let text = stripHtml(unlinkOnly(expanded)).replace(LEAD, '');
  const bracketed = [];
  for (;;) {
    const lead = /^(?:'{2,5}\s*\(([^()]{1,48})\)\s*'{2,5}|\(\s*''([^()]{1,48}?)''\s*\)|\(([^()]{1,48})\)(?=\s|$))/.exec(text);
    if (!lead) break;
    // Without italics a bracket may be an optional word instead — "(als)
    // beschouwen", "(behoefte tot) slaap" — so only what reads as a label is one.
    if (lead[3] !== undefined && !PLAIN_LABEL.test(lead[3].trim())) break;
    bracketed.push((lead[1] ?? lead[2] ?? lead[3]).replace(/'{2,}/g, '').trim());
    text = text.slice(lead[0].length).replace(LEAD, '');
  }

  let description = tidy(text.replace(/'{2,}/g, ''));
  // A sense that is nothing but its bracket — the "(van plaats)" of a
  // preposition, explained by its examples — keeps it as the definition.
  if (!/[\p{L}\p{N}]/u.test(description) && bracketed.length) description = bracketed.pop();
  labels.push(...bracketed.filter(Boolean));

  description = description
    // `~` is the headword: "~ aan: niet vergeten" under denken.
    .replace(/(^|[^\p{L}\p{N}])~(?![\p{L}\p{N}])/gu, (_match, before) => `${before}${word}`)
    .replace(/^[\s,.;:]+/, '')
    .trim();
  // A trailing colon introduced examples that are not shown here; a full stop
  // goes too, unless it is the one that closes "etc." or "e.d.".
  if (!ABBREVIATED.test(description)) description = description.replace(/\s*[.:;,]+$/, '').trim();

  return {
    description,
    usage: [...new Set(labels)].join(', '),
    verbCategory: [...new Set(verbKinds)].join(', '),
    gender,
  };
}

/**
 * Gender from the marks on an old-style headword line.
 *
 * Most nouns state it with `{{-l-|n}}`; proper nouns and older pages write the
 * headword out and follow it with the marks — `'''{{pn}}''' {{n}}`.
 */
function readHeadGender(line) {
  const marks = new Set([...String(line).matchAll(/\{\{\s*([mfncg])\s*\}\}/g)].map((match) => match[1]));
  const neuter = marks.has('n');
  const other = marks.has('m') || marks.has('f');
  if (neuter && other) return 'ambiguous';
  if (marks.has('m') && marks.has('f')) return 'masculine_and_feminine';
  const [only] = marks;
  return own(GENDERS, only) ?? '';
}

// ---------------------------------------------------------------------------
// the entry
// ---------------------------------------------------------------------------

/** Everything under `{{=nld=}}`, and nothing from any other language. */
function dutchSection(wikitext) {
  const start = /^\{\{=\s*nld\s*=\}\}[ \t]*$/m.exec(wikitext);
  if (!start) return null;
  const rest = wikitext.slice(start.index + start[0].length);
  // The next language heading ends it; *bank* is Danish, German and English too.
  const end = /^\{\{=[^{}=|]+=\}\}/m.exec(rest);
  return end ? rest.slice(0, end.index) : rest;
}

const braceDepth = (text) => (text.match(/\{\{/g)?.length ?? 0) - (text.match(/\}\}/g)?.length ?? 0);

/**
 * The lines of a section, with a template that runs over several put back on
 * one.
 *
 * A quotation is a `{{citeer|…}}` whose arguments are often one to a line, and
 * it stands between the senses. Read line by line, its tail is loose text in
 * the middle of an entry. A template left open is given up on rather than
 * followed to the end of the page.
 */
function logicalLines(text) {
  const lines = String(text).split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    let line = lines[i];
    let last = i;
    while (braceDepth(line) > 0 && last + 1 < lines.length && last - i < 40) {
      last += 1;
      line += ` ${lines[last]}`;
    }
    if (braceDepth(line) > 0) { out.push(lines[i]); continue; }
    out.push(line);
    i = last;
  }
  return out;
}

/**
 * The section's blocks, split on the section templates.
 *
 * Sections are templates alone on a line — `{{-noun-|nld}}`, `{{-etym-}}`,
 * `{{-syn-}}` — so the page is cut at each of those and every piece is named by
 * its template.
 */
function blocks(section) {
  const markers = [...section.matchAll(/^\{\{\s*-([^{}|]+?)-\s*(\|[^{}]*)?\}\}[ \t]*$/gm)]
    .filter((marker) => !isTable(marker[1].trim().toLowerCase()));
  return markers.map((marker, i) => ({
    name: marker[1].trim().toLowerCase(),
    language: (marker[2] ?? '').split('|')[1]?.trim() ?? '',
    body: section.slice(marker.index + marker[0].length,
      i + 1 < markers.length ? markers[i + 1].index : section.length),
  }));
}

/**
 * The etymology: the top-level points that say something, until there is
 * enough.
 *
 * It is a bulleted list. The first point is often only a date ("voor het eerst
 * aangetroffen in 901") and the origin is in the next, so one point is not
 * enough; below them hang cognate tables, on `:` lines, which are too much.
 */
function readEtymology(body, word) {
  const clean = (line) => {
    const expanded = expandTemplates(stripFiles(line), (name, args, raw) => {
      const common = renderCommon(name, args, word);
      if (common !== undefined) return common;
      if (own(SOURCE_LANGUAGES, name) && !args.length) return SOURCE_LANGUAGES[name];
      // {{klanknabootsing|nld}}, {{verkorting|nld}}: the name is the word.
      if (isLabel(args)) return raw.trim();
      if (own(BARE_LABELS, name)) return BARE_LABELS[name];
      // {{coll|nld|als 't u blieft}}: a word or phrase in Dutch, whatever the
      // template around it is called.
      const { positional } = sortArgs(args);
      if (positional[0] === 'nld' && positional[1]) return positional[1];
      // Everything else is a reference ({{sijs}}, {{ebank}}) or layout ({{((}}).
      return null;
    });
    return tidy(stripHtml(unlink(expanded))).replace(/^[\s,.;:]+/, '').replace(/[\s.;,]+$/, '');
  };

  // A point that ends in a colon — "erfwoord, afkomstig van:" — introduces a
  // chain of `:` lines, one language a line, which is the origin itself.
  const points = [];
  let pending = null;
  let chain = [];
  const close = () => {
    if (pending && chain.length) points.push(`${pending} ${chain.join(', ')}`);
    pending = null;
    chain = [];
  };

  for (const raw of logicalLines(body)) {
    if (/^:(?![:*#])/.test(raw) && pending) {
      const link = clean(raw.slice(1)).replace(/^(\p{L}[\p{L} -]*?)\s*:\s*/u, '$1 ');
      if (/\p{L}{3}/u.test(link)) chain.push(link);
      continue;
    }
    close();
    // Sub-points, the cognate tables and the inflection table that follows.
    if (/^(?:\*[*#:]|[:#|!=<])/.test(raw) || /^\{\{\s*-/.test(raw)) continue;

    const point = clean(raw.replace(/^\*\s*/, '')
      // "[A] erfwoord, …": which headword the point is for. The senses do not
      // carry that letter, so it would point at nothing.
      .replace(/^(?:'{2,3})?\[[A-Z0-9][A-Z0-9,\s]*\](?:'{2,3})?\s*:?\s*/, ''));
    if (!/\p{L}{3}/u.test(point)) continue;
    // "Verwant in Germaans:" opens a list of cousins, which is not an origin.
    if (point.endsWith(':')) { pending = /^(?:verwant|vergelijk|andere|zie)/i.test(point) ? null : point; continue; }
    points.push(point);
  }
  close();

  // Enough points to say where the word is from, and no more.
  let length = 0;
  const kept = [];
  for (const point of points) {
    if (kept.length && length + point.length > 300) break;
    kept.push(point);
    length += point.length + 2;
  }

  const origin = kept.join('; ');
  if (origin.length <= 300) return origin;
  // One long point: cut at a word, and say that it was cut.
  return `${origin.slice(0, 300).replace(/\s+\S*$/, '')}…`;
}

/**
 * The sense numbers a synonym line opens with: `[1]`, `[1.2]:`, `[1,2]`, `3.`
 * — which are the numbers the wiki shows beside the senses above.
 */
function readSenseRefs(line) {
  const refs = [];
  let rest = line;
  for (;;) {
    const match = /^\s*(?:\[([0-9A-Za-z.,\s–-]+)\]|(\d+)\.(?=\s))\s*:?\s*/.exec(rest);
    if (!match) break;
    for (const piece of (match[1] ?? match[2]).split(',')) {
      const range = /^\s*(\d+)\s*[–-]\s*(\d+)\s*$/.exec(piece);
      if (range && Number(range[2]) - Number(range[1]) < 20) {
        for (let n = Number(range[1]); n <= Number(range[2]); n += 1) refs.push(String(n));
      } else if (piece.trim()) {
        refs.push(piece.trim());
      }
    }
    rest = rest.slice(match[0].length);
  }
  return { refs, rest };
}

/**
 * Synonym or antonym lists, each line with the senses it is for.
 *
 * Unlike the Wikizionario, the WikiWoordenboek keeps these lists under the
 * part of speech they belong to and numbers the lines — `*[2] [[geslacht]]` is
 * a synonym of the second sense — so they can be handed to the right sense
 * rather than all to the first. A line with no number is for the entry as a
 * whole. Each line is a comma-separated list, sometimes with a remark in
 * brackets, which is not one of the words.
 *
 * @returns {Array<{refs: string[], words: string[]}>}
 */
function readList(body, word) {
  const lists = [];

  for (const raw of logicalLines(body)) {
    if (!/^\*/.test(raw)) continue;
    const { refs, rest } = readSenseRefs(raw.replace(/^\*+\s*/, ''));

    let line = stripFiles(rest)
      .replace(/'{2,3}\s*\([^)]*\)\s*'{2,3}/g, '')
      .replace(/\([^)]*\)/g, '')
      // and one left open runs to the end of the line.
      .replace(/\([^)]*$/, '');
    line = expandTemplates(line, (name, args) => renderCommon(name, args, word) ?? null);

    const words = stripHtml(unlink(line)).split(/[,;]/)
      // "aardig [2]" is the second sense of aardig; "± waarachtig" is roughly it.
      .map((item) => item.replace(/\s*\[\d+(?:\.\d+)?\]/g, '').trim().replace(/^[±~]\s*/, ''))
      .map((item) => item.replace(/\s+/g, ' ').trim().replace(/[.?!]+$/, '').trim())
      // "''regionaal:''" heads the lines under it and is not a word.
      .filter((item) => item && item.length < 40 && !item.endsWith(':') && item !== word);

    if (words.length) lists.push({ refs, words });
  }
  return lists;
}

/** Hand the lists to the senses they name, or to the first sense of the entry. */
function attachList(record, lists, key) {
  if (!record?.entry.senses.length) return;
  for (const { refs, words } of lists) {
    const named = refs.map((ref) => record.labels.get(ref)).filter(Boolean);
    const targets = named.length ? named : [record.entry.senses[0]];
    for (const sense of targets) {
      sense[key] = [...new Set([...sense[key], ...words])].slice(0, 8);
    }
  }
}

/**
 * The senses under one part-of-speech template.
 *
 * @returns {{gender: string, senses: Array, labels: Map<string, object>}}
 *   `labels` maps the wiki's own numbering — "2", "1.2" — to the sense, which
 *   is how a synonym line refers to it. The numbers on the senses themselves
 *   run on across the whole page, as they do for the other dictionaries.
 */
function readSenses(body, category, word, startAt) {
  const senses = [];
  const labels = new Map();
  let number = startAt;
  let gender = '';
  let top = 0;
  let sub = 0;

  const add = (sense) => {
    number += 1;
    const made = {
      number,
      category,
      verbCategory: sense.verbCategory ?? '',
      gender: sense.gender || gender,
      usage: sense.usage ?? '',
      description: sense.description,
      usageNotes: [],
      synonyms: [],
      antonyms: [],
    };
    senses.push(made);
    return made;
  };

  for (const raw of logicalLines(body)) {
    const line = raw.trim();

    // The headword: {{-l-|n}} is "het huis, onzijdig" in one template. A
    // second one further down — *twee* is de twee and, in the plural, de
    // tweeën — changes the gender for the senses under it.
    const head = /^\{\{\s*-l-\s*\|([^{}]*)\}\}/.exec(line);
    if (head) {
      gender = own(GENDERS, splitArgs(head[1])[0]) ?? '';
      continue;
    }
    if (/^(?:\([A-Z]\)\s*)?'''/.test(line)) {
      gender = readHeadGender(line);
      continue;
    }

    if (line.startsWith('#')) {
      const depth = /^#+/.exec(line)[0].length;
      const text = line.slice(depth);
      // `#:` and `#*` are examples under a sense.
      if (/^[:*]/.test(text)) continue;

      // The label counts every line the wiki would number, kept or not, so
      // that "[3]" in a synonym list still means the third.
      if (depth === 1) { top += 1; sub = 0; } else { sub += 1; }
      const label = depth === 1 ? String(top) : `${top}.${sub}`;

      const sense = readDefinition(text, word);
      if (!sense.description || sense.description.length < 2) continue;
      labels.set(label, add(sense));
      continue;
    }

    // An inflected form: one template, which writes its own numbered lines.
    const form = /^\{\{\s*([^{}|]+?)\s*\|([^{}]*)\}\}/.exec(line.replace(/\{\{\s*pn\s*\}\}/gi, word));
    const name = form ? form[1].toLowerCase() : '';
    const maker = own(FORM_TEMPLATES, name);
    if (maker) {
      const { positional, named } = sortArgs(splitArgs(form[2]));
      const base = unlink(positional[0] ?? '').trim();
      if (!base) continue;
      for (const [usage, description] of maker(base, named, positional.slice(1))) {
        top += 1; sub = 0;
        labels.set(String(top), add({ usage, description, gender: own(FORM_GENDERS, name) }));
      }
    }
  }

  return { gender: senses[0]?.gender ?? '', senses, labels };
}

/**
 * The etymology and the entries — one per part of speech, each with its
 * numbered senses — of the Dutch section of a page, or null if it has none.
 *
 * Exported for the tests, which feed it wikitext rather than the network.
 * @param {string} wikitext  the whole page
 * @param {string} word      the page title, which `{{pn}}` stands for
 */
export function readDutchEntry(wikitext, word) {
  const found = dutchSection(stripBlocks(String(wikitext ?? '')));
  if (found === null) return null;
  const section = logicalLines(found).join('\n');

  const records = [];
  let origin = '';
  let number = 0;

  for (const block of blocks(section)) {
    const category = own(PARTS_OF_SPEECH, block.name);
    if (category !== undefined && (block.language === 'nld' || block.language === '0')) {
      const { gender, senses, labels } = readSenses(block.body, category, word, number);
      number += senses.length;
      if (senses.length) records.push({ entry: { category, gender, senses }, labels });
      continue;
    }
    if (block.name === 'etym' && !origin) origin = readEtymology(block.body, word);
    // The lists follow the part of speech they are for, so they go to the
    // entry read last. With an argument, {{-syn-|…}} would be something else.
    const latest = records[records.length - 1];
    if (block.name === 'syn' && !block.language) attachList(latest, readList(block.body, word), 'synonyms');
    if (block.name === 'ant' && !block.language) attachList(latest, readList(block.body, word), 'antonyms');
  }

  return { origin, entries: records.map((record) => record.entry) };
}

// ---------------------------------------------------------------------------
// lookup
// ---------------------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

async function wiki(params, attempt = 0) {
  const url = new URL(WIKIWOORDENBOEK);
  url.searchParams.set('format', 'json');
  url.searchParams.set('formatversion', '2');
  url.searchParams.set('origin', '*');
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  // The same queue as the other Wiktionaries and the corpus: Wikimedia limits
  // by address across all its wikis, so a separate queue per wiki would only
  // let two bursts collide. See server/throttle.js.
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
      const error = new Error('Het woordenboek beperkt het aantal raadplegingen. Probeer het zo opnieuw.');
      error.status = 429;
      throw error;
    }
  }

  if (!response.ok) throw new Error(`Het WikiWoordenboek antwoordde ${response.status}`);
  return response.json();
}

/**
 * The Dutch entries of several pages, in one request.
 *
 * `action=parse`, which the French and Italian lookups use, reads one page at
 * a time. Here a lookup nearly always has two spellings to try — the route
 * lowercases what was typed, and *Nederland* is only under its capital — so
 * the pages are asked for together and a proper noun costs one request, not
 * two. Redirects are followed, as there.
 *
 * @returns {Promise<Map<string, {word: string, origin: string, entries: Array}>>}
 *   keyed by the title as asked for; a title with no Dutch entry is absent
 */
async function readPages(titles) {
  const body = await wiki({
    action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', redirects: '1', titles: titles.join('|'),
  });
  if (body.error) throw new Error(body.error.info || 'Het WikiWoordenboek weigerde het verzoek.');

  // What was asked for is not always what comes back: a title is normalised
  // (underscores, stray spaces) and then a redirect may be followed.
  const moved = new Map();
  for (const step of [...(body.query?.normalized ?? []), ...(body.query?.redirects ?? [])]) {
    moved.set(step.from, step.to);
  }
  const pages = new Map((body.query?.pages ?? []).map((page) => [page.title, page]));

  const found = new Map();
  for (const asked of titles) {
    let title = asked;
    for (let hop = 0; hop < 4 && moved.has(title); hop += 1) title = moved.get(title);
    const wikitext = pages.get(title)?.revisions?.[0]?.slots?.main?.content;
    if (!wikitext) continue;
    // The page may exist with no Dutch in it — "maison" is French on
    // nl.wiktionary — and answering with that would be worse than not finding it.
    const entry = readDutchEntry(wikitext, title);
    if (entry?.entries.length) found.set(asked, { word: title, origin: entry.origin, entries: entry.entries });
  }
  return found;
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
 * The spellings the word might be filed under, best first.
 *
 * Two things can be wrong with what was typed, and the search index — which
 * folds both, where opensearch folds neither — answers for either:
 *
 * - capitals beyond the first letter: *den haag* is under *Den Haag*;
 * - accents: Dutch writes few, but on words students meet early — *café*,
 *   *één*, *België*, *reünie* — and they type them without.
 *
 * An accented candidate is taken only by the rule in server/accents.js: the
 * same word once folded, nothing looser. Several may pass — the wiki has the
 * German noun *Café* beside the Dutch *café* — so they are all returned, those
 * written in the case that was typed first, and the caller keeps the first
 * with a Dutch entry.
 */
async function otherSpellings(word, tried) {
  try {
    const body = await wiki({
      action: 'query', list: 'search', srsearch: word, srlimit: '8',
    });
    const titles = (body?.query?.search ?? []).map((hit) => hit.title)
      .filter((title) => !tried.includes(title));

    const recased = titles.filter((title) => title.toLowerCase() === word.toLowerCase());

    const typedCase = (title) => title.slice(0, 1) === title.slice(0, 1).toLowerCase();
    let pool = [...titles.filter(typedCase), ...titles.filter((title) => !typedCase(title))];
    const accented = [];
    for (let candidate = accentedForm(word, pool); candidate && accented.length < 3;
      candidate = accentedForm(word, pool)) {
      accented.push(candidate);
      pool = pool.filter((title) => title !== candidate);
    }

    return [...recased, ...accented];
  } catch {
    return [];
  }
}

/**
 * Look a Dutch word up.
 * @returns {Promise<{found: boolean, word?: string, entries?: Array, origin?: string, suggestions?: string[], corrected?: {from: string, to: string}}>}
 */
export async function fetchWikiWoordenboek(word) {
  // The spelling as typed, and with a capital. Titles on a Wiktionary are
  // case-sensitive from the first letter on and the route has lowercased the
  // query, so a proper noun — Nederland, Amsterdam, Jan — is only ever found
  // under the second. The typed spelling wins where both are words: *god* and
  // *God* each have a page.
  const capitalised = word.slice(0, 1).toUpperCase() + word.slice(1);
  const asked = capitalised === word ? [word] : [word, capitalised];
  const first = await readPages(asked);
  const direct = first.get(word) ?? first.get(capitalised);
  if (direct) return { found: true, ...direct };

  // Tried once, and only when the word as typed is not there at all: someone
  // who wrote "cafe" meant "café". *een* is a word, so it is never taken for
  // *één* — the lookup above succeeds and this never runs.
  const others = await otherSpellings(word, asked);
  if (others.length) {
    const second = await readPages(others);
    const spelling = others.find((title) => second.has(title));
    if (spelling) {
      const entry = second.get(spelling);
      // Only an accent is a correction the reader should be told about; a
      // capital is the same spelling.
      return spelling.toLowerCase() === word.toLowerCase()
        ? { found: true, ...entry }
        : { found: true, ...entry, corrected: { from: word, to: spelling } };
    }
  }

  return { found: false, suggestions: await suggestions(word) };
}

export const WIKIWOORDENBOEK_CREDIT = {
  name: 'WikiWoordenboek',
  url: 'https://nl.wiktionary.org',
  licence: 'CC BY-SA',
};
