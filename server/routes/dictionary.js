import { Router } from 'express';
import { ATTRIBUTION, tatoebaExamples, wiktionaryGloss } from '../corpus.js';
import { fetchWiktionnaire, WIKTIONNAIRE_CREDIT } from '../dictionary-fr.js';
import { fetchWikizionario, WIKIZIONARIO_CREDIT } from '../dictionary-it.js';
import { accentedForm } from '../accents.js';
import { studyOf } from '../study.js';

export const router = Router();

/**
 * The dictionaries this route can answer from.
 *
 * Spanish has the RAE, which is the authority and says so. French and Italian
 * have no equivalent that can be queried, so each language's own Wiktionary
 * answers instead and is credited where its licence requires it.
 * See server/dictionary-fr.js and server/dictionary-it.js.
 */
const MESSAGES = {
  es: {
    missing: 'Falta la palabra a buscar.',
    notFound: (word) => `"${word}" no aparece en el Diccionario de la lengua española.`,
    failed: (detail) => `No se pudo consultar el diccionario: ${detail}`,
    notAWord: 'Busca una palabra: solo letras, sin símbolos.',
  },
  fr: {
    missing: 'Il manque le mot à chercher.',
    notFound: (word) => `« ${word} » ne figure pas dans le dictionnaire.`,
    failed: (detail) => `Impossible de consulter le dictionnaire : ${detail}`,
    notAWord: 'Cherchez un mot : des lettres seulement, sans symboles.',
  },
  it: {
    missing: 'Manca la parola da cercare.',
    notFound: (word) => `«${word}» non compare nel dizionario.`,
    failed: (detail) => `Impossibile consultare il dizionario: ${detail}`,
    notAWord: 'Cerca una parola: solo lettere, senza simboli.',
  },
};

const RAE_API = 'https://rae-api.com/api/words';
const EXAMPLES_PER_WORD = 4;

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 6;

function normalizeQuery(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .slice(0, 60);
}

/**
 * A word, or something to hand to a dictionary at all.
 *
 * Letters, and the punctuation that lives inside real headwords: the hyphen of
 * *arc-en-ciel*, the apostrophe of *aujourd'hui*, the space of *in bocca al lupo*.
 * Nothing else — `<script>alert(1)</script>` and `../../etc/passwd` are not
 * failed lookups, and sending them upstream produced a 502 that told a student
 * the dictionary was unreachable when the dictionary was perfectly fine. It
 * also spent a request on each, against a budget shared by a whole class.
 */
const LOOKS_LIKE_A_WORD = /^[\p{L}][\p{L}\p{M}'’\- ]*$/u;

/** Strip the "Sin.:" / "Ant." tails RAE packs into the raw sense string. */
function cleanDescription(sense) {
  const description = (sense.description || '').trim();
  if (description) return description.replace(/\s*\.$/, '');
  return (sense.raw || '')
    .replace(/^\d+\.\s*/, '')
    .split(/Sin\.:|Ant\.:/)[0]
    .trim();
}

function normalizeSense(sense) {
  return {
    number: sense.meaning_number ?? null,
    category: sense.category || '',
    verbCategory: sense.verb_category || '',
    gender: sense.gender || '',
    usage: sense.usage || '',
    description: cleanDescription(sense),
    usageNotes: sense.usage_notes || [],
    synonyms: (sense.synonyms || []).map((word) => word.replace(/\d+$/, '')),
    antonyms: (sense.antonyms || []).map((word) => word.replace(/\d+$/, '')),
  };
}

function normalizeEntry(meaning) {
  return {
    origin: meaning.origin?.raw || '',
    senses: (meaning.senses || []).map(normalizeSense),
    locutions: (meaning.locutions || []).slice(0, 12).map((locution) => ({
      expression: locution.expression,
      senses: (locution.senses || []).map(normalizeSense),
    })),
    hasConjugations: Boolean(meaning.conjugations),
  };
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * Anonymous access to rae-api.com is 10 requests a minute and 100 a day, which
 * a real site burns through quickly. A free self-service key raises that to
 * 60/minute and 5,000/day — set RAE_API_KEY and it is used automatically.
 * https://rae-api.com/login
 */
function raeHeaders() {
  const headers = { accept: 'application/json' };
  if (process.env.RAE_API_KEY) headers['X-API-Key'] = process.env.RAE_API_KEY;
  return headers;
}

export async function fetchRae(word, attempt = 0) {
  const response = await fetch(`${RAE_API}/${encodeURIComponent(word)}`, {
    headers: raeHeaders(),
    signal: AbortSignal.timeout(15000),
  });

  // A per-minute limit clears on its own; a daily one does not, so only retry
  // when the wait is short enough to be worth holding the request open for.
  if (response.status === 429 || response.status >= 500) {
    const retryAfter = Number(response.headers.get('retry-after')) || 0;
    if (attempt < 2 && retryAfter <= 5) {
      await wait(Math.max(600, retryAfter * 1000) * (attempt + 1));
      return fetchRae(word, attempt + 1);
    }
    if (response.status === 429) {
      const minutes = Math.ceil(retryAfter / 60);
      const error = new Error(minutes > 1
        ? `El diccionario está limitando las consultas. Vuelve en unos ${minutes} minutos.`
        : 'El diccionario está limitando las consultas. Inténtalo de nuevo en un momento.');
      error.status = 429;
      throw error;
    }
  }

  if (response.status === 404) {
    const body = await response.json().catch(() => ({}));
    return { found: false, suggestions: body.suggestions || [] };
  }
  if (!response.ok) throw new Error(`RAE lookup failed (${response.status})`);
  const body = await response.json();
  if (!body.ok || !body.data) return { found: false, suggestions: [] };
  return { found: true, data: body.data };
}

/**
 * No corpus sentence: build one plainly-correct frame per part of speech.
 * Clearly labelled as a template in the UI so nobody mistakes it for a real
 * citation.
 */
function templateExample(word, sense, study) {
  const feminine = sense.gender === 'feminine';
  if (study === 'it') {
    switch (sense.category) {
      case 'verb':
        return { text: `Domani proviamo a ${word} di nuovo.`, en: '' };
      case 'adjective':
        return { text: `Questo dettaglio mi sembra piuttosto ${word}.`, en: '' };
      case 'adverb':
        return { text: `L'ha fatto ${word}, come sempre.`, en: '' };
      case 'noun':
        // "di" fuses with the article, and which article depends on the word's
        // first letters as well as its gender — so the frame avoids the
        // article altogether rather than risk *del zaino*.
        return { text: `Abbiamo parlato a lungo di «${word}» durante la cena.`, en: '' };
      default:
        return { text: `Ecco un esempio con «${word}».`, en: '' };
    }
  }
  if (study === 'fr') {
    switch (sense.category) {
      case 'verb':
        return { text: `Demain, nous allons ${word} de nouveau.`, en: '' };
      case 'adjective':
        return { text: `Ce détail me paraît plutôt ${word}.`, en: '' };
      case 'adverb':
        return { text: `Il l'a fait ${word}, comme toujours.`, en: '' };
      case 'noun':
        return { text: `Nous avons parlé ${feminine ? `de la ${word}` : `du ${word}`} pendant le dîner.`, en: '' };
      default:
        return { text: `Voici un exemple avec « ${word} ».`, en: '' };
    }
  }
  switch (sense.category) {
    case 'verb':
      return { text: `Mañana vamos a ${word} otra vez.`, en: '' };
    case 'adjective':
      return { text: `Ese detalle me parece bastante ${word}.`, en: '' };
    case 'adverb':
      return { text: `Lo hizo ${word}, como siempre.`, en: '' };
    case 'noun':
      // "de + el" contracts to "del", so the two frames differ by more than the article.
      return { text: `Hablamos ${feminine ? `de la ${word}` : `del ${word}`} durante la cena.`, en: '' };
    default:
      return { text: `Aquí tienes un ejemplo con «${word}».`, en: '' };
  }
}

/**
 * Example sentences and glosses, shared by every dictionary.
 *
 * Real sentences from Tatoeba and a real English gloss from Wiktionary, both
 * free and unmetered. Where Tatoeba has nothing, the template frame stands in,
 * labelled as one. No model writes sentences: an invented example with a
 * subtle mistake in it is worse than a plain frame that says what it is.
 */
async function enrich(word, senses, english, study) {
  const [usage, gloss] = await Promise.all([
    tatoebaExamples(word, 2, study),
    english ? wiktionaryGloss(word, 3, study) : Promise.resolve(null),
  ]);

  const examples = {};
  if (!usage?.length) {
    for (const sense of senses.slice(0, EXAMPLES_PER_WORD)) {
      const frame = templateExample(word, sense, study);
      if (frame) examples[sense.number] = frame;
    }
  }

  return {
    examples,
    exampleSource: usage?.length ? 'tatoeba' : (Object.keys(examples).length ? 'template' : null),
    // Attached to the word rather than to a sense: a corpus sentence contains
    // the word, it does not promise to illustrate one particular meaning.
    usage: usage?.length ? { sentences: usage, credit: ATTRIBUTION.tatoeba } : null,
    gloss: gloss?.length ? { senses: gloss, credit: ATTRIBUTION.wiktionary } : null,
  };
}

/**
 * The French and Italian entries: each language's own Wiktionary, read into
 * the RAE's shape so the page and the tutor never learn which one answered.
 */
const WIKIS = {
  fr: {
    fetch: fetchWiktionnaire, source: 'wiktionnaire', name: 'Wiktionnaire', host: 'fr.wiktionary.org', credit: WIKTIONNAIRE_CREDIT,
  },
  it: {
    fetch: fetchWikizionario, source: 'wikizionario', name: 'Wikizionario', host: 'it.wiktionary.org', credit: WIKIZIONARIO_CREDIT,
  },
};

async function lookupWiki(study, word, english) {
  const wiki = WIKIS[study];
  const lookup = await wiki.fetch(word);
  if (!lookup.found) {
    const error = new Error(MESSAGES[study].notFound(word));
    error.status = 404;
    error.suggestions = lookup.suggestions || [];
    throw error;
  }

  const entries = [{
    // Both wikis keep one etymology for the whole page rather than one per
    // part of speech, so it sits on the first entry.
    origin: lookup.origin || '',
    senses: lookup.entries.flatMap((entry) => entry.senses),
    locutions: [],
  }];

  return {
    word: lookup.word,
    definitionSource: wiki.source,
    entries,
    ...await enrich(lookup.word, entries[0].senses, english, study),
    corrected: lookup.corrected ?? null,
    suggestions: [],
    // The licence on this text is CC BY-SA, which requires the source to be
    // named. It is one line in the footer of the entry rather than a banner.
    source: { name: wiki.name, url: `https://${wiki.host}/wiki/${encodeURIComponent(lookup.word)}` },
    credit: wiki.credit,
  };
}

/** The Spanish entry: the RAE, with Wiktionary standing in only if it is down. */
async function lookupSpanish(word, english) {
  let lookup;
  try {
    lookup = await fetchRae(word);
  } catch (error) {
    // The RAE is the definition. When it cannot be reached, Wiktionary is
    // better than nothing — but the entry says plainly that it is not the RAE,
    // because a dictionary that quietly changes authority is worse than one
    // that admits it is unavailable.
    const glosses = await wiktionaryGloss(word, 6, 'es');
    if (glosses?.length) {
      const sentences = await tatoebaExamples(word, 2, 'es');
      return {
        word,
        definitionSource: 'wiktionary',
        entries: [{
          origin: '',
          senses: glosses.map((definition, index) => ({
            number: index + 1,
            category: '',
            verbCategory: '',
            gender: '',
            usage: '',
            description: definition,
            usageNotes: [],
            synonyms: [],
            antonyms: [],
          })),
          locutions: [],
        }],
        examples: {},
        exampleSource: null,
        usage: sentences?.length ? { sentences, credit: ATTRIBUTION.tatoeba } : null,
        gloss: null,
        suggestions: [],
        raeError: error.message,
        source: ATTRIBUTION.wiktionary,
      };
    }
    throw error;
  }

  // The RAE's own 404 carries the accented spelling: asked for "jamon" it
  // answers not-found and suggests "jamón". Taken only when it is the same
  // word with its accents put back — see server/accents.js.
  let corrected = null;
  if (!lookup.found) {
    const accented = accentedForm(word, lookup.suggestions);
    if (accented) {
      const second = await fetchRae(accented).catch(() => null);
      if (second?.found) {
        lookup = second;
        corrected = { from: word, to: accented };
      }
    }
  }

  if (!lookup.found) {
    const error = new Error(MESSAGES.es.notFound(word));
    error.status = 404;
    error.suggestions = lookup.suggestions || [];
    throw error;
  }

  const entries = (lookup.data.meanings || []).map(normalizeEntry);
  const allSenses = entries.flatMap((entry) => entry.senses);

  return {
    word: lookup.data.word,
    definitionSource: 'rae',
    entries,
    ...await enrich(lookup.data.word, allSenses, english, 'es'),
    corrected,
    suggestions: lookup.data.suggestions || [],
    source: { name: 'Real Academia Española · DLE', url: `https://dle.rae.es/${encodeURIComponent(word)}` },
  };
}

router.get('/', async (req, res) => {
  // Which language the site is about, which is not the language of the chrome.
  const study = studyOf(req.query.study);
  const messages = MESSAGES[study];

  const word = normalizeQuery(req.query.word);
  if (!word) return res.status(400).json({ error: messages.missing });
  if (!LOOKS_LIKE_A_WORD.test(word)) return res.status(400).json({ error: messages.notAWord });

  // The chrome language, which decides only whether an English gloss and an
  // English rendering of the definition are wanted. The English entry differs,
  // so it is a different cache entry.
  const english = req.query.lang === 'en';
  const key = `${study}|${word}|${english ? 'en' : 'study'}`;

  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL) return res.json(cached.payload);

  try {
    const payload = WIKIS[study] ? await lookupWiki(study, word, english)
      : await lookupSpanish(word, english);
    cache.set(key, { at: Date.now(), payload });
    return res.json(payload);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ error: error.message, suggestions: error.suggestions || [] });
    }
    // Pass a rate limit through as one, so the client can tell "come back
    // later" apart from "the dictionary is broken".
    const status = error.status === 429 ? 429 : 502;
    return res.status(status).json({
      error: status === 429 ? error.message : messages.failed(error.message),
    });
  }
});
