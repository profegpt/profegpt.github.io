/**
 * Gemini, from inside Google.
 *
 * Takes the place of server/providers/gemini.js in the Apps Script build, and
 * keeps its id, so llm.js and the chat route cannot tell the difference. It
 * is the same free AI Studio tier the Render site uses; the key lives in the
 * script properties rather than in a file, and goes in a header rather than
 * the URL, so it stays out of logs.
 *
 * Vertex AI was deliberately left out. It would need no key, but it bills a
 * Cloud project for every request, and the site must never cost anything.
 *
 * Apps Script cannot stream a response, so askStream yields the whole answer
 * at once. The chat still works, only without the typing effect.
 */

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export const id = 'gemini';
export const label = 'Gemini';
export const free = true;
export const keyName = 'GEMINI_API_KEY';

export function configured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function model() {
  // An alias Google keeps pointed at the current Flash. Pinning a version
  // instead invites "no longer available to new users" once it is retired.
  return process.env.GEMINI_MODEL || 'gemini-flash-latest';
}

function requestBody({ system, messages, maxTokens }) {
  return {
    contents: messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    generationConfig: { maxOutputTokens: maxTokens },
  };
}

async function failure(response) {
  const body = await response.json().catch(() => null);
  const error = new Error(body?.error?.message || `Gemini responded ${response.status}`);
  error.status = response.status;
  return error;
}

/** Free-tier capacity is shared, so overload answers are routine, not fatal. */
const TRANSIENT = new Set([429, 500, 503]);
const RETRIES = 2;
const BACKOFF_MS = 900;

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

function checkBlocked(payload) {
  const reason = payload?.promptFeedback?.blockReason;
  if (!reason) return;
  const error = new Error(`Gemini declined the request (${reason}).`);
  error.status = 422;
  error.code = 'REFUSAL';
  throw error;
}

function textOf(payload) {
  return (payload?.candidates?.[0]?.content?.parts || [])
    .map((part) => (part.thought ? '' : part.text || ''))
    .join('');
}

export async function ask({ system, messages, maxTokens = 2000 }) {
  const url = `${ENDPOINT}/${model()}:generateContent`;
  let last = null;

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody({ system, messages, maxTokens })),
    });

    if (response.ok) {
      const payload = await response.json();
      checkBlocked(payload);
      return textOf(payload).trim();
    }

    last = await failure(response);
    if (!TRANSIENT.has(response.status) || attempt === RETRIES) throw last;
    await wait(BACKOFF_MS * (attempt + 1));
  }
  throw last;
}

export async function* askStream({ system, messages, maxTokens = 4000 }) {
  const text = await ask({ system, messages, maxTokens });
  if (text) yield text;
}
