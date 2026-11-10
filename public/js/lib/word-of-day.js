/**
 * The word of the day, one per language, drawn from data/words.js.
 *
 * The day turns at midnight in New York, where the site's readers are, not at
 * midnight wherever a browser happens to be, so everyone in a class sees the
 * same word. The pick is a function of the date alone: no storage, no server,
 * and the same word on every copy of the site.
 *
 * It walks the list in a scrambled order rather than at random, so no word
 * comes twice before every word has had its day.
 */

import { WORDS } from '../data/words.js';

const ZONE = 'America/New_York';

/** The date in New York as a day number, the same on every machine. */
export function dayNumber(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(now);
  const get = (type) => Number(parts.find((part) => part.type === type).value);
  return Math.floor(Date.UTC(get('year'), get('month') - 1, get('day')) / 86400000);
}

/** When the day next turns in New York, as a timestamp, for a timer. */
export function nextMidnight(now = new Date()) {
  const start = new Date(now.getTime());
  for (let step = 0; step < 60; step += 1) {
    start.setTime(start.getTime() + 30 * 60000);
    if (dayNumber(start) !== dayNumber(now)) {
      // Back off to the half hour, then find the minute.
      let at = start.getTime() - 30 * 60000;
      while (dayNumber(new Date(at)) === dayNumber(now)) at += 60000;
      return at;
    }
  }
  return now.getTime() + 86400000;
}

/**
 * The n-th word in a scrambled walk of the list: a step coprime with the
 * length visits every word before repeating, and a per-language offset keeps
 * the six lists from turning in step.
 */
export function wordOfDay(language, day = dayNumber()) {
  const list = WORDS[language] ?? [];
  if (!list.length) return null;
  const n = list.length;
  const step = [7, 11, 13, 17, 19, 23].find((candidate) => gcd(candidate, n) === 1) ?? 1;
  const offset = [...language].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return list[(((day * step) + offset) % n + n) % n];
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

export { WORDS };
