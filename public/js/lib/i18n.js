/**
 * Interface language.
 *
 * Two axes meet here and they are not the same thing:
 *
 *   lib/study.js  — the language the site is *about*: Spanish, French or Italian.
 *   this file     — the language of the *chrome*: the study language, or English.
 *
 * So the header switch reads ES | EN on the Spanish side, FR | EN on the French
 * one and IT | EN on the Italian one. Either half is one click away; nothing is
 * behind a passcode any more.
 *
 * What is remembered is the choice of English, not a language code. Somebody
 * reading the Spanish side in English and then picking Italian on the home page
 * meant "in English" rather than "in Spanish", so English carries over and
 * everything else follows the subject.
 *
 * Content the site is about never changes language: verb forms, dictionary
 * headwords, the subject pronouns in the tables. Only the chrome moves.
 *
 * There is one string table per study language rather than one table with a
 * fourth column, because the English half differs too — "Spanish questions are
 * free" and "French questions are free" are different sentences, and so is
 * every mention of the dictionary behind each side.
 */

import { studyLang } from './study.js';

const LANG_KEY = 'profegpt:lang';

function readEnglish() {
  try { return localStorage.getItem(LANG_KEY) === 'en'; } catch { return false; }
}

let english = readEnglish();

/** The chrome language right now: English, or whatever the site is about. */
export function lang() {
  return english ? 'en' : studyLang();
}

/** The two options the switch offers right now. */
export function languageOptions() {
  return [studyLang(), 'en'];
}

export function setLang(next) {
  english = next === 'en';
  try {
    if (english) localStorage.setItem(LANG_KEY, 'en');
    else localStorage.removeItem(LANG_KEY);
  } catch {
    // Storage blocked — the choice still applies for this visit.
  }
  document.documentElement.lang = lang();
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang() } }));
  return lang();
}

/** Look a string up, with {placeholders}. */
export function t(key, vars = null) {
  const table = STRINGS[studyLang()] ?? STRINGS.es;
  const entry = key.split('.').reduce((node, part) => node?.[part], table);
  let text = entry?.[lang()] ?? entry?.[studyLang()] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Pick the right half of an object that already carries both languages. */
export function pick(pair) {
  return pair?.[lang()] ?? pair?.[studyLang()] ?? pair?.en ?? '';
}

const two = (es, en) => ({ es, en });
const deux = (fr, en) => ({ fr, en });
const due = (it, en) => ({ it, en });
// German, Dutch and Portuguese each build their table with a helper of their own below.

const SPANISH = {
  nav: {
    translator: two('Traductor', 'Translator'),
    conjugation: two('Conjugación', 'Conjugation'),
    dictionary: two('Diccionario', 'Dictionary'),
    chat: two('Chat', 'Chat'),
    tilde: two('Tilde', 'Tilde'),
    languages: two('Idiomas', 'Languages'),
    langLabel: two('Idioma de la web', 'Site language'),
  },

  meta: {
    home: two('ProfeGPT', 'ProfeGPT'),
    skip: two('Saltar al contenido', 'Skip to content'),
    footer: two('definiciones del', 'definitions from the'),
    copyright: two('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: two('Diccionario de la lengua española', 'Diccionario de la lengua española'),
    footerHref: two('https://dle.rae.es', 'https://dle.rae.es'),
    footerCredit: two(' (RAE)', ' (RAE)'),
  },

  hero: {
    sub: two(
      'Traduce del español al inglés y del inglés al español. Conjuga cualquier verbo. Consulta la RAE y pregúntale al tutor.',
      'Translate from Spanish to English and English to Spanish. Conjugate any verb. Look words up in the RAE and ask the tutor.',
    ),
    ctaTranslate: two('Prueba el traductor', 'Try the translator'),
    ctaChat: two('Habla con ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: two('El traductor no está disponible.', 'The translator is unavailable.'),
    unavailable: two(
      'No se ha podido traducir esta frase ahora mismo. Inténtalo de nuevo dentro de un rato; mientras tanto, el diccionario y el conjugador siguen funcionando.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: two('Traductor', 'Translator'),
    title: two('Traductor', 'Translator'),
    lead: two(
      'Escribe y traduce al instante. El botón central cambia el idioma.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: two('Traduce', 'Translate'),
    clear: two('Borra', 'Clear'),
    listen: two('Escucha la traducción', 'Hear the translation'),
    copy: two('Copia', 'Copy'),
    copied: two('¡Copiado!', 'Copied'),
    copyFailed: two('No se pudo', 'Could not copy'),
    ready: two('Listo', 'Ready'),
    working: two('traduciendo…', 'translating…'),
    done: two('Traducido', 'Translated'),
    sourceLabel: two('Texto original', 'Source text'),
    swap: two('Intercambia el español y el inglés', 'Swap Spanish and English'),
    swapTitle: two('Cambia de idioma', 'Swap languages'),
    studyName: two('Español', 'Español'),
    englishName: two('English', 'English'),
    placeholderStudy: two('Escribe algo en español…', 'Escribe algo en español…'),
    placeholderEn: two('Type something in English…', 'Type something in English…'),
    outStudy: two('La traducción aparecerá aquí.', 'La traducción aparecerá aquí.'),
    outEn: two('The translation will appear here.', 'The translation will appear here.'),
    engine: two('traducido con {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: two('Diccionario', 'Dictionary'),
    title: two('Busca una palabra', 'Look up a word'),
    lead: two(
      'Definiciones de la RAE con sinónimos y ejemplos.',
      'Definitions from the RAE, with synonyms and examples.',
    ),
    button: two('Busca', 'Search'),
    tryWith: two('Prueba con', 'Try'),
    label: two('Busca una palabra en el diccionario', 'Search for a word in the dictionary'),
    samples: two('sobremesa,madrugar,entrañable,friolero,estrenar,ojalá,trasnochar,chiringuito', 'sobremesa,madrugar,entrañable,friolero,estrenar,ojalá,trasnochar,chiringuito'),
  },

  features: {
    conjugation: two('Conjugación', 'Conjugation'),
    conjugationBody: two(
      'El conjugador tiene todos los tiempos y todos los verbos.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: two('Diccionario', 'Dictionary'),
    dictionaryBody: two(
      'El diccionario de la RAE, con sinónimos y ejemplos.',
      'The RAE dictionary, with synonyms and examples.',
    ),
    chat: two('Chat', 'Chat'),
    chatBody: two(
      'Un tutor que responde con los datos del sitio.',
      'A tutor that answers from the site’s own data.'),
    tilde: two('Tilde', 'Tilde'),
    tildeBody: two(
      'Una palabra al día en seis intentos. Las tildes cuentan.',
      'One word a day in six guesses. The accents count.'),
  },

  conjugator: {
    eyebrow: two('Conjugación', 'Conjugation'),
    title: two('Todos los tiempos, todos los verbos', 'Every tense, every verb'),
    lead: two(
      'Empieza por un modelo regular o busca un verbo. Las formas irregulares salen resaltadas.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: two('verbos -{ending}', '-{ending} verbs'),
    search: two('Busca un verbo', 'Search a verb'),
    searchLabel: two('Busca un verbo', 'Search for a verb'),
    highlight: two('Resalta las irregulares', 'Highlight irregulars'),
    notAVerb: two('No reconozco ese verbo', "I don't recognise that verb"),
    indicative: two('Indicativo', 'Indicative'),
    subjunctive: two('Subjuntivo', 'Subjunctive'),
    imperative: two('Imperativo', 'Imperative'),
    simple: two('Tiempos simples', 'Simple tenses'),
    compound: two('Tiempos compuestos', 'Compound tenses'),
    affirmative: two('Afirmativo', 'Affirmative'),
    negative: two('Negativo', 'Negative'),
    gerund: two('gerundio', 'gerund'),
    participle: two('participio', 'participle'),
    compoundInf: two('inf. compuesto', 'perfect inf.'),
    compoundGer: two('ger. compuesto', 'perfect ger.'),
    fullTable: two('Conjugación completa', 'Full conjugation'),
    verbClass: two('verbo -{ending}', '-{ending} verb'),
    irregular: two('irregular', 'irregular'),
    stemChange: two('cambio de raíz {change}', 'stem change {change}'),
    spelling: two('ortografía {change}', 'spelling {change}'),
    likeVerb: two('se conjuga como {verb}', 'conjugated like {verb}'),
    pronominal: two('pronominal · me / te / se', 'pronominal · me / te / se'),
    voseo: two('voseo {form}', 'voseo {form}'),
    fromRae: two('formas de la RAE', 'forms from the RAE'),
    generated: two('formas generadas', 'generated forms'),
    auxiliary: two('auxiliar {aux}', 'auxiliary {aux}'),
  },

  dictionary: {
    eyebrow: two('Diccionario', 'Dictionary'),
    title: two('Qué dice la RAE', 'What the RAE says'),
    lead: two(
      'Cada acepción de la RAE, con sinónimos y un ejemplo.',
      'Every sense from the RAE, with synonyms and an example.',
    ),
    search: two('Busca una palabra', 'Search a word'),
    button: two('Busca', 'Search'),
    emptyTitle: two('Escribe una palabra', 'Type a word'),
    emptyBody: two(
      'Prueba con sobremesa, entrañable, madrugar o cualquier palabra que te haya llamado la atención.',
      'Try sobremesa, entrañable, madrugar, or any word that has caught your eye.',
    ),
    looking: two('Consultando el diccionario…', 'Looking it up…'),
    noResults: two('Sin resultados', 'No results'),
    didYouMean: two('¿Quisiste decir?', 'Did you mean?'),
    corrected: two('Buscando «{to}». «{from}» no lleva tilde.', 'Showing “{to}”. “{from}” is missing its accent.'),
    seeOnRae: two('ver en dle.rae.es ↗', 'view on dle.rae.es ↗'),
    synonyms: two('Sinónimos', 'Synonyms'),
    antonyms: two('Antónimos', 'Antonyms'),
    locutions: two('Locuciones y expresiones', 'Phrases and expressions'),
    inUse: two('En uso', 'In use'),
    seeEntry: two('ver la entrada ↗', 'view the entry ↗'),
    notRae: two(
      'El diccionario de la RAE no está disponible ahora mismo, así que estas definiciones no vienen de la RAE.',
      'The RAE dictionary is unavailable right now, so these definitions are not from the RAE.',
    ),
    speak: two('Escucha la palabra', 'Hear the word'),
    speakFailed: two('No se pudo pronunciar.', 'Could not pronounce that.'),
    speakSpent: two('Se acabaron las pronunciaciones de este mes.', 'This month’s pronunciations are used up.'),
    templateNote: two(
      'Ejemplo de plantilla. Todavía no hay ninguna frase real con esta palabra.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: two('Pregúntale a ProfeGPT', 'Ask ProfeGPT'),
    lead: two(
      'Conjugaciones, definiciones de la RAE, traducciones y explicaciones de gramática.',
      'Conjugations, RAE definitions, translations and grammar explanations.',
    ),
    placeholder: two('Pregunta lo que quieras…', 'Ask whatever you like…'),
    messageLabel: two('Mensaje', 'Message'),
    send: two('Envía', 'Send'),
    you: two('TÚ', 'YOU'),
    groundedOnly: two(
      'Respuestas del conjugador, el diccionario, el traductor y las fichas de gramática, sin ninguna IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: two('No pude responder: {error}', "I couldn't answer: {error}"),
    starters: two(
      'ser y estar|conjuga tener en subjuntivo|qué significa sobremesa|qué es «dijeron»|cómo se dice "I am tired" en español',
      'ser y estar|conjuga tener en subjuntivo|qué significa sobremesa|qué es «dijeron»|cómo se dice "I am tired" en español',
    ),
  },

  home: {
    title: two('ProfeGPT', 'ProfeGPT'),
    lead: two(
      'Traductor, conjugaciones, diccionario y un tutor para cada idioma. Elige uno para empezar.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: two('Elige un idioma', 'Choose a language'),
    enter: two('Entra', 'Enter'),
    soon: two('Más idiomas', 'More languages'),
    soonBody: two('Próximamente.', 'Coming soon.'),
    back: two('Inicio', 'Home'),
  },

  word: {
    title: two('Palabra del día', 'Word of the day'),
    look: two('Ver en el diccionario', 'See it in the dictionary'),
    story: two('La historia', 'The story'),
    hide: two('Ocultar la historia', 'Hide the story'),
  },

  // The daily word game, on the Spanish side only (views/tilde.js).
  tilde: {
    title: two('Tilde', 'Tilde'),
    lead: two(
      'Una palabra al día, de cinco, seis o siete letras, en seis intentos. Valen las formas de los verbos, y las tildes cuentan.',
      'One word a day, five, six or seven letters long, in six guesses. Verb forms count as words, and so do the accents.'),
    number: two('N.º {n}', 'No. {n}'),
    letters: two('{n} letras', '{n} letters'),
    loading: two('Cargando las palabras…', 'Loading the words…'),
    loadFailed: two('No se han podido cargar las palabras. Recarga la página.', 'The words could not be loaded. Reload the page.'),
    board: two('Tablero', 'Board'),
    row: two('Intento {n}', 'Guess {n}'),
    keyboard: two('Teclado', 'Keyboard'),
    enter: two('Envía', 'Enter'),
    delete: two('Borra', 'Delete'),
    tooShort: two('Faltan letras.', 'Not enough letters.'),
    unknown: two('«{word}» no está en la lista de palabras.', '“{word}” is not in the word list.'),
    didYouMean: two('¿Querías decir', 'Did you mean'),
    or: two('o', 'or'),
    hint: two('Pista', 'Hint'),
    hintLabel: two('Muestra una frase con la palabra', 'Show a sentence with the word'),
    hintTitle: two('Una frase con la palabra', 'A sentence with the word'),
    from: two('Frase de Tatoeba', 'Sentence from Tatoeba'),
    won: two('¡Increíble!|¡Magnífico!|¡Olé!|¡Muy bien!|¡Bien!|¡Por los pelos!', 'Incredible!|Magnificent!|Olé!|Very good!|Good!|Phew!'),
    lost: two('¡Mecachis en todo!', 'Oh, drat!'),
    was: two('La palabra era', 'The word was'),
    meaning: two('en inglés', 'in English'),
    lookUp: two('Ver en el diccionario', 'See it in the dictionary'),
    conjugate: two('Conjuga {verb}', 'Conjugate {verb}'),
    share: two('Comparte', 'Share'),
    copied: two('¡Copiado!', 'Copied'),
    copyFailed: two('No se pudo copiar', 'Could not copy'),
    tomorrow: two('Mañana hay otra.', 'There is another tomorrow.'),
    stats: two('Tus números', 'Your numbers'),
    played: two('Jugadas', 'Played'),
    winRate: two('% ganadas', 'Win %'),
    streak: two('Racha', 'Streak'),
    best: two('Mejor racha', 'Best streak'),
    guesses: two('Intentos', 'Guesses'),
    how: two('Cómo se juega', 'How to play'),
    howLead: two(
      'Adivina la palabra del día en seis intentos. Cada intento tiene que ser una palabra de verdad, tan larga como el tablero, y valen las formas de los verbos: pidió, hagamos, hubiera.',
      'Guess the day’s word in six tries. Every guess has to be a real word as long as the board, and verb forms count: pidió, hagamos, hubiera.'),
    howColours: two('Después de cada intento, cada letra cambia de color:', 'After each guess, every letter changes colour:'),
    correct: two('en la palabra y en su sitio, tilde incluida.', 'in the word and in the right place, accent and all.'),
    accent: two('va ahí, pero con otra tilde: escribiste a y era á, o al revés. Cuenta antes que el amarillo.', 'belongs there, but with a different accent: you typed a and it was á, or the other way round. It counts before yellow.'),
    present: two('está en la palabra, en otro sitio. Con o sin tilde: el amarillo no mira las tildes.', 'is in the word, somewhere else. With or without its accent: yellow ignores accents.'),
    absent: two('no está en la palabra.', 'is not in the word.'),
    howEnye: two('La ñ no es una n con adorno: es otra letra, y cuenta como tal.', 'ñ is not an n with a decoration: it is a letter of its own, and scores as one.'),
    enyeTyping: two('En un teclado sin ñ, escribe n y luego ~.', 'On a keyboard without ñ, type n and then ~.'),
    colours: two('Los colores', 'The colours'),
    info: two('Info', 'Info'),
    close: two('Cerrar', 'Close'),
    howKeys: two(
      'Las vocales con tilde tienen su propia fila en el teclado de la pantalla. En un teclado sin tildes, escribe la vocal y luego un apóstrofo: a y \' dan á, u y " dan ü, n y ~ dan ñ.',
      'The accented vowels have a row of their own on the on-screen keyboard. On a keyboard without them, type the vowel and then an apostrophe: a then \' gives á, u then " gives ü, n then ~ gives ñ.'),
    howHint: two(
      'La pista enseña una frase real con la palabra tapada, y su traducción. Quien la usa lleva una 💡 en el resultado.',
      'The hint shows a real sentence with the word blanked out, and its translation. Using it puts a 💡 in your result.'),
    howShare: two(
      'Al compartir, 🟩 es letra en su sitio, 🟪 letra con otra tilde, 🟨 letra en otro sitio y ⬜ letra que no está.',
      'In a shared result, 🟩 is a letter in place, 🟪 a letter with the wrong accent, 🟨 a letter elsewhere, and ⬜ a letter that is not there.'),
    credits: two('Palabras: {words}, CC BY-SA 4.0. Frases: {sentences}, CC BY 2.0 FR.', 'Words: {words}, CC BY-SA 4.0. Sentences: {sentences}, CC BY 2.0 FR.'),
    state: {
      correct: two('en su sitio', 'in place'),
      accent: two('otra tilde', 'wrong accent'),
      present: two('en otro sitio', 'elsewhere'),
      absent: two('no está', 'not in the word'),
    },
    blank: two('hueco', 'blank'),
    kind: {
      nm: two('sustantivo masculino', 'masculine noun'),
      nf: two('sustantivo femenino', 'feminine noun'),
      nmf: two('sustantivo masculino y femenino', 'masculine and feminine noun'),
      adj: two('adjetivo', 'adjective'),
      adv: two('adverbio', 'adverb'),
      pron: two('pronombre', 'pronoun'),
      prep: two('preposición', 'preposition'),
      conj: two('conjunción', 'conjunction'),
      interj: two('interjección', 'interjection'),
      num: two('numeral', 'number'),
    },
    tense: {
      indicativo: {
        presente: two('presente', 'present'),
        preterito: two('pretérito', 'preterite'),
        imperfecto: two('imperfecto', 'imperfect'),
        futuro: two('futuro', 'future'),
        condicional: two('condicional', 'conditional'),
      },
      subjuntivo: {
        presente: two('presente de subjuntivo', 'present subjunctive'),
        imperfectoRa: two('imperfecto de subjuntivo', 'imperfect subjunctive'),
        imperfectoSe: two('imperfecto de subjuntivo', 'imperfect subjunctive'),
        futuro: two('futuro de subjuntivo', 'future subjunctive'),
      },
      imperativo: two('imperativo', 'imperative'),
      gerundio: two('gerundio', 'gerund'),
      participio: two('participio', 'past participle'),
    },
  },

  settings: {
    label: two('Ajustes', 'Settings'),
    appearance: two('Apariencia', 'Appearance'),
    light: two('Modo claro', 'Light mode'),
    dark: two('Modo oscuro', 'Dark mode'),
    classroom: two('Clase', 'Classroom'),
  },
};

const FRENCH = {
  nav: {
    translator: deux('Traducteur', 'Translator'),
    conjugation: deux('Conjugaison', 'Conjugation'),
    dictionary: deux('Dictionnaire', 'Dictionary'),
    chat: deux('Chat', 'Chat'),
    languages: deux('Langues', 'Languages'),
    langLabel: deux('Langue du site', 'Site language'),
  },

  meta: {
    home: deux('ProfeGPT', 'ProfeGPT'),
    skip: deux('Aller au contenu', 'Skip to content'),
    footer: deux('définitions du', 'definitions from the'),
    copyright: deux('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: deux('Wiktionnaire', 'Wiktionnaire'),
    footerHref: deux('https://fr.wiktionary.org', 'https://fr.wiktionary.org'),
    footerCredit: deux(' (CC BY-SA)', ' (CC BY-SA)'),
  },

  hero: {
    sub: deux(
      'Traduisez du français vers l’anglais et de l’anglais vers le français. Conjuguez n’importe quel verbe. Cherchez un mot et interrogez le tuteur.',
      'Translate from French to English and English to French. Conjugate any verb. Look words up and ask the tutor.',
    ),
    ctaTranslate: deux('Essayez le traducteur', 'Try the translator'),
    ctaChat: deux('Parlez à ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: deux('Le traducteur n’est pas disponible.', 'The translator is unavailable.'),
    unavailable: deux(
      'Cette phrase n’a pas pu être traduite pour le moment. Réessayez dans un moment ; en attendant, le dictionnaire et la conjugaison fonctionnent toujours.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: deux('Traducteur', 'Translator'),
    title: deux('Traducteur', 'Translator'),
    lead: deux(
      'Écrivez et traduisez aussitôt. Le bouton central change de langue.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: deux('Traduisez', 'Translate'),
    clear: deux('Effacez', 'Clear'),
    listen: deux('Écoutez la traduction', 'Hear the translation'),
    copy: deux('Copiez', 'Copy'),
    copied: deux('Copié !', 'Copied'),
    copyFailed: deux('Échec', 'Could not copy'),
    ready: deux('Prêt', 'Ready'),
    working: deux('traduction…', 'translating…'),
    done: deux('Traduit', 'Translated'),
    sourceLabel: deux('Texte d’origine', 'Source text'),
    swap: deux('Intervertissez le français et l’anglais', 'Swap French and English'),
    swapTitle: deux('Changez de langue', 'Swap languages'),
    studyName: deux('Français', 'Français'),
    englishName: deux('English', 'English'),
    placeholderStudy: deux('Écrivez quelque chose en français…', 'Écrivez quelque chose en français…'),
    placeholderEn: deux('Type something in English…', 'Type something in English…'),
    outStudy: deux('La traduction apparaîtra ici.', 'La traduction apparaîtra ici.'),
    outEn: deux('The translation will appear here.', 'The translation will appear here.'),
    engine: deux('traduit avec {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: deux('Dictionnaire', 'Dictionary'),
    title: deux('Cherchez un mot', 'Look up a word'),
    lead: deux(
      'Définitions du Wiktionnaire, avec synonymes et exemples.',
      'Definitions from the Wiktionnaire, with synonyms and examples.',
    ),
    button: deux('Cherchez', 'Search'),
    tryWith: deux('Essayez', 'Try'),
    label: deux('Cherchez un mot dans le dictionnaire', 'Search for a word in the dictionary'),
    samples: deux('flâner,dépaysement,râler,chaleureux,bricoler,bouquiner,débrouillard,chuchoter', 'flâner,dépaysement,râler,chaleureux,bricoler,bouquiner,débrouillard,chuchoter'),
  },

  features: {
    conjugation: deux('Conjugaison', 'Conjugation'),
    conjugationBody: deux(
      'Le conjugueur a tous les temps et tous les verbes.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: deux('Dictionnaire', 'Dictionary'),
    dictionaryBody: deux(
      'Le Wiktionnaire, avec synonymes et exemples.',
      'The Wiktionnaire, with synonyms and examples.',
    ),
    chat: deux('Chat', 'Chat'),
    chatBody: deux(
      'Un tuteur qui répond avec les données du site.',
      'A tutor that answers from the site’s own data.'),
  },

  conjugator: {
    eyebrow: deux('Conjugaison', 'Conjugation'),
    title: deux('Tous les temps, tous les verbes', 'Every tense, every verb'),
    lead: deux(
      'Commencez par un modèle régulier ou cherchez un verbe. Les formes irrégulières sont mises en évidence.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: deux('verbes en -{ending}', '-{ending} verbs'),
    search: deux('Cherchez un verbe', 'Search a verb'),
    searchLabel: deux('Cherchez un verbe', 'Search for a verb'),
    highlight: deux('Surlignez les irrégularités', 'Highlight irregulars'),
    notAVerb: deux('Je ne reconnais pas ce verbe', "I don't recognise that verb"),
    indicative: deux('Indicatif', 'Indicative'),
    subjunctive: deux('Subjonctif', 'Subjunctive'),
    imperative: deux('Impératif', 'Imperative'),
    simple: deux('Temps simples', 'Simple tenses'),
    compound: deux('Temps composés', 'Compound tenses'),
    affirmative: deux('Affirmatif', 'Affirmative'),
    negative: deux('Négatif', 'Negative'),
    gerund: deux('participe présent', 'present participle'),
    participle: deux('participe passé', 'past participle'),
    compoundInf: deux('infinitif passé', 'perfect infinitive'),
    compoundGer: deux('participe composé', 'perfect participle'),
    fullTable: deux('Conjugaison complète', 'Full conjugation'),
    verbClass: deux('verbe en -{ending}', '-{ending} verb'),
    irregular: deux('irrégulier', 'irregular'),
    stemChange: deux('changement de radical {change}', 'stem change {change}'),
    spelling: deux('orthographe {change}', 'spelling {change}'),
    likeVerb: deux('se conjugue comme {verb}', 'conjugated like {verb}'),
    pronominal: deux('pronominal · me / te / se', 'pronominal · me / te / se'),
    voseo: deux('{form}', '{form}'),
    fromRae: deux('formes du dictionnaire', 'forms from the dictionary'),
    generated: deux('formes générées', 'generated forms'),
    auxiliary: deux('auxiliaire {aux}', 'auxiliary {aux}'),
  },

  dictionary: {
    eyebrow: deux('Dictionnaire', 'Dictionary'),
    title: deux('Ce que dit le dictionnaire', 'What the dictionary says'),
    lead: deux(
      'Chaque sens du Wiktionnaire, avec synonymes et exemple.',
      'Every sense from the Wiktionnaire, with synonyms and an example.',
    ),
    search: deux('Cherchez un mot', 'Search a word'),
    button: deux('Cherchez', 'Search'),
    emptyTitle: deux('Écrivez un mot', 'Type a word'),
    emptyBody: deux(
      'Essayez flâner, dépaysement, râler, ou n’importe quel mot qui vous a intrigué.',
      'Try flâner, dépaysement, râler, or any word that has caught your eye.',
    ),
    looking: deux('Consultation du dictionnaire…', 'Looking it up…'),
    noResults: deux('Aucun résultat', 'No results'),
    didYouMean: deux('Vouliez-vous dire ?', 'Did you mean?'),
    corrected: deux('Résultat pour « {to} ». Il manque l’accent à « {from} ».', 'Showing “{to}”. “{from}” is missing its accent.'),
    seeOnRae: deux('voir sur fr.wiktionary.org ↗', 'view on fr.wiktionary.org ↗'),
    synonyms: deux('Synonymes', 'Synonyms'),
    antonyms: deux('Antonymes', 'Antonyms'),
    locutions: deux('Locutions et expressions', 'Phrases and expressions'),
    inUse: deux('En usage', 'In use'),
    seeEntry: deux('voir l’entrée ↗', 'view the entry ↗'),
    notRae: deux(
      'Le dictionnaire n’est pas joignable pour le moment.',
      'The dictionary is unavailable right now.',
    ),
    // No French authority publishes an API, so this side says where its
    // definitions really come from rather than implying an authority it has not got.
    speak: deux('Écoutez le mot', 'Hear the word'),
    speakFailed: deux('Impossible de prononcer.', 'Could not pronounce that.'),
    speakSpent: deux('Les prononciations de ce mois-ci sont épuisées.', 'This month’s pronunciations are used up.'),
    templateNote: deux(
      'Exemple type. Il n’existe pas encore de vraie phrase avec ce mot.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: deux('Demandez à ProfeGPT', 'Ask ProfeGPT'),
    lead: deux(
      'Conjugaisons, définitions, traductions et explications de grammaire.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: deux('Posez la question que vous voulez…', 'Ask whatever you like…'),
    messageLabel: deux('Message', 'Message'),
    send: deux('Envoyez', 'Send'),
    you: deux('VOUS', 'YOU'),
    groundedOnly: deux(
      'Réponses du conjugueur, du dictionnaire, du traducteur et des fiches de grammaire, sans aucune IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: deux('Je n’ai pas pu répondre : {error}', "I couldn't answer: {error}"),
    starters: deux(
      'être et avoir|conjugue prendre au subjonctif|que veut dire flâner|c’est quoi « vinrent »|comment dit-on "I am tired" en français',
      'être et avoir|conjugue prendre au subjonctif|que veut dire flâner|c’est quoi « vinrent »|comment dit-on "I am tired" en français',
    ),
  },

  home: {
    title: deux('ProfeGPT', 'ProfeGPT'),
    lead: deux(
      'Un traducteur, la conjugaison, un dictionnaire et un tuteur pour chaque langue. Choisissez-en une pour commencer.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: deux('Choisissez une langue', 'Choose a language'),
    enter: deux('Entrez', 'Enter'),
    soon: deux('D’autres langues', 'More languages'),
    soonBody: deux('Bientôt.', 'Coming soon.'),
    back: deux('Accueil', 'Home'),
  },

  word: {
    title: deux('Mot du jour', 'Word of the day'),
    look: deux('Voir dans le dictionnaire', 'See it in the dictionary'),
    story: deux('L’histoire', 'The story'),
    hide: deux('Masquer l’histoire', 'Hide the story'),
  },

  settings: {
    label: deux('Réglages', 'Settings'),
    appearance: deux('Apparence', 'Appearance'),
    light: deux('Mode clair', 'Light mode'),
    dark: deux('Mode sombre', 'Dark mode'),
    classroom: deux('Classe', 'Classroom'),
  },
};

const ITALIAN = {
  nav: {
    translator: due('Traduttore', 'Translator'),
    conjugation: due('Coniugazione', 'Conjugation'),
    dictionary: due('Dizionario', 'Dictionary'),
    chat: due('Chat', 'Chat'),
    languages: due('Lingue', 'Languages'),
    langLabel: due('Lingua del sito', 'Site language'),
  },

  meta: {
    home: due('ProfeGPT', 'ProfeGPT'),
    skip: due('Vai al contenuto', 'Skip to content'),
    footer: due('definizioni dal', 'definitions from the'),
    copyright: due('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: due('Wikizionario', 'Wikizionario'),
    footerHref: due('https://it.wiktionary.org', 'https://it.wiktionary.org'),
    footerCredit: due(' (CC BY-SA)', ' (CC BY-SA)'),
  },

  hero: {
    sub: due(
      'Traduci dall’italiano all’inglese e dall’inglese all’italiano. Coniuga qualsiasi verbo. Cerca una parola e chiedi al tutor.',
      'Translate from Italian to English and English to Italian. Conjugate any verb. Look words up and ask the tutor.',
    ),
    ctaTranslate: due('Prova il traduttore', 'Try the translator'),
    ctaChat: due('Parla con ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: due('Il traduttore non è disponibile.', 'The translator is unavailable.'),
    unavailable: due(
      'Non è stato possibile tradurre questa frase in questo momento. Riprova tra poco; nel frattempo il dizionario e il coniugatore funzionano.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: due('Traduttore', 'Translator'),
    title: due('Traduttore', 'Translator'),
    lead: due(
      'Scrivi e traduci all’istante. Il pulsante centrale inverte le lingue.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: due('Traduci', 'Translate'),
    clear: due('Cancella', 'Clear'),
    listen: due('Ascolta la traduzione', 'Hear the translation'),
    copy: due('Copia', 'Copy'),
    copied: due('Copiato!', 'Copied'),
    copyFailed: due('Non riuscito', 'Could not copy'),
    ready: due('Pronto', 'Ready'),
    working: due('traduzione in corso…', 'translating…'),
    done: due('Tradotto', 'Translated'),
    sourceLabel: due('Testo originale', 'Source text'),
    swap: due('Inverti italiano e inglese', 'Swap Italian and English'),
    swapTitle: due('Inverti le lingue', 'Swap languages'),
    studyName: due('Italiano', 'Italiano'),
    englishName: due('English', 'English'),
    placeholderStudy: due('Scrivi qualcosa in italiano…', 'Scrivi qualcosa in italiano…'),
    placeholderEn: due('Type something in English…', 'Type something in English…'),
    outStudy: due('La traduzione apparirà qui.', 'La traduzione apparirà qui.'),
    outEn: due('The translation will appear here.', 'The translation will appear here.'),
    engine: due('tradotto con {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: due('Dizionario', 'Dictionary'),
    title: due('Cerca una parola', 'Look up a word'),
    lead: due(
      'Definizioni dal Wikizionario, con sinonimi ed esempi.',
      'Definitions from the Wikizionario, with synonyms and examples.',
    ),
    button: due('Cerca', 'Search'),
    tryWith: due('Prova con', 'Try'),
    label: due('Cerca una parola nel dizionario', 'Search for a word in the dictionary'),
    samples: due('sprezzatura,magari,abbiocco,meriggiare,menefreghista,chiacchierare,pisolino,spuntino', 'sprezzatura,magari,abbiocco,meriggiare,menefreghista,chiacchierare,pisolino,spuntino'),
  },

  features: {
    conjugation: due('Coniugazione', 'Conjugation'),
    conjugationBody: due(
      'Il coniugatore ha tutti i tempi e tutti i verbi.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: due('Dizionario', 'Dictionary'),
    dictionaryBody: due(
      'Il Wikizionario, con sinonimi ed esempi.',
      'The Wikizionario, with synonyms and examples.',
    ),
    chat: due('Chat', 'Chat'),
    chatBody: due(
      'Un tutor che risponde con i dati del sito.',
      'A tutor that answers from the site’s own data.'),
  },

  conjugator: {
    eyebrow: due('Coniugazione', 'Conjugation'),
    title: due('Tutti i tempi, tutti i verbi', 'Every tense, every verb'),
    lead: due(
      'Parti da un modello regolare o cerca un verbo. Le forme irregolari sono evidenziate.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: due('verbi in -{ending}', '-{ending} verbs'),
    search: due('Cerca un verbo', 'Search a verb'),
    searchLabel: due('Cerca un verbo', 'Search for a verb'),
    highlight: due('Evidenzia le forme irregolari', 'Highlight irregulars'),
    notAVerb: due('Non riconosco questo verbo', "I don't recognise that verb"),
    indicative: due('Indicativo', 'Indicative'),
    subjunctive: due('Congiuntivo', 'Subjunctive'),
    imperative: due('Imperativo', 'Imperative'),
    simple: due('Tempi semplici', 'Simple tenses'),
    compound: due('Tempi composti', 'Compound tenses'),
    affirmative: due('Affermativo', 'Affirmative'),
    negative: due('Negativo', 'Negative'),
    gerund: due('gerundio', 'gerund'),
    participle: due('participio passato', 'past participle'),
    compoundInf: due('infinito passato', 'perfect infinitive'),
    compoundGer: due('gerundio passato', 'perfect gerund'),
    fullTable: due('Coniugazione completa', 'Full conjugation'),
    verbClass: due('verbo in -{ending}', '-{ending} verb'),
    irregular: due('irregolare', 'irregular'),
    stemChange: due('cambio della radice {change}', 'stem change {change}'),
    spelling: due('ortografia {change}', 'spelling {change}'),
    likeVerb: due('si coniuga come {verb}', 'conjugated like {verb}'),
    pronominal: due('pronominale · mi / ti / si', 'pronominal · mi / ti / si'),
    voseo: due('{form}', '{form}'),
    fromRae: due('forme del dizionario', 'forms from the dictionary'),
    generated: due('forme generate', 'generated forms'),
    auxiliary: due('ausiliare {aux}', 'auxiliary {aux}'),
  },

  dictionary: {
    eyebrow: due('Dizionario', 'Dictionary'),
    title: due('Che cosa dice il dizionario', 'What the dictionary says'),
    lead: due(
      'Ogni significato del Wikizionario, con sinonimi ed esempio.',
      'Every sense from the Wikizionario, with synonyms and an example.',
    ),
    search: due('Cerca una parola', 'Search a word'),
    button: due('Cerca', 'Search'),
    emptyTitle: due('Scrivi una parola', 'Type a word'),
    emptyBody: due(
      'Prova con sprezzatura, magari, abbiocco, o qualsiasi parola che ti abbia incuriosito.',
      'Try sprezzatura, magari, abbiocco, or any word that has caught your eye.',
    ),
    looking: due('Consulto il dizionario…', 'Looking it up…'),
    noResults: due('Nessun risultato', 'No results'),
    didYouMean: due('Forse cercavi?', 'Did you mean?'),
    corrected: due('Risultati per «{to}». A «{from}» manca l’accento.', 'Showing “{to}”. “{from}” is missing its accent.'),
    seeOnRae: due('vedi su it.wiktionary.org ↗', 'view on it.wiktionary.org ↗'),
    synonyms: due('Sinonimi', 'Synonyms'),
    antonyms: due('Contrari', 'Antonyms'),
    locutions: due('Locuzioni ed espressioni', 'Phrases and expressions'),
    inUse: due('Nell’uso', 'In use'),
    seeEntry: due('vedi la voce ↗', 'view the entry ↗'),
    notRae: due(
      'Il dizionario non è raggiungibile in questo momento.',
      'The dictionary is unavailable right now.',
    ),
    // No Italian authority publishes an API, so this side says where its
    // definitions really come from rather than implying an authority it has not got.
    speak: due('Ascolta la parola', 'Hear the word'),
    speakFailed: due('Impossibile pronunciarla.', 'Could not pronounce that.'),
    speakSpent: due('Le pronunce di questo mese sono finite.', 'This month’s pronunciations are used up.'),
    templateNote: due(
      'Esempio di modello. Non c’è ancora una frase vera con questa parola.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: due('Chiedi a ProfeGPT', 'Ask ProfeGPT'),
    lead: due(
      'Coniugazioni, definizioni, traduzioni e spiegazioni di grammatica.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: due('Chiedi quello che vuoi…', 'Ask whatever you like…'),
    messageLabel: due('Messaggio', 'Message'),
    send: due('Invia', 'Send'),
    you: due('TU', 'YOU'),
    groundedOnly: due(
      'Risposte dal coniugatore, dal dizionario, dal traduttore e dalle schede di grammatica, senza alcuna IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: due('Non sono riuscito a rispondere: {error}', "I couldn't answer: {error}"),
    starters: due(
      'essere e avere|coniuga andare al congiuntivo|cosa vuol dire magari|che forma è «andarono»|come si dice "I\'m tired" in italiano',
      'essere e avere|coniuga andare al congiuntivo|cosa vuol dire magari|che forma è «andarono»|come si dice "I\'m tired" in italiano',
    ),
  },

  home: {
    title: due('ProfeGPT', 'ProfeGPT'),
    lead: due(
      'Un traduttore, le coniugazioni, un dizionario e un tutor per ogni lingua. Scegline una per cominciare.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: due('Scegli una lingua', 'Choose a language'),
    enter: due('Entra', 'Enter'),
    soon: due('Altre lingue', 'More languages'),
    soonBody: due('In arrivo.', 'Coming soon.'),
    back: due('Home', 'Home'),
  },

  word: {
    title: due('Parola del giorno', 'Word of the day'),
    look: due('Vedi nel dizionario', 'See it in the dictionary'),
    story: due('La storia', 'The story'),
    hide: due('Nascondi la storia', 'Hide the story'),
  },

  settings: {
    label: due('Impostazioni', 'Settings'),
    appearance: due('Aspetto', 'Appearance'),
    light: due('Modalità chiara', 'Light mode'),
    dark: due('Modalità scura', 'Dark mode'),
    classroom: due('Classe', 'Classroom'),
  },
};

const dois = (pt, en) => ({ pt, en });

const PORTUGUESE = {
  nav: {
    translator: dois('Tradutor', 'Translator'),
    conjugation: dois('Conjugação', 'Conjugation'),
    dictionary: dois('Dicionário', 'Dictionary'),
    chat: dois('Chat', 'Chat'),
    languages: dois('Línguas', 'Languages'),
    langLabel: dois('Língua do site', 'Site language'),
  },

  meta: {
    home: dois('ProfeGPT', 'ProfeGPT'),
    skip: dois('Saltar para o conteúdo', 'Skip to content'),
    footer: dois('definições do', 'definitions from the'),
    copyright: dois('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: dois('Wikcionário', 'Wikcionário'),
    footerHref: dois('https://pt.wiktionary.org', 'https://pt.wiktionary.org'),
    footerCredit: dois(' (CC BY-SA)', ' (CC BY-SA)'),
  },

  hero: {
    sub: dois(
      'Traduz do português para o inglês e do inglês para o português. Conjuga qualquer verbo. Procura uma palavra e pergunta ao tutor.',
      'Translate from Portuguese to English and English to Portuguese. Conjugate any verb. Look words up and ask the tutor.',
    ),
    ctaTranslate: dois('Experimenta o tradutor', 'Try the translator'),
    ctaChat: dois('Fala com o ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: dois('O tradutor não está disponível.', 'The translator is unavailable.'),
    unavailable: dois(
      'Não foi possível traduzir esta frase neste momento. Tenta outra vez daqui a pouco; entretanto, o dicionário e o conjugador continuam a funcionar.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: dois('Tradutor', 'Translator'),
    title: dois('Tradutor', 'Translator'),
    lead: dois(
      'Escreve e traduz na hora. O botão do meio troca as línguas.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: dois('Traduzir', 'Translate'),
    clear: dois('Limpar', 'Clear'),
    listen: dois('Ouvir a tradução', 'Hear the translation'),
    copy: dois('Copiar', 'Copy'),
    copied: dois('Copiado!', 'Copied'),
    copyFailed: dois('Não deu para copiar', 'Could not copy'),
    ready: dois('Pronto', 'Ready'),
    working: dois('a traduzir…', 'translating…'),
    done: dois('Traduzido', 'Translated'),
    sourceLabel: dois('Texto original', 'Source text'),
    swap: dois('Trocar português e inglês', 'Swap Portuguese and English'),
    swapTitle: dois('Trocar as línguas', 'Swap languages'),
    studyName: dois('Português', 'Português'),
    englishName: dois('English', 'English'),
    placeholderStudy: dois('Escreve alguma coisa em português…', 'Escreve alguma coisa em português…'),
    placeholderEn: dois('Type something in English…', 'Type something in English…'),
    outStudy: dois('A tradução aparece aqui.', 'A tradução aparece aqui.'),
    outEn: dois('The translation will appear here.', 'The translation will appear here.'),
    engine: dois('traduzido com {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: dois('Dicionário', 'Dictionary'),
    title: dois('Procura uma palavra', 'Look up a word'),
    lead: dois(
      'Definições do Wikcionário, com sinónimos e exemplos.',
      'Definitions from the Wikcionário, with synonyms and examples.',
    ),
    button: dois('Procurar', 'Search'),
    tryWith: dois('Experimenta', 'Try'),
    label: dois('Procurar uma palavra no dicionário', 'Search for a word in the dictionary'),
    samples: dois('saudade,desenrascar,desabafar,madrugada,pirilampo,petiscar,aconchego,alfacinha', 'saudade,desenrascar,desabafar,madrugada,pirilampo,petiscar,aconchego,alfacinha'),
  },

  features: {
    conjugation: dois('Conjugação', 'Conjugation'),
    conjugationBody: dois(
      'O conjugador tem todos os tempos e todos os verbos.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: dois('Dicionário', 'Dictionary'),
    dictionaryBody: dois(
      'O Wikcionário, com sinónimos e exemplos.',
      'The Wikcionário, with synonyms and examples.',
    ),
    chat: dois('Chat', 'Chat'),
    chatBody: dois(
      'Um tutor que responde com os dados do próprio site.',
      'A tutor that answers from the site’s own data.'),
  },

  conjugator: {
    eyebrow: dois('Conjugação', 'Conjugation'),
    title: dois('Todos os tempos, todos os verbos', 'Every tense, every verb'),
    lead: dois(
      'Parte de um modelo regular ou procura um verbo. As formas irregulares aparecem destacadas.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: dois('verbos em -{ending}', '-{ending} verbs'),
    search: dois('Procurar um verbo', 'Search a verb'),
    searchLabel: dois('Procurar um verbo', 'Search for a verb'),
    highlight: dois('Destacar as formas irregulares', 'Highlight irregulars'),
    notAVerb: dois('Não reconheço esse verbo', "I don't recognise that verb"),
    indicative: dois('Indicativo', 'Indicative'),
    subjunctive: dois('Conjuntivo', 'Subjunctive'),
    imperative: dois('Imperativo', 'Imperative'),
    simple: dois('Tempos simples', 'Simple tenses'),
    compound: dois('Tempos compostos', 'Compound tenses'),
    affirmative: dois('Afirmativo', 'Affirmative'),
    negative: dois('Negativo', 'Negative'),
    gerund: dois('gerúndio', 'gerund'),
    participle: dois('particípio', 'past participle'),
    compoundInf: dois('infinitivo composto', 'perfect infinitive'),
    compoundGer: dois('gerúndio composto', 'perfect gerund'),
    personalInfinitive: dois('Infinitivo pessoal', 'Personal infinitive'),
    fullTable: dois('Conjugação completa', 'Full conjugation'),
    verbClass: dois('verbo em -{ending}', '-{ending} verb'),
    irregular: dois('irregular', 'irregular'),
    stemChange: dois('alteração do radical {change}', 'stem change {change}'),
    spelling: dois('ortografia {change}', 'spelling {change}'),
    likeVerb: dois('conjuga-se como {verb}', 'conjugated like {verb}'),
    pronominal: dois('pronominal: me, te, se', 'pronominal: me, te, se'),
    voseo: dois('{form}', '{form}'),
    fromRae: dois('formas do dicionário', 'forms from the dictionary'),
    generated: dois('formas geradas', 'generated forms'),
    auxiliary: dois('auxiliar {aux}', 'auxiliary {aux}'),
  },

  dictionary: {
    eyebrow: dois('Dicionário', 'Dictionary'),
    title: dois('O que diz o dicionário', 'What the dictionary says'),
    lead: dois(
      'Todos os sentidos do Wikcionário, com sinónimos e um exemplo.',
      'Every sense from the Wikcionário, with synonyms and an example.',
    ),
    search: dois('Procurar uma palavra', 'Search a word'),
    button: dois('Procurar', 'Search'),
    emptyTitle: dois('Escreve uma palavra', 'Type a word'),
    emptyBody: dois(
      'Experimenta saudade, desenrascar, madrugada, ou qualquer palavra que te tenha despertado a curiosidade.',
      'Try saudade, desenrascar, madrugada, or any word that has caught your eye.',
    ),
    looking: dois('A consultar o dicionário…', 'Looking it up…'),
    noResults: dois('Sem resultados', 'No results'),
    didYouMean: dois('Querias dizer?', 'Did you mean?'),
    corrected: dois('Resultados para «{to}». A «{from}» falta o acento.', 'Showing “{to}”. “{from}” is missing its accent.'),
    seeOnRae: dois('ver em pt.wiktionary.org ↗', 'view on pt.wiktionary.org ↗'),
    synonyms: dois('Sinónimos', 'Synonyms'),
    antonyms: dois('Antónimos', 'Antonyms'),
    locutions: dois('Locuções e expressões', 'Phrases and expressions'),
    inUse: dois('Em contexto', 'In use'),
    seeEntry: dois('ver a entrada ↗', 'view the entry ↗'),
    notRae: dois(
      'O dicionário não está disponível neste momento.',
      'The dictionary is unavailable right now.',
    ),
    speak: dois('Ouvir a palavra', 'Hear the word'),
    speakFailed: dois('Não foi possível pronunciá-la.', 'Could not pronounce that.'),
    speakSpent: dois('As pronúncias deste mês esgotaram-se.', 'This month’s pronunciations are used up.'),
    templateNote: dois(
      'Exemplo de modelo. Ainda não há uma frase real com esta palavra.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: dois('Pergunta ao ProfeGPT', 'Ask ProfeGPT'),
    lead: dois(
      'Conjugações, definições, traduções e explicações de gramática.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: dois('Pergunta o que quiseres…', 'Ask whatever you like…'),
    messageLabel: dois('Mensagem', 'Message'),
    send: dois('Enviar', 'Send'),
    you: dois('TU', 'YOU'),
    groundedOnly: dois(
      'Respostas do conjugador, do dicionário, do tradutor e das notas de gramática, sem qualquer IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: dois('Não consegui responder: {error}', "I couldn't answer: {error}"),
    starters: dois(
      'ser e estar|conjuga fazer no conjuntivo|o que significa saudade|que forma é «fizeram»|como se diz "I\'m tired" em português',
      'ser e estar|conjuga fazer no conjuntivo|o que significa saudade|que forma é «fizeram»|como se diz "I\'m tired" em português',
    ),
  },

  home: {
    title: dois('ProfeGPT', 'ProfeGPT'),
    lead: dois(
      'Um tradutor, as conjugações, um dicionário e um tutor para cada língua. Escolhe uma para começar.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: dois('Escolhe uma língua', 'Choose a language'),
    enter: dois('Entrar', 'Enter'),
    soon: dois('Outras línguas', 'More languages'),
    soonBody: dois('Em breve.', 'Coming soon.'),
    back: dois('Início', 'Home'),
  },

  word: {
    title: dois('Palavra do dia', 'Word of the day'),
    look: dois('Ver no dicionário', 'See it in the dictionary'),
    story: dois('A história', 'The story'),
    hide: dois('Esconder a história', 'Hide the story'),
  },

  settings: {
    label: dois('Definições', 'Settings'),
    appearance: dois('Aspeto', 'Appearance'),
    light: dois('Modo claro', 'Light mode'),
    dark: dois('Modo escuro', 'Dark mode'),
    classroom: dois('Turma', 'Classroom'),
  },
};

const zwei = (de, en) => ({ de, en });

const GERMAN = {
  nav: {
    translator: zwei('Übersetzer', 'Translator'),
    conjugation: zwei('Konjugation', 'Conjugation'),
    dictionary: zwei('Wörterbuch', 'Dictionary'),
    chat: zwei('Chat', 'Chat'),
    languages: zwei('Sprachen', 'Languages'),
    langLabel: zwei('Sprache der Seite', 'Site language'),
  },

  meta: {
    home: zwei('ProfeGPT', 'ProfeGPT'),
    skip: zwei('Zum Inhalt springen', 'Skip to content'),
    footer: zwei('Definitionen aus dem', 'definitions from the'),
    copyright: zwei('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: zwei('Wiktionary', 'German Wiktionary'),
    footerHref: zwei('https://de.wiktionary.org', 'https://de.wiktionary.org'),
    footerCredit: zwei(' (CC BY-SA)', ' (CC BY-SA)'),
  },

  hero: {
    sub: zwei(
      'Übersetze vom Deutschen ins Englische und vom Englischen ins Deutsche. Konjugiere jedes Verb. Schlag ein Wort nach und frag den Tutor.',
      'Translate from German to English and English to German. Conjugate any verb. Look words up and ask the tutor.',
    ),
    ctaTranslate: zwei('Probier den Übersetzer', 'Try the translator'),
    ctaChat: zwei('Sprich mit ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: zwei('Der Übersetzer ist nicht verfügbar.', 'The translator is unavailable.'),
    unavailable: zwei(
      'Dieser Satz konnte gerade nicht übersetzt werden. Versuch es in ein paar Minuten noch einmal; das Wörterbuch und der Konjugator funktionieren inzwischen weiter.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: zwei('Übersetzer', 'Translator'),
    title: zwei('Übersetzer', 'Translator'),
    lead: zwei(
      'Schreib und übersetze sofort. Der Knopf in der Mitte tauscht die Sprachen.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: zwei('Übersetzen', 'Translate'),
    clear: zwei('Löschen', 'Clear'),
    listen: zwei('Übersetzung anhören', 'Hear the translation'),
    copy: zwei('Kopieren', 'Copy'),
    copied: zwei('Kopiert!', 'Copied'),
    copyFailed: zwei('Hat nicht geklappt', 'Could not copy'),
    ready: zwei('Bereit', 'Ready'),
    working: zwei('wird übersetzt…', 'translating…'),
    done: zwei('Übersetzt', 'Translated'),
    sourceLabel: zwei('Ausgangstext', 'Source text'),
    swap: zwei('Deutsch und Englisch tauschen', 'Swap German and English'),
    swapTitle: zwei('Sprachen tauschen', 'Swap languages'),
    studyName: zwei('Deutsch', 'Deutsch'),
    englishName: zwei('English', 'English'),
    placeholderStudy: zwei('Schreib etwas auf Deutsch…', 'Schreib etwas auf Deutsch…'),
    placeholderEn: zwei('Type something in English…', 'Type something in English…'),
    outStudy: zwei('Die Übersetzung erscheint hier.', 'Die Übersetzung erscheint hier.'),
    outEn: zwei('The translation will appear here.', 'The translation will appear here.'),
    engine: zwei('übersetzt mit {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: zwei('Wörterbuch', 'Dictionary'),
    title: zwei('Schlag ein Wort nach', 'Look up a word'),
    lead: zwei(
      'Definitionen aus dem Wiktionary, mit Synonymen und Beispielen.',
      'Definitions from the German Wiktionary, with synonyms and examples.',
    ),
    button: zwei('Suchen', 'Search'),
    tryWith: zwei('Probier mal', 'Try'),
    label: zwei('Such ein Wort im Wörterbuch', 'Search for a word in the dictionary'),
    samples: zwei('Fernweh,gemütlich,Feierabend,Kummerspeck,Schadenfreude,verschlimmbessern,Ohrwurm,Zeitgeist', 'Fernweh,gemütlich,Feierabend,Kummerspeck,Schadenfreude,verschlimmbessern,Ohrwurm,Zeitgeist'),
  },

  features: {
    conjugation: zwei('Konjugation', 'Conjugation'),
    conjugationBody: zwei(
      'Der Konjugator kennt alle Zeiten und alle Verben.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: zwei('Wörterbuch', 'Dictionary'),
    dictionaryBody: zwei(
      'Das Wiktionary, mit Synonymen und Beispielen.',
      'The German Wiktionary, with synonyms and examples.',
    ),
    chat: zwei('Chat', 'Chat'),
    chatBody: zwei(
      'Ein Tutor, der mit den Daten der Seite antwortet.',
      'A tutor that answers from the site’s own data.'),
  },

  conjugator: {
    eyebrow: zwei('Konjugation', 'Conjugation'),
    title: zwei('Alle Zeiten, alle Verben', 'Every tense, every verb'),
    lead: zwei(
      'Fang mit einem regelmäßigen Musterverb an oder such ein Verb. Unregelmäßige Formen sind hervorgehoben.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: zwei('{ending}', '{ending}'),
    search: zwei('Such ein Verb', 'Search a verb'),
    searchLabel: zwei('Such ein Verb', 'Search for a verb'),
    highlight: zwei('Unregelmäßige Formen hervorheben', 'Highlight irregulars'),
    notAVerb: zwei('Dieses Verb kenne ich nicht', "I don't recognise that verb"),
    indicative: zwei('Indikativ', 'Indicative'),
    subjunctive: zwei('Konjunktiv', 'Subjunctive'),
    imperative: zwei('Imperativ', 'Imperative'),
    simple: zwei('Einfache Zeiten', 'Simple tenses'),
    compound: zwei('Zusammengesetzte Zeiten', 'Compound tenses'),
    affirmative: zwei('Bejahend', 'Affirmative'),
    negative: zwei('Verneint', 'Negative'),
    gerund: zwei('Partizip I', 'present participle'),
    participle: zwei('Partizip II', 'past participle'),
    compoundInf: zwei('Infinitiv Perfekt', 'perfect infinitive'),
    compoundGer: zwei('Infinitiv mit zu', 'infinitive with zu'),
    fullTable: zwei('Vollständige Konjugation', 'Full conjugation'),
    verbClass: zwei('{ending}', '{ending}'),
    irregular: zwei('unregelmäßig', 'irregular'),
    stemChange: zwei('Vokalwechsel {change}', 'vowel change {change}'),
    spelling: zwei('Schreibung {change}', 'spelling {change}'),
    likeVerb: zwei('konjugiert wie {verb}', 'conjugated like {verb}'),
    pronominal: zwei('reflexiv: mich, dich, sich', 'reflexive: mich, dich, sich'),
    voseo: zwei('{form}', '{form}'),
    fromRae: zwei('Formen aus dem Wörterbuch', 'forms from the dictionary'),
    generated: zwei('erzeugte Formen', 'generated forms'),
    auxiliary: zwei('Hilfsverb {aux}', 'auxiliary {aux}'),
    separable: zwei('trennbar: {prefix}', 'separable: {prefix}'),
  },

  dictionary: {
    eyebrow: zwei('Wörterbuch', 'Dictionary'),
    title: zwei('Was das Wörterbuch sagt', 'What the dictionary says'),
    lead: zwei(
      'Jede Bedeutung aus dem Wiktionary, mit Synonymen und einem Beispiel.',
      'Every sense from the German Wiktionary, with synonyms and an example.',
    ),
    search: zwei('Such ein Wort', 'Search a word'),
    button: zwei('Suchen', 'Search'),
    emptyTitle: zwei('Gib ein Wort ein', 'Type a word'),
    emptyBody: zwei(
      'Probier Fernweh, gemütlich, Feierabend oder irgendein Wort, das dir aufgefallen ist.',
      'Try Fernweh, gemütlich, Feierabend, or any word that has caught your eye.',
    ),
    looking: zwei('Ich schlage nach…', 'Looking it up…'),
    noResults: zwei('Keine Treffer', 'No results'),
    didYouMean: zwei('Meintest du?', 'Did you mean?'),
    corrected: zwei('Ergebnisse für „{to}“. Bei „{from}“ fehlt der Umlaut oder das ß.', 'Showing “{to}”. “{from}” is missing its umlaut or ß.'),
    seeOnRae: zwei('auf de.wiktionary.org ansehen ↗', 'view on de.wiktionary.org ↗'),
    synonyms: zwei('Synonyme', 'Synonyms'),
    antonyms: zwei('Gegenwörter', 'Antonyms'),
    locutions: zwei('Redewendungen und Ausdrücke', 'Phrases and expressions'),
    inUse: zwei('Im Gebrauch', 'In use'),
    seeEntry: zwei('Eintrag ansehen ↗', 'view the entry ↗'),
    notRae: zwei(
      'Das Wörterbuch ist im Moment nicht erreichbar.',
      'The dictionary is unavailable right now.',
    ),
    speak: zwei('Wort anhören', 'Hear the word'),
    speakFailed: zwei('Konnte nicht ausgesprochen werden.', 'Could not pronounce that.'),
    speakSpent: zwei('Die Aussprachen für diesen Monat sind aufgebraucht.', 'This month’s pronunciations are used up.'),
    templateNote: zwei(
      'Beispiel nach Muster. Einen echten Satz mit diesem Wort gibt es noch nicht.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: zwei('Frag ProfeGPT', 'Ask ProfeGPT'),
    lead: zwei(
      'Konjugationen, Definitionen, Übersetzungen und Erklärungen zur Grammatik.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: zwei('Frag, was du willst…', 'Ask whatever you like…'),
    messageLabel: zwei('Nachricht', 'Message'),
    send: zwei('Senden', 'Send'),
    you: zwei('DU', 'YOU'),
    groundedOnly: zwei(
      'Antworten aus dem Konjugator, dem Wörterbuch, dem Übersetzer und den Grammatiknotizen, ganz ohne KI',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: zwei('Ich konnte nicht antworten: {error}', "I couldn't answer: {error}"),
    starters: zwei(
      'sein und haben|konjugiere gehen im Konjunktiv|was bedeutet Fernweh|welche Form ist „ging“|wie sagt man "I\'m tired" auf Deutsch',
      'sein und haben|konjugiere gehen im Konjunktiv|was bedeutet Fernweh|welche Form ist „ging“|wie sagt man "I\'m tired" auf Deutsch',
    ),
  },

  home: {
    title: zwei('ProfeGPT', 'ProfeGPT'),
    lead: zwei(
      'Ein Übersetzer, Konjugationstabellen, ein Wörterbuch und ein Tutor für jede Sprache. Such dir eine aus.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: zwei('Wähl eine Sprache', 'Choose a language'),
    enter: zwei('Los', 'Enter'),
    soon: zwei('Weitere Sprachen', 'More languages'),
    soonBody: zwei('Demnächst.', 'Coming soon.'),
    back: zwei('Start', 'Home'),
  },

  word: {
    title: zwei('Wort des Tages', 'Word of the day'),
    look: zwei('Im Wörterbuch nachschlagen', 'See it in the dictionary'),
    story: zwei('Die Geschichte', 'The story'),
    hide: zwei('Geschichte ausblenden', 'Hide the story'),
  },

  settings: {
    label: zwei('Einstellungen', 'Settings'),
    appearance: zwei('Darstellung', 'Appearance'),
    light: zwei('Heller Modus', 'Light mode'),
    dark: zwei('Dunkler Modus', 'Dark mode'),
    classroom: zwei('Klasse', 'Classroom'),
  },
};

const twee = (nl, en) => ({ nl, en });

const DUTCH = {
  nav: {
    translator: twee('Vertaler', 'Translator'),
    conjugation: twee('Vervoeging', 'Conjugation'),
    dictionary: twee('Woordenboek', 'Dictionary'),
    chat: twee('Chat', 'Chat'),
    languages: twee('Talen', 'Languages'),
    langLabel: twee('Taal van de site', 'Site language'),
  },

  meta: {
    home: twee('ProfeGPT', 'ProfeGPT'),
    skip: twee('Ga naar de inhoud', 'Skip to content'),
    footer: twee('definities uit het', 'definitions from the'),
    copyright: twee('© Yuzhe (Julian) Chen 2026', '© Yuzhe (Julian) Chen 2026'),
    footerDict: twee('WikiWoordenboek', 'WikiWoordenboek'),
    footerHref: twee('https://nl.wiktionary.org', 'https://nl.wiktionary.org'),
    footerCredit: twee(' (CC BY-SA)', ' (CC BY-SA)'),
  },

  hero: {
    sub: twee(
      'Vertaal van het Nederlands naar het Engels en van het Engels naar het Nederlands. Vervoeg elk werkwoord. Zoek een woord op en vraag het de tutor.',
      'Translate from Dutch to English and English to Dutch. Conjugate any verb. Look words up and ask the tutor.',
    ),
    ctaTranslate: twee('Probeer de vertaler', 'Try the translator'),
    ctaChat: twee('Praat met ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: twee('De vertaler is niet beschikbaar.', 'The translator is unavailable.'),
    unavailable: twee(
      'Deze zin kon op dit moment niet vertaald worden. Probeer het over een poosje opnieuw; het woordenboek en de vervoeger werken intussen gewoon.',
      'This sentence could not be translated just now. Try again in a little while. The dictionary and the conjugator still work in the meantime.'),
    eyebrow: twee('Vertaler', 'Translator'),
    title: twee('Vertaler', 'Translator'),
    lead: twee(
      'Typ en vertaal meteen. De middelste knop wisselt de talen om.',
      'Type and translate instantly. The middle button swaps the languages.',
    ),
    button: twee('Vertaal', 'Translate'),
    clear: twee('Wis', 'Clear'),
    listen: twee('Luister naar de vertaling', 'Hear the translation'),
    copy: twee('Kopieer', 'Copy'),
    copied: twee('Gekopieerd!', 'Copied'),
    copyFailed: twee('Niet gelukt', 'Could not copy'),
    ready: twee('Klaar', 'Ready'),
    working: twee('bezig met vertalen…', 'translating…'),
    done: twee('Vertaald', 'Translated'),
    sourceLabel: twee('Brontekst', 'Source text'),
    swap: twee('Wissel Nederlands en Engels om', 'Swap Dutch and English'),
    swapTitle: twee('Wissel de talen om', 'Swap languages'),
    studyName: twee('Nederlands', 'Nederlands'),
    englishName: twee('English', 'English'),
    placeholderStudy: twee('Typ iets in het Nederlands…', 'Typ iets in het Nederlands…'),
    placeholderEn: twee('Type something in English…', 'Type something in English…'),
    outStudy: twee('De vertaling verschijnt hier.', 'De vertaling verschijnt hier.'),
    outEn: twee('The translation will appear here.', 'The translation will appear here.'),
    engine: twee('vertaald met {engine}', 'translated with {engine}'),
  },

  finder: {
    eyebrow: twee('Woordenboek', 'Dictionary'),
    title: twee('Zoek een woord op', 'Look up a word'),
    lead: twee(
      'Definities uit het WikiWoordenboek, met synoniemen en voorbeelden.',
      'Definitions from the WikiWoordenboek, with synonyms and examples.',
    ),
    button: twee('Zoek', 'Search'),
    tryWith: twee('Probeer', 'Try'),
    label: twee('Zoek een woord in het woordenboek', 'Search for a word in the dictionary'),
    samples: twee('gezellig,uitwaaien,voorpret,uitbuiken,natafelen,borrel,gedoe,lekker', 'gezellig,uitwaaien,voorpret,uitbuiken,natafelen,borrel,gedoe,lekker'),
  },

  features: {
    conjugation: twee('Vervoeging', 'Conjugation'),
    conjugationBody: twee(
      'De vervoeger heeft alle tijden en alle werkwoorden.',
      'The conjugator has every tense and every verb.',
    ),
    dictionary: twee('Woordenboek', 'Dictionary'),
    dictionaryBody: twee(
      'Het WikiWoordenboek, met synoniemen en voorbeelden.',
      'The WikiWoordenboek, with synonyms and examples.',
    ),
    chat: twee('Chat', 'Chat'),
    chatBody: twee(
      'Een tutor die antwoordt met de gegevens van de site.',
      'A tutor that answers from the site’s own data.'),
  },

  conjugator: {
    eyebrow: twee('Vervoeging', 'Conjugation'),
    title: twee('Alle tijden, alle werkwoorden', 'Every tense, every verb'),
    lead: twee(
      'Begin bij een regelmatig voorbeeldwerkwoord of zoek een werkwoord. Onregelmatige vormen zijn gemarkeerd.',
      'Start from a regular model or search for a verb. Irregular forms are highlighted.',
    ),
    tab: twee('{ending}', '{ending}'),
    search: twee('Zoek een werkwoord', 'Search a verb'),
    searchLabel: twee('Zoek een werkwoord', 'Search for a verb'),
    highlight: twee('Markeer onregelmatige vormen', 'Highlight irregulars'),
    notAVerb: twee('Dit werkwoord ken ik niet', "I don't recognise that verb"),
    indicative: twee('Aantonende wijs', 'Indicative'),
    subjunctive: twee('Aanvoegende wijs', 'Subjunctive'),
    imperative: twee('Gebiedende wijs', 'Imperative'),
    simple: twee('Enkelvoudige tijden', 'Simple tenses'),
    compound: twee('Samengestelde tijden', 'Compound tenses'),
    affirmative: twee('Bevestigend', 'Affirmative'),
    negative: twee('Ontkennend', 'Negative'),
    gerund: twee('tegenwoordig deelwoord', 'present participle'),
    participle: twee('voltooid deelwoord', 'past participle'),
    compoundInf: twee('voltooide infinitief', 'perfect infinitive'),
    compoundGer: twee('infinitief met te', 'infinitive with te'),
    fullTable: twee('Volledige vervoeging', 'Full conjugation'),
    verbClass: twee('{ending}', '{ending}'),
    irregular: twee('onregelmatig', 'irregular'),
    stemChange: twee('klinkerwisseling {change}', 'vowel change {change}'),
    spelling: twee('spelling {change}', 'spelling {change}'),
    likeVerb: twee('wordt vervoegd als {verb}', 'conjugated like {verb}'),
    pronominal: twee('wederkerend: me, je, zich', 'reflexive: me, je, zich'),
    voseo: twee('{form}', '{form}'),
    fromRae: twee('vormen uit het woordenboek', 'forms from the dictionary'),
    generated: twee('gegenereerde vormen', 'generated forms'),
    auxiliary: twee('hulpwerkwoord {aux}', 'auxiliary {aux}'),
    separable: twee('scheidbaar: {prefix}', 'separable: {prefix}'),
  },

  dictionary: {
    eyebrow: twee('Woordenboek', 'Dictionary'),
    title: twee('Wat het woordenboek zegt', 'What the dictionary says'),
    lead: twee(
      'Elke betekenis uit het WikiWoordenboek, met synoniemen en een voorbeeld.',
      'Every sense from the WikiWoordenboek, with synonyms and an example.',
    ),
    search: twee('Zoek een woord', 'Search a word'),
    button: twee('Zoek', 'Search'),
    emptyTitle: twee('Typ een woord', 'Type a word'),
    emptyBody: twee(
      'Probeer gezellig, uitwaaien, voorpret, of elk woord dat je is opgevallen.',
      'Try gezellig, uitwaaien, voorpret, or any word that has caught your eye.',
    ),
    looking: twee('Even opzoeken…', 'Looking it up…'),
    noResults: twee('Geen resultaten', 'No results'),
    didYouMean: twee('Bedoelde je?', 'Did you mean?'),
    corrected: twee('Resultaten voor «{to}». Bij «{from}» ontbreekt het accent.', 'Showing “{to}”. “{from}” is missing its accent.'),
    seeOnRae: twee('bekijk op nl.wiktionary.org ↗', 'view on nl.wiktionary.org ↗'),
    synonyms: twee('Synoniemen', 'Synonyms'),
    antonyms: twee('Antoniemen', 'Antonyms'),
    locutions: twee('Uitdrukkingen en zegswijzen', 'Phrases and expressions'),
    inUse: twee('In gebruik', 'In use'),
    seeEntry: twee('bekijk het lemma ↗', 'view the entry ↗'),
    notRae: twee(
      'Het woordenboek is op dit moment niet bereikbaar.',
      'The dictionary is unavailable right now.',
    ),
    speak: twee('Luister naar het woord', 'Hear the word'),
    speakFailed: twee('Uitspreken is niet gelukt.', 'Could not pronounce that.'),
    speakSpent: twee('De uitspraken van deze maand zijn op.', 'This month’s pronunciations are used up.'),
    templateNote: twee(
      'Voorbeeldzin volgens een sjabloon. Er is nog geen echte zin met dit woord.',
      'Template example. There is no real sentence with this word yet.'),
  },

  chat: {
    title: twee('Vraag het ProfeGPT', 'Ask ProfeGPT'),
    lead: twee(
      'Vervoegingen, definities, vertalingen en uitleg over grammatica.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: twee('Vraag wat je wilt…', 'Ask whatever you like…'),
    messageLabel: twee('Bericht', 'Message'),
    send: twee('Verstuur', 'Send'),
    you: twee('JIJ', 'YOU'),
    groundedOnly: twee(
      'Antwoorden uit de vervoeger, het woordenboek, de vertaler en de grammaticanotities, zonder enige AI',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes, with no AI'),
    failed: twee('Ik kon geen antwoord geven: {error}', "I couldn't answer: {error}"),
    starters: twee(
      'de of het|vervoeg gaan in de verleden tijd|wat betekent gezellig|welke vorm is «ging»|hoe zeg je "I\'m tired" in het Nederlands',
      'de of het|vervoeg gaan in de verleden tijd|wat betekent gezellig|welke vorm is «ging»|hoe zeg je "I\'m tired" in het Nederlands',
    ),
  },

  home: {
    title: twee('ProfeGPT', 'ProfeGPT'),
    lead: twee(
      'Een vertaler, vervoegingen, een woordenboek en een tutor voor elke taal. Kies er een om te beginnen.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: twee('Kies een taal', 'Choose a language'),
    enter: twee('Ga verder', 'Enter'),
    soon: twee('Meer talen', 'More languages'),
    soonBody: twee('Binnenkort.', 'Coming soon.'),
    back: twee('Home', 'Home'),
  },

  word: {
    title: twee('Woord van de dag', 'Word of the day'),
    look: twee('Bekijk in het woordenboek', 'See it in the dictionary'),
    story: twee('Het verhaal', 'The story'),
    hide: twee('Verhaal verbergen', 'Hide the story'),
  },

  settings: {
    label: twee('Instellingen', 'Settings'),
    appearance: twee('Weergave', 'Appearance'),
    light: twee('Lichte modus', 'Light mode'),
    dark: twee('Donkere modus', 'Dark mode'),
    classroom: twee('Klas', 'Classroom'),
  },
};

export const STRINGS = {
  es: SPANISH, fr: FRENCH, it: ITALIAN, de: GERMAN, nl: DUTCH, pt: PORTUGUESE,
};
