/**
 * Intent routing and the conjugated-form index, Dutch side.
 *
 * The routing itself is shared with the other tutors; these checks exist to
 * prove the Dutch pack drives it correctly, not to re-test the router. Only
 * the offline paths are covered: dictionary and translation answers need the
 * server, so for those only the intent patterns are checked.
 */

// lib/study.js reads the page's location when it loads, and the tests run in
// Node. A minimal stand-in, set before the tutor is imported, which is why the
// import below is dynamic rather than a static one hoisted above this line.
globalThis.window ??= { location: { pathname: '/nl' } };
globalThis.document ??= { documentElement: { dataset: {} } };

const { answer, detectLanguage, getFormIndex, activePack } = await import('../public/js/lib/tutor.js');
const { PACK } = await import('../public/js/lib/tutor-nl.js');
const { conjugate } = await import('../public/js/lib/conjugator-nl.js');

let checked = 0;
const failures = [];

function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

function text(blocks) {
  return blocks.map((block) => (block.type === 'md' ? block.text : JSON.stringify(block))).join('\n');
}

// Everything here asks the Dutch pack explicitly: the study language is a
// browser setting, and the tests run in Node.
const nl = (question, options = {}) => answer(question, { study: 'nl', ...options });

// --- the pack is wired -----------------------------------------------------
ok('the router holds the Dutch pack', activePack('nl') === PACK && PACK?.code === 'nl');

// --- language detection ----------------------------------------------------
ok('detects English', detectLanguage('what does gezellig mean', null, 'nl') === 'en');
ok('detects Dutch', detectLanguage('wat betekent gezellig', null, 'nl') === 'nl');
ok('detects Dutch from a trema alone', detectLanguage('geëindigd?', null, 'nl') === 'nl');
ok('detects Dutch from "de of het"', detectLanguage('de of het', null, 'nl') === 'nl');
ok('detects Dutch from "hoe zeg je"', detectLanguage('hoe zeg je "I\'m tired" in het Nederlands', null, 'nl') === 'nl');
ok('an English article is not Dutch', detectLanguage('what is a verb', null, 'nl') === 'en');
ok('"is" and "in" decide nothing', detectLanguage('is in', 'en', 'nl') === 'en');

// --- the form index --------------------------------------------------------
const index = getFormIndex('nl');
ok('index is populated', index.size > 2500, `${index.size} forms`);
ok('ging is gaan', index.get('ging')?.some((e) => e.verb === 'gaan' && e.tense === 'ovt' && e.person === 'ik'));
ok('liep is lopen', index.get('liep')?.some((e) => e.verb === 'lopen' && e.tense === 'ovt'));
ok('gewerkt is a participle', index.get('gewerkt')?.some((e) => e.verb === 'werken' && e.mood === 'vormen'));
ok('opgebeld is a participle of opbellen', index.get('opgebeld')?.some((e) => e.verb === 'opbellen' && e.mood === 'vormen'));
ok('kwamen is komen', index.get('kwamen')?.some((e) => e.verb === 'komen' && e.person === 'wij' && e.tense === 'ovt'));
ok('werkte is werken', index.get('werkte')?.some((e) => e.verb === 'werken' && e.tense === 'ovt'));
ok('was is zijn', index.get('was')?.some((e) => e.verb === 'zijn' && e.tense === 'ovt'));
ok('waren is zijn', index.get('waren')?.some((e) => e.verb === 'zijn' && e.person === 'wij'));
ok('werkt is werken, present', index.get('werkt')?.some((e) => e.verb === 'werken' && e.tense === 'ott' && e.person === 'jij'));
ok('werkend is the present participle', index.get('werkend')?.some((e) => e.verb === 'werken' && e.mood === 'vormen'));
ok('wees is the imperative of zijn', index.get('wees')?.some((e) => e.verb === 'zijn' && e.mood === 'imperatief'));
ok('the u imperative has a label', PACK.PERSON_LABELS.u === 'u');
ok('the separable finite forms are not indexed', !index.has('bel op') && !index.get('bel')?.some((e) => e.verb === 'opbellen'));
ok('no compound form was indexed', [...index.keys()].every((key) => !key.includes(' ')));
ok('index is accent-insensitive', index.get('geeindigd')?.some((e) => e.verb === 'eindigen'), 'geëindigd should be findable unaccented');

// --- every tense the pack names exists in the engine's table ---------------
const werken = conjugate('werken');
for (const key of Object.keys(PACK.TENSE_LABELS)) {
  const [mood, tense] = key.split('.');
  ok(`${key} exists in the table`, typeof werken.table[mood]?.[tense]?.ik === 'string');
  ok(`${key} has both names`, typeof PACK.TENSE_LABELS[key].nl === 'string' && typeof PACK.TENSE_LABELS[key].en === 'string');
}
ok('INDEX_TENSES holds only the one-word tenses', PACK.INDEX_TENSES.join() === 'indicatief.ott,indicatief.ovt');
for (const key of PACK.DEFAULT_TENSES) ok(`default tense ${key} is labelled`, Boolean(PACK.TENSE_LABELS[key]));
for (const verb of PACK.MODEL_VERBS) ok(`model verb ${verb} conjugates`, conjugate(verb).ok);
ok('the shape names the engine\'s table', werken.table[PACK.shape.nonFinite]?.[PACK.shape.participle] === 'gewerkt'
  && werken.table[PACK.shape.imperative]?.[PACK.shape.affirmative]?.jij === 'werk');

// --- no reader-visible text carries an em dash or a middle dot --------------
const visible = [
  PACK.capabilities('nl'), PACK.capabilities('en'), PACK.outOfScope('nl', ''), PACK.outOfScope('en', ''),
  ...Object.values(PACK.labels).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.TENSE_LABELS).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.FORM_LABELS).flatMap((label) => Object.values(label)),
  ...PACK.REPHRASE.nl.examples, ...PACK.REPHRASE.en.examples,
  PACK.verbHeadline(conjugate('opbellen'), 'to phone', '', 'nl'), PACK.verbHeadline(conjugate('aankomen'), 'to arrive', '', 'en'),
].join('\n');
ok('no em dashes or middle dots in the tutor\'s own words', !/[—·]/.test(visible));
ok('capabilities list the grammar notes by title', /de en het/i.test(PACK.capabilities('nl')) && /niet vs\. geen/i.test(PACK.capabilities('en')));
ok('capabilities name every note', PACK.TOPICS.every((topic) => PACK.capabilities('en').toLowerCase().includes(topic.title.en.toLowerCase())));

// --- the intents that need the server, checked as patterns only -------------
ok('"wat betekent gezellig" is a definition request', PACK.INTENTS.define.exec('wat betekent gezellig')?.[1] === 'gezellig');
ok('"what does gezellig mean" is a definition request', PACK.INTENTS.define.exec('what does gezellig mean')?.[1] === 'gezellig');
ok('"betekenis van gezellig" is a definition request', PACK.INTENTS.define.exec('betekenis van gezellig')?.[1] === 'gezellig');
const translate = PACK.INTENTS.translateInto.exec('hoe zeg je "I\'m tired" in het Nederlands');
ok('"hoe zeg je … in het Nederlands" is a translation request', translate?.[1] === "I'm tired");
ok('and goes into Dutch', PACK.INTENTS.intoStudyLanguage.test('hoe zeg je "I\'m tired" in het Nederlands') && !PACK.INTENTS.intoEnglishLanguage.test('hoe zeg je "I\'m tired" in het Nederlands'));
ok('"hoe zeg je moe in het Engels" goes the other way', PACK.INTENTS.intoEnglishLanguage.test('hoe zeg je moe in het Engels'));
ok('"how do you say thanks in dutch" is a translation request', PACK.INTENTS.translateInto.exec('how do you say thanks in dutch')?.[1] === 'thanks');
ok('"vertaal goedemorgen" is a translation request', PACK.INTENTS.translateAny.exec('vertaal goedemorgen')?.[1] === 'goedemorgen');
ok('"moe in het engels" is a phrase into English', PACK.INTENTS.intoEnglish.exec('moe in het engels')?.[1] === 'moe');
ok('"tired in dutch" is a phrase into Dutch', PACK.INTENTS.intoStudy.exec('tired in dutch')?.[1] === 'tired');
ok('"welke vorm is «ging»" is a form question', PACK.INTENTS.whatForm.exec('welke vorm is «ging»')?.[1] === 'ging');
ok('"wat is de vorm van ging" is a form question', PACK.INTENTS.whatForm.exec('wat is de vorm van ging')?.[1] === 'ging');
ok('"vervoeg gaan in de verleden tijd" names gaan', PACK.INTENTS.conjugate.exec('vervoeg gaan in de verleden tijd')?.[1] === 'gaan');
ok('"hoe vervoeg je lopen" names lopen', PACK.INTENTS.conjugate.exec('hoe vervoeg je lopen')?.[1] === 'lopen');
ok('"vervoeging van zijn" names zijn', PACK.INTENTS.conjugate.exec('vervoeging van zijn')?.[1] === 'zijn');
ok('"vervoeg het werkwoord komen" names komen', PACK.INTENTS.conjugate.exec('vervoeg het werkwoord komen')?.[1] === 'komen');
ok('"vervoeg zich herinneren" keeps the zich', PACK.INTENTS.conjugate.exec('vervoeg zich herinneren')?.[1] === 'zich herinneren');
ok('"lopen vervoeging" is verb-first', PACK.INTENTS.conjugateTrailing.exec('lopen vervoeging')?.[1] === 'lopen');
ok('HELP matches help, hulp and wat kun je', PACK.HELP.test('help') && PACK.HELP.test('hulp') && PACK.HELP.test('wat kun je'));
ok('INFINITIVE accepts gaan, zijn, skiën and werken', ['gaan', 'zijn', 'skiën', 'werken'].every((verb) => PACK.INFINITIVE.test(verb)) && !PACK.INFINITIVE.test('gezellig'));
ok('LEADING_ARTICLE strips de, het and een', ['de ', 'het ', 'een ', 'the '].every((article) => PACK.LEADING_ARTICLE.test(`${article}x`)));

// --- routing ---------------------------------------------------------------
const cases = [
  ['hallo', /vervoegen|conjugate/i, 'greeting'],
  ['goedemorgen', /vervoegen|conjugate/i, 'greeting, one word'],
  ['bedankt', /graag gedaan|welcome/i, 'thanks'],
  ['hulp', /vervoegen/i, 'capabilities in Dutch'],
  ['help', /conjugate/i, 'capabilities in English'],
  ['wat kun je', /vervoegen/i, 'capabilities, asked as a question'],

  ['de of het', /de en het|de vs\. het/i, 'de/het topic'],
  ['wanneer gebruik je de of het', /de en het/i, 'de/het asked as a question'],
  ['when do i use het', /de vs\. het/i, 'de/het in English'],
  ["'t kofschip", /kofschip/i, "'t kofschip topic"],
  ['het kofschip', /kofschip/i, 'kofschip with the article'],
  ['the regular past', /kofschip/i, 'kofschip in English'],
  ['hebben of zijn', /hebben en zijn/i, 'hebben/zijn topic'],
  ['wat is het verschil tussen hebben en zijn', /hebben en zijn/i, 'hebben/zijn as a question'],
  ['which auxiliary do i use', /hebben vs\. zijn/i, 'hebben/zijn in English'],
  ['woordvolgorde', /woordvolgorde/i, 'word order topic'],
  ['word order in subordinate clauses', /word order/i, 'word order in English'],
  ['where does the verb go', /word order/i, 'word order as a question'],
  ['niet of geen', /niet en geen/i, 'niet/geen topic'],
  ['when do i use geen', /niet vs\. geen/i, 'niet/geen in English'],
  ['scheidbare werkwoorden', /scheidbare/i, 'separable verbs topic'],
  ['separable verbs', /separable/i, 'separable verbs in English'],
  ['omdat of want', /omdat en want/i, 'omdat/want topic'],
  ['difference between omdat and want', /omdat and want/i, 'omdat/want in English'],
  ['erop', /erop, daarmee/i, 'er topic, one word'],
  ['het woordje er', /er, erop/i, 'er topic'],
  ['when do i use er', /er, and erop/i, 'er in English'],
  ['verkleinwoorden', /verkleinwoorden/i, 'diminutives topic'],
  ['diminutives', /diminutives/i, 'diminutives in English'],
  ['kennen of weten', /kennen en weten/i, 'kennen/weten topic'],
  ['kennen vs weten', /kennen/i, 'kennen/weten with vs'],
  ['het meervoud', /meervoud/i, 'plurals topic'],
  ['de modale werkwoorden', /modale werkwoorden/i, 'modal verbs topic'],
  ['the passive', /passive/i, 'passive in English'],
  ['perfectum of imperfectum', /perfectum/i, 'perfectum/imperfectum topic'],

  ['vervoeg werken', /werken/i, 'conjugation'],
  ['vervoeg spelen', /speel/i, 'conjugation of a -de verb'],
  ['vervoeging van zijn', /\bben\b/i, 'conjugation with "van"'],
  ['conjugate lopen', /liep/i, 'conjugation asked in English'],
  ['lopen vervoeging', /liep/i, 'verb-first'],
  ['gaan', /ging/i, 'a bare infinitive'],
  ['het werkwoord komen', /kwam/i, 'explicit verb marker'],
  ['vervoeg zich herinneren', /herinner/i, 'a reflexive'],
  ['vervoeg opbellen', /bel op/i, 'a separable verb'],
];

const results = [];
for (const [question, pattern, label] of cases) {
  results.push(nl(question).then((result) => {
    ok(`routes "${question}" (${label})`, pattern.test(text(result.blocks)),
      `got: ${text(result.blocks).slice(0, 120)}`);
    ok(`"${question}" is grounded`, result.confident);
  }));
}

// --- the starter questions of the chat page --------------------------------
results.push(nl('de of het').then((result) => {
  const body = text(result.blocks);
  ok('starter: "de of het" is the de-het note', /^### De en het/m.test(body), body.slice(0, 120));
}));
results.push(nl('vervoeg gaan in de verleden tijd').then((result) => {
  const body = text(result.blocks);
  ok('starter: "vervoeg gaan in de verleden tijd" is gaan', /\*\*gaan\*\*/.test(body), body.slice(0, 160));
  ok('and the tense is the o.v.t.', /verleden tijd \(imperfectum\)/.test(body) && /\bging\b/.test(body) && !/\bgaat\b/.test(body), body.slice(0, 400));
  ok('and it is one table', (body.match(/"type":"table"/g) ?? []).length === 1, body.slice(0, 400));
}));
results.push(nl('welke vorm is «ging»').then((result) => {
  const body = text(result.blocks);
  ok('starter: "welke vorm is «ging»" is gaan', /\*gaan\*/.test(body), body.slice(0, 160));
  ok('and says ik, verleden tijd', /ik, verleden tijd \(imperfectum\) van \*gaan\*/.test(body), body.slice(0, 200));
  ok('and nothing is undefined', !/undefined/.test(body));
}));
ok('starter: "wat betekent gezellig" is a dictionary request', PACK.INTENTS.define.exec('wat betekent gezellig')?.[1] === 'gezellig');
ok('starter: "hoe zeg je …" is a translation request', PACK.INTENTS.translateInto.exec('hoe zeg je "I\'m tired" in het Nederlands')?.[1] === "I'm tired");

// --- the headline names the class ------------------------------------------
results.push(nl('vervoeg werken').then((result) => {
  const body = text(result.blocks);
  ok('werken is a weak verb in -te', /Zwak werkwoord \(-te\)/.test(body), body.slice(0, 160));
  ok('the default tenses are shown', /tegenwoordige tijd \(presens\)/.test(body) && /verleden tijd \(imperfectum\)/.test(body) && /voltooid tegenwoordige tijd \(perfectum\)/.test(body), body.slice(0, 600));
  ok('and the perfect is there', /heb gewerkt/.test(body), body.slice(0, 600));
}));
results.push(nl('conjugate spelen').then((result) => {
  ok('spelen is a weak verb in -de, with its spelling', /A weak verb \(-de\), spelling e → ee/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('conjugate kijken').then((result) => {
  ok('kijken is a strong verb', /A strong verb\./.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('vervoeg zijn').then((result) => {
  ok('zijn is an irregular verb that takes zijn', /Onregelmatig werkwoord, hulpwerkwoord \*zijn\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('conjugate begrijpen').then((result) => {
  ok('begrijpen is conjugated like grijpen', /conjugated like \*grijpen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('vervoeg opbellen').then((result) => {
  const body = text(result.blocks);
  ok('opbellen is separable on op', /scheidbaar: \*op\*/.test(body), body.slice(0, 160));
  ok('and its perfect is opgebeld', /heb opgebeld/.test(body), body.slice(0, 600));
}));
results.push(nl('vervoeg aankomen').then((result) => {
  const body = text(result.blocks);
  ok('aankomen takes zijn and follows komen', /vervoegt als \*komen\*/.test(body) && /hulpwerkwoord \*zijn\*/.test(body), body.slice(0, 160));
}));
results.push(nl('conjugate brengen').then((result) => {
  ok('brengen is a mixed verb, irregular', /A mixed verb, irregular/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('vervoeg leven').then((result) => {
  ok('leven names its spelling', /spelling e → ee, v → f/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
ok('zijn, gaan and komen are hairy', PACK.isHairy(conjugate('zijn')) && PACK.isHairy(conjugate('gaan')) && PACK.isHairy(conjugate('komen')));
ok('hebben, werken and aankomen are not', !PACK.isHairy(conjugate('hebben')) && !PACK.isHairy(conjugate('werken')) && !PACK.isHairy(conjugate('aankomen')));

// --- a tense named with the verb ---------------------------------------------
results.push(nl('vervoeg zijn in de verleden tijd').then((result) => {
  const body = text(result.blocks);
  ok('a named tense is the only table', /\bwas\b/.test(body) && !/\bben\b/.test(body), body.slice(0, 300));
}));
results.push(nl('vervoeg werken in de voltooid verleden tijd').then((result) => {
  const body = text(result.blocks);
  ok('"voltooid verleden tijd" is the v.v.t.', /had gewerkt/.test(body) && !/heb gewerkt/.test(body), body.slice(0, 300));
}));
results.push(nl('vervoeg werken in de voltooid tegenwoordige tijd').then((result) => {
  const body = text(result.blocks);
  ok('"voltooid tegenwoordige tijd" is the v.t.t.', /heb gewerkt/.test(body) && !/\bwerk\b/.test(body), body.slice(0, 300));
}));
results.push(nl('vervoeg werken in het perfectum').then((result) => {
  const body = text(result.blocks);
  ok('"perfectum" is the v.t.t. and "het" is no person', /heb gewerkt/.test(body) && /"type":"table"/.test(body), body.slice(0, 300));
}));
results.push(nl('vervoeg werken in de tegenwoordige tijd').then((result) => {
  const body = text(result.blocks);
  ok('"tegenwoordige tijd" is the o.t.t.', /\bwerkt\b/.test(body) && !/werkte/.test(body), body.slice(0, 300));
}));
results.push(nl('vervoeg gaan in de toekomende tijd').then((result) => {
  ok('"toekomende tijd" is the future', /zal gaan/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(nl('conjugate gaan in the conditional').then((result) => {
  ok('the conditional is zou + infinitive', /zou gaan/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(nl('vervoeg leven in de aanvoegende wijs').then((result) => {
  ok('the subjunctive is leve', /\bleve\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(nl('conjugate werken in the past perfect').then((result) => {
  ok('the past perfect is the v.v.t.', /had gewerkt/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(nl('conjugate werken in the present perfect').then((result) => {
  ok('the present perfect is the v.t.t.', /heb gewerkt/.test(text(result.blocks)) && !/had gewerkt/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(nl('how do you say gaan in the past tense').then((result) => {
  const body = text(result.blocks);
  ok('a verb with a tense cue gets that verb', /\*\*gaan\*\*/.test(body) && /\bging\b/.test(body), body.slice(0, 300));
}));

// --- a tense and a person together give one form ---------------------------
results.push(nl('vervoeg zijn in de verleden tijd, wij').then((result) => {
  ok('tense + person gives the single form', /\*\*waren\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('vervoeg hebben in de tegenwoordige tijd, hij').then((result) => {
  ok('hij gives heeft', /\*\*heeft\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('conjugate komen in the past, they').then((result) => {
  ok('they is the plural', /\*\*kwamen\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('vervoeg komen in de verleden tijd, zij').then((result) => {
  ok('zij alone is the singular', /\*\*kwam\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('hoe vervoeg je gaan in de verleden tijd').then((result) => {
  ok('"je" in "hoe vervoeg je" is no person', /"type":"table"/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- a tense named on its own -------------------------------------------------
results.push(nl('de tegenwoordige tijd').then((result) => {
  ok('a tense alone is shown on the model verbs', result.confident && /\bwerkt\b/.test(text(result.blocks)) && /kijken/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('de aanvoegende wijs').then((result) => {
  ok('the subjunctive is shown on the model verbs', result.confident && /\bwerke\b/.test(text(result.blocks)) && /\bkijke\b/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('de voltooid verleden tijd').then((result) => {
  ok('a tense with a note of its own gets the note', result.confident && /^### /.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('tell me about the present tense').then((result) => {
  ok('the present tense is shown or explained', result.confident && /werkt|present/i.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(nl('de toekomende tijd').then((result) => {
  ok('the future has a note of its own', result.confident && /gaan en zullen/i.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- form lookup -----------------------------------------------------------
results.push(nl('welke vorm is liep').then((result) => {
  ok('liep is lopen', /verleden tijd \(imperfectum\) van \*lopen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(nl('what form is kwamen').then((result) => {
  ok('kwamen is komen', /wij, simple past \(o\.v\.t\.\) of \*komen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(nl('welke vorm is opgebeld').then((result) => {
  ok('opgebeld is the participle of opbellen', /voltooid deelwoord van \*opbellen\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(nl('welke vorm is wees').then((result) => {
  const body = text(result.blocks);
  ok('a u-less imperative is labelled, not "undefined"', /gebiedende wijs van \*zijn\*/.test(body) && !/undefined/.test(body), body.slice(0, 300));
}));
results.push(nl('waren').then((result) => {
  ok('a bare form is identified', /\*zijn\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));
results.push(nl('gewerkt').then((result) => {
  ok('a bare participle is identified', /voltooid deelwoord|past participle/.test(text(result.blocks)) && /\*werken\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));

// --- the answer follows the language of the question -----------------------
results.push(nl('de of het').then((result) => {
  ok('a Dutch question is answered in Dutch', result.language === 'nl');
}));
results.push(nl('what is the difference between de and het').then((result) => {
  ok('an English question is answered in English', result.language === 'en');
}));
results.push(nl('de of het', { language: 'en', force: true }).then((result) => {
  ok('force pins the answer language', result.language === 'en');
}));

// --- topic keywords that are verbs do not swallow a conjugation request -----
const verbKeywords = [...new Set(PACK.TOPICS.flatMap((topic) => topic.keywords)
  .filter((keyword) => !keyword.includes(' ') && PACK.KNOWN_VERBS.has(keyword)))];
ok('some topic keywords are verb names', verbKeywords.length >= 3, verbKeywords.join(', '));
for (const verb of verbKeywords) {
  results.push(nl(`vervoeg ${verb}`).then((result) => {
    const body = text(result.blocks);
    ok(`"vervoeg ${verb}" is a table, not the note`, !body.startsWith('###') && body.includes(`**${verb}**`) && /"type":"table"/.test(body), body.slice(0, 120));
  }));
  results.push(nl(`conjugate ${verb} in the present`).then((result) => {
    ok(`"conjugate ${verb} in the present" is a table`, /"type":"table"/.test(text(result.blocks)), text(result.blocks).slice(0, 120));
  }));
}

// --- out of scope ----------------------------------------------------------
results.push(nl('who won the world cup in 1998').then((result) => {
  ok('declines what it cannot ground', result.confident === false);
  ok('and says so rather than guessing', /outside what I cover|kan ik je niet mee helpen/i.test(text(result.blocks)));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and offers rephrasings', suggestions.length >= 3 && suggestions.some((item) => /^what does .* mean$/.test(item)), suggestions.join(' | '));
}));
results.push(nl('wie won het wk in 1998').then((result) => {
  ok('declines in Dutch', result.confident === false && /kan ik je niet mee helpen/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and the rephrasings are Dutch', suggestions.some((item) => /^wat betekent /.test(item)) && suggestions.some((item) => /in het Nederlands$/.test(item)), suggestions.join(' | '));
}));
results.push(nl('is zwemmen een mooi werkwoord?').then((result) => {
  ok('an unanswered question naming a verb suggests its table', result.confident || (result.blocks.find((block) => block.type === 'suggestions')?.items ?? []).includes('vervoeg zwemmen'), text(result.blocks).slice(0, 200));
}));

// --- the packs stay apart ---------------------------------------------------
results.push(answer('ser y estar', { study: 'es' }).then((result) => {
  ok('the Spanish pack still answers Spanish questions', /ser/i.test(text(result.blocks)) && result.confident);
}));
results.push(nl('essere o avere').then((result) => {
  ok('and Dutch mode does not answer Italian ones', result.confident === false, text(result.blocks).slice(0, 120));
}));

// --- "to eat in Dutch": a vocabulary question with no verb asking for one ---
for (const [question, pattern, why] of [
  ['to eat in dutch', /eten/i, 'the gloss index answers it'],
  ['to work in dutch', /werken/i, 'another verb'],
  ['to eat', /eten/i, 'without the direction named'],
  ['to say', /zeggen/i, 'read backwards from the gloss'],
]) {
  results.push(nl(question).then((result) => {
    ok(`"${question}" is grounded (${why})`, result.confident, text(result.blocks).slice(0, 90));
    ok(`"${question}" names the verb`, pattern.test(text(result.blocks)), text(result.blocks).slice(0, 90));
  }));
}

await Promise.all(results);

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Dutch tutor checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Dutch tutor checks passed`);
