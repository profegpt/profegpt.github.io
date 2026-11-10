/**
 * Intent routing and the conjugated-form index, German side.
 *
 * The routing itself is shared with the other tutors; these checks exist to
 * prove the German pack drives it correctly, not to re-test the router. Only
 * the offline paths are covered: dictionary and translation answers need the
 * server, so for those only the intent patterns are checked.
 */

// lib/study.js reads the page's location when it loads, and the tests run in
// Node. A minimal stand-in, set before the tutor is imported, which is why the
// import below is dynamic rather than a static one hoisted above this line.
globalThis.window ??= { location: { pathname: '/de' } };
globalThis.document ??= { documentElement: { dataset: {} } };

const { answer, detectLanguage, getFormIndex, activePack } = await import('../public/js/lib/tutor.js');
const { PACK } = await import('../public/js/lib/tutor-de.js');
const { conjugate } = await import('../public/js/lib/conjugator-de.js');
const { TOPICS } = await import('../public/js/data/grammar-de.js');

let checked = 0;
const failures = [];

function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

function text(blocks) {
  return blocks.map((block) => (block.type === 'md' ? block.text : JSON.stringify(block))).join('\n');
}

// Everything here asks the German pack explicitly: the study language is a
// browser setting, and the tests run in Node.
const de = (question, options = {}) => answer(question, { study: 'de', ...options });

// --- the pack is wired -----------------------------------------------------
ok('the router holds the German pack', activePack('de') === PACK && PACK?.code === 'de');

// --- language detection ----------------------------------------------------
ok('detects English', detectLanguage('what does Fernweh mean', null, 'de') === 'en');
ok('detects German', detectLanguage('was bedeutet Fernweh', null, 'de') === 'de');
ok('detects German from umlauts alone', detectLanguage('Fernweh für Berlin', null, 'de') === 'de');
ok('detects German from ß alone', detectLanguage('groß', null, 'de') === 'de');
ok('detects German from "und"', detectLanguage('sein und haben', null, 'de') === 'de');
ok('an English article is not German', detectLanguage('what is a verb', null, 'de') === 'en');
ok('"die" decides nothing', detectLanguage('die hard', null, 'de') === 'en');
ok('"was" decides nothing', detectLanguage('he was there', null, 'de') === 'en');
ok('"der die das" is German', detectLanguage('der die das', null, 'de') === 'de');
ok('"konjugiere gehen im Konjunktiv" is German', detectLanguage('konjugiere gehen im Konjunktiv', null, 'de') === 'de');
ok('"wie sagt man … auf Deutsch" is German despite the English inside the quotes', detectLanguage('wie sagt man "I\'m tired" auf Deutsch', null, 'de') === 'de');
ok('"when do i use dativ" is English', detectLanguage('when do i use dativ', null, 'de') === 'en');

// --- the form index --------------------------------------------------------
const index = getFormIndex('de');
ok('index is populated', index.size > 4000, `${index.size} forms`);
ok('index has mache', index.get('mache')?.some((e) => e.verb === 'machen' && e.person === 'ich' && e.tense === 'praesens'));
ok('ging is gehen, ich', index.get('ging')?.some((e) => e.verb === 'gehen' && e.person === 'ich' && e.tense === 'praeteritum'));
// The router keeps one entry per verb and tense, so a form shared by ich and
// er (ging, gingen) is filed under the first person it met.
ok('ging is not filed twice', index.get('ging')?.filter((e) => e.verb === 'gehen' && e.tense === 'praeteritum').length === 1);
ok('gingen is gehen, wir', index.get('gingen')?.some((e) => e.verb === 'gehen' && e.person === 'wir' && e.tense === 'praeteritum'));
ok('sang is singen', index.get('sang')?.some((e) => e.verb === 'singen' && e.tense === 'praeteritum'));
ok('wäre is the Konjunktiv II of sein', index.get('ware')?.some((e) => e.verb === 'sein' && e.mood === 'konjunktiv' && e.tense === 'konjunktiv2'));
ok('war is sein, Präteritum', index.get('war')?.some((e) => e.verb === 'sein' && e.tense === 'praeteritum'));
ok('sei is the Konjunktiv I of sein', index.get('sei')?.some((e) => e.verb === 'sein' && e.tense === 'konjunktiv1'));
ok('and the imperative of sein, labelled', index.get('sei')?.some((e) => e.verb === 'sein' && e.mood === 'imperativ' && e.person === 'du' && e.label.de === 'Imperativ'));
ok('gegeben is a participle', index.get('gegeben')?.some((e) => e.verb === 'geben' && e.mood === 'formen' && e.label.de === 'Partizip II'));
ok('gebend is the Partizip I', index.get('gebend')?.some((e) => e.verb === 'geben' && e.mood === 'formen' && e.label.de === 'Partizip I'));
ok('aufgestanden is aufstehen', index.get('aufgestanden')?.some((e) => e.verb === 'aufstehen' && e.mood === 'formen'));
ok('the present of a separable verb is not indexed (it has a space)', !index.has('stehe auf') && !(index.get('stehe') ?? []).some((e) => e.verb === 'aufstehen'));
ok('bringt is bringen, er and ihr', index.get('bringt')?.some((e) => e.verb === 'bringen' && e.person === 'er') && index.get('bringt')?.some((e) => e.verb === 'bringen' && e.person === 'ihr'));
ok('brachte is bringen, Präteritum', index.get('brachte')?.some((e) => e.verb === 'bringen' && e.tense === 'praeteritum'));
ok('brächte, folded, is bringen, Konjunktiv II', index.get('brachte')?.some((e) => e.verb === 'bringen' && e.tense === 'konjunktiv2'));
ok('gib is the imperative of geben', index.get('gib')?.some((e) => e.verb === 'geben' && e.mood === 'imperativ' && e.person === 'du'));
ok('the imperative persons are labelled', PACK.PERSON_LABELS.du === 'du' && PACK.PERSON_LABELS.ihr === 'ihr');
ok('index is umlaut-insensitive', index.get('fahrt')?.some((e) => e.verb === 'fahren' && e.person === 'er'), 'fährt should be findable as fahrt');
ok('no compound form was indexed', [...index.keys()].every((key) => !key.includes(' ')));
ok('mögen is known under its folded name', PACK.KNOWN_VERBS.has('mogen') && PACK.KNOWN_VERBS.has('sein') && PACK.KNOWN_VERBS.has('aufstehen'));

// --- every tense the pack names exists in the engine's table ---------------
const machen = conjugate('machen');
for (const key of Object.keys(PACK.TENSE_LABELS)) {
  const [mood, tense] = key.split('.');
  ok(`${key} exists in the table`, typeof machen.table[mood]?.[tense]?.ich === 'string');
  ok(`${key} has both names`, typeof PACK.TENSE_LABELS[key].de === 'string' && typeof PACK.TENSE_LABELS[key].en === 'string');
}
ok('INDEX_TENSES holds only the one-word tenses', PACK.INDEX_TENSES.length === 4 && PACK.INDEX_TENSES.every((key) => {
  const [mood, tense] = key.split('.');
  return !machen.table[mood][tense].ich.includes(' ');
}));
for (const key of PACK.DEFAULT_TENSES) ok(`default tense ${key} is labelled`, Boolean(PACK.TENSE_LABELS[key]));
for (const verb of PACK.MODEL_VERBS) ok(`model verb ${verb} conjugates`, conjugate(verb).ok);
ok('the model verbs are one of each class', PACK.MODEL_VERBS.map((verb) => conjugate(verb).class).join(',') === 'schwach,stark,gemischt');
ok('the shape names the table', PACK.shape.gerund === 'partizip1' && PACK.shape.participle === 'partizip2' && PACK.shape.affirmative === 'affirmativ');

// --- no reader-visible text carries an em dash or a middle dot --------------
const visible = [
  PACK.capabilities('de'), PACK.capabilities('en'), PACK.outOfScope('de', ''), PACK.outOfScope('en', ''),
  ...Object.values(PACK.labels).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.TENSE_LABELS).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.FORM_LABELS).flatMap((label) => Object.values(label)),
  ...PACK.REPHRASE.de.examples, ...PACK.REPHRASE.en.examples,
  PACK.verbHeadline(conjugate('aufstehen'), 'to get up', '', 'de'), PACK.verbHeadline(conjugate('aufstehen'), 'to get up', '', 'en'),
].join('\n');
ok('no em dashes or middle dots in the tutor\'s own words', !/[—·]/.test(visible));
ok('capabilities list the grammar notes by title', /Sein und haben/.test(PACK.capabilities('de')) && /the four cases/i.test(PACK.capabilities('en')));
ok('capabilities name every note', TOPICS.every((topic) => PACK.capabilities('de').includes(topic.title.de)));

// --- the intents that need the server, checked as patterns only -------------
ok('"was bedeutet Fernweh" is a definition request', PACK.INTENTS.define.exec('was bedeutet Fernweh')?.[1] === 'Fernweh');
ok('"was heißt Fernweh" is a definition request', PACK.INTENTS.define.exec('was heißt Fernweh')?.[1] === 'Fernweh');
ok('"was heisst Fernweh" too', PACK.INTENTS.define.exec('was heisst Fernweh')?.[1] === 'Fernweh');
ok('"bedeutung von Fernweh" too', PACK.INTENTS.define.exec('bedeutung von Fernweh')?.[1] === 'Fernweh');
ok('"was ist eine Schadenfreude" too', PACK.INTENTS.define.exec('was ist eine Schadenfreude')?.[1] === 'Schadenfreude');
ok('"what does Fernweh mean" is a definition request', PACK.INTENTS.define.exec('what does Fernweh mean')?.[1] === 'Fernweh');
ok('"was ist der Unterschied …" is not a definition request', !PACK.INTENTS.define.test('was ist der unterschied zwischen weil und denn'));
const translate = PACK.INTENTS.translateInto.exec('wie sagt man "I\'m tired" auf Deutsch');
ok('"wie sagt man … auf Deutsch" is a translation request', translate?.[1] === "I'm tired");
ok('and goes into German', PACK.INTENTS.intoStudyLanguage.test('wie sagt man "I\'m tired" auf Deutsch') && !PACK.INTENTS.intoEnglishLanguage.test('wie sagt man "I\'m tired" auf Deutsch'));
ok('"wie sagt man müde auf Englisch" goes the other way', PACK.INTENTS.intoEnglishLanguage.test('wie sagt man müde auf Englisch'));
ok('"how do you say thanks in german" is a translation request', PACK.INTENTS.translateInto.exec('how do you say thanks in german')?.[1] === 'thanks');
ok('"übersetze guten Morgen" is a translation request', PACK.INTENTS.translateAny.exec('übersetze guten Morgen')?.[1] === 'guten Morgen');
ok('"übersetzung von Fernweh" too', PACK.INTENTS.translateAny.exec('übersetzung von Fernweh')?.[1] === 'Fernweh');
ok('"müde auf Englisch" is a phrase into English', PACK.INTENTS.intoEnglish.exec('müde auf Englisch')?.[1] === 'müde');
ok('"tired in german" is a phrase into German', PACK.INTENTS.intoStudy.exec('tired in german')?.[1] === 'tired');
ok('"welche Form ist «ging»" is a form question', PACK.INTENTS.whatForm.exec('welche Form ist «ging»')?.[1] === 'ging');
ok('"was für eine Form ist ging" too', PACK.INTENTS.whatForm.exec('was für eine Form ist ging')?.[1] === 'ging');
ok('"what form is ging" too', PACK.INTENTS.whatForm.exec('what form is ging')?.[1] === 'ging');
ok('"konjugiere gehen im Konjunktiv" names gehen', PACK.INTENTS.conjugate.exec('konjugiere gehen im Konjunktiv')?.[1] === 'gehen');
ok('"konjugier mal gehen" names gehen', PACK.INTENTS.conjugate.exec('konjugier mal gehen')?.[1] === 'gehen');
ok('"konjugation von sein" names sein', PACK.INTENTS.conjugate.exec('konjugation von sein')?.[1] === 'sein');
ok('"wie konjugiert man fahren" names fahren', PACK.INTENTS.conjugate.exec('wie konjugiert man fahren')?.[1] === 'fahren');
ok('"konjugiere das Verb müssen" names müssen', PACK.INTENTS.conjugate.exec('konjugiere das Verb müssen')?.[1] === 'müssen');
ok('"konjugiere sich freuen" keeps the sich', PACK.INTENTS.conjugate.exec('konjugiere sich freuen')?.[1] === 'sich freuen');
ok('"conjugate aufstehen" names aufstehen', PACK.INTENTS.conjugate.exec('conjugate aufstehen')?.[1] === 'aufstehen');
ok('HELP matches hilfe and help', PACK.HELP.test('hilfe') && PACK.HELP.test('help') && PACK.HELP.test('was kannst du'));
ok('INFINITIVE accepts the engine\'s shapes', PACK.INFINITIVE.test('machen') && PACK.INFINITIVE.test('sammeln') && PACK.INFINITIVE.test('tun') && !PACK.INFINITIVE.test('Fernweh'));
ok('LEADING_ARTICLE strips der, die, das and the', ['der konjunktiv', 'die vier falle', 'das perfekt', 'the subjunctive'].every((phrase) => !PACK.LEADING_ARTICLE.test(phrase.replace(PACK.LEADING_ARTICLE, ''))));

// --- routing ---------------------------------------------------------------
const cases = [
  ['hallo', /konjugieren|conjugate/i, 'greeting'],
  ['guten Tag', /konjugieren|conjugate/i, 'greeting, two words'],
  ['danke', /gern geschehen|welcome/i, 'thanks'],
  ['tschüss', /bis bald|see you/i, 'goodbye'],
  ['hilfe', /konjugieren/i, 'capabilities in German'],
  ['help', /conjugate/i, 'capabilities in English'],

  ['sein und haben', /sein/i, 'sein/haben topic'],
  ['sein oder haben', /Hilfsverb|auxiliar/i, 'sein/haben asked the other way round'],
  ['what is the difference between sein and haben', /auxiliar/i, 'sein/haben asked in English'],
  ['der die das', /Genus|gender/i, 'der die das topic'],
  ['die vier Fälle', /Nominativ/i, 'the four cases'],
  ['akkusativ oder dativ', /Akkusativ/i, 'accusative or dative'],
  ['when do i use dativ', /dative/i, 'dative, asked in English'],
  ['trennbare Verben', /trennbar|Vorsilbe/i, 'separable verbs'],
  ['separable verbs', /separable/i, 'separable verbs in English'],
  ['weil oder denn', /weil/i, 'weil or denn'],
  ['what is the difference between weil and denn', /weil/i, 'weil or denn in English'],
  ['konjunktiv 2', /Konjunktiv II|würde/i, 'Konjunktiv II topic'],
  ['der Konjunktiv', /Konjunktiv/i, 'the Konjunktiv, with its article'],
  ['nicht oder kein', /kein/i, 'nicht or kein'],
  ['where does nicht go', /nicht/i, 'position of nicht in English'],
  ['Wortstellung', /Hauptsatz|zweiter Stelle/i, 'word order'],
  ['word order in subordinate clauses', /subordinate/i, 'word order in English'],
  ['kennen wissen können', /kennen/i, 'kennen, wissen, können'],
  ['kennen oder wissen', /wissen/i, 'kennen or wissen'],
  ['die Modalverben', /Modalverb/i, 'modal verbs'],
  ['modal verbs', /modal/i, 'modal verbs in English'],
  ['Perfekt oder Präteritum', /Perfekt/i, 'the past tenses'],
  ['die Präpositionen', /Wechselpräposition|Akkusativ/i, 'prepositions'],
  ['adjective endings', /ending/i, 'adjective endings in English'],
  ['die indirekte Rede', /Konjunktiv I/i, 'reported speech'],
  ['du oder Sie', /Sie/i, 'du or Sie'],
  ['reflexive Verben', /sich/i, 'reflexive verbs'],
  ['Komparativ und Superlativ', /Komparativ/i, 'comparison'],
  ['Relativsätze', /Relativpronomen/i, 'relative clauses'],
  ['das Passiv', /Passiv/i, 'the passive'],
  ['der Imperativ', /Imperativ/i, 'the imperative'],
  ['um zu', /Infinitiv/i, 'um … zu'],
  ['darauf worauf', /da-/i, 'da- and wo-compounds'],
  ['das oder dass', /dass/i, 'das or dass'],

  ['konjugiere machen', /machen/i, 'conjugation'],
  ['konjugiere gehen', /gehen/i, 'conjugation of a strong verb'],
  ['konjugation von sein', /bin/i, 'conjugation with "von"'],
  ['conjugate bringen', /brachte/i, 'conjugation asked in English'],
  ['gehen konjugation', /ging/i, 'verb-first'],
  ['gehen', /gehe/i, 'a bare infinitive'],
  ['das Verb fahren', /fährt/i, 'explicit verb marker'],
  ['konjugiere sich freuen', /freue/i, 'a reflexive'],
  ['konjugiere aufstehen', /stehe auf/i, 'a separable verb'],
];

const results = [];
for (const [question, pattern, label] of cases) {
  results.push(de(question).then((result) => {
    ok(`routes "${question}" (${label})`, pattern.test(text(result.blocks)),
      `got: ${text(result.blocks).slice(0, 120)}`);
    ok(`"${question}" is grounded`, result.confident);
  }));
}

// --- the starter questions of the chat page --------------------------------
results.push(de('sein und haben').then((result) => {
  const body = text(result.blocks);
  ok('starter: "sein und haben" is the sein-haben note', /^### Sein und haben/m.test(body), body.slice(0, 120));
}));
results.push(de('konjugiere gehen im Konjunktiv').then((result) => {
  const body = text(result.blocks);
  ok('starter: "konjugiere gehen im Konjunktiv" is gehen', /\*\*gehen\*\*/.test(body), body.slice(0, 160));
  ok('and a bare Konjunktiv is the Konjunktiv II', /"caption":"Konjunktiv II"/.test(body) && /ginge/.test(body) && !/\bging\b/.test(body), body.slice(0, 400));
}));
results.push(de('welche Form ist «ging»').then((result) => {
  const body = text(result.blocks);
  ok('starter: "welche Form ist «ging»" is gehen', /\*gehen\*/.test(body), body.slice(0, 160));
  ok('and says ich, Präteritum', /\*\*ging\*\*: ich, Präteritum von \*gehen\*/.test(body), body.slice(0, 200));
}));
ok('starter: "was bedeutet Fernweh" is a definition request', PACK.INTENTS.define.exec('was bedeutet Fernweh')?.[1] === 'Fernweh');
ok('starter: "wie sagt man \'I\'m tired\' auf Deutsch" is a translation request', PACK.INTENTS.translateInto.exec('wie sagt man "I\'m tired" auf Deutsch')?.[1] === "I'm tired");

// --- the headline names the class --------------------------------------------
results.push(de('konjugiere machen').then((result) => {
  const body = text(result.blocks);
  ok('machen is a weak verb', /\*\*machen\*\* \(\*to make, to do\*\)\. Schwaches Verb\./.test(body), body.slice(0, 160));
  ok('the default tenses are shown', /"caption":"Präsens"/.test(body) && /"caption":"Präteritum"/.test(body) && /"caption":"Perfekt"/.test(body), body.slice(0, 600));
  ok('and the Perfekt is there as two words', /habe gemacht/.test(body), body.slice(0, 600));
}));
results.push(de('konjugiere gehen').then((result) => {
  ok('gehen is strong and takes sein', /Starkes Verb, Perfekt mit \*sein\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('conjugate bringen').then((result) => {
  ok('bringen is a mixed verb', /A mixed verb\./.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('conjugate aufstehen').then((result) => {
  const body = text(result.blocks);
  ok('aufstehen names its particle and base', /separable: auf, conjugated like \*stehen\*, takes \*sein\*/.test(body), body.slice(0, 200));
}));
results.push(de('konjugiere fahren').then((result) => {
  ok('fahren names its vowel change', /mit Vokalwechsel a → ä/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere arbeiten').then((result) => {
  ok('arbeiten names its e-Einschub', /Schreibung e-Einschub/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere sein').then((result) => {
  ok('sein is irregular', /unregelmäßig/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere sich freuen').then((result) => {
  const body = text(result.blocks);
  ok('a reflexive is reported under the bare verb and flagged', /\*\*freuen\*\*/.test(body) && /reflexiv/.test(body), body.slice(0, 160));
}));
ok('sein and werden are hairy', PACK.isHairy(conjugate('sein')) && PACK.isHairy(conjugate('werden')));
ok('gehen and haben are not', !PACK.isHairy(conjugate('gehen')) && !PACK.isHairy(conjugate('haben')) && !PACK.isHairy(conjugate('machen')));

// --- a tense named with the verb ---------------------------------------------
results.push(de('konjugiere sein im Präteritum').then((result) => {
  const body = text(result.blocks);
  ok('a named tense is the only table', /\bwar\b/.test(body) && !/\bbin\b/.test(body), body.slice(0, 300));
}));
results.push(de('konjugiere gehen im Perfekt').then((result) => {
  ok('the Perfekt is not read as the Plusquamperfekt', /bin gegangen/.test(text(result.blocks)) && !/war gegangen/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Plusquamperfekt').then((result) => {
  ok('"Plusquamperfekt" does not stop at "Perfekt"', /war gegangen/.test(text(result.blocks)) && !/bin gegangen/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Konjunktiv I').then((result) => {
  ok('"Konjunktiv I" is the Konjunktiv I', /"caption":"Konjunktiv I"/.test(text(result.blocks)) && /gehest/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Konjunktiv 2').then((result) => {
  ok('"Konjunktiv 2" is the Konjunktiv II', /"caption":"Konjunktiv II"/.test(text(result.blocks)) && /ginge/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Konjunktiv II mit würde').then((result) => {
  ok('"Konjunktiv II mit würde" is the würde-form', /würde gehen/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Futur II').then((result) => {
  ok('"Futur II" does not stop at "Futur"', /werde gegangen sein/.test(text(result.blocks)) && !/werde gehen\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere gehen im Futur').then((result) => {
  ok('"Futur" is the Futur I', /werde gehen/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('konjugiere fahren im Präsens').then((result) => {
  ok('"Präsens" is the present', /fährst/.test(text(result.blocks)) && !/fuhr/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('conjugate fahren in the simple past').then((result) => {
  ok('"simple past" is the Präteritum', /\bfuhr\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('conjugate fahren in the present perfect').then((result) => {
  ok('"present perfect" is the Perfekt', /bin gefahren/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('conjugate fahren in the past perfect').then((result) => {
  ok('"past perfect" is the Plusquamperfekt', /war gefahren/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('conjugate fahren in the future perfect').then((result) => {
  ok('"future perfect" is the Futur II', /werde gefahren sein/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('conjugate haben in the subjunctive').then((result) => {
  ok('"subjunctive" is the Konjunktiv II', /hätte/.test(text(result.blocks)) && /"caption":"Konjunktiv II/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(de('how do you say haben in the past tense').then((result) => {
  const body = text(result.blocks);
  ok('a verb with a tense cue gets that verb', /\*\*haben\*\*/.test(body), body.slice(0, 120));
  ok('and the past is the Präteritum', /\bhatte\b/.test(body), body.slice(0, 300));
}));

// --- a tense and a person together give one form ---------------------------
results.push(de('konjugiere sein im Präsens, wir').then((result) => {
  ok('tense + person gives the single form', /\*\*sind\*\*: wir, Präsens von \*sein\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere haben im Konjunktiv II, du').then((result) => {
  ok('"Konjunktiv II" with du', /\*\*hättest\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere geben im Präsens, er').then((result) => {
  ok('er is the third person', /\*\*gibt\*\*: er \/ sie \/ es/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('konjugiere aufstehen im Perfekt, ich').then((result) => {
  ok('a separable verb gives its single compound form', /\*\*bin aufgestanden\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- a tense named on its own -------------------------------------------------
results.push(de('das Präteritum').then((result) => {
  ok('a tense with a note of its own gets the note', result.confident && /### Perfekt und Präteritum/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(de('tell me about the present tense').then((result) => {
  const body = text(result.blocks);
  ok('a tense without a note is shown on the model verbs', result.confident && /model verbs/.test(body) && /mache/.test(body) && /gibt/.test(body) && /bringt/.test(body), body.slice(0, 300));
}));
results.push(de('das Futur II').then((result) => {
  const body = text(result.blocks);
  ok('a tense with a note of its own gets the note', result.confident && /Futur II/.test(body), body.slice(0, 160));
}));

// --- form lookup -----------------------------------------------------------
results.push(de('welche Form ist sang').then((result) => {
  ok('sang is the Präteritum of singen', /Präteritum von \*singen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(de('what form is wäre').then((result) => {
  ok('wäre is the Konjunktiv II of sein', /Konjunktiv II \(would, were\) of \*sein\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(de('welche Form ist gegeben').then((result) => {
  ok('gegeben is the Partizip II of geben', /Partizip II von \*geben\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(de('welche Form ist aufgestanden').then((result) => {
  ok('aufgestanden is aufstehen', /\*aufstehen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(de('welche Form ist gib').then((result) => {
  const body = text(result.blocks);
  ok('an imperative is labelled, not "undefined"', /du, Imperativ von \*geben\*/.test(body) && !/undefined/.test(body), body.slice(0, 300));
}));
results.push(de('gingen').then((result) => {
  ok('a bare form is identified', /\*gehen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(de('brächte').then((result) => {
  const body = text(result.blocks);
  ok('brächte is bringen', /\*bringen\*/.test(body), body.slice(0, 200));
}));

// --- the answer follows the language of the question -----------------------
results.push(de('der Konjunktiv').then((result) => {
  ok('a German question is answered in German', result.language === 'de');
}));
results.push(de('what is the subjunctive').then((result) => {
  ok('an English question is answered in English', result.language === 'en');
}));
results.push(de('der Konjunktiv', { language: 'en', force: true }).then((result) => {
  ok('force pins the answer language', result.language === 'en');
}));

// --- topic keywords that are verbs do not swallow a conjugation request -----
const verbKeywords = [...new Set(PACK.TOPICS.flatMap((topic) => topic.keywords)
  .filter((keyword) => !keyword.includes(' ') && PACK.KNOWN_VERBS.has(keyword)))];
ok('some topic keywords are verb names', verbKeywords.length >= 5, verbKeywords.join(', '));
for (const verb of verbKeywords) {
  results.push(de(`konjugiere ${verb}`).then((result) => {
    const body = text(result.blocks);
    ok(`"konjugiere ${verb}" is a table, not the note`, !body.startsWith('###') && body.includes(`**${verb}**`) && /"type":"table"/.test(body), body.slice(0, 120));
  }));
  results.push(de(`conjugate ${verb} in the present`).then((result) => {
    ok(`"conjugate ${verb} in the present" is a table`, /"type":"table"/.test(text(result.blocks)), text(result.blocks).slice(0, 120));
  }));
}

// --- out of scope ----------------------------------------------------------
results.push(de('who won the world cup in 1998').then((result) => {
  ok('declines what it cannot ground', result.confident === false);
  ok('and says so rather than guessing', /outside what I cover|kann ich dir nicht helfen/i.test(text(result.blocks)));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and offers rephrasings', suggestions.length >= 3 && suggestions.some((item) => /^what does .* mean$/.test(item)), suggestions.join(' | '));
}));
results.push(de('wer hat 1998 die Weltmeisterschaft gewonnen').then((result) => {
  ok('declines in German', result.confident === false && /kann ich dir nicht helfen/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and the rephrasings are German', suggestions.some((item) => /^was bedeutet /.test(item)) && suggestions.some((item) => /auf Deutsch$/.test(item)), suggestions.join(' | '));
}));
results.push(de('ist schwimmen ein schönes Verb?').then((result) => {
  ok('an unanswered question naming a verb suggests its table', result.confident || (result.blocks.find((block) => block.type === 'suggestions')?.items ?? []).includes('konjugiere schwimmen'), text(result.blocks).slice(0, 200));
}));

// --- the packs stay apart ---------------------------------------------------
results.push(answer('ser y estar', { study: 'es' }).then((result) => {
  ok('the Spanish pack still answers Spanish questions', /ser/i.test(text(result.blocks)) && result.confident);
}));
results.push(de('essere o avere').then((result) => {
  ok('and German mode does not answer Italian ones', result.confident === false, text(result.blocks).slice(0, 120));
}));

// --- "to eat in German": a vocabulary question with no verb asking for one
for (const [question, pattern, why] of [
  ['to eat in german', /essen/i, 'the gloss index answers it'],
  ['to speak in german', /sprechen/i, 'another verb'],
  ['to eat', /essen/i, 'without the direction named'],
  ['to get up', /aufstehen/i, 'a separable verb'],
]) {
  results.push(de(question).then((result) => {
    ok(`"${question}" is grounded (${why})`, result.confident, text(result.blocks).slice(0, 90));
    ok(`"${question}" names the verb`, pattern.test(text(result.blocks)), text(result.blocks).slice(0, 90));
  }));
}

await Promise.all(results);

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} German tutor checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} German tutor checks passed`);
