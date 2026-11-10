/**
 * The German Wiktionary's markup is read into the same shape as the Italian
 * entry. Fixtures are trimmed copies of real pages; nothing here touches the
 * network.
 */
const { readGermanEntry } = await import('../server/dictionary-de.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const LEFTOVER = /\[\[|\]\]|\{\{|\}\}|''|<ref|<\/|Datei:|\u0001|\u0002|\u0003|&nbsp;|^\s*\[\d/;
const everyText = (entry) => entry.entries.flatMap((item) => item.senses)
  .flatMap((sense) => [sense.description, sense.usage, ...sense.usageNotes, ...sense.synonyms, ...sense.antonyms])
  .concat(entry.origin);
const texts = (senses) => senses.map((sense) => sense.description).join(' | ');

// --- Haus: a noun, footnoted etymology, qualified synonyms, a form entry -----
const HAUS = `{{Siehe auch|[[haus]]}}
== Haus ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}}, {{n}} ===

{{Deutsch Substantiv Übersicht
|Genus=n
|Nominativ Singular=Haus
|Nominativ Plural=Häuser
|Bild 1=Leamouth riverside building 1.jpg|mini|1|ein ''Haus'' im [[modern]]en [[Baustil]]
}}

{{Worttrennung}}
:Haus, {{Pl.}} Häu·ser

{{Bedeutungen}}
:[1] zu einem bestimmten Zweck erbautes [[Gebäude]]
:[2] zum Wohnen dienendes und genutztes [[Gebäude]]
:[3] aus mehreren Räumen bestehender, abgetrennter Bereich innerhalb eines unter [2] beschriebenen Gebäudes, in dem sich eine oder mehrere Personen ständig aufhalten können, leben
:[4] {{K|ugs.}} Gesamtheit der Bewohner in dem unter [2] beschriebenen [[Gebäude]]
:[5] {{K|ugs.|va.|fachsprachlich|Zoologie}} bestimmte Tiere (vor allem [[Weichtier]]e wie [[Gastropode]]n) umgebende feste, panzerartige, schützende Umhüllung
:[6] {{K|Astrologie|fachsprachlich}} Tierkreiszeichen in seiner Zuordnung zu einem Planeten<ref name="DudenOnline">{{Ref-Duden}}</ref>
:[7] {{K|Curling|fachsprachlich}} die drei konzentrischen Kreise, in denen Punkte erzielt werden können<ref>{{Wikipedia|Glossary of curling|spr=en|oldid=671859113#H}}</ref>, die vom Kreis mit dem Radius von 6[[w:Fuß (Einheit)|′]] umschlossene Fläche<ref>{{Wikipedia|Curling|spr=de|oldid=146532355#Spielfeld}}</ref>

{{Herkunft}}
:Bei dem Wort handelt es sich um ein seit dem 8. Jahrhundert<ref name="Kluge">{{Lit-Kluge: Etymologisches Wörterbuch|A=24}}, Stichwort »Haus«, Seite 397.</ref><ref name="Pfeifer">{{Ref-Pfeifer}}</ref> bezeugtes [[Erbwort]], dessen [[althochdeutsch]]e Form ''{{Ü|goh|hūs}}''<ref name="Kluge"/><ref name="Pfeifer"/> lautete und sowohl das ‚[[Gebäude]]‘<ref name="Pfeifer"/> als auch die ‚[[Familie]]‘<ref name="Pfeifer"/> bezeichnete. Die entsprechende [[mittelhochdeutsch]]e Form lautete ebenfalls ''{{Ü|gmh|hūs}}''<ref name="Kluge"/><ref name="Pfeifer"/>.

{{Synonyme}}
:[1, 2] {{ugs.}}<ref name="Küpper">Alle nach {{Lit-Küpper: Lexikon der Umgangssprache|B=1 (Gesamtwerk)}}.</ref>'':'' [[Winde]]
:[1, 2] ''[[salopp]], [[abwertend]]:'' [[Affenkasten]]<ref name="Küpper"/>, [[Kasten]]<ref name="Küpper"/>
:[2] [[Wohnhaus]], [[Wohngebäude]]
:[3] [[Heim]], [[Wohnung]], [[Zuhause]]

{{Sinnverwandte Wörter}}
:[1–3] ''abwertend:'' [[Spelunke]]
:[2, 3] [[Bleibe]], [[Klause]], [[Logis]], [[Quartier]], [[Unterkunft]]
:[2, 3] {{ugs.|:}} [[Bude]], [[Dach über dem Kopf]], [[Unterbringung]]; ''abwertend:'' [[Affenstall]], [[Hundeloch]], [[Penne]]

{{Beispiele}}
:[1] In dem ''Haus'' wohnen wir seit zehn Jahren.

==== {{Übersetzungen}} ====
{{Ü-Tabelle|1|G=Gebäude|Ü-Liste=
*{{en}}: {{Ü|en|house}}
}}

{{Referenzen}}
:[1] {{Ref-DWDS}}

=== {{Wortart|Deklinierte Form|Deutsch}} ===

{{Grammatische Merkmale}}
*Genitiv Singular des Substantivs '''[[Hau]]'''

{{Grundformverweis Dekl|Hau}}

== Haus ({{Sprache|Niederländisch}}) ==
=== {{Wortart|Substantiv|Niederländisch}}, {{n}} ===

{{Bedeutungen}}
:[1] [[Haus]]
`;

let entry = readGermanEntry(HAUS, 'Haus');
ok('Haus is a neuter noun and then a declined form', entry?.entries.length === 2
  && entry.entries[0].category === 'noun' && entry.entries[0].gender === 'neuter',
  JSON.stringify(entry?.entries.map((item) => [item.category, item.gender])));
let senses = entry.entries[0].senses;
ok('seven senses are read and the translations are not', senses.length === 7, texts(senses));
ok('{{K|ugs.}} reads as umgangssprachlich', senses[3].usage === 'umgangssprachlich', senses[3].usage);
ok('several labels are expanded and joined',
  senses[4].usage === 'umgangssprachlich, veraltet, fachsprachlich, Zoologie', senses[4].usage);
ok('a reference in the middle of a sense is removed whole',
  senses[6].description === 'die drei konzentrischen Kreise, in denen Punkte erzielt werden können, die vom Kreis mit dem Radius von 6′ umschlossene Fläche',
  senses[6].description);
ok('a sense keeps its pointer at another sense', senses[2].description.includes('unter [2] beschriebenen'),
  senses[2].description);
ok('the leading marker is gone', !/^\[/.test(senses[0].description), senses[0].description);
ok('the etymology survives its footnotes, the short ones included',
  entry.origin === 'Bei dem Wort handelt es sich um ein seit dem 8. Jahrhundert bezeugtes Erbwort, dessen althochdeutsche Form hūs lautete und sowohl das ‚Gebäude‘ als auch die ‚Familie‘ bezeichnete. Die entsprechende mittelhochdeutsche Form lautete ebenfalls hūs.',
  entry.origin);
ok('plain synonyms come before register-qualified ones, near-synonyms after strict ones',
  senses[1].synonyms.join(',') === 'Wohnhaus,Wohngebäude,Bleibe,Klause,Logis,Quartier,Unterkunft,Winde',
  senses[1].synonyms.join(','));
ok('a qualifier is not a word', !senses[0].synonyms.includes('salopp') && senses[0].synonyms.includes('Affenkasten'),
  senses[0].synonyms.join(','));
ok('a range marker reaches every sense in it', senses[0].synonyms.includes('Spelunke') && senses[1].synonyms.length === 8,
  `${senses[0].synonyms} | ${senses[1].synonyms}`);
ok('the declined form says what it is a form of',
  entry.entries[1].senses[0].description === 'Genitiv Singular des Substantivs Hau'
  && entry.entries[1].category === 'noun' && entry.entries[1].senses[0].number === 8,
  JSON.stringify(entry.entries[1]));
ok('a page with a word of its own is not forms only', entry.formsOnly === false);
ok('the Dutch section is not read', !senses.some((sense) => sense.description === 'Haus'));
ok('no markup is left anywhere', !everyText(entry).some((text) => LEFTOVER.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));

// --- gehen: a verb kind on a group line, keyed antonyms, near-synonyms -----
const GEHEN = `== gehen ({{Sprache|Deutsch}}) ==
=== {{Wortart|Verb|Deutsch}}, {{unreg.}}, {{intrans.}} ===

{{Bedeutungen}}
*{{K|intrans.}}
:[1] sich [[schreiten]]d, schrittweise fortbewegen
:[2] in eine veränderte Lebenssituation eintreten
:[3] einen Ort oder eine Zusammenkunft verlassen
:[4] ''mit einem abhängigen Infinitiv eines Verbs:'' einen anderen Ort aufsuchen, um dort die mit dem anderen Verb beschriebene Handlung auszuführen
:[5] funktionieren / funktionsfähig sein

{{Herkunft}}
:[[mittelhochdeutsch]] ''{{Ü|gmh|gān}}, {{Ü|gmh|gēn}},'' [[althochdeutsch]] ''{{Ü|goh|gān}}, {{Ü|goh|gēn}},'' [[germanisch]] *''gæ-'' „gehen“, belegt seit dem 8. Jahrhundert<ref>{{Lit-Kluge: Etymologisches Wörterbuch|A=24}}, Stichwort: „gehen“, Seite 339.</ref>

{{Synonyme}}
:[3] [[abhauen]], [[abmarschieren]], [[aufbrechen]], [[weggehen]]
:[5] [[funktionieren]], [[intakt]] sein, [[laufen]]

{{Sinnverwandte Wörter}}
:[1] [[klabastern]], [[laufen]]

{{Gegenwörter}}
:[1] [[stehen]]; [[rennen]], [[schleichen]]; [[fahren]]
:[3] [[kommen]]; [[bleiben]], [[verweilen]]
:[5] [[kaputt]] sein
`;

entry = readGermanEntry(GEHEN, 'gehen');
senses = entry.entries[0].senses;
ok('a {{K|intrans.}} line applies to the senses below it',
  senses.length === 5 && senses.every((sense) => sense.verbCategory === 'intransitive'),
  senses.map((sense) => sense.verbCategory).join(','));
ok('a short italic prefix is the usage', senses[3].usage === 'mit einem abhängigen Infinitiv eines Verbs'
  && senses[3].description.startsWith('einen anderen Ort'), `${senses[3].usage} | ${senses[3].description}`);
ok('the etymology prints the {{Ü}} words',
  entry.origin === 'mittelhochdeutsch gān, gēn, althochdeutsch gān, gēn, germanisch *gæ- „gehen“, belegt seit dem 8. Jahrhundert',
  entry.origin);
ok('antonyms go to the sense their marker names',
  senses[0].antonyms.join(',') === 'stehen,rennen,schleichen,fahren' && senses[2].antonyms.join(',') === 'kommen,bleiben,verweilen',
  `${senses[0].antonyms} | ${senses[2].antonyms}`);
ok('near-synonyms stand in where there are no strict ones', senses[0].synonyms.join(',') === 'klabastern,laufen',
  senses[0].synonyms.join(','));
ok('a phrase stays whole', senses[4].synonyms.includes('intakt sein') && senses[4].antonyms.includes('kaputt sein'),
  senses[4].synonyms.join(','));

// --- übersetzen: two verbs, a sub-sense, a generated etymology ------------
const UEBERSETZEN = `== übersetzen ({{Sprache|Deutsch}}) ==
=== {{Wortart|Verb|Deutsch}}, untrennbar ===

{{Bedeutungen}}
:[1] {{K|trans.}} etwas in eine andere Sprache übertragen
:[2] {{K|trans.}} etwas über das übliche Maß hinaus besetzen
:[3] {{K|trans.|Technik}} die [[Lineargeschwindigkeit]], [[Rotationsgeschwindigkeit]], Kraft, das Drehmoment eines Antriebs transformieren
::[3a] ''speziell:'' wenn der [[nummerisch]]e Wert dabei größer wird

{{Herkunft}}
:{{Verbherkunft|2=u}}

{{Synonyme}}
:[1] [[kompilieren]], [[übertragen]], ([[verdolmetschen|ver-]])[[dolmetschen]]

{{Gegenwörter}}
:[3a] [[untersetzen]]

==== {{Übersetzungen}} ====

=== {{Wortart|Verb|Deutsch}}, trennbar ===

{{Bedeutungen}}
:[1] {{K|intrans.}} mit einer Fähre von einem Gewässerufer zum anderen fahren
:[2] {{K|trans.}} etwas oder jemanden von einem Gewässerufer zum anderen befördern

{{Herkunft}}
:{{Verbherkunft|W=Partikel}}

{{Synonyme}}
:[1] [[überholen#Verb, trennbar|überholen]], [[überqueren]]
:[1, 2] [[hinüberfahren]]
`;

entry = readGermanEntry(UEBERSETZEN, 'übersetzen');
ok('übersetzen has two verb entries', entry.entries.length === 2 && entry.entries.every((item) => item.category === 'verb'));
senses = entry.entries[0].senses;
ok('{{K|trans.}} is the verb kind, not the usage', senses[0].verbCategory === 'transitive' && senses[0].usage === '',
  `${senses[0].verbCategory} | ${senses[0].usage}`);
ok('a verb kind and a domain label part ways', senses[2].verbCategory === 'transitive' && senses[2].usage === 'Technik',
  `${senses[2].verbCategory} | ${senses[2].usage}`);
ok('a sub-sense is a note under its sense',
  senses.length === 3 && senses[2].usageNotes.join('|') === 'a) speziell: wenn der nummerische Wert dabei größer wird',
  JSON.stringify(senses[2].usageNotes));
ok("the sub-sense's antonym goes to its sense", senses[2].antonyms.join(',') === 'untersetzen', senses[2].antonyms.join(','));
ok('a parenthesised part of a synonym is dropped', senses[0].synonyms.join(',') === 'kompilieren,übertragen,dolmetschen',
  senses[0].synonyms.join(','));
ok('{{Verbherkunft}} is generated as the wiki generates it',
  entry.origin === 'Derivation (Ableitung) zum Verb setzen mit dem Derivatem (Ableitungsmorphem) über-', entry.origin);
const second = entry.entries[1].senses;
ok('numbering runs on across entries', second[0].number === 4 && second[1].number === 5,
  second.map((sense) => sense.number).join(','));
ok('a second entry keeps its own synonym numbering',
  second[0].synonyms.join(',') === 'überholen,überqueren,hinüberfahren' && second[1].synonyms.join(',') === 'hinüberfahren',
  `${second[0].synonyms} | ${second[1].synonyms}`);
ok('a separable verb gets the other generated account', readGermanEntry(`== anrufen ({{Sprache|Deutsch}}) ==
=== {{Wortart|Verb|Deutsch}}, ''unregelmäßig, trennbar'' ===
{{Bedeutungen}}
:[1] mit jemandem telefonisch in Verbindung treten
{{Herkunft}}
:{{Verbherkunft|W=Partikel}}
`, 'anrufen').origin === 'gebildet aus der Partikel an als Verbzusatz und dem Verb rufen');

// --- sein: Hilfsverb in the heading, a long italic prefix, French below ------
const SEIN = `== sein ({{Sprache|Deutsch}}) ==
=== {{Wortart|Verb|Deutsch}}, {{Wortart|Hilfsverb|Deutsch}} ===

{{Anmerkung|zur Verwendung}}
:Das Zeitwort ''sein'' wird als Hilfszeitwort zur Bildung zusammengesetzter Zeiten bestimmter Verben verwendet.

{{Bedeutungen}}
:[1] [[Kopula]], die dem Subjekt ein logisches Prädikat zuordnet
:[2] ''zusammen mit einer Ortsangabe:'' sich am genannten Ort [[befinden]]
:[3] ''[[Hilfszeitwort]] zur Bildung zusammengesetzter Zeiten bestimmter Verben''

{{Synonyme}}
:[2] sich [[befinden]], [[anwesend]] sein

=== {{Wortart|Possessivpronomen|Deutsch}} ===

{{Bedeutungen}}
:[1] ''maskulines Possessivpronomen der 3. Person Singular – der Besitzer ist grammatisch männlich:'' zu der genannten, grammatisch männlichen Person oder Sache [[gehörig]]

{{Synonyme}}
:[1, 2] ''umgangssprachlich:'' [[von]] [[ihm]]

{{Gegenwörter}}
:[1, 2] [[mein]], [[unser]], [[dein]], [[euer]], [[ihr]], [[Ihr]],

== sein ({{Sprache|Französisch}}) ==
=== {{Wortart|Substantiv|Französisch}}, {{m}} ===

{{Bedeutungen}}
:[1] ''veraltet oder literarisch:'' [[Brust]] als vorderer Oberkörper
`;

entry = readGermanEntry(SEIN, 'sein');
ok('sein is a verb and a pronoun, and not the French noun',
  entry.entries.map((item) => item.category).join(',') === 'verb,pronoun', entry.entries.map((item) => item.category).join(','));
ok('a Hilfsverb heading does not make every sense auxiliary',
  entry.entries[0].senses.every((sense) => sense.verbCategory === ''), entry.entries[0].senses.map((sense) => sense.verbCategory).join('|'));
ok('a sense written wholly in italics is read plain',
  entry.entries[0].senses[2].description === 'Hilfszeitwort zur Bildung zusammengesetzter Zeiten bestimmter Verben',
  entry.entries[0].senses[2].description);
ok('a long italic prefix stays in the definition',
  entry.entries[1].senses[0].usage === '' && entry.entries[1].senses[0].description.startsWith('maskulines Possessivpronomen'),
  `${entry.entries[1].senses[0].usage} | ${entry.entries[1].senses[0].description}`);
ok('a pronoun carries no gender', entry.entries[1].gender === '' && entry.entries[1].senses[0].gender === '');
ok('two linked words are one synonym, and the antonym list drops a trailing comma',
  entry.entries[1].senses[0].synonyms.join(',') === 'von ihm' && entry.entries[1].senses[0].antonyms.join(',') === 'mein,unser,dein,euer,ihr,Ihr',
  `${entry.entries[1].senses[0].synonyms} | ${entry.entries[1].senses[0].antonyms}`);

// --- Morgen: a place name, a {{K|…|kurz für}}, quoted synonyms, a list link ---
const MORGEN = `== Morgen ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}}, {{m}} ===

{{Bedeutungen}}
:[1] [[Tageszeit]] zwischen [[Nacht]] und [[Vormittag]]
:[2] {{K|ugs.|kurz für}} die morgendliche Begrüßung „Guten Morgen!“

{{Synonyme}}
:[1] [[Morgenstunde]], [[Morgenzeit]]
:[2] „[[guten Morgen]]!“, „[[moin]]!“, „[[moin, moin]]!“, ''siehe auch:'' [[Verzeichnis:Deutsch/Grüßen/Begrüßungsformeln|Begrüßungsformeln]]

=== {{Wortart|Substantiv|Deutsch}}, {{n}}, {{Wortart|Toponym|Deutsch}} ===

{{Bedeutungen}}
:[1] deutscher Name des polnischen Ortes [[w:Kumielsk|Kumielsk]] in den [[Masuren]]
`;

entry = readGermanEntry(MORGEN, 'Morgen');
ok('a Toponym is a proper noun, with its gender', entry.entries[1].category === 'proper noun' && entry.entries[1].gender === 'neuter',
  `${entry.entries[1].category} ${entry.entries[1].gender}`);
ok('"kurz für" leans on nothing and is kept as a label', entry.entries[0].senses[1].usage === 'umgangssprachlich, kurz für',
  entry.entries[0].senses[1].usage);
ok('quoted greetings become words, and a list link is no word',
  entry.entries[0].senses[1].synonyms.join(',') === 'guten Morgen,moin', entry.entries[0].senses[1].synonyms.join(','));
ok('a sister-project link reads as its label', entry.entries[1].senses[0].description === 'deutscher Name des polnischen Ortes Kumielsk in den Masuren',
  entry.entries[1].senses[0].description);

// --- genders written in pieces, and the inflection table as a fallback ------
ok('{{m}}, {{f}}, {{n}} together is ambiguous',
  readGermanEntry(`== Joghurt ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}}, {{m}}, {{f}}, {{n}} ===
{{Bedeutungen}}
:[1] Dickmilchprodukt, welches aus eingedickter, pasteurisierter Milch gewonnen wird
`, 'Joghurt').entries[0].gender === 'ambiguous');
ok('{{fn}} is feminine or neuter', readGermanEntry(`== E-Mail ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}}, {{fn}} ===
{{Bedeutungen}}
:[1] {{K|Internet|Telekommunikation}} [[elektronisch]]e [[Post]]
`, 'E-Mail').entries[0].gender === 'feminine_and_neuter');
ok('a heading without a gender falls back to the table', readGermanEntry(`== Fliege ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}} ===
{{Deutsch Substantiv Übersicht
|Genus=f
|Nominativ Singular=Fliege
}}
{{Bedeutungen}}
:[1] fliegendes [[Insekt]] der Unterordnung Fliegen
`, 'Fliege').entries[0].gender === 'feminine');

// --- forms, spellings, and pages with no German -----------------------------
entry = readGermanEntry(`== ging ({{Sprache|Deutsch}}) ==
=== {{Wortart|Konjugierte Form|Deutsch}} ===

{{Grammatische Merkmale}}
*1. Person Singular Indikativ Präteritum Aktiv des Verbs '''[[gehen]]'''
*3. Person Singular Indikativ Präteritum Aktiv des Verbs '''[[gehen]]'''

{{Grundformverweis Konj|gehen}}
`, 'ging');
ok('an inflected form is a verb entry that names its base', entry.formsOnly === true
  && entry.entries[0].category === 'verb'
  && texts(entry.entries[0].senses) === '1. Person Singular Indikativ Präteritum Aktiv des Verbs gehen | 3. Person Singular Indikativ Präteritum Aktiv des Verbs gehen',
  JSON.stringify(entry));

entry = readGermanEntry(`== Strasse ({{Sprache|Deutsch}}) ==
{{Schweizer und Liechtensteiner Schreibweise|Straße|Worttrennung=Stras·se}}

=== {{Wortart|Deklinierte Form|Deutsch}} ===

{{Grammatische Merkmale}}
*{{Dativ-e}} Dativ Singular des Substantivs '''[[Strass]]'''
*Nominativ Plural des Substantivs '''[[Strass]]'''

{{Grundformverweis Dekl|Strass}}
`, 'Strasse');
ok('the Swiss spelling points at the word it spells', entry.spellingOf.join(',') === 'Straße' && entry.formsOnly === true
  && entry.entries[0].senses[0].description === 'Dativ Singular des Substantivs Strass', JSON.stringify(entry));

entry = readGermanEntry(`== daß ({{Sprache|Deutsch}}) ==
{{Alte Schreibweise|dass|Reform 1996}}
`, 'daß');
ok('an old spelling has no entry of its own, only the word it points at',
  entry.entries.length === 0 && entry.spellingOf.join(',') === 'dass', JSON.stringify(entry));

ok('a page with no German section reads as nothing', readGermanEntry(`== fur ({{Sprache|Englisch}}) ==
=== {{Wortart|Substantiv|Englisch}} ===
{{Bedeutungen}}
:[1] [[Fell]], [[Pelz]]
`, 'fur') === null);

// --- a placeholder sense, and the pointers that move with the numbering -----
entry = readGermanEntry(`== Bank ({{Sprache|Deutsch}}) ==
=== {{Wortart|Substantiv|Deutsch}}, {{f}}, ''Bänke'' ===
{{Bedeutungen}}
:[1] {{QS Bedeutungen|fehlend}}
:[2] [[geologisch]]e [[Formation]]
:[3] [[Ablagerung]] von [[Material]] in einem [[Gewässer]], zur unter [2] beschriebenen Formation gehörend
{{Synonyme}}
:[2] [[Lage]]
`, 'Bank');
senses = entry.entries[0].senses;
ok('a placeholder sense is dropped and the rest renumbered', senses.length === 2 && senses[0].number === 1 && senses[1].number === 2,
  JSON.stringify(senses.map((sense) => [sense.number, sense.description])));
ok('a pointer at a sense moves with its number', senses[1].description.endsWith('unter [1] beschriebenen Formation gehörend'),
  senses[1].description);
ok('and the synonyms follow', senses[0].synonyms.join(',') === 'Lage', senses[0].synonyms.join(','));
ok('a sense qualifier is read from the italic heading', entry.entries[0].gender === 'feminine');

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} German Wiktionary checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} German Wiktionary checks passed`);
