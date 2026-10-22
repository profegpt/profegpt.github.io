/**
 * Verb data for the Italian conjugation engine.
 *
 * Built the way the French file next to it is, and divided along Italian
 * lines rather than French ones:
 *
 *   ISC_VERBS      — the -ire verbs that take the -isc- infix (capire → capisco).
 *                    A closed list, because *dormire* and *capire* cannot be
 *                    told apart from the outside.
 *   STRESSED_IARE  — the -iare verbs whose i carries the stress (inviare →
 *                    tu invii), against the far larger family that loses it
 *                    (studiare → tu studi).
 *   IRREGULARS     — explicit forms and stems.
 *   PREFIXABLE     — bases whose irregularity is inherited by derivatives.
 *   NOT_DERIVED    — verbs that merely end like one of those bases.
 *   ESSERE_VERBS   — the verbs whose compound tenses take essere.
 *   COMMON_VERBS   — the search index for the conjugator page.
 *
 * Everything a rule can produce — the three regular patterns, -isc-,
 * -care/-gare, -ciare/-giare, -iare, and the contracted infinitives -durre,
 * -porre and -trarre — lives in lib/conjugator-it.js instead.
 */

/** Model verbs on the conjugator's three tabs. */
export const MODEL_VERBS = {
  are: { verb: 'parlare', gloss: 'to speak' },
  ere: { verb: 'credere', gloss: 'to believe' },
  ire: { verb: 'dormire', gloss: 'to sleep' },
};

/**
 * -ire verbs conjugated like *capire* rather than like *dormire*: -isc- goes
 * in before every ending that carries the stress on the stem — the singular
 * and the third plural of the present, both subjunctive and imperative. Latin
 * inchoatives and later analogy put a verb here, not its spelling, so the
 * list has to be closed. A handful (applaudire, assorbire, inghiottire,
 * nutrire) are correct either way and are left to the dormire pattern.
 */
export const ISC_VERBS = new Set([
  'abolire', 'aderire', 'agire', 'ammonire', 'ardire', 'arricchire', 'arrossire',
  'attribuire', 'blandire', 'brandire', 'capire', 'chiarire', 'colpire', 'condire',
  'conferire', 'contribuire', 'costruire', 'custodire', 'definire', 'demolire',
  'differire', 'digerire', 'dimagrire', 'diminuire', 'distribuire', 'esaurire',
  'esibire', 'fallire', 'favorire', 'ferire', 'finire', 'fiorire', 'fornire',
  'garantire', 'gestire', 'gioire', 'guarire', 'impallidire', 'impazzire',
  'impedire', 'incuriosire', 'influire', 'ingerire', 'ingrandire', 'inserire',
  'interferire', 'intuire', 'investire', 'irrigidire', 'istituire', 'istruire',
  'obbedire', 'ordire', 'percepire', 'preferire', 'proibire', 'pulire', 'punire',
  'reagire', 'restituire', 'ricostruire', 'riferire', 'rifinire', 'ringiovanire',
  'ripulire', 'rispedire', 'riunire', 'sbalordire', 'sbiadire', 'scolpire',
  'smarrire', 'sostituire', 'sparire', 'spedire', 'stabilire', 'starnutire',
  'stupire', 'subire', 'suggerire', 'tradire', 'trasferire', 'ubbidire', 'unire',
]);

/**
 * -iare verbs whose i is stressed in the singular: io invìo, tu invìi. The i
 * is a vowel of its own here, so it survives before the -i of the second
 * person and the -ino of the subjunctive, where *studiare*'s merely
 * orthographic i does not (tu studi, che studino).
 */
export const STRESSED_IARE = new Set([
  'inviare', 'rinviare', 'avviare', 'deviare', 'sviare', 'fuorviare', 'spiare',
  'espiare', 'obliare', 'sciare',
]);

/**
 * Explicit irregularity. Every field is optional; anything absent is generated.
 *
 *   full               the longer infinitive the verb was contracted from
 *                      (fare ← facere, dire ← dicere, bere ← bevere). The
 *                      imperfect, the weak passato remoto, the subjunctive
 *                      imperfect and the gerund are all regular from it.
 *   presente           full six-person present indicative. When given, the
 *                      present subjunctive is built from its first person
 *                      (vengo → venga) unless `congiuntivo` says otherwise.
 *   imperfetto         full imperfect (only essere needs it)
 *   futuroStem         stem for the future and conditional (venire → verr-)
 *   remoto             full passato remoto
 *   remotoStrong       the strong stem of a "1-3-3" passato remoto: only the
 *                      io, lui and loro forms use it (presi, prese, presero);
 *                      the other three are regular from the weak stem
 *                      (prendesti, prendemmo, prendeste).
 *   congiuntivo        full present subjunctive
 *   congImperfettoStem stem for the imperfect subjunctive (essere → fo-ssi)
 *   participio / gerundio / participioPresente
 *   imperativo         [tu, lei, noi, voi] when the defaults do not apply
 *   defective          persons that do not exist (weather verbs)
 *   display            how a base that is not itself a word is named (-durre)
 */
export const IRREGULARS = {
  essere: {
    presente: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
    imperfetto: ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano'],
    remoto: ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono'],
    futuroStem: 'sar',
    congiuntivo: ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano'],
    congImperfettoStem: 'fo',
    participio: 'stato',
    participioPresente: null,
    imperativo: ['sii', 'sia', 'siamo', 'siate'],
  },
  avere: {
    presente: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
    remotoStrong: 'ebb',
    futuroStem: 'avr',
    congiuntivo: ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano'],
    imperativo: ['abbi', 'abbia', 'abbiamo', 'abbiate'],
  },
  andare: {
    presente: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'],
    futuroStem: 'andr',
    imperativo: ["va'", 'vada', 'andiamo', 'andate'],
  },
  fare: {
    full: 'facere',
    presente: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'],
    futuroStem: 'far',
    remotoStrong: 'fec',
    participio: 'fatto',
    imperativo: ["fa'", 'faccia', 'facciamo', 'fate'],
  },
  dare: {
    presente: ['do', 'dai', 'dà', 'diamo', 'date', 'danno'],
    remoto: ['diedi', 'desti', 'diede', 'demmo', 'deste', 'diedero'],
    futuroStem: 'dar',
    congiuntivo: ['dia', 'dia', 'dia', 'diamo', 'diate', 'diano'],
    congImperfettoStem: 'de',
    imperativo: ["da'", 'dia', 'diamo', 'date'],
  },
  stare: {
    presente: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'],
    remoto: ['stetti', 'stesti', 'stette', 'stemmo', 'steste', 'stettero'],
    futuroStem: 'star',
    congiuntivo: ['stia', 'stia', 'stia', 'stiamo', 'stiate', 'stiano'],
    congImperfettoStem: 'ste',
    imperativo: ["sta'", 'stia', 'stiamo', 'state'],
  },
  dire: {
    full: 'dicere',
    presente: ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono'],
    remotoStrong: 'diss',
    participio: 'detto',
    imperativo: ["di'", 'dica', 'diciamo', 'dite'],
  },
  venire: {
    presente: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono'],
    futuroStem: 'verr',
    remotoStrong: 'venn',
    participio: 'venuto',
  },
  tenere: {
    presente: ['tengo', 'tieni', 'tiene', 'teniamo', 'tenete', 'tengono'],
    futuroStem: 'terr',
    remotoStrong: 'tenn',
  },
  // The modals have no imperative: nobody is ordered to be able to.
  volere: {
    presente: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'],
    futuroStem: 'vorr',
    remotoStrong: 'voll',
    imperativo: [null, null, null, null],
  },
  potere: {
    presente: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'],
    futuroStem: 'potr',
    imperativo: [null, null, null, null],
  },
  dovere: {
    presente: ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono'],
    futuroStem: 'dovr',
    congiuntivo: ['debba', 'debba', 'debba', 'dobbiamo', 'dobbiate', 'debbano'],
    imperativo: [null, null, null, null],
  },
  sapere: {
    presente: ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno'],
    futuroStem: 'sapr',
    remotoStrong: 'sepp',
    congiuntivo: ['sappia', 'sappia', 'sappia', 'sappiamo', 'sappiate', 'sappiano'],
    imperativo: ['sappi', 'sappia', 'sappiamo', 'sappiate'],
  },
  // The stressed u of the stem opens to e: esco, but usciamo.
  uscire: {
    presente: ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono'],
  },
  bere: {
    full: 'bevere',
    futuroStem: 'berr',
    remotoStrong: 'bevv',
  },
  // porre, trarre and the -durre verbs are contracted from ponere, traere and
  // -ducere; the engine knows those three by rule, so only what the long
  // infinitive cannot explain is listed.
  porre: {
    presente: ['pongo', 'poni', 'pone', 'poniamo', 'ponete', 'pongono'],
    remotoStrong: 'pos',
    participio: 'posto',
  },
  trarre: {
    presente: ['traggo', 'trai', 'trae', 'traiamo', 'traete', 'traggono'],
    remotoStrong: 'trass',
    participio: 'tratto',
  },
  // condurre, produrre, tradurre, ridurre, introdurre, sedurre … none of them
  // is the base, which is not a word on its own — the French cevoir again.
  durre: {
    remotoStrong: 'duss',
    participio: 'dotto',
    display: '-durre',
  },
  rimanere: {
    presente: ['rimango', 'rimani', 'rimane', 'rimaniamo', 'rimanete', 'rimangono'],
    futuroStem: 'rimarr',
    remotoStrong: 'rimas',
    participio: 'rimasto',
  },
  salire: {
    presente: ['salgo', 'sali', 'sale', 'saliamo', 'salite', 'salgono'],
  },
  // -gliere: the gl turns to lg before the back vowels of io and loro.
  scegliere: {
    presente: ['scelgo', 'scegli', 'sceglie', 'scegliamo', 'scegliete', 'scelgono'],
    remotoStrong: 'scels',
    participio: 'scelto',
  },
  cogliere: {
    presente: ['colgo', 'cogli', 'coglie', 'cogliamo', 'cogliete', 'colgono'],
    remotoStrong: 'cols',
    participio: 'colto',
  },
  togliere: {
    presente: ['tolgo', 'togli', 'toglie', 'togliamo', 'togliete', 'tolgono'],
    remotoStrong: 'tols',
    participio: 'tolto',
  },
  sciogliere: {
    presente: ['sciolgo', 'sciogli', 'scioglie', 'sciogliamo', 'sciogliete', 'sciolgono'],
    remotoStrong: 'sciols',
    participio: 'sciolto',
  },
  valere: {
    presente: ['valgo', 'vali', 'vale', 'valiamo', 'valete', 'valgono'],
    futuroStem: 'varr',
    remotoStrong: 'vals',
    participio: 'valso',
  },
  parere: {
    presente: ['paio', 'pari', 'pare', 'pariamo', 'parete', 'paiono'],
    futuroStem: 'parr',
    remotoStrong: 'parv',
    congiuntivo: ['paia', 'paia', 'paia', 'paiamo', 'paiate', 'paiano'],
    participio: 'parso',
  },
  apparire: {
    presente: ['appaio', 'appari', 'appare', 'appariamo', 'apparite', 'appaiono'],
    remotoStrong: 'apparv',
    participio: 'apparso',
  },
  morire: {
    presente: ['muoio', 'muori', 'muore', 'moriamo', 'morite', 'muoiono'],
    participio: 'morto',
  },
  sedere: {
    presente: ['siedo', 'siedi', 'siede', 'sediamo', 'sedete', 'siedono'],
  },
  udire: {
    presente: ['odo', 'odi', 'ode', 'udiamo', 'udite', 'odono'],
  },
  // -cere doubles its c where the ending is a back vowel: piaccio, piacciono.
  piacere: {
    presente: ['piaccio', 'piaci', 'piace', 'piacciamo', 'piacete', 'piacciono'],
    remotoStrong: 'piacqu',
  },
  tacere: {
    presente: ['taccio', 'taci', 'tace', 'tacciamo', 'tacete', 'tacciono'],
    remotoStrong: 'tacqu',
  },
  giacere: {
    presente: ['giaccio', 'giaci', 'giace', 'giacciamo', 'giacete', 'giacciono'],
    remotoStrong: 'giacqu',
  },
  cuocere: {
    presente: ['cuocio', 'cuoci', 'cuoce', 'cuociamo', 'cuocete', 'cuociono'],
    remotoStrong: 'coss',
    participio: 'cotto',
  },
  spegnere: {
    presente: ['spengo', 'spegni', 'spegne', 'spegniamo', 'spegnete', 'spengono'],
    remotoStrong: 'spens',
    participio: 'spento',
  },
  nascere: { remotoStrong: 'nacqu', participio: 'nato' },
  conoscere: { remotoStrong: 'conobb' },
  crescere: { remotoStrong: 'crebb' },
  cadere: { futuroStem: 'cadr', remotoStrong: 'cadd' },
  godere: { futuroStem: 'godr' },
  vivere: { futuroStem: 'vivr', remotoStrong: 'viss', participio: 'vissuto' },
  vedere: { futuroStem: 'vedr', remotoStrong: 'vid', participio: 'visto' },
  piovere: {
    presente: [null, null, 'piove', null, null, null],
    remotoStrong: 'piovv',
    congiuntivo: [null, null, 'piova', null, null, null],
    imperativo: [null, null, null, null],
    defective: ['io', 'tu', 'noi', 'voi', 'loro'],
  },

  // The great body of -ere verbs is regular everywhere but the passato
  // remoto and the participle, which is all these record.
  prendere: { remotoStrong: 'pres', participio: 'preso' },
  rendere: { remotoStrong: 'res', participio: 'reso' },
  tendere: { remotoStrong: 'tes', participio: 'teso' },
  scendere: { remotoStrong: 'sces', participio: 'sceso' },
  accendere: { remotoStrong: 'acces', participio: 'acceso' },
  spendere: { remotoStrong: 'spes', participio: 'speso' },
  mettere: { remotoStrong: 'mis', participio: 'messo' },
  chiudere: { remotoStrong: 'chius', participio: 'chiuso' },
  cludere: { remotoStrong: 'clus', participio: 'cluso', display: '-cludere' },
  rispondere: { remotoStrong: 'rispos', participio: 'risposto' },
  nascondere: { remotoStrong: 'nascos', participio: 'nascosto' },
  chiedere: { remotoStrong: 'chies', participio: 'chiesto' },
  leggere: { remotoStrong: 'less', participio: 'letto' },
  reggere: { remotoStrong: 'ress', participio: 'retto' },
  proteggere: { remotoStrong: 'protess', participio: 'protetto' },
  struggere: { remotoStrong: 'struss', participio: 'strutto' },
  scrivere: { remotoStrong: 'scriss', participio: 'scritto' },
  correre: { remotoStrong: 'cors', participio: 'corso' },
  perdere: { remotoStrong: 'pers', participio: 'perso' },
  rompere: { remotoStrong: 'rupp', participio: 'rotto' },
  decidere: { remotoStrong: 'decis', participio: 'deciso' },
  dividere: { remotoStrong: 'divis', participio: 'diviso' },
  uccidere: { remotoStrong: 'uccis', participio: 'ucciso' },
  ridere: { remotoStrong: 'ris', participio: 'riso' },
  muovere: { remotoStrong: 'moss', participio: 'mosso' },
  vincere: { remotoStrong: 'vins', participio: 'vinto' },
  torcere: { remotoStrong: 'tors', participio: 'torto' },
  giungere: { remotoStrong: 'giuns', participio: 'giunto' },
  piangere: { remotoStrong: 'pians', participio: 'pianto' },
  spingere: { remotoStrong: 'spins', participio: 'spinto' },
  dipingere: { remotoStrong: 'dipins', participio: 'dipinto' },
  fingere: { remotoStrong: 'fins', participio: 'finto' },
  stinguere: { remotoStrong: 'stins', participio: 'stinto', display: '-stinguere' },
  volgere: { remotoStrong: 'vols', participio: 'volto' },
  corgere: { remotoStrong: 'cors', participio: 'corto', display: '-corgere' },
  sorgere: { remotoStrong: 'sors', participio: 'sorto' },
  porgere: { remotoStrong: 'pors', participio: 'porto' },
  spargere: { remotoStrong: 'spars', participio: 'sparso' },
  mergere: { remotoStrong: 'mers', participio: 'merso', display: '-mergere' },
  fondere: { remotoStrong: 'fus', participio: 'fuso' },
  mordere: { remotoStrong: 'mors', participio: 'morso' },
  discutere: { remotoStrong: 'discuss', participio: 'discusso' },
  succedere: { remotoStrong: 'success', participio: 'successo' },
  concedere: { remotoStrong: 'concess', participio: 'concesso' },
  primere: { remotoStrong: 'press', participio: 'presso', display: '-primere' },
  sumere: { remotoStrong: 'suns', participio: 'sunto', display: '-sumere' },
  solvere: { remotoStrong: 'sols', participio: 'solto', display: '-solvere' },
  // esistere, insistere, resistere … regular, but for a participle in -ito
  // where every other -ere verb has -uto.
  sistere: { participio: 'sistito', display: '-sistere' },

  // -rire verbs with a strong participle and nothing else out of place.
  aprire: { participio: 'aperto' },
  coprire: { participio: 'coperto' },
  offrire: { participio: 'offerto' },
  soffrire: { participio: 'sofferto' },
};

/**
 * Bases whose irregularity is inherited by prefixed derivatives, so *ottenere*
 * comes free from *tenere* and *tradurre* from *-durre*. The longest base that
 * ends a verb wins, which is what sends *sorprendere* to *prendere* rather
 * than to *rendere*.
 *
 * Unlike French, an Italian prefix can move the written accent: *fa* is a
 * monosyllable, but *rifà* is not and has to show its stress. The engine adds
 * it; the data stays in its plain form.
 *
 * dare, stare, avere and essere are left out on purpose. Too many ordinary
 * verbs merely end in them — guardare, costare, ricordare — and the few real
 * derivatives (ridare, sottostare, riavere) are rare enough not to be worth
 * the false matches.
 */
export const PREFIXABLE = [
  'fare', 'dire', 'venire', 'tenere', 'porre', 'trarre', 'durre', 'rimanere',
  'salire', 'scegliere', 'cogliere', 'togliere', 'sciogliere', 'valere', 'parere',
  'apparire', 'morire', 'sedere', 'piacere', 'tacere', 'giacere', 'cuocere',
  'spegnere', 'nascere', 'conoscere', 'crescere', 'cadere', 'vivere', 'vedere',
  'prendere', 'rendere', 'tendere', 'scendere', 'accendere', 'spendere', 'mettere',
  'chiudere', 'cludere', 'rispondere', 'nascondere', 'chiedere', 'leggere', 'reggere',
  'struggere', 'scrivere', 'correre', 'perdere', 'rompere', 'decidere', 'dividere',
  'ridere', 'muovere', 'vincere', 'torcere', 'giungere', 'piangere', 'spingere',
  'dipingere', 'fingere', 'stinguere', 'volgere', 'corgere', 'sorgere', 'porgere',
  'spargere', 'mergere', 'fondere', 'mordere', 'primere', 'sumere', 'solvere',
  'sistere', 'aprire', 'coprire', 'offrire', 'soffrire', 'uscire',
];

/**
 * Verbs that end like a base in PREFIXABLE without being built on it:
 * *ardire* is an -isc- verb, not a prefixed *dire*.
 */
export const NOT_DERIVED = new Set([
  'ardire', 'ordire', 'blandire', 'brandire', 'condire', 'stridere', 'provvedere',
]);

/**
 * Verbs whose compound tenses take *essere*, plus every reflexive verb.
 *
 * Many of these take *avere* when used transitively — *ho salito le scale*
 * against *sono salito*, *ho cresciuto due figli* against *sono cresciuto* —
 * and a few weather and duration verbs accept either. As with the French
 * table, the table gives the intransitive reading and the grammar note covers
 * the rest. Derivatives are listed by name, because a prefix can change the
 * auxiliary: *venire* takes essere, *convenire* in the sense of "agree"
 * usually takes avere, *mantenere* always does.
 */
export const ESSERE_VERBS = new Set([
  'essere', 'stare', 'andare', 'venire', 'divenire', 'avvenire', 'svenire',
  'provenire', 'intervenire', 'arrivare', 'partire', 'ripartire', 'uscire',
  'riuscire', 'entrare', 'rientrare', 'tornare', 'ritornare', 'restare', 'rimanere',
  'nascere', 'rinascere', 'morire', 'diventare', 'cadere', 'accadere', 'scadere',
  'salire', 'scendere', 'succedere', 'capitare', 'piacere', 'dispiacere',
  'sembrare', 'parere', 'apparire', 'scomparire', 'sparire', 'costare', 'bastare',
  'dipendere', 'esistere', 'crescere', 'invecchiare', 'ingrassare', 'dimagrire',
  'impazzire', 'fuggire', 'scappare', 'emergere', 'sorgere', 'giungere', 'piovere',
  'occorrere', 'evadere',
]);

/** Search index: [infinitive, English gloss]. Reflexives are given as such. */
export const COMMON_VERBS = [
  ['essere', 'to be'],
  ['avere', 'to have'],
  ['andare', 'to go'],
  ['fare', 'to do, to make'],
  ['dire', 'to say, to tell'],
  ['potere', 'to be able to'],
  ['volere', 'to want'],
  ['dovere', 'to have to, to owe'],
  ['sapere', 'to know (a fact)'],
  ['conoscere', 'to know (be familiar with)'],
  ['vedere', 'to see'],
  ['venire', 'to come'],
  ['dare', 'to give'],
  ['stare', 'to stay, to be'],
  ['tenere', 'to hold, to keep'],
  ['prendere', 'to take'],
  ['mettere', 'to put'],
  ['parlare', 'to speak'],
  ['credere', 'to believe'],
  ['dormire', 'to sleep'],
  ['amare', 'to love'],
  ['pensare', 'to think'],
  ['trovare', 'to find'],
  ['passare', 'to pass, to spend (time)'],
  ['chiamare', 'to call'],
  ['chiamarsi', 'to be called'],
  ['portare', 'to carry, to bring, to wear'],
  ['guardare', 'to watch, to look at'],
  ['ascoltare', 'to listen'],
  ['aspettare', 'to wait for'],
  ['lavorare', 'to work'],
  ['abitare', 'to live (somewhere)'],
  ['arrivare', 'to arrive'],
  ['entrare', 'to enter'],
  ['tornare', 'to return'],
  ['ritornare', 'to come back'],
  ['restare', 'to stay, to remain'],
  ['diventare', 'to become'],
  ['sembrare', 'to seem'],
  ['lasciare', 'to leave, to let'],
  ['comprare', 'to buy'],
  ['pagare', 'to pay'],
  ['cercare', 'to look for'],
  ['giocare', 'to play (a game)'],
  ['suonare', 'to play (an instrument), to ring'],
  ['cantare', 'to sing'],
  ['ballare', 'to dance'],
  ['nuotare', 'to swim'],
  ['camminare', 'to walk'],
  ['viaggiare', 'to travel'],
  ['mangiare', 'to eat'],
  ['cominciare', 'to begin'],
  ['incominciare', 'to begin'],
  ['baciare', 'to kiss'],
  ['abbracciare', 'to hug'],
  ['lanciare', 'to throw'],
  ['annunciare', 'to announce'],
  ['noleggiare', 'to rent (a car, a bike)'],
  ['parcheggiare', 'to park'],
  ['festeggiare', 'to celebrate'],
  ['assaggiare', 'to taste'],
  ['studiare', 'to study'],
  ['cambiare', 'to change'],
  ['consigliare', 'to advise'],
  ['sbagliare', 'to make a mistake'],
  ['tagliare', 'to cut'],
  ['svegliare', 'to wake (someone)'],
  ['svegliarsi', 'to wake up'],
  ['inviare', 'to send'],
  ['sciare', 'to ski'],
  ['spiare', 'to spy on'],
  ['dimenticare', 'to forget'],
  ['spiegare', 'to explain'],
  ['pregare', 'to pray, to beg'],
  ['litigare', 'to argue'],
  ['toccare', 'to touch'],
  ['mancare', 'to miss, to be lacking'],
  ['cucinare', 'to cook'],
  ['preparare', 'to prepare'],
  ['pulire', 'to clean'],
  ['lavare', 'to wash'],
  ['lavarsi', 'to wash (oneself)'],
  ['alzare', 'to raise, to lift'],
  ['alzarsi', 'to get up'],
  ['vestirsi', 'to get dressed'],
  ['divertirsi', 'to have fun'],
  ['sentirsi', 'to feel'],
  ['sposarsi', 'to get married'],
  ['fermarsi', 'to stop'],
  ['riposarsi', 'to rest'],
  ['arrabbiarsi', 'to get angry'],
  ['preoccuparsi', 'to worry'],
  ['innamorarsi', 'to fall in love'],
  ['accorgersi', 'to notice, to realise'],
  ['sedersi', 'to sit down'],
  ['ricordare', 'to remember'],
  ['ricordarsi', 'to remember'],
  ['dimenticarsi', 'to forget'],
  ['sbrigarsi', 'to hurry up'],
  ['trasferirsi', 'to move (house)'],
  ['laurearsi', 'to graduate'],
  ['iscriversi', 'to enrol, to sign up'],
  ['mettersi', 'to put on, to start to'],
  ['farsi', 'to get, to become'],
  ['aiutare', 'to help'],
  ['usare', 'to use'],
  ['provare', 'to try'],
  ['tentare', 'to attempt'],
  ['mostrare', 'to show'],
  ['raccontare', 'to tell (a story)'],
  ['spiegarsi', 'to make oneself clear'],
  ['domandare', 'to ask'],
  ['rispondere', 'to answer'],
  ['chiedere', 'to ask (for)'],
  ['insegnare', 'to teach'],
  ['imparare', 'to learn'],
  ['ripetere', 'to repeat'],
  ['capire', 'to understand'],
  ['finire', 'to finish'],
  ['preferire', 'to prefer'],
  ['spedire', 'to send, to post'],
  ['costruire', 'to build'],
  ['colpire', 'to hit, to strike'],
  ['suggerire', 'to suggest'],
  ['restituire', 'to give back'],
  ['sostituire', 'to replace'],
  ['unire', 'to join, to unite'],
  ['garantire', 'to guarantee'],
  ['gestire', 'to manage'],
  ['impedire', 'to prevent'],
  ['inserire', 'to insert'],
  ['obbedire', 'to obey'],
  ['proibire', 'to forbid'],
  ['punire', 'to punish'],
  ['sparire', 'to disappear'],
  ['stabilire', 'to establish'],
  ['tradire', 'to betray'],
  ['fornire', 'to supply'],
  ['guarire', 'to heal, to recover'],
  ['dimagrire', 'to lose weight'],
  ['impazzire', 'to go mad'],
  ['partire', 'to leave, to depart'],
  ['sentire', 'to hear, to feel'],
  ['servire', 'to serve, to be needed'],
  ['seguire', 'to follow'],
  ['aprire', 'to open'],
  ['coprire', 'to cover'],
  ['scoprire', 'to discover'],
  ['offrire', 'to offer'],
  ['soffrire', 'to suffer'],
  ['vestire', 'to dress'],
  ['fuggire', 'to flee'],
  ['bollire', 'to boil'],
  ['uscire', 'to go out'],
  ['riuscire', 'to succeed, to manage'],
  ['salire', 'to go up, to get on'],
  ['morire', 'to die'],
  ['apparire', 'to appear'],
  ['udire', 'to hear'],
  ['vendere', 'to sell'],
  ['ricevere', 'to receive'],
  ['temere', 'to fear'],
  ['battere', 'to beat'],
  ['cedere', 'to give in, to yield'],
  ['godere', 'to enjoy'],
  ['bere', 'to drink'],
  ['porre', 'to place, to put'],
  ['proporre', 'to propose'],
  ['comporre', 'to compose'],
  ['supporre', 'to suppose'],
  ['esporre', 'to exhibit, to expose'],
  ['imporre', 'to impose'],
  ['opporre', 'to oppose'],
  ['trarre', 'to draw, to pull'],
  ['attrarre', 'to attract'],
  ['distrarre', 'to distract'],
  ['sottrarre', 'to subtract'],
  ['tradurre', 'to translate'],
  ['produrre', 'to produce'],
  ['ridurre', 'to reduce'],
  ['condurre', 'to lead, to conduct'],
  ['introdurre', 'to introduce'],
  ['sedurre', 'to seduce'],
  ['rimanere', 'to remain'],
  ['scegliere', 'to choose'],
  ['raccogliere', 'to pick up, to gather'],
  ['accogliere', 'to welcome'],
  ['togliere', 'to remove, to take off'],
  ['sciogliere', 'to melt, to untie'],
  ['valere', 'to be worth'],
  ['parere', 'to seem'],
  ['sedere', 'to sit'],
  ['possedere', 'to own'],
  ['piacere', 'to please, to be liked'],
  ['dispiacere', 'to be sorry, to displease'],
  ['tacere', 'to be silent'],
  ['nascere', 'to be born'],
  ['crescere', 'to grow'],
  ['vivere', 'to live'],
  ['sopravvivere', 'to survive'],
  ['cadere', 'to fall'],
  ['accadere', 'to happen'],
  ['succedere', 'to happen'],
  ['piovere', 'to rain'],
  ['nevicare', 'to snow'],
  ['cuocere', 'to cook'],
  ['spegnere', 'to switch off'],
  ['accendere', 'to switch on, to light'],
  ['scendere', 'to go down, to get off'],
  ['spendere', 'to spend (money)'],
  ['rendere', 'to give back, to make'],
  ['attendere', 'to wait'],
  ['intendere', 'to mean, to intend'],
  ['sorprendere', 'to surprise'],
  ['comprendere', 'to understand, to include'],
  ['apprendere', 'to learn'],
  ['riprendere', 'to resume, to take back'],
  ['permettere', 'to allow'],
  ['promettere', 'to promise'],
  ['smettere', 'to stop (doing)'],
  ['scommettere', 'to bet'],
  ['commettere', 'to commit'],
  ['chiudere', 'to close'],
  ['concludere', 'to conclude'],
  ['includere', 'to include'],
  ['escludere', 'to exclude'],
  ['nascondere', 'to hide'],
  ['leggere', 'to read'],
  ['eleggere', 'to elect'],
  ['correggere', 'to correct'],
  ['proteggere', 'to protect'],
  ['distruggere', 'to destroy'],
  ['scrivere', 'to write'],
  ['descrivere', 'to describe'],
  ['iscrivere', 'to enrol'],
  ['correre', 'to run'],
  ['percorrere', 'to travel along, to cover'],
  ['soccorrere', 'to rescue'],
  ['perdere', 'to lose'],
  ['rompere', 'to break'],
  ['interrompere', 'to interrupt'],
  ['decidere', 'to decide'],
  ['dividere', 'to divide'],
  ['condividere', 'to share'],
  ['uccidere', 'to kill'],
  ['ridere', 'to laugh'],
  ['sorridere', 'to smile'],
  ['muovere', 'to move'],
  ['commuovere', 'to move (emotionally)'],
  ['promuovere', 'to promote'],
  ['vincere', 'to win'],
  ['convincere', 'to convince'],
  ['giungere', 'to arrive, to reach'],
  ['aggiungere', 'to add'],
  ['raggiungere', 'to reach'],
  ['piangere', 'to cry'],
  ['spingere', 'to push'],
  ['dipingere', 'to paint'],
  ['fingere', 'to pretend'],
  ['distinguere', 'to distinguish'],
  ['rivolgersi', 'to turn to, to address'],
  ['svolgere', 'to carry out'],
  ['coinvolgere', 'to involve'],
  ['risolvere', 'to solve'],
  ['assumere', 'to hire, to assume'],
  ['esprimere', 'to express'],
  ['discutere', 'to discuss'],
  ['esistere', 'to exist'],
  ['insistere', 'to insist'],
  ['resistere', 'to resist'],
  ['assistere', 'to attend, to assist'],
  ['ottenere', 'to obtain'],
  ['mantenere', 'to maintain, to keep'],
  ['contenere', 'to contain'],
  ['sostenere', 'to support, to sustain'],
  ['appartenere', 'to belong'],
  ['trattenere', 'to hold back'],
  ['divenire', 'to become'],
  ['avvenire', 'to happen'],
  ['convenire', 'to be worthwhile, to agree'],
  ['intervenire', 'to intervene'],
  ['prevenire', 'to prevent'],
  ['rifare', 'to redo'],
  ['disfare', 'to undo, to unpack'],
  ['soddisfare', 'to satisfy'],
  ['contraddire', 'to contradict'],
  ['predire', 'to predict'],
  ['benedire', 'to bless'],
  ['prevedere', 'to foresee'],
  ['rivedere', 'to see again, to revise'],
  ['riconoscere', 'to recognise'],
  ['bisognare', 'to be necessary'],
];
