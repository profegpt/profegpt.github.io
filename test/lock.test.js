/**
 * The teacher's padlock: one switch, one passcode.
 *
 * There used to be a second word in the same dialog that opened French and
 * Latin for one browser. The languages are now chosen freely on the home page,
 * so that word is gone, and it must stay gone — "profe" is just a wrong
 * passcode now.
 *
 * The router is mounted on a real express app, since that is the only way to
 * exercise what the browser actually talks to.
 */
import express from 'express';
import { router } from '../server/routes/lock.js';

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const app = express();
app.use(express.json());
app.use('/api/lock', router);

const server = app.listen(0);
const { port } = server.address();
const base = `http://127.0.0.1:${port}/api/lock`;

const read = async () => (await fetch(base)).json();
const send = async (passcode, body = {}) => {
  const response = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode, ...body }),
  });
  return { status: response.status, state: await response.json() };
};

// --- it starts open --------------------------------------------------------
let state = await read();
ok('starts unlocked', state.locked === false);
ok('and says nothing about subjects', state.restricted === undefined && state.opened === undefined);

// --- the old language passcodes are gone ---------------------------------
for (const old of ['profe', 'walsh']) {
  const result = await send(old);
  ok(`"${old}" is now just a wrong passcode`, result.status === 403, String(result.status));
  ok('and opens nothing', result.state.opened === undefined && result.state.locked === false);
}

// --- the lock --------------------------------------------------------------
let result = await send('AP_Lit');
ok('the teacher passcode locks', result.state.locked === true);
ok('a lock records when', typeof result.state.since === 'number');

result = await send('AP_Lit');
ok('and toggles back', result.state.locked === false);
ok('clearing the timestamp', result.state.since === null);

// Case and stray spaces are forgiven.
result = await send('  ap_lit ', { locked: true });
ok('the passcode is case-insensitive', result.state.locked === true);
result = await send('AP_Lit', { locked: false });
ok('and an explicit target is honoured', result.state.locked === false);

// --- anything else is refused ---------------------------------------------
result = await send('nope');
ok('a wrong passcode is refused', result.status === 403, String(result.status));
ok('and changes nothing', result.state.locked === false && result.state.opened === undefined);
ok('and does not give the passcode away', !/AP_Lit/i.test(JSON.stringify(result.state)));
result = await send('');
ok('an empty passcode is refused', result.status === 403);

server.close();

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} lock checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} lock checks passed`);
