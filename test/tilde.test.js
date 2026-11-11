/**
 * Tilde: the scoring, accents and repeated letters included; the puzzle is a
 * function of the date; every answer is a word the game accepts, of the right
 * length, with a sentence to hint with; every verb form is what the conjugator
 * says it is; and "did you mean" finds the accented word.
 */
const {
  answerFor, base, check, currentStreak, emptyStats, keyStates, letters, lexicon, nextMidnight, plain,
  puzzleNumber, record, score, shareText, LENGTHS, MAX_GUESSES,
} = await import('../public/js/lib/tilde.js');
const { ANSWERS } = await import('../public/js/data/tilde-answers.js');
const { GUESSES } = await import('../public/js/data/tilde-words.js');
const { conjugate } = await import('../public/js/lib/conjugator.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function scores(guess, answer, expected) {
  const got = score(guess, answer);
  ok(`${guess} against ${answer}`, same(got, expected), `${got.join(' ')} ≠ ${expected.join(' ')}`);
}

// ------------------------------------------------------------- letters ----

ok('ñ keeps its tilde', plain('año') === 'año' && base('ñ') === 'ñ');
ok('the diaeresis comes off', plain('pingüino') === 'pinguino');
ok('acute accents come off', plain('CANCIÓN') === 'cancion');
ok('a decomposed á is one letter', letters('canción').length === 7);

// ------------------------------------------------------------- scoring ----

const G = 'correct';
const P = 'accent';
const Y = 'present';
const X = 'absent';

scores('canción', 'canción', [G, G, G, G, G, G, G]);
scores('cancion', 'canción', [G, G, G, G, G, P, G]);
scores('cantó', 'canto', [G, G, G, G, P]);
scores('cigueña', 'cigüeña', [G, G, G, P, G, G, G]);
// ñ is a letter of its own, not n with an accent.
scores('canas', 'cañas', [G, G, X, G, G]);
scores('cañas', 'canas', [G, G, X, G, G]);
// The accent state is counted before yellow, even with the plain letter free elsewhere.
scores('sabana', 'sábana', [G, P, G, G, G, G]);
// Yellow compares letters without their accents.
scores('barco', 'árbol', [Y, Y, Y, X, Y]);
scores('ópera', 'poder', [Y, Y, Y, Y, X]);
// Repeated letters: each letter of the answer answers one tile at most.
// perro has two r's: the green takes one, the first stray r the other, the last none.
scores('error', 'perro', [Y, Y, G, Y, X]);
scores('nanas', 'nadie', [G, G, X, X, X]);
scores('mama', 'mamá', [G, G, G, P]);
scores('pápa', 'papá', [G, P, G, P]);
scores('aaaaa', 'casas', [X, G, X, G, X]);
scores('ááááá', 'casas', [X, P, X, P, X]);
// A green later in the word takes the only copy, so the earlier one is grey.
scores('lolas', 'pelos', [X, Y, G, X, G]);
scores('lleno', 'pelos', [Y, X, Y, X, Y]);

const keys = keyStates(['barco'], 'árbol');
ok('a key shows the best its letter has done', keys.get('b') === 'present' && keys.get('c') === 'absent');
const greyed = keyStates(['turno'], 'árbol');
ok('a letter grey in every accent greys its other accents', greyed.get('u') === 'absent' && greyed.get('ú') === 'absent' && greyed.get('ü') === 'absent');
ok('a letter found keeps its other accents unknown', !greyed.has('ó') && greyed.get('o') === 'present');
const better = keyStates(['sabana', 'sábana'], 'sábana');
ok('a key that was purple turns green once found', better.get('á') === 'correct' && better.get('a') === 'correct');

// ---------------------------------------------------------------- days ----

ok('10 November 2026 is puzzle #1, from the first minute', puzzleNumber(new Date(2026, 10, 10, 0, 1)) === 1);
ok('and to the last', puzzleNumber(new Date(2026, 10, 10, 23, 59)) === 1);
ok('11 November is #2', puzzleNumber(new Date(2026, 10, 11, 0, 0)) === 2);
ok('a year on is #366', puzzleNumber(new Date(2027, 10, 10, 12, 0)) === 366);
ok('a change of clocks does not skip a day', puzzleNumber(new Date(2027, 2, 15, 9)) - puzzleNumber(new Date(2027, 2, 13, 9)) === 2);
ok('the next midnight is local midnight', nextMidnight(new Date(2026, 10, 10, 15, 30)) === new Date(2026, 10, 11).getTime());
ok('puzzle #1 is the first answer', answerFor(1, ANSWERS) === ANSWERS[0]);
ok('the same puzzle is always the same word', answerFor(42, ANSWERS) === answerFor(42, ANSWERS));
ok('the list starts again once it has all been played', answerFor(ANSWERS.length + 1, ANSWERS) === ANSWERS[0]);
const year = Array.from({ length: 365 }, (_, i) => answerFor(i + 1, ANSWERS).word);
ok('no answer twice in the first year', new Set(year).size === 365);

// --------------------------------------------------------------- words ----

const lex = lexicon(GUESSES);
for (const n of LENGTHS) {
  const list = GUESSES[n].split('\n');
  ok(`every ${n}-letter guess has ${n} letters`, list.every((word) => letters(word).length === n), list.find((word) => letters(word).length !== n));
  ok(`the ${n}-letter guesses are Spanish letters only`, list.every((word) => /^[a-zñáéíóúü]+$/.test(word)));
  ok(`there are plenty of ${n}-letter guesses`, list.length > 4000, `${list.length}`);
}
ok('the misspelling cancion is not a guess', !lex.words.has('cancion') && lex.words.has('canción'));
ok('the misspelling pidio is not a guess', !lex.words.has('pidio') && lex.words.has('pidió'));
ok('conjugated forms are guesses', ['hagamos', 'hubiera', 'dijeron', 'pidió', 'vayamos'].every((word) => lex.words.has(word)));

ok('at least six hundred answers', ANSWERS.length >= 600, `${ANSWERS.length}`);
ok('no answer twice', new Set(ANSWERS.map((answer) => answer.word)).size === ANSWERS.length);
const verbs = ANSWERS.filter((answer) => answer.kind === 'verb').length;
ok('about a third are verb forms', verbs / ANSWERS.length > 0.28 && verbs / ANSWERS.length < 0.42, `${verbs} of ${ANSWERS.length}`);
const firstYear = ANSWERS.slice(0, 365).filter((answer) => answer.kind === 'verb').length;
ok('and so is the first year', firstYear > 110 && firstYear < 135, `${firstYear}`);
for (const n of LENGTHS) {
  ok(`plenty of ${n}-letter answers in the first year`, ANSWERS.slice(0, 365).filter((answer) => letters(answer.word).length === n).length > 80);
}
ok('never the same length two days running',
  ANSWERS.slice(0, 365).every((answer, i, list) => i === 0 || letters(answer.word).length !== letters(list[i - 1].word).length));

const KINDS = ['n.m', 'n.f', 'n.mf', 'adj', 'adv', 'pron', 'prep', 'conj', 'interj', 'num', 'verb'];
const TENSE = (table, tense) => {
  if (tense === 'gerundio' || tense === 'participio') return null;
  if (tense === 'imperativo') return table.imperativo.afirmativo;
  const [mood, name] = tense.split('.');
  return table[mood]?.[name];
};
for (const answer of ANSWERS) {
  const { word } = answer;
  ok(`${word} is 5 to 7 letters`, LENGTHS.includes(letters(word).length));
  ok(`${word} is a guess the game accepts`, lex.words.has(word));
  ok(`${word} has a known kind`, KINDS.includes(answer.kind), answer.kind);
  ok(`${word} has a hint with one blank`, answer.hint?.text?.split('____').length === 2, answer.hint?.text);
  ok(`${word}'s hint does not give the word away`, !answer.hint.text.toLowerCase().split(/[^\p{L}]+/u).includes(word));
  ok(`${word}'s hint has its translation and its source`, Boolean(answer.hint.en) && Number.isInteger(answer.hint.id));
  if (answer.kind === 'verb') {
    ok(`${word} has a reading`, answer.forms?.length > 0);
    for (const form of answer.forms ?? []) {
      const result = conjugate(form.lemma);
      ok(`${word}: ${form.lemma} conjugates`, result.ok);
      if (!result.ok) continue;
      ok(`${word}: ${form.lemma} has an English gloss`, Boolean(form.gloss));
      if (form.tense === 'gerundio' || form.tense === 'participio') {
        ok(`${word} is the ${form.tense} of ${form.lemma}`, result.table.formas[form.tense] === word);
      } else {
        const row = TENSE(result.table, form.tense);
        for (const person of form.persons) {
          ok(`${word} is ${form.lemma}, ${form.tense}, ${person}`, row?.[person] === word, row?.[person]);
        }
      }
    }
  } else {
    ok(`${word} has an English gloss`, Boolean(answer.gloss));
  }
}

// ------------------------------------------------------ did you mean ----

const cancion = check('cancion', lex);
ok('cancion is not played', cancion.ok === false);
ok('cancion offers canción', same(cancion.suggestions, ['canción']), cancion.suggestions.join(', '));
ok('pidio offers pidió', same(check('pidio', lex).suggestions, ['pidió']));
ok('arbol offers árbol', same(check('arbol', lex).suggestions, ['árbol']));
ok('a wrong accent is put right too', check('cánción', lex).suggestions.includes('canción'));
ok('manana offers mañana', check('manana', lex).suggestions.includes('mañana'));
ok('canción is played', check('canción', lex).ok && check('CANCIÓN', lex).ok);
ok('a word that is not one offers nothing', same(check('qxzvw', lex), { ok: false, suggestions: [] }));

// ------------------------------------------------------------ results ----

ok('the shared result', shareText(3, ['barco', 'árbol'], 'árbol', { hint: true })
  === 'Tilde #3 2/6 💡\n\n🟨🟨🟨⬜🟨\n🟩🟩🟩🟩🟩');
ok('the accent square is purple', shareText(1, ['sabana', 'sábana'], 'sábana').split('\n')[2] === '🟩🟪🟩🟩🟩🟩');
const lost = Array(MAX_GUESSES).fill('barco');
ok('a lost game is X/6, with no bulb unless the hint was used', shareText(9, lost, 'árbol').startsWith('Tilde #9 X/6\n'));

let stats = record(emptyStats(), 1, ['barco', 'árbol'], 'árbol');
ok('a win counts', stats.played === 1 && stats.won === 1 && stats.dist[1] === 1 && stats.streak === 1);
ok('the same puzzle counts once', same(record(stats, 1, ['barco', 'árbol'], 'árbol'), stats));
stats = record(stats, 2, ['árbol'], 'árbol');
ok('a win the next day carries the streak', stats.streak === 2 && stats.best === 2 && stats.dist[0] === 1);
ok('the streak stands the day after', currentStreak(stats, 3) === 2);
ok('and is over once a day is missed', currentStreak(stats, 4) === 0);
stats = record(stats, 4, ['árbol'], 'árbol');
ok('a win after a missed day starts again at one', stats.streak === 1 && stats.best === 2);
stats = record(stats, 5, lost, 'árbol');
ok('a loss ends the streak and counts as played', stats.streak === 0 && stats.played === 4 && stats.won === 3);

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Tilde checks failed:\n`);
  for (const failure of failures.slice(0, 40)) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Tilde checks passed`);
