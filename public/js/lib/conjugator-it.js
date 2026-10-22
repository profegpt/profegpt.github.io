/**
 * Italian conjugation engine.
 *
 * The third of its kind after lib/conjugator.js and lib/conjugator-fr.js, and
 * built the same way — rules first, data only where rules run out:
 *
 *   1. regular endings for the three conjugations, -are, -ere and -ire, with
 *      the -isc- infix for the capire family
 *   2. spelling that only preserves the sound (cercare → cerchi,
 *      mangiare → mangi, studiare → studi but inviare → invii)
 *   3. the contracted infinitives, which are regular from the longer form they
 *      were cut down from (tradurre ← traducere, porre ← ponere)
 *   4. explicit irregular forms and stems, inherited by prefixed derivatives
 *      (tenere → ottenere, fare → rifare)
 *
 * Three things shape the code beyond what the other two engines needed:
 *
 *   Two infinitives. A contracted verb shows one infinitive and conjugates from
 *   another: *fare* builds facevo, facendo and facessi on *facere*. The verb
 *   therefore carries a "full" infinitive beside the one it is cited by, and
 *   everything outside the present, the future and the participle runs on it.
 *
 *   The 1-3-3 passato remoto. An irregular passato remoto is irregular in
 *   exactly three persons — io, lui, loro (presi, prese, presero) — while
 *   tu, noi and voi stay regular (prendesti, prendemmo, prendeste). So the data
 *   records one strong stem and the engine fills in the rest.
 *
 *   Reflexive pronouns. Spanish and French can leave them out of a table and
 *   nobody minds; an Italian reflexive is learned *as* "mi alzo", and its
 *   compound tenses change auxiliary, so the pronouns are part of the forms.
 *
 * The conditional is a mood of its own in Italian grammar. It lives inside
 * `indicativo` here, as the tenses `condizionale` and `condizionalePassato`,
 * the same way French files its conditionnel under the indicatif: the
 * conjugator page draws two moods of two tables each, and a third mood with a
 * single row in each table would only be a gap in the layout.
 */

import {
  ESSERE_VERBS, IRREGULARS, ISC_VERBS, NOT_DERIVED, PREFIXABLE, STRESSED_IARE,
} from '../data/verbs-it.js';

export const PERSONS = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'];

/** The third person is also the polite "you", so lei is named with lui. */
export const PERSON_LABELS = {
  io: 'io',
  tu: 'tu',
  lui: 'lui / lei',
  noi: 'noi',
  voi: 'voi',
  loro: 'loro',
};

/**
 * Italian commands a polite *lei* as well as tu, noi and voi — borrowed from
 * the subjunctive, but learned as part of the imperative.
 */
export const IMPERATIVE_PERSONS = ['tu', 'lei', 'noi', 'voi'];

/** How this table is laid out, so the views and the tutor can stay generic. */
export const SHAPE = {
  moods: ['indicativo', 'congiuntivo'],
  imperative: 'imperativo',
  nonFinite: 'forme',
  imperativeKinds: ['affermativo', 'negativo'],
};

const REFLEXIVE = ['mi', 'ti', 'si', 'ci', 'vi', 'si'];
const GRAVE = { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' };

/**
 * The three infinitives that were shortened without changing how the verb
 * conjugates. Every verb ending this way is one of these families, so they are
 * a rule, not a list.
 */
const CONTRACTED = [
  ['durre', 'ducere'],
  ['porre', 'ponere'],
  ['trarre', 'traere'],
];

// --- endings ---------------------------------------------------------------

const PRESENTE = {
  a: ['o', 'i', 'a', 'iamo', 'ate', 'ano'],
  e: ['o', 'i', 'e', 'iamo', 'ete', 'ono'],
  i: ['o', 'i', 'e', 'iamo', 'ite', 'ono'],
  isc: ['isco', 'isci', 'isce', 'iamo', 'ite', 'iscono'],
};

const IMPERFETTO = ['vo', 'vi', 'va', 'vamo', 'vate', 'vano'];

const REMOTO = {
  a: ['ai', 'asti', 'ò', 'ammo', 'aste', 'arono'],
  e: ['ei', 'esti', 'é', 'emmo', 'este', 'erono'],
  i: ['ii', 'isti', 'ì', 'immo', 'iste', 'irono'],
};

const FUTURO = ['ò', 'ai', 'à', 'emo', 'ete', 'anno'];
const CONDIZIONALE = ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero'];

const CONGIUNTIVO = {
  a: ['i', 'i', 'i', 'iamo', 'iate', 'ino'],
  e: ['a', 'a', 'a', 'iamo', 'iate', 'ano'],
  i: ['a', 'a', 'a', 'iamo', 'iate', 'ano'],
  isc: ['isca', 'isca', 'isca', 'iamo', 'iate', 'iscano'],
};

const CONG_IMPERFETTO = ['ssi', 'ssi', 'sse', 'ssimo', 'ste', 'ssero'];

const AUX = {
  avere: {
    presente: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
    imperfetto: ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano'],
    remoto: ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero'],
    futuro: ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno'],
    condizionale: ['avrei', 'avresti', 'avrebbe', 'avremmo', 'avreste', 'avrebbero'],
    congPresente: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
    congImperfetto: ['avessi', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero'],
    infinito: 'avere',
    gerundio: 'avendo',
  },
  essere: {
    presente: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
    imperfetto: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'],
    remoto: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'],
    futuro: ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno'],
    condizionale: ['sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero'],
    congPresente: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'],
    congImperfetto: ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero'],
    infinito: 'essere',
    gerundio: 'essendo',
  },
};

// --- small helpers ---------------------------------------------------------

export function normalizeVerb(input) {
  return String(input ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Strip the reflexive -si: alzarsi → alzare, porsi → porre, tradursi →
 * tradurre. The pronoun is welded to the infinitive in Italian, so it comes
 * off the end rather than the front as in French.
 */
export function stripPronoun(verb) {
  const match = /^(.+r)si$/.exec(verb);
  if (!match) return { verb, pronominal: false };
  const stem = match[1];
  // The contracted families lost a whole syllable, not just the final e.
  // -dursi and -porsi can only be -durre and -porre, but -trarsi is just as
  // often an -are verb (mostrarsi, incontrarsi), so trarre is only assumed
  // after one of its own prefixes.
  const contracted = /(?:dur|por)$/.test(stem)
    || (stem.endsWith('trar') && TRARRE_PREFIXES.has(stem.slice(0, -4)));
  return { verb: contracted ? `${stem}re` : `${stem}e`, pronominal: true };
}

const TRARRE_PREFIXES = new Set(['', 'at', 'as', 'con', 'de', 'dis', 'es', 'pro', 'ri', 'sot', 'sottos']);

/** The citation form of a reflexive: alzare → alzarsi, porre → porsi. */
function reflexiveInfinitive(infinitive) {
  return /rre$/.test(infinitive) ? `${infinitive.slice(0, -2)}si` : `${infinitive.slice(0, -1)}si`;
}

function row(forms) {
  return Object.fromEntries(PERSONS.map((person, index) => [person, forms[index] ?? null]));
}

/**
 * The spelling an -are stem needs before an ending, so that the sound of the
 * stem does not change with it.
 *
 *   'h'  cercare, pagare: c and g go soft before e and i, so an h keeps them
 *        hard — cerchi, paghiamo, cercherò.
 *   'ci' mangiare, cominciare, lasciare: the i is only there to soften the
 *        consonant before a and o, and e and i do that on their own —
 *        mangi, mangiamo, mangerò.
 *   'i'  studiare, sbagliare: an unstressed i merges into an ending that
 *        starts with i — studi, studiamo, studino — but stays before e
 *        (studierò).
 *   'í'  inviare, sciare: the i is stressed and a vowel in its own right, so
 *        it survives everywhere except where -iamo/-iate would double it.
 */
function respell(stem, ending, kind) {
  if (stem == null || ending == null) return null;
  if (kind === 'h' && /^[ei]/.test(ending)) return `${stem}h${ending}`;
  if (kind === 'ci' && /^[ei]/.test(ending)) return stem.slice(0, -1) + ending;
  if (kind === 'i' && /^i/.test(ending)) return stem.slice(0, -1) + ending;
  if (kind === 'í' && /^ia/.test(ending)) return stem.slice(0, -1) + ending;
  return stem + ending;
}

/**
 * A prefix can make a stressed monosyllable into the last syllable of a longer
 * word, and Italian writes that stress: fa → rifà, sto → sottostò.
 */
function withPrefix(value, prefix) {
  if (!prefix || value == null) return value;
  if (Array.isArray(value)) return value.map((item) => withPrefix(item, prefix));
  const accented = /^[^aeiouàèéìòù]*[aeiou]$/.test(value)
    ? value.slice(0, -1) + GRAVE[value.at(-1)]
    : value;
  return prefix + accented;
}

// --- analysis --------------------------------------------------------------

/**
 * Split an infinitive into stem + conjugation, or null if it is not one.
 *
 * `ending` is the conjugation the verb is cited under; `full` is the
 * infinitive it actually conjugates from, which differs only for the
 * contracted families.
 */
export function classify(infinitive) {
  if (!/^[a-zàèéìòù]+$/.test(infinitive || '')) return null;
  for (const [short, long] of CONTRACTED) {
    if (infinitive.endsWith(short)) {
      const full = infinitive.slice(0, -short.length) + long;
      return { stem: full.slice(0, -3), ending: 'ere', full };
    }
  }
  const match = /^(.+)(are|ere|ire)$/.exec(infinitive);
  if (!match) return null;
  return { stem: match[1], ending: match[2], full: infinitive };
}

function spellingKind(full) {
  if (!/are$/.test(full)) return null;
  if (/[cg]are$/.test(full)) return 'h';
  if (STRESSED_IARE.has(full)) return 'í';
  if (/[cg]iare$/.test(full)) return 'ci';
  if (/iare$/.test(full)) return 'i';
  return null;
}

const SPELLING_LABELS = {
  h: (stem) => `${stem.at(-1)} → ${stem.at(-1)}h`,
  ci: (stem) => `${stem.slice(-2)} → ${stem.at(-2)}`,
  i: () => 'ii → i',
  í: () => 'í tonica',
};

/** Look up explicit irregularity, following prefixed derivatives to their base. */
function findIrregular(verb) {
  if (IRREGULARS[verb]) return { data: IRREGULARS[verb], prefix: '', base: verb };
  if (NOT_DERIVED.has(verb)) return null;

  let best = null;
  for (const base of PREFIXABLE) {
    if (!IRREGULARS[base]) continue;
    if (verb.length <= base.length || !verb.endsWith(base)) continue;
    if (!best || base.length > best.base.length) {
      best = { data: IRREGULARS[base], prefix: verb.slice(0, verb.length - base.length), base };
    }
  }
  return best;
}

// --- the verb --------------------------------------------------------------

class ItalianVerb {
  constructor(infinitive, { plain = false } = {}) {
    const parts = classify(infinitive);
    this.infinitive = infinitive;
    this.class = parts.ending;

    const found = plain ? null : findIrregular(infinitive);
    this.irr = found?.data ?? {};
    this.prefix = found?.prefix ?? '';
    this.base = found?.base ?? null;

    // Everything regular runs on the full infinitive: facere, traducere.
    this.full = this.irr.full ? this.prefix + this.irr.full : parts.full;
    this.stem = this.full.slice(0, -3);
    this.theme = this.full.at(-3);

    this.isc = this.theme === 'i' && ISC_VERBS.has(infinitive) && !this.irr.presente;
    this.spelling = spellingKind(this.full);
  }

  /** The stem plus its theme vowel: parla-, crede-, dormi-, face-. */
  get weak() {
    return this.stem + this.theme;
  }

  presente() {
    if (this.irr.presente) return withPrefix(this.irr.presente, this.prefix);
    const endings = this.isc ? PRESENTE.isc : PRESENTE[this.theme];
    return endings.map((ending) => respell(this.stem, ending, this.spelling));
  }

  imperfetto() {
    if (this.irr.imperfetto) return withPrefix(this.irr.imperfetto, this.prefix);
    return IMPERFETTO.map((ending) => this.weak + ending);
  }

  passatoRemoto() {
    if (this.irr.remoto) return withPrefix(this.irr.remoto, this.prefix);
    if (this.irr.remotoStrong) {
      const strong = this.prefix + this.irr.remotoStrong;
      return [`${strong}i`, `${this.weak}sti`, `${strong}e`,
        `${this.weak}mmo`, `${this.weak}ste`, `${strong}ero`];
    }
    return REMOTO[this.theme].map((ending) => this.stem + ending);
  }

  /**
   * -are verbs weaken their a to e (parlerò); the others keep the infinitive
   * and drop its final vowel (crederò, dormirò, and porrò, tradurrò for the
   * contracted ones).
   */
  futuroStem() {
    if (this.irr.futuroStem) return this.prefix + this.irr.futuroStem;
    if (this.theme === 'a') return respell(this.stem, 'er', this.spelling);
    return this.infinitive.slice(0, -1);
  }

  /**
   * A verb with an irregular present builds its subjunctive on the first
   * person: vengo → venga, faccio → faccia, esco → esca. noi and voi follow
   * the present noi, which is why it is *veniamo, veniate* and not *vengiamo*.
   */
  congiuntivo() {
    if (this.irr.congiuntivo) return withPrefix(this.irr.congiuntivo, this.prefix);
    if (this.irr.presente) {
      const present = this.presente();
      const strong = present[0]?.replace(/o$/, '');
      const noi = present[3];
      return [`${strong}a`, `${strong}a`, `${strong}a`, noi, noi?.replace(/mo$/, 'te'), `${strong}ano`];
    }
    const endings = this.isc ? CONGIUNTIVO.isc : CONGIUNTIVO[this.theme];
    return endings.map((ending) => respell(this.stem, ending, this.spelling));
  }

  congiuntivoImperfetto() {
    const stem = this.irr.congImperfettoStem ? this.prefix + this.irr.congImperfettoStem : this.weak;
    return CONG_IMPERFETTO.map((ending) => stem + ending);
  }

  /**
   * -ere verbs whose stem ends in a soft c keep it soft with an i:
   * conosciuto, piaciuto, taciuto.
   */
  participio() {
    if (this.irr.participio) return this.prefix + this.irr.participio;
    if (this.theme === 'a') return `${this.stem}ato`;
    if (this.theme === 'i') return `${this.stem}ito`;
    return /c$/.test(this.stem) ? `${this.stem}iuto` : `${this.stem}uto`;
  }

  gerundio() {
    if (this.irr.gerundio) return this.prefix + this.irr.gerundio;
    return this.stem + (this.theme === 'a' ? 'ando' : 'endo');
  }

  participioPresente() {
    if (this.irr.participioPresente !== undefined) {
      return this.irr.participioPresente === null ? null : this.prefix + this.irr.participioPresente;
    }
    return this.stem + (this.theme === 'a' ? 'ante' : 'ente');
  }

  /**
   * Looked up by the verb itself, never inherited from a base: a prefix
   * changes the auxiliary often enough (venire/mantenere-style pairs) that
   * derivatives are listed by name.
   */
  auxiliary(pronominal) {
    if (pronominal) return 'essere';
    return ESSERE_VERBS.has(this.infinitive) ? 'essere' : 'avere';
  }
}

// --- agreement -------------------------------------------------------------

/**
 * After essere the participle agrees with its subject, so the table prints
 * both genders the way an Italian grammar does: *sono andato/a*, *siamo
 * andati/e*. Every Italian participle ends in -o, which keeps this simple.
 */
function agree(participle, plural) {
  const stem = participle.slice(0, -1);
  return plural ? `${stem}i/e` : `${stem}o/a`;
}

function compound(auxForms, participle, agreeing, pronouns) {
  return PERSONS.map((person, index) => {
    if (!auxForms[index]) return null;
    const past = agreeing ? agree(participle, index >= 3) : participle;
    const form = `${auxForms[index]} ${past}`;
    return pronouns ? `${pronouns[index]} ${form}` : form;
  });
}

function blankDefective(table, persons) {
  if (!persons?.length) return;
  for (const mood of SHAPE.moods) {
    for (const forms of Object.values(table[mood])) {
      for (const person of persons) forms[person] = null;
    }
  }
  for (const forms of Object.values(table.imperativo)) {
    for (const person of Object.keys(forms)) forms[person] = null;
  }
}

/**
 * An enclitic pronoun on a truncated imperative doubles its consonant:
 * fa' + ti → fatti, di' + mi → dimmi.
 */
function enclitic(form, pronoun) {
  if (!form) return null;
  if (form.endsWith("'")) return form.slice(0, -1) + pronoun[0] + pronoun;
  return form + pronoun;
}

// --- the paradigm ----------------------------------------------------------

/**
 * Build the full paradigm for a verb.
 *
 * A reflexive is reported under its citation form — `verb` is "alzarsi", with
 * the bare infinitive in `infinitive` — so that a link or a gloss lookup made
 * from the result comes back to the same reflexive table.
 *
 * @returns {{ok: boolean, verb?: string, table?: object, error?: string}}
 */
export function conjugate(input, { plain = false } = {}) {
  const raw = normalizeVerb(input);
  if (!raw) return { ok: false, error: 'empty' };

  const { verb: bare, pronominal } = stripPronoun(raw);
  if (!classify(bare)) return { ok: false, error: 'not-an-infinitive', input: raw };

  const verb = new ItalianVerb(bare, { plain });

  const presente = verb.presente();
  const congiuntivo = verb.congiuntivo();
  const futuroStem = verb.futuroStem();
  const participio = verb.participio();
  const auxName = verb.auxiliary(pronominal);
  const aux = AUX[auxName];
  const agreeing = auxName === 'essere';
  const pronouns = pronominal ? REFLEXIVE : null;

  const simple = (forms) => row(pronouns
    ? forms.map((form, index) => (form ? `${pronouns[index]} ${form}` : null))
    : forms);
  const perfect = (auxForms) => row(compound(auxForms, participio, agreeing, pronouns));
  const futuro = (endings) => endings.map((ending) => respell(futuroStem, ending, null));

  const indicativo = {
    presente: simple(presente),
    imperfetto: simple(verb.imperfetto()),
    passatoRemoto: simple(verb.passatoRemoto()),
    futuro: simple(futuro(FUTURO)),
    condizionale: simple(futuro(CONDIZIONALE)),
    passatoProssimo: perfect(aux.presente),
    trapassatoProssimo: perfect(aux.imperfetto),
    trapassatoRemoto: perfect(aux.remoto),
    futuroAnteriore: perfect(aux.futuro),
    condizionalePassato: perfect(aux.condizionale),
  };

  const congiuntivoTable = {
    presente: simple(congiuntivo),
    imperfetto: simple(verb.congiuntivoImperfetto()),
    passato: perfect(aux.congPresente),
    trapassato: perfect(aux.congImperfetto),
  };

  // tu: -are verbs take -a (parla), the rest borrow the present (credi,
  // dormi, finisci). lei is the subjunctive; noi and voi are the present.
  // A truncated form like fa' does not survive a prefix: rifare says rifai.
  const explicit = verb.irr.imperativo;
  const fromData = (index) => {
    const form = explicit[index];
    if (form == null) return null;
    if (verb.prefix && form.endsWith("'")) return presente[1];
    return withPrefix(form, verb.prefix);
  };
  const affirmative = explicit
    ? { tu: fromData(0), lei: fromData(1), noi: fromData(2), voi: fromData(3) }
    : {
      tu: verb.class === 'are' ? respell(verb.stem, 'a', verb.spelling) : presente[1],
      lei: congiuntivo[2],
      noi: presente[3],
      voi: presente[4],
    };

  const not = (form) => (form ? `non ${form}` : null);

  // The negative tu is the infinitive, which is the one thing a learner has
  // to be told: *non parlare*, never *non parla*.
  const imperativo = pronominal
    ? {
      affermativo: {
        tu: enclitic(affirmative.tu, 'ti'),
        lei: affirmative.lei ? `si ${affirmative.lei}` : null,
        noi: enclitic(affirmative.noi, 'ci'),
        voi: enclitic(affirmative.voi, 'vi'),
      },
      negativo: {
        tu: affirmative.tu ? `non ${reflexiveInfinitive(bare).replace(/si$/, 'ti')}` : null,
        lei: affirmative.lei ? `non si ${affirmative.lei}` : null,
        noi: not(enclitic(affirmative.noi, 'ci')),
        voi: not(enclitic(affirmative.voi, 'vi')),
      },
    }
    : {
      affermativo: affirmative,
      negativo: {
        tu: affirmative.tu ? `non ${bare}` : null,
        lei: not(affirmative.lei),
        noi: not(affirmative.noi),
        voi: not(affirmative.voi),
      },
    };

  const gerundio = verb.gerundio();
  const table = {
    forme: {
      infinito: pronominal ? reflexiveInfinitive(bare) : bare,
      gerundio: pronominal ? `${gerundio}si` : gerundio,
      participioPresente: verb.participioPresente(),
      participioPassato: participio,
      infinitoPassato: pronominal ? `essersi ${participio}` : `${aux.infinito} ${participio}`,
      gerundioPassato: pronominal ? `essendosi ${participio}` : `${aux.gerundio} ${participio}`,
    },
    indicativo,
    congiuntivo: congiuntivoTable,
    imperativo,
  };

  blankDefective(table, verb.irr.defective);

  const derivedFrom = verb.prefix ? (verb.irr.display ?? verb.base) : null;

  return {
    ok: true,
    verb: pronominal ? reflexiveInfinitive(bare) : bare,
    infinitive: bare,
    input: raw,
    class: verb.class,
    stem: verb.stem,
    source: 'local',
    pronominal,
    auxiliary: auxName,
    flags: {
      irregular: Boolean(verb.base),
      stemChange: verb.isc ? 'isc' : null,
      ortho: verb.spelling ? SPELLING_LABELS[verb.spelling](verb.stem) : null,
      derivedFrom,
      auxiliary: auxName,
      group: { are: 1, ere: 2, ire: 3 }[verb.class],
    },
    table,
  };
}

/**
 * Cells where a table differs from the naive regular conjugation — the forms a
 * learner actually has to remember.
 */
export function irregularCells(infinitive, table = null) {
  const shown = table ?? conjugate(infinitive).table;
  const plain = conjugate(infinitive, { plain: true });
  const marks = new Set();
  if (!shown || !plain.ok) return marks;

  for (const mood of SHAPE.moods) {
    for (const [tense, forms] of Object.entries(shown[mood] ?? {})) {
      const reference = plain.table[mood][tense];
      if (!reference) continue;
      for (const person of PERSONS) {
        if (forms[person] && forms[person] !== reference[person]) marks.add(`${mood}.${tense}.${person}`);
      }
    }
  }
  for (const [kind, forms] of Object.entries(shown.imperativo ?? {})) {
    for (const [person, form] of Object.entries(forms)) {
      if (form && form !== plain.table.imperativo[kind]?.[person]) marks.add(`imperativo.${kind}.${person}`);
    }
  }
  for (const [name, form] of Object.entries(shown.forme ?? {})) {
    if (form && form !== plain.table.forme[name]) marks.add(`forme.${name}`);
  }
  return marks;
}
