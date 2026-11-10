/**
 * Intent routing and the conjugated-form index, Portuguese side.
 *
 * The routing itself is shared with the other tutors; these checks exist to
 * prove the Portuguese pack drives it correctly, not to re-test the router.
 * Only the offline paths are covered: dictionary and translation answers need
 * the server, so for those only the intent patterns are checked.
 */

// lib/study.js reads the page's location when it loads, and the tests run in
// Node. A minimal stand-in, set before the tutor is imported, which is why the
// import below is dynamic rather than a static one hoisted above this line.
globalThis.window ??= { location: { pathname: '/pt' } };
globalThis.document ??= { documentElement: { dataset: {} } };

const { answer, detectLanguage, getFormIndex, activePack } = await import('../public/js/lib/tutor.js');
const { PACK } = await import('../public/js/lib/tutor-pt.js');
const { conjugate } = await import('../public/js/lib/conjugator-pt.js');

let checked = 0;
const failures = [];

function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

function text(blocks) {
  return blocks.map((block) => (block.type === 'md' ? block.text : JSON.stringify(block))).join('\n');
}

// Everything here asks the Portuguese pack explicitly: the study language is a
// browser setting, and the tests run in Node.
const pt = (question, options = {}) => answer(question, { study: 'pt', ...options });

// --- the pack is wired -----------------------------------------------------
ok('the router holds the Portuguese pack', activePack('pt') === PACK && PACK?.code === 'pt');

// --- language detection ----------------------------------------------------
ok('detects English', detectLanguage('what does saudade mean', null, 'pt') === 'en');
ok('detects Portuguese', detectLanguage('o que significa saudade', null, 'pt') === 'pt');
ok('detects Portuguese from accents alone', detectLanguage('já?', null, 'pt') === 'pt');
ok('detects Portuguese from "e"', detectLanguage('ser e estar', null, 'pt') === 'pt');
ok('an English article is not Portuguese', detectLanguage('what is a verb', null, 'pt') === 'en');

// --- the form index --------------------------------------------------------
const index = getFormIndex('pt');
ok('index is populated', index.size > 15000, `${index.size} forms`);
ok('index has fala', index.get('fala')?.some((e) => e.verb === 'falar'));
ok('index has fizeram', index.get('fizeram')?.some((e) => e.verb === 'fazer' && e.person === 'eles' && e.tense === 'preteritoPerfeito'));
ok('index has falámos, unaccented', index.get('falamos')?.some((e) => e.verb === 'falar' && e.tense === 'preteritoPerfeito'));
ok('and falamos as the present too', index.get('falamos')?.some((e) => e.verb === 'falar' && e.tense === 'presente'));
ok('foram is ser', index.get('foram')?.some((e) => e.verb === 'ser'));
ok('foram is ir as well', index.get('foram')?.some((e) => e.verb === 'ir'));
ok('pusesse is pôr', index.get('pusesse')?.some((e) => e.verb === 'pôr' && e.mood === 'conjuntivo'));
ok('falarmos is the personal infinitive of falar', index.get('falarmos')?.some((e) => e.verb === 'falar' && e.mood === 'infinitivo' && e.tense === 'pessoal'));
ok('tiver is the futuro do conjuntivo of ter', index.get('tiver')?.some((e) => e.verb === 'ter' && e.tense === 'futuro' && e.mood === 'conjuntivo'));
ok('feito is a participle', index.get('feito')?.some((e) => e.verb === 'fazer' && e.mood === 'formas'));
ok('saindo is a gerund', index.get('saindo')?.some((e) => e.verb === 'sair' && e.mood === 'formas'));
ok('mantém is manter', index.get('mantem')?.some((e) => e.verb === 'manter'));
ok('index is accent-insensitive', index.get('sera')?.some((e) => e.verb === 'ser'), 'será should be findable unaccented');
ok('the você imperative has a label', (index.get('faca') ?? []).some((e) => e.person === 'voce') && PACK.PERSON_LABELS.voce === 'você');
ok('the vocês imperative has a label', PACK.PERSON_LABELS.voces === 'vocês');
ok('no compound form was indexed', [...index.keys()].every((key) => !key.includes(' ')));

// --- every tense the pack names exists in the engine's table ---------------
const falar = conjugate('falar');
for (const key of Object.keys(PACK.TENSE_LABELS)) {
  const [mood, tense] = key.split('.');
  ok(`${key} exists in the table`, falar.table[mood]?.[tense]?.eu !== undefined || falar.table[mood]?.[tense]?.ele !== undefined);
  ok(`${key} has both names`, typeof PACK.TENSE_LABELS[key].pt === 'string' && typeof PACK.TENSE_LABELS[key].en === 'string');
}
ok('INDEX_TENSES leaves out the compound tense', !PACK.INDEX_TENSES.includes('indicativo.perfeitoComposto') && PACK.INDEX_TENSES.includes('infinitivo.pessoal'));
for (const key of PACK.DEFAULT_TENSES) ok(`default tense ${key} is labelled`, Boolean(PACK.TENSE_LABELS[key]));
for (const verb of PACK.MODEL_VERBS) ok(`model verb ${verb} conjugates`, conjugate(verb).ok);

// --- no reader-visible text carries an em dash or a middle dot --------------
const visible = [
  PACK.capabilities('pt'), PACK.capabilities('en'), PACK.outOfScope('pt', ''), PACK.outOfScope('en', ''),
  ...Object.values(PACK.labels).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.TENSE_LABELS).flatMap((label) => Object.values(label)),
  ...Object.values(PACK.FORM_LABELS).flatMap((label) => Object.values(label)),
  ...PACK.REPHRASE.pt.examples, ...PACK.REPHRASE.en.examples,
].join('\n');
ok('no em dashes or middle dots in the tutor\'s own words', !/[—·]/.test(visible));
ok('capabilities list the grammar notes by title', /ser e estar/i.test(PACK.capabilities('pt')) && /por vs\. para/i.test(PACK.capabilities('en')));

// --- the intents that need the server, checked as patterns only -------------
const define = PACK.INTENTS.define.exec('o que significa saudade');
ok('"o que significa saudade" is a definition request', define?.[1] === 'saudade');
ok('"what does saudade mean" is a definition request', PACK.INTENTS.define.exec('what does saudade mean')?.[1] === 'saudade');
ok('"significado de saudade" is a definition request', PACK.INTENTS.define.exec('significado de saudade')?.[1] === 'saudade');
const translate = PACK.INTENTS.translateInto.exec('como se diz "I\'m tired" em português');
ok('"como se diz … em português" is a translation request', translate?.[1] === "I'm tired");
ok('and goes into Portuguese', PACK.INTENTS.intoStudyLanguage.test('como se diz "I\'m tired" em português') && !PACK.INTENTS.intoEnglishLanguage.test('como se diz "I\'m tired" em português'));
ok('"como se diz cansado em inglês" goes the other way', PACK.INTENTS.intoEnglishLanguage.test('como se diz cansado em inglês'));
ok('"how do you say thanks in portuguese" is a translation request', PACK.INTENTS.translateInto.exec('how do you say thanks in portuguese')?.[1] === 'thanks');
ok('"traduz bom dia" is a translation request', PACK.INTENTS.translateAny.exec('traduz bom dia')?.[1] === 'bom dia');
ok('"cansado em inglês" is a phrase into English', PACK.INTENTS.intoEnglish.exec('cansado em inglês')?.[1] === 'cansado');
ok('"tired in portuguese" is a phrase into Portuguese', PACK.INTENTS.intoStudy.exec('tired in portuguese')?.[1] === 'tired');
ok('"que forma é «fizeram»" is a form question', PACK.INTENTS.whatForm.exec('que forma é «fizeram»')?.[1] === 'fizeram');
ok('"conjuga fazer no conjuntivo" names fazer', PACK.INTENTS.conjugate.exec('conjuga fazer no conjuntivo')?.[1] === 'fazer');
ok('"conjugação de ter" names ter', PACK.INTENTS.conjugate.exec('conjugação de ter')?.[1] === 'ter');
ok('"conjuga o verbo pôr" names pôr', PACK.INTENTS.conjugate.exec('conjuga o verbo pôr')?.[1] === 'pôr');
ok('"conjuga levantar-se" keeps the -se', PACK.INTENTS.conjugate.exec('conjuga levantar-se')?.[1] === 'levantar-se');
ok('HELP matches ajuda and help', PACK.HELP.test('ajuda') && PACK.HELP.test('help') && PACK.HELP.test('o que sabes fazer'));
ok('INFINITIVE accepts pôr and a reflexive', PACK.INFINITIVE.test('pôr') && PACK.INFINITIVE.test('levantar-se') && !PACK.INFINITIVE.test('saudade'));

// --- routing ---------------------------------------------------------------
const cases = [
  ['olá', /conjugar|hello/i, 'greeting'],
  ['bom dia', /conjugar|hello/i, 'greeting, two words'],
  ['obrigado', /de nada|welcome/i, 'thanks'],
  ['ajuda', /conjugar/i, 'capabilities in Portuguese'],
  ['help', /conjugate/i, 'capabilities in English'],

  ['ser e estar', /ser/i, 'ser/estar topic'],
  ['qual é a diferença entre ser e estar', /ser/i, 'ser/estar asked as a question'],
  ['what is the difference between ser and estar', /ser/i, 'ser/estar asked in English'],
  ['por e para', /para/i, 'por/para topic'],
  ['when to use por and para', /para/i, 'por/para in English'],
  ['o conjuntivo', /conjuntivo|subjunctive/i, 'subjunctive topic'],
  ['quando se usa o conjuntivo', /conjuntivo|subjunctive/i, 'subjunctive, asked as a question'],
  ['when do i use the subjunctive', /conjuntivo|subjunctive/i, 'subjunctive, asked in English'],
  ['o subjuntivo', /conjuntivo|subjunctive/i, 'Brazil\'s name for it'],
  ['o futuro do conjuntivo', /futuro do conjuntivo|future subjunctive/i, 'future subjunctive topic'],
  ['o infinitivo pessoal', /infinitivo pessoal|personal infinitive/i, 'personal infinitive topic'],
  ['the personal infinitive', /personal infinitive/i, 'personal infinitive in English'],
  ['tu e você', /você/i, 'tu/você topic'],
  ['saber e conhecer', /conhecer/i, 'saber/conhecer topic'],
  ['pretérito perfeito e imperfeito', /imperfeito/i, 'past tenses topic'],
  ['a negação', /negação|negation|não/i, 'negation topic'],
  ['os pronomes', /pronome|pronoun/i, 'pronouns topic'],
  ['todo e tudo', /tudo/i, 'todo/tudo topic'],
  ['o género e o plural', /plural/i, 'gender and plurals topic'],
  ['explain accents', /accent|acento/i, 'accents topic, asked in English'],
  ['estar a fazer ou estar fazendo', /fazendo/i, 'progressive topic'],
  ['o pretérito perfeito composto', /tenho falado|perfeito composto/i, 'perfeito composto topic'],

  ['conjuga falar', /falar/i, 'conjugation'],
  ['conjuga partir', /partir/i, 'conjugation of an -ir verb'],
  ['conjugação de ter', /ter/i, 'conjugation with "de"'],
  ['conjugate vender', /vender/i, 'conjugation asked in English'],
  ['fazer conjugation', /fazer/i, 'verb-first'],
  ['pôr', /ponho/i, 'a bare infinitive'],
  ['por', /ponho/i, 'pôr typed without its circumflex'],
  ['o verbo trazer', /trago/i, 'explicit verb marker'],
  ['conjuga levantar-se', /levanto/i, 'a reflexive'],
];

const results = [];
for (const [question, pattern, label] of cases) {
  results.push(pt(question).then((result) => {
    ok(`routes "${question}" (${label})`, pattern.test(text(result.blocks)),
      `got: ${text(result.blocks).slice(0, 120)}`);
    ok(`"${question}" is grounded`, result.confident);
  }));
}

// --- the starter questions of the chat page --------------------------------
results.push(pt('ser e estar').then((result) => {
  const body = text(result.blocks);
  ok('starter: "ser e estar" is the ser-estar note', /^### Ser e estar/m.test(body), body.slice(0, 120));
}));
results.push(pt('conjuga fazer no conjuntivo').then((result) => {
  const body = text(result.blocks);
  ok('starter: "conjuga fazer no conjuntivo" is fazer', /\*\*fazer\*\*/.test(body), body.slice(0, 160));
  ok('and the tense is the present subjunctive', /presente do conjuntivo/.test(body) && /faça/.test(body) && !/fiz\b/.test(body), body.slice(0, 400));
}));
results.push(pt('que forma é «fizeram»').then((result) => {
  const body = text(result.blocks);
  ok('starter: "que forma é «fizeram»" is fazer', /fazer/.test(body), body.slice(0, 160));
  ok('and says eles, pretérito perfeito', /eles \/ elas \/ vocês, pretérito perfeito de \*fazer\*/.test(body), body.slice(0, 200));
}));

// --- the headline names the conjugation --------------------------------------
results.push(pt('conjuga falar').then((result) => {
  const body = text(result.blocks);
  ok('falar is first conjugation', /Verbo em -ar, primeira conjugação/.test(body), body.slice(0, 160));
  ok('the default tenses are shown', /presente do indicativo/.test(body) && /pretérito perfeito/.test(body) && /presente do conjuntivo/.test(body), body.slice(0, 600));
  ok('and the pretérito perfeito is Portugal\'s', /falámos/.test(body), body.slice(0, 600));
}));
results.push(pt('conjuga pôr').then((result) => {
  const body = text(result.blocks);
  ok('pôr is of the pôr family', /da família de pôr/.test(body) && /irregular/.test(body), body.slice(0, 160));
}));
results.push(pt('conjugate propor').then((result) => {
  const body = text(result.blocks);
  ok('propor is conjugated like pôr', /conjugated like \*pôr\*/.test(body) && /of the pôr family/.test(body), body.slice(0, 160));
}));
results.push(pt('conjuga dormir').then((result) => {
  ok('dormir names its vowel change', /alternância vocálica o → u/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(pt('conjuga ficar').then((result) => {
  ok('ficar names its spelling change', /ortografia c → qu/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
ok('ser is hairy', PACK.isHairy(conjugate('ser')) && PACK.isHairy(conjugate('pôr')) && PACK.isHairy(conjugate('fazer')));
ok('manter is not', !PACK.isHairy(conjugate('manter')) && !PACK.isHairy(conjugate('falar')));

// --- a tense named with the verb ---------------------------------------------
results.push(pt('conjuga ser no pretérito perfeito').then((result) => {
  const body = text(result.blocks);
  ok('a named tense is the only table', /\bfui\b/.test(body) && !/\bsou\b/.test(body), body.slice(0, 300));
}));
results.push(pt('conjuga fazer no futuro do conjuntivo').then((result) => {
  const body = text(result.blocks);
  ok('"futuro do conjuntivo" is not read as the futuro', /futuro do conjuntivo/.test(body) && /fizer\b/.test(body) && !/farei/.test(body), body.slice(0, 300));
}));
results.push(pt('conjuga fazer no futuro do subjuntivo').then((result) => {
  ok('subjuntivo is a synonym of conjuntivo', /fizer\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(pt('conjuga falar no pretérito perfeito composto').then((result) => {
  ok('"pretérito perfeito composto" does not stop at "perfeito"', /tenho falado/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(pt('conjuga falar no infinitivo pessoal').then((result) => {
  ok('the personal infinitive is a tense the tutor shows', /falarmos/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(pt('conjuga ser no imperfeito do conjuntivo').then((result) => {
  ok('"imperfeito do conjuntivo" is the conjuntivo', /fosse\b/.test(text(result.blocks)) && !/\bera\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(pt('conjugate fazer in the pluperfect').then((result) => {
  ok('the pluperfect is the mais-que-perfeito', /fizera\b/.test(text(result.blocks)), text(result.blocks).slice(0, 300));
}));
results.push(pt('como se diz ter no passado').then((result) => {
  const body = text(result.blocks);
  ok('a verb with a tense cue gets that verb', /\*\*ter\*\*/.test(body), body.slice(0, 120));
  ok('and the past is the pretérito perfeito', /\btive\b/.test(body), body.slice(0, 300));
}));

// --- a tense and a person together give one form ---------------------------
results.push(pt('conjuga ser no futuro, nós').then((result) => {
  ok('tense + person gives the single form', /\*\*seremos\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(pt('conjuga ter no presente do conjuntivo, eles').then((result) => {
  ok('"presente do conjuntivo" is not read as the indicative', /\*\*tenham\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));
results.push(pt('conjuga ir no pretérito perfeito, você').then((result) => {
  ok('você is the third person', /\*\*foi\*\*/.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- a tense named on its own -------------------------------------------------
results.push(pt('o futuro do conjuntivo em três verbos').then((result) => {
  ok('a tense alone is shown on the model verbs or explained', result.confident, text(result.blocks).slice(0, 160));
}));
results.push(pt('tell me about the conditional tense').then((result) => {
  ok('the conditional has a note or a table', result.confident && /falaria|condicional|conditional/i.test(text(result.blocks)), text(result.blocks).slice(0, 160));
}));

// --- form lookup -----------------------------------------------------------
results.push(pt('que forma é «falámos»').then((result) => {
  const body = text(result.blocks);
  ok('falámos is the pretérito perfeito of falar', /pretérito perfeito de \*falar\*/.test(body), body.slice(0, 200));
}));
results.push(pt('what form is pusesse').then((result) => {
  const body = text(result.blocks);
  ok('pusesse is pôr', /imperfect subjunctive of \*pôr\*/.test(body), body.slice(0, 200));
}));
results.push(pt('que forma é faça').then((result) => {
  const body = text(result.blocks);
  ok('a você imperative is labelled, not "undefined"', /fazer/.test(body) && !/undefined/.test(body), body.slice(0, 300));
}));
results.push(pt('que forma é vêm').then((result) => {
  const body = text(result.blocks);
  ok('vêm is vir', /\*vir\*/.test(body), body.slice(0, 200));
}));
results.push(pt('falarmos').then((result) => {
  const body = text(result.blocks);
  ok('a bare personal-infinitive form is identified', /infinitivo pessoal|personal infinitive/.test(body) && /\*falar\*/.test(body), body.slice(0, 200));
}));
results.push(pt('fizeram').then((result) => {
  ok('a bare form is identified', /\*fazer\*/.test(text(result.blocks)), text(result.blocks).slice(0, 200));
}));

// --- the answer follows the language of the question -----------------------
results.push(pt('o conjuntivo').then((result) => {
  ok('a Portuguese question is answered in Portuguese', result.language === 'pt');
}));
results.push(pt('what is the subjunctive').then((result) => {
  ok('an English question is answered in English', result.language === 'en');
}));
results.push(pt('o conjuntivo', { language: 'en', force: true }).then((result) => {
  ok('force pins the answer language', result.language === 'en');
}));

// --- topic keywords that are verbs do not swallow a conjugation request -----
const verbKeywords = [...new Set(PACK.TOPICS.flatMap((topic) => topic.keywords)
  .filter((keyword) => !keyword.includes(' ') && PACK.KNOWN_VERBS.has(keyword)))];
ok('some topic keywords are verb names', verbKeywords.length >= 5, verbKeywords.join(', '));
for (const verb of verbKeywords) {
  results.push(pt(`conjuga ${verb}`).then((result) => {
    const body = text(result.blocks);
    ok(`"conjuga ${verb}" is a table, not the note`, !body.startsWith('###') && body.includes(`**${verb}**`) && /"type":"table"/.test(body), body.slice(0, 120));
  }));
  results.push(pt(`conjugate ${verb} in the present`).then((result) => {
    ok(`"conjugate ${verb} in the present" is a table`, /"type":"table"/.test(text(result.blocks)), text(result.blocks).slice(0, 120));
  }));
}

// --- out of scope ----------------------------------------------------------
results.push(pt('who won the world cup in 1998').then((result) => {
  ok('declines what it cannot ground', result.confident === false);
  ok('and says so rather than guessing', /outside what I cover|não te posso ajudar/i.test(text(result.blocks)));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and offers rephrasings', suggestions.length >= 3 && suggestions.some((item) => /^what does .* mean$/.test(item)), suggestions.join(' | '));
}));
results.push(pt('quem ganhou o mundial de 1998').then((result) => {
  ok('declines in Portuguese', result.confident === false && /não te posso ajudar/.test(text(result.blocks)));
  const suggestions = result.blocks.find((block) => block.type === 'suggestions')?.items ?? [];
  ok('and the rephrasings are Portuguese', suggestions.some((item) => /^o que significa /.test(item)) && suggestions.some((item) => /em português$/.test(item)), suggestions.join(' | '));
}));
results.push(pt('é bonito o verbo nadar?').then((result) => {
  ok('an unanswered question naming a verb suggests its table', result.confident || (result.blocks.find((block) => block.type === 'suggestions')?.items ?? []).includes('conjuga nadar'), text(result.blocks).slice(0, 200));
}));

// --- the packs stay apart ---------------------------------------------------
results.push(answer('ser y estar', { study: 'es' }).then((result) => {
  ok('the Spanish pack still answers Spanish questions', /ser/i.test(text(result.blocks)) && result.confident);
}));
results.push(pt('essere o avere').then((result) => {
  ok('and Portuguese mode does not answer Italian ones', result.confident === false, text(result.blocks).slice(0, 120));
}));

// --- "to eat in Portuguese": a vocabulary question with no verb asking for one
for (const [question, pattern, why] of [
  ['to eat in portuguese', /comer/i, 'the gloss index answers it'],
  ['to speak in portuguese', /falar/i, 'another verb'],
  ['to eat', /comer/i, 'without the direction named'],
  ['to put', /pôr/i, 'a verb cited with an accent'],
]) {
  results.push(pt(question).then((result) => {
    ok(`"${question}" is grounded (${why})`, result.confident, text(result.blocks).slice(0, 90));
    ok(`"${question}" names the verb`, pattern.test(text(result.blocks)), text(result.blocks).slice(0, 90));
  }));
}

await Promise.all(results);

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Portuguese tutor checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Portuguese tutor checks passed`);
