/**
 * The Portuguese language pack for the tutor.
 *
 * The same contract as tutor-es.js, tutor-fr.js and tutor-it.js. What differs
 * beyond vocabulary: the paradigm has a mood the other sides lack, the
 * personal infinitive (*falarmos*), which goes into the form index like any
 * tense; the imperative has *você* and *vocês* cells that no indicative person
 * matches, so they get labels of their own; and the tense names are the ones
 * Portugal's schools use (pretérito perfeito, futuro do conjuntivo), with
 * Brazil's *subjuntivo* accepted wherever *conjuntivo* is.
 */

import {
  conjugate, PERSONS, PERSON_LABELS as ENGINE_PERSON_LABELS, STEM_CHANGE_LABELS,
} from './conjugator-pt.js';
import { COMMON_VERBS, IRREGULARS } from '../data/verbs-pt.js';
import { TOPICS, SMALL_TALK, EXCLAMATIONS } from '../data/grammar-pt.js';
import { fold } from './dom.js';

/**
 * The engine's labels, plus the two imperative-only persons. The imperative
 * table has *você* and *vocês* cells (*faça!*, *façam!*) that no indicative
 * person matches, and the form index labels every hit by its person; without
 * these, "que forma é faça" would answer "undefined, imperativo".
 */
const PERSON_LABELS = { voce: 'você', voces: 'vocês', ...ENGINE_PERSON_LABELS };

const TENSE_LABELS = {
  'indicativo.presente': { pt: 'presente do indicativo', en: 'present indicative' },
  'indicativo.preteritoPerfeito': { pt: 'pretérito perfeito', en: 'pretérito perfeito (preterite)' },
  'indicativo.preteritoImperfeito': { pt: 'pretérito imperfeito', en: 'imperfect' },
  'indicativo.maisQuePerfeito': { pt: 'pretérito mais-que-perfeito', en: 'pluperfect (mais-que-perfeito)' },
  'indicativo.futuro': { pt: 'futuro do indicativo', en: 'future' },
  'indicativo.condicional': { pt: 'condicional', en: 'conditional' },
  'indicativo.perfeitoComposto': { pt: 'pretérito perfeito composto', en: 'pretérito perfeito composto (tenho falado)' },
  'conjuntivo.presente': { pt: 'presente do conjuntivo', en: 'present subjunctive' },
  'conjuntivo.imperfeito': { pt: 'pretérito imperfeito do conjuntivo', en: 'imperfect subjunctive' },
  'conjuntivo.futuro': { pt: 'futuro do conjuntivo', en: 'future subjunctive' },
  'infinitivo.pessoal': { pt: 'infinitivo pessoal', en: 'personal infinitive' },
};

/**
 * The conjugation a verb belongs to, by its ending. pôr and its derivatives
 * are the whole of the fourth, and a grammar says so rather than number it.
 */
const GROUP_NAMES = {
  ar: { pt: 'primeira conjugação', en: 'first-conjugation' },
  er: { pt: 'segunda conjugação', en: 'second-conjugation' },
  ir: { pt: 'terceira conjugação', en: 'third-conjugation' },
  or: { pt: 'da família de pôr', en: 'of the pôr family' },
};

function describeFlags(result, language) {
  const pt = language === 'pt';
  const parts = [];
  const { flags } = result;
  if (flags.stemChange) {
    const change = STEM_CHANGE_LABELS[flags.stemChange] ?? flags.stemChange;
    parts.push(pt ? `com alternância vocálica ${change}` : `with a ${change} vowel change`);
  }
  if (flags.ortho) parts.push(pt ? `ortografia ${flags.ortho}` : `spelling ${flags.ortho}`);
  if (flags.irregular) parts.push('irregular');
  if (flags.derivedFrom) {
    parts.push(pt ? `conjuga-se como *${flags.derivedFrom}*` : `conjugated like *${flags.derivedFrom}*`);
  }
  if (result.pronominal) parts.push(pt ? 'verbo reflexo' : 'reflexive');
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
 * always the list that exists: a note added to grammar-pt.js is announced
 * here without anyone remembering to say so.
 */
function topicTitles(language) {
  return TOPICS
    .map((topic) => topic.title[language] ?? topic.title.en)
    .map((title) => title.charAt(0).toLowerCase() + title.slice(1))
    .join(', ');
}

function capabilities(language) {
  return language === 'pt'
    ? `Eis o que sei fazer, e tudo vem dos dados do próprio site:

- **Conjugar** qualquer verbo: *conjuga fazer no conjuntivo*
- **Reconhecer uma forma**: *que forma é «fizeram»*
- **Procurar uma palavra** no dicionário: *o que significa saudade*
- **Traduzir** frases: *como se diz "I'm tired" em português*
- **Explicar a gramática**: ${topicTitles('pt')}.`
    : `Here's what I can do, and all of it comes from the site's own data:

- **Conjugate** any verb: *conjugate fazer in the subjunctive*
- **Identify a form**: *what form is "fizeram"*
- **Look words up** in the dictionary: *what does saudade mean*
- **Translate** phrases: *how do you say "I'm tired" in Portuguese*
- **Explain grammar**: ${topicTitles('en')}.`;
}

export const PACK = {
  code: 'pt',
  conjugate,
  PERSONS,
  PERSON_LABELS,
  TOPICS,
  SMALL_TALK,
  EXCLAMATIONS,
  GLOSSES: new Map(COMMON_VERBS),

  shape: {
    moods: ['indicativo', 'conjuntivo'],
    imperative: 'imperativo',
    affirmative: 'afirmativo',
    nonFinite: 'formas',
    gerund: 'gerundio',
    participle: 'participio',
  },

  /**
   * A closed list, for the same reason as the other packs: English has its
   * share of words ending in -ar, -er and -or (*car*, *other*, *for*), and
   * reading one of those as a verb is worse than missing an unusual
   * Portuguese one.
   */
  KNOWN_VERBS: new Set([
    ...COMMON_VERBS.map(([verb]) => fold(verb)),
    ...namesOf(IRREGULARS).map(fold),
  ]),

  /** -ar, -er, -ir, pôr's -or, and the reflexive -se welded on with a hyphen. */
  INFINITIVE: /(?:ar|er|ir|or|ôr)(?:-se)?$/,

  TENSE_LABELS,
  // The compound tense is two words, so it is never looked up.
  INDEX_TENSES: Object.keys(TENSE_LABELS).filter((key) => key !== 'indicativo.perfeitoComposto'),

  FORM_LABELS: {
    imperative: { pt: 'imperativo', en: 'imperative' },
    gerund: { pt: 'gerúndio', en: 'gerund' },
    participle: { pt: 'particípio passado', en: 'past participle' },
  },

  /**
   * Matched against the folded question. *tempo* is left out on purpose: it is
   * also the weather and the "time" of *há quanto tempo*, and a duration
   * question that names a verb should not turn into a table.
   */
  CONJUGATION_CUE: /\b(conjug\w*|tense|tenses|tempos|forms?|forma|formas|present|presente|preterito|perfeito|imperfeito|imperfect|passado|past|futuro|future|condicional|conditional|conjuntivo|subjuntivo|subjunctive|imperativo|imperative|participio|participle|gerundio|gerund|infinitivo|infinitive|pessoal)\b/,

  /**
   * Order matters: the first match wins, so the two-word names come before the
   * single words they contain. "futuro do conjuntivo" must stop neither at
   * "futuro" nor at "conjuntivo", and "pretérito perfeito composto" neither at
   * "pretérito perfeito" nor at "perfeito". Brazil's *subjuntivo* is accepted
   * everywhere *conjuntivo* is.
   */
  TENSE_HINTS: [
    [/\b(preterito perfeito composto|perfeito composto|present perfect)\b/, 'indicativo.perfeitoComposto'],
    [/\b(mais-que-perfeito|mais que perfeito|pluperfect|past perfect)\b/, 'indicativo.maisQuePerfeito'],
    [/\b(futuro do (?:conjuntivo|subjuntivo)|futuro (?:conjuntivo|subjuntivo)|future subjunctive)\b/, 'conjuntivo.futuro'],
    [/\b((?:preterito )?imperfeito do (?:conjuntivo|subjuntivo)|(?:conjuntivo|subjuntivo) imperfeito|imperfect subjunctive)\b/, 'conjuntivo.imperfeito'],
    [/\b(presente do (?:conjuntivo|subjuntivo)|(?:conjuntivo|subjuntivo) presente|present subjunctive)\b/, 'conjuntivo.presente'],
    [/\b(infinitivo pessoal|personal infinitive)\b/, 'infinitivo.pessoal'],
    [/\b(preterito perfeito|perfeito simples|perfeito|preterite|simple past)\b/, 'indicativo.preteritoPerfeito'],
    [/\b(preterito imperfeito|imperfeito|imperfect)\b/, 'indicativo.preteritoImperfeito'],
    [/\b(presente|present)\b/, 'indicativo.presente'],
    [/\b(futuro|future)\b/, 'indicativo.futuro'],
    [/\b(condicional|conditional)\b/, 'indicativo.condicional'],
    [/\b(conjuntivo|subjuntivo|subjunctive)\b/, 'conjuntivo.presente'],
    [/\b(passado|past)\b/, 'indicativo.preteritoPerfeito'],
  ],

  /**
   * Matched against the accented text. *você* and *vocês* count as the third
   * persons, which is what they are grammatically, however they are meant.
   * \b sees no boundary after *ê*, so *você* is matched up to the end of its
   * word by hand.
   */
  PERSON_HINTS: [
    [/\b(eu|first person singular|primeira pessoa do singular)\b/, 'eu'],
    [/\b(tu|second person singular|segunda pessoa do singular)\b/, 'tu'],
    [/\b(ele|ela|voce|third person singular|terceira pessoa do singular)\b|\bvocê(?=\s|$)/, 'ele'],
    [/\b(nós|first person plural|primeira pessoa do plural)\b/, 'nos'],
    [/\b(vós|second person plural|segunda pessoa do plural)\b/, 'vos'],
    [/\b(eles|elas|vocês|voces|third person plural|terceira pessoa do plural)\b/, 'eles'],
  ],

  /**
   * Counted on the lowercased question. The words the two languages share in
   * spelling are left out of both sides: *a*, *as* and *no* would make an
   * English question with an article in it Portuguese, and *do* (as in
   * "futuro do conjuntivo") would make a Portuguese one English. The accented
   * words (*é*, *porquê*) are left to the diacritics test.
   */
  MARKERS: {
    study: /\b(que|como|quando|qual|quais|porque|onde|quem|o|os|um|uma|de|da|dos|das|em|na|nos|nas|e|ou|significa|quer|dizer|diz|diferença|diferenca|entre|conjuga|conjugar|explica|ajuda|verbo|palavra|ola|bom dia|boa tarde|boa noite|obrigado|obrigada|adeus|em portugues|portugues)\b/g,
    english: /\b(what|how|when|why|which|does|is|are|the|of|mean|means|say|difference|between|and|or|conjugate|tell|explain|help|verb|word|in portuguese)\b/g,
    diacritics: /[áàâãéêíóôõúç]/,
  },

  INTENTS: {
    conjugate: /(?:conjuga(?:r|-me|me|ção|çao|cao)?|conjugate|conjugation\s+(?:of|for)|como se conjuga|como é que se conjuga|como e que se conjuga)\s+(?:de\s+|do\s+|da\s+|the\s+|o\s+|a\s+)?(?:verbo?\s+)?([a-záàâãéêíóôõúç-]+)/i,
    verbMarker: /\b(?:verbo|verb)\s+([a-záàâãéêíóôõúç-]{2,})\b/i,
    conjugateTrailing: /^([a-záàâãéêíóôõúç-]+)\s+(?:conjugation|conjugated|conjugação|conjugaçao|conjugacao|conjugado)\b/i,
    define: /(?:o que significa|que significa|o que quer dizer|que quer dizer|quer dizer|significado de|definição de|definiçao de|definicao de|define|what does|what is the meaning of|meaning of)\s+["«'“]?\s*([a-záàâãéêíóôõúç'-]+)\s*["»'”]?/i,
    translateInto: /(?:como se diz|como digo|como é que se diz|como e que se diz|como posso dizer|how do you say|how do i say|how to say|how would you say|how do u say|how say|translate)\s+["«'“]?(.+?)["»'”]?\s*(?:em portugu[eê]s|in portuguese|para portugu[eê]s|in english|em ingl[eê]s|para ingl[eê]s)?\s*[.?!]*$/i,
    translateAny: /(?:traduz|traduzir|tradução de|traduçao de|traducao de|translate)\s+["«'“]?(.+?)["»'”]?\s*$/i,
    whatForm: /(?:que forma é|que forma e|qual é a forma|qual e a forma|que é|que e|what form is|what is)\s+["«'“]?\s*([a-záàâãéêíóôõúç'-]+)\s*["»'”]?/i,
    intoStudy: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into|em|para)\s+(?:portuguese|portugu[eê]s)\s*[.?!]*$/i,
    intoEnglish: /^\s*[\"«'“]?(.+?)[\"»'”]?\s+(?:in|into|em|para)\s+(?:english|ingl[eê]s)\s*[.?!]*$/i,
    bareEnglishVerb: /^\s*to\s+([a-z]+(?:\s+[a-z]+){0,2})\s*[.?!]*$/i,
    intoStudyLanguage: /(?:em portugu[eê]s|in portuguese|para portugu[eê]s)/i,
    /** Only an explicit "in English" sends a "how do you say" the other way. */
    intoEnglishLanguage: /(?:in english|em ingl[eê]s|para ingl[eê]s)/i,
  },

  /**
   * Stripped from the folded question before a topic is matched exactly, so
   * "o conjuntivo" and "conjuntivo" find the same note. The grammar notes'
   * keywords were written against exactly this list.
   */
  LEADING_ARTICLE: /^(?:(?:o|a|os|as|um|uma|the|a)\s+)/,

  HELP: /\b(ajuda|help|o que sabes fazer|que sabes fazer|o que podes fazer|what can you do)\b/,

  describeFlags,

  verbHeadline(result, gloss, lead, language) {
    const group = GROUP_NAMES[result.class] ?? GROUP_NAMES.er;
    const ending = result.class === 'or' ? 'or' : result.class;
    const name = `${lead}**${result.verb}**${gloss ? ` (*${gloss}*)` : ''}`;
    if (language === 'pt') return `${name}. Verbo em -${ending}, ${group.pt}${describeFlags(result, 'pt')}.`;
    return result.class === 'or'
      ? `${name}. A verb in -or, ${group.en}${describeFlags(result, 'en')}.`
      : `${name}. A ${group.en} verb in -${ending}${describeFlags(result, 'en')}.`;
  },

  /**
   * The verbs that ask the most of a learner: irregular in their own right,
   * not merely by inheritance. ser, ir, pôr, fazer and trazer light it up;
   * manter and propor only follow their bases.
   */
  isHairy: (result) => result.flags.irregular && !result.flags.derivedFrom,

  capabilities,

  /**
   * The capabilities as blocks, for the one path in the router that answers
   * with a pack's CAPABILITIES directly (a "how do you say" with nothing after
   * it).
   */
  CAPABILITIES: {
    pt: [{ type: 'md', text: capabilities('pt') }],
    en: [{ type: 'md', text: capabilities('en') }],
  },

  outOfScope(language, exclaim) {
    return language === 'pt'
      ? `${exclaim}Nisso não te posso ajudar. Respondo apenas com os dados do site (o conjugador, o dicionário e um conjunto de notas de gramática) e prefiro não dizer nada a inventar.

Perguntado de outra maneira, talvez consiga responder. Experimenta uma destas ou escreve **ajuda** para veres a lista completa:`
      : `${exclaim}That one's outside what I cover. I answer from the site's own data (the conjugator, the dictionary and a set of grammar explanations), so I'd rather say nothing than invent an answer.

Asked another way, I might be able to. Try one of these, or type **help** for the full list:`;
  },

  /** The shapes a question can be put in so the tutor can answer it. See tutor.js. */
  REPHRASE: {
    pt: {
      define: (word) => `o que significa ${word}`,
      conjugate: (verb) => `conjuga ${verb}`,
      translate: (phrase) => `como se diz "${phrase}" em português`,
      examples: ['conjuga partir', 'o que significa saudade', 'que forma é «fizeram»', 'o conjuntivo'],
    },
    en: {
      define: (word) => `what does ${word} mean`,
      conjugate: (verb) => `conjugate ${verb}`,
      translate: (phrase) => `how do you say "${phrase}" in Portuguese`,
      examples: ['conjugate partir', 'what does saudade mean', 'what form is "fizeram"', 'the subjunctive'],
    },
  },

  labels: {
    fullTable: { pt: 'Tabela completa', en: 'Full table' },
    fullEntry: { pt: 'Entrada completa', en: 'Full entry' },
    conjugation: { pt: 'Conjugação', en: 'Conjugation' },
    synonyms: { pt: '**Sinónimos:** ', en: '**Synonyms:** ' },
    person: { pt: 'pessoa', en: 'person' },
    form: { pt: 'forma', en: 'form' },
    conjugatedForm: { pt: 'É uma forma conjugada:', en: "That's a conjugated form:" },
    otherTenses: { pt: '_Os outros tempos estão na tabela completa._', en: '_The remaining tenses are in the full table._' },
    of: { pt: 'de', en: 'of' },
    translatedWith: { pt: 'traduzido com', en: 'translated with' },
  },

  DEFAULT_TENSES: ['indicativo.presente', 'indicativo.preteritoPerfeito', 'conjuntivo.presente'],

  /** The regular verbs a tense is shown on when no verb is named. */
  MODEL_VERBS: ['falar', 'comer', 'partir'],
};
