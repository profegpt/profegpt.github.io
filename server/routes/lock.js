/**
 * The teacher's lock.
 *
 * One switch, held on the server, that seals the site for everybody at once.
 * Anyone holding the passcode can throw it either way — that is the point: a
 * teacher locks the room, and unlocks it when the lesson resumes.
 *
 * It lives in memory, so a server restart clears it. That is a deliberate
 * failsafe: nobody can be locked out by a process nobody is watching.
 *
 * It is the only passcode left on the site. The languages are chosen on the
 * home page and the interface can be read in English from any of them — there
 * is nothing else to unlock.
 */

import { Router } from 'express';

export const router = Router();

const PASSCODE = process.env.TEACHER_PASSCODE || 'AP_Lit';

const lock = { locked: false, since: null };

/** Case-insensitive, and tolerant of the spaces a phone keyboard adds. */
const same = (value, passcode) =>
  String(value ?? '').trim().toLowerCase() === String(passcode).trim().toLowerCase();

const state = () => ({ locked: lock.locked, since: lock.since });

router.get('/', (_req, res) => {
  res.json(state());
});

router.post('/', (req, res) => {
  if (!same(req.body?.passcode, PASSCODE)) {
    return res.status(403).json({ error: 'Código incorrecto.', ...state() });
  }

  const next = typeof req.body?.locked === 'boolean' ? req.body.locked : !lock.locked;
  lock.locked = next;
  lock.since = next ? Date.now() : null;

  console.log(`[lock] site ${next ? 'locked' : 'unlocked'}`);
  res.json(state());
});
