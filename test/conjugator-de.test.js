/**
 * Reference forms for the German conjugation engine, checked against the
 * Duden paradigms and the de.wiktionary Flexion tables. Run with `npm test`.
 */
import {
  conjugate, irregularCells, PERSONS, CLASS_LABELS, STEM_CHANGE_LABELS, SHAPE, IMPERATIVE_PERSONS,
} from '../public/js/lib/conjugator-de.js';
import { COMMON_VERBS, MODEL_VERBS, IRREGULARS } from '../public/js/data/verbs-de.js';

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

// --- the weak model -----------------------------------------------------------
expect('machen', 'indikativ.praesens', ['mache', 'machst', 'macht', 'machen', 'macht', 'machen']);
expect('machen', 'indikativ.praeteritum', ['machte', 'machtest', 'machte', 'machten', 'machtet', 'machten']);
expect('machen', 'indikativ.futur1', ['werde machen', 'wirst machen', 'wird machen', 'werden machen', 'werdet machen', 'werden machen']);
expect('machen', 'indikativ.perfekt', ['habe gemacht', 'hast gemacht', 'hat gemacht', 'haben gemacht', 'habt gemacht', 'haben gemacht']);
expect('machen', 'indikativ.plusquamperfekt', ['hatte gemacht', 'hattest gemacht', 'hatte gemacht', 'hatten gemacht', 'hattet gemacht', 'hatten gemacht']);
expect('machen', 'indikativ.futur2', ['werde gemacht haben', 'wirst gemacht haben', 'wird gemacht haben', 'werden gemacht haben', 'werdet gemacht haben', 'werden gemacht haben']);
expect('machen', 'konjunktiv.konjunktiv1', ['mache', 'machest', 'mache', 'machen', 'machet', 'machen']);
expect('machen', 'konjunktiv.konjunktiv2', ['machte', 'machtest', 'machte', 'machten', 'machtet', 'machten']);
expect('machen', 'konjunktiv.wuerde', ['würde machen', 'würdest machen', 'würde machen', 'würden machen', 'würdet machen', 'würden machen']);
expect('machen', 'konjunktiv.konjunktiv1Perfekt', ['habe gemacht', 'habest gemacht', 'habe gemacht', 'haben gemacht', 'habet gemacht', 'haben gemacht']);
expect('machen', 'konjunktiv.konjunktiv2Plusquamperfekt', ['hätte gemacht', 'hättest gemacht', 'hätte gemacht', 'hätten gemacht', 'hättet gemacht', 'hätten gemacht']);
expect('machen', 'imperativ.affirmativ.du', 'mach');
expect('machen', 'imperativ.affirmativ.wir', 'machen wir');
expect('machen', 'imperativ.affirmativ.ihr', 'macht');
expect('machen', 'imperativ.affirmativ.sie', 'machen Sie');
expect('machen', 'imperativ.negativ.du', 'mach nicht');
expect('machen', 'imperativ.negativ.sie', 'machen Sie nicht');
expect('machen', 'formen.infinitiv', 'machen');
expect('machen', 'formen.partizip1', 'machend');
expect('machen', 'formen.partizip2', 'gemacht');
expect('machen', 'formen.infinitivPerfekt', 'gemacht haben');
expect('machen', 'formen.zuInfinitiv', 'zu machen');

// --- spelling that only keeps the word sayable ----------------------------------
expect('arbeiten', 'indikativ.praesens', ['arbeite', 'arbeitest', 'arbeitet', 'arbeiten', 'arbeitet', 'arbeiten']);
expect('arbeiten', 'indikativ.praeteritum', ['arbeitete', 'arbeitetest', 'arbeitete', 'arbeiteten', 'arbeitetet', 'arbeiteten']);
expect('arbeiten', 'formen.partizip2', 'gearbeitet');
expect('arbeiten', 'imperativ.affirmativ.du', 'arbeite');
expect('reden', 'indikativ.praesens', ['rede', 'redest', 'redet', 'reden', 'redet', 'reden']);
expect('atmen', 'indikativ.praesens', ['atme', 'atmest', 'atmet', 'atmen', 'atmet', 'atmen']);
expect('atmen', 'formen.partizip2', 'geatmet');
expect('öffnen', 'indikativ.praesens', ['öffne', 'öffnest', 'öffnet', 'öffnen', 'öffnet', 'öffnen']);
expect('öffnen', 'imperativ.affirmativ.du', 'öffne');
expect('rechnen', 'indikativ.praesens', ['rechne', 'rechnest', 'rechnet', 'rechnen', 'rechnet', 'rechnen']);
expect('zeichnen', 'indikativ.praeteritum', ['zeichnete', 'zeichnetest', 'zeichnete', 'zeichneten', 'zeichnetet', 'zeichneten']);
// l, r, a vowel or a doubled nasal before m/n: no e.
expect('lernen', 'indikativ.praesens', ['lerne', 'lernst', 'lernt', 'lernen', 'lernt', 'lernen']);
expect('wohnen', 'indikativ.praesens', ['wohne', 'wohnst', 'wohnt', 'wohnen', 'wohnt', 'wohnen']);
expect('kommen', 'indikativ.praesens', ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen']);
// Sibilant stems: du reist, not *reisst.
expect('reisen', 'indikativ.praesens', ['reise', 'reist', 'reist', 'reisen', 'reist', 'reisen']);
expect('heißen', 'indikativ.praesens', ['heiße', 'heißt', 'heißt', 'heißen', 'heißt', 'heißen']);
expect('sitzen', 'indikativ.praesens', ['sitze', 'sitzt', 'sitzt', 'sitzen', 'sitzt', 'sitzen']);
expect('mixen', 'indikativ.praesens', ['mixe', 'mixt', 'mixt', 'mixen', 'mixt', 'mixen']);
expect('tanzen', 'indikativ.praeteritum', ['tanzte', 'tanztest', 'tanzte', 'tanzten', 'tanztet', 'tanzten']);
expect('waschen', 'indikativ.praesens', ['wasche', 'wäschst', 'wäscht', 'waschen', 'wascht', 'waschen']);
// -eln and -ern.
expect('sammeln', 'indikativ.praesens', ['sammle', 'sammelst', 'sammelt', 'sammeln', 'sammelt', 'sammeln']);
expect('sammeln', 'indikativ.praeteritum', ['sammelte', 'sammeltest', 'sammelte', 'sammelten', 'sammeltet', 'sammelten']);
expect('sammeln', 'konjunktiv.konjunktiv1', ['sammle', 'sammelst', 'sammle', 'sammeln', 'sammelt', 'sammeln']);
expect('sammeln', 'formen.partizip2', 'gesammelt');
expect('sammeln', 'formen.partizip1', 'sammelnd');
expect('sammeln', 'imperativ.affirmativ.du', 'sammle');
expect('sammeln', 'imperativ.affirmativ.ihr', 'sammelt');
expect('lächeln', 'indikativ.praesens', ['lächle', 'lächelst', 'lächelt', 'lächeln', 'lächelt', 'lächeln']);
expect('wandern', 'indikativ.praesens', ['wandere', 'wanderst', 'wandert', 'wandern', 'wandert', 'wandern']);
expect('wandern', 'konjunktiv.konjunktiv1', ['wandere', 'wanderst', 'wandere', 'wandern', 'wandert', 'wandern']);
expect('wandern', 'indikativ.perfekt', ['bin gewandert', 'bist gewandert', 'ist gewandert', 'sind gewandert', 'seid gewandert', 'sind gewandert']);
expect('wandern', 'imperativ.affirmativ.du', 'wandere');
expect('ändern', 'formen.partizip2', 'geändert');
expect('knien', 'indikativ.praesens', ['knie', 'kniest', 'kniet', 'knien', 'kniet', 'knien']);
expect('knien', 'formen.partizip2', 'gekniet');
// -ig and the du imperative.
expect('entschuldigen', 'imperativ.affirmativ.du', 'entschuldige');
expect('zeigen', 'imperativ.affirmativ.du', 'zeig');
check('arbeiten reports e-Einschub', conjugate('arbeiten').flags.ortho === 'e-Einschub');
check('reisen reports the merged -st', conjugate('reisen').flags.ortho === '-st → -t');
check('sammeln reports the dropped e', conjugate('sammeln').flags.ortho === '-ele → -le');
check('machen reports no spelling change', conjugate('machen').flags.ortho === null);

// --- the strong model, and every ablaut class ---------------------------------------
expect('geben', 'indikativ.praesens', ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben']);
expect('geben', 'indikativ.praeteritum', ['gab', 'gabst', 'gab', 'gaben', 'gabt', 'gaben']);
expect('geben', 'indikativ.perfekt', ['habe gegeben', 'hast gegeben', 'hat gegeben', 'haben gegeben', 'habt gegeben', 'haben gegeben']);
expect('geben', 'konjunktiv.konjunktiv1', ['gebe', 'gebest', 'gebe', 'geben', 'gebet', 'geben']);
expect('geben', 'konjunktiv.konjunktiv2', ['gäbe', 'gäbest', 'gäbe', 'gäben', 'gäbet', 'gäben']);
expect('geben', 'imperativ.affirmativ.du', 'gib');
expect('geben', 'imperativ.affirmativ.ihr', 'gebt');
expect('geben', 'formen.partizip2', 'gegeben');
expect('geben', 'formen.zuInfinitiv', 'zu geben');

// ei – i – i / ei – ie – ie
expect('beißen', 'indikativ.praeteritum', ['biss', 'bissest', 'biss', 'bissen', 'bisst', 'bissen']);
expect('beißen', 'formen.partizip2', 'gebissen');
expect('schneiden', 'indikativ.praesens', ['schneide', 'schneidest', 'schneidet', 'schneiden', 'schneidet', 'schneiden']);
expect('schneiden', 'indikativ.praeteritum', ['schnitt', 'schnittest', 'schnitt', 'schnitten', 'schnittet', 'schnitten']);
expect('leiden', 'formen.partizip2', 'gelitten');
expect('greifen', 'indikativ.praeteritum', ['griff', 'griffst', 'griff', 'griffen', 'grifft', 'griffen']);
expect('reiten', 'konjunktiv.konjunktiv2', ['ritte', 'rittest', 'ritte', 'ritten', 'rittet', 'ritten']);
expect('bleiben', 'indikativ.praeteritum', ['blieb', 'bliebst', 'blieb', 'blieben', 'bliebt', 'blieben']);
expect('bleiben', 'indikativ.perfekt', ['bin geblieben', 'bist geblieben', 'ist geblieben', 'sind geblieben', 'seid geblieben', 'sind geblieben']);
expect('schreiben', 'konjunktiv.konjunktiv2', ['schriebe', 'schriebest', 'schriebe', 'schrieben', 'schriebet', 'schrieben']);
expect('schreiben', 'formen.partizip2', 'geschrieben');
expect('steigen', 'formen.partizip2', 'gestiegen');
expect('leihen', 'indikativ.praeteritum', ['lieh', 'liehst', 'lieh', 'liehen', 'lieht', 'liehen']);
expect('schreien', 'indikativ.praeteritum', ['schrie', 'schriest', 'schrie', 'schrien', 'schriet', 'schrien']);
expect('schreien', 'formen.partizip2', 'geschrien');

// ie – o – o
expect('fliegen', 'indikativ.praeteritum', ['flog', 'flogst', 'flog', 'flogen', 'flogt', 'flogen']);
expect('fliegen', 'konjunktiv.konjunktiv2', ['flöge', 'flögest', 'flöge', 'flögen', 'flöget', 'flögen']);
expect('fliegen', 'formen.infinitivPerfekt', 'geflogen sein');
expect('ziehen', 'indikativ.praeteritum', ['zog', 'zogst', 'zog', 'zogen', 'zogt', 'zogen']);
expect('ziehen', 'formen.partizip2', 'gezogen');
expect('schließen', 'indikativ.praeteritum', ['schloss', 'schlossest', 'schloss', 'schlossen', 'schlosst', 'schlossen']);
expect('schließen', 'formen.partizip2', 'geschlossen');
expect('bieten', 'indikativ.praeteritum', ['bot', 'botest', 'bot', 'boten', 'botet', 'boten']);
expect('verlieren', 'indikativ.praeteritum', ['verlor', 'verlorst', 'verlor', 'verloren', 'verlort', 'verloren']);
expect('verlieren', 'formen.partizip2', 'verloren');
expect('lügen', 'konjunktiv.konjunktiv2', ['löge', 'lögest', 'löge', 'lögen', 'löget', 'lögen']);
expect('heben', 'formen.partizip2', 'gehoben');
expect('saufen', 'indikativ.praesens', ['saufe', 'säufst', 'säuft', 'saufen', 'sauft', 'saufen']);
expect('schmelzen', 'indikativ.praesens', ['schmelze', 'schmilzt', 'schmilzt', 'schmelzen', 'schmelzt', 'schmelzen']);
expect('schmelzen', 'formen.partizip2', 'geschmolzen');
expect('fechten', 'indikativ.praesens', ['fechte', 'fichtst', 'ficht', 'fechten', 'fechtet', 'fechten']);
expect('fechten', 'indikativ.praeteritum', ['focht', 'fochtest', 'focht', 'fochten', 'fochtet', 'fochten']);

// i – a – u
expect('singen', 'indikativ.praeteritum', ['sang', 'sangst', 'sang', 'sangen', 'sangt', 'sangen']);
expect('singen', 'konjunktiv.konjunktiv2', ['sänge', 'sängest', 'sänge', 'sängen', 'sänget', 'sängen']);
expect('singen', 'formen.partizip2', 'gesungen');
expect('finden', 'indikativ.praesens', ['finde', 'findest', 'findet', 'finden', 'findet', 'finden']);
expect('finden', 'indikativ.praeteritum', ['fand', 'fandest', 'fand', 'fanden', 'fandet', 'fanden']);
expect('finden', 'konjunktiv.konjunktiv2', ['fände', 'fändest', 'fände', 'fänden', 'fändet', 'fänden']);
expect('finden', 'formen.partizip2', 'gefunden');
expect('finden', 'imperativ.affirmativ.du', 'finde');
expect('trinken', 'formen.partizip2', 'getrunken');
expect('springen', 'indikativ.perfekt', ['bin gesprungen', 'bist gesprungen', 'ist gesprungen', 'sind gesprungen', 'seid gesprungen', 'sind gesprungen']);
expect('zwingen', 'indikativ.praeteritum', ['zwang', 'zwangst', 'zwang', 'zwangen', 'zwangt', 'zwangen']);

// i – a – o, e – a – o
expect('beginnen', 'indikativ.praeteritum', ['begann', 'begannst', 'begann', 'begannen', 'begannt', 'begannen']);
expect('beginnen', 'konjunktiv.konjunktiv2', ['begänne', 'begännest', 'begänne', 'begännen', 'begännet', 'begännen']);
expect('beginnen', 'formen.partizip2', 'begonnen');
expect('gewinnen', 'formen.partizip2', 'gewonnen');
expect('schwimmen', 'indikativ.praeteritum', ['schwamm', 'schwammst', 'schwamm', 'schwammen', 'schwammt', 'schwammen']);
expect('schwimmen', 'konjunktiv.konjunktiv2', ['schwömme', 'schwömmest', 'schwömme', 'schwömmen', 'schwömmet', 'schwömmen']);
expect('helfen', 'indikativ.praesens', ['helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'helfen']);
expect('helfen', 'indikativ.praeteritum', ['half', 'halfst', 'half', 'halfen', 'halft', 'halfen']);
expect('helfen', 'konjunktiv.konjunktiv2', ['hülfe', 'hülfest', 'hülfe', 'hülfen', 'hülfet', 'hülfen']);
expect('helfen', 'formen.partizip2', 'geholfen');
expect('helfen', 'imperativ.affirmativ.du', 'hilf');
expect('sterben', 'indikativ.praesens', ['sterbe', 'stirbst', 'stirbt', 'sterben', 'sterbt', 'sterben']);
expect('sterben', 'konjunktiv.konjunktiv2', ['stürbe', 'stürbest', 'stürbe', 'stürben', 'stürbet', 'stürben']);
expect('sterben', 'indikativ.perfekt', ['bin gestorben', 'bist gestorben', 'ist gestorben', 'sind gestorben', 'seid gestorben', 'sind gestorben']);
expect('werfen', 'indikativ.praeteritum', ['warf', 'warfst', 'warf', 'warfen', 'warft', 'warfen']);
expect('werfen', 'konjunktiv.konjunktiv2', ['würfe', 'würfest', 'würfe', 'würfen', 'würfet', 'würfen']);
expect('werfen', 'imperativ.affirmativ.du', 'wirf');
expect('gelten', 'indikativ.praesens', ['gelte', 'giltst', 'gilt', 'gelten', 'geltet', 'gelten']);
expect('gelten', 'konjunktiv.konjunktiv2', ['gälte', 'gältest', 'gälte', 'gälten', 'gältet', 'gälten']);
expect('sprechen', 'indikativ.praesens', ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen']);
expect('sprechen', 'indikativ.praeteritum', ['sprach', 'sprachst', 'sprach', 'sprachen', 'spracht', 'sprachen']);
expect('sprechen', 'formen.partizip2', 'gesprochen');
expect('sprechen', 'imperativ.affirmativ.du', 'sprich');
expect('nehmen', 'indikativ.praesens', ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nehmen']);
expect('nehmen', 'indikativ.praeteritum', ['nahm', 'nahmst', 'nahm', 'nahmen', 'nahmt', 'nahmen']);
expect('nehmen', 'konjunktiv.konjunktiv2', ['nähme', 'nähmest', 'nähme', 'nähmen', 'nähmet', 'nähmen']);
expect('nehmen', 'formen.partizip2', 'genommen');
expect('nehmen', 'imperativ.affirmativ.du', 'nimm');
expect('kommen', 'indikativ.praeteritum', ['kam', 'kamst', 'kam', 'kamen', 'kamt', 'kamen']);
expect('kommen', 'konjunktiv.konjunktiv2', ['käme', 'kämest', 'käme', 'kämen', 'kämet', 'kämen']);
expect('kommen', 'formen.partizip2', 'gekommen');
expect('treffen', 'indikativ.praesens', ['treffe', 'triffst', 'trifft', 'treffen', 'trefft', 'treffen']);
expect('treffen', 'formen.partizip2', 'getroffen');
expect('stehlen', 'indikativ.praesens', ['stehle', 'stiehlst', 'stiehlt', 'stehlen', 'stehlt', 'stehlen']);
expect('stehlen', 'konjunktiv.konjunktiv2', ['stähle', 'stählest', 'stähle', 'stählen', 'stählet', 'stählen']);
expect('empfehlen', 'indikativ.praesens', ['empfehle', 'empfiehlst', 'empfiehlt', 'empfehlen', 'empfehlt', 'empfehlen']);
expect('empfehlen', 'indikativ.praeteritum', ['empfahl', 'empfahlst', 'empfahl', 'empfahlen', 'empfahlt', 'empfahlen']);
expect('empfehlen', 'konjunktiv.konjunktiv2', ['empföhle', 'empföhlest', 'empföhle', 'empföhlen', 'empföhlet', 'empföhlen']);
expect('empfehlen', 'formen.partizip2', 'empfohlen');
expect('empfehlen', 'imperativ.affirmativ.du', 'empfiehl');
expect('erschrecken', 'indikativ.praesens', ['erschrecke', 'erschrickst', 'erschrickt', 'erschrecken', 'erschreckt', 'erschrecken']);
expect('erschrecken', 'formen.partizip2', 'erschrocken');

// e – a – e
expect('essen', 'indikativ.praesens', ['esse', 'isst', 'isst', 'essen', 'esst', 'essen']);
expect('essen', 'indikativ.praeteritum', ['aß', 'aßest', 'aß', 'aßen', 'aßt', 'aßen']);
expect('essen', 'konjunktiv.konjunktiv2', ['äße', 'äßest', 'äße', 'äßen', 'äßet', 'äßen']);
expect('essen', 'formen.partizip2', 'gegessen');
expect('essen', 'imperativ.affirmativ.du', 'iss');
expect('lesen', 'indikativ.praesens', ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen']);
expect('lesen', 'indikativ.praeteritum', ['las', 'lasest', 'las', 'lasen', 'last', 'lasen']);
expect('lesen', 'konjunktiv.konjunktiv2', ['läse', 'läsest', 'läse', 'läsen', 'läset', 'läsen']);
expect('lesen', 'imperativ.affirmativ.du', 'lies');
expect('sehen', 'indikativ.praesens', ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sehen']);
expect('sehen', 'indikativ.praeteritum', ['sah', 'sahst', 'sah', 'sahen', 'saht', 'sahen']);
expect('sehen', 'formen.partizip2', 'gesehen');
expect('sehen', 'imperativ.affirmativ.du', 'sieh');
expect('treten', 'indikativ.praesens', ['trete', 'trittst', 'tritt', 'treten', 'tretet', 'treten']);
expect('treten', 'indikativ.praeteritum', ['trat', 'tratest', 'trat', 'traten', 'tratet', 'traten']);
expect('treten', 'imperativ.affirmativ.du', 'tritt');
expect('vergessen', 'indikativ.praesens', ['vergesse', 'vergisst', 'vergisst', 'vergessen', 'vergesst', 'vergessen']);
expect('vergessen', 'indikativ.praeteritum', ['vergaß', 'vergaßest', 'vergaß', 'vergaßen', 'vergaßt', 'vergaßen']);
expect('vergessen', 'formen.partizip2', 'vergessen');
expect('vergessen', 'imperativ.affirmativ.du', 'vergiss');
expect('messen', 'indikativ.praesens', ['messe', 'misst', 'misst', 'messen', 'messt', 'messen']);
expect('bitten', 'indikativ.praesens', ['bitte', 'bittest', 'bittet', 'bitten', 'bittet', 'bitten']);
expect('bitten', 'indikativ.praeteritum', ['bat', 'batest', 'bat', 'baten', 'batet', 'baten']);
expect('bitten', 'formen.partizip2', 'gebeten');
expect('liegen', 'indikativ.praeteritum', ['lag', 'lagst', 'lag', 'lagen', 'lagt', 'lagen']);
expect('liegen', 'formen.partizip2', 'gelegen');
expect('sitzen', 'indikativ.praeteritum', ['saß', 'saßest', 'saß', 'saßen', 'saßt', 'saßen']);
expect('sitzen', 'formen.partizip2', 'gesessen');
expect('geschehen', 'indikativ.praesens', ['geschehe', 'geschiehst', 'geschieht', 'geschehen', 'gescheht', 'geschehen']);
expect('geschehen', 'formen.infinitivPerfekt', 'geschehen sein');

// a – u – a
expect('fahren', 'indikativ.praesens', ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren']);
expect('fahren', 'indikativ.praeteritum', ['fuhr', 'fuhrst', 'fuhr', 'fuhren', 'fuhrt', 'fuhren']);
expect('fahren', 'konjunktiv.konjunktiv2', ['führe', 'führest', 'führe', 'führen', 'führet', 'führen']);
expect('fahren', 'indikativ.perfekt', ['bin gefahren', 'bist gefahren', 'ist gefahren', 'sind gefahren', 'seid gefahren', 'sind gefahren']);
expect('fahren', 'imperativ.affirmativ.du', 'fahr');
expect('tragen', 'indikativ.praesens', ['trage', 'trägst', 'trägt', 'tragen', 'tragt', 'tragen']);
expect('tragen', 'indikativ.praeteritum', ['trug', 'trugst', 'trug', 'trugen', 'trugt', 'trugen']);
expect('tragen', 'formen.partizip2', 'getragen');
expect('schlagen', 'konjunktiv.konjunktiv2', ['schlüge', 'schlügest', 'schlüge', 'schlügen', 'schlüget', 'schlügen']);
expect('laden', 'indikativ.praesens', ['lade', 'lädst', 'lädt', 'laden', 'ladet', 'laden']);
expect('laden', 'indikativ.praeteritum', ['lud', 'ludest', 'lud', 'luden', 'ludet', 'luden']);
expect('wachsen', 'indikativ.praesens', ['wachse', 'wächst', 'wächst', 'wachsen', 'wachst', 'wachsen']);
expect('wachsen', 'indikativ.praeteritum', ['wuchs', 'wuchsest', 'wuchs', 'wuchsen', 'wuchst', 'wuchsen']);
expect('wachsen', 'formen.partizip2', 'gewachsen');
expect('waschen', 'indikativ.praeteritum', ['wusch', 'wuschst', 'wusch', 'wuschen', 'wuscht', 'wuschen']);
expect('backen', 'indikativ.praesens', ['backe', 'bäckst', 'bäckt', 'backen', 'backt', 'backen']);
expect('backen', 'indikativ.praeteritum', ['backte', 'backtest', 'backte', 'backten', 'backtet', 'backten']);
expect('backen', 'formen.partizip2', 'gebacken');

// the ie-pasts
expect('halten', 'indikativ.praesens', ['halte', 'hältst', 'hält', 'halten', 'haltet', 'halten']);
expect('halten', 'indikativ.praeteritum', ['hielt', 'hieltest', 'hielt', 'hielten', 'hieltet', 'hielten']);
expect('halten', 'konjunktiv.konjunktiv2', ['hielte', 'hieltest', 'hielte', 'hielten', 'hieltet', 'hielten']);
expect('halten', 'formen.partizip2', 'gehalten');
expect('raten', 'indikativ.praesens', ['rate', 'rätst', 'rät', 'raten', 'ratet', 'raten']);
expect('raten', 'indikativ.praeteritum', ['riet', 'rietest', 'riet', 'rieten', 'rietet', 'rieten']);
expect('braten', 'indikativ.praesens', ['brate', 'brätst', 'brät', 'braten', 'bratet', 'braten']);
expect('lassen', 'indikativ.praesens', ['lasse', 'lässt', 'lässt', 'lassen', 'lasst', 'lassen']);
expect('lassen', 'indikativ.praeteritum', ['ließ', 'ließest', 'ließ', 'ließen', 'ließt', 'ließen']);
expect('lassen', 'formen.partizip2', 'gelassen');
expect('lassen', 'imperativ.affirmativ.du', 'lass');
expect('laufen', 'indikativ.praesens', ['laufe', 'läufst', 'läuft', 'laufen', 'lauft', 'laufen']);
expect('laufen', 'indikativ.praeteritum', ['lief', 'liefst', 'lief', 'liefen', 'lieft', 'liefen']);
expect('laufen', 'formen.partizip2', 'gelaufen');
expect('laufen', 'imperativ.affirmativ.du', 'lauf');
expect('stoßen', 'indikativ.praesens', ['stoße', 'stößt', 'stößt', 'stoßen', 'stoßt', 'stoßen']);
expect('stoßen', 'indikativ.praeteritum', ['stieß', 'stießest', 'stieß', 'stießen', 'stießt', 'stießen']);
expect('stoßen', 'formen.partizip2', 'gestoßen');
expect('schlafen', 'indikativ.praesens', ['schlafe', 'schläfst', 'schläft', 'schlafen', 'schlaft', 'schlafen']);
expect('schlafen', 'indikativ.praeteritum', ['schlief', 'schliefst', 'schlief', 'schliefen', 'schlieft', 'schliefen']);
expect('fallen', 'indikativ.praesens', ['falle', 'fällst', 'fällt', 'fallen', 'fallt', 'fallen']);
expect('fallen', 'indikativ.praeteritum', ['fiel', 'fielst', 'fiel', 'fielen', 'fielt', 'fielen']);
expect('fangen', 'indikativ.praesens', ['fange', 'fängst', 'fängt', 'fangen', 'fangt', 'fangen']);
expect('fangen', 'indikativ.praeteritum', ['fing', 'fingst', 'fing', 'fingen', 'fingt', 'fingen']);
expect('rufen', 'indikativ.praeteritum', ['rief', 'riefst', 'rief', 'riefen', 'rieft', 'riefen']);
expect('rufen', 'formen.partizip2', 'gerufen');
expect('heißen', 'indikativ.praeteritum', ['hieß', 'hießest', 'hieß', 'hießen', 'hießt', 'hießen']);
expect('heißen', 'formen.partizip2', 'geheißen');
expect('hängen', 'indikativ.praeteritum', ['hing', 'hingst', 'hing', 'hingen', 'hingt', 'hingen']);
expect('gehen', 'indikativ.praeteritum', ['ging', 'gingst', 'ging', 'gingen', 'gingt', 'gingen']);
expect('gehen', 'konjunktiv.konjunktiv2', ['ginge', 'gingest', 'ginge', 'gingen', 'ginget', 'gingen']);
expect('gehen', 'indikativ.perfekt', ['bin gegangen', 'bist gegangen', 'ist gegangen', 'sind gegangen', 'seid gegangen', 'sind gegangen']);
expect('gehen', 'imperativ.affirmativ.du', 'geh');
expect('stehen', 'indikativ.praeteritum', ['stand', 'standest', 'stand', 'standen', 'standet', 'standen']);
expect('stehen', 'konjunktiv.konjunktiv2', ['stünde', 'stündest', 'stünde', 'stünden', 'stündet', 'stünden']);
expect('stehen', 'formen.partizip2', 'gestanden');

// --- the mixed verbs --------------------------------------------------------------------
expect('bringen', 'indikativ.praesens', ['bringe', 'bringst', 'bringt', 'bringen', 'bringt', 'bringen']);
expect('bringen', 'indikativ.praeteritum', ['brachte', 'brachtest', 'brachte', 'brachten', 'brachtet', 'brachten']);
expect('bringen', 'konjunktiv.konjunktiv2', ['brächte', 'brächtest', 'brächte', 'brächten', 'brächtet', 'brächten']);
expect('bringen', 'formen.partizip2', 'gebracht');
expect('bringen', 'imperativ.affirmativ.du', 'bring');
expect('denken', 'indikativ.praeteritum', ['dachte', 'dachtest', 'dachte', 'dachten', 'dachtet', 'dachten']);
expect('denken', 'konjunktiv.konjunktiv2', ['dächte', 'dächtest', 'dächte', 'dächten', 'dächtet', 'dächten']);
expect('denken', 'formen.partizip2', 'gedacht');
expect('kennen', 'indikativ.praeteritum', ['kannte', 'kanntest', 'kannte', 'kannten', 'kanntet', 'kannten']);
expect('kennen', 'konjunktiv.konjunktiv2', ['kennte', 'kenntest', 'kennte', 'kennten', 'kenntet', 'kennten']);
expect('kennen', 'formen.partizip2', 'gekannt');
expect('nennen', 'indikativ.praeteritum', ['nannte', 'nanntest', 'nannte', 'nannten', 'nanntet', 'nannten']);
expect('nennen', 'formen.partizip2', 'genannt');
expect('rennen', 'indikativ.perfekt', ['bin gerannt', 'bist gerannt', 'ist gerannt', 'sind gerannt', 'seid gerannt', 'sind gerannt']);
expect('brennen', 'indikativ.praeteritum', ['brannte', 'branntest', 'brannte', 'brannten', 'branntet', 'brannten']);
expect('senden', 'indikativ.praesens', ['sende', 'sendest', 'sendet', 'senden', 'sendet', 'senden']);
expect('senden', 'indikativ.praeteritum', ['sandte', 'sandtest', 'sandte', 'sandten', 'sandtet', 'sandten']);
expect('senden', 'konjunktiv.konjunktiv2', ['sendete', 'sendetest', 'sendete', 'sendeten', 'sendetet', 'sendeten']);
expect('senden', 'formen.partizip2', 'gesandt');
expect('wenden', 'indikativ.praeteritum', ['wandte', 'wandtest', 'wandte', 'wandten', 'wandtet', 'wandten']);
expect('wenden', 'formen.partizip2', 'gewandt');
expect('wissen', 'indikativ.praesens', ['weiß', 'weißt', 'weiß', 'wissen', 'wisst', 'wissen']);
expect('wissen', 'indikativ.praeteritum', ['wusste', 'wusstest', 'wusste', 'wussten', 'wusstet', 'wussten']);
expect('wissen', 'konjunktiv.konjunktiv1', ['wisse', 'wissest', 'wisse', 'wissen', 'wisset', 'wissen']);
expect('wissen', 'konjunktiv.konjunktiv2', ['wüsste', 'wüsstest', 'wüsste', 'wüssten', 'wüsstet', 'wüssten']);
expect('wissen', 'formen.partizip2', 'gewusst');
expect('wissen', 'imperativ.affirmativ.du', 'wisse');
expect('wissen', 'imperativ.affirmativ.ihr', 'wisst');

// --- the modals -----------------------------------------------------------------------
expect('können', 'indikativ.praesens', ['kann', 'kannst', 'kann', 'können', 'könnt', 'können']);
expect('können', 'indikativ.praeteritum', ['konnte', 'konntest', 'konnte', 'konnten', 'konntet', 'konnten']);
expect('können', 'konjunktiv.konjunktiv1', ['könne', 'könnest', 'könne', 'können', 'könnet', 'können']);
expect('können', 'konjunktiv.konjunktiv2', ['könnte', 'könntest', 'könnte', 'könnten', 'könntet', 'könnten']);
expect('können', 'formen.partizip2', 'gekonnt');
expect('können', 'imperativ.affirmativ.du', null);
expect('können', 'imperativ.negativ.sie', null);
expect('müssen', 'indikativ.praesens', ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen']);
expect('müssen', 'indikativ.praeteritum', ['musste', 'musstest', 'musste', 'mussten', 'musstet', 'mussten']);
expect('müssen', 'konjunktiv.konjunktiv2', ['müsste', 'müsstest', 'müsste', 'müssten', 'müsstet', 'müssten']);
expect('müssen', 'formen.partizip2', 'gemusst');
expect('dürfen', 'indikativ.praesens', ['darf', 'darfst', 'darf', 'dürfen', 'dürft', 'dürfen']);
expect('dürfen', 'indikativ.praeteritum', ['durfte', 'durftest', 'durfte', 'durften', 'durftet', 'durften']);
expect('dürfen', 'konjunktiv.konjunktiv2', ['dürfte', 'dürftest', 'dürfte', 'dürften', 'dürftet', 'dürften']);
expect('dürfen', 'formen.partizip2', 'gedurft');
expect('sollen', 'indikativ.praesens', ['soll', 'sollst', 'soll', 'sollen', 'sollt', 'sollen']);
expect('sollen', 'konjunktiv.konjunktiv2', ['sollte', 'solltest', 'sollte', 'sollten', 'solltet', 'sollten']);
expect('wollen', 'indikativ.praesens', ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen']);
expect('wollen', 'indikativ.praeteritum', ['wollte', 'wolltest', 'wollte', 'wollten', 'wolltet', 'wollten']);
expect('wollen', 'konjunktiv.konjunktiv1', ['wolle', 'wollest', 'wolle', 'wollen', 'wollet', 'wollen']);
expect('wollen', 'formen.partizip2', 'gewollt');
expect('mögen', 'indikativ.praesens', ['mag', 'magst', 'mag', 'mögen', 'mögt', 'mögen']);
expect('mögen', 'indikativ.praeteritum', ['mochte', 'mochtest', 'mochte', 'mochten', 'mochtet', 'mochten']);
expect('mögen', 'konjunktiv.konjunktiv2', ['möchte', 'möchtest', 'möchte', 'möchten', 'möchtet', 'möchten']);
expect('mögen', 'formen.partizip2', 'gemocht');
expect('vermögen', 'indikativ.praesens', ['vermag', 'vermagst', 'vermag', 'vermögen', 'vermögt', 'vermögen']);
expect('vermögen', 'formen.partizip2', 'vermocht');
expect('bedürfen', 'indikativ.praesens', ['bedarf', 'bedarfst', 'bedarf', 'bedürfen', 'bedürft', 'bedürfen']);
expect('bedürfen', 'indikativ.praeteritum', ['bedurfte', 'bedurftest', 'bedurfte', 'bedurften', 'bedurftet', 'bedurften']);
check('möchten is answered with mögen', conjugate('möchten').verb === 'mögen');

// --- sein, haben, werden, tun ------------------------------------------------------------
expect('sein', 'indikativ.praesens', ['bin', 'bist', 'ist', 'sind', 'seid', 'sind']);
expect('sein', 'indikativ.praeteritum', ['war', 'warst', 'war', 'waren', 'wart', 'waren']);
expect('sein', 'indikativ.perfekt', ['bin gewesen', 'bist gewesen', 'ist gewesen', 'sind gewesen', 'seid gewesen', 'sind gewesen']);
expect('sein', 'indikativ.futur1', ['werde sein', 'wirst sein', 'wird sein', 'werden sein', 'werdet sein', 'werden sein']);
expect('sein', 'konjunktiv.konjunktiv1', ['sei', 'seiest', 'sei', 'seien', 'seiet', 'seien']);
expect('sein', 'konjunktiv.konjunktiv2', ['wäre', 'wärest', 'wäre', 'wären', 'wäret', 'wären']);
expect('sein', 'konjunktiv.konjunktiv1Perfekt', ['sei gewesen', 'seiest gewesen', 'sei gewesen', 'seien gewesen', 'seiet gewesen', 'seien gewesen']);
expect('sein', 'imperativ.affirmativ.du', 'sei');
expect('sein', 'imperativ.affirmativ.wir', 'seien wir');
expect('sein', 'imperativ.affirmativ.ihr', 'seid');
expect('sein', 'imperativ.affirmativ.sie', 'seien Sie');
expect('sein', 'imperativ.negativ.du', 'sei nicht');
expect('sein', 'formen.partizip1', 'seiend');
expect('sein', 'formen.partizip2', 'gewesen');
expect('sein', 'formen.infinitivPerfekt', 'gewesen sein');
expect('sein', 'formen.zuInfinitiv', 'zu sein');
expect('haben', 'indikativ.praesens', ['habe', 'hast', 'hat', 'haben', 'habt', 'haben']);
expect('haben', 'indikativ.praeteritum', ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten']);
expect('haben', 'konjunktiv.konjunktiv1', ['habe', 'habest', 'habe', 'haben', 'habet', 'haben']);
expect('haben', 'konjunktiv.konjunktiv2', ['hätte', 'hättest', 'hätte', 'hätten', 'hättet', 'hätten']);
expect('haben', 'indikativ.perfekt', ['habe gehabt', 'hast gehabt', 'hat gehabt', 'haben gehabt', 'habt gehabt', 'haben gehabt']);
expect('haben', 'imperativ.affirmativ.du', 'hab');
expect('haben', 'imperativ.affirmativ.ihr', 'habt');
expect('haben', 'formen.partizip2', 'gehabt');
expect('werden', 'indikativ.praesens', ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden']);
expect('werden', 'indikativ.praeteritum', ['wurde', 'wurdest', 'wurde', 'wurden', 'wurdet', 'wurden']);
expect('werden', 'konjunktiv.konjunktiv1', ['werde', 'werdest', 'werde', 'werden', 'werdet', 'werden']);
expect('werden', 'konjunktiv.konjunktiv2', ['würde', 'würdest', 'würde', 'würden', 'würdet', 'würden']);
expect('werden', 'indikativ.perfekt', ['bin geworden', 'bist geworden', 'ist geworden', 'sind geworden', 'seid geworden', 'sind geworden']);
expect('werden', 'imperativ.affirmativ.du', 'werde');
expect('werden', 'formen.partizip2', 'geworden');
expect('tun', 'indikativ.praesens', ['tue', 'tust', 'tut', 'tun', 'tut', 'tun']);
expect('tun', 'indikativ.praeteritum', ['tat', 'tatest', 'tat', 'taten', 'tatet', 'taten']);
expect('tun', 'konjunktiv.konjunktiv1', ['tue', 'tuest', 'tue', 'tuen', 'tuet', 'tuen']);
expect('tun', 'konjunktiv.konjunktiv2', ['täte', 'tätest', 'täte', 'täten', 'tätet', 'täten']);
expect('tun', 'imperativ.affirmativ.du', 'tu');
expect('tun', 'imperativ.affirmativ.wir', 'tun wir');
expect('tun', 'formen.partizip1', 'tuend');
expect('tun', 'formen.partizip2', 'getan');
expect('tun', 'formen.zuInfinitiv', 'zu tun');
check('sein is flagged irregular', conjugate('sein').flags.irregular === true);
check('wissen is flagged irregular', conjugate('wissen').flags.irregular === true);
check('geben is not flagged irregular', conjugate('geben').flags.irregular === false);
check('sein is strong', conjugate('sein').class === 'stark');
check('haben is weak', conjugate('haben').class === 'schwach');
check('können is mixed', conjugate('können').class === 'gemischt');

// --- separable prefixes ------------------------------------------------------------------
expect('aufstehen', 'indikativ.praesens', ['stehe auf', 'stehst auf', 'steht auf', 'stehen auf', 'steht auf', 'stehen auf']);
expect('aufstehen', 'indikativ.praeteritum', ['stand auf', 'standest auf', 'stand auf', 'standen auf', 'standet auf', 'standen auf']);
expect('aufstehen', 'indikativ.perfekt', ['bin aufgestanden', 'bist aufgestanden', 'ist aufgestanden', 'sind aufgestanden', 'seid aufgestanden', 'sind aufgestanden']);
expect('aufstehen', 'indikativ.plusquamperfekt', ['war aufgestanden', 'warst aufgestanden', 'war aufgestanden', 'waren aufgestanden', 'wart aufgestanden', 'waren aufgestanden']);
expect('aufstehen', 'indikativ.futur1', ['werde aufstehen', 'wirst aufstehen', 'wird aufstehen', 'werden aufstehen', 'werdet aufstehen', 'werden aufstehen']);
expect('aufstehen', 'indikativ.futur2', ['werde aufgestanden sein', 'wirst aufgestanden sein', 'wird aufgestanden sein', 'werden aufgestanden sein', 'werdet aufgestanden sein', 'werden aufgestanden sein']);
expect('aufstehen', 'konjunktiv.konjunktiv1', ['stehe auf', 'stehest auf', 'stehe auf', 'stehen auf', 'stehet auf', 'stehen auf']);
expect('aufstehen', 'konjunktiv.konjunktiv2', ['stünde auf', 'stündest auf', 'stünde auf', 'stünden auf', 'stündet auf', 'stünden auf']);
expect('aufstehen', 'konjunktiv.wuerde', ['würde aufstehen', 'würdest aufstehen', 'würde aufstehen', 'würden aufstehen', 'würdet aufstehen', 'würden aufstehen']);
expect('aufstehen', 'konjunktiv.konjunktiv2Plusquamperfekt', ['wäre aufgestanden', 'wärest aufgestanden', 'wäre aufgestanden', 'wären aufgestanden', 'wäret aufgestanden', 'wären aufgestanden']);
expect('aufstehen', 'imperativ.affirmativ.du', 'steh auf');
expect('aufstehen', 'imperativ.affirmativ.wir', 'stehen wir auf');
expect('aufstehen', 'imperativ.affirmativ.ihr', 'steht auf');
expect('aufstehen', 'imperativ.affirmativ.sie', 'stehen Sie auf');
expect('aufstehen', 'imperativ.negativ.du', 'steh nicht auf');
expect('aufstehen', 'imperativ.negativ.sie', 'stehen Sie nicht auf');
expect('aufstehen', 'formen.infinitiv', 'aufstehen');
expect('aufstehen', 'formen.partizip1', 'aufstehend');
expect('aufstehen', 'formen.partizip2', 'aufgestanden');
expect('aufstehen', 'formen.infinitivPerfekt', 'aufgestanden sein');
expect('aufstehen', 'formen.zuInfinitiv', 'aufzustehen');
expect('ankommen', 'indikativ.praesens', ['komme an', 'kommst an', 'kommt an', 'kommen an', 'kommt an', 'kommen an']);
expect('ankommen', 'indikativ.perfekt', ['bin angekommen', 'bist angekommen', 'ist angekommen', 'sind angekommen', 'seid angekommen', 'sind angekommen']);
expect('einkaufen', 'indikativ.praesens', ['kaufe ein', 'kaufst ein', 'kauft ein', 'kaufen ein', 'kauft ein', 'kaufen ein']);
expect('einkaufen', 'formen.partizip2', 'eingekauft');
expect('einkaufen', 'formen.zuInfinitiv', 'einzukaufen');
expect('einladen', 'indikativ.praesens', ['lade ein', 'lädst ein', 'lädt ein', 'laden ein', 'ladet ein', 'laden ein']);
expect('einladen', 'formen.partizip2', 'eingeladen');
expect('anfangen', 'indikativ.praesens', ['fange an', 'fängst an', 'fängt an', 'fangen an', 'fangt an', 'fangen an']);
expect('anfangen', 'indikativ.praeteritum', ['fing an', 'fingst an', 'fing an', 'fingen an', 'fingt an', 'fingen an']);
expect('anfangen', 'formen.partizip2', 'angefangen');
expect('mitbringen', 'indikativ.praeteritum', ['brachte mit', 'brachtest mit', 'brachte mit', 'brachten mit', 'brachtet mit', 'brachten mit']);
expect('mitbringen', 'formen.partizip2', 'mitgebracht');
expect('zurückkommen', 'formen.partizip2', 'zurückgekommen');
expect('zurückkommen', 'formen.zuInfinitiv', 'zurückzukommen');
expect('zusammenarbeiten', 'indikativ.praesens', ['arbeite zusammen', 'arbeitest zusammen', 'arbeitet zusammen', 'arbeiten zusammen', 'arbeitet zusammen', 'arbeiten zusammen']);
expect('fernsehen', 'indikativ.praesens', ['sehe fern', 'siehst fern', 'sieht fern', 'sehen fern', 'seht fern', 'sehen fern']);
expect('fernsehen', 'formen.partizip2', 'ferngesehen');
expect('stattfinden', 'formen.partizip2', 'stattgefunden');
expect('teilnehmen', 'indikativ.praesens', ['nehme teil', 'nimmst teil', 'nimmt teil', 'nehmen teil', 'nehmt teil', 'nehmen teil']);
expect('teilnehmen', 'formen.partizip2', 'teilgenommen');
expect('herunterladen', 'formen.partizip2', 'heruntergeladen');
expect('herunterladen', 'formen.zuInfinitiv', 'herunterzuladen');
expect('hinzufügen', 'indikativ.praesens', ['füge hinzu', 'fügst hinzu', 'fügt hinzu', 'fügen hinzu', 'fügt hinzu', 'fügen hinzu']);
expect('hinzufügen', 'formen.partizip2', 'hinzugefügt');
expect('kennenlernen', 'indikativ.praesens', ['lerne kennen', 'lernst kennen', 'lernt kennen', 'lernen kennen', 'lernt kennen', 'lernen kennen']);
expect('kennenlernen', 'formen.partizip2', 'kennengelernt');
expect('wehtun', 'indikativ.praesens', ['tue weh', 'tust weh', 'tut weh', 'tun weh', 'tut weh', 'tun weh']);
expect('wehtun', 'formen.partizip2', 'wehgetan');
expect('wehtun', 'formen.zuInfinitiv', 'wehzutun');
expect('vorhaben', 'indikativ.praesens', ['habe vor', 'hast vor', 'hat vor', 'haben vor', 'habt vor', 'haben vor']);
expect('loswerden', 'formen.infinitivPerfekt', 'losgeworden sein');
// A separable particle on an inseparable prefix: anerkennen, vorbereiten.
expect('anerkennen', 'indikativ.praesens', ['erkenne an', 'erkennst an', 'erkennt an', 'erkennen an', 'erkennt an', 'erkennen an']);
expect('anerkennen', 'indikativ.praeteritum', ['erkannte an', 'erkanntest an', 'erkannte an', 'erkannten an', 'erkanntet an', 'erkannten an']);
expect('anerkennen', 'formen.partizip2', 'anerkannt');
expect('anerkennen', 'formen.zuInfinitiv', 'anzuerkennen');
expect('vorbereiten', 'indikativ.praesens', ['bereite vor', 'bereitest vor', 'bereitet vor', 'bereiten vor', 'bereitet vor', 'bereiten vor']);
expect('vorbereiten', 'indikativ.praeteritum', ['bereitete vor', 'bereitetest vor', 'bereitete vor', 'bereiteten vor', 'bereitetet vor', 'bereiteten vor']);
expect('vorbereiten', 'formen.partizip2', 'vorbereitet');
expect('ausprobieren', 'formen.partizip2', 'ausprobiert');
expect('ausprobieren', 'formen.zuInfinitiv', 'auszuprobieren');
check('aufstehen reports its particle', conjugate('aufstehen').flags.separable === 'auf');
check('aufstehen is derived from stehen', conjugate('aufstehen').flags.derivedFrom === 'stehen');
check('einkaufen has no base to derive from', conjugate('einkaufen').flags.derivedFrom === null);
check('machen has no particle', conjugate('machen').flags.separable === null);

// --- inseparable prefixes ------------------------------------------------------------------
expect('verstehen', 'indikativ.praesens', ['verstehe', 'verstehst', 'versteht', 'verstehen', 'versteht', 'verstehen']);
expect('verstehen', 'indikativ.praeteritum', ['verstand', 'verstandest', 'verstand', 'verstanden', 'verstandet', 'verstanden']);
expect('verstehen', 'konjunktiv.konjunktiv2', ['verstünde', 'verstündest', 'verstünde', 'verstünden', 'verstündet', 'verstünden']);
expect('verstehen', 'indikativ.perfekt', ['habe verstanden', 'hast verstanden', 'hat verstanden', 'haben verstanden', 'habt verstanden', 'haben verstanden']);
expect('verstehen', 'formen.partizip2', 'verstanden');
expect('verstehen', 'formen.zuInfinitiv', 'zu verstehen');
expect('bekommen', 'indikativ.praeteritum', ['bekam', 'bekamst', 'bekam', 'bekamen', 'bekamt', 'bekamen']);
expect('bekommen', 'indikativ.perfekt', ['habe bekommen', 'hast bekommen', 'hat bekommen', 'haben bekommen', 'habt bekommen', 'haben bekommen']);
expect('besuchen', 'formen.partizip2', 'besucht');
expect('erzählen', 'formen.partizip2', 'erzählt');
expect('gehören', 'formen.partizip2', 'gehört');
expect('entscheiden', 'indikativ.praeteritum', ['entschied', 'entschiedest', 'entschied', 'entschieden', 'entschiedet', 'entschieden']);
expect('entscheiden', 'formen.partizip2', 'entschieden');
expect('empfangen', 'indikativ.praesens', ['empfange', 'empfängst', 'empfängt', 'empfangen', 'empfangt', 'empfangen']);
expect('empfangen', 'formen.partizip2', 'empfangen');
expect('zerbrechen', 'indikativ.praesens', ['zerbreche', 'zerbrichst', 'zerbricht', 'zerbrechen', 'zerbrecht', 'zerbrechen']);
expect('zerbrechen', 'formen.partizip2', 'zerbrochen');
expect('missverstehen', 'formen.partizip2', 'missverstanden');
expect('erkennen', 'indikativ.praeteritum', ['erkannte', 'erkanntest', 'erkannte', 'erkannten', 'erkanntet', 'erkannten']);
expect('erkennen', 'formen.partizip2', 'erkannt');
expect('gefallen', 'indikativ.praesens', ['gefalle', 'gefällst', 'gefällt', 'gefallen', 'gefallt', 'gefallen']);
expect('gefallen', 'indikativ.perfekt', ['habe gefallen', 'hast gefallen', 'hat gefallen', 'haben gefallen', 'habt gefallen', 'haben gefallen']);
expect('entstehen', 'indikativ.perfekt', ['bin entstanden', 'bist entstanden', 'ist entstanden', 'sind entstanden', 'seid entstanden', 'sind entstanden']);
expect('verschwinden', 'formen.infinitivPerfekt', 'verschwunden sein');
expect('erfahren', 'indikativ.praesens', ['erfahre', 'erfährst', 'erfährt', 'erfahren', 'erfahrt', 'erfahren']);
expect('erfahren', 'formen.infinitivPerfekt', 'erfahren haben');
check('verstehen is derived from stehen', conjugate('verstehen').flags.derivedFrom === 'stehen');
check('bekommen is derived from kommen', conjugate('bekommen').flags.derivedFrom === 'kommen');
check('verstehen has no particle', conjugate('verstehen').flags.separable === null);
// Dual prefixes, decided per verb.
expect('übersetzen', 'indikativ.praesens', ['übersetze', 'übersetzt', 'übersetzt', 'übersetzen', 'übersetzt', 'übersetzen']);
expect('übersetzen', 'formen.partizip2', 'übersetzt');
expect('unterschreiben', 'formen.partizip2', 'unterschrieben');
expect('unterhalten', 'indikativ.praesens', ['unterhalte', 'unterhältst', 'unterhält', 'unterhalten', 'unterhaltet', 'unterhalten']);
expect('untergehen', 'indikativ.praesens', ['gehe unter', 'gehst unter', 'geht unter', 'gehen unter', 'geht unter', 'gehen unter']);
expect('untergehen', 'formen.partizip2', 'untergegangen');
expect('umziehen', 'indikativ.praesens', ['ziehe um', 'ziehst um', 'zieht um', 'ziehen um', 'zieht um', 'ziehen um']);
expect('umziehen', 'indikativ.perfekt', ['bin umgezogen', 'bist umgezogen', 'ist umgezogen', 'sind umgezogen', 'seid umgezogen', 'sind umgezogen']);
expect('umarmen', 'indikativ.praesens', ['umarme', 'umarmst', 'umarmt', 'umarmen', 'umarmt', 'umarmen']);
expect('umarmen', 'formen.partizip2', 'umarmt');
expect('durchführen', 'formen.partizip2', 'durchgeführt');
expect('durchsuchen', 'formen.partizip2', 'durchsucht');
expect('wiederholen', 'indikativ.praesens', ['wiederhole', 'wiederholst', 'wiederholt', 'wiederholen', 'wiederholt', 'wiederholen']);
expect('wiederholen', 'formen.partizip2', 'wiederholt');
expect('wiedersehen', 'indikativ.praesens', ['sehe wieder', 'siehst wieder', 'sieht wieder', 'sehen wieder', 'seht wieder', 'sehen wieder']);
expect('wiedersehen', 'formen.partizip2', 'wiedergesehen');
expect('widersprechen', 'indikativ.praesens', ['widerspreche', 'widersprichst', 'widerspricht', 'widersprechen', 'widersprecht', 'widersprechen']);
expect('widersprechen', 'formen.partizip2', 'widersprochen');
expect('hinterlassen', 'formen.partizip2', 'hinterlassen');

// --- -ieren and the other ge-less verbs ------------------------------------------------------
expect('studieren', 'indikativ.praesens', ['studiere', 'studierst', 'studiert', 'studieren', 'studiert', 'studieren']);
expect('studieren', 'indikativ.praeteritum', ['studierte', 'studiertest', 'studierte', 'studierten', 'studiertet', 'studierten']);
expect('studieren', 'formen.partizip2', 'studiert');
expect('studieren', 'imperativ.affirmativ.du', 'studier');
expect('passieren', 'formen.infinitivPerfekt', 'passiert sein');
expect('telefonieren', 'formen.partizip2', 'telefoniert');
expect('frieren', 'formen.partizip2', 'gefroren');
expect('schmieren', 'formen.partizip2', 'geschmiert');
expect('prophezeien', 'formen.partizip2', 'prophezeit');

// --- lookalikes: not prefixed, not derived --------------------------------------------------------
expect('antworten', 'indikativ.praesens', ['antworte', 'antwortest', 'antwortet', 'antworten', 'antwortet', 'antworten']);
expect('antworten', 'formen.partizip2', 'geantwortet');
expect('einigen', 'formen.partizip2', 'geeinigt');
expect('beichten', 'formen.partizip2', 'gebeichtet');
expect('angeln', 'indikativ.praesens', ['angle', 'angelst', 'angelt', 'angeln', 'angelt', 'angeln']);
expect('angeln', 'formen.partizip2', 'geangelt');
expect('herrschen', 'formen.partizip2', 'geherrscht');
expect('begleiten', 'indikativ.praeteritum', ['begleitete', 'begleitetest', 'begleitete', 'begleiteten', 'begleitetet', 'begleiteten']);
expect('begleiten', 'formen.partizip2', 'begleitet');
expect('bereiten', 'formen.partizip2', 'bereitet');
expect('aufhängen', 'indikativ.praeteritum', ['hängte auf', 'hängtest auf', 'hängte auf', 'hängten auf', 'hängtet auf', 'hängten auf']);
expect('aufhängen', 'formen.partizip2', 'aufgehängt');
expect('veranlassen', 'formen.partizip2', 'veranlasst');
expect('beauftragen', 'formen.partizip2', 'beauftragt');
expect('beinhalten', 'formen.partizip2', 'beinhaltet');
expect('abonnieren', 'formen.partizip2', 'abonniert');
expect('heiraten', 'formen.partizip2', 'geheiratet');
expect('verheiraten', 'formen.partizip2', 'verheiratet');

// --- the auxiliary ----------------------------------------------------------------------------
const aux = (verb) => conjugate(verb).auxiliary;
for (const [verb, expected] of [['machen', 'haben'], ['sein', 'sein'], ['werden', 'sein'], ['bleiben', 'sein'],
  ['gehen', 'sein'], ['kommen', 'sein'], ['ankommen', 'sein'], ['bekommen', 'haben'], ['mitbekommen', 'haben'],
  ['verstehen', 'haben'], ['aufstehen', 'sein'], ['einschlafen', 'sein'], ['ausschlafen', 'haben'],
  ['schlafen', 'haben'], ['aufwachen', 'sein'], ['reisen', 'sein'], ['abreisen', 'sein'], ['verreisen', 'sein'],
  ['bereisen', 'haben'], ['auswandern', 'sein'], ['folgen', 'sein'], ['verfolgen', 'haben'], ['begegnen', 'sein'],
  ['passieren', 'sein'], ['geschehen', 'sein'], ['gelingen', 'sein'], ['sterben', 'sein'], ['wachsen', 'sein'],
  ['aufwachsen', 'sein'], ['umziehen', 'sein'], ['anziehen', 'haben'], ['erscheinen', 'sein'], ['scheinen', 'haben'],
  ['zurückkehren', 'sein'], ['kehren', 'haben'], ['sich freuen', 'haben'], ['sich verlaufen', 'haben'],
  ['verlaufen', 'sein'], ['haben', 'haben'], ['können', 'haben'], ['loswerden', 'sein']]) {
  check(`${verb}: auxiliary should be ${expected}, got ${aux(verb)}`, aux(verb) === expected);
}
check('the auxiliary is copied to the flags', conjugate('gehen').flags.auxiliary === 'sein');

// --- stem-change codes --------------------------------------------------------------------------
for (const [verb, expected] of [['geben', 'e→i'], ['nehmen', 'e→i'], ['lesen', 'e→ie'], ['sehen', 'e→ie'],
  ['fahren', 'a→ä'], ['halten', 'a→ä'], ['laufen', 'au→äu'], ['stoßen', 'o→ö'], ['machen', null], ['kommen', null],
  ['gehen', null], ['sein', null], ['empfehlen', 'e→ie'], ['vergessen', 'e→i']]) {
  check(`${verb}: stem change should be ${expected}`, conjugate(verb).flags.stemChange === expected);
}
check('every stem-change code has a label', Object.keys(STEM_CHANGE_LABELS).length === 5);
check('every class has labels', ['schwach', 'stark', 'gemischt'].every((code) => CLASS_LABELS[code]?.tab?.de && CLASS_LABELS[code]?.chip?.en));

// --- reflexives: the Spanish convention -------------------------------------------------------------
const reflexive = conjugate('sich freuen');
check('sich freuen: accepted, conjugated as freuen, reported as freuen',
  reflexive.ok && reflexive.pronominal === true && reflexive.verb === 'freuen' && reflexive.input === 'sich freuen');
expect('sich freuen', 'indikativ.praesens', ['freue', 'freust', 'freut', 'freuen', 'freut', 'freuen']);
expect('sich freuen', 'indikativ.perfekt', ['habe gefreut', 'hast gefreut', 'hat gefreut', 'haben gefreut', 'habt gefreut', 'haben gefreut']);
expect('sich freuen', 'formen.infinitiv', 'freuen');
expect('sich anziehen', 'indikativ.praesens', ['ziehe an', 'ziehst an', 'zieht an', 'ziehen an', 'zieht an', 'ziehen an']);
check('sich anziehen is reported as anziehen', conjugate('sich anziehen').verb === 'anziehen');
check('machen is not pronominal', conjugate('machen').pronominal === false);
check('input is trimmed and lowercased', conjugate('  Sich  FREUEN ').verb === 'freuen');
check('a plain verb keeps its input', conjugate('Machen').input === 'machen');

// --- the shape of the table --------------------------------------------------------------------------
const EXPECTED_KEYS = {
  formen: ['infinitiv', 'partizip1', 'partizip2', 'infinitivPerfekt', 'zuInfinitiv'],
  indikativ: ['praesens', 'praeteritum', 'futur1', 'perfekt', 'plusquamperfekt', 'futur2'],
  konjunktiv: ['konjunktiv1', 'konjunktiv2', 'wuerde', 'konjunktiv1Perfekt', 'konjunktiv2Plusquamperfekt'],
  imperativ: ['affirmativ', 'negativ'],
};
const same = (a, b) => a.length === b.length && a.every((key) => b.includes(key));
for (const verb of ['machen', 'aufstehen', 'sein', 'können', 'sich freuen']) {
  const { table } = conjugate(verb);
  check(`${verb}: the table has exactly the four sections`, same(Object.keys(table), Object.keys(EXPECTED_KEYS)));
  for (const [section, keys] of Object.entries(EXPECTED_KEYS)) {
    check(`${verb}: ${section} has exactly its keys`, same(Object.keys(table[section] ?? {}), keys));
  }
  for (const kind of SHAPE.imperativeKinds) {
    check(`${verb}: imperativ.${kind} has exactly the imperative persons`, same(Object.keys(table.imperativ[kind]), IMPERATIVE_PERSONS));
  }
  for (const mood of SHAPE.moods) {
    for (const forms of Object.values(table[mood])) {
      check(`${verb}: ${mood} tenses have exactly the six persons`, same(Object.keys(forms), PERSONS));
    }
  }
}
check('SHAPE names the sections the table has', SHAPE.nonFinite === 'formen' && SHAPE.imperative === 'imperativ');

// Every cell is a non-empty string for a handful of ordinary verbs.
for (const verb of ['machen', 'geben', 'bringen', 'aufstehen', 'verstehen', 'sammeln', 'arbeiten', 'sein', 'haben', 'werden', 'sich freuen']) {
  const { table } = conjugate(verb);
  let empty = 0;
  for (const mood of SHAPE.moods) {
    for (const forms of Object.values(table[mood])) {
      for (const person of PERSONS) if (typeof forms[person] !== 'string' || !forms[person]) empty += 1;
    }
  }
  for (const forms of Object.values(table.imperativ)) {
    for (const person of IMPERATIVE_PERSONS) if (typeof forms[person] !== 'string' || !forms[person]) empty += 1;
  }
  for (const form of Object.values(table.formen)) if (typeof form !== 'string' || !form) empty += 1;
  check(`${verb}: every cell is a non-empty string (${empty} empty)`, empty === 0);
}

// --- the data ------------------------------------------------------------------------------------------
check('at least 250 verbs in the search index', COMMON_VERBS.length >= 250);
check('no verb is listed twice', new Set(COMMON_VERBS.map(([verb]) => verb)).size === COMMON_VERBS.length);
check('every gloss starts with "to "', COMMON_VERBS.every(([, gloss]) => gloss.startsWith('to ')));
for (const [verb] of COMMON_VERBS) {
  const result = conjugate(verb);
  check(`${verb} conjugates`, result.ok);
  if (result.ok) check(`${verb}: class "${result.class}" has a label`, Boolean(CLASS_LABELS[result.class]));
}
check('exactly three model verbs', same(Object.keys(MODEL_VERBS), ['schwach', 'stark', 'gemischt']));
for (const [code, model] of Object.entries(MODEL_VERBS)) {
  check(`model verb ${model.verb} belongs to ${code}`, conjugate(model.verb).class === code);
}
check('IRREGULARS is keyed by infinitive', Object.keys(IRREGULARS).every((verb) => conjugate(verb).ok));
for (const verb of Object.keys(IRREGULARS)) {
  const result = conjugate(verb);
  check(`${verb} is not weak`, result.class !== 'schwach' || verb === 'haben');
}

// --- irregular cells -------------------------------------------------------------------------------
check('machen has no irregular cells', irregularCells('machen').size === 0);
check('arbeiten has no irregular cells', irregularCells('arbeiten').size === 0);
check('singen marks the Präteritum', irregularCells('singen').has('indikativ.praeteritum.ich'));
check('singen does not mark the present', !irregularCells('singen').has('indikativ.praesens.ich'));
check('geben marks du and er of the present', irregularCells('geben').has('indikativ.praesens.du') && irregularCells('geben').has('indikativ.praesens.er'));
check('geben does not mark wir of the present', !irregularCells('geben').has('indikativ.praesens.wir'));
check('geben marks the imperative du', irregularCells('geben').has('imperativ.affirmativ.du'));
check('stehen marks the Konjunktiv II', irregularCells('stehen').has('konjunktiv.konjunktiv2.er'));
check('a sein verb is not marked for its auxiliary', !irregularCells('reisen').has('indikativ.perfekt.ich'));
check('a reflexive is not marked for taking haben', irregularCells('verlaufen', conjugate('sich verlaufen').table).size === irregularCells('verlaufen').size);
check('irregularCells accepts a table', irregularCells('geben', conjugate('geben').table).has('indikativ.praeteritum.ich'));

// --- rejection ---------------------------------------------------------------------------------------
for (const garbage of ['Mann', 'xyz', 'en', 'n', '123en', 'spazieren gehen', 'gern', '']) {
  check(`${JSON.stringify(garbage)}: should be rejected`, !conjugate(garbage).ok);
}
check('rejection carries an error code', conjugate('Mann').error === 'not-an-infinitive');
check('empty input says so', conjugate('').error === 'empty');
check('empty input after sich says so too', conjugate('   ').error === 'empty');
check('an unknown verb conjugates as a weak verb', conjugate('blubbern').ok && conjugate('blubbern').class === 'schwach');
expect('blubbern', 'indikativ.praesens', ['blubbere', 'blubberst', 'blubbert', 'blubbern', 'blubbert', 'blubbern']);
expect('googeln', 'formen.partizip2', 'gegoogelt');

// --- report --------------------------------------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} German conjugation checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} German conjugation checks passed`);
