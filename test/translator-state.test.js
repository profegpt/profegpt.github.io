/**
 * The translator page's direction: what the labels say, what is sent, what is
 * accepted back, and what the swap button does to all three.
 *
 * The bug report: the panes read ENGLISH → FRENCH, "hi" was typed, and the
 * French pane showed "Health", credited to DeepL. Whatever the route, the page
 * must never put text under a label it was not translated into, so these check
 * the rules in public/js/lib/translator-state.js that the view follows.
 */
import {
  acceptsAnswer, initialDirection, isCurrent, requestBody, swapDirection, swapPanes,
} from '../public/js/lib/translator-state.js';

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const STUDIES = ['es', 'fr', 'it', 'de', 'nl', 'pt'];

for (const study of STUDIES) {
  const start = initialDirection(study);
  ok(`${study}: opens English into the side's language`, start.from === 'en' && start.to === study, JSON.stringify(start));

  // Short words that are words elsewhere too go from the source pane's language.
  for (const word of ['hi', 'no', 'pain']) {
    const body = requestBody(word, start, study);
    ok(`${study}/${word}: the request names the source pane's language`, body.from === 'en', JSON.stringify(body));
    ok(`${study}/${word}: and the target pane's`, body.to === study, JSON.stringify(body));
    ok(`${study}/${word}: and the side`, body.study === study, JSON.stringify(body));

    const back = requestBody(word, swapDirection(start), study);
    ok(`${study}/${word}: swapped, it goes from the side's language`, back.from === study && back.to === 'en', JSON.stringify(back));
  }

  // The swap is its own inverse, and always a pair of the two languages.
  let direction = start;
  for (let i = 0; i < 5; i += 1) {
    direction = swapDirection(direction);
    ok(`${study}: swap ${i + 1} keeps one end English and the other the side's`,
      [direction.from, direction.to].sort().join() === ['en', study].sort().join() && direction.from !== direction.to,
      JSON.stringify(direction));
  }
  ok(`${study}: an odd number of swaps is the other way round`, direction.from === study && direction.to === 'en', JSON.stringify(direction));
}

// --- answers -----------------------------------------------------------------
const enFr = { from: 'en', to: 'fr' };
const frEn = { from: 'fr', to: 'en' };
const asked = requestBody('hi', enFr, 'fr');

ok('the answer to the request on screen is shown',
  acceptsAnswer(asked, { text: 'hi', direction: enFr }, { translation: 'Salut', from: 'en', to: 'fr' }));
ok('so is one from a server that does not say which way it went',
  acceptsAnswer(asked, { text: 'hi ', direction: enFr }, { translation: 'Salut' }));
ok('an answer that went into English is not put under FRENCH',
  !acceptsAnswer(asked, { text: 'hi', direction: enFr }, { translation: 'Health', from: 'fr', to: 'en' }));
ok('nor one that came from another source language',
  !acceptsAnswer(asked, { text: 'hi', direction: enFr }, { translation: 'Health', from: 'es', to: 'fr' }));
ok('an answer for a direction the panes no longer show is dropped',
  !acceptsAnswer(asked, { text: 'hi', direction: frEn }, { translation: 'Salut', from: 'en', to: 'fr' }));
ok('an answer for text that has since changed is dropped',
  !acceptsAnswer(asked, { text: 'hello', direction: enFr }, { translation: 'Salut', from: 'en', to: 'fr' }));
ok('a request the page did not send is never accepted', !acceptsAnswer(null, { text: 'hi', direction: enFr }, { translation: 'Salut' }));

// --- what the target pane is the translation of --------------------------------
const shown = { text: 'hi', from: 'en', to: 'fr' };
ok('the pane is current for the same text and direction', isCurrent(shown, 'hi', enFr));
ok('surrounding space does not matter', isCurrent(shown, '  hi\n', enFr));
ok('edited text makes it stale', !isCurrent(shown, 'hi there', enFr));
ok('a turned direction makes it stale', !isCurrent(shown, 'hi', frEn));
ok('nothing shown is never current', !isCurrent(null, 'hi', enFr));

// --- the swap button --------------------------------------------------------------
// A real pair trades places, and the labels turn with it.
let swapped = swapPanes({ direction: enFr, input: 'hi', output: 'Salut', shown });
ok('a translation and its source trade places', swapped.input === 'Salut' && swapped.output === 'hi', JSON.stringify(swapped));
ok('and the direction turns', swapped.direction.from === 'fr' && swapped.direction.to === 'en', JSON.stringify(swapped));
ok('and the pane is the pair, the new way round',
  isCurrent(swapped.shown, swapped.input, swapped.direction), JSON.stringify(swapped));

// Swapping back restores the start exactly.
const again = swapPanes(swapped);
ok('swapping twice is where it started', again.input === 'hi' && again.output === 'Salut'
  && again.direction.from === 'en' && again.direction.to === 'fr', JSON.stringify(again));

// The text was edited and its answer has not come back: the old output is not a
// translation of anything on screen, and must not become the new source.
swapped = swapPanes({ direction: frEn, input: 'hi', output: 'Health', shown: { text: 'santé', from: 'fr', to: 'en' } });
ok('a stale translation is not carried across', swapped.input === 'hi' && swapped.output === '', JSON.stringify(swapped));
ok('only the languages turn', swapped.direction.from === 'en' && swapped.direction.to === 'fr', JSON.stringify(swapped));
ok('and nothing is claimed as shown', swapped.shown === null, JSON.stringify(swapped));

// The last request failed and the pane still had old text in it.
swapped = swapPanes({ direction: enFr, input: 'hi', output: 'Santé', shown: null });
ok('text left over from a failed request is not carried across', swapped.input === 'hi' && swapped.output === '', JSON.stringify(swapped));

// Nothing translated yet: the typed text stays, rather than vanishing.
swapped = swapPanes({ direction: enFr, input: 'hi', output: '', shown: null });
ok('swapping before any answer keeps the typed text', swapped.input === 'hi' && swapped.output === '', JSON.stringify(swapped));

// Whatever the swap does, nothing in the target pane is ever unaccounted for.
for (const before of [
  { direction: enFr, input: 'hi', output: 'Salut', shown },
  { direction: enFr, input: 'no', output: 'Salut', shown },
  { direction: frEn, input: 'pain', output: 'bread', shown: { text: 'pain', from: 'fr', to: 'en' } },
  { direction: frEn, input: 'pain', output: 'bread', shown: { text: 'pain', from: 'en', to: 'fr' } },
  { direction: enFr, input: '', output: '', shown: null },
]) {
  const after = swapPanes(before);
  ok(`after swapping ${JSON.stringify(before)}, the target pane is empty or a known pair`,
    after.output === '' || isCurrent(after.shown, after.input, after.direction), JSON.stringify(after));
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} translator-direction checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} translator-direction checks passed`);
