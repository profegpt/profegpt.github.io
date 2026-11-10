/**
 * Dutch conjugation engine.
 *
 * Built like the Italian one next to it — rules first, data only where rules
 * run out — but the rules are of a different kind. A Romance verb is mostly
 * endings; a Dutch verb is mostly a stem, and the work is in spelling that
 * stem right:
 *
 *   1. the stem is the infinitive without -en, respelled so that it still
 *      sounds the same on its own: lopen → loop (an open syllable's long vowel
 *      is written double once the syllable closes), zitten → zit (a doubled
 *      consonant only ever marks a short vowel before another syllable),
 *      leven → leef and reizen → reis (v and z are not written at the end of
 *      a word)
 *   2. the weak past and participle take -te/-t after a voiceless stem
 *      consonant and -de/-d otherwise, judged on the infinitive's consonant
 *      before the devoicing of rule 1 — 't kofschip: werkte, but leefde
 *   3. the participle takes ge- unless the verb already starts with an
 *      unstressed prefix (be-, ge-, her-, ont-, ver-, er-): gewerkt, betaald
 *   4. a separable particle goes to the end of the clause in the finite forms
 *      (ik bel op), in front of ge- in the participle (opgebeld) and around te
 *      in the te-infinitive (op te bellen)
 *   5. explicit principal parts for the strong, mixed and anomalous verbs,
 *      inherited by prefixed derivatives (begrijpen ← grijpen, aankomen ←
 *      komen)
 *
 * Two things in rule 1 the spelling alone cannot settle, and both are decided
 * by a rule with a list behind it. The e before a final -l, -r, -n or -m is a
 * schwa in a polysyllabic stem (wandelen → wandel, luisteren → luister) and a
 * long vowel in a monosyllabic one (spelen → speel) — except that the loan
 * verbs in -eren stress that e (studeren → studeer), so for -eren the loan
 * pattern is the rule and the native schwa verbs are the list. And whether a
 * verb's first syllable is a separable particle (opbellen), an unstressed
 * prefix (ontmoeten) or just how the word starts (openen, interviewen) is
 * decided by what follows it: a particle needs a verb behind it that the
 * engine recognises, or that at least looks like one.
 *
 * The table uses the school names of the tenses (o.t.t., o.v.t., v.t.t. …)
 * as keys, and the archaic subjunctive gets a mood of its own with a single
 * present tense, since *leve de koning* and *het zij zo* are the only places a
 * learner will meet it.
 */

import {
  COMMON_VERBS, HEBBEN_COMPOUNDS, INSEPARABLE, IRREGULARS, LONG_E, NOT_DERIVED, NOT_PREFIXED,
  SHORT_VOWEL, STRESSED_ER, UNSTRESSED_ER, ZIJN_BASES, ZIJN_VERBS,
} from '../data/verbs-nl.js';

export const PERSONS = ['ik', 'jij', 'hij', 'wij', 'jullie', 'zij'];

/**
 * u takes the jij form (u werkt, u hebt), so it shares the column; the third
 * person covers all three genders.
 */
export const PERSON_LABELS = {
  ik: 'ik',
  jij: 'jij / u',
  hij: 'hij / zij / het',
  wij: 'wij',
  jullie: 'jullie',
  zij: 'zij',
};

/** The imperative is the bare stem, or the -t form with a following u. */
export const IMPERATIVE_PERSONS = ['jij', 'u'];

/** How this table is laid out, so the views and the tutor can stay generic. */
export const SHAPE = {
  moods: ['indicatief', 'conjunctief'],
  imperative: 'imperatief',
  nonFinite: 'vormen',
  imperativeKinds: ['bevestigend', 'ontkennend'],
};

/**
 * One entry for every value `class` can take. The three with a model verb
 * (te, de, sterk) are the tabs of the conjugator page; the other two are
 * only ever chips on a card.
 */
export const CLASS_LABELS = {
  te: {
    tab: { nl: 'zwakke werkwoorden op -te', en: 'weak verbs in -te' },
    chip: { nl: 'zwak werkwoord (-te)', en: 'weak verb (-te)' },
  },
  de: {
    tab: { nl: 'zwakke werkwoorden op -de', en: 'weak verbs in -de' },
    chip: { nl: 'zwak werkwoord (-de)', en: 'weak verb (-de)' },
  },
  sterk: {
    tab: { nl: 'sterke werkwoorden', en: 'strong verbs' },
    chip: { nl: 'sterk werkwoord', en: 'strong verb' },
  },
  gemengd: {
    tab: { nl: 'gemengde werkwoorden', en: 'mixed verbs' },
    chip: { nl: 'gemengd werkwoord', en: 'mixed verb' },
  },
  onregelmatig: {
    tab: { nl: 'onregelmatige werkwoorden', en: 'irregular verbs' },
    chip: { nl: 'onregelmatig werkwoord', en: 'irregular verb' },
  },
};

/** Dutch has no stem changes in the Spanish sense; the vowel is a spelling matter. */
export const STEM_CHANGE_LABELS = {};

// --- the auxiliaries -------------------------------------------------------

const AUX = {
  hebben: {
    ott: ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben'],
    ovt: ['had', 'had', 'had', 'hadden', 'hadden', 'hadden'],
  },
  zijn: {
    ott: ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn'],
    ovt: ['was', 'was', 'was', 'waren', 'waren', 'waren'],
  },
};

const ZULLEN = ['zal', 'zult', 'zal', 'zullen', 'zullen', 'zullen'];
const ZOUDEN = ['zou', 'zou', 'zou', 'zouden', 'zouden', 'zouden'];

// --- prefixes ---------------------------------------------------------------

/**
 * Particles that are separable when they head a verb. The longest match wins
 * (tegemoet before tegen, voorbij before voor).
 */
const PARTICLES = [
  'aan', 'achter', 'achterna', 'achterover', 'achteruit', 'af', 'bij', 'bijeen', 'binnen', 'bloot',
  'boven', 'buiten', 'deel', 'dicht', 'dood', 'door', 'eruit', 'fijn', 'gade', 'goed', 'hard', 'heen',
  'in', 'kapot', 'kennis', 'klaar', 'kwijt', 'langs', 'leeg', 'les', 'los', 'mee', 'na', 'neer', 'om',
  'omhoog', 'omver', 'onder', 'op', 'open', 'over', 'overeen', 'plaats', 'prijs', 'rond', 'samen',
  'schoon', 'stil', 'tegemoet', 'tegen', 'teleur', 'terecht', 'terug', 'thuis', 'toe', 'tussen',
  'uit', 'uiteen', 'vast', 'verder', 'vol', 'voor', 'voorbij', 'vooruit', 'vrij', 'weer', 'weg',
  'zwart',
].sort((a, b) => b.length - a.length);

/**
 * The particles that are also stressed prefixes in the verbs INSEPARABLE
 * lists: onderzóeken, overtúigen, voorkómen, misbrúiken.
 */
const DOUBLES = ['achter', 'aan', 'door', 'mis', 'om', 'onder', 'over', 'vol', 'voor', 'weer']
  .sort((a, b) => b.length - a.length);

/**
 * Unstressed prefixes: no ge- in the participle, nothing moves. Listed with
 * what may follow them — be- and ge- are only prefixes before a consonant or
 * before a, o, ë, ï (beantwoorden, beoordelen, beëindigen, beïnvloeden);
 * *beuken* and *geuren* start with a diphthong.
 */
const PREFIXES = [
  ['ont', /^[a-zëï]/],
  ['her', /^[a-zëï]/],
  ['ver', /^[a-zëï]/],
  ['be', /^[^eiuy]/],
  ['ge', /^[^eiuy]/],
  ['er', /^[^aeiouy]/],
];

/**
 * The consonant clusters a Dutch word can start with. A remainder that starts
 * otherwise (-rgen in bergen, -lden in gelden) was never a verb of its own.
 */
const ONSETS = new Set([
  '', 'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z',
  'bl', 'br', 'ch', 'chr', 'dr', 'dw', 'fl', 'fr', 'gl', 'gn', 'gr', 'kl', 'kn', 'kr', 'kw', 'pl', 'pr',
  'ps', 'qu', 'sc', 'sch', 'schr', 'sj', 'sk', 'sl', 'sm', 'sn', 'sp', 'spl', 'spr', 'st', 'str', 'sw',
  'th', 'tj', 'tr', 'tw', 'vl', 'vr', 'wr', 'zw',
]);

/**
 * Simple verbs the engine can vouch for: the irregulars, the search index
 * and the schwa list. A particle is only split off in front of one of these,
 * or of something that could be one — so *opbellen* is op + bellen because
 * bellen is here, and *informeren* stays whole because formeren is not.
 */
const KNOWN = new Set([...Object.keys(IRREGULARS), ...COMMON_VERBS.map(([verb]) => verb), ...UNSTRESSED_ER]);

/** Verbs the data names as a whole are never split: naderen is not na + deren. */
const WHOLE = new Set([...UNSTRESSED_ER, ...STRESSED_ER, ...LONG_E, ...SHORT_VOWEL, ...NOT_PREFIXED, ...NOT_DERIVED]);

const VOWELS = 'aeiouyëïé';
const isVowel = (letter) => letter != null && VOWELS.includes(letter);

// --- small helpers ---------------------------------------------------------

export function normalizeVerb(input) {
  return String(input ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * gaan, doen, zien, zijn, skiën: the infinitive is the stem plus a bare -n,
 * which shows in the long vowel before it.
 */
function isShort(verb) {
  return /(?:^|[^aeiou])(?:aa|oe|ie|ij)n$/.test(verb) || /ën$/.test(verb);
}

/** Infinitives end in -en, or in -n after a long vowel (gaan, doen, zien, skiën). */
function isInfinitive(verb) {
  if (!/^[a-zëïé]+$/.test(verb) || verb.length < 4) return false;
  return isShort(verb) || (/en$/.test(verb) && !/^(?:en|een)$/.test(verb));
}

function row(forms) {
  return Object.fromEntries(PERSONS.map((person, index) => [person, forms[index] ?? null]));
}

function onsetOf(word) {
  let i = 0;
  while (i < word.length && !isVowel(word[i])) i += 1;
  return word.slice(0, i);
}

/** Whether a word could be a Dutch verb on its own: an infinitive with a sayable start. */
function looksLikeVerb(word) {
  return isInfinitive(word) && ONSETS.has(onsetOf(word));
}

/**
 * A remainder in -eren that nothing vouches for is read as a loan (-eer is
 * stressed), and a loan was never a particle plus a verb: *informeren* is
 * not in + formeren. A doubled consonant before the -er is the native
 * frequentative pattern (afschilferen, aanwakkeren) and passes.
 */
function loanLike(word) {
  return /[^aeiou]eren$/.test(word) && word.length >= 5 && !KNOWN.has(word) && !/([bdgkmnpt])\1eren$/.test(word);
}

// --- analysis --------------------------------------------------------------

/**
 * Split off a separable particle, or return null. The particle is only
 * accepted when a verb follows it — one the data knows, one with an
 * unstressed prefix of its own (voorbereiden), or an unknown one that at
 * least looks like a verb and not like a loan in -eren.
 */
function splitParticle(verb) {
  if (INSEPARABLE.has(verb) || IRREGULARS[verb] || WHOLE.has(verb)) return null;
  for (const particle of PARTICLES) {
    if (!verb.startsWith(particle) || verb.length - particle.length < 4) continue;
    const rest = verb.slice(particle.length);
    if (KNOWN.has(rest)) return { particle, rest };
    const prefixed = splitPrefix(rest);
    if (prefixed && (KNOWN.has(prefixed.rest) || looksLikeVerb(prefixed.rest))) return { particle, rest };
    if (looksLikeVerb(rest) && !isVowel(rest[0]) && rest.length >= 5 && !loanLike(rest)) return { particle, rest };
  }
  return null;
}

/** Split off an unstressed prefix, or return null. */
function splitPrefix(verb) {
  if (NOT_PREFIXED.has(verb)) return null;
  for (const [prefix, allowed] of PREFIXES) {
    if (!verb.startsWith(prefix)) continue;
    const rest = verb.slice(prefix.length);
    if (rest.length < 4 || !allowed.test(rest) || !looksLikeVerb(rest)) continue;
    // er- is rare enough to need a known base (erkennen, ervaren); ge- is
    // not a prefix in front of a loan (genereren, gesticuleren).
    if (prefix === 'er' && !KNOWN.has(rest)) continue;
    if (prefix === 'ge' && loanLike(rest)) continue;
    return { prefix, rest };
  }
  return null;
}

/**
 * Everything the forms are built from.
 *
 *   particle   the separable particle, or ''
 *   prefix     the unstressed (or stressed-inseparable) prefix, or ''
 *   rest       what the spelling rules run on: the verb without both
 *   data       the IRREGULARS entry, found either for prefix + rest
 *              (beginnen, vergeten: `listed` is true, and its forms already
 *              carry the prefix) or for the bare rest (grijpen under
 *              begrijpen: the prefix is put on each form)
 */
function analyse(verb) {
  const split = splitParticle(verb);
  const particle = split?.particle ?? '';
  const core = split?.rest ?? verb;
  let prefix = '';
  let rest = core;
  let data = null;
  let listed = false;

  if (INSEPARABLE.has(core)) {
    // onder-zoeken, voor-komen: the prefix is one of the double particles.
    const found = DOUBLES.find((p) => core.startsWith(p) && core.length - p.length >= 4
      && (KNOWN.has(core.slice(p.length)) || looksLikeVerb(core.slice(p.length))));
    if (found) {
      prefix = found;
      rest = core.slice(found.length);
    }
  } else if (IRREGULARS[core]) {
    data = IRREGULARS[core];
    listed = true;
    // A listed verb that starts with a prefix (beginnen, vergeten) still
    // splits, so that its stem is spelled on the root and its participle
    // takes no ge-.
    const loose = PREFIXES.find(([p, allowed]) => core.startsWith(p) && core.length - p.length >= 4
      && allowed.test(core.slice(p.length)) && ONSETS.has(onsetOf(core.slice(p.length))));
    if (loose && !NOT_PREFIXED.has(core)) {
      prefix = loose[0];
      rest = core.slice(prefix.length);
    }
  } else {
    const prefixed = splitPrefix(core);
    if (prefixed) {
      prefix = prefixed.prefix;
      rest = prefixed.rest;
    }
  }

  if (!data && !NOT_DERIVED.has(verb) && !NOT_DERIVED.has(core)) data = IRREGULARS[rest] ?? null;

  return { particle, prefix, rest, data, listed };
}

// --- the stem ----------------------------------------------------------------

/**
 * Whether the e before a final -l, -r, -n or -m is a schwa, so that it is not
 * doubled: wandelen → wandel, luisteren → luister, but spelen → speel.
 *
 * A monosyllabic root has nothing else to carry the stress, so its e is long.
 * In a longer root the e of -el, -en and -em is a schwa (the exceptions are in
 * LONG_E), and the e of -er is a schwa in the native verbs (UNSTRESSED_ER, or
 * a doubled consonant before it: schitteren, herinneren) and stressed in the
 * loans (studeren, and STRESSED_ER for the few with a doubled consonant).
 * `names` are the verb, the verb without its particle and the bare root, so
 * that a list may name whichever of them is the word.
 */
function schwa(raw, names) {
  const before = raw.slice(0, -2).replace(/ij/g, 'i');
  if (!/[aeiouyëï]/.test(before)) return false;
  const named = (set) => names.some((name) => set.has(name));
  if (raw.at(-1) === 'r') {
    if (named(STRESSED_ER)) return false;
    if (named(UNSTRESSED_ER)) return true;
    return /([bdgkmnpt])\1$/.test(raw.slice(0, -2));
  }
  return !named(LONG_E);
}

/**
 * The stem of a root verb and how it was respelled.
 *
 * @returns {{stem: string, past: 'te' | 'de', ortho: string[], ik?: string, tForm?: string}}
 *   stem   the ik form: loop, zit, leef, reis, ga, doe
 *   past   which weak ending 't kofschip gives it
 *   ortho  the spelling adjustments made, for the card
 */
function stemOf(root, names) {
  const ortho = [];

  // skiën, oliën: the stem keeps its ie; only skiën drops the e in the ik form.
  if (/iën$/.test(root)) {
    const stem = `${root.slice(0, -2)}e`;
    return { stem, past: 'de', ortho, ik: root === 'skiën' ? root.slice(0, -2) : stem };
  }
  // gaan, staan, doen, zien: the infinitive is stem + n, and the ik form of
  // -aan closes no syllable, so it writes a single a.
  if (isShort(root)) {
    const long = root.slice(0, -1);
    return { stem: long.replace(/aa$/, 'a'), past: 'de', ortho, tForm: `${long}t` };
  }

  const raw = root.slice(0, -2);
  let stem = raw;

  if (/([bcdfgklmnprstz])\1$/.test(raw)) {
    // A doubled consonant closes the syllable in the infinitive only.
    stem = raw.slice(0, -1);
    ortho.push(`${raw.slice(-2)} → ${raw.at(-1)}`);
  } else {
    // A single a, e, o or u before a single final consonant is long in the
    // infinitive's open syllable; it doubles when the syllable closes. Not
    // when it is the second half of a digraph (koe-, lui-, boe-: the regex
    // below asks what came before; oa only occurs in loans like downloaden),
    // and not when it is a schwa.
    const match = /^(.*?)([aeouë])([bdfgklmnprstvz])$/.exec(raw);
    if (match) {
      const [, head, vowel, consonant] = match;
      const previous = head.at(-1) ?? '';
      const digraph = (vowel === 'a' && 'ao'.includes(previous) && previous !== '')
        || (vowel === 'e' && 'eio'.includes(previous) && previous !== '')
        || (vowel === 'o' && previous === 'o')
        || (vowel === 'u' && 'ueoa'.includes(previous) && previous !== '');
      const silent = (vowel === 'e' && 'lrnm'.includes(consonant) && schwa(raw, names))
        || names.some((name) => SHORT_VOWEL.has(name));
      if (!digraph && !silent) {
        // The trema goes once the vowels no longer collide: kopiëren → kopieer; creëren → creëer.
        const doubled = vowel === 'ë' ? (previous === 'i' ? 'ee' : 'ëe') : vowel + vowel;
        stem = head + doubled + consonant;
        ortho.push(`${vowel} → ${doubled}`);
      }
    }
  }

  // v and z are not written at the end of a word.
  if (stem.endsWith('v')) {
    stem = `${stem.slice(0, -1)}f`;
    ortho.push('v → f');
  } else if (stem.endsWith('z')) {
    stem = `${stem.slice(0, -1)}s`;
    ortho.push('z → s');
  }

  // 't kofschip, judged on the infinitive's own consonant: leven → leefde.
  const voiceless = 'tkfspxc'.includes(raw.at(-1)) || /(?:ch|sh)$/.test(raw);
  return { stem, past: voiceless ? 'te' : 'de', ortho };
}

// --- the verb ----------------------------------------------------------------

class DutchVerb {
  constructor(infinitive, { plain = false } = {}) {
    const parts = analyse(infinitive);
    this.infinitive = infinitive;
    this.particle = parts.particle;
    this.prefix = parts.prefix;
    this.root = parts.rest;
    this.irr = plain ? {} : (parts.data ?? {});
    this.listed = parts.listed;
    // What a derivative is said to be conjugated like: begrijpen → grijpen,
    // aanbevelen → bevelen.
    this.baseVerb = parts.data ? (parts.listed ? parts.prefix + parts.rest : parts.rest) : null;
    this.derived = Boolean(parts.data) && Boolean(parts.particle || (parts.prefix && !parts.listed));

    const names = [infinitive, parts.prefix + parts.rest, parts.rest];
    this.spelling = stemOf(this.root, names);
    this.rootStem = this.irr.stam ?? this.spelling.stem;
    this.ortho = this.irr.stam ? [] : this.spelling.ortho;
  }

  get klasse() {
    if (this.irr.klasse) return this.irr.klasse;
    if (this.irr.ovt || this.irr.vd) return 'sterk';
    return this.spelling.past;
  }

  /** A form from the data, with the prefix put on unless the data has it already. */
  fromData(form) {
    if (form == null) return null;
    return this.listed ? form : this.prefix + form;
  }

  /** The stem with its prefix: begrijp, verkoop. */
  get stem() {
    return this.prefix + this.rootStem;
  }

  /** The ik form, which only skiën distinguishes from the stem. */
  get ikForm() {
    return this.prefix + (this.irr.stam ?? this.spelling.ik ?? this.spelling.stem);
  }

  /** The jij/hij form: stem + t, unless the stem already ends in t. */
  get tForm() {
    if (this.irr.stam) return `${this.stem}t`;
    if (this.spelling.tForm) return this.prefix + this.spelling.tForm;
    return this.stem.endsWith('t') ? this.stem : `${this.stem}t`;
  }

  /** The plural, which is the infinitive without its particle. */
  get plural() {
    return this.prefix + this.root;
  }

  ott() {
    if (this.irr.ott) return this.irr.ott.map((form) => this.fromData(form));
    return [this.ikForm, this.tForm, this.tForm, this.plural, this.plural, this.plural];
  }

  /**
   * A weak past is the stem plus -te or -de, so wachten gives wachtte and
   * redden gives redde: the stem's own t or d stays.
   */
  ovt() {
    let singular;
    let plural;
    if (this.irr.ovt) {
      singular = this.fromData(this.irr.ovt[0]);
      plural = this.fromData(this.irr.ovt[1]);
    } else {
      singular = this.stem + this.spelling.past;
      plural = `${singular}n`;
    }
    return [singular, singular, singular, plural, plural, plural];
  }

  /**
   * ge- + stem + t/d, with no letter doubled: gepraat, gered, gezet. The
   * ge- is left out after a prefix; a strong participle comes from the data,
   * where a derivative swaps the ge- for its prefix (gegrepen → begrepen)
   * and a separable one keeps it (aangegrepen).
   */
  participle() {
    if (this.irr.vd === null) return null;
    let core;
    if (this.irr.vd) {
      if (this.listed) core = this.irr.vd;
      else core = this.prefix ? this.prefix + this.irr.vd.replace(/^ge/, '') : this.irr.vd;
    } else {
      const { stem, past } = this.spelling;
      const ending = past === 'te' ? 't' : 'd';
      const weak = stem.endsWith(ending) ? stem : stem + ending;
      core = this.prefix ? this.prefix + weak : withGe(weak);
    }
    return this.particle + core;
  }

  /**
   * The archaic subjunctive: the infinitive minus its n (werke, leve, kome),
   * which for the -n verbs is the ik form (ga, doe, zij).
   */
  conjunctief() {
    if (this.irr.conjunctief) return this.fromData(this.irr.conjunctief);
    if (isShort(this.root) && !/ën$/.test(this.root)) return this.ikForm;
    return this.plural.slice(0, -1);
  }

  /**
   * Looked up by the whole verb first, then inherited through a separable
   * particle from a ZIJN_BASES verb; an unstressed prefix never inherits
   * (komen → zijn, but voorkomen → hebben). A reflexive always takes hebben.
   */
  auxiliary(pronominal) {
    if (pronominal) return 'hebben';
    if (ZIJN_VERBS.has(this.infinitive)) return 'zijn';
    if (HEBBEN_COMPOUNDS.has(this.infinitive)) return 'hebben';
    if (this.particle && !this.prefix && ZIJN_BASES.has(this.root)) return 'zijn';
    return 'hebben';
  }
}

/**
 * ge- in front of a vowel it would collide with takes a trema on that vowel
 * (geëist, geïnd, geüpload) — not before ij or ui, which cannot be misread
 * (geijkt, geuit).
 */
function withGe(form) {
  const first = form[0];
  if ('eiu'.includes(first) && !/^(?:ij|ui)/.test(form)) {
    return `ge${{ e: 'ë', i: 'ï', u: 'ü' }[first]}${form.slice(1)}`;
  }
  return `ge${form}`;
}

// --- the paradigm ------------------------------------------------------------

/** A finite form with its particle after it: bel op, kwam aan. */
function detached(form, particle) {
  if (form == null) return null;
  return particle ? `${form} ${particle}` : form;
}

function compound(auxForms, tail) {
  return PERSONS.map((_, index) => (auxForms[index] && tail ? `${auxForms[index]} ${tail}` : null));
}

function paradigm(bare, { plain, pronominal }) {
  const verb = new DutchVerb(bare, { plain });
  const participle = verb.participle();
  const auxName = verb.auxiliary(pronominal);
  const aux = AUX[auxName];
  const { particle } = verb;
  // zullen has no participle and no infinitive use, so no compound tense.
  const defective = Boolean(verb.irr.defectief);

  const simple = (forms) => row(forms.map((form) => detached(form, particle)));
  const perfect = (auxForms) => row(defective ? [] : compound(auxForms, participle));
  const future = (auxForms) => row(defective ? [] : compound(auxForms, bare));
  const futurePerfect = (auxForms) => row(defective ? [] : compound(auxForms, participle && `${participle} ${auxName}`));

  const indicatief = {
    ott: simple(verb.ott()),
    ovt: simple(verb.ovt()),
    ottt: future(ZULLEN),
    ovtt: future(ZOUDEN),
    vtt: perfect(aux.ott),
    vvt: perfect(aux.ovt),
    vttt: futurePerfect(ZULLEN),
    vvtt: futurePerfect(ZOUDEN),
  };

  const e = verb.conjunctief();
  const conjunctief = {
    ott: simple([e, e, e, verb.plural, verb.plural, verb.plural]),
  };

  // jij: the stem (werk, ga, wees); u: the -t form followed by u (werkt u,
  // gaat u, weest u). A separable particle closes both: bel op, belt u op.
  // The modals have none: nobody is ordered to be able to.
  let jij = null;
  let u = null;
  if (verb.irr.imperatief !== null) {
    if (verb.irr.imperatief) {
      jij = verb.fromData(verb.irr.imperatief[0]);
      u = verb.fromData(verb.irr.imperatief[1]);
    } else {
      jij = verb.ikForm;
      u = `${verb.tForm} u`;
    }
  }
  const imperatief = {
    bevestigend: {
      jij: detached(jij, particle),
      u: detached(u, particle),
    },
    ontkennend: {
      jij: jij ? detached(`${jij} niet`, particle) : null,
      u: u ? detached(`${u} niet`, particle) : null,
    },
  };

  const vormen = {
    infinitief: bare,
    tegenwoordigDeelwoord: `${bare}d`,
    voltooidDeelwoord: participle,
    voltooideInfinitief: participle ? `${participle} ${auxName}` : null,
    teInfinitief: particle ? `${particle} te ${bare.slice(particle.length)}` : `te ${bare}`,
  };

  return { verb, table: { vormen, indicatief, conjunctief, imperatief }, auxName };
}

/**
 * Build the full paradigm for a verb.
 *
 * A reflexive is given as *zich herinneren* and conjugated as *herinneren*:
 * the pronoun is not part of the forms, as in the Spanish engine, so `verb`
 * is the bare infinitive a link comes back to and `input` keeps the zich for
 * the heading of the card.
 *
 * @returns {{ok: boolean, verb?: string, table?: object, error?: string}}
 */
export function conjugate(input, { plain = false } = {}) {
  const raw = normalizeVerb(input);
  if (!raw) return { ok: false, error: 'empty', input: raw };

  const pronominal = /^zich /.test(raw);
  const bare = pronominal ? raw.slice(5) : raw;
  if (!isInfinitive(bare)) return { ok: false, error: 'not-an-infinitive', input: raw };

  const { verb, table, auxName } = paradigm(bare, { plain, pronominal });
  const klasse = verb.klasse;

  return {
    ok: true,
    verb: bare,
    input: raw,
    class: klasse,
    stem: verb.stem,
    source: 'local',
    pronominal,
    auxiliary: auxName,
    flags: {
      // The class chip already says irregular for zijn, hebben and the
      // modals; the flag is for the strong and mixed verbs with an anomaly
      // of their own (komen, gaan, brengen), and their derivatives.
      irregular: klasse !== 'onregelmatig' && Boolean(verb.irr.afwijkend),
      stemChange: null,
      ortho: verb.ortho.length ? verb.ortho.join(', ') : null,
      derivedFrom: verb.derived ? verb.baseVerb : null,
      separable: verb.particle || null,
      auxiliary: auxName,
    },
    table,
  };
}

/**
 * Cells where a table differs from the regular weak conjugation of the same
 * infinitive — the forms a learner actually has to remember. The auxiliary
 * is read off the table shown, so that a reflexive (always hebben) is
 * compared with a hebben paradigm and only its forms light up.
 */
export function irregularCells(infinitive, table = null) {
  const raw = normalizeVerb(infinitive);
  const bare = raw.replace(/^zich /, '');
  const shown = table ?? conjugate(raw).table;
  const marks = new Set();
  if (!shown || !isInfinitive(bare)) return marks;

  const hebben = /hebben$/.test(shown.vormen?.voltooideInfinitief ?? '');
  const reference = paradigm(bare, { plain: true, pronominal: hebben }).table;

  for (const mood of SHAPE.moods) {
    for (const [tense, forms] of Object.entries(shown[mood] ?? {})) {
      const against = reference[mood][tense];
      if (!against) continue;
      for (const person of PERSONS) {
        if (forms[person] && forms[person] !== against[person]) marks.add(`${mood}.${tense}.${person}`);
      }
    }
  }
  for (const [kind, forms] of Object.entries(shown.imperatief ?? {})) {
    for (const [person, form] of Object.entries(forms)) {
      if (form && form !== reference.imperatief[kind]?.[person]) marks.add(`imperatief.${kind}.${person}`);
    }
  }
  for (const [name, form] of Object.entries(shown.vormen ?? {})) {
    if (form && form !== reference.vormen[name]) marks.add(`vormen.${name}`);
  }
  return marks;
}
