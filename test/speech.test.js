/**
 * Pronunciation: the guards around a small monthly budget.
 *
 * The free ElevenLabs tier is 10,000 characters a month for the whole site, so
 * what matters here is not that audio comes back — that is somebody else's
 * service — but that nothing is spent on input that was never a word, and that
 * a word already spoken is never paid for twice.
 */
process.env.ELEVENLABS_API_KEY = 'test-key';

const { speak, MAX_SPOKEN, MAX_SENTENCE, hasSpeech } = await import('../server/speech.js');

let checked = 0;
const failures = [];

function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

let calls = 0;
let lastBody = null;
globalThis.fetch = async (_url, init = {}) => {
  calls += 1;
  lastBody = init.body ? JSON.parse(init.body) : null;
  return {
    ok: true,
    status: 200,
    arrayBuffer: async () => new TextEncoder().encode('ID3-pretend-mp3').buffer,
  };
};

ok('a key means speech is on', hasSpeech() === true);

// --- a word is spoken, and spoken once ------------------------------------
calls = 0;
let result = await speak('chaleureux');
ok('a word comes back as audio', result.audio.length > 0);
ok('and was fetched', calls === 1, `calls=${calls}`);
ok('and is not a cache hit the first time', result.cached === false);

result = await speak('chaleureux');
ok('the same word is served from cache', result.cached === true);
ok('and costs no second request', calls === 1, `calls=${calls}`);

result = await speak('CHALEUREUX');
ok('case does not defeat the cache', result.cached === true, `calls=${calls}`);

result = await speak('corazón');
ok('a different word is fetched', calls === 2, `calls=${calls}`);

// --- what is refused before a character is spent --------------------------
async function refuses(word) {
  const before = calls;
  try {
    await speak(word);
    return false;
  } catch {
    return calls === before;
  }
}

ok('nothing is not a word', await refuses(''));
ok('whitespace is not a word', await refuses('   '));
ok('a sentence is not a word', await refuses('the quick brown fox jumps over it'));
ok('over the length cap is refused', await refuses('a'.repeat(MAX_SPOKEN + 1)));
ok('null is refused', await refuses(null));

// A two-word headword is still a headword.
calls = 0;
result = await speak('pan comido');
ok('pan comido is spoken', result.audio.length > 0 && calls === 1, `calls=${calls}`);

// --- the translator's speaker: one sentence, capped, cached ----------------
calls = 0;
result = await speak("Je suis fatigué, mais c'est la vie.", 'fr', { sentence: true });
ok('a translated sentence is read', result.audio.length > 0 && calls === 1, `calls=${calls}`);
ok('in the language of the side', lastBody?.language_code === 'fr', JSON.stringify(lastBody));
await speak("Je suis fatigué, mais c'est la vie.", 'fr', { sentence: true });
ok('and is paid for once', calls === 1, `calls=${calls}`);

calls = 0;
await speak("I'm tired, but that's life.", 'fr', { sentence: true, english: true });
ok('a translation into English is read in English', lastBody?.language_code === 'en', JSON.stringify(lastBody));

async function refusesSentence(text) {
  const before = calls;
  try {
    await speak(text, 'es', { sentence: true });
    return false;
  } catch {
    return calls === before;
  }
}
ok('a sentence over the cap is refused unspent', await refusesSentence('a '.repeat(MAX_SENTENCE)));
ok('markup is not a sentence', await refusesSentence('<script>alert(1)</script>'));
ok('an address is not a sentence', await refusesSentence('https://example.com/x'));
ok('punctuation alone is not a sentence', await refusesSentence('?!...'));
ok('a word is still refused as a word when it is a sentence', await refuses('Je suis fatigué.'));

// --- with no key at all, it declines rather than throwing oddly -----------
delete process.env.ELEVENLABS_API_KEY;
ok('no key means speech is off', hasSpeech() === false);
let declined = null;
try { await speak('bonjour'); } catch (error) { declined = error; }
ok('and speaking is refused', declined !== null);
ok('with a status the route can use', declined?.status === 503, String(declined?.status));

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} pronunciation checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} pronunciation checks passed`);
