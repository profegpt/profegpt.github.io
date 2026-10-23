/**
 * The Italian language pack for the tutor.
 *
 * The same contract as tutor-es.js and tutor-fr.js. What differs beyond
 * vocabulary: the paradigm has Italian mood names, the verb groups are the
 * three classic conjugations (-are, -ere, -ire, with the contracted -rre verbs
 * such as *porre* and *tradurre* counted in the second, where their Latin
 * infinitives put them), and the imperative carries a formal *Lei* form that
 * the indicative persons have no label for.
 */

import { conjugate, PERSONS, PERSON_LABELS as ENGINE_PERSON_LABELS } from './conjugator-it.js';
import { COMMON_VERBS, IRREGULARS } from '../data/verbs-it.js';
import { TOPICS, SMALL_TALK, EXCLAMATIONS } from '../data/grammar-it.js';
import { fold } from './dom.js';

/**
 * The engine's labels, plus one for the formal imperative. The imperative
 * table has a *lei* cell (*venga!*, *si accomodi!*) that no indicative person
 * matches, and the form index labels every hit by its person — without this,
 * "che forma è venga" would answer "undefined, imperativo".
 */
const PERSON_LABELS = { lei: 'Lei', ...ENGINE_PERSON_LABELS };

const TENSE_LABELS = {
  'indicativo.presente': { it: 'presente indicativo', en: 'present indicative' },
  'indicativo.imperfetto': { it: 'imperfetto indicativo', en: 'imperfect' },
  'indicativo.passatoRemoto': { it: 'passato remoto', en: 'passato remoto (simple past)' },
  'indicativo.futuro': { it: 'futuro semplice', en: 'future' },
  'indicativo.condizionale': { it: 'condizionale presente', en: 'conditional' },
  'indicativo.passatoProssimo': { it: 'passato prossimo', en: 'passato prossimo (present perfect)' },
  'congiuntivo.presente': { it: 'congiuntivo presente', en: 'present subjunctive' },
  'congiuntivo.imperfetto': { it: 'congiuntivo imperfetto', en: 'imperfect subjunctive' },
};

const GROUP_NAMES = {
  1: { it: 'prima coniugazione', en: 'first-conjugation' },
  2: { it: 'seconda coniugazione', en: 'second-conjugation' },
  3: { it: 'terza coniugazione', en: 'third-conjugation' },
};

/**
 * The conjugation a verb belongs to. The engine reports it; the ending is the
 * fallback, so a verb the engine forgot to number still gets a sensible
 * headline rather than a crash.
 */
function groupOf(result) {
  if (GROUP_NAMES[result.flags?.group]) return result.flags.group;
  const verb = String(result.verb ?? '');
  if (/are$/.test(verb)) return 1;
  if (/ire$/.test(verb)) return 3;
  return 2;
}

/** The ending to name in the headline: the contracted -rre verbs say so. */
function endingOf(result) {
  const verb = String(result.verb ?? '');
  if (verb.endsWith('rre')) return 'rre';
  return result.class || verb.slice(-3);
}

function describeFlags(result, language) {
  const it = language === 'it';
  const parts = [];
  const { flags } = result;
  // -isc- is reported as a stem change by the engine, and it deserves its own
  // wording: it is the one "irregularity" every -ire learner meets first.
  if (flags.stemChange === 'isc' || flags.isc) {
    parts.push(it ? 'con *-isc-* (finisco, finisci…)' : 'inserts *-isc-* (finisco, finisci…)');
  } else if (flags.stemChange) {
    parts.push(it ? `con il cambio ${flags.stemChange}` : `with a ${flags.stemChange} stem change`);
  }
  if (flags.ortho) parts.push(it ? `ortografia ${flags.ortho}` : `spelling ${flags.ortho}`);
  if (flags.irregular) parts.push(it ? 'irregolare' : 'irregular');
  if (flags.derivedFrom) {
    parts.push(it ? `si coniuga come *${flags.derivedFrom}*` : `conjugated like *${flags.derivedFrom}*`);
  }
  if (result.auxiliary === 'essere') parts.push(it ? 'ausiliare *essere*' : 'takes *essere*');
  return parts.length ? `, ${parts.join(', ')}` : '';
}

/** IRREGULARS may be keyed by infinitive or listed; either way, the names. */
function namesOf(collection) {
  if (!collection) return [];
  if (collection instanceof Set || Array.isArray(collection)) return [...collection];
  return Object.keys(collection);
}

function capabilities(language) {
  return language === 'it'
    ? `Ecco cosa so fare, e tutto viene dai dati del sito stesso:

- **Coniugare** qualsiasi verbo — *coniuga prendere al congiuntivo*
- **Riconoscere una forma** — *che forma è «fecero»*
- **Cercare una parola** nel dizionario — *cosa vuol dire sciopero*
- **Tradurre** frasi — *come si dice "I'm tired" in italiano*
- **Spiegare la grammatica**: essere e avere, il passato prossimo, passato prossimo e imperfetto, il congiuntivo, il genere e gli articoli, le preposizioni articolate, il partitivo, i pronomi diretti, indiretti e combinati, ci e ne, la negazione, gli aggettivi (bello, buono, grande), il futuro e il futuro di probabilità, il condizionale e il periodo ipotetico, sapere e conoscere, piacere, tu e Lei, i verbi riflessivi, comparativi e superlativi, da e per, doppie e accenti.`
    : `Here's what I can do, and all of it comes from the site's own data:

- **Conjugate** any verb — *conjugate prendere in the subjunctive*
- **Identify a form** — *what form is "fecero"*
- **Look words up** in the dictionary — *what does sciopero mean*
- **Translate** phrases — *how do you say "I'm tired" in Italian*
- **Explain grammar**: essere vs avere, the passato prossimo, passato prossimo vs imperfetto, the subjunctive, gender and articles, prepositions with the article, the partitive, object pronouns (single and combined), ci and ne, negation, adjectives (bello, buono, grande), the future and the future of probability, the conditional and se clauses, sapere vs conoscere, piacere, tu vs Lei, reflexive verbs, comparatives and superlatives, da vs per, double consonants and written accents.`;
}

export const PACK = {
  code: 'it',
  conjugate,
  PERSONS,
  PERSON_LABELS,
  TOPICS,
  SMALL_TALK,
  EXCLAMATIONS,
  GLOSSES: new Map(COMMON_VERBS),

  shape: {
    moods: ['indicativo', 'congiuntivo'],
    imperative: 'imperativo',
    affirmative: 'affermativo',
    nonFinite: 'forme',
    gerund: 'gerundio',
    participle: 'participioPassato',
  },

  /**
   * A closed list, for the same reason as the Spanish and French ones: English
   * has its share of words ending in -are and -ire (*care*, *share*, *fire*,
   * *desire*), and reading one of those as a verb is worse than missing an
   * unusual Italian one.
   */
  KNOWN_VERBS: new Set([
    ...COMMON_VERBS.map(([verb]) => fold(verb)),
    ...namesOf(IRREGULARS).map(fold),
  ]),

  /** -are, -ere, -ire, the contracted -rre, and the reflexive -rsi. */
  INFINITIVE: /(?:are|ere|ire|rre|rsi)$/,

  TENSE_LABELS,
  // Compound tenses are not single words, so they are never looked up.
  INDEX_TENSES: Object.keys(TENSE_LABELS).filter((key) => key !== 'indicativo.passatoProssimo'),

  FORM_LABELS: {
    imperative: { it: 'imperativo', en: 'imperative' },
    gerund: { it: 'gerundio', en: 'gerund' },
    participle: { it: 'participio passato', en: 'past participle' },
  },

  /**
   * Matched against the folded question. *tempo* is left out on purpose: it is
   * also the weather and the "time" of *da quanto tempo*, and a duration
   * question that names a verb should not turn into a table.
   */
  CONJUGATION_CUE: /\b(coniug\w*|conjug\w*|tense|tenses|tempi|forms?|forma|forme|present|presente|passato|past|prossimo|remoto|imperfetto|imperfect|futuro|future|congiuntivo|subjunctive|condizionale|conditional|imperativo|imperative|participio|participle|gerundio|gerund|infinito|infinitive)\b/,

  /**
   * Order matters: the first match wins, so the two-word names come before the
   * single words they contain — "congiuntivo presente" must not stop at
   * "presente", nor "passato remoto" at "passato".
   */
  TENSE_HINTS: [
    [/\b(passato prossimo|present perfect|perfect)\b/, 'indicativo.passatoProssimo'],
    [/\b(congiuntivo imperfetto|imperfetto (?:del )?congiuntivo|imperfect subjunctive)\b/, 'congiuntivo.imperfetto'],
    [/\b(congiuntivo presente|presente (?:del )?congiuntivo|present subjunctive)\b/, 'congiuntivo.presente'],
    [/\b(passato remoto|remote past|simple past|preterite)\b/, 'indicativo.passatoRemoto'],
    [/\b(imperfetto|imperfect)\b/, 'indicativo.imperfetto'],
    [/\b(presente|present)\b/, 'indicativo.presente'],
    [/\b(futuro|future)\b/, 'indicativo.futuro'],
    [/\b(condizionale|conditional)\b/, 'indicativo.condizionale'],
    [/\b(congiuntivo|subjunctive)\b/, 'congiuntivo.presente'],
    [/\b(passato|past)\b/, 'indicativo.passatoProssimo'],
  ],

  /**
   * Matched against the accented text. *Lei* counts as the third person, which
   * is what it is grammatically, formal or not.
   */
  PERSON_HINTS: [
    [/\b(io|first person singular|prima persona singolare)\b/, 'io'],
    [/\b(tu|second person singular|seconda persona singolare)\b/, 'tu'],
    [/\b(lui|lei|third person singular|terza persona singolare)\b/, 'lui'],
    [/\b(noi|first person plural|prima persona plurale)\b/, 'noi'],
    [/\b(voi|second person plural|seconda persona plurale)\b/, 'voi'],
    [/\b(loro|third person plural|terza persona plurale)\b/, 'loro'],
  ],

  /**
   * Counted on the lowercased question. Words ending in an accented letter
   * (*perché*, *cos'è*) are left to the diacritics test: \b does not see a
   * boundary after *é*, so listing them here would never match.
   */
  MARKERS: {
    study: /\b(che|cosa|come|quando|quale|qual|il|lo|la|gli|le|un|uno|una|di|del|della|vuol|dire|significa|differenza|tra|fra|coniuga|coniugare|spiega|spiegami|aiuto|verbo|parola|si|dice|ciao|buongiorno|buonasera|salve|grazie|arrivederci|in italiano|italiano)\b/g,
    english: /\b(what|how|when|why|which|does|do|is|are|the|of|mean|means|say|difference|between|conjugate|tell|explain|help|verb|word|in italian)\b/g,
    diacritics: /[àèéìíòóùú]/,
  },

  INTENTS: {
    conjugate: /(?:coniuga(?:re|mi)?|coniugazione\s+(?:di|del|dello)|conjugate|conjugation\s+(?:of|for)|come si coniuga)\s+(?:il\s+|lo\s+|l'|the\s+)?(?:verbo?\s+)?([a-zàèéìíòóù']+)/i,
    verbMarker: /\b(?:verbo|verb)\s+([a-zàèéìíòóù']{2,})\b/i,
    conjugateTrailing: /^([a-zàèéìíòóù']+)\s+(?:conjugation|conjugated|coniugazione|coniugato)\b/i,
    define: /(?:che cosa vuol dire|cosa vuol dire|che vuol dire|vuol dire|cosa significa|che significa|significato di|definizione di|definisci|define|what does|what is the meaning of|meaning of)\s+["«'“]?\s*([a-zàèéìíòóù'-]+)\s*["»'”]?/i,
    translateInto: /(?:come si dice|come dico|come posso dire|how do you say|how do i say|how to say|how would you say|how do u say|how say|translate)\s+["«'“]?(.+?)["»'”]?\s*(?:in italiano|in italian|in english|in inglese)?\s*[.?!]*$/i,
    translateAny: /(?:traduci|tradurre|traduzione di|translate)\s+["«'“]?(.+?)["»'”]?\s*$/i,
    whatForm: /(?:che forma è|che forma e|quale forma è|che cos'è|cos'è|what form is|what is)\s+["«'“]?\s*([a-zàèéìíòóù'-]+)\s*["»'”]?/i,
    intoStudy: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into)\s+(?:italian|italiano)\s*[.?!]*$/i,
    intoEnglish: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into)\s+(?:english|inglese)\s*[.?!]*$/i,
    bareEnglishVerb: /^\s*to\s+([a-z]+(?:\s+[a-z]+){0,2})\s*[.?!]*$/i,
    intoStudyLanguage: /(?:in italiano|in italian)/i,
    /** Only an explicit "in English" sends a "how do you say" the other way. */
    intoEnglishLanguage: /(?:in english|in inglese)/i,
  },

  /**
   * Stripped from the folded question before a topic is matched exactly. The
   * word articles need a space after them, or "imperfetto" would lose its
   * first letter to *i*; the elided ones carry their own apostrophe.
   */
  LEADING_ARTICLE: /^(?:(?:il|lo|la|i|gli|le|un|uno|una|the|a)\s+|(?:l|un)['’]\s*)/,

  HELP: /\b(aiuto|help|cosa sai fare|che cosa sai fare|cosa puoi fare|what can you do)\b/,

  describeFlags,

  verbHeadline(result, gloss, lead, language) {
    const group = GROUP_NAMES[groupOf(result)][language];
    const ending = endingOf(result);
    return language === 'it'
      ? `${lead}**${result.verb}**${gloss ? ` — *${gloss}*` : ''}. Verbo in -${ending}, ${group}${describeFlags(result, 'it')}.`
      : `${lead}**${result.verb}**${gloss ? ` — *${gloss}*` : ''}. A ${group} verb in -${ending}${describeFlags(result, 'en')}.`;
  },

  // The Italian counterpart of the French case: an irregular verb that also
  // takes essere — andare, venire, essere itself — asks the most of a learner.
  isHairy: (result) => result.flags.irregular && result.auxiliary === 'essere',

  capabilities,

  /**
   * The capabilities as blocks, for the one path in the router that answers
   * with a pack's CAPABILITIES directly (a "how do you say" with nothing after
   * it). The other packs leave it undefined, which makes that path throw.
   */
  CAPABILITIES: {
    it: [{ type: 'md', text: capabilities('it') }],
    en: [{ type: 'md', text: capabilities('en') }],
  },

  outOfScope(language, exclaim) {
    return language === 'it'
      ? `${exclaim}Su questo non posso aiutarti. Rispondo soltanto con i dati del sito — il coniugatore, il dizionario e una serie di schede di grammatica — e preferisco non dire nulla piuttosto che inventare.

Chiesto in un altro modo, forse posso risponderti. Prova una di queste — oppure scrivi **aiuto** per vedere l'elenco completo:`
      : `${exclaim}That one's outside what I cover. I answer from the site's own data — the conjugator, the dictionary and a set of grammar explanations — so I'd rather say nothing than invent an answer.

Asked another way, I might be able to. Try one of these — or type **help** for the full list:`;
  },

  /** The shapes a question can be put in so the tutor can answer it. See tutor.js. */
  REPHRASE: {
    it: {
      define: (word) => `cosa vuol dire ${word}`,
      conjugate: (verb) => `coniuga ${verb}`,
      translate: (phrase) => `come si dice "${phrase}" in italiano`,
      examples: ['coniuga partire', 'cosa vuol dire sciopero', 'che forma è «fecero»', 'il congiuntivo'],
    },
    en: {
      define: (word) => `what does ${word} mean`,
      conjugate: (verb) => `conjugate ${verb}`,
      translate: (phrase) => `how do you say "${phrase}" in Italian`,
      examples: ['conjugate partire', 'what does sciopero mean', 'what form is "fecero"', 'the subjunctive'],
    },
  },

  labels: {
    fullTable: { it: 'Tabella completa', en: 'Full table' },
    fullEntry: { it: 'Voce completa', en: 'Full entry' },
    conjugation: { it: 'Coniugazione', en: 'Conjugation' },
    synonyms: { it: '**Sinonimi:** ', en: '**Synonyms:** ' },
    person: { it: 'persona', en: 'person' },
    form: { it: 'forma', en: 'form' },
    conjugatedForm: { it: 'È una forma coniugata:', en: "That's a conjugated form:" },
    otherTenses: { it: '_Gli altri tempi sono nella tabella completa._', en: '_The remaining tenses are in the full table._' },
    of: { it: 'di', en: 'of' },
    translatedWith: { it: 'tradotto con', en: 'translated with' },
  },

  DEFAULT_TENSES: ['indicativo.presente', 'indicativo.passatoProssimo', 'congiuntivo.presente'],
};
