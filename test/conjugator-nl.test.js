/**
 * Reference forms for the Dutch conjugation engine, checked against the
 * Woordenlijst (het Groene Boekje) and the Wiktionary tables. Run with
 * `node test/conjugator-nl.test.js`.
 */
import {
  conjugate, irregularCells, PERSONS, CLASS_LABELS, STEM_CHANGE_LABELS, SHAPE,
} from '../public/js/lib/conjugator-nl.js';
import { COMMON_VERBS, IRREGULARS, MODEL_VERBS } from '../public/js/data/verbs-nl.js';

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

/** The six persons from the singular and plural of a tense. */
const six = (singular, plural) => [singular, singular, singular, plural, plural, plural];
/** The six persons of the present from stem, -t form and plural. */
const ott = (stem, t, plural) => [stem, t, t, plural, plural, plural];
const perfect = (aux, participle) => aux.map((form) => `${form} ${participle}`);
const HEB = ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben'];
const HAD = ['had', 'had', 'had', 'hadden', 'hadden', 'hadden'];
const BEN = ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn'];
const WAS = ['was', 'was', 'was', 'waren', 'waren', 'waren'];
const ZAL = ['zal', 'zult', 'zal', 'zullen', 'zullen', 'zullen'];
const ZOU = ['zou', 'zou', 'zou', 'zouden', 'zouden', 'zouden'];

// --- the three model verbs ---------------------------------------------------
expect('werken', 'indicatief.ott', ott('werk', 'werkt', 'werken'));
expect('werken', 'indicatief.ovt', six('werkte', 'werkten'));
expect('werken', 'indicatief.ottt', ZAL.map((form) => `${form} werken`));
expect('werken', 'indicatief.ovtt', ZOU.map((form) => `${form} werken`));
expect('werken', 'indicatief.vtt', perfect(HEB, 'gewerkt'));
expect('werken', 'indicatief.vvt', perfect(HAD, 'gewerkt'));
expect('werken', 'indicatief.vttt', ZAL.map((form) => `${form} gewerkt hebben`));
expect('werken', 'indicatief.vvtt', ZOU.map((form) => `${form} gewerkt hebben`));
expect('werken', 'conjunctief.ott', six('werke', 'werken'));
expect('werken', 'imperatief.bevestigend.jij', 'werk');
expect('werken', 'imperatief.bevestigend.u', 'werkt u');
expect('werken', 'imperatief.ontkennend.jij', 'werk niet');
expect('werken', 'imperatief.ontkennend.u', 'werkt u niet');
expect('werken', 'vormen.infinitief', 'werken');
expect('werken', 'vormen.tegenwoordigDeelwoord', 'werkend');
expect('werken', 'vormen.voltooidDeelwoord', 'gewerkt');
expect('werken', 'vormen.voltooideInfinitief', 'gewerkt hebben');
expect('werken', 'vormen.teInfinitief', 'te werken');

expect('spelen', 'indicatief.ott', ott('speel', 'speelt', 'spelen'));
expect('spelen', 'indicatief.ovt', six('speelde', 'speelden'));
expect('spelen', 'indicatief.vtt', perfect(HEB, 'gespeeld'));
expect('spelen', 'conjunctief.ott', six('spele', 'spelen'));
expect('spelen', 'imperatief.bevestigend.jij', 'speel');
expect('spelen', 'imperatief.bevestigend.u', 'speelt u');
expect('spelen', 'vormen.voltooidDeelwoord', 'gespeeld');
expect('spelen', 'vormen.tegenwoordigDeelwoord', 'spelend');

expect('kijken', 'indicatief.ott', ott('kijk', 'kijkt', 'kijken'));
expect('kijken', 'indicatief.ovt', six('keek', 'keken'));
expect('kijken', 'indicatief.vtt', perfect(HEB, 'gekeken'));
expect('kijken', 'indicatief.vvt', perfect(HAD, 'gekeken'));
expect('kijken', 'indicatief.vttt', ZAL.map((form) => `${form} gekeken hebben`));
expect('kijken', 'conjunctief.ott', six('kijke', 'kijken'));
expect('kijken', 'imperatief.bevestigend.jij', 'kijk');
expect('kijken', 'imperatief.ontkennend.u', 'kijkt u niet');
expect('kijken', 'vormen.voltooidDeelwoord', 'gekeken');
expect('kijken', 'vormen.voltooideInfinitief', 'gekeken hebben');

for (const [mode, model] of Object.entries(MODEL_VERBS)) {
  check(`model verb ${model.verb} belongs to class ${mode}`, conjugate(model.verb).class === mode);
}

// --- spelling the stem ------------------------------------------------------
expect('lopen', 'indicatief.ott', ott('loop', 'loopt', 'lopen'));
expect('maken', 'indicatief.ott', ott('maak', 'maakt', 'maken'));
expect('maken', 'indicatief.ovt', six('maakte', 'maakten'));
expect('maken', 'vormen.voltooidDeelwoord', 'gemaakt');
expect('zitten', 'indicatief.ott', ott('zit', 'zit', 'zitten'));
expect('leven', 'indicatief.ott', ott('leef', 'leeft', 'leven'));
expect('leven', 'indicatief.ovt', six('leefde', 'leefden'));
expect('leven', 'vormen.voltooidDeelwoord', 'geleefd');
expect('reizen', 'indicatief.ott', ott('reis', 'reist', 'reizen'));
expect('reizen', 'indicatief.ovt', six('reisde', 'reisden'));
expect('reizen', 'vormen.voltooidDeelwoord', 'gereisd');
expect('geloven', 'indicatief.ott', ott('geloof', 'gelooft', 'geloven'));
expect('geloven', 'indicatief.ovt', six('geloofde', 'geloofden'));
expect('geloven', 'vormen.voltooidDeelwoord', 'geloofd');
expect('verhuizen', 'indicatief.ovt', six('verhuisde', 'verhuisden'));
expect('verhuizen', 'vormen.voltooidDeelwoord', 'verhuisd');
expect('huren', 'indicatief.ott', ott('huur', 'huurt', 'huren'));
expect('sturen', 'indicatief.ovt', six('stuurde', 'stuurden'));
expect('wonen', 'indicatief.ott', ott('woon', 'woont', 'wonen'));
expect('wonen', 'vormen.voltooidDeelwoord', 'gewoond');
expect('bellen', 'indicatief.ott', ott('bel', 'belt', 'bellen'));
expect('bellen', 'indicatief.ovt', six('belde', 'belden'));
expect('pakken', 'indicatief.ovt', six('pakte', 'pakten'));
expect('pakken', 'vormen.voltooidDeelwoord', 'gepakt');
expect('stoppen', 'indicatief.ott', ott('stop', 'stopt', 'stoppen'));
expect('kennen', 'indicatief.ovt', six('kende', 'kenden'));
expect('leggen', 'indicatief.ovt', six('legde', 'legden'));
expect('leggen', 'vormen.voltooidDeelwoord', 'gelegd');
expect('duwen', 'indicatief.ott', ott('duw', 'duwt', 'duwen'));
expect('gooien', 'indicatief.ott', ott('gooi', 'gooit', 'gooien'));
expect('gooien', 'indicatief.ovt', six('gooide', 'gooiden'));
expect('gooien', 'vormen.voltooidDeelwoord', 'gegooid');
expect('draaien', 'vormen.voltooidDeelwoord', 'gedraaid');
expect('groeien', 'indicatief.ott', ott('groei', 'groeit', 'groeien'));
expect('bouwen', 'indicatief.ovt', six('bouwde', 'bouwden'));
expect('typen', 'indicatief.ovt', six('typte', 'typten'));
expect('typen', 'vormen.voltooidDeelwoord', 'getypt');
expect('creëren', 'indicatief.ott', ott('creëer', 'creëert', 'creëren'));
expect('creëren', 'vormen.voltooidDeelwoord', 'gecreëerd');
expect('kopiëren', 'indicatief.ott', ott('kopieer', 'kopieert', 'kopiëren'));
expect('kopiëren', 'indicatief.ovt', six('kopieerde', 'kopieerden'));
expect('kopiëren', 'vormen.voltooidDeelwoord', 'gekopieerd');
expect('beamen', 'indicatief.ott', ott('beaam', 'beaamt', 'beamen'));
expect('evalueren', 'indicatief.ott', ott('evalueer', 'evalueert', 'evalueren'));
check('leven is flagged v → f', conjugate('leven').flags.ortho === 'e → ee, v → f');
check('reizen is flagged z → s', conjugate('reizen').flags.ortho === 'z → s');
check('lopen is flagged o → oo', conjugate('lopen').flags.ortho === 'o → oo');
check('zitten is flagged tt → t', conjugate('zitten').flags.ortho === 'tt → t');
check('werken has no spelling flag', conjugate('werken').flags.ortho === null);
check('no stem changes', conjugate('lopen').flags.stemChange === null && Object.keys(STEM_CHANGE_LABELS).length === 0);

// --- the unstressed syllable ------------------------------------------------
expect('wandelen', 'indicatief.ott', ott('wandel', 'wandelt', 'wandelen'));
expect('wandelen', 'indicatief.ovt', six('wandelde', 'wandelden'));
expect('wandelen', 'vormen.voltooidDeelwoord', 'gewandeld');
expect('luisteren', 'indicatief.ott', ott('luister', 'luistert', 'luisteren'));
expect('luisteren', 'vormen.voltooidDeelwoord', 'geluisterd');
expect('rekenen', 'indicatief.ott', ott('reken', 'rekent', 'rekenen'));
expect('openen', 'indicatief.ott', ott('open', 'opent', 'openen'));
expect('openen', 'vormen.voltooidDeelwoord', 'geopend');
expect('oefenen', 'indicatief.ott', ott('oefen', 'oefent', 'oefenen'));
expect('oefenen', 'vormen.voltooidDeelwoord', 'geoefend');
expect('eindigen', 'indicatief.ott', ott('eindig', 'eindigt', 'eindigen'));
expect('eindigen', 'vormen.voltooidDeelwoord', 'geëindigd');
expect('ademen', 'indicatief.ott', ott('adem', 'ademt', 'ademen'));
expect('tekenen', 'indicatief.ovt', six('tekende', 'tekenden'));
expect('regelen', 'indicatief.ott', ott('regel', 'regelt', 'regelen'));
expect('twijfelen', 'vormen.voltooidDeelwoord', 'getwijfeld');
expect('verzamelen', 'indicatief.ott', ott('verzamel', 'verzamelt', 'verzamelen'));
expect('ontwikkelen', 'vormen.voltooidDeelwoord', 'ontwikkeld');
expect('herinneren', 'indicatief.ott', ott('herinner', 'herinnert', 'herinneren'));
expect('herinneren', 'vormen.voltooidDeelwoord', 'herinnerd');
expect('veranderen', 'indicatief.ott', ott('verander', 'verandert', 'veranderen'));
expect('verbeteren', 'indicatief.ott', ott('verbeter', 'verbetert', 'verbeteren'));
expect('leveren', 'indicatief.ott', ott('lever', 'levert', 'leveren'));
expect('weigeren', 'indicatief.ovt', six('weigerde', 'weigerden'));
expect('schitteren', 'indicatief.ott', ott('schitter', 'schittert', 'schitteren'));
// Against: a monosyllabic stem, a loan in -eren, a noun in -eel.
expect('spelen', 'indicatief.ott', ott('speel', 'speelt', 'spelen'));
expect('herhalen', 'indicatief.ott', ott('herhaal', 'herhaalt', 'herhalen'));
expect('herhalen', 'vormen.voltooidDeelwoord', 'herhaald');
expect('vertellen', 'indicatief.ott', ott('vertel', 'vertelt', 'vertellen'));
expect('vertellen', 'indicatief.ovt', six('vertelde', 'vertelden'));
expect('verdelen', 'indicatief.ott', ott('verdeel', 'verdeelt', 'verdelen'));
expect('studeren', 'indicatief.ott', ott('studeer', 'studeert', 'studeren'));
expect('studeren', 'indicatief.ovt', six('studeerde', 'studeerden'));
expect('studeren', 'vormen.voltooidDeelwoord', 'gestudeerd');
expect('proberen', 'indicatief.ott', ott('probeer', 'probeert', 'proberen'));
expect('parkeren', 'vormen.voltooidDeelwoord', 'geparkeerd');
expect('informeren', 'indicatief.ott', ott('informeer', 'informeert', 'informeren'));
expect('informeren', 'vormen.voltooidDeelwoord', 'geïnformeerd');
expect('interesseren', 'vormen.voltooidDeelwoord', 'geïnteresseerd');
expect('blokkeren', 'indicatief.ott', ott('blokkeer', 'blokkeert', 'blokkeren'));
expect('programmeren', 'vormen.voltooidDeelwoord', 'geprogrammeerd');
expect('oordelen', 'indicatief.ott', ott('oordeel', 'oordeelt', 'oordelen'));
expect('beoordelen', 'vormen.voltooidDeelwoord', 'beoordeeld');

// --- 't kofschip ------------------------------------------------------------
expect('werken', 'indicatief.ovt', six('werkte', 'werkten'));
expect('faxen', 'indicatief.ovt', six('faxte', 'faxten'));
expect('faxen', 'vormen.voltooidDeelwoord', 'gefaxt');
expect('hopen', 'indicatief.ovt', six('hoopte', 'hoopten'));
expect('hopen', 'vormen.voltooidDeelwoord', 'gehoopt');
expect('wensen', 'indicatief.ovt', six('wenste', 'wensten'));
expect('fietsen', 'vormen.voltooidDeelwoord', 'gefietst');
expect('lachen', 'indicatief.ovt', six('lachte', 'lachten'));
expect('koken', 'indicatief.ovt', six('kookte', 'kookten'));
expect('praten', 'indicatief.ott', ott('praat', 'praat', 'praten'));
expect('praten', 'indicatief.ovt', six('praatte', 'praatten'));
expect('praten', 'vormen.voltooidDeelwoord', 'gepraat');
expect('wachten', 'indicatief.ott', ott('wacht', 'wacht', 'wachten'));
expect('wachten', 'indicatief.ovt', six('wachtte', 'wachtten'));
expect('wachten', 'vormen.voltooidDeelwoord', 'gewacht');
expect('zetten', 'indicatief.ovt', six('zette', 'zetten'));
expect('zetten', 'vormen.voltooidDeelwoord', 'gezet');
expect('redden', 'indicatief.ott', ott('red', 'redt', 'redden'));
expect('redden', 'indicatief.ovt', six('redde', 'redden'));
expect('redden', 'vormen.voltooidDeelwoord', 'gered');
expect('antwoorden', 'indicatief.ott', ott('antwoord', 'antwoordt', 'antwoorden'));
expect('antwoorden', 'indicatief.ovt', six('antwoordde', 'antwoordden'));
expect('antwoorden', 'vormen.voltooidDeelwoord', 'geantwoord');
expect('branden', 'indicatief.ovt', six('brandde', 'brandden'));
expect('worden', 'indicatief.ott', ott('word', 'wordt', 'worden'));
expect('vinden', 'indicatief.ott', ott('vind', 'vindt', 'vinden'));
expect('houden', 'indicatief.ott', ott('houd', 'houdt', 'houden'));
expect('eten', 'indicatief.ott', ott('eet', 'eet', 'eten'));
check('werken is a -te verb', conjugate('werken').class === 'te');
check('leven is a -de verb', conjugate('leven').class === 'de');
check('faxen is a -te verb', conjugate('faxen').class === 'te');

// --- the participle and its ge- ---------------------------------------------
expect('betalen', 'vormen.voltooidDeelwoord', 'betaald');
expect('gebeuren', 'vormen.voltooidDeelwoord', 'gebeurd');
expect('gebruiken', 'vormen.voltooidDeelwoord', 'gebruikt');
expect('ontmoeten', 'vormen.voltooidDeelwoord', 'ontmoet');
expect('ontmoeten', 'indicatief.ovt', six('ontmoette', 'ontmoetten'));
expect('ontdekken', 'vormen.voltooidDeelwoord', 'ontdekt');
expect('erkennen', 'vormen.voltooidDeelwoord', 'erkend');
expect('herkennen', 'vormen.voltooidDeelwoord', 'herkend');
expect('verwachten', 'vormen.voltooidDeelwoord', 'verwacht');
expect('beantwoorden', 'vormen.voltooidDeelwoord', 'beantwoord');
expect('beïnvloeden', 'vormen.voltooidDeelwoord', 'beïnvloed');
expect('eisen', 'vormen.voltooidDeelwoord', 'geëist');
expect('erven', 'vormen.voltooidDeelwoord', 'geërfd');
expect('uiten', 'vormen.voltooidDeelwoord', 'geuit');
expect('ergeren', 'indicatief.ott', ott('erger', 'ergert', 'ergeren'));
expect('ergeren', 'vormen.voltooidDeelwoord', 'geërgerd');
expect('bedelen', 'vormen.voltooidDeelwoord', 'gebedeld');
expect('verven', 'vormen.voltooidDeelwoord', 'geverfd');
expect('beven', 'vormen.voltooidDeelwoord', 'gebeefd');
expect('herbergen', 'indicatief.ovt', six('herbergde', 'herbergden'));
expect('herbergen', 'vormen.voltooidDeelwoord', 'geherbergd');

// --- the monosyllabic stems ------------------------------------------------
expect('gaan', 'indicatief.ott', ott('ga', 'gaat', 'gaan'));
expect('gaan', 'indicatief.ovt', six('ging', 'gingen'));
expect('gaan', 'indicatief.vtt', perfect(BEN, 'gegaan'));
expect('gaan', 'conjunctief.ott', six('ga', 'gaan'));
expect('gaan', 'imperatief.bevestigend.jij', 'ga');
expect('gaan', 'imperatief.bevestigend.u', 'gaat u');
expect('gaan', 'vormen.tegenwoordigDeelwoord', 'gaand');
expect('gaan', 'vormen.voltooideInfinitief', 'gegaan zijn');
expect('staan', 'indicatief.ott', ott('sta', 'staat', 'staan'));
expect('staan', 'indicatief.ovt', six('stond', 'stonden'));
expect('staan', 'vormen.voltooidDeelwoord', 'gestaan');
expect('doen', 'indicatief.ott', ott('doe', 'doet', 'doen'));
expect('doen', 'indicatief.ovt', six('deed', 'deden'));
expect('doen', 'vormen.voltooidDeelwoord', 'gedaan');
expect('doen', 'vormen.teInfinitief', 'te doen');
expect('zien', 'indicatief.ott', ott('zie', 'ziet', 'zien'));
expect('zien', 'indicatief.ovt', six('zag', 'zagen'));
expect('zien', 'vormen.voltooidDeelwoord', 'gezien');
expect('slaan', 'indicatief.ott', ott('sla', 'slaat', 'slaan'));
expect('slaan', 'indicatief.ovt', six('sloeg', 'sloegen'));
expect('slaan', 'vormen.voltooidDeelwoord', 'geslagen');
expect('skiën', 'indicatief.ott', ott('ski', 'skiet', 'skiën'));
expect('skiën', 'vormen.voltooidDeelwoord', 'geskied');

// --- the anomalous verbs ----------------------------------------------------
expect('zijn', 'indicatief.ott', ['ben', 'bent', 'is', 'zijn', 'zijn', 'zijn']);
expect('zijn', 'indicatief.ovt', six('was', 'waren'));
expect('zijn', 'indicatief.vtt', perfect(BEN, 'geweest'));
expect('zijn', 'indicatief.vvt', perfect(WAS, 'geweest'));
expect('zijn', 'indicatief.ottt', ZAL.map((form) => `${form} zijn`));
expect('zijn', 'indicatief.vttt', ZAL.map((form) => `${form} geweest zijn`));
expect('zijn', 'conjunctief.ott', six('zij', 'zijn'));
expect('zijn', 'imperatief.bevestigend.jij', 'wees');
expect('zijn', 'imperatief.bevestigend.u', 'weest u');
expect('zijn', 'imperatief.ontkennend.jij', 'wees niet');
expect('zijn', 'vormen.tegenwoordigDeelwoord', 'zijnd');
expect('zijn', 'vormen.voltooidDeelwoord', 'geweest');
expect('hebben', 'indicatief.ott', ['heb', 'hebt', 'heeft', 'hebben', 'hebben', 'hebben']);
expect('hebben', 'indicatief.ovt', six('had', 'hadden'));
expect('hebben', 'indicatief.vtt', perfect(HEB, 'gehad'));
expect('hebben', 'conjunctief.ott', six('hebbe', 'hebben'));
expect('hebben', 'imperatief.bevestigend.jij', 'heb');
expect('hebben', 'imperatief.bevestigend.u', 'hebt u');
expect('kunnen', 'indicatief.ott', ['kan', 'kunt', 'kan', 'kunnen', 'kunnen', 'kunnen']);
expect('kunnen', 'indicatief.ovt', six('kon', 'konden'));
expect('kunnen', 'vormen.voltooidDeelwoord', 'gekund');
expect('kunnen', 'imperatief.bevestigend.jij', null);
expect('mogen', 'indicatief.ott', ['mag', 'mag', 'mag', 'mogen', 'mogen', 'mogen']);
expect('mogen', 'indicatief.ovt', six('mocht', 'mochten'));
expect('mogen', 'vormen.voltooidDeelwoord', 'gemogen');
expect('mogen', 'conjunctief.ott', six('moge', 'mogen'));
expect('willen', 'indicatief.ott', ['wil', 'wilt', 'wil', 'willen', 'willen', 'willen']);
expect('willen', 'indicatief.ovt', six('wilde', 'wilden'));
expect('willen', 'vormen.voltooidDeelwoord', 'gewild');
expect('zullen', 'indicatief.ott', ['zal', 'zult', 'zal', 'zullen', 'zullen', 'zullen']);
expect('zullen', 'indicatief.ovt', six('zou', 'zouden'));
expect('zullen', 'vormen.voltooidDeelwoord', null);
expect('zullen', 'indicatief.vtt', [null, null, null, null, null, null]);
expect('moeten', 'indicatief.ott', ott('moet', 'moet', 'moeten'));
expect('moeten', 'indicatief.ovt', six('moest', 'moesten'));
expect('moeten', 'vormen.voltooidDeelwoord', 'gemoeten');
expect('moeten', 'imperatief.bevestigend.jij', 'moet');
expect('skiën', 'conjunctief.ott', six('skië', 'skiën'));
expect('weten', 'indicatief.ott', ott('weet', 'weet', 'weten'));
expect('weten', 'indicatief.ovt', six('wist', 'wisten'));
expect('weten', 'vormen.voltooidDeelwoord', 'geweten');
expect('komen', 'indicatief.ott', ott('kom', 'komt', 'komen'));
expect('komen', 'indicatief.ovt', six('kwam', 'kwamen'));
expect('komen', 'indicatief.vtt', perfect(BEN, 'gekomen'));
expect('komen', 'conjunctief.ott', six('kome', 'komen'));
expect('komen', 'imperatief.bevestigend.u', 'komt u');
expect('houden', 'indicatief.ovt', six('hield', 'hielden'));
expect('houden', 'vormen.voltooidDeelwoord', 'gehouden');
check('zijn: class irregular, flag off', conjugate('zijn').class === 'onregelmatig' && conjugate('zijn').flags.irregular === false);
check('kunnen: class irregular, flag off', conjugate('kunnen').class === 'onregelmatig' && !conjugate('kunnen').flags.irregular);
check('komen: strong and flagged irregular', conjugate('komen').class === 'sterk' && conjugate('komen').flags.irregular === true);
check('gaan is flagged irregular', conjugate('gaan').flags.irregular === true);
check('kijken is not flagged irregular', conjugate('kijken').flags.irregular === false);
check('brengen is mixed and flagged', conjugate('brengen').class === 'gemengd' && conjugate('brengen').flags.irregular === true);
check('bakken is mixed and not flagged', conjugate('bakken').class === 'gemengd' && conjugate('bakken').flags.irregular === false);

// --- the strong classes -----------------------------------------------------
// 1: ij – ee – e
expect('krijgen', 'indicatief.ovt', six('kreeg', 'kregen'));
expect('krijgen', 'vormen.voltooidDeelwoord', 'gekregen');
expect('blijven', 'indicatief.ott', ott('blijf', 'blijft', 'blijven'));
expect('blijven', 'indicatief.ovt', six('bleef', 'bleven'));
expect('blijven', 'indicatief.vtt', perfect(BEN, 'gebleven'));
expect('schrijven', 'indicatief.ovt', six('schreef', 'schreven'));
expect('schrijven', 'vormen.voltooidDeelwoord', 'geschreven');
expect('rijden', 'indicatief.ott', ott('rijd', 'rijdt', 'rijden'));
expect('rijden', 'indicatief.ovt', six('reed', 'reden'));
expect('rijden', 'vormen.voltooidDeelwoord', 'gereden');
expect('lijken', 'indicatief.ovt', six('leek', 'leken'));
expect('wijzen', 'indicatief.ott', ott('wijs', 'wijst', 'wijzen'));
expect('wijzen', 'indicatief.ovt', six('wees', 'wezen'));
expect('wijzen', 'vormen.voltooidDeelwoord', 'gewezen');
expect('stijgen', 'indicatief.vtt', perfect(BEN, 'gestegen'));
expect('verdwijnen', 'indicatief.ovt', six('verdween', 'verdwenen'));
expect('verdwijnen', 'indicatief.vtt', perfect(BEN, 'verdwenen'));
expect('vergelijken', 'indicatief.ovt', six('vergeleek', 'vergeleken'));
expect('vergelijken', 'vormen.voltooidDeelwoord', 'vergeleken');
// 2: ie / ui – oo – o
expect('kiezen', 'indicatief.ott', ott('kies', 'kiest', 'kiezen'));
expect('kiezen', 'indicatief.ovt', six('koos', 'kozen'));
expect('kiezen', 'vormen.voltooidDeelwoord', 'gekozen');
expect('vliegen', 'indicatief.ovt', six('vloog', 'vlogen'));
expect('verliezen', 'indicatief.ott', ott('verlies', 'verliest', 'verliezen'));
expect('verliezen', 'indicatief.ovt', six('verloor', 'verloren'));
expect('verliezen', 'vormen.voltooidDeelwoord', 'verloren');
expect('bieden', 'indicatief.ovt', six('bood', 'boden'));
expect('schieten', 'indicatief.ovt', six('schoot', 'schoten'));
expect('sluiten', 'indicatief.ott', ott('sluit', 'sluit', 'sluiten'));
expect('sluiten', 'indicatief.ovt', six('sloot', 'sloten'));
expect('sluiten', 'vormen.voltooidDeelwoord', 'gesloten');
expect('buigen', 'indicatief.ovt', six('boog', 'bogen'));
expect('ruiken', 'vormen.voltooidDeelwoord', 'geroken');
expect('genieten', 'indicatief.ovt', six('genoot', 'genoten'));
expect('genieten', 'vormen.voltooidDeelwoord', 'genoten');
expect('wegen', 'indicatief.ovt', six('woog', 'wogen'));
expect('bewegen', 'indicatief.ovt', six('bewoog', 'bewogen'));
expect('bewegen', 'vormen.voltooidDeelwoord', 'bewogen');
// 3: i / e – o – o
expect('drinken', 'indicatief.ovt', six('dronk', 'dronken'));
expect('drinken', 'vormen.voltooidDeelwoord', 'gedronken');
expect('vinden', 'indicatief.ovt', six('vond', 'vonden'));
expect('vinden', 'vormen.voltooidDeelwoord', 'gevonden');
expect('beginnen', 'indicatief.ott', ott('begin', 'begint', 'beginnen'));
expect('beginnen', 'indicatief.ovt', six('begon', 'begonnen'));
expect('beginnen', 'indicatief.vtt', perfect(BEN, 'begonnen'));
expect('zingen', 'indicatief.ovt', six('zong', 'zongen'));
expect('winnen', 'indicatief.ovt', six('won', 'wonnen'));
expect('zwemmen', 'indicatief.ott', ott('zwem', 'zwemt', 'zwemmen'));
expect('zwemmen', 'indicatief.ovt', six('zwom', 'zwommen'));
expect('zwemmen', 'vormen.voltooidDeelwoord', 'gezwommen');
expect('trekken', 'indicatief.ovt', six('trok', 'trokken'));
expect('vertrekken', 'indicatief.ovt', six('vertrok', 'vertrokken'));
expect('vertrekken', 'indicatief.vtt', perfect(BEN, 'vertrokken'));
expect('helpen', 'indicatief.ovt', six('hielp', 'hielpen'));
expect('helpen', 'vormen.voltooidDeelwoord', 'geholpen');
expect('sterven', 'indicatief.ott', ott('sterf', 'sterft', 'sterven'));
expect('sterven', 'indicatief.ovt', six('stierf', 'stierven'));
expect('sterven', 'indicatief.vtt', perfect(BEN, 'gestorven'));
expect('worden', 'indicatief.ovt', six('werd', 'werden'));
expect('worden', 'indicatief.vtt', perfect(BEN, 'geworden'));
expect('schrikken', 'indicatief.ovt', six('schrok', 'schrokken'));
expect('vechten', 'indicatief.ovt', six('vocht', 'vochten'));
// 4: e – a – o
expect('nemen', 'indicatief.ott', ott('neem', 'neemt', 'nemen'));
expect('nemen', 'indicatief.ovt', six('nam', 'namen'));
expect('nemen', 'vormen.voltooidDeelwoord', 'genomen');
expect('spreken', 'indicatief.ovt', six('sprak', 'spraken'));
expect('spreken', 'vormen.voltooidDeelwoord', 'gesproken');
expect('breken', 'indicatief.ovt', six('brak', 'braken'));
expect('stelen', 'vormen.voltooidDeelwoord', 'gestolen');
expect('bevelen', 'indicatief.ott', ott('beveel', 'beveelt', 'bevelen'));
expect('bevelen', 'indicatief.ovt', six('beval', 'bevalen'));
expect('bevelen', 'vormen.voltooidDeelwoord', 'bevolen');
// 5: e / i – a – e
expect('eten', 'indicatief.ovt', six('at', 'aten'));
expect('eten', 'vormen.voltooidDeelwoord', 'gegeten');
expect('geven', 'indicatief.ott', ott('geef', 'geeft', 'geven'));
expect('geven', 'indicatief.ovt', six('gaf', 'gaven'));
expect('geven', 'vormen.voltooidDeelwoord', 'gegeven');
expect('lezen', 'indicatief.ott', ott('lees', 'leest', 'lezen'));
expect('lezen', 'indicatief.ovt', six('las', 'lazen'));
expect('lezen', 'vormen.voltooidDeelwoord', 'gelezen');
expect('zitten', 'indicatief.ovt', six('zat', 'zaten'));
expect('zitten', 'vormen.voltooidDeelwoord', 'gezeten');
expect('liggen', 'indicatief.ott', ott('lig', 'ligt', 'liggen'));
expect('liggen', 'indicatief.ovt', six('lag', 'lagen'));
expect('liggen', 'vormen.voltooidDeelwoord', 'gelegen');
expect('vergeten', 'indicatief.ott', ott('vergeet', 'vergeet', 'vergeten'));
expect('vergeten', 'indicatief.ovt', six('vergat', 'vergaten'));
expect('vergeten', 'vormen.voltooidDeelwoord', 'vergeten');
expect('bidden', 'indicatief.ovt', six('bad', 'baden'));
expect('bidden', 'vormen.voltooidDeelwoord', 'gebeden');
// 6: a – oe – a
expect('dragen', 'indicatief.ott', ott('draag', 'draagt', 'dragen'));
expect('dragen', 'indicatief.ovt', six('droeg', 'droegen'));
expect('dragen', 'vormen.voltooidDeelwoord', 'gedragen');
expect('graven', 'indicatief.ovt', six('groef', 'groeven'));
expect('varen', 'indicatief.ovt', six('voer', 'voeren'));
// 7
expect('lopen', 'indicatief.ovt', six('liep', 'liepen'));
expect('lopen', 'vormen.voltooidDeelwoord', 'gelopen');
expect('laten', 'indicatief.ott', ott('laat', 'laat', 'laten'));
expect('laten', 'indicatief.ovt', six('liet', 'lieten'));
expect('slapen', 'indicatief.ovt', six('sliep', 'sliepen'));
expect('roepen', 'indicatief.ovt', six('riep', 'riepen'));
expect('vallen', 'indicatief.ott', ott('val', 'valt', 'vallen'));
expect('vallen', 'indicatief.ovt', six('viel', 'vielen'));
expect('vallen', 'indicatief.vtt', perfect(BEN, 'gevallen'));
expect('hangen', 'indicatief.ovt', six('hing', 'hingen'));
expect('vangen', 'indicatief.ovt', six('ving', 'vingen'));
expect('blazen', 'indicatief.ovt', six('blies', 'bliezen'));

// --- the mixed verbs --------------------------------------------------------
expect('bakken', 'indicatief.ovt', six('bakte', 'bakten'));
expect('bakken', 'vormen.voltooidDeelwoord', 'gebakken');
expect('lachen', 'vormen.voltooidDeelwoord', 'gelachen');
expect('vragen', 'indicatief.ott', ott('vraag', 'vraagt', 'vragen'));
expect('vragen', 'indicatief.ovt', six('vroeg', 'vroegen'));
expect('vragen', 'vormen.voltooidDeelwoord', 'gevraagd');
expect('zeggen', 'indicatief.ott', ott('zeg', 'zegt', 'zeggen'));
expect('zeggen', 'indicatief.ovt', six('zei', 'zeiden'));
expect('zeggen', 'vormen.voltooidDeelwoord', 'gezegd');
expect('kopen', 'indicatief.ovt', six('kocht', 'kochten'));
expect('kopen', 'vormen.voltooidDeelwoord', 'gekocht');
expect('brengen', 'indicatief.ovt', six('bracht', 'brachten'));
expect('brengen', 'vormen.voltooidDeelwoord', 'gebracht');
expect('denken', 'indicatief.ovt', six('dacht', 'dachten'));
expect('denken', 'vormen.voltooidDeelwoord', 'gedacht');
expect('zoeken', 'indicatief.ovt', six('zocht', 'zochten'));
expect('zoeken', 'vormen.voltooidDeelwoord', 'gezocht');
expect('heten', 'indicatief.ovt', six('heette', 'heetten'));
expect('heten', 'vormen.voltooidDeelwoord', 'geheten');
expect('wassen', 'indicatief.ovt', six('waste', 'wasten'));
expect('wassen', 'vormen.voltooidDeelwoord', 'gewassen');
expect('scheiden', 'indicatief.ovt', six('scheidde', 'scheidden'));
expect('scheiden', 'vormen.voltooidDeelwoord', 'gescheiden');
expect('laden', 'vormen.voltooidDeelwoord', 'geladen');
expect('raden', 'indicatief.ovt', six('raadde', 'raadden'));

// --- separable and inseparable ----------------------------------------------
expect('opbellen', 'indicatief.ott', ['bel op', 'belt op', 'belt op', 'bellen op', 'bellen op', 'bellen op']);
expect('opbellen', 'indicatief.ovt', six('belde op', 'belden op'));
expect('opbellen', 'indicatief.ottt', ZAL.map((form) => `${form} opbellen`));
expect('opbellen', 'indicatief.vtt', perfect(HEB, 'opgebeld'));
expect('opbellen', 'conjunctief.ott', six('belle op', 'bellen op'));
expect('opbellen', 'imperatief.bevestigend.jij', 'bel op');
expect('opbellen', 'imperatief.bevestigend.u', 'belt u op');
expect('opbellen', 'imperatief.ontkennend.jij', 'bel niet op');
expect('opbellen', 'imperatief.ontkennend.u', 'belt u niet op');
expect('opbellen', 'vormen.infinitief', 'opbellen');
expect('opbellen', 'vormen.tegenwoordigDeelwoord', 'opbellend');
expect('opbellen', 'vormen.voltooidDeelwoord', 'opgebeld');
expect('opbellen', 'vormen.voltooideInfinitief', 'opgebeld hebben');
expect('opbellen', 'vormen.teInfinitief', 'op te bellen');
expect('aankomen', 'indicatief.ott', ['kom aan', 'komt aan', 'komt aan', 'komen aan', 'komen aan', 'komen aan']);
expect('aankomen', 'indicatief.ovt', six('kwam aan', 'kwamen aan'));
expect('aankomen', 'indicatief.vtt', perfect(BEN, 'aangekomen'));
expect('aankomen', 'vormen.teInfinitief', 'aan te komen');
expect('opstaan', 'indicatief.ott', ['sta op', 'staat op', 'staat op', 'staan op', 'staan op', 'staan op']);
expect('opstaan', 'indicatief.vtt', perfect(BEN, 'opgestaan'));
expect('uitnodigen', 'indicatief.ovt', six('nodigde uit', 'nodigden uit'));
expect('uitnodigen', 'vormen.voltooidDeelwoord', 'uitgenodigd');
expect('opeten', 'vormen.voltooidDeelwoord', 'opgegeten');
expect('meenemen', 'indicatief.ovt', six('nam mee', 'namen mee'));
expect('meenemen', 'vormen.voltooidDeelwoord', 'meegenomen');
expect('voorbereiden', 'indicatief.ott', ['bereid voor', 'bereidt voor', 'bereidt voor', 'bereiden voor', 'bereiden voor', 'bereiden voor']);
expect('voorbereiden', 'vormen.voltooidDeelwoord', 'voorbereid');
expect('voorbereiden', 'vormen.teInfinitief', 'voor te bereiden');
expect('aanbevelen', 'indicatief.ovt', six('beval aan', 'bevalen aan'));
expect('aanbevelen', 'vormen.voltooidDeelwoord', 'aanbevolen');
expect('uitverkopen', 'vormen.voltooidDeelwoord', 'uitverkocht');
expect('plaatsvinden', 'vormen.voltooidDeelwoord', 'plaatsgevonden');
expect('inloggen', 'indicatief.ott', ['log in', 'logt in', 'logt in', 'loggen in', 'loggen in', 'loggen in']);
expect('inloggen', 'vormen.voltooidDeelwoord', 'ingelogd');
expect('afluisteren', 'indicatief.ott', ['luister af', 'luistert af', 'luistert af', 'luisteren af', 'luisteren af', 'luisteren af']);
expect('afluisteren', 'vormen.voltooidDeelwoord', 'afgeluisterd');
expect('uitproberen', 'vormen.voltooidDeelwoord', 'uitgeprobeerd');
// Inseparable: nothing moves, no ge-.
expect('begrijpen', 'indicatief.ott', ott('begrijp', 'begrijpt', 'begrijpen'));
expect('begrijpen', 'indicatief.ovt', six('begreep', 'begrepen'));
expect('begrijpen', 'vormen.voltooidDeelwoord', 'begrepen');
expect('verstaan', 'indicatief.ovt', six('verstond', 'verstonden'));
expect('verstaan', 'vormen.voltooidDeelwoord', 'verstaan');
expect('bestaan', 'indicatief.vtt', perfect(HEB, 'bestaan'));
expect('ontvangen', 'indicatief.ovt', six('ontving', 'ontvingen'));
expect('ontvangen', 'vormen.voltooidDeelwoord', 'ontvangen');
expect('onthouden', 'indicatief.ovt', six('onthield', 'onthielden'));
expect('ontbijten', 'indicatief.ovt', six('ontbeet', 'ontbeten'));
expect('ontbijten', 'vormen.voltooidDeelwoord', 'ontbeten');
expect('verkopen', 'indicatief.ovt', six('verkocht', 'verkochten'));
expect('bezoeken', 'vormen.voltooidDeelwoord', 'bezocht');
expect('onderzoeken', 'indicatief.ott', ott('onderzoek', 'onderzoekt', 'onderzoeken'));
expect('onderzoeken', 'indicatief.ovt', six('onderzocht', 'onderzochten'));
expect('onderzoeken', 'vormen.voltooidDeelwoord', 'onderzocht');
expect('onderzoeken', 'vormen.teInfinitief', 'te onderzoeken');
expect('overtuigen', 'vormen.voltooidDeelwoord', 'overtuigd');
expect('voorkomen', 'indicatief.ott', ott('voorkom', 'voorkomt', 'voorkomen'));
expect('voorkomen', 'indicatief.ovt', six('voorkwam', 'voorkwamen'));
expect('voorkomen', 'indicatief.vtt', perfect(HEB, 'voorkomen'));
expect('ondernemen', 'vormen.voltooidDeelwoord', 'ondernomen');
expect('overlijden', 'indicatief.vtt', perfect(BEN, 'overleden'));
expect('voldoen', 'indicatief.ovt', six('voldeed', 'voldeden'));
expect('voldoen', 'vormen.voltooidDeelwoord', 'voldaan');
expect('omhelzen', 'vormen.voltooidDeelwoord', 'omhelsd');
expect('interviewen', 'vormen.voltooidDeelwoord', 'geïnterviewd');
expect('openen', 'indicatief.ovt', six('opende', 'openden'));
expect('naderen', 'indicatief.ott', ott('nader', 'nadert', 'naderen'));
expect('informeren', 'indicatief.ovt', six('informeerde', 'informeerden'));
expect('verwelkomen', 'indicatief.ovt', six('verwelkomde', 'verwelkomden'));
expect('verwelkomen', 'vormen.voltooidDeelwoord', 'verwelkomd');
expect('glimlachen', 'vormen.voltooidDeelwoord', 'geglimlacht');
expect('stofzuigen', 'indicatief.ovt', six('stofzuigde', 'stofzuigden'));
check('opbellen is separable on op', conjugate('opbellen').flags.separable === 'op');
check('begrijpen is not separable', conjugate('begrijpen').flags.separable === null);
check('begrijpen is derived from grijpen', conjugate('begrijpen').flags.derivedFrom === 'grijpen');
check('aankomen is derived from komen', conjugate('aankomen').flags.derivedFrom === 'komen');
check('aanbevelen is derived from bevelen', conjugate('aanbevelen').flags.derivedFrom === 'bevelen');
check('beginnen is not derived', conjugate('beginnen').flags.derivedFrom === null);
check('werken is not derived', conjugate('werken').flags.derivedFrom === null);
check('aankomen is still a strong verb', conjugate('aankomen').class === 'sterk');

// --- the auxiliary ----------------------------------------------------------
const aux = (verb) => conjugate(verb).auxiliary;
for (const [verb, expected] of [['werken', 'hebben'], ['zijn', 'zijn'], ['hebben', 'hebben'], ['gaan', 'zijn'],
  ['komen', 'zijn'], ['blijven', 'zijn'], ['worden', 'zijn'], ['beginnen', 'zijn'], ['gebeuren', 'zijn'],
  ['sterven', 'zijn'], ['vallen', 'zijn'], ['stijgen', 'zijn'], ['vertrekken', 'zijn'], ['aankomen', 'zijn'],
  ['weggaan', 'zijn'], ['opvallen', 'zijn'], ['thuisblijven', 'zijn'], ['aanvallen', 'hebben'],
  ['voorkomen', 'hebben'], ['bestaan', 'hebben'], ['opstaan', 'zijn'], ['ontstaan', 'zijn'],
  ['lopen', 'hebben'], ['verhuizen', 'zijn'], ['trouwen', 'zijn'], ['slagen', 'zijn'], ['zich vergissen', 'hebben'],
  ['zich herinneren', 'hebben'], ['staan', 'hebben'], ['eten', 'hebben']]) {
  check(`${verb}: auxiliary should be ${expected}, got ${aux(verb)}`, aux(verb) === expected);
}
check('auxiliary is copied to the flags', conjugate('gaan').flags.auxiliary === 'zijn');
expect('gaan', 'indicatief.vvt', perfect(WAS, 'gegaan'));
expect('gaan', 'indicatief.vvtt', ZOU.map((form) => `${form} gegaan zijn`));

// --- reflexives follow the Spanish convention --------------------------------
const reflexive = conjugate('zich herinneren');
check('zich herinneren: accepted, conjugated as herinneren',
  reflexive.ok && reflexive.pronominal && reflexive.verb === 'herinneren' && reflexive.input === 'zich herinneren');
expect('zich herinneren', 'indicatief.ott', ott('herinner', 'herinnert', 'herinneren'));
expect('zich herinneren', 'indicatief.vtt', perfect(HEB, 'herinnerd'));
expect('zich herinneren', 'vormen.infinitief', 'herinneren');
expect('zich vergissen', 'indicatief.ovt', six('vergiste', 'vergisten'));
expect('zich vergissen', 'vormen.voltooidDeelwoord', 'vergist');
check('herinneren alone is not pronominal', conjugate('herinneren').pronominal === false);
check('zich verslapen takes hebben as a reflexive', conjugate('zich verslapen').auxiliary === 'hebben');
check('zich herinneren has no irregular cells', irregularCells('zich herinneren').size === 0);
check('zich verslapen marks only what verslapen marks', !irregularCells('zich verslapen').has('indicatief.ott.ik')
  && irregularCells('zich verslapen').has('indicatief.ovt.ik'));
expect('zich verslapen', 'indicatief.vtt', perfect(HEB, 'verslapen'));

// --- normalisation and rejection --------------------------------------------
check('input is trimmed and lowercased', conjugate('  Werken ').ok && conjugate('  Werken ').verb === 'werken');
check('zich with extra spaces', conjugate('ZICH   herinneren').verb === 'herinneren');
for (const garbage of ['huis', 'xyz', 'en', '123en', 'werk', 'mooi', '']) {
  check(`${JSON.stringify(garbage)}: should be rejected`, !conjugate(garbage).ok);
}
check('rejection carries an error code', conjugate('huis').error === 'not-an-infinitive');
check('empty input says so', conjugate('').error === 'empty');
check('result carries the input', conjugate('huis').input === 'huis');

// --- the table has exactly the agreed keys ----------------------------------
const KEYS = {
  vormen: ['infinitief', 'tegenwoordigDeelwoord', 'voltooidDeelwoord', 'voltooideInfinitief', 'teInfinitief'],
  indicatief: ['ott', 'ovt', 'ottt', 'ovtt', 'vtt', 'vvt', 'vttt', 'vvtt'],
  conjunctief: ['ott'],
  imperatief: ['bevestigend', 'ontkennend'],
};
const sameKeys = (object, keys) => {
  const have = Object.keys(object ?? {}).sort();
  const want = [...keys].sort();
  return have.length === want.length && have.every((key, index) => key === want[index]);
};
for (const verb of ['werken', 'zijn', 'opbellen', 'zullen']) {
  const { table } = conjugate(verb);
  check(`${verb}: table has exactly the four sections`, sameKeys(table, Object.keys(KEYS)));
  for (const [section, keys] of Object.entries(KEYS)) {
    check(`${verb}: ${section} has exactly its keys`, sameKeys(table[section], keys));
  }
  for (const tense of KEYS.indicatief) check(`${verb}: indicatief.${tense} has the six persons`, sameKeys(table.indicatief[tense], PERSONS));
  check(`${verb}: conjunctief.ott has the six persons`, sameKeys(table.conjunctief.ott, PERSONS));
  for (const kind of KEYS.imperatief) check(`${verb}: imperatief.${kind} has jij and u`, sameKeys(table.imperatief[kind], ['jij', 'u']));
}
check('SHAPE names the moods', SHAPE.moods.join() === 'indicatief,conjunctief' && SHAPE.imperative === 'imperatief' && SHAPE.nonFinite === 'vormen');

// --- every cell is filled for a handful of verbs ------------------------------
for (const verb of ['werken', 'spelen', 'kijken', 'zijn', 'hebben', 'opbellen', 'aankomen', 'begrijpen', 'gaan', 'doen', 'zich herinneren']) {
  const { table } = conjugate(verb);
  let empty = 0;
  for (const mood of ['indicatief', 'conjunctief']) {
    for (const forms of Object.values(table[mood])) {
      for (const person of PERSONS) if (typeof forms[person] !== 'string' || !forms[person]) empty += 1;
    }
  }
  for (const forms of Object.values(table.imperatief)) {
    for (const form of Object.values(forms)) if (typeof form !== 'string' || !form) empty += 1;
  }
  for (const form of Object.values(table.vormen)) if (typeof form !== 'string' || !form) empty += 1;
  check(`${verb}: every cell is a non-empty string (${empty} empty)`, empty === 0);
}

// --- every indexed verb conjugates, and its class has a label ----------------
for (const [verb, gloss] of COMMON_VERBS) {
  const result = conjugate(verb);
  check(`${verb} conjugates`, result.ok);
  check(`${verb} has a labelled class (${result.class})`, Boolean(CLASS_LABELS[result.class]));
  check(`${verb} gloss starts with "to "`, typeof gloss === 'string' && gloss.startsWith('to '));
}
check('at least 250 indexed verbs', COMMON_VERBS.length >= 250);
check('the index has no duplicates', new Set(COMMON_VERBS.map(([verb]) => verb)).size === COMMON_VERBS.length);
check('exactly three model verbs', Object.keys(MODEL_VERBS).length === 3);
for (const verb of Object.keys(IRREGULARS)) check(`irregular ${verb} conjugates`, conjugate(verb).ok);
for (const code of Object.keys(CLASS_LABELS)) {
  const label = CLASS_LABELS[code];
  check(`class ${code} has nl and en labels`, Boolean(label.tab?.nl && label.tab?.en && label.chip?.nl && label.chip?.en));
}

// --- irregular cells --------------------------------------------------------
check('werken has no irregular cells', irregularCells('werken').size === 0);
check('spelen has no irregular cells', irregularCells('spelen').size === 0);
check('kijken marks the past', irregularCells('kijken').has('indicatief.ovt.ik') && irregularCells('kijken').has('indicatief.ovt.wij'));
check('kijken does not mark the present', !irregularCells('kijken').has('indicatief.ott.ik'));
check('kijken marks the participle', irregularCells('kijken').has('vormen.voltooidDeelwoord'));
check('komen marks the present', irregularCells('komen').has('indicatief.ott.ik'));
check('zijn marks the imperative', irregularCells('zijn').has('imperatief.bevestigend.jij'));
check('opbellen has no irregular cells', irregularCells('opbellen').size === 0);
check('aankomen marks the past but not the plural present',
  irregularCells('aankomen').has('indicatief.ovt.ik') && !irregularCells('aankomen').has('indicatief.ott.wij'));
check('a shown table can be passed in', irregularCells('kijken', conjugate('kijken').table).has('indicatief.ovt.ik'));
check('plain mode ignores the data', conjugate('kijken', { plain: true }).table.indicatief.ovt.ik === 'kijkte');

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Dutch conjugation checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Dutch conjugation checks passed`);
