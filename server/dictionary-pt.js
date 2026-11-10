/**
 * The Portuguese dictionary.
 *
 * As with French and Italian, there is no authority that can be queried: the
 * Academia das Ciências de Lisboa publishes its dictionary as a website with no
 * API, and the commercial ones (Priberam, Infopédia, Michaelis) do not license
 * their text for reuse.
 *
 * So definitions come from the Wikcionário — the Portuguese Wiktionary — read
 * as wikitext and normalised into exactly the shape the Italian lookup returns,
 * which is the shape the RAE route returns. The page and the tutor never learn
 * which dictionary answered.
 *
 * The site teaches European Portuguese, but the Wikcionário is written by both
 * sides of the Atlantic and is taken as it is: a sense marked *Brasil* keeps
 * that label, which is exactly what a learner needs to be told about it. The
 * same goes for its markup, which comes in both spellings — *Sinônimos* and
 * *Sinónimos* are one heading here.
 *
 * The Wikcionário's markup is a third dialect, neither the Wiktionnaire's nor
 * the Wikizionario's: languages are level-one headings (`={{-pt-}}=`), parts of
 * speech are plain level-two headings (`==Substantivo==`), and grammar lives in
 * a `{{gramática|…}}` template on the headword line. Only the generic template
 * and link handling is shared with the other two parsers.
 */

import { accentedForm, foldAccents } from './accents.js';
import { throttle, USER_AGENT } from './throttle.js';

const WIKCIONARIO = 'https://pt.wiktionary.org/w/api.php';

/**
 * Part-of-speech headings → the categories the dictionary page knows.
 *
 * The keys are written without accents because every heading is folded before
 * it is looked up: that is what makes *Advérbio*, *Sinônimos* and *Sinónimos*
 * match whichever side of the Atlantic typed them.
 *
 * The *forma* headings are inflected forms — the page for *falamos* says it is
 * the first person plural of *falar* — and are kept, as the Italian parser
 * keeps the Wikizionario's `form` sections: someone who looks up the form they
 * met should be told what it is a form of.
 *
 * Abbreviations have no category the page can name, so they carry none rather
 * than a wrong one. Letters, symbols and affixes are not words and open no
 * entry at all.
 */
const PARTS_OF_SPEECH = {
  substantivo: 'noun',
  'substantivo comum': 'noun',
  'substantivo proprio': 'proper noun',
  'nome proprio': 'proper noun',
  antroponimo: 'proper noun',
  toponimo: 'proper noun',
  prenome: 'proper noun',
  sobrenome: 'proper noun',
  verbo: 'verb',
  participio: 'verb',
  gerundio: 'verb',
  adjetivo: 'adjective',
  adjectivo: 'adjective',
  adverbio: 'adverb',
  pronome: 'pronoun',
  preposicao: 'preposition',
  conjuncao: 'conjunction',
  interjeicao: 'interjection',
  artigo: 'article',
  determinante: 'determiner',
  numeral: 'numeral',
  contracao: 'contraction',
  locucao: 'expression',
  expressao: 'expression',
  frase: 'expression',
  fraseologia: 'expression',
  proverbio: 'expression',
  'forma verbal': 'verb',
  sigla: '',
  abreviatura: '',
  abreviacao: '',
  acronimo: '',
};

/**
 * Headings that begin with one of these are sub-kinds of it: *Pronome pessoal*,
 * *Numeral cardinal*, *Locução adverbial*, *Verbo auxiliar*.
 */
const HEADING_FAMILIES = [
  ['locucao', 'expression'], ['pronome', 'pronoun'], ['numeral', 'numeral'],
  ['artigo', 'article'], ['adverbio', 'adverb'], ['conjuncao', 'conjunction'],
  ['preposicao', 'preposition'], ['adjetivo', 'adjective'], ['verbo', 'verb'],
  ['substantivo', 'noun'],
];

/**
 * The codes `{{gramática|…}}` uses for a verb's kind, from the template's own
 * table (Predefinição:gramática/core) rather than from guesswork: `pred` is
 * *predicativo*, the Wikcionário's word for a linking verb, and `vb` is
 * *bitransitivo*, a verb with a direct and an indirect object at once.
 */
const VERB_CODES = {
  vi: ['intransitive'],
  intr: ['intransitive'],
  intrans: ['intransitive'],
  intran: ['intransitive'],
  vt: ['transitive'],
  trans: ['transitive'],
  tran: ['transitive'],
  vtd: ['transitive'],
  vti: ['indirect transitive'],
  vtdi: ['transitive', 'indirect transitive'],
  vb: ['transitive', 'indirect transitive'],
  bitr: ['transitive', 'indirect transitive'],
  bitrans: ['transitive', 'indirect transitive'],
  bitran: ['transitive', 'indirect transitive'],
  pron: ['pronominal'],
  vp: ['pronominal'],
  vpr: ['pronominal'],
  vpti: ['pronominal', 'indirect transitive'],
  refl: ['reflexive'],
  vr: ['reflexive'],
  aux: ['auxiliary'],
  impess: ['impersonal'],
  pred: ['copulative'],
};

/**
 * The same kinds written out in words, which is how older pages give them:
 * `{{oxítona|fa|lar}}, ''intransitivo e transitivo direto''`. Longest first, so
 * that *transitivo indireto* is not read as a plain *transitivo* — and the
 * lookbehind keeps *transitivo* from being found inside *intransitivo*.
 */
const VERB_WORDS = [
  [/(?<![a-z])transitivo direto e indireto|bitransitivo/g, ['transitive', 'indirect transitive']],
  [/(?<![a-z])transitivo indireto/g, ['indirect transitive']],
  [/(?<![a-z])transitivo direto/g, ['transitive']],
  [/intransitivo/g, ['intransitive']],
  [/(?<![a-z])transitivo/g, ['transitive']],
  [/pronominal/g, ['pronominal']],
  [/reflexivo/g, ['reflexive']],
  [/auxiliar/g, ['auxiliary']],
  [/impessoal/g, ['impersonal']],
  [/predicativo|copulativo|de ligacao/g, ['copulative']],
];

/**
 * Register and region labels the `{{escopo}}` template rewrites as it prints
 * them (Predefinição:escopo/núcleo). Most labels print as typed; these are the
 * ones where what is typed and what a reader sees differ, so the same label
 * does not turn up under two names — *Brasileirismo* on one page and *Brasil*
 * on the next.
 */
const SCOPE_ALIASES = {
  brasileirismo: 'Brasil',
  'portugues brasileiro': 'Brasil',
  lusitanismo: 'Portugal',
  'portugues lusitano': 'Portugal',
  mocambicanismo: 'Moçambique',
  angolano: 'Angola',
  galicia: 'Galiza',
  nordeste: 'Nordeste do Brasil',
  'regiao nordeste': 'Nordeste do Brasil',
  'regiao norte': 'Norte do Brasil',
  'regiao sul': 'Sul do Brasil',
  'regiao sudeste': 'Sudeste do Brasil',
  'regiao centro-oeste': 'Centro-Oeste do Brasil',
  'pouco usado': 'pouco comum',
  desuso: 'em desuso',
  conotativo: 'figurado',
  figurativo: 'figurado',
  'baixo calao': 'obsceno',
  chulo: 'obsceno',
  tabuismo: 'obsceno',
  dialetal: 'regionalismo',
  dialectal: 'regionalismo',
  regional: 'regionalismo',
};

/**
 * One-word place names, which keep their capital when a label is tidied.
 *
 * Editors type *Figurado* on one page and *figurado* on the next, so labels are
 * lowered to read alike — but *Brasil* and *Alentejo* are names. Names of more
 * than one word are recognised by the capital inside them (*Trás-os-Montes*,
 * *Rio de Janeiro*); these are the ones that offer no such clue.
 */
const PLACES = new Set(('Brasil Portugal Angola Moçambique Macau Galiza Timor Índia Açores Alentejo '
  + 'Algarve Minho Madeira Lisboa Porto Beira Beiras Douro Ribatejo Estremadura Coimbra Aveiro '
  + 'Bragança Leiria Setúbal Funchal Barroso Bairrada Gerês Amazônia Amazónia Acre Alagoas Amapá '
  + 'Amazonas Bahia Ceará Goiás Maranhão Pará Paraíba Paraná Pernambuco Piauí Rondônia Roraima '
  + 'Sergipe Tocantins Florianópolis Europa África Ásia América').split(' '));

/**
 * Language codes the etymology templates use, with the names the Wikcionário
 * prints for them. `{{etimo2|la|casa|pt}}` prints "Do latim casa." — the prose
 * around the template counts on the language being named where it stood.
 */
const SOURCE_LANGUAGES = {
  la: 'latim', 'lat-vul': 'latim vulgar', 'lat-med': 'latim medieval', 'lat-tar': 'latim tardio',
  'lat-cie': 'latim científico', grc: 'grego antigo', el: 'grego',
  'roa-gpm': 'galego-português medieval', 'roa-opt': 'galego-português antigo',
  gl: 'galego', es: 'espanhol', osp: 'espanhol medieval', ca: 'catalão', oc: 'occitano',
  pro: 'provençal antigo', fr: 'francês', fro: 'francês antigo', frm: 'francês médio',
  it: 'italiano', ro: 'romeno', en: 'inglês', ang: 'inglês antigo', enm: 'inglês médio',
  de: 'alemão', goh: 'alto alemão antigo', gmh: 'alto alemão médio', nl: 'holandês',
  got: 'gótico', frk: 'frâncico', non: 'nórdico antigo', 'gem-pro': 'protogermânico',
  ine: 'indo-europeu', 'ine-pro': 'protoindo-europeu', 'itc-pro': 'protoitálico',
  ar: 'árabe', he: 'hebraico', tr: 'turco', fa: 'persa', ru: 'russo', sa: 'sânscrito',
  hi: 'hindi', ja: 'japonês', zh: 'chinês', ms: 'malaio', ml: 'malaiala', tpn: 'tupi',
  tpw: 'tupi antigo', gn: 'guarani', kmb: 'quimbundo', kg: 'kikongo', umb: 'umbundo',
  yo: 'iorubá', pt: 'português',
};

/**
 * Templates that only link a word, and print it: `{{l|pt|casa}}`,
 * `{{r|la|pono|pōnō}}`, `{{link idioma|Porto|pt}}`.
 */
const LINK_TEMPLATES = new Set(['l', 'll', 'r', 'fl', 'lig', 'link', 'ligação', 'link idioma', 'w', 'wp', 'lang']);

// ---------------------------------------------------------------------------
// wikitext
// ---------------------------------------------------------------------------

const ENTITIES = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', ldquo: '“', rdquo: '”',
  lsquo: '‘', rsquo: '’', laquo: '«', raquo: '»', mdash: '—', ndash: '–', hellip: '…',
};

/** `&ldquo;` and `&#8212;`, which editors type where the keyboard has no key. */
function decodeEntities(text) {
  return String(text)
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * References and formatting tags, which are markup rather than text.
 *
 * A superscript goes with its content — `bom<sup>1</sup>` points at another
 * sense, and "bom1" is not a word — and so does a formula, which has no plain
 * text form. A subscript stays: H<sub>2</sub>O reads well enough as H2O.
 */
function stripHtml(text) {
  return String(text)
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<(sup|math)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '');
}

/**
 * Images and categories, removed whole.
 *
 * A caption has links and templates of its own —
 * `[[Imagem:Casa.jpg|thumb|{{centro|Casa em [[pedra]]}}]]` — so a simple
 * `[[…]]` pattern stops at the first inner `]]` and leaves the rest of the
 * caption behind. Hence a scan that counts brackets.
 */
function stripFiles(text) {
  let out = String(text);
  const opener = /\[\[\s*(?:Imagem|Image|Ficheiro|Arquivo|File|Categoria|Category)\s*:/i;
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

/**
 * `[[destino|texto]]` → texto, `[[palavra]]` → palavra, and emphasis dropped.
 *
 * An unpiped link shows its target, but not all of it: `[[w:Eça de Queirós]]`
 * is a link to Wikipedia and `[[cor#latim]]` one to a section, and neither the
 * prefix nor the anchor is part of the word.
 */
function unlink(text) {
  return String(text)
    .replace(/\[\[([^\]|]*)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, (_match, target) => target
      .replace(/^:?(?:w|s|q|b|v|n|species|commons|wikisaurus|ap[êe]ndice)\s*:/i, '')
      .replace(/#.*$/, ''))
    // [https://… texto] shows its text; a bare [https://…] shows a number.
    .replace(/\[(?:https?:)?\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/\[(?:https?:)?\/\/[^\]\s]+\]/g, '')
    // Bold-italic, bold and italic nest freely ('''''Água''' do mármore'') and
    // are not always balanced, so the marks are removed rather than matched.
    .replace(/'{2,}/g, '');
}

/**
 * Split a template's arguments, respecting the templates and links nested
 * inside it — `{{etimo2|la|aqua|pt|transcr=aqua, -ae}}` has four.
 */
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
 * null for disappears.
 */
function expandTemplates(text, render) {
  let out = String(text);
  for (let pass = 0; pass < 8; pass += 1) {
    const next = out.replace(/\{\{([^{}]*)\}\}/g, (_match, body) => {
      const args = splitArgs(body);
      return render(args[0].toLowerCase().trim(), args.slice(1)) ?? '';
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
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    // Brackets left empty by a removed formula or label go first, so that the
    // comma after them is then pulled back against the word.
    .replace(/\(\s*\)/g, '')
    // Portuguese, like Italian, puts no space before any punctuation mark.
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A template's unnamed arguments: `id=pt` and `ponto=não` are settings. */
const positional = (args) => args.filter((arg) => arg && !/^[\wÀ-ÿ-]+\s*=/.test(arg));

/** The value of a named argument, or ''. */
function named(args, key) {
  const found = args.find((arg) => arg.startsWith(`${key}=`));
  return found ? found.slice(key.length + 1).trim() : '';
}

/** What a linking template prints: the word, without the language beside it. */
function linkText(name, args) {
  const parts = positional(args);
  // {{link idioma|Porto|pt}} and {{ll|sintagma|pt|sintagmas}}: the word comes
  // first and the language after it, then sometimes the form to show.
  if (name === 'link idioma') return parts[0] ?? null;
  if (name === 'll') return parts[2] || parts[0] || null;
  // {{w|Rio Tejo|Tejo}}: the article, then what to show.
  if (name === 'w' || name === 'wp') return parts[1] || parts[0] || null;
  // {{l|pt|casa}}, {{r|la|pono|pōnō}}: the language, the page, then what to show.
  return (parts.length > 1 ? parts[parts.length - 1] : parts[0]) ?? null;
}

/**
 * A label as the reader should see it.
 *
 * Lowered, so that *Figurado* and *figurado* are one label, unless it is a
 * name; and renamed where the Wikcionário itself renames it.
 */
function scopeName(raw) {
  const label = tidy(stripHtml(unlink(raw)));
  if (!label) return '';
  const alias = SCOPE_ALIASES[foldAccents(label)];
  if (alias) return alias;
  // A capital after the first letter is a name (Trás-os-Montes, São Paulo) or
  // an abbreviation (MG), and so is a word on the list of places.
  if (PLACES.has(label) || /^.+\p{Lu}/u.test(label)) return label;
  return label[0].toLowerCase() + label.slice(1);
}

/**
 * The labels inside one `{{escopo|pt|Brasil|informal}}` or
 * `{{escopo2|Brasil, coloquial}}`.
 *
 * `{{escopo}}` takes the language first and one label per argument;
 * `{{escopo2}}` takes no language and is often handed several labels in one
 * argument, separated by commas. The language is dropped only when something
 * follows it, because the old one-argument form — `{{escopo|Morfologia}}` — is
 * still in use.
 */
function scopeLabels(args) {
  const parts = positional(args);
  if (parts.length > 1 && /^[a-z]{2,3}(-[a-z]{2,4})?$/.test(parts[0])) parts.shift();
  return parts.flatMap((part) => part.split(/,|\s+-\s+/)).map(scopeName).filter(Boolean);
}

/** The verb kinds a piece of plain text names, in the order it names them. */
function verbKindsIn(text) {
  const folded = foldAccents(text);
  const taken = [];
  const found = [];
  for (const [pattern, kinds] of VERB_WORDS) {
    for (const match of folded.matchAll(pattern)) {
      const end = match.index + match[0].length;
      // "transitivo indireto" has already been read; do not read its first
      // word a second time as a plain "transitivo".
      if (taken.some(([from, to]) => match.index < to && end > from)) continue;
      taken.push([match.index, end]);
      found.push({ at: match.index, kinds });
    }
  }
  return found.sort((a, b) => a.at - b.at).flatMap((item) => item.kinds);
}

/**
 * Clean a definition line, pulling its labels out as they go.
 * @param {string} category  a label such as *transitivo* is a verb kind on a
 *   verb and a plain label anywhere else
 * @param {string} word      the headword, which `{{PAGENAME}}` stands for
 */
function readDefinition(line, category, word) {
  const labels = [];
  const verbKinds = [];

  const expanded = expandTemplates(stripFiles(line), (name, args) => {
    // Every template of the escopo family prints a label in brackets.
    if (name.startsWith('escopo')) {
      for (const label of scopeLabels(args)) {
        const kinds = category === 'verb' ? verbKindsIn(label) : [];
        if (kinds.length) verbKinds.push(...kinds);
        else labels.push(label);
      }
      return null;
    }
    if (name === 'pagename') return word;
    if (LINK_TEMPLATES.has(name)) return linkText(name, args);
    if (SOURCE_LANGUAGES[name] && !args.length) return SOURCE_LANGUAGES[name];
    // {{cont|9}} restarts the numbering, {{datação}} dates the word, and the
    // rest are citations and notes: none of it is part of the definition.
    return null;
  });

  const description = tidy(decodeEntities(stripHtml(unlink(expanded))))
    .replace(/^[\s,.;:]+/, '')
    // A trailing colon introduced examples that are not shown here.
    .replace(/\s*[.:;]$/, '')
    .trim();

  return {
    description,
    usage: [...new Set(labels)].join(', '),
    verbCategory: [...new Set(verbKinds)].join(', '),
  };
}

/** Gender from the codes `{{gramática}}` uses: `m`, `fs`, `c2g`, `m2n` … */
function genderOfCode(code) {
  if (/^m(?:s|sg|p|pl|2n|c2n|i|inv|d|du|-pt.*)?$/.test(code)) return 'masculine';
  if (/^f(?:s|sg|p|pl|2n|c2n|i|inv|d|du|-pt.*)?$/.test(code)) return 'feminine';
  // "comum aos dois géneros" — o estudante, a estudante.
  if (/^(?:mf(?:-pt.*)?|gc|c?2g(?:p|pl|s|sg|sp|2n|c2n)?|c(?:p|pl|s|sg|c2n))$/.test(code)) return 'masculine_and_feminine';
  if (/^n(?:s|sg|p|pl|2n|c2n|i|inv|d|du)?$/.test(code)) return 'neuter';
  return '';
}

/**
 * What a headword line says about the senses under it.
 *
 * `{{paroxítona|ca|sa}}, {{gramática|f}}, {{datação|1221|pt}}` — the syllable
 * template is the headword, and the grammar follows it: in `{{gramática|…}}`
 * (or its short form `{{g|…}}`, or `{{gênero|…}}`), in a bare `{{m}}` or
 * `{{c2g}}`, or written out in italics on older pages.
 *
 * `{{gramática|pr}}` is *próprio*: the Wikcionário files *Lisboa* under plain
 * `==Substantivo==`, and this code is the only thing that says it is a name.
 */
function readHeadword(line, category) {
  const codes = [];
  for (const match of String(line).matchAll(/\{\{([^{}]*)\}\}/g)) {
    const args = splitArgs(match[1]);
    const name = args[0].toLowerCase();
    if (name === 'gramática' || name === 'g' || name === 'gênero' || name === 'género') {
      codes.push(...positional(args.slice(1)).map((arg) => arg.toLowerCase()));
    } else if (args.length === 1 && genderOfCode(name)) {
      codes.push(name);
    }
  }

  // Bold is removed first: a headword in bold would otherwise read as italics.
  const italics = [...String(line).replace(/'''[^']*'''/g, '').matchAll(/''([^']+)''/g)]
    .map((match) => match[1]).join(' ').toLowerCase();
  const words = italics.split(/[^\p{L}]+/u);

  const genders = new Set(codes.map(genderOfCode).filter(Boolean));
  if (words.includes('m') || words.includes('masculino')) genders.add('masculine');
  if (words.includes('f') || words.includes('feminino')) genders.add('feminine');
  if (/dois g[êé]neros/.test(italics)) genders.add('masculine_and_feminine');

  let gender = '';
  if (genders.has('masculine_and_feminine') || (genders.has('masculine') && genders.has('feminine'))) {
    gender = 'masculine_and_feminine';
  } else {
    gender = [...genders][0] ?? '';
  }

  const verbKinds = category === 'verb'
    ? [...codes.flatMap((code) => VERB_CODES[code] ?? []), ...verbKindsIn(italics)]
    : [];

  return {
    gender,
    verbKind: [...new Set(verbKinds)].join(', '),
    proper: codes.some((code) => /^(?:pr|pr[oó]pr?)$/.test(code)),
  };
}

/** Lines between definitions that are furniture rather than a headword. */
const NOT_A_HEADWORD = /^\s*(?:\[\[|<!--|-{4}|\{\{\s*(?:flex|aviso|confundir|ver também|vertamb|dividir|colunas|tradini|wikip|commons|caracteres))/i;

// ---------------------------------------------------------------------------
// the entry
// ---------------------------------------------------------------------------

/** Everything under `={{-pt-}}=`, and nothing from any other language. */
function portugueseSection(wikitext) {
  const start = /^=\s*(?:\{\{-pt-\}\}|Português)\s*=[ \t]*$/m.exec(wikitext);
  if (!start) return null;
  const rest = wikitext.slice(start.index + start[0].length);
  // Any level-one heading ends it: on this wiki that is the next language.
  const end = /^=[^=]/m.exec(rest);
  return end ? rest.slice(0, end.index) : rest;
}

/**
 * A heading's name, in a form that can be looked up.
 *
 * The same heading is written `==Substantivo==`, `=={{Substantivo|pt}}==` and
 * `==Substantivo<sup>2</sup>==` (the second noun on a page with two), and the
 * synonyms heading may be `==={{PEPB|Sinónimos|Sinônimos|inline=1}}===`, a
 * template that picks the spelling by the reader's country. All of these come
 * down to one folded word.
 */
function headingName(raw) {
  let name = String(raw).replace(/<(sup|sub|small)[^>]*>[\s\S]*?<\/\1>/gi, '');
  const template = /\{\{([^{}]*)\}\}/.exec(name);
  if (template) {
    const args = splitArgs(template[1]);
    name = /^pepb$/i.test(args[0]) ? args[1] ?? '' : args[0];
  }
  return foldAccents(stripHtml(name))
    .replace(/[\s\d¹²³⁴⁵]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The category a heading opens, or undefined if it is not a part of speech. */
function categoryOf(name) {
  if (name in PARTS_OF_SPEECH) return PARTS_OF_SPEECH[name];
  // "Forma de substantivo", "Forma de locução substantiva": a form of whatever
  // the rest of the heading names.
  const form = /^forma de (.+)$/.exec(name);
  if (form) return categoryOf(form[1]);
  return HEADING_FAMILIES.find(([prefix]) => name.startsWith(`${prefix} `))?.[1];
}

/** The section cut at its headings, each piece named and levelled. */
function blocks(section) {
  const markers = [...section.matchAll(/^(={2,})\s*(.*?)\s*\1[ \t]*$/gm)];
  return markers.map((marker, i) => ({
    level: marker[1].length,
    name: headingName(marker[2]),
    body: section.slice(marker.index + marker[0].length,
      i + 1 < markers.length ? markers[i + 1].index : section.length),
  }));
}

/** No longer than the page has room for, and not cut in the middle of a word. */
function clip(text, limit) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > limit / 3) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

function readEtymology(body) {
  const render = (name, args) => {
    const parts = positional(args);
    // {{etimo2|la|casa|pt}} is a whole sentence: "Do latim casa."
    if (name === 'etimo2') {
      const language = SOURCE_LANGUAGES[parts[0]];
      const transcription = named(args, 'transcr') || parts[3] || '';
      const translation = named(args, 'trad') || parts[4] || '';
      const alternative = named(args, 'alt');
      return [
        language ? `Do ${language}` : 'De',
        ` ${parts[1] ?? ''}`,
        transcription ? ` (${transcription})` : '',
        translation ? ` “${translation}”` : '',
        alternative ? ` ou ${alternative}` : '',
        named(args, 'ponto') ? '' : '.',
      ].join('');
    }
    // {{etimo|la|esse}} is only the word; the prose around it names the language.
    // The gloss is `trad=`, or `sign=` (significado) on older pages — and now
    // and then a bare "sign" typed in its place, which is nobody's gloss.
    if (name === 'etimo' || name === 'llietimo') {
      const transcription = named(args, 'transcr') || parts[2] || '';
      const translation = named(args, 'trad') || named(args, 'sign') || parts[3] || '';
      return [
        parts[1] ?? '',
        transcription === 'sign' ? '' : transcription,
        translation && translation !== 'sign' ? `“${translation}”` : '',
      ].filter(Boolean).join(' ');
    }
    // {{étimo longo|id=pt|roa-opt|fazer|la|facere|itc-pro|*fakjō|tr3=fazer}} is
    // a whole chain, language and word by turns, each step with an optional
    // gloss (tr1, tr2 …) and alternative spelling (ou1, ou2 …).
    if (name === 'étimo longo') {
      const steps = [];
      for (let i = 0; i + 1 < parts.length; i += 2) {
        const step = i / 2 + 1;
        const language = SOURCE_LANGUAGES[parts[i]];
        const alternative = named(args, `ou${step}`);
        const gloss = named(args, `tr${step}`);
        steps.push([
          language ? `do ${language} ` : 'de ',
          parts[i + 1],
          alternative ? `, ${alternative}` : '',
          gloss ? ` (${gloss})` : '',
        ].join(''));
      }
      if (!steps.length) return null;
      const chain = steps.join(', ');
      return `${chain[0].toUpperCase()}${chain.slice(1)}${named(args, 'ponto') ? '' : '.'}`;
    }
    // {{etm|la|pt}} is only the language.
    if (name === 'etm') return SOURCE_LANGUAGES[parts[0]] ?? null;
    if (LINK_TEMPLATES.has(name)) return linkText(name, args);
    if (SOURCE_LANGUAGES[name] && !args.length) return SOURCE_LANGUAGES[name];
    // {{escopo|Morfologia}} labels the kind of account, {{datação}} dates the
    // word; neither is part of the account.
    return null;
  };

  // The first line that says something. Later lines list cognates, or give a
  // second account, and the first one will do. A short line ending in a colon
  // — "Para a conjunção:" — only announces the account on the next line.
  for (const raw of body.split('\n')) {
    const line = raw.trim().replace(/^[:*]+\s*/, '');
    if (!line || (line.endsWith(':') && line.length < 40)) continue;
    const text = tidy(decodeEntities(stripHtml(unlink(expandTemplates(stripFiles(line), render)))))
      // "Do latim casa." followed by more prose: the template's own full stop
      // lands in the middle of the sentence.
      .replace(/\.\s*([,;])/g, '$1')
      .replace(/\.(?:\s*\.)+/g, '.')
      .trim();
    if (/\p{L}{2}/u.test(text)) return clip(text, 300);
  }
  return '';
}

/**
 * Synonym or antonym lists, with the sense each one is for.
 *
 * Unlike the Wikizionario, the Wikcionário keeps these under the part of
 * speech they belong to, and says which sense they are for by its number:
 * either on the line — `* De '''3''' (estar): [[existir]], [[haver]]` — or on a
 * line of its own above the list — `De '''4''':`. The number is the one the
 * page shows, counted within that part of speech.
 *
 * @returns {Array<{ref: string|null, words: string[]}>}
 */
function readList(body) {
  const groups = [];
  let standing = null;

  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const marker = /^\*?\s*De\s+'{0,3}(\d+(?:\.\d+)?)'{0,3}[^:[\]]*:\s*/i.exec(line);

    // "De '''4''':" above a list holds for the lines that follow it.
    if (!line.startsWith('*')) {
      if (marker) standing = marker[1];
      continue;
    }
    // "Vide lista de sinônimos em Wikisaurus:muito" is a pointer, not a word.
    if (/wikisaurus|\bvide\b/i.test(line)) continue;

    let text = marker ? line.slice(marker[0].length) : line.replace(/^\*+\s*/, '');
    text = expandTemplates(stripFiles(text), (name, args) => (LINK_TEMPLATES.has(name) ? linkText(name, args) : null))
      .replace(/\([^)]*\)/g, '')
      // and one left open runs to the end of the line.
      .replace(/\([^)]*$/, '');

    // Commas separate the words, a slash a pair ([[pela]]/[[pelo]]), and the
    // last two are joined by "e" as often as by a comma.
    const words = decodeEntities(stripHtml(unlink(text))).split(/[,;/]|\.\s|\s+e\s+/)
      .map((word) => word.split(':')[0].replace(/\s+/g, ' ').trim().replace(/[.?!]+$/, '').trim())
      .filter((word) => word && word.length < 40 && /\p{L}/u.test(word));

    if (words.length) groups.push({ ref: marker ? marker[1] : standing, words });
  }
  return groups;
}

/** Hand each list to the sense it names, or to the first one if it names none. */
function attachList(entry, groups, key) {
  if (!entry?.senses.length) return;
  for (const { ref, words } of groups) {
    const sense = (ref && entry.numbered.get(ref)) || entry.senses[0];
    sense[key] = [...new Set([...sense[key], ...words])].slice(0, 8);
  }
}

/**
 * The senses under one part-of-speech heading.
 *
 * A heading can hold several headword lines, each with its own grammar and its
 * own run of senses — *ser* has one run of linking senses, one intransitive,
 * one indirect transitive — so the gender and verb kind are read again at each
 * headword line and hold until the next.
 *
 * Senses are on `#` lines and sub-senses on `##`; `#*` and `#:` are examples
 * and citations. The page's own numbers are kept beside ours (`numbered`),
 * because the synonym lists refer to senses by them: they restart at each
 * headword line unless `{{cont|9}}` says otherwise, and a sub-sense is "1.3".
 */
function readSenses(body, heading, word, startAt) {
  const senses = [];
  const numbered = new Map();
  let number = startAt;
  let category = heading;
  let gender = '';
  let verbKind = '';
  let entryGender = null;
  let local = 0;
  let sub = 0;
  let pending = [];

  for (const line of body.split('\n')) {
    const item = /^(#+)([*:]*)\s*(.*)$/.exec(line);

    if (!item) {
      if (line.trim() && !/^[*:;]/.test(line) && !NOT_A_HEADWORD.test(line)) pending.push(line);
      continue;
    }
    // An example or a citation.
    if (item[2]) continue;

    if (pending.length) {
      const headword = readHeadword(pending.join(' '), heading);
      pending = [];
      gender = headword.gender;
      verbKind = headword.verbKind;
      // {{gramática|pr}} under Substantivo or Locução substantiva is a name.
      category = headword.proper && (heading === 'noun' || heading === 'expression') ? 'proper noun' : heading;
      local = 0;
    }
    if (entryGender === null) entryGender = gender;

    let text = item[3];
    const restart = /^\{\{\s*cont\s*\|\s*(\d+)\s*\}\}\s*/i.exec(text);
    if (restart) {
      local = Number(restart[1]) - 1;
      text = text.slice(restart[0].length);
    }

    let label;
    if (item[1].length === 1) {
      local += 1;
      sub = 0;
      label = String(local);
    } else {
      sub += 1;
      label = `${local}.${sub}`;
    }

    const { description, usage, verbCategory } = readDefinition(text, heading, word);
    if (!description || description.length < 2) continue;
    number += 1;
    const sense = {
      number,
      category,
      verbCategory: verbCategory || verbKind,
      gender,
      usage,
      description,
      usageNotes: [],
      synonyms: [],
      antonyms: [],
    };
    senses.push(sense);
    if (!numbered.has(label)) numbered.set(label, sense);
  }

  return { gender: entryGender ?? '', senses, numbered };
}

/**
 * The etymology and the entries — one per part of speech, each with its
 * numbered senses — of the Portuguese section of a page, or null if it has
 * none.
 *
 * Exported for the tests, which feed it wikitext rather than the network.
 * @param {string} wikitext  the whole page
 * @param {string} word      the page title, which `{{PAGENAME}}` stands for
 */
export function readPortugueseEntry(wikitext, word) {
  const section = portugueseSection(String(wikitext ?? ''));
  if (section === null) return null;

  const found = [];
  let origin = '';
  let current = null;
  let number = 0;

  for (const block of blocks(section)) {
    const category = categoryOf(block.name);
    if (category !== undefined) {
      const { gender, senses, numbered } = readSenses(block.body, category, word, number);
      number += senses.length;
      current = { category: senses[0]?.category ?? category, gender, senses, numbered };
      found.push(current);
      continue;
    }

    // The etymology is usually one section for the whole page, now and then
    // one under a part of speech; the first that says something is kept.
    if (block.name === 'etimologia') {
      if (!origin) origin = readEtymology(block.body);
    } else if (block.name === 'sinonimos' || block.name === 'sinonimo') {
      attachList(current, readList(block.body), 'synonyms');
    } else if (block.name === 'antonimos' || block.name === 'antonimo') {
      attachList(current, readList(block.body), 'antonyms');
    }

    // A level-two heading that is not a part of speech — "Ver também",
    // "Anagramas" — closes the one before it, so that a list further down the
    // page is not taken for its synonyms.
    if (block.level === 2) current = null;
  }

  const entries = found.filter((entry) => entry.senses.length)
    .map(({ category, gender, senses }) => ({ category, gender, senses }));

  return { origin, entries };
}

// ---------------------------------------------------------------------------
// lookup
// ---------------------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

async function wiki(params, attempt = 0) {
  const url = new URL(WIKCIONARIO);
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
      const error = new Error('O dicionário está a limitar as consultas. Tente de novo dentro de instantes.');
      error.status = 429;
      throw error;
    }
  }

  if (!response.ok) throw new Error(`O Wikcionário respondeu ${response.status}`);
  return response.json();
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
 * The titles the search index offers for a word.
 *
 * The search index rather than opensearch, for the reason the French and
 * Italian lookups give: only the former folds accents and case, and both are
 * needed here.
 */
async function searchTitles(word) {
  try {
    const body = await wiki({
      action: 'query', list: 'search', srsearch: word, srlimit: '8', format: 'json',
    });
    return (body?.query?.search ?? []).map((hit) => hit.title);
  } catch {
    return [];
  }
}

/**
 * The page's Portuguese entry, or null if there is no such page or it holds no
 * Portuguese — "voce" is Italian on pt.wiktionary, and answering with that
 * would be worse than not finding it.
 */
async function readPage(title) {
  // redirects=1 for the same reason as the French and the Italian: a spelling
  // variant is a redirect on the wiki, and MediaWiki resolves it if asked.
  const body = await wiki({
    action: 'parse', page: title, prop: 'wikitext', redirects: '1',
  });

  if (body.error) {
    if (body.error.code === 'missingtitle' || body.error.code === 'nosuchpageid') return null;
    throw new Error(body.error.info || 'O Wikcionário recusou o pedido.');
  }

  const wikitext = body?.parse?.wikitext;
  if (!wikitext) return null;

  const found = body.parse.title || title;
  const entry = readPortugueseEntry(wikitext, found);
  if (!entry?.entries.length) return null;

  return {
    found: true,
    word: found,
    origin: entry.origin,
    entries: entry.entries,
  };
}

/**
 * Look a Portuguese word up.
 *
 * The word arrives in lower case, whatever was typed, so three spellings are
 * tried in turn and the first that has a Portuguese entry answers:
 *
 * 1. the word as typed;
 * 2. the same letters with capitals — *portugal* → *Portugal* — because a
 *    proper noun's page is titled with its capital and nothing else matches;
 * 3. the same word with its accents back — *acao* → *ação*, *voce* → *você*,
 *    *coracao* → *coração*. Portuguese marks stress, nasal vowels and the
 *    cedilla, and students type none of them.
 *
 * The third follows the narrow rule in server/accents.js: it runs only when
 * the word as typed was not found at all, so *e* and *esta* are never turned
 * into *é* and *está* — both are words, the first lookup succeeds, and nothing
 * else is tried.
 *
 * @returns {Promise<{found: boolean, word?: string, entries?: Array, origin?: string, suggestions?: string[], corrected?: {from: string, to: string}}>}
 */
export async function fetchWikcionario(word) {
  const typed = await readPage(word);
  if (typed) return typed;

  // One search answers both remaining questions: it folds case and accents
  // alike, so the capitalised title and the accented one come back together.
  const titles = (await searchTitles(word)).filter((title) => title !== word);

  const capitalised = titles.find((title) => title.toLowerCase() === word.toLowerCase());
  if (capitalised) {
    const second = await readPage(capitalised);
    if (second) return second;
  }

  // Among several accented spellings the search's own order decides, with a
  // lower-case title ahead of a capitalised one. Each is tried in turn rather
  // than only the first, because the first can be another language's word that
  // folds the same way: asked for "voce", the search offers Croatian *voće*
  // ahead of *você*. A candidate that has no Portuguese entry is passed over,
  // which is not a widening of the rule — every candidate is still the typed
  // word with its accents put back.
  const remaining = [
    ...titles.filter((title) => title === title.toLowerCase()),
    ...titles.filter((title) => title !== title.toLowerCase()),
  ];
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const accented = accentedForm(word, remaining);
    if (!accented) break;
    remaining.splice(remaining.indexOf(accented), 1);
    const second = await readPage(accented);
    if (second) return { ...second, corrected: { from: word, to: accented } };
  }

  return { found: false, suggestions: await suggestions(word) };
}

export const WIKCIONARIO_CREDIT = {
  name: 'Wikcionário',
  url: 'https://pt.wiktionary.org',
  licence: 'CC BY-SA',
};
