/**
 * Curated grammar explanations for the tutor, Portuguese side.
 *
 * The same contract as data/grammar.js, data/grammar-fr.js and
 * data/grammar-it.js: each topic carries the words that should summon it and a
 * short explanation in both languages, so the tutor can answer in whichever one
 * it was asked. Bodies are markdown.
 *
 * Hand-written rather than generated, for the same reason as the other sets:
 * everything the tutor says about Portuguese should be something a teacher
 * would actually sign off on. The Portuguese is European Portuguese, in the
 * spelling of the 1990 agreement, as the site's Spanish is Spain's. Where
 * Brazil does something else that a learner is bound to meet (você, estar
 * fazendo, the pronoun before the verb, tem for há), the note says so rather
 * than pretend the other norm does not exist.
 *
 * Keywords are matched against the question with its accents folded away, so
 * *você* and *voce* summon the same note, and so do *género* and *gênero*.
 * Single, very common words (a, o, de, em, por, para, se, que) are deliberately
 * not keywords on their own: they turn up in half of all Portuguese questions,
 * and a note offered on the strength of one of them would be offered to almost
 * everybody. They appear only inside phrases.
 *
 * The markdown renderer does not nest emphasis, so no bold sits inside an
 * italic or the other way round: an example is in italics as a whole, and a
 * heading in bold as a whole.
 */

export const TOPICS = [
  {
    id: 'ser-estar',
    keywords: ['ser e estar', 'ser ou estar', 'ser vs estar', 'ser versus estar', 'ser and estar', 'ser or estar',
      'diferença entre ser e estar', 'difference between ser and estar', 'quando usar ser e estar',
      'when to use ser and estar', 'ser', 'estar', 'estar com', 'to be'],
    title: { pt: 'Ser e estar', en: 'Ser vs. estar' },
    body: {
      en: `Both translate *to be*. The split is not really permanent against temporary: it is **what something is** against **the state it is in**.

| | ser | estar |
| --- | --- | --- |
| eu | sou | estou |
| tu | és | estás |
| ele / ela / você | é | está |
| nós | somos | estamos |
| eles / elas / vocês | são | estão |

**Ser** says what defines a person or a thing:
- identity, profession, nationality, origin: *Sou a Ana. Ela é médica. Somos portugueses. Este queijo é da Serra da Estrela.*
- characteristics: *O Pedro é alto e simpático. A casa é grande.*
- material and possession: *A mesa é de madeira. O livro é meu.*
- time, dates and prices: *São três horas. Hoje é sábado. Quanto é?*
- where an **event** takes place: *A festa é em casa da Rita.*
- where something that cannot move is: *Onde é a farmácia?* (*ficar* is just as common here: *Onde fica a farmácia?*)
- the passive: *O livro foi escrito em 1995.*

**Estar** says how or where someone or something is at the moment:
- states and moods: *Estou cansado. A sopa está fria. Estás contente?*
- where a person or a movable thing is: *O João está em casa. As chaves estão na mesa.*
- the weather: *Está frio. Está a chover.*
- an action in progress, with *a* + infinitive: *Estou a estudar.* (see *estar a fazer*)
- the result of a change: *A porta está aberta. O copo está partido.*

**The same adjective, two meanings:**

| with ser | with estar |
| --- | --- |
| *é bom*: he is a good person, it is good quality | *está bom*: it tastes good, or he is well again |
| *é mau*: he is nasty, it is poor quality | *está mau*: it is in a bad way |
| *é aborrecido*: he is boring | *está aborrecido*: he is bored or annoyed |
| *é vivo*: he is quick-witted | *está vivo*: he is alive |
| *é doente*: he has a long-term illness | *está doente*: he is ill at the moment |
| *é calado*: he is a quiet person | *está calado*: he is saying nothing right now |

Two that surprise English speakers:
- *Ele está morto.* Death is a state, so it takes *estar*, however permanent it is.
- *Sou casado* and *estou casado* are both said; *ser* is the usual one in Portugal.

**Where English says to be, Portuguese often says ter or estar com:** *Tenho fome. Tenho vinte anos. Estou com sono. Estou com frio.*

A quick test: if you can add *right now* or *today* without changing the sense, it is *estar*. *A Maria é bonita* describes her; *A Maria está bonita* says she looks lovely today.`,
      pt: `Os dois traduzem o inglês *to be*. A diferença não é bem entre o permanente e o temporário: é entre **aquilo que uma coisa é** e **o estado em que está**.

| | ser | estar |
| --- | --- | --- |
| eu | sou | estou |
| tu | és | estás |
| ele / ela / você | é | está |
| nós | somos | estamos |
| eles / elas / vocês | são | estão |

**Ser** diz o que define uma pessoa ou uma coisa:
- identidade, profissão, nacionalidade, origem: *Sou a Ana. Ela é médica. Somos portugueses. Este queijo é da Serra da Estrela.*
- características: *O Pedro é alto e simpático. A casa é grande.*
- matéria e posse: *A mesa é de madeira. O livro é meu.*
- horas, datas e preços: *São três horas. Hoje é sábado. Quanto é?*
- o lugar de um **acontecimento**: *A festa é em casa da Rita.*
- o lugar do que não muda de sítio: *Onde é a farmácia?* (aqui *ficar* é igualmente comum: *Onde fica a farmácia?*)
- a voz passiva: *O livro foi escrito em 1995.*

**Estar** diz como ou onde alguém ou alguma coisa se encontra neste momento:
- estados e disposições: *Estou cansado. A sopa está fria. Estás contente?*
- o lugar de uma pessoa ou de uma coisa que se pode mover: *O João está em casa. As chaves estão na mesa.*
- o tempo que faz: *Está frio. Está a chover.*
- uma ação em curso, com *a* + infinitivo: *Estou a estudar.* (vê *estar a fazer*)
- o resultado de uma mudança: *A porta está aberta. O copo está partido.*

**O mesmo adjetivo, dois sentidos:**

| com ser | com estar |
| --- | --- |
| *é bom*: é boa pessoa, é de boa qualidade | *está bom*: sabe bem, ou já está curado |
| *é mau*: é má pessoa, é de má qualidade | *está mau*: está em mau estado |
| *é aborrecido*: aborrece os outros | *está aborrecido*: está sem paciência ou chateado |
| *é vivo*: é esperto | *está vivo*: não morreu |
| *é doente*: tem uma doença prolongada | *está doente*: adoeceu agora |
| *é calado*: fala pouco, por feitio | *está calado*: neste momento não diz nada |

Dois casos que costumam surpreender:
- *Ele está morto.* A morte é um estado, por isso pede *estar*, por mais definitiva que seja.
- *Sou casado* e *estou casado* dizem-se os dois; em Portugal o mais habitual é *ser*.

**Onde o inglês usa to be, o português usa muitas vezes ter ou estar com:** *Tenho fome. Tenho vinte anos. Estou com sono. Estou com frio.*

Um teste rápido: se puderes acrescentar *agora* ou *hoje* sem mudar o sentido, é *estar*. *A Maria é bonita* descreve-a; *A Maria está bonita* diz que hoje está especialmente bem.`,
    },
  },

  {
    id: 'perfeito-imperfeito',
    keywords: ['pretérito perfeito', 'pretérito perfeito simples', 'pretérito imperfeito', 'imperfeito',
      'perfeito ou imperfeito', 'perfeito e imperfeito', 'perfeito vs imperfeito', 'pretérito perfeito e imperfeito',
      'diferença entre o perfeito e o imperfeito', 'falei ou falava', 'tempos do passado', 'passado', 'preterite',
      'imperfect', 'preterite vs imperfect', 'preterite and imperfect', 'past tense', 'which past tense'],
    title: { pt: 'Pretérito perfeito e imperfeito', en: 'Pretérito perfeito vs. imperfeito' },
    body: {
      en: `Portuguese has two simple past tenses. The choice between them is **what happened** against **what was going on**.

| | falar | comer | partir |
| --- | --- | --- | --- |
| **pretérito perfeito** | falei, falaste, falou, falámos, falaram | comi, comeste, comeu, comemos, comeram | parti, partiste, partiu, partimos, partiram |
| **pretérito imperfeito** | falava, falavas, falava, falávamos, falavam | comia, comias, comia, comíamos, comiam | partia, partias, partia, partíamos, partiam |

In Portugal *falámos* (we spoke) is written with an accent to tell it from *falamos* (we speak); Brazil writes *falamos* for both.

**Pretérito perfeito**: a completed event, something that moves the story on. It answers *and then what?*
- *Ontem vi um bom filme.* (Yesterday I saw a good film)
- *Vivi três anos em Coimbra.* (a closed stretch of time)
- It also covers the English *have done*: *Já almoçaste?* (Have you had lunch?) See *o pretérito perfeito composto* for why.

**Pretérito imperfeito**: the background: descriptions, habits, states, and actions in progress. It answers *what was it like?*
- *Estava frio e a rua estava vazia.* (description)
- *Quando era pequeno, ia à praia todos os verões.* (habit: I used to go)
- *Tinha dez anos. Eram oito horas.* (age and time in the past)

The classic pairing has one interrupting the other:
- *Eu estava a ler quando a Joana chegou.* (I was reading, the background, when Joana arrived, the event)

**Irregular forms.** The imperfeito has only four irregular verbs: *ser → era, ter → tinha, vir → vinha, pôr → punha*. The perfeito has many, and they are the commonest verbs in the language:
*ser* and *ir → fui, foste, foi, fomos, foram* (the two verbs share one perfeito), *ter → tive, teve*, *estar → estive, esteve*, *fazer → fiz, fez*, *dizer → disse*, *poder → pude, pôde*, *pôr → pus, pôs*, *querer → quis*, *saber → soube*, *trazer → trouxe*, *ver → vi, viu*, *vir → vim, veio*, *dar → dei, deu*, *haver → houve*.

**Some verbs shift meaning between the two:**
- *sabia* = I knew, *soube* = I found out
- *conhecia* = I knew (someone), *conheci* = I met
- *queria* = I wanted, *quis* = I tried to, I insisted
- *podia* = I was able to, *pude* = I managed to
- *tinha* = I had, *tive* = I got, I received

**Two more jobs for the imperfeito.** It is the polite way to ask for something: *Queria um café, por favor.* And in speech it often stands in for the conditional: *Eu ia contigo, mas não posso.* (I would go with you, but I can't)

The tense is a choice about how you are telling it, not a fact about the clock. The same afternoon can be *chovia* or *choveu*, depending on whether it is the scenery or the news.`,
      pt: `O português tem dois tempos simples do passado. A escolha entre eles é a diferença entre **o que aconteceu** e **o que estava a acontecer**.

| | falar | comer | partir |
| --- | --- | --- | --- |
| **pretérito perfeito** | falei, falaste, falou, falámos, falaram | comi, comeste, comeu, comemos, comeram | parti, partiste, partiu, partimos, partiram |
| **pretérito imperfeito** | falava, falavas, falava, falávamos, falavam | comia, comias, comia, comíamos, comiam | partia, partias, partia, partíamos, partiam |

Em Portugal escreve-se *falámos* (passado) com acento, para o distinguir de *falamos* (presente); no Brasil escreve-se *falamos* nos dois casos.

**Pretérito perfeito**: um facto concluído, que faz avançar a história. Responde a *e depois?*
- *Ontem vi um bom filme.*
- *Vivi três anos em Coimbra.* (um período fechado)
- É também o tempo que corresponde ao inglês *have done*: *Já almoçaste?* Vê *o pretérito perfeito composto*.

**Pretérito imperfeito**: o pano de fundo: descrições, hábitos, estados e ações em curso. Responde a *como era?*
- *Estava frio e a rua estava vazia.* (descrição)
- *Quando era pequeno, ia à praia todos os verões.* (hábito)
- *Tinha dez anos. Eram oito horas.* (idade e horas no passado)

O par clássico, em que um interrompe o outro:
- *Eu estava a ler quando a Joana chegou.*

**Formas irregulares.** O imperfeito só tem quatro verbos irregulares: *ser → era, ter → tinha, vir → vinha, pôr → punha*. O perfeito tem muitos, e são os verbos mais usados da língua:
*ser* e *ir → fui, foste, foi, fomos, foram* (os dois verbos têm o mesmo perfeito), *ter → tive, teve*, *estar → estive, esteve*, *fazer → fiz, fez*, *dizer → disse*, *poder → pude, pôde*, *pôr → pus, pôs*, *querer → quis*, *saber → soube*, *trazer → trouxe*, *ver → vi, viu*, *vir → vim, veio*, *dar → dei, deu*, *haver → houve*.

**Alguns verbos mudam de sentido de um tempo para o outro:**
- *sabia* (tinha esse conhecimento), *soube* (fiquei a saber)
- *conhecia* (já conhecia), *conheci* (vi pela primeira vez)
- *queria* (tinha vontade), *quis* (tentei, insisti)
- *podia* (tinha essa possibilidade), *pude* (consegui)
- *tinha* (possuía), *tive* (recebi, passei a ter)

**Mais dois usos do imperfeito.** É a forma delicada de pedir: *Queria um café, por favor.* E na fala substitui muitas vezes o condicional: *Eu ia contigo, mas não posso.*

O tempo é uma escolha sobre a maneira de contar, não um dado do relógio: a mesma tarde pode ser *chovia* ou *choveu*, conforme se descreve o cenário ou se dá a notícia.`,
    },
  },

  {
    id: 'conjuntivo',
    keywords: ['conjuntivo', 'o conjuntivo', 'subjuntivo', 'o subjuntivo', 'presente do conjuntivo',
      'presente do subjuntivo', 'modo conjuntivo', 'modo subjuntivo', 'imperfeito do conjuntivo',
      'imperfeito do subjuntivo', 'quando se usa o conjuntivo', 'quando usar o conjuntivo',
      'quando se usa o subjuntivo', 'subjunctive', 'the subjunctive', 'present subjunctive', 'imperfect subjunctive',
      'when do i use the subjunctive', 'when to use the subjunctive', 'espero que', 'quero que', 'talvez', 'oxalá',
      'embora'],
    title: { pt: 'O conjuntivo', en: 'The subjunctive (conjuntivo)' },
    body: {
      en: `Not a tense but a **mood**. The indicative states what is; the conjuntivo covers what is wanted, doubted, felt or still only possible. Portugal calls it the *conjuntivo* and Brazil the *subjuntivo*: two names for the same thing.

**Present.** Start from the *eu* form of the present, drop the *-o* and swap the vowel: -ar verbs take **-e**, -er and -ir verbs take **-a**.

| | falar | comer | partir |
| --- | --- | --- | --- |
| que eu | fale | coma | parta |
| que tu | fales | comas | partas |
| que ele / ela / você | fale | coma | parta |
| que nós | falemos | comamos | partamos |
| que eles / elas / vocês | falem | comam | partam |

Because it starts from the *eu* form, an irregular *eu* carries through: *tenho → tenha, faço → faça, digo → diga, posso → possa, vejo → veja, venho → venha, ponho → ponha, peço → peça, ouço → ouça, durmo → durma, trago → traga*.

Seven verbs do not follow that rule: *ser → seja, estar → esteja, ir → vá, dar → dê, saber → saiba, querer → queira, haver → haja*.

Spelling keeps the sound: *ficar → fique, chegar → chegue, começar → comece*.

**When.** In a clause introduced by **que**, after expressions of:
- **wish, will and request**: *Quero que venhas. Espero que estejas bem. Peço-te que me ajudes.*
- **emotion**: *Lamento que não possas vir. Tenho medo que chova.*
- **doubt and denial**: *Duvido que ele saiba. Não acho que seja verdade.*
- **impersonal judgements**: *É preciso que estudes. É possível que chova. Convém que chegues cedo.*

After certain words:
- **talvez**, when it comes before the verb: *Talvez chova amanhã.*
- **oxalá**: *Oxalá tenhas razão!*
- **embora, mesmo que, ainda que**: *Embora seja tarde, vou sair.*
- **para que, sem que, antes que, até que, caso, a não ser que**: *Fala mais alto para que todos ouçam. Caso precises, liga-me.*

In a relative clause about someone or something not yet identified: *Procuro alguém que fale alemão.* (anyone who does; compare *Conheço alguém que fala alemão*, a real person)

**Commands** borrow it: every negative command and every polite one. *Não fales! Fale mais devagar, por favor. Venham cá!*

**Not** after a statement of fact or opinion: *Acho que é verdade. Sei que ele vem.* Make them negative and the mood changes: *Não acho que seja verdade.*

**Same subject, no conjuntivo.** *Quero ir* (I want to go), but *Quero que vás* (I want you to go).

**The imperfeito do conjuntivo** takes over when the main verb is past or conditional. Take the *eles* form of the pretérito perfeito and change *-ram* to **-sse**: *falaram → falasse, comeram → comesse, foram → fosse, tiveram → tivesse, fizeram → fizesse*.
- *Quero que venhas.* → *Queria que viesses.*
- *É preciso que estudes.* → *Era preciso que estudasses.*

It is also the tense of *if I were*: see *o condicional e as frases com se*. And for *when* and *if* looking at the future, Portuguese has a tense of its own: see *o futuro do conjuntivo*.`,
      pt: `Não é um tempo, é um **modo**. O indicativo afirma o que é; o conjuntivo exprime o que se deseja, se duvida, se sente ou é apenas possível. Em Portugal chama-se *conjuntivo* e no Brasil *subjuntivo*: são dois nomes para a mesma coisa.

**Presente.** Parte-se da forma *eu* do presente do indicativo, tira-se o *-o* e troca-se a vogal: os verbos em -ar ficam com **-e**, os verbos em -er e -ir ficam com **-a**.

| | falar | comer | partir |
| --- | --- | --- | --- |
| que eu | fale | coma | parta |
| que tu | fales | comas | partas |
| que ele / ela / você | fale | coma | parta |
| que nós | falemos | comamos | partamos |
| que eles / elas / vocês | falem | comam | partam |

Como se parte da forma *eu*, as irregularidades dessa forma mantêm-se: *tenho → tenha, faço → faça, digo → diga, posso → possa, vejo → veja, venho → venha, ponho → ponha, peço → peça, ouço → ouça, durmo → durma, trago → traga*.

Sete verbos não seguem esta regra: *ser → seja, estar → esteja, ir → vá, dar → dê, saber → saiba, querer → queira, haver → haja*.

A ortografia conserva o som: *ficar → fique, chegar → chegue, começar → comece*.

**Quando se usa.** Numa oração introduzida por **que**, depois de expressões de:
- **desejo, vontade e pedido**: *Quero que venhas. Espero que estejas bem. Peço-te que me ajudes.*
- **sentimento**: *Lamento que não possas vir. Tenho medo que chova.*
- **dúvida e negação**: *Duvido que ele saiba. Não acho que seja verdade.*
- **juízo impessoal**: *É preciso que estudes. É possível que chova. Convém que chegues cedo.*

Depois de certas palavras:
- **talvez**, quando vem antes do verbo: *Talvez chova amanhã.*
- **oxalá**: *Oxalá tenhas razão!*
- **embora, mesmo que, ainda que**: *Embora seja tarde, vou sair.*
- **para que, sem que, antes que, até que, caso, a não ser que**: *Fala mais alto para que todos ouçam. Caso precises, liga-me.*

Numa oração relativa sobre alguém ou alguma coisa que ainda não se conhece: *Procuro alguém que fale alemão.* (seja quem for; compara com *Conheço alguém que fala alemão*, uma pessoa concreta)

**O imperativo** vai buscá-lo: todas as ordens negativas e todas as formas de cortesia. *Não fales! Fale mais devagar, por favor. Venham cá!*

**Não se usa** depois de uma afirmação ou de uma opinião: *Acho que é verdade. Sei que ele vem.* Na negativa o modo muda: *Não acho que seja verdade.*

**Mesmo sujeito, infinitivo.** *Quero ir*, mas *Quero que vás*.

**O imperfeito do conjuntivo** usa-se quando o verbo principal está no passado ou no condicional. Forma-se a partir da forma *eles* do pretérito perfeito, trocando *-ram* por **-sse**: *falaram → falasse, comeram → comesse, foram → fosse, tiveram → tivesse, fizeram → fizesse*.
- *Quero que venhas.* → *Queria que viesses.*
- *É preciso que estudes.* → *Era preciso que estudasses.*

É também o tempo de *se eu fosse*: vê *o condicional e as frases com se*. E para *quando* e *se* virados para o futuro, o português tem um tempo próprio: vê *o futuro do conjuntivo*.`,
    },
  },

  {
    id: 'futuro-conjuntivo',
    keywords: ['futuro do conjuntivo', 'o futuro do conjuntivo', 'futuro do subjuntivo', 'o futuro do subjuntivo',
      'futuro conjuntivo', 'future subjunctive', 'the future subjunctive', 'quando chegar', 'quando puder',
      'quando for', 'quando eu for', 'quando tiver', 'se puder', 'se quiser', 'se for', 'vir ou vier'],
    title: { pt: 'O futuro do conjuntivo', en: 'The future subjunctive' },
    body: {
      en: `A tense English, French and Italian do not have, and that Spanish has all but lost. Portuguese uses it every day, for a future event that is still open: *when you arrive*, *if I can*, *whoever wants*.

**Formation.** Take the *eles* form of the pretérito perfeito and drop **-am**: *falaram → falar, comeram → comer, fizeram → fizer, foram → for*. Then add the endings **-, -es, -, -mos, -em**.

| | falar | fazer | ser / ir |
| --- | --- | --- | --- |
| quando eu | falar | fizer | for |
| quando tu | falares | fizeres | fores |
| quando ele / ela / você | falar | fizer | for |
| quando nós | falarmos | fizermos | formos |
| quando eles / elas / vocês | falarem | fizerem | forem |

For a regular verb it looks exactly like the infinitive. Irregular verbs give it away, and they are the ones used most: *ter → tiver, estar → estiver, poder → puder, querer → quiser, saber → souber, dizer → disser, trazer → trouxer, pôr → puser, dar → der, haver → houver, vir → vier, ver → vir*.

The trap is in the last two: *quando eu vier* is from *vir* (when I come), and *quando eu vir* is from *ver* (when I see).

**When.** After these words, when they point to the future:
- **quando**: *Quando chegares, liga-me.* (When you arrive, call me. English uses the present here.)
- **se**: *Se puder, vou contigo. Se chover, ficamos em casa.*
- **assim que, logo que**: *Assim que souber, digo-te.*
- **enquanto**: *Enquanto estiveres cá, a casa é tua.*
- **sempre que**: *Sempre que precisares, diz.*
- **como, onde, quem, o que**: *Faz como quiseres. Senta-te onde quiseres. Quem quiser pode sair. Come o que te apetecer.*

**Future or habit?** The mood tells them apart:
- *Quando chego a casa, tiro os sapatos.* (whenever I get home: a habit, so the indicative)
- *Quando chegar a casa, tiro os sapatos.* (when I get home, later today: futuro do conjuntivo)

Never the ordinary future after *quando* or *se*: not *quando chegarei*, but *quando chegar*.

**Fixed formulas** pair it with the present conjuntivo: *seja o que for* (whatever it is), *haja o que houver* (whatever happens), *custe o que custar* (whatever it costs), *venha quem vier* (whoever comes), and *se Deus quiser* (God willing).

**The compound form** is *tiver* + participle, for something finished before another future event: *Quando tiveres acabado, avisa-me.*

For the other kinds of *se* sentence, see *o condicional e as frases com se*.`,
      pt: `Um tempo que o inglês, o francês e o italiano não têm, e que o espanhol quase perdeu. O português usa-o todos os dias, para um facto futuro que ainda está em aberto: *quando chegares*, *se eu puder*, *quem quiser*.

**Formação.** Parte-se da forma *eles* do pretérito perfeito e tira-se **-am**: *falaram → falar, comeram → comer, fizeram → fizer, foram → for*. Juntam-se depois as terminações **-, -es, -, -mos, -em**.

| | falar | fazer | ser / ir |
| --- | --- | --- | --- |
| quando eu | falar | fizer | for |
| quando tu | falares | fizeres | fores |
| quando ele / ela / você | falar | fizer | for |
| quando nós | falarmos | fizermos | formos |
| quando eles / elas / vocês | falarem | fizerem | forem |

Num verbo regular é igual ao infinitivo. Os verbos irregulares é que o denunciam, e são os mais usados: *ter → tiver, estar → estiver, poder → puder, querer → quiser, saber → souber, dizer → disser, trazer → trouxer, pôr → puser, dar → der, haver → houver, vir → vier, ver → vir*.

A armadilha está nos dois últimos: *quando eu vier* é do verbo *vir*, e *quando eu vir* é do verbo *ver*.

**Quando se usa.** Depois destas palavras, quando apontam para o futuro:
- **quando**: *Quando chegares, liga-me.*
- **se**: *Se puder, vou contigo. Se chover, ficamos em casa.*
- **assim que, logo que**: *Assim que souber, digo-te.*
- **enquanto**: *Enquanto estiveres cá, a casa é tua.*
- **sempre que**: *Sempre que precisares, diz.*
- **como, onde, quem, o que**: *Faz como quiseres. Senta-te onde quiseres. Quem quiser pode sair. Come o que te apetecer.*

**Futuro ou hábito?** O modo distingue-os:
- *Quando chego a casa, tiro os sapatos.* (sempre que chego: um hábito, por isso o indicativo)
- *Quando chegar a casa, tiro os sapatos.* (logo, quando lá chegar: futuro do conjuntivo)

Depois de *quando* e de *se* nunca se usa o futuro do indicativo: não *quando chegarei*, mas *quando chegar*.

**As fórmulas fixas** juntam-no ao presente do conjuntivo: *seja o que for, haja o que houver, custe o que custar, venha quem vier*, e ainda *se Deus quiser*.

**A forma composta** é *tiver* + particípio, para o que estará concluído antes de outro facto futuro: *Quando tiveres acabado, avisa-me.*

Para os outros tipos de frase com *se*, vê *o condicional e as frases com se*.`,
    },
  },

  {
    id: 'infinitivo-pessoal',
    keywords: ['infinitivo pessoal', 'o infinitivo pessoal', 'infinitivo flexionado', 'infinitivo conjugado',
      'infinitivo impessoal', 'infinitivo pessoal ou futuro do conjuntivo', 'personal infinitive',
      'the personal infinitive', 'inflected infinitive', 'conjugated infinitive', 'para fazermos',
      'para eles fazerem'],
    title: { pt: 'O infinitivo pessoal', en: 'The personal infinitive' },
    body: {
      en: `An infinitive with personal endings, so that it can have a subject of its own. Almost no other language has one, and Portuguese uses it constantly.

**Formation.** The infinitive plus **-, -es, -, -mos, -em**. There are no irregular forms at all.

| | falar | ser | ter |
| --- | --- | --- | --- |
| eu | falar | ser | ter |
| tu | falares | seres | teres |
| ele / ela / você | falar | ser | ter |
| nós | falarmos | sermos | termos |
| eles / elas / vocês | falarem | serem | terem |

**What it is for.** It says who does the action of the infinitive, without a clause with *que*:
- *Comprei bilhetes para irmos ao cinema.* (I bought tickets for us to go to the cinema)
- *É melhor saíres agora.* (You had better leave now)

**After a preposition**: *para, por, sem, até, antes de, depois de, apesar de, no caso de, ao*:
- *Não saias sem eles chegarem.* (Don't leave before they get here)
- *Depois de jantarmos, vemos um filme.* (After we have dinner, we'll watch a film)
- *Apesar de estares cansado, tens de vir.* (Tired as you are, you have to come)
- *Obrigado por teres vindo.* (Thank you for coming)
- *Ao chegarem, viram a porta aberta.* (On arriving, they saw the door open)

**After an impersonal expression**: *É importante dizeres a verdade. É pena não poderem vir. É preciso estudarmos mais.*

**Infinitive or conjuntivo?** Often both are possible, and the infinitive is the lighter one:
- *É preciso que estudes.* = *É preciso estudares.*
- *Fiz isto para que possam descansar.* = *Fiz isto para poderem descansar.*

**When the plain infinitive is enough.** Right after a verb with the same subject, there are no endings: *Queremos sair. Podemos entrar? Vamos comer.* After a preposition, with the same subject, both are heard: *Viemos para ajudar* or *Viemos para ajudarmos*.

**Not the futuro do conjuntivo.** For a regular verb the two look identical (*falarmos, falarem*); irregular verbs show the difference:
- after a **preposition**, the infinitive: *para fazermos, sem eles saberem, depois de termos*
- after **quando, se, assim que**, the futuro do conjuntivo: *quando fizermos, se eles souberem, assim que tivermos*`,
      pt: `Um infinitivo com terminações de pessoa, que assim pode ter um sujeito próprio. Quase nenhuma outra língua o tem, e o português usa-o a toda a hora.

**Formação.** O infinitivo mais **-, -es, -, -mos, -em**. Não há uma única forma irregular.

| | falar | ser | ter |
| --- | --- | --- | --- |
| eu | falar | ser | ter |
| tu | falares | seres | teres |
| ele / ela / você | falar | ser | ter |
| nós | falarmos | sermos | termos |
| eles / elas / vocês | falarem | serem | terem |

**Para que serve.** Diz quem pratica a ação do infinitivo, sem ser preciso uma oração com *que*:
- *Comprei bilhetes para irmos ao cinema.*
- *É melhor saíres agora.*

**Depois de preposição**: *para, por, sem, até, antes de, depois de, apesar de, no caso de, ao*:
- *Não saias sem eles chegarem.*
- *Depois de jantarmos, vemos um filme.*
- *Apesar de estares cansado, tens de vir.*
- *Obrigado por teres vindo.*
- *Ao chegarem, viram a porta aberta.*

**Depois de uma expressão impessoal**: *É importante dizeres a verdade. É pena não poderem vir. É preciso estudarmos mais.*

**Infinitivo ou conjuntivo?** Muitas vezes os dois são possíveis, e o infinitivo é o mais leve:
- *É preciso que estudes.* = *É preciso estudares.*
- *Fiz isto para que possam descansar.* = *Fiz isto para poderem descansar.*

**Quando basta o infinitivo simples.** Logo a seguir a um verbo com o mesmo sujeito, não há terminações: *Queremos sair. Podemos entrar? Vamos comer.* Depois de preposição, com o mesmo sujeito, ouvem-se as duas formas: *Viemos para ajudar* ou *Viemos para ajudarmos*.

**Não é o futuro do conjuntivo.** Num verbo regular os dois são iguais (*falarmos, falarem*); nos irregulares vê-se a diferença:
- depois de **preposição**, o infinitivo: *para fazermos, sem eles saberem, depois de termos*
- depois de **quando, se, assim que**, o futuro do conjuntivo: *quando fizermos, se eles souberem, assim que tivermos*`,
    },
  },

  {
    id: 'genero-plural',
    keywords: ['género', 'género dos nomes', 'masculino ou feminino', 'masculino e feminino', 'feminino',
      'formação do feminino', 'gender', 'gender of nouns', 'noun gender', 'masculine or feminine', 'masculine and feminine', 'plural', 'plurais',
      'plurals', 'formação do plural', 'como se forma o plural', 'singular e plural', 'plural de ão', 'plural em ão',
      'plural das palavras em ão', 'ão ões', 'ões ães ãos', 'plural of ão', 'pães ou pãos'],
    title: { pt: 'O género e o plural', en: 'Gender and plurals' },
    body: {
      en: `Every Portuguese noun is masculine or feminine, and articles and adjectives follow it. The ending is a good guide, not a guarantee.

**Guessing the gender.**
- **-o** is usually masculine: *o livro, o carro*. Exceptions: *a tribo*, and shortened words like *a foto, a moto*.
- **-a** is usually feminine: *a casa, a mesa*. Exceptions: *o dia, o mapa, o planeta, o sofá*, and words from Greek in -ma: *o problema, o sistema, o programa, o tema, o clima, o idioma*.
- **-ção, -são, -dade, -gem, -ice, -tude** are feminine: *a estação, a televisão, a cidade, a viagem, a velhice, a juventude*.
- **-e** and consonants can be either: *o leite, o dente, o mar, o papel*, but *a noite, a ponte, a flor, a cor, a luz*. Learn these with the article.
- **-ão** is masculine for concrete things (*o pão, o avião, o coração*), with one everyday exception: *a mão*.

If you know Spanish, watch the nouns that change sides: *a viagem, a árvore, a ponte, a cor, a dor*, but *o leite, o sal, o mel, o sangue, o nariz*.

**Making the feminine.**
- -o → -a: *o aluno, a aluna* and *bonito, bonita*
- consonant + a: *o professor, a professora* and *português, portuguesa*
- -ão → -ã, -oa or -ona: *o irmão, a irmã*, *o leão, a leoa*, *o solteirão, a solteirona*
- -eu → -eia: *europeu, europeia*
- no change in -e, -ista, -nte and most adjectives ending in a consonant: *o / a estudante, o / a dentista, o / a colega*, and *grande, fácil, feliz, simples*
- irregular: *bom, boa* and *mau, má*

**Plurals.**

| the singular ends in | plural | examples |
| --- | --- | --- |
| a vowel | + s | *casa → casas, livro → livros, pai → pais* |
| -r, -z, stressed -s | + es | *flor → flores, vez → vezes, mês → meses, país → países* |
| -m | -ns | *homem → homens, jardim → jardins, bom → bons* |
| -al, -el, -ol, -ul | -ais, -éis, -óis, -uis | *animal → animais, papel → papéis, lençol → lençóis, azul → azuis* |
| stressed -il | -is | *funil → funis, barril → barris* |
| unstressed -il | -eis | *fácil → fáceis, difícil → difíceis* |
| unstressed -s | no change | *o lápis → os lápis, o pires → os pires* |

**Words in -ão** have three plurals, and each word has to be learned with its own:
- **-ões**, the commonest, and the plural of every word in -ção and -são: *limão → limões, coração → corações, estação → estações, avião → aviões*
- **-ães**: *pão → pães, cão → cães, alemão → alemães, capitão → capitães*
- **-ãos**: *mão → mãos, irmão → irmãos, cidadão → cidadãos, órgão → órgãos*

Spanish gives the answer away: *limones → limões, panes → pães, manos → mãos*.

**The masculine plural covers a mixed group**: *os pais* (parents), *os avós* (grandparents), *os tios* (aunts and uncles), *os irmãos* (brothers and sisters).

A handful of words open their stressed *o* in the plural without changing the spelling: *o ovo, os ovos* and *o olho, os olhos* go from the vowel of *avô* to the vowel of *avó*.`,
      pt: `Todos os nomes portugueses são masculinos ou femininos, e os artigos e os adjetivos concordam com eles. A terminação é uma boa pista, não uma garantia.

**Adivinhar o género.**
- **-o** é quase sempre masculino: *o livro, o carro*. Exceções: *a tribo*, e as palavras abreviadas como *a foto, a moto*.
- **-a** é quase sempre feminino: *a casa, a mesa*. Exceções: *o dia, o mapa, o planeta, o sofá*, e as palavras de origem grega em -ma: *o problema, o sistema, o programa, o tema, o clima, o idioma*.
- **-ção, -são, -dade, -gem, -ice, -tude** são femininos: *a estação, a televisão, a cidade, a viagem, a velhice, a juventude*.
- **-e** e as consoantes podem ser uma coisa ou outra: *o leite, o dente, o mar, o papel*, mas *a noite, a ponte, a flor, a cor, a luz*. Aprendem-se com o artigo.
- **-ão** é masculino nas coisas concretas (*o pão, o avião, o coração*), com uma exceção de todos os dias: *a mão*.

Para quem sabe espanhol, atenção aos nomes que mudam de género: *a viagem, a árvore, a ponte, a cor, a dor*, mas *o leite, o sal, o mel, o sangue, o nariz*.

**Formar o feminino.**
- -o → -a: *o aluno, a aluna* e *bonito, bonita*
- consoante + a: *o professor, a professora* e *português, portuguesa*
- -ão → -ã, -oa ou -ona: *o irmão, a irmã*, *o leão, a leoa*, *o solteirão, a solteirona*
- -eu → -eia: *europeu, europeia*
- ficam iguais os nomes em -e, -ista, -nte e a maior parte dos adjetivos terminados em consoante: *o / a estudante, o / a dentista, o / a colega*, e *grande, fácil, feliz, simples*
- irregulares: *bom, boa* e *mau, má*

**O plural.**

| o singular termina em | plural | exemplos |
| --- | --- | --- |
| vogal | + s | *casa → casas, livro → livros, pai → pais* |
| -r, -z, -s tónico | + es | *flor → flores, vez → vezes, mês → meses, país → países* |
| -m | -ns | *homem → homens, jardim → jardins, bom → bons* |
| -al, -el, -ol, -ul | -ais, -éis, -óis, -uis | *animal → animais, papel → papéis, lençol → lençóis, azul → azuis* |
| -il tónico | -is | *funil → funis, barril → barris* |
| -il átono | -eis | *fácil → fáceis, difícil → difíceis* |
| -s átono | não muda | *o lápis → os lápis, o pires → os pires* |

**As palavras em -ão** têm três plurais, e cada palavra aprende-se com o seu:
- **-ões**, o mais frequente, e o de todas as palavras em -ção e -são: *limão → limões, coração → corações, estação → estações, avião → aviões*
- **-ães**: *pão → pães, cão → cães, alemão → alemães, capitão → capitães*
- **-ãos**: *mão → mãos, irmão → irmãos, cidadão → cidadãos, órgão → órgãos*

O espanhol dá a resposta: *limones → limões, panes → pães, manos → mãos*.

**O masculino plural serve para um grupo misto**: *os pais* (o pai e a mãe), *os avós*, *os tios*, *os irmãos*.

Algumas palavras abrem o *o* tónico no plural sem mudar a escrita: em *o ovo, os ovos* e *o olho, os olhos* passa-se da vogal de *avô* para a de *avó*.`,
    },
  },

  {
    id: 'artigos-contracoes',
    keywords: ['artigos', 'artigo', 'artigo definido', 'artigos definidos', 'artigo indefinido', 'artigos indefinidos',
      'o a os as', 'um uma uns umas', 'artigo antes do possessivo', 'artigo com possessivo', 'o meu ou meu',
      'possessivos', 'articles', 'definite article', 'indefinite article', 'article before possessive',
      'possessives', 'contrações', 'contração', 'contractions', 'contraction', 'do da dos das', 'no na nos nas', 'do da no na', 'do e da', 'no e na',
      'pelo pela', 'num numa', 'ao à', 'do na pelo', 'dele dela', 'de mais o', 'em mais o', 'preposições',
      'preposição', 'preposições e artigos', 'prepositions', 'preposition'],
    title: { pt: 'Os artigos e as contrações', en: 'Articles and contractions' },
    body: {
      en: `**The articles.**

| | masculine | feminine |
| --- | --- | --- |
| definite, singular | o | a |
| definite, plural | os | as |
| indefinite, singular | um | uma |
| indefinite, plural | uns | umas |

*Uns* and *umas* mean *some*, or *about* with a number: *uns amigos, umas vinte pessoas*.

**Where Portuguese has an article and English has none:**
- before a **possessive**: *o meu livro, a minha mãe, os nossos amigos*. This is the rule in Portugal; Brazil often drops it (*meu livro*). After *ser* it goes: *Este livro é meu.*
- before a **first name**, in informal speech in Portugal: *O Pedro já chegou? Falei com a Ana.* Not when you call the person: *Ana, anda cá!*
- before most **countries and regions**: *o Brasil, a França, os Estados Unidos, o Algarve*. But not *Portugal, Angola, Moçambique, Cabo Verde*, and not most cities: *Lisboa, Londres*, except *o Porto* and *o Rio de Janeiro*.
- in **general statements**: *A vida é bela. Os gatos dormem muito.*
- with **titles**: *o senhor Silva, a doutora Marta*.

**Contractions.** Four prepositions fuse with the article that follows, and the fusion is compulsory: *no carro*, never *em o carro*.

| | o | a | os | as |
| --- | --- | --- | --- | --- |
| **de** | do | da | dos | das |
| **em** | no | na | nos | nas |
| **a** | ao | à | aos | às |
| **por** | pelo | pela | pelos | pelas |

- *O livro do professor.* (the teacher's book)
- *Moro na Rua Augusta.* (I live in Rua Augusta)
- *Vou ao cinema e depois à praia.* (to the cinema, then to the beach)
- *Passámos pelo parque.* (we went through the park)

**À** is *a + a*, the preposition and the article fused into one. The grave accent marks the fusion, which is called *crase*: *Vou à escola. Às oito horas.*

**With um and uma**, *em* nearly always contracts and *de* may: *num, numa, nuns, numas* (*Moro numa casa pequena*), *dum, duma* (more often written *de um, de uma*).

**With other words** the same prepositions fuse too:
- demonstratives: *deste, desse, daquele, disto, disso* and *neste, nesse, naquele, nisto, nisso* and *àquele, àquela*
- *ele* and *ela*: *dele, dela, deles, delas* and *nele, nela*. This is how Portuguese says *his* and *her* without ambiguity: *o carro dele, a casa dela*.
- *aqui, aí, ali*: *daqui, daí, dali*. *Daqui a dez minutos* is *in ten minutes*.
- *outro* and *algum*, optionally: *noutro, doutro, nalgum*

**No article, no contraction.** *Em Portugal, de Lisboa, a Londres*, but *no Brasil, do Porto, à Madeira*.

**Com** never contracts with an article (*com o Pedro*), but it has forms of its own with pronouns: *comigo, contigo, consigo, connosco, convosco* (Brazil writes *conosco*).

**Para** contracts only in speech (*prò, prà*), never in writing.`,
      pt: `**Os artigos.**

| | masculino | feminino |
| --- | --- | --- |
| definido, singular | o | a |
| definido, plural | os | as |
| indefinido, singular | um | uma |
| indefinido, plural | uns | umas |

*Uns* e *umas* indicam uma quantidade vaga, ou aproximada antes de um número: *uns amigos, umas vinte pessoas*.

**Onde o português usa o artigo e o inglês não:**
- antes do **possessivo**: *o meu livro, a minha mãe, os nossos amigos*. Em Portugal é a regra; no Brasil omite-se muitas vezes (*meu livro*). Depois de *ser* não se usa: *Este livro é meu.*
- antes do **nome próprio**, na fala informal em Portugal: *O Pedro já chegou? Falei com a Ana.* Não quando se chama a pessoa: *Ana, anda cá!*
- antes da maior parte dos **países e regiões**: *o Brasil, a França, os Estados Unidos, o Algarve*. Mas não com *Portugal, Angola, Moçambique, Cabo Verde*, nem com a maioria das cidades: *Lisboa, Londres*, exceto *o Porto* e *o Rio de Janeiro*.
- nas **afirmações gerais**: *A vida é bela. Os gatos dormem muito.*
- com os **títulos**: *o senhor Silva, a doutora Marta*.

**As contrações.** Quatro preposições juntam-se ao artigo que as segue, e a contração é obrigatória: *no carro*, nunca *em o carro*.

| | o | a | os | as |
| --- | --- | --- | --- | --- |
| **de** | do | da | dos | das |
| **em** | no | na | nos | nas |
| **a** | ao | à | aos | às |
| **por** | pelo | pela | pelos | pelas |

- *O livro do professor.*
- *Moro na Rua Augusta.*
- *Vou ao cinema e depois à praia.*
- *Passámos pelo parque.*

**À** é *a + a*, a preposição e o artigo numa só palavra. O acento grave assinala essa contração, que se chama *crase*: *Vou à escola. Às oito horas.*

**Com um e uma**, *em* contrai-se quase sempre e *de* pode contrair-se: *num, numa, nuns, numas* (*Moro numa casa pequena*), *dum, duma* (na escrita é mais comum *de um, de uma*).

**Com outras palavras** as mesmas preposições também se contraem:
- os demonstrativos: *deste, desse, daquele, disto, disso* e *neste, nesse, naquele, nisto, nisso* e *àquele, àquela*
- *ele* e *ela*: *dele, dela, deles, delas* e *nele, nela*. É assim que o português indica o possuidor sem ambiguidade: *o carro dele, a casa dela*.
- *aqui, aí, ali*: *daqui, daí, dali*. *Daqui a dez minutos* quer dizer dez minutos depois de agora.
- *outro* e *algum*, facultativamente: *noutro, doutro, nalgum*

**Sem artigo não há contração.** *Em Portugal, de Lisboa, a Londres*, mas *no Brasil, do Porto, à Madeira*.

**Com** nunca se contrai com o artigo (*com o Pedro*), mas tem formas próprias com os pronomes: *comigo, contigo, consigo, connosco, convosco* (no Brasil escreve-se *conosco*).

**Para** só se contrai na fala (*prò, prà*), nunca na escrita.`,
    },
  },

  {
    id: 'por-para',
    keywords: ['por e para', 'por ou para', 'por vs para', 'por versus para', 'por and para', 'por or para',
      'para e por', 'para ou por', 'para vs por', 'diferença entre por e para', 'difference between por and para',
      'quando usar por e para', 'when to use por and para', 'por ti ou para ti', 'pelo ou para'],
    title: { pt: 'Por e para', en: 'Por vs. para' },
    body: {
      en: `**Para** looks ahead: to a destination, a purpose, a recipient, a deadline. **Por** looks at what lies behind or along the way: the cause, the route, the price, the agent.

**Para:**
- **destination**: *Vou para casa. O comboio para o Porto parte às dez.*
- **purpose**, in order to: *Estudo para aprender. Para que serve isto?*
- **recipient**: *Este presente é para ti.*
- **deadline**: *O trabalho é para sexta-feira.*
- **opinion**: *Para mim, é igual.*

*Ir para* suggests staying; *ir a* a shorter visit: *Vou a Lisboa amanhã* (and come back), *Vou para Lisboa* (to live there, or to stay a while).

**Por**, which contracts with the article into *pelo, pela, pelos, pelas*:
- **through, along, past**: *Passei pelo parque. Vamos pela autoestrada.*
- **cause**: *Obrigado pela ajuda. Fechado por motivo de obras. Por isso não fui.*
- **price and exchange**: *Comprei-o por dez euros. Troco este por aquele.*
- **agent of the passive**: *O livro foi escrito por Saramago.*
- **per**: *duas vezes por semana, cem quilómetros por hora*
- **means**: *por telefone, por escrito*
- **roughly where or when**: *por aqui, pela manhã, lá pelas oito*
- **for the sake of, in place of**: *Faço isto por ti.*

**The pair that shows the difference:**
- *Fiz isto por ti.* (I did it for your sake, because of you)
- *Fiz isto para ti.* (I made it to give to you)

And with *estar*:
- *Estou para sair.* (I am about to leave)
- *A cama está por fazer.* (The bed is still unmade)

**Fixed expressions** are worth learning whole:
- with *por*: *por favor, por exemplo, por acaso, por enquanto, por fim, pelo menos, pelos vistos, por volta de*
- with *para*: *para sempre, para já, para variar, para a semana* (next week, in Portugal)

**Thanks take por**: *Obrigado por tudo. Obrigada pelo convite.* A man says *obrigado*, a woman *obrigada*.`,
      pt: `**Para** olha para a frente: um destino, uma finalidade, um destinatário, um prazo. **Por** olha para trás ou para o caminho: a causa, o percurso, o preço, o agente.

**Para:**
- **destino**: *Vou para casa. O comboio para o Porto parte às dez.*
- **finalidade**: *Estudo para aprender. Para que serve isto?*
- **destinatário**: *Este presente é para ti.*
- **prazo**: *O trabalho é para sexta-feira.*
- **opinião**: *Para mim, é igual.*

*Ir para* sugere que se fica; *ir a*, uma visita mais curta: *Vou a Lisboa amanhã* (e volto), *Vou para Lisboa* (para lá viver, ou para ficar uns tempos).

**Por**, que se contrai com o artigo em *pelo, pela, pelos, pelas*:
- **lugar por onde se passa**: *Passei pelo parque. Vamos pela autoestrada.*
- **causa**: *Obrigado pela ajuda. Fechado por motivo de obras. Por isso não fui.*
- **preço e troca**: *Comprei-o por dez euros. Troco este por aquele.*
- **agente da passiva**: *O livro foi escrito por Saramago.*
- **distribuição**: *duas vezes por semana, cem quilómetros por hora*
- **meio**: *por telefone, por escrito*
- **lugar ou tempo aproximado**: *por aqui, pela manhã, lá pelas oito*
- **em favor de, em vez de**: *Faço isto por ti.*

**O par que mostra a diferença:**
- *Fiz isto por ti.* (por tua causa, para te ajudar)
- *Fiz isto para ti.* (para to dar)

E com *estar*:
- *Estou para sair.* (estou quase a sair)
- *A cama está por fazer.* (ainda não foi feita)

**As expressões fixas** aprendem-se inteiras:
- com *por*: *por favor, por exemplo, por acaso, por enquanto, por fim, pelo menos, pelos vistos, por volta de*
- com *para*: *para sempre, para já, para variar, para a semana* (na próxima semana, em Portugal)

**Agradece-se com por**: *Obrigado por tudo. Obrigada pelo convite.* Um homem diz *obrigado*, uma mulher diz *obrigada*.`,
    },
  },

  {
    id: 'tu-voce',
    keywords: ['tu e você', 'tu ou você', 'tu vs você', 'tu and você', 'tu or você', 'você', 'você em portugal',
      'vós', 'o senhor', 'a senhora', 'formas de tratamento', 'tratamento', 'tratar por tu', 'formal you',
      'informal you', 'formal', 'informal', 'formal ou informal', 'formal and informal', 'you in portuguese',
      'ways of saying you'],
    title: { pt: 'Tu e você', en: 'Tu vs. você: ways of saying "you"' },
    body: {
      en: `Portuguese has several ways of saying *you*, and Portugal and Brazil do not use them the same way.

| | Portugal | Brazil |
| --- | --- | --- |
| informal, one person | **tu** falas | **você** fala (*tu* in some regions) |
| polite, one person | **o senhor / a senhora** fala, or the verb alone: *fala* | **o senhor / a senhora** fala |
| more than one person | **vocês** falam | **vocês** falam |

**In Portugal:**
- **Tu**, with the second-person verb, for family, friends, children, classmates and young people among themselves: *Como estás? Queres um café?*
- **The third person without a pronoun** is the everyday polite form: *Como está? Quer um café?*
- **O senhor / a senhora**, or a title or a name with its article, for more distance or respect: *O senhor quer um café? A dona Rosa já almoçou? O Pedro quer vir connosco?* (said to Pedro himself)
- **Você** exists, but it is not the safe neutral word learners expect. It sits between *tu* and *o senhor*, and many people find it cold or even rude when it is said to them. Leaving the pronoun out avoids the problem.

**In Brazil:**
- **Você** is the ordinary informal *you* almost everywhere, with the third-person verb: *Você quer um café?*
- **Tu** is used in some regions, the South and parts of the North and Northeast among them, often with the third-person verb in speech (*tu quer*), which is not standard.
- **O senhor / a senhora** is the polite form, as in Portugal.

**The plural** is *vocês* in both countries, with the third-person plural verb: *Vocês querem vir?* The old plural *vós* (*vós falais*) survives in the north of Portugal, in prayers and in older books; a learner only needs to recognise it. Its other forms are still alive in Portugal, where they go with *vocês*: *Vi-vos ontem. Este é o vosso carro?*

**Everything else follows the verb:**

| | with tu | with the third person |
| --- | --- | --- |
| object | te | o / a, lhe |
| after a preposition | ti, contigo | si, consigo (Brazil: *você, com você*) |
| possessive | teu, tua | seu, sua |
| command | *Fala! Não fales!* | *Fale! Não fale!* |

- *Isto é para ti. Posso ir contigo?*
- *Isto é para si. Posso ir consigo?*

**Moving to tu** has a name: *tratar por tu*. *Podemos tratar-nos por tu?* When in doubt in Portugal, start with the third-person verb and no pronoun, and let the other person make the offer.`,
      pt: `O português tem várias maneiras de tratar a pessoa com quem se fala, e Portugal e o Brasil não as usam da mesma forma.

| | Portugal | Brasil |
| --- | --- | --- |
| informal, uma pessoa | **tu** falas | **você** fala (*tu* em algumas regiões) |
| de cortesia, uma pessoa | **o senhor / a senhora** fala, ou só o verbo: *fala* | **o senhor / a senhora** fala |
| várias pessoas | **vocês** falam | **vocês** falam |

**Em Portugal:**
- **Tu**, com o verbo na segunda pessoa, para a família, os amigos, as crianças, os colegas de turma e os jovens entre si: *Como estás? Queres um café?*
- **A terceira pessoa sem pronome** é a forma de cortesia do dia a dia: *Como está? Quer um café?*
- **O senhor / a senhora**, ou um título ou o nome com artigo, quando há mais distância ou respeito: *O senhor quer um café? A dona Rosa já almoçou? O Pedro quer vir connosco?* (dito ao próprio Pedro)
- **Você** existe, mas não é a palavra neutra e segura que os estrangeiros esperam. Fica entre o *tu* e *o senhor*, e muita gente acha-o frio, ou até malcriado, quando lho dizem. Omitir o pronome resolve o problema.

**No Brasil:**
- **Você** é o tratamento informal corrente em quase todo o país, com o verbo na terceira pessoa: *Você quer um café?*
- **Tu** usa-se em algumas regiões, como o Sul e partes do Norte e do Nordeste, muitas vezes com o verbo na terceira pessoa na fala (*tu quer*), o que não é a norma.
- **O senhor / a senhora** é a forma de cortesia, como em Portugal.

**O plural** é *vocês* nos dois países, com o verbo na terceira pessoa do plural: *Vocês querem vir?* O antigo plural *vós* (*vós falais*) sobrevive no norte de Portugal, nas orações e nos livros antigos; a quem aprende basta reconhecê-lo. As outras formas dessa pessoa continuam vivas em Portugal, onde acompanham *vocês*: *Vi-vos ontem. Este é o vosso carro?*

**Tudo o resto acompanha o verbo:**

| | com tu | com a terceira pessoa |
| --- | --- | --- |
| complemento | te | o / a, lhe |
| depois de preposição | ti, contigo | si, consigo (no Brasil: *você, com você*) |
| possessivo | teu, tua | seu, sua |
| imperativo | *Fala! Não fales!* | *Fale! Não fale!* |

- *Isto é para ti. Posso ir contigo?*
- *Isto é para si. Posso ir consigo?*

**Passar ao tu** tem nome: *tratar por tu*. *Podemos tratar-nos por tu?* Em Portugal, na dúvida, começa-se pelo verbo na terceira pessoa, sem pronome, e deixa-se que seja a outra pessoa a propor o *tu*.`,
    },
  },

  {
    id: 'pronomes',
    keywords: ['pronomes', 'os pronomes', 'pronome', 'pronomes pessoais', 'pronomes átonos', 'pronomes clíticos',
      'clíticos', 'pronomes de complemento', 'pronomes oblíquos', 'complemento direto', 'complemento indireto',
      'colocação dos pronomes', 'colocação pronominal', 'posição dos pronomes', 'ênclise', 'próclise', 'mesóclise',
      'object pronouns', 'object pronoun', 'direct object', 'indirect object', 'pronoun placement',
      'pronoun position', 'where do pronouns go', 'clitic', 'clitics', 'lo la los las', 'lhe', 'lhes', 'mo to lho',
      'comigo contigo', 'vejo-o', 'dá-me'],
    title: { pt: 'Os pronomes átonos e a sua colocação', en: 'Object pronouns and where they go' },
    body: {
      en: `The pronouns themselves are simple. Where they go is the part that takes practice, and it is the biggest difference between Portugal and Brazil.

| | direct | indirect |
| --- | --- | --- |
| eu | me | me |
| tu | te | te |
| ele, você | o | lhe |
| ela, você | a | lhe |
| nós | nos | nos |
| vocês | vos | vos |
| eles | os | lhes |
| elas | as | lhes |

- *Vejo o Pedro.* → *Vejo-o.* (I see him)
- *Telefono à Ana.* → *Telefono-lhe.* (I phone her)

**In Portugal the pronoun goes after the verb**, joined by a hyphen (this is called *ênclise*): *Vejo-o todos os dias. Ela deu-me um livro. Chamo-me Ana.*

**It moves in front of the verb** (*próclise*) when one of these comes before it:
- a negative: *Não o vejo. Nunca me disse nada. Ninguém te viu.*
- a question word: *Quem te disse isso? Onde o puseste?*
- *que* or another conjunction: *Acho que me viu. Quando te vi, sorri. Se o vires, diz-lhe.*
- certain adverbs, among them *já, ainda, também, só, sempre, talvez, bem, mal*: *Já o li. Também me parece. Só te peço isto.*
- *todos, tudo, alguém, ambos*: *Todos me conhecem. Alguém lhe contou.*

**With an infinitive**, the pronoun attaches to it, or goes before the first verb if something pulls it there: *Quero vê-lo. Não o quero ver.*

**O, a, os, as change shape after certain endings:**
- after **-r, -s, -z**, the consonant drops and the pronoun becomes **-lo, -la, -los, -las**: *comprar + o → comprá-lo, comer + a → comê-la, abrir + os → abri-los, faz + o → fá-lo, fazemos + o → fazemo-lo*
- after a **nasal ending** (-m, -ão, -õe) it becomes **-no, -na, -nos, -nas**: *viram + o → viram-no, dão + as → dão-nas, põe + o → põe-no*

**Two pronouns fuse**, the indirect one first: *me + o → mo, te + o → to, lhe + o → lho*, and likewise *ma, ta, lha, mos, tos, lhos*. *Deu-mo ontem. Já to disse. Entreguei-lho.* These are everyday forms in Portugal and almost unknown in Brazil.

**Inside the verb** (*mesóclise*). In the future and the conditional, a pronoun that would go after the verb goes in the middle of it instead, between the infinitive and the ending: *dar-lhe-ei, dir-se-ia, vê-lo-emos*. This is formal, written Portuguese. Speech goes around it: *Vou dar-lhe* instead of *dar-lhe-ei*. What is never right is *darei-lhe*.

**In Brazil** the pronoun normally goes **before** the verb in speech: *Me chamo Ana. Ele me deu um livro. Eu te vejo amanhã.* Spoken Brazilian Portuguese also uses *ele* and *ela* as objects (*Eu vi ele*), which is not written standard.

**After a preposition** the forms are different: *para mim, de ti, sem ele, por nós*. With *com*: *comigo, contigo, consigo, connosco, convosco*.`,
      pt: `Os pronomes em si são simples. O difícil é saber onde se põem, e é essa a maior diferença entre Portugal e o Brasil.

| | diretos | indiretos |
| --- | --- | --- |
| eu | me | me |
| tu | te | te |
| ele, você | o | lhe |
| ela, você | a | lhe |
| nós | nos | nos |
| vocês | vos | vos |
| eles | os | lhes |
| elas | as | lhes |

- *Vejo o Pedro.* → *Vejo-o.*
- *Telefono à Ana.* → *Telefono-lhe.*

**Em Portugal o pronome vai depois do verbo**, ligado por hífen (é a *ênclise*): *Vejo-o todos os dias. Ela deu-me um livro. Chamo-me Ana.*

**Passa para antes do verbo** (*próclise*) quando antes dele vem:
- uma negação: *Não o vejo. Nunca me disse nada. Ninguém te viu.*
- uma palavra interrogativa: *Quem te disse isso? Onde o puseste?*
- *que* ou outra conjunção: *Acho que me viu. Quando te vi, sorri. Se o vires, diz-lhe.*
- certos advérbios, como *já, ainda, também, só, sempre, talvez, bem, mal*: *Já o li. Também me parece. Só te peço isto.*
- *todos, tudo, alguém, ambos*: *Todos me conhecem. Alguém lhe contou.*

**Com um infinitivo**, o pronome liga-se a ele, ou vai para antes do primeiro verbo se alguma coisa o atrair: *Quero vê-lo. Não o quero ver.*

**O, a, os, as mudam de forma depois de certas terminações:**
- depois de **-r, -s, -z**, a consoante cai e o pronome passa a **-lo, -la, -los, -las**: *comprar + o → comprá-lo, comer + a → comê-la, abrir + os → abri-los, faz + o → fá-lo, fazemos + o → fazemo-lo*
- depois de **terminação nasal** (-m, -ão, -õe) passa a **-no, -na, -nos, -nas**: *viram + o → viram-no, dão + as → dão-nas, põe + o → põe-no*

**Dois pronomes contraem-se**, primeiro o indireto: *me + o → mo, te + o → to, lhe + o → lho*, e do mesmo modo *ma, ta, lha, mos, tos, lhos*. *Deu-mo ontem. Já to disse. Entreguei-lho.* São formas correntes em Portugal e quase desconhecidas no Brasil.

**Dentro do verbo** (*mesóclise*). No futuro e no condicional, o pronome que iria para depois do verbo mete-se no meio dele, entre o infinitivo e a terminação: *dar-lhe-ei, dir-se-ia, vê-lo-emos*. É português formal, da escrita. A fala contorna-o: *Vou dar-lhe* em vez de *dar-lhe-ei*. O que nunca está certo é *darei-lhe*.

**No Brasil** o pronome vai normalmente **antes** do verbo na fala: *Me chamo Ana. Ele me deu um livro. Eu te vejo amanhã.* O português falado no Brasil usa também *ele* e *ela* como complemento (*Eu vi ele*), o que não pertence à norma escrita.

**Depois de preposição** as formas são outras: *para mim, de ti, sem ele, por nós*. Com *com*: *comigo, contigo, consigo, connosco, convosco*.`,
    },
  },

  {
    id: 'estar-a-fazer',
    keywords: ['estar a fazer', 'estar fazendo', 'estar a fazer ou estar fazendo', 'estar a fazer vs estar fazendo',
      'estou a fazer', 'estou fazendo', 'estar a mais infinitivo', 'estar a + infinitivo', 'a fazer ou fazendo',
      'andar a fazer', 'gerúndio', 'gerund', 'progressivo', 'forma progressiva', 'progressive',
      'present progressive', 'present continuous', 'continuous', 'presente contínuo', 'ing'],
    title: { pt: 'Estar a fazer e estar fazendo', en: 'Estar a fazer vs. estar fazendo' },
    body: {
      en: `To say that something is happening right now, Portuguese uses *estar*, and what follows it depends on the country.

| | Portugal | Brazil |
| --- | --- | --- |
| I am working | estou a trabalhar | estou trabalhando |
| It is raining | está a chover | está chovendo |
| I was sleeping | estava a dormir | estava dormindo |
| What are you doing? | O que estás a fazer? | O que você está fazendo? |

**Portugal: estar a + infinitive.** *Estou a ler. Estávamos a jantar quando ligaste.*

**Brazil: estar + gerúndio.** *Estou lendo. Estávamos jantando quando você ligou.*

Both are correct Portuguese. The gerund form is also the traditional one in the south of Portugal (the Alentejo and the Algarve) and in the islands, so you will hear it there too.

**The gerund** is formed without exceptions: -ar → **-ando**, -er → **-endo**, -ir → **-indo**. *Falando, comendo, partindo*, and *pôr → pondo*.

**As in English**, the simple present is for habits and the progressive for what is going on now: *Leio muito* (I read a lot), *Estou a ler* (I am reading). Portuguese even uses it with verbs English keeps simple: *Estou a gostar do livro. Estás a perceber?* (I'm enjoying the book. Do you see?)

**Not for plans.** English *I'm leaving tomorrow* is *Parto amanhã* or *Vou partir amanhã*, not *estou a partir amanhã*.

**Object pronouns** attach to the infinitive: *Estou a vê-lo. Ela está a vestir-se.*

**Other verbs build the same way:**
- **andar a** + infinitive, for something going on lately: *Ando a ler um livro ótimo.* (I've been reading a great book)
- **continuar a** + infinitive: *Continua a chover.* (It's still raining)
- **ficar a** + infinitive: *Fiquei a ver televisão.* (I stayed watching television)
- **acabar de** + infinitive, for what has just happened: *Acabei de chegar.* (I've just arrived)

**The gerund in Portugal** still has its uses. With *ir* it shows something done gradually: *Vai andando, que eu já vou.* (You go on ahead, I'm coming.) And in writing it means *by doing* or *while doing*: *Aprende-se praticando.* (You learn by practising)`,
      pt: `Para dizer que uma coisa está a acontecer neste momento, o português usa *estar*, e o que vem a seguir depende do país.

| | Portugal | Brasil |
| --- | --- | --- |
| trabalhar | estou a trabalhar | estou trabalhando |
| chover | está a chover | está chovendo |
| dormir | estava a dormir | estava dormindo |
| fazer | O que estás a fazer? | O que você está fazendo? |

**Portugal: estar a + infinitivo.** *Estou a ler. Estávamos a jantar quando ligaste.*

**Brasil: estar + gerúndio.** *Estou lendo. Estávamos jantando quando você ligou.*

As duas construções são português correto. A do gerúndio é também a forma tradicional no sul de Portugal (Alentejo e Algarve) e nas ilhas, por isso também se ouve por lá.

**O gerúndio** forma-se sem exceções: -ar → **-ando**, -er → **-endo**, -ir → **-indo**. *Falando, comendo, partindo*, e *pôr → pondo*.

**Como em inglês**, o presente simples serve para os hábitos e a forma progressiva para o que se passa agora: *Leio muito*, *Estou a ler*. O português usa-a até com verbos que o inglês deixa no presente simples: *Estou a gostar do livro. Estás a perceber?*

**Não serve para planos.** O inglês *I'm leaving tomorrow* diz-se *Parto amanhã* ou *Vou partir amanhã*, não *estou a partir amanhã*.

**Os pronomes** ligam-se ao infinitivo: *Estou a vê-lo. Ela está a vestir-se.*

**Outros verbos constroem-se da mesma maneira:**
- **andar a** + infinitivo, para o que se tem feito nos últimos tempos: *Ando a ler um livro ótimo.*
- **continuar a** + infinitivo: *Continua a chover.*
- **ficar a** + infinitivo: *Fiquei a ver televisão.*
- **acabar de** + infinitivo, para o que aconteceu há instantes: *Acabei de chegar.*

**O gerúndio em Portugal** continua a ter os seus usos. Com *ir*, mostra uma ação que se faz aos poucos: *Vai andando, que eu já vou.* E na escrita indica o modo ou o momento: *Aprende-se praticando.*`,
    },
  },

  {
    id: 'ter-haver',
    keywords: ['ter e haver', 'ter ou haver', 'ter vs haver', 'ter and haver', 'ter', 'haver', 'verbo haver', 'há',
      'há ou tem', 'tem ou há', 'há ou à', 'há e à', 'à ou há', 'ter de', 'ter que', 'ter de ou ter que', 'haver de',
      'hei de', 'há dois anos', 'há quanto tempo', 'there is', 'there are', 'there is and there are', 'to have',
      'have to', 'ago', 'how long'],
    title: { pt: 'Ter, haver e «há»', en: 'Ter, haver and "há"' },
    body: {
      en: `**Ter** is the everyday verb *to have*. **Haver** has almost retired from that job, and lives on mainly as **há**: *there is*, *there are*, and *ago*.

| | ter | haver |
| --- | --- | --- |
| eu | tenho | hei |
| tu | tens | hás |
| ele / ela / você | tem | há |
| nós | temos | havemos |
| eles / elas / vocês | têm | hão |

**Ter**: possession, age, and many states where English says *to be*:
- *Tenho dois irmãos. Tens tempo? Ela tem vinte anos.*
- *Tenho fome, sede, sono, frio, calor, medo, pressa, razão, sorte, saudades.*

*Tem* is singular and *têm* plural: the accent is the only difference.

**Há: there is, there are.** It is impersonal, so it never goes plural:
- *Há um problema. Há muitos problemas.*
- past: *Havia muita gente.* (there were a lot of people) *Houve um acidente.* (there was an accident)
- future: *Vai haver festa. Haverá tempo?*
- *Houve problemas*, never *houveram problemas*.

In Brazil, everyday speech says *tem* instead: *Tem um problema. Tem muita gente aqui.* In Portugal *tem* is not used this way.

**Há with time:**
- with a past tense, *ago*: *Cheguei há dois anos.* (I arrived two years ago)
- with the present, *for*, and still going on: *Moro aqui há dois anos.* (I have lived here for two years) *Há quanto tempo estudas português?*

English uses the perfect in that last case; Portuguese keeps the present.

**Há, à or a?** Three words that sound alike and are easy to mix up in writing, for native speakers too:
- **há** is the verb: *há dez minutos* (ten minutes ago)
- **a** is the preposition: *daqui a dez minutos* (in ten minutes)
- **à** is the preposition plus the article: *à uma hora* (at one o'clock)

**Obligation and intention:**
- **ter de** + infinitive, *to have to*: *Tenho de estudar.* You will also hear *ter que*, which is the usual form in Brazil; careful usage in Portugal prefers *ter de*.
- **haver de** + infinitive, for something you are determined will happen: *Hei de lá voltar um dia.* (I shall go back there one day) *Hás de ver!* (You'll see!) Since the 1990 spelling agreement it is written without a hyphen.

**As auxiliaries.** Compound tenses are built with *ter*: *tinha falado, tenho falado, terei falado*. *Haver* in that role (*havia falado*) is literary. See *o pretérito perfeito composto*.

**Everyday phrases:** *O que é que há?* (What's up?) *Não há problema. Não tem de quê.* (You're welcome) *Isso não tem nada a ver.* (That has nothing to do with it)`,
      pt: `**Ter** é o verbo de todos os dias para a posse. **Haver** quase deixou esse papel, e vive sobretudo na forma **há**, que indica existência e tempo decorrido.

| | ter | haver |
| --- | --- | --- |
| eu | tenho | hei |
| tu | tens | hás |
| ele / ela / você | tem | há |
| nós | temos | havemos |
| eles / elas / vocês | têm | hão |

**Ter**: posse, idade, e muitos estados que o inglês exprime com *to be*:
- *Tenho dois irmãos. Tens tempo? Ela tem vinte anos.*
- *Tenho fome, sede, sono, frio, calor, medo, pressa, razão, sorte, saudades.*

*Tem* é singular e *têm* é plural: só o acento os distingue.

**Há: existência.** É impessoal, por isso nunca vai para o plural:
- *Há um problema. Há muitos problemas.*
- no passado: *Havia muita gente. Houve um acidente.*
- no futuro: *Vai haver festa. Haverá tempo?*
- *Houve problemas*, nunca *houveram problemas*.

No Brasil, na fala corrente, diz-se *tem*: *Tem um problema. Tem muita gente aqui.* Em Portugal *tem* não se usa com este sentido.

**Há com tempo:**
- com um tempo do passado, o tempo que passou desde então: *Cheguei há dois anos.*
- com o presente, uma situação que dura até agora: *Moro aqui há dois anos. Há quanto tempo estudas português?*

Neste último caso o inglês usa o perfect (*I have lived here for two years*); o português fica no presente.

**Há, à ou a?** Três palavras que soam de forma parecida e que se confundem facilmente na escrita, mesmo entre falantes nativos:
- **há** é o verbo: *há dez minutos* (passaram dez minutos)
- **a** é a preposição: *daqui a dez minutos* (faltam dez minutos)
- **à** é a preposição mais o artigo: *à uma hora*

**Obrigação e intenção:**
- **ter de** + infinitivo: *Tenho de estudar.* Também se ouve *ter que*, que é a forma habitual no Brasil; em Portugal, o uso cuidado prefere *ter de*.
- **haver de** + infinitivo, para o que se está decidido a fazer ou se tem por certo: *Hei de lá voltar um dia. Hás de ver!* Desde o Acordo Ortográfico de 1990 escreve-se sem hífen.

**Como auxiliares.** Os tempos compostos formam-se com *ter*: *tinha falado, tenho falado, terei falado*. *Haver* nesse papel (*havia falado*) é literário. Vê *o pretérito perfeito composto*.

**Frases do dia a dia:** *O que é que há? Não há problema. Não tem de quê. Isso não tem nada a ver.*`,
    },
  },

  {
    id: 'negacao',
    keywords: ['negação', 'a negação', 'negativa', 'frase negativa', 'frases negativas', 'forma negativa',
      'dupla negação', 'dupla negativa', 'como se nega', 'não nada', 'não ninguém', 'não nunca', 'nunca', 'ninguém',
      'nenhum', 'nada', 'já não', 'ainda não', 'nem nem', 'negation', 'negative', 'negatives', 'negative sentences',
      'double negative', 'double negatives', 'not anymore', 'no longer'],
    title: { pt: 'A negação', en: 'Negation' },
    body: {
      en: `**Não** goes before the verb. An object pronoun, which normally follows the verb in Portugal, is pulled in front of it.

- *Não falo alemão. Não sei.*
- *Vi-o ontem.* → *Não o vi.* And *Lembro-me.* → *Não me lembro.*

**Answering a question**, Portuguese likes to repeat the verb rather than say a bare *sim*: *Falas inglês? Falo.* Or: *Não, não falo.*

**Other negative words** go after the verb, and **não stays**:

| | |
| --- | --- |
| não … nada | nothing: *Não vejo nada.* |
| não … ninguém | nobody: *Não conheço ninguém.* |
| não … nunca | never: *Não vou lá nunca.* |
| não … nenhum, nenhuma | no, not any: *Não tenho nenhuma ideia.* |
| não … nem … nem | neither … nor: *Não bebo nem vinho nem cerveja.* |
| já não | no longer: *Já não moro aqui.* |
| ainda não | not yet: *Ainda não comi.* |
| nem sequer | not even: *Nem sequer respondeu.* |
| também não | not either: *Eu também não.* |

**The double negative is standard Portuguese**, and required. *Não vejo nada* is correct; *vejo nada* is not. English logic does not apply.

**When the negative word comes first, não goes:**
- *Ninguém veio. Nada mudou. Nunca fui ao Brasil. Nenhum aluno faltou.*

**Nenhum** agrees with its noun (*nenhum, nenhuma, nenhuns, nenhumas*), and is stronger after it: *Não tenho dúvida nenhuma.*

**Nada** also means *not at all* before an adjective or after a verb: *Não é nada fácil. Não gosto nada disto.*

**No longer** is where the two countries part: Portugal says *já não* (*Já não fumo*), Brazil says *não … mais* (*Não fumo mais*).

**In speech:** the tag question is *não é?* (in Brazil often *né?*): *Está frio, não é?* Brazilians often add a second *não* at the end for emphasis: *Não sei, não.*

Short answers: *Nunca! Nem pensar!* (No way!) *Claro que não. De maneira nenhuma. Eu também não.* (Me neither)`,
      pt: `**Não** vai antes do verbo. O pronome, que em Portugal normalmente vem depois do verbo, passa para antes dele.

- *Não falo alemão. Não sei.*
- *Vi-o ontem.* → *Não o vi.* E *Lembro-me.* → *Não me lembro.*

**Para responder a uma pergunta**, o português prefere repetir o verbo a dizer só *sim*: *Falas inglês? Falo.* Ou então: *Não, não falo.*

**As outras palavras negativas** vão depois do verbo, e **o não mantém-se**:

| | |
| --- | --- |
| não … nada | *Não vejo nada.* |
| não … ninguém | *Não conheço ninguém.* |
| não … nunca | *Não vou lá nunca.* |
| não … nenhum, nenhuma | *Não tenho nenhuma ideia.* |
| não … nem … nem | *Não bebo nem vinho nem cerveja.* |
| já não | *Já não moro aqui.* |
| ainda não | *Ainda não comi.* |
| nem sequer | *Nem sequer respondeu.* |
| também não | *Eu também não.* |

**A dupla negação é português correto**, e é obrigatória. *Não vejo nada* está certo; *vejo nada* não. A lógica do inglês aqui não se aplica.

**Quando a palavra negativa vem antes do verbo, o não desaparece:**
- *Ninguém veio. Nada mudou. Nunca fui ao Brasil. Nenhum aluno faltou.*

**Nenhum** concorda com o nome (*nenhum, nenhuma, nenhuns, nenhumas*), e depois dele tem mais força: *Não tenho dúvida nenhuma.*

**Nada** também serve para reforçar a negação, antes de um adjetivo ou depois de um verbo: *Não é nada fácil. Não gosto nada disto.*

**Já não** é um ponto em que os dois países se separam: em Portugal diz-se *Já não fumo*, no Brasil *Não fumo mais*.

**Na fala:** a pergunta de confirmação é *não é?* (no Brasil, muitas vezes *né?*): *Está frio, não é?* Os brasileiros acrescentam com frequência um segundo *não* no fim, para dar ênfase: *Não sei, não.*

Respostas curtas: *Nunca! Nem pensar! Claro que não. De maneira nenhuma. Eu também não.*`,
    },
  },

  {
    id: 'comparativos',
    keywords: ['comparativo', 'comparativos', 'superlativo', 'superlativos', 'grau dos adjetivos', 'graus dos adjetivos',
      'comparação', 'mais do que', 'mais que ou mais do que', 'menos do que', 'tão como', 'tanto como', 'tão quanto',
      'melhor', 'pior', 'maior', 'menor', 'mais pequeno', 'mais pequeno ou menor', 'mais grande', 'íssimo',
      'comparative', 'comparatives', 'superlative', 'superlatives', 'comparisons', 'better', 'best', 'worse'],
    title: { pt: 'Comparativos e superlativos', en: 'Comparatives and superlatives' },
    body: {
      en: `**More and less: mais … do que, menos … do que.**
- *O Pedro é mais alto do que o João.*
- *Tenho menos tempo do que tu.*
- *É mais difícil do que eu pensava.*

*Do que* and plain *que* are both correct (*mais alto que o João*); before a clause with a verb, use *do que*.

Before a number it is **de**: *mais de cem euros, menos de uma hora*.

**As … as:**
- **tão** + adjective or adverb + **como**: *É tão alto como o pai.*
- **tanto, tanta, tantos, tantas** + noun + **como**: *Tenho tantos livros como tu.*
- verb + **tanto como**: *Trabalho tanto como ele.*

Brazil, and formal writing, often prefer *quanto*: *tão alto quanto o pai*.

**Irregular forms.** Four adjectives and two adverbs have a comparative of their own:

| | comparative | superlative |
| --- | --- | --- |
| bom (and the adverb bem) | melhor | o melhor, ótimo |
| mau (and the adverb mal) | pior | o pior, péssimo |
| grande | maior | o maior, máximo |
| pequeno | mais pequeno, menor | o mais pequeno, o menor, mínimo |

- Never *mais bom* or *mais grande*: *melhor, maior*.
- *Mais pequeno* is the normal form in Portugal, where *menor* is formal or means *under age*. In Brazil it is the other way round: *menor* is standard and *mais pequeno* is avoided.
- *Melhor* and *pior* are adjectives and adverbs alike: *Este vinho é melhor. Ela canta melhor do que eu.* Their plural is *melhores, piores*.

**The most** is the article + *mais* + adjective, and *of* or *in* is *de*:
- *É o rapaz mais alto da turma.*
- *É a cidade mais bonita do país.*
- *Foi o melhor filme do ano.*

**Very, extremely** is *muito*, or the ending **-íssimo**:
- *muito caro* or *caríssimo*, and *lindo → lindíssimo, cansado → cansadíssimo*
- some change their stem: *fácil → facílimo, difícil → dificílimo, rico → riquíssimo, feliz → felicíssimo*
- in speech, *mesmo* does the job: *É mesmo bom!*

**Two useful patterns:**
- *cada vez mais* (more and more): *Está cada vez mais frio.*
- *quanto mais … mais* (the more … the more): *Quanto mais estudo, mais aprendo.*`,
      pt: `**Superioridade e inferioridade: mais … do que, menos … do que.**
- *O Pedro é mais alto do que o João.*
- *Tenho menos tempo do que tu.*
- *É mais difícil do que eu pensava.*

*Do que* e *que* estão os dois certos (*mais alto que o João*); antes de uma oração com verbo, usa-se *do que*.

Antes de um número é **de**: *mais de cem euros, menos de uma hora*.

**Igualdade:**
- **tão** + adjetivo ou advérbio + **como**: *É tão alto como o pai.*
- **tanto, tanta, tantos, tantas** + nome + **como**: *Tenho tantos livros como tu.*
- verbo + **tanto como**: *Trabalho tanto como ele.*

No Brasil, e na escrita formal, prefere-se muitas vezes *quanto*: *tão alto quanto o pai*.

**Formas irregulares.** Quatro adjetivos e dois advérbios têm um comparativo próprio:

| | comparativo | superlativo |
| --- | --- | --- |
| bom (e o advérbio bem) | melhor | o melhor, ótimo |
| mau (e o advérbio mal) | pior | o pior, péssimo |
| grande | maior | o maior, máximo |
| pequeno | mais pequeno, menor | o mais pequeno, o menor, mínimo |

- Nunca *mais bom* nem *mais grande*: *melhor, maior*.
- *Mais pequeno* é a forma normal em Portugal, onde *menor* é formal ou quer dizer *menor de idade*. No Brasil é ao contrário: *menor* é a forma corrente e *mais pequeno* evita-se.
- *Melhor* e *pior* são ao mesmo tempo adjetivos e advérbios: *Este vinho é melhor. Ela canta melhor do que eu.* O plural é *melhores, piores*.

**O superlativo relativo** é o artigo + *mais* + adjetivo, seguido de *de*:
- *É o rapaz mais alto da turma.*
- *É a cidade mais bonita do país.*
- *Foi o melhor filme do ano.*

**O superlativo absoluto** faz-se com *muito* ou com a terminação **-íssimo**:
- *muito caro* ou *caríssimo*, e *lindo → lindíssimo, cansado → cansadíssimo*
- alguns mudam o radical: *fácil → facílimo, difícil → dificílimo, rico → riquíssimo, feliz → felicíssimo*
- na fala, *mesmo* faz o mesmo papel: *É mesmo bom!*

**Duas construções úteis:**
- *cada vez mais*: *Está cada vez mais frio.*
- *quanto mais … mais*: *Quanto mais estudo, mais aprendo.*`,
    },
  },

  {
    id: 'condicional-se',
    keywords: ['condicional', 'o condicional', 'o condicional e as frases com se', 'futuro do pretérito', 'conditional',
      'the conditional', 'conditional tense', 'conditional sentences', 'frases condicionais', 'orações condicionais',
      'frases com se', 'if clauses', 'if clause', 'se clauses', 'se clause', 'hipótese', 'hipóteses', 'se eu fosse',
      'se fosse', 'se tivesse', 'se eu tivesse', 'if i were', 'would', 'gostaria ou gostava',
      'mais-que-perfeito do conjuntivo'],
    title: { pt: 'O condicional e as frases com se', en: 'The conditional and se clauses' },
    body: {
      en: `**Formation.** The infinitive plus **-ia, -ias, -ia, -íamos, -iam**:

*falaria, falarias, falaria, falaríamos, falariam*

Only three verbs are irregular, the same three as in the future: *dizer → diria, fazer → faria, trazer → traria*. Brazilian grammars call this tense the *futuro do pretérito*.

**Uses.**
- **politeness**: *Gostaria de um café. Poderia ajudar-me?*
- **what would happen**: *Eu não faria isso.*
- **the future seen from the past**: *Disse que viria.* (He said he would come)
- **unconfirmed news**: *O ladrão teria fugido de mota.* (reportedly fled on a motorbike)

**In speech the imperfeito usually takes its place**, and in Portugal that is the ordinary spoken form, not a mistake: *Gostava de um café. Eu não fazia isso. Podias ajudar-me? Disse que vinha.*

**Se clauses.** Three types, by how real the condition is:

| | the se clause | the main clause | example |
| --- | --- | --- | --- |
| **open**, about the future | futuro do conjuntivo | present, future or imperative | *Se chover, fico em casa. Se puderes, liga-me.* |
| **imagined**, now or later | imperfeito do conjuntivo | condicional, or the imperfeito in speech | *Se tivesse tempo, viajaria mais.* |
| **contrary to fact**, in the past | mais-que-perfeito do conjuntivo | condicional composto, or *tinha* + participle in speech | *Se tivesses estudado, terias passado.* |

They mix when the time does: *Se tivesses estudado, agora sabias a resposta.*

**The imperfeito do conjuntivo** comes from the *eles* form of the pretérito perfeito, with *-ram* changed to **-sse**: *falaram → falasse, foram → fosse, tiveram → tivesse, fizeram → fizesse, puderam → pudesse, quiseram → quisesse*. The endings are *-sse, -sses, -sse, -ssemos, -ssem*, with an accent in the *nós* form: *falássemos, tivéssemos*.

**The rule to remember:** after *se* meaning *if*, never the conditional and never the ordinary future. Not *se teria tempo*, but *se tivesse tempo*; not *se terei*, but *se tiver*.

**A habit or a general truth** takes the indicative on both sides: *Se chove, fico em casa.* (whenever it rains)

**Useful formulas:**
- *Se eu fosse a ti, não ia.* (If I were you, I wouldn't go. Brazil: *Se eu fosse você*)
- *Fala como se soubesse tudo.* (He talks as if he knew everything)
- *Quem me dera!* (If only!)
- *Se ao menos tivesse mais tempo!* (If only I had more time!)

In formal writing an object pronoun goes inside the conditional: *dir-se-ia* (one would say). See *os pronomes*.`,
      pt: `**Formação.** O infinitivo mais **-ia, -ias, -ia, -íamos, -iam**:

*falaria, falarias, falaria, falaríamos, falariam*

Só três verbos são irregulares, os mesmos três do futuro: *dizer → diria, fazer → faria, trazer → traria*. As gramáticas brasileiras chamam a este tempo *futuro do pretérito*.

**Usos.**
- **cortesia**: *Gostaria de um café. Poderia ajudar-me?*
- **hipótese**: *Eu não faria isso.*
- **futuro visto do passado**: *Disse que viria.*
- **notícia por confirmar**: *O ladrão teria fugido de mota.*

**Na fala, o imperfeito toma quase sempre o seu lugar**, e em Portugal essa é a forma corrente, não um erro: *Gostava de um café. Eu não fazia isso. Podias ajudar-me? Disse que vinha.*

**As frases com se.** Três tipos, conforme a condição é mais ou menos real:

| | a oração com se | a oração principal | exemplo |
| --- | --- | --- | --- |
| **possível**, no futuro | futuro do conjuntivo | presente, futuro ou imperativo | *Se chover, fico em casa. Se puderes, liga-me.* |
| **imaginada**, agora ou mais tarde | imperfeito do conjuntivo | condicional, ou imperfeito na fala | *Se tivesse tempo, viajaria mais.* |
| **contrária aos factos**, no passado | mais-que-perfeito do conjuntivo | condicional composto, ou *tinha* + particípio na fala | *Se tivesses estudado, terias passado.* |

Misturam-se quando os tempos se misturam: *Se tivesses estudado, agora sabias a resposta.*

**O imperfeito do conjuntivo** vem da forma *eles* do pretérito perfeito, trocando *-ram* por **-sse**: *falaram → falasse, foram → fosse, tiveram → tivesse, fizeram → fizesse, puderam → pudesse, quiseram → quisesse*. As terminações são *-sse, -sses, -sse, -ssemos, -ssem*, com acento na forma *nós*: *falássemos, tivéssemos*.

**A regra a fixar:** depois de *se* condicional, nunca o condicional nem o futuro do indicativo. Não *se teria tempo*, mas *se tivesse tempo*; não *se terei*, mas *se tiver*.

**Um hábito ou uma verdade geral** pede o indicativo dos dois lados: *Se chove, fico em casa.* (sempre que chove)

**Fórmulas úteis:**
- *Se eu fosse a ti, não ia.* (no Brasil: *Se eu fosse você*)
- *Fala como se soubesse tudo.*
- *Quem me dera!*
- *Se ao menos tivesse mais tempo!*

Na escrita formal, o pronome mete-se dentro do condicional: *dir-se-ia*. Vê *os pronomes*.`,
    },
  },

  {
    id: 'saber-conhecer',
    keywords: ['saber e conhecer', 'saber ou conhecer', 'saber vs conhecer', 'saber and conhecer', 'saber or conhecer',
      'diferença entre saber e conhecer', 'difference between saber and conhecer', 'saber', 'conhecer', 'to know',
      'saber ou poder', 'saber poder conseguir', 'conseguir'],
    title: { pt: 'Saber e conhecer', en: 'Saber vs. conhecer' },
    body: {
      en: `Both are *to know*, and Portuguese never lets one stand in for the other.

**Saber**: facts, information, and anything followed by a clause:
- *Sei que estás cansado.* (I know you're tired)
- *Sabes onde é a estação?* (Do you know where the station is?)
- *Não sei.* (I don't know)

**Saber + infinitive** is to know how to, a skill:
- *Sei nadar. Sabes conduzir?* (I can swim. Can you drive? Brazil says *dirigir*)

Three verbs share the English *can*:
- *Sei conduzir.* (I know how)
- *Não posso conduzir: bebi.* (I am not allowed to, or the circumstances forbid it)
- *Não consigo abrir a porta.* (I try and do not manage)

**Conhecer**: being acquainted with a person, a place or a thing:
- *Conheço o Pedro há anos.* (I've known Pedro for years)
- *Conheces Lisboa?* (Do you know Lisbon? Have you been?)
- *Conheço bem este livro.*

**The past tenses split them further:**
- *conheci* = I **met**, for the first time: *Conheci a minha mulher em Coimbra.*
- *soube* = I **found out**: *Soube ontem que te vais casar!*
- *sabia, conhecia* = I knew

**Forms.** *Saber* is irregular: *sei, sabes, sabe, sabemos, sabem*, with *soube* in the past and *saiba* in the conjuntivo. *Conhecer* is regular apart from a spelling change that keeps the sound: *conheço, conheces*, and *conheça*.

**Saber a** means to taste of: *Sabe a morango.* (It tastes of strawberry) And *Sabe bem!* is what you say of anything that tastes or feels good.

**Everyday phrases:** *Sei lá!* (How should I know!) *Que eu saiba, não.* (Not as far as I know) *Fico a saber.* (Now I know) *Prazer em conhecê-lo.* (Pleased to meet you)`,
      pt: `Os dois traduzem o inglês *to know*, mas em português um nunca pode ocupar o lugar do outro.

**Saber**: factos, informações, e tudo o que vem seguido de uma oração:
- *Sei que estás cansado.*
- *Sabes onde é a estação?*
- *Não sei.*

**Saber + infinitivo** é ter aprendido a fazer uma coisa:
- *Sei nadar. Sabes conduzir?* (no Brasil diz-se *dirigir*)

Três verbos repartem entre si o inglês *can*:
- *Sei conduzir.* (aprendi)
- *Não posso conduzir: bebi.* (não me é permitido, ou as circunstâncias não deixam)
- *Não consigo abrir a porta.* (tento e não sou capaz)

**Conhecer**: ter familiaridade com uma pessoa, um lugar ou uma coisa:
- *Conheço o Pedro há anos.*
- *Conheces Lisboa?*
- *Conheço bem este livro.*

**Os tempos do passado separam-nos ainda mais:**
- *conheci* = vi pela primeira vez: *Conheci a minha mulher em Coimbra.*
- *soube* = fiquei a saber: *Soube ontem que te vais casar!*
- *sabia, conhecia* = o estado de saber ou de conhecer

**Formas.** *Saber* é irregular: *sei, sabes, sabe, sabemos, sabem*, com *soube* no pretérito perfeito e *saiba* no conjuntivo. *Conhecer* é regular, tirando uma mudança de grafia que conserva o som: *conheço, conheces*, e *conheça*.

**Saber a** é ter o sabor de: *Sabe a morango.* E *Sabe bem!* diz-se de tudo o que tem bom sabor ou dá prazer.

**Frases do dia a dia:** *Sei lá! Que eu saiba, não. Fico a saber. Prazer em conhecê-lo.*`,
    },
  },

  {
    id: 'verbos-reflexos',
    keywords: ['verbos reflexos', 'verbo reflexo', 'verbos reflexivos', 'verbo reflexivo', 'reflexos', 'reflexivos',
      'reflexo', 'reflexivo', 'verbos pronominais', 'verbo pronominal', 'pronominais', 'pronomes reflexos',
      'pronomes reflexivos', 'conjugação pronominal', 'conjugação reflexa', 'reflexive', 'reflexive verbs',
      'reflexive verb', 'reflexive pronouns', 'pronominal verbs', 'chamar-se', 'chamo-me', 'levantar-se',
      'levanto-me', 'lembrar-se', 'se impessoal', 'se passivo', 'me te se nos'],
    title: { pt: 'Os verbos reflexos', en: 'Reflexive verbs' },
    body: {
      en: `A reflexive verb has **-se** on the end of its infinitive: *levantar-se, chamar-se, sentar-se, vestir-se, deitar-se, lembrar-se*. Portuguese grammars call them *verbos reflexos* or *pronominais*; Brazil says *reflexivos*.

The *se* changes with the subject:

| | levantar-se |
| --- | --- |
| eu | levanto-me |
| tu | levantas-te |
| ele / ela / você | levanta-se |
| nós | levantamo-nos |
| eles / elas / vocês | levantam-se |

Before *-nos* the verb loses its final *s*: *levantamo-nos*, not *levantamos-nos*.

**Where the pronoun goes.** It follows the rules of every object pronoun. In Portugal it comes after the verb, and moves in front after a negative, a question word, *que* and certain adverbs:
- *Levanto-me cedo.* → *Não me levanto cedo.*
- *Como te chamas? Já se deitou. Acho que se esqueceu.*
- with an infinitive: *Vou deitar-me. Não me quero levantar.*
- commands: *Levanta-te! Sente-se, por favor. Não te preocupes!*

In Brazil it normally comes before the verb: *Eu me levanto cedo. Como você se chama?*

**Compound tenses** keep *ter*, and the participle does not change: *Tinha-me esquecido. Elas tinham-se levantado.*

**Parts of the body and clothes** take the article, not a possessive, and usually no reflexive either: *Lavo as mãos. Vesti o casaco. Parti o braço.* (I wash my hands. I put my coat on. I broke my arm)

**Each other:** *Vemo-nos amanhã! Conheceram-se em Lisboa. Escrevem-se todas as semanas.*

**Some verbs change meaning:**
- *chamar* (to call), *chamar-se* (to be called): *Como te chamas? Chamo-me Luís.*
- *lembrar* (to remind), *lembrar-se de* (to remember): *Não me lembro do nome dele.*
- *sentir* (to feel something), *sentir-se* (to feel a certain way): *Não me sinto bem.*
- *dar* (to give), *dar-se com* (to get on with): *Dou-me bem com ela.*
- *ir* (to go), *ir-se embora* (to go away): *Vou-me embora.*
- *passar* (to pass), *passar-se* (to happen): *O que se passa?*

**Mind the preposition:** *lembrar-se de, esquecer-se de, queixar-se de, rir-se de, interessar-se por, casar-se com*.

**Impersonal se**: *one*, *people*, *you* in general. *Como se diz isto em português? Aqui come-se bem. Fala-se inglês.* With a plural noun the verb goes plural in careful usage: *Vendem-se casas.*`,
      pt: `Um verbo reflexo tem **-se** no fim do infinitivo: *levantar-se, chamar-se, sentar-se, vestir-se, deitar-se, lembrar-se*. As gramáticas portuguesas falam de verbos *reflexos* ou *pronominais*; no Brasil diz-se *reflexivos*.

O *se* muda com o sujeito:

| | levantar-se |
| --- | --- |
| eu | levanto-me |
| tu | levantas-te |
| ele / ela / você | levanta-se |
| nós | levantamo-nos |
| eles / elas / vocês | levantam-se |

Antes de *-nos* o verbo perde o *s* final: *levantamo-nos*, e não *levantamos-nos*.

**Onde vai o pronome.** Segue as regras de todos os pronomes átonos. Em Portugal vem depois do verbo, e passa para antes dele a seguir a uma negação, a uma palavra interrogativa, a *que* e a certos advérbios:
- *Levanto-me cedo.* → *Não me levanto cedo.*
- *Como te chamas? Já se deitou. Acho que se esqueceu.*
- com um infinitivo: *Vou deitar-me. Não me quero levantar.*
- no imperativo: *Levanta-te! Sente-se, por favor. Não te preocupes!*

No Brasil vem normalmente antes do verbo: *Eu me levanto cedo. Como você se chama?*

**Os tempos compostos** continuam a formar-se com *ter*, e o particípio não muda: *Tinha-me esquecido. Elas tinham-se levantado.*

**Com as partes do corpo e a roupa** usa-se o artigo, não o possessivo, e em geral nem é preciso o pronome reflexo: *Lavo as mãos. Vesti o casaco. Parti o braço.*

**Reciprocidade:** *Vemo-nos amanhã! Conheceram-se em Lisboa. Escrevem-se todas as semanas.*

**Alguns verbos mudam de sentido:**
- *chamar* e *chamar-se*: *Como te chamas? Chamo-me Luís.*
- *lembrar* (fazer lembrar) e *lembrar-se de* (ter na memória): *Não me lembro do nome dele.*
- *sentir* (uma coisa) e *sentir-se* (de certa maneira): *Não me sinto bem.*
- *dar* e *dar-se com* (ter boa ou má relação): *Dou-me bem com ela.*
- *ir* e *ir-se embora* (partir): *Vou-me embora.*
- *passar* e *passar-se* (acontecer): *O que se passa?*

**Atenção à preposição:** *lembrar-se de, esquecer-se de, queixar-se de, rir-se de, interessar-se por, casar-se com*.

**O se impessoal** refere-se às pessoas em geral: *Como se diz isto em português? Aqui come-se bem. Fala-se inglês.* Com um nome no plural, o verbo vai para o plural no uso cuidado: *Vendem-se casas.*`,
    },
  },

  {
    id: 'perfeito-composto',
    keywords: ['pretérito perfeito composto', 'o pretérito perfeito composto', 'perfeito composto',
      'pretérito perfeito composto do indicativo', 'tenho falado', 'tenho feito', 'tenho estado', 'tenho ido',
      'ter mais particípio', 'ter + particípio', 'present perfect', 'the present perfect', 'have done',
      'have been doing', 'tempos compostos', 'compound tenses', 'mais-que-perfeito', 'pretérito mais-que-perfeito',
      'pluperfect', 'past perfect', 'tinha feito', 'tinha falado', 'particípio', 'particípio passado',
      'particípios irregulares', 'particípios duplos', 'duplo particípio', 'past participle', 'past participles',
      'participle'],
    title: { pt: 'O pretérito perfeito composto', en: 'The pretérito perfeito composto (tenho falado)' },
    body: {
      en: `It is built like the English present perfect: **ter** in the present + past participle, *tenho falado*. It does not mean the same thing, and this is the best-known trap in Portuguese.

*Tenho falado* means *I have been speaking*: something **repeated or continued** from the past right up to now.
- *Tenho trabalhado muito.* (I've been working a lot lately)
- *Tens visto a Ana?* (Have you been seeing much of Ana?)
- *Tem chovido muito este mês.* (It has rained a lot this month)
- *Ultimamente não tenho dormido bem.* (I haven't been sleeping well lately)

For **one completed event**, where English says *have done*, Portuguese uses the simple past, the pretérito perfeito:

| English | Portuguese |
| --- | --- |
| I have finished. | *Já acabei.* |
| Have you seen this film? | *Já viste este filme?* |
| I have never been to Brazil. | *Nunca fui ao Brasil.* |
| She has just arrived. | *Ela acabou de chegar.* |
| I have lived here for two years. | *Moro aqui há dois anos.* |
| I have been reading a lot lately. | *Tenho lido muito ultimamente.* |

So *Tenho visto este filme* does not mean *I have seen this film*. It would mean that you keep watching it. The words that go with this tense are *ultimamente, nos últimos tempos, estes dias, este ano*.

**The other compound tenses** mean what you would expect:
- *tinha falado* (I had spoken): *Quando cheguei, ele já tinha saído.* The one-word form *falara* is literary.
- *terei falado* (I will have spoken), *teria falado* (I would have spoken)
- in the conjuntivo: *tenha falado, tivesse falado, tiver falado*

**The participle.** -ar → **-ado**, -er and -ir → **-ido**: *falado, comido, partido*. After *ter* it never changes: *Elas têm trabalhado muito.*

Irregular: *fazer → feito, dizer → dito, ver → visto, pôr → posto, escrever → escrito, abrir → aberto, vir → vindo, ganhar → ganho, gastar → gasto, pagar → pago*.

**Verbs with two participles** use the long one with *ter* and the short one with *ser* and *estar*:

| | with ter | with ser, estar |
| --- | --- | --- |
| aceitar | tinha aceitado | foi aceite |
| entregar | tinha entregado | foi entregue |
| acender | tinha acendido | está aceso |
| prender | tinha prendido | foi preso |
| matar | tinha matado | foi morto |
| salvar | tinha salvado | foi salvo |

*Aceite* is the form in Portugal; Brazil says *aceito*. With *ser* and *estar* the participle agrees like an adjective: *As cartas foram entregues. A luz está acesa.*`,
      pt: `Forma-se como o present perfect inglês: **ter** no presente + particípio passado, *tenho falado*. Mas não quer dizer o mesmo, e esta é a armadilha mais conhecida do português.

*Tenho falado* indica uma ação que **se repete ou se prolonga** desde o passado até agora.
- *Tenho trabalhado muito.* (nos últimos tempos)
- *Tens visto a Ana?* (tens estado com ela ultimamente?)
- *Tem chovido muito este mês.*
- *Ultimamente não tenho dormido bem.*

Para **um facto único e concluído**, onde o inglês diz *have done*, o português usa o pretérito perfeito simples:

| inglês | português |
| --- | --- |
| I have finished. | *Já acabei.* |
| Have you seen this film? | *Já viste este filme?* |
| I have never been to Brazil. | *Nunca fui ao Brasil.* |
| She has just arrived. | *Ela acabou de chegar.* |
| I have lived here for two years. | *Moro aqui há dois anos.* |
| I have been reading a lot lately. | *Tenho lido muito ultimamente.* |

Por isso *Tenho visto este filme* não quer dizer que já o vi: quer dizer que o tenho visto várias vezes. As palavras que acompanham este tempo são *ultimamente, nos últimos tempos, estes dias, este ano*.

**Os outros tempos compostos** têm o sentido que se espera:
- *tinha falado*: *Quando cheguei, ele já tinha saído.* A forma simples *falara* é literária.
- *terei falado*, *teria falado*
- no conjuntivo: *tenha falado, tivesse falado, tiver falado*

**O particípio.** -ar → **-ado**, -er e -ir → **-ido**: *falado, comido, partido*. Depois de *ter* nunca muda: *Elas têm trabalhado muito.*

Irregulares: *fazer → feito, dizer → dito, ver → visto, pôr → posto, escrever → escrito, abrir → aberto, vir → vindo, ganhar → ganho, gastar → gasto, pagar → pago*.

**Os verbos com dois particípios** usam o longo com *ter* e o curto com *ser* e *estar*:

| | com ter | com ser, estar |
| --- | --- | --- |
| aceitar | tinha aceitado | foi aceite |
| entregar | tinha entregado | foi entregue |
| acender | tinha acendido | está aceso |
| prender | tinha prendido | foi preso |
| matar | tinha matado | foi morto |
| salvar | tinha salvado | foi salvo |

*Aceite* é a forma de Portugal; no Brasil diz-se *aceito*. Com *ser* e *estar* o particípio concorda como um adjetivo: *As cartas foram entregues. A luz está acesa.*`,
    },
  },

  {
    id: 'acentos',
    keywords: ['acentos', 'acento', 'acentuação', 'regras de acentuação', 'acento agudo', 'acento circunflexo',
      'acento grave', 'til', 'cedilha', 'c cedilhado', 'cê cedilhado', 'crase', 'a crase', 'à ou a', 'quando usar à',
      'vogais nasais', 'vogal nasal', 'nasais', 'ditongos nasais', 'avó e avô', 'accents', 'accent', 'accent marks',
      'written accents', 'cedilla', 'tilde', 'nasal vowels', 'nasal', 'grave accent', 'circumflex', 'spelling',
      'ortografia', 'pronúncia', 'pronunciation', 'acordo ortográfico', 'orthographic agreement', 'spelling agreement'],
    title: { pt: 'Acentos, cedilha e vogais nasais', en: 'Accents, the cedilla and nasal vowels' },
    body: {
      en: `Portuguese spelling uses five marks, and each has one job.

| mark | name | what it shows | examples |
| --- | --- | --- | --- |
| á é í ó ú | acento agudo | a stressed vowel, open in the case of *a, e, o* | *café, avó, está, saúde* |
| â ê ô | acento circunflexo | a stressed vowel, closed | *você, avô, português, lâmpada* |
| ã õ | til | a nasal vowel | *irmã, manhã, pão, limões* |
| à | acento grave | two words fused, not stress | *à, às, àquele* |
| ç | cedilha | a *c* said like *s* | *cabeça, almoço, açúcar* |

*Avó* is grandmother and *avô* is grandfather: the accent is the whole difference.

**When is stress written?** Most words follow one of two patterns and need no mark:
- words ending in **-a, -e, -o** (with or without *s*), **-am, -em** are stressed on the syllable before last: *casa, livros, falam, homem*
- words ending in **-i, -u, -l, -r, -z**, in a nasal vowel or in a diphthong are stressed on the last: *aqui, papel, falar, feliz, irmã, coração, jardim*

A word that breaks its pattern gets an accent: *café, sofá, avó* and *fácil, açúcar, lápis, táxi*. Every word stressed three syllables from the end has one: *médico, música, último, lâmpada, sábado*.

**Accents that change the word:**

| without | with |
| --- | --- |
| *esta* (this) | *está* (is) |
| *e* (and) | *é* (is) |
| *pais* (parents) | *país* (country) |
| *por* (by, for) | *pôr* (to put) |
| *pode* (he can) | *pôde* (he could) |
| *tem, vem* (he has, he comes) | *têm, vêm* (they have, they come) |
| *falamos* (we speak) | *falámos* (we spoke, in Portugal) |

**The cedilla.** *Ç* appears only before *a, o, u*, where a plain *c* would sound like *k*. Before *e* and *i* a plain *c* already sounds like *s*, so the cedilla comes and goes within one verb: *começar, começo*, but *comece*. No word begins with *ç*.

**Nasal vowels.** A vowel is nasal when it carries a til, or when it is followed by *m* or *n* at the end of a word or before a consonant: *sim, bom, um, tempo, canto*. That final *m* is not a separate sound; it only colours the vowel. The nasal diphthongs are the sound of the language: *pão, não, mãe, põe, limões*, and *muito*, which is nasal without showing it.

**Crase.** *À* is the preposition *a* fused with the article *a*: *Vou à praia. Chego às três.* A quick test: put a masculine noun in its place. If you get *ao*, write *à*: *Vou ao cinema*, so *Vou à praia*. No article, no accent: *Vou a Lisboa. Começou a chover.*

**Portugal and Brazil.** Some vowels are open in Portugal and closed in Brazil, and each country writes what it says: *económico* and *econômico*, *António* and *Antônio*, *bebé* and *bebê*, *ténis* and *tênis*.

**The 1990 spelling agreement** dropped the consonants nobody pronounced: *ação, direto, ótimo, atual* (once *acção, directo, óptimo, actual*). Where a consonant is said in one country and not in the other, there are two spellings: Portugal writes *facto* and *receção*, Brazil *fato* and *recepção*.`,
      pt: `A ortografia portuguesa usa cinco sinais, e cada um tem a sua função.

| sinal | nome | o que indica | exemplos |
| --- | --- | --- | --- |
| á é í ó ú | acento agudo | vogal tónica, aberta no caso de *a, e, o* | *café, avó, está, saúde* |
| â ê ô | acento circunflexo | vogal tónica fechada | *você, avô, português, lâmpada* |
| ã õ | til | vogal nasal | *irmã, manhã, pão, limões* |
| à | acento grave | a contração de duas palavras, não a sílaba tónica | *à, às, àquele* |
| ç | cedilha | um *c* que se lê como *s* | *cabeça, almoço, açúcar* |

*Avó* é a mãe do pai ou da mãe e *avô* é o pai: a diferença está toda no acento.

**Quando se escreve o acento?** A maior parte das palavras segue um de dois padrões e não precisa de sinal:
- as palavras terminadas em **-a, -e, -o** (com ou sem *s*), **-am, -em** têm a sílaba tónica na penúltima: *casa, livros, falam, homem*
- as palavras terminadas em **-i, -u, -l, -r, -z**, em vogal nasal ou em ditongo têm-na na última: *aqui, papel, falar, feliz, irmã, coração, jardim*

A palavra que foge ao seu padrão leva acento: *café, sofá, avó* e *fácil, açúcar, lápis, táxi*. E levam-no todas as que têm a sílaba tónica na antepenúltima: *médico, música, último, lâmpada, sábado*.

**Acentos que mudam a palavra:**

| sem acento | com acento |
| --- | --- |
| *esta* (demonstrativo) | *está* (verbo estar) |
| *e* (conjunção) | *é* (verbo ser) |
| *pais* (o pai e a mãe) | *país* (nação) |
| *por* (preposição) | *pôr* (verbo) |
| *pode* (presente) | *pôde* (passado) |
| *tem, vem* (singular) | *têm, vêm* (plural) |
| *falamos* (presente) | *falámos* (passado, em Portugal) |

**A cedilha.** O *ç* só aparece antes de *a, o, u*, onde um *c* simples se leria como *k*. Antes de *e* e *i* o *c* simples já se lê como *s*, e por isso a cedilha aparece e desaparece dentro do mesmo verbo: *começar, começo*, mas *comece*. Nenhuma palavra começa por *ç*.

**As vogais nasais.** Uma vogal é nasal quando leva til, ou quando vem seguida de *m* ou *n* em fim de palavra ou antes de consoante: *sim, bom, um, tempo, canto*. Esse *m* final não é um som à parte; apenas nasaliza a vogal. Os ditongos nasais são a marca da língua: *pão, não, mãe, põe, limões*, e *muito*, que é nasal sem que a escrita o mostre.

**A crase.** *À* é a preposição *a* contraída com o artigo *a*: *Vou à praia. Chego às três.* Um teste rápido: põe um nome masculino no lugar. Se der *ao*, escreve-se *à*: *Vou ao cinema*, logo *Vou à praia*. Sem artigo não há acento: *Vou a Lisboa. Começou a chover.*

**Portugal e Brasil.** Algumas vogais são abertas em Portugal e fechadas no Brasil, e cada país escreve o que diz: *económico* e *econômico*, *António* e *Antônio*, *bebé* e *bebê*, *ténis* e *tênis*.

**O Acordo Ortográfico de 1990** eliminou as consoantes que ninguém pronunciava: *ação, direto, ótimo, atual* (antes *acção, directo, óptimo, actual*). Quando a consoante se pronuncia num país e no outro não, há duas grafias: Portugal escreve *facto* e *receção*, o Brasil *fato* e *recepção*.`,
    },
  },

  {
    id: 'todo-tudo',
    keywords: ['todo e tudo', 'todo ou tudo', 'tudo ou todo', 'tudo e todo', 'todo vs tudo', 'tudo vs todo',
      'todo and tudo', 'todo or tudo', 'diferença entre todo e tudo', 'difference between todo and tudo', 'tudo',
      'todo', 'toda a gente', 'todo o mundo', 'todo o dia ou todos os dias', 'everything', 'everybody',
      'every day or all day'],
    title: { pt: 'Todo e tudo', en: 'Todo vs. tudo' },
    body: {
      en: `Two words that look alike and are easy to keep apart once you see what each one is.

**Tudo** means *everything*. It never changes and never goes with a noun:
- *Tudo bem?* (Everything all right?)
- *Comi tudo.* (I ate everything)
- *Está tudo pronto.* (Everything is ready)
- *Obrigado por tudo.* (Thanks for everything)
- *Tudo o que ele disse é verdade.* (Everything he said is true)

**Todo, toda, todos, todas** means *all*, *every* or *the whole*. It agrees with a noun, said or understood:
- **todo o, toda a** + singular, *the whole*: *todo o dia* (all day), *toda a noite* (all night), *toda a gente* (everybody)
- **todos os, todas as** + plural, *all the* or *every*: *todos os dias* (every day), *todas as semanas* (every week), *todos os alunos* (all the pupils)
- on its own, for people or things already mentioned: *Todos sabem. Vieram todas.*

| | |
| --- | --- |
| *todo o dia* | all day long |
| *todos os dias* | every day |
| *toda a gente* | everybody |
| *todo o mundo* | the whole world (in Brazil: everybody) |

**The test.** If a noun follows, or could be put back, it is *todo*. If it means *all things*, it is *tudo*. So *todo o dinheiro* (all the money), never *tudo o dinheiro*.

*Tudo* can go before *isto, isso, aquilo* and *o que*, which are not nouns: *tudo isto, tudo isso, tudo o que quiseres*.

**Portugal and Brazil.** Portugal keeps the article after *todo*: *todo o dia, todos os dias*. Brazil uses *todo dia* for *every day* and *o dia todo* for *all day*, and says *todo mundo* for *everybody*.

**The same pattern elsewhere.** *Tudo* belongs with the other words that never change and never take a noun: *isto, isso, aquilo*. See *este, esse, aquele*.

**Expressions:** *antes de tudo* (first of all), *acima de tudo* (above all), *apesar de tudo* (in spite of everything), *ao todo* (in all), *em todo o lado* (everywhere), *a toda a hora* (all the time).

They sound different too: *tudo* has the vowel of *tu*, *todo* the closed *o* of *avô*.`,
      pt: `Duas palavras parecidas que deixam de se confundir quando se percebe o que cada uma é.

**Tudo** quer dizer *todas as coisas*. Nunca muda e nunca acompanha um nome:
- *Tudo bem?*
- *Comi tudo.*
- *Está tudo pronto.*
- *Obrigado por tudo.*
- *Tudo o que ele disse é verdade.*

**Todo, toda, todos, todas** refere-se à totalidade de alguma coisa. Concorda com um nome, expresso ou subentendido:
- **todo o, toda a** + singular, a coisa inteira: *todo o dia, toda a noite, toda a gente*
- **todos os, todas as** + plural, sem exceção: *todos os dias, todas as semanas, todos os alunos*
- sozinho, quando já se sabe de quem ou de quê se fala: *Todos sabem. Vieram todas.*

| | |
| --- | --- |
| *todo o dia* | o dia inteiro |
| *todos os dias* | cada dia |
| *toda a gente* | todas as pessoas |
| *todo o mundo* | o mundo inteiro (no Brasil: todas as pessoas) |

**O teste.** Se vem um nome a seguir, ou se o podemos repor, é *todo*. Se quer dizer *todas as coisas*, é *tudo*. Por isso *todo o dinheiro*, nunca *tudo o dinheiro*.

*Tudo* pode vir antes de *isto, isso, aquilo* e *o que*, que não são nomes: *tudo isto, tudo isso, tudo o que quiseres*.

**Portugal e Brasil.** Em Portugal mantém-se o artigo depois de *todo*: *todo o dia, todos os dias*. No Brasil diz-se *todo dia* para cada dia e *o dia todo* para o dia inteiro, e *todo mundo* para toda a gente.

**O mesmo padrão noutras palavras.** *Tudo* pertence ao grupo das palavras que nunca mudam e nunca acompanham um nome: *isto, isso, aquilo*. Vê *este, esse, aquele*.

**Expressões:** *antes de tudo, acima de tudo, apesar de tudo, ao todo, em todo o lado, a toda a hora*.

Também soam de maneira diferente: *tudo* tem a vogal de *tu*, *todo* tem o *o* fechado de *avô*.`,
    },
  },

  {
    id: 'demonstrativos',
    keywords: ['demonstrativos', 'demonstrativo', 'pronomes demonstrativos', 'determinantes demonstrativos',
      'este esse aquele', 'este esse e aquele', 'este e esse', 'este ou esse', 'esse ou este', 'este vs esse',
      'esse e aquele', 'isto isso aquilo', 'isto e isso', 'isto ou isso', 'isto', 'isso', 'aquilo', 'aquele', 'este',
      'esse', 'aqui aí ali', 'cá e lá', 'neste nesse naquele', 'demonstratives', 'demonstrative', 'this and that',
      'this that', 'this or that'],
    title: { pt: 'Este, esse, aquele', en: 'Este, esse, aquele: this and that' },
    body: {
      en: `English has two steps, *this* and *that*. Portuguese has three, one for each person in the conversation.

| | near me | near you | far from both |
| --- | --- | --- | --- |
| masculine | este, estes | esse, esses | aquele, aqueles |
| feminine | esta, estas | essa, essas | aquela, aquelas |
| invariable | isto | isso | aquilo |
| the place | aqui | aí | ali, lá |

- *Este livro é meu.* (this book, the one I have here)
- *Esse casaco é novo?* (that jacket, the one you are wearing)
- *Aquela casa é da Ana.* (that house over there)

**Isto, isso, aquilo** never change and never go with a noun. They stand for a thing you do not name, or for an idea:
- *O que é isto?* (What is this?)
- *Isso não é verdade.* (That is not true)
- *Lembras-te daquilo?* (Do you remember that business?)

They are not used for people: *Este é o meu irmão*, not *isto é o meu irmão*.

**In time and in conversation:**
- *este* for the present: *esta semana, este ano*
- *esse* for what the other person has just said: *Isso mesmo! Essa ideia é boa.*
- *aquele* for what is far off: *naquele tempo* (in those days)

**Contractions.** *De, em* and *a* fuse with all of them:
- *deste, desse, daquele, disto, disso, daquilo*: *Gosto deste. Não preciso disso.*
- *neste, nesse, naquele, nisto, nisso, naquilo*: *Nesse caso, vou. Não penses nisso.*
- *àquele, àquela, àquilo*: *Vamos àquele café?*

**In Brazil**, speech has largely merged the first two: *esse* does the work of *este*, and the adverb makes the difference (*esse aqui, esse aí*). Portugal keeps all three apart.

**Expressions built on them:** *isto é* (that is to say), *por isso* (so, that's why), *além disso* (besides), *apesar disso* (even so), *nem por isso* (not really), *É isso!* (That's it!)

**O, a, os, as** can do the same job before *que* and *de*: *o que disseste* (what you said), *a minha casa e a do Pedro* (my house and Pedro's).`,
      pt: `O inglês tem dois graus, *this* e *that*. O português tem três, um para cada pessoa da conversa.

| | perto de mim | perto de ti | longe dos dois |
| --- | --- | --- | --- |
| masculino | este, estes | esse, esses | aquele, aqueles |
| feminino | esta, estas | essa, essas | aquela, aquelas |
| invariável | isto | isso | aquilo |
| o lugar | aqui | aí | ali, lá |

- *Este livro é meu.* (o que tenho aqui)
- *Esse casaco é novo?* (o que tu trazes vestido)
- *Aquela casa é da Ana.* (a que está ali ao fundo)

**Isto, isso, aquilo** nunca mudam e nunca acompanham um nome. Representam uma coisa que não se nomeia, ou uma ideia:
- *O que é isto?*
- *Isso não é verdade.*
- *Lembras-te daquilo?*

Não se usam para pessoas: *Este é o meu irmão*, e não *isto é o meu irmão*.

**No tempo e na conversa:**
- *este* para o presente: *esta semana, este ano*
- *esse* para o que a outra pessoa acabou de dizer: *Isso mesmo! Essa ideia é boa.*
- *aquele* para o que está distante: *naquele tempo*

**As contrações.** *De, em* e *a* juntam-se a todos eles:
- *deste, desse, daquele, disto, disso, daquilo*: *Gosto deste. Não preciso disso.*
- *neste, nesse, naquele, nisto, nisso, naquilo*: *Nesse caso, vou. Não penses nisso.*
- *àquele, àquela, àquilo*: *Vamos àquele café?*

**No Brasil**, a fala quase fundiu os dois primeiros: *esse* faz o trabalho de *este*, e é o advérbio que marca a diferença (*esse aqui, esse aí*). Em Portugal os três mantêm-se distintos.

**Expressões feitas com eles:** *isto é, por isso, além disso, apesar disso, nem por isso, É isso!*

**O, a, os, as** podem fazer o mesmo papel antes de *que* e de *de*: *o que disseste*, *a minha casa e a do Pedro*.`,
    },
  },

  {
    id: 'ficar',
    keywords: ['ficar', 'verbo ficar', 'o verbo ficar', 'ficar com', 'ficar a', 'ficar de', 'ficar ou estar',
      'ficar vs estar', 'ficar e estar', 'ser estar ficar', 'ser estar e ficar', 'ficar bem', 'onde fica', 'fica',
      'fiquei', 'usos de ficar', 'uses of ficar', 'to stay', 'to become'],
    title: { pt: 'Ficar', en: 'Ficar: to stay, to become, to be' },
    body: {
      en: `One of the most used verbs in Portuguese, with no single English equivalent. Its core idea is **ending up**, or **remaining**, in a place or a state.

It is a regular -ar verb; the only thing to watch is the spelling *qu* before *e*: *fico, ficas, fica*, but *fiquei* and *fique*.

**To be, of a place that does not move:**
- *Onde fica o banco? Fica ao lado da farmácia.*
- *O Porto fica no norte de Portugal.*

**To stay:**
- *Hoje fico em casa. Ficámos num hotel perto da praia.*
- *Fica aqui, eu volto já.*

**To become, to get**, for a change of state or a reaction:
- *Fiquei contente com a notícia. Ela ficou furiosa.*
- *Ficou doente. Ficaste mais alto!*
- Compare *Estou cansado* (I am tired) with *Fiquei cansado* (I got tired).

**To be left:**
- *Só ficaram dois bolos.* (There are only two cakes left)
- *Ficou tudo na mesma.* (Everything stayed as it was)

**To suit:**
- *Esse casaco fica-te bem.* (That jacket suits you)

**With a preposition** it does a good deal more:
- **ficar com**, to keep, to end up with: *Fico com este. Fica com o troco.* (Keep the change) *Fiquei com fome.*
- **ficar sem**, to run out of, to lose: *Fiquei sem bateria.*
- **ficar a** + infinitive, to stay doing something: *Fiquei a ver televisão.* Also *Fiquei a saber* (I found out).
- **ficar de** + infinitive, to agree or promise to: *Ele ficou de telefonar.*
- **ficar por** + infinitive, to be left undone: *A loiça ficou por lavar.*
- **ficar para**, to be put off until: *Fica para amanhã.*
- **ficar em**, with a price or a position: *Em quanto fica? Ficou em segundo lugar.*

**Ser, estar or ficar for places?** *Ficar* or *ser* for what stays put (*A escola fica ali*), *estar* for what can move (*O carro está ali*).

**Expressions:** *Fica bem!* (Take care, said on parting) *Fica à vontade.* (Make yourself at home) *Fica entre nós.* (It stays between us) *Fico à espera.* (I'll be waiting) And *ficar a ver navios*, to be left empty-handed, literally to be left watching the ships.`,
      pt: `Um dos verbos mais usados do português, sem equivalente único em inglês. A ideia de base é **ir parar**, ou **permanecer**, num lugar ou num estado.

É um verbo regular em -ar; só é preciso atenção à grafia *qu* antes de *e*: *fico, ficas, fica*, mas *fiquei* e *fique*.

**Estar situado**, quando se fala de um lugar que não muda de sítio:
- *Onde fica o banco? Fica ao lado da farmácia.*
- *O Porto fica no norte de Portugal.*

**Permanecer:**
- *Hoje fico em casa. Ficámos num hotel perto da praia.*
- *Fica aqui, eu volto já.*

**Tornar-se**, para uma mudança de estado ou uma reação:
- *Fiquei contente com a notícia. Ela ficou furiosa.*
- *Ficou doente. Ficaste mais alto!*
- Compara *Estou cansado* (o estado) com *Fiquei cansado* (a mudança).

**Sobrar, restar:**
- *Só ficaram dois bolos.*
- *Ficou tudo na mesma.*

**Assentar**, quando se fala de roupa ou de aparência:
- *Esse casaco fica-te bem.*

**Com uma preposição** faz ainda muito mais:
- **ficar com**, guardar para si, passar a ter: *Fico com este. Fica com o troco. Fiquei com fome.*
- **ficar sem**, deixar de ter: *Fiquei sem bateria.*
- **ficar a** + infinitivo, continuar num sítio a fazer uma coisa: *Fiquei a ver televisão.* Também *Fiquei a saber* (passei a saber).
- **ficar de** + infinitivo, combinar ou prometer: *Ele ficou de telefonar.*
- **ficar por** + infinitivo, não chegar a ser feito: *A loiça ficou por lavar.*
- **ficar para**, ser adiado: *Fica para amanhã.*
- **ficar em**, com um preço ou uma posição: *Em quanto fica? Ficou em segundo lugar.*

**Ser, estar ou ficar para os lugares?** *Ficar* ou *ser* para o que não sai do sítio (*A escola fica ali*), *estar* para o que se pode mover (*O carro está ali*).

**Expressões:** *Fica bem!* (diz-se na despedida) *Fica à vontade. Fica entre nós. Fico à espera.* E *ficar a ver navios*, que é ficar sem aquilo que se esperava.`,
    },
  },

  {
    id: 'futuro',
    keywords: ['futuro', 'o futuro', 'futuro simples', 'futuro do indicativo', 'futuro do presente', 'futuro imperfeito',
      'futuro próximo', 'futuro composto', 'futuro perfeito', 'ir mais infinitivo', 'ir + infinitivo', 'vou fazer',
      'vou fazer ou farei', 'farei', 'será que', 'future', 'the future', 'future tense', 'simple future',
      'future perfect', 'going to', 'will'],
    title: { pt: 'O futuro', en: 'The future' },
    body: {
      en: `Portuguese has three ways of talking about the future, and the one that looks most like a future tense is the one used least in speech.

**1. The present**, with a word that sets the time: *Amanhã vou ao Porto. Logo falamos.* This is the commonest way to talk about plans.

**2. Ir + infinitive**, the everyday future. The present of *ir* (*vou, vais, vai, vamos, vão*) and the infinitive, with nothing in between:
- *Vou estudar. Vai chover. O que vais fazer amanhã?*
- No preposition: *vou fazer*, not *vou a fazer* as Spanish would have it.
- With *ir* itself, Portugal says just *vou*: *Amanhã vou a Lisboa.*

**3. The futuro simples.** The infinitive plus **-ei, -ás, -á, -emos, -ão**:

| | falar | comer | partir |
| --- | --- | --- | --- |
| eu | falarei | comerei | partirei |
| tu | falarás | comerás | partirás |
| ele / ela / você | falará | comerá | partirá |
| nós | falaremos | comeremos | partiremos |
| eles / elas / vocês | falarão | comerão | partirão |

Only three verbs are irregular: *dizer → direi, fazer → farei, trazer → trarei*.

As a plain future this tense belongs to writing and formal speech: news, forecasts, promises, rules. *O presidente visitará Angola em maio. Amanhã choverá no norte.*

**Wondering and guessing.** In conversation the futuro simples is alive for something else: a guess about the **present**.
- *Onde estará o Pedro?* (I wonder where Pedro is)
- *Ele terá uns quarenta anos.* (He must be about forty)
- *Será verdade?* (Can it be true?)
- **Será que** opens any question you are asking yourself: *Será que ele vem?* (I wonder if he's coming)

**After quando and se**, the future is not this tense but the futuro do conjuntivo: *Quando chegar, ligo-te.* See *o futuro do conjuntivo*.

**English will for an offer or a decision made on the spot** is the present in Portuguese: *Eu abro a porta.* (I'll get the door) *Eu levo isso.* (I'll carry that)

**The futuro composto**, *terei* + participle, is *will have done*: *Às dez já terei acabado.* It also guesses about the past: *Ele terá perdido o comboio.* (He must have missed the train)

**In formal writing** an object pronoun goes inside the verb: *dir-te-ei, far-se-á*. See *os pronomes*.

Brazilian grammars call this tense the *futuro do presente*. In both countries, *ir* + infinitive is what people actually say.`,
      pt: `O português tem três maneiras de falar do futuro, e a que mais parece um tempo de futuro é a que menos se usa na fala.

**1. O presente**, com uma palavra que situa a ação no tempo: *Amanhã vou ao Porto. Logo falamos.* É a forma mais comum de falar de planos.

**2. Ir + infinitivo**, o futuro do dia a dia. O presente de *ir* (*vou, vais, vai, vamos, vão*) e o infinitivo, sem nada no meio:
- *Vou estudar. Vai chover. O que vais fazer amanhã?*
- Sem preposição: *vou fazer*, e não *vou a fazer*, como seria em espanhol.
- Com o próprio verbo *ir*, em Portugal diz-se só *vou*: *Amanhã vou a Lisboa.*

**3. O futuro simples.** O infinitivo mais **-ei, -ás, -á, -emos, -ão**:

| | falar | comer | partir |
| --- | --- | --- | --- |
| eu | falarei | comerei | partirei |
| tu | falarás | comerás | partirás |
| ele / ela / você | falará | comerá | partirá |
| nós | falaremos | comeremos | partiremos |
| eles / elas / vocês | falarão | comerão | partirão |

Só três verbos são irregulares: *dizer → direi, fazer → farei, trazer → trarei*.

Como simples futuro, este tempo pertence à escrita e à fala formal: notícias, previsões, promessas, regulamentos. *O presidente visitará Angola em maio. Amanhã choverá no norte.*

**Dúvida e suposição.** Na conversa, o futuro simples está bem vivo para outra coisa: uma suposição sobre o **presente**.
- *Onde estará o Pedro?*
- *Ele terá uns quarenta anos.*
- *Será verdade?*
- **Será que** abre qualquer pergunta que fazemos a nós próprios: *Será que ele vem?*

**Depois de quando e de se**, o futuro não é este tempo, é o futuro do conjuntivo: *Quando chegar, ligo-te.* Vê *o futuro do conjuntivo*.

**O will inglês de uma oferta ou de uma decisão tomada no momento** é o presente em português: *Eu abro a porta. Eu levo isso.*

**O futuro composto**, *terei* + particípio, indica o que estará concluído: *Às dez já terei acabado.* Serve também para uma suposição sobre o passado: *Ele terá perdido o comboio.*

**Na escrita formal**, o pronome mete-se dentro do verbo: *dir-te-ei, far-se-á*. Vê *os pronomes*.

As gramáticas brasileiras chamam a este tempo *futuro do presente*. Nos dois países, o que as pessoas dizem de facto é *ir* + infinitivo.`,
    },
  },
];

/**
 * The counterparts to the profe's interjections, fired on the same three
 * moments: a word found (good), a question outside what the tutor covers
 * (bad), and a verb hairy enough to deserve a reaction (wow).
 *
 * *Quem me dera saber!* — "if only I knew!" — is the Portuguese way of
 * admitting a gap gracefully, which is exactly the moment the bad ones are for.
 * *Ena pá!* is Portugal's own; a Brazilian would say *Nossa!*
 */
export const EXCLAMATIONS = {
  good: ['Boa!', 'Ora aí está!', 'Perfeito!', 'Ótimo!'],
  bad: ['Ora bolas!', 'Que chatice!', 'Quem me dera saber!'],
  wow: ['Caramba!', 'Ena pá!', 'Valha-me Deus!'],
};

/**
 * Conversational openers the tutor answers without looking anything up.
 *
 * Matched against the folded question, so accents are already gone: *olá* is
 * *ola* here, *até já* is *ate ja*. *Boa noite* is both the evening greeting
 * and the parting one in Portuguese; it is read as a greeting, since a reader
 * who opens with it has only just arrived. The goodbyes that start with *até*
 * are listed whole, because a bare *ate* would also catch *até que*.
 */
export const SMALL_TALK = [
  {
    match: /^(ola|oi|viva|boas|bom dia|boa tarde|boa noite|hey|hi|hello|tudo bem|como estas|como esta|como vais|como vai)\b/,
    reply: {
      pt: 'Olá! Posso conjugar verbos, procurar palavras no dicionário, traduzir frases e explicar-te a gramática. Por onde começamos?',
      en: 'Hello! I can conjugate verbs, look words up in the dictionary, translate phrases and explain grammar. Where would you like to start?',
    },
  },
  {
    match: /^(obrigad[oa]|muito obrigad[oa]|obrigadinh[oa]|thanks|thank you|ok|okay|esta bem|perfeito|otimo|fixe|de acordo)\b/,
    reply: {
      pt: 'De nada! Pergunta-me o que quiseres.',
      en: "You're welcome. Ask me anything else you need.",
    },
  },
  {
    match: /^(adeus|tchau|chau|xau|ate logo|ate ja|ate amanha|ate breve|ate a proxima|ate mais|fica bem|bom fim de semana|bye|goodbye)\b/,
    reply: {
      pt: 'Até à próxima! E bom estudo de português.',
      en: 'See you! Good luck with your Portuguese.',
    },
  },
];
