import { Router } from 'express';
import { translate } from '../translators.js';
import { studyOf } from '../study.js';

export const router = Router();

// 500, matching the box on the page. A translator for a lesson is for
// sentences, not essays, and every engine below charges by the character.
const MAX_INPUT = 500;

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 12;
const CACHE_MAX = 500;

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
 * about, so `study` picks the other end of the pair and `from` says which way
 * round it is going.
 */
router.post('/', async (req, res) => {
  const text = String(req.body?.text ?? '').slice(0, MAX_INPUT);
  const study = studyOf(req.body?.study);
  const from = req.body?.from === 'en' ? 'en' : study;
  const to = from === 'en' ? study : 'en';

  if (!text.trim()) return res.json({ translation: '', engine: null });

  const key = `${from}>${to}:${text}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL) return res.json(hit.value);

  try {
    const result = await translate(text, from, to);
    const payload = {
      translation: result.text,
      engine: result.engine,
      notes: result.notes || [],
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
        es: 'El traductor no está disponible en este momento. Inténtalo más tarde.',
      }[study],
      // Why DeepL declined — no key, quota spent, the service down. Not shown
      // to a reader, but otherwise diagnosable only from the server log.
      detail: error.message,
    });
  }
});
