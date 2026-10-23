/**
 * Intent routing and the conjugated-form index, Italian side.
 *
 * The routing itself is shared with the Spanish and French tutors — these
 * checks exist to prove the Italian pack drives it correctly, not to re-test
 * the router. Only the offline paths are covered; dictionary and translation
 * answers need the server.
 */

// lib/study.js reads the page's location when it loads, and the tests run in
// Node. A minimal stand-in, set before the tutor is imported — which is why the
// import below is dynamic rather than a static one hoisted above this line.
globalThis.window ??= { location: { pathname: '/it' } };
globalThis.document ??= { documentElement: { dataset: {} } };

const { answer, detectLanguage, getFormIndex } = await import('../public/js/lib/tutor.js');

let checked = 0;
const failures = [];

function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

function text(blocks) {
  return blocks.map((block) => (block.type === 'md' ? block.text : JSON.stringify(block))).join('\n');
}

// Everything here asks the Italian pack explicitly: the study language is a
// browser setting, and the tests run in Node.
const it = (question, options = {}) => answer(question, { study: 'it', ...options });

// --- language detection ----------------------------------------------------
ok('detects English', detectLanguage('what does magari mean', null, 'it') === 'en');
ok('detects Italian', detectLanguage('cosa vuol dire magari', null, 'it') === 'it');
ok('detects Italian from accents alone', detectLanguage('già?', null, 'it') === 'it');

// --- the form index --------------------------------------------------------
const index = getFormIndex('it');
ok('index is populated', index.size > 3000, `${index.size} forms`);
ok('index has parla', index.get('parla')?.some((e) => e.verb === 'parlare'));
ok('index has fecero', index.get('fecero')?.some((e) => e.verb === 'fare'));
ok('index has fummo', index.get('fummo')?.some((e) => e.verb === 'essere'));
ok('index has bevevamo', index.get('bevevamo')?.some((e) => e.verb === 'bere'));
ok('index has voluto', index.get('voluto')?.some((e) => e.verb === 'volere'));
ok('index has preso', index.get('preso')?.some((e) => e.verb === 'prendere'));
ok('index has finisco', index.get('finisco')?.some((e) => e.verb === 'finire'));
ok('index is accent-insensitive', index.get('saro')?.some((e) => e.verb === 'essere'), 'sarò should be findable unaccented');
ok('formal imperative has a label', (index.get('venga') ?? []).every((e) => !e.person || e.person !== 'lei' || e.label));

// --- routing ---------------------------------------------------------------
const cases = [
  ['ciao', /coniugare|hello/i, 'greeting'],
  ['aiuto', /coniugare/i, 'capabilities in Italian'],
  ['help', /conjugate/i, 'capabilities in English'],

  ['essere o avere', /essere|avere/i, 'essere/avere topic'],
  ['il congiuntivo', /congiuntivo|subjunctive/i, 'subjunctive topic'],
  ['quando si usa il congiuntivo', /congiuntivo|subjunctive/i, 'subjunctive, asked as a question'],
  ['what is the difference between sapere and conoscere', /sapere/i, 'sapere/conoscere topic'],
  ['passato prossimo e imperfetto', /imperfetto/i, 'past tenses topic'],
  ['ci e ne', /\bci\b|\bne\b/i, 'ci/ne topic'],
  ['la negazione', /non .*mai|negat/i, 'negation topic'],
  ['preposizioni articolate', /nella|sul/i, 'articulated prepositions topic'],
  ['il partitivo', /partitivo|partitive/i, 'partitive topic'],
  ['glielo', /glielo/i, 'combined pronouns topic'],
  ['tu o Lei', /dare del tu/i, 'tu/Lei topic'],
  ['mi piace o mi piacciono', /piacciono/i, 'piacere topic'],
  ['periodo ipotetico', /avessi/i, 'se clauses topic'],
  ['explain double consonants', /double|doppie/i, 'double consonants topic, asked in English'],
  ['da o per', /da due anni/i, 'da/per topic'],
  ['comparativi', /più/i, 'comparatives topic'],
  ['futuro di probabilità', /futuro di probabilità/i, 'future of probability'],

  ['coniuga prendere', /prendere/i, 'conjugation'],
  ['coniuga partire', /partire/i, 'conjugation of an -ire verb'],
  ['coniugazione di fare', /fare/i, 'conjugation with "di"'],
  ['conjugate vendere', /vendere/i, 'conjugation asked in English'],
  ['finire conjugation', /finire/i, 'verb-first'],
  ['andare', /andare/i, 'a bare infinitive'],
  ['il verbo bere', /bere/i, 'explicit verb marker'],
];

const results = [];
for (const [question, pattern, label] of cases) {
  results.push(it(question).then((result) => {
    ok(`routes "${question}" (${label})`, pattern.test(text(result.blocks)),
      `got: ${text(result.blocks).slice(0, 120)}`);
    ok(`"${question}" is grounded`, result.confident);
  }));
}

// --- the headline names the conjugation and the auxiliary -------------------
results.push(it('coniuga andare').then((result) => {
  const body = text(result.blocks);
  ok('andare is first conjugation', /prima coniugazione/.test(body), body.slice(0, 160));
  ok('and says it takes essere', /essere/.test(body), body.slice(0, 160));
}));
results.push(it('coniuga finire').then((result) => {
  ok('finire mentions -isc-', /isc/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- a named verb plus a cue about forms beats a general topic -------------
results.push(it('come si dice prendere al passato prossimo').then((result) => {
  const body = text(result.blocks);
  ok('a verb with a tense cue gets that verb', /prendere/i.test(body), body.slice(0, 120));
  ok('and it is the tense that was asked for', /passato prossimo/i.test(body), body.slice(0, 200));
}));

// --- a tense and a person together give one form ---------------------------
results.push(it('coniuga essere al futuro, noi').then((result) => {
  ok('tense + person gives the single form', /saremo/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(it('coniuga avere al congiuntivo presente, loro').then((result) => {
  ok('"congiuntivo presente" is not read as the indicative', /abbiano/.test(text(result.blocks)),
    text(result.blocks).slice(0, 160));
}));

// --- form lookup -----------------------------------------------------------
results.push(it('che forma è «fecero»').then((result) => {
  const body = text(result.blocks);
  ok('identifies a passato remoto form', /fare/i.test(body), body.slice(0, 160));
}));
results.push(it('che forma è «venga»').then((result) => {
  const body = text(result.blocks);
  ok('a formal imperative is labelled, not "undefined"', /venire/i.test(body) && !/undefined/.test(body), body.slice(0, 200));
}));

// --- the answer follows the language of the question -----------------------
results.push(it('il congiuntivo').then((result) => {
  ok('an Italian question is answered in Italian', result.language === 'it');
}));
results.push(it('what is the subjunctive').then((result) => {
  ok('an English question is answered in English', result.language === 'en');
}));
results.push(it('il congiuntivo', { language: 'en', force: true }).then((result) => {
  ok('force pins the answer language', result.language === 'en');
}));

// --- out of scope ----------------------------------------------------------
results.push(it('who won the world cup in 1998').then((result) => {
  ok('declines what it cannot ground', result.confident === false);
  ok('and says so rather than guessing', /outside what I cover|non posso aiutarti/i.test(text(result.blocks)));
}));

// --- the packs stay apart ---------------------------------------------------
results.push(answer('ser y estar', { study: 'es' }).then((result) => {
  ok('the Spanish pack still answers Spanish questions', /ser/i.test(text(result.blocks)) && result.confident);
}));
results.push(it('ser y estar').then((result) => {
  ok('and Italian mode does not answer them', result.confident === false,
    text(result.blocks).slice(0, 120));
}));

// --- "to eat in Italian": a vocabulary question with no verb asking for one --
for (const [question, pattern, why] of [
  ['to eat in italian', /mangiare/i, 'the gloss index answers it'],
  ['to speak in italian', /parlare/i, 'another verb'],
  ['to eat', /mangiare/i, 'without the direction named'],
]) {
  results.push(it(question).then((result) => {
    ok(`"${question}" is grounded — ${why}`, result.confident, text(result.blocks).slice(0, 90));
    ok(`"${question}" names the verb`, pattern.test(text(result.blocks)), text(result.blocks).slice(0, 90));
  }));
}

await Promise.all(results);

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Italian tutor checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Italian tutor checks passed`);
