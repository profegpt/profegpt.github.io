/**
 * The German language pack for the tutor.
 *
 * The same contract as tutor-es.js, tutor-fr.js, tutor-it.js and tutor-pt.js.
 * What differs beyond vocabulary: the verb classes are weak, strong and mixed
 * rather than conjugations read off the infinitive, so the headline names the
 * class the engine found; the compound tenses are two words and the separable
 * verbs put a space in every finite form, so the form index holds only the
 * four one-word tenses; and the tense names are the Latin ones German schools
 * use (Präsens, Präteritum, Perfekt), which a learner types with or without
 * their umlauts and with "ii", "2" or "zwei" for the second Konjunktiv.
 */

import {
  conjugate, PERSONS, PERSON_LABELS, CLASS_LABELS, STEM_CHANGE_LABELS,
} from './conjugator-de.js';
import { COMMON_VERBS, IRREGULARS } from '../data/verbs-de.js';
import { TOPICS, SMALL_TALK, EXCLAMATIONS } from '../data/grammar-de.js';
import { fold } from './dom.js';

/**
 * Tense names are nouns in German and are written capitalised wherever they
 * appear; the router upper-cases the first letter itself where a label opens
 * a heading, which leaves these unchanged.
 */
const TENSE_LABELS = {
  'indikativ.praesens': { de: 'Präsens', en: 'present' },
  'indikativ.praeteritum': { de: 'Präteritum', en: 'Präteritum (simple past)' },
  'indikativ.perfekt': { de: 'Perfekt', en: 'Perfekt (present perfect)' },
  'indikativ.plusquamperfekt': { de: 'Plusquamperfekt', en: 'Plusquamperfekt (past perfect)' },
  'indikativ.futur1': { de: 'Futur I', en: 'Futur I (future)' },
  'indikativ.futur2': { de: 'Futur II', en: 'Futur II (future perfect)' },
  'konjunktiv.konjunktiv1': { de: 'Konjunktiv I', en: 'Konjunktiv I (reported speech)' },
  'konjunktiv.konjunktiv2': { de: 'Konjunktiv II', en: 'Konjunktiv II (would, were)' },
  'konjunktiv.wuerde': { de: 'Konjunktiv II mit würde', en: 'Konjunktiv II with würde' },
};

function describeFlags(result, language) {
  const de = language === 'de';
  const parts = [];
  const { flags } = result;
  if (flags.stemChange) {
    const change = STEM_CHANGE_LABELS[flags.stemChange] ?? flags.stemChange;
    parts.push(de ? `mit Vokalwechsel ${change}` : `with a ${change} vowel change`);
  }
  if (flags.ortho) parts.push(de ? `Schreibung ${flags.ortho}` : `spelling ${flags.ortho}`);
  if (flags.irregular) parts.push(de ? 'unregelmäßig' : 'irregular');
  if (flags.separable) parts.push(de ? `trennbar: ${flags.separable}` : `separable: ${flags.separable}`);
  if (flags.derivedFrom) {
    parts.push(de ? `konjugiert wie *${flags.derivedFrom}*` : `conjugated like *${flags.derivedFrom}*`);
  }
  if (result.pronominal) parts.push(de ? 'reflexiv' : 'reflexive');
  if (result.auxiliary === 'sein') parts.push(de ? 'Perfekt mit *sein*' : 'takes *sein*');
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
 * always the list that exists: a note added to grammar-de.js is announced
 * here without anyone remembering to say so. German titles keep their
 * capitals, since most of them begin with a noun.
 */
function topicTitles(language) {
  return TOPICS
    .map((topic) => topic.title[language] ?? topic.title.en)
    .map((title) => (language === 'de' ? title : title.charAt(0).toLowerCase() + title.slice(1)))
    .join(', ');
}

function capabilities(language) {
  return language === 'de'
    ? `Das kann ich, und alles kommt aus den Daten der Seite selbst:

- **Verben konjugieren**: *konjugiere gehen im Konjunktiv*
- **Eine Form erkennen**: *welche Form ist «ging»*
- **Ein Wort nachschlagen** im Wörterbuch: *was bedeutet Fernweh*
- **Übersetzen**: *wie sagt man "I'm tired" auf Deutsch*
- **Grammatik erklären**: ${topicTitles('de')}.`
    : `Here's what I can do, and all of it comes from the site's own data:

- **Conjugate** any verb: *conjugate gehen in the Konjunktiv*
- **Identify a form**: *what form is "ging"*
- **Look words up** in the dictionary: *what does Fernweh mean*
- **Translate** phrases: *how do you say "I'm tired" in German*
- **Explain grammar**: ${topicTitles('en')}.`;
}

/** The class chip, read as the opening of a sentence: "Starkes Verb". */
function className(result, language) {
  const label = CLASS_LABELS[result.class]?.chip?.[language] ?? result.class;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export const PACK = {
  code: 'de',
  conjugate,
  PERSONS,
  PERSON_LABELS,
  TOPICS,
  SMALL_TALK,
  EXCLAMATIONS,
  GLOSSES: new Map(COMMON_VERBS),

  shape: {
    moods: ['indikativ', 'konjunktiv'],
    imperative: 'imperativ',
    affirmative: 'affirmativ',
    nonFinite: 'formen',
    gerund: 'partizip1',
    participle: 'partizip2',
  },

  /**
   * A closed list, for the same reason as the other packs: English has its
   * share of words ending in -en and -n (*open, listen, garden, when*), and
   * reading one of those as a verb is worse than missing an unusual German one.
   */
  KNOWN_VERBS: new Set([
    ...COMMON_VERBS.map(([verb]) => fold(verb)),
    ...namesOf(IRREGULARS).map(fold),
  ]),

  /** The engine's own shape test: -en, -eln, -ern, and the short -n of tun and sein. */
  INFINITIVE: /(?:en|eln|ern|n)$/,

  TENSE_LABELS,
  /**
   * The compound tenses are two words and are never looked up; the four
   * one-word tenses are what the index holds. A separable verb puts a space
   * in those too (*stehe auf*), and the router skips any form with a space.
   */
  INDEX_TENSES: ['indikativ.praesens', 'indikativ.praeteritum', 'konjunktiv.konjunktiv1', 'konjunktiv.konjunktiv2'],

  FORM_LABELS: {
    imperative: { de: 'Imperativ', en: 'imperative' },
    gerund: { de: 'Partizip I', en: 'Partizip I (present participle)' },
    participle: { de: 'Partizip II', en: 'Partizip II (past participle)' },
  },

  /**
   * Matched against the folded question, so the umlauts are already gone:
   * *Präsens* arrives as *prasens*. *Zeit* on its own is left out, because
   * "keine Zeit" and "wie viel Zeit" are not questions about tenses.
   */
  CONJUGATION_CUE: /\b(konjug\w*|conjug\w*|tense|tenses|zeitform|zeitformen|tempus|forms?|formen|prasens|praesens|present|prateritum|praeteritum|preterite|perfekt|perfect|plusquamperfekt|pluperfect|past|vergangenheit|futur|future|zukunft|konjunktiv|subjunctive|imperativ|imperative|partizip|participle|infinitiv|infinitive)\b/,

  /**
   * Order matters: the first match wins, so the two-word names come before the
   * single words they contain. "Konjunktiv II mit würde" must stop neither at
   * "Konjunktiv II" nor at "Konjunktiv", "Futur II" not at "Futur", and
   * "Plusquamperfekt" not at "Perfekt". The roman numerals are accepted as
   * digits and as words, because every keyboard has those. A bare
   * *Konjunktiv* is the Konjunktiv II: it is the one a learner uses, and the
   * one the grammar note of that name is about.
   */
  TENSE_HINTS: [
    [/\b(konjunktiv (?:ii|2|zwei) mit wurde|konjunktiv mit wurde|wurde-?form|wurde form|would form)\b/, 'konjunktiv.wuerde'],
    [/\b(konjunktiv (?:ii|2|zwei)|k ?ii|past subjunctive|subjunctive (?:ii|2)|conditional|konditional)\b/, 'konjunktiv.konjunktiv2'],
    [/\b(konjunktiv (?:i|1|eins)|k ?i|present subjunctive|subjunctive (?:i|1)|indirekte rede|reported speech)\b/, 'konjunktiv.konjunktiv1'],
    [/\b(futur (?:ii|2|zwei)|future perfect|futur perfekt|vollendete zukunft)\b/, 'indikativ.futur2'],
    [/\b(plusquamperfekt|past perfect|pluperfect|vorvergangenheit)\b/, 'indikativ.plusquamperfekt'],
    [/\b(prateritum|praeteritum|preterite|simple past|imperfekt|imperfect)\b/, 'indikativ.praeteritum'],
    [/\b(perfekt|present perfect|perfect)\b/, 'indikativ.perfekt'],
    [/\b(prasens|praesens|present|gegenwart)\b/, 'indikativ.praesens'],
    [/\b(futur(?: (?:i|1|eins))?|future|zukunft)\b/, 'indikativ.futur1'],
    [/\b(konjunktiv|subjunctive)\b/, 'konjunktiv.konjunktiv2'],
    [/\b(vergangenheit|past)\b/, 'indikativ.praeteritum'],
  ],

  /**
   * Matched against the accented text. *sie* is read as the plural, which is
   * also the polite Sie; *er*, *sie* and *es* share one row of the table
   * anyway, so a *sie* meant as "she" lands on the right form regardless.
   */
  PERSON_HINTS: [
    [/\b(ich|first person singular|erste person singular|1\. person singular)\b/, 'ich'],
    [/\b(du|second person singular|zweite person singular|2\. person singular)\b/, 'du'],
    [/\b(er|es|he|she|it|third person singular|dritte person singular|3\. person singular)\b/, 'er'],
    [/\b(wir|we|first person plural|erste person plural|1\. person plural)\b/, 'wir'],
    [/\b(ihr|second person plural|zweite person plural|2\. person plural)\b/, 'ihr'],
    [/\b(sie|they|third person plural|dritte person plural|3\. person plural|höflichkeitsform)\b/, 'sie'],
  ],

  /**
   * Counted on the lowercased question. The words the two languages share in
   * spelling are left out of both sides: *die*, *was*, *in*, *an*, *man*,
   * *hat*, *form* and *verb* would pull a question the wrong way. Umlauts are
   * left to the diacritics test, which is why *können* and *über* are absent
   * here and *für* does not collide with *for*.
   */
  MARKERS: {
    study: /\b(wie|wann|warum|wo|wer|wen|wem|welche|welcher|welches|ist|sind|ich|du|ihr|und|oder|der|das|den|dem|des|ein|eine|einen|einem|nicht|kein|keine|mit|von|zu|zum|zur|im|auf|aus|bei|nach|dass|weil|denn|wenn|als|bedeutet|heißt|heisst|sagt|konjugiere|konjugier|konjugiert|konjugation|übersetze|ubersetze|übersetz|erkläre|erklare|erklär|unterschied|zwischen|hilfe|wort|bitte|hallo|danke|deutsch|verben|konjunktiv|nominativ|akkusativ|dativ|genitiv|artikel|nebensatz|hauptsatz|wortstellung|modalverben|modalverb|trennbare|untrennbare|perfekt|imperativ|passiv|relativsatz|adjektivendungen|pronomen|personalpronomen|konjunktionen|verneinung|sein|haben|werden|kennen|wissen|mich|mir|dich|dir|uns|euch|gern|mal|noch|schon|auch)\b/g,
    english: /\b(what|how|when|why|which|who|does|do|is|are|the|of|a|to|i|you|mean|means|say|difference|between|and|or|conjugate|conjugation|tell|explain|help|word|use|with|for|german|english|verbs|tense|tenses|sentence|clause|clauses|order|case|cases|not|no|my|me|it|this|that)\b/g,
    diacritics: /[äöüß]/,
  },

  INTENTS: {
    conjugate: /(?:konjugier(?:e|en|t)?|konjugation\s+(?:von|des\s+verbs|des)|wie konjugiert man|conjugate|conjugation\s+(?:of|for))\s+(?:mal\s+|bitte\s+|mir\s+)?(?:das\s+|den\s+|the\s+)?(?:verb\s+)?((?:sich\s+)?[a-zäöüß]+)/i,
    verbMarker: /\b(?:verb)\s+((?:sich\s+)?[a-zäöüß]{2,})\b/i,
    conjugateTrailing: /^((?:sich\s+)?[a-zäöüß]+)\s+(?:conjugation|conjugated|konjugation|konjugiert|konjugieren)\b/i,
    define: /(?:was bedeutet|was heißt|was heisst|bedeutung von|definition von|was ist ein|was ist eine|define|what does|what is the meaning of|meaning of|definition of)\s+["«'„“]?\s*([a-zäöüß'-]+)\s*["»'“”]?/i,
    translateInto: /(?:wie sagt man|wie sage ich|wie sagt|wie heißt|wie heisst|how do you say|how do i say|how to say|how would you say|how do u say|how say|translate)\s+["«'„“]?(.+?)["»'“”]?\s*(?:auf deutsch|in german|ins deutsche|auf englisch|in english|ins englische)?\s*[.?!]*$/i,
    translateAny: /(?:übersetze|übersetz|ubersetze|ubersetz|übersetzung von|ubersetzung von|translate)\s+["«'„“]?(.+?)["»'“”]?\s*$/i,
    whatForm: /(?:welche form ist|was für eine form ist|was fur eine form ist|was ist die form von|was ist die form|welche form|what form is|what is)\s+["«'„“]?\s*([a-zäöüß'-]+)\s*["»'“”]?/i,
    intoStudy: /^\s*["«'„“]?(.+?)["»'“”]?\s+(?:in|into|auf|ins)\s+(?:german|deutsch|deutsche)\s*[.?!]*$/i,
    intoEnglish: /^\s*["«'„“]?(.+?)["»'“”]?\s+(?:in|into|auf|ins)\s+(?:english|englisch|englische)\s*[.?!]*$/i,
    bareEnglishVerb: /^\s*to\s+([a-z]+(?:\s+[a-z]+){0,2})\s*[.?!]*$/i,
    intoStudyLanguage: /(?:auf deutsch|in german|ins deutsche)/i,
    /** Only an explicit "in English" sends a "how do you say" the other way. */
    intoEnglishLanguage: /(?:in english|auf englisch|ins englische)/i,
  },

  /**
   * Stripped from the folded question before a topic is matched exactly, so
   * "der Konjunktiv" and "Konjunktiv" find the same note. The grammar notes'
   * keywords were written against exactly this list.
   */
  LEADING_ARTICLE: /^(?:(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|the|a)\s+)/,

  HELP: /\b(hilfe|help|was kannst du|what can you do)\b/,

  describeFlags,

  verbHeadline(result, gloss, lead, language) {
    const name = `${lead}**${result.verb}**${gloss ? ` (*${gloss}*)` : ''}`;
    if (language === 'de') return `${name}. ${className(result, 'de')}${describeFlags(result, 'de')}.`;
    return `${name}. A ${CLASS_LABELS[result.class]?.chip?.en ?? result.class}${describeFlags(result, 'en')}.`;
  },

  /**
   * The verbs that ask the most of a learner: the anomalous ones that also
   * take sein, which is sein itself, werden and werden's compounds. A strong
   * verb with sein (gehen, kommen) is ordinary German; a weak verb with a
   * full irregular paradigm (haben) at least keeps its auxiliary.
   */
  isHairy: (result) => result.flags.irregular && result.auxiliary === 'sein',

  capabilities,

  /**
   * The capabilities as blocks, for the one path in the router that answers
   * with a pack's CAPABILITIES directly (a "how do you say" with nothing after
   * it).
   */
  CAPABILITIES: {
    de: [{ type: 'md', text: capabilities('de') }],
    en: [{ type: 'md', text: capabilities('en') }],
  },

  outOfScope(language, exclaim) {
    return language === 'de'
      ? `${exclaim}Dabei kann ich dir nicht helfen. Ich antworte nur mit den Daten der Seite (dem Konjugator, dem Wörterbuch und einer Reihe von Grammatiknotizen) und sage lieber nichts, als mir etwas auszudenken.

Anders gefragt, kann ich vielleicht antworten. Probier eine dieser Fragen oder schreib **Hilfe** für die ganze Liste:`
      : `${exclaim}That one's outside what I cover. I answer from the site's own data (the conjugator, the dictionary and a set of grammar explanations), so I'd rather say nothing than invent an answer.

Asked another way, I might be able to. Try one of these, or type **help** for the full list:`;
  },

  /** The shapes a question can be put in so the tutor can answer it. See tutor.js. */
  REPHRASE: {
    de: {
      define: (word) => `was bedeutet ${word}`,
      conjugate: (verb) => `konjugiere ${verb}`,
      translate: (phrase) => `wie sagt man "${phrase}" auf Deutsch`,
      examples: ['konjugiere gehen', 'was bedeutet Fernweh', 'welche Form ist «ging»', 'der Konjunktiv II'],
    },
    en: {
      define: (word) => `what does ${word} mean`,
      conjugate: (verb) => `conjugate ${verb}`,
      translate: (phrase) => `how do you say "${phrase}" in German`,
      examples: ['conjugate gehen', 'what does Fernweh mean', 'what form is "ging"', 'the Konjunktiv II'],
    },
  },

  labels: {
    fullTable: { de: 'Vollständige Tabelle', en: 'Full table' },
    fullEntry: { de: 'Vollständiger Eintrag', en: 'Full entry' },
    conjugation: { de: 'Konjugation', en: 'Conjugation' },
    synonyms: { de: '**Synonyme:** ', en: '**Synonyms:** ' },
    person: { de: 'Person', en: 'person' },
    form: { de: 'Form', en: 'form' },
    conjugatedForm: { de: 'Das ist eine konjugierte Form:', en: "That's a conjugated form:" },
    otherTenses: { de: '_Die übrigen Zeitformen stehen in der vollständigen Tabelle._', en: '_The remaining tenses are in the full table._' },
    of: { de: 'von', en: 'of' },
    translatedWith: { de: 'übersetzt mit', en: 'translated with' },
  },

  DEFAULT_TENSES: ['indikativ.praesens', 'indikativ.praeteritum', 'indikativ.perfekt'],

  /** The model verbs a tense is shown on when no verb is named: one weak, one strong, one mixed. */
  MODEL_VERBS: ['machen', 'geben', 'bringen'],
};
