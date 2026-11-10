/**
 * German conjugation engine.
 *
 * The fourth of its kind after the Spanish, French and Italian engines, and
 * built the same way — rules first, data only where rules run out:
 *
 *   1. the weak pattern, which any infinitive gets: machen → machte, gemacht
 *   2. spelling that only keeps the word pronounceable — the e slipped in
 *      after -d/-t and after consonant + m/n (arbeitest, atmet, öffnet), the
 *      -st that merges into a sibilant (du reist, du heißt, du sitzt), the
 *      -eln verbs that drop an e (ich sammle)
 *   3. the principal parts of the strong and mixed verbs, inherited by
 *      prefixed derivatives (stehen → verstehen, aufstehen; kennen → erkennen,
 *      anerkennen), with the present-tense vowel change read off a stem
 *      (gib → gibst, gibt) and the Konjunktiv II read off the past (kam →
 *      käme) unless the data says otherwise (stand → stünde)
 *   4. the full paradigms of the few anomalous verbs: sein, haben, werden,
 *      wissen, the modals
 *
 * Three things shape the code beyond what the Romance engines needed:
 *
 *   Prefixes. A German verb can carry a stressed particle that walks to the
 *   end of the clause (ich stehe auf, aufgestanden, aufzustehen) or an
 *   unstressed prefix that never moves and swallows the ge- of the participle
 *   (verstehen → verstanden). Six prefixes do either, verb by verb. The engine
 *   peels the particles off, conjugates what is left, and puts them back in
 *   the right place; the data only has to know which prefix is which.
 *
 *   Two pasts in one. A strong past takes strong endings (gab, gabst, gaben),
 *   a weak or mixed one takes weak endings (machte, brachte, wurde). The data
 *   records the first person and the engine reads the type off its last
 *   letter, so the modals, werden and bringen need no more than that.
 *
 *   No pronouns in the forms. German reflexives keep the same forms as the
 *   plain verb, change nothing in the compound tenses but the auxiliary, and
 *   are listed in dictionaries under the plain verb. So *sich freuen* is
 *   conjugated as *freuen*, reported under that name, and only flagged — the
 *   Spanish convention, not the Italian one.
 *
 * The würde-form is filed as a Konjunktiv tense, which is what the grammars
 * do; Futur I and II are indicative tenses here as in every German grammar,
 * even though they are built with werden.
 */

import {
  DUAL_EXCEPTIONS, DUAL_PREFIXES, INSEPARABLE_PREFIXES, IRREGULARS, NO_GE, NOT_DERIVED,
  NOT_PREFIXED, SEIN_VERBS, SEPARABLE_PREFIXES,
} from '../data/verbs-de.js';

export const PERSONS = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];

/** The third person is er, sie and es alike; the plural sie is also the polite Sie. */
export const PERSON_LABELS = {
  ich: 'ich',
  du: 'du',
  er: 'er / sie / es',
  wir: 'wir',
  ihr: 'ihr',
  sie: 'sie / Sie',
};

/** du, the hortative wir, ihr, and the polite Sie. */
export const IMPERATIVE_PERSONS = ['du', 'wir', 'ihr', 'sie'];

/** How this table is laid out, so the views and the tutor can stay generic. */
export const SHAPE = {
  moods: ['indikativ', 'konjunktiv'],
  imperative: 'imperativ',
  nonFinite: 'formen',
  imperativeKinds: ['affirmativ', 'negativ'],
};

/** Names for the three classes, for the tabs and the chip on the verb card. */
export const CLASS_LABELS = {
  schwach: {
    tab: { de: 'schwache Verben', en: 'weak verbs' },
    chip: { de: 'schwaches Verb', en: 'weak verb' },
  },
  stark: {
    tab: { de: 'starke Verben', en: 'strong verbs' },
    chip: { de: 'starkes Verb', en: 'strong verb' },
  },
  gemischt: {
    tab: { de: 'gemischte Verben', en: 'mixed verbs' },
    chip: { de: 'gemischtes Verb', en: 'mixed verb' },
  },
};

/** The present-tense vowel changes of du and er, as the card shows them. */
export const STEM_CHANGE_LABELS = {
  'e→i': 'e → i',
  'e→ie': 'e → ie',
  'a→ä': 'a → ä',
  'au→äu': 'au → äu',
  'o→ö': 'o → ö',
};

const VOWEL = /[aeiouäöüy]/;
const SIBILANT = /(?:s|ß|z|x)$/;
const UMLAUT = { a: 'ä', o: 'ö', u: 'ü' };

// --- endings ---------------------------------------------------------------

const PRAESENS = ['e', 'st', 't', 'en', 't', 'en'];
const KONJUNKTIV1 = ['e', 'est', 'e', 'en', 'et', 'en'];
/** Endings after a first-person past or Konjunktiv II that ends in -e: machte, machtest … */
const AFTER_E = ['', 'st', '', 'n', 't', 'n'];

/**
 * The auxiliaries in the forms the compound tenses need. werden's present
 * builds Futur I and II; its Konjunktiv II is the würde-form.
 */
const AUX = {
  haben: {
    praesens: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
    praeteritum: ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten'],
    konjunktiv1: ['habe', 'habest', 'habe', 'haben', 'habet', 'haben'],
    konjunktiv2: ['hätte', 'hättest', 'hätte', 'hätten', 'hättet', 'hätten'],
  },
  sein: {
    praesens: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
    praeteritum: ['war', 'warst', 'war', 'waren', 'wart', 'waren'],
    konjunktiv1: ['sei', 'seiest', 'sei', 'seien', 'seiet', 'seien'],
    konjunktiv2: ['wäre', 'wärest', 'wäre', 'wären', 'wäret', 'wären'],
  },
  werden: {
    praesens: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'],
    konjunktiv2: ['würde', 'würdest', 'würde', 'würden', 'würdet', 'würden'],
  },
};

// --- small helpers ---------------------------------------------------------

export function normalizeVerb(input) {
  return String(input ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function row(forms) {
  return Object.fromEntries(PERSONS.map((person, index) => [person, forms[index] ?? null]));
}

/**
 * Split an infinitive into its stem and the kind of ending it has, or null
 * if it is not one.
 *
 *   en   the ordinary infinitive: mach-en
 *   eln  sammel-n, with the e that drops in ich sammle
 *   ern  wander-n
 *   n    the short infinitives: tu-n, sei-n, knie-n
 *
 * A bare -n is only accepted on tun, sein and knien and their compounds;
 * anything else that ends in -n is a noun, not a verb.
 */
export function classify(infinitive) {
  if (!/^[a-zäöüß]+$/.test(infinitive || '')) return null;
  let parts = null;
  if (/e[lr]n$/.test(infinitive)) {
    parts = { stem: infinitive.slice(0, -1), kind: infinitive.at(-2) === 'l' ? 'eln' : 'ern' };
  } else if (/(?:[^e]ien|tun|sein)$/.test(infinitive)) {
    parts = { stem: infinitive.slice(0, -1), kind: 'n' };
  } else if (/en$/.test(infinitive)) {
    parts = { stem: infinitive.slice(0, -2), kind: 'en' };
  }
  // The syllable before the ending has to hold a vowel: *gern* and *Kern* are
  // not -ern verbs.
  if (!parts) return null;
  const bare = parts.kind === 'eln' || parts.kind === 'ern' ? parts.stem.slice(0, -2) : parts.stem;
  if (!VOWEL.test(bare)) return null;
  return parts;
}

/** A stem ending in -ie takes an ending's e into itself: knie + e → knie, schrie + en → schrien. */
function join(stem, ending) {
  if (/ie$/.test(stem) && ending.startsWith('e')) return stem + ending.slice(1);
  return stem + ending;
}

/**
 * Whether an e is slipped in before -st and -t: after d and t (arbeitest,
 * redet), and after a consonant + m or n that could not be said otherwise
 * (atmet, öffnet, rechnet, zeichnet) — but not after l, r, a vowel or a
 * doubled m/n (lernst, wohnt, kommt).
 */
function needsE(stem) {
  return /[dt]$/.test(stem) || /(?:[bdfgkptvwzß]|ch)[mn]$/.test(stem);
}

/**
 * The Konjunktiv II umlaut: the last a, o or u of the past takes its dots
 * (kam → käm, zog → zög, fuhr → führ); an i, ie or ei stays (ging, blieb).
 */
function umlaut(past) {
  const match = /([aou])([^aeiouäöü]*)$/.exec(past);
  if (!match) return past;
  return past.slice(0, match.index) + UMLAUT[match[1]] + match[2];
}

/**
 * The code for the vowel change in du and er, read off the changed stem:
 * gib → e→i, lies → e→ie, fähr → a→ä, läuf → au→äu, stöß → o→ö.
 */
function stemChangeCode(changed) {
  const match = /([aeiouäöü]+)[^aeiouäöü]*$/.exec(changed);
  const vowel = match?.[1] ?? '';
  if (vowel === 'äu') return 'au→äu';
  if (vowel === 'ä') return 'a→ä';
  if (vowel === 'ö') return 'o→ö';
  if (vowel === 'ie') return 'e→ie';
  return 'e→i';
}

// --- prefixes --------------------------------------------------------------

const PREFIXES = [
  ...SEPARABLE_PREFIXES.map((prefix) => [prefix, 'sep']),
  ...INSEPARABLE_PREFIXES.map((prefix) => [prefix, 'insep']),
  ...Object.keys(DUAL_PREFIXES).map((prefix) => [prefix, 'dual']),
].sort((a, b) => b[0].length - a[0].length);

/** No German word starts with a doubled consonant or with l, m, n, r + consonant. */
const BAD_ONSET = /^(?:([^aeiouäöüy])\1|[lmnr][^aeiouäöüy])/;

/**
 * Whether what is left after a prefix could be a verb at all: a known verb,
 * or a stem with a vowel in it that a German word could start with. This is
 * what keeps angeln from being an + geln and herrschen from her + rschen.
 */
function plausibleRest(rest) {
  if (IRREGULARS[rest] || NOT_PREFIXED.has(rest)) return true;
  const parts = classify(rest);
  if (!parts || BAD_ONSET.test(rest)) return false;
  const bare = parts.kind === 'en' || parts.kind === 'n' ? parts.stem : parts.stem.slice(0, -2);
  return VOWEL.test(bare);
}

/**
 * The prefix a verb starts with, if it is built on one: the longest prefix
 * that leaves a plausible verb behind. Whether it separates is a property of
 * the prefix, or for the dual ones of the prefix and the verb together.
 */
function leadingPrefix(verb) {
  if (NOT_PREFIXED.has(verb)) return null;
  for (const [prefix, kind] of PREFIXES) {
    if (!verb.startsWith(prefix)) continue;
    const rest = verb.slice(prefix.length);
    if (!plausibleRest(rest)) continue;
    const separable = kind === 'sep'
      || (kind === 'dual' && DUAL_PREFIXES[prefix] !== DUAL_EXCEPTIONS.has(verb));
    return { prefix, rest, separable };
  }
  return null;
}

/**
 * Peel the separable particles off: aufstehen → auf + stehen, hinzufügen →
 * hinzu + fügen, anerkennen → an + erkennen. Stops at a listed verb, so that
 * vergessen is never read as ver + gessen, and at an inseparable prefix,
 * which is where the conjugating core begins.
 */
function analyse(verb) {
  let particle = '';
  let core = verb;
  while (!IRREGULARS[core]) {
    const lead = leadingPrefix(core);
    if (!lead?.separable) break;
    particle += lead.prefix;
    core = lead.rest;
  }
  return { particle, core };
}

/**
 * Whether the participle starts with ge-: not after an unstressed prefix
 * (verstanden, gehört), not on a verb stressed late in the word (studiert,
 * prophezeit).
 */
function takesGe(core) {
  if (NO_GE.has(core)) return false;
  if (/[aeiouäöüy].*ieren$/.test(core)) return false;
  return !leadingPrefix(core);
}

/**
 * Look up explicit irregularity, following inseparable prefixes to their base:
 * verstehen → stehen, missverstehen → stehen. A separable particle inside an
 * inseparable prefix (be + auf + tragen) marks a verb made from a noun, and
 * those are weak, so the search stops there.
 */
function findIrregular(core) {
  let rest = core;
  let prefix = '';
  for (;;) {
    if (NOT_DERIVED.has(rest)) return null;
    if (IRREGULARS[rest]) return { data: IRREGULARS[rest], prefix, base: rest };
    const lead = leadingPrefix(rest);
    if (!lead || lead.separable) return null;
    prefix += lead.prefix;
    rest = lead.rest;
  }
}

// --- the verb --------------------------------------------------------------

class GermanVerb {
  constructor(core, { plain = false } = {}) {
    const parts = classify(core);
    this.core = core;
    this.stem = parts.stem;
    this.kind = parts.kind;

    const found = plain ? null : findIrregular(core);
    this.irr = found?.data ?? {};
    this.prefix = found?.prefix ?? '';
    this.base = found?.base ?? null;

    this.class = this.base ? (this.irr.class ?? 'stark') : 'schwach';
    this.changed = this.irr.present ? this.prefix + this.irr.present : null;
    this.insert = this.kind === 'en' && needsE(this.stem);
  }

  /** Prefix a form from the data: stehen's stand becomes verstehen's verstand. */
  own(forms) {
    return forms.map((form) => (form == null ? null : this.prefix + form));
  }

  /**
   * ich, wir and sie take the stem and infinitive as they are; du and er take
   * the changed stem where there is one (gibst, gibt; fährst, fährt), and a
   * changed stem that already ends in t takes no second one (hält, rät, tritt).
   */
  praesens() {
    if (this.irr.praesens) return this.own(this.irr.praesens);
    const { stem, changed } = this;
    const ich = this.kind === 'eln' ? `${stem.slice(0, -2)}le` : join(stem, 'e');
    const du = changed
      ? changed + (SIBILANT.test(changed) ? 't' : 'st')
      : stem + (this.insert ? 'est' : SIBILANT.test(stem) ? 't' : 'st');
    const er = changed
      ? (changed.endsWith('t') ? changed : `${changed}t`)
      : stem + (this.insert ? 'et' : 't');
    const ihr = stem + (this.insert ? 'et' : 't');
    return [ich, du, er, this.core, ihr, this.core];
  }

  /** The first person of the Präteritum: gab, brachte, machte, arbeitete. */
  pastFirst() {
    if (this.irr.past) return this.prefix + this.irr.past;
    return this.stem + (this.insert ? 'ete' : 'te');
  }

  /**
   * A past ending in -e is weak in shape and takes -st, -n, -t, -n (machte,
   * machtest; wurde, wurdest; schrie, schriest); any other is strong and takes
   * -st, -en, -t, -en, with an e before the -st of du after a sibilant
   * (lasest, aßest) and before -st and -t after d or t (fandest, fandet).
   */
  praeteritum() {
    const first = this.pastFirst();
    if (first.endsWith('e')) return AFTER_E.map((ending) => first + ending);
    const dental = /[dt]$/.test(first);
    const du = SIBILANT.test(first) || dental ? `${first}est` : `${first}st`;
    return [first, du, first, `${first}en`, dental ? `${first}et` : `${first}t`, `${first}en`];
  }

  konjunktiv1() {
    if (this.irr.konjunktiv1) return this.own(this.irr.konjunktiv1);
    const { stem } = this;
    // -eln and -ern keep their own shape: sammle, sammelst, sammle; wandere, wanderst, wandere.
    if (this.kind === 'eln') {
      const short = `${stem.slice(0, -2)}le`;
      return [short, `${stem}st`, short, this.core, `${stem}t`, this.core];
    }
    if (this.kind === 'ern') return [`${stem}e`, `${stem}st`, `${stem}e`, this.core, `${stem}t`, this.core];
    return KONJUNKTIV1.map((ending) => join(stem, ending));
  }

  /**
   * Weak verbs: identical to the Präteritum. Strong verbs: the umlauted past
   * plus e (kam → käme), or the form the data gives (stünde, hülfe, brächte).
   */
  konjunktiv2() {
    if (this.irr.k2) return AFTER_E.map((ending) => this.prefix + this.irr.k2 + ending);
    if (!this.irr.past) return this.praeteritum();
    const first = this.pastFirst();
    if (first.endsWith('e')) return AFTER_E.map((ending) => first + ending);
    return AFTER_E.map((ending) => `${this.prefix + umlaut(this.irr.past)}e${ending}`);
  }

  /**
   * The Partizip II of the core. A strong participle comes from the data; a
   * derivative with an inseparable prefix drops the ge- of its base
   * (gestanden → verstanden). A weak one is ge- + stem + t, with the e where
   * the present needs it (gearbeitet), and no ge- after an unstressed prefix
   * or on an -ieren verb.
   */
  participle() {
    if (this.irr.participle) {
      const own = this.irr.participle;
      if (!this.prefix) return own;
      return this.prefix + (takesGe(this.base) ? own.replace(/^ge/, '') : own);
    }
    const weak = this.stem + (this.insert ? 'et' : 't');
    return takesGe(this.core) ? `ge${weak}` : weak;
  }

  partizip1() {
    if (this.irr.partizip1) return this.prefix + this.irr.partizip1;
    return `${this.core}d`;
  }

  /**
   * The du imperative: the changed stem where the change is e → i(e) (gib,
   * nimm, lies, iss), never where it is an umlaut (fahr, lauf); otherwise the
   * bare stem (mach, komm), with -e where the stem cannot stand alone
   * (arbeite, öffne, atme, entschuldige) and in the -eln/-ern shapes (sammle,
   * wandere).
   */
  imperativeDu() {
    if (this.irr.imperativDu) return this.prefix + this.irr.imperativDu;
    const { stem, changed } = this;
    if (changed && stemChangeCode(changed).startsWith('e')) return changed;
    if (this.kind === 'eln') return `${stem.slice(0, -2)}le`;
    if (this.kind === 'ern') return `${stem}e`;
    // The unstressed -ig of entschuldigen, beschäftigen keeps its e; the
    // stressed -eig of zeigen, steigen does not.
    if (this.insert || /[^aeiouäöü]ig$/.test(stem)) return `${stem}e`;
    return stem;
  }

  /** [du, wir, ihr, Sie] without the pronoun words, or null when there is no imperative. */
  imperative() {
    if (this.irr.imperativ === null) return null;
    if (this.irr.imperativ) return this.own(this.irr.imperativ);
    const present = this.praesens();
    return [this.imperativeDu(), this.core, present[4], this.core];
  }

  /** The display code of the present-tense vowel change, or null. */
  stemChange() {
    return this.changed ? stemChangeCode(this.changed) : null;
  }

  /** What the card says after "Schreibung": the adjustment that only keeps the spelling right. */
  ortho() {
    if (this.irr.praesens) return null;
    if (this.kind === 'eln') return '-ele → -le';
    if (this.insert) return 'e-Einschub';
    if (this.kind === 'en' && SIBILANT.test(this.stem)) return '-st → -t';
    return null;
  }
}

// --- the paradigm ----------------------------------------------------------

/**
 * Which auxiliary the compound tenses take. A reflexive always takes haben.
 * Otherwise the verb is looked up by name, and failing that a separable
 * particle inherits the auxiliary of the verb underneath it (ankommen,
 * weglaufen) — an inseparable prefix does not (bekommen).
 */
function auxiliaryOf(verb, core, particle, pronominal) {
  if (pronominal) return 'haben';
  if (SEIN_VERBS.has(verb)) return 'sein';
  if (particle && SEIN_VERBS.has(core)) return 'sein';
  return 'haben';
}

/** Put the separable particle back after a finite form: stehe + auf → stehe auf. */
function withParticle(forms, particle) {
  if (!particle) return forms;
  return forms.map((form) => (form == null ? null : `${form} ${particle}`));
}

function compound(auxForms, rest) {
  return auxForms.map((aux) => `${aux} ${rest}`);
}

/**
 * Build the paradigm for an infinitive, bare or with its separable particle,
 * with or without *sich*.
 *
 * @param {string} input   an infinitive: machen, aufstehen, sich freuen
 * @param {{plain?: boolean, auxiliary?: string}} options plain ignores every
 *        irregularity, which is how the page works out which cells are
 *        irregular; auxiliary forces one, so that comparison can hold the
 *        auxiliary fixed.
 */
function build(raw, { plain = false, auxiliary = null } = {}) {
  const pronominal = raw.startsWith('sich ');
  const verb = pronominal ? raw.slice(5).trim() : raw;
  if (!classify(verb)) return { ok: false, error: 'not-an-infinitive', input: raw };

  const { particle, core } = analyse(verb);
  if (!classify(core)) return { ok: false, error: 'not-an-infinitive', input: raw };

  const word = new GermanVerb(core, { plain: plain || NOT_DERIVED.has(verb) });
  const auxName = auxiliary ?? auxiliaryOf(verb, core, particle, pronominal);
  const aux = AUX[auxName];
  const participle = particle + word.participle();
  const infinitivPerfekt = `${participle} ${auxName}`;

  const finite = (forms) => row(withParticle(forms, particle));

  const indikativ = {
    praesens: finite(word.praesens()),
    praeteritum: finite(word.praeteritum()),
    futur1: row(compound(AUX.werden.praesens, verb)),
    perfekt: row(compound(aux.praesens, participle)),
    plusquamperfekt: row(compound(aux.praeteritum, participle)),
    futur2: row(compound(AUX.werden.praesens, infinitivPerfekt)),
  };

  const konjunktiv = {
    konjunktiv1: finite(word.konjunktiv1()),
    konjunktiv2: finite(word.konjunktiv2()),
    wuerde: row(compound(AUX.werden.konjunktiv2, verb)),
    konjunktiv1Perfekt: row(compound(aux.konjunktiv1, participle)),
    konjunktiv2Plusquamperfekt: row(compound(aux.konjunktiv2, participle)),
  };

  // The imperative puts the pronoun after the verb for wir and Sie, and the
  // particle after everything: steh auf, stehen wir auf, steht auf, stehen Sie auf.
  const imperative = word.imperative();
  const command = (form, pronoun, negative) => {
    if (form == null) return null;
    const words = [form];
    if (pronoun) words.push(pronoun);
    if (negative) words.push('nicht');
    if (particle) words.push(particle);
    return words.join(' ');
  };
  const imperativ = {
    affirmativ: {
      du: command(imperative?.[0], null, false),
      wir: command(imperative?.[1], 'wir', false),
      ihr: command(imperative?.[2], null, false),
      sie: command(imperative?.[3], 'Sie', false),
    },
    negativ: {
      du: command(imperative?.[0], null, true),
      wir: command(imperative?.[1], 'wir', true),
      ihr: command(imperative?.[2], null, true),
      sie: command(imperative?.[3], 'Sie', true),
    },
  };

  const table = {
    formen: {
      infinitiv: verb,
      partizip1: particle + word.partizip1(),
      partizip2: participle,
      infinitivPerfekt,
      zuInfinitiv: particle ? `${particle}zu${core}` : `zu ${verb}`,
    },
    indikativ,
    konjunktiv,
    imperativ,
  };

  return {
    ok: true,
    verb,
    input: raw,
    class: word.class,
    stem: word.stem,
    source: 'local',
    pronominal,
    auxiliary: auxName,
    flags: {
      irregular: Boolean(word.irr.anomalous),
      stemChange: word.stemChange(),
      ortho: word.ortho(),
      derivedFrom: word.base && (word.prefix || particle) ? word.base : null,
      separable: particle || null,
      auxiliary: auxName,
    },
    table,
  };
}

/**
 * Conjugate an infinitive.
 *
 * *möchten* is not an infinitive but the Konjunktiv II of mögen, and it is
 * looked up often enough to deserve better than a made-up weak paradigm, so
 * it is answered with mögen's table.
 *
 * @returns {{ok: boolean, verb?: string, table?: object, error?: string}}
 */
export function conjugate(input, { plain = false } = {}) {
  const raw = normalizeVerb(input);
  if (!raw) return { ok: false, error: 'empty', input: raw };
  if (raw === 'möchten') return build('mögen', { plain });
  return build(raw, { plain });
}

/**
 * Cells where a table differs from the plain weak pattern — the forms a
 * learner actually has to remember. The auxiliary is held fixed, so that a
 * sein verb is not marked in every compound cell for taking sein.
 */
export function irregularCells(infinitive, table = null) {
  const shown = table ?? conjugate(infinitive).table;
  const marks = new Set();
  if (!shown) return marks;
  const auxiliary = /\bsein$/.test(shown.formen?.infinitivPerfekt ?? '') ? 'sein' : 'haben';
  const plain = build(normalizeVerb(infinitive), { plain: true, auxiliary });
  if (!plain.ok) return marks;

  for (const mood of SHAPE.moods) {
    for (const [tense, forms] of Object.entries(shown[mood] ?? {})) {
      const reference = plain.table[mood][tense];
      if (!reference) continue;
      for (const person of PERSONS) {
        if (forms[person] && forms[person] !== reference[person]) marks.add(`${mood}.${tense}.${person}`);
      }
    }
  }
  for (const [kind, forms] of Object.entries(shown.imperativ ?? {})) {
    for (const [person, form] of Object.entries(forms)) {
      if (form && form !== plain.table.imperativ[kind]?.[person]) marks.add(`imperativ.${kind}.${person}`);
    }
  }
  for (const [name, form] of Object.entries(shown.formen ?? {})) {
    if (form && form !== plain.table.formen[name]) marks.add(`formen.${name}`);
  }
  return marks;
}
