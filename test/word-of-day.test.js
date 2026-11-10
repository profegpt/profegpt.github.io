/**
 * The words of the day: every list is sound, and the pick is a function of
 * the New York date that visits every word before it repeats one.
 */
const { WORDS, wordOfDay, dayNumber, nextMidnight } = await import('../public/js/lib/word-of-day.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

for (const [language, list] of Object.entries(WORDS)) {
  ok(`${language}: a real list`, list.length >= 20, `${list.length} words`);
  ok(`${language}: no word twice`, new Set(list.map((entry) => entry.word)).size === list.length);
  for (const entry of list) {
    ok(`${language}: ${entry.word} has both glosses`, Boolean(entry.gloss?.[language]) && Boolean(entry.gloss?.en));
    const texts = [entry.word, entry.gloss?.[language], entry.gloss?.en, entry.story?.[language], entry.story?.en].filter(Boolean);
    ok(`${language}: ${entry.word} has no em dash or middle dot`, texts.every((text) => !/[—·]/.test(text)));
    if (language === 'es') ok(`es: ${entry.word} tells its story in both languages`, Boolean(entry.story?.es) && Boolean(entry.story?.en));
    else ok(`${language}: ${entry.word} has no story to tell`, !entry.story);
  }
  const day = dayNumber(new Date('2026-11-10T12:00:00Z'));
  const seen = new Set();
  for (let i = 0; i < list.length; i += 1) seen.add(wordOfDay(language, day + i).word);
  ok(`${language}: every word gets a day before any repeats`, seen.size === list.length, `${seen.size} of ${list.length}`);
  ok(`${language}: the same day gives the same word`, wordOfDay(language, day) === wordOfDay(language, day));
}

// The day turns at midnight in New York, not at midnight UTC.
ok('23:30 in New York is still the same day', dayNumber(new Date('2026-11-10T04:30:00Z')) === dayNumber(new Date('2026-11-09T17:00:00Z')));
ok('00:30 in New York is the next day', dayNumber(new Date('2026-11-10T05:30:00Z')) === dayNumber(new Date('2026-11-09T17:00:00Z')) + 1);
const at = nextMidnight(new Date('2026-11-09T17:00:00Z'));
ok('the next midnight is 05:00 UTC in November', Math.abs(at - Date.parse('2026-11-10T05:00:00Z')) <= 60000, new Date(at).toISOString());
ok('no language is picked for an unknown code', wordOfDay('xx') === null);

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} word-of-the-day checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} word-of-the-day checks passed`);
