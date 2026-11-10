/**
 * Verb data for the Portuguese conjugation engine.
 *
 * The Portuguese here is Portugal's, in the spelling of the 1990 Orthographic
 * Agreement: *falámos* in the pretérito perfeito against *falamos* in the
 * present, *veem* and *leem* without the old circumflex, *refletir* and
 * *adotar* without their silent consonants.
 *
 * What lives here is what a rule cannot produce:
 *
 *   STEM_CHANGES        — verbs whose stem vowel alternates (dormir → durmo,
 *                         subir → sobes, odiar → odeio, proibir → proíbo).
 *   STEM_FAMILIES       — endings every verb of which alternates the same way
 *                         (-ferir, -sentir, -seguir …), so that *interferir*
 *                         needs no line of its own.
 *   SOUNDED_GU          — the two -guir verbs whose u is pronounced.
 *   IRREGULARS          — explicit forms and stems.
 *   PREFIXABLE, DERIVED — how derivatives find the base they inherit from.
 *   SHORT_PARTICIPLES   — the second, short participle of the verbs that have
 *                         two (aceitado / aceite), and SHORT_WITH_TER, the few
 *                         whose short one is the one now used after *ter*.
 *   COMMON_VERBS        — the search index for the conjugator page.
 *
 * Everything a rule can produce lives in lib/conjugator-pt.js instead: the
 * three regular patterns, the spelling alternations (ficar → fiquei,
 * conhecer → conheço, dirigir → dirijo, erguer → ergo), the written accents a
 * hiatus calls for (saímos, caíste, construíram), and the sub-patterns that
 * cover a whole ending: -ear (passeio), -air (saio, sais), -uir (atribuis),
 * -oer (móis) and -uzir (conduz).
 */

/** Model verbs on the conjugator's three tabs. */
export const MODEL_VERBS = {
  ar: { verb: 'falar', gloss: 'to speak' },
  er: { verb: 'comer', gloss: 'to eat' },
  ir: { verb: 'partir', gloss: 'to leave' },
};

/**
 * Vowel alternations, by verb. The codes, and where each one applies:
 *
 *   'e→i'        first person of the present and the whole present conjuntivo
 *                (sentir → sinto, sentes; sinta, sintamos)
 *   'o→u'        the same places (dormir → durmo, dormes; durma)
 *   'u→o'        tu, ele and eles of the present (subir → subo, sobes, sobe,
 *                sobem); the conjuntivo keeps its u (suba)
 *   'e→i:todas'  every form stressed on the stem, and the whole conjuntivo
 *                (agredir → agrido, agrides, agride, agridem; agrida)
 *   'o→u:todas'  the same, for o (polir → pulo, pules, pule, pulem; pula)
 *   'i→ei'       every form stressed on the stem (odiar → odeio, odeias;
 *                odeie, but odiamos, odiemos)
 *   'i→í', 'u→ú' no change of vowel, only the accent that keeps a stressed i
 *                or u from merging into the vowel before it (proibir →
 *                proíbo, reunir → reúno, saudar → saúdo)
 *   'u→ó'        construir → constróis, constrói, constroem
 *
 * Two more codes, 'e→ei' (passear → passeio) and 'a→ai' (sair → saio), are
 * never listed: every verb in -ear and every verb in -air has them, so the
 * engine reads them off the ending.
 */
export const STEM_CHANGES = {};

function addStemChange(code, verbs) {
  for (const verb of verbs) STEM_CHANGES[verb] = code;
}

addStemChange('e→i', [
  'servir', 'despir', 'aderir', 'inserir', 'preterir', 'discernir', 'convergir', 'divergir',
]);

addStemChange('o→u', ['dormir', 'tossir', 'engolir']);

// assumir, resumir and presumir do not belong here: assumes, resumes.
addStemChange('u→o', [
  'subir', 'fugir', 'sacudir', 'acudir', 'cuspir', 'sumir', 'consumir', 'bulir', 'entupir',
]);

addStemChange('e→i:todas', ['prevenir', 'denegrir', 'cerzir']);

addStemChange('o→u:todas', ['polir']);

/**
 * The -iar verbs that conjugate as if they ended in -ear. The rest of the
 * -iar family is regular (copiar → copio, enviar → envio).
 */
addStemChange('i→ei', ['odiar', 'ansiar', 'mediar', 'remediar', 'incendiar', 'intermediar']);

/**
 * A stressed i or u that would otherwise be read as the second half of a
 * diphthong: *proibo* would be pro-i-bo with the stress on o, *saudo* would
 * rhyme with *laudo*. Whether a stem has the hiatus is a fact about the word
 * (saudar has it, cuidar does not), so the verbs are listed.
 */
addStemChange('i→í', ['proibir', 'coibir', 'arruinar', 'ajuizar', 'enraizar', 'faiscar']);
addStemChange('u→ú', ['reunir', 'saudar', 'esmiuçar']);

// instruir and obstruir are regular -uir verbs: instruis, instrui.
addStemChange('u→ó', ['construir', 'destruir', 'reconstruir']);

/**
 * Endings whose every verb alternates, so the alternation is a rule: all the
 * compounds of Latin *ferre*, *gerere*, *sentire*, *sequi* and so on behave
 * as the simple verb does. [ending, code].
 */
export const STEM_FAMILIES = [
  ['ferir', 'e→i'], // ferir, preferir, referir, conferir, transferir, diferir
  ['gerir', 'e→i'], // gerir, sugerir, digerir, ingerir
  ['sentir', 'e→i'], // sentir, consentir, pressentir, ressentir
  ['mentir', 'e→i'], // mentir, desmentir
  ['seguir', 'e→i'], // seguir, conseguir, perseguir, prosseguir
  ['vestir', 'e→i'], // vestir, revestir, investir
  ['vertir', 'e→i'], // divertir, advertir
  ['petir', 'e→i'], // repetir, competir
  ['pelir', 'e→i'], // repelir, expelir, impelir, compelir
  ['fletir', 'e→i'], // refletir
  ['cobrir', 'o→u'], // cobrir, descobrir, encobrir, recobrir
  ['gredir', 'e→i:todas'], // agredir, progredir, regredir, transgredir
];

/**
 * -guir verbs whose u is a sound, not a spelling device. *distinguir* writes
 * gu only to keep its g hard and drops the u before a and o (distingo);
 * *arguir* says its u everywhere and keeps it (arguo, arguis, argui).
 */
export const SOUNDED_GU = new Set(['arguir', 'redarguir']);

/**
 * Explicit irregularity. Every field is optional; anything absent is generated.
 *
 *   presente      full six-person present indicative. The present conjuntivo
 *                 is built on its first person (faço → faça, tenho → tenha)
 *                 unless `presenteConj` says otherwise.
 *   presenteEu    an irregular first person only (peço, perco, valho); the
 *                 other five are regular, and the conjuntivo follows the
 *                 first person (peça, perca, valha).
 *   presenteConj  full present conjuntivo, for the verbs whose first person
 *                 does not end in -o (sou → seja) or does not carry over
 *                 (quero → queira).
 *   imperfeito    full pretérito imperfeito (ser, ter, vir, pôr)
 *   perfeito      full pretérito perfeito. Its third person plural, less
 *                 -ram, is the stem of the mais-que-perfeito and of the
 *                 imperfeito and futuro do conjuntivo (fizeram → fizera,
 *                 fizesse, fizer), so those are never listed.
 *   futuroStem    contracted stem of the futuro and condicional (dizer → dir-)
 *   participio / gerundio
 *   imperativo    { tu, vos } where they are not the present's (ser → sê, sede)
 *   defective     persons that do not exist (weather verbs)
 *
 * The personal infinitive has no field because it is never irregular: it is
 * built on the infinitive whatever the verb (fazer, fazeres; ser, seres).
 */
export const IRREGULARS = {
  ser: {
    presente: ['sou', 'és', 'é', 'somos', 'sois', 'são'],
    presenteConj: ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam'],
    imperfeito: ['era', 'eras', 'era', 'éramos', 'éreis', 'eram'],
    perfeito: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'],
    imperativo: { tu: 'sê', vos: 'sede' },
  },
  estar: {
    presente: ['estou', 'estás', 'está', 'estamos', 'estais', 'estão'],
    presenteConj: ['esteja', 'estejas', 'esteja', 'estejamos', 'estejais', 'estejam'],
    perfeito: ['estive', 'estiveste', 'esteve', 'estivemos', 'estivestes', 'estiveram'],
  },
  ter: {
    presente: ['tenho', 'tens', 'tem', 'temos', 'tendes', 'têm'],
    imperfeito: ['tinha', 'tinhas', 'tinha', 'tínhamos', 'tínheis', 'tinham'],
    perfeito: ['tive', 'tiveste', 'teve', 'tivemos', 'tivestes', 'tiveram'],
  },
  haver: {
    presente: ['hei', 'hás', 'há', 'havemos', 'haveis', 'hão'],
    presenteConj: ['haja', 'hajas', 'haja', 'hajamos', 'hajais', 'hajam'],
    perfeito: ['houve', 'houveste', 'houve', 'houvemos', 'houvestes', 'houveram'],
  },
  // ir borrows its perfeito from ser, and with it fora, fosse and for.
  ir: {
    presente: ['vou', 'vais', 'vai', 'vamos', 'ides', 'vão'],
    presenteConj: ['vá', 'vás', 'vá', 'vamos', 'vades', 'vão'],
    perfeito: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram'],
  },
  // tem and vem are singular, têm and vêm plural: the circumflex is the only
  // thing that tells them apart.
  vir: {
    presente: ['venho', 'vens', 'vem', 'vimos', 'vindes', 'vêm'],
    imperfeito: ['vinha', 'vinhas', 'vinha', 'vínhamos', 'vínheis', 'vinham'],
    perfeito: ['vim', 'vieste', 'veio', 'viemos', 'viestes', 'vieram'],
    participio: 'vindo',
  },
  ver: {
    presente: ['vejo', 'vês', 'vê', 'vemos', 'vedes', 'veem'],
    perfeito: ['vi', 'viste', 'viu', 'vimos', 'vistes', 'viram'],
    participio: 'visto',
  },
  dar: {
    presente: ['dou', 'dás', 'dá', 'damos', 'dais', 'dão'],
    presenteConj: ['dê', 'dês', 'dê', 'demos', 'deis', 'deem'],
    perfeito: ['dei', 'deste', 'deu', 'demos', 'destes', 'deram'],
  },
  dizer: {
    presente: ['digo', 'dizes', 'diz', 'dizemos', 'dizeis', 'dizem'],
    perfeito: ['disse', 'disseste', 'disse', 'dissemos', 'dissestes', 'disseram'],
    futuroStem: 'dir',
    participio: 'dito',
  },
  fazer: {
    presente: ['faço', 'fazes', 'faz', 'fazemos', 'fazeis', 'fazem'],
    perfeito: ['fiz', 'fizeste', 'fez', 'fizemos', 'fizestes', 'fizeram'],
    futuroStem: 'far',
    participio: 'feito',
  },
  trazer: {
    presente: ['trago', 'trazes', 'traz', 'trazemos', 'trazeis', 'trazem'],
    perfeito: ['trouxe', 'trouxeste', 'trouxe', 'trouxemos', 'trouxestes', 'trouxeram'],
    futuroStem: 'trar',
  },
  // pode is the present, pôde the perfeito: again only the accent differs.
  poder: {
    presenteEu: 'posso',
    perfeito: ['pude', 'pudeste', 'pôde', 'pudemos', 'pudestes', 'puderam'],
  },
  // The only verb of the "fourth conjugation", cut down from the old *poer*.
  // Its futuro is built on the infinitive without the circumflex: porei.
  'pôr': {
    presente: ['ponho', 'pões', 'põe', 'pomos', 'pondes', 'põem'],
    imperfeito: ['punha', 'punhas', 'punha', 'púnhamos', 'púnheis', 'punham'],
    perfeito: ['pus', 'puseste', 'pôs', 'pusemos', 'pusestes', 'puseram'],
    futuroStem: 'por',
    participio: 'posto',
    gerundio: 'pondo',
  },
  querer: {
    presente: ['quero', 'queres', 'quer', 'queremos', 'quereis', 'querem'],
    presenteConj: ['queira', 'queiras', 'queira', 'queiramos', 'queirais', 'queiram'],
    perfeito: ['quis', 'quiseste', 'quis', 'quisemos', 'quisestes', 'quiseram'],
  },
  saber: {
    presenteEu: 'sei',
    presenteConj: ['saiba', 'saibas', 'saiba', 'saibamos', 'saibais', 'saibam'],
    perfeito: ['soube', 'soubeste', 'soube', 'soubemos', 'soubestes', 'souberam'],
  },
  caber: {
    presenteEu: 'caibo',
    perfeito: ['coube', 'coubeste', 'coube', 'coubemos', 'coubestes', 'couberam'],
  },
  // crer, ler and rir are irregular in the present only: cri, li and ri are
  // what the regular endings give on the stems cr-, l- and r-.
  crer: { presente: ['creio', 'crês', 'crê', 'cremos', 'credes', 'creem'] },
  ler: { presente: ['leio', 'lês', 'lê', 'lemos', 'ledes', 'leem'] },
  rir: { presente: ['rio', 'ris', 'ri', 'rimos', 'rides', 'riem'] },
  valer: { presenteEu: 'valho' },
  perder: { presenteEu: 'perco' },
  pedir: { presenteEu: 'peço' },
  medir: { presenteEu: 'meço' },
  // Portugal also says oiço, oiça; ouço is the form the grammars list first.
  ouvir: { presenteEu: 'ouço' },
  // Not a derivative of querer, whatever it looks like: requeiro, and a
  // regular perfeito (requeri against quis).
  requerer: { presente: ['requeiro', 'requeres', 'requer', 'requeremos', 'requereis', 'requerem'] },
  // The same goes for prover and ver: the present follows ver, but the
  // perfeito and the participle are regular (provi, proveste; provido).
  prover: { presente: ['provejo', 'provês', 'provê', 'provemos', 'provedes', 'proveem'] },
  escrever: { participio: 'escrito' },
  inscrever: { participio: 'inscrito' },
  prescrever: { participio: 'prescrito' },
  transcrever: { participio: 'transcrito' },
  subscrever: { participio: 'subscrito' },
  abrir: { participio: 'aberto' },
  cobrir: { participio: 'coberto' },
  chover: { defective: ['eu', 'tu', 'nos', 'vos'] },
  nevar: { defective: ['eu', 'tu', 'nos', 'vos'] },
};

/**
 * Bases whose every look-alike is a real derivative, so the ending is enough:
 * whatever ends in -fazer is fazer with a prefix (refazer, desfazer,
 * satisfazer), and likewise -dizer, -pedir (impedir, despedir), -medir,
 * -valer (equivaler), -escrever (descrever, reescrever), -abrir and -cobrir.
 * Every verb in -por is pôr with a prefix too, but that one is recognised by
 * the engine, because the infinitive loses its circumflex on the way (propor).
 */
export const PREFIXABLE = ['fazer', 'dizer', 'pedir', 'medir', 'valer', 'escrever', 'abrir', 'cobrir'];

/**
 * Derivatives of the bases that are too short for their ending to mean
 * anything. *manter* is ter with a prefix, but *bater*, *meter* and
 * *prometer* are not; *intervir* is vir, *servir* is not; *prever* is ver,
 * *dever* and *viver* are not. The real derivatives are a small closed set,
 * the look-alikes are most of the dictionary, so the derivatives are named
 * and everything else is left alone.
 */
export const DERIVED = {
  manter: 'ter',
  conter: 'ter',
  obter: 'ter',
  deter: 'ter',
  reter: 'ter',
  entreter: 'ter',
  abster: 'ter',
  suster: 'ter',
  ater: 'ter',
  convir: 'vir',
  intervir: 'vir',
  provir: 'vir',
  advir: 'vir',
  sobrevir: 'vir',
  prever: 'ver',
  rever: 'ver',
  antever: 'ver',
  entrever: 'ver',
  reler: 'ler',
  descrer: 'crer',
  sorrir: 'rir',
};

/**
 * The short participle of the verbs that have two. The long, regular one is
 * the one a compound tense takes (*tinha aceitado*); the short one goes with
 * ser and estar (*foi aceite*, *está aceso*). The conjugator shows both.
 * Portugal says *aceite* where Brazil says *aceito*.
 *
 * The older grammars list more (secar → seco, juntar → junto, encher →
 * cheio …), but those short forms now live as adjectives and the current
 * dictionaries no longer give them as participles, so they are left out, as
 * are the ones only Brazil uses (romper → roto, incluir → incluso).
 */
export const SHORT_PARTICIPLES = {
  aceitar: 'aceite',
  entregar: 'entregue',
  ganhar: 'ganho',
  gastar: 'gasto',
  pagar: 'pago',
  matar: 'morto',
  morrer: 'morto',
  prender: 'preso',
  acender: 'aceso',
  eleger: 'eleito',
  salvar: 'salvo',
  imprimir: 'impresso',
  limpar: 'limpo',
  expulsar: 'expulso',
  soltar: 'solto',
  enxugar: 'enxuto',
  suspender: 'suspenso',
  extinguir: 'extinto',
  exprimir: 'expresso',
  expressar: 'expresso',
  fritar: 'frito',
  libertar: 'liberto',
  omitir: 'omisso',
  envolver: 'envolto',
  emergir: 'emerso',
  submergir: 'submerso',
};

/**
 * The three whose short participle has all but replaced the long one after
 * ter as well: *tenho ganho*, *tinha gasto*, *terei pago*.
 */
export const SHORT_WITH_TER = new Set(['ganhar', 'gastar', 'pagar']);

/** Search index: [infinitive, English gloss], most frequent first. */
export const COMMON_VERBS = [
  ['ser', 'to be'],
  ['estar', 'to be (state, place)'],
  ['ter', 'to have'],
  ['haver', 'to have (auxiliary), there to be'],
  ['ir', 'to go'],
  ['fazer', 'to do, to make'],
  ['poder', 'to be able to'],
  ['dizer', 'to say, to tell'],
  ['dar', 'to give'],
  ['ver', 'to see'],
  ['saber', 'to know (a fact)'],
  ['querer', 'to want'],
  ['ficar', 'to stay, to become'],
  ['dever', 'to have to, to owe'],
  ['vir', 'to come'],
  ['falar', 'to speak'],
  ['passar', 'to pass, to spend (time)'],
  ['chegar', 'to arrive'],
  ['pôr', 'to put'],
  ['deixar', 'to leave, to let'],
  ['achar', 'to think, to find'],
  ['encontrar', 'to find, to meet'],
  ['levar', 'to take, to carry'],
  ['começar', 'to begin'],
  ['pensar', 'to think'],
  ['parecer', 'to seem'],
  ['conhecer', 'to know (be familiar with)'],
  ['olhar', 'to look'],
  ['gostar', 'to like'],
  ['trabalhar', 'to work'],
  ['viver', 'to live'],
  ['precisar', 'to need'],
  ['sair', 'to go out, to leave'],
  ['chamar', 'to call'],
  ['voltar', 'to return'],
  ['tomar', 'to take'],
  ['trazer', 'to bring'],
  ['partir', 'to leave, to break'],
  ['comer', 'to eat'],
  ['sentir', 'to feel'],
  ['entrar', 'to enter'],
  ['tornar', 'to become, to make'],
  ['pedir', 'to ask for'],
  ['ouvir', 'to hear'],
  ['acabar', 'to finish'],
  ['esperar', 'to wait, to hope'],
  ['contar', 'to count, to tell'],
  ['seguir', 'to follow'],
  ['perder', 'to lose'],
  ['andar', 'to walk'],
  ['entender', 'to understand'],
  ['perceber', 'to understand, to notice'],
  ['perguntar', 'to ask'],
  ['continuar', 'to continue'],
  ['criar', 'to create, to raise'],
  ['abrir', 'to open'],
  ['escrever', 'to write'],
  ['usar', 'to use'],
  ['receber', 'to receive'],
  ['ler', 'to read'],
  ['morar', 'to live (reside)'],
  ['acontecer', 'to happen'],
  ['lembrar', 'to remember, to remind'],
  ['tentar', 'to try'],
  ['mostrar', 'to show'],
  ['comprar', 'to buy'],
  ['correr', 'to run'],
  ['conseguir', 'to manage to, to get'],
  ['cair', 'to fall'],
  ['acreditar', 'to believe'],
  ['crer', 'to believe'],
  ['morrer', 'to die'],
  ['ganhar', 'to win, to earn'],
  ['pagar', 'to pay'],
  ['jogar', 'to play (a game)'],
  ['tocar', 'to touch, to play (an instrument)'],
  ['beber', 'to drink'],
  ['dormir', 'to sleep'],
  ['aprender', 'to learn'],
  ['ajudar', 'to help'],
  ['estudar', 'to study'],
  ['responder', 'to answer'],
  ['mudar', 'to change, to move'],
  ['fechar', 'to close'],
  ['compreender', 'to understand'],
  ['vender', 'to sell'],
  ['mandar', 'to send, to order'],
  ['servir', 'to serve'],
  ['manter', 'to keep, to maintain'],
  ['apresentar', 'to present, to introduce'],
  ['existir', 'to exist'],
  ['considerar', 'to consider'],
  ['decidir', 'to decide'],
  ['nascer', 'to be born'],
  ['ocorrer', 'to occur'],
  ['permitir', 'to allow'],
  ['aparecer', 'to appear'],
  ['tirar', 'to take off, to take out'],
  ['colocar', 'to place'],
  ['esquecer', 'to forget'],
  ['terminar', 'to finish'],
  ['explicar', 'to explain'],
  ['procurar', 'to look for'],
  ['buscar', 'to fetch'],
  ['caminhar', 'to walk'],
  ['subir', 'to go up'],
  ['descer', 'to go down'],
  ['cantar', 'to sing'],
  ['dançar', 'to dance'],
  ['cozinhar', 'to cook'],
  ['lavar', 'to wash'],
  ['limpar', 'to clean'],
  ['viajar', 'to travel'],
  ['conduzir', 'to drive, to lead'],
  ['preferir', 'to prefer'],
  ['propor', 'to propose'],
  ['supor', 'to suppose'],
  ['compor', 'to compose'],
  ['dispor', 'to arrange, to have available'],
  ['expor', 'to expose, to exhibit'],
  ['impor', 'to impose'],
  ['opor', 'to oppose'],
  ['produzir', 'to produce'],
  ['traduzir', 'to translate'],
  ['reduzir', 'to reduce'],
  ['introduzir', 'to introduce, to insert'],
  ['construir', 'to build'],
  ['destruir', 'to destroy'],
  ['incluir', 'to include'],
  ['concluir', 'to conclude'],
  ['contribuir', 'to contribute'],
  ['distribuir', 'to distribute'],
  ['substituir', 'to replace'],
  ['atribuir', 'to attribute, to assign'],
  ['diminuir', 'to decrease'],
  ['possuir', 'to own'],
  ['amar', 'to love'],
  ['adorar', 'to adore, to love'],
  ['odiar', 'to hate'],
  ['desejar', 'to wish'],
  ['rir', 'to laugh'],
  ['sorrir', 'to smile'],
  ['chorar', 'to cry'],
  ['gritar', 'to shout'],
  ['conversar', 'to chat'],
  ['discutir', 'to discuss, to argue'],
  ['concordar', 'to agree'],
  ['aceitar', 'to accept'],
  ['recusar', 'to refuse'],
  ['negar', 'to deny'],
  ['oferecer', 'to offer'],
  ['agradecer', 'to thank'],
  ['desculpar', 'to excuse, to forgive'],
  ['perdoar', 'to forgive'],
  ['prometer', 'to promise'],
  ['convidar', 'to invite'],
  ['visitar', 'to visit'],
  ['telefonar', 'to phone'],
  ['ligar', 'to switch on, to call'],
  ['desligar', 'to switch off, to hang up'],
  ['enviar', 'to send'],
  ['entregar', 'to deliver, to hand over'],
  ['emprestar', 'to lend'],
  ['devolver', 'to give back'],
  ['guardar', 'to keep, to put away'],
  ['gastar', 'to spend'],
  ['poupar', 'to save'],
  ['custar', 'to cost'],
  ['valer', 'to be worth'],
  ['caber', 'to fit'],
  ['medir', 'to measure'],
  ['pesar', 'to weigh'],
  ['cortar', 'to cut'],
  ['partilhar', 'to share'],
  ['dividir', 'to divide'],
  ['juntar', 'to join, to gather'],
  ['reunir', 'to gather, to bring together'],
  ['unir', 'to unite'],
  ['separar', 'to separate'],
  ['escolher', 'to choose'],
  ['eleger', 'to elect'],
  ['resolver', 'to solve, to decide'],
  ['acordar', 'to wake up, to agree'],
  ['levantar', 'to raise, to lift'],
  ['sentar', 'to seat'],
  ['deitar', 'to lay down, to throw away'],
  ['vestir', 'to dress, to wear'],
  ['despir', 'to undress'],
  ['calçar', 'to put on (shoes)'],
  ['descansar', 'to rest'],
  ['almoçar', 'to have lunch'],
  ['jantar', 'to have dinner'],
  ['provar', 'to taste, to prove'],
  ['experimentar', 'to try out'],
  ['cheirar', 'to smell'],
  ['tossir', 'to cough'],
  ['doer', 'to hurt'],
  ['curar', 'to cure'],
  ['cuidar', 'to take care of'],
  ['tratar', 'to treat, to deal with'],
  ['proteger', 'to protect'],
  ['defender', 'to defend'],
  ['atacar', 'to attack'],
  ['agredir', 'to assault'],
  ['lutar', 'to fight'],
  ['vencer', 'to win, to defeat'],
  ['matar', 'to kill'],
  ['salvar', 'to save, to rescue'],
  ['fugir', 'to flee'],
  ['esconder', 'to hide'],
  ['prender', 'to arrest, to fasten'],
  ['soltar', 'to release'],
  ['roubar', 'to steal'],
  ['mentir', 'to lie'],
  ['enganar', 'to deceive'],
  ['confiar', 'to trust'],
  ['duvidar', 'to doubt'],
  ['recear', 'to fear'],
  ['temer', 'to fear'],
  ['sofrer', 'to suffer'],
  ['aguentar', 'to bear, to put up with'],
  ['sonhar', 'to dream'],
  ['imaginar', 'to imagine'],
  ['reconhecer', 'to recognise'],
  ['notar', 'to notice'],
  ['reparar', 'to notice, to repair'],
  ['observar', 'to observe'],
  ['assistir', 'to attend, to watch'],
  ['escutar', 'to listen'],
  ['repetir', 'to repeat'],
  ['corrigir', 'to correct'],
  ['ensinar', 'to teach'],
  ['treinar', 'to train'],
  ['praticar', 'to practise'],
  ['melhorar', 'to improve'],
  ['piorar', 'to get worse'],
  ['crescer', 'to grow'],
  ['aumentar', 'to increase'],
  ['desenvolver', 'to develop'],
  ['progredir', 'to progress'],
  ['avançar', 'to advance'],
  ['parar', 'to stop'],
  ['demorar', 'to take (time), to be long'],
  ['durar', 'to last'],
  ['faltar', 'to be missing, to be absent'],
  ['bastar', 'to be enough'],
  ['sobrar', 'to be left over'],
  ['importar', 'to matter, to import'],
  ['interessar', 'to interest'],
  ['preocupar', 'to worry'],
  ['incomodar', 'to bother'],
  ['agradar', 'to please'],
  ['apetecer', 'to feel like'],
  ['divertir', 'to amuse'],
  ['brincar', 'to play, to joke'],
  ['passear', 'to stroll, to go for a walk'],
  ['nadar', 'to swim'],
  ['saltar', 'to jump'],
  ['voar', 'to fly'],
  ['aterrar', 'to land'],
  ['apanhar', 'to catch, to pick up'],
  ['atirar', 'to throw'],
  ['empurrar', 'to push'],
  ['puxar', 'to pull'],
  ['carregar', 'to carry, to load, to press'],
  ['segurar', 'to hold'],
  ['pegar', 'to take hold of'],
  ['largar', 'to let go of'],
  ['mexer', 'to move, to stir'],
  ['mover', 'to move'],
  ['virar', 'to turn'],
  ['dirigir', 'to direct, to manage'],
  ['atravessar', 'to cross'],
  ['regressar', 'to return'],
  ['marcar', 'to mark, to book, to score'],
  ['reservar', 'to reserve'],
  ['alugar', 'to rent'],
  ['arrendar', 'to let, to rent (a home)'],
  ['arranjar', 'to fix, to get'],
  ['arrumar', 'to tidy up'],
  ['preparar', 'to prepare'],
  ['organizar', 'to organise'],
  ['planear', 'to plan'],
  ['realizar', 'to carry out'],
  ['cumprir', 'to fulfil'],
  ['obter', 'to obtain'],
  ['conter', 'to contain'],
  ['deter', 'to detain, to stop'],
  ['prever', 'to foresee'],
  ['rever', 'to review, to see again'],
  ['convir', 'to suit, to be advisable'],
  ['intervir', 'to intervene'],
  ['refazer', 'to redo'],
  ['desfazer', 'to undo'],
  ['satisfazer', 'to satisfy'],
  ['predizer', 'to predict'],
  ['contradizer', 'to contradict'],
  ['requerer', 'to require, to apply for'],
  ['exigir', 'to demand'],
  ['obrigar', 'to force'],
  ['proibir', 'to forbid'],
  ['impedir', 'to prevent'],
  ['evitar', 'to avoid'],
  ['despedir', 'to dismiss, to say goodbye'],
  ['cumprimentar', 'to greet'],
  ['saudar', 'to greet, to salute'],
  ['erguer', 'to raise, to erect'],
  ['distinguir', 'to distinguish'],
  ['sacudir', 'to shake'],
  ['cobrir', 'to cover'],
  ['descobrir', 'to discover'],
  ['acender', 'to light, to switch on'],
  ['apagar', 'to switch off, to erase'],
  ['imprimir', 'to print'],
  ['descrever', 'to describe'],
  ['desenhar', 'to draw'],
  ['pintar', 'to paint'],
  ['filmar', 'to film'],
  ['gravar', 'to record'],
  ['publicar', 'to publish'],
  ['anunciar', 'to announce'],
  ['informar', 'to inform'],
  ['avisar', 'to warn, to let know'],
  ['comunicar', 'to communicate'],
  ['significar', 'to mean'],
  ['indicar', 'to indicate'],
  ['referir', 'to mention'],
  ['sugerir', 'to suggest'],
  ['aconselhar', 'to advise'],
  ['recomendar', 'to recommend'],
  ['comparar', 'to compare'],
  ['calcular', 'to calculate'],
  ['somar', 'to add up'],
  ['acrescentar', 'to add'],
  ['encher', 'to fill'],
  ['esvaziar', 'to empty'],
  ['secar', 'to dry'],
  ['molhar', 'to wet'],
  ['queimar', 'to burn'],
  ['incendiar', 'to set fire to'],
  ['moer', 'to grind'],
  ['quebrar', 'to break'],
  ['estragar', 'to spoil, to damage'],
  ['consertar', 'to mend'],
  ['funcionar', 'to work, to function'],
  ['utilizar', 'to use'],
  ['aproveitar', 'to make the most of'],
  ['consumir', 'to consume'],
  ['investir', 'to invest'],
  ['depender', 'to depend'],
  ['pertencer', 'to belong'],
  ['merecer', 'to deserve'],
  ['representar', 'to represent'],
  ['participar', 'to take part'],
  ['competir', 'to compete'],
  ['celebrar', 'to celebrate'],
  ['festejar', 'to celebrate'],
  ['casar', 'to marry'],
  ['beijar', 'to kiss'],
  ['abraçar', 'to hug'],
  ['namorar', 'to date'],
  ['conviver', 'to socialise'],
  ['ansiar', 'to yearn'],
  ['mediar', 'to mediate'],
  ['remediar', 'to remedy'],
  ['refletir', 'to reflect'],
  ['adotar', 'to adopt'],
  ['atuar', 'to act, to perform'],
  ['agir', 'to act'],
  ['reagir', 'to react'],
  ['atingir', 'to reach, to hit'],
  ['alcançar', 'to reach'],
  ['surgir', 'to arise'],
  ['desaparecer', 'to disappear'],
  ['chover', 'to rain'],
  ['nevar', 'to snow'],
];
