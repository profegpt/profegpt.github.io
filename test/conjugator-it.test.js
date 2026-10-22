/**
 * Reference forms for the Italian conjugation engine, checked against the
 * standard paradigms of the Treccani and Zanichelli tables. Run with
 * `npm test`.
 */
import { conjugate, irregularCells, PERSONS } from '../public/js/lib/conjugator-it.js';

let checked = 0;
const failures = [];

function expect(verb, path, expected) {
  const result = conjugate(verb);
  if (!result.ok) {
    failures.push(`${verb} ${path}: engine error — ${result.error}`);
    return;
  }
  const actual = path.split('.').reduce((node, key) => node?.[key], result.table);
  const got = Array.isArray(expected)
    ? PERSONS.map((person) => actual?.[person]).join(', ')
    : actual;
  const want = Array.isArray(expected) ? expected.join(', ') : expected;
  checked += 1;
  if (got !== want) failures.push(`${verb} ${path}\n    expected: ${want}\n    actual:   ${got}`);
}

function check(name, condition) {
  checked += 1;
  if (!condition) failures.push(name);
}

// --- the three regular models ---------------------------------------------
expect('parlare', 'indicativo.presente', ['parlo', 'parli', 'parla', 'parliamo', 'parlate', 'parlano']);
expect('parlare', 'indicativo.imperfetto', ['parlavo', 'parlavi', 'parlava', 'parlavamo', 'parlavate', 'parlavano']);
expect('parlare', 'indicativo.passatoRemoto', ['parlai', 'parlasti', 'parlò', 'parlammo', 'parlaste', 'parlarono']);
expect('parlare', 'indicativo.futuro', ['parlerò', 'parlerai', 'parlerà', 'parleremo', 'parlerete', 'parleranno']);
expect('parlare', 'indicativo.condizionale', ['parlerei', 'parleresti', 'parlerebbe', 'parleremmo', 'parlereste', 'parlerebbero']);
expect('parlare', 'indicativo.passatoProssimo', ['ho parlato', 'hai parlato', 'ha parlato', 'abbiamo parlato', 'avete parlato', 'hanno parlato']);
expect('parlare', 'indicativo.trapassatoProssimo', ['avevo parlato', 'avevi parlato', 'aveva parlato', 'avevamo parlato', 'avevate parlato', 'avevano parlato']);
expect('parlare', 'indicativo.trapassatoRemoto', ['ebbi parlato', 'avesti parlato', 'ebbe parlato', 'avemmo parlato', 'aveste parlato', 'ebbero parlato']);
expect('parlare', 'indicativo.futuroAnteriore', ['avrò parlato', 'avrai parlato', 'avrà parlato', 'avremo parlato', 'avrete parlato', 'avranno parlato']);
expect('parlare', 'indicativo.condizionalePassato', ['avrei parlato', 'avresti parlato', 'avrebbe parlato', 'avremmo parlato', 'avreste parlato', 'avrebbero parlato']);
expect('parlare', 'congiuntivo.presente', ['parli', 'parli', 'parli', 'parliamo', 'parliate', 'parlino']);
expect('parlare', 'congiuntivo.imperfetto', ['parlassi', 'parlassi', 'parlasse', 'parlassimo', 'parlaste', 'parlassero']);
expect('parlare', 'congiuntivo.passato', ['abbia parlato', 'abbia parlato', 'abbia parlato', 'abbiamo parlato', 'abbiate parlato', 'abbiano parlato']);
expect('parlare', 'congiuntivo.trapassato', ['avessi parlato', 'avessi parlato', 'avesse parlato', 'avessimo parlato', 'aveste parlato', 'avessero parlato']);
expect('parlare', 'imperativo.affermativo.tu', 'parla');
expect('parlare', 'imperativo.affermativo.lei', 'parli');
expect('parlare', 'imperativo.affermativo.noi', 'parliamo');
expect('parlare', 'imperativo.affermativo.voi', 'parlate');
expect('parlare', 'imperativo.negativo.tu', 'non parlare');
expect('parlare', 'imperativo.negativo.lei', 'non parli');
expect('parlare', 'forme.gerundio', 'parlando');
expect('parlare', 'forme.participioPresente', 'parlante');
expect('parlare', 'forme.participioPassato', 'parlato');
expect('parlare', 'forme.infinitoPassato', 'avere parlato');
expect('parlare', 'forme.gerundioPassato', 'avendo parlato');

expect('credere', 'indicativo.presente', ['credo', 'credi', 'crede', 'crediamo', 'credete', 'credono']);
expect('credere', 'indicativo.imperfetto', ['credevo', 'credevi', 'credeva', 'credevamo', 'credevate', 'credevano']);
expect('credere', 'indicativo.passatoRemoto', ['credei', 'credesti', 'credé', 'credemmo', 'credeste', 'crederono']);
expect('credere', 'indicativo.futuro', ['crederò', 'crederai', 'crederà', 'crederemo', 'crederete', 'crederanno']);
expect('credere', 'congiuntivo.presente', ['creda', 'creda', 'creda', 'crediamo', 'crediate', 'credano']);
expect('credere', 'congiuntivo.imperfetto', ['credessi', 'credessi', 'credesse', 'credessimo', 'credeste', 'credessero']);
expect('credere', 'imperativo.affermativo.tu', 'credi');
expect('credere', 'imperativo.affermativo.voi', 'credete');
expect('credere', 'forme.gerundio', 'credendo');
expect('credere', 'forme.participioPassato', 'creduto');

expect('dormire', 'indicativo.presente', ['dormo', 'dormi', 'dorme', 'dormiamo', 'dormite', 'dormono']);
expect('dormire', 'indicativo.imperfetto', ['dormivo', 'dormivi', 'dormiva', 'dormivamo', 'dormivate', 'dormivano']);
expect('dormire', 'indicativo.passatoRemoto', ['dormii', 'dormisti', 'dormì', 'dormimmo', 'dormiste', 'dormirono']);
expect('dormire', 'indicativo.futuro', ['dormirò', 'dormirai', 'dormirà', 'dormiremo', 'dormirete', 'dormiranno']);
expect('dormire', 'congiuntivo.presente', ['dorma', 'dorma', 'dorma', 'dormiamo', 'dormiate', 'dormano']);
expect('dormire', 'congiuntivo.imperfetto', ['dormissi', 'dormissi', 'dormisse', 'dormissimo', 'dormiste', 'dormissero']);
expect('dormire', 'imperativo.affermativo.tu', 'dormi');
expect('dormire', 'imperativo.negativo.tu', 'non dormire');
expect('dormire', 'forme.gerundio', 'dormendo');
expect('dormire', 'forme.participioPassato', 'dormito');

// --- -isc- -----------------------------------------------------------------
expect('finire', 'indicativo.presente', ['finisco', 'finisci', 'finisce', 'finiamo', 'finite', 'finiscono']);
expect('finire', 'indicativo.passatoRemoto', ['finii', 'finisti', 'finì', 'finimmo', 'finiste', 'finirono']);
expect('finire', 'congiuntivo.presente', ['finisca', 'finisca', 'finisca', 'finiamo', 'finiate', 'finiscano']);
expect('finire', 'imperativo.affermativo.tu', 'finisci');
expect('finire', 'imperativo.affermativo.lei', 'finisca');
expect('finire', 'forme.participioPassato', 'finito');
expect('capire', 'indicativo.presente', ['capisco', 'capisci', 'capisce', 'capiamo', 'capite', 'capiscono']);
expect('preferire', 'congiuntivo.presente', ['preferisca', 'preferisca', 'preferisca', 'preferiamo', 'preferiate', 'preferiscano']);
check('finire is flagged isc', conjugate('finire').flags.stemChange === 'isc');
check('dormire is not flagged isc', conjugate('dormire').flags.stemChange === null);

// --- spelling that only preserves the sound --------------------------------
expect('cercare', 'indicativo.presente', ['cerco', 'cerchi', 'cerca', 'cerchiamo', 'cercate', 'cercano']);
expect('cercare', 'indicativo.futuro', ['cercherò', 'cercherai', 'cercherà', 'cercheremo', 'cercherete', 'cercheranno']);
expect('cercare', 'congiuntivo.presente', ['cerchi', 'cerchi', 'cerchi', 'cerchiamo', 'cerchiate', 'cerchino']);
expect('cercare', 'indicativo.passatoRemoto', ['cercai', 'cercasti', 'cercò', 'cercammo', 'cercaste', 'cercarono']);
expect('pagare', 'indicativo.presente', ['pago', 'paghi', 'paga', 'paghiamo', 'pagate', 'pagano']);
expect('pagare', 'indicativo.condizionale', ['pagherei', 'pagheresti', 'pagherebbe', 'pagheremmo', 'paghereste', 'pagherebbero']);
expect('mangiare', 'indicativo.presente', ['mangio', 'mangi', 'mangia', 'mangiamo', 'mangiate', 'mangiano']);
expect('mangiare', 'indicativo.futuro', ['mangerò', 'mangerai', 'mangerà', 'mangeremo', 'mangerete', 'mangeranno']);
expect('mangiare', 'congiuntivo.presente', ['mangi', 'mangi', 'mangi', 'mangiamo', 'mangiate', 'mangino']);
expect('mangiare', 'imperativo.affermativo.tu', 'mangia');
expect('cominciare', 'indicativo.presente', ['comincio', 'cominci', 'comincia', 'cominciamo', 'cominciate', 'cominciano']);
expect('cominciare', 'indicativo.futuro', ['comincerò', 'comincerai', 'comincerà', 'cominceremo', 'comincerete', 'cominceranno']);
expect('lasciare', 'indicativo.futuro', ['lascerò', 'lascerai', 'lascerà', 'lasceremo', 'lascerete', 'lasceranno']);
expect('studiare', 'indicativo.presente', ['studio', 'studi', 'studia', 'studiamo', 'studiate', 'studiano']);
expect('studiare', 'indicativo.futuro', ['studierò', 'studierai', 'studierà', 'studieremo', 'studierete', 'studieranno']);
expect('studiare', 'congiuntivo.presente', ['studi', 'studi', 'studi', 'studiamo', 'studiate', 'studino']);
// A stressed i is a vowel of its own and survives where studiare's does not.
expect('inviare', 'indicativo.presente', ['invio', 'invii', 'invia', 'inviamo', 'inviate', 'inviano']);
expect('inviare', 'congiuntivo.presente', ['invii', 'invii', 'invii', 'inviamo', 'inviate', 'inviino']);
expect('inviare', 'indicativo.futuro', ['invierò', 'invierai', 'invierà', 'invieremo', 'invierete', 'invieranno']);
check('cercare is flagged c → ch', conjugate('cercare').flags.ortho === 'c → ch');
check('mangiare is flagged gi → g', conjugate('mangiare').flags.ortho === 'gi → g');

// --- the auxiliaries -------------------------------------------------------
expect('essere', 'indicativo.presente', ['sono', 'sei', 'è', 'siamo', 'siete', 'sono']);
expect('essere', 'indicativo.imperfetto', ['ero', 'eri', 'era', 'eravamo', 'eravate', 'erano']);
expect('essere', 'indicativo.passatoRemoto', ['fui', 'fosti', 'fu', 'fummo', 'foste', 'furono']);
expect('essere', 'indicativo.futuro', ['sarò', 'sarai', 'sarà', 'saremo', 'sarete', 'saranno']);
expect('essere', 'indicativo.condizionale', ['sarei', 'saresti', 'sarebbe', 'saremmo', 'sareste', 'sarebbero']);
expect('essere', 'indicativo.passatoProssimo', ['sono stato/a', 'sei stato/a', 'è stato/a', 'siamo stati/e', 'siete stati/e', 'sono stati/e']);
expect('essere', 'congiuntivo.presente', ['sia', 'sia', 'sia', 'siamo', 'siate', 'siano']);
expect('essere', 'congiuntivo.imperfetto', ['fossi', 'fossi', 'fosse', 'fossimo', 'foste', 'fossero']);
expect('essere', 'imperativo.affermativo.tu', 'sii');
expect('essere', 'imperativo.affermativo.voi', 'siate');
expect('essere', 'imperativo.negativo.tu', 'non essere');
expect('essere', 'forme.gerundio', 'essendo');
expect('essere', 'forme.participioPassato', 'stato');
expect('avere', 'indicativo.presente', ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno']);
expect('avere', 'indicativo.imperfetto', ['avevo', 'avevi', 'aveva', 'avevamo', 'avevate', 'avevano']);
expect('avere', 'indicativo.passatoRemoto', ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero']);
expect('avere', 'indicativo.futuro', ['avrò', 'avrai', 'avrà', 'avremo', 'avrete', 'avranno']);
expect('avere', 'congiuntivo.presente', ['abbia', 'abbia', 'abbia', 'abbiamo', 'abbiate', 'abbiano']);
expect('avere', 'congiuntivo.imperfetto', ['avessi', 'avessi', 'avesse', 'avessimo', 'aveste', 'avessero']);
expect('avere', 'imperativo.affermativo.tu', 'abbi');
expect('avere', 'indicativo.passatoProssimo', ['ho avuto', 'hai avuto', 'ha avuto', 'abbiamo avuto', 'avete avuto', 'hanno avuto']);

// --- the big irregulars ----------------------------------------------------
expect('andare', 'indicativo.presente', ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno']);
expect('andare', 'indicativo.futuro', ['andrò', 'andrai', 'andrà', 'andremo', 'andrete', 'andranno']);
expect('andare', 'congiuntivo.presente', ['vada', 'vada', 'vada', 'andiamo', 'andiate', 'vadano']);
expect('andare', 'imperativo.affermativo.tu', "va'");
expect('andare', 'imperativo.affermativo.lei', 'vada');

expect('fare', 'indicativo.presente', ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno']);
expect('fare', 'indicativo.imperfetto', ['facevo', 'facevi', 'faceva', 'facevamo', 'facevate', 'facevano']);
expect('fare', 'indicativo.passatoRemoto', ['feci', 'facesti', 'fece', 'facemmo', 'faceste', 'fecero']);
expect('fare', 'indicativo.futuro', ['farò', 'farai', 'farà', 'faremo', 'farete', 'faranno']);
expect('fare', 'congiuntivo.presente', ['faccia', 'faccia', 'faccia', 'facciamo', 'facciate', 'facciano']);
expect('fare', 'congiuntivo.imperfetto', ['facessi', 'facessi', 'facesse', 'facessimo', 'faceste', 'facessero']);
expect('fare', 'imperativo.affermativo.tu', "fa'");
expect('fare', 'forme.gerundio', 'facendo');
expect('fare', 'forme.participioPassato', 'fatto');

expect('dare', 'indicativo.presente', ['do', 'dai', 'dà', 'diamo', 'date', 'danno']);
expect('dare', 'indicativo.passatoRemoto', ['diedi', 'desti', 'diede', 'demmo', 'deste', 'diedero']);
expect('dare', 'congiuntivo.presente', ['dia', 'dia', 'dia', 'diamo', 'diate', 'diano']);
expect('dare', 'congiuntivo.imperfetto', ['dessi', 'dessi', 'desse', 'dessimo', 'deste', 'dessero']);
expect('stare', 'indicativo.presente', ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno']);
expect('stare', 'indicativo.passatoRemoto', ['stetti', 'stesti', 'stette', 'stemmo', 'steste', 'stettero']);
expect('stare', 'congiuntivo.imperfetto', ['stessi', 'stessi', 'stesse', 'stessimo', 'steste', 'stessero']);
expect('stare', 'indicativo.passatoProssimo', ['sono stato/a', 'sei stato/a', 'è stato/a', 'siamo stati/e', 'siete stati/e', 'sono stati/e']);

expect('venire', 'indicativo.presente', ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono']);
expect('venire', 'indicativo.passatoRemoto', ['venni', 'venisti', 'venne', 'venimmo', 'veniste', 'vennero']);
expect('venire', 'indicativo.futuro', ['verrò', 'verrai', 'verrà', 'verremo', 'verrete', 'verranno']);
expect('venire', 'congiuntivo.presente', ['venga', 'venga', 'venga', 'veniamo', 'veniate', 'vengano']);
expect('venire', 'forme.participioPassato', 'venuto');

expect('dire', 'indicativo.presente', ['dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono']);
expect('dire', 'indicativo.imperfetto', ['dicevo', 'dicevi', 'diceva', 'dicevamo', 'dicevate', 'dicevano']);
expect('dire', 'indicativo.passatoRemoto', ['dissi', 'dicesti', 'disse', 'dicemmo', 'diceste', 'dissero']);
expect('dire', 'indicativo.futuro', ['dirò', 'dirai', 'dirà', 'diremo', 'direte', 'diranno']);
expect('dire', 'congiuntivo.presente', ['dica', 'dica', 'dica', 'diciamo', 'diciate', 'dicano']);
expect('dire', 'imperativo.affermativo.tu', "di'");
expect('dire', 'forme.gerundio', 'dicendo');
expect('dire', 'forme.participioPassato', 'detto');

expect('bere', 'indicativo.presente', ['bevo', 'bevi', 'beve', 'beviamo', 'bevete', 'bevono']);
expect('bere', 'indicativo.imperfetto', ['bevevo', 'bevevi', 'beveva', 'bevevamo', 'bevevate', 'bevevano']);
expect('bere', 'indicativo.passatoRemoto', ['bevvi', 'bevesti', 'bevve', 'bevemmo', 'beveste', 'bevvero']);
expect('bere', 'indicativo.futuro', ['berrò', 'berrai', 'berrà', 'berremo', 'berrete', 'berranno']);
expect('bere', 'congiuntivo.presente', ['beva', 'beva', 'beva', 'beviamo', 'beviate', 'bevano']);
expect('bere', 'imperativo.negativo.tu', 'non bere');
expect('bere', 'forme.participioPassato', 'bevuto');

expect('porre', 'indicativo.presente', ['pongo', 'poni', 'pone', 'poniamo', 'ponete', 'pongono']);
expect('porre', 'indicativo.imperfetto', ['ponevo', 'ponevi', 'poneva', 'ponevamo', 'ponevate', 'ponevano']);
expect('porre', 'indicativo.passatoRemoto', ['posi', 'ponesti', 'pose', 'ponemmo', 'poneste', 'posero']);
expect('porre', 'indicativo.futuro', ['porrò', 'porrai', 'porrà', 'porremo', 'porrete', 'porranno']);
expect('porre', 'congiuntivo.presente', ['ponga', 'ponga', 'ponga', 'poniamo', 'poniate', 'pongano']);
expect('porre', 'forme.participioPassato', 'posto');
expect('proporre', 'indicativo.presente', ['propongo', 'proponi', 'propone', 'proponiamo', 'proponete', 'propongono']);
expect('proporre', 'indicativo.passatoRemoto', ['proposi', 'proponesti', 'propose', 'proponemmo', 'proponeste', 'proposero']);
expect('proporre', 'indicativo.futuro', ['proporrò', 'proporrai', 'proporrà', 'proporremo', 'proporrete', 'proporranno']);
expect('proporre', 'forme.participioPassato', 'proposto');
expect('trarre', 'indicativo.presente', ['traggo', 'trai', 'trae', 'traiamo', 'traete', 'traggono']);
expect('trarre', 'congiuntivo.presente', ['tragga', 'tragga', 'tragga', 'traiamo', 'traiate', 'traggano']);

expect('tradurre', 'indicativo.presente', ['traduco', 'traduci', 'traduce', 'traduciamo', 'traducete', 'traducono']);
expect('tradurre', 'indicativo.imperfetto', ['traducevo', 'traducevi', 'traduceva', 'traducevamo', 'traducevate', 'traducevano']);
expect('tradurre', 'indicativo.passatoRemoto', ['tradussi', 'traducesti', 'tradusse', 'traducemmo', 'traduceste', 'tradussero']);
expect('tradurre', 'indicativo.futuro', ['tradurrò', 'tradurrai', 'tradurrà', 'tradurremo', 'tradurrete', 'tradurranno']);
expect('tradurre', 'congiuntivo.presente', ['traduca', 'traduca', 'traduca', 'traduciamo', 'traduciate', 'traducano']);
expect('tradurre', 'forme.gerundio', 'traducendo');
expect('tradurre', 'forme.participioPassato', 'tradotto');
expect('produrre', 'forme.participioPassato', 'prodotto');

// The 1-3-3 passato remoto: strong in io, lui, loro; regular in tu, noi, voi.
expect('prendere', 'indicativo.passatoRemoto', ['presi', 'prendesti', 'prese', 'prendemmo', 'prendeste', 'presero']);
expect('prendere', 'forme.participioPassato', 'preso');
expect('avere', 'indicativo.passatoRemoto', ['ebbi', 'avesti', 'ebbe', 'avemmo', 'aveste', 'ebbero']);
expect('sapere', 'indicativo.passatoRemoto', ['seppi', 'sapesti', 'seppe', 'sapemmo', 'sapeste', 'seppero']);
expect('volere', 'indicativo.passatoRemoto', ['volli', 'volesti', 'volle', 'volemmo', 'voleste', 'vollero']);
expect('vedere', 'indicativo.passatoRemoto', ['vidi', 'vedesti', 'vide', 'vedemmo', 'vedeste', 'videro']);
expect('conoscere', 'indicativo.passatoRemoto', ['conobbi', 'conoscesti', 'conobbe', 'conoscemmo', 'conosceste', 'conobbero']);
expect('scrivere', 'indicativo.passatoRemoto', ['scrissi', 'scrivesti', 'scrisse', 'scrivemmo', 'scriveste', 'scrissero']);
expect('mettere', 'indicativo.passatoRemoto', ['misi', 'mettesti', 'mise', 'mettemmo', 'metteste', 'misero']);
expect('nascere', 'indicativo.passatoRemoto', ['nacqui', 'nascesti', 'nacque', 'nascemmo', 'nasceste', 'nacquero']);
expect('rompere', 'indicativo.passatoRemoto', ['ruppi', 'rompesti', 'ruppe', 'rompemmo', 'rompeste', 'ruppero']);

// The modals.
expect('volere', 'indicativo.presente', ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono']);
expect('volere', 'indicativo.futuro', ['vorrò', 'vorrai', 'vorrà', 'vorremo', 'vorrete', 'vorranno']);
expect('volere', 'congiuntivo.presente', ['voglia', 'voglia', 'voglia', 'vogliamo', 'vogliate', 'vogliano']);
expect('potere', 'indicativo.presente', ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono']);
expect('potere', 'indicativo.condizionale', ['potrei', 'potresti', 'potrebbe', 'potremmo', 'potreste', 'potrebbero']);
expect('potere', 'congiuntivo.presente', ['possa', 'possa', 'possa', 'possiamo', 'possiate', 'possano']);
expect('potere', 'imperativo.affermativo.tu', null);
expect('dovere', 'indicativo.presente', ['devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono']);
expect('dovere', 'indicativo.futuro', ['dovrò', 'dovrai', 'dovrà', 'dovremo', 'dovrete', 'dovranno']);
expect('dovere', 'congiuntivo.presente', ['debba', 'debba', 'debba', 'dobbiamo', 'dobbiate', 'debbano']);
expect('sapere', 'indicativo.presente', ['so', 'sai', 'sa', 'sappiamo', 'sapete', 'sanno']);
expect('sapere', 'congiuntivo.presente', ['sappia', 'sappia', 'sappia', 'sappiamo', 'sappiate', 'sappiano']);
expect('sapere', 'imperativo.affermativo.tu', 'sappi');

// The rest of the everyday irregulars.
expect('uscire', 'indicativo.presente', ['esco', 'esci', 'esce', 'usciamo', 'uscite', 'escono']);
expect('uscire', 'congiuntivo.presente', ['esca', 'esca', 'esca', 'usciamo', 'usciate', 'escano']);
expect('tenere', 'indicativo.presente', ['tengo', 'tieni', 'tiene', 'teniamo', 'tenete', 'tengono']);
expect('rimanere', 'indicativo.futuro', ['rimarrò', 'rimarrai', 'rimarrà', 'rimarremo', 'rimarrete', 'rimarranno']);
expect('rimanere', 'forme.participioPassato', 'rimasto');
expect('scegliere', 'indicativo.presente', ['scelgo', 'scegli', 'sceglie', 'scegliamo', 'scegliete', 'scelgono']);
expect('scegliere', 'congiuntivo.presente', ['scelga', 'scelga', 'scelga', 'scegliamo', 'scegliate', 'scelgano']);
expect('scegliere', 'forme.participioPassato', 'scelto');
expect('morire', 'indicativo.presente', ['muoio', 'muori', 'muore', 'moriamo', 'morite', 'muoiono']);
expect('morire', 'congiuntivo.presente', ['muoia', 'muoia', 'muoia', 'moriamo', 'moriate', 'muoiano']);
expect('piacere', 'indicativo.presente', ['piaccio', 'piaci', 'piace', 'piacciamo', 'piacete', 'piacciono']);
expect('piacere', 'forme.participioPassato', 'piaciuto');
expect('conoscere', 'forme.participioPassato', 'conosciuto');
expect('vedere', 'indicativo.futuro', ['vedrò', 'vedrai', 'vedrà', 'vedremo', 'vedrete', 'vedranno']);
expect('vedere', 'forme.participioPassato', 'visto');
expect('vivere', 'forme.participioPassato', 'vissuto');
expect('leggere', 'forme.participioPassato', 'letto');
expect('scrivere', 'forme.participioPassato', 'scritto');
expect('chiudere', 'forme.participioPassato', 'chiuso');
expect('rompere', 'forme.participioPassato', 'rotto');
expect('rispondere', 'forme.participioPassato', 'risposto');
expect('chiedere', 'forme.participioPassato', 'chiesto');
expect('aprire', 'forme.participioPassato', 'aperto');
expect('offrire', 'forme.participioPassato', 'offerto');
expect('spegnere', 'indicativo.presente', ['spengo', 'spegni', 'spegne', 'spegniamo', 'spegnete', 'spengono']);
expect('spegnere', 'forme.participioPassato', 'spento');

// --- irregularity inherited by prefixed derivatives ------------------------
expect('ottenere', 'indicativo.presente', ['ottengo', 'ottieni', 'ottiene', 'otteniamo', 'ottenete', 'ottengono']);
expect('ottenere', 'indicativo.futuro', ['otterrò', 'otterrai', 'otterrà', 'otterremo', 'otterrete', 'otterranno']);
expect('ottenere', 'indicativo.passatoRemoto', ['ottenni', 'ottenesti', 'ottenne', 'ottenemmo', 'otteneste', 'ottennero']);
expect('ottenere', 'indicativo.passatoProssimo', ['ho ottenuto', 'hai ottenuto', 'ha ottenuto', 'abbiamo ottenuto', 'avete ottenuto', 'hanno ottenuto']);
// A prefix turns the monosyllable fa into a word that has to show its stress.
expect('rifare', 'indicativo.presente', ['rifaccio', 'rifai', 'rifà', 'rifacciamo', 'rifate', 'rifanno']);
expect('rifare', 'indicativo.passatoRemoto', ['rifeci', 'rifacesti', 'rifece', 'rifacemmo', 'rifaceste', 'rifecero']);
expect('rifare', 'forme.participioPassato', 'rifatto');
expect('predire', 'imperativo.affermativo.tu', 'predici');
expect('sorprendere', 'forme.participioPassato', 'sorpreso');
expect('permettere', 'forme.participioPassato', 'permesso');
expect('descrivere', 'forme.participioPassato', 'descritto');
expect('riconoscere', 'indicativo.passatoRemoto', ['riconobbi', 'riconoscesti', 'riconobbe', 'riconoscemmo', 'riconosceste', 'riconobbero']);
expect('esprimere', 'forme.participioPassato', 'espresso');
expect('esistere', 'forme.participioPassato', 'esistito');
// ardire only looks like a prefixed dire; it is an ordinary -isc- verb.
expect('ardire', 'indicativo.presente', ['ardisco', 'ardisci', 'ardisce', 'ardiamo', 'ardite', 'ardiscono']);
check('ottenere is derived from tenere', conjugate('ottenere').flags.derivedFrom === 'tenere');

// --- the auxiliary, and agreement after essere -----------------------------
expect('andare', 'indicativo.passatoProssimo', ['sono andato/a', 'sei andato/a', 'è andato/a', 'siamo andati/e', 'siete andati/e', 'sono andati/e']);
expect('venire', 'indicativo.trapassatoProssimo', ['ero venuto/a', 'eri venuto/a', 'era venuto/a', 'eravamo venuti/e', 'eravate venuti/e', 'erano venuti/e']);
expect('morire', 'indicativo.passatoProssimo', ['sono morto/a', 'sei morto/a', 'è morto/a', 'siamo morti/e', 'siete morti/e', 'sono morti/e']);
expect('nascere', 'congiuntivo.passato', ['sia nato/a', 'sia nato/a', 'sia nato/a', 'siamo nati/e', 'siate nati/e', 'siano nati/e']);
expect('andare', 'forme.infinitoPassato', 'essere andato');
expect('finire', 'indicativo.passatoProssimo', ['ho finito', 'hai finito', 'ha finito', 'abbiamo finito', 'avete finito', 'hanno finito']);

const aux = (verb) => conjugate(verb).auxiliary;
for (const [verb, expected] of [['parlare', 'avere'], ['andare', 'essere'], ['venire', 'essere'],
  ['nascere', 'essere'], ['piacere', 'essere'], ['essere', 'essere'], ['avere', 'avere'],
  ['mantenere', 'avere'], ['divenire', 'essere'], ['alzarsi', 'essere']]) {
  check(`${verb}: auxiliary should be ${expected}, got ${aux(verb)}`, aux(verb) === expected);
}

// --- impersonal verbs have only the third person singular ------------------
expect('piovere', 'indicativo.presente', [null, null, 'piove', null, null, null]);
expect('piovere', 'indicativo.passatoRemoto', [null, null, 'piovve', null, null, null]);

// --- reflexives ------------------------------------------------------------
const reflexive = conjugate('alzarsi');
check('alzarsi: reflexive flag, citation form and bare infinitive',
  reflexive.ok && reflexive.pronominal && reflexive.verb === 'alzarsi' && reflexive.infinitive === 'alzare');
expect('alzarsi', 'indicativo.presente', ['mi alzo', 'ti alzi', 'si alza', 'ci alziamo', 'vi alzate', 'si alzano']);
expect('alzarsi', 'indicativo.passatoProssimo', ['mi sono alzato/a', 'ti sei alzato/a', 'si è alzato/a', 'ci siamo alzati/e', 'vi siete alzati/e', 'si sono alzati/e']);
expect('alzarsi', 'indicativo.futuro', ['mi alzerò', 'ti alzerai', 'si alzerà', 'ci alzeremo', 'vi alzerete', 'si alzeranno']);
expect('alzarsi', 'congiuntivo.presente', ['mi alzi', 'ti alzi', 'si alzi', 'ci alziamo', 'vi alziate', 'si alzino']);
expect('alzarsi', 'imperativo.affermativo.tu', 'alzati');
expect('alzarsi', 'imperativo.affermativo.lei', 'si alzi');
expect('alzarsi', 'imperativo.affermativo.noi', 'alziamoci');
expect('alzarsi', 'imperativo.affermativo.voi', 'alzatevi');
expect('alzarsi', 'imperativo.negativo.tu', 'non alzarti');
expect('alzarsi', 'forme.infinito', 'alzarsi');
expect('alzarsi', 'forme.gerundio', 'alzandosi');
expect('divertirsi', 'indicativo.presente', ['mi diverto', 'ti diverti', 'si diverte', 'ci divertiamo', 'vi divertite', 'si divertono']);
expect('divertirsi', 'imperativo.affermativo.tu', 'divertiti');
expect('mettersi', 'indicativo.passatoProssimo', ['mi sono messo/a', 'ti sei messo/a', 'si è messo/a', 'ci siamo messi/e', 'vi siete messi/e', 'si sono messi/e']);
expect('accorgersi', 'indicativo.passatoRemoto', ['mi accorsi', 'ti accorgesti', 'si accorse', 'ci accorgemmo', 'vi accorgeste', 'si accorsero']);
expect('farsi', 'imperativo.affermativo.tu', 'fatti');
// -trarsi is an -are verb unless it follows one of trarre's own prefixes.
expect('mostrarsi', 'indicativo.presente', ['mi mostro', 'ti mostri', 'si mostra', 'ci mostriamo', 'vi mostrate', 'si mostrano']);
expect('distrarsi', 'indicativo.presente', ['mi distraggo', 'ti distrai', 'si distrae', 'ci distraiamo', 'vi distraete', 'si distraggono']);
// A regular reflexive is compared against a regular reflexive, so nothing lights up.
check('alzarsi has no irregular cells', irregularCells('alzarsi').size === 0);
check('andare marks vado but not andiamo',
  irregularCells('andare').has('indicativo.presente.io') && !irregularCells('andare').has('indicativo.presente.noi'));

// --- rejection -------------------------------------------------------------
for (const garbage of ['gatto', 'cane', 'xyz', 'are', '123are', '']) {
  check(`${JSON.stringify(garbage)}: should be rejected`, !conjugate(garbage).ok);
}
check('rejection carries an error code', conjugate('gatto').error === 'not-an-infinitive');
check('empty input says so', conjugate('').error === 'empty');

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Italian conjugation checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Italian conjugation checks passed`);
