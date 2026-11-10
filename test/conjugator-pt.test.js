/**
 * Reference forms for the Portuguese conjugation engine, in Portugal's norm
 * and the 1990 spelling, checked against the Priberam and Infopédia tables
 * and against the conjugation tables on en.wiktionary. Run with `npm test`
 * or `node test/conjugator-pt.test.js`.
 */
import {
  conjugate, irregularCells, PERSONS, IMPERATIVE_PERSONS, STEM_CHANGE_LABELS,
} from '../public/js/lib/conjugator-pt.js';
import { COMMON_VERBS, IRREGULARS, MODEL_VERBS, STEM_CHANGES, STEM_FAMILIES } from '../public/js/data/verbs-pt.js';

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
expect('falar', 'indicativo.presente', ['falo', 'falas', 'fala', 'falamos', 'falais', 'falam']);
expect('falar', 'indicativo.preteritoPerfeito', ['falei', 'falaste', 'falou', 'falámos', 'falastes', 'falaram']);
expect('falar', 'indicativo.preteritoImperfeito', ['falava', 'falavas', 'falava', 'falávamos', 'faláveis', 'falavam']);
expect('falar', 'indicativo.maisQuePerfeito', ['falara', 'falaras', 'falara', 'faláramos', 'faláreis', 'falaram']);
expect('falar', 'indicativo.futuro', ['falarei', 'falarás', 'falará', 'falaremos', 'falareis', 'falarão']);
expect('falar', 'indicativo.condicional', ['falaria', 'falarias', 'falaria', 'falaríamos', 'falaríeis', 'falariam']);
expect('falar', 'indicativo.perfeitoComposto', ['tenho falado', 'tens falado', 'tem falado', 'temos falado', 'tendes falado', 'têm falado']);
expect('falar', 'indicativo.maisQuePerfeitoComposto', ['tinha falado', 'tinhas falado', 'tinha falado', 'tínhamos falado', 'tínheis falado', 'tinham falado']);
expect('falar', 'indicativo.futuroComposto', ['terei falado', 'terás falado', 'terá falado', 'teremos falado', 'tereis falado', 'terão falado']);
expect('falar', 'indicativo.condicionalComposto', ['teria falado', 'terias falado', 'teria falado', 'teríamos falado', 'teríeis falado', 'teriam falado']);
expect('falar', 'conjuntivo.presente', ['fale', 'fales', 'fale', 'falemos', 'faleis', 'falem']);
expect('falar', 'conjuntivo.imperfeito', ['falasse', 'falasses', 'falasse', 'falássemos', 'falásseis', 'falassem']);
expect('falar', 'conjuntivo.futuro', ['falar', 'falares', 'falar', 'falarmos', 'falardes', 'falarem']);
expect('falar', 'conjuntivo.perfeito', ['tenha falado', 'tenhas falado', 'tenha falado', 'tenhamos falado', 'tenhais falado', 'tenham falado']);
expect('falar', 'conjuntivo.maisQuePerfeito', ['tivesse falado', 'tivesses falado', 'tivesse falado', 'tivéssemos falado', 'tivésseis falado', 'tivessem falado']);
expect('falar', 'conjuntivo.futuroComposto', ['tiver falado', 'tiveres falado', 'tiver falado', 'tivermos falado', 'tiverdes falado', 'tiverem falado']);
expect('falar', 'infinitivo.pessoal', ['falar', 'falares', 'falar', 'falarmos', 'falardes', 'falarem']);
expect('falar', 'imperativo.afirmativo.tu', 'fala');
expect('falar', 'imperativo.afirmativo.voce', 'fale');
expect('falar', 'imperativo.afirmativo.nos', 'falemos');
expect('falar', 'imperativo.afirmativo.vos', 'falai');
expect('falar', 'imperativo.afirmativo.voces', 'falem');
expect('falar', 'imperativo.negativo.tu', 'não fales');
expect('falar', 'imperativo.negativo.voce', 'não fale');
expect('falar', 'imperativo.negativo.vos', 'não faleis');
expect('falar', 'formas.infinitivo', 'falar');
expect('falar', 'formas.gerundio', 'falando');
expect('falar', 'formas.participio', 'falado');
expect('falar', 'formas.infinitivoComposto', 'ter falado');
expect('falar', 'formas.gerundioComposto', 'tendo falado');

expect('comer', 'indicativo.presente', ['como', 'comes', 'come', 'comemos', 'comeis', 'comem']);
expect('comer', 'indicativo.preteritoPerfeito', ['comi', 'comeste', 'comeu', 'comemos', 'comestes', 'comeram']);
expect('comer', 'indicativo.preteritoImperfeito', ['comia', 'comias', 'comia', 'comíamos', 'comíeis', 'comiam']);
expect('comer', 'indicativo.maisQuePerfeito', ['comera', 'comeras', 'comera', 'comêramos', 'comêreis', 'comeram']);
expect('comer', 'indicativo.futuro', ['comerei', 'comerás', 'comerá', 'comeremos', 'comereis', 'comerão']);
expect('comer', 'indicativo.condicional', ['comeria', 'comerias', 'comeria', 'comeríamos', 'comeríeis', 'comeriam']);
expect('comer', 'conjuntivo.presente', ['coma', 'comas', 'coma', 'comamos', 'comais', 'comam']);
expect('comer', 'conjuntivo.imperfeito', ['comesse', 'comesses', 'comesse', 'comêssemos', 'comêsseis', 'comessem']);
expect('comer', 'conjuntivo.futuro', ['comer', 'comeres', 'comer', 'comermos', 'comerdes', 'comerem']);
expect('comer', 'infinitivo.pessoal', ['comer', 'comeres', 'comer', 'comermos', 'comerdes', 'comerem']);
expect('comer', 'imperativo.afirmativo.tu', 'come');
expect('comer', 'imperativo.afirmativo.vos', 'comei');
expect('comer', 'imperativo.negativo.tu', 'não comas');
expect('comer', 'formas.gerundio', 'comendo');
expect('comer', 'formas.participio', 'comido');

expect('partir', 'indicativo.presente', ['parto', 'partes', 'parte', 'partimos', 'partis', 'partem']);
expect('partir', 'indicativo.preteritoPerfeito', ['parti', 'partiste', 'partiu', 'partimos', 'partistes', 'partiram']);
expect('partir', 'indicativo.preteritoImperfeito', ['partia', 'partias', 'partia', 'partíamos', 'partíeis', 'partiam']);
expect('partir', 'indicativo.maisQuePerfeito', ['partira', 'partiras', 'partira', 'partíramos', 'partíreis', 'partiram']);
expect('partir', 'indicativo.futuro', ['partirei', 'partirás', 'partirá', 'partiremos', 'partireis', 'partirão']);
expect('partir', 'conjuntivo.presente', ['parta', 'partas', 'parta', 'partamos', 'partais', 'partam']);
expect('partir', 'conjuntivo.imperfeito', ['partisse', 'partisses', 'partisse', 'partíssemos', 'partísseis', 'partissem']);
expect('partir', 'conjuntivo.futuro', ['partir', 'partires', 'partir', 'partirmos', 'partirdes', 'partirem']);
expect('partir', 'imperativo.afirmativo.tu', 'parte');
expect('partir', 'imperativo.afirmativo.vos', 'parti');
expect('partir', 'formas.gerundio', 'partindo');
expect('partir', 'formas.participio', 'partido');

// --- spelling that only preserves the sound --------------------------------
expect('ficar', 'indicativo.preteritoPerfeito', ['fiquei', 'ficaste', 'ficou', 'ficámos', 'ficastes', 'ficaram']);
expect('ficar', 'conjuntivo.presente', ['fique', 'fiques', 'fique', 'fiquemos', 'fiqueis', 'fiquem']);
expect('ficar', 'indicativo.presente', ['fico', 'ficas', 'fica', 'ficamos', 'ficais', 'ficam']);
expect('chegar', 'indicativo.preteritoPerfeito', ['cheguei', 'chegaste', 'chegou', 'chegámos', 'chegastes', 'chegaram']);
expect('chegar', 'conjuntivo.presente', ['chegue', 'chegues', 'chegue', 'cheguemos', 'chegueis', 'cheguem']);
expect('começar', 'indicativo.preteritoPerfeito', ['comecei', 'começaste', 'começou', 'começámos', 'começastes', 'começaram']);
expect('começar', 'conjuntivo.presente', ['comece', 'comeces', 'comece', 'comecemos', 'comeceis', 'comecem']);
expect('começar', 'imperativo.negativo.tu', 'não comeces');
expect('conhecer', 'indicativo.presente', ['conheço', 'conheces', 'conhece', 'conhecemos', 'conheceis', 'conhecem']);
expect('conhecer', 'conjuntivo.presente', ['conheça', 'conheças', 'conheça', 'conheçamos', 'conheçais', 'conheçam']);
expect('vencer', 'indicativo.presente', ['venço', 'vences', 'vence', 'vencemos', 'venceis', 'vencem']);
expect('dirigir', 'indicativo.presente', ['dirijo', 'diriges', 'dirige', 'dirigimos', 'dirigis', 'dirigem']);
expect('dirigir', 'conjuntivo.presente', ['dirija', 'dirijas', 'dirija', 'dirijamos', 'dirijais', 'dirijam']);
expect('proteger', 'indicativo.presente', ['protejo', 'proteges', 'protege', 'protegemos', 'protegeis', 'protegem']);
expect('proteger', 'imperativo.afirmativo.voce', 'proteja');
expect('erguer', 'indicativo.presente', ['ergo', 'ergues', 'ergue', 'erguemos', 'ergueis', 'erguem']);
expect('erguer', 'conjuntivo.presente', ['erga', 'ergas', 'erga', 'ergamos', 'ergais', 'ergam']);
expect('distinguir', 'indicativo.presente', ['distingo', 'distingues', 'distingue', 'distinguimos', 'distinguis', 'distinguem']);
expect('distinguir', 'conjuntivo.presente', ['distinga', 'distingas', 'distinga', 'distingamos', 'distingais', 'distingam']);
// arguir says its u, so it keeps it, and takes the -uir endings without the hiatus accents.
expect('arguir', 'indicativo.presente', ['arguo', 'arguis', 'argui', 'arguimos', 'arguis', 'arguem']);
expect('arguir', 'indicativo.preteritoPerfeito', ['argui', 'arguiste', 'arguiu', 'arguimos', 'arguistes', 'arguiram']);
// -guar and -oar are regular in Portugal's paradigm: averiguo, perdoo.
expect('averiguar', 'indicativo.presente', ['averiguo', 'averiguas', 'averigua', 'averiguamos', 'averiguais', 'averiguam']);
expect('averiguar', 'indicativo.preteritoPerfeito', ['averiguei', 'averiguaste', 'averiguou', 'averiguámos', 'averiguastes', 'averiguaram']);
expect('perdoar', 'indicativo.presente', ['perdoo', 'perdoas', 'perdoa', 'perdoamos', 'perdoais', 'perdoam']);
check('ficar is flagged c → qu', conjugate('ficar').flags.ortho === 'c → qu');
check('chegar is flagged g → gu', conjugate('chegar').flags.ortho === 'g → gu');
check('começar is flagged ç → c', conjugate('começar').flags.ortho === 'ç → c');
check('conhecer is flagged c → ç', conjugate('conhecer').flags.ortho === 'c → ç');
check('dirigir is flagged g → j', conjugate('dirigir').flags.ortho === 'g → j');
check('erguer is flagged gu → g', conjugate('erguer').flags.ortho === 'gu → g');
check('falar has no spelling flag', conjugate('falar').flags.ortho === null);
check('ficar is not irregular', conjugate('ficar').flags.irregular === false);
check('fiquei is not an irregular cell', !irregularCells('ficar').has('indicativo.preteritoPerfeito.eu'));
check('conheço is not an irregular cell', !irregularCells('conhecer').has('indicativo.presente.eu'));

// --- vowel alternations of -ir verbs ---------------------------------------
expect('preferir', 'indicativo.presente', ['prefiro', 'preferes', 'prefere', 'preferimos', 'preferis', 'preferem']);
expect('preferir', 'conjuntivo.presente', ['prefira', 'prefiras', 'prefira', 'prefiramos', 'prefirais', 'prefiram']);
expect('preferir', 'indicativo.preteritoPerfeito', ['preferi', 'preferiste', 'preferiu', 'preferimos', 'preferistes', 'preferiram']);
expect('preferir', 'imperativo.afirmativo.tu', 'prefere');
expect('preferir', 'imperativo.afirmativo.voce', 'prefira');
expect('preferir', 'imperativo.negativo.tu', 'não prefiras');
expect('sentir', 'indicativo.presente', ['sinto', 'sentes', 'sente', 'sentimos', 'sentis', 'sentem']);
expect('sentir', 'conjuntivo.presente', ['sinta', 'sintas', 'sinta', 'sintamos', 'sintais', 'sintam']);
expect('vestir', 'indicativo.presente', ['visto', 'vestes', 'veste', 'vestimos', 'vestis', 'vestem']);
expect('servir', 'indicativo.presente', ['sirvo', 'serves', 'serve', 'servimos', 'servis', 'servem']);
expect('servir', 'conjuntivo.presente', ['sirva', 'sirvas', 'sirva', 'sirvamos', 'sirvais', 'sirvam']);
expect('seguir', 'indicativo.presente', ['sigo', 'segues', 'segue', 'seguimos', 'seguis', 'seguem']);
expect('seguir', 'conjuntivo.presente', ['siga', 'sigas', 'siga', 'sigamos', 'sigais', 'sigam']);
expect('conseguir', 'indicativo.presente', ['consigo', 'consegues', 'consegue', 'conseguimos', 'conseguis', 'conseguem']);
expect('mentir', 'indicativo.presente', ['minto', 'mentes', 'mente', 'mentimos', 'mentis', 'mentem']);
expect('repetir', 'indicativo.presente', ['repito', 'repetes', 'repete', 'repetimos', 'repetis', 'repetem']);
expect('divertir', 'indicativo.presente', ['divirto', 'divertes', 'diverte', 'divertimos', 'divertis', 'divertem']);
expect('despir', 'indicativo.presente', ['dispo', 'despes', 'despe', 'despimos', 'despis', 'despem']);
expect('refletir', 'indicativo.presente', ['reflito', 'refletes', 'reflete', 'refletimos', 'refletis', 'refletem']);
expect('sugerir', 'conjuntivo.presente', ['sugira', 'sugiras', 'sugira', 'sugiramos', 'sugirais', 'sugiram']);
expect('interferir', 'indicativo.presente', ['interfiro', 'interferes', 'interfere', 'interferimos', 'interferis', 'interferem']);
expect('dormir', 'indicativo.presente', ['durmo', 'dormes', 'dorme', 'dormimos', 'dormis', 'dormem']);
expect('dormir', 'conjuntivo.presente', ['durma', 'durmas', 'durma', 'durmamos', 'durmais', 'durmam']);
expect('dormir', 'indicativo.preteritoPerfeito', ['dormi', 'dormiste', 'dormiu', 'dormimos', 'dormistes', 'dormiram']);
expect('dormir', 'imperativo.afirmativo.tu', 'dorme');
expect('dormir', 'imperativo.afirmativo.voces', 'durmam');
expect('cobrir', 'indicativo.presente', ['cubro', 'cobres', 'cobre', 'cobrimos', 'cobris', 'cobrem']);
expect('cobrir', 'conjuntivo.presente', ['cubra', 'cubras', 'cubra', 'cubramos', 'cubrais', 'cubram']);
expect('cobrir', 'formas.participio', 'coberto');
expect('tossir', 'indicativo.presente', ['tusso', 'tosses', 'tosse', 'tossimos', 'tossis', 'tossem']);
expect('engolir', 'indicativo.presente', ['engulo', 'engoles', 'engole', 'engolimos', 'engolis', 'engolem']);
expect('subir', 'indicativo.presente', ['subo', 'sobes', 'sobe', 'subimos', 'subis', 'sobem']);
expect('subir', 'conjuntivo.presente', ['suba', 'subas', 'suba', 'subamos', 'subais', 'subam']);
expect('subir', 'imperativo.afirmativo.tu', 'sobe');
expect('subir', 'imperativo.afirmativo.voce', 'suba');
expect('fugir', 'indicativo.presente', ['fujo', 'foges', 'foge', 'fugimos', 'fugis', 'fogem']);
expect('fugir', 'conjuntivo.presente', ['fuja', 'fujas', 'fuja', 'fujamos', 'fujais', 'fujam']);
expect('sacudir', 'indicativo.presente', ['sacudo', 'sacodes', 'sacode', 'sacudimos', 'sacudis', 'sacodem']);
expect('consumir', 'indicativo.presente', ['consumo', 'consomes', 'consome', 'consumimos', 'consumis', 'consomem']);
expect('assumir', 'indicativo.presente', ['assumo', 'assumes', 'assume', 'assumimos', 'assumis', 'assumem']);
expect('agredir', 'indicativo.presente', ['agrido', 'agrides', 'agride', 'agredimos', 'agredis', 'agridem']);
expect('agredir', 'conjuntivo.presente', ['agrida', 'agridas', 'agrida', 'agridamos', 'agridais', 'agridam']);
expect('agredir', 'imperativo.afirmativo.tu', 'agride');
expect('progredir', 'indicativo.presente', ['progrido', 'progrides', 'progride', 'progredimos', 'progredis', 'progridem']);
expect('prevenir', 'indicativo.presente', ['previno', 'prevines', 'previne', 'prevenimos', 'prevenis', 'previnem']);
expect('polir', 'indicativo.presente', ['pulo', 'pules', 'pule', 'polimos', 'polis', 'pulem']);
check('preferir is flagged e→i', conjugate('preferir').flags.stemChange === 'e→i');
check('dormir is flagged o→u', conjugate('dormir').flags.stemChange === 'o→u');
check('subir is flagged u→o', conjugate('subir').flags.stemChange === 'u→o');
check('agredir is flagged e→i:todas', conjugate('agredir').flags.stemChange === 'e→i:todas');
check('partir has no stem change', conjugate('partir').flags.stemChange === null);
check('sinto is an irregular cell', irregularCells('sentir').has('indicativo.presente.eu'));
check('sentes is not an irregular cell', !irregularCells('sentir').has('indicativo.presente.tu'));
check('sobes is an irregular cell', irregularCells('subir').has('indicativo.presente.tu'));

// --- -ear and the odiar group ----------------------------------------------
expect('passear', 'indicativo.presente', ['passeio', 'passeias', 'passeia', 'passeamos', 'passeais', 'passeiam']);
expect('passear', 'conjuntivo.presente', ['passeie', 'passeies', 'passeie', 'passeemos', 'passeeis', 'passeiem']);
expect('passear', 'indicativo.preteritoPerfeito', ['passeei', 'passeaste', 'passeou', 'passeámos', 'passeastes', 'passearam']);
expect('passear', 'imperativo.afirmativo.tu', 'passeia');
expect('passear', 'imperativo.afirmativo.vos', 'passeai');
expect('recear', 'indicativo.presente', ['receio', 'receias', 'receia', 'receamos', 'receais', 'receiam']);
expect('odiar', 'indicativo.presente', ['odeio', 'odeias', 'odeia', 'odiamos', 'odiais', 'odeiam']);
expect('odiar', 'conjuntivo.presente', ['odeie', 'odeies', 'odeie', 'odiemos', 'odieis', 'odeiem']);
expect('ansiar', 'indicativo.presente', ['anseio', 'anseias', 'anseia', 'ansiamos', 'ansiais', 'anseiam']);
expect('mediar', 'indicativo.presente', ['medeio', 'medeias', 'medeia', 'mediamos', 'mediais', 'medeiam']);
expect('remediar', 'indicativo.presente', ['remedeio', 'remedeias', 'remedeia', 'remediamos', 'remediais', 'remedeiam']);
expect('incendiar', 'indicativo.presente', ['incendeio', 'incendeias', 'incendeia', 'incendiamos', 'incendiais', 'incendeiam']);
// The rest of -iar is regular.
expect('copiar', 'indicativo.presente', ['copio', 'copias', 'copia', 'copiamos', 'copiais', 'copiam']);
expect('enviar', 'indicativo.presente', ['envio', 'envias', 'envia', 'enviamos', 'enviais', 'enviam']);
check('passear is flagged e→ei', conjugate('passear').flags.stemChange === 'e→ei');
check('odiar is flagged i→ei', conjugate('odiar').flags.stemChange === 'i→ei');

// --- -uir, -air, -oer, -uzir, and the accents of the hiatus ----------------
expect('construir', 'indicativo.presente', ['construo', 'constróis', 'constrói', 'construímos', 'construís', 'constroem']);
expect('construir', 'indicativo.preteritoPerfeito', ['construí', 'construíste', 'construiu', 'construímos', 'construístes', 'construíram']);
expect('construir', 'conjuntivo.presente', ['construa', 'construas', 'construa', 'construamos', 'construais', 'construam']);
expect('construir', 'imperativo.afirmativo.tu', 'constrói');
expect('construir', 'formas.participio', 'construído');
expect('destruir', 'indicativo.presente', ['destruo', 'destróis', 'destrói', 'destruímos', 'destruís', 'destroem']);
expect('atribuir', 'indicativo.presente', ['atribuo', 'atribuis', 'atribui', 'atribuímos', 'atribuís', 'atribuem']);
expect('atribuir', 'indicativo.preteritoPerfeito', ['atribuí', 'atribuíste', 'atribuiu', 'atribuímos', 'atribuístes', 'atribuíram']);
expect('atribuir', 'indicativo.preteritoImperfeito', ['atribuía', 'atribuías', 'atribuía', 'atribuíamos', 'atribuíeis', 'atribuíam']);
expect('atribuir', 'conjuntivo.futuro', ['atribuir', 'atribuíres', 'atribuir', 'atribuirmos', 'atribuirdes', 'atribuírem']);
expect('atribuir', 'imperativo.afirmativo.tu', 'atribui');
expect('atribuir', 'imperativo.afirmativo.vos', 'atribuí');
expect('atribuir', 'formas.gerundio', 'atribuindo');
expect('instruir', 'indicativo.presente', ['instruo', 'instruis', 'instrui', 'instruímos', 'instruís', 'instruem']);
expect('possuir', 'indicativo.presente', ['possuo', 'possuis', 'possui', 'possuímos', 'possuís', 'possuem']);
expect('sair', 'indicativo.presente', ['saio', 'sais', 'sai', 'saímos', 'saís', 'saem']);
expect('sair', 'indicativo.preteritoPerfeito', ['saí', 'saíste', 'saiu', 'saímos', 'saístes', 'saíram']);
expect('sair', 'indicativo.preteritoImperfeito', ['saía', 'saías', 'saía', 'saíamos', 'saíeis', 'saíam']);
expect('sair', 'indicativo.maisQuePerfeito', ['saíra', 'saíras', 'saíra', 'saíramos', 'saíreis', 'saíram']);
expect('sair', 'indicativo.futuro', ['sairei', 'sairás', 'sairá', 'sairemos', 'saireis', 'sairão']);
expect('sair', 'conjuntivo.presente', ['saia', 'saias', 'saia', 'saiamos', 'saiais', 'saiam']);
expect('sair', 'conjuntivo.imperfeito', ['saísse', 'saísses', 'saísse', 'saíssemos', 'saísseis', 'saíssem']);
expect('sair', 'conjuntivo.futuro', ['sair', 'saíres', 'sair', 'sairmos', 'sairdes', 'saírem']);
expect('sair', 'infinitivo.pessoal', ['sair', 'saíres', 'sair', 'sairmos', 'sairdes', 'saírem']);
expect('sair', 'imperativo.afirmativo.tu', 'sai');
expect('sair', 'imperativo.afirmativo.vos', 'saí');
expect('sair', 'formas.gerundio', 'saindo');
expect('sair', 'formas.participio', 'saído');
expect('cair', 'indicativo.presente', ['caio', 'cais', 'cai', 'caímos', 'caís', 'caem']);
expect('cair', 'indicativo.preteritoPerfeito', ['caí', 'caíste', 'caiu', 'caímos', 'caístes', 'caíram']);
expect('distrair', 'indicativo.presente', ['distraio', 'distrais', 'distrai', 'distraímos', 'distraís', 'distraem']);
expect('moer', 'indicativo.presente', ['moo', 'móis', 'mói', 'moemos', 'moeis', 'moem']);
expect('moer', 'indicativo.preteritoPerfeito', ['moí', 'moeste', 'moeu', 'moemos', 'moestes', 'moeram']);
expect('moer', 'indicativo.preteritoImperfeito', ['moía', 'moías', 'moía', 'moíamos', 'moíeis', 'moíam']);
expect('moer', 'conjuntivo.presente', ['moa', 'moas', 'moa', 'moamos', 'moais', 'moam']);
expect('moer', 'imperativo.afirmativo.tu', 'mói');
expect('moer', 'formas.participio', 'moído');
expect('doer', 'indicativo.presente', ['doo', 'dóis', 'dói', 'doemos', 'doeis', 'doem']);
expect('conduzir', 'indicativo.presente', ['conduzo', 'conduzes', 'conduz', 'conduzimos', 'conduzis', 'conduzem']);
expect('conduzir', 'imperativo.afirmativo.tu', 'conduz');
expect('produzir', 'indicativo.presente', ['produzo', 'produzes', 'produz', 'produzimos', 'produzis', 'produzem']);
expect('traduzir', 'indicativo.preteritoPerfeito', ['traduzi', 'traduziste', 'traduziu', 'traduzimos', 'traduzistes', 'traduziram']);
expect('jazer', 'indicativo.presente', ['jazo', 'jazes', 'jaz', 'jazemos', 'jazeis', 'jazem']);
expect('proibir', 'indicativo.presente', ['proíbo', 'proíbes', 'proíbe', 'proibimos', 'proibis', 'proíbem']);
expect('proibir', 'conjuntivo.presente', ['proíba', 'proíbas', 'proíba', 'proibamos', 'proibais', 'proíbam']);
expect('proibir', 'imperativo.afirmativo.tu', 'proíbe');
expect('proibir', 'indicativo.preteritoPerfeito', ['proibi', 'proibiste', 'proibiu', 'proibimos', 'proibistes', 'proibiram']);
expect('reunir', 'indicativo.presente', ['reúno', 'reúnes', 'reúne', 'reunimos', 'reunis', 'reúnem']);
expect('reunir', 'conjuntivo.presente', ['reúna', 'reúnas', 'reúna', 'reunamos', 'reunais', 'reúnam']);
expect('saudar', 'indicativo.presente', ['saúdo', 'saúdas', 'saúda', 'saudamos', 'saudais', 'saúdam']);
expect('saudar', 'conjuntivo.presente', ['saúde', 'saúdes', 'saúde', 'saudemos', 'saudeis', 'saúdem']);
expect('arruinar', 'indicativo.presente', ['arruíno', 'arruínas', 'arruína', 'arruinamos', 'arruinais', 'arruínam']);
expect('faiscar', 'conjuntivo.presente', ['faísque', 'faísques', 'faísque', 'faisquemos', 'faisqueis', 'faísquem']);
expect('cuidar', 'indicativo.presente', ['cuido', 'cuidas', 'cuida', 'cuidamos', 'cuidais', 'cuidam']);
check('construir is flagged u→ó', conjugate('construir').flags.stemChange === 'u→ó');
check('sair is flagged a→ai', conjugate('sair').flags.stemChange === 'a→ai');
check('proibir is flagged i→í', conjugate('proibir').flags.stemChange === 'i→í');
check('reunir is flagged u→ú', conjugate('reunir').flags.stemChange === 'u→ú');
check('atribuir is flagged i → í', conjugate('atribuir').flags.ortho === 'i → í');
check('saímos is not an irregular cell', !irregularCells('sair').has('indicativo.presente.nos'));
check('saio is an irregular cell', irregularCells('sair').has('indicativo.presente.eu'));

// --- ser, estar, ter, haver ------------------------------------------------
expect('ser', 'indicativo.presente', ['sou', 'és', 'é', 'somos', 'sois', 'são']);
expect('ser', 'indicativo.preteritoPerfeito', ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram']);
expect('ser', 'indicativo.preteritoImperfeito', ['era', 'eras', 'era', 'éramos', 'éreis', 'eram']);
expect('ser', 'indicativo.maisQuePerfeito', ['fora', 'foras', 'fora', 'fôramos', 'fôreis', 'foram']);
expect('ser', 'indicativo.futuro', ['serei', 'serás', 'será', 'seremos', 'sereis', 'serão']);
expect('ser', 'indicativo.condicional', ['seria', 'serias', 'seria', 'seríamos', 'seríeis', 'seriam']);
expect('ser', 'conjuntivo.presente', ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam']);
expect('ser', 'conjuntivo.imperfeito', ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem']);
expect('ser', 'conjuntivo.futuro', ['for', 'fores', 'for', 'formos', 'fordes', 'forem']);
expect('ser', 'infinitivo.pessoal', ['ser', 'seres', 'ser', 'sermos', 'serdes', 'serem']);
expect('ser', 'imperativo.afirmativo.tu', 'sê');
expect('ser', 'imperativo.afirmativo.voce', 'seja');
expect('ser', 'imperativo.afirmativo.vos', 'sede');
expect('ser', 'imperativo.negativo.tu', 'não sejas');
expect('ser', 'formas.gerundio', 'sendo');
expect('ser', 'formas.participio', 'sido');
expect('ser', 'indicativo.perfeitoComposto', ['tenho sido', 'tens sido', 'tem sido', 'temos sido', 'tendes sido', 'têm sido']);
expect('estar', 'indicativo.presente', ['estou', 'estás', 'está', 'estamos', 'estais', 'estão']);
expect('estar', 'indicativo.preteritoPerfeito', ['estive', 'estiveste', 'esteve', 'estivemos', 'estivestes', 'estiveram']);
expect('estar', 'indicativo.preteritoImperfeito', ['estava', 'estavas', 'estava', 'estávamos', 'estáveis', 'estavam']);
expect('estar', 'indicativo.maisQuePerfeito', ['estivera', 'estiveras', 'estivera', 'estivéramos', 'estivéreis', 'estiveram']);
expect('estar', 'conjuntivo.presente', ['esteja', 'estejas', 'esteja', 'estejamos', 'estejais', 'estejam']);
expect('estar', 'conjuntivo.imperfeito', ['estivesse', 'estivesses', 'estivesse', 'estivéssemos', 'estivésseis', 'estivessem']);
expect('estar', 'conjuntivo.futuro', ['estiver', 'estiveres', 'estiver', 'estivermos', 'estiverdes', 'estiverem']);
expect('estar', 'imperativo.afirmativo.tu', 'está');
expect('estar', 'imperativo.afirmativo.vos', 'estai');
expect('ter', 'indicativo.presente', ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm']);
expect('ter', 'indicativo.preteritoPerfeito', ['tive', 'tiveste', 'teve', 'tivemos', 'tivestes', 'tiveram']);
expect('ter', 'indicativo.preteritoImperfeito', ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham']);
expect('ter', 'indicativo.maisQuePerfeito', ['tivera', 'tiveras', 'tivera', 'tivéramos', 'tivéreis', 'tiveram']);
expect('ter', 'indicativo.futuro', ['terei', 'terás', 'terá', 'teremos', 'tereis', 'terão']);
expect('ter', 'conjuntivo.presente', ['tenha', 'tenhas', 'tenha', 'tenhamos', 'tenhais', 'tenham']);
expect('ter', 'conjuntivo.imperfeito', ['tivesse', 'tivesses', 'tivesse', 'tivéssemos', 'tivésseis', 'tivessem']);
expect('ter', 'conjuntivo.futuro', ['tiver', 'tiveres', 'tiver', 'tivermos', 'tiverdes', 'tiverem']);
expect('ter', 'infinitivo.pessoal', ['ter', 'teres', 'ter', 'termos', 'terdes', 'terem']);
expect('ter', 'imperativo.afirmativo.tu', 'tem');
expect('ter', 'imperativo.afirmativo.vos', 'tende');
expect('ter', 'formas.gerundio', 'tendo');
expect('ter', 'formas.participio', 'tido');
expect('haver', 'indicativo.presente', ['hei', 'hás', 'há', 'havemos', 'haveis', 'hão']);
expect('haver', 'indicativo.preteritoPerfeito', ['houve', 'houveste', 'houve', 'houvemos', 'houvestes', 'houveram']);
expect('haver', 'indicativo.preteritoImperfeito', ['havia', 'havias', 'havia', 'havíamos', 'havíeis', 'haviam']);
expect('haver', 'conjuntivo.presente', ['haja', 'hajas', 'haja', 'hajamos', 'hajais', 'hajam']);
expect('haver', 'conjuntivo.imperfeito', ['houvesse', 'houvesses', 'houvesse', 'houvéssemos', 'houvésseis', 'houvessem']);
expect('haver', 'conjuntivo.futuro', ['houver', 'houveres', 'houver', 'houvermos', 'houverdes', 'houverem']);
expect('haver', 'imperativo.afirmativo.tu', 'há');
expect('haver', 'formas.participio', 'havido');

// --- the big irregulars ----------------------------------------------------
expect('ir', 'indicativo.presente', ['vou', 'vais', 'vai', 'vamos', 'ides', 'vão']);
expect('ir', 'indicativo.preteritoPerfeito', ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram']);
expect('ir', 'indicativo.preteritoImperfeito', ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam']);
expect('ir', 'indicativo.futuro', ['irei', 'irás', 'irá', 'iremos', 'ireis', 'irão']);
expect('ir', 'conjuntivo.presente', ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão']);
expect('ir', 'conjuntivo.imperfeito', ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem']);
expect('ir', 'conjuntivo.futuro', ['for', 'fores', 'for', 'formos', 'fordes', 'forem']);
expect('ir', 'infinitivo.pessoal', ['ir', 'ires', 'ir', 'irmos', 'irdes', 'irem']);
expect('ir', 'imperativo.afirmativo.tu', 'vai');
expect('ir', 'imperativo.afirmativo.vos', 'ide');
expect('ir', 'imperativo.negativo.tu', 'não vás');
expect('ir', 'formas.gerundio', 'indo');
expect('ir', 'formas.participio', 'ido');

expect('vir', 'indicativo.presente', ['venho', 'vens', 'vem', 'vimos', 'vindes', 'vêm']);
expect('vir', 'indicativo.preteritoPerfeito', ['vim', 'vieste', 'veio', 'viemos', 'viestes', 'vieram']);
expect('vir', 'indicativo.preteritoImperfeito', ['vinha', 'vinhas', 'vinha', 'vínhamos', 'vínheis', 'vinham']);
expect('vir', 'indicativo.maisQuePerfeito', ['viera', 'vieras', 'viera', 'viéramos', 'viéreis', 'vieram']);
expect('vir', 'indicativo.futuro', ['virei', 'virás', 'virá', 'viremos', 'vireis', 'virão']);
expect('vir', 'conjuntivo.presente', ['venha', 'venhas', 'venha', 'venhamos', 'venhais', 'venham']);
expect('vir', 'conjuntivo.imperfeito', ['viesse', 'viesses', 'viesse', 'viéssemos', 'viésseis', 'viessem']);
expect('vir', 'conjuntivo.futuro', ['vier', 'vieres', 'vier', 'viermos', 'vierdes', 'vierem']);
expect('vir', 'infinitivo.pessoal', ['vir', 'vires', 'vir', 'virmos', 'virdes', 'virem']);
expect('vir', 'imperativo.afirmativo.tu', 'vem');
expect('vir', 'imperativo.afirmativo.vos', 'vinde');
expect('vir', 'formas.gerundio', 'vindo');
expect('vir', 'formas.participio', 'vindo');

expect('ver', 'indicativo.presente', ['vejo', 'vês', 'vê', 'vemos', 'vedes', 'veem']);
expect('ver', 'indicativo.preteritoPerfeito', ['vi', 'viste', 'viu', 'vimos', 'vistes', 'viram']);
expect('ver', 'indicativo.preteritoImperfeito', ['via', 'vias', 'via', 'víamos', 'víeis', 'viam']);
expect('ver', 'indicativo.maisQuePerfeito', ['vira', 'viras', 'vira', 'víramos', 'víreis', 'viram']);
expect('ver', 'conjuntivo.presente', ['veja', 'vejas', 'veja', 'vejamos', 'vejais', 'vejam']);
expect('ver', 'conjuntivo.imperfeito', ['visse', 'visses', 'visse', 'víssemos', 'vísseis', 'vissem']);
expect('ver', 'conjuntivo.futuro', ['vir', 'vires', 'vir', 'virmos', 'virdes', 'virem']);
expect('ver', 'imperativo.afirmativo.tu', 'vê');
expect('ver', 'imperativo.afirmativo.vos', 'vede');
expect('ver', 'formas.participio', 'visto');

expect('dar', 'indicativo.presente', ['dou', 'dás', 'dá', 'damos', 'dais', 'dão']);
expect('dar', 'indicativo.preteritoPerfeito', ['dei', 'deste', 'deu', 'demos', 'destes', 'deram']);
expect('dar', 'indicativo.maisQuePerfeito', ['dera', 'deras', 'dera', 'déramos', 'déreis', 'deram']);
expect('dar', 'conjuntivo.presente', ['dê', 'dês', 'dê', 'demos', 'deis', 'deem']);
expect('dar', 'conjuntivo.imperfeito', ['desse', 'desses', 'desse', 'déssemos', 'désseis', 'dessem']);
expect('dar', 'conjuntivo.futuro', ['der', 'deres', 'der', 'dermos', 'derdes', 'derem']);
expect('dar', 'imperativo.afirmativo.tu', 'dá');
expect('dar', 'imperativo.afirmativo.vos', 'dai');
expect('dar', 'imperativo.negativo.tu', 'não dês');

expect('dizer', 'indicativo.presente', ['digo', 'dizes', 'diz', 'dizemos', 'dizeis', 'dizem']);
expect('dizer', 'indicativo.preteritoPerfeito', ['disse', 'disseste', 'disse', 'dissemos', 'dissestes', 'disseram']);
expect('dizer', 'indicativo.maisQuePerfeito', ['dissera', 'disseras', 'dissera', 'disséramos', 'disséreis', 'disseram']);
expect('dizer', 'indicativo.futuro', ['direi', 'dirás', 'dirá', 'diremos', 'direis', 'dirão']);
expect('dizer', 'indicativo.condicional', ['diria', 'dirias', 'diria', 'diríamos', 'diríeis', 'diriam']);
expect('dizer', 'conjuntivo.presente', ['diga', 'digas', 'diga', 'digamos', 'digais', 'digam']);
expect('dizer', 'conjuntivo.imperfeito', ['dissesse', 'dissesses', 'dissesse', 'disséssemos', 'dissésseis', 'dissessem']);
expect('dizer', 'conjuntivo.futuro', ['disser', 'disseres', 'disser', 'dissermos', 'disserdes', 'disserem']);
expect('dizer', 'infinitivo.pessoal', ['dizer', 'dizeres', 'dizer', 'dizermos', 'dizerdes', 'dizerem']);
expect('dizer', 'imperativo.afirmativo.tu', 'diz');
expect('dizer', 'imperativo.afirmativo.vos', 'dizei');
expect('dizer', 'formas.participio', 'dito');

expect('fazer', 'indicativo.presente', ['faço', 'fazes', 'faz', 'fazemos', 'fazeis', 'fazem']);
expect('fazer', 'indicativo.preteritoPerfeito', ['fiz', 'fizeste', 'fez', 'fizemos', 'fizestes', 'fizeram']);
expect('fazer', 'indicativo.preteritoImperfeito', ['fazia', 'fazias', 'fazia', 'fazíamos', 'fazíeis', 'faziam']);
expect('fazer', 'indicativo.maisQuePerfeito', ['fizera', 'fizeras', 'fizera', 'fizéramos', 'fizéreis', 'fizeram']);
expect('fazer', 'indicativo.futuro', ['farei', 'farás', 'fará', 'faremos', 'fareis', 'farão']);
expect('fazer', 'indicativo.condicional', ['faria', 'farias', 'faria', 'faríamos', 'faríeis', 'fariam']);
expect('fazer', 'conjuntivo.presente', ['faça', 'faças', 'faça', 'façamos', 'façais', 'façam']);
expect('fazer', 'conjuntivo.imperfeito', ['fizesse', 'fizesses', 'fizesse', 'fizéssemos', 'fizésseis', 'fizessem']);
expect('fazer', 'conjuntivo.futuro', ['fizer', 'fizeres', 'fizer', 'fizermos', 'fizerdes', 'fizerem']);
expect('fazer', 'infinitivo.pessoal', ['fazer', 'fazeres', 'fazer', 'fazermos', 'fazerdes', 'fazerem']);
expect('fazer', 'imperativo.afirmativo.tu', 'faz');
expect('fazer', 'imperativo.afirmativo.voce', 'faça');
expect('fazer', 'imperativo.negativo.tu', 'não faças');
expect('fazer', 'formas.gerundio', 'fazendo');
expect('fazer', 'formas.participio', 'feito');
expect('fazer', 'indicativo.perfeitoComposto', ['tenho feito', 'tens feito', 'tem feito', 'temos feito', 'tendes feito', 'têm feito']);

expect('trazer', 'indicativo.presente', ['trago', 'trazes', 'traz', 'trazemos', 'trazeis', 'trazem']);
expect('trazer', 'indicativo.preteritoPerfeito', ['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxestes', 'trouxeram']);
expect('trazer', 'indicativo.futuro', ['trarei', 'trarás', 'trará', 'traremos', 'trareis', 'trarão']);
expect('trazer', 'conjuntivo.presente', ['traga', 'tragas', 'traga', 'tragamos', 'tragais', 'tragam']);
expect('trazer', 'conjuntivo.futuro', ['trouxer', 'trouxeres', 'trouxer', 'trouxermos', 'trouxerdes', 'trouxerem']);
expect('trazer', 'formas.participio', 'trazido');

expect('poder', 'indicativo.presente', ['posso', 'podes', 'pode', 'podemos', 'podeis', 'podem']);
expect('poder', 'indicativo.preteritoPerfeito', ['pude', 'pudeste', 'pôde', 'pudemos', 'pudestes', 'puderam']);
expect('poder', 'conjuntivo.presente', ['possa', 'possas', 'possa', 'possamos', 'possais', 'possam']);
expect('poder', 'conjuntivo.imperfeito', ['pudesse', 'pudesses', 'pudesse', 'pudéssemos', 'pudésseis', 'pudessem']);
expect('poder', 'conjuntivo.futuro', ['puder', 'puderes', 'puder', 'pudermos', 'puderdes', 'puderem']);

expect('pôr', 'indicativo.presente', ['ponho', 'pões', 'põe', 'pomos', 'pondes', 'põem']);
expect('pôr', 'indicativo.preteritoPerfeito', ['pus', 'puseste', 'pôs', 'pusemos', 'pusestes', 'puseram']);
expect('pôr', 'indicativo.preteritoImperfeito', ['punha', 'punhas', 'punha', 'púnhamos', 'púnheis', 'punham']);
expect('pôr', 'indicativo.maisQuePerfeito', ['pusera', 'puseras', 'pusera', 'puséramos', 'puséreis', 'puseram']);
expect('pôr', 'indicativo.futuro', ['porei', 'porás', 'porá', 'poremos', 'poreis', 'porão']);
expect('pôr', 'indicativo.condicional', ['poria', 'porias', 'poria', 'poríamos', 'poríeis', 'poriam']);
expect('pôr', 'conjuntivo.presente', ['ponha', 'ponhas', 'ponha', 'ponhamos', 'ponhais', 'ponham']);
expect('pôr', 'conjuntivo.imperfeito', ['pusesse', 'pusesses', 'pusesse', 'puséssemos', 'pusésseis', 'pusessem']);
expect('pôr', 'conjuntivo.futuro', ['puser', 'puseres', 'puser', 'pusermos', 'puserdes', 'puserem']);
expect('pôr', 'infinitivo.pessoal', ['pôr', 'pores', 'pôr', 'pormos', 'pordes', 'porem']);
expect('pôr', 'imperativo.afirmativo.tu', 'põe');
expect('pôr', 'imperativo.afirmativo.vos', 'ponde');
expect('pôr', 'formas.gerundio', 'pondo');
expect('pôr', 'formas.participio', 'posto');
check('pôr is class or', conjugate('pôr').class === 'or');
check('por without its circumflex is read as pôr', conjugate('por').ok && conjugate('por').verb === 'pôr');

expect('querer', 'indicativo.presente', ['quero', 'queres', 'quer', 'queremos', 'quereis', 'querem']);
expect('querer', 'indicativo.preteritoPerfeito', ['quis', 'quiseste', 'quis', 'quisemos', 'quisestes', 'quiseram']);
expect('querer', 'conjuntivo.presente', ['queira', 'queiras', 'queira', 'queiramos', 'queirais', 'queiram']);
expect('querer', 'conjuntivo.imperfeito', ['quisesse', 'quisesses', 'quisesse', 'quiséssemos', 'quisésseis', 'quisessem']);
expect('querer', 'conjuntivo.futuro', ['quiser', 'quiseres', 'quiser', 'quisermos', 'quiserdes', 'quiserem']);
expect('querer', 'indicativo.futuro', ['quererei', 'quererás', 'quererá', 'quereremos', 'querereis', 'quererão']);
expect('saber', 'indicativo.presente', ['sei', 'sabes', 'sabe', 'sabemos', 'sabeis', 'sabem']);
expect('saber', 'indicativo.preteritoPerfeito', ['soube', 'soubeste', 'soube', 'soubemos', 'soubestes', 'souberam']);
expect('saber', 'conjuntivo.presente', ['saiba', 'saibas', 'saiba', 'saibamos', 'saibais', 'saibam']);
expect('saber', 'conjuntivo.futuro', ['souber', 'souberes', 'souber', 'soubermos', 'souberdes', 'souberem']);
expect('saber', 'imperativo.afirmativo.tu', 'sabe');
expect('caber', 'indicativo.presente', ['caibo', 'cabes', 'cabe', 'cabemos', 'cabeis', 'cabem']);
expect('caber', 'indicativo.preteritoPerfeito', ['coube', 'coubeste', 'coube', 'coubemos', 'coubestes', 'couberam']);
expect('caber', 'conjuntivo.presente', ['caiba', 'caibas', 'caiba', 'caibamos', 'caibais', 'caibam']);
expect('crer', 'indicativo.presente', ['creio', 'crês', 'crê', 'cremos', 'credes', 'creem']);
expect('crer', 'indicativo.preteritoPerfeito', ['cri', 'creste', 'creu', 'cremos', 'crestes', 'creram']);
expect('crer', 'conjuntivo.presente', ['creia', 'creias', 'creia', 'creiamos', 'creiais', 'creiam']);
expect('ler', 'indicativo.presente', ['leio', 'lês', 'lê', 'lemos', 'ledes', 'leem']);
expect('ler', 'indicativo.preteritoPerfeito', ['li', 'leste', 'leu', 'lemos', 'lestes', 'leram']);
expect('ler', 'indicativo.preteritoImperfeito', ['lia', 'lias', 'lia', 'líamos', 'líeis', 'liam']);
expect('ler', 'indicativo.maisQuePerfeito', ['lera', 'leras', 'lera', 'lêramos', 'lêreis', 'leram']);
expect('ler', 'conjuntivo.presente', ['leia', 'leias', 'leia', 'leiamos', 'leiais', 'leiam']);
expect('ler', 'imperativo.afirmativo.tu', 'lê');
expect('ler', 'imperativo.afirmativo.vos', 'lede');
expect('ler', 'formas.participio', 'lido');
expect('rir', 'indicativo.presente', ['rio', 'ris', 'ri', 'rimos', 'rides', 'riem']);
expect('rir', 'indicativo.preteritoPerfeito', ['ri', 'riste', 'riu', 'rimos', 'ristes', 'riram']);
expect('rir', 'conjuntivo.presente', ['ria', 'rias', 'ria', 'riamos', 'riais', 'riam']);
expect('rir', 'formas.gerundio', 'rindo');
expect('valer', 'indicativo.presente', ['valho', 'vales', 'vale', 'valemos', 'valeis', 'valem']);
expect('valer', 'conjuntivo.presente', ['valha', 'valhas', 'valha', 'valhamos', 'valhais', 'valham']);
expect('perder', 'indicativo.presente', ['perco', 'perdes', 'perde', 'perdemos', 'perdeis', 'perdem']);
expect('perder', 'conjuntivo.presente', ['perca', 'percas', 'perca', 'percamos', 'percais', 'percam']);
expect('perder', 'indicativo.preteritoPerfeito', ['perdi', 'perdeste', 'perdeu', 'perdemos', 'perdestes', 'perderam']);
expect('pedir', 'indicativo.presente', ['peço', 'pedes', 'pede', 'pedimos', 'pedis', 'pedem']);
expect('pedir', 'conjuntivo.presente', ['peça', 'peças', 'peça', 'peçamos', 'peçais', 'peçam']);
expect('pedir', 'imperativo.afirmativo.tu', 'pede');
expect('pedir', 'imperativo.afirmativo.voce', 'peça');
expect('medir', 'indicativo.presente', ['meço', 'medes', 'mede', 'medimos', 'medis', 'medem']);
expect('ouvir', 'indicativo.presente', ['ouço', 'ouves', 'ouve', 'ouvimos', 'ouvis', 'ouvem']);
expect('ouvir', 'conjuntivo.presente', ['ouça', 'ouças', 'ouça', 'ouçamos', 'ouçais', 'ouçam']);
expect('requerer', 'indicativo.presente', ['requeiro', 'requeres', 'requer', 'requeremos', 'requereis', 'requerem']);
expect('requerer', 'indicativo.preteritoPerfeito', ['requeri', 'requereste', 'requereu', 'requeremos', 'requerestes', 'requereram']);
expect('requerer', 'conjuntivo.presente', ['requeira', 'requeiras', 'requeira', 'requeiramos', 'requeirais', 'requeiram']);
expect('prover', 'indicativo.presente', ['provejo', 'provês', 'provê', 'provemos', 'provedes', 'proveem']);
expect('prover', 'indicativo.preteritoPerfeito', ['provi', 'proveste', 'proveu', 'provemos', 'provestes', 'proveram']);
expect('prover', 'formas.participio', 'provido');

// --- derivatives, and the accents a prefix moves ---------------------------
expect('manter', 'indicativo.presente', ['mantenho', 'manténs', 'mantém', 'mantemos', 'mantendes', 'mantêm']);
expect('manter', 'indicativo.preteritoPerfeito', ['mantive', 'mantiveste', 'manteve', 'mantivemos', 'mantivestes', 'mantiveram']);
expect('manter', 'indicativo.preteritoImperfeito', ['mantinha', 'mantinhas', 'mantinha', 'mantínhamos', 'mantínheis', 'mantinham']);
expect('manter', 'conjuntivo.presente', ['mantenha', 'mantenhas', 'mantenha', 'mantenhamos', 'mantenhais', 'mantenham']);
expect('manter', 'conjuntivo.futuro', ['mantiver', 'mantiveres', 'mantiver', 'mantivermos', 'mantiverdes', 'mantiverem']);
expect('manter', 'infinitivo.pessoal', ['manter', 'manteres', 'manter', 'mantermos', 'manterdes', 'manterem']);
expect('manter', 'imperativo.afirmativo.tu', 'mantém');
expect('manter', 'formas.participio', 'mantido');
expect('conter', 'indicativo.presente', ['contenho', 'conténs', 'contém', 'contemos', 'contendes', 'contêm']);
expect('obter', 'indicativo.preteritoPerfeito', ['obtive', 'obtiveste', 'obteve', 'obtivemos', 'obtivestes', 'obtiveram']);
expect('deter', 'indicativo.presente', ['detenho', 'deténs', 'detém', 'detemos', 'detendes', 'detêm']);
expect('propor', 'indicativo.presente', ['proponho', 'propões', 'propõe', 'propomos', 'propondes', 'propõem']);
expect('propor', 'indicativo.preteritoPerfeito', ['propus', 'propuseste', 'propôs', 'propusemos', 'propusestes', 'propuseram']);
expect('propor', 'indicativo.futuro', ['proporei', 'proporás', 'proporá', 'proporemos', 'proporeis', 'proporão']);
expect('propor', 'infinitivo.pessoal', ['propor', 'propores', 'propor', 'propormos', 'propordes', 'proporem']);
expect('propor', 'imperativo.afirmativo.tu', 'propõe');
expect('propor', 'formas.participio', 'proposto');
expect('compor', 'indicativo.presente', ['componho', 'compões', 'compõe', 'compomos', 'compondes', 'compõem']);
expect('supor', 'conjuntivo.futuro', ['supuser', 'supuseres', 'supuser', 'supusermos', 'supuserdes', 'supuserem']);
expect('prever', 'indicativo.presente', ['prevejo', 'prevês', 'prevê', 'prevemos', 'prevedes', 'preveem']);
expect('prever', 'indicativo.preteritoPerfeito', ['previ', 'previste', 'previu', 'previmos', 'previstes', 'previram']);
expect('prever', 'formas.participio', 'previsto');
expect('rever', 'conjuntivo.presente', ['reveja', 'revejas', 'reveja', 'revejamos', 'revejais', 'revejam']);
expect('convir', 'indicativo.presente', ['convenho', 'convéns', 'convém', 'convimos', 'convindes', 'convêm']);
expect('intervir', 'indicativo.presente', ['intervenho', 'intervéns', 'intervém', 'intervimos', 'intervindes', 'intervêm']);
expect('intervir', 'indicativo.preteritoPerfeito', ['intervim', 'intervieste', 'interveio', 'interviemos', 'interviestes', 'intervieram']);
expect('intervir', 'imperativo.afirmativo.tu', 'intervém');
expect('intervir', 'formas.participio', 'intervindo');
expect('refazer', 'indicativo.preteritoPerfeito', ['refiz', 'refizeste', 'refez', 'refizemos', 'refizestes', 'refizeram']);
expect('desfazer', 'formas.participio', 'desfeito');
expect('satisfazer', 'indicativo.presente', ['satisfaço', 'satisfazes', 'satisfaz', 'satisfazemos', 'satisfazeis', 'satisfazem']);
expect('satisfazer', 'indicativo.futuro', ['satisfarei', 'satisfarás', 'satisfará', 'satisfaremos', 'satisfareis', 'satisfarão']);
expect('satisfazer', 'formas.participio', 'satisfeito');
expect('predizer', 'indicativo.presente', ['predigo', 'predizes', 'prediz', 'predizemos', 'predizeis', 'predizem']);
expect('contradizer', 'indicativo.preteritoPerfeito', ['contradisse', 'contradisseste', 'contradisse', 'contradissemos', 'contradissestes', 'contradisseram']);
expect('contradizer', 'indicativo.futuro', ['contradirei', 'contradirás', 'contradirá', 'contradiremos', 'contradireis', 'contradirão']);
expect('contradizer', 'formas.participio', 'contradito');
expect('despedir', 'indicativo.presente', ['despeço', 'despedes', 'despede', 'despedimos', 'despedis', 'despedem']);
expect('impedir', 'conjuntivo.presente', ['impeça', 'impeças', 'impeça', 'impeçamos', 'impeçais', 'impeçam']);
expect('descobrir', 'indicativo.presente', ['descubro', 'descobres', 'descobre', 'descobrimos', 'descobris', 'descobrem']);
expect('descobrir', 'formas.participio', 'descoberto');
expect('descrever', 'formas.participio', 'descrito');
expect('inscrever', 'formas.participio', 'inscrito');
expect('reabrir', 'formas.participio', 'reaberto');
expect('equivaler', 'indicativo.presente', ['equivalho', 'equivales', 'equivale', 'equivalemos', 'equivaleis', 'equivalem']);
expect('reler', 'indicativo.presente', ['releio', 'relês', 'relê', 'relemos', 'reledes', 'releem']);
expect('sorrir', 'indicativo.presente', ['sorrio', 'sorris', 'sorri', 'sorrimos', 'sorrides', 'sorriem']);
check('manter is derived from ter', conjugate('manter').flags.derivedFrom === 'ter');
check('propor is derived from pôr', conjugate('propor').flags.derivedFrom === 'pôr');
check('propor is class or', conjugate('propor').class === 'or');
check('intervir is irregular', conjugate('intervir').flags.irregular === true);
check('compôr typed with a circumflex is compor', conjugate('compôr').ok && conjugate('compôr').verb === 'compor');
// Look-alikes are left alone.
expect('bater', 'indicativo.presente', ['bato', 'bates', 'bate', 'batemos', 'bateis', 'batem']);
expect('prometer', 'indicativo.preteritoPerfeito', ['prometi', 'prometeste', 'prometeu', 'prometemos', 'prometestes', 'prometeram']);
expect('dever', 'indicativo.presente', ['devo', 'deves', 'deve', 'devemos', 'deveis', 'devem']);
expect('viver', 'formas.participio', 'vivido');
expect('servir', 'formas.participio', 'servido');
expect('abrir', 'indicativo.presente', ['abro', 'abres', 'abre', 'abrimos', 'abris', 'abrem']);
check('bater is not derived from ter', conjugate('bater').flags.derivedFrom === null && !conjugate('bater').flags.irregular);
check('dever is not derived from ver', conjugate('dever').flags.derivedFrom === null);

// --- participles -----------------------------------------------------------
expect('abrir', 'formas.participio', 'aberto');
expect('escrever', 'formas.participio', 'escrito');
expect('escrever', 'indicativo.perfeitoComposto', ['tenho escrito', 'tens escrito', 'tem escrito', 'temos escrito', 'tendes escrito', 'têm escrito']);
expect('aceitar', 'formas.participio', 'aceitado / aceite');
expect('aceitar', 'formas.infinitivoComposto', 'ter aceitado');
expect('aceitar', 'indicativo.perfeitoComposto', ['tenho aceitado', 'tens aceitado', 'tem aceitado', 'temos aceitado', 'tendes aceitado', 'têm aceitado']);
expect('entregar', 'formas.participio', 'entregado / entregue');
expect('ganhar', 'formas.participio', 'ganhado / ganho');
expect('ganhar', 'indicativo.perfeitoComposto', ['tenho ganho', 'tens ganho', 'tem ganho', 'temos ganho', 'tendes ganho', 'têm ganho']);
expect('gastar', 'formas.participio', 'gastado / gasto');
expect('gastar', 'formas.infinitivoComposto', 'ter gasto');
expect('pagar', 'formas.participio', 'pagado / pago');
expect('pagar', 'formas.gerundioComposto', 'tendo pago');
expect('matar', 'formas.participio', 'matado / morto');
expect('matar', 'formas.infinitivoComposto', 'ter matado');
expect('prender', 'formas.participio', 'prendido / preso');
expect('acender', 'formas.participio', 'acendido / aceso');
expect('eleger', 'formas.participio', 'elegido / eleito');
expect('salvar', 'formas.participio', 'salvado / salvo');
expect('imprimir', 'formas.participio', 'imprimido / impresso');
expect('limpar', 'formas.participio', 'limpado / limpo');
expect('morrer', 'formas.participio', 'morrido / morto');
check('ganho is an irregular compound cell', irregularCells('ganhar').has('indicativo.perfeitoComposto.eu'));
check('ganhar is not flagged irregular', conjugate('ganhar').flags.irregular === false);

// --- impersonal verbs have only the third persons --------------------------
expect('chover', 'indicativo.presente', [null, null, 'chove', null, null, 'chovem']);
expect('chover', 'conjuntivo.futuro', [null, null, 'chover', null, null, 'choverem']);
expect('chover', 'imperativo.afirmativo.tu', null);

// --- reflexives ------------------------------------------------------------
const reflexive = conjugate('levantar-se');
check('levantar-se: reflexive flag, citation form and heading',
  reflexive.ok && reflexive.pronominal && reflexive.verb === 'levantar' && reflexive.input === 'levantar-se');
expect('levantar-se', 'indicativo.presente', ['levanto', 'levantas', 'levanta', 'levantamos', 'levantais', 'levantam']);
expect('levantar-se', 'imperativo.afirmativo.tu', 'levanta');
check('levantar-se has no irregular cells', irregularCells('levantar-se').size === 0);
check('pôr-se is pôr', conjugate('pôr-se').verb === 'pôr' && conjugate('pôr-se').pronominal);
check('sentir-se keeps its stem change', conjugate('sentir-se').table.indicativo.presente.eu === 'sinto');
check('a plain verb is not pronominal', conjugate('levantar').pronominal === false);

// --- the shape of the result -----------------------------------------------
const falar = conjugate('falar');
const sameKeys = (object, keys) => {
  const have = Object.keys(object).sort();
  const want = [...keys].sort();
  return have.length === want.length && have.every((key, index) => key === want[index]);
};
check('table has exactly the five moods', sameKeys(falar.table, ['formas', 'indicativo', 'conjuntivo', 'infinitivo', 'imperativo']));
check('formas has exactly its five keys', sameKeys(falar.table.formas, ['infinitivo', 'gerundio', 'participio', 'infinitivoComposto', 'gerundioComposto']));
check('indicativo has exactly its ten tenses', sameKeys(falar.table.indicativo, [
  'presente', 'preteritoPerfeito', 'preteritoImperfeito', 'maisQuePerfeito', 'futuro', 'condicional',
  'perfeitoComposto', 'maisQuePerfeitoComposto', 'futuroComposto', 'condicionalComposto',
]));
check('conjuntivo has exactly its six tenses', sameKeys(falar.table.conjuntivo, [
  'presente', 'imperfeito', 'futuro', 'perfeito', 'maisQuePerfeito', 'futuroComposto',
]));
check('infinitivo has exactly pessoal', sameKeys(falar.table.infinitivo, ['pessoal']));
check('imperativo has exactly its two kinds', sameKeys(falar.table.imperativo, ['afirmativo', 'negativo']));
check('imperative persons', sameKeys(falar.table.imperativo.afirmativo, IMPERATIVE_PERSONS) && sameKeys(falar.table.imperativo.negativo, IMPERATIVE_PERSONS));
check('every tense row has exactly the six persons', [
  ...Object.values(falar.table.indicativo), ...Object.values(falar.table.conjuntivo), falar.table.infinitivo.pessoal,
].every((forms) => sameKeys(forms, PERSONS)));
check('result carries the contract fields', ['verb', 'input', 'class', 'stem', 'source', 'pronominal', 'auxiliary', 'flags', 'table']
  .every((key) => key in falar) && falar.auxiliary === null && falar.source === 'local');
check('flags carry the contract fields', sameKeys(falar.flags, ['irregular', 'stemChange', 'ortho', 'derivedFrom']));
check('PERSONS', PERSONS.join() === 'eu,tu,ele,nos,vos,eles');

// Every cell of every tense is a non-empty string for a handful of verbs.
for (const verb of ['falar', 'comer', 'partir', 'ser', 'ter', 'pôr', 'sair', 'manter', 'propor', 'construir', 'odiar', 'ficar']) {
  const result = conjugate(verb);
  const cells = [];
  for (const mood of ['indicativo', 'conjuntivo', 'infinitivo']) {
    for (const forms of Object.values(result.table[mood])) cells.push(...Object.values(forms));
  }
  for (const forms of Object.values(result.table.imperativo)) cells.push(...Object.values(forms));
  cells.push(...Object.values(result.table.formas));
  check(`${verb}: every cell is a non-empty string`, cells.every((cell) => typeof cell === 'string' && cell.length > 0));
}

// --- the data ----------------------------------------------------------------
check('three model verbs, keyed by class', sameKeys(MODEL_VERBS, ['ar', 'er', 'ir'])
  && MODEL_VERBS.ar.verb === 'falar' && MODEL_VERBS.er.verb === 'comer' && MODEL_VERBS.ir.verb === 'partir');
check(`at least 250 common verbs (${COMMON_VERBS.length})`, COMMON_VERBS.length >= 250);
check('common verbs are unique', new Set(COMMON_VERBS.map(([verb]) => verb)).size === COMMON_VERBS.length);
check('every gloss starts with "to "', COMMON_VERBS.every(([, gloss]) => gloss.startsWith('to ')));
for (const [verb] of COMMON_VERBS) {
  const result = conjugate(verb);
  check(`${verb} conjugates`, result.ok && result.verb === verb && typeof result.table.indicativo.presente.ele === 'string');
}
for (const verb of Object.keys(IRREGULARS)) check(`irregular ${verb} conjugates`, conjugate(verb).ok && conjugate(verb).flags.irregular);
check('every stem-change code has a label', [...Object.values(STEM_CHANGES), ...STEM_FAMILIES.map(([, code]) => code), 'e→ei', 'a→ai']
  .every((code) => typeof STEM_CHANGE_LABELS[code] === 'string'));
check('the model verbs are regular', ['falar', 'comer', 'partir'].every((verb) => irregularCells(verb).size === 0));
check('fazer marks faço', irregularCells('fazer').has('indicativo.presente.eu'));
check('fazer marks fizer but not fazeres', irregularCells('fazer').has('conjuntivo.futuro.eu') && !irregularCells('fazer').has('infinitivo.pessoal.tu'));
check('pôr does not mark its futuro', !irregularCells('pôr').has('indicativo.futuro.eu'));

// --- rejection -------------------------------------------------------------
for (const garbage of ['gato', 'casa', 'xyz', 'ar', 'amor', 'flor', '123ar', '']) {
  check(`${JSON.stringify(garbage)}: should be rejected`, !conjugate(garbage).ok);
}
check('rejection carries an error code', conjugate('gato').error === 'not-an-infinitive');
check('empty input says so', conjugate('').error === 'empty');
check('input is trimmed and lowercased', conjugate('  Falar ').ok && conjugate('  Falar ').verb === 'falar');
check('an unknown verb conjugates regularly', conjugate('blogar').table.indicativo.preteritoPerfeito.eu === 'bloguei');

// --- report ----------------------------------------------------------------
if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Portuguese conjugation checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Portuguese conjugation checks passed`);
