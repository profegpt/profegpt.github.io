/**
 * The German dictionary.
 *
 * German has an authority — the Duden — and a fine scholarly dictionary in the
 * DWDS, but neither can be asked: the Duden publishes no API and does not
 * license its text for reuse, and the DWDS offers its entries for reading, not
 * for redistribution.
 *
 * So definitions come from the German Wiktionary, read as wikitext and
 * normalised into exactly the shape the Italian and French lookups return,
 * which is itself the shape the RAE route returns. The page and the tutor never
 * learn which dictionary answered.
 *
 * The German Wiktionary's markup is a third dialect, unlike the Wiktionnaire's
 * and the Wikizionario's both. A page is cut into languages by headings that
 * name the word again (`== Haus ({{Sprache|Deutsch}}) ==`), each language into
 * parts of speech (`=== {{Wortart|Substantiv|Deutsch}}, {{n}} ===`), and each
 * part of speech into text blocks opened by a template alone on a line —
 * `{{Bedeutungen}}`, `{{Herkunft}}`, `{{Synonyme}}` — whose lines are keyed to
 * the senses by number: `:[1] …`. Every part of speech is a complete entry
 * with its own numbering, etymology and synonyms, so *Bank* the bench and
 * *Bank* the bank never share a list.
 */

import { foldAccents } from './accents.js';
import { throttle, USER_AGENT } from './throttle.js';

const WIKTIONARY_DE = 'https://de.wiktionary.org/w/api.php';

/**
 * `{{Wortart|…|Deutsch}}` names → the categories the dictionary page knows.
 *
 * The names come from the wiki's own list (Hilfe:Wortart), not from guesswork.
 * It classifies more finely than the page does — eight kinds of pronoun, five
 * of adverb — so several names share a category.
 *
 * German grammar has one class the other sides of the site never needed: the
 * particle (*doch*, *ja*, *mal*, *nicht*). Calling those adverbs would be the
 * school grammar of a century ago, so they get a key of their own, `particle`.
 */
const PARTS_OF_SPEECH = {
  substantiv: 'noun',
  eigenname: 'proper noun',
  toponym: 'proper noun',
  nachname: 'proper noun',
  vorname: 'proper noun',
  straßenname: 'proper noun',
  bauwerksname: 'proper noun',
  markenname: 'proper noun',
  göttername: 'proper noun',
  verb: 'verb',
  hilfsverb: 'verb',
  modalverb: 'verb',
  partikelverb: 'verb',
  adjektiv: 'adjective',
  adverb: 'adverb',
  interrogativadverb: 'adverb',
  konjunktionaladverb: 'adverb',
  lokaladverb: 'adverb',
  modaladverb: 'adverb',
  pronominaladverb: 'adverb',
  temporaladverb: 'adverb',
  pronomen: 'pronoun',
  demonstrativpronomen: 'pronoun',
  indefinitpronomen: 'pronoun',
  interrogativpronomen: 'pronoun',
  personalpronomen: 'pronoun',
  possessivpronomen: 'pronoun',
  reflexivpronomen: 'pronoun',
  relativpronomen: 'pronoun',
  reziprokpronomen: 'pronoun',
  präposition: 'preposition',
  postposition: 'preposition',
  zirkumposition: 'preposition',
  konjunktion: 'conjunction',
  subjunktion: 'conjunction',
  interjektion: 'interjection',
  onomatopoetikum: 'interjection',
  artikel: 'article',
  numerale: 'numeral',
  kardinalzahl: 'numeral',
  ordinalzahl: 'numeral',
  bruchzahlwort: 'numeral',
  gattungszahlwort: 'numeral',
  kollektivzahlwort: 'numeral',
  vervielfältigungszahlwort: 'numeral',
  wiederholungszahlwort: 'numeral',
  kontraktion: 'contraction',
  partikel: 'particle',
  abtönungspartikel: 'particle',
  antwortpartikel: 'particle',
  fokuspartikel: 'particle',
  gradpartikel: 'particle',
  modalpartikel: 'particle',
  negationspartikel: 'particle',
  vergleichspartikel: 'particle',
  wortverbindung: 'expression',
  redewendung: 'expression',
  sprichwort: 'expression',
  grußformel: 'expression',
  formel: 'expression',
  'geflügeltes wort': 'expression',
  merkspruch: 'expression',
};

/** A name is a proper noun whatever else its heading says: `Substantiv, {{n}}, Toponym`. */
const PROPER = new Set(['eigenname', 'toponym', 'nachname', 'vorname', 'straßenname', 'bauwerksname',
  'markenname', 'göttername']);

/**
 * Headings that announce an inflected form rather than a word.
 *
 * The page for *ging* says only that it is the preterite of *gehen*. Such
 * entries are kept, as the Italian parser keeps `-verb form-`: someone who
 * looks up the form they met should be told what it is a form of. A declined
 * form does not say in its heading what it is a form of, so that is read from
 * the line itself ("… des Substantivs Haus").
 */
const FORMS = {
  'konjugierte form': 'verb',
  'erweiterter infinitiv': 'verb',
  partizip: 'verb',
  'partizip i': 'verb',
  'partizip ii': 'verb',
  'dekliniertes gerundivum': 'verb',
  komparativ: 'adjective',
  superlativ: 'adjective',
  'deklinierte form': '',
  'flektierte form': '',
};

/** "… des Substantivs Haus", "… des Adjektivs schön": what a declined form is a form of. */
const DECLINED = [
  [/\bSubstantivs\b/, 'noun'],
  [/\b(?:Adjektivs|Partizips|Gerundivums)\b/, 'adjective'],
  [/\bArtikels\b/, 'article'],
  [/pronomens\b/i, 'pronoun'],
  [/\b(?:Numerales?|Zahlworte?s|Kardinalzahl|Ordinalzahl)\b/, 'numeral'],
  [/\b(?:Eigennamens|Toponyms|Nachnamens|Vornamens)\b/, 'proper noun'],
];

/**
 * The gender templates of a heading, by the letters they carry.
 *
 * `{{m}}`, `{{f}}` and `{{n}}`, alone or several — *der* or *das Joghurt* is
 * `{{mn}}` on some pages and `{{m}}, {{n}}` on others — so the letters are
 * pooled and the pool is named. Two of the pools are specifically German:
 * a noun that is masculine or neuter, and one that is feminine or neuter.
 */
const GENDERS = {
  m: 'masculine',
  f: 'feminine',
  n: 'neuter',
  fm: 'masculine_and_feminine',
  mn: 'masculine_and_neuter',
  fn: 'feminine_and_neuter',
  fmn: 'ambiguous',
};

/**
 * The abbreviations the wiki's label templates expand — `{{K|ugs.|va.}}` prints
 * "umgangssprachlich, veraltet:" — copied from its own table (Vorlage:K/Abk)
 * rather than guessed, since *fig* and *fig.* are two different words there.
 * The same abbreviations exist as templates of their own (`{{ugs.|:}}`).
 */
const ABBREVIATIONS = {
  'abl.': 'mit Ablativ', ablativ: 'mit Ablativ', ae: 'US-amerikanisch', ame: 'US-amerikanisch',
  akkusativ: 'mit Akkusativ', ma: 'mit Akkusativ', 'abw.': 'abwertend', 'adv.': 'adverbial',
  'alemann.': 'alemannisch', 'allg.': 'allgemein', 'alltagsspr.': 'alltagssprachlich',
  'amtsspr.': 'amtssprachlich', 'attr.': 'attributiv', 'bar.': 'bairisch', 'bair.': 'bairisch',
  be: 'britisch', bre: 'britisch', 'bes.': 'besonders', 'bzw.': 'beziehungsweise',
  'bildungsspr.': 'bildungssprachlich', dativ: 'mit Dativ', md: 'mit Dativ',
  'dichter.': 'dichterisch', 'dim.': 'Diminutiv', 'dimin.': 'Diminutiv', 'euph.': 'euphemistisch',
  'fachspr.': 'fachsprachlich', 'fam.': 'familiär', fig: 'figürlich', 'fig.': 'figurativ',
  'geh.': 'gehoben', genitiv: 'mit Genitiv', mg: 'mit Genitiv', geographie: 'Geografie',
  'hist.': 'historisch', ies: 'im engeren Sinne', 'i.e.s.': 'im engeren Sinne',
  'i. e. s.': 'im engeren Sinne', 'indekl.': 'indeklinabel', 'intrans.': 'intransitiv',
  'iron.': 'ironisch', iws: 'im weiteren Sinne', 'i.w.s.': 'im weiteren Sinne',
  'i. w. s.': 'im weiteren Sinne', 'jugendspr.': 'jugendsprachlich',
  'kinderspr.': 'kindersprachlich', 'kpl.': 'kein Plural', 'ksg.': 'kein Singular',
  'kst.': 'keine Steigerung', 'kstg.': 'keine Steigerung', 'landsch.': 'landschaftlich',
  'lautm.': 'lautmalerisch', 'ling.': 'Linguistik', 'md.': 'mitteldeutsch',
  'mitteld.': 'mitteldeutsch', 'mdal.': 'mundartlich', 'mundartl.': 'mundartlich',
  'med.': 'Medizin', 'metaphor.': 'metaphorisch', 'meton.': 'metonymisch',
  'mlat.': 'mittellateinisch', 'nlat.': 'neulateinisch', 'nordd.': 'norddeutsch',
  'nordwestd.': 'nordwestdeutsch', 'npl.': 'nur Plural', 'österr.': 'österreichisch',
  'pej.': 'pejorativ', 'poet.': 'poetisch', plural: 'im Plural', ipl: 'im Plural',
  pmg: 'Präposition mit Genitiv', präpmg: 'Präposition mit Genitiv',
  pmd: 'Präposition mit Dativ', präpmd: 'Präposition mit Dativ', 'reg.': 'regional',
  'refl.': 'reflexiv', 'sal.': 'salopp', 'scherzh.': 'scherzhaft',
  'schriftspr.': 'schriftsprachlich', 'schülerspr.': 'schülersprachlich',
  'schwäb.': 'schwäbisch', 'schweiz.': 'schweizerisch', 'seemannsspr.': 'seemannssprachlich',
  'soldatenspr.': 'soldatensprachlich', 'sonderspr.': 'sondersprachlich',
  'spätlat.': 'spätlateinisch', 'südd.': 'süddeutsch', 'süddt.': 'süddeutsch',
  'techn.': 'technisch', 'tlwva.': 'veraltete Bedeutung', 'bedva.': 'veraltete Bedeutung',
  'tlwvatd.': 'veraltende Bedeutung', 'bedvatd.': 'veraltende Bedeutung',
  'trans.': 'transitiv', 'übertr.': 'übertragen', 'ugs.': 'umgangssprachlich',
  'unpers.': 'unpersönlich', 'ungebr.': 'ungebräuchlich', 'va.': 'veraltet',
  'vatd.': 'veraltend', 'verh.': 'verhüllend', 'volkst.': 'volkstümlich', 'vul.': 'vulgär',
  'vulg.': 'vulgär', 'vulgärlat.': 'vulgärlateinisch', 'vlat.': 'vulgärlateinisch',
  'wien.': 'wienerisch', wpräp: 'Wechselpräposition', 'z. b.': 'zum Beispiel',
  'z. t.': 'zum Teil',
};

/**
 * Labels that lean on the one after them. `{{K|bes.|südd.}}` prints "besonders
 * süddeutsch", not "besonders, süddeutsch": the template sets no comma after
 * these words (the list is the wiki's own, from the same table) nor before a
 * conjunction.
 */
const LEANING = new Set(['allgemein', 'ansonsten', 'auch', 'bei', 'besonders', 'beziehungsweise',
  'bis', 'bisweilen', 'das', 'der', 'die', 'eher', 'früher', 'häufig', 'hauptsächlich', 'im', 'in',
  'insbesondere', 'leicht', 'meist', 'meistens', 'mit', 'mitunter', 'noch', 'noch in', 'nur',
  'nur noch', 'oder', 'oft', 'oftmals', 'ohne', 'respektive', 'sehr', 'seltener', 'seltener auch',
  'sonst', 'sowie', 'später', 'speziell', 'teils', 'teilweise', 'über', 'überwiegend',
  'ursprünglich', 'und', 'von', 'vor allem', 'vor allem in', 'zum Beispiel', 'zum Teil', 'zumeist']);
const JOINING = new Set(['und', 'oder', 'sowie', 'bis', 'beziehungsweise', 'respektive']);

/**
 * Labels that say what kind of verb a sense is. They leave the usage line for
 * the verb-kind line, where the page shows them in the reader's own language.
 */
const VERB_LABELS = {
  transitiv: 'transitive',
  intransitiv: 'intransitive',
  reflexiv: 'reflexive',
  unpersönlich: 'impersonal',
};

/**
 * Labels that are not about usage at all. `{{K|sein}}` says which auxiliary
 * forms the perfect, and that belongs to the conjugation, which the site shows
 * elsewhere, rather than in a warning chip on eleven senses of *laufen*.
 */
const SILENT_LABELS = new Set(['sein', 'haben', 'Hilfsverb sein', 'Hilfsverb haben']);

/**
 * The language templates of an etymology. `{{gmh.}}` prints "mittelhochdeutsch"
 * and `{{lat.}}` "lateinisch", so the prose reads "von lateinisch via strata"
 * only if the name is put back. Without the full stop the same code prints the
 * language as a noun ("Latein").
 */
const SOURCE_LANGUAGES = {
  ahd: 'althochdeutsch', goh: 'althochdeutsch', mhd: 'mittelhochdeutsch', gmh: 'mittelhochdeutsch',
  fnhd: 'frühneuhochdeutsch', nhd: 'neuhochdeutsch', mnd: 'mittelniederdeutsch',
  gml: 'mittelniederdeutsch', mlg: 'mittelniederdeutsch', nds: 'niederdeutsch',
  dum: 'mittelniederländisch', odt: 'altniederländisch', nl: 'niederländisch',
  osx: 'altsächsisch', ang: 'altenglisch', enm: 'mittelenglisch', en: 'englisch',
  engl: 'englisch', non: 'altnordisch', got: 'gotisch', gem: 'germanisch',
  'gem-pro': 'urgermanisch', ine: 'indogermanisch', 'ine-pro': 'indogermanisch',
  la: 'lateinisch', lat: 'lateinisch', mlat: 'mittellateinisch', nlat: 'neulateinisch',
  spätlat: 'spätlateinisch', vlat: 'vulgärlateinisch', kirchenlat: 'kirchenlateinisch',
  grc: 'altgriechisch', el: 'griechisch', fr: 'französisch', frz: 'französisch',
  franz: 'französisch', fro: 'altfranzösisch', frm: 'mittelfranzösisch', it: 'italienisch',
  ital: 'italienisch', es: 'spanisch', span: 'spanisch', pt: 'portugiesisch', ca: 'katalanisch',
  oc: 'okzitanisch', ro: 'rumänisch', da: 'dänisch', sv: 'schwedisch', no: 'norwegisch',
  is: 'isländisch', fi: 'finnisch', hu: 'ungarisch', pl: 'polnisch', cs: 'tschechisch',
  sk: 'slowakisch', sl: 'slowenisch', hr: 'kroatisch', sr: 'serbisch', ru: 'russisch',
  uk: 'ukrainisch', bg: 'bulgarisch', tr: 'türkisch', ar: 'arabisch', he: 'hebräisch',
  yi: 'jiddisch', fa: 'persisch', hi: 'hindi', sa: 'sanskritisch', ja: 'japanisch',
  zh: 'chinesisch', ko: 'koreanisch', sla: 'slawisch', cel: 'keltisch', sga: 'altirisch',
  ga: 'irisch', cy: 'walisisch', lt: 'litauisch', lv: 'lettisch', ofs: 'altfriesisch',
  fy: 'friesisch', de: 'deutsch',
};

/** The few languages whose noun is not simply the adjective with a capital. */
const LANGUAGE_NOUNS = { lateinisch: 'Latein', hindi: 'Hindi', sanskritisch: 'Sanskrit' };

/**
 * Links into other namespaces — a thesaurus list, a category — which are
 * pointers for the wiki's reader and not words.
 */
const NAMESPACES = /^:?(?:Verzeichnis|Thesaurus|Wikisaurus|Kategorie|Hilfe|Wiktionary|Reim|Flexion|Anhang|Datei|Bild|File|Image)\s*:/i;

/** Sister-project prefixes, which point at an article but read as its title. */
const INTERWIKI = /^:?(?:w|wikipedia|s|q|b|v|n|commons|wikt)(?::[a-z-]{2,8})?:/i;

/**
 * The pages that only say "this is a spelling of that": the Swiss *Strasse*
 * for *Straße*, the pre-reform *daß* for *dass*.
 */
const SPELLING_OF = /\{\{\s*(?:Schweizer und Liechtensteiner Schreibweise|Alte Schreibweise|Lemmaverweis)\s*\|\s*([^|{}]+?)\s*[|}]/g;

/**
 * The verb particles and prefixes the wiki's own module (Modul:Verb) knows,
 * longest first, for `{{Verbherkunft}}`.
 *
 * The etymology of a prefixed verb is not written out on its page but
 * generated: `{{Verbherkunft|W=Partikel}}` on *anrufen* prints "gebildet aus
 * der Partikel an als Verbzusatz und dem Verb rufen", splitting the title at
 * the first prefix in this list. Prefixed verbs are a large part of the
 * vocabulary, so the module's common paths are followed here rather than
 * leaving every one of them without an origin.
 */
const VERB_PREFIXES = `aufwärts beiseite dahinter drauflos einwärts entgegen herunter hindurch hinunter vornüber
  vorwärts zunichte zusammen zwischen abwärts dagegen daneben darüber entlang entzwei fürlieb herüber hierher
  hinüber instand schwarz trocken überein vorüber zurecht zuwider bereit einher falsch fertig geheim gerade
  gleich herauf heraus herbei herein hervor hinauf hinaus hinein hintan hinter hinweg kaputt locker nieder
  runter sauber scharf schief schutz tiefer voraus vorbei vorher vorweg weiter wieder zugute zurück abhin
  anhin bauch bevor blond breit dabei dafür daher dahin daran davon davor dicht drauf drein durch empor flach
  flott fremd gegen glatt herab heran herum hinab hinan hinzu klein krank näher offen platt reich rüber schön
  still übrig umher umhin unter voran weich wider zuvor acht blau bloß dazu dort dran fehl feil fein fern fest
  fort frei gelb groß grün heim hier hoch kahl kalt klar kurz lieb leer mies miss nach nahe nass quer raus
  rein rück satt seil übel über voll wach wahr warm weis weiß wert wohl auf aus bei dar ein ent für gut her
  hin los mit out rum tot ver vor weg zer ab an be da de er ge re um zu`.split(/\s+/);

/** "dem Verb", "der Partikel": the article a word class takes in the generated prose. */
const FEMININE_CLASSES = new Set(['Partikel', 'Interjektion', 'Wortgruppe', 'Präposition']);

/**
 * The prose `{{Verbherkunft}}` generates, in its common forms.
 * @param {string} word  the page title, which the template splits
 * @param {string[]} args  the template's arguments: separability (`t` or `u`),
 *   `W=` the word class of the particle, `V=` the particle itself, `A=` the
 *   word derived from, `W2=`/`A2=` a second derivation
 */
function verbOrigin(word, args) {
  const named = {};
  const positional = [];
  for (const arg of args) {
    const pair = /^(\w+)\s*=([\s\S]*)$/.exec(arg);
    if (pair) named[pair[1]] = pair[2].trim();
    else positional.push(arg);
  }
  const lemma = positional[0] || named[1] || word;
  const separable = (positional[1] || named[2] || 't') !== 'u';
  let kind = named.W ?? '';
  const derivedFrom = named.A ?? '';

  let particle = named.V || VERB_PREFIXES.find((prefix) => lemma.startsWith(prefix)) || '';
  let verb = lemma.slice(particle.length);
  const of = (wordClass) => `${FEMININE_CLASSES.has(wordClass) ? 'der' : 'dem'} ${wordClass}`;

  if (separable) {
    if (lemma.includes(' ')) {
      const space = lemma.indexOf(' ');
      if (!particle) { particle = lemma.slice(0, space); verb = lemma.slice(space + 1); }
      kind = kind || (/^\p{Lu}/u.test(particle) ? 'Substantiv' : 'Adjektiv');
      return `Wortverbindung aus ${of(kind)} ${particle} und dem Verb ${verb}`;
    }
    if (kind === 'Präposition' || kind === 'Adverb') kind = 'Partikel';
    const head = kind ? `${of(kind)} ${particle} als Verbzusatz` : `dem Verbzusatz ${particle}`;
    const tail = named.W2 === 'Affix' ? `dem Affix -${verb}`
      : named.W2 ? `der Ableitung zum ${named.W2} ${derivedFrom} durch Konversion`
        : `dem Verb ${verb}`;
    return `gebildet aus ${head} und ${tail}`;
  }

  if (!named.V && derivedFrom) verb = lemma.slice(derivedFrom.length);
  const derivation = 'Derivation (Ableitung)';
  if (named.W2 && named.A2) {
    return `${derivation} zum ${named.W2} ${named.A2} durch Konversion mit dem Derivatem (Ableitungsmorphem) ${particle}-`;
  }
  const base = kind && derivedFrom
    ? `${kind === 'Interjektion' ? 'zur' : 'zum'} ${kind} ${derivedFrom}`
    : `zum Verb ${verb}`;
  if (!verb) return `${derivation} ${base} durch Konversion`;
  if (verb === 'en' || verb === 'n') return `${derivation} ${base} durch Konversion mit der Flexionsendung -${verb}`;
  const suffix = {
    eln: '-el und der Flexionsendung -n', ern: '-er und der Flexionsendung -n',
    ieren: '-ier und der Flexionsendung -en', isieren: '-isier und der Flexionsendung -en',
    ifizieren: '-ifizier und der Flexionsendung -en', igen: '-ig und der Flexionsendung -en',
  }[verb];
  return `${derivation} ${base} mit dem Derivatem (Ableitungsmorphem) ${suffix ?? `${particle}-`}`;
}

const ENTITIES = {
  nbsp: ' ', thinsp: ' ', ensp: ' ', emsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  shy: '', ndash: '–', mdash: '—', hellip: '…', prime: '′', times: '×',
};

// ---------------------------------------------------------------------------
// wikitext
// ---------------------------------------------------------------------------

/**
 * References and comments, removed before anything else is read.
 *
 * A German etymology is footnoted clause by clause, mostly with the short form
 * that points back at a named note: `hūs<ref name="Kluge"/> lautete …`. That
 * form has to go first. Tried the other way round, the pattern for a full
 * `<ref>…</ref>` takes the short one for an opening tag and swallows the prose
 * up to the next closing tag — half the sentence.
 */
function stripRefs(text) {
  return String(text)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<ref\b[^<>]*\/>/gi, '')
    .replace(/<ref\b[^<>]*>[\s\S]*?<\/ref>/gi, '')
    // One left open, because the line was cut or the note never closed.
    .replace(/<ref\b[^<>]*>[\s\S]*$/i, '');
}

/** What is left of the HTML: line breaks, `<sup>`, `<u>`, and the entities. */
function stripHtml(text) {
  return String(text)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^<>]+>/g, '')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

/**
 * Images, removed whole. A caption has links of its own, so the brackets are
 * counted rather than matched — the same scan as the Italian parser's.
 */
function stripFiles(text) {
  let out = String(text);
  const opener = /\[\[\s*(?:Datei|Bild|File|Image)\s*:/i;
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
 * `[[Ziel|Text]]` → Text, `[[Wort]]` → Wort, and emphasis dropped.
 *
 * German links carry more than the Italian ones do: a section anchor that
 * picks one homograph (`[[Pad#Substantiv, f|Pad]]`, or `[[weil#Subjunktion]]`
 * with no label at all), a sister project (`[[w:E. T. A. Hoffmann]]`), and
 * footnote-style web links in single brackets.
 */
function unlink(text) {
  return String(text)
    .replace(/\[(?:https?:)?\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1')
    .replace(/\[(?:https?:)?\/\/[^\s\]]+\]/g, '')
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, (_match, target, label) => (
      NAMESPACES.test(target.trim()) ? '' : label))
    .replace(/\[\[([^\]]+)\]\]/g, (_match, target) => (
      NAMESPACES.test(target.trim()) ? '' : target.replace(INTERWIKI, '').replace(/#.*$/, '')))
    // Bold and italic nest freely and are not always balanced, so the marks
    // are removed rather than matched.
    .replace(/'{2,}/g, '');
}

/**
 * Split a template's arguments, respecting the templates and links nested
 * inside it — `{{K|von [[Lebewesen|Tieren]]|ugs.}}` has two, not three.
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
    // German, like Italian, puts no space before a punctuation mark.
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/([,;:])\1+/g, '$1')
    .trim();
}

/**
 * The labels of one `{{K|…}}`, expanded and grouped the way the template
 * prints them: a comma between labels, except after a word that leans on the
 * next ("besonders süddeutsch") or before a conjunction.
 *
 * The named arguments are the template's own: `ft` is free text set after the
 * labels, `t1`…`t7` override the separator after a label (`_` for none), and
 * the rest (`spr`, `Prä`, `Kas`) only sort the page into categories.
 */
function contextLabels(args) {
  const named = {};
  const positional = [];
  for (const arg of args) {
    const pair = /^([\p{L}\d]+)\s*=([\s\S]*)$/u.exec(arg);
    if (pair) named[pair[1]] = pair[2].trim();
    else if (arg) positional.push(arg);
  }

  const groups = [];
  let joinNext = false;
  positional.forEach((raw, index) => {
    const label = ABBREVIATIONS[raw.toLowerCase()] ?? raw;
    if (joinNext || (groups.length && JOINING.has(label))) groups[groups.length - 1] += ` ${label}`;
    else groups.push(label);
    const separator = named[`t${index + 1}`];
    joinNext = separator === '_' || (separator === undefined && LEANING.has(label));
    if (separator && separator !== '_' && /[^\s,;:]/.test(separator)) {
      groups[groups.length - 1] += ` ${separator}`;
      joinNext = true;
    }
  });
  if (named.ft) {
    if (joinNext && groups.length) groups[groups.length - 1] += ` ${named.ft}`;
    else groups.push(named.ft);
  }
  return groups;
}

/** A label is opaque while templates unwind, then read back out of the text. */
const MARK = '\u0001';
const marked = (labels) => `${MARK}${labels.join('\u0002')}${MARK}`;

/**
 * What a template becomes in running text, wherever it stands.
 *
 * Labels — `{{K|…}}` and the abbreviation templates — come back marked rather
 * than printed, because what they are depends on where they turn out to
 * stand: at the head of a sense they are its usage, further in they are just
 * words of the sentence. `pullLabels` and `inline` settle that afterwards.
 * @param {string} word  the page title, which `{{Verbherkunft}}` splits
 */
function renderTemplate(name, args, word) {
  if (name === 'verbherkunft') return verbOrigin(word, args);

  // The template prints its labels and then a colon.
  if (name === 'k') return `${marked(contextLabels(args))}:`;

  // {{ugs.|:}} — the argument is the punctuation to print after the word.
  if (ABBREVIATIONS[name] && name.endsWith('.')) return marked([ABBREVIATIONS[name]]) + (args[0] ?? '');

  // {{gmh.}} → mittelhochdeutsch, {{la}} → Latein.
  const code = name.replace(/\.$/, '');
  if (SOURCE_LANGUAGES[code] && !/^[mfn]$/.test(code)) {
    const adjective = SOURCE_LANGUAGES[code];
    if (name.endsWith('.')) return adjective;
    return LANGUAGE_NOUNS[adjective] ?? adjective.charAt(0).toUpperCase() + adjective.slice(1);
  }

  // {{Ü|goh|hūs}} — a word of another language; {{Üt|grc|κεῦθος|keuthos}} adds
  // its transcription, which is the part a learner can read.
  if (name === 'ü' || name === 'ü?' || name === 'üxx') return args[1] ?? null;
  if (name === 'üt' || name === 'üt?') {
    const [, foreign, latin] = args;
    return foreign ? `${foreign}${latin ? ` (${latin})` : ''}` : null;
  }

  // Script wrappers and plain links: the text is the first argument.
  if (name === 'polytonisch' || name === 'arab' || name === 'hebr' || name === 'kyrl'
    || name === 'l' || name === 'noredlink' || name === 'farsi' || name === 'unicode') {
    return args[0] ?? null;
  }
  if (name === 'lang') return args[1] ?? null;
  if (name === 'wp' || name === 'w') return args[1] || args[0] || null;

  // Everything else — quality flags, references, grammar marks — says nothing
  // a reader of the definition needs.
  return null;
}

/**
 * Take the labels off the head of a line.
 *
 * Three spellings of the same thing are in use, often side by side:
 * `{{K|ugs.}}`, `{{ugs.|:}}`, and plain italics ending in a colon —
 * `''umgangssprachlich:''`. An italic prefix is only a label while it is
 * short; `''maskulines Possessivpronomen der 3. Person Singular – der Besitzer
 * ist grammatisch männlich:''` is part of the definition, and stays in it.
 *
 * @param {string} text  a line whose templates are already expanded
 */
function pullLabels(text) {
  const labels = [];
  let rest = String(text);

  for (;;) {
    rest = rest.replace(/^[\s:;,]+/, '');
    if (rest.startsWith(MARK)) {
      const end = rest.indexOf(MARK, 1);
      labels.push(...rest.slice(1, end).split('\u0002'));
      rest = rest.slice(end + 1);
      continue;
    }
    const italic = /^''(?!')((?:(?!'').)+?)(?::''|'':)/.exec(rest);
    if (italic && tidy(stripHtml(unlink(inline(italic[1])))).length <= 48) {
      labels.push(...italic[1].split(MARK).filter((part) => part.trim())
        .flatMap((part) => part.split('\u0002')));
      rest = rest.slice(italic[0].length);
      continue;
    }
    break;
  }

  return {
    labels: labels.map((label) => tidy(stripHtml(unlink(label))).replace(/[\s:;,]+$/, ''))
      .filter(Boolean),
    rest,
  };
}

/** Labels that were not at the head of anything read as the words they print. */
function inline(text) {
  return String(text).replace(/\u0001([^\u0001]*)\u0001/g, (_match, labels) => (
    labels.split('\u0002').join(', ')));
}

/** Prose with nothing of the markup left in it. */
function clean(text) {
  return tidy(stripHtml(unlink(inline(text))));
}

/** Expand a line's templates, with references and images already gone. */
function expand(line, word = '') {
  return expandTemplates(stripFiles(stripRefs(line)), (name, args) => renderTemplate(name, args, word));
}

/**
 * Clean a definition line, pulling its labels out as they go.
 * @returns {{description: string, usage: string, verbCategory: string}}
 */
function readDefinition(line) {
  const { labels, rest } = pullLabels(expand(line));

  const verbKinds = [];
  const usage = [];
  for (const label of labels) {
    if (VERB_LABELS[label]) verbKinds.push(VERB_LABELS[label]);
    else if (!SILENT_LABELS.has(label)) usage.push(label);
  }

  const description = clean(rest)
    .replace(/^[\s,.;:]+/, '')
    // A trailing colon introduced examples that are not shown here.
    .replace(/\s*[.:;,]$/, '')
    .trim();

  return {
    description,
    usage: [...new Set(usage)].join(', '),
    verbCategory: [...new Set(verbKinds)].join(', '),
  };
}

// ---------------------------------------------------------------------------
// the entry
// ---------------------------------------------------------------------------

/**
 * Everything under `== … ({{Sprache|Deutsch}}) ==`, and nothing from any other
 * language. *sein* is also a French noun on the same page and *der* a Dutch
 * article; a level-two heading for any other language ends the German.
 */
function germanSections(wikitext) {
  const headings = [...wikitext.matchAll(/^==(?!=)(.*?)==[ \t]*$/gm)];
  const sections = [];
  headings.forEach((heading, i) => {
    if (!/\{\{\s*Sprache\s*\|\s*Deutsch\s*\}\}/.test(heading[1])) return;
    sections.push(wikitext.slice(heading.index + heading[0].length,
      i + 1 < headings.length ? headings[i + 1].index : wikitext.length));
  });
  return sections;
}

/**
 * The text blocks of one part of speech, by name.
 *
 * A block is opened by a template alone on a line (`{{Bedeutungen}}`) and its
 * lines all begin with a colon or an asterisk, so it runs until a line that
 * begins with anything else that is not blank — the next block's template,
 * the multi-line inflection table, a deeper heading. A name can come twice
 * (`{{Anmerkung|zum Genus}}`, `{{Anmerkung|zum Plural}}`); the bodies are
 * joined.
 */
function blocks(body) {
  const found = new Map();
  let current = null;
  for (const line of body.split('\n')) {
    const opener = /^\{\{\s*([^{}|]+?)\s*(?:\|[^{}]*)?\}\}\s*$/.exec(line);
    if (opener && !/^QS /i.test(opener[1])) {
      current = opener[1].toLowerCase();
      if (!found.has(current)) found.set(current, []);
      continue;
    }
    if (/^[:*]/.test(line)) { if (current) found.get(current).push(line); continue; }
    if (line.trim() && !/^\{\{\s*QS /i.test(line)) current = null;
  }
  return found;
}

/**
 * The sense numbers a marker names: `[1]`, `[1, 2]`, `[1–3]`, `[3a]`.
 * `[*]` and `[?]` name none, which the caller reads as "the entry as a whole".
 */
function senseKeys(marker) {
  const keys = [];
  for (const part of marker.split(/[,;]/)) {
    const range = /^\s*(\d+)\s*[–—-]\s*(\d+)\s*$/.exec(part);
    if (range && Number(range[2]) - Number(range[1]) < 40) {
      for (let n = Number(range[1]); n <= Number(range[2]); n += 1) keys.push(String(n));
      continue;
    }
    const key = part.trim().toLowerCase();
    if (/^\d*[a-z]?$/.test(key) && key) keys.push(key);
  }
  return keys;
}

/** `:[1] text` → its depth, its marker and the text. A link (`:[[Wort]]`) is not a marker. */
function numbered(line) {
  const match = /^([:*]+)\s*(?:\[([^\[\]]{1,14})\])?\s*([\s\S]*)$/.exec(line);
  return { depth: match[1].length, marker: match[2] ?? null, text: match[3] };
}

/**
 * The senses under `{{Bedeutungen}}`.
 *
 * Three kinds of line: a sense (`:[1] …`); a sub-sense one level in
 * (`::[3a] speziell: …`), which is kept under its parent as a note rather than
 * numbered on, since it refines the sense instead of adding one; and a bullet
 * that groups the senses below it by a label they share — `*{{K|trans.}}`
 * means every sense until the next bullet is transitive, the way the
 * Wikizionario's `{{Transitivo}}` line does.
 */
function readSenses(lines, base) {
  const senses = [];
  let groupKind = base.verbCategory;
  let groupUsage = '';

  for (const line of lines) {
    const { depth, marker, text } = numbered(line);

    if (line.startsWith('*') && marker === null) {
      const { labels, rest } = pullLabels(expand(text));
      // Only a line that is all label is a group heading.
      if (!labels.length || clean(rest)) continue;
      const kinds = labels.filter((label) => VERB_LABELS[label]).map((label) => VERB_LABELS[label]);
      groupKind = kinds.join(', ') || base.verbCategory;
      groupUsage = labels.filter((label) => !VERB_LABELS[label] && !SILENT_LABELS.has(label)).join(', ');
      continue;
    }

    const { description, usage, verbCategory } = readDefinition(text);
    const key = marker === null ? '' : (senseKeys(marker)[0] ?? '');
    const parentKey = key.replace(/[a-z]$/, '');
    const parent = (depth > 1 || (key !== parentKey && senses.some((sense) => sense.key === parentKey)))
      ? (senses.find((sense) => sense.key === parentKey && parentKey) ?? senses[senses.length - 1])
      : null;

    if (parent) {
      if (!description) continue;
      const letter = /[a-z]$/.exec(key)?.[0];
      parent.usageNotes.push(`${letter ? `${letter}) ` : ''}${usage ? `${usage}: ` : ''}${description}`);
      continue;
    }

    senses.push({
      key,
      number: 0,
      category: base.category,
      verbCategory: verbCategory || groupKind,
      gender: base.gender,
      usage: [...new Set([groupUsage, usage].filter(Boolean).join(', ').split(', '))].join(', '),
      description,
      usageNotes: [],
      synonyms: [],
      antonyms: [],
    });
  }

  // A sense that is only a heading for its sub-senses reads as their sum.
  for (const sense of senses) {
    if (!sense.description && sense.usageNotes.length) {
      sense.description = sense.usageNotes.join('; ');
      sense.usageNotes = [];
    }
  }
  return senses.filter((sense) => sense.description.length >= 2);
}

/**
 * The lines under `{{Grammatische Merkmale}}`, which are the whole content of
 * an inflected form's entry: "1. Person Singular Indikativ Präteritum Aktiv
 * des Verbs gehen". An adjective's form can be twenty such lines — every case
 * and gender it happens to serve — and the reader needs to learn what word it
 * belongs to, not to be read the paradigm, so the list stops early.
 */
const FORM_LINES = 4;

function readForms(lines, base) {
  const descriptions = [];
  for (const line of lines) {
    const description = clean(expand(numbered(line).text)).replace(/\s*[.:;,]$/, '');
    if (description.length >= 2 && !descriptions.includes(description)) descriptions.push(description);
  }

  let { category } = base;
  if (!category) {
    const said = descriptions.join(' ');
    category = DECLINED.find(([pattern]) => pattern.test(said))?.[1] ?? '';
  }

  return descriptions.slice(0, FORM_LINES).map((description) => ({
    key: '',
    number: 0,
    category,
    verbCategory: '',
    // The gender on a form's heading, where there is one, is the gender of
    // that form, not of the word; it is left off rather than misread.
    gender: '',
    usage: '',
    description,
    usageNotes: [],
    synonyms: [],
    antonyms: [],
  }));
}

/**
 * Synonym or antonym lines, each with the senses it is for.
 *
 * `:[1, 2] ''landschaftlich:'' [[fratzen]], [[präpeln]]; ''salopp:'' [[futtern]]`
 * — the marker names the senses, and the italic qualifiers say in which
 * register each run of words is a synonym; they are not words themselves. A
 * word under a qualifier is remembered as such, so that the plain ones can be
 * offered first: *Haus* lists the slang (*Affenkasten*, *Kasten*) before
 * *Wohnhaus*, and a learner is better served the other way round.
 *
 * @returns {Array<{keys: string[], words: Array<{word: string, qualified: boolean}>}>}
 */
function readList(lines) {
  const lists = [];
  for (const line of lines) {
    const { marker, text } = numbered(line);

    let rest = stripFiles(stripRefs(text))
      // ''veraltet:'' or ''veraltet'': — a qualifier; other italics are words.
      .replace(/''(?!')(?:(?!'').)*?(?::''|'':)/g, ' \u0003 ')
      .replace(/\{\{[^{}|]*\|:\}\}/g, ' \u0003 ')
      .replace(/\{\{\s*K\s*\|[^{}]*\}\}/gi, ' \u0003 ');
    rest = expandTemplates(rest, (name, args) => (
      name === 'ü' || name === 'üt' ? renderTemplate(name, args) : null));
    rest = stripHtml(unlink(rest))
      .replace(/\([^()]*\)/g, ' ')
      // and one left open runs to the end of the line.
      .replace(/\([^)]*$/, '');

    const words = [];
    // A qualifier holds to the end of its run, which a semicolon closes.
    for (const run of rest.split(';')) {
      const qualifiedFrom = run.indexOf('\u0003');
      run.split(/[,/\u0003]/).forEach((piece) => {
        const at = run.indexOf(piece);
        const word = piece
          // "Singular: dieser" — a qualifier typed without its italics.
          .slice(piece.lastIndexOf(':') + 1)
          .replace(/\s+(?:und|oder) (?:weitere|andere|ähnliche)\b.*$/, '')
          .replace(/\s+/g, ' ').trim()
          .replace(/^[-–—]\s+/, '').replace(/^[„“”"‚‘«»]+|[„“”"‚‘«»]+$/g, '').replace(/[.?!…]+$/, '').trim();
        if (!word || word.length >= 40 || !/\p{L}/u.test(word)) return;
        if (/^(?:siehe|vergleiche|vgl|auch|und|oder|etc|usw)\b/i.test(word)) return;
        words.push({ word, qualified: qualifiedFrom >= 0 && at > qualifiedFrom });
      });
    }

    if (words.length) lists.push({ keys: marker === null ? [] : senseKeys(marker), words });
  }
  return lists;
}

/**
 * Hand each list to the senses its marker names. A line with no marker, or
 * with `[*]`, is for the word as a whole and goes to the first sense, as the
 * French and Italian lists do; a sub-sense's words (`[3a]`) go to its parent.
 * Plain words come before qualified ones, and eight is the limit, as elsewhere.
 */
function attachList(senses, lists, key) {
  if (!senses.length) return;
  const given = new Map();
  for (const { keys, words } of lists) {
    const targets = keys.length
      ? keys.map((wanted) => senses.find((sense) => sense.key === wanted)
        ?? senses.find((sense) => sense.key && sense.key === wanted.replace(/[a-z]$/, '')))
      : [senses[0]];
    for (const sense of new Set(targets)) {
      if (!sense) continue;
      if (!given.has(sense)) given.set(sense, []);
      given.get(sense).push(...words);
    }
  }
  for (const [sense, words] of given) {
    const ordered = [...words.filter((item) => !item.qualified), ...words.filter((item) => item.qualified)];
    sense[key] = [...new Set(ordered.map((item) => item.word))].slice(0, 8);
  }
}

/** Abbreviations whose full stop does not end a sentence. */
const NOT_A_SENTENCE = /(?:^|[\s(])(?:vgl|bzw|usw|etc|engl|lat|franz|ital|span|griech|urspr|sog|ca|Jh|Jhd|Chr|Nr|Bd|St)\.$/;

/**
 * Cut a long etymology at the end of a sentence where there is one, and at a
 * word otherwise. The German Wiktionary's etymologies run to a page for an old
 * word (*Haus*), and the entry has room for a few lines.
 */
function shorten(text, limit) {
  if (text.length <= limit) return text;
  const head = text.slice(0, limit);
  let end = -1;
  for (const match of head.matchAll(/[\p{Ll})“"‘«]{3}[.!?](?=\s+[\p{Lu}„»"‚])/gu)) {
    const stop = match.index + match[0].length;
    if (!NOT_A_SENTENCE.test(head.slice(0, stop))) end = stop;
  }
  if (end >= 60) return head.slice(0, end);
  return `${head.slice(0, head.lastIndexOf(' ')).replace(/[\s,;:(–-]+$/, '')} …`;
}

/**
 * The etymology under `{{Herkunft}}`.
 *
 * Plain lines are the account of the word; a line with a marker (`:[3] …`) is
 * about one sense only, and is used when there is nothing else. Indented
 * bullets are lists of cognates, which are left out.
 */
function readOrigin(lines, word) {
  const plain = [];
  const keyed = [];
  for (const line of lines) {
    const { depth, marker, text } = numbered(line);
    if (depth > 1 || line.startsWith('*')) continue;
    const prose = clean(expand(text, word));
    // "siehe oben" points at another entry's etymology and says nothing here;
    // "siehe kennen", on *können*, says where to look and is kept.
    if (prose.length < 3 || /^siehe\b.*\boben\b/i.test(prose)) continue;
    (marker === null ? plain : keyed).push(prose);
  }

  const parts = plain.length ? plain : keyed.slice(0, 1);
  let origin = '';
  for (const part of parts) {
    if (origin.length > 300) break;
    origin += `${origin ? (/[.!?…:;]$/.test(origin) ? ' ' : '; ') : ''}${part}`;
  }
  return shorten(origin, 300);
}

/** The gender a heading declares, or failing that the inflection table's `Genus=`. */
function readGender(heading, body) {
  let letters = [...heading.matchAll(/\{\{\s*([mfn]{1,3})\.?\s*\}\}/g)].map((match) => match[1]).join('');
  if (!letters) {
    letters = [...body.slice(0, 600).matchAll(/^\|\s*Genus(?:\s*\d)?\s*=\s*([mfn])\s*$/gm)]
      .map((match) => match[1]).join('');
  }
  return GENDERS[[...new Set(letters)].sort().join('')] ?? '';
}

/**
 * One part of speech: its heading and everything down to the next one.
 * @param {string} word  the page title
 * @returns {{category: string, gender: string, senses: object[], origin: string, form: boolean}|null}
 */
function readPartOfSpeech(heading, body, word) {
  const names = [...heading.matchAll(/\{\{\s*Wortart\s*\|\s*([^|{}]+?)\s*\|\s*Deutsch\s*\}\}/g)]
    .map((match) => match[1].replace(/‎/g, '').trim().toLowerCase());
  if (!names.length) return null;

  const proper = names.some((name) => PROPER.has(name));
  const known = names.find((name) => PARTS_OF_SPEECH[name]);
  const category = proper ? 'proper noun' : (PARTS_OF_SPEECH[known] ?? '');
  const nominal = category === 'noun' || category === 'proper noun';

  // What the heading says of a verb holds for every sense that does not say
  // otherwise: `{{Wortart|Verb|Deutsch}}, {{unreg.}}, {{intrans.}}`. Not so
  // `{{Wortart|Hilfsverb|Deutsch}}`, which *sein* carries for one sense in four.
  const kinds = [];
  for (const [, mark] of heading.matchAll(/\{\{\s*((?:in)?trans|refl|unpers)\.\s*\}\}/g)) {
    kinds.push(VERB_LABELS[ABBREVIATIONS[`${mark}.`]]);
  }

  const parts = blocks(body);
  const base = {
    category,
    gender: nominal ? readGender(heading, body) : '',
    verbCategory: category === 'verb' ? kinds.join(', ') : '',
  };

  let senses = readSenses(parts.get('bedeutungen') ?? [], base);
  let form = false;
  if (!senses.length && parts.has('grammatische merkmale')) {
    const formOf = names.map((name) => FORMS[name]).find((value) => value !== undefined);
    senses = readForms(parts.get('grammatische merkmale'), { category: category || formOf || '' });
    form = true;
  }
  if (!senses.length) return null;

  // Near-synonyms ("Sinnverwandte Wörter") are a separate block here, where
  // the other wikis keep one list. A learner's dictionary means both by
  // "synonyms", so they follow the strict ones — and for words like *schnell*
  // or *Zeit*, which list nothing as a strict synonym, they are the list.
  attachList(senses, [
    ...readList(parts.get('synonyme') ?? []),
    ...readList(parts.get('sinnverwandte wörter') ?? []),
  ], 'synonyms');
  attachList(senses, readList(parts.get('gegenwörter') ?? []), 'antonyms');

  return {
    category: senses[0].category,
    gender: base.gender,
    senses,
    origin: form ? '' : readOrigin(parts.get('herkunft') ?? [], word),
    form,
  };
}

/**
 * Number the senses on across the page, as the other parsers do.
 *
 * The wiki starts each part of speech at [1] again, and its definitions point
 * at one another by number — *Haus* [3] is the part "eines unter [2]
 * beschriebenen Gebäudes" — so wherever a number changes, the pointers in the
 * text are moved with it.
 */
function renumber(entries) {
  let number = 0;
  for (const entry of entries) {
    const moved = new Map();
    for (const sense of entry.senses) {
      number += 1;
      sense.number = number;
      if (sense.key) moved.set(sense.key, number);
    }
    const shifted = [...moved].some(([key, to]) => key !== String(to));
    const point = (text) => text.replace(/\[(\d+[a-z]?(?:\s*[,–-]\s*\d+[a-z]?)*)\]/g, (_match, inner) => (
      `[${inner.replace(/\d+/g, (key) => moved.get(key) ?? key)}]`));
    for (const sense of entry.senses) {
      if (shifted) {
        sense.description = point(sense.description);
        sense.usageNotes = sense.usageNotes.map(point);
      }
      delete sense.key;
    }
  }
}

/**
 * The etymology and the entries — one per part of speech, each with its
 * numbered senses — of the German section of a page, or null if it has none.
 *
 * Two things ride along for the lookup, which has to choose between pages:
 * `formsOnly` says the page knows the word only as an inflected form of
 * another, and `spellingOf` lists the words the page says it is merely a
 * spelling of (*Strasse* → *Straße*).
 *
 * Exported for the tests, which feed it wikitext rather than the network.
 * @param {string} wikitext  the whole page
 * @param {string} word      the page title
 * @returns {{origin: string, entries: Array, formsOnly: boolean, spellingOf: string[]}|null}
 */
export function readGermanEntry(wikitext, word) {
  const sections = germanSections(String(wikitext ?? ''));
  if (!sections.length) return null;

  const read = [];
  const spellingOf = [];
  for (const section of sections) {
    for (const match of section.matchAll(SPELLING_OF)) {
      if (match[1] !== word && !spellingOf.includes(match[1])) spellingOf.push(match[1]);
    }

    const headings = [...section.matchAll(/^===(?!=)(.*?)===[ \t]*$/gm)];
    headings.forEach((heading, i) => {
      const body = section.slice(heading.index + heading[0].length,
        i + 1 < headings.length ? headings[i + 1].index : section.length);
      const part = readPartOfSpeech(heading[1], body, word);
      if (part) read.push(part);
    });
  }

  // One etymology for the page, as the route expects: that of the first part
  // of speech that gives one. Where a page holds two unrelated words — *Bank*
  // — it is the first word's, and the second goes without.
  const origin = read.find((part) => part.origin)?.origin ?? '';

  // Beside a word of its own, an inflected form is a footnote: *heute* is
  // the adverb, and also four forms of the verb *heuen*, which one line says.
  const formsOnly = read.length > 0 && read.every((part) => part.form);
  const entries = read.map(({ category, gender, senses, form }) => ({
    category, gender, senses: form && !formsOnly ? senses.slice(0, 1) : senses,
  }));
  renumber(entries);

  return {
    origin,
    entries,
    formsOnly,
    spellingOf,
  };
}

// ---------------------------------------------------------------------------
// lookup
// ---------------------------------------------------------------------------

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

async function wiki(params, attempt = 0) {
  const url = new URL(WIKTIONARY_DE);
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
      const error = new Error('Das Wörterbuch begrenzt gerade die Abfragen. Versuche es gleich noch einmal.');
      error.status = 429;
      throw error;
    }
  }

  if (!response.ok) throw new Error(`Das Wiktionary hat mit ${response.status} geantwortet`);
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

const capitalised = (word) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * The spellings to ask for at once.
 *
 * The route lowercases what was typed, and a German noun's page is titled
 * with its capital: "haus" is *Haus*. A page title is case-sensitive, so both
 * are asked for in the one request — and with them the spelling in which every
 * part of a hyphenated compound has its capital (*E-Mail*).
 */
function spellings(word) {
  const parts = word.replace(/(^|[-\s])(\p{Ll})/gu, (_match, before, letter) => before + letter.toUpperCase());
  // In a phrase the first word is usually the one without: *guten Morgen*.
  const phrase = word.includes(' ') ? word.charAt(0) + parts.slice(1) : word;
  return [...new Set([word, capitalised(word), parts, phrase])];
}

/**
 * Read several pages in one request, following redirects.
 * @returns {Promise<Array<{asked: string, title: string, entry: object}>>} in the order asked, pages
 *   without a German entry left out
 */
async function readPages(titles) {
  if (!titles.length) return [];
  const body = await wiki({
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    // As in the French and Italian lookups: a spelling variant or a form typed
    // with a straight apostrophe is a redirect, and the wiki resolves it if asked.
    redirects: '1',
    titles: titles.join('|'),
  });
  if (body?.error) throw new Error(body.error.info || 'Das Wiktionary hat die Anfrage abgelehnt.');

  const renamed = new Map();
  for (const step of [...(body?.query?.normalized ?? []), ...(body?.query?.redirects ?? [])]) {
    renamed.set(step.from, step.to);
  }
  const pages = new Map((body?.query?.pages ?? []).map((page) => [page.title, page]));

  const read = [];
  for (const asked of titles) {
    let title = asked;
    for (let hop = 0; hop < 3 && renamed.has(title); hop += 1) title = renamed.get(title);
    const wikitext = pages.get(title)?.revisions?.[0]?.slots?.main?.content;
    if (!wikitext || read.some((page) => page.title === title)) continue;
    // The page may exist with no German in it — "fur" is English and Latin —
    // and answering with that would be worse than not finding it.
    const entry = readGermanEntry(wikitext, title);
    if (entry && (entry.entries.length || entry.spellingOf.length)) read.push({ asked, title, entry });
  }
  return read;
}

/** The first page, in the order asked, that knows the word as a word of its own. */
const aWord = (pages) => pages.find((page) => page.entry.entries.length && !page.entry.formsOnly);
/** …or at least as a form of one. */
const anEntry = (pages) => pages.find((page) => page.entry.entries.length);

/** ä → ae, the transcription used where there is no umlaut key, and ß → ss. */
const transcribed = (text) => String(text ?? '').toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
const bare = (text) => foldAccents(text).replace(/ß/g, 'ss');

/**
 * Whether a title is the typed word with its umlauts and ß put back.
 *
 * The rule of server/accents.js — only the same word once folded — with the
 * two things its folding does not know. ß is not a diacritic, so "strasse"
 * never folded to *Straße*; and German has a second way of leaving an umlaut
 * off, the transcription: "maedchen" is *Mädchen* exactly as "madchen" is.
 */
function sameWord(typed, title) {
  if (title.toLowerCase() === typed.toLowerCase()) return false;
  const target = bare(typed);
  return bare(title) === target || foldAccents(transcribed(title)) === target;
}

/**
 * Spellings the typed word could be once its umlauts and ß are restored.
 *
 * Mostly this is the search's job, as on the other wikis. But the search ranks
 * by its own lights: asked for "konnen" it returns *Könnern*, *Könner* and six
 * inflected forms, and not *können*. So the likeliest restorations are also
 * simply built — one or two vowels umlauted, ss as ß, ae/oe/ue read as
 * transcriptions — and asked for along with whatever the search found. Every
 * one of them is the same word once folded, so none can turn the word typed
 * into a different one.
 */
function restorations(typed) {
  const word = typed.toLowerCase();
  const built = new Set();

  const digraphs = word.replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
  if (digraphs !== word) built.add(digraphs);

  const vowels = [...word].map((letter, i) => ('aou'.includes(letter) ? i : -1)).filter((i) => i >= 0);
  const umlaut = (text, i) => text.slice(0, i) + { a: 'ä', o: 'ö', u: 'ü' }[text[i]] + text.slice(i + 1);
  for (const i of vowels) built.add(umlaut(word, i));
  if (vowels.length <= 4) {
    for (const i of vowels) for (const j of vowels) if (i < j) built.add(umlaut(umlaut(word, i), j));
  }

  // ß for ss, on the word as typed and on each respelling of it.
  for (const spelling of [word, ...built]) {
    if (spelling.includes('ss')) built.add(spelling.replace(/ss/g, 'ß'));
  }
  return [...built].slice(0, 20);
}

async function searched(word) {
  try {
    const body = await wiki({
      action: 'query', list: 'search', srsearch: word, srlimit: '8', format: 'json',
    });
    return (body?.query?.search ?? []).map((hit) => hit.title).filter((title) => sameWord(word, title));
  } catch {
    return [];
  }
}

/**
 * Look a German word up.
 *
 * Which page answers, in order:
 *
 * 1. The word as typed or with its capital, whichever is a German word. Where
 *    both are — *essen* and *Essen*, *morgen* and *Morgen* — the one typed
 *    wins, which from the route means the lowercase one; the other is neither
 *    merged in nor mentioned. One page, the same every time, and the noun is a
 *    capital letter away in the wiki's own "see also".
 * 2. The word a page says it is only a spelling of: *Strasse* is the Swiss
 *    spelling of *Straße*, and the page says nothing else about it.
 * 3. A page that knows the word only as an inflected form (*ging*). It ranks
 *    below the first two so that "fliege" is the fly and not just a form of
 *    *fliegen*.
 * 4. Only when none of that found anything at all: the same word with its
 *    umlauts and ß restored — see `sameWord`.
 *
 * @returns {Promise<{found: boolean, word?: string, entries?: Array, origin?: string, suggestions?: string[], corrected?: {from: string, to: string}}>}
 */
export async function fetchWiktionaryDe(word) {
  const typed = String(word ?? '').trim();
  if (!typed) return { found: false, suggestions: [] };

  const answer = (page) => {
    const found = {
      found: true,
      word: page.title,
      origin: page.entry.origin,
      entries: page.entry.entries,
    };
    // Said only when a letter changed, not for a capital or a redirect: the
    // notice tells the reader their spelling lacked something.
    if (sameWord(typed, page.title)) found.corrected = { from: typed, to: page.title };
    return found;
  };

  const asTyped = await readPages(spellings(typed));
  const word1 = aWord(asTyped);
  if (word1) return answer(word1);

  // In the order of the pages that pointed, so that "grosse" is *große*, the
  // form of *groß* the lowercase page names, before *Große*, the noun the
  // capitalised one does.
  const pointed = [...new Set(asTyped.flatMap((page) => page.entry.spellingOf))].slice(0, 4);
  const word2 = anEntry(await readPages(pointed));
  if (word2) return answer(word2);

  const form = anEntry(asTyped);
  if (form) return answer(form);

  const candidates = [...await searched(typed), ...restorations(typed)];
  const restored = await readPages([...new Set(candidates.flatMap((candidate) => (
    // The spelling in the case that was typed first, so the rule of step 1
    // holds here too: "schoen" is *schön* before it is the surname *Schön*.
    candidate === capitalised(candidate) ? [candidate] : [candidate, capitalised(candidate)])))]
    .sort((a, b) => Number(a !== a.toLowerCase()) - Number(b !== b.toLowerCase()))
    .slice(0, 48));
  const word3 = aWord(restored) ?? anEntry(restored);
  if (word3) return answer(word3);

  return { found: false, suggestions: await suggestions(typed) };
}

export const WIKTIONARY_DE_CREDIT = {
  name: 'Wiktionary',
  url: 'https://de.wiktionary.org',
  licence: 'CC BY-SA',
};
