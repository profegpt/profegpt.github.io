/**
 * `/api/speak` — one spoken word, as audio.
 *
 * Deliberately narrow. It takes a word, not a sentence, and it refuses
 * anything that is not word-shaped before spending a character of a monthly
 * budget the whole site shares. See server/speech.js for why that budget is
 * the shape of the feature.
 */

import { Router } from 'express';
import { hasSpeech, MAX_SENTENCE, MAX_SPOKEN, speak } from '../speech.js';
import { studyOf } from '../study.js';

export const router = Router();

const MESSAGES = {
  es: {
    off: 'La pronunciación no está configurada.',
    notAWord: 'Solo se pronuncian palabras sueltas.',
    spent: 'Se acabaron las pronunciaciones de este mes.',
    failed: 'No se pudo pronunciar ahora mismo.',
  },
  fr: {
    off: 'La prononciation n’est pas configurée.',
    notAWord: 'Seuls les mots isolés sont prononcés.',
    spent: 'Les prononciations de ce mois-ci sont épuisées.',
    failed: 'Impossible de prononcer pour le moment.',
  },
  it: {
    off: 'La pronuncia non è configurata.',
    notAWord: 'Si pronunciano solo parole singole.',
    spent: 'Le pronunce di questo mese sono esaurite.',
    failed: 'Impossibile pronunciare in questo momento.',
  },
};

/** The same guard the dictionary uses, minus the space: one word, in letters. */
const LOOKS_LIKE_A_WORD = /^[\p{L}][\p{L}\p{M}'’\- ]*$/u;

/**
 * `?word=` is the dictionary's speaker: one word, in the side's language.
 * `?text=` is the translator's: one translated sentence, up to MAX_SENTENCE,
 * in the side's language — or in English with `&lang=en`, when the
 * translation went into English. speech.js checks both shapes again before
 * spending anything.
 */
router.get('/', async (req, res) => {
  const study = studyOf(req.query.study);
  const messages = MESSAGES[study];

  if (!hasSpeech()) return res.status(503).json({ error: messages.off });

  const sentence = req.query.text !== undefined;
  const english = req.query.lang === 'en';
  let word;
  if (sentence) {
    word = String(req.query.text ?? '').trim();
    if (!word || word.length > MAX_SENTENCE) return res.status(400).json({ error: messages.notAWord });
  } else {
    word = String(req.query.word ?? '').trim().slice(0, MAX_SPOKEN + 1);
    if (!word || word.length > MAX_SPOKEN || !LOOKS_LIKE_A_WORD.test(word)) {
      return res.status(400).json({ error: messages.notAWord });
    }
  }

  try {
    const { audio, cached } = await speak(word, study, { sentence, english });
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', String(audio.length));
    // A word sounds the same tomorrow, and the browser cache spares the
    // monthly budget as much as the server's own does.
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('X-Speech-Cache', cached ? 'hit' : 'miss');
    return res.end(audio);
  } catch (error) {
    console.warn('[speak]', error.message);

    // A 400 from speech.js is "that was not a word", which the route's own
    // guard lets through because it allows a space and speech.js counts the
    // words. Reporting it as "could not pronounce" blames the service for the
    // reader's input.
    if (error.status === 400) return res.status(400).json({ error: messages.notAWord });

    return res.status(502).json({
      error: error.spent ? messages.spent : messages.failed,
      spent: error.spent === true,
    });
  }
});
