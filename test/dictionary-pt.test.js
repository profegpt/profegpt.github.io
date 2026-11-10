/**
 * The Wikcionário's markup is read into the same shape as the Italian entry.
 * Fixtures are trimmed copies of real pages; nothing here touches the network.
 */
const { readPortugueseEntry, WIKCIONARIO_CREDIT } = await import('../server/dictionary-pt.js');

let checked = 0;
const failures = [];
function ok(name, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${name}${detail ? `\n    ${detail}` : ''}`);
}

const LEFTOVER = /\[\[|\]\]|\{\{|\}\}|''|<|>|&[a-z]+;|Imagem:|thumb/;
const everyText = (entry) => entry.entries.flatMap((item) => item.senses)
  .flatMap((sense) => [sense.description, sense.usage, ...sense.synonyms, ...sense.antonyms])
  .concat(entry.origin);
const categories = (entry) => entry.entries.map((item) => item.category).join(',');
const descriptions = (senses) => senses.map((sense) => sense.description).join(' | ');

// --- casa: a noun and a verb form, examples, a numbered synonym list --------
const CASA = `[[Imagem:Jehay - Ancienne maison.JPG|thumb|right|250px|{{centro|Casa<sup>1 e 2</sup>}}]]
{{confundir|CASA|caça|caza}}

={{-pt-}}=
==Substantivo==
{{flex.pt|fs=casa|fp=casas}}
{{paroxítona|ca|sa}}, {{gramática|f}}, {{datação|1221|pt}}
# [[construção]] que [[servir|serve]] de [[moradia]]
#* ''Sua '''casa''' é muito bonita!''
# [[domicílio]], [[residência]]
# [[quantidade]] de [[dígito]]s de um [[número]]
# quantificação graduativa métrica
#: '''2004''', Olgário Paulo Vogt, ''Abrindo o baú de memórias'', EDUNISC, página: 25
#*: ''A produção anual do produto fica na '''casa''' dos 25 milhões de quilos.''
# [[orifício]] por onde passa o [[botão]] da [[roupa]] ao ser abotoada
# [[família]] [[nobre]]
# lugar onde se comercializa produto específico

===Expressões===
* '''[[a casa caiu]]''': o erro foi descoberto; o que estava escondido foi revelado.
* '''[[casa de banho]]''': divisão da casa onde se faz a higiene pessoal

===Sinônimos===
De '''4''':
{{verTambém.Ini}}
* [[nível]]
{{verTambém.NovaColuna}}
* [[patamar]]
{{verTambém.Fim}}

===Tradução===
{{tradini|De 1 e 2 (local de moradia)}}
* {{trad|de|Haus|Wohnung}}
{{tradfim}}

==Forma verbal==
{{paroxítona|ca|sa}}
# terceira pessoa do singular do presente do indicativo do verbo [[casar]]
#* ''Quem '''casa''' quer casa.''

{{aviso.flexão|casar}}

=={{etimologia|pt}}==
{{etimo2|la|casa|pt}}, possivelmente de uma raiz indo-europeia "skad" que significava «abrigo, lugar protegido».

=={{pronúncia|pt}}==
===Portugal===
{{ouvir|pt-pt-casa.ogg}}

==Anagramas==
# [[acas]]
# [[saca]]

[[Categoria:Substantivo (Português)]]

={{-es-}}=
==Substantivo==
'''ca.sa''', {{gramática|f}}
# [[casa#Português|casa]]

={{-it-}}=
==Substantivo==
'''casa'''
# [[casa#Português|casa]]
`;

let entry = readPortugueseEntry(CASA, 'casa');
ok('casa has a noun and a verb', categories(entry) === 'noun,verb', categories(entry));
ok('the noun is feminine, from {{gramática|f}}', entry.entries[0].gender === 'feminine', entry.entries[0].gender);
let senses = entry.entries[0].senses;
ok('the # lines are senses; #*, #: and #*: are examples and citations', senses.length === 7, descriptions(senses));
ok('links are flattened and the plural -s kept', senses[2].description === 'quantidade de dígitos de um número', senses[2].description);
ok('a "De 4:" line sends the synonyms to sense 4',
  senses[3].synonyms.join(',') === 'nível,patamar' && senses[0].synonyms.length === 0, senses[3].synonyms.join(','));
ok('the verb form is kept, as the Italian parser keeps form-of entries',
  entry.entries[1].senses[0].description === 'terceira pessoa do singular do presente do indicativo do verbo casar',
  entry.entries[1].senses[0].description);
ok('numbering runs on across entries', entry.entries[1].senses[0].number === 8, String(entry.entries[1].senses[0].number));
ok('{{etimo2}} prints the language and its full stop lands before the comma',
  entry.origin === 'Do latim casa, possivelmente de uma raiz indo-europeia "skad" que significava «abrigo, lugar protegido».',
  entry.origin);
ok('the Spanish and Italian sections are not read', !senses.some((sense) => sense.description === 'casa'));
ok('the anagram list opens no entry', entry.entries.length === 2);
ok('no markup is left anywhere', !everyText(entry).some((text) => LEFTOVER.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));

// --- bonito: numbered headings, qualified lists, a Wikisaurus pointer -------
const BONITO = `={{-pt-}}=
==Adjetivo==
{{flex.pt|ms=bonito|mp=bonitos|fs=bonita|fp=bonitas}}
{{paroxítona|bo|ni|to}}
# [[possuidor]] de [[beleza]], [[agradável]] aos [[olho]]s
# conceitualmente agradável

===Antônimos===
{{dividir em colunas|3}}
* [[feio]]
* [[horrendo]]
{{dividir em colunas/fim}}

===Sinônimos===
* [[belo]]
* [[lindo]]

==Advérbio==
{{paroxítona|bo|ni|to}}, ''de intensidade''
# [[muito]]

===Sinônimos===
* Vide lista de sinônimos em ''[[Wikisaurus:muito]]''.

==Substantivo<sup>1</sup>==
{{paroxítona|bo|ni|to}}, {{gramática|m}}
# aquele que possui beleza

===Sinônimos===
De '''1''' (aquele que possui beleza):
{{dividir em colunas|2}}
* {{escopo2|Brasil, coloquial}}  [[avião]]
* {{escopo2|Portugal, coloquial}} [[bomba]]
{{dividir em colunas/fim}}

==Substantivo<sup>2</sup>==
{{paroxítona|bo|ni|to}}, {{gramática|m}}
# certo peixe da família do [[atum]]
# ação digna de nota, feito notável
#* ''Fazer '''bonito'''.''

===Antônimos===
De '''2''' (ação digna de nota):
* [[feio]]

[[Categoria:Adjetivo (Português)]]

={{-es-}}=
==Adjetivo==
# [[bonito#{{pt}}|bonito]]
`;

entry = readPortugueseEntry(BONITO, 'bonito');
ok('bonito has four entries, the two numbered nouns apart',
  categories(entry) === 'adjective,adverb,noun,noun', categories(entry));
ok('the adjective has no gender and the nouns are masculine',
  entry.entries[0].gender === '' && entry.entries[2].gender === 'masculine' && entry.entries[3].gender === 'masculine');
ok('lists under the adjective go to its first sense',
  entry.entries[0].senses[0].synonyms.join(',') === 'belo,lindo' && entry.entries[0].senses[0].antonyms.join(',') === 'feio,horrendo',
  entry.entries[0].senses[0].antonyms.join(','));
ok('a pointer to the Wikisaurus is not a synonym', entry.entries[1].senses[0].synonyms.length === 0,
  entry.entries[1].senses[0].synonyms.join(','));
ok('an {{escopo2}} qualifier before a synonym is dropped',
  entry.entries[2].senses[0].synonyms.join(',') === 'avião,bomba', entry.entries[2].senses[0].synonyms.join(','));
ok('"De 2" counts within the part of speech, so the antonym lands on the second fish sense',
  entry.entries[3].senses[1].antonyms.join(',') === 'feio' && entry.entries[3].senses[0].antonyms.length === 0,
  descriptions(entry.entries[3].senses));

// --- ser: several headword lines in one verb, {{cont}}, labels, aliases -----
const SER = `={{-pt-}}=
==Substantivo==
{{tônico|ser}}, {{gramática|m}}
# {{escopo|pt|Filosofia}} [[existir]], aquilo que supõe-se [[existir]]
# {{escopo|pt|Biologia}} [[todo]] [[ente]] [[vivo]] e/ou [[animado]]

==Verbo==
{{tônico|ser}}, ''predicativo'', {{datação|938|pt}}
# ter como [[característica]] ou [[propriedade]] de si mesmo
#* ''Ele '''é''' bonito.''
# [[ter]] ou [[estar]] em certa [[condição]]
# {{escopo|pt|pouco usado}} [[estar]]
{{tônico|ser}}, {{gramática|vi}}
# {{cont|4}} ter [[existência]]
# {{escopo2|sentido absoluto}} (sem [[especificação]] ou [[delimitação]] de [[tempo]], [[espaço]] ou [[circunstância]])
{{tônico|ser}}, {{gramática|vti}}
# {{cont|6}} ter por [[dono]]; [[pertencer]] (seguido da preposição ''[[de]]'')
# {{escopo|pt|informal}} [[despertar]] [[interesse]] em (seguido da preposição ''[[com]]'')

===Conjugação===
{{conj/pt||ser}}

===Sinônimos===
* De '''3''' (estar): [[existir]], [[haver]]

==Forma verbal==
{{tônico|ser}}
# primeira pessoa do singular do infinitivo pessoal do verbo [[ser]]

=={{etimologia|pt}}==
: Do verbo latino {{etimo|la|esse}} ("ser"), fundido com o verbo {{etimo|la|sedere}} ("[[sentar]]", "[[permanecer]]").
`;

entry = readPortugueseEntry(SER, 'ser');
ok('ser has a noun, a verb and a verb form', categories(entry) === 'noun,verb,verb', categories(entry));
ok('an {{escopo}} domain reads as a lower-case usage label', entry.entries[0].senses[0].usage === 'filosofia',
  entry.entries[0].senses[0].usage);
const verb = entry.entries[1].senses;
ok('seven verb senses across three headword lines', verb.length === 7, descriptions(verb));
ok("''predicativo'' in italics is the linking-verb kind, held until the next headword line",
  verb[0].verbCategory === 'copulative' && verb[2].verbCategory === 'copulative', verb[2].verbCategory);
ok('{{gramática|vi}} is intransitive and {{gramática|vti}} indirect transitive',
  verb[3].verbCategory === 'intransitive' && verb[5].verbCategory === 'indirect transitive',
  `${verb[3].verbCategory} / ${verb[5].verbCategory}`);
ok('{{cont|4}} is not part of the definition', verb[3].description === 'ter existência', verb[3].description);
ok('"pouco usado" is renamed as the wiki renames it', verb[2].usage === 'pouco comum', verb[2].usage);
ok('"De 3 (estar)" sends the synonyms to the third verb sense',
  verb[2].synonyms.join(',') === 'existir,haver' && verb[0].synonyms.length === 0, verb[2].synonyms.join(','));
ok('{{etimo}} prints only the word, the prose naming the language',
  entry.origin === 'Do verbo latino esse ("ser"), fundido com o verbo sedere ("sentar", "permanecer").', entry.origin);
ok('no markup is left in ser', !everyText(entry).some((text) => LEFTOVER.test(text)),
  everyText(entry).find((text) => LEFTOVER.test(text)));

// --- água: compound grammar codes, several labels, regional aliases --------
const AGUA = `[[Imagem:Water droplet.jpg|thumb|right|250px|{{centro|Gota d'água}}]]

={{-pt-}}=
==Substantivo==
{{flex.pt|fs=água|fp=águas}}
{{paroxítona|á|gua}}, {{gramática|fs|c|sim|prim}}
# [[substância]] ([[H2O|H<sub>2</sub>O]]) líquida e [[incolor]], essencial para a vida; [[óxido de hidrogênio]]
# {{escopo|pt|Natureza|Geografia}} a parte líquida que cobre aproximadamente 70 % da superfície terrestre
# {{escopo|pt|antigo|Veterinária}} o mesmo que [[água-comum]]
# {{escopo|pt|Brasil|figurado|informal}} tarefa que não apresenta dificuldade ou não exige esforço
#* ''O exame foi aquela '''água'''.''
# {{escopo|pt|Região Nordeste|informal}} [[aguardente]] de [[cana]]; [[cachaça]]
# {{escopo|pt|São Tomé e Príncipe}} [[rio]] ou [[ribeiro]]

==Forma verbal==
{{proparoxítona aparente|á|gu|a}}
# terceira pessoa do singular do presente do indicativo de [[aguar]]

{{aviso.flexão|aguar|id=pt}}

=={{etimologia|pt}}==
{{etimo2|la|aqua|pt|transcr=aqua, -ae}}. {{datação|973|pt}}. Vindo da raiz do [[protoindo-europeu]] *h₂ékʷeh₂ (água).
`;

entry = readPortugueseEntry(AGUA, 'água');
senses = entry.entries[0].senses;
ok('{{gramática|fs|c|sim|prim}} is feminine; the other codes are not genders', entry.entries[0].gender === 'feminine',
  entry.entries[0].gender);
ok('an HTML subscript is unwrapped', senses[0].description.startsWith('substância (H2O) líquida'), senses[0].description);
ok('several {{escopo}} labels are joined', senses[3].usage === 'Brasil, figurado, informal', senses[3].usage);
ok('labels are lowered unless they are names', senses[1].usage === 'natureza, geografia' && senses[2].usage === 'antigo, veterinária',
  `${senses[1].usage} / ${senses[2].usage}`);
ok('"Região Nordeste" is renamed, and a name with a capital inside it is kept',
  senses[4].usage === 'Nordeste do Brasil, informal' && senses[5].usage === 'São Tomé e Príncipe',
  `${senses[4].usage} / ${senses[5].usage}`);
ok('a named transcription is shown and {{datação}} is not',
  entry.origin === 'Do latim aqua (aqua, -ae). Vindo da raiz do protoindo-europeu *h₂ékʷeh₂ (água).', entry.origin);

// --- o: template headings, two headword lines under one pronoun ------------
const O = `={{-pt-}}=
=={{Artigo|pt}}==
{{flex.pt|ms=o|mp=os|fs=a|fp=as}}
{{átono|o}}, {{gramática|m|def}}
# [[partícula]] [[gramatical]] usada antes de [[substantivo]]s ou [[palavra]]s substantivadas

=={{Pronome|pt}}==
{{átono|o}}, {{gramática|m|dem}}
# [[pronome demonstrativo]] masculino/neutro
{{átono|o}}, {{gramática|m|pess}}
# [[pronome pessoal]] da [[terceira pessoa]] do [[singular]] do caso [[oblíquo]] objetivo direto

=={{Substantivo|pt}}==
'''o''', {{gramática|m}}
# {{escopo|pt|Medicina}} [[letra]] que [[representar|representa]] [[grupo]] [[sanguíneo]] que [[não]] [[possuir|possui]] [[aglutinógeno]]s
# {{escopo|pt|Química}} [[símbolo]] do [[oxigênio]]

=={{etimologia|pt}}==
{{etimo2|la|illu|pt|ponto=não}}, passando pelo português arcaico ''elo'' e ''lo''.
`;

entry = readPortugueseEntry(O, 'o');
ok('{{Artigo|pt}}, {{Pronome|pt}} and {{Substantivo|pt}} are headings like any other',
  categories(entry) === 'article,pronoun,noun', categories(entry));
ok('the article is masculine from {{gramática|m|def}}', entry.entries[0].gender === 'masculine');
ok('two headword lines under one heading give two senses in one entry', entry.entries[1].senses.length === 2);
ok('a bold headword with {{gramática|m}} after it is read', entry.entries[2].gender === 'masculine');
ok('ponto=não leaves the full stop out', entry.origin === 'Do latim illu, passando pelo português arcaico elo e lo.', entry.origin);

// --- fixe: {{c2g}}, a blank line after the heading, a Portugal label --------
const FIXE = `={{-pt-}}=
==Adjetivo==
{{flex.pt|s=fixe|p=fixe|p2=fixes}}
{{paroxítona|fi|xe}}, {{c2g}}
# {{escopo|pt|Portugal}} [[belo]], [[agradável]], [[bom]], muito bom, [[bonito]], [[confiável]], "com [[estilo]]"
#* ''Essa cena é bué '''fixe'''.''

===Sinônimos===
* [[bacana]]
* [[baril]]
* [[porreiro]]

===Antônimos===
* [[baranga]]
* [[barango]]

==Forma verbal==
{{paroxítona|fi|xe}}
# primeira pessoa do singular do presente do subjuntivo do verbo [[fixar]]
# terceira pessoa do singular do presente do subjuntivo do verbo [[fixar]]

{{aviso.flexão|fixar}}

=={{Etimologia|pt}}==

: Confronte-se com a palavra e locução do [[galego-português medieval]] ''[[fis#Galego-Português Medieval|fis]]'', e ''[[de fix#Galego-Português Medieval|de fix]]''.
`;

entry = readPortugueseEntry(FIXE, 'fixe');
ok('{{c2g}} is common to both genders', entry.entries[0].gender === 'masculine_and_feminine', entry.entries[0].gender);
ok('a country label keeps its capital', entry.entries[0].senses[0].usage === 'Portugal', entry.entries[0].senses[0].usage);
ok('quotes inside a definition survive', entry.entries[0].senses[0].description.endsWith('"com estilo"'),
  entry.entries[0].senses[0].description);
ok('synonyms and antonyms both attach', entry.entries[0].senses[0].synonyms.length === 3 && entry.entries[0].senses[0].antonyms.length === 2);
ok('a capitalised Etimologia heading and a blank line before the account are fine',
  entry.origin === 'Confronte-se com a palavra e locução do galego-português medieval fis, e de fix.', entry.origin);

// --- porque: numbered conjunctions, {{escopo|Morfologia}} in the etymology --
const PORQUE = `={{-pt-}}=
==Conjunção<sup>1</sup>==
{{paroxítona|por|que}} ''coordenativa'', ''explicativa'' {{datação|século XIII|pt}}
# [[pois]], [[porquanto]], [[que]]
#* ''Entre, '''porque''' já é tarde.''

==Conjunção<sup>2</sup>==
{{paroxítona|por|que}} ''subordinativa adverbial'', ''causal'' {{datação|século XIII|pt}}
# [[causa]], [[motivo]] ou [[razão]] da [[ação]] contida na [[oração]] [[principal]]; [[como]], visto que, já que

==Pronome==
{{paroxítona|por|que}}, {{gramática|int}}
# {{escopo|pt|Portugal}} introduz orações interrogativas; por que razão, por que motivo

=={{etimologia|pt}}==
: {{escopo|Morfologia}} [[por]] + [[que]].
`;

entry = readPortugueseEntry(PORQUE, 'porque');
ok('two numbered conjunction headings are two entries', categories(entry) === 'conjunction,conjunction,pronoun', categories(entry));
ok('italics that are not a gender or a verb kind set nothing',
  entry.entries[0].gender === '' && entry.entries[0].senses[0].verbCategory === '' && entry.entries[0].senses[0].usage === '');
ok('the old one-argument {{escopo|Morfologia}} is not a word of the etymology', entry.origin === 'por + que.', entry.origin);

// --- de: sub-senses, {{cont}}, references to them -------------------------
const DE = `={{-pt-}}=
==Preposição==
{{átono|de}}
# estabelece uma [[ligação]] entre [[dois|duas]] [[palavra]]s, podendo [[expressar]]
## [[origem]], [[procedência]]
##* ''Essas maçãs vieram '''d'''o Japão.''
## [[posição]]
## [[ponto]] ou [[estado]] [[inicial]]
# {{cont|2}} [[introduzir|introduz]] [[complemento verbal|complementos verbais]] e [[complemento nominal|nominais]]
# [[assumir|assume]] a [[função]] de [[partitivo]]

===Antônimos===
* De '''1.3''': [[a#Preposição|a]]

===Sinônimos===
* De '''1.2''': [[pela]]/[[pelo]]
* De '''3''': [[como]]
`;

entry = readPortugueseEntry(DE, 'de');
senses = entry.entries[0].senses;
ok('sub-senses on ## lines are senses of their own', senses.length === 6, descriptions(senses));
ok('"De 1.3" is the third sub-sense of the first sense', senses[3].antonyms.join(',') === 'a' && senses[3].description === 'ponto ou estado inicial',
  descriptions(senses));
ok('a slash separates a pair of synonyms', senses[2].synonyms.join(',') === 'pela,pelo', senses[2].synonyms.join(','));
ok('{{cont|2}} restarts the count, so "De 3" is the partitive sense', senses[5].synonyms.join(',') === 'como',
  descriptions(senses));

// --- Lisboa: {{gramática|pr}}, a {{PEPB}} heading, a Wikipedia link ---------
const LISBOA = `={{-pt-}}=
=={{Substantivo|pt}}==
{{paroxítona|Lis|bo|a}}, {{gramática|pr}}
# '''Cidade de Lisboa''': [[capital]] e cidade mais populosa de Portugal
# '''Grande Lisboa''': área envolvente de Lisboa a norte do rio [[w:Rio Tejo|Tejo]]

==={{PEPB|Sinónimos|Sinônimos|inline=1}}===
* {{escopo2|variante arcaica}} [[Lisbona]], [[Lixbona]], [[Lixboa]]
`;

entry = readPortugueseEntry(LISBOA, 'Lisboa');
ok('{{gramática|pr}} under Substantivo makes a proper noun', entry.entries[0].category === 'proper noun', entry.entries[0].category);
ok('a {{PEPB|Sinónimos|Sinônimos}} heading is the synonyms heading', entry.entries[0].senses[0].synonyms.join(',') === 'Lisbona,Lixbona,Lixboa',
  entry.entries[0].senses[0].synonyms.join(','));
ok('a Wikipedia link shows its text', entry.entries[0].senses[1].description.endsWith('a norte do rio Tejo'),
  entry.entries[0].senses[1].description);

// --- falar: verb kinds written out in italics ----------------------------
const FALAR = `={{-pt-}}=
==Verbo==
{{oxítona|fa|lar}}, ''intransitivo e transitivo direto''
# emitir [[som|sons]] com significado coerente segundo uma convenção linguística qualquer
# ter a capacidade de se expressar em um [[idioma]]:
#* ''Você '''fala''' alemão?''
# {{escopo|pt|Trás-os-Montes}} [[namorar]]

===Conjugação===
{{conj/pt|fal|ar}}

=={{etimologia|pt}}==
: {{etimo2|la|fabulari|pt}}
`;

entry = readPortugueseEntry(FALAR, 'falar');
senses = entry.entries[0].senses;
ok("''intransitivo e transitivo direto'' gives both kinds, in that order",
  senses[0].verbCategory === 'intransitive, transitive', senses[0].verbCategory);
ok('a trailing colon that introduced an example is dropped', senses[1].description === 'ter a capacidade de se expressar em um idioma',
  senses[1].description);
ok('a hyphenated place name keeps its capitals', senses[2].usage === 'Trás-os-Montes', senses[2].usage);
ok('{{etimo2}} alone on a ":" line is the whole account', entry.origin === 'Do latim fabulari.', entry.origin);

// --- fazer: {{étimo longo}} and the gramática verb codes ------------------
const FAZER = `={{-pt-}}=
==Verbo==
{{oxítona|fa|zer}}, {{gramática|vtd}}
# dar [[existência]] ou [[forma]] a
{{oxítona|fa|zer}}, {{gramática|impess}}
# {{cont|2}} transcorrer (período de tempo)
{{oxítona|fa|zer}}, {{gramática|pron|vti}}
# {{cont|3}} simular o comportar (regência verbal com preposição: ''de'')
{{oxítona|fa|zer}}, {{gramática|vtdi}}
# {{cont|4}} transformar (algo) em

=={{etimologia|pt}}==
{{étimo longo|id=pt|roa-opt|fazer|la|facere|itc-pro|*fakjō|ine-pro|*dʰeh₁-|tr4=pôr, impor, fazer}}
`;

entry = readPortugueseEntry(FAZER, 'fazer');
senses = entry.entries[0].senses;
ok('vtd, impess, pron+vti and vtdi each name their kinds',
  senses.map((sense) => sense.verbCategory).join(' / ') === 'transitive / impersonal / pronominal, indirect transitive / transitive, indirect transitive',
  senses.map((sense) => sense.verbCategory).join(' / '));
ok('{{étimo longo}} is a chain of languages and words',
  entry.origin === 'Do galego-português antigo fazer, do latim facere, do protoitálico *fakjō, do protoindo-europeu *dʰeh₁- (pôr, impor, fazer).',
  entry.origin);

// --- pôr: {{r}} and {{fl}} link templates in the etymology ----------------
entry = readPortugueseEntry(`={{-pt-}}=
==Substantivo==
{{tônico|pôr}}
# [[ocaso]]

==Verbo==
{{tônico|pôr}}, {{gramática|vtd}}
# fazer com que algo se [[estabelecer|estabeleça]] num [[lugar]]

=={{etimologia|pt}}==
{{etimo2|roa-gpm|poer|pt|ponto=não}}, da forma anterior ''{{r|roa-gpm|põer}}'', e este de ''{{r|roa-gpm|poner}}'' (“pôr”) vindo do {{etm|la|pt}} ''{{fl|la|pōnĕre}}'', infinitivo verbal de ''{{r|la|pono|pōnō}}'' (“pôr, posicionar”).
`, 'pôr');
ok('a noun with no mark has no gender', entry.entries[0].gender === '');
ok('linking templates print their word and {{etm}} its language',
  entry.origin === 'Do galego-português medieval poer, da forma anterior põer, e este de poner (“pôr”) vindo do latim pōnĕre, infinitivo verbal de pōnō (“pôr, posicionar”).',
  entry.origin);

// --- livro: an HTML entity and a citation template in an example ----------
entry = readPortugueseEntry(`={{-pt-}}=
==Substantivo==
{{paroxítona|li|vro}}, {{gramática|m}}
# objeto feito de várias [[folha]]s de [[papel]], contendo um [[texto]]
#* ''Com verba pública, '''livro''' técnico ainda é restrito.'' {{OESP|2008|abril|08}}
# obra literária, científica ou artística que compõe, em regra, um volume.
#* &ldquo;''Aquele que lê maus '''livros''' não leva vantagem''.&rdquo; &mdash; [[w:Mark_Twain|Mark Twain]]

=={{etimologia|pt}}==
{{etimo2|la|liber|pt|ponto=não}}, ''libri''.
`, 'livro');
ok('a full stop typed at the end of a definition is dropped',
  entry.entries[0].senses[1].description === 'obra literária, científica ou artística que compõe, em regra, um volume',
  entry.entries[0].senses[1].description);
ok('the etymology keeps the inflected form after the comma', entry.origin === 'Do latim liber, libri.', entry.origin);

// --- lisboa in lower case: the headword line is not the one just above # ---
entry = readPortugueseEntry(`={{-pt-}}=
{{confundir|Lisboa}}
==Substantivo==
{{paroxítona|lis|bo|a}} - {{gramática|fs}}
{{flex.pt|fs=lisboa|fs-div=lis.<u>bo</u>.a|fp=lisboas|fp-div=lis.<u>bo</u>.as}}
# {{escopo|pt|Alentejo|Agricultura}} [[variedade]] de [[alface]]

=={{etimologia|pt}}==
: do topônimo [[Lisboa]].
`, 'lisboa');
ok('the grammar is read even with the inflection table between it and the senses',
  entry.entries[0].gender === 'feminine' && entry.entries[0].category === 'noun', entry.entries[0].gender);
ok('a region on the list of places keeps its capital', entry.entries[0].senses[0].usage === 'Alentejo, agricultura',
  entry.entries[0].senses[0].usage);

// --- São Paulo: a name under Locução substantiva, synonyms joined by "e" ---
entry = readPortugueseEntry(`={{-pt-}}=
==Locução substantiva==
'''São Paulo''', {{gramática|pr}}
# {{escopo|pt|Estado do Brasil}} [[estado]] [[brasileiro]] localizado no [[sul]] da [[w:Região Sudeste do Brasil|Região Sudeste]]
# {{escopo|pt|Capital|município do estado de São Paulo}} [[Apêndice:Gentílicos e topónimos em português/Brasil/São Paulo|cidade]] de ''São Paulo''

===Sinônimos===
* De '''1''' (estado): [[Paulistânia]] e [[Estado Bandeirante]]
* De '''2''' (cidade): [[Pauliceia]], [[terra da garoa]] e [[Sampa]]
`, 'São Paulo');
ok('{{gramática|pr}} under Locução substantiva is a proper noun too', entry.entries[0].category === 'proper noun',
  entry.entries[0].category);
ok('a label with a capital inside it is kept whole', entry.entries[0].senses[0].usage === 'Estado do Brasil',
  entry.entries[0].senses[0].usage);
ok('"e" between the last two synonyms separates them',
  entry.entries[0].senses[1].synonyms.join(',') === 'Pauliceia,terra da garoa,Sampa', entry.entries[0].senses[1].synonyms.join(','));

// --- things seen on the live wiki that left debris -----------------------
entry = readPortugueseEntry(`={{-pt-}}=
==Adjetivo==
{{tônico|bom}}
# {{escopo|pt|Brasil|informal}} não bom<sup>1</sup>

==Substantivo==
{{paroxítona|tra|ba|lho}}, {{gramática|m}}
# {{escopo|pt|Física}} em acordo com a primeira lei da [[termodinâmica]] (<math> \\Delta U = Q - \\Tau </math>), uma das formas de se alterar a [[energia interna]] (<math>U</math>) de um sistema

==Pronome<sup>1</sup>==
{{átono|a}}, {{gramática|dem}}, {{datação|1101|pt}} 
''(Válido para masculino e para o feminino)''
# quando seguido da preposição ''[[de]]'', serve para designar pessoas ou coisas

==Preposição==
{{átono|com}} {{datação|1200|pt|f={{ll|con|roa-gpm}}}}
# {{ll|preposição}} que une dois {{ll|sintagma|pt|sintagmas}} em relações {{ll|semântica|pt|semânticas}} de
#* '''companhia''' ou '''associação''' correspondendo a «acompanhado por»

=={{etimologia|pt}}==
: Para a conjunção:
{{etimo2|la|si|pt}}
: Para o pronome:
{{etimo2|la|se|pt}}
`, 'bom');
ok('a superscript sense reference is dropped with its number', entry.entries[0].senses[0].description === 'não bom',
  entry.entries[0].senses[0].description);
ok('a formula is dropped whole', entry.entries[1].senses[0].description === 'em acordo com a primeira lei da termodinâmica, uma das formas de se alterar a energia interna de um sistema',
  entry.entries[1].senses[0].description);
ok('"(Válido para masculino e para o feminino)" in italics is both genders',
  entry.entries[2].gender === 'masculine_and_feminine', entry.entries[2].gender);
ok('{{ll}} prints the word, or the form it is given to show',
  entry.entries[3].senses[0].description === 'preposição que une dois sintagmas em relações semânticas de', entry.entries[3].senses[0].description);
ok('"Para a conjunção:" only announces the account on the next line', entry.origin === 'Do latim si.', entry.origin);

ok('a bare "sign" in {{etimo}} is nobody\'s gloss, and sign= is one',
  readPortugueseEntry(`={{-pt-}}=
==Substantivo==
{{paroxítona|ho|mem}}, {{gramática|m}}
# pessoa do sexo masculino

=={{etimologia|pt}}==
: Do [[português antigo]] {{etimo|roa-gpm|homen|sign=homem}}, do acusativo [[latim|latino]] {{etimo|la|hominem|homĭnem}} de {{etimo|la|hemo|hemō|sign}}.
`, 'homem').origin === 'Do português antigo homen “homem”, do acusativo latino hominem homĭnem de hemo hemō.');

// --- pages that should give nothing ----------------------------------------
ok('a page with no Portuguese section reads as null', readPortugueseEntry(`={{-it-}}=
==Substantivo==
{{paroxítona|vo|ce|id=it}}, {{gramática|f}}
# [[voz]]

=={{etimologia|it}}==
{{etimo2|la|vox|it}}
`, 'voce') === null);

ok('a Portuguese section that comes after another language is still found',
  readPortugueseEntry(`={{-mult-}}=
==Caractere romano==
'''e''' - ''minúscula''
# a [[quinto|quinta]] [[letra]] do [[alfabeto]] [[latino]]

={{-pt-}}=
==Conjunção==
{{átono|e}}
# [[conjunção]] [[coordenativo|coordenativa]] [[aditivo|aditiva]]

={{-es-}}=
==Conjunção==
# [[e#Português|e]]
`, 'e').entries.map((item) => item.senses[0].description).join('|') === 'conjunção coordenativa aditiva');

ok('a Portuguese section with only a letter has no entries', readPortugueseEntry(`={{-pt-}}=
==Letra==
'''a'''
# primeira letra do alfabeto
`, 'a').entries.length === 0);

ok('the credit names the Wikcionário under CC BY-SA',
  WIKCIONARIO_CREDIT.name === 'Wikcionário' && WIKCIONARIO_CREDIT.url === 'https://pt.wiktionary.org' && WIKCIONARIO_CREDIT.licence === 'CC BY-SA');

if (failures.length) {
  console.error(`\n✗ ${failures.length} of ${checked} Wikcionário checks failed:\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`✓ all ${checked} Wikcionário checks passed`);
