import { Router } from 'express';
import { translate } from '../translators.js';
import { STUDY_LANGUAGES } from '../study.js';

export const router = Router();

// 500, matching the box on the page. A translator for a lesson is for
// sentences, not essays, and every engine below charges by the character.
const MAX_INPUT = 500;

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 12;
const CACHE_MAX = 500;

/**
 * Part of every cache key. On Apps Script the cache is CacheService, which
 * outlives a deploy by up to six hours, so bumping this is how a deploy drops
 * answers cached by the code it replaces.
 */
const CACHE_VERSION = 'v2';

/**
 * Which way to translate, from what the page says, or null if it does not
 * say clearly.
 *
 * Both ends are named by the page: the source pane's language and the target
 * pane's. Nothing is guessed. This used to read only `from`, and anything
 * that was not exactly 'en' (missing, 'EN', 'en-US') was quietly taken as the
 * study language going into English, so a request meant for French could
 * come back in English. An unclear request is now refused instead, and DeepL
 * is told the source language every time, so a short word that is also a
 * word elsewhere ("hi", "no", "pain") is read in the language it was typed in.
 *
 * `to` may be left out by older pages, and is then the other end of the pair.
 */
export function directionOf(body) {
  const study = body?.study;
  if (!STUDY_LANGUAGES.includes(study)) return null;
  const from = body?.from;
  if (from !== 'en' && from !== study) return null;
  const to = body?.to === undefined ? (from === 'en' ? study : 'en') : body.to;
  if (to !== 'en' && to !== study) return null;
  if (to === from) return null;
  return { study, from, to };
}

function remember(key, value) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, { at: Date.now(), value });
}

/**
 * No language model is involved here. Translation is DeepL's alone, with
 * Wikipedia keeping names right — see server/translators.js — and when DeepL
 * cannot answer the page says so rather than offering a lesser engine's guess.
 *
 * The site always translates between English and the language it is currently
 * about: `study` is that language, `from` the source pane's and `to` the
 * target pane's. See directionOf.
 */
router.post('/', async (req, res) => {
  const text = String(req.body?.text ?? '').slice(0, MAX_INPUT);
  const direction = directionOf(req.body);
  if (!direction) {
    return res.status(400).json({
      error: 'Say which way to translate: from and to are English and the language of the side.',
    });
  }
  const { study, from, to } = direction;

  if (!text.trim()) return res.json({ translation: '', engine: null, from, to });

  const key = `${CACHE_VERSION}:${from}>${to}:${text}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return res.json(hit.value);

  try {
    const result = await translate(text, from, to);
    const payload = {
      translation: result.text,
      engine: result.engine,
      notes: result.notes || [],
      // Which way it went, so the page can check it is the way it asked.
      from,
      to,
    };

    remember(key, payload);
    return res.json(payload);
  } catch (error) {
    console.warn('[translate]', error.message);
    // Never cached: DeepL coming back should be noticed on the next keystroke.
    return res.status(503).json({
      unavailable: true,
      error: {
        fr: 'Le traducteur n’est pas disponible pour le moment. Réessayez plus tard.',
        it: 'Il traduttore non è disponibile in questo momento. Riprova più tardi.',
        de: 'Der Übersetzer ist im Moment nicht verfügbar. Versuch es später noch einmal.',
        nl: 'De vertaler is op dit moment niet beschikbaar. Probeer het later opnieuw.',
        pt: 'O tradutor não está disponível neste momento. Tenta novamente mais tarde.',
        es: 'El traductor no está disponible en este momento. Inténtalo más tarde.',
      }[study],
      // Why DeepL declined — no key, quota spent, the service down. Not shown
      // to a reader, but otherwise diagnosable only from the server log.
      detail: error.message,
    });
  }
});
