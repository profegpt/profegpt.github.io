/**
 * The Apps Script build, run without Apps Script.
 *
 * The generated server.js and Code.js are loaded into a bare V8 context — no
 * fetch, no URL, no Buffer, no timers, which is what Apps Script gives them —
 * with stand-ins for the services they call (appscript/emulator.mjs).
 * Requests go through api() exactly as google.script.run would send them.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from '../appscript/build.mjs';
import { project as emulate, reply } from '../appscript/emulator.mjs';

const { dist } = build({ quiet: true });

/** The project with UrlFetchApp answered by `respond`, which returns plain parts or an Error to throw. */
function project({ properties = {}, respond = () => ({ status: 404 }) } = {}) {
  return emulate({
    dist,
    properties,
    urlFetch(url, params) {
      const answer = respond(url, params);
      if (answer instanceof Error) throw answer;
      return reply(answer);
    },
  });
}

const json = (response) => JSON.parse(response.body);
const call = (app, request) => app.execution().api(request);

let passed = 0;
async function test(name, run) {
  try {
    await run();
    passed += 1;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

// Nothing a browser can call besides the four entry points.
await test('only the entry points are callable', () => {
  const context = project().execution();
  const callable = Object.keys(context).filter((key) => typeof context[key] === 'function' && !key.endsWith('_'));
  assert.deepEqual(callable.sort(), ['api', 'apiResult', 'doGet', 'doPost']);
});

await test('doGet turns the path and query into the first route', () => {
  const output = project().execution().doGet({ pathInfo: 'conjugacion', parameter: { v: 'ir', page: 'x' } });
  const boot = JSON.parse(/window.__PROFEGPT__ = (\{.*?\});<\/script>/.exec(output.html)[1]);
  assert.deepEqual(boot, { path: '/conjugacion', search: '?v=ir', url: 'https://script.google.com/macros/s/EMULATED/exec' });
});

await test('doGet cannot be made to close its own script tag', () => {
  const output = project().execution().doGet({ parameter: { q: '</script><script>alert(1)</script>' } });
  assert.ok(!output.html.includes('</script><script>alert(1)'));
});

await test('the boot placeholder is a string, which HtmlService does not strip', () => {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.ok(html.includes('window.__PROFEGPT__ = "__PROFEGPT_BOOT__";'));
});

await test('health counts no API keys on a bare project', async () => {
  assert.equal(json(await call(project(), { url: '/api/health' })).apiKeys, 0);
});

await test('the page carries every module and no unresolved asset', () => {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.ok(!html.includes('/assets/'));
  assert.ok(!html.includes('type="module"'));
  assert.ok(html.includes("__require('public/js/app.js')"));
  assert.ok(!html.includes('__ASSET_VERSION__'));
});

await test('only the three service keys count, and no model is configured', async () => {
  const app = project({
    properties: {
      DEEPL_API_KEY: 'k:fx', RAE_API_KEY: 'r', ELEVENLABS_API_KEY: 'e', GEMINI_API_KEY: 'leftover',
    },
  });
  const health = json(await call(app, { url: '/api/health' }));
  assert.equal(health.runtime, 'apps-script');
  assert.equal(health.apiKeys, 3, 'a leftover model key is not one of the site’s keys');
  assert.equal(health.translator, true);
  assert.equal(health.chain, undefined);
});

await test('the teacher lock survives between executions', async () => {
  const app = project();
  const post = (body) => call(app, {
    method: 'POST', url: '/api/lock', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });

  const wrong = await post({ passcode: 'nope' });
  assert.equal(wrong.status, 403);

  const locked = await post({ passcode: 'AP_Lit', locked: true });
  assert.equal(json(locked).locked, true);

  // A different execution, as the next visitor's request would be.
  assert.equal(json(await call(app, { url: '/api/lock' })).locked, true);

  // The old word that opened French and Latin is gone with them.
  const old = await post({ passcode: 'profe' });
  assert.equal(old.status, 403);
  assert.equal(json(old).opened, undefined);
});

await test('there is no chat endpoint: the tutor answers in the browser', async () => {
  const response = await call(project(), {
    method: 'POST',
    url: '/api/chat',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'hola' }] }),
  });
  assert.equal(response.status, 404);
});

await test('verbs come from the RAE through UrlFetchApp, and are cached across executions', async () => {
  const app = project({
    respond: (url) => (url.includes('rae-api.com')
      ? { body: { ok: true, data: { word: 'ir', meanings: [{ conjugations: { non_personal: { infinitive: 'ir' } } }] } } }
      : { status: 404, body: {} }),
  });
  const first = await call(app, { url: '/api/verbs/conjugations?verb=ir' });
  assert.equal(first.status, 200, first.body);
  const fetched = app.requests.length;
  assert.ok(fetched > 0);

  const second = await call(app, { url: '/api/verbs/conjugations?verb=ir' });
  assert.equal(second.body, first.body);
  assert.equal(app.requests.length, fetched, 'the second lookup is answered from CacheService');
});

await test('pronunciation comes back as base64 audio', async () => {
  const audio = Buffer.from([0x49, 0x44, 0x33, 0xff, 0x00, 0x80]);
  const app = project({
    properties: { ELEVENLABS_API_KEY: 'k' },
    respond: () => ({ body: audio, headers: { 'Content-Type': 'audio/mpeg' } }),
  });
  const response = await call(app, { url: '/api/speak?word=puella&study=la' });
  assert.equal(response.status, 200, response.body);
  assert.equal(response.headers['content-type'], 'audio/mpeg');
  assert.deepEqual(Buffer.from(response.base64, 'base64'), audio);

  // And the clip is kept, so the monthly budget is spent once per word.
  const again = await call(app, { url: '/api/speak?word=puella&study=la' });
  assert.equal(again.headers['x-speech-cache'], 'hit');
});

await test('translation goes to DeepL as a form post', async () => {
  let seen = null;
  const app = project({
    properties: { DEEPL_API_KEY: 'abc:fx' },
    respond(url, params) {
      if (!url.includes('deepl')) return { status: 503, body: {} };
      seen = { url, params };
      return { body: { translations: [{ text: 'The after-dinner conversation' }] } };
    },
  });
  const response = await call(app, {
    method: 'POST',
    url: '/api/translate',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'La sobremesa', from: 'es', study: 'es' }),
  });
  assert.equal(response.status, 200, response.body);
  assert.equal(json(response).engine, 'DeepL');
  assert.equal(seen.url, 'https://api-free.deepl.com/v2/translate');
  assert.match(seen.params.contentType, /x-www-form-urlencoded/);
  assert.match(seen.params.payload, /^text=La\+sobremesa&source_lang=ES/);
  assert.equal(seen.params.headers.authorization, 'DeepL-Auth-Key abc:fx');
});

await test('a billed DeepL key is never used', async () => {
  const app = project({
    properties: { DEEPL_API_KEY: 'pro-key-without-fx' },
    respond: () => ({ status: 503, body: {} }),
  });
  await call(app, {
    method: 'POST',
    url: '/api/translate',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Hola', from: 'es', study: 'es' }),
  });
  assert.ok(!app.requests.some((request) => request.url.includes('deepl.com')));
});

await test('when DeepL fails the translator says it is unavailable', async () => {
  const app = project({
    properties: { DEEPL_API_KEY: 'abc:fx' },
    respond: (url) => (url.includes('deepl') ? { status: 456, body: {} } : { status: 404, body: {} }),
  });
  const response = await call(app, {
    method: 'POST',
    url: '/api/translate',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Hola', from: 'es', study: 'es' }),
  });
  assert.equal(response.status, 503, response.body);
  assert.equal(json(response).unavailable, true);
  assert.equal(json(response).translation, undefined);
});

await test('the HTTP API for GitHub Pages: a POST starts the request, ?result collects it', async () => {
  const app = project({
    properties: { DEEPL_API_KEY: 'abc:fx' },
    respond: (url) => (url.includes('deepl')
      ? { body: { translations: [{ text: 'il cane' }] } }
      : { status: 404, body: {} }),
  });

  const posted = app.execution().doPost({
    postData: {
      contents: JSON.stringify({
        method: 'POST',
        url: '/api/translate',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: 'the dog', from: 'en', study: 'it' }),
      }),
    },
  });
  assert.equal(posted.mimeType, 'application/json');
  const { id } = JSON.parse(posted.getContent());
  assert.match(id, /^[0-9a-f]{32}$/);

  // The handler settles after doPost returns, as it does on Apps Script.
  await new Promise((resolve) => { setImmediate(resolve); });

  // A different execution collects it, as the browser's second request would.
  const collected = JSON.parse(app.execution().doGet({ parameter: { result: id } }).getContent());
  assert.equal(collected.status, 200, JSON.stringify(collected));
  assert.equal(JSON.parse(collected.body).translation, 'il cane');

  // Collected once only.
  const again = JSON.parse(app.execution().doGet({ parameter: { result: id } }).getContent());
  assert.equal(again.pending, true);
});

await test('the HTTP API refuses anything that is not an /api/ request', () => {
  const context = project().execution();
  for (const contents of ['not json', JSON.stringify({ url: '/index.html' }), JSON.stringify({})]) {
    const answer = JSON.parse(context.doPost({ postData: { contents } }).getContent());
    assert.ok(answer.error && !answer.id, contents);
  }
  assert.equal(JSON.parse(context.doGet({ parameter: { result: '../nope' } }).getContent()).pending, true);
});

await test('a failing host is a 5xx answer, not a crashed execution', async () => {
  const app = project({ respond: () => new Error('DNS error: rae-api.com') });
  const response = await call(app, { url: '/api/verbs/conjugations?verb=ir' });
  assert.ok(response.status >= 400, response.body);
});

await test('unknown routes and bad JSON are refused politely', async () => {
  const app = project();
  assert.equal((await call(app, { url: '/api/nothing' })).status, 404);
  const bad = await call(app, { method: 'POST', url: '/api/lock', headers: { 'content-type': 'application/json' }, body: '{' });
  assert.equal(bad.status, 400);
});

await test('apiResult hands over a stashed response exactly once', async () => {
  const app = project();
  const response = await call(app, { id: 'abcdef123456', url: '/api/lock' });
  const collected = app.execution().apiResult('abcdef123456');
  assert.equal(JSON.stringify(collected), JSON.stringify(response));
  assert.equal(app.execution().apiResult('abcdef123456'), null);
  assert.equal(app.execution().apiResult('../../etc'), null);
});

await test('a browser that gets real answers stops the stashing', async () => {
  const app = project();
  await call(app, { id: 'abcdef123456', unwrapped: true, url: '/api/lock' });
  assert.equal(app.execution().apiResult('abcdef123456'), null);
});

await test('the drawings are inlined into the page, and the old photographs are not', () => {
  const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  assert.ok(html.includes('data:image/svg+xml;base64,'));
  assert.ok(!/madrid|paris-|rome-|\.webp/.test(html), 'a wallpaper made it into the page');
  assert.ok(!fs.existsSync(path.join(dist, 'assets')));
});

console.log(`✓ all ${passed} Apps Script checks passed`);
