/**
 * Portuguese conjugation engine.
 *
 * The fourth of its kind, and the nearest relative of the Spanish one in
 * lib/conjugator.js. Rules first, data only where rules run out:
 *
 *   1. regular endings for -ar, -er and -ir
 *   2. spelling that only preserves the sound (ficar → fiquei, chegar →
 *      cheguei, começar → comecei, conhecer → conheço, dirigir → dirijo,
 *      erguer → ergo) and the written accent a hiatus calls for (sair →
 *      saímos, saíste; construir → construíram)
 *   3. the sub-patterns that cover a whole ending: -ear (passeio), -air
 *      (saio, sais, sai), -uir (atribuis, atribui), -oer (móis, mói) and
 *      -azer / -uzir (jaz, conduz)
 *   4. vowel alternations, which are a fact about the verb (dormir → durmo,
 *      subir → sobes, odiar → odeio, proibir → proíbo)
 *   5. explicit irregular forms, inherited by prefixed derivatives
 *      (ter → manter, pôr → propor, vir → intervir)
 *
 * The Portuguese is Portugal's, in the spelling of the 1990 Agreement: the
 * pretérito perfeito says *falámos* where the present says *falamos*.
 *
 * Three things shape the code beyond what Spanish needed:
 *
 *   The first person decides the conjuntivo. Whatever happens to *eu* in the
 *   present happens to the whole present conjuntivo, and through it to most
 *   of the imperative: sinto → sinta, sintamos; faço → faça; saio → saia.
 *   The alternations that leave the first person alone (subir → sobes) leave
 *   the conjuntivo alone too (suba).
 *
 *   One perfeito stem, four tenses. The third person plural of the pretérito
 *   perfeito, less its -ram, carries the mais-que-perfeito and the imperfeito
 *   and futuro do conjuntivo: fizeram → fizera, fizesse, fizer. So an
 *   irregular verb lists its perfeito and nothing else of the four.
 *
 *   The personal infinitive. Portuguese inflects its infinitive (falar,
 *   falares, falarmos), and always regularly: *fazeres* beside the futuro do
 *   conjuntivo *fizeres*. It has a mood of its own in the table, `infinitivo`.
 *
 * Every compound tense takes *ter*, so there is no auxiliary to choose and
 * `auxiliary` is always null. Reflexives follow the Spanish engine: the -se
 * is accepted and reported, and the forms are given without their pronouns.
 */

import {
  DERIVED, IRREGULARS, PREFIXABLE, SHORT_PARTICIPLES, SHORT_WITH_TER, SOUNDED_GU,
  STEM_CHANGES, STEM_FAMILIES,
} from '../data/verbs-pt.js';

export const PERSONS = ['eu', 'tu', 'ele', 'nos', 'vos', 'eles'];

/** The third persons are also the polite "you": você and vocês. */
export const PERSON_LABELS = {
  eu: 'eu',
  tu: 'tu',
  ele: 'ele / ela / você',
  nos: 'nós',
  vos: 'vós',
  eles: 'eles / elas / vocês',
};

/**
 * The imperative has forms of its own only for tu and vós; você, nós and
 * vocês borrow the conjuntivo, but are learned as commands all the same.
 */
export const IMPERATIVE_PERSONS = ['tu', 'voce', 'nos', 'vos', 'voces'];

/** How this table is laid out, so the views and the tutor can stay generic. */
export const SHAPE = {
  moods: ['indicativo', 'conjuntivo'],
  imperative: 'imperativo',
  nonFinite: 'formas',
  imperativeKinds: ['afirmativo', 'negativo'],
};

/** Display labels for every value `flags.stemChange` can take. */
export const STEM_CHANGE_LABELS = {
  'e→i': 'e → i',
  'o→u': 'o → u',
  'u→o': 'u → o',
  'e→i:todas': 'e → i (agrido, agrides)',
  'o→u:todas': 'o → u (pulo, pules)',
  'e→ei': 'e → ei',
  'i→ei': 'i → ei',
  'i→í': 'i → í',
  'u→ú': 'u → ú',
  'u→ó': 'u → ó',
  'a→ai': 'a → ai',
};

/**
 * Which forms a vowel alternation reaches.
 *
 *   first     eu of the present, and the whole present conjuntivo
 *   others    tu, ele and eles of the present, and nothing else
 *   all       both of the above
 *   stressed  every form stressed on the stem: eu, tu, ele, eles of the
 *             present and of the conjuntivo, but not nós and vós
 */
const CHANGE_SCOPE = {
  'e→i': 'first',
  'o→u': 'first',
  'a→ai': 'first',
  'u→o': 'others',
  'e→i:todas': 'all',
  'o→u:todas': 'all',
  'e→ei': 'stressed',
  'i→ei': 'stressed',
  'i→í': 'stressed',
  'u→ú': 'stressed',
};

// --- endings ---------------------------------------------------------------

const ENDINGS = {
  ar: {
    presente: ['o', 'as', 'a', 'amos', 'ais', 'am'],
    conjuntivo: ['e', 'es', 'e', 'emos', 'eis', 'em'],
    imperfeito: ['ava', 'avas', 'ava', 'ávamos', 'áveis', 'avam'],
    // -ámos is Portugal's; Brazil writes falamos in both tenses.
    perfeito: ['ei', 'aste', 'ou', 'ámos', 'astes', 'aram'],
    maisQuePerfeito: ['ara', 'aras', 'ara', 'áramos', 'áreis', 'aram'],
    conjImperfeito: ['asse', 'asses', 'asse', 'ássemos', 'ásseis', 'assem'],
    conjFuturo: ['ar', 'ares', 'ar', 'armos', 'ardes', 'arem'],
    gerundio: 'ando',
    participio: 'ado',
  },
  er: {
    presente: ['o', 'es', 'e', 'emos', 'eis', 'em'],
    conjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'am'],
    imperfeito: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
    perfeito: ['i', 'este', 'eu', 'emos', 'estes', 'eram'],
    maisQuePerfeito: ['era', 'eras', 'era', 'êramos', 'êreis', 'eram'],
    conjImperfeito: ['esse', 'esses', 'esse', 'êssemos', 'êsseis', 'essem'],
    conjFuturo: ['er', 'eres', 'er', 'ermos', 'erdes', 'erem'],
    gerundio: 'endo',
    participio: 'ido',
  },
  ir: {
    presente: ['o', 'es', 'e', 'imos', 'is', 'em'],
    conjuntivo: ['a', 'as', 'a', 'amos', 'ais', 'am'],
    imperfeito: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
    perfeito: ['i', 'iste', 'iu', 'imos', 'istes', 'iram'],
    maisQuePerfeito: ['ira', 'iras', 'ira', 'íramos', 'íreis', 'iram'],
    conjImperfeito: ['isse', 'isses', 'isse', 'íssemos', 'ísseis', 'issem'],
    conjFuturo: ['ir', 'ires', 'ir', 'irmos', 'irdes', 'irem'],
    gerundio: 'indo',
    participio: 'ido',
  },
};

const FUTURO = ['ei', 'ás', 'á', 'emos', 'eis', 'ão'];
const CONDICIONAL = ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'];

/** What goes on a strong perfeito stem: fize-ra, fize-sse, fize-r. */
const STRONG = {
  maisQuePerfeito: ['ra', 'ras', 'ra', 'ramos', 'reis', 'ram'],
  conjImperfeito: ['sse', 'sses', 'sse', 'ssemos', 'sseis', 'ssem'],
  conjFuturo: ['r', 'res', 'r', 'rmos', 'rdes', 'rem'],
};

/**
 * The accent nós and vós put on a strong stem. Its e is open (fizéramos,
 * tivéssemos) where the regular -er verbs have a closed one (comêramos); the
 * o of ser and ir is closed (fôramos, fôssemos).
 */
const STRONG_ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ô' };

const TER = {
  presente: ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm'],
  imperfeito: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'],
  futuro: ['terei', 'terás', 'terá', 'teremos', 'tereis', 'terão'],
  condicional: ['teria', 'terias', 'teria', 'teríamos', 'teríeis', 'teriam'],
  conjuntivo: ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham'],
  conjImperfeito: ['tivesse', 'tivesses', 'tivesse', 'tivéssemos', 'tivésseis', 'tivessem'],
  conjFuturo: ['tiver', 'tiveres', 'tiver', 'tivermos', 'tiverdes', 'tiverem'],
};

// --- small helpers ---------------------------------------------------------

export function normalizeVerb(input) {
  return String(input ?? '').trim().toLowerCase().replace(/\s+/g, '');
}

/**
 * The spelling a verb is cited under. *por* typed without its circumflex is
 * read as the verb, since the preposition is nothing anyone would conjugate;
 * and the circumflex belongs to the bare verb only, so *compôr* is *compor*.
 */
function citation(verb) {
  if (verb === 'por') return 'pôr';
  if (/.pôr$/.test(verb)) return `${verb.slice(0, -3)}por`;
  return verb;
}

function row(forms) {
  return Object.fromEntries(PERSONS.map((person, index) => [person, forms[index] ?? null]));
}

/** Replace the last occurrence of `from` in the stem: prefer → prefir, sacud → sacod. */
function shiftStem(stem, from, to) {
  const at = stem.lastIndexOf(from);
  if (at === -1) return stem;
  return stem.slice(0, at) + to + stem.slice(at + from.length);
}

/**
 * A stressed monosyllable in -em or -ens needs no accent, but the same
 * syllable at the end of a longer word does: tem → mantém, vens → intervéns.
 * The plural keeps its circumflex either way (têm → mantêm), and nothing
 * else a prefix meets has to change.
 */
function prefixForm(form, prefix) {
  if (!prefix || form == null) return form;
  const oxytone = /^([b-df-hj-np-tv-z]*)e(m|ns)$/.exec(form);
  return oxytone ? `${prefix}${oxytone[1]}é${oxytone[2]}` : prefix + form;
}

function withPrefix(forms, prefix) {
  return prefix ? forms.map((form) => prefixForm(form, prefix)) : forms;
}

// --- analysis --------------------------------------------------------------

/**
 * Split an infinitive into stem + conjugation, or null if it is not one.
 *
 * The fourth class, 'or', holds pôr and nothing but pôr: every other verb in
 * -or is pôr with a prefix. A word in -or that is not built on it (*amor*,
 * *flor*) is therefore not an infinitive at all.
 */
export function classify(infinitive) {
  if (!/^[a-záàâãéêíóôõúüç]+$/.test(infinitive || '')) return null;
  if (infinitive === 'ir') return { stem: '', ending: 'ir' };
  if (infinitive === 'pôr' || /.por$/.test(infinitive)) return { stem: infinitive.slice(0, -2), ending: 'or' };
  const match = /^(.+)(ar|er|ir)$/.exec(infinitive);
  return match ? { stem: match[1], ending: match[2] } : null;
}

/**
 * Sound-preserving spelling change, triggered by the vowel that follows the
 * stem. c and g are hard before a and o and soft before e and i, so each
 * conjugation has to respell them where its endings cross that line.
 */
function orthoRule(infinitive) {
  if (/car$/.test(infinitive)) return { before: 'e', from: 'c', to: 'qu' };
  if (/gar$/.test(infinitive)) return { before: 'e', from: 'g', to: 'gu' };
  if (/çar$/.test(infinitive)) return { before: 'e', from: 'ç', to: 'c' };
  if (/gu[ei]r$/.test(infinitive)) {
    return SOUNDED_GU.has(infinitive) ? null : { before: 'ao', from: 'gu', to: 'g' };
  }
  if (/g[ei]r$/.test(infinitive)) return { before: 'ao', from: 'g', to: 'j' };
  if (/c[ei]r$/.test(infinitive)) return { before: 'ao', from: 'c', to: 'ç' };
  return null;
}

/** The vowel alternation a verb has: by name, by family, or by its ending. */
function stemChangeOf(infinitive) {
  if (STEM_CHANGES[infinitive]) return STEM_CHANGES[infinitive];
  for (const [ending, code] of STEM_FAMILIES) {
    if (infinitive.endsWith(ending)) return code;
  }
  if (/.ear$/.test(infinitive)) return 'e→ei';
  if (/.air$/.test(infinitive)) return 'a→ai';
  return null;
}

/** Look up explicit irregularity, following derivatives to their base. */
function findIrregular(verb) {
  if (IRREGULARS[verb]) return { data: IRREGULARS[verb], prefix: '', base: verb };

  const named = DERIVED[verb];
  if (named) return { data: IRREGULARS[named], prefix: verb.slice(0, verb.length - named.length), base: named };

  if (/.por$/.test(verb)) return { data: IRREGULARS['pôr'], prefix: verb.slice(0, -3), base: 'pôr' };

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

class PortugueseVerb {
  constructor(infinitive, { plain = false } = {}) {
    const parts = classify(infinitive);
    this.infinitive = infinitive;
    this.class = parts.ending;
    this.stem = parts.stem;
    this.plain = plain;

    // pôr was *poer*, a second-conjugation verb, and the few regular endings
    // it still takes are that conjugation's. That is also what its table is
    // compared against to find the cells worth highlighting.
    this.endings = ENDINGS[this.class === 'or' ? 'er' : this.class];

    const found = plain ? null : findIrregular(infinitive);
    this.irr = found?.data ?? {};
    this.prefix = found?.prefix ?? '';
    this.base = found?.base ?? null;

    this.ortho = orthoRule(infinitive);
    this.sounded = SOUNDED_GU.has(infinitive);

    // A stem that ends in a vowel meets the i of an ending as two syllables
    // (sa-ir, constru-ir, mo-er). gu and qu are consonants, not vowels.
    this.hiatus = this.class !== 'ar' && this.class !== 'or'
      && /[aou]$/.test(this.stem) && !/[gq]u$/.test(this.stem);

    this.change = plain || this.irr.presente ? null : stemChangeOf(infinitive);

    const scope = CHANGE_SCOPE[this.change];
    const [from, to] = scope ? this.change.split(':')[0].split('→') : [];
    const shifted = scope ? shiftStem(this.stem, from, to) : this.stem;
    this.eu = scope && scope !== 'others' ? shifted : this.stem;
    this.others = scope && scope !== 'first' ? shifted : this.stem;
    this.conjStrong = scope && scope !== 'others' ? shifted : this.stem;
    this.conjWeak = scope === 'first' || scope === 'all' ? shifted : this.stem;
  }

  /**
   * Attach an ending to a stem, applying the spelling rules that depend on
   * the two of them meeting.
   *
   * A stressed i after a vowel is written í, so that it is not read as the
   * second half of a diphthong: saí, saíste, saímos, saíram, saía, saído.
   * It needs no accent where a u follows and takes it into a diphthong of
   * its own (saiu), or where l, m, n, r or z closes its syllable (sair,
   * sairmos, saindo). Every i-ending of the second and third conjugations
   * is stressed, so the test is purely one of spelling.
   */
  join(stem, ending) {
    let base = stem;
    const rule = this.ortho;
    if (rule && rule.before.includes(ending[0]) && base.endsWith(rule.from)) {
      base = base.slice(0, -rule.from.length) + rule.to;
    }
    if (this.hiatus && ending[0] === 'i' && !/^i(?:u$|[lmnrz](?![aeiouáéíóú]))/.test(ending)) {
      return `${base}í${ending.slice(1)}`;
    }
    return base + ending;
  }

  presente() {
    if (this.irr.presente) return withPrefix(this.irr.presente, this.prefix);
    const forms = this.endings.presente.map((ending, index) => {
      if (index === 0) return this.join(this.eu, ending);
      return this.join(index === 3 || index === 4 ? this.stem : this.others, ending);
    });
    if (!this.plain) this.applyPattern(forms);
    if (this.irr.presenteEu) forms[0] = this.prefix + this.irr.presenteEu;
    return forms;
  }

  /**
   * The present of the sub-patterns. None of them is a list: each covers
   * every verb with the ending, so the ending is all that is tested.
   */
  applyPattern(forms) {
    const { stem } = this;

    // -air and -uir say -is and -i where partir says -es and -e, and the two
    // vowels make one syllable, so no accent: sais, sai; atribuis, atribui.
    if (this.class === 'ir' && (this.hiatus || this.sounded)) {
      forms[1] = `${stem}is`;
      forms[2] = `${stem}i`;
    }

    // construir and destruir go one step further and open the vowel.
    if (this.change === 'u→ó') {
      const head = stem.slice(0, -1);
      forms[1] = `${head}óis`;
      forms[2] = `${head}ói`;
      forms[5] = `${head}oem`;
    }

    // -oer: the same i, and the acute that marks the open diphthong ói.
    if (this.class === 'er' && stem.endsWith('o')) {
      forms[1] = `${stem.slice(0, -1)}óis`;
      forms[2] = `${stem.slice(0, -1)}ói`;
    }

    // -azer and -uzir lose the final e of ele: faz, traz, jaz; conduz, traduz.
    if (/(?:azer|uzir)$/.test(this.infinitive)) forms[2] = stem;
  }

  /**
   * Built on the first person of the present, with the other conjugation's
   * vowel: falo → fale, como → coma. An irregular first person carries over
   * whole (faço → faça, tenho → tenha, vejo → veja); the spelling rules have
   * already been applied to it, so nothing is respelled a second time.
   */
  presenteConj() {
    if (this.irr.presenteConj) return withPrefix(this.irr.presenteConj, this.prefix);
    const endings = this.endings.conjuntivo;
    const first = this.irr.presente?.[0] ?? this.irr.presenteEu;
    if (first) {
      const stem = this.prefix + first.replace(/o$/, '');
      return endings.map((ending) => stem + ending);
    }
    return endings.map((ending, index) => (
      this.join(index === 3 || index === 4 ? this.conjWeak : this.conjStrong, ending)
    ));
  }

  imperfeito() {
    if (this.irr.imperfeito) return withPrefix(this.irr.imperfeito, this.prefix);
    return this.endings.imperfeito.map((ending) => this.join(this.stem, ending));
  }

  perfeito() {
    if (this.irr.perfeito) return withPrefix(this.irr.perfeito, this.prefix);
    return this.endings.perfeito.map((ending) => this.join(this.stem, ending));
  }

  /**
   * The mais-que-perfeito and the imperfeito and futuro do conjuntivo. A
   * regular verb has endings of its own for them; an irregular perfeito
   * hands over its third person plural, less -ram, and nós and vós stress
   * and accent the vowel that stem ends in: fizeram → fizera, fizéramos.
   */
  past(tense) {
    if (!this.irr.perfeito) return this.endings[tense].map((ending) => this.join(this.stem, ending));
    const stem = this.perfeito()[5].slice(0, -3);
    const accented = stem.slice(0, -1) + (STRONG_ACCENT[stem.at(-1)] ?? stem.at(-1));
    return STRONG[tense].map((ending, index) => (
      (tense !== 'conjFuturo' && (index === 3 || index === 4) ? accented : stem) + ending
    ));
  }

  /**
   * Regular whatever the verb, which is how it differs from the futuro do
   * conjuntivo it otherwise looks like: fazeres against fizeres. pôr writes
   * its circumflex only where the form is the bare infinitive.
   */
  infinitivoPessoal() {
    if (this.class !== 'or') return this.endings.conjFuturo.map((ending) => this.join(this.stem, ending));
    const forms = ['or', 'ores', 'or', 'ormos', 'ordes', 'orem'].map((ending) => this.stem + ending);
    forms[0] = this.infinitive;
    forms[2] = this.infinitive;
    return forms;
  }

  /** The infinitive, or its contracted form: dizer → dir-, fazer → far-, pôr → por-. */
  futuroStem() {
    if (this.irr.futuroStem) return this.prefix + this.irr.futuroStem;
    return this.infinitive.replace('ô', 'o');
  }

  gerundio() {
    if (this.irr.gerundio) return this.prefix + this.irr.gerundio;
    return this.stem + this.endings.gerundio;
  }

  /**
   * `shown` is what the table prints, both participles where a verb has two;
   * `withTer` is the one its compound tenses are built with.
   */
  participio() {
    const long = this.irr.participio
      ? this.prefix + this.irr.participio
      : this.join(this.stem, this.endings.participio);
    const short = this.plain ? null : SHORT_PARTICIPLES[this.infinitive];
    if (!short) return { shown: long, withTer: long };
    return { shown: `${long} / ${short}`, withTer: SHORT_WITH_TER.has(this.infinitive) ? short : long };
  }

  /** Shown on the card after the word "spelling". */
  spelling() {
    if (this.ortho) return `${this.ortho.from} → ${this.ortho.to}`;
    return this.hiatus ? 'i → í' : null;
  }
}

function compound(auxiliary, participle) {
  return row(auxiliary.map((form) => `${form} ${participle}`));
}

/** Weather verbs have no first or second person, and nobody to command. */
function blankDefective(table, persons) {
  if (!persons?.length) return;
  for (const mood of [...SHAPE.moods, 'infinitivo']) {
    for (const forms of Object.values(table[mood])) {
      for (const person of persons) forms[person] = null;
    }
  }
  for (const forms of Object.values(table.imperativo)) {
    for (const person of Object.keys(forms)) forms[person] = null;
  }
}

// --- the paradigm ----------------------------------------------------------

/**
 * Build the full paradigm for a verb.
 *
 * @param {string} input infinitive, with or without a reflexive -se
 * @param {{plain?: boolean}} options plain:true ignores the irregular data
 *        and the vowel alternations, which is how the page works out which
 *        cells are irregular. Spelling changes are kept, so they never count.
 * @returns {{ok: boolean, verb?: string, table?: object, error?: string}}
 */
export function conjugate(input, { plain = false } = {}) {
  const raw = normalizeVerb(input);
  if (!raw) return { ok: false, error: 'empty', input: raw };

  const pronominal = /.-se$/.test(raw);
  const infinitive = citation(pronominal ? raw.slice(0, -3) : raw);
  if (!classify(infinitive)) return { ok: false, error: 'not-an-infinitive', input: raw };

  const verb = new PortugueseVerb(infinitive, { plain });
  const heading = pronominal ? `${infinitive}-se` : infinitive;

  const presente = verb.presente();
  const conjuntivo = verb.presenteConj();
  const futuroStem = verb.futuroStem();
  const participio = verb.participio();
  const past = participio.withTer;

  const indicativo = {
    presente: row(presente),
    preteritoPerfeito: row(verb.perfeito()),
    preteritoImperfeito: row(verb.imperfeito()),
    maisQuePerfeito: row(verb.past('maisQuePerfeito')),
    futuro: row(FUTURO.map((ending) => futuroStem + ending)),
    condicional: row(CONDICIONAL.map((ending) => futuroStem + ending)),
    perfeitoComposto: compound(TER.presente, past),
    maisQuePerfeitoComposto: compound(TER.imperfeito, past),
    futuroComposto: compound(TER.futuro, past),
    condicionalComposto: compound(TER.condicional, past),
  };

  const conjuntivoTable = {
    presente: row(conjuntivo),
    imperfeito: row(verb.past('conjImperfeito')),
    futuro: row(verb.past('conjFuturo')),
    perfeito: compound(TER.conjuntivo, past),
    maisQuePerfeito: compound(TER.conjImperfeito, past),
    futuroComposto: compound(TER.conjFuturo, past),
  };

  // tu is the present's third person (fala, come, sobe, mantém) and vós its
  // own second person less the s (falai, comei, ide); the rest is the
  // conjuntivo, as is the whole negative.
  const not = (form) => (form ? `não ${form}` : null);
  const imperativo = {
    afirmativo: {
      tu: verb.irr.imperativo?.tu ?? presente[2],
      voce: conjuntivo[2],
      nos: conjuntivo[3],
      vos: verb.irr.imperativo?.vos ?? presente[4].replace(/s$/, ''),
      voces: conjuntivo[5],
    },
    negativo: {
      tu: not(conjuntivo[1]),
      voce: not(conjuntivo[2]),
      nos: not(conjuntivo[3]),
      vos: not(conjuntivo[4]),
      voces: not(conjuntivo[5]),
    },
  };

  const table = {
    formas: {
      infinitivo: heading,
      gerundio: verb.gerundio(),
      participio: participio.shown,
      infinitivoComposto: `ter ${past}`,
      gerundioComposto: `tendo ${past}`,
    },
    indicativo,
    conjuntivo: conjuntivoTable,
    infinitivo: { pessoal: row(verb.infinitivoPessoal()) },
    imperativo,
  };

  blankDefective(table, verb.irr.defective);

  return {
    ok: true,
    verb: infinitive,
    input: heading,
    class: verb.class,
    stem: verb.stem,
    source: 'local',
    pronominal,
    auxiliary: null,
    flags: {
      irregular: Boolean(verb.base),
      stemChange: verb.change,
      ortho: verb.spelling(),
      derivedFrom: verb.prefix ? verb.base : null,
    },
    table,
  };
}

/**
 * Cells where a table differs from the naive regular conjugation — the forms
 * a learner actually has to remember. Keys read 'indicativo.presente.eu',
 * 'conjuntivo.futuro.eles', 'infinitivo.pessoal.tu', 'imperativo.afirmativo.tu'.
 */
export function irregularCells(infinitive, table = null) {
  const shown = table ?? conjugate(infinitive).table;
  const plain = conjugate(infinitive, { plain: true });
  const marks = new Set();
  if (!shown || !plain.ok) return marks;

  for (const mood of [...SHAPE.moods, 'infinitivo']) {
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
  // The infinitive is the heading, not a form: a reflexive shows its -se
  // there, and that is no irregularity.
  for (const [name, form] of Object.entries(shown.formas ?? {})) {
    if (name === 'infinitivo') continue;
    if (form && form !== plain.table.formas[name]) marks.add(`formas.${name}`);
  }
  return marks;
}
