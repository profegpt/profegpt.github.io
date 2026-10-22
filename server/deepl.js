/**
 * DeepL: the site's translator, for all three languages, and the only one.
 *
 * Accurate, dedicated, and answering to a published contract. The free tier is
 * 500,000 characters a month, which a class typing sentences will not come
 * close to spending. When it cannot answer, nothing else is asked — see
 * translators.js.
 */

import { throttle, USER_AGENT } from './throttle.js';

/** A free key ends in `:fx` and goes to the free host — the only one used. */
const ENDPOINT = 'https://api-free.deepl.com/v2/translate';

/** DeepL's own codes. */
const CODES = { en: 'EN', es: 'ES', fr: 'FR', it: 'IT' };

/** Target codes are regional where DeepL insists on it. */
const TARGETS = { en: 'EN-GB', es: 'ES', fr: 'FR', it: 'IT' };

/**
 * Only a free key is used. A Pro key is billed per character, and the site
 * must never cost anything, so one is treated as no key at all rather than
 * trusted to stay under some limit. A free key cannot be charged: past
 * 500,000 characters DeepL answers 456 and the translator says it is
 * unavailable until the month turns over.
 */
const isFreeKey = (key) => Boolean(key) && key.endsWith(':fx');

export function hasDeepl() {
  return isFreeKey(process.env.DEEPL_API_KEY?.trim());
}

export async function deepl(text, from, to) {
  const key = process.env.DEEPL_API_KEY?.trim();
  if (!key) throw new Error('No DeepL key');
  if (!isFreeKey(key)) throw new Error('DeepL key is not a free (:fx) key; refusing a billed one');
  if (!CODES[from] || !TARGETS[to]) throw new Error(`DeepL has no ${from}|${to} pair`);

  const body = new URLSearchParams({
    text,
    source_lang: CODES[from],
    target_lang: TARGETS[to],
    // The box is for sentences a student is reading, not for markup.
    preserve_formatting: '0',
  });

  const response = await throttle('deepl', 80, () => fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body,
    signal: AbortSignal.timeout(15000),
  }));

  if (response.status === 456) throw new Error('DeepL quota for this month is spent');
  if (response.status === 403) throw new Error('DeepL refused the key');
  if (!response.ok) throw new Error(`DeepL responded ${response.status}`);

  const payload = await response.json();
  const translated = payload?.translations?.[0]?.text;
  if (!translated?.trim()) throw new Error('DeepL returned no translation');

  return { text: translated.trim(), engine: 'DeepL' };
}
