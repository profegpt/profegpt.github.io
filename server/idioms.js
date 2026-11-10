/**
 * Idioms, paired with their equivalents rather than paraphrased.
 *
 * A translator renders most idioms well — "it's raining cats and dogs" already
 * comes back as "llueve a cántaros" — but the ones it misses, it renders word
 * for word: "cost an arm and a leg" becomes "un brazo y una pierna".
 *
 * The obvious repair is to flatten the idiom before translating: "it cost a
 * lot" → "costó mucho". That is accurate and teaches the wrong thing, because
 * Spanish has its own idiom for this and a learner should meet it. So each
 * entry pairs the two idioms and carries the plain meaning as a note, which the
 * translator page shows underneath.
 *
 * Hand-written and hand-checked, like the grammar notes. Regional variants are
 * many; where one is clearly the most widely understood, that is the one here.
 *
 * One table per language the site can be about. They are separate rather than
 * one table with an extra column because the sets barely overlap: the idioms a
 * translator fumbles going into Spanish are not the ones it fumbles going into
 * French, and half of each list has no counterpart in the other.
 */

const ES_IDIOMS = [
  {
    en: ['cost an arm and a leg', 'costs an arm and a leg', 'cost me an arm and a leg'],
    es: 'costar un ojo de la cara',
    say: { en: 'it cost an arm and a leg', es: 'costó un ojo de la cara' },
    meaning: { en: 'to be extremely expensive', es: 'ser carísimo' },
  },
  {
    en: ['break a leg'],
    es: '¡mucha mierda!',
    say: { en: 'break a leg', es: '¡mucha mierda!' },
    meaning: { en: 'good luck (said to a performer)', es: 'buena suerte (a un actor)' },
  },
  {
    // Not a metaphor, but the same failure: a rule-based engine reads the
    // imperative "test me" as reflexive and returns "me pruebo", "I test
    // myself". The table exists for phrases an engine gets word-for-word
    // wrong, and this is one.
    en: ['test me', 'put me to the test'],
    es: 'poner a prueba',
    say: { en: 'test me', es: 'ponme a prueba' },
    meaning: { en: 'go on, try me', es: 'a ver si puedo' },
  },
  {
    en: ['raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    es: 'llover a cántaros',
    say: { en: "it's raining cats and dogs", es: 'llueve a cántaros' },
    // The form to use when the engine has already written the auxiliary. Its
    // absence is what produced "está llueve a cántaros": a finite clause
    // pasted into a slot that wanted a gerund.
    progressive: { es: 'lloviendo a cántaros' },
    meaning: { en: 'to rain very heavily', es: 'llover muchísimo' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket'],
    es: 'estirar la pata',
    say: { en: 'to kick the bucket', es: 'estirar la pata' },
    meaning: { en: 'to die', es: 'morirse' },
  },
  {
    en: ['piece of cake'],
    es: 'pan comido',
    say: { en: 'a piece of cake', es: 'pan comido' },
    meaning: { en: 'very easy', es: 'muy fácil' },
  },
  {
    en: ['pull your leg', 'pull my leg', 'pulling my leg', 'pulling your leg', "pull someone's leg"],
    es: 'tomar el pelo',
    say: { en: 'to pull someone’s leg', es: 'tomar el pelo a alguien' },
    meaning: { en: 'to tease someone', es: 'burlarse de alguien en broma' },
  },
  {
    en: ['once in a blue moon'],
    es: 'de higos a brevas',
    say: { en: 'once in a blue moon', es: 'de higos a brevas' },
    meaning: { en: 'very rarely', es: 'muy rara vez' },
  },
  {
    en: ['kill two birds with one stone'],
    es: 'matar dos pájaros de un tiro',
    say: { en: 'kill two birds with one stone', es: 'matar dos pájaros de un tiro' },
    meaning: { en: 'to solve two problems at once', es: 'resolver dos cosas a la vez' },
  },
  {
    en: ['when pigs fly'],
    es: 'cuando las ranas críen pelo',
    say: { en: 'when pigs fly', es: 'cuando las ranas críen pelo' },
    meaning: { en: 'never', es: 'nunca' },
  },
  {
    en: ['speak of the devil'],
    es: 'hablando del rey de Roma',
    say: { en: 'speak of the devil', es: 'hablando del rey de Roma' },
    meaning: { en: 'said when someone appears just as you mention them', es: 'se dice cuando aparece alguien de quien se hablaba' },
  },
  {
    en: ['hit the nail on the head'],
    es: 'dar en el clavo',
    say: { en: 'hit the nail on the head', es: 'dar en el clavo' },
    meaning: { en: 'to be exactly right', es: 'acertar plenamente' },
  },
  {
    en: ['the last straw'],
    es: 'la gota que colma el vaso',
    say: { en: 'the last straw', es: 'la gota que colma el vaso' },
    meaning: { en: 'the final thing that makes a situation unbearable', es: 'lo que colma la paciencia' },
  },
  {
    en: ['throw in the towel'],
    es: 'tirar la toalla',
    say: { en: 'to throw in the towel', es: 'tirar la toalla' },
    meaning: { en: 'to give up', es: 'rendirse' },
  },
  {
    en: ['lend a hand', 'give me a hand', 'give a hand'],
    es: 'echar una mano',
    say: { en: 'to lend a hand', es: 'echar una mano' },
    meaning: { en: 'to help', es: 'ayudar' },
  },
  {
    en: ['put my foot in it', 'put his foot in it', 'put your foot in it'],
    es: 'meter la pata',
    say: { en: 'to put your foot in it', es: 'meter la pata' },
    meaning: { en: 'to say something tactless', es: 'decir algo inoportuno' },
  },
  {
    en: ['head in the clouds'],
    es: 'estar en las nubes',
    say: { en: 'to have your head in the clouds', es: 'estar en las nubes' },
    meaning: { en: 'to be daydreaming', es: 'estar distraído' },
  },
  {
    en: ['better late than never'],
    es: 'más vale tarde que nunca',
    say: { en: 'better late than never', es: 'más vale tarde que nunca' },
    meaning: { en: 'late is preferable to not at all', es: 'mejor tarde que no llegar' },
  },
  {
    en: ['easier said than done'],
    es: 'del dicho al hecho hay mucho trecho',
    say: { en: 'easier said than done', es: 'del dicho al hecho hay mucho trecho' },
    meaning: { en: 'harder to do than to describe', es: 'más difícil de hacer que de decir' },
  },
  {
    en: ['get your act together', 'get my act together'],
    es: 'ponerse las pilas',
    say: { en: 'to get your act together', es: 'ponerse las pilas' },
    meaning: { en: 'to start making a proper effort', es: 'espabilar, esforzarse' },
  },
  {
    en: ['fed up'],
    es: 'estar hasta las narices',
    say: { en: 'to be fed up', es: 'estar hasta las narices' },
    meaning: { en: 'to have had enough of something', es: 'estar harto' },
  },
  {
    en: ['be all ears'],
    es: 'ser todo oídos',
    say: { en: 'to be all ears', es: 'ser todo oídos' },
    meaning: { en: 'to be listening eagerly', es: 'escuchar con toda atención' },
  },
  {
    en: ['thick as thieves', 'inseparable'],
    es: 'ser uña y carne',
    say: { en: 'to be thick as thieves', es: 'ser uña y carne' },
    meaning: { en: 'to be extremely close', es: 'ser inseparables' },
  },
  {
    en: ['not mince words', "doesn't mince words", 'mince words'],
    es: 'no tener pelos en la lengua',
    say: { en: 'to not mince words', es: 'no tener pelos en la lengua' },
    meaning: { en: 'to speak bluntly', es: 'hablar sin rodeos' },
  },
  {
    en: ['a blessing in disguise'],
    es: 'no hay mal que por bien no venga',
    say: { en: 'a blessing in disguise', es: 'no hay mal que por bien no venga' },
    meaning: { en: 'a misfortune that turns out well', es: 'un mal que acaba trayendo algo bueno' },
  },
  {
    en: ['out of the frying pan into the fire'],
    es: 'salir de Guatemala y entrar en Guatepeor',
    say: { en: 'out of the frying pan into the fire', es: 'salir de Guatemala y entrar en Guatepeor' },
    meaning: { en: 'to escape one trouble into a worse one', es: 'salir de un problema y caer en otro peor' },
  },
  {
    en: ['crazy', 'mad as a hatter', 'nuts'],
    es: 'estar como una cabra',
    say: { en: 'to be mad as a hatter', es: 'estar como una cabra' },
    meaning: { en: 'to be quite mad', es: 'estar muy loco' },
  },
];

const FR_IDIOMS = [
  {
    en: ['cost an arm and a leg', 'costs an arm and a leg', 'cost me an arm and a leg'],
    fr: 'coûter les yeux de la tête',
    say: { en: 'it cost an arm and a leg', fr: 'ça a coûté les yeux de la tête' },
    meaning: { en: 'to be extremely expensive', fr: 'être très cher' },
  },
  {
    en: ['break a leg'],
    fr: 'merde !',
    say: { en: 'break a leg', fr: 'merde !' },
    meaning: { en: 'good luck (said to a performer)', fr: 'bonne chance (à un artiste)' },
  },
  {
    en: ['test me', 'put me to the test'],
    fr: 'mettre à l’épreuve',
    say: { en: 'test me', fr: 'mets-moi à l’épreuve' },
    meaning: { en: 'go on, try me', fr: 'vas-y, essaie' },
  },
  {
    en: ['raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    fr: 'pleuvoir des cordes',
    say: { en: "it's raining cats and dogs", fr: 'il pleut des cordes' },
    meaning: { en: 'to rain very heavily', fr: 'pleuvoir très fort' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket'],
    fr: 'casser sa pipe',
    say: { en: 'to kick the bucket', fr: 'casser sa pipe' },
    meaning: { en: 'to die', fr: 'mourir' },
  },
  {
    en: ['piece of cake', 'as easy as pie'],
    fr: 'les doigts dans le nez',
    say: { en: 'a piece of cake', fr: 'les doigts dans le nez' },
    meaning: { en: 'very easy', fr: 'très facile' },
  },
  {
    en: ['pull your leg', 'pull my leg', 'pulling my leg', 'pulling your leg', "pull someone's leg"],
    fr: 'faire marcher quelqu’un',
    say: { en: 'to pull someone’s leg', fr: 'faire marcher quelqu’un' },
    meaning: { en: 'to tease someone', fr: 'se moquer gentiment de quelqu’un' },
  },
  {
    en: ['once in a blue moon'],
    fr: 'tous les trente-six du mois',
    say: { en: 'once in a blue moon', fr: 'tous les trente-six du mois' },
    meaning: { en: 'very rarely', fr: 'très rarement' },
  },
  {
    en: ['kill two birds with one stone'],
    fr: 'faire d’une pierre deux coups',
    say: { en: 'kill two birds with one stone', fr: 'faire d’une pierre deux coups' },
    meaning: { en: 'to solve two problems at once', fr: 'régler deux choses à la fois' },
  },
  {
    en: ['when pigs fly'],
    fr: 'quand les poules auront des dents',
    say: { en: 'when pigs fly', fr: 'quand les poules auront des dents' },
    meaning: { en: 'never', fr: 'jamais' },
  },
  {
    en: ['speak of the devil'],
    fr: 'quand on parle du loup',
    say: { en: 'speak of the devil', fr: 'quand on parle du loup' },
    meaning: { en: 'said when someone appears just as you mention them', fr: 'se dit quand la personne dont on parle arrive' },
  },
  {
    en: ['the last straw', 'the final straw'],
    fr: 'la goutte d’eau qui fait déborder le vase',
    say: { en: 'the last straw', fr: 'la goutte d’eau qui fait déborder le vase' },
    meaning: { en: 'the small thing that finally makes it unbearable', fr: 'le détail de trop' },
  },
  {
    en: ['have a frog in my throat', 'a frog in my throat', 'frog in his throat'],
    fr: 'avoir un chat dans la gorge',
    say: { en: 'to have a frog in one’s throat', fr: 'avoir un chat dans la gorge' },
    meaning: { en: 'to be hoarse', fr: 'être enroué' },
  },
  {
    en: ['let the cat out of the bag', 'spill the beans'],
    fr: 'vendre la mèche',
    say: { en: 'to let the cat out of the bag', fr: 'vendre la mèche' },
    meaning: { en: 'to give away a secret', fr: 'révéler un secret' },
  },
  {
    en: ['in the same boat'],
    fr: 'être logé à la même enseigne',
    say: { en: 'to be in the same boat', fr: 'être logé à la même enseigne' },
    meaning: { en: 'to be in the same difficult position', fr: 'être dans la même situation' },
  },
  {
    en: ['other fish to fry', 'bigger fish to fry'],
    fr: 'avoir d’autres chats à fouetter',
    say: { en: 'to have other fish to fry', fr: 'avoir d’autres chats à fouetter' },
    meaning: { en: 'to have more important things to do', fr: 'avoir mieux à faire' },
  },
  {
    en: ['bite off more than you can chew', 'eyes bigger than your stomach'],
    fr: 'avoir les yeux plus gros que le ventre',
    say: { en: 'to bite off more than you can chew', fr: 'avoir les yeux plus gros que le ventre' },
    meaning: { en: 'to take on more than you can manage', fr: 'en prendre plus qu’on ne peut' },
  },
  {
    en: ['under the weather'],
    fr: 'ne pas être dans son assiette',
    say: { en: 'to be under the weather', fr: 'ne pas être dans son assiette' },
    meaning: { en: 'to feel slightly unwell', fr: 'ne pas se sentir bien' },
  },
  {
    en: ['throw in the towel', 'give up'],
    fr: 'jeter l’éponge',
    say: { en: 'to throw in the towel', fr: 'jeter l’éponge' },
    meaning: { en: 'to give up', fr: 'abandonner' },
  },
  {
    en: ['turn a blind eye'],
    fr: 'fermer les yeux',
    say: { en: 'to turn a blind eye', fr: 'fermer les yeux sur quelque chose' },
    meaning: { en: 'to pretend not to notice', fr: 'faire comme si on n’avait rien vu' },
  },
  {
    en: ["it's all greek to me", 'all greek to me'],
    fr: 'c’est du chinois',
    say: { en: "it's all Greek to me", fr: 'c’est du chinois' },
    meaning: { en: 'I cannot understand a word of it', fr: 'je n’y comprends rien' },
  },
  {
    en: ['walking on eggshells', 'walk on eggshells'],
    fr: 'marcher sur des œufs',
    say: { en: 'to walk on eggshells', fr: 'marcher sur des œufs' },
    meaning: { en: 'to proceed very cautiously', fr: 'avancer avec beaucoup de précaution' },
  },
  {
    en: ['green thumb', 'green fingers'],
    fr: 'avoir la main verte',
    say: { en: 'to have a green thumb', fr: 'avoir la main verte' },
    meaning: { en: 'to be good with plants', fr: 'savoir s’occuper des plantes' },
  },
  {
    en: ['sleep like a log', 'slept like a log'],
    fr: 'dormir comme une marmotte',
    say: { en: 'to sleep like a log', fr: 'dormir comme une marmotte' },
    meaning: { en: 'to sleep very deeply', fr: 'dormir profondément' },
  },
  {
    en: ['make a mountain out of a molehill'],
    fr: 'en faire tout un fromage',
    say: { en: 'to make a mountain out of a molehill', fr: 'en faire tout un fromage' },
    meaning: { en: 'to make far too much of something small', fr: 'exagérer une chose sans importance' },
  },
  {
    en: ['long time no see'],
    fr: 'ça fait un bail',
    say: { en: 'long time no see', fr: 'ça fait un bail' },
    meaning: { en: "it's been a long time", fr: 'cela fait longtemps' },
  },
  {
    en: ['fed up', 'sick of it', 'had enough'],
    fr: 'en avoir marre',
    say: { en: 'to be fed up', fr: 'en avoir marre' },
    meaning: { en: 'to have had enough', fr: 'être excédé' },
  },
  {
    en: ['out of the frying pan into the fire'],
    fr: 'tomber de Charybde en Scylla',
    say: { en: 'out of the frying pan into the fire', fr: 'tomber de Charybde en Scylla' },
    meaning: { en: 'to escape one trouble into a worse one', fr: 'sortir d’un ennui pour tomber dans un pire' },
  },
  {
    en: ['crazy', 'mad as a hatter', 'nuts'],
    fr: 'avoir une araignée au plafond',
    say: { en: 'to be mad as a hatter', fr: 'avoir une araignée au plafond' },
    meaning: { en: 'to be quite mad', fr: 'être un peu fou' },
  },
];

/**
 * Italian. Like the other two, each pairing is an idiom an Italian speaker
 * would actually reach for, not a gloss; where a well-known English idiom has
 * no true counterpart (a frog in the throat is *avere la raucedine*, which is
 * no idiom at all) it is left out rather than matched with a near miss.
 */
const IT_IDIOMS = [
  {
    en: ['cost an arm and a leg', 'costs an arm and a leg', 'cost me an arm and a leg'],
    it: 'costare un occhio della testa',
    say: { en: 'it cost an arm and a leg', it: 'è costato un occhio della testa' },
    meaning: { en: 'to be extremely expensive', it: 'essere carissimo' },
  },
  {
    // The reply is "crepi!" (or "crepi il lupo!"), never "grazie", which is
    // supposed to bring bad luck — worth knowing before saying it to someone.
    en: ['break a leg'],
    it: 'in bocca al lupo!',
    say: { en: 'break a leg', it: 'in bocca al lupo!' },
    meaning: { en: 'good luck (answered with "crepi!")', it: 'buona fortuna (si risponde «crepi!»)' },
  },
  {
    en: ['test me', 'put me to the test'],
    it: 'mettere alla prova',
    say: { en: 'test me', it: 'mettimi alla prova' },
    meaning: { en: 'go on, try me', it: 'prova pure' },
  },
  {
    en: ['raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    it: 'piovere a catinelle',
    say: { en: "it's raining cats and dogs", it: 'piove a catinelle' },
    // For "sta piovendo …", which is how Italian says it is raining right now.
    progressive: { it: 'piovendo a catinelle' },
    meaning: { en: 'to rain very heavily', it: 'piovere moltissimo' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket'],
    it: 'tirare le cuoia',
    say: { en: 'to kick the bucket', it: 'tirare le cuoia' },
    meaning: { en: 'to die', it: 'morire' },
  },
  {
    en: ['piece of cake', 'as easy as pie'],
    it: 'un gioco da ragazzi',
    say: { en: 'a piece of cake', it: 'un gioco da ragazzi' },
    meaning: { en: 'very easy', it: 'facilissimo' },
  },
  {
    en: ['pull your leg', 'pull my leg', 'pulling my leg', 'pulling your leg', "pull someone's leg"],
    it: 'prendere in giro qualcuno',
    say: { en: 'to pull someone’s leg', it: 'prendere in giro qualcuno' },
    // "Mi stai prendendo in giro?" — the commonest way it is actually said.
    progressive: { it: 'prendendo in giro' },
    meaning: { en: 'to tease someone', it: 'scherzare alle spalle di qualcuno' },
  },
  {
    en: ['once in a blue moon'],
    it: 'ogni morte di papa',
    say: { en: 'once in a blue moon', it: 'ogni morte di papa' },
    meaning: { en: 'very rarely', it: 'rarissimamente' },
  },
  {
    en: ['kill two birds with one stone'],
    it: 'prendere due piccioni con una fava',
    say: { en: 'kill two birds with one stone', it: 'prendere due piccioni con una fava' },
    meaning: { en: 'to solve two problems at once', it: 'ottenere due risultati con un solo sforzo' },
  },
  {
    en: ['when pigs fly'],
    it: 'quando gli asini voleranno',
    say: { en: 'when pigs fly', it: 'quando gli asini voleranno' },
    meaning: { en: 'never', it: 'mai' },
  },
  {
    en: ['speak of the devil'],
    it: 'parli del diavolo e spuntano le corna',
    say: { en: 'speak of the devil', it: 'parli del diavolo e spuntano le corna' },
    meaning: { en: 'said when someone appears just as you mention them', it: 'si dice quando arriva la persona di cui si parlava' },
  },
  {
    en: ['the last straw', 'the final straw'],
    it: 'la goccia che fa traboccare il vaso',
    say: { en: 'the last straw', it: 'la goccia che fa traboccare il vaso' },
    meaning: { en: 'the small thing that finally makes it unbearable', it: 'il dettaglio che rende la situazione insopportabile' },
  },
  {
    en: ['spill the beans', 'spilled the beans'],
    it: 'vuotare il sacco',
    say: { en: 'to spill the beans', it: 'vuotare il sacco' },
    meaning: { en: 'to tell everything, to confess', it: 'confessare, dire tutto' },
  },
  {
    en: ['lump in my throat', 'a lump in my throat', 'lump in his throat', 'lump in her throat'],
    it: 'avere un nodo alla gola',
    say: { en: 'to have a lump in one’s throat', it: 'avere un nodo alla gola' },
    meaning: { en: 'to be choked with emotion', it: 'essere commosso al punto di non riuscire a parlare' },
  },
  {
    en: ['throw in the towel', 'threw in the towel'],
    it: 'gettare la spugna',
    say: { en: 'to throw in the towel', it: 'gettare la spugna' },
    meaning: { en: 'to give up', it: 'arrendersi' },
  },
  {
    en: ['lend a hand', 'give me a hand', 'give a hand'],
    it: 'dare una mano',
    say: { en: 'to lend a hand', it: 'dare una mano' },
    meaning: { en: 'to help', it: 'aiutare' },
  },
  {
    en: ['in the same boat'],
    it: 'essere sulla stessa barca',
    say: { en: 'to be in the same boat', it: 'essere sulla stessa barca' },
    meaning: { en: 'to be in the same difficult position', it: 'trovarsi nella stessa situazione' },
  },
  {
    en: ['hit the nail on the head'],
    it: 'cogliere nel segno',
    say: { en: 'hit the nail on the head', it: 'cogliere nel segno' },
    meaning: { en: 'to be exactly right', it: 'avere perfettamente ragione' },
  },
  {
    en: ["it's all greek to me", 'all greek to me'],
    it: 'per me è arabo',
    say: { en: "it's all Greek to me", it: 'per me è arabo' },
    meaning: { en: 'I cannot understand a word of it', it: 'non ci capisco niente' },
  },
  {
    en: ['sleep like a log', 'slept like a log'],
    it: 'dormire come un ghiro',
    say: { en: 'to sleep like a log', it: 'dormire come un ghiro' },
    meaning: { en: 'to sleep very deeply', it: 'dormire profondamente' },
  },
  {
    en: ['walking on eggshells', 'walk on eggshells'],
    it: 'camminare sulle uova',
    say: { en: 'to walk on eggshells', it: 'camminare sulle uova' },
    meaning: { en: 'to proceed very cautiously', it: 'procedere con molta cautela' },
  },
  {
    en: ['better late than never'],
    it: 'meglio tardi che mai',
    say: { en: 'better late than never', it: 'meglio tardi che mai' },
    meaning: { en: 'late is preferable to not at all', it: 'è meglio arrivare tardi che non arrivare' },
  },
  {
    en: ['easier said than done'],
    it: 'tra il dire e il fare c’è di mezzo il mare',
    say: { en: 'easier said than done', it: 'tra il dire e il fare c’è di mezzo il mare' },
    meaning: { en: 'harder to do than to describe', it: 'è più difficile farlo che dirlo' },
  },
  {
    en: ['head in the clouds'],
    it: 'avere la testa tra le nuvole',
    say: { en: 'to have your head in the clouds', it: 'avere la testa tra le nuvole' },
    meaning: { en: 'to be daydreaming', it: 'essere distratto' },
  },
  {
    en: ['a blessing in disguise'],
    it: 'non tutto il male vien per nuocere',
    say: { en: 'a blessing in disguise', it: 'non tutto il male vien per nuocere' },
    meaning: { en: 'a misfortune that turns out well', it: 'una sfortuna che porta qualcosa di buono' },
  },
  {
    en: ['out of the frying pan into the fire'],
    it: 'cadere dalla padella nella brace',
    say: { en: 'out of the frying pan into the fire', it: 'cadere dalla padella nella brace' },
    meaning: { en: 'to escape one trouble into a worse one', it: 'uscire da un guaio per finire in uno peggiore' },
  },
  {
    en: ['fed up', 'sick of it', 'had enough'],
    it: 'averne fin sopra i capelli',
    say: { en: 'to be fed up', it: 'averne fin sopra i capelli' },
    meaning: { en: 'to have had enough', it: 'non poterne più' },
  },
  {
    en: ['turn a blind eye'],
    it: 'chiudere un occhio',
    say: { en: 'to turn a blind eye', it: 'chiudere un occhio' },
    meaning: { en: 'to pretend not to notice', it: 'fingere di non vedere, essere indulgente' },
  },
  {
    en: ['be all ears', 'i am all ears', "i'm all ears"],
    it: 'essere tutt’orecchi',
    say: { en: 'to be all ears', it: 'essere tutt’orecchi' },
    meaning: { en: 'to be listening eagerly', it: 'ascoltare con grande attenzione' },
  },
  {
    en: ['not mince words', "doesn't mince words", 'mince words'],
    it: 'non avere peli sulla lingua',
    say: { en: 'to not mince words', it: 'non avere peli sulla lingua' },
    meaning: { en: 'to speak bluntly', it: 'parlare in modo schietto' },
  },
  {
    en: ['bite off more than you can chew', 'bit off more than'],
    it: 'fare il passo più lungo della gamba',
    say: { en: 'to bite off more than you can chew', it: 'fare il passo più lungo della gamba' },
    meaning: { en: 'to take on more than you can manage', it: 'impegnarsi oltre le proprie possibilità' },
  },
  {
    en: ['green thumb', 'green fingers'],
    it: 'avere il pollice verde',
    say: { en: 'to have a green thumb', it: 'avere il pollice verde' },
    meaning: { en: 'to be good with plants', it: 'saper curare le piante' },
  },
  {
    en: ['cry over spilt milk', 'crying over spilt milk', 'cry over spilled milk'],
    it: 'piangere sul latte versato',
    say: { en: 'to cry over spilt milk', it: 'piangere sul latte versato' },
    meaning: { en: 'to regret what cannot be undone', it: 'rammaricarsi di ciò che non si può più cambiare' },
  },
  {
    en: ['make a mountain out of a molehill'],
    it: 'fare di una mosca un elefante',
    say: { en: 'to make a mountain out of a molehill', it: 'fare di una mosca un elefante' },
    meaning: { en: 'to make far too much of something small', it: 'ingigantire una cosa da nulla' },
  },
  {
    en: ['long time no see'],
    it: 'chi non muore si rivede',
    say: { en: 'long time no see', it: 'chi non muore si rivede' },
    meaning: { en: "it's been a long time (said jokingly)", it: 'quanto tempo che non ci si vede (detto scherzosamente)' },
  },
  {
    // Not "crazy" or "nuts" alone, as in the other tables: the matcher looks
    // for substrings, and "nuts" is inside "donuts".
    en: ['mad as a hatter', 'stark raving mad'],
    it: 'essere matto da legare',
    say: { en: 'to be mad as a hatter', it: 'essere matto da legare' },
    meaning: { en: 'to be quite mad', it: 'essere completamente pazzo' },
  },
];

/**
 * Portuguese. European Portuguese throughout, as the site's Spanish is Spain's:
 * *chover a potes*, *acertar na mouche*, *estar com os azeites*. Each pairing is
 * an idiom a Portuguese speaker would actually reach for, not a gloss; where a
 * well-known English idiom has no true counterpart it is left out rather than
 * matched with a near miss.
 *
 * Two things shape the `say` forms beyond what the Italian table needed.
 *
 * Where the Portuguese idiom is *estar* or *ter* plus a complement (*estar com
 * os azeites*, *ter muita lata*), the English phrasings are complement-shaped
 * too (*in a foul mood*, *a lot of nerve*) and `say.pt` is just the complement,
 * so that the verb DeepL already wrote (*está*, *tens*, *acordou*) stays and
 * only the literal tail is swapped: "Ele está de mau humor" → "Ele está com os
 * azeites". A complement also survives inflection, which an infinitive does not,
 * so `alreadyIdiomatic` recognises *fala pelos cotovelos* as readily as *falar
 * pelos cotovelos*.
 *
 * The European progressive is *estar a* + infinitive ("está a chover a potes"),
 * so a `progressive` form opens with *a*. When the engine has already written
 * the *a* ("está a" + literal infinitive), the infinitive alone is what fits the
 * slot; see AUXILIARY.pt and the note on it in wantsProgressive.
 */
const PT_IDIOMS = [
  {
    en: ['cost an arm and a leg', 'costs an arm and a leg', 'cost me an arm and a leg'],
    pt: 'custar os olhos da cara',
    say: { en: 'it cost an arm and a leg', pt: 'custou os olhos da cara' },
    meaning: { en: 'to be extremely expensive', pt: 'ser caríssimo' },
  },
  {
    // What is said to an actor before the curtain goes up, in Portugal as in
    // Spain; "boa sorte" is the thing one does not say.
    en: ['break a leg'],
    pt: 'muita merda!',
    say: { en: 'break a leg', pt: 'muita merda!' },
    meaning: { en: 'good luck (said to a performer)', pt: 'boa sorte (a um ator, antes de entrar em cena)' },
  },
  {
    en: ['test me', 'put me to the test'],
    pt: 'pôr à prova',
    say: { en: 'test me', pt: 'põe-me à prova' },
    meaning: { en: 'go on, try me', pt: 'experimenta, a ver se consigo' },
  },
  {
    en: ['raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    pt: 'chover a potes',
    say: { en: "it's raining cats and dogs", pt: 'chove a potes' },
    // For "está a chover …", which is how Portugal says it is raining right now.
    progressive: { pt: 'a chover a potes' },
    meaning: { en: 'to rain very heavily', pt: 'chover muitíssimo' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket'],
    pt: 'bater as botas',
    say: { en: 'to kick the bucket', pt: 'bater as botas' },
    meaning: { en: 'to die', pt: 'morrer' },
  },
  {
    // With its article, so that "um pedaço de bolo" is swapped whole and the
    // sentence does not end up with two articles. Portugal's own word for it,
    // "é canja", is in the note rather than the table: "canja" is also just
    // chicken soup, and a one-word idiom would fire on every bowl of it.
    en: ['a piece of cake', 'as easy as pie'],
    pt: 'uma brincadeira de crianças',
    say: { en: 'a piece of cake', pt: 'uma brincadeira de crianças' },
    meaning: { en: 'very easy (in Portugal also "é canja")', pt: 'muito fácil (também se diz «é canja»)' },
  },
  {
    // "my leg" only: the Portuguese fuses the person in (com a minha cara, com a
    // tua cara), so one entry cannot cover every owner of the leg.
    en: ['pulling my leg', 'pull my leg', 'pulled my leg'],
    pt: 'gozar com a cara de alguém',
    say: { en: 'to pull my leg', pt: 'gozar com a minha cara' },
    progressive: { pt: 'a gozar com a minha cara' },
    meaning: { en: 'to tease me, to joke at my expense', pt: 'brincar comigo, fazer troça de mim' },
  },
  {
    en: ['once in a blue moon'],
    pt: 'quando o rei faz anos',
    say: { en: 'once in a blue moon', pt: 'quando o rei faz anos' },
    meaning: { en: 'very rarely', pt: 'muito raramente' },
  },
  {
    en: ['kill two birds with one stone'],
    pt: 'matar dois coelhos de uma cajadada',
    say: { en: 'kill two birds with one stone', pt: 'matar dois coelhos de uma cajadada' },
    meaning: { en: 'to solve two problems at once', pt: 'resolver duas coisas de uma só vez' },
  },
  {
    en: ['when pigs fly'],
    pt: 'quando as galinhas tiverem dentes',
    say: { en: 'when pigs fly', pt: 'quando as galinhas tiverem dentes' },
    meaning: { en: 'never', pt: 'nunca' },
  },
  {
    en: ['speak of the devil'],
    pt: 'falar no diabo',
    say: { en: 'speak of the devil', pt: 'fala-se no diabo' },
    meaning: { en: 'said when someone appears just as you mention them', pt: 'diz-se quando aparece a pessoa de quem se falava' },
  },
  {
    en: ['the last straw', 'the final straw'],
    pt: 'a gota de água que faz transbordar o copo',
    say: { en: 'the last straw', pt: 'a gota de água que faz transbordar o copo' },
    meaning: { en: 'the small thing that finally makes it unbearable', pt: 'o pormenor que torna a situação insuportável' },
  },
  {
    en: ['throw in the towel', 'threw in the towel'],
    pt: 'atirar a toalha ao chão',
    say: { en: 'to throw in the towel', pt: 'atirar a toalha ao chão' },
    meaning: { en: 'to give up', pt: 'desistir' },
  },
  {
    en: ['put my foot in it', 'put his foot in it', 'put her foot in it', 'put your foot in it', 'put my foot in my mouth'],
    pt: 'meter a pata na poça',
    say: { en: 'to put your foot in it', pt: 'meter a pata na poça' },
    meaning: { en: 'to say something tactless', pt: 'dizer uma coisa inoportuna, cometer uma gafe' },
  },
  {
    en: ['hit the nail on the head'],
    pt: 'acertar na mouche',
    say: { en: 'hit the nail on the head', pt: 'acertar na mouche' },
    meaning: { en: 'to be exactly right', pt: 'acertar em cheio' },
  },
  {
    // Clause for clause: "it's all greek to me" is a whole sentence, and so is
    // the Portuguese, so the swap keeps the verb count right.
    en: ["it's all greek to me", 'it is all greek to me', "that's all greek to me", 'this is all greek to me'],
    pt: 'para mim é chinês',
    say: { en: "it's all Greek to me", pt: 'para mim é chinês' },
    meaning: { en: 'I cannot understand a word of it', pt: 'não percebo nada daquilo' },
  },
  {
    en: ['walking on eggshells', 'walk on eggshells'],
    pt: 'andar a pisar ovos',
    say: { en: 'to walk on eggshells', pt: 'pisar ovos' },
    progressive: { pt: 'a pisar ovos' },
    meaning: { en: 'to proceed very cautiously', pt: 'agir com muita cautela' },
  },
  {
    en: ['make a mountain out of a molehill', 'making a mountain out of a molehill'],
    pt: 'fazer uma tempestade num copo de água',
    say: { en: 'to make a mountain out of a molehill', pt: 'fazer uma tempestade num copo de água' },
    progressive: { pt: 'a fazer uma tempestade num copo de água' },
    meaning: { en: 'to make far too much of something small', pt: 'exagerar uma coisa sem importância' },
  },
  {
    // Adverbial for adverbial: "ela fala dezanove à dúzia" → "ela fala pelos
    // cotovelos", with DeepL's own verb left standing.
    en: ['nineteen to the dozen', 'ten to the dozen'],
    pt: 'falar pelos cotovelos',
    say: { en: 'nineteen to the dozen', pt: 'pelos cotovelos' },
    meaning: { en: 'talking a great deal, without stopping (falar pelos cotovelos)', pt: 'falar muito, sem parar' },
  },
  {
    en: ["you've got a lot of nerve", 'you have a lot of nerve', "you've got some nerve", 'you have some nerve',
      "you've got a nerve", 'you have a nerve'],
    pt: 'ter muita lata',
    say: { en: "you've got a lot of nerve", pt: 'tens muita lata' },
    meaning: { en: 'what a cheek, how dare you', pt: 'que descaramento, que atrevimento' },
  },
  {
    en: ['in a foul mood'],
    pt: 'estar com os azeites',
    say: { en: 'in a foul mood', pt: 'com os azeites' },
    meaning: { en: 'in a bad temper, irritable (estar com os azeites)', pt: 'mal-disposto, irritado' },
  },
  {
    en: ['on the wrong side of the bed', 'on the wrong side of bed'],
    pt: 'acordar com os pés de fora',
    say: { en: 'on the wrong side of the bed', pt: 'com os pés de fora' },
    meaning: { en: 'in a bad mood from the moment of waking (acordar com os pés de fora)', pt: 'de mau humor desde que acordou' },
  },
  {
    en: ['rest on your laurels', 'rest on my laurels', 'rest on his laurels', 'rest on her laurels',
      'rest on our laurels', 'rest on their laurels'],
    pt: 'ficar à sombra da bananeira',
    say: { en: 'to rest on your laurels', pt: 'ficar à sombra da bananeira' },
    meaning: { en: 'to sit back and stop making an effort', pt: 'deixar de se esforçar, confiando no que já se conseguiu' },
  },
  {
    // "Ficou a ver navios", "deixaram-no a ver navios": the complement fits
    // after whichever verb the engine chose.
    en: ['high and dry'],
    pt: 'ficar a ver navios',
    say: { en: 'high and dry', pt: 'a ver navios' },
    meaning: { en: 'left with nothing, let down (ficar a ver navios)', pt: 'sem aquilo que se esperava, desamparado' },
  },
  {
    en: ['spill the beans', 'spilled the beans', 'spilt the beans', 'let the cat out of the bag'],
    pt: 'dar com a língua nos dentes',
    say: { en: 'to spill the beans', pt: 'dar com a língua nos dentes' },
    meaning: { en: 'to give away a secret', pt: 'revelar um segredo' },
  },
  {
    en: ['not mince words', "doesn't mince words", "don't mince words", 'mince words'],
    pt: 'não ter papas na língua',
    say: { en: 'to not mince words', pt: 'não ter papas na língua' },
    meaning: { en: 'to speak bluntly', pt: 'falar com toda a franqueza' },
  },
  {
    en: ['turn a blind eye', 'turned a blind eye', 'turns a blind eye'],
    pt: 'fazer vista grossa',
    say: { en: 'to turn a blind eye', pt: 'fazer vista grossa' },
    meaning: { en: 'to pretend not to notice', pt: 'fingir que não se vê' },
  },
  {
    en: ['turn a deaf ear', 'turned a deaf ear', 'turns a deaf ear'],
    pt: 'fazer ouvidos de mercador',
    say: { en: 'to turn a deaf ear', pt: 'fazer ouvidos de mercador' },
    meaning: { en: 'to refuse to listen', pt: 'fingir que não se ouve' },
  },
  {
    en: ['i smell a rat', 'something smells fishy'],
    pt: 'cheirar a esturro',
    say: { en: 'I smell a rat', pt: 'cheira-me a esturro' },
    meaning: { en: 'something about this is suspicious', pt: 'há aqui qualquer coisa suspeita' },
  },
  {
    en: ['in a pickle', 'in a tight spot'],
    pt: 'estar em maus lençóis',
    say: { en: 'in a pickle', pt: 'em maus lençóis' },
    meaning: { en: 'in a difficult situation (estar em maus lençóis)', pt: 'numa situação difícil' },
  },
  {
    en: ['hit the roof', 'hit the ceiling', 'fly off the handle', 'flew off the handle'],
    pt: 'ir aos arames',
    say: { en: 'to hit the roof', pt: 'ir aos arames' },
    meaning: { en: 'to lose your temper completely', pt: 'perder a cabeça, enfurecer-se' },
  },
  {
    en: ["don't hold your breath", 'do not hold your breath'],
    pt: 'tirar o cavalinho da chuva',
    say: { en: "don't hold your breath", pt: 'tira o cavalinho da chuva' },
    meaning: { en: 'give up hoping for it, it is not going to happen', pt: 'desiste dessa ideia, isso não vai acontecer' },
  },
  {
    en: ['once bitten, twice shy'],
    pt: 'gato escaldado de água fria tem medo',
    say: { en: 'once bitten, twice shy', pt: 'gato escaldado de água fria tem medo' },
    meaning: { en: 'a bad experience makes you wary ever after', pt: 'quem já se queimou uma vez passa a ter cuidado' },
  },
  {
    en: ["i couldn't care less", 'i could not care less'],
    pt: 'estar-se nas tintas',
    say: { en: "I couldn't care less", pt: 'estou-me nas tintas' },
    meaning: { en: 'it is all the same to me, I do not care', pt: 'não quero saber, é-me indiferente' },
  },
  {
    en: ['the grass is always greener on the other side of the fence', 'the grass is always greener on the other side',
      'the grass is always greener'],
    pt: 'a galinha da vizinha é sempre melhor do que a minha',
    say: { en: 'the grass is always greener on the other side', pt: 'a galinha da vizinha é sempre melhor do que a minha' },
    meaning: { en: "other people's lot always looks better than your own", pt: 'o que os outros têm parece sempre melhor do que o nosso' },
  },
];

/**
 * German. As with the other three tables, each pairing is an idiom a German
 * speaker would actually reach for, not a gloss; where a well-known English
 * idiom has no true counterpart it is left out rather than matched with a
 * near miss.
 *
 * `core` is the part of the idiom that never moves or inflects. German puts
 * the verb second in a main clause and last in a subordinate clause or an
 * infinitive, so "everything after the first word" and "the last two words"
 * of the citation form both miss *das kostete ein Vermögen* and *weil es ein
 * Vermögen kostet*. The core is matched instead (see idiomSignature).
 */
const DE_IDIOMS = [
  {
    en: ['cost an arm and a leg', 'costs an arm and a leg', 'cost me an arm and a leg'],
    de: 'ein Vermögen kosten',
    say: { en: 'it cost an arm and a leg', de: 'es hat ein Vermögen gekostet' },
    core: 'ein vermögen',
    meaning: { en: 'to be extremely expensive', de: 'sehr teuer sein' },
  },
  {
    // Said to a performer before going on, like "break a leg"; the reply is
    // "danke" or nothing, there is no superstition against thanking.
    en: ['break a leg'],
    de: 'Hals- und Beinbruch!',
    say: { en: 'break a leg', de: 'Hals- und Beinbruch!' },
    core: 'hals und beinbruch',
    meaning: { en: 'good luck (said to a performer)', de: 'viel Glück (zu jemandem vor einem Auftritt)' },
  },
  {
    en: ['raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    de: 'in Strömen regnen',
    say: { en: "it's raining cats and dogs", de: 'es regnet in Strömen' },
    core: 'in strömen',
    meaning: { en: 'to rain very heavily', de: 'sehr stark regnen' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket'],
    de: 'den Löffel abgeben',
    say: { en: 'to kick the bucket', de: 'den Löffel abgeben' },
    core: 'den löffel',
    meaning: { en: 'to die', de: 'sterben' },
  },
  {
    en: ['piece of cake', 'as easy as pie'],
    de: 'ein Kinderspiel',
    say: { en: 'a piece of cake', de: 'ein Kinderspiel' },
    core: 'kinderspiel',
    meaning: { en: 'very easy', de: 'sehr leicht' },
  },
  {
    en: ['pull your leg', 'pull my leg', 'pulling my leg', 'pulling your leg', "pull someone's leg"],
    de: 'jemanden auf den Arm nehmen',
    say: { en: 'to pull someone’s leg', de: 'jemanden auf den Arm nehmen' },
    core: 'auf den arm',
    meaning: { en: 'to tease someone', de: 'jemanden zum Spaß hereinlegen' },
  },
  {
    en: ['once in a blue moon'],
    de: 'alle Jubeljahre',
    say: { en: 'once in a blue moon', de: 'alle Jubeljahre' },
    core: 'alle jubeljahre',
    meaning: { en: 'very rarely', de: 'sehr selten' },
  },
  {
    en: ['kill two birds with one stone'],
    de: 'zwei Fliegen mit einer Klappe schlagen',
    say: { en: 'kill two birds with one stone', de: 'zwei Fliegen mit einer Klappe schlagen' },
    core: 'zwei fliegen mit einer klappe',
    meaning: { en: 'to solve two problems at once', de: 'zwei Dinge auf einmal erledigen' },
  },
  {
    en: ['speak of the devil'],
    de: 'wenn man vom Teufel spricht',
    say: { en: 'speak of the devil', de: 'wenn man vom Teufel spricht' },
    core: 'vom teufel',
    meaning: { en: 'said when someone appears just as you mention them', de: 'sagt man, wenn jemand auftaucht, von dem gerade die Rede war' },
  },
  {
    en: ['hit the nail on the head'],
    de: 'den Nagel auf den Kopf treffen',
    say: { en: 'hit the nail on the head', de: 'den Nagel auf den Kopf treffen' },
    core: 'nagel auf den kopf',
    meaning: { en: 'to be exactly right', de: 'genau das Richtige sagen' },
  },
  {
    en: ['the last straw', 'the final straw'],
    de: 'das Fass zum Überlaufen bringen',
    say: { en: 'the last straw', de: 'das bringt das Fass zum Überlaufen' },
    core: 'fass zum überlaufen',
    meaning: { en: 'the small thing that finally makes it unbearable', de: 'die Kleinigkeit, die alles unerträglich macht' },
  },
  {
    en: ['let the cat out of the bag', 'spill the beans', 'spilled the beans'],
    de: 'die Katze aus dem Sack lassen',
    say: { en: 'to let the cat out of the bag', de: 'die Katze aus dem Sack lassen' },
    core: 'katze aus dem sack',
    meaning: { en: 'to give away a secret', de: 'ein Geheimnis verraten' },
  },
  {
    en: ['throw in the towel', 'threw in the towel'],
    de: 'das Handtuch werfen',
    say: { en: 'to throw in the towel', de: 'das Handtuch werfen' },
    core: 'das handtuch',
    meaning: { en: 'to give up', de: 'aufgeben' },
  },
  {
    en: ['put my foot in it', 'put his foot in it', 'put your foot in it', 'put her foot in it'],
    de: 'ins Fettnäpfchen treten',
    say: { en: 'to put your foot in it', de: 'ins Fettnäpfchen treten' },
    core: 'ins fettnäpfchen',
    meaning: { en: 'to say something tactless', de: 'etwas Taktloses sagen' },
  },
  {
    en: ['head in the clouds'],
    de: 'den Kopf in den Wolken haben',
    say: { en: 'to have your head in the clouds', de: 'den Kopf in den Wolken haben' },
    core: 'kopf in den wolken',
    meaning: { en: 'to be daydreaming', de: 'verträumt und unaufmerksam sein' },
  },
  {
    en: ['better late than never'],
    de: 'besser spät als nie',
    say: { en: 'better late than never', de: 'besser spät als nie' },
    core: 'spät als nie',
    meaning: { en: 'late is preferable to not at all', de: 'lieber zu spät als gar nicht' },
  },
  {
    en: ['easier said than done'],
    de: 'leichter gesagt als getan',
    say: { en: 'easier said than done', de: 'leichter gesagt als getan' },
    core: 'gesagt als getan',
    meaning: { en: 'harder to do than to describe', de: 'schwerer zu tun, als es klingt' },
  },
  {
    en: ['fed up', 'sick of it', 'had enough'],
    de: 'die Nase voll haben',
    say: { en: 'to be fed up', de: 'die Nase voll haben' },
    core: 'die nase voll',
    meaning: { en: 'to have had enough', de: 'etwas satthaben' },
  },
  {
    en: ['be all ears', 'i am all ears', "i'm all ears"],
    de: 'ganz Ohr sein',
    say: { en: 'to be all ears', de: 'ich bin ganz Ohr' },
    core: 'ganz ohr',
    meaning: { en: 'to be listening eagerly', de: 'sehr aufmerksam zuhören' },
  },
  {
    en: ['thick as thieves'],
    de: 'wie Pech und Schwefel zusammenhalten',
    say: { en: 'to be thick as thieves', de: 'wie Pech und Schwefel zusammenhalten' },
    core: 'pech und schwefel',
    meaning: { en: 'to be extremely close', de: 'unzertrennlich sein' },
  },
  {
    en: ['not mince words', "doesn't mince words", 'mince words'],
    de: 'kein Blatt vor den Mund nehmen',
    say: { en: 'to not mince words', de: 'kein Blatt vor den Mund nehmen' },
    core: 'blatt vor den mund',
    meaning: { en: 'to speak bluntly', de: 'offen und direkt reden' },
  },
  {
    en: ["it's all greek to me", 'all greek to me'],
    de: 'nur Bahnhof verstehen',
    say: { en: "it's all Greek to me", de: 'ich verstehe nur Bahnhof' },
    core: 'nur bahnhof',
    meaning: { en: 'I cannot understand a word of it', de: 'ich verstehe gar nichts' },
  },
  {
    en: ['sleep like a log', 'slept like a log'],
    de: 'schlafen wie ein Murmeltier',
    say: { en: 'to sleep like a log', de: 'schlafen wie ein Murmeltier' },
    core: 'wie ein murmeltier',
    meaning: { en: 'to sleep very deeply', de: 'sehr tief schlafen' },
  },
  {
    en: ['green thumb', 'green fingers'],
    de: 'einen grünen Daumen haben',
    say: { en: 'to have a green thumb', de: 'einen grünen Daumen haben' },
    core: 'grünen daumen',
    meaning: { en: 'to be good with plants', de: 'gut mit Pflanzen umgehen können' },
  },
  {
    en: ['make a mountain out of a molehill'],
    de: 'aus einer Mücke einen Elefanten machen',
    say: { en: 'to make a mountain out of a molehill', de: 'aus einer Mücke einen Elefanten machen' },
    core: 'aus einer mücke',
    meaning: { en: 'to make far too much of something small', de: 'eine Kleinigkeit maßlos aufbauschen' },
  },
  {
    en: ['not my cup of tea'],
    de: 'nicht mein Bier',
    say: { en: "it's not my cup of tea", de: 'das ist nicht mein Bier' },
    core: 'mein bier',
    meaning: { en: 'not something I like or care about', de: 'nichts, was mich interessiert oder angeht' },
  },
  {
    en: ["can't see the wood for the trees", "can't see the forest for the trees", 'see the wood for the trees', 'see the forest for the trees'],
    de: 'den Wald vor lauter Bäumen nicht sehen',
    say: { en: "to not see the wood for the trees", de: 'den Wald vor lauter Bäumen nicht sehen' },
    core: 'wald vor lauter bäumen',
    meaning: { en: 'to miss the whole for the details', de: 'vor lauter Einzelheiten das Ganze nicht erkennen' },
  },
  {
    en: ['fingers crossed', 'keep my fingers crossed', 'keep your fingers crossed', 'cross my fingers', 'cross your fingers'],
    de: 'die Daumen drücken',
    say: { en: 'to keep your fingers crossed', de: 'ich drücke dir die Daumen' },
    core: 'die daumen',
    meaning: { en: 'to wish someone luck', de: 'jemandem Glück wünschen' },
  },
  {
    en: ['a blessing in disguise'],
    de: 'Glück im Unglück',
    say: { en: 'a blessing in disguise', de: 'Glück im Unglück' },
    core: 'glück im unglück',
    meaning: { en: 'a misfortune that turns out well', de: 'ein Unglück, das noch glimpflich ausgeht' },
  },
  {
    en: ['out of the frying pan into the fire'],
    de: 'vom Regen in die Traufe kommen',
    say: { en: 'out of the frying pan into the fire', de: 'vom Regen in die Traufe' },
    core: 'regen in die traufe',
    meaning: { en: 'to escape one trouble into a worse one', de: 'aus einer schlechten Lage in eine schlimmere geraten' },
  },
  {
    en: ['in the same boat'],
    de: 'im selben Boot sitzen',
    say: { en: 'to be in the same boat', de: 'im selben Boot sitzen' },
    core: 'selben boot',
    meaning: { en: 'to be in the same difficult position', de: 'in derselben schwierigen Lage sein' },
  },
  {
    en: ['have a frog in my throat', 'a frog in my throat', 'frog in his throat', 'frog in her throat'],
    de: 'einen Frosch im Hals haben',
    say: { en: 'to have a frog in one’s throat', de: 'einen Frosch im Hals haben' },
    core: 'frosch im hals',
    meaning: { en: 'to be hoarse', de: 'heiser sein' },
  },
  {
    en: ['like a bull in a china shop', 'a bull in a china shop'],
    de: 'wie ein Elefant im Porzellanladen',
    say: { en: 'like a bull in a china shop', de: 'wie ein Elefant im Porzellanladen' },
    core: 'elefant im porzellanladen',
    meaning: { en: 'clumsy and tactless', de: 'ungeschickt und taktlos' },
  },
  {
    en: ['bury your head in the sand', 'bury my head in the sand', 'bury his head in the sand', 'head in the sand'],
    de: 'den Kopf in den Sand stecken',
    say: { en: 'to bury your head in the sand', de: 'den Kopf in den Sand stecken' },
    core: 'in den sand',
    meaning: { en: 'to refuse to face a problem', de: 'ein Problem nicht wahrhaben wollen' },
  },
];

/**
 * Dutch. Like the other three, each pairing is an idiom a Dutch speaker would
 * actually reach for, not a gloss; where a well-known English idiom has no
 * true counterpart (once in a blue moon is *hoogst zelden*, which is no idiom
 * at all) it is left out rather than matched with a near miss.
 *
 * Dutch puts the verb second in a main clause and last in a subordinate
 * clause or an infinitive, so the citation form's word order is not the word
 * order of a sentence (*een rib uit je lijf kosten*, but *dat kost een rib
 * uit je lijf*). Each entry therefore carries `core`: the run of words that
 * stays put and never inflects, which is what alreadyIdiomatic should look
 * for instead of the Romance "everything after the first word" and "last two
 * words" signatures. Possessives and particles that move (*je lijf* / *mijn
 * lijf*, *op zijn kop* / *op de kop*) are kept out of it.
 */
const NL_IDIOMS = [
  {
    en: ['it cost me an arm and a leg', 'it cost an arm and a leg', 'cost me an arm and a leg', 'cost an arm and a leg', 'costs an arm and a leg'],
    nl: 'een rib uit je lijf kosten',
    say: { en: 'it cost an arm and a leg', nl: 'het kostte een rib uit mijn lijf' },
    core: 'een rib uit',
    meaning: { en: 'to be extremely expensive', nl: 'heel erg duur zijn' },
  },
  {
    // What Dutch performers wish each other; "succes" is for everyone else.
    en: ['break a leg'],
    nl: 'toi, toi, toi!',
    say: { en: 'break a leg', nl: 'toi, toi, toi!' },
    core: 'toi toi toi',
    meaning: { en: 'good luck (said to a performer)', nl: 'succes (tegen iemand die gaat optreden)' },
  },
  {
    en: ["it's raining cats and dogs", 'it is raining cats and dogs', 'raining cats and dogs', 'rain cats and dogs', 'rains cats and dogs'],
    nl: 'pijpenstelen regenen',
    say: { en: "it's raining cats and dogs", nl: 'het regent pijpenstelen' },
    core: 'pijpenstelen',
    meaning: { en: 'to rain very heavily', nl: 'heel hard regenen' },
  },
  {
    en: ['kick the bucket', 'kicked the bucket', 'kicks the bucket'],
    nl: 'het loodje leggen',
    say: { en: 'to kick the bucket', nl: 'het loodje leggen' },
    core: 'het loodje',
    meaning: { en: 'to die', nl: 'doodgaan' },
  },
  {
    en: ['a piece of cake', 'piece of cake', 'as easy as pie', 'easy as pie'],
    nl: 'een fluitje van een cent',
    say: { en: 'a piece of cake', nl: 'een fluitje van een cent' },
    core: 'fluitje van een cent',
    meaning: { en: 'very easy', nl: 'heel makkelijk' },
  },
  {
    en: ['pull your leg', 'pull my leg', 'pulling my leg', 'pulling your leg', "pull someone's leg", 'pulled my leg'],
    nl: 'iemand in de maling nemen',
    say: { en: 'to pull someone’s leg', nl: 'iemand in de maling nemen' },
    core: 'in de maling',
    meaning: { en: 'to tease someone', nl: 'iemand voor de gek houden' },
  },
  {
    en: ['kill two birds with one stone', 'killed two birds with one stone', 'kills two birds with one stone'],
    nl: 'twee vliegen in één klap slaan',
    say: { en: 'kill two birds with one stone', nl: 'twee vliegen in één klap slaan' },
    core: 'twee vliegen in één klap',
    meaning: { en: 'to solve two problems at once', nl: 'twee dingen tegelijk voor elkaar krijgen' },
  },
  {
    en: ['when pigs fly'],
    nl: 'als Pasen en Pinksteren op één dag vallen',
    say: { en: 'when pigs fly', nl: 'als Pasen en Pinksteren op één dag vallen' },
    core: 'pasen en pinksteren op één dag',
    meaning: { en: 'never', nl: 'nooit' },
  },
  {
    en: ['speak of the devil', 'talk of the devil'],
    nl: 'als je over de duivel spreekt, trap je op zijn staart',
    say: { en: 'speak of the devil', nl: 'als je over de duivel spreekt' },
    core: 'de duivel',
    meaning: { en: 'said when someone appears just as you mention them', nl: 'gezegd als iemand binnenkomt over wie je het net had' },
  },
  {
    en: ['hit the nail on the head', 'hits the nail on the head', 'hit the nail right on the head'],
    nl: 'de spijker op zijn kop slaan',
    say: { en: 'hit the nail on the head', nl: 'de spijker op zijn kop slaan' },
    core: 'de spijker op',
    meaning: { en: 'to be exactly right', nl: 'precies het juiste zeggen' },
  },
  {
    en: ['the last straw', 'the final straw', "the straw that broke the camel's back"],
    nl: 'de druppel die de emmer doet overlopen',
    say: { en: 'the last straw', nl: 'de druppel die de emmer doet overlopen' },
    core: 'druppel',
    meaning: { en: 'the small thing that finally makes it unbearable', nl: 'het laatste kleine ding dat de maat vol maakt' },
  },
  {
    en: ['spill the beans', 'spilled the beans', 'spilt the beans', 'let the cat out of the bag'],
    nl: 'uit de school klappen',
    say: { en: 'to spill the beans', nl: 'uit de school klappen' },
    core: 'uit de school',
    meaning: { en: 'to give away a secret', nl: 'iets vertellen wat geheim had moeten blijven' },
  },
  {
    en: ['a lump in my throat', 'lump in my throat', 'lump in his throat', 'lump in her throat', 'a lump in the throat'],
    nl: 'een brok in je keel hebben',
    say: { en: 'to have a lump in one’s throat', nl: 'een brok in je keel hebben' },
    core: 'een brok in',
    meaning: { en: 'to be choked with emotion', nl: 'zo ontroerd zijn dat je bijna niet kunt praten' },
  },
  {
    en: ['throw in the towel', 'threw in the towel', 'throws in the towel'],
    nl: 'de handdoek in de ring gooien',
    say: { en: 'to throw in the towel', nl: 'de handdoek in de ring gooien' },
    core: 'handdoek in de ring',
    meaning: { en: 'to give up', nl: 'opgeven' },
  },
  {
    en: ['in the same boat'],
    nl: 'in hetzelfde schuitje zitten',
    say: { en: 'to be in the same boat', nl: 'in hetzelfde schuitje zitten' },
    core: 'in hetzelfde schuitje',
    meaning: { en: 'to be in the same difficult position', nl: 'in dezelfde lastige situatie zitten' },
  },
  {
    en: ["it's all greek to me", 'all greek to me', "it's greek to me"],
    nl: 'dat is abracadabra voor mij',
    say: { en: "it's all Greek to me", nl: 'dat is abracadabra voor mij' },
    core: 'abracadabra',
    meaning: { en: 'I cannot understand a word of it', nl: 'ik begrijp er niets van' },
  },
  {
    en: ['sleep like a log', 'slept like a log', 'sleeping like a log', 'sleeps like a log'],
    nl: 'slapen als een blok',
    say: { en: 'to sleep like a log', nl: 'slapen als een blok' },
    core: 'als een blok',
    meaning: { en: 'to sleep very deeply', nl: 'heel vast slapen' },
  },
  {
    en: ['walking on eggshells', 'walk on eggshells', 'walks on eggshells', 'walked on eggshells'],
    nl: 'op eieren lopen',
    say: { en: 'to walk on eggshells', nl: 'op eieren lopen' },
    core: 'op eieren',
    meaning: { en: 'to proceed very cautiously', nl: 'heel voorzichtig te werk gaan' },
  },
  {
    en: ['head in the clouds'],
    nl: 'met je hoofd in de wolken lopen',
    say: { en: 'to have your head in the clouds', nl: 'met je hoofd in de wolken lopen' },
    core: 'hoofd in de wolken',
    meaning: { en: 'to be daydreaming', nl: 'er met je gedachten niet bij zijn' },
  },
  {
    en: ['out of the frying pan into the fire', 'out of the frying pan and into the fire'],
    nl: 'van de regen in de drup komen',
    say: { en: 'out of the frying pan into the fire', nl: 'van de regen in de drup' },
    core: 'van de regen in de drup',
    meaning: { en: 'to escape one trouble into a worse one', nl: 'van het ene probleem in een erger probleem terechtkomen' },
  },
  {
    en: ['turn a blind eye', 'turned a blind eye', 'turns a blind eye'],
    nl: 'een oogje dichtknijpen',
    say: { en: 'to turn a blind eye', nl: 'een oogje dichtknijpen' },
    core: 'een oogje',
    meaning: { en: 'to pretend not to notice', nl: 'doen alsof je iets niet ziet' },
  },
  {
    en: ['be all ears', 'i am all ears', "i'm all ears", 'all ears'],
    nl: 'een en al oor zijn',
    say: { en: 'to be all ears', nl: 'een en al oor zijn' },
    core: 'een en al oor',
    meaning: { en: 'to be listening eagerly', nl: 'heel aandachtig luisteren' },
  },
  {
    en: ['not mince words', "doesn't mince words", "don't mince words", 'mince words', 'not mince my words'],
    nl: 'geen blad voor de mond nemen',
    say: { en: 'to not mince words', nl: 'geen blad voor de mond nemen' },
    core: 'blad voor de mond',
    meaning: { en: 'to speak bluntly', nl: 'zeggen wat je denkt, zonder omwegen' },
  },
  {
    en: ['bite off more than you can chew', 'bite off more than i can chew', 'bit off more than', 'bitten off more than'],
    nl: 'te veel hooi op je vork nemen',
    say: { en: 'to bite off more than you can chew', nl: 'te veel hooi op je vork nemen' },
    core: 'te veel hooi op',
    meaning: { en: 'to take on more than you can manage', nl: 'meer op je nemen dan je aankunt' },
  },
  {
    en: ['green thumb', 'green fingers', 'a green thumb'],
    nl: 'groene vingers hebben',
    say: { en: 'to have green fingers', nl: 'groene vingers hebben' },
    core: 'groene vingers',
    meaning: { en: 'to be good with plants', nl: 'goed met planten kunnen omgaan' },
  },
  {
    en: ['make a mountain out of a molehill', 'making a mountain out of a molehill', 'made a mountain out of a molehill'],
    nl: 'van een mug een olifant maken',
    say: { en: 'to make a mountain out of a molehill', nl: 'van een mug een olifant maken' },
    core: 'van een mug een olifant',
    meaning: { en: 'to make far too much of something small', nl: 'iets kleins veel te groot maken' },
  },
  {
    en: ['beat around the bush', 'beat about the bush', 'beating around the bush', 'beating about the bush'],
    nl: 'om de hete brij heen draaien',
    say: { en: 'to beat around the bush', nl: 'om de hete brij heen draaien' },
    core: 'de hete brij',
    meaning: { en: 'to avoid saying what you mean', nl: 'niet zeggen waar het echt om gaat' },
  },
  {
    en: ['the cat is out of the bag', "the cat's out of the bag", 'now the truth comes out', 'the truth comes out', 'the truth is out'],
    nl: 'nu komt de aap uit de mouw',
    say: { en: 'the cat is out of the bag', nl: 'nu komt de aap uit de mouw' },
    core: 'uit de mouw',
    meaning: { en: 'the real intention or the truth has come to light', nl: 'nu blijkt hoe het echt zit' },
  },
  {
    en: ['see which way the wind blows', 'see which way the wind is blowing', 'see which way the cat jumps', 'wait and see which way the wind blows'],
    nl: 'de kat uit de boom kijken',
    say: { en: 'to see which way the wind blows', nl: 'de kat uit de boom kijken' },
    core: 'de kat uit de boom',
    meaning: { en: 'to wait and see before committing yourself', nl: 'eerst afwachten hoe iets loopt voordat je iets doet' },
  },
  {
    en: ['cut to the chase', 'get straight to the point', 'come straight to the point', 'got straight to the point'],
    nl: 'met de deur in huis vallen',
    say: { en: 'to get straight to the point', nl: 'met de deur in huis vallen' },
    core: 'met de deur in huis',
    meaning: { en: 'to say what you came to say without any preamble', nl: 'zonder inleiding meteen zeggen waar het om gaat' },
  },
  {
    en: ['a storm in a teacup', 'storm in a teacup', 'a tempest in a teapot', 'tempest in a teapot'],
    nl: 'een storm in een glas water',
    say: { en: 'a storm in a teacup', nl: 'een storm in een glas water' },
    core: 'storm in een glas water',
    meaning: { en: 'a great fuss about something trivial', nl: 'veel drukte om iets onbelangrijks' },
  },
  {
    en: ['a bone to pick with', 'bone to pick with', 'a bone to pick'],
    nl: 'een appeltje met iemand te schillen hebben',
    say: { en: 'to have a bone to pick with someone', nl: 'een appeltje met iemand te schillen hebben' },
    core: 'een appeltje',
    meaning: { en: 'to have a grievance to settle with someone', nl: 'iemand ergens over moeten aanspreken' },
  },
  {
    en: ['add fuel to the fire', 'adding fuel to the fire', 'added fuel to the fire', 'fuel to the fire'],
    nl: 'olie op het vuur gooien',
    say: { en: 'to add fuel to the fire', nl: 'olie op het vuur gooien' },
    core: 'olie op het vuur',
    meaning: { en: 'to make a bad situation worse', nl: 'een conflict nog erger maken' },
  },
  {
    en: ['a skeleton in the closet', 'skeletons in the closet', 'skeleton in the cupboard', 'skeletons in the cupboard'],
    nl: 'een lijk in de kast hebben',
    say: { en: 'to have a skeleton in the closet', nl: 'een lijk in de kast hebben' },
    core: 'lijk in de kast',
    meaning: { en: 'to have an embarrassing secret from the past', nl: 'een pijnlijk geheim uit het verleden hebben' },
  },
  {
    en: ['make ends meet', 'making ends meet', 'made ends meet'],
    nl: 'de eindjes aan elkaar knopen',
    say: { en: 'to make ends meet', nl: 'de eindjes aan elkaar knopen' },
    core: 'de eindjes',
    meaning: { en: 'to get by on the money you have', nl: 'rondkomen met weinig geld' },
  },
];

const TABLES = {
  es: ES_IDIOMS, fr: FR_IDIOMS, it: IT_IDIOMS, de: DE_IDIOMS, nl: NL_IDIOMS, pt: PT_IDIOMS,
};

// ß is not a letter NFD can take apart, and a student types ss for it anyway.
const fold = (text) => String(text).toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/['’]/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Longest phrasings first, so "cost me an arm and a leg" beats "cost an arm
 * and a leg". An entry's `core` (below) is indexed too, so a Dutch sentence
 * with the idiom conjugated still gets its note; a hit on the core alone is
 * marked, because a fragment is nothing to paste a translation over.
 */
function buildIndex(table, study) {
  return table.flatMap((entry) => [
    ...entry.en.map((phrase) => ({ phrase, from: 'en', entry })),
    { phrase: entry[study], from: study, entry },
    { phrase: entry.say[study], from: study, entry },
    ...(entry.core ? [{ phrase: entry.core, from: study, entry, noteOnly: true }] : []),
  ]).map((item) => ({ ...item, folded: fold(item.phrase) }))
    .sort((a, b) => b.folded.length - a.folded.length);
}

const INDEXES = Object.fromEntries(
  Object.entries(TABLES).map(([study, table]) => [study, buildIndex(table, study)]),
);

/**
 * Idioms present in the text, written in `from`.
 *
 * The table is chosen by whichever end of the pair is not English — the site is
 * always translating between English and the language it is about.
 * @returns {Array<{phrase: string, say: string, meaning: object, source: string}>}
 */
export function findIdioms(text, from, to) {
  const study = from === 'en' ? to : from;
  const index = INDEXES[study];
  if (!index) return [];

  const haystack = fold(text);
  const found = [];
  const seen = new Set();

  for (const item of index) {
    if (item.from !== from) continue;
    if (seen.has(item.entry)) continue;
    if (!haystack.includes(item.folded)) continue;

    seen.add(item.entry);
    found.push({
      phrase: item.phrase,
      say: item.entry.say[to],
      progressive: item.entry.progressive?.[to] ?? null,
      meaning: item.entry.meaning,
      source: item.entry.say[from],
      core: item.entry.core ?? null,
      noteOnly: Boolean(item.noteOnly),
      // The citation form in the target language, for substitute(): a German
      // idiom that opens with a noun keeps its capital wherever it lands.
      citation: item.entry[to] ?? null,
    });
    if (found.length >= 2) break;
  }

  return found;
}

/**
 * The part of an idiom that does not inflect — its giveaway.
 *
 * The stored form is a citation: *llueve a cántaros*, third person present. A
 * translator that renders the idiom correctly in some other form — *está
 * lloviendo a cántaros* — has got it right, and swapping the citation form in
 * would produce "está llueve a cántaros". So what is compared is everything
 * after the verb, which is the half that stays put.
 *
 * Two-word idioms keep both words, since dropping the first would leave
 * something far too common to match on: *pan comido* would become *comido*.
 */
export function idiomSignature(phrase) {
  const words = fold(phrase).split(' ').filter(Boolean);
  if (words.length < 3) return [words.join(' ')].filter(Boolean);

  // Two readings of "the part that does not inflect", because one is not
  // enough. Dropping the first word suits Spanish, whose citation form starts
  // with the verb; the French ones start with a subject pronoun, so the verb
  // survives that cut and the tail is what to match on instead. Either hit
  // counts.
  return [words.slice(1).join(' '), words.slice(-2).join(' ')];
}

/**
 * Whether a translation already contains the idiom, in whatever form.
 *
 * Deliberately generous. A false yes means the idiom is left as the engine
 * wrote it and only the note is shown; a false no means the citation form is
 * pasted over a correctly inflected one and the grammar breaks. The first
 * costs nothing, so the doubt goes that way.
 */
export function alreadyIdiomatic(text, say, core = null) {
  const haystack = fold(text);
  // German and Dutch move the verb: second in a main clause, last in a
  // subordinate one, split in two when a prefix comes off (kneep een oogje
  // dicht). Neither signature survives that, so their entries name the run
  // of words that never moves and never inflects, and that is what is looked
  // for, on word boundaries: "aap" is inside "schaap".
  if (core) return ` ${haystack} `.includes(` ${fold(core)} `);
  return idiomSignature(say).some((signature) => signature && haystack.includes(signature));
}

/**
 * Auxiliaries that leave a gerund-shaped hole after them.
 *
 * The stored idiom is a finite clause, so dropping it in after an auxiliary the
 * engine has already written gives "está llueve a cántaros" — the complaint
 * this whole mechanism exists to answer, reappearing one layer down. Where an
 * idiom has a progressive form, that is what belongs in this slot.
 */
const AUXILIARY = {
  // Not French, which does not build its present this way — its equivalent
  // is the periphrastic "être en train de", and an idiom dropped in after one
  // gives "il est en train de en train de pleuvoir". Where a language has no
  // clean progressive slot it has no entry here, and the finite form stands.
  es: /\b(est[áa]|est[áa]n|estaba|estaban|estoy|est[áa]s|estamos|va a|iba a)\s*$/i,
  // Italian builds it the Spanish way, stare + gerund: "sta piovendo a
  // catinelle". Only the forms of *stare*, and the word boundary in front
  // keeps "questa" from reading as "sta". "State" is left out because it is
  // just as often the participle of *essere* ("siete state brave").
  it: /\b(sto|stai|sta|stiamo|stanno|stavo|stavi|stava|stavamo|stavate|stavano)\s*$/i,
  // Portuguese builds it with estar, and in Portugal with *a* and the
  // infinitive: "está a chover a potes". The accents are required on purpose,
  // because unaccented *esta* is the demonstrative. The *a* is optional here
  // and handled in substitute(): where the engine has already written it, the
  // slot wants the infinitive alone.
  pt: /\b(estou|estás|está|estamos|estais|estão|estava|estavas|estávamos|estáveis|estavam|estive|estiveste|esteve|estivemos|estiveram|estar)(\s+a)?\s*$/i,
};

/** Whether `before` ends in an auxiliary that the idiom must agree with. */
export function wantsProgressive(before, to) {
  const pattern = AUXILIARY[to];
  return Boolean(pattern && pattern.test(String(before ?? '').trimEnd()));
}

export const IDIOM_COUNT = Object.values(TABLES).reduce((sum, table) => sum + table.length, 0);

/** Per language, for the tests and the README. */
export const IDIOM_COUNTS = Object.fromEntries(Object.entries(TABLES).map(([study, table]) => [study, table.length]));
