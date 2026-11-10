/**
 * The WikiWoordenboek's markup is read into the same shape as the Italian entry.
 * Fixtures are trimmed copies of real pages; nothing here touches the network.
 */
const { readDutchEntry } = await import('../server/dictionary-nl.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const LEFTOVER = /\[\[|\]\]|\{\{|\}\}|''|Bestand:|File:|thumb|<ref|&nbsp;/;
const everyText = (entry) => entry.entries.flatMap((item) => item.senses)
  .flatMap((sense) => [sense.description, sense.usage, ...sense.synonyms, ...sense.antonyms])
  .concat(entry.origin);
const descriptions = (entry) => entry.entries.flatMap((item) => item.senses).map((sense) => sense.description);

// --- huis: a noun with {{-l-}}, numbered synonyms, a form block, Danish ------
const HUIS = `{{=nld=}}
[[Afbeelding:Woning aan de Sportlaan, Hoorn.JPG|thumb|right|250px|[1] Een vrijstaand '''huis'''.]]
{{-pron-}}
*{{sound}}: {{audio|nl-{{pn}}.ogg|{{pn}}|nld}}
{{-syll-}}
*huis
{{-etym-}}
*{{erfwoord|nld}}, via {{dum}} {{Q|huus|dum}} van {{odt}} {{Q|hus|odt}}, in de betekenis van ‘woning’ aangetroffen vanaf 893 {{sijs}}
{{-nlnoun-|{{pn}}|[[huizen]]|[[{{pn}}je]]|[[{{pn}}jes]]|bezield=niet geanimeerd|meta=fysiek}}
{{-noun-|nld}}
{{-l-|n}}
#{{bouwkunde|nld}}, {{wonen|nld}} gebouw bestemd om in te wonen
{{bijv-1|Zij wonen in een groot '''{{pn}}'''.}}
{{citeer|boek|jaar=2018|auteur=Tim Voors|titel=Alleen|uitgever=Fontaine Uitgevers|taal=nl|citaat= Had ik de tocht niet beter 10 jaar kunnen uitstellen totdat ze uit huis zouden zijn?}}
#geheel van de nakomelingen van één voorvader, verwijzing naar iemands [[afkomst]]
{{bijv-1|Die mensen zijn alle afstammeling van het '''{{pn}}''' de Vries.}}
#geheel van personen die officieel tot een vorstelijke familie worden gerekend
#{{bedrijf|nld}} eenvoudige onderneming van twee of meer personen
#iets wat gemaakt is om een bepaalde inhoud te bevatten
#zetel van een belangrijk persoon, bedrijf of instelling
{{citeer|artikel|datum = zaterdag 16 januari 2016, 13:44
|auteur = Jeroen Wielaert |titel = Window of my eyes
 |url = https://nos.nl/artikel/2080832|uitgever = NOS|bezochtdatum =2025-05-11|citaat =
Een zwart-wit beeld uit de jaren vijftig: huizen van baksteen onder steile driehoekige daken.
}}
#{{astrologie|nld}} elk van de twaalf sectoren van een horoscoop die te maken hebben met verschillende levensgebieden<ref>Een bron.</ref>
{{bijv-1|Het eerste '''{{pn}}''' van de horoscoop vertelt je meer over iemands fysieke verschijning}}
{{-syn-}}
*[1] [[woonhuis]]
*[2] [[geslacht]]
*[4] [[firma]], [[zaak]] ''(informeel)''
{{-hyper-}}
*[1] [[woning]], [[pand]]
{{-expr-}}
{{expr|Van '''huis''' uit|Oorspronkelijk}}
{{-trans-}}
{{trans-top|1. gebouw bestemd om in te wonen}}
* {{eng}}: {{trad|en|house}}
{{trans-bottom}}
{{-verb-|0}}
{{1ps|huizen}}
{{-preval-}}
{{wel-GB}}
{{refs}}

{{=dan=}}
{{-noun-|dan}}
'''{{pn}}''', {{n}}
#[[bankgebouw]]
`;

let entry = readDutchEntry(HUIS, 'huis');
ok('huis has a noun and a verb entry', entry?.entries.map((item) => item.category).join(',') === 'noun,verb',
  JSON.stringify(entry?.entries.map((item) => item.category)));
ok('{{-l-|n}} makes it neuter', entry.entries[0].gender === 'neuter', entry.entries[0].gender);
let senses = entry.entries[0].senses;
ok('a quotation spread over several lines does not break the senses', senses.length === 7,
  descriptions(entry).join(' | '));
ok('the sense is clean and its labels are the usage',
  senses[0].description === 'gebouw bestemd om in te wonen' && senses[0].usage === 'bouwkunde, wonen',
  `${senses[0].description} / ${senses[0].usage}`);
ok('a numbered synonym goes to its own sense',
  senses[0].synonyms.join(',') === 'woonhuis' && senses[1].synonyms.join(',') === 'geslacht'
  && senses[3].synonyms.join(',') === 'firma,zaak',
  senses.map((sense) => sense.synonyms.join('/')).join(' | '));
ok('the etymology names the languages and drops the references',
  entry.origin === 'erfwoord, via Middelnederlands huus van Oudnederlands hus, in de betekenis van ‘woning’ aangetroffen vanaf 893',
  entry.origin);
const forms = entry.entries[1].senses;
ok('{{1ps|huizen}} under {{-verb-|0}} writes the form senses, numbered on from the noun',
  forms.length === 3 && forms[0].number === 8
  && forms[0].description === 'eerste persoon enkelvoud tegenwoordige tijd van huizen'
  && forms[1].description === 'gebiedende wijs van huizen',
  JSON.stringify(forms.map((sense) => [sense.number, sense.description])));
ok('the inversion reading carries its label', forms[2].usage === 'bij inversie', forms[2].usage);
ok('no markup is left anywhere', !everyText(entry).some((text) => LEFTOVER.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));
ok('the Danish section is not read', !descriptions(entry).includes('bankgebouw'));

// --- lopen: verb kinds, italic labels, ~, a chained etymology ---------------
const LOPEN = `{{=nld=}}
{{-pron-}}
*{{WikiW|IPA}}: {{IPA-nl-standaard|ˈlopə(n)}}
{{-etym-}}
* In de betekenis van ‘gaan’ voor het eerst aangetroffen in 901 {{sijs}}
*{{((}}
*{{erfwoord|nld}} afkomstig van {{ebank}}:
:{{dum}}: lopen
:{{odt}}: lōpan
:{{gem}}: *hlaupanan
{{==}}
*Verwant in Germaans:
:'''West''': {{eng}}: leap ({{ang}}: hlēapan)
{{))}}
{{-nlstam-|lopen|[[liep]]|[[gelopen]]||||scheid=n|{{nlsterk7}}}}
{{-verb-|nld}}
'''{{pn}}'''
#''(Noord-Nederlands)'' {{erga|nld}} stappen, gaan, wandelen
{{bijv-1|'''Lopen''' naar het stadhuis is sneller dan met de auto.}}
#''(Zuid-Nederlands)'' {{inerg|nld}} rennen
#{{erga|nld}} vloeien of stromen
#{{auxl|nld}} ''~ te'': duratief hulpwerkwoord, iets doen terwijl men loopt
#{{ov|nld}}, {{figuurlijk|nld}} {{Q|afleggen|nld|ww}} van een [[afstand#Zelfstandig naamwoord|afstand]]
#{{Nodef|nld}}
{{-syn-}}
*[1] [[gaan]], [[wandelen]]
*[[stappen]]
{{-ant-}}
*[1] [[stilstaan]]
`;

entry = readDutchEntry(LOPEN, 'lopen');
senses = entry.entries[0].senses;
ok('{{erga}} is intransitive and keeps the wiki\'s finer word as a label, with the italic region',
  senses[0].verbCategory === 'intransitive' && senses[0].usage === 'ergatief, Noord-Nederlands',
  `${senses[0].verbCategory} / ${senses[0].usage}`);
ok('{{inerg}} likewise', senses[1].verbCategory === 'intransitive' && senses[1].usage === 'inergatief, Zuid-Nederlands',
  `${senses[1].verbCategory} / ${senses[1].usage}`);
ok('{{auxl}} is auxiliary and ~ is the headword',
  senses[3].verbCategory === 'auxiliary' && senses[3].description === 'lopen te: duratief hulpwerkwoord, iets doen terwijl men loopt',
  `${senses[3].verbCategory} / ${senses[3].description}`);
ok('{{ov}} is transitive, {{Q}} and a section link show the word',
  senses[4].verbCategory === 'transitive' && senses[4].description === 'afleggen van een afstand' && senses[4].usage === 'figuurlijk',
  `${senses[4].verbCategory} / ${senses[4].description} / ${senses[4].usage}`);
ok('an empty template leaves no sense', senses.length === 5, descriptions(entry).join(' | '));
ok('the first synonym line is numbered, the second is for the entry',
  senses[0].synonyms.join(',') === 'gaan,wandelen,stappen' && senses[0].antonyms.join(',') === 'stilstaan',
  `${senses[0].synonyms} / ${senses[0].antonyms}`);
ok('the etymology joins the dated point and the chain under "afkomstig van:"',
  entry.origin === 'In de betekenis van ‘gaan’ voor het eerst aangetroffen in 901; erfwoord afkomstig van: Middelnederlands lopen, Oudnederlands lōpan, Germaans *hlaupanan',
  entry.origin);

// --- bank: sub-senses, [1.1] synonyms, v/m, a gallery -----------------------
const BANK = `{{=nld=}}
{{-etym-}}
* In de betekenis van ‘meubelstuk’ voor het eerst aangetroffen in het jaar 1240 {{sijs}}
* Leenwoord uit het Italiaans, in de betekenis van ‘geldbank’ voor het eerst aangetroffen in het jaar 1467 {{sijs}}
{{-noun-|nld}}
{{-l-|fm}}
#{{materiaalkunde|nld}} breed houten of metalen voorwerp waarop mensen kunnen zitten
##harde langwerpige constructie zoals die vaak in kerken, openbaar vervoer en buiten is te vinden
{{bijv-1|Hij voerde de eendjes vanop de '''bank''' in het park.|#}}
##{{meubel|nld}} comfortabel bekleed meubelstuk waar meer mensen naast elkaar op kunnen zitten
#{{financieel|nld}} instelling die [[geld#Zelfstandig naamwoord|geld]] beheert en uitleent
#{{waterbeheer|nld}} een ondiepte in het water
#:''Een voorbeeld op een dubbele punt.''
#*''Een voorbeeld op een ster.''
#{{werktuigbouwkunde|nld}} [[werktafel]], zoals een [[draaibank]] etc.
<gallery>
Bench autumn.JPG|[1.1] '''Bank''' in een park.
Red sofa.jpg|[1.2]: Een comfortabele '''bank'''.
</gallery>
{{-syn-}}
*[1.1]: [[sofa]], [[zetel]], [[zitbank]]
*[1.2]: [[canapé]], [[divan]], [[sofa]]
*[3]: [[zandbank]]
{{-note-}}
*Betekenis 1.2 is vooral in Nederland gebruikelijk.<ref>[https://taaladvies.net ''Zetel / stoel / bank'']</ref>
{{-verb-|0}}
{{1ps|banken}}
`;

entry = readDutchEntry(BANK, 'bank');
senses = entry.entries[0].senses;
ok('fm (v/m) is both genders', entry.entries[0].gender === 'masculine_and_feminine', entry.entries[0].gender);
ok('sub-senses on ## are senses; example lines are not', senses.length === 6, descriptions(entry).join(' | '));
ok('[1.1] and [3] find the sub-sense and the third sense',
  senses[1].synonyms.join(',') === 'sofa,zetel,zitbank' && senses[2].synonyms.join(',') === 'canapé,divan,sofa'
  && senses[4].synonyms.join(',') === 'zandbank',
  senses.map((sense) => sense.synonyms.join('/')).join(' | '));
ok('"etc." keeps its full stop', senses[5].description === 'werktafel, zoals een draaibank etc.', senses[5].description);
ok('two etymology points are joined',
  entry.origin === 'In de betekenis van ‘meubelstuk’ voor het eerst aangetroffen in het jaar 1240; Leenwoord uit het Italiaans, in de betekenis van ‘geldbank’ voor het eerst aangetroffen in het jaar 1467',
  entry.origin);
ok('a gallery and a reference leave nothing behind', !everyText(entry).some((text) => LEFTOVER.test(text) || /Bench|taaladvies/.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));

// --- de: {{-prep-|0}} is an entry, [A] headwords, an article -----------------
entry = readDutchEntry(`{{=nld=}}
{{-etym-}}
*[A] in de betekenis van ‘lidwoord’ voor het eerst aangetroffen in 1100 {{sijs}}
*[B]: van {{fra}} {{Q|{{pn}}|fra|vz}}
{{-art-|nld}}
'''[A] {{pn}}'''
#voorafgaand aan een zelfstandig naamwoord om aan te geven dat duidelijk is om wie of wat het gaat
#{{formeel|nld}} voorafgaand aan een zelfstandig naamwoord om aan te geven dat het om de hele categorie gaat
#[[per]] ''(bij prijzen)''
{{-prep-|0}}
'''[B] {{pn}}'''
#van ''(alleen in de onderstaande verbindingen)''
{{-abbr-}}
*[[d.]]
{{-prep-|cat}}
'''{{pn}}'''
#[[van]]
`, 'de');
ok('{{-art-|nld}} is the article and {{-prep-|0}} a real entry; {{-abbr-}} with no language and a Catalan block are not',
  entry.entries.map((item) => item.category).join(',') === 'article,preposition',
  entry.entries.map((item) => item.category).join(','));
ok('a template label and a trailing bracket', entry.entries[0].senses[1].usage === 'formeel'
  && entry.entries[0].senses[2].description === 'per (bij prijzen)',
  `${entry.entries[0].senses[1].usage} / ${entry.entries[0].senses[2].description}`);
ok('the [A] and [B] markers come off the etymology',
  entry.origin === 'in de betekenis van ‘lidwoord’ voor het eerst aangetroffen in 1100; van Frans de', entry.origin);

// --- twee and buiten: gender that changes within one entry -----------------
entry = readDutchEntry(`{{=nld=}}
{{-num-|nld}}
'''{{pn}}'''
# "2", het getal tussen [[een#Hoofdtelwoord|één]] en [[drie#Hoofdtelwoord|drie]]
## om een hoeveelheid aan te geven
{{-noun-|nld}}
{{-l-|fm}}
# het cijfer twee
{{-l-|p}}
# groep van 2 eenheden
{{-syn-}}
*[2] [[tweetal]]
`, 'twee');
ok('{{-num-}} is a numeral and a plural-only headword has no gender',
  entry.entries[0].category === 'numeral' && entry.entries[1].gender === 'masculine_and_feminine'
  && entry.entries[1].senses[1].gender === '' && entry.entries[1].senses[1].synonyms.join() === 'tweetal',
  JSON.stringify(entry.entries.map((item) => [item.category, item.gender, item.senses.map((sense) => sense.gender)])));

entry = readDutchEntry(`{{=nld=}}
{{-noun-|nld}}
'''{{pn}}'''
#{{m}} [[platteland]]
#{{n}} [[buitenverblijf]], [[landhuis]]
`, 'buiten');
ok('a gender mark that opens a sense is that sense\'s gender',
  entry.entries[0].senses[0].gender === 'masculine' && entry.entries[0].senses[1].gender === 'neuter'
  && entry.entries[0].senses[0].description === 'platteland',
  JSON.stringify(entry.entries[0].senses.map((sense) => [sense.gender, sense.description])));

// --- pages that are only a form ----------------------------------------------
entry = readDutchEntry(`{{=nld=}}
{{-pron-}}
*{{WikiW|IPA}}: {{IPA|/lopt/|nld}}
{{-verb-|0}}
{{2ps|lopen}}
{{citeer|boek|jaar=2018|auteur=Tim Voors|titel=Alleen|citaat= Mijn rugzak woog wel 20 kilo, en nu loopt iedereen met dat ultralichte spul.}}
{{-expr-}}
{{expr|De gal '''loopt''' over|boos worden}}
`, 'loopt');
ok('loopt is found as the forms of lopen', entry.entries.length === 1 && entry.entries[0].category === 'verb'
  && entry.entries[0].senses.map((sense) => sense.description).join(' | ')
    === 'tweede persoon enkelvoud tegenwoordige tijd van lopen | derde persoon enkelvoud tegenwoordige tijd van lopen | gebiedende wijs meervoud van lopen'
  && entry.entries[0].senses[2].usage === 'verouderd',
  JSON.stringify(entry.entries));

entry = readDutchEntry(`{{=nld=}}
{{-adjc-|0}}
{{nl-adjc-form|mooi|decl|pos}}
`, 'mooie');
ok('an adjective form', entry.entries[0]?.senses[0].description === 'verbogen vorm van de stellende trap van mooi'
  && entry.entries[0].category === 'adjective', JSON.stringify(entry.entries));

entry = readDutchEntry(`{{=nld=}}
{{-noun-|0}}
{{noun-pl|huis}}
{{-noun-|0}}
{{noun-dim|huis}}
#{{dimt|b}} kap of afdak boven iets
`, 'huisjes');
ok('a plural has no gender, a diminutive is neuter, and a sense after the form is numbered on',
  entry.entries[0].senses[0].description === 'meervoud van het zelfstandig naamwoord huis' && entry.entries[0].gender === ''
  && entry.entries[1].senses[0].description === 'verkleinwoord enkelvoud van het zelfstandig naamwoord huis'
  && entry.entries[1].gender === 'neuter'
  && entry.entries[1].senses[1].description === 'kap of afdak boven iets' && entry.entries[1].senses[1].usage === 'alleen verkleinwoord'
  && entry.entries[1].senses[1].number === 3,
  JSON.stringify(entry.entries));

// --- Nederland: a proper noun, the gender beside the headword ---------------
entry = readDutchEntry(`{{=nld=}}
{{-etym-}}
*{{samen|nld|neder|bw|laag|land|zn|gebied}}, aangezien een groot deel van Nederland onder de zeespiegel ligt {{ebank}}
{{-demo-|[[Nederlander]]|[[Nederlands]]|f=[[Nederlandse]]}}
{{-nlnoun-|{{pn}}|-|-|-|name=1}}
{{-name-|nld}}
'''{{pn}}''' {{n}}
#{{land|nld|land=Nederland}} land in het westen van Europa, belangrijkste deel van het ''Koninkrijk der Nederlanden''
`, 'Nederland');
ok('{{-name-}} is a proper noun, {{n}} after the headword is neuter, {{land}} is a toponym label',
  entry.entries[0].category === 'proper noun' && entry.entries[0].gender === 'neuter'
  && entry.entries[0].senses[0].usage === 'toponiem: land'
  && entry.entries[0].senses[0].description === 'land in het westen van Europa, belangrijkste deel van het Koninkrijk der Nederlanden',
  JSON.stringify(entry.entries));
ok('{{samen}} reads as a compound',
  entry.origin === 'samenstelling van neder en land, aangezien een groot deel van Nederland onder de zeespiegel ligt', entry.origin);

// --- odds and ends -----------------------------------------------------------
entry = readDutchEntry(`{{=nld=}}
{{-adjc-|nld}}
'''{{pn}}'''
#(in Vlaanderen en Limburg) raar
#(als) beschouwen
#(aan)groei, stijging
#''(van plaats)''
#{{№|3|{{modl|nld}}: zeer dringend noodzakelijk zijn}}
#de [[inhoud]] van de kleinste niet-lege verzameling <math>\\mathbb{N}_0</math>; komt na [[nul]]
#{{taalkunde|nld}} de [[eenentwintigste]] [[letter]] van het [[alfabet]]<br/>Zie ook {{w|nl|U (letter)|het artikel over de letter '''u''' op Wikipedia}}.
#{{WikiW|Persoon#Derde persoon|derde persoon}} {{WikiW|enkelvoud}}, {{WikiW|Genus|mannelijk}} of {{WikiW|Genus|onzijdig}}
{{-syn-}}
*[1] [[aardig]] [2], ± [[vreemd]]
`, 'x');
senses = entry.entries[0].senses;
ok('a plain bracket that places the sense is a label', senses[0].usage === 'in Vlaanderen en Limburg' && senses[0].description === 'raar',
  `${senses[0].usage} / ${senses[0].description}`);
ok('a plain bracket that is an optional word is not', senses[1].description === '(als) beschouwen' && senses[2].description === '(aan)groei, stijging'
  && !senses[1].usage, `${senses[1].description} / ${senses[2].description}`);
ok('a sense that is only its bracket keeps it as the definition', senses[3].description === 'van plaats' && senses[3].usage === '',
  `${senses[3].description} / ${senses[3].usage}`);
ok('{{№}} shows its text and {{modl}} is an auxiliary', senses[4].description === 'zeer dringend noodzakelijk zijn'
  && senses[4].verbCategory === 'auxiliary' && senses[4].usage === 'modaal werkwoord',
  `${senses[4].description} / ${senses[4].verbCategory} / ${senses[4].usage}`);
ok('a formula goes', senses[5].description === 'de inhoud van de kleinste niet-lege verzameling; komt na nul', senses[5].description);
ok('an aside after a line break goes', senses[6].description === 'de eenentwintigste letter van het alfabet', senses[6].description);
ok('{{WikiW}} shows its text', senses[7].description === 'derde persoon enkelvoud, mannelijk of onzijdig', senses[7].description);
ok('synonyms lose sense numbers and ± marks', senses[0].synonyms.join(',') === 'aardig,vreemd', senses[0].synonyms.join(','));

ok('a commented-out template is not read', readDutchEntry(`{{=nld=}}
{{-verb-|0}}
<!-- nog na te kijken
{{1ps|zijn|no-imp=1}}
-->
{{-verb-|0}}
#{{WikiW|eerste persoon}} {{WikiW|enkelvoud}} {{WikiW|tegenwoordige tijd}} van [[zijn#Werkwoord|zijn]]
`, 'ben').entries.flatMap((item) => item.senses).map((sense) => sense.description).join(' | ')
  === 'eerste persoon enkelvoud tegenwoordige tijd van zijn');

ok('a page with no Dutch section reads as nothing', readDutchEntry(`{{=fra=}}
{{-noun-|fra}}
'''{{pn}}''' {{f}}
#[[huis]]
`, 'maison') === null);

ok('a Dutch section with no part of speech has no entries', readDutchEntry(`{{=nld=}}
{{-pron-}}
*{{WikiW|IPA}}: {{IPA|/x/|nld}}
{{-abbr-}}
*[[bv.]]
`, 'bijvoorbeeld').entries.length === 0);

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} WikiWoordenboek checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} WikiWoordenboek checks passed`);
