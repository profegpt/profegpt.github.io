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

const SPANISH = {
  nav: {
    translator: two('Traductor', 'Translator'),
    conjugation: two('Conjugación', 'Conjugation'),
    dictionary: two('Diccionario', 'Dictionary'),
    chat: two('Chat', 'Chat'),
    theme: two('Cambiar de tema', 'Switch theme'),
    menu: two('Abrir menú', 'Open menu'),
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
    badge: two('Español ↔ Inglés', 'Spanish ↔ English'),
    sub: two(
      'Traduce en los dos sentidos, conjuga cualquier verbo en todos los tiempos, consulta la RAE y pregunta lo que quieras. Todo en una página.',
      'Translate both ways, conjugate any verb in every tense, look words up in the RAE dictionary, and ask whatever you like. All on one page.',
    ),
    ctaTranslate: two('Probar el traductor', 'Try the translator'),
    ctaChat: two('Hablar con ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: two('El traductor no está disponible.', 'The translator is unavailable.'),
    unavailable: two(
      'No se ha podido traducir esta frase ahora mismo. Inténtalo de nuevo dentro de un rato; mientras tanto, el diccionario y el conjugador siguen funcionando.',
      'This sentence could not be translated just now. Try again in a little while — the dictionary and the conjugator still work in the meantime.'),
    eyebrow: two('Traductor', 'Translator'),
    title: two('Los dos sentidos, un botón', 'Both directions, one button'),
    lead: two(
      'Escribe y traduce al instante. El botón central cambia de idioma y se lleva el texto consigo.',
      'Type and translate instantly. The centre button swaps the languages and carries the text across with it.',
    ),
    button: two('Traducir', 'Translate'),
    clear: two('Limpiar', 'Clear'),
    copy: two('Copiar', 'Copy'),
    copied: two('¡Copiado!', 'Copied'),
    copyFailed: two('No se pudo', 'Could not copy'),
    ready: two('Listo', 'Ready'),
    working: two('traduciendo…', 'translating…'),
    done: two('Traducido', 'Translated'),
    sourceLabel: two('Texto original', 'Source text'),
    swap: two('Intercambiar español e inglés', 'Swap Spanish and English'),
    swapTitle: two('Cambiar de idioma', 'Swap languages'),
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
      'Definiciones del Diccionario de la lengua española, acepción por acepción, con sinónimos y una frase de ejemplo.',
      'Definitions from the Diccionario de la lengua española, sense by sense, with synonyms and an example sentence.',
    ),
    button: two('Buscar', 'Search'),
    tryWith: two('Prueba con', 'Try'),
    note: two('Pulsa Enter para abrir la página del diccionario.', 'Press Enter to open the dictionary page.'),
    label: two('Buscar una palabra en el diccionario', 'Search for a word in the dictionary'),
    samples: two('sobremesa,madrugar,entrañable,friolero,estrenar', 'sobremesa,madrugar,entrañable,friolero,estrenar'),
  },

  features: {
    conjugation: two('Conjugación', 'Conjugation'),
    conjugationBody: two(
      'Todos los tiempos del indicativo, el subjuntivo y el imperativo, con los tres modelos -ar, -er e -ir y buscador de verbos.',
      'Every tense of the indicative, subjunctive and imperative, with the three -ar, -er and -ir models plus a verb search.',
    ),
    dictionary: two('Diccionario', 'Dictionary'),
    dictionaryBody: two(
      'Definiciones del Diccionario de la lengua española, con sinónimos y una frase de ejemplo por acepción.',
      'Definitions from the Diccionario de la lengua española, with synonyms and an example sentence per sense.',
    ),
    chat: two('Chat', 'Chat'),
    chatBody: two(
      'Un tutor que responde con los datos del propio sitio: gramática, conjugaciones, definiciones y traducciones.',
      'A tutor that answers from the site’s own data: grammar, conjugations, definitions and translations.'),
  },

  conjugator: {
    eyebrow: two('Conjugación', 'Conjugation'),
    title: two('Todos los tiempos, todos los verbos', 'Every tense, every verb'),
    lead: two(
      'Empieza por uno de los tres modelos regulares o busca el verbo que necesites. Las formas irregulares aparecen resaltadas.',
      'Start from one of the three regular models, or search for the verb you need. Irregular forms are highlighted.',
    ),
    tab: two('verbos -{ending}', '-{ending} verbs'),
    search: two('Buscar un verbo', 'Search a verb'),
    searchLabel: two('Buscar un verbo', 'Search for a verb'),
    highlight: two('Resaltar irregulares', 'Highlight irregulars'),
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
      'Definiciones del Diccionario de la lengua española, con sus acepciones, sinónimos y una frase de ejemplo para cada sentido.',
      'Definitions from the Diccionario de la lengua española, with every sense, its synonyms, and an example sentence for each.',
    ),
    search: two('Buscar una palabra', 'Search a word'),
    button: two('Buscar', 'Search'),
    emptyTitle: two('Escribe una palabra', 'Type a word'),
    emptyBody: two(
      'Prueba con sobremesa, entrañable, madrugar o cualquier palabra que te haya llamado la atención.',
      'Try sobremesa, entrañable, madrugar, or any word that has caught your eye.',
    ),
    looking: two('Consultando el diccionario…', 'Looking it up…'),
    noResults: two('Sin resultados', 'No results'),
    didYouMean: two('¿Quisiste decir?', 'Did you mean?'),
    corrected: two('Buscando «{to}» — «{from}» no lleva tilde.', 'Showing “{to}” — “{from}” is missing its accent.'),
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
    speak: two('Escuchar la palabra', 'Hear the word'),
    speakFailed: two('No se pudo pronunciar.', 'Could not pronounce that.'),
    speakSpent: two('Se acabaron las pronunciaciones de este mes.', 'This month’s pronunciations are used up.'),
    templateNote: two(
      'Ejemplo de plantilla — no hay ninguna frase real con esta palabra todavía.',
      'Template example — there is no real sentence with this word yet.'),
  },

  chat: {
    title: two('Pregúntale a ProfeGPT', 'Ask ProfeGPT'),
    lead: two(
      'Conjugaciones, definiciones de la RAE, traducciones y explicaciones de gramática.',
      'Conjugations, RAE definitions, translations and grammar explanations.',
    ),
    placeholder: two('Pregunta lo que quieras…', 'Ask whatever you like…'),
    messageLabel: two('Mensaje', 'Message'),
    send: two('Enviar', 'Send'),
    you: two('TÚ', 'YOU'),
    enterHint: two('Enter para enviar · Shift + Enter para un salto de línea', 'Enter to send · Shift + Enter for a new line'),
    groundedOnly: two(
      'Respuestas del conjugador, el diccionario, el traductor y las fichas de gramática — sin ninguna IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes — no AI involved'),
    failed: two('No pude responder: {error}', "I couldn't answer: {error}"),
    starters: two(
      'ser y estar|conjuga tener en subjuntivo|qué significa sobremesa|qué es «dijeron»|cómo se dice "I am tired" en español',
      'ser y estar|conjuga tener en subjuntivo|qué significa sobremesa|qué es «dijeron»|cómo se dice "I am tired" en español',
    ),
  },

  tape: {
    unlock: two('Desbloquear', 'Unlock'),
  },

  lock: {
    cancel: two('Cancelar', 'Cancel'),
    title: two('Bloquear la web', 'Lock the site'),
    detail: two(
      'Con el código, la web queda bloqueada para todo el mundo hasta que alguien la desbloquee.',
      'With the passcode, the site is locked for everyone until someone unlocks it.',
    ),
    passcode: two('Código del profe', 'Teacher passcode'),
    lockNow: two('Bloquear', 'Lock'),
    wrong: two('Código incorrecto.', 'Wrong passcode.'),
    lockLabel: two('Bloquear la web', 'Lock the site'),
    unlockLabel: two('Desbloquear la web', 'Unlock the site'),
    sealedTitle: two('Clase en marcha', 'Class in session'),
    sealedDetail: two(
      'Un profe ha bloqueado la web. Introduce el código para desbloquearla.',
      'A teacher has locked the site. Enter the passcode to unlock it.',
    ),
    sealedNote: two('Se desbloquea para todos a la vez.', 'It unlocks for everyone at once.'),
  },

  home: {
    title: two('ProfeGPT', 'ProfeGPT'),
    lead: two(
      'Traductor, conjugaciones, diccionario y un tutor para cada idioma. Elige uno para empezar.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: two('Elige un idioma', 'Choose a language'),
    enter: two('Entrar', 'Enter'),
    hint: two('Pulsa Intro para entrar', 'Press Enter to go in'),
    soon: two('Más idiomas', 'More languages'),
    soonBody: two('Próximamente.', 'Coming soon.'),
    back: two('Inicio', 'Home'),
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
    theme: deux('Changer de thème', 'Switch theme'),
    menu: deux('Ouvrir le menu', 'Open menu'),
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
    badge: deux('Français ↔ Anglais', 'French ↔ English'),
    sub: deux(
      'Traduisez dans les deux sens, conjuguez n’importe quel verbe à tous les temps, cherchez un mot et posez la question que vous voulez. Le tout sur une page.',
      'Translate both ways, conjugate any verb in every tense, look words up in the dictionary, and ask whatever you like. All on one page.',
    ),
    ctaTranslate: deux('Essayer le traducteur', 'Try the translator'),
    ctaChat: deux('Parler à ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: deux('Le traducteur n’est pas disponible.', 'The translator is unavailable.'),
    unavailable: deux(
      'Cette phrase n’a pas pu être traduite pour le moment. Réessayez dans un moment ; en attendant, le dictionnaire et la conjugaison fonctionnent toujours.',
      'This sentence could not be translated just now. Try again in a little while — the dictionary and the conjugator still work in the meantime.'),
    eyebrow: deux('Traducteur', 'Translator'),
    title: deux('Les deux sens, un bouton', 'Both directions, one button'),
    lead: deux(
      'Écrivez et traduisez aussitôt. Le bouton central change de langue et emporte le texte avec lui.',
      'Type and translate instantly. The centre button swaps the languages and carries the text across with it.',
    ),
    button: deux('Traduire', 'Translate'),
    clear: deux('Effacer', 'Clear'),
    copy: deux('Copier', 'Copy'),
    copied: deux('Copié !', 'Copied'),
    copyFailed: deux('Échec', 'Could not copy'),
    ready: deux('Prêt', 'Ready'),
    working: deux('traduction…', 'translating…'),
    done: deux('Traduit', 'Translated'),
    sourceLabel: deux('Texte d’origine', 'Source text'),
    swap: deux('Intervertir le français et l’anglais', 'Swap French and English'),
    swapTitle: deux('Changer de langue', 'Swap languages'),
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
      'Définitions du Wiktionnaire, sens par sens, avec les synonymes et une phrase d’exemple.',
      'Definitions from the Wiktionnaire, sense by sense, with synonyms and an example sentence.',
    ),
    button: deux('Chercher', 'Search'),
    tryWith: deux('Essayez', 'Try'),
    note: deux('Appuyez sur Entrée pour ouvrir la page du dictionnaire.', 'Press Enter to open the dictionary page.'),
    label: deux('Chercher un mot dans le dictionnaire', 'Search for a word in the dictionary'),
    samples: deux('flâner,dépaysement,râler,chaleureux,bricoler', 'flâner,dépaysement,râler,chaleureux,bricoler'),
  },

  features: {
    conjugation: deux('Conjugaison', 'Conjugation'),
    conjugationBody: deux(
      'Tous les temps de l’indicatif, du subjonctif et de l’impératif, avec les trois modèles -er, -ir et -re et un moteur de recherche de verbes.',
      'Every tense of the indicative, subjunctive and imperative, with the three -er, -ir and -re models plus a verb search.',
    ),
    dictionary: deux('Dictionnaire', 'Dictionary'),
    dictionaryBody: deux(
      'Définitions du Wiktionnaire, avec les synonymes et une phrase d’exemple par sens.',
      'Definitions from the Wiktionnaire, with synonyms and an example sentence per sense.',
    ),
    chat: deux('Chat', 'Chat'),
    chatBody: deux(
      'Un tuteur qui répond avec les données du site : grammaire, conjugaison, définitions et traductions.',
      'A tutor that answers from the site’s own data: grammar, conjugations, definitions and translations.'),
  },

  conjugator: {
    eyebrow: deux('Conjugaison', 'Conjugation'),
    title: deux('Tous les temps, tous les verbes', 'Every tense, every verb'),
    lead: deux(
      'Commencez par l’un des trois modèles réguliers, ou cherchez le verbe dont vous avez besoin. Les formes irrégulières sont mises en évidence.',
      'Start from one of the three regular models, or search for the verb you need. Irregular forms are highlighted.',
    ),
    tab: deux('verbes en -{ending}', '-{ending} verbs'),
    search: deux('Chercher un verbe', 'Search a verb'),
    searchLabel: deux('Chercher un verbe', 'Search for a verb'),
    highlight: deux('Mettre en évidence les irrégularités', 'Highlight irregulars'),
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
      'Définitions du Wiktionnaire, avec tous les sens, leurs synonymes et une phrase d’exemple pour chacun.',
      'Definitions from the Wiktionnaire, with every sense, its synonyms, and an example sentence for each.',
    ),
    search: deux('Chercher un mot', 'Search a word'),
    button: deux('Chercher', 'Search'),
    emptyTitle: deux('Écrivez un mot', 'Type a word'),
    emptyBody: deux(
      'Essayez flâner, dépaysement, râler, ou n’importe quel mot qui vous a intrigué.',
      'Try flâner, dépaysement, râler, or any word that has caught your eye.',
    ),
    looking: deux('Consultation du dictionnaire…', 'Looking it up…'),
    noResults: deux('Aucun résultat', 'No results'),
    didYouMean: deux('Vouliez-vous dire ?', 'Did you mean?'),
    corrected: deux('Résultat pour « {to} » — « {from} » manque son accent.', 'Showing “{to}” — “{from}” is missing its accent.'),
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
    speak: deux('Écouter le mot', 'Hear the word'),
    speakFailed: deux('Impossible de prononcer.', 'Could not pronounce that.'),
    speakSpent: deux('Les prononciations de ce mois-ci sont épuisées.', 'This month’s pronunciations are used up.'),
    templateNote: deux(
      'Exemple type — il n’existe pas encore de vraie phrase avec ce mot.',
      'Template example — there is no real sentence with this word yet.'),
  },

  chat: {
    title: deux('Demandez à ProfeGPT', 'Ask ProfeGPT'),
    lead: deux(
      'Conjugaisons, définitions, traductions et explications de grammaire.',
      'Conjugations, definitions, translations and grammar explanations.',
    ),
    placeholder: deux('Posez la question que vous voulez…', 'Ask whatever you like…'),
    messageLabel: deux('Message', 'Message'),
    send: deux('Envoyer', 'Send'),
    you: deux('VOUS', 'YOU'),
    enterHint: deux('Entrée pour envoyer · Maj + Entrée pour un retour à la ligne', 'Enter to send · Shift + Enter for a new line'),
    groundedOnly: deux(
      'Réponses du conjugueur, du dictionnaire, du traducteur et des fiches de grammaire — sans aucune IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes — no AI involved'),
    failed: deux('Je n’ai pas pu répondre : {error}', "I couldn't answer: {error}"),
    starters: deux(
      'être et avoir|conjugue prendre au subjonctif|que veut dire flâner|c’est quoi « vinrent »|comment dit-on "I am tired" en français',
      'être et avoir|conjugue prendre au subjonctif|que veut dire flâner|c’est quoi « vinrent »|comment dit-on "I am tired" en français',
    ),
  },

  tape: {
    unlock: deux('Débloquer', 'Unlock'),
  },

  lock: {
    cancel: deux('Annuler', 'Cancel'),
    title: deux('Verrouiller le site', 'Lock the site'),
    detail: deux(
      'Avec le code, le site est verrouillé pour tout le monde jusqu’à ce que quelqu’un le déverrouille.',
      'With the passcode, the site is locked for everyone until someone unlocks it.',
    ),
    passcode: deux('Code du professeur', 'Teacher passcode'),
    lockNow: deux('Verrouiller', 'Lock'),
    wrong: deux('Code incorrect.', 'Wrong passcode.'),
    lockLabel: deux('Verrouiller le site', 'Lock the site'),
    unlockLabel: deux('Déverrouiller le site', 'Unlock the site'),
    sealedTitle: deux('Cours en cours', 'Class in session'),
    sealedDetail: deux(
      'Un professeur a verrouillé le site. Entrez le code pour le déverrouiller.',
      'A teacher has locked the site. Enter the passcode to unlock it.',
    ),
    sealedNote: deux('Il se déverrouille pour tout le monde à la fois.', 'It unlocks for everyone at once.'),
  },

  home: {
    title: deux('ProfeGPT', 'ProfeGPT'),
    lead: deux(
      'Un traducteur, la conjugaison, un dictionnaire et un tuteur pour chaque langue. Choisissez-en une pour commencer.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: deux('Choisissez une langue', 'Choose a language'),
    enter: deux('Entrer', 'Enter'),
    hint: deux('Appuyez sur Entrée pour entrer', 'Press Enter to go in'),
    soon: deux('D’autres langues', 'More languages'),
    soonBody: deux('Bientôt.', 'Coming soon.'),
    back: deux('Accueil', 'Home'),
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
    theme: due('Cambia tema', 'Switch theme'),
    menu: due('Apri il menu', 'Open menu'),
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
    badge: due('Italiano ↔ Inglese', 'Italian ↔ English'),
    sub: due(
      'Traduci in tutte e due le direzioni, coniuga qualsiasi verbo in tutti i tempi, cerca una parola e chiedi quello che vuoi. Tutto in una pagina.',
      'Translate both ways, conjugate any verb in every tense, look words up in the dictionary, and ask whatever you like. All on one page.',
    ),
    ctaTranslate: due('Prova il traduttore', 'Try the translator'),
    ctaChat: due('Parla con ProfeGPT', 'Talk to ProfeGPT'),
  },

  translator: {
    unavailableTitle: due('Il traduttore non è disponibile.', 'The translator is unavailable.'),
    unavailable: due(
      'Non è stato possibile tradurre questa frase in questo momento. Riprova tra poco; nel frattempo il dizionario e il coniugatore funzionano.',
      'This sentence could not be translated just now. Try again in a little while — the dictionary and the conjugator still work in the meantime.'),
    eyebrow: due('Traduttore', 'Translator'),
    title: due('Due direzioni, un solo pulsante', 'Both directions, one button'),
    lead: due(
      'Scrivi e traduci all’istante. Il pulsante centrale inverte le lingue e si porta dietro il testo.',
      'Type and translate instantly. The centre button swaps the languages and carries the text across with it.',
    ),
    button: due('Traduci', 'Translate'),
    clear: due('Cancella', 'Clear'),
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
      'Definizioni dal Wikizionario, significato per significato, con i sinonimi e una frase d’esempio.',
      'Definitions from the Wikizionario, sense by sense, with synonyms and an example sentence.',
    ),
    button: due('Cerca', 'Search'),
    tryWith: due('Prova con', 'Try'),
    note: due('Premi Invio per aprire la pagina del dizionario.', 'Press Enter to open the dictionary page.'),
    label: due('Cerca una parola nel dizionario', 'Search for a word in the dictionary'),
    samples: due('sprezzatura,magari,abbiocco,meriggiare,menefreghista', 'sprezzatura,magari,abbiocco,meriggiare,menefreghista'),
  },

  features: {
    conjugation: due('Coniugazione', 'Conjugation'),
    conjugationBody: due(
      'Tutti i tempi dell’indicativo, del congiuntivo, del condizionale e dell’imperativo, con i tre modelli in -are, -ere e -ire e una ricerca dei verbi.',
      'Every tense of the indicative, subjunctive, conditional and imperative, with the three -are, -ere and -ire models plus a verb search.',
    ),
    dictionary: due('Dizionario', 'Dictionary'),
    dictionaryBody: due(
      'Definizioni dal Wikizionario, con i sinonimi e una frase d’esempio per ogni significato.',
      'Definitions from the Wikizionario, with synonyms and an example sentence per sense.',
    ),
    chat: due('Chat', 'Chat'),
    chatBody: due(
      'Un tutor che risponde con i dati del sito: grammatica, coniugazioni, definizioni e traduzioni.',
      'A tutor that answers from the site’s own data: grammar, conjugations, definitions and translations.'),
  },

  conjugator: {
    eyebrow: due('Coniugazione', 'Conjugation'),
    title: due('Tutti i tempi, tutti i verbi', 'Every tense, every verb'),
    lead: due(
      'Parti da uno dei tre modelli regolari o cerca il verbo che ti serve. Le forme irregolari sono evidenziate.',
      'Start from one of the three regular models, or search for the verb you need. Irregular forms are highlighted.',
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
      'Definizioni dal Wikizionario, con tutti i significati, i loro sinonimi e una frase d’esempio per ciascuno.',
      'Definitions from the Wikizionario, with every sense, its synonyms, and an example sentence for each.',
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
    corrected: due('Risultati per «{to}» — a «{from}» manca l’accento.', 'Showing “{to}” — “{from}” is missing its accent.'),
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
      'Esempio di modello — non c’è ancora una frase vera con questa parola.',
      'Template example — there is no real sentence with this word yet.'),
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
    enterHint: due('Invio per inviare · Maiusc + Invio per andare a capo', 'Enter to send · Shift + Enter for a new line'),
    groundedOnly: due(
      'Risposte dal coniugatore, dal dizionario, dal traduttore e dalle schede di grammatica — senza alcuna IA',
      'Answers from the conjugator, the dictionary, the translator and the grammar notes — no AI involved'),
    failed: due('Non sono riuscito a rispondere: {error}', "I couldn't answer: {error}"),
    starters: due(
      'essere e avere|coniuga andare al congiuntivo|cosa vuol dire magari|che forma è «andarono»|come si dice "I\'m tired" in italiano',
      'essere e avere|coniuga andare al congiuntivo|cosa vuol dire magari|che forma è «andarono»|come si dice "I\'m tired" in italiano',
    ),
  },

  tape: {
    unlock: due('Sblocca', 'Unlock'),
  },

  lock: {
    cancel: due('Annulla', 'Cancel'),
    title: due('Blocca il sito', 'Lock the site'),
    detail: due(
      'Con il codice, il sito resta bloccato per tutti finché qualcuno non lo sblocca.',
      'With the passcode, the site is locked for everyone until someone unlocks it.',
    ),
    passcode: due('Codice del prof', 'Teacher passcode'),
    lockNow: due('Blocca', 'Lock'),
    wrong: due('Codice errato.', 'Wrong passcode.'),
    lockLabel: due('Blocca il sito', 'Lock the site'),
    unlockLabel: due('Sblocca il sito', 'Unlock the site'),
    sealedTitle: due('Lezione in corso', 'Class in session'),
    sealedDetail: due(
      'Un prof ha bloccato il sito. Inserisci il codice per sbloccarlo.',
      'A teacher has locked the site. Enter the passcode to unlock it.',
    ),
    sealedNote: due('Si sblocca per tutti nello stesso momento.', 'It unlocks for everyone at once.'),
  },

  home: {
    title: due('ProfeGPT', 'ProfeGPT'),
    lead: due(
      'Un traduttore, le coniugazioni, un dizionario e un tutor per ogni lingua. Scegline una per cominciare.',
      'A translator, conjugation tables, a dictionary and a tutor for each language. Pick one to begin.'),
    choose: due('Scegli una lingua', 'Choose a language'),
    enter: due('Entra', 'Enter'),
    hint: due('Premi Invio per entrare', 'Press Enter to go in'),
    soon: due('Altre lingue', 'More languages'),
    soonBody: due('In arrivo.', 'Coming soon.'),
    back: due('Home', 'Home'),
  },

  settings: {
    label: due('Impostazioni', 'Settings'),
    appearance: due('Aspetto', 'Appearance'),
    light: due('Modalità chiara', 'Light mode'),
    dark: due('Modalità scura', 'Dark mode'),
    classroom: due('Classe', 'Classroom'),
  },
};

export const STRINGS = { es: SPANISH, fr: FRENCH, it: ITALIAN };
