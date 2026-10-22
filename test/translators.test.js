/**
 * The translator: DeepL, and nothing else.
 *
 * Offline: fetch is stubbed, so these assert what is asked and what comes back
 * rather than what DeepL is doing today. The two things that matter most are
 * negative — that no other translator is ever consulted (Wikipedia is asked
 * only what a name is called), and that when DeepL cannot answer the reader is
 * told the translator is unavailable instead of being handed a guess.
 */
import express from 'express';

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

// No model either: the translator must not lean on one when DeepL is down.
delete process.env.GEMINI_API_KEY;
delete process.env.OPENROUTER_API_KEY;
delete process.env.GROQ_API_KEY;
process.env.DEEPL_API_KEY = 'test-key:fx';

/**
 * DeepL's answer per request. A function gets the text that was sent, so the
 * idiom repair — which translates the idiom on its own — can be answered per
 * phrase. A number is an HTTP status to fail with; `throw` is a network error.
 */
let plan = null;
/** Wikipedia's answer: a query response, a function of the URL's parameters, or null. */
let wiki = null;
const asked = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, options = {}) => {
  const target = String(url);
  // The route test below talks to its own local server; that is not an engine.
  if (target.startsWith('http://127.0.0.1')) return realFetch(url, options);
  asked.push(target);
  if (target.includes('wikipedia')) {
    const answer = typeof wiki === 'function' ? wiki(new URL(target).searchParams) : wiki;
    if (answer === 'throw') throw new Error('wikipedia down');
    return answer ? { ok: true, status: 200, json: async () => answer } : { ok: false, status: 503, json: async () => ({}) };
  }
  if (!target.includes('deepl')) return { ok: false, status: 599, json: async () => ({}) };

  const sent = new URLSearchParams(String(options.body ?? ''));
  const answer = typeof plan === 'function' ? plan(sent.get('text'), sent) : plan;
  if (answer === 'throw') throw new Error('network down');
  if (typeof answer === 'number') return { ok: false, status: answer, json: async () => ({}) };
  if (answer === null) return { ok: true, status: 200, json: async () => ({ translations: [] }) };
  return { ok: true, status: 200, json: async () => ({ translations: [{ text: answer }] }) };
};

const { translate, allEverydayWords } = await import('../server/translators.js');

/**
 * Wikipedia answering that `asked` (as typed) is the article `title`, called
 * `link` in the other language — and that nothing else asked is an article.
 */
const article = (asked, title, link) => (params) => {
  const titles = (params.get('titles') || '').split('|');
  if (!titles.includes(asked)) return { query: { pages: { '-1': { missing: '' } } } };
  return {
    query: {
      normalized: [{ from: asked, to: title }],
      pages: { 1: { title, langlinks: [{ '*': link }] } },
    },
  };
};

/** The requests one call made, so `asked` accumulating over the file does not matter. */
async function run(text, from, to) {
  const before = asked.length;
  try {
    return { result: await translate(text, from, to), urls: asked.slice(before) };
  } catch (error) {
    return { error, urls: asked.slice(before) };
  }
}

// Wikipedia is a lookup, not a translator, so it may be asked too.
const onlyDeepl = (urls) => urls.some((url) => url.includes('api-free.deepl.com'))
  && urls.every((url) => url.includes('api-free.deepl.com') || url.includes('wikipedia.org'));

// --- every language, both ways, through DeepL --------------------------------
for (const [study, sentence, english] of [
  ['es', 'el perro de la niña', 'the dog of the girl'],
  ['fr', 'le chien de la fille', 'the dog of the girl'],
  ['it', 'il cane della ragazza', 'the dog of the girl'],
]) {
  plan = sentence;
  let { result, urls } = await run(english, 'en', study);
  ok(`${study}: English in is translated by DeepL`, result?.engine === 'DeepL', JSON.stringify(result));
  ok(`${study}: and the text is DeepL's`, result?.text === sentence, result?.text);
  ok(`${study}: and nothing but DeepL is asked`, onlyDeepl(urls), urls.join(' '));

  plan = english;
  ({ result, urls } = await run(sentence, study, 'en'));
  ok(`${study}: and back out to English`, result?.text === english, JSON.stringify(result));
  ok(`${study}: still only DeepL`, onlyDeepl(urls), urls.join(' '));
}

// The free host, because only a free key is ever used.
plan = 'hola';
let { urls } = await run('hello', 'en', 'es');
ok('a free key goes to the free host', urls.every((url) => url.startsWith('https://api-free.deepl.com/')), urls.join(' '));

// --- when DeepL cannot answer, the translator says so ----------------------
for (const [why, answer] of [
  ['the month’s quota is spent', 456],
  ['the key is refused', 403],
  ['DeepL is down', 503],
  ['the network fails', 'throw'],
  ['DeepL answers with nothing', null],
]) {
  plan = answer;
  const { error, result, urls: tried } = await run('the dog of the girl', 'en', 'it');
  ok(`when ${why}, nothing is returned as a translation`, !result, JSON.stringify(result));
  ok(`when ${why}, the error says the translator is unavailable`, error?.unavailable === true && error?.status === 503,
    String(error?.message));
  ok(`when ${why}, no other translator is tried`,
    tried.every((url) => url.includes('deepl') || url.includes('wikipedia')), tried.join(' '));
}

// --- no key, or a billed one, is the same as DeepL being down ---------------
process.env.DEEPL_API_KEY = '';
let outcome = await run('the dog', 'en', 'fr');
ok('with no key the translator is unavailable', outcome.error?.unavailable === true, String(outcome.error?.message));
ok('and DeepL is not even asked', !outcome.urls.some((url) => url.includes('deepl')), outcome.urls.join(' '));

process.env.DEEPL_API_KEY = 'a-pro-key';
outcome = await run('the dog', 'en', 'fr');
ok('a Pro key is refused rather than billed', outcome.error?.unavailable === true, String(outcome.error?.message));
ok('and is never sent to DeepL', !outcome.urls.some((url) => url.includes('deepl')), outcome.urls.join(' '));
process.env.DEEPL_API_KEY = 'test-key:fx';

// --- the hand-checked idioms still go over DeepL's answer ---------------------
// DeepL renders the idiom word for word, both in the sentence and on its own;
// the site's own pair goes in, and the pairing is shown as a note.
plan = (text) => (/car/.test(text)
  ? 'Questa macchina costa un braccio e una gamba'
  : 'costa un braccio e una gamba');
let { result, error } = await run('This car will cost an arm and a leg', 'en', 'it');
ok('a literal idiom is replaced with the Italian one', /occhio della testa/.test(result?.text ?? ''), result?.text);
ok('and the pairing is noted', result?.notes?.length === 1, JSON.stringify(result?.notes));

// Already idiomatic: left as DeepL wrote it, and still noted.
plan = 'Piove a catinelle';
({ result } = await run("It's raining cats and dogs", 'en', 'it'));
ok('an idiom DeepL already got right is left alone', result?.text === 'Piove a catinelle', result?.text);
ok('and still noted', result?.notes?.length === 1, JSON.stringify(result?.notes));

// A failure translating the idiom on its own does not sink the sentence.
plan = (text) => (text === 'cost an arm and a leg' ? 503 : 'Cuesta un brazo y una pierna');
({ result } = await run('It will cost an arm and a leg', 'en', 'es'));
ok('a failed idiom lookup keeps DeepL’s sentence', result?.text === 'Cuesta un brazo y una pierna', JSON.stringify(result));

// --- names: Wikipedia keeps them right --------------------------------------
// A whole input that is a name gets the established name, and DeepL is not asked.
wiki = article('Cuban Missile Crisis', 'Cuban Missile Crisis', 'Crisi dei missili di Cuba');
plan = 'crisi dei missili cubani';
({ result, urls } = await run('Cuban Missile Crisis', 'en', 'it'));
ok('a name is answered with the name Italian uses', result?.text === 'Crisi dei missili di Cuba', JSON.stringify(result));
ok('by Wikipedia', result?.engine === 'Wikipedia', JSON.stringify(result));
ok('without asking DeepL', !urls.some((url) => url.includes('deepl')), urls.join(' '));

// In lower case too — a student types it that way and still deserves the name.
wiki = article('cuban missile crisis', 'Cuban Missile Crisis', 'Crisis de los misiles de Cuba');
({ result } = await run('cuban missile crisis', 'en', 'es'));
ok('a name in lower case is still a name', result?.text === 'Crisis de los misiles de Cuba', JSON.stringify(result));

// A name buried in a sentence: DeepL translates, and its literal rendering of
// the name is swapped for the real one.
wiki = article('Cuban Missile Crisis', 'Cuban Missile Crisis', 'Crisis de los misiles de Cuba');
plan = (text) => (text === 'Cuban Missile Crisis'
  ? 'crisis de los misiles cubanos'
  : 'La crisis de los misiles cubanos fue un acontecimiento grave.');
({ result } = await run('The Cuban Missile Crisis was a serious event.', 'en', 'es'));
ok('a name inside a sentence is put right', /crisis de los misiles de Cuba/i.test(result?.text ?? ''), result?.text);
ok('and the sentence is still DeepL’s', result?.engine === 'DeepL', JSON.stringify(result));

// Wikipedia being down costs the names, never the translation.
wiki = 'throw';
plan = 'La crisis de los misiles cubanos fue grave.';
({ result, error } = await run('The Cuban Missile Crisis was serious.', 'en', 'es'));
ok('Wikipedia down still leaves DeepL’s sentence', result?.text === 'La crisis de los misiles cubanos fue grave.',
  JSON.stringify(result ?? String(error)));

// But Wikipedia never stands in for DeepL: a sentence with DeepL down is
// unavailable even when Wikipedia knows a name in it.
wiki = article('Cuban Missile Crisis', 'Cuban Missile Crisis', 'Crisis de los misiles de Cuba');
plan = 456;
({ result, error } = await run('The Cuban Missile Crisis was serious.', 'en', 'es'));
ok('Wikipedia does not translate a sentence DeepL could not', !result && error?.unavailable === true,
  JSON.stringify(result ?? String(error)));
wiki = null;

// A common phrase is not a name, whatever Wikipedia also calls it: it has an
// article called "I Am", and "I am tired" came back as "I Am fatigué".
ok('"I am" is all everyday words', allEverydayWords('I am'));
ok('and so is "am I"', allEverydayWords('am I'));
ok('and the Spanish equivalent', allEverydayWords('yo soy'));
ok('and the French', allEverydayWords('je suis'));
ok('and the Italian', allEverydayWords('io sono'));
ok('"I am tired" is not, because "tired" is not', !allEverydayWords('I am tired'));
ok('a real name is not', !allEverydayWords('Cuban Missile Crisis'));
ok('nothing is not', !allEverydayWords(''));

// --- the route: a 503 the page can recognise, and never cached ----------------
const { router } = await import('../server/routes/translate.js');
const app = express();
app.use(express.json());
app.use('/api/translate', router);
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}/api/translate`;
const post = async (body) => {
  const response = await fetch(base, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
};

const originalWarn = console.warn;
console.warn = () => {};
plan = 456;
let response = await post({ text: 'good night', from: 'en', study: 'it' });
console.warn = originalWarn;
ok('the route answers 503 when DeepL cannot', response.status === 503, String(response.status));
ok('marked unavailable, for the page', response.body.unavailable === true, JSON.stringify(response.body));
ok('with no translation in it', response.body.translation === undefined, JSON.stringify(response.body));
ok('and a message in the language of the side', /traduttore/.test(response.body.error), response.body.error);

plan = 'buona notte';
response = await post({ text: 'good night', from: 'en', study: 'it' });
ok('a failure is not cached: DeepL coming back is noticed at once', response.body.translation === 'buona notte',
  JSON.stringify(response.body));
ok('and the answer names DeepL', response.body.engine === 'DeepL', JSON.stringify(response.body));

server.close();

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} translator checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} translator checks passed`);
