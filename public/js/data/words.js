/**
 * The words of the day.
 *
 * One list per language, hand-picked: words a learner enjoys meeting, each
 * with something behind it, a borrowing, a picture inside the word, a bit of
 * history. The site's dictionary gives the senses; this is the list a word is
 * drawn from, one a day (lib/word-of-day.js).
 *
 * Every entry has the word and a short gloss in both the language and English.
 * The Spanish entries also carry the story, in both languages, because the
 * home page tells it for the Spanish word; the other languages' words were
 * chosen for having a story, but the site does not tell it.
 */

export const WORDS = {
  es: [
    {
      word: 'ojalá',
      gloss: { es: 'expresa un deseo', en: 'I hope so, if only' },
      story: {
        es: 'Viene del árabe «law šaʾ Allāh», «si Dios quiere». Ocho siglos de árabe en la península dejaron miles de palabras en español, y esta conserva entera una oración.',
        en: 'From the Arabic law šaʾ Allāh, "if God wills". Eight centuries of Arabic in Spain left thousands of words in the language, and this one keeps a whole prayer inside it.',
      },
    },
    {
      word: 'sobremesa',
      gloss: { es: 'la charla después de comer', en: 'the time spent talking after a meal' },
      story: {
        es: 'Literalmente «sobre la mesa»: el rato que la gente se queda sentada hablando cuando ya se ha terminado de comer. No tiene traducción en inglés, y es una de las palabras que más echan de menos los españoles fuera de España.',
        en: 'Literally "over the table": the time people stay sitting and talking once the meal is over. English has no word for it, and it is one of the words Spaniards abroad say they miss most.',
      },
    },
    {
      word: 'madrugar',
      gloss: { es: 'levantarse muy temprano', en: 'to get up very early' },
      story: {
        es: 'Del latín «maturare», apresurarse. El refrán dice «a quien madruga, Dios le ayuda», y otro le contesta: «no por mucho madrugar amanece más temprano».',
        en: 'From the Latin maturare, to hurry. One proverb says a quien madruga, Dios le ayuda, the early riser has God\'s help; another answers it: getting up earlier does not make the sun rise sooner.',
      },
    },
    {
      word: 'estrenar',
      gloss: { es: 'usar algo por primera vez', en: 'to wear or use something for the first time' },
      story: {
        es: 'Del latín «strena», el regalo de año nuevo. Estrenar unos zapatos, una casa o una película: el español tiene un verbo para la primera vez, y el inglés necesita una frase entera.',
        en: 'From the Latin strena, a New Year\'s gift. You can estrenar shoes, a flat or a film: Spanish has a verb for the first time, where English needs a whole phrase.',
      },
    },
    {
      word: 'siesta',
      gloss: { es: 'sueño breve después de comer', en: 'an afternoon nap' },
      story: {
        es: 'Del latín «sexta hora», la sexta hora del día romano, el mediodía, cuando el calor obligaba a parar. La palabra ha dado la vuelta al mundo sin cambiar.',
        en: 'From the Latin sexta hora, the sixth hour of the Roman day, midday, when the heat made everyone stop. The word has travelled the world without changing.',
      },
    },
    {
      word: 'almohada',
      gloss: { es: 'cojín para apoyar la cabeza', en: 'pillow' },
      story: {
        es: 'Del árabe «al-mujadda», de «jadd», mejilla: el lugar donde se apoya la mejilla. Casi todas las palabras españolas que empiezan por «al-» llevan dentro el artículo árabe.',
        en: 'From the Arabic al-mukhadda, from khadd, cheek: the thing the cheek rests on. Nearly every Spanish word starting with al- carries the Arabic article inside it.',
      },
    },
    {
      word: 'tertulia',
      gloss: { es: 'reunión para conversar', en: 'a regular gathering to talk' },
      story: {
        es: 'En el siglo XVII, los que presumían de cultos citaban a Tertuliano, un escritor cristiano del siglo II, y empezaron a llamarse «tertulianos». De ahí el nombre de sus reuniones.',
        en: 'In the 1600s people who liked to seem learned quoted Tertullian, a Christian writer of the second century, and were nicknamed tertulianos. Their gatherings took the name.',
      },
    },
    {
      word: 'aguacate',
      gloss: { es: 'fruto verde y cremoso', en: 'avocado' },
      story: {
        es: 'Del náhuatl «ahuacatl», que también significaba testículo, por la forma del fruto. En Perú y Argentina se dice «palta», del quechua.',
        en: 'From the Nahuatl ahuacatl, which also meant testicle, after the shape of the fruit. In Peru and Argentina it is palta, from Quechua.',
      },
    },
    {
      word: 'chocolate',
      gloss: { es: 'alimento hecho de cacao', en: 'chocolate' },
      story: {
        es: 'Del náhuatl «xocolatl», probablemente «agua amarga»: los aztecas lo bebían con chile y sin azúcar. El español lo pasó a todas las lenguas de Europa.',
        en: 'From the Nahuatl xocolatl, probably "bitter water": the Aztecs drank it with chilli and no sugar. Spanish passed the word on to every language in Europe.',
      },
    },
    {
      word: 'huracán',
      gloss: { es: 'viento muy violento', en: 'hurricane' },
      story: {
        es: 'Del taíno «hurakán», el nombre del dios de la tormenta en el Caribe. Es una de las primeras palabras americanas que entró en el español, y de ahí pasó al inglés.',
        en: 'From the Taíno hurakán, the name of the Caribbean storm god. It was one of the first words from the Americas to enter Spanish, and from there it reached English.',
      },
    },
    {
      word: 'izquierda',
      gloss: { es: 'el lado contrario al derecho', en: 'left' },
      story: {
        es: 'Del vasco «ezkerra». El latín «sinistra» había tomado un sentido de mala suerte, así que el español prefirió la palabra de sus vecinos. Es de las pocas palabras vascas de uso diario.',
        en: 'From the Basque ezkerra. The Latin sinistra had come to mean bad luck, so Spanish borrowed its neighbours\' word instead. It is one of the few Basque words used every day.',
      },
    },
    {
      word: 'murciélago',
      gloss: { es: 'mamífero que vuela de noche', en: 'bat' },
      story: {
        es: 'Del latín «mus caeculus», «ratón cieguito». La forma antigua era «murciégalo», y la gente cambió las letras de sitio hasta que la nueva ganó. Es también la palabra más famosa con las cinco vocales.',
        en: 'From the Latin mus caeculus, "little blind mouse". The older form was murciégalo; speakers swapped the letters round until the new one won. It is also the best-known word with all five vowels.',
      },
    },
    {
      word: 'ventana',
      gloss: { es: 'abertura en la pared', en: 'window' },
      story: {
        es: 'De «viento»: la abertura por donde entra el aire. El inglés «window» viene del nórdico «vindauga», «ojo del viento». Dos lenguas, la misma idea.',
        en: 'From viento, wind: the opening the air comes through. English window is from the Norse vindauga, "wind eye". Two languages, the same idea.',
      },
    },
    {
      word: 'esposas',
      gloss: { es: 'mujeres casadas; también grilletes', en: 'wives; also handcuffs' },
      story: {
        es: 'Del latín «sponsa», la prometida. En plural también son las esposas que lleva un detenido, porque unen dos cosas que ya no se separan. El chiste es viejo y sigue funcionando.',
        en: 'From the Latin sponsa, the betrothed. In the plural it is also handcuffs, because they join two things that will not come apart. The joke is old and still works.',
      },
    },
    {
      word: 'bigote',
      gloss: { es: 'pelo sobre el labio', en: 'moustache' },
      story: {
        es: 'Según la historia que más se cuenta, viene del alemán «bei Gott», «por Dios», el juramento de los soldados alemanes de los Reyes Católicos, famosos por sus mostachos.',
        en: 'By the story most often told, from the German bei Gott, "by God", the oath of the German soldiers who served the Catholic Monarchs and were famous for their moustaches.',
      },
    },
    {
      word: 'tocayo',
      gloss: { es: 'persona con tu mismo nombre', en: 'someone who shares your first name' },
      story: {
        es: 'Dos explicaciones compiten: la fórmula romana de boda «ubi tu Gaius, ego Gaia», o el náhuatl «tocaitl», nombre. Sea cual sea, el inglés no tiene palabra para esto.',
        en: 'Two explanations compete: the Roman wedding formula ubi tu Gaius, ego Gaia, or the Nahuatl tocaitl, name. Either way, English has no word for it.',
      },
    },
    {
      word: 'empalagar',
      gloss: { es: 'cansar por demasiado dulce', en: 'to be sickly sweet, to cloy' },
      story: {
        es: 'Probablemente de «paladar». Lo que empalaga es lo que de tan dulce ya no se puede seguir comiendo, y también la persona que es demasiado cariñosa.',
        en: 'Probably from paladar, the palate. What empalaga is so sweet you cannot go on eating it, and the word is used of people who are too affectionate too.',
      },
    },
    {
      word: 'duende',
      gloss: { es: 'encanto misterioso; espíritu', en: 'a mysterious charm; a goblin' },
      story: {
        es: 'De «duen de casa», «dueño de la casa», el espíritu que la habita. Lorca lo convirtió en el nombre de la fuerza que tiene un cantaor cuando canta de verdad.',
        en: 'From duen de casa, "master of the house", the spirit that lives in it. Lorca made it the name for the force a flamenco singer has when the singing is real.',
      },
    },
    {
      word: 'friolero',
      gloss: { es: 'muy sensible al frío', en: 'someone who feels the cold easily' },
      story: {
        es: 'De «frío» con el sufijo «-ero», el de los oficios: como si tener frío fuera una profesión. Su contrario, «caluroso», existe, pero no se usa para personas.',
        en: 'From frío, cold, with the suffix -ero of trades and jobs: as though feeling the cold were a profession. English needs half a sentence for it.',
      },
    },
    {
      word: 'merienda',
      gloss: { es: 'comida ligera de la tarde', en: 'an afternoon snack' },
      story: {
        es: 'Del latín «merenda», «lo que se ha de merecer»: la comida que se ganaba a media jornada de trabajo. Hoy es el pan con chocolate de la vuelta del colegio.',
        en: 'From the Latin merenda, "what is to be earned": the meal a worker had earned by the middle of the day. Today it is the bread and chocolate after school.',
      },
    },
    {
      word: 'quincena',
      gloss: { es: 'quince días; una paga', en: 'a fortnight; a fortnightly pay packet' },
      story: {
        es: 'De «quince». El español cuenta las dos semanas como quince días y el francés igual («quinze jours»); el inglés dice «fortnight», catorce noches. Nadie se pone de acuerdo.',
        en: 'From quince, fifteen. Spanish counts two weeks as fifteen days, and French does the same (quinze jours); English says fortnight, fourteen nights. Nobody agrees.',
      },
    },
    {
      word: 'hamaca',
      gloss: { es: 'red colgante para dormir', en: 'hammock' },
      story: {
        es: 'Del taíno, la lengua de las islas donde llegó Colón. Los marineros la adoptaron enseguida para dormir en los barcos, y la palabra viajó con ellos a toda Europa.',
        en: 'From Taíno, the language of the islands where Columbus landed. Sailors took it up at once for sleeping aboard ship, and the word travelled with them across Europe.',
      },
    },
    {
      word: 'desvelado',
      gloss: { es: 'sin poder dormir', en: 'unable to sleep, kept awake' },
      story: {
        es: 'De «velar», estar despierto, que viene del latín «vigilare». Quien se desvela pierde el sueño; «desvelar» también es quitar el velo, descubrir un secreto.',
        en: 'From velar, to stay awake, from the Latin vigilare. To be desvelado is to have lost your sleep; desvelar is also to lift a veil, to reveal a secret.',
      },
    },
    {
      word: 'cachivache',
      gloss: { es: 'trasto, objeto inútil', en: 'a piece of junk, an odd object' },
      story: {
        es: 'Nadie sabe seguro de dónde viene; la Academia sugiere «cacharro» y «vacío». Es una de esas palabras que suenan a lo que significan, y por eso casi siempre va en plural.',
        en: 'Nobody is sure where it comes from; the Academy suggests cacharro, a pot, and vacío, empty. It is one of those words that sound like what they mean, which is why it is nearly always plural.',
      },
    },
  ],

  fr: [
    { word: 'dépaysement', gloss: { fr: 'le trouble d’être ailleurs', en: 'the feeling of being somewhere unfamiliar' } },
    { word: 'flâner', gloss: { fr: 'se promener sans but', en: 'to stroll without a goal' } },
    { word: 'retrouvailles', gloss: { fr: 'le moment où l’on se revoit', en: 'the joy of meeting again' } },
    { word: 'bouquiner', gloss: { fr: 'lire pour le plaisir', en: 'to read for pleasure' } },
    { word: 'chouette', gloss: { fr: 'un oiseau de nuit; très bien', en: 'an owl; also great, nice' } },
    { word: 'râler', gloss: { fr: 'se plaindre sans cesse', en: 'to grumble' } },
    { word: 'pantoufle', gloss: { fr: 'chaussure d’intérieur', en: 'slipper' } },
    { word: 'bricoler', gloss: { fr: 'réparer, fabriquer soi-même', en: 'to tinker, to do it yourself' } },
    { word: 'ébouriffé', gloss: { fr: 'aux cheveux en désordre', en: 'tousled, dishevelled' } },
    { word: 'crépuscule', gloss: { fr: 'la lumière du soir', en: 'twilight, dusk' } },
    { word: 'papillon', gloss: { fr: 'insecte aux grandes ailes', en: 'butterfly' } },
    { word: 'hirondelle', gloss: { fr: 'oiseau qui annonce le printemps', en: 'swallow' } },
    { word: 'émerveiller', gloss: { fr: 'remplir d’admiration', en: 'to fill with wonder' } },
    { word: 'feuilleter', gloss: { fr: 'tourner les pages', en: 'to leaf through' } },
    { word: 'quiproquo', gloss: { fr: 'une méprise, un malentendu', en: 'a mix-up, a misunderstanding' } },
    { word: 'bidule', gloss: { fr: 'un objet dont on oublie le nom', en: 'a thingamajig' } },
    { word: 'tohu-bohu', gloss: { fr: 'un grand désordre bruyant', en: 'hubbub, confusion' } },
    { word: 'coquelicot', gloss: { fr: 'fleur rouge des champs', en: 'poppy' } },
    { word: 'pamplemousse', gloss: { fr: 'gros agrume jaune', en: 'grapefruit' } },
    { word: 'cafard', gloss: { fr: 'un insecte; le coup de blues', en: 'a cockroach; also the blues' } },
    { word: 'gourmand', gloss: { fr: 'qui aime manger', en: 'fond of food' } },
    { word: 'vachement', gloss: { fr: 'très, vraiment (familier)', en: 'really, very (informal)' } },
    { word: 'rocambolesque', gloss: { fr: 'plein de rebondissements incroyables', en: 'fantastic, full of improbable twists' } },
    { word: 'dépanner', gloss: { fr: 'tirer d’embarras', en: 'to help out, to fix' } },
  ],

  it: [
    { word: 'sprezzatura', gloss: { it: 'eleganza che sembra senza sforzo', en: 'studied carelessness' } },
    { word: 'magari', gloss: { it: 'forse; se solo!', en: 'maybe; if only!' } },
    { word: 'abbiocco', gloss: { it: 'sonnolenza dopo mangiato', en: 'the drowsiness after a big meal' } },
    { word: 'meriggiare', gloss: { it: 'riposare all’ombra a mezzogiorno', en: 'to rest in the shade at midday' } },
    { word: 'menefreghista', gloss: { it: 'chi non si cura di nulla', en: 'someone who could not care less' } },
    { word: 'chiacchierare', gloss: { it: 'parlare del più e del meno', en: 'to chat' } },
    { word: 'pisolino', gloss: { it: 'un sonnellino', en: 'a little nap' } },
    { word: 'spuntino', gloss: { it: 'un piccolo pasto', en: 'a snack' } },
    { word: 'struggimento', gloss: { it: 'desiderio che consuma', en: 'yearning, a consuming longing' } },
    { word: 'culaccino', gloss: { it: 'il segno del bicchiere sul tavolo', en: 'the ring a glass leaves on a table' } },
    { word: 'gattara', gloss: { it: 'donna che accudisce gatti randagi', en: 'a woman who looks after stray cats' } },
    { word: 'mozzafiato', gloss: { it: 'che toglie il respiro', en: 'breathtaking' } },
    { word: 'passeggiata', gloss: { it: 'la camminata della sera', en: 'the evening stroll' } },
    { word: 'pantofolaio', gloss: { it: 'chi ama stare in casa', en: 'a homebody' } },
    { word: 'fiasco', gloss: { it: 'una bottiglia; un fallimento', en: 'a flask; a flop' } },
    { word: 'ciao', gloss: { it: 'saluto informale', en: 'hello and goodbye' } },
    { word: 'quarantena', gloss: { it: 'isolamento di quaranta giorni', en: 'quarantine' } },
    { word: 'rocambolesco', gloss: { it: 'pieno di colpi di scena', en: 'full of improbable twists' } },
    { word: 'boh', gloss: { it: 'non lo so', en: 'no idea' } },
    { word: 'apericena', gloss: { it: 'aperitivo che diventa cena', en: 'an aperitif big enough to be dinner' } },
    { word: 'baffi', gloss: { it: 'peli sopra il labbro', en: 'moustache' } },
    { word: 'ciofeca', gloss: { it: 'bevanda cattiva; cosa di scarso valore', en: 'a vile drink; something worthless' } },
    { word: 'influenza', gloss: { it: 'malattia di stagione', en: 'flu' } },
    { word: 'dondolare', gloss: { it: 'muovere avanti e indietro', en: 'to sway, to rock' } },
  ],

  de: [
    { word: 'Fernweh', gloss: { de: 'Sehnsucht nach der Ferne', en: 'a longing for far-off places' } },
    { word: 'Gemütlichkeit', gloss: { de: 'behagliche Wärme', en: 'cosiness, warm comfort' } },
    { word: 'Schadenfreude', gloss: { de: 'Freude am Unglück anderer', en: 'pleasure at another\'s misfortune' } },
    { word: 'Kummerspeck', gloss: { de: 'Gewicht aus Kummer', en: 'weight gained from comfort eating' } },
    { word: 'Ohrwurm', gloss: { de: 'Melodie, die nicht aus dem Kopf geht', en: 'a tune stuck in your head' } },
    { word: 'Fingerspitzengefühl', gloss: { de: 'Feingefühl, Takt', en: 'a delicate touch, tact' } },
    { word: 'Wanderlust', gloss: { de: 'Lust zu wandern und zu reisen', en: 'the urge to roam' } },
    { word: 'Zeitgeist', gloss: { de: 'der Geist einer Epoche', en: 'the spirit of the age' } },
    { word: 'Torschlusspanik', gloss: { de: 'Angst, etwas zu verpassen', en: 'fear that time is running out' } },
    { word: 'Kopfkino', gloss: { de: 'Bilder im Kopf', en: 'a film playing in your head' } },
    { word: 'verschlimmbessern', gloss: { de: 'durch Verbessern verschlechtern', en: 'to make worse by trying to improve' } },
    { word: 'fremdschämen', gloss: { de: 'sich für andere schämen', en: 'to feel embarrassed for someone else' } },
    { word: 'Treppenwitz', gloss: { de: 'die Antwort, die zu spät einfällt', en: 'the retort you think of too late' } },
    { word: 'Sehnsucht', gloss: { de: 'tiefes Verlangen', en: 'deep longing' } },
    { word: 'Feierabend', gloss: { de: 'das Ende des Arbeitstags', en: 'the end of the working day' } },
    { word: 'Weltschmerz', gloss: { de: 'Trauer über die Welt', en: 'world-weariness' } },
    { word: 'Handschuh', gloss: { de: 'Schuh für die Hand', en: 'glove' } },
    { word: 'Zugzwang', gloss: { de: 'Zwang, einen Zug zu machen', en: 'being forced to move' } },
    { word: 'Luftschloss', gloss: { de: 'ein unerfüllbarer Traum', en: 'a castle in the air' } },
    { word: 'Schnapsidee', gloss: { de: 'eine verrückte Idee', en: 'a crazy idea' } },
    { word: 'Sitzfleisch', gloss: { de: 'Ausdauer beim Sitzen', en: 'the stamina to sit and stick at it' } },
    { word: 'Erklärungsnot', gloss: { de: 'Mangel an Erklärungen', en: 'being at a loss to explain' } },
    { word: 'Drachenfutter', gloss: { de: 'Geschenk zur Besänftigung', en: 'a peace offering to a partner' } },
    { word: 'Vorfreude', gloss: { de: 'Freude auf etwas Kommendes', en: 'the joy of looking forward' } },
  ],

  nl: [
    { word: 'gezellig', gloss: { nl: 'knus en prettig samen', en: 'cosy and convivial' } },
    { word: 'uitwaaien', gloss: { nl: 'in de wind lopen om op te frissen', en: 'to walk in the wind to clear your head' } },
    { word: 'voorpret', gloss: { nl: 'plezier vooraf', en: 'the fun of looking forward' } },
    { word: 'uitbuiken', gloss: { nl: 'uitrusten na het eten', en: 'to rest after a big meal' } },
    { word: 'natafelen', gloss: { nl: 'napraten aan tafel', en: 'to linger at the table after a meal' } },
    { word: 'borrel', gloss: { nl: 'een drankje met vrienden', en: 'drinks with friends' } },
    { word: 'gedoe', gloss: { nl: 'drukte, gezeur', en: 'fuss, hassle' } },
    { word: 'lekker', gloss: { nl: 'heerlijk, fijn', en: 'tasty, lovely' } },
    { word: 'niksen', gloss: { nl: 'niets doen', en: 'to do nothing at all' } },
    { word: 'binnenpretje', gloss: { nl: 'een lach voor jezelf', en: 'a private little laugh' } },
    { word: 'uitzieken', gloss: { nl: 'ziek zijn tot het over is', en: 'to see an illness through' } },
    { word: 'struisvogelpolitiek', gloss: { nl: 'problemen niet willen zien', en: 'burying your head in the sand' } },
    { word: 'hemelsbreed', gloss: { nl: 'in rechte lijn gemeten', en: 'as the crow flies' } },
    { word: 'pretoogjes', gloss: { nl: 'ogen die lachen', en: 'twinkling eyes' } },
    { word: 'schemeren', gloss: { nl: 'half licht worden', en: 'to grow dusky' } },
    { word: 'knuffelen', gloss: { nl: 'liefdevol omhelzen', en: 'to cuddle' } },
    { word: 'kletsen', gloss: { nl: 'gezellig praten', en: 'to chat' } },
    { word: 'apenstaartje', gloss: { nl: 'het teken @', en: 'the @ sign' } },
    { word: 'lanterfanten', gloss: { nl: 'lui rondhangen', en: 'to loaf about' } },
    { word: 'weemoed', gloss: { nl: 'zachte droefheid', en: 'wistfulness' } },
    { word: 'koekeloeren', gloss: { nl: 'nieuwsgierig kijken', en: 'to peer about curiously' } },
    { word: 'fiets', gloss: { nl: 'rijwiel', en: 'bicycle' } },
    { word: 'stroopwafel', gloss: { nl: 'wafel met stroop', en: 'a syrup waffle' } },
    { word: 'uitvinden', gloss: { nl: 'iets nieuws bedenken', en: 'to invent' } },
  ],

  pt: [
    { word: 'saudade', gloss: { pt: 'falta doce de alguém ou algo', en: 'a sweet longing for what is absent' } },
    { word: 'desenrascar', gloss: { pt: 'resolver à última hora', en: 'to improvise a way out' } },
    { word: 'desabafar', gloss: { pt: 'dizer o que pesa', en: 'to get something off your chest' } },
    { word: 'madrugada', gloss: { pt: 'as horas antes do amanhecer', en: 'the small hours' } },
    { word: 'pirilampo', gloss: { pt: 'inseto que brilha à noite', en: 'firefly' } },
    { word: 'petiscar', gloss: { pt: 'comer pequenas porções', en: 'to nibble on small dishes' } },
    { word: 'aconchego', gloss: { pt: 'conforto e abrigo', en: 'cosy comfort' } },
    { word: 'alfacinha', gloss: { pt: 'natural de Lisboa', en: 'a native of Lisbon' } },
    { word: 'cafuné', gloss: { pt: 'carícia no cabelo', en: 'running your fingers through someone\'s hair' } },
    { word: 'fado', gloss: { pt: 'destino; canção portuguesa', en: 'fate; the Portuguese song' } },
    { word: 'namorar', gloss: { pt: 'andar com alguém', en: 'to go out with someone' } },
    { word: 'lusco-fusco', gloss: { pt: 'o cair da noite', en: 'dusk' } },
    { word: 'xodó', gloss: { pt: 'pessoa ou coisa querida', en: 'a darling, a favourite' } },
    { word: 'azulejo', gloss: { pt: 'ladrilho pintado', en: 'a painted tile' } },
    { word: 'caracol', gloss: { pt: 'animal com concha; cabelo encaracolado', en: 'snail; a curl' } },
    { word: 'mimar', gloss: { pt: 'tratar com carinho', en: 'to spoil, to pamper' } },
    { word: 'passear', gloss: { pt: 'andar por prazer', en: 'to go for a stroll' } },
    { word: 'farra', gloss: { pt: 'festa animada', en: 'a party, a spree' } },
    { word: 'quintal', gloss: { pt: 'pátio atrás da casa', en: 'back yard' } },
    { word: 'ternura', gloss: { pt: 'carinho suave', en: 'tenderness' } },
    { word: 'apaixonar', gloss: { pt: 'fazer sentir paixão', en: 'to fall in love' } },
    { word: 'serenata', gloss: { pt: 'música cantada à noite', en: 'a serenade' } },
    { word: 'brincar', gloss: { pt: 'divertir-se como criança', en: 'to play' } },
    { word: 'fofoca', gloss: { pt: 'conversa sobre a vida alheia', en: 'gossip' } },
  ],
};
