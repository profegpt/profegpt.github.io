/**
 * The conversation, held outside the view.
 *
 * The chat page is mounted and torn down by the router, so anything owned by
 * the view dies when you switch page, change language or flip the theme. The
 * transcript lives here instead, so it is still on screen when you come back.
 *
 * Every answer comes from the grounded tutor (lib/tutor.js): the conjugator,
 * the dictionary, the translator and the grammar notes. There is no language
 * model behind it any more. A question the tutor cannot ground is answered
 * with the ways it *could* be asked instead, rather than handed to something
 * that would guess.
 */

import { answer as askTutor } from './tutor.js';
import { lang } from './i18n.js';

const state = {
  messages: [],  // { role, content, blocks? } — the visible transcript
  busy: false,   // a lookup (dictionary, translator) is in flight
};

const listeners = new Set();

/** @param {(state: object) => void} listener */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener(state);
}

export function getState() {
  return state;
}

export function isBusy() {
  return state.busy;
}

export function reset() {
  state.messages = [];
  state.busy = false;
  emit();
}

// The conversation is about one language. A Spanish transcript left on screen
// in French would show answers the new tutor could not have given.
window.addEventListener('studychange', reset);

/**
 * Ask a question. Resolves when the answer is on screen; the caller does not
 * have to stay mounted for that to happen.
 */
export async function ask(text) {
  if (state.busy) return;

  state.messages.push({ role: 'user', content: text });
  state.busy = true;
  emit();

  let blocks;
  try {
    // Answers follow the site's language, since that is the language the
    // reader chose to work in.
    ({ blocks } = await askTutor(text, { language: lang(), force: true }));
  } catch (error) {
    blocks = [{ type: 'md', text: String(error.message) }];
  }

  state.messages.push({ role: 'assistant', blocks });
  state.busy = false;
  emit();
}
