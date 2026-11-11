/**
 * Tilde: the rules of the daily word game, with nothing on screen.
 *
 * A Spanish word of five, six or seven letters a day, six guesses, and accents
 * that count. The page is views/tilde.js; the words are data/tilde-words.js and
 * data/tilde-answers.js, both built by scripts/build-tilde.mjs. Everything here
 * is plain functions of their arguments, so the tests can run it in Node.
 *
 * Letters. á é í ó ú ü are letters of their own, as on a Spanish keyboard, and
 * so is ñ. A tile is scored in this order:
 *
 *   correct  the same letter, accent and all, in the same place
 *   accent   the same letter in the same place with the accent wrong — a for á,
 *            ú for ü, á for a. Counted before anything turns yellow, because
 *            it says more: this place is settled except for its mark.
 *   present  the letter is in the word somewhere else
 *   absent   it is not, or every copy of it is already accounted for
 *
 * "Present" compares letters without their accents. A player who types o while
 * the answer has an ó in another place has found a letter of the word, and
 * telling them grey would send them away from it; the accent is settled once
 * the letter is in its place, by the accent state. ñ is never n: they are two
 * letters of the alphabet, not one letter with a mark, and score as different.
 *
 * Repeated letters follow Wordle: each letter of the answer answers one tile at
 * most, greens and accents first, then yellows from left to right.
 */

export const LENGTHS = [5, 6, 7];
export const MAX_GUESSES = 6;

/** Puzzle #1 is 10 November 2026, in whatever time zone the player is. */
const FIRST_DAY = Date.UTC(2026, 10, 10) / 86400000;

const BASE = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u' };

/** The vowels that carry a mark, by the plain letter under them. */
export const VARIANTS = { a: ['á'], e: ['é'], i: ['í'], o: ['ó'], u: ['ú', 'ü'] };

/** A letter without its accent. ñ is a letter of its own and stays ñ. */
export function base(letter) {
  return BASE[letter] ?? letter;
}

/** A word without its accents: canción → cancion, pingüino → pinguino, año → año. */
export function plain(word) {
  return [...String(word).toLowerCase().normalize('NFC')].map(base).join('');
}

/** A word as its letters. NFC first, so a composed á is one letter, not two. */
export function letters(word) {
  return [...String(word).normalize('NFC')];
}

// ---------------------------------------------------------------- days ----

/** Today's date where the player is, as a day number. */
export function dayNumber(now = new Date()) {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

/** Today's puzzle: #1 on the first day, one more each midnight. */
export function puzzleNumber(now = new Date()) {
  return dayNumber(now) - FIRST_DAY + 1;
}

/** When the player's day next turns, as a timestamp, for a timer. */
export function nextMidnight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
}

/**
 * A puzzle's answer. The list is already in a shuffled order that spreads the
 * lengths and the kinds of word (the build deals it), so the days simply walk
 * it, and start again from the top once it has all been played.
 */
export function answerFor(number, answers) {
  const n = answers.length;
  return answers[(((number - 1) % n) + n) % n];
}

// ------------------------------------------------------------- scoring ----

/** @returns {Array<'correct'|'accent'|'present'|'absent'>} one state per letter */
export function score(guess, answer) {
  const typed = letters(guess);
  const target = letters(answer);
  const states = typed.map(() => 'absent');
  const used = target.map(() => false);

  typed.forEach((letter, i) => {
    if (letter === target[i]) { states[i] = 'correct'; used[i] = true; }
  });
  typed.forEach((letter, i) => {
    if (states[i] === 'absent' && target[i] && base(letter) === base(target[i])) { states[i] = 'accent'; used[i] = true; }
  });
  typed.forEach((letter, i) => {
    if (states[i] !== 'absent') return;
    // The same letter exactly if there is one free, else the same letter
    // under another accent; it is yellow either way.
    let at = target.findIndex((other, j) => !used[j] && other === letter);
    if (at === -1) at = target.findIndex((other, j) => !used[j] && base(other) === base(letter));
    if (at !== -1) { states[i] = 'present'; used[at] = true; }
  });
  return states;
}

const RANK = { absent: 1, present: 2, accent: 3, correct: 4 };

/**
 * What the keyboard shows for each key: the best a letter has done in any
 * guess. A letter that has only ever been grey, in any of its accents, takes
 * its other accents grey with it — no form of it is in the word.
 */
export function keyStates(guesses, answer) {
  const keys = new Map();
  for (const guess of guesses) {
    const states = score(guess, answer);
    letters(guess).forEach((letter, i) => {
      if ((RANK[states[i]] ?? 0) > (RANK[keys.get(letter)] ?? 0)) keys.set(letter, states[i]);
    });
  }
  for (const [plainLetter, marked] of Object.entries(VARIANTS)) {
    const family = [plainLetter, ...marked];
    const tried = family.filter((letter) => keys.has(letter));
    if (tried.length && tried.every((letter) => keys.get(letter) === 'absent')) {
      for (const letter of family) keys.set(letter, 'absent');
    }
  }
  return keys;
}

// ----------------------------------------------------------- the words ----

/**
 * The valid guesses, from data/tilde-words.js: a Set per length, and an index
 * by accentless spelling for "did you mean". Built once, on the first guess.
 */
export function lexicon(guesses) {
  const words = new Set();
  const byPlain = new Map();
  for (const list of Object.values(guesses)) {
    for (const word of list.split('\n')) {
      if (!word) continue;
      words.add(word);
      const key = plain(word);
      if (!byPlain.has(key)) byPlain.set(key, []);
      byPlain.get(key).push(word);
    }
  }
  return { words, byPlain };
}

/**
 * Whether a guess can be played.
 *
 *   { ok: true }                       a word: it is scored and uses a turn
 *   { ok: false, suggestions: [...] }  not a word as typed, but the same letters
 *                                      with other accents are — cancion for
 *                                      canción — so the player is asked, and
 *                                      keeps the turn
 *   { ok: false, suggestions: [] }     not a word at all
 *
 * Failing an accent, an n where ñ belongs is offered too (manana → mañana):
 * someone on a keyboard without ñ has made a typing slip, not a guess.
 */
export function check(guess, lex) {
  const word = String(guess).toLowerCase().normalize('NFC');
  if (lex.words.has(word)) return { ok: true, suggestions: [] };
  let suggestions = lex.byPlain.get(plain(word)) ?? [];
  if (!suggestions.length) {
    suggestions = enyeVariants(plain(word)).flatMap((key) => lex.byPlain.get(key) ?? []);
  }
  return { ok: false, suggestions: [...suggestions].sort() };
}

/** Every spelling with one or more of a word's n's turned to ñ. */
function enyeVariants(word) {
  const at = [...word].flatMap((letter, i) => (letter === 'n' ? [i] : []));
  const out = [];
  for (let mask = 1; mask < 2 ** at.length; mask += 1) {
    const chars = [...word];
    at.forEach((i, bit) => { if (mask & (1 << bit)) chars[i] = 'ñ'; });
    out.push(chars.join(''));
  }
  return out;
}

// -------------------------------------------------------- the results ----

const SQUARES = { correct: '🟩', accent: '🟪', present: '🟨', absent: '⬜' };

/** The result to paste: "Tilde #3 4/6 💡", then a row of squares a guess. */
export function shareText(number, guesses, answer, { hint = false } = {}) {
  const won = guesses.at(-1) === answer;
  const head = `Tilde #${number} ${won ? guesses.length : 'X'}/${MAX_GUESSES}${hint ? ' 💡' : ''}`;
  const rows = guesses.map((guess) => score(guess, answer).map((state) => SQUARES[state]).join(''));
  return [head, '', ...rows].join('\n');
}

export function emptyStats() {
  return { played: 0, won: 0, streak: 0, best: 0, dist: [0, 0, 0, 0, 0, 0], last: 0, lastWon: 0 };
}

/**
 * The stats once a puzzle is over. A puzzle counts once, however many times
 * the page is opened afterwards. The streak is days won in a row: a loss ends
 * it, and so does a day not played.
 */
export function record(stats, number, guesses, answer) {
  const next = { ...emptyStats(), ...stats, dist: [...(stats?.dist ?? emptyStats().dist)] };
  if (next.last === number) return next;
  const won = guesses.at(-1) === answer;
  next.played += 1;
  next.last = number;
  if (won) {
    next.won += 1;
    next.dist[guesses.length - 1] += 1;
    next.streak = (next.lastWon === number - 1 ? next.streak : 0) + 1;
    next.best = Math.max(next.best, next.streak);
    next.lastWon = number;
  } else {
    next.streak = 0;
  }
  return next;
}

/** The streak as it stands today: one that missed yesterday is over. */
export function currentStreak(stats, number) {
  return stats.lastWon >= number - 1 ? stats.streak : 0;
}
