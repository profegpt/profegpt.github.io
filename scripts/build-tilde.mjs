#!/usr/bin/env node
/**
 * Builds Tilde's word lists: every guess the game accepts, and the answers it
 * deals out one a day, each with what it is and a real sentence to hint with.
 *
 *   node scripts/build-tilde.mjs <es_50k.txt>                write the data files
 *   node scripts/build-tilde.mjs <es_50k.txt> --check        the answer list,
 *                                                           checked, and nothing
 *                                                           written
 *   node scripts/build-tilde.mjs <es_50k.txt> --offline      write the data files
 *                                                           from the cached
 *                                                           sentences alone,
 *                                                           leaving out answers
 *                                                           not yet looked up
 *   node scripts/build-tilde.mjs <es_50k.txt> --candidates   frequent words that
 *                                                           are not answers yet
 *
 * <es_50k.txt> is hermitdave/FrequencyWords, content/2018/es/es_50k.txt: the
 * fifty thousand commonest words in Spanish film and television subtitles
 * (OpenSubtitles), with their counts. CC BY-SA 4.0. It is downloaded by hand,
 * outside the repository; only what is built from it is committed.
 *
 * Two files come out, both under public/js/data and both loaded only by the
 * game's own page:
 *
 *   tilde-words.js    the valid guesses, one newline-separated string per
 *                     length. Every 5-, 6- and 7-letter word of the frequency
 *                     list that looks like Spanish, less the accentless (or
 *                     wrongly accented) misspellings subtitles are full of,
 *                     plus every simple form the conjugator builds for every
 *                     verb it knows — so a form too rare for the list is still
 *                     a word.
 *
 *   tilde-answers.js  the answers, in the order the days walk them. They come
 *                     from scripts/tilde-answers.txt, which is written and read
 *                     by hand: the frequency list knows nothing about which
 *                     words are names, slurs or English, and a person has to.
 *                     A verb form's infinitive, tense and person are worked out
 *                     here by the conjugator, never typed, so a form the
 *                     conjugator does not build for that verb stops the build.
 *
 * The hints are sentences from Tatoeba that contain the answer exactly — not a
 * relative of it, which is what its ordinary search returns for a conjugated
 * form — so they are looked up once, here, rather than live. Requests go one a
 * second with the site's USER_AGENT, and the answers are kept in a cache file
 * beside the frequency list, so running this again asks Tatoeba only about new
 * words. An answer Tatoeba has no usable sentence for is left out.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { conjugate, PERSONS } from '../public/js/lib/conjugator.js';
import { COMMON_VERBS, IRREGULARS, STEM_CHANGES } from '../public/js/data/verbs.js';
import { plain, letters, LENGTHS } from '../public/js/lib/tilde.js';
import { USER_AGENT } from '../server/throttle.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'scripts/tilde-answers.txt');
const OUT_WORDS = path.join(ROOT, 'public/js/data/tilde-words.js');
const OUT_ANSWERS = path.join(ROOT, 'public/js/data/tilde-answers.js');

const TATOEBA = 'https://tatoeba.org/en/api_v0/search';
const PAUSE = 1100;

/** The share of all answers that should be conjugated forms. */
const VERB_SHARE = 1 / 3;

// ------------------------------------------------------------ guesses ----

const SPANISH_LETTERS = /^[a-zñáéíóúü]+$/;

/**
 * Whether a word from the subtitles could be Spanish at all. Subtitle lists are
 * full of English and of names; this catches the spellings Spanish does not
 * use, and lets everything else through — a valid guess that is not a word
 * costs nothing, a real word refused costs a player's patience.
 */
function looksSpanish(word) {
  if (/[kw]/.test(word)) return false;
  if (/th|sh|ph|ck|gh|ss|tt|ff|pp|mm|bb|dd|gg|zz|yy|ou$|q(?!u)/.test(word)) return false;
  if (/ü/.test(word) && !/^[^ü]*gü[eéií][^ü]*$/.test(word)) return false;
  // Spanish writes one acute accent a word at most.
  if ((word.match(/[áéíóú]/g) || []).length > 1) return false;
  // Words end in a vowel or in d, l, n, r, s, z, j, x, or a y after a vowel.
  if (!/(?:[aeiouáéíóú]|[dlnrszjx]|[aeiou]y)$/.test(word)) return false;
  return true;
}

function readFrequencies(file) {
  const counts = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const [word, count] = line.trim().split(/\s+/);
    if (word) counts.set(word.normalize('NFC'), Number(count) || 0);
  }
  return counts;
}

/** Every single-word form the conjugator builds for a verb. */
function formsOf(verb) {
  const result = conjugate(verb);
  if (!result.ok) return [];
  const out = [];
  const { table } = result;
  for (const mood of ['indicativo', 'subjuntivo']) {
    for (const forms of Object.values(table[mood])) out.push(...Object.values(forms));
  }
  out.push(...Object.values(table.imperativo.afirmativo));
  const { infinitivo, gerundio, participio } = table.formas;
  out.push(infinitivo, gerundio, participio);
  // The participle is an adjective too: hablada, hablados, habladas.
  if (participio?.endsWith('o')) out.push(`${participio.slice(0, -1)}a`, `${participio}s`, `${participio.slice(0, -1)}as`);
  return out.filter((form) => form && !form.includes(' '));
}

function knownVerbs() {
  return [...new Set([...COMMON_VERBS.map(([verb]) => verb), ...Object.keys(STEM_CHANGES), ...Object.keys(IRREGULARS)])];
}

function buildGuesses(counts) {
  const conjugated = new Set();
  for (const verb of knownVerbs()) for (const form of formsOf(verb)) conjugated.add(form);

  // Subtitles leave accents off (cancion for canción, pidio for pidió, actua
  // for actúa) far more often than they put wrong ones on (fué). So a spelling
  // that lacks an accent the commonest spelling of the same letters has is
  // taken for a slip when it is under 15% as common; one with an accent too
  // many, only under 5%, which keeps cuándo beside cuando. Either way the
  // conjugator vouches for its own forms (hablara and hablará), and a feminine
  // or plural stands on the word it comes from: seria is serio's, not a slip
  // for sería.
  //
  // The ñ goes missing the same way (manana, senor), though never the other
  // way round, so a spelling without one is dropped only for being far rarer
  // than a spelling with one: pena stays, beside the rarer peña.
  const commonest = new Map();
  const withEnye = new Map();
  const unEnye = (word) => plain(word).replaceAll('ñ', 'n');
  for (const [word, count] of counts) {
    if (!SPANISH_LETTERS.test(word)) continue;
    const key = plain(word);
    if (count > (commonest.get(key)?.count ?? -1)) commonest.set(key, { word, count });
    if (word.includes('ñ')) withEnye.set(unEnye(word), Math.max(withEnye.get(unEnye(word)) ?? 0, count));
  }
  const standsAlone = (word) => commonest.get(plain(word))?.word === word && plain(word) === word;
  const fromItsOwnWord = (word) => [/as$/, /os$/, /a$/, /es$/, /s$/]
    .some((ending) => ending.test(word) && [word.replace(ending, 'o'), word.replace(ending, '')]
      .some((root) => root !== word && root.length > 2 && standsAlone(root)));
  const missing = (word, model) => letters(model).some((letter, i) => letter !== letters(word)[i] && plain(letter) === letters(word)[i]);

  const words = new Set();
  for (const [word, count] of counts) {
    if (!SPANISH_LETTERS.test(word) || !LENGTHS.includes(letters(word).length)) continue;
    // The conjugator's forms all go in below, whatever the subtitles say.
    if (conjugated.has(word) || !looksSpanish(word)) continue;
    const top = commonest.get(plain(word));
    if (top.word !== word) {
      const share = count / top.count;
      if (missing(word, top.word) ? share < 0.15 && !fromItsOwnWord(word) : share < 0.05) continue;
    }
    if (!word.includes('ñ') && count < (withEnye.get(unEnye(word)) ?? 0) * 0.05) continue;
    words.add(word);
  }
  for (const form of conjugated) {
    if (SPANISH_LETTERS.test(form) && LENGTHS.includes(letters(form).length)) words.add(form);
  }
  return words;
}

// ------------------------------------------------------------ answers ----

/** Where a form sits in the paradigm of every verb in the search index. */
function formIndex() {
  const index = new Map();
  const add = (form, entry) => {
    if (!form || form.includes(' ')) return;
    if (!index.has(form)) index.set(form, []);
    index.get(form).push(entry);
  };
  for (const [verb, gloss] of COMMON_VERBS) {
    const result = conjugate(verb);
    if (!result.ok) continue;
    for (const mood of ['indicativo', 'subjuntivo']) {
      for (const [tense, forms] of Object.entries(result.table[mood])) {
        for (const person of PERSONS) add(forms[person], { lemma: verb, gloss, tense: `${mood}.${tense}`, person });
      }
    }
    for (const [person, form] of Object.entries(result.table.imperativo.afirmativo)) {
      add(form, { lemma: verb, gloss, tense: 'imperativo', person });
    }
    add(result.table.formas.gerundio, { lemma: verb, gloss, tense: 'gerundio' });
    add(result.table.formas.participio, { lemma: verb, gloss, tense: 'participio' });
  }
  return index;
}

/**
 * A form's readings, one per verb and tense with the persons gathered up.
 * The imperative of usted, nosotros and ustedes is the present subjunctive
 * under another name, so it is not listed a second time.
 */
function readings(form, index, lemma = null) {
  const found = (index.get(form) ?? []).filter((entry) => !lemma || entry.lemma === lemma);
  const subjunctive = new Set(found.filter((e) => e.tense === 'subjuntivo.presente').map((e) => `${e.lemma}:${e.person}`));
  const kept = found.filter((e) => !(e.tense === 'imperativo' && subjunctive.has(`${e.lemma}:${e.person === 'usted' ? 'el' : e.person === 'ustedes' ? 'ellos' : e.person}`)));
  const grouped = new Map();
  for (const entry of kept) {
    const key = `${entry.lemma}|${entry.tense}`;
    if (!grouped.has(key)) grouped.set(key, { lemma: entry.lemma, gloss: entry.gloss, tense: entry.tense, persons: [] });
    if (entry.person && !grouped.get(key).persons.includes(entry.person)) grouped.get(key).persons.push(entry.person);
  }
  return [...grouped.values()];
}

const KINDS = ['n.m', 'n.f', 'n.mf', 'adj', 'adv', 'pron', 'prep', 'conj', 'interj', 'num', 'verb'];

function readSource() {
  const entries = [];
  const seen = new Set();
  fs.readFileSync(SOURCE, 'utf8').split('\n').forEach((raw, number) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const [word, kind, extra = ''] = line.split('|').map((part) => part.trim());
    const where = `tilde-answers.txt:${number + 1}`;
    if (!KINDS.includes(kind)) throw new Error(`${where}: unknown kind '${kind}'`);
    if (seen.has(word)) throw new Error(`${where}: ${word} is listed twice`);
    seen.add(word);
    entries.push({ word: word.normalize('NFC'), kind, extra, where });
  });
  return entries;
}

// -------------------------------------------------------------- hints ----

const pause = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/** Whether `word` stands in `text` as a word of its own, accents and all. */
function tokens(text) {
  return text.split(/[^\p{L}]+/u).filter(Boolean);
}

/**
 * Tatoeba is written by anyone, and this is a site for a class. A sentence
 * that mentions any of these, in either language, is never a hint.
 */
const UNSUITABLE_ES = /\b(?:drogas?|sexo|sexual|masturb\p{L}*|circuncid\p{L}*|mierda|joder|jodid\p{L}*|pija|polla|putas?|cabr[oó]n\p{L}*|coño|culo|suicid\p{L}*|asesinad\p{L}*|asesin[oó]|nazis?|hitler|anticonceptiv\p{L}*)\b/iu;
const UNSUITABLE_EN = /\b(?:drugs?|sex\w*|masturbat\w*|circumcis\w*|shit\w*|fuck\w*|dick|suicide|kill (?:him|her|my|your|them)sel(?:f|ves)|killed|murder\w*|puked|birth control)\b/i;

/**
 * Sentences turned down on reading the hints through, by Tatoeba id. The next
 * best sentence for the word takes the place of each.
 */
const REJECTED = new Set([
  13612400, 13612402, // marido, esposo: a husband's circumcision
  10510062, 13212299, // solía, quería: drugs, suicide
  9145683, 8776031, 12441889, 13373104, // enorme, pedazo, normal, domingo: vulgar
  931187, 13167538, 3316647, 1781391, // método, fueron, siete, escudo: birth control, murders, human shields
  3165738, 4523043, // anoche, tabla: vomiting, a remark about a woman's body
  9448749, 12122495, 10202759, 14045466, // animal, ángel, reino, libre: a game's name, Miguel Ángel, a "furry realm", a slogan
  11504925, 7591187, 6568470, 7934310, 11073914, 3217146, // dijiste, alguien, oscuro, demos, ojalá, ombligo: the translation is of something else
  5633097, 1065230, 10009242, 6694292, // fuera, sentido, venga, bueno: the word used as something other than the answer
]);

/** The sentence a learner can use: the answer once, exactly, in something short. */
function bestSentence(word, results) {
  const usable = [];
  for (const result of results) {
    const text = String(result.text || '').trim().normalize('NFC');
    const english = (result.translations || []).flat().find((item) => item.lang === 'eng' && item.text);
    if (!english || text.length < 14 || text.length > 90) continue;
    if (REJECTED.has(result.id) || UNSUITABLE_ES.test(text) || UNSUITABLE_EN.test(english.text)) continue;
    // A sentence has to end like one, so the blank sits in a whole thought.
    if (!/[.!?…»"]$/.test(text)) continue;
    const hits = tokens(text).filter((token) => token.toLowerCase() === word).length;
    if (hits !== 1) continue;
    usable.push({ text, en: String(english.text).trim(), id: result.id });
  }
  usable.sort((a, b) => Math.abs(a.text.length - 42) - Math.abs(b.text.length - 42) || a.id - b.id);
  return usable[0] ?? null;
}

/** Blank the answer out of its sentence: "Pidió ayuda." → "____ ayuda." */
function blank(text, word) {
  return text.replace(/\p{L}+/gu, (token) => (token.toLowerCase() === word ? '____' : token));
}

async function hintFor(word, cache) {
  if (!(word in cache)) {
    const query = encodeURIComponent(`="${word}"`);
    // A slow or failed answer is tried twice more, after a longer wait each time.
    let body = null;
    for (const wait of [0, 5000, 15000]) {
      await pause(wait);
      try {
        const response = await fetch(`${TATOEBA}?from=spa&to=eng&query=${query}&sort=relevance`, {
          headers: { accept: 'application/json', 'user-agent': USER_AGENT },
          signal: AbortSignal.timeout(30000),
        });
        if (response.ok) { body = await response.json(); break; }
        if (response.status < 500 && response.status !== 429) throw new Error(`Tatoeba answered ${response.status} for ${word}`);
      } catch (error) {
        if (!/timeout|abort|fetch failed/i.test(error.message)) throw error;
      }
    }
    if (!body) throw new Error(`Tatoeba did not answer for ${word}`);
    cache[word] = (body.results || []).map((result) => ({
      id: result.id, text: result.text, translations: result.translations,
    }));
    await pause(PAUSE);
  }
  const best = bestSentence(word, cache[word]);
  return best ? { text: blank(best.text, word), en: best.en, id: best.id } : null;
}

// --------------------------------------------------------------- order ----

/** A small seeded generator, so the order is the same on every run. */
function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle, then deal: a conjugated form whenever the run so far has fewer than
 * its third of them, and never the same length two days running.
 */
function order(answers) {
  const next = random(20261110);
  const pool = [...answers];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const out = [];
  let verbs = 0;
  while (pool.length) {
    const wantVerb = verbs < (out.length + 1) * VERB_SHARE;
    const lastLength = out.length ? letters(out.at(-1).word).length : 0;
    const fits = (item, strictKind) => letters(item.word).length !== lastLength
      && (!strictKind || (item.kind === 'verb') === wantVerb);
    let at = pool.findIndex((item) => fits(item, true));
    if (at === -1) at = pool.findIndex((item) => fits(item, false));
    if (at === -1) at = 0;
    const [item] = pool.splice(at, 1);
    if (item.kind === 'verb') verbs += 1;
    out.push(item);
  }
  return out;
}

// ---------------------------------------------------------------- main ----

function header(lines) {
  return `${['/**', ...lines.map((line) => ` * ${line}`.trimEnd()), ' */'].join('\n')}\n\n`;
}

async function main() {
  const [file, flag] = process.argv.slice(2);
  if (!file) {
    console.error('Usage: node scripts/build-tilde.mjs <es_50k.txt> [--check | --offline | --candidates]');
    process.exit(1);
  }
  const counts = readFrequencies(file);
  const guesses = buildGuesses(counts);
  const index = formIndex();
  const source = readSource();

  if (flag === '--candidates') {
    const listed = new Set(source.map((entry) => entry.word));
    let rank = 0;
    for (const [word] of counts) {
      rank += 1;
      if (!guesses.has(word) || listed.has(word)) continue;
      const found = readings(word, index);
      const as = found.map((r) => `${r.lemma} ${r.tense} ${r.persons.join(',')}`).join('; ');
      console.log(`${rank}\t${word}\t${as}`);
    }
    return;
  }

  const cacheFile = path.join(path.dirname(path.resolve(file)), 'tatoeba-cache.json');
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};

  // Every entry is checked before Tatoeba is asked anything.
  const checked = source.map(({ word, kind, extra, where }) => {
    if (!LENGTHS.includes(letters(word).length)) throw new Error(`${where}: ${word} is not 5 to 7 letters`);
    if (!guesses.has(word)) throw new Error(`${where}: ${word} is not among the valid guesses`);
    const answer = { word, kind };
    if (kind === 'verb') {
      const forms = readings(word, index, extra || null);
      if (!forms.length) throw new Error(`${where}: the conjugator builds ${word} for no verb${extra ? ` called ${extra}` : ''}`);
      answer.forms = forms;
    } else {
      if (!extra) throw new Error(`${where}: ${word} needs an English gloss`);
      answer.gloss = extra;
    }
    return answer;
  });
  if (flag === '--check') {
    console.log(`${checked.length} answers check out, ${checked.filter((a) => a.kind === 'verb').length} of them verb forms`);
    return;
  }

  const offline = flag === '--offline';
  const answers = [];
  let dropped = 0;
  let pending = 0;
  for (const answer of checked) {
    const { word } = answer;
    const fresh = !(word in cache);
    if (offline && fresh) { pending += 1; continue; }
    let hint;
    try {
      hint = await hintFor(word, cache);
    } finally {
      if (fresh) fs.writeFileSync(cacheFile, JSON.stringify(cache));
    }
    if (!hint) {
      console.warn(`  no sentence for ${word}; left out`);
      dropped += 1;
      continue;
    }
    answer.hint = hint;
    answers.push(answer);
  }

  const dealt = order(answers);

  const byLength = Object.fromEntries(LENGTHS.map((n) => [n, [...guesses].filter((word) => letters(word).length === n).sort()]));
  fs.writeFileSync(OUT_WORDS, `${header([
    'Every guess Tilde accepts, one newline-separated string per length.',
    '',
    'Generated by scripts/build-tilde.mjs from the conjugator and from',
    'hermitdave/FrequencyWords (OpenSubtitles 2018, CC BY-SA 4.0). Do not edit;',
    'edit the script and run it again.',
  ])}export const GUESSES = {\n${LENGTHS.map((n) => `  ${n}: ${JSON.stringify(byLength[n].join('\n'))},`).join('\n')}\n};\n`);

  fs.writeFileSync(OUT_ANSWERS, `${header([
    "Tilde's answers, in the order the days walk them: puzzle #1 is the first.",
    '',
    'Generated by scripts/build-tilde.mjs from scripts/tilde-answers.txt. A verb',
    "form's readings come from the conjugator; each hint is a sentence from",
    'Tatoeba (CC BY 2.0 FR) with the answer blanked out. Do not edit; edit the',
    'list and run the script again.',
  ])}export const ANSWERS = [\n${dealt.map((answer) => `  ${JSON.stringify(answer)},`).join('\n')}\n];\n`);

  const verbs = dealt.filter((answer) => answer.kind === 'verb').length;
  const lengths = LENGTHS.map((n) => `${n}: ${dealt.filter((a) => letters(a.word).length === n).length}`).join(', ');
  console.log(`tilde-words.js   ← ${guesses.size} guesses (${LENGTHS.map((n) => `${n}: ${byLength[n].length}`).join(', ')})`);
  console.log(`tilde-answers.js ← ${dealt.length} answers, ${verbs} of them conjugated forms (${lengths})${dropped ? `; ${dropped} without a sentence left out` : ''}${pending ? `; ${pending} not yet looked up` : ''}`);
}

main().catch((error) => {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
});
