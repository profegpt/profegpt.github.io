/**
 * The Wikizionario's markup is read into the same shape as the French entry.
 * Fixtures are trimmed copies of real pages; nothing here touches the network.
 */
const { readItalianEntry } = await import('../server/dictionary-it.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const LEFTOVER = /\[\[|\]\]|\{\{|\}\}|''|File:|thumb/;
const everyText = (entry) => entry.entries.flatMap((item) => item.senses)
  .flatMap((sense) => [sense.description, sense.usage, ...sense.synonyms, ...sense.antonyms])
  .concat(entry.origin);

// --- casa: the headword numbered, the senses on #* -------------------------
const CASA = `{{Vedi|casă}}
== {{-it-}} ==
[[File:Old house.jpg|thumb|una  [[vecchia]] casa]]
{{-sost-|it}}
# {{Pn|w}} ''f sing'' {{Linkp|case}}
#* {{Term|architettura|it}} [[edificio]] [[costruito]] [[per]] [[essere]] utilizzato [[come]] [[abitazione]] [[File:Stone House.jpg|thumb|una casa in [[pietra]]]]
#** ''un mio amico ha acquistato una bella casa in montagna''
#* [[dimora]] di una [[persona]]
#** ''ti avviso che stasera torno a casa tardi''
#* {{Fig}} {{Term|industriale|it}} casa [[costruttrice]]
# {{Pn|q}}
{{Quote|Non può restare nascosta una città|[[q:Vangelo|Vangelo]]}}

{{-sill-}}
; cà | sa

{{-pron-}}
{{IPA|/ˈkasa/}}

{{-etim-}}
dal {{la}} ''[[casa#Latino|casa]]'', ossia "[[capanna]], casa rustica"

{{-sin-}}
* ''(casa in senso burocratico)'' [[stabile]]
* [[edificio]], (per es. palazzo d'abitazione
* {{Fig}} ''(ambiente domestico)'' [[focolare]], [[tetto]]

== {{-es-}} ==
{{-sost-|es}}
{{Pn}} ''f''
# [[casa]]
`;

let entry = readItalianEntry(CASA, 'casa');
ok('casa has one entry', entry?.entries.length === 1, JSON.stringify(entry?.entries));
ok('it is a feminine noun',
  entry.entries[0].category === 'noun' && entry.entries[0].gender === 'feminine',
  `${entry.entries[0].category} ${entry.entries[0].gender}`);
let senses = entry.entries[0].senses;
ok('the #* lines are its senses, the italic ones are not', senses.length === 3,
  senses.map((sense) => sense.description).join(' | '));
ok('an image caption inside a sense is removed whole',
  senses[0].description === 'edificio costruito per essere utilizzato come abitazione', senses[0].description);
ok('a {{Term}} label becomes the usage', senses[0].usage === 'architettura', senses[0].usage);
ok('{{Fig}} reads as figurato', senses[2].usage === 'figurato, industriale', senses[2].usage);
ok('the etymology names the language', entry.origin === 'dal latino casa, ossia "capanna, casa rustica"', entry.origin);
ok('synonyms drop their qualifiers', senses[0].synonyms.join(',') === 'stabile,edificio,focolare,tetto',
  senses[0].synonyms.join(','));
ok('no markup is left anywhere', !everyText(entry).some((text) => LEFTOVER.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));
ok('the Spanish section is not read', !senses.some((sense) => sense.description === 'casa'));

// --- mangiare: two parts of speech, a verb kind on its own line -----------
const MANGIARE = `== {{-it-}} ==
{{-sost-|it}}
{{Pn|q}} '' m inv''
# [[consumazione]] di [[cibi]] a [[mezzogiorno]] o a [[sera]]
# {{Est}} [[ogni]] [[cibo]] [[gustoso]]
#* ''oltre all'[[acqua]], il {{Pn}} è necessario''

{{-verb-|it}}
{{Transitivo|it}}
{{Pn|c}}
# [[nutrirsi]] di [[alimenti]] [[solidi]]
#* ''{{Pn}} lentamente può moderare l'appetito''
# {{Term|scacchi|it}} [[muovere]] un pezzo dove sta un altro, eliminandolo
# {{Fig}} {{Nodef|it}}

{{Intransitivo|it}}
{{Pn|c}}
# {{Term|raro|it}} fare {{Pn}} a qualcuno

{{-pron-}}
{{IPA|/manˈdʒare/}}

{{-etim-}}
dall'antico {{fr}} ''[[mangier]]'', dal {{la}} ''[[manducare]]''

{{-sin-}}
*'''(sostantivo)''' [[cibo]], [[pasto]]
*'''(verbo)'''  [[sfamarsi]], [[saziarsi]]
* [[pranzare]]
`;

entry = readItalianEntry(MANGIARE, 'mangiare');
ok('mangiare has a noun and a verb',
  entry.entries.map((item) => item.category).join(',') === 'noun,verb',
  entry.entries.map((item) => item.category).join(','));
ok('the noun is masculine', entry.entries[0].gender === 'masculine', entry.entries[0].gender);
ok('numbering runs on across entries',
  entry.entries[1].senses[0].number === 3, String(entry.entries[1].senses[0].number));
ok('{{Est}} reads as per estensione', entry.entries[0].senses[1].usage === 'per estensione');
const verb = entry.entries[1].senses;
ok('a placeholder sense is dropped', verb.length === 3, verb.map((sense) => sense.description).join(' | '));
ok('the verb kind applies to the senses below it',
  verb[0].verbCategory === 'transitive' && verb[1].verbCategory === 'transitive', verb[1].verbCategory);
ok('until the next verb kind', verb[2].verbCategory === 'intransitive', verb[2].verbCategory);
ok('{{Pn}} stands for the word', verb[2].description === 'fare mangiare a qualcuno', verb[2].description);
ok('a tagged synonym line goes to its part of speech',
  entry.entries[0].senses[0].synonyms.join(',') === 'cibo,pasto', entry.entries[0].senses[0].synonyms.join(','));
ok('and the tag holds for the lines after it',
  verb[0].synonyms.join(',') === 'sfamarsi,saziarsi,pranzare', verb[0].synonyms.join(','));
ok('several source languages are named',
  entry.origin === "dall'antico francese mangier, dal latino manducare", entry.origin);

// --- gender written in pieces, and the pronoun heading --------------------
entry = readItalianEntry(`== {{-it-}} ==
{{-agg-|it}}
{{It-decl-agg2|grand|e|i}}
{{Pn}} ''m'' e ''f sing''
#che supera la [[misura]] [[ordinaria]]
{{-pronome-|it}}
{{Pn}} {{1}} ''sing''
# la persona che parla
{{-pron-}}
{{IPA|/ˈgrande/}}
`, 'grande');
ok('"m e f" in pieces is both genders', entry.entries[0].gender === 'masculine_and_feminine', entry.entries[0].gender);
ok('{{-pronome-}} is the pronoun', entry.entries[1]?.category === 'pronoun', entry.entries[1]?.category);
ok('{{-pron-}} (pronunciation) opens no entry', entry.entries.length === 2);

// --- a page with no Italian -----------------------------------------------
ok('a page with no Italian section reads as nothing', readItalianEntry(`== {{-fr-}} ==
{{-sost-|fr}}
{{Pn}} ''f''
# [[casa]]
`, 'maison') === null);

ok('an Italian section with only placeholders has no entries',
  readItalianEntry(`== {{-it-}} ==
{{-verb-|it}}
{{Riflessivo|it}}
# {{Nodef|it}}
`, 'lavarsi').entries.length === 0);

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Wikizionario checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Wikizionario checks passed`);
