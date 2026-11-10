/**
 * The Dutch language pack for the tutor.
 *
 * The same contract as tutor-es.js, tutor-fr.js, tutor-it.js and tutor-pt.js.
 * What differs beyond vocabulary: the tenses go by their school names and
 * abbreviations (o.t.t., o.v.t., v.t.t., v.v.t.), which Dutch learners meet
 * before the Latin ones; only two of them are single words, so only those two
 * go into the form index; and a separable verb's finite forms are two words
 * (bel op), so they are not indexed either, while its participle (opgebeld)
 * is. The imperative has a *u* cell that no indicative person matches, so it
 * gets a label of its own.
 */

import {
  conjugate, PERSONS, PERSON_LABELS as ENGINE_PERSON_LABELS, CLASS_LABELS,
} from './conjugator-nl.js';
import { COMMON_VERBS, IRREGULARS } from '../data/verbs-nl.js';
import { TOPICS, SMALL_TALK, EXCLAMATIONS } from '../data/grammar-nl.js';
import { fold } from './dom.js';

/**
 * The engine's labels, plus the imperative-only person. The imperative table
 * has a *u* cell (*werkt u*) that no indicative person matches, and the form
 * index labels every hit by its person; without this, "welke vorm is wees"
 * would answer "undefined, gebiedende wijs".
 */
const PERSON_LABELS = { u: 'u', ...ENGINE_PERSON_LABELS };

const TENSE_LABELS = {
  'indicatief.ott': { nl: 'tegenwoordige tijd (presens)', en: 'present (o.t.t.)' },
  'indicatief.ovt': { nl: 'verleden tijd (imperfectum)', en: 'simple past (o.v.t.)' },
  'indicatief.vtt': { nl: 'voltooid tegenwoordige tijd (perfectum)', en: 'present perfect (v.t.t.)' },
  'indicatief.vvt': { nl: 'voltooid verleden tijd (plusquamperfectum)', en: 'past perfect (v.v.t.)' },
  'indicatief.ottt': { nl: 'toekomende tijd', en: 'future' },
  'indicatief.ovtt': { nl: 'voorwaardelijke wijs (zou)', en: 'conditional (zou)' },
  'conjunctief.ott': { nl: 'aanvoegende wijs', en: 'subjunctive (archaic)' },
};

function describeFlags(result, language) {
  const nl = language === 'nl';
  const parts = [];
  const { flags } = result;
  if (flags.ortho) parts.push(nl ? `spelling ${flags.ortho}` : `spelling ${flags.ortho}`);
  if (flags.irregular) parts.push(nl ? 'onregelmatig' : 'irregular');
  if (flags.derivedFrom) {
    parts.push(nl ? `vervoegt als *${flags.derivedFrom}*` : `conjugated like *${flags.derivedFrom}*`);
  }
  if (flags.separable) parts.push(nl ? `scheidbaar: *${flags.separable}*` : `separable: *${flags.separable}*`);
  if (result.pronominal) parts.push(nl ? 'wederkerend' : 'reflexive');
  if (result.auxiliary === 'zijn') parts.push(nl ? 'hulpwerkwoord *zijn*' : 'takes *zijn*');
  return parts.length ? `, ${parts.join(', ')}` : '';
}

/** IRREGULARS may be keyed by infinitive or listed; either way, the names. */
function namesOf(collection) {
  if (!collection) return [];
  if (collection instanceof Set || Array.isArray(collection)) return [...collection];
  return Object.keys(collection);
}

/**
 * The grammar notes, named by their own titles, so the list on offer is
 * always the list that exists: a note added to grammar-nl.js is announced
 * here without anyone remembering to say so.
 */
function topicTitles(language) {
  return TOPICS
    .map((topic) => topic.title[language] ?? topic.title.en)
    .map((title) => (/^['’]/.test(title) ? title : title.charAt(0).toLowerCase() + title.slice(1)))
    .join(', ');
}

function capabilities(language) {
  return language === 'nl'
    ? `Dit kan ik, en alles komt uit de gegevens van de site zelf:

- **Vervoegen** van elk werkwoord: *vervoeg gaan in de verleden tijd*
- **Een vorm herkennen**: *welke vorm is «ging»*
- **Woorden opzoeken** in het woordenboek: *wat betekent gezellig*
- **Zinnen vertalen**: *hoe zeg je "I'm tired" in het Nederlands*
- **Grammatica uitleggen**: ${topicTitles('nl')}.`
    : `Here's what I can do, and all of it comes from the site's own data:

- **Conjugate** any verb: *conjugate gaan in the past tense*
- **Identify a form**: *what form is "ging"*
- **Look words up** in the dictionary: *what does gezellig mean*
- **Translate** phrases: *how do you say "I'm tired" in Dutch*
- **Explain grammar**: ${topicTitles('en')}.`;
}

const upperFirst = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const PACK = {
  code: 'nl',
  conjugate,
  PERSONS,
  PERSON_LABELS,
  TOPICS,
  SMALL_TALK,
  EXCLAMATIONS,
  GLOSSES: new Map(COMMON_VERBS),

  shape: {
    moods: ['indicatief', 'conjunctief'],
    imperative: 'imperatief',
    affirmative: 'bevestigend',
    nonFinite: 'vormen',
    gerund: 'tegenwoordigDeelwoord',
    participle: 'voltooidDeelwoord',
  },

  /**
   * A closed list, for the same reason as the other packs: English has its
   * share of words ending in -en (*open*, *garden*, *listen*, *even*), and
   * reading one of those as a verb is worse than missing an unusual Dutch one.
   */
  KNOWN_VERBS: new Set([
    ...COMMON_VERBS.map(([verb]) => fold(verb)),
    ...namesOf(IRREGULARS).map(fold),
  ]),

  /** -en, or a bare -n after a long vowel (gaan, doen, zien, zijn, skiën). */
  INFINITIVE: /(?:[a-z]en|aan|oen|ien|ijn|ën)$/,

  TENSE_LABELS,
  // Every other tense is two words, so it is never looked up.
  INDEX_TENSES: ['indicatief.ott', 'indicatief.ovt'],

  FORM_LABELS: {
    imperative: { nl: 'gebiedende wijs', en: 'imperative' },
    gerund: { nl: 'tegenwoordig deelwoord', en: 'present participle' },
    participle: { nl: 'voltooid deelwoord', en: 'past participle' },
  },

  /**
   * Matched against the folded question. *tijd* is in: unlike Italian's
   * *tempo* it is rarely the weather, and "in de verleden tijd" is how every
   * Dutch learner names a tense.
   */
  CONJUGATION_CUE: /\b(vervoeg\w*|conjug\w*|tense|tenses|tijd|tijden|vorm|vormen|forms?|tegenwoordig\w*|verleden|voltooid\w*|toekomend\w*|toekomst|future|present|past|perfectum|imperfectum|plusquamperfectum|presens|conditional|voorwaardelijk\w*|subjunctive|aanvoegend\w*|conjunctief|imperative|gebiedend\w*|deelwoord|participle|infinitief|infinitive)\b/,

  /**
   * Order matters: the first match wins, so the longer names come before the
   * words they contain. "voltooid verleden tijd" must stop neither at
   * "verleden tijd" nor at "voltooid", and "voltooid tegenwoordige tijd" not
   * at "tegenwoordige tijd". The Latin names and the school abbreviations are
   * accepted alongside.
   */
  TENSE_HINTS: [
    [/\b(voltooid verleden tijd|plusquamperfectum|past perfect|pluperfect|vvt|v v t)\b/, 'indicatief.vvt'],
    [/\b(voltooid tegenwoordige tijd|voltooid tegenwoordig|perfectum|present perfect|vtt|v t t)\b/, 'indicatief.vtt'],
    [/\b(aanvoegende wijs|aanvoegend|conjunctief|subjunctive)\b/, 'conjunctief.ott'],
    [/\b(voorwaardelijke wijs|voorwaardelijk|conditionalis|conditional|ovtt|zou vorm)\b/, 'indicatief.ovtt'],
    [/\b(toekomende tijd|toekomstige tijd|toekomst|futurum|future|ottt)\b/, 'indicatief.ottt'],
    [/\b(onvoltooid verleden tijd|verleden tijd|imperfectum|verleden|simple past|past tense|past|preterite|ovt|o v t)\b/, 'indicatief.ovt'],
    [/\b(onvoltooid tegenwoordige tijd|tegenwoordige tijd|tegenwoordig|presens|present|ott|o t t)\b/, 'indicatief.ott'],
    [/\b(voltooid|perfect)\b/, 'indicatief.vtt'],
  ],

  /**
   * Matched against the accented text. *je* and *het* are left out: the one
   * is "you" in every "hoe vervoeg je", the other the article of "in het
   * perfectum", and either would turn a table into a single form. *ze* and
   * *zij* are the third person singular unless a plural cue says otherwise,
   * so the plural patterns come first.
   */
  PERSON_HINTS: [
    [/\b(zij meervoud|ze meervoud|zij \(meervoud\)|ze \(meervoud\)|derde persoon meervoud|third person plural|they)\b/, 'zij'],
    [/\b(ik|eerste persoon enkelvoud|first person singular)\b/, 'ik'],
    [/\b(jij|u|tweede persoon enkelvoud|second person singular)\b/, 'jij'],
    [/\b(hij|zij|ze|derde persoon enkelvoud|third person singular)\b/, 'hij'],
    [/\b(wij|eerste persoon meervoud|first person plural)\b/, 'wij'],
    [/\b(jullie|tweede persoon meervoud|second person plural)\b/, 'jullie'],
  ],

  /**
   * Counted on the lowercased question. The words the two languages share in
   * spelling are left out of both sides: *in*, *is*, *was*, *we*, *met* and
   * *over* would make an English question Dutch or a Dutch one English. *of*
   * is Dutch here and not English: "hebben of zijn" has no other word to go
   * on, while an English "of" always travels with a *the* or a *what*. Any
   * word built on *woord* (lidwoord, voornaamwoorden, woordvolgorde) is
   * Dutch too, which is how a one-word grammar question gets its answer in
   * Dutch. The accented words are left to the diacritics test.
   */
  MARKERS: {
    study: /\b(wat|hoe|wanneer|waarom|welke|welk|wie|waar|of|betekent|betekenis|vervoeg\w*|zeg|zegt|zeggen|je|jij|het|een|de|van|en|niet|geen|verschil|tussen|uitleg|leg uit|\w*woord\w*|hulp|hallo|hoi|bedankt|dank|graag|nederlands|engels|kofschip|meervoud|hoofdzin|bijzin|verleden|tegenwoordige|voltooid|tijd|wijs|vorm|passief|toekomst|wederkerend\w*|scheidba\w*|modale)\b/g,
    english: /\b(what|how|when|why|which|does|do|are|the|mean|means|say|difference|between|and|or|conjugate|tell|explain|help|verb|word|in dutch|dutch)\b/g,
    diacritics: /[éëïöüè]/,
  },

  INTENTS: {
    conjugate: /(?:hoe\s+vervoeg\s+je|vervoeging\s+van|vervoeging|vervoeg(?:\s+je)?|conjugate|conjugation\s+(?:of|for))\s+(?:het\s+|de\s+|the\s+)?(?:werkwoord\s+|verb\s+)?((?:zich\s+)?[a-zëïéü]+)/i,
    verbMarker: /\b(?:werkwoord|verb)\s+((?:zich\s+)?[a-zëïéü]{2,})\b/i,
    conjugateTrailing: /^((?:zich\s+)?[a-zëïéü]+)\s+(?:conjugation|conjugated|vervoeging|vervoegd|vervoegen)\b/i,
    define: /(?:wat betekent|wat is de betekenis van|de betekenis van|betekenis van|definitie van|wat betekend|define|what does|what is the meaning of|meaning of)\s+["«'“]?\s*([a-zëïéüöáàè'-]+)\s*["»'”]?/i,
    translateInto: /(?:hoe zeg je|hoe zeg ik|hoe zegt men|hoe zeggen we|hoe zou je zeggen|hoe vertaal je|how do you say|how do i say|how to say|how would you say|how do u say|how say|translate)\s+["«'“]?(.+?)["»'”]?\s*(?:in het nederlands|in het engels|in dutch|in english|naar het nederlands|naar het engels|into dutch|into english)?\s*[.?!]*$/i,
    translateAny: /(?:vertaal|vertaling van|translate)\s+["«'“]?(.+?)["»'”]?\s*$/i,
    whatForm: /(?:welke vorm is|wat voor vorm is|wat voor een vorm is|wat is de vorm van|wat is de vorm|welke vorm van|what form is|what is)\s+["«'“]?\s*([a-zëïéü'-]+)\s*["»'”]?/i,
    intoStudy: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into|naar)\s+(?:het\s+)?(?:dutch|nederlands)\s*[.?!]*$/i,
    intoEnglish: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into|naar)\s+(?:het\s+)?(?:english|engels)\s*[.?!]*$/i,
    bareEnglishVerb: /^\s*to\s+([a-z]+(?:\s+[a-z]+){0,2})\s*[.?!]*$/i,
    intoStudyLanguage: /(?:in het nederlands|naar het nederlands|in dutch|into dutch)/i,
    /** Only an explicit "in English" sends a "how do you say" the other way. */
    intoEnglishLanguage: /(?:in english|into english|in het engels|naar het engels)/i,
  },

  /**
   * Stripped from the folded question before a topic is matched exactly, so
   * "het meervoud" and "meervoud" find the same note. The grammar notes'
   * keywords were written against exactly this list.
   */
  LEADING_ARTICLE: /^(?:(?:de|het|een|the|a)\s+)/,

  HELP: /\b(help|hulp|wat kun je|wat kan je|wat kun jij|wat kan jij|what can you do)\b/,

  describeFlags,

  verbHeadline(result, gloss, lead, language) {
    const label = CLASS_LABELS[result.class]?.chip ?? CLASS_LABELS.te.chip;
    const name = `${lead}**${result.verb}**${gloss ? ` (*${gloss}*)` : ''}`;
    if (language === 'nl') return `${name}. ${upperFirst(label.nl)}${describeFlags(result, 'nl')}.`;
    const article = /^[aeiou]/.test(label.en) ? 'An' : 'A';
    return `${name}. ${article} ${label.en}${describeFlags(result, 'en')}.`;
  },

  /**
   * The verbs that ask the most of a learner: irregular in their own right
   * and taking zijn as well. komen, gaan and zijn itself light it up;
   * aankomen only follows komen.
   */
  isHairy: (result) => (result.flags.irregular || result.class === 'onregelmatig')
    && result.auxiliary === 'zijn' && !result.flags.derivedFrom,

  capabilities,

  /**
   * The capabilities as blocks, for the one path in the router that answers
   * with a pack's CAPABILITIES directly (a "how do you say" with nothing after
   * it).
   */
  CAPABILITIES: {
    nl: [{ type: 'md', text: capabilities('nl') }],
    en: [{ type: 'md', text: capabilities('en') }],
  },

  outOfScope(language, exclaim) {
    return language === 'nl'
      ? `${exclaim}Daar kan ik je niet mee helpen. Ik antwoord alleen uit de gegevens van de site (de vervoeger, het woordenboek en een reeks grammaticanotities), en ik zeg liever niets dan iets te verzinnen.

Anders gevraagd lukt het misschien wel. Probeer een van deze, of typ **help** voor de hele lijst:`
      : `${exclaim}That one's outside what I cover. I answer from the site's own data (the conjugator, the dictionary and a set of grammar explanations), so I'd rather say nothing than invent an answer.

Asked another way, I might be able to. Try one of these, or type **help** for the full list:`;
  },

  /** The shapes a question can be put in so the tutor can answer it. See tutor.js. */
  REPHRASE: {
    nl: {
      define: (word) => `wat betekent ${word}`,
      conjugate: (verb) => `vervoeg ${verb}`,
      translate: (phrase) => `hoe zeg je "${phrase}" in het Nederlands`,
      examples: ['vervoeg gaan', 'wat betekent gezellig', 'welke vorm is «ging»', 'de of het'],
    },
    en: {
      define: (word) => `what does ${word} mean`,
      conjugate: (verb) => `conjugate ${verb}`,
      translate: (phrase) => `how do you say "${phrase}" in Dutch`,
      examples: ['conjugate gaan', 'what does gezellig mean', 'what form is "ging"', 'de or het'],
    },
  },

  labels: {
    fullTable: { nl: 'Volledige tabel', en: 'Full table' },
    fullEntry: { nl: 'Volledig lemma', en: 'Full entry' },
    conjugation: { nl: 'Vervoeging', en: 'Conjugation' },
    synonyms: { nl: '**Synoniemen:** ', en: '**Synonyms:** ' },
    person: { nl: 'persoon', en: 'person' },
    form: { nl: 'vorm', en: 'form' },
    conjugatedForm: { nl: 'Dat is een vervoegde vorm:', en: "That's a conjugated form:" },
    otherTenses: { nl: '_De andere tijden staan in de volledige tabel._', en: '_The remaining tenses are in the full table._' },
    of: { nl: 'van', en: 'of' },
    translatedWith: { nl: 'vertaald met', en: 'translated with' },
  },

  DEFAULT_TENSES: ['indicatief.ott', 'indicatief.ovt', 'indicatief.vtt'],

  /** The regular verbs a tense is shown on when no verb is named. */
  MODEL_VERBS: ['werken', 'spelen', 'kijken'],
};
