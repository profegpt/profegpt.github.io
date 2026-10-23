/**
 * Curated grammar explanations for the tutor, Italian side.
 *
 * The same contract as data/grammar.js and data/grammar-fr.js: each topic
 * carries the words that should summon it and a short explanation in both
 * languages, so the tutor can answer in whichever one it was asked. Bodies are
 * markdown.
 *
 * Hand-written rather than generated, for the same reason as the Spanish and
 * French sets — everything the tutor says about Italian should be something a
 * teacher would actually sign off on. Where standard Italian and everyday
 * speech part ways (the congiuntivo after *penso che*, *gli* for "to them"),
 * the notes say so rather than pretend the spoken form does not exist.
 *
 * Keywords are matched against the question with its accents folded away, so
 * *perché* and *perche* summon the same note. Single, very common words — *ci*,
 * *ne*, *da*, *per* — are deliberately not keywords on their own: they turn up
 * in half of all Italian questions, and a note offered on the strength of one
 * of them would be offered to almost everybody.
 */

export const TOPICS = [
  {
    id: 'essere-avere',
    keywords: ['essere', 'avere', 'essere o avere', 'essere e avere', 'essere vs avere', 'differenza tra essere e avere',
      'ausiliare', 'ausiliari', 'quale ausiliare', 'auxiliary', 'auxiliaries', 'to be', 'to have'],
    title: { it: 'Essere e avere', en: 'Essere vs. avere' },
    body: {
      en: `The two most common verbs in Italian, and the two auxiliaries.

| | essere | avere |
| --- | --- | --- |
| io | sono | ho |
| tu | sei | hai |
| lui / lei | è | ha |
| noi | siamo | abbiamo |
| voi | siete | avete |
| loro | sono | hanno |

The *h* in *ho, hai, ha, hanno* is never pronounced. It is there only to tell them apart from *o* (or), *ai* (to the), *a* (to) and *anno* (year).

**Where English says *to be*, Italian often says *avere*:**
- *Ho fame.* — I'm hungry. (literally: I have hunger)
- *Ho sete / freddo / caldo / sonno / paura / fretta / ragione / torto.*
- *Ho vent'anni.* — I'm twenty.

Learn these as fixed expressions rather than translating word by word.

**As auxiliaries** they build the passato prossimo and every other compound tense:
- **avere** with every verb that takes a direct object, and with many that do not: *Ho mangiato. Abbiamo dormito. Hanno camminato molto.*
- **essere** with most verbs of movement and change of state — *andare, venire, arrivare, partire, entrare, uscire, tornare, nascere, morire, diventare, restare, rimanere* — with *essere* itself (*sono stato*), with every reflexive verb (*mi sono alzato*) and with *piacere* (*mi è piaciuto*).

Not every verb of movement takes *essere*: *camminare, viaggiare, nuotare, passeggiare* take *avere*. And a few verbs take both, depending on whether they have an object:
- *Ho finito il lavoro.* · *Il film è finito.*
- *Ho cominciato il libro.* · *La lezione è cominciata.*

With *essere*, the participle agrees with the subject like an adjective: *Marco è andato, Giulia è andata, i ragazzi sono andati, le ragazze sono andate.*

See *il passato prossimo* for the full picture.`,
      it: `I due verbi più frequenti dell'italiano, e i due ausiliari.

| | essere | avere |
| --- | --- | --- |
| io | sono | ho |
| tu | sei | hai |
| lui / lei | è | ha |
| noi | siamo | abbiamo |
| voi | siete | avete |
| loro | sono | hanno |

L'*h* di *ho, hai, ha, hanno* non si pronuncia mai: serve solo a distinguerli da *o* (congiunzione), *ai* (preposizione), *a* e *anno*.

**Dove l'inglese usa *to be*, l'italiano usa spesso *avere*:**
- *Ho fame.* — in inglese: *I'm hungry.*
- *Ho sete / freddo / caldo / sonno / paura / fretta / ragione / torto.*
- *Ho vent'anni.* — in inglese: *I'm twenty.*

Sono espressioni fisse: conviene impararle così, senza tradurle parola per parola.

**Come ausiliari** formano il passato prossimo e tutti gli altri tempi composti:
- **avere** con tutti i verbi che hanno un complemento oggetto, e con molti che non lo hanno: *Ho mangiato. Abbiamo dormito. Hanno camminato molto.*
- **essere** con la maggior parte dei verbi di movimento e di cambiamento di stato — *andare, venire, arrivare, partire, entrare, uscire, tornare, nascere, morire, diventare, restare, rimanere* —, con *essere* stesso (*sono stato*), con tutti i verbi riflessivi (*mi sono alzato*) e con *piacere* (*mi è piaciuto*).

Non tutti i verbi di movimento vogliono *essere*: *camminare, viaggiare, nuotare, passeggiare* vogliono *avere*. E alcuni verbi accettano tutti e due, a seconda che abbiano o no un oggetto:
- *Ho finito il lavoro.* · *Il film è finito.*
- *Ho cominciato il libro.* · *La lezione è cominciata.*

Con *essere* il participio si accorda con il soggetto, come un aggettivo: *Marco è andato, Giulia è andata, i ragazzi sono andati, le ragazze sono andate.*

Per il quadro completo, vedi *il passato prossimo*.`,
    },
  },

  {
    id: 'passato-prossimo',
    keywords: ['passato prossimo', 'participio passato', 'participi irregolari', 'participio irregolare',
      'accordo del participio', 'past participle', 'present perfect', 'past tense', 'trapassato prossimo', 'trapassato',
      'pluperfect', 'tempi composti', 'compound tenses'],
    title: { it: 'Il passato prossimo', en: 'The passato prossimo' },
    body: {
      en: `The everyday past tense: **essere or avere in the present + past participle**.

*Ho parlato. Hai finito. È partita.*

**Regular participles** come straight from the infinitive:
- -are → **-ato**: *parlare → parlato*
- -ere → **-uto**: *credere → creduto*
- -ire → **-ito**: *dormire → dormito*

**Irregular participles** are common, mostly among -ere verbs, and worth learning with the verb:
*fare → fatto, dire → detto, essere → stato, prendere → preso, mettere → messo, vedere → visto, leggere → letto, scrivere → scritto, chiedere → chiesto, rispondere → risposto, chiudere → chiuso, decidere → deciso, perdere → perso, scegliere → scelto, rimanere → rimasto, vivere → vissuto, bere → bevuto, aprire → aperto, offrire → offerto, morire → morto, nascere → nato, venire → venuto.*

**Which auxiliary?** Most verbs take *avere*. Verbs of movement and change of state, *essere* itself and every reflexive verb take *essere* — see *essere e avere*.

**Agreement.** With *essere*, the participle agrees with the **subject**:
- *Luca è uscito* · *Anna è uscita* · *Sono usciti* · *Sono uscite*

With *avere*, it does not agree with the subject — but it **must** agree with a direct object pronoun *lo, la, li, le* placed before it:
- *Hai visto Anna? — Sì, l'ho vista.*
- *Le chiavi? — Le ho prese io.*
- With *ne* it agrees with the quantity: *Ne ho comprate tre* (mele).

With *mi, ti, ci, vi* the agreement is optional: *Maria, ti ho visto / vista ieri.*

**Modal verbs** — *dovere, potere, volere* — in careful Italian borrow the auxiliary of the verb that follows: *Ho dovuto lavorare*, but *Sono dovuto partire*. In speech *ho dovuto partire* is common and accepted.

**The trapassato prossimo** is the same construction one step further back, with the auxiliary in the imperfetto — *had done*:
- *Quando sono arrivato, il film **era** già **cominciato**.*
- *Non **avevo** mai **visto** il mare.*`,
      it: `Il passato di tutti i giorni: **essere o avere al presente + participio passato**.

*Ho parlato. Hai finito. È partita.*

**I participi regolari** si formano direttamente dall'infinito:
- -are → **-ato**: *parlare → parlato*
- -ere → **-uto**: *credere → creduto*
- -ire → **-ito**: *dormire → dormito*

**I participi irregolari** sono frequenti, soprattutto tra i verbi in -ere, e vanno imparati insieme al verbo:
*fare → fatto, dire → detto, essere → stato, prendere → preso, mettere → messo, vedere → visto, leggere → letto, scrivere → scritto, chiedere → chiesto, rispondere → risposto, chiudere → chiuso, decidere → deciso, perdere → perso, scegliere → scelto, rimanere → rimasto, vivere → vissuto, bere → bevuto, aprire → aperto, offrire → offerto, morire → morto, nascere → nato, venire → venuto.*

**Quale ausiliare?** La maggior parte dei verbi prende *avere*. I verbi di movimento e di cambiamento di stato, *essere* stesso e tutti i verbi riflessivi prendono *essere* — vedi *essere e avere*.

**L'accordo.** Con *essere* il participio si accorda con il **soggetto**:
- *Luca è uscito* · *Anna è uscita* · *Sono usciti* · *Sono uscite*

Con *avere* non si accorda con il soggetto, ma **deve** accordarsi con un pronome diretto *lo, la, li, le* che lo precede:
- *Hai visto Anna? — Sì, l'ho vista.*
- *Le chiavi? — Le ho prese io.*
- Con *ne* si accorda con la quantità: *Ne ho comprate tre* (di mele).

Con *mi, ti, ci, vi* l'accordo è facoltativo: *Maria, ti ho visto / vista ieri.*

**I verbi modali** — *dovere, potere, volere* — nell'italiano curato prendono l'ausiliare del verbo che segue: *Ho dovuto lavorare*, ma *Sono dovuto partire*. Nel parlato *ho dovuto partire* è molto diffuso e accettato.

**Il trapassato prossimo** è la stessa costruzione spostata un passo più indietro, con l'ausiliare all'imperfetto:
- *Quando sono arrivato, il film **era** già **cominciato**.*
- *Non **avevo** mai **visto** il mare.*`,
    },
  },

  {
    id: 'passato-prossimo-imperfetto',
    keywords: ['imperfetto', 'passato prossimo o imperfetto', 'passato prossimo e imperfetto', 'passato prossimo vs imperfetto',
      'imperfetto o passato prossimo', 'differenza tra passato prossimo e imperfetto', 'imperfect',
      'imperfect vs perfect', 'which past tense', 'passato remoto'],
    title: { it: 'Passato prossimo e imperfetto', en: 'Passato prossimo vs. imperfetto' },
    body: {
      en: `Both are past. The split is **what happened** vs. **what was going on**.

**Passato prossimo** — a completed event, something that moves the story forward. It answers *and then what?*
- *Ieri ho visto un bel film.* — Yesterday I saw a good film.
- *Ho vissuto a Roma per tre anni.* — a closed stretch of time.

**Imperfetto** — the background: descriptions, habits, states, and actions in progress. It answers *what was it like?*
- *Faceva freddo e la strada era vuota.* — description.
- *Da bambino andavo al mare ogni estate.* — habit: *I used to go*.
- *Leggevo.* — in progress: *I was reading*.

The classic pairing is one interrupting the other:
- *Leggevo quando è arrivata Giulia.* — I was reading (background) when Giulia arrived (event).

Some verbs shift meaning between the two:
- *sapevo* = I knew · *ho saputo* = I found out
- *conoscevo* = I knew (someone) · *ho conosciuto* = I met
- *dovevo* = I was supposed to (and perhaps didn't) · *ho dovuto* = I had to (and did)
- *volevo* = I wanted · *ho voluto* = I insisted on it, I chose to

The tense is a choice about how you are telling it, not a fact about the clock. The same afternoon can be *pioveva* or *è piovuto*, depending on whether it is the scenery or the news.

**And the passato remoto?** It is a third past, the one of books and history: *Dante nacque nel 1265.* In most of Italy it is a written tense used for the distant past and for storytelling; in much of the south it is still the everyday spoken past. A learner needs to recognise it long before needing to produce it.`,
      it: `Sono due tempi del passato. La differenza è tra **ciò che è successo** e **ciò che stava succedendo**.

**Passato prossimo** — un evento concluso, che fa andare avanti il racconto. Risponde a *e poi?*
- *Ieri ho visto un bel film.*
- *Ho vissuto a Roma per tre anni.* — un periodo chiuso.

**Imperfetto** — lo sfondo: descrizioni, abitudini, stati, azioni in corso. Risponde a *com'era?*
- *Faceva freddo e la strada era vuota.* — descrizione.
- *Da bambino andavo al mare ogni estate.* — abitudine.
- *Leggevo.* — azione in corso.

La coppia classica, con l'uno che interrompe l'altro:
- *Leggevo quando è arrivata Giulia.*

Alcuni verbi cambiano significato da un tempo all'altro:
- *sapevo* / *ho saputo* (= sono venuto a sapere)
- *conoscevo* / *ho conosciuto* (= ho incontrato per la prima volta)
- *dovevo* (e forse non l'ho fatto) / *ho dovuto* (e l'ho fatto)
- *volevo* / *ho voluto* (= ho insistito, ho scelto di farlo)

Il tempo è una scelta su come raccontare, non un dato dell'orologio: lo stesso pomeriggio può essere *pioveva* o *è piovuto*, a seconda che si descriva lo scenario o si dia la notizia.

**E il passato remoto?** È un terzo passato, quello dei libri e della storia: *Dante nacque nel 1265.* In gran parte d'Italia è un tempo scritto, per il passato lontano e per la narrazione; in molte zone del Sud è ancora il passato del parlato quotidiano. Chi studia deve saperlo riconoscere molto prima di doverlo usare.`,
    },
  },

  {
    id: 'congiuntivo',
    keywords: ['congiuntivo', 'il congiuntivo', 'congiuntivo presente', 'congiuntivo imperfetto', 'modo congiuntivo',
      'quando si usa il congiuntivo', 'quando usare il congiuntivo', 'subjunctive', 'penso che', 'credo che',
      'bisogna che', 'benché', 'sebbene', 'affinché', 'prima che'],
    title: { it: 'Il congiuntivo', en: 'The subjunctive (congiuntivo)' },
    body: {
      en: `Not a tense but a **mood**. The indicative states what is; the congiuntivo covers what is thought, wanted, doubted, feared or judged. It lives almost entirely in a clause introduced by **che** or by a conjunction.

**Present.** The endings swap vowels: -are verbs take **-i**, -ere and -ire verbs take **-a**.

| | parlare | prendere | dormire | finire |
| --- | --- | --- | --- | --- |
| che io | parli | prenda | dorma | finisca |
| che tu | parli | prenda | dorma | finisca |
| che lui / lei | parli | prenda | dorma | finisca |
| che noi | parliamo | prendiamo | dormiamo | finiamo |
| che voi | parliate | prendiate | dormiate | finiate |
| che loro | parlino | prendano | dormano | finiscano |

The three singular forms are identical, so the subject pronoun is often needed: *che tu parli*, *che lei parli*.

Common irregulars: *essere → sia, avere → abbia, andare → vada, fare → faccia, dare → dia, stare → stia, dire → dica, venire → venga, uscire → esca, sapere → sappia, volere → voglia, potere → possa, dovere → debba.*

**Imperfect.** From the imperfetto stem, with **-ssi, -ssi, -sse, -ssimo, -ste, -ssero**: *parlassi, prendessi, dormissi*. Irregular: *essere → fossi, dare → dessi, stare → stessi*; *fare → facessi, dire → dicessi, bere → bevessi* follow their imperfetto.

**When.** After expressions of:
- **opinion and belief** — *Penso che sia vero. Credo che abbia ragione.* Unlike French and Spanish, Italian uses the congiuntivo here even in the affirmative.
- **hope, wish and will** — *Spero che tu stia bene. Voglio che tu venga.*
- **emotion** — *Sono contento che tu sia qui. Ho paura che piova.*
- **doubt** — *Dubito che venga. Non sono sicuro che sia vero.*
- **impersonal judgements** — *È importante che tu studi. Bisogna che partiamo. Sembra che sia chiuso.*
- certain **conjunctions** — *benché, sebbene, nonostante* (although), *affinché, perché* (so that), *prima che, senza che, purché, a meno che*
- a **superlative**: *È il libro più bello che io abbia mai letto.*

**Not** after verbs of certainty: *So che è vero. Sono sicuro che viene.*

**Sequence.** When the main verb is past or conditional, the congiuntivo moves to the imperfect: *Penso che sia vero → Pensavo che fosse vero.* · *Vorrei che tu venissi.*

In relaxed speech many Italians use the indicative after *penso che*; in writing and in careful speech the congiuntivo is expected, and getting it right is noticed.`,
      it: `Non è un tempo ma un **modo**. L'indicativo dice ciò che è; il congiuntivo esprime ciò che si pensa, si vuole, si teme o si giudica. Vive quasi sempre in una frase introdotta da **che** o da una congiunzione.

**Presente.** Le desinenze si scambiano la vocale: i verbi in -are prendono **-i**, quelli in -ere e -ire prendono **-a**.

| | parlare | prendere | dormire | finire |
| --- | --- | --- | --- | --- |
| che io | parli | prenda | dorma | finisca |
| che tu | parli | prenda | dorma | finisca |
| che lui / lei | parli | prenda | dorma | finisca |
| che noi | parliamo | prendiamo | dormiamo | finiamo |
| che voi | parliate | prendiate | dormiate | finiate |
| che loro | parlino | prendano | dormano | finiscano |

Le tre persone singolari sono uguali, quindi spesso serve il pronome soggetto: *che tu parli*, *che lei parli*.

Irregolari frequenti: *essere → sia, avere → abbia, andare → vada, fare → faccia, dare → dia, stare → stia, dire → dica, venire → venga, uscire → esca, sapere → sappia, volere → voglia, potere → possa, dovere → debba.*

**Imperfetto.** Dalla radice dell'imperfetto, con **-ssi, -ssi, -sse, -ssimo, -ste, -ssero**: *parlassi, prendessi, dormissi*. Irregolari: *essere → fossi, dare → dessi, stare → stessi*; *fare → facessi, dire → dicessi, bere → bevessi* seguono il loro imperfetto.

**Quando si usa.** Dopo espressioni di:
- **opinione e convinzione** — *Penso che sia vero. Credo che abbia ragione.* A differenza del francese e dello spagnolo, l'italiano usa il congiuntivo anche nella frase affermativa.
- **speranza, desiderio e volontà** — *Spero che tu stia bene. Voglio che tu venga.*
- **sentimento** — *Sono contento che tu sia qui. Ho paura che piova.*
- **dubbio** — *Dubito che venga. Non sono sicuro che sia vero.*
- **giudizio impersonale** — *È importante che tu studi. Bisogna che partiamo. Sembra che sia chiuso.*
- alcune **congiunzioni** — *benché, sebbene, nonostante*, *affinché, perché* (= affinché), *prima che, senza che, purché, a meno che*
- un **superlativo**: *È il libro più bello che io abbia mai letto.*

**Non** dopo i verbi di certezza: *So che è vero. Sono sicuro che viene.*

**La concordanza.** Se il verbo principale è al passato o al condizionale, il congiuntivo passa all'imperfetto: *Penso che sia vero → Pensavo che fosse vero.* · *Vorrei che tu venissi.*

Nel parlato informale molti usano l'indicativo dopo *penso che*; nello scritto e nel parlato curato ci si aspetta il congiuntivo, e chi lo usa bene si fa notare.`,
    },
  },

  {
    id: 'articoli-genere',
    keywords: ['articoli', 'articolo', 'articolo determinativo', 'articoli determinativi', 'articolo indeterminativo',
      'il lo la', 'il lo la i gli le', 'un uno una', 'lo o il', 'genere', 'maschile o femminile', 'maschile e femminile',
      'gender', 'articles', 'definite article', 'indefinite article', 'masculine feminine', 'plurale', 'plurali', 'plurals'],
    title: { it: 'Il genere e gli articoli', en: 'Gender and articles' },
    body: {
      en: `Every Italian noun is masculine or feminine, and the article shows which — and, for masculine nouns, also depends on the **sound the next word starts with**.

| | masculine | feminine |
| --- | --- | --- |
| definite, singular | **il** · **lo** · **l'** | **la** · **l'** |
| definite, plural | **i** · **gli** | **le** |
| indefinite | **un** · **uno** | **una** · **un'** |

**Masculine:**
- **il / i / un** before most consonants — *il libro, i libri, un libro*
- **lo / gli / uno** before *s* + consonant, *z*, *gn*, *ps*, *x* and *y* — *lo studente, gli studenti, uno zaino, lo psicologo, lo yogurt*
- **l' / gli / un** before a vowel — *l'amico, gli amici, un amico*

**Feminine:**
- **la / le / una** — *la casa, le case, una casa*
- **l' / le / un'** before a vowel — *l'amica, le amiche, un'amica*

Note the apostrophe: *un amico* (masculine, no apostrophe) but *un'amica* (feminine, with one). It is one of the most common spelling mistakes, among Italians too.

**Guessing the gender.**
- **-o** is usually masculine: *il libro*. Exceptions: *la mano*, and shortened words like *la foto, la moto, la radio*.
- **-a** is usually feminine: *la casa*. Exceptions: many words from Greek in -ma — *il problema, il programma, il sistema, il tema, il clima* — and *il pianeta, il poeta*.
- **-e** can be either: *il fiore, il mare* · *la chiave, la notte*. Learn it with the article.
- **-zione, -sione, -tà, -tù** are feminine: *la stazione, la città, la virtù*.
- Borrowed words ending in a consonant are usually masculine: *il bar, lo sport, il computer*.

**Plurals.**
- -o → -i (*libro, libri*) · -a → -e (*casa, case*) · -e → -i (*fiore, fiori; chiave, chiavi*)
- masculine -a → -i: *il problema, i problemi*
- **invariable**: words stressed on the last vowel (*la città, le città; il caffè, i caffè*), one-syllable words (*il re, i re*), foreign words (*il film, i film*) and shortened words (*la foto, le foto*)
- irregular: *l'uomo, gli uomini* · *la mano, le mani* · *l'uovo, le uova* · *il braccio, le braccia* · *il dito, le dita*

Learn every noun with its article — *lo zaino*, not *zaino*. Recovering it later is much harder than storing it now.`,
      it: `Ogni nome italiano è maschile o femminile, e l'articolo lo mostra — e, per i maschili, dipende anche dal **suono con cui comincia la parola che segue**.

| | maschile | femminile |
| --- | --- | --- |
| determinativo, singolare | **il** · **lo** · **l'** | **la** · **l'** |
| determinativo, plurale | **i** · **gli** | **le** |
| indeterminativo | **un** · **uno** | **una** · **un'** |

**Maschile:**
- **il / i / un** davanti alla maggior parte delle consonanti — *il libro, i libri, un libro*
- **lo / gli / uno** davanti a *s* + consonante, *z*, *gn*, *ps*, *x* e *y* — *lo studente, gli studenti, uno zaino, lo psicologo, lo yogurt*
- **l' / gli / un** davanti a vocale — *l'amico, gli amici, un amico*

**Femminile:**
- **la / le / una** — *la casa, le case, una casa*
- **l' / le / un'** davanti a vocale — *l'amica, le amiche, un'amica*

Attenzione all'apostrofo: *un amico* (maschile, senza apostrofo) ma *un'amica* (femminile, con l'apostrofo). È uno degli errori di ortografia più comuni, anche tra gli italiani.

**Indovinare il genere.**
- **-o** di solito è maschile: *il libro*. Eccezioni: *la mano*, e le parole accorciate come *la foto, la moto, la radio*.
- **-a** di solito è femminile: *la casa*. Eccezioni: molte parole di origine greca in -ma — *il problema, il programma, il sistema, il tema, il clima* — e *il pianeta, il poeta*.
- **-e** può essere l'uno o l'altro: *il fiore, il mare* · *la chiave, la notte*. Va imparato con l'articolo.
- **-zione, -sione, -tà, -tù** sono femminili: *la stazione, la città, la virtù*.
- Le parole straniere che finiscono in consonante sono di solito maschili: *il bar, lo sport, il computer*.

**Il plurale.**
- -o → -i (*libro, libri*) · -a → -e (*casa, case*) · -e → -i (*fiore, fiori; chiave, chiavi*)
- maschili in -a → -i: *il problema, i problemi*
- **invariabili**: le parole accentate sull'ultima vocale (*la città, le città; il caffè, i caffè*), i monosillabi (*il re, i re*), le parole straniere (*il film, i film*) e quelle accorciate (*la foto, le foto*)
- irregolari: *l'uomo, gli uomini* · *la mano, le mani* · *l'uovo, le uova* · *il braccio, le braccia* · *il dito, le dita*

Impara ogni nome con il suo articolo — *lo zaino*, non *zaino*. Recuperarlo dopo costa molto più che memorizzarlo subito.`,
    },
  },

  {
    id: 'preposizioni-articolate',
    keywords: ['preposizioni articolate', 'preposizione articolata', 'preposizioni', 'preposizione', 'del nel sul',
      'al del dal nel sul', 'di a da in su', 'prepositions', 'preposition', 'articulated prepositions',
      'contractions', 'in o a'],
    title: { it: 'Le preposizioni articolate', en: 'Prepositions with the article' },
    body: {
      en: `Five prepositions fuse with the definite article that follows them, and the fusion is compulsory: *nel libro*, never *in il libro*.

| | il | lo | l' | la | i | gli | le |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **di** | del | dello | dell' | della | dei | degli | delle |
| **a** | al | allo | all' | alla | ai | agli | alle |
| **da** | dal | dallo | dall' | dalla | dai | dagli | dalle |
| **in** | nel | nello | nell' | nella | nei | negli | nelle |
| **su** | sul | sullo | sull' | sulla | sui | sugli | sulle |

Note that *in* becomes **ne-**: *nel, nella, negli*.

- *Il libro **del** professore.* — the teacher's book
- *Vado **al** cinema.* — I'm going to the cinema
- *Torno **dal** lavoro alle sei.* — I get back from work at six
- *Le chiavi sono **nella** borsa.* — the keys are in the bag
- *Il gatto dorme **sul** divano.* — the cat sleeps on the sofa

*Con* may fuse too (*col, coi*), but *con il, con i* are more usual in writing. *Per, tra* and *fra* never fuse.

**When there is no article, there is nothing to fuse.** Many common places take a bare preposition:
- **a** with towns and cities: *a Roma, a Milano* · and *a casa, a scuola, a letto*
- **in** with countries, regions, rooms, shops and means of transport: *in Italia, in Toscana, in cucina, in banca, in ufficio, in treno, in macchina*

But once the place is qualified, the article returns and fuses: *in Italia* → ***nell'**Italia del Nord* · *in cucina* → ***nella** cucina di mia nonna*.

**Da + a person** means *at* or *to someone's place*: *Vado **da** Marco.* · *Sono **dal** dentista.*`,
      it: `Cinque preposizioni si fondono con l'articolo determinativo che le segue, e la fusione è obbligatoria: *nel libro*, mai *in il libro*.

| | il | lo | l' | la | i | gli | le |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **di** | del | dello | dell' | della | dei | degli | delle |
| **a** | al | allo | all' | alla | ai | agli | alle |
| **da** | dal | dallo | dall' | dalla | dai | dagli | dalle |
| **in** | nel | nello | nell' | nella | nei | negli | nelle |
| **su** | sul | sullo | sull' | sulla | sui | sugli | sulle |

Nota che *in* diventa **ne-**: *nel, nella, negli*.

- *Il libro **del** professore.*
- *Vado **al** cinema.*
- *Torno **dal** lavoro alle sei.*
- *Le chiavi sono **nella** borsa.*
- *Il gatto dorme **sul** divano.*

Anche *con* può fondersi (*col, coi*), ma nello scritto sono più comuni *con il, con i*. *Per, tra* e *fra* non si fondono mai.

**Senza articolo non c'è niente da fondere.** Molti luoghi comuni vogliono la preposizione semplice:
- **a** con le città: *a Roma, a Milano* · e *a casa, a scuola, a letto*
- **in** con i paesi, le regioni, le stanze, i negozi e i mezzi di trasporto: *in Italia, in Toscana, in cucina, in banca, in ufficio, in treno, in macchina*

Ma quando il luogo è determinato, l'articolo torna e si fonde: *in Italia* → ***nell'**Italia del Nord* · *in cucina* → ***nella** cucina di mia nonna*.

**Da + una persona** significa *a casa di* o *presso*: *Vado **da** Marco.* · *Sono **dal** dentista.*`,
    },
  },

  {
    id: 'partitivo',
    keywords: ['partitivo', 'articolo partitivo', 'del pane', 'dei degli delle', 'partitive', 'partitive article',
      "un po' di", 'qualche', 'alcuni', 'alcune'],
    title: { it: 'Il partitivo', en: 'The partitive' },
    body: {
      en: `**Di + the definite article** — the same forms as the prepositions with the article — expresses an unspecified quantity: *some*.

| | singular | plural |
| --- | --- | --- |
| masculine | **del** pane, **dello** zucchero, **dell'**olio | **dei** libri, **degli** amici, **degli** studenti |
| feminine | **della** frutta, **dell'**acqua | **delle** mele |

In the plural it is simply the plural of *un / uno / una*: *un libro → dei libri* · *uno studente → degli studenti* · *una mela → delle mele*.

**Unlike French, Italian can usually leave it out.** *Compro pane e latte* is perfectly natural, and so is *Vuoi del caffè?* or simply *Vuoi un caffè?*. The partitive adds the idea of *a bit of*, *some*; it is never required the way *du pain* is in French.

**Other ways to say *some*:**
- **un po' di** + a singular, uncountable noun: *un po' di pane, un po' di pazienza*
- **qualche** + a **singular** noun, even though the meaning is plural: *qualche libro* (some books), *qualche giorno fa*
- **alcuni / alcune** + a plural noun: *alcuni amici, alcune volte*

**In the negative**, the partitive normally disappears: *Non ho pane. Non ho amici. Non c'è latte.*

The pronoun that replaces a partitive is **ne**: *Vuoi del pane? — Sì, ne prendo un po'.* See *ci e ne*.`,
      it: `**Di + articolo determinativo** — le stesse forme delle preposizioni articolate — indica una quantità indeterminata.

| | singolare | plurale |
| --- | --- | --- |
| maschile | **del** pane, **dello** zucchero, **dell'**olio | **dei** libri, **degli** amici, **degli** studenti |
| femminile | **della** frutta, **dell'**acqua | **delle** mele |

Al plurale è semplicemente il plurale di *un / uno / una*: *un libro → dei libri* · *uno studente → degli studenti* · *una mela → delle mele*.

**A differenza del francese, l'italiano di solito può ometterlo.** *Compro pane e latte* è del tutto naturale, come *Vuoi del caffè?* o semplicemente *Vuoi un caffè?*. Il partitivo aggiunge l'idea di *un po'*, *una certa quantità*; non è mai obbligatorio come *du pain* in francese.

**Altri modi per dirlo:**
- **un po' di** + un nome singolare non numerabile: *un po' di pane, un po' di pazienza*
- **qualche** + un nome **singolare**, anche se il senso è plurale: *qualche libro*, *qualche giorno fa*
- **alcuni / alcune** + un nome plurale: *alcuni amici, alcune volte*

**Nella frase negativa** il partitivo di solito sparisce: *Non ho pane. Non ho amici. Non c'è latte.*

Il pronome che sostituisce un partitivo è **ne**: *Vuoi del pane? — Sì, ne prendo un po'.* Vedi *ci e ne*.`,
    },
  },

  {
    id: 'pronomi',
    keywords: ['pronomi', 'pronome', 'pronomi diretti', 'pronomi indiretti', 'pronomi combinati', 'pronomi doppi',
      'pronomi oggetto', 'lo la li le', 'gli o le', 'glielo', 'gliela', 'me lo', 'te lo', 'object pronouns',
      'object pronoun', 'direct object', 'indirect object', 'double pronouns', 'combined pronouns'],
    title: { it: 'I pronomi diretti, indiretti e combinati', en: 'Object pronouns, single and combined' },
    body: {
      en: `They normally go **before the conjugated verb** — the opposite of English.

| | direct | indirect |
| --- | --- | --- |
| io | mi | mi |
| tu | ti | ti |
| lui | **lo** | **gli** |
| lei | **la** | **le** |
| Lei (formal) | La | Le |
| noi | ci | ci |
| voi | vi | vi |
| loro | **li** (m.) · **le** (f.) | **gli** · *loro* |

- *Vedo Marco.* → ***Lo** vedo.* · *Vedo Anna.* → ***La** vedo.*
- *Parlo a Marco.* → ***Gli** parlo.* · *Parlo ad Anna.* → ***Le** parlo.*
- *Telefono ai miei genitori.* → ***Gli** telefono.* — or, more formally, *Telefono **loro**.* *Loro* is the only one that goes after the verb.

*Lo* and *la* drop their vowel before a vowel or *h*: *l'ho visto, l'ho vista.*

**Where they attach to the end instead:**
- an **infinitive**, which loses its final *-e*: *Voglio veder**lo**.* With *dovere, potere, volere* both orders work: *Lo voglio vedere.*
- a **gerund**: *Vedendo**la**, ho capito.*
- an **affirmative imperative** with *tu, noi, voi*: *Chiama**lo**! Aspettiamo**li**!* With the one-syllable imperatives *da', di', fa', sta', va'* the consonant doubles: *dammi, dimmi, fallo* — except *gli*: *dagli*.
- but not the formal imperative: ***Mi** dica. **La** prego.*

**Combined pronouns.** When an indirect and a direct pronoun meet, the indirect one comes first and changes shape:
- *mi, ti, ci, vi* become **me, te, ce, ve**: *me lo, te la, ce li, ve le*
- *gli* and *le* both become **glie-** and fuse with the next one into a single word: **glielo, gliela, glieli, gliele, gliene**

- *Ti presto la macchina.* → ***Te la** presto.*
- *Do il libro a Marco.* → ***Glielo** do.*
- *Do il libro ad Anna.* → ***Glielo** do.* — the same; context tells you who.
- *Dimmelo! Voglio dartelo. Portaglielo.*

In the passato prossimo, *lo, la, li, le* still make the participle agree: *Le chiavi? **Te le** ho dat**e**.*`,
      it: `Di solito vanno **prima del verbo coniugato** — l'opposto dell'inglese.

| | diretti | indiretti |
| --- | --- | --- |
| io | mi | mi |
| tu | ti | ti |
| lui | **lo** | **gli** |
| lei | **la** | **le** |
| Lei (formale) | La | Le |
| noi | ci | ci |
| voi | vi | vi |
| loro | **li** (m.) · **le** (f.) | **gli** · *loro* |

- *Vedo Marco.* → ***Lo** vedo.* · *Vedo Anna.* → ***La** vedo.*
- *Parlo a Marco.* → ***Gli** parlo.* · *Parlo ad Anna.* → ***Le** parlo.*
- *Telefono ai miei genitori.* → ***Gli** telefono.* — oppure, in registro formale, *Telefono **loro**.* *Loro* è l'unico che va dopo il verbo.

*Lo* e *la* si apostrofano davanti a vocale o *h*: *l'ho visto, l'ho vista.*

**Quando invece si attaccano alla fine:**
- all'**infinito**, che perde la *-e* finale: *Voglio veder**lo**.* Con *dovere, potere, volere* vanno bene tutte e due le posizioni: *Lo voglio vedere.*
- al **gerundio**: *Vedendo**la**, ho capito.*
- all'**imperativo affermativo** con *tu, noi, voi*: *Chiama**lo**! Aspettiamo**li**!* Con gli imperativi monosillabi *da', di', fa', sta', va'* la consonante raddoppia: *dammi, dimmi, fallo* — tranne con *gli*: *dagli*.
- ma non all'imperativo formale: ***Mi** dica. **La** prego.*

**I pronomi combinati.** Quando un pronome indiretto incontra un diretto, l'indiretto viene prima e cambia forma:
- *mi, ti, ci, vi* diventano **me, te, ce, ve**: *me lo, te la, ce li, ve le*
- *gli* e *le* diventano entrambi **glie-** e si uniscono al pronome seguente in una sola parola: **glielo, gliela, glieli, gliele, gliene**

- *Ti presto la macchina.* → ***Te la** presto.*
- *Do il libro a Marco.* → ***Glielo** do.*
- *Do il libro ad Anna.* → ***Glielo** do.* — identico: è il contesto a dire a chi.
- *Dimmelo! Voglio dartelo. Portaglielo.*

Al passato prossimo *lo, la, li, le* continuano a far accordare il participio: *Le chiavi? **Te le** ho dat**e**.*`,
    },
  },

  {
    id: 'ci-ne',
    keywords: ['ci e ne', 'ci o ne', 'ci and ne', 'particella ci', 'particella ne', 'pronome ci', 'pronome ne',
      'particelle', "c'è", "c'è e ci sono", 'ci sono', 'there is', 'there are', "ce l'ho", 'ci vuole', 'ci vogliono',
      'volerci', 'metterci', 'andarsene', 'me ne vado'],
    title: { it: 'Ci e ne', en: 'Ci and ne' },
    body: {
      en: `Two small words that do a great deal of work. Both sit where an object pronoun sits — before the conjugated verb, or attached to an infinitive, gerund or imperative.

**Ci** replaces a **place**, or **a + a thing**:
- *Vai a Roma domani? — Sì, **ci** vado in treno.* — there
- *Sei mai stato in Sicilia? — Sì, **ci** sono stato due volte.*
- *Pensi all'esame? — Sì, **ci** penso sempre.* — *pensare a* → *ci*
- *Non **ci** credo!* — I don't believe it. · *Non **ci** riesco.* — I can't manage it.

It also lives inside some everyday expressions:
- ***c'è** / **ci sono*** — there is / there are: *C'è un problema. Ci sono due problemi.*
- ***ci vuole** / **ci vogliono*** — it takes (time, things needed): *Ci vuole un'ora. Ci vogliono tre uova.*
- ***metterci*** — it takes *me / you* (time): *Ci metto venti minuti.*
- ***averci*** in speech, with *ce* before the pronoun: *Hai le chiavi? — Sì, **ce le** ho.* · *Ce l'ho!*

**Ne** replaces **di + something**, and any **quantity**:
- *Parli spesso del viaggio? — Sì, **ne** parlo spesso.* — *parlare di* → *ne*
- *Che **ne** pensi?* — What do you think of it?
- *Quanti caffè bevi? — **Ne** bevo tre.* — the number stays, the noun goes.
- *Hai dei soldi? — Sì, **ne** ho un po'.* · *No, non **ne** ho.*

In the passato prossimo, the participle agrees with what *ne* stands for: *Ho mangiato tre mele → **Ne** ho mangiat**e** tre.*

*Andarsene* — to leave, go away — is built on it: ***Me ne** vado.* · *Se n'è andato.*

**Together**, *ci* becomes *ce*: ***ce n'è** uno* (there is one of them), ***ce ne** sono tanti*.

The habit to build is noticing the preposition the verb takes. *Pensare **a*** gives *ci*; *parlare **di*** gives *ne*. Nothing in the English tells you which.`,
      it: `Due paroline che lavorano moltissimo. Tutte e due si mettono dove si mette un pronome — prima del verbo coniugato, o attaccate all'infinito, al gerundio o all'imperativo.

**Ci** sostituisce un **luogo**, oppure **a + una cosa**:
- *Vai a Roma domani? — Sì, **ci** vado in treno.*
- *Sei mai stato in Sicilia? — Sì, **ci** sono stato due volte.*
- *Pensi all'esame? — Sì, **ci** penso sempre.* — *pensare a* → *ci*
- *Non **ci** credo!* · *Non **ci** riesco.*

Vive anche dentro alcune espressioni di tutti i giorni:
- ***c'è** / **ci sono***: *C'è un problema. Ci sono due problemi.*
- ***ci vuole** / **ci vogliono***: *Ci vuole un'ora. Ci vogliono tre uova.*
- ***metterci*** (tempo impiegato da qualcuno): *Ci metto venti minuti.*
- ***averci*** nel parlato, con *ce* davanti al pronome: *Hai le chiavi? — Sì, **ce le** ho.* · *Ce l'ho!*

**Ne** sostituisce **di + qualcosa**, e qualsiasi **quantità**:
- *Parli spesso del viaggio? — Sì, **ne** parlo spesso.* — *parlare di* → *ne*
- *Che **ne** pensi?*
- *Quanti caffè bevi? — **Ne** bevo tre.* — il numero resta, il nome se ne va.
- *Hai dei soldi? — Sì, **ne** ho un po'.* · *No, non **ne** ho.*

Al passato prossimo il participio si accorda con ciò che *ne* rappresenta: *Ho mangiato tre mele → **Ne** ho mangiat**e** tre.*

Su *ne* si costruisce *andarsene*: ***Me ne** vado.* · *Se n'è andato.*

**Insieme**, *ci* diventa *ce*: ***ce n'è** uno*, ***ce ne** sono tanti*.

L'abitudine da prendere è guardare la preposizione che il verbo richiede. *Pensare **a*** dà *ci*; *parlare **di*** dà *ne*. La traduzione inglese non lo dice.`,
    },
  },

  {
    id: 'negazione',
    keywords: ['negazione', 'la negazione', 'frase negativa', 'frasi negative', 'non mai', 'non niente', 'non nessuno',
      'non più', 'non ancora', 'doppia negazione', 'nessuno', 'niente', 'negation', 'negative', 'double negative',
      'double negatives'],
    title: { it: 'La negazione', en: 'Negation' },
    body: {
      en: `**Non** goes before the verb — and before any object pronoun attached to it.

- *Non parlo tedesco.* · *Non lo so.* · *Non mi piace.*

**Other negative words** go after the verb, and **non stays**:

| | |
| --- | --- |
| non … mai | never — *Non bevo mai caffè.* |
| non … più | no longer, not any more — *Non abito più qui.* |
| non … ancora | not yet — *Non ho ancora mangiato.* |
| non … niente / nulla | nothing — *Non vedo niente.* |
| non … nessuno | nobody — *Non conosco nessuno.* |
| non … affatto | not at all — *Non è affatto vero.* |
| non … neanche / nemmeno / neppure | not even — *Non ha neanche risposto.* |
| non … né … né | neither … nor — *Non bevo né vino né birra.* |

**The double negative is standard Italian**, and required. *Non vedo nessuno* is correct; *vedo nessuno* is not. English logic does not apply.

**When the negative word comes first, *non* goes:**
- *Nessuno è venuto.* · *Niente è cambiato.* · *Neanche io lo so.*

**In compound tenses**, *mai, più, ancora* and *affatto* usually go between the auxiliary and the participle, while *niente* and *nessuno* go after:
- *Non ho **mai** visto Venezia.* · *Non sono **più** tornato.*
- *Non ho visto **niente**.* · *Non ho incontrato **nessuno**.*

**Nessuno as an adjective** is always singular and takes the shapes of *un / uno / una*: *Non c'è **nessun** problema.* · *Non ho **nessuna** idea.*

Short answers: *Mai!* · *Per niente.* · *Neanch'io.* (me neither)`,
      it: `**Non** va prima del verbo — e prima di qualsiasi pronome che lo accompagna.

- *Non parlo tedesco.* · *Non lo so.* · *Non mi piace.*

**Le altre parole negative** vanno dopo il verbo, e **non resta**:

| | |
| --- | --- |
| non … mai | *Non bevo mai caffè.* |
| non … più | *Non abito più qui.* |
| non … ancora | *Non ho ancora mangiato.* |
| non … niente / nulla | *Non vedo niente.* |
| non … nessuno | *Non conosco nessuno.* |
| non … affatto | *Non è affatto vero.* |
| non … neanche / nemmeno / neppure | *Non ha neanche risposto.* |
| non … né … né | *Non bevo né vino né birra.* |

**La doppia negazione è italiano standard**, ed è obbligatoria. *Non vedo nessuno* è corretto; *vedo nessuno* no. La logica dell'inglese qui non vale.

**Quando la parola negativa viene prima del verbo, *non* sparisce:**
- *Nessuno è venuto.* · *Niente è cambiato.* · *Neanche io lo so.*

**Nei tempi composti** *mai, più, ancora* e *affatto* di solito stanno tra l'ausiliare e il participio, mentre *niente* e *nessuno* vanno dopo:
- *Non ho **mai** visto Venezia.* · *Non sono **più** tornato.*
- *Non ho visto **niente**.* · *Non ho incontrato **nessuno**.*

**Nessuno come aggettivo** è sempre singolare e prende le forme di *un / uno / una*: *Non c'è **nessun** problema.* · *Non ho **nessuna** idea.*

Risposte brevi: *Mai!* · *Per niente.* · *Neanch'io.*`,
    },
  },

  {
    id: 'aggettivi',
    keywords: ['aggettivi', 'aggettivo', 'accordo degli aggettivi', "posizione dell'aggettivo", 'posizione degli aggettivi',
      'bello', 'buono', 'grande', 'bel bello bella', 'quello quel', 'adjectives', 'adjective', 'adjective agreement',
      'adjective position'],
    title: { it: 'Gli aggettivi', en: 'Adjectives' },
    body: {
      en: `**Agreement.** An adjective agrees in gender and number with its noun. There are two families:

| | m. sing. | f. sing. | m. plural | f. plural |
| --- | --- | --- | --- | --- |
| in -o | rosso | rossa | rossi | rosse |
| in -e | grande | grande | grandi | grandi |

- *un libro interessante, una storia interessante, dei libri interessanti*
- A mixed group takes the masculine: *Marco e Anna sono stanchi.*
- Some colours are invariable: *rosa, viola, blu*, and *beige*: *le scarpe blu, i fiori rosa*.

**Position.** Most adjectives go **after** the noun, and colours and nationalities always do: *una macchina rossa, un vino italiano, un ragazzo simpatico*.

A handful also go before, and change meaning with the move:
- *un **grande** uomo* — a great man · *un uomo **grande*** — a big man
- *una **vecchia** amica* — a friend of many years · *un'amica **vecchia*** — an elderly friend
- *un **povero** ragazzo* — a poor (unfortunate) boy · *un ragazzo **povero*** — a poor (penniless) boy
- *un **caro** amico* — a dear friend · *un ristorante **caro*** — an expensive restaurant
- ***diversi** libri* — several books · *libri **diversi*** — different books

**Bello, buono and grande before the noun** change shape like articles.

*Bello* (and *quello*) follow the **definite** article:

| il | lo | l' | la | i | gli | le |
| --- | --- | --- | --- | --- | --- | --- |
| bel | bello | bell' | bella | bei | begli | belle |
| quel | quello | quell' | quella | quei | quegli | quelle |

*un bel ragazzo, un bello zaino, un bell'albero, una bella casa, dei bei libri, dei begli occhi, delle belle scarpe.*

*Buono* follows the **indefinite** article in the singular: *un **buon** libro, un **buon** amico* (no apostrophe), *un **buono** studente, una **buona** idea, una **buon'**amica*. The plural is regular: *buoni, buone*. Hence *buon giorno, buon appetito, buon viaggio*.

*Grande* may shorten to *gran* before a consonant and *grand'* before a vowel — *un gran signore, una gran fame, un grand'uomo* — but the full form is always correct: *un grande albero*.

After the noun, all three behave normally: *un ragazzo bello, un uomo buono, una casa grande*.`,
      it: `**L'accordo.** L'aggettivo si accorda in genere e numero con il nome. Ci sono due famiglie:

| | m. sing. | f. sing. | m. plur. | f. plur. |
| --- | --- | --- | --- | --- |
| in -o | rosso | rossa | rossi | rosse |
| in -e | grande | grande | grandi | grandi |

- *un libro interessante, una storia interessante, dei libri interessanti*
- Un gruppo misto vuole il maschile: *Marco e Anna sono stanchi.*
- Alcuni colori sono invariabili: *rosa, viola, blu*, e *beige*: *le scarpe blu, i fiori rosa*.

**La posizione.** La maggior parte degli aggettivi va **dopo** il nome, e i colori e le nazionalità sempre: *una macchina rossa, un vino italiano, un ragazzo simpatico*.

Alcuni possono andare anche prima, e cambiano significato:
- *un **grande** uomo* (importante) · *un uomo **grande*** (alto, grosso)
- *una **vecchia** amica* (di lunga data) · *un'amica **vecchia*** (anziana)
- *un **povero** ragazzo* (sfortunato) · *un ragazzo **povero*** (senza soldi)
- *un **caro** amico* (amato) · *un ristorante **caro*** (costoso)
- ***diversi** libri* (parecchi) · *libri **diversi*** (differenti)

**Bello, buono e grande prima del nome** cambiano forma come gli articoli.

*Bello* (e *quello*) seguono l'articolo **determinativo**:

| il | lo | l' | la | i | gli | le |
| --- | --- | --- | --- | --- | --- | --- |
| bel | bello | bell' | bella | bei | begli | belle |
| quel | quello | quell' | quella | quei | quegli | quelle |

*un bel ragazzo, un bello zaino, un bell'albero, una bella casa, dei bei libri, dei begli occhi, delle belle scarpe.*

*Buono* al singolare segue l'articolo **indeterminativo**: *un **buon** libro, un **buon** amico* (senza apostrofo), *un **buono** studente, una **buona** idea, una **buon'**amica*. Il plurale è regolare: *buoni, buone*. Da qui *buon giorno, buon appetito, buon viaggio*.

*Grande* può diventare *gran* davanti a consonante e *grand'* davanti a vocale — *un gran signore, una gran fame, un grand'uomo* —, ma la forma intera è sempre corretta: *un grande albero*.

Dopo il nome, tutti e tre si comportano normalmente: *un ragazzo bello, un uomo buono, una casa grande*.`,
    },
  },

  {
    id: 'futuro',
    keywords: ['futuro', 'futuro semplice', 'futuro anteriore', 'futuro di probabilità', 'futuro epistemico',
      'future', 'future tense', 'future perfect', 'going to', 'probability', 'probabilità'],
    title: { it: 'Il futuro', en: 'The future' },
    body: {
      en: `**Formation.** Take the infinitive, drop the final *-e*, and add **-ò, -ai, -à, -emo, -ete, -anno**. In -are verbs the *a* becomes *e*.

| | parlare | prendere | dormire |
| --- | --- | --- | --- |
| io | parlerò | prenderò | dormirò |
| tu | parlerai | prenderai | dormirai |
| lui / lei | parlerà | prenderà | dormirà |
| noi | parleremo | prenderemo | dormiremo |
| voi | parlerete | prenderete | dormirete |
| loro | parleranno | prenderanno | dormiranno |

Spelling keeps the sound: *cercare → cercherò, pagare → pagherò*; *cominciare → comincerò, mangiare → mangerò*.

Irregular stems, the same ones the conditional uses: *essere → sarò, avere → avrò, andare → andrò, fare → farò, dare → darò, stare → starò, dovere → dovrò, potere → potrò, sapere → saprò, vedere → vedrò, vivere → vivrò, venire → verrò, volere → vorrò, tenere → terrò, rimanere → rimarrò, bere → berrò.*

**When.** For the near future Italian happily uses the present: *Domani vado a Roma.* The future is for plans further off, predictions and promises: *L'anno prossimo andrò in Giappone. Te lo prometto, lo farò.*

After *quando, appena, se* referring to the future, Italian uses the future where English uses the present: *Quando arriverò, ti chiamerò.* — When I arrive, I'll call you.

There is no *going to* construction: *vado a mangiare* means *I'm going (off) to eat*, a real movement.

**The future of probability.** The future also makes a guess about the **present**:
- *Dov'è Marco? — **Sarà** a casa.* — He's probably at home.
- *Che ore sono? — **Saranno** le tre.* — It must be about three.
- *Quanti anni ha? — **Avrà** trent'anni.*

**The futuro anteriore** — the future of the auxiliary + the participle, *will have done* — does the same for the **past**:
- *Non risponde. **Sarà** già **uscito**.* — He must have gone out already.
- *Avrà perso il treno.* — He must have missed the train.

and, literally, for something finished before another future event: *Appena **avrò finito**, ti chiamo.*`,
      it: `**La formazione.** Si prende l'infinito, si toglie la *-e* finale e si aggiunge **-ò, -ai, -à, -emo, -ete, -anno**. Nei verbi in -are la *a* diventa *e*.

| | parlare | prendere | dormire |
| --- | --- | --- | --- |
| io | parlerò | prenderò | dormirò |
| tu | parlerai | prenderai | dormirai |
| lui / lei | parlerà | prenderà | dormirà |
| noi | parleremo | prenderemo | dormiremo |
| voi | parlerete | prenderete | dormirete |
| loro | parleranno | prenderanno | dormiranno |

L'ortografia conserva il suono: *cercare → cercherò, pagare → pagherò*; *cominciare → comincerò, mangiare → mangerò*.

Radici irregolari, le stesse del condizionale: *essere → sarò, avere → avrò, andare → andrò, fare → farò, dare → darò, stare → starò, dovere → dovrò, potere → potrò, sapere → saprò, vedere → vedrò, vivere → vivrò, venire → verrò, volere → vorrò, tenere → terrò, rimanere → rimarrò, bere → berrò.*

**Quando si usa.** Per il futuro vicino l'italiano usa volentieri il presente: *Domani vado a Roma.* Il futuro serve per i progetti più lontani, le previsioni e le promesse: *L'anno prossimo andrò in Giappone. Te lo prometto, lo farò.*

Dopo *quando, appena, se* riferiti al futuro, l'italiano usa il futuro dove l'inglese usa il presente: *Quando arriverò, ti chiamerò.*

Non esiste una costruzione come *going to*: *vado a mangiare* indica un vero spostamento.

**Il futuro di probabilità.** Il futuro serve anche a fare un'ipotesi sul **presente**:
- *Dov'è Marco? — **Sarà** a casa.*
- *Che ore sono? — **Saranno** le tre.*
- *Quanti anni ha? — **Avrà** trent'anni.*

**Il futuro anteriore** — futuro dell'ausiliare + participio — fa lo stesso per il **passato**:
- *Non risponde. **Sarà** già **uscito**.*
- *Avrà perso il treno.*

e, in senso proprio, indica un fatto concluso prima di un altro fatto futuro: *Appena **avrò finito**, ti chiamo.*`,
    },
  },

  {
    id: 'condizionale-periodo-ipotetico',
    keywords: ['condizionale', 'condizionale presente', 'condizionale passato', 'periodo ipotetico', 'frasi con se',
      'frase con se', 'se clauses', 'se clause', 'if clauses', 'if clause', 'conditional', 'conditional sentences',
      'ipotesi', 'se fossi', 'se avessi'],
    title: { it: 'Il condizionale e il periodo ipotetico', en: 'The conditional and se clauses' },
    body: {
      en: `**Formation.** The same stem as the future, with **-ei, -esti, -ebbe, -emmo, -este, -ebbero**:

*parlerei, parleresti, parlerebbe, parleremmo, parlereste, parlerebbero*

The future's irregular stems carry over: *sarei, avrei, andrei, farei, potrei, dovrei, vorrei, verrei, berrei.*

Watch the double *m*: *parleremo* is *we will speak*; *parleremmo* is *we would speak*.

**Uses.**
- **politeness**: *Vorrei un caffè. Potrebbe aiutarmi?*
- **advice**: *Dovresti riposarti.*
- **wishes**: *Mi piacerebbe vivere a Napoli.*
- **unconfirmed news**, in journalism: *Il ladro sarebbe fuggito in moto.* — reportedly fled

**The past conditional** — *avrei fatto, sarei andato* — is *would have done*. It is also what Italian uses for a **future seen from the past**, where English says *would*:
- *Ha detto che **sarebbe venuto**.* — He said he would come. (never *verrebbe*)

**Se clauses: the periodo ipotetico.** Three types, by how likely the condition is:

| | the se clause | the main clause | example |
| --- | --- | --- | --- |
| **reale** — real | present or future indicative | indicative or imperative | *Se piove, resto a casa.* · *Se avrai tempo, chiamami.* |
| **possibile** — possible | imperfect subjunctive | present conditional | *Se avessi tempo, viaggerei di più.* |
| **irreale** — contrary to fact, past | pluperfect subjunctive | past conditional | *Se avessi studiato, avrei passato l'esame.* |

They mix when the time does: *Se avessi studiato, ora **saprei** la risposta.*

**The rule to tattoo somewhere:** the conditional never goes in the *se* clause. *Se avrei tempo* is a famous mistake; it is *se avessi tempo*. And *se fossi in te* is *if I were you*.

In casual speech you will hear the imperfetto in both halves of a past hypothesis — *Se lo sapevo, te lo dicevo* — but in writing use the full form: *Se l'avessi saputo, te l'avrei detto.*`,
      it: `**La formazione.** La stessa radice del futuro, con **-ei, -esti, -ebbe, -emmo, -este, -ebbero**:

*parlerei, parleresti, parlerebbe, parleremmo, parlereste, parlerebbero*

Le radici irregolari del futuro restano: *sarei, avrei, andrei, farei, potrei, dovrei, vorrei, verrei, berrei.*

Attenzione alla doppia *m*: *parleremo* è futuro; *parleremmo* è condizionale.

**Gli usi.**
- **cortesia**: *Vorrei un caffè. Potrebbe aiutarmi?*
- **consiglio**: *Dovresti riposarti.*
- **desiderio**: *Mi piacerebbe vivere a Napoli.*
- **notizia non confermata**, nel linguaggio giornalistico: *Il ladro sarebbe fuggito in moto.*

**Il condizionale passato** — *avrei fatto, sarei andato* — è anche il modo in cui l'italiano esprime il **futuro nel passato**, dove l'inglese usa *would*:
- *Ha detto che **sarebbe venuto**.* (mai *verrebbe*)

**Il periodo ipotetico.** Tre tipi, a seconda di quanto è probabile la condizione:

| | la frase con se | la frase principale | esempio |
| --- | --- | --- | --- |
| **della realtà** | indicativo presente o futuro | indicativo o imperativo | *Se piove, resto a casa.* · *Se avrai tempo, chiamami.* |
| **della possibilità** | congiuntivo imperfetto | condizionale presente | *Se avessi tempo, viaggerei di più.* |
| **dell'irrealtà** (passato) | congiuntivo trapassato | condizionale passato | *Se avessi studiato, avrei passato l'esame.* |

Si mescolano quando i tempi si mescolano: *Se avessi studiato, ora **saprei** la risposta.*

**La regola da non dimenticare:** il condizionale non va mai nella frase con *se*. *Se avrei tempo* è un errore celebre; si dice *se avessi tempo*. E per dare un consiglio: *se fossi in te…*

Nel parlato informale si sente l'imperfetto in tutte e due le parti di un'ipotesi passata — *Se lo sapevo, te lo dicevo* —, ma nello scritto si usa la forma completa: *Se l'avessi saputo, te l'avrei detto.*`,
    },
  },

  {
    id: 'sapere-conoscere',
    keywords: ['sapere', 'conoscere', 'sapere o conoscere', 'sapere e conoscere', 'sapere vs conoscere',
      'differenza tra sapere e conoscere', 'to know'],
    title: { it: 'Sapere e conoscere', en: 'Sapere vs. conoscere' },
    body: {
      en: `Both are *to know*, and Italian never lets one stand in for the other.

**Sapere** — facts, information, and anything followed by a clause:
- *So che sei stanco.* — I know you're tired.
- *Sai dov'è la stazione?* — Do you know where the station is?
- *Non lo so.* — I don't know.

**Sapere + infinitive** = to know how to, a skill:
- *So nuotare.* — I can swim. · *Sai guidare?*

Compare *potere*, which is about permission or circumstance: *So guidare, ma oggi non posso: ho bevuto.*

**Conoscere** — being acquainted with a person, a place or a thing:
- *Conosco Marco da anni.* — I've known Marco for years.
- *Conosci Roma?* — Do you know Rome? (have you been?)
- *Conosco bene questo libro.*

**The past tenses split them further:**
- *ho conosciuto* = I **met** (for the first time): *Ho conosciuto mia moglie a Bologna.*
- *ho saputo* = I **found out**, I heard: *Ho saputo che ti sposi!*
- *sapevo, conoscevo* = I knew

*Sapere* is irregular in the present — *so, sai, sa, sappiamo, sapete, sanno* — and *conoscere* is regular, though the *c* changes sound: *conosco* with a hard [k], *conosci* with a soft [ʃ].

*Sapere di* also means *to taste* or *smell of*: *Sa di fragola.* — It tastes of strawberry.`,
      it: `Tutti e due si traducono *to know*, ma in italiano uno non può mai prendere il posto dell'altro.

**Sapere** — fatti, informazioni, e tutto ciò che è seguito da una frase:
- *So che sei stanco.*
- *Sai dov'è la stazione?*
- *Non lo so.*

**Sapere + infinito** = essere capaci di fare qualcosa:
- *So nuotare.* · *Sai guidare?*

Confronta con *potere*, che riguarda il permesso o le circostanze: *So guidare, ma oggi non posso: ho bevuto.*

**Conoscere** — avere familiarità con una persona, un luogo o una cosa:
- *Conosco Marco da anni.*
- *Conosci Roma?*
- *Conosco bene questo libro.*

**I tempi del passato li separano ancora di più:**
- *ho conosciuto* = ho incontrato per la prima volta: *Ho conosciuto mia moglie a Bologna.*
- *ho saputo* = sono venuto a sapere: *Ho saputo che ti sposi!*
- *sapevo, conoscevo* = lo stato di sapere o conoscere

*Sapere* è irregolare al presente — *so, sai, sa, sappiamo, sapete, sanno* — mentre *conoscere* è regolare, anche se la *c* cambia suono: *conosco* con la [k] dura, *conosci* con la [ʃ] dolce.

*Sapere di* vuol dire anche *avere il sapore* o *l'odore di*: *Sa di fragola.*`,
    },
  },

  {
    id: 'piacere',
    keywords: ['piacere', 'mi piace', 'mi piacciono', 'mi piace o mi piacciono', 'piace o piacciono', 'gli piace',
      'mi è piaciuto', 'to like', 'mi manchi', 'mancare'],
    title: { it: 'Piacere', en: 'Piacere: how to say "I like"' },
    body: {
      en: `*Piacere* works the other way round from *to like*. The thing you like is the **subject**; the person who likes it is an **indirect object**.

*Mi piace il caffè.* — literally *coffee is pleasing to me*.

So the verb agrees with **the thing**, not the person:
- one thing, or an infinitive → **piace**: *Mi piace la pizza. Mi piace leggere.*
- more than one thing → **piacciono**: *Mi piacciono i gatti.*

The person is an indirect pronoun:

| | |
| --- | --- |
| mi piace | I like |
| ti piace | you like |
| gli piace | he likes |
| le piace | she likes |
| Le piace | you like (formal) |
| ci piace | we like |
| vi piace | you (all) like |
| gli piace · piace loro | they like |

With a name or a stressed pronoun, use **a**: *A Marco piace il calcio. A me piace, e a te?* (*A me mi piace* says it twice — common in speech, avoided in writing.)

**Negative:** *Non mi piace il pesce.* To dislike strongly: *Odio il pesce.*

**Past:** *piacere* takes **essere**, and the participle agrees with the thing liked:
- *Mi è piaciuto il film.* · *Mi è piaciuta la pizza.*
- *Mi sono piaciuti i libri.* · *Ti sono piaciute le foto?*

**The same backwards pattern** runs through several common verbs:
- *mancare* — *Mi manchi.* — I miss you (you are missing to me)
- *servire* — *Mi serve una penna.* — I need a pen
- *interessare, sembrare, bastare* — *Non mi interessa. Mi sembra giusto. Ti basta?*
- *dispiacere* — *Mi dispiace.* — I'm sorry · *Ti dispiace se apro la finestra?* — Do you mind…?

And on its own, ***Piacere!*** is what you say on being introduced: *nice to meet you*.`,
      it: `*Piacere* funziona al contrario dell'inglese *to like*. Ciò che piace è il **soggetto**; la persona a cui piace è un **complemento indiretto**.

*Mi piace il caffè.* — cioè, *il caffè piace a me*.

Quindi il verbo si accorda con **la cosa**, non con la persona:
- una cosa, o un infinito → **piace**: *Mi piace la pizza. Mi piace leggere.*
- più cose → **piacciono**: *Mi piacciono i gatti.*

La persona è un pronome indiretto:

| | |
| --- | --- |
| mi piace | a me |
| ti piace | a te |
| gli piace | a lui |
| le piace | a lei |
| Le piace | a Lei (formale) |
| ci piace | a noi |
| vi piace | a voi |
| gli piace · piace loro | a loro |

Con un nome o un pronome tonico si usa **a**: *A Marco piace il calcio. A me piace, e a te?* (*A me mi piace* lo dice due volte: si sente nel parlato, ma nello scritto si evita.)

**Negativo:** *Non mi piace il pesce.* Per un rifiuto netto: *Odio il pesce.*

**Passato:** *piacere* vuole **essere**, e il participio si accorda con la cosa che piace:
- *Mi è piaciuto il film.* · *Mi è piaciuta la pizza.*
- *Mi sono piaciuti i libri.* · *Ti sono piaciute le foto?*

**Lo stesso schema** vale per diversi verbi comuni:
- *mancare* — *Mi manchi.*
- *servire* — *Mi serve una penna.*
- *interessare, sembrare, bastare* — *Non mi interessa. Mi sembra giusto. Ti basta?*
- *dispiacere* — *Mi dispiace.* · *Ti dispiace se apro la finestra?*

E da solo, ***Piacere!*** è quello che si dice quando si viene presentati a qualcuno.`,
    },
  },

  {
    id: 'tu-lei',
    keywords: ['tu o lei', 'tu e lei', 'tu vs lei', 'lei formale', 'dare del tu', 'dare del lei', 'il lei', 'formal you',
      'informal you', 'formale', 'informale', 'formal', 'informal', 'voi o loro', 'register'],
    title: { it: 'Tu e Lei', en: 'Tu vs. Lei: formal and informal you' },
    body: {
      en: `Italian has an informal ***tu*** and a formal ***Lei***. The formal one is, grammatically, *she*: it takes the **third-person singular** verb, and is often written with a capital letter to tell it apart.

- *Come stai?* — how are you? (to a friend)
- *Come sta?* — how are you? (to a stranger, a client, an older person)
- *Di dov'è Lei?* · *Lei è italiano?*

**Tu** for friends, family, children, pets, people your own age when you're young, and very often among colleagues.
**Lei** for strangers, shop staff and customers, officials, older people, and teachers — at least at first.

The switch has a name: ***dare del tu*** / ***dare del Lei***. *Possiamo darci del tu?* — Shall we say *tu*? · *Diamoci del tu!*

**Everything follows the third person:**
- object pronouns: ***La** chiamo domani.* · *Posso offrir**Le** un caffè?*
- possessives: *È **Sua** questa borsa?*
- imperatives, which borrow the congiuntivo: ***Venga!** · **Si accomodi.** · **Mi dica.***

Pronouns stay feminine even to a man — *La ringrazio, signor Rossi* — but adjectives and participles usually agree with the real person: *Lei è stanco, signor Rossi?* · *Lei è stanca, signora?*

**In the plural**, *voi* covers everyone, formal or not: *Cosa prendete?* A formal *Loro* survives only in very ceremonious service: *Loro desiderano?*

Some speakers in the south still use *voi* as a polite singular; you will understand it, but you don't need to use it.

When in doubt, start with *Lei*. If the other person wants *tu*, they'll say so — and the offer goes from the older or senior one to the younger.`,
      it: `L'italiano ha un ***tu*** informale e un ***Lei*** formale. Il *Lei* formale grammaticalmente è *lei*: vuole il verbo alla **terza persona singolare**, e spesso si scrive con la maiuscola per distinguerlo.

- *Come stai?* — a un amico
- *Come sta?* — a uno sconosciuto, a un cliente, a una persona anziana
- *Di dov'è Lei?* · *Lei è italiano?*

**Tu** con amici, familiari, bambini, animali, coetanei quando si è giovani, e molto spesso tra colleghi.
**Lei** con sconosciuti, commessi e clienti, impiegati pubblici, persone più anziane e insegnanti — almeno all'inizio.

Il passaggio ha un nome: ***dare del tu*** / ***dare del Lei***. *Possiamo darci del tu?* · *Diamoci del tu!*

**Tutto segue la terza persona:**
- i pronomi: ***La** chiamo domani.* · *Posso offrir**Le** un caffè?*
- i possessivi: *È **Sua** questa borsa?*
- l'imperativo, che prende il congiuntivo: ***Venga!** · **Si accomodi.** · **Mi dica.***

I pronomi restano femminili anche con un uomo — *La ringrazio, signor Rossi* —, ma aggettivi e participi di solito si accordano con la persona reale: *Lei è stanco, signor Rossi?* · *Lei è stanca, signora?*

**Al plurale** *voi* va bene per tutti, formale o no: *Cosa prendete?* Il *Loro* formale sopravvive solo in contesti molto cerimoniosi: *Loro desiderano?*

In alcune zone del Sud si usa ancora il *voi* di cortesia al singolare: va capito, ma non serve usarlo.

Nel dubbio, si comincia con il *Lei*. Se l'altro preferisce il *tu*, lo dirà — e di solito la proposta parte dalla persona più anziana o di grado più alto.`,
    },
  },

  {
    id: 'verbi-riflessivi',
    keywords: ['verbi riflessivi', 'verbo riflessivo', 'riflessivi', 'riflessivo', 'verbi pronominali', 'pronominali',
      'alzarsi', 'chiamarsi', 'mi chiamo', 'si impersonale', 'reflexive', 'reflexive verbs', 'reflexive verb',
      'pronominal verbs'],
    title: { it: 'I verbi riflessivi', en: 'Reflexive verbs' },
    body: {
      en: `A reflexive verb has **-si** on the end of its infinitive: *lavarsi, alzarsi, chiamarsi, vestirsi, divertirsi, sentirsi*.

The *si* changes with the subject:

| | lavarsi |
| --- | --- |
| io | **mi** lavo |
| tu | **ti** lavi |
| lui / lei | **si** lava |
| noi | **ci** laviamo |
| voi | **vi** lavate |
| loro | **si** lavano |

**Where the pronoun goes.** Before the conjugated verb — or attached, in the usual places:
- infinitive, with the right person: *Domani devo alzar**mi** presto.* (or *Domani **mi** devo alzare presto.*)
- affirmative imperative: *Alza**ti**! Sbriga**tevi**! Divertiamo**ci**!*
- negative *tu* imperative, either way: *Non **ti** preoccupare! / Non preoccupar**ti**!*
- formal imperative, before: ***Si** accomodi.*

**In the passato prossimo** every reflexive verb takes **essere**, and the participle agrees with the subject:
- *Mi sono alzato* (a man) · *Mi sono alzata* (a woman) · *Ci siamo divertiti* · *Anna si è vestita.*

**With parts of the body and clothes**, Italian uses the reflexive and the article where English uses a possessive: *Mi lavo le mani.* — I wash my hands. · *Marco si è rotto la gamba.*

**Reciprocal** — *each other*: *Ci vediamo domani!* · *Si sono conosciuti a Roma.*

**Some change meaning:**
- *chiamare* to call · *chiamarsi* to be called: *Come ti chiami? — Mi chiamo Luca.*
- *trovare* to find · *trovarsi* to be (somewhere), to get on: *Mi trovo bene a Torino.*
- *sentire* to hear, to feel · *sentirsi* to feel (a certain way): *Non mi sento bene.*

**Impersonal *si*** — *one*, *people*, *you* in general: *Come **si** dice…? · In Italia **si** mangia bene.* With a plural noun the verb goes plural: ***Si** vendono case.*`,
      it: `Un verbo riflessivo ha **-si** alla fine dell'infinito: *lavarsi, alzarsi, chiamarsi, vestirsi, divertirsi, sentirsi*.

Il *si* cambia con il soggetto:

| | lavarsi |
| --- | --- |
| io | **mi** lavo |
| tu | **ti** lavi |
| lui / lei | **si** lava |
| noi | **ci** laviamo |
| voi | **vi** lavate |
| loro | **si** lavano |

**Dove va il pronome.** Prima del verbo coniugato — oppure attaccato, nei soliti casi:
- all'infinito, con la persona giusta: *Domani devo alzar**mi** presto.* (oppure *Domani **mi** devo alzare presto.*)
- all'imperativo affermativo: *Alza**ti**! Sbriga**tevi**! Divertiamo**ci**!*
- all'imperativo negativo con *tu*, in tutti e due i modi: *Non **ti** preoccupare! / Non preoccupar**ti**!*
- all'imperativo formale, prima: ***Si** accomodi.*

**Al passato prossimo** tutti i verbi riflessivi vogliono **essere**, e il participio si accorda con il soggetto:
- *Mi sono alzato* (un uomo) · *Mi sono alzata* (una donna) · *Ci siamo divertiti* · *Anna si è vestita.*

**Con le parti del corpo e i vestiti** l'italiano usa il riflessivo e l'articolo dove l'inglese usa il possessivo: *Mi lavo le mani.* · *Marco si è rotto la gamba.*

**Reciproci**: *Ci vediamo domani!* · *Si sono conosciuti a Roma.*

**Alcuni cambiano significato:**
- *chiamare* · *chiamarsi*: *Come ti chiami? — Mi chiamo Luca.*
- *trovare* · *trovarsi* (essere in un luogo, stare bene o male): *Mi trovo bene a Torino.*
- *sentire* · *sentirsi* (stato fisico o d'animo): *Non mi sento bene.*

**Il *si* impersonale** — la gente in generale: *Come **si** dice…? · In Italia **si** mangia bene.* Con un nome plurale il verbo va al plurale: ***Si** vendono case.*`,
    },
  },

  {
    id: 'comparativi',
    keywords: ['comparativi', 'comparativo', 'superlativo', 'superlativi', 'superlativo assoluto', 'più di', 'più che',
      'più di o più che', 'meno di', 'tanto quanto', 'così come', 'migliore', 'meglio', 'peggiore', 'peggio', 'issimo',
      'comparatives', 'comparative', 'superlative', 'superlatives'],
    title: { it: 'Comparativi e superlativi', en: 'Comparatives and superlatives' },
    body: {
      en: `**More / less: più … di** and **meno … di** compare two people or things on one quality, and go before a noun, a pronoun or a number:
- *Marco è più alto **di** Luca.* · *Roma è più grande **di** Firenze.*
- *Sono meno stanco **di** te.* · *Costa più **di** cento euro.*
- *Di* fuses with the article: *più alto **del** fratello.*

**Più … che** is used instead when the comparison is **not** between two nouns — two adjectives, two verbs, two adverbs, two phrases with a preposition, or two quantities:
- *È più simpatico **che** bello.* — two adjectives
- *Mi piace più leggere **che** guardare la TV.* — two verbs
- *Fa più caldo a Roma **che** a Milano.* — two prepositional phrases
- *Mangio più verdura **che** carne.* — two quantities

**As … as:** *(tanto) … quanto* or *(così) … come*: *È alto quanto me.* · *È alto come suo padre.*

**The relative superlative** — *the most* — is the article + *più* + adjective, and *of / in* is **di**:
- *È il ragazzo più alto **della** classe.* · *Roma è la città più bella **d'**Italia.*
- Often followed by the congiuntivo: *il film più bello che io abbia mai visto.*

**The absolute superlative** — *very, extremely* — adds **-issimo** to the adjective, which then agrees like any other:
- *bello → bellissimo, facile → facilissimo, buono → buonissimo*
- *-co, -go* keep the hard sound: *ricco → ricchissimo, lungo → lunghissimo*
- adverbs too: *benissimo, malissimo, prestissimo*
- *molto* does the same job: *molto bello*

**Irregular forms**, used alongside the regular ones:

| | comparative | absolute |
| --- | --- | --- |
| buono | migliore (più buono) | ottimo (buonissimo) |
| cattivo | peggiore (più cattivo) | pessimo (cattivissimo) |
| grande | maggiore (più grande) | massimo (grandissimo) |
| piccolo | minore (più piccolo) | minimo (piccolissimo) |

And the adverbs: *bene → **meglio***, *male → **peggio***. *Migliore* describes a noun, *meglio* describes an action: *Questo vino è **migliore**.* · *Canti **meglio** di me.*

Never *più meglio*: *meglio* already means *more well*.`,
      it: `**Più … di** e **meno … di** confrontano due persone o cose rispetto a una qualità, e si usano davanti a un nome, un pronome o un numero:
- *Marco è più alto **di** Luca.* · *Roma è più grande **di** Firenze.*
- *Sono meno stanco **di** te.* · *Costa più **di** cento euro.*
- *Di* si unisce all'articolo: *più alto **del** fratello.*

**Più … che** si usa invece quando il confronto **non** è tra due nomi — due aggettivi, due verbi, due avverbi, due espressioni con preposizione, o due quantità:
- *È più simpatico **che** bello.* — due aggettivi
- *Mi piace più leggere **che** guardare la TV.* — due verbi
- *Fa più caldo a Roma **che** a Milano.* — due complementi
- *Mangio più verdura **che** carne.* — due quantità

**Uguaglianza:** *(tanto) … quanto* o *(così) … come*: *È alto quanto me.* · *È alto come suo padre.*

**Il superlativo relativo** è articolo + *più* + aggettivo, con **di**:
- *È il ragazzo più alto **della** classe.* · *Roma è la città più bella **d'**Italia.*
- Spesso seguito dal congiuntivo: *il film più bello che io abbia mai visto.*

**Il superlativo assoluto** aggiunge **-issimo** all'aggettivo, che poi si accorda normalmente:
- *bello → bellissimo, facile → facilissimo, buono → buonissimo*
- *-co, -go* conservano il suono duro: *ricco → ricchissimo, lungo → lunghissimo*
- anche con gli avverbi: *benissimo, malissimo, prestissimo*
- *molto* fa lo stesso lavoro: *molto bello*

**Forme irregolari**, che convivono con quelle regolari:

| | comparativo | superlativo assoluto |
| --- | --- | --- |
| buono | migliore (più buono) | ottimo (buonissimo) |
| cattivo | peggiore (più cattivo) | pessimo (cattivissimo) |
| grande | maggiore (più grande) | massimo (grandissimo) |
| piccolo | minore (più piccolo) | minimo (piccolissimo) |

E gli avverbi: *bene → **meglio***, *male → **peggio***. *Migliore* accompagna un nome, *meglio* un'azione: *Questo vino è **migliore**.* · *Canti **meglio** di me.*

Mai *più meglio*: *meglio* è già un comparativo.`,
    },
  },

  {
    id: 'da-per',
    keywords: ['da quanto tempo', 'da o per', 'da e per', 'da vs per', 'da più presente', 'per quanto tempo', 'anni fa',
      'tempo fa', 'for how long', 'how long', 'since', 'ago', 'duration', 'durata'],
    title: { it: 'Da, per e fa: parlare della durata', en: 'Da, per and fa: talking about time' },
    body: {
      en: `**Da + the present** — something that started in the past and is **still going on**. English uses the present perfect; Italian uses the present.

- *Studio italiano **da** due anni.* — I have been studying Italian for two years (and still am).
- *Abito qui **da** marzo.* — I've lived here since March.
- *Ti conosco **da** sempre.* — I've known you forever.
- *Da quanto tempo aspetti? — Aspetto **da** mezz'ora.* — How long have you been waiting?

The same idea with ***è / sono … che***: *Sono due anni che studio italiano.* · *È un'ora che ti aspetto.*

The mistake to avoid is copying the English tense: *ho studiato italiano da due anni* does not say *I have been studying*. Keep the present.

**Da + the imperfetto** pushes the same idea into the past — *had been doing*:
- *Aspettavo **da** un'ora quando è arrivato.* — I had been waiting for an hour when he arrived.

**Per** — a stretch of time that is **closed**: it ended, or it is planned with an end.
- *Ho studiato italiano **per** due anni.* — I studied it for two years (and stopped).
- *Resterò a Roma **per** una settimana.*
- *Per* can often be dropped: *Ho dormito otto ore.*

**Fa** — *ago*. It goes **after** the length of time:
- *Sono arrivato due anni **fa**.* · *L'ho visto poco **fa**.*

**Tra / fra** — *in* (from now): *Parto **tra** due giorni.* — I'm leaving in two days.`,
      it: `**Da + presente** — qualcosa che è cominciato nel passato e **continua ancora**. L'inglese usa il present perfect; l'italiano il presente.

- *Studio italiano **da** due anni.*
- *Abito qui **da** marzo.*
- *Ti conosco **da** sempre.*
- *Da quanto tempo aspetti? — Aspetto **da** mezz'ora.*

La stessa idea con ***è / sono … che***: *Sono due anni che studio italiano.* · *È un'ora che ti aspetto.*

L'errore da evitare è copiare il tempo inglese: *ho studiato italiano da due anni* non vuol dire che lo studi ancora. Resta al presente.

**Da + imperfetto** sposta la stessa idea nel passato:
- *Aspettavo **da** un'ora quando è arrivato.*

**Per** — un periodo **chiuso**: è finito, oppure è previsto con una fine.
- *Ho studiato italiano **per** due anni.* (e poi ho smesso)
- *Resterò a Roma **per** una settimana.*
- Spesso *per* si può omettere: *Ho dormito otto ore.*

**Fa** — si mette **dopo** l'indicazione di tempo:
- *Sono arrivato due anni **fa**.* · *L'ho visto poco **fa**.*

**Tra / fra** — a partire da adesso: *Parto **tra** due giorni.*`,
    },
  },

  {
    id: 'accenti-doppie',
    keywords: ['accenti', 'accento', 'accento grave', 'accento acuto', 'accento scritto', 'doppie', 'le doppie',
      'consonanti doppie', 'doppia consonante', 'è o e', 'è e e', 'perché o perche', 'apostrofo', "qual è", 'ortografia',
      'pronuncia', 'accents', 'written accents', 'double consonants', 'double letters', 'spelling', 'apostrophe',
      'pronunciation'],
    title: { it: 'Doppie, accenti e apostrofo', en: 'Double consonants and written accents' },
    body: {
      en: `**Double consonants** are written double because they are **said** long: the sound is held, or the mouth stops for a beat before it. They change meaning, so they are worth the effort:
- *caro* (dear) · *carro* (cart)
- *sete* (thirst) · *sette* (seven)
- *nono* (ninth) · *nonno* (grandfather)
- *capello* (a hair) · *cappello* (a hat)
- *pena* (pity) · *penna* (pen)
- *note* (notes) · *notte* (night)

Say *anno* (year) with a firmly held *n*, especially in *Buon anno!* — a single *n* turns it into a word you'd rather not say.

**Written accents** appear in two places only.

1. **On a final stressed vowel**: *città, perché, caffè, università, virtù, però, così, ventitré*. Leave it off and the word is misspelt.
2. **On a few one-syllable words**, to tell them from a twin:

| with an accent | without |
| --- | --- |
| **è** — is | **e** — and |
| **dà** — gives | **da** — from |
| **là, lì** — there | **la** — the, her · **li** — them |
| **sì** — yes | **si** — oneself, one |
| **né** — nor | **ne** — of it |
| **sé** — oneself | **se** — if |
| **tè** — tea | **te** — you |

Other short words take none: *qui, qua, su, fa, va, sto, so, tre, blu, re*. (But *ventitré, trentatré*: once *tre* ends a longer word, the stress is final and it is written.)

**Grave or acute?** On *a, i, o, u* the accent is grave: *à, ì, ò, ù*. On *e* it depends on the sound: **é** is closed, **è** is open. In practice, **é** appears in *perché, poiché, affinché, benché, né, sé* and the numbers in *-tré*; nearly everything else is **è**: *è, caffè, tè, cioè*.

The capital is ***È***, not *E'*.

**Accent or apostrophe?** *Un po'* (short for *poco*) takes an apostrophe; *pò* does not exist. And ***qual è*** has no apostrophe at all: *qual* is a form that stands on its own, like *qual buon vento*.

Stress inside a word is never written in normal spelling — *telefono, parlano, macchina* are all stressed on the first syllable without a mark. Dictionaries mark it to separate pairs like *àncora* (anchor) and *ancóra* (still).`,
      it: `**Le doppie** si scrivono doppie perché si **pronunciano** lunghe: il suono si tiene, o la bocca si ferma un attimo prima di pronunciarlo. Cambiano il significato, quindi meritano attenzione:
- *caro* · *carro*
- *sete* · *sette*
- *nono* · *nonno*
- *capello* · *cappello*
- *pena* · *penna*
- *note* · *notte*

*Anno* va pronunciato con una *n* ben tenuta, soprattutto in *Buon anno!*: con una *n* sola diventa un'altra parola.

**L'accento scritto** compare solo in due casi.

1. **Sulla vocale finale accentata**: *città, perché, caffè, università, virtù, però, così, ventitré*. Senza accento la parola è sbagliata.
2. **Su alcuni monosillabi**, per distinguerli da un gemello:

| con l'accento | senza |
| --- | --- |
| **è** — verbo | **e** — congiunzione |
| **dà** — verbo | **da** — preposizione |
| **là, lì** — avverbi | **la** — articolo, pronome · **li** — pronome |
| **sì** — affermazione | **si** — pronome |
| **né** — congiunzione negativa | **ne** — pronome |
| **sé** — pronome tonico | **se** — congiunzione |
| **tè** — bevanda | **te** — pronome |

Gli altri monosillabi non lo vogliono: *qui, qua, su, fa, va, sto, so, tre, blu, re*. (Ma *ventitré, trentatré*: quando *tre* chiude una parola più lunga, l'accento cade sull'ultima sillaba e si scrive.)

**Grave o acuto?** Su *a, i, o, u* l'accento è grave: *à, ì, ò, ù*. Sulla *e* dipende dal suono: **é** è chiusa, **è** è aperta. In pratica **é** si trova in *perché, poiché, affinché, benché, né, sé* e nei numeri in *-tré*; quasi tutto il resto vuole **è**: *è, caffè, tè, cioè*.

La maiuscola è ***È***, non *E'*.

**Accento o apostrofo?** *Un po'* (troncamento di *poco*) vuole l'apostrofo; *pò* non esiste. E ***qual è*** non ha nessun apostrofo: *qual* è una forma che sta in piedi da sola, come in *qual buon vento*.

L'accento all'interno della parola nella grafia normale non si scrive mai — *telefono, parlano, macchina* sono tutte accentate sulla prima sillaba senza alcun segno. I dizionari lo segnano per distinguere coppie come *àncora* e *ancóra*.`,
    },
  },
];

/**
 * The counterparts to the profe's interjections, fired on the same three
 * moments: a word found (good), a question outside what the tutor covers
 * (bad), and a verb hairy enough to deserve a reaction (wow).
 *
 * *Magari lo sapessi!* — "if only I knew!" — is the gentlest way an Italian
 * teacher admits a gap, which is exactly the moment the bad ones are for.
 */
export const EXCLAMATIONS = {
  good: ['Ecco qua!', 'Perfetto!', 'Ottimo!', 'Bravo!'],
  bad: ['Accidenti!', 'Ahimè!', 'Magari lo sapessi!'],
  wow: ['Mamma mia!', 'Caspita!', 'Accipicchia!'],
};

/**
 * Conversational openers the tutor answers without looking anything up.
 *
 * Matched against the folded question, so accents are already gone. *Ciao*
 * is both hello and goodbye in Italian; a lone *ciao* is read as a greeting,
 * a doubled *ciao ciao* as a goodbye, which is how it is used.
 */
export const SMALL_TALK = [
  {
    match: /^(ciao(?!\s+ciao)|buongiorno|buon giorno|buonasera|buona sera|salve|hey|hi|hello|come stai|come va|come sta)\b/,
    reply: {
      it: 'Ciao! Posso coniugare verbi, cercare parole nel dizionario, tradurre frasi e spiegarti la grammatica. Da dove cominciamo?',
      en: 'Hello! I can conjugate verbs, look words up in the dictionary, translate phrases and explain grammar. Where would you like to start?',
    },
  },
  {
    match: /^(grazie|grazie mille|thanks|thank you|ok|okay|va bene|perfetto|ottimo|fantastico|benissimo)\b/,
    reply: {
      it: 'Figurati! Chiedimi pure tutto quello che vuoi.',
      en: "You're welcome. Ask me anything else you need.",
    },
  },
  {
    match: /^(arrivederci|ciao ciao|a presto|a dopo|buonanotte|buona notte|buona giornata|bye|goodbye)\b/,
    reply: {
      it: 'A presto! E buono studio con l’italiano.',
      en: 'See you! Good luck with your Italian.',
    },
  },
];
