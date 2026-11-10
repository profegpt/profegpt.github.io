/**
 * Curated grammar explanations for the tutor, German side.
 *
 * The same contract as data/grammar.js, data/grammar-fr.js and
 * data/grammar-it.js: each topic carries the words that should summon it and
 * an explanation in both languages, so the tutor can answer in whichever one
 * it was asked. Bodies are markdown.
 *
 * Hand-written rather than generated, for the same reason as the other three
 * sets: everything the tutor says about German should be something a teacher
 * would actually sign off on. Where standard German and everyday speech part
 * ways (the genitive after *wegen*, *weil* with the verb in second place,
 * *sein* with *sitzen* and *stehen* in the south), the notes say so rather
 * than pretend the spoken form does not exist.
 *
 * Keywords are matched against the question with its diacritics folded away,
 * so *Präteritum* and *prateritum* summon the same note. Very common short
 * words (*nicht*, *dass*, *wenn*, *als*, *zu*) are deliberately not keywords
 * on their own: they turn up in half of all German questions. The matcher
 * uses word boundaries, which do not see a boundary next to ß, so no keyword
 * starts or ends with ß; students type *gross* anyway.
 */

export const TOPICS = [
  {
    id: 'faelle',
    keywords: ['die vier fälle', 'vier fälle', 'fälle', 'kasus', 'nominativ', 'akkusativ', 'dativ', 'genitiv',
      'akkusativ oder dativ', 'dativ oder akkusativ', 'wann dativ', 'wann akkusativ', 'wen oder wem', 'wem oder wen',
      'the four cases', 'cases', 'case', 'case system', 'nominative', 'accusative', 'dative', 'genitive',
      'when do i use dativ', 'when do i use dative', 'which case', 'direct object', 'indirect object'],
    title: { de: 'Die vier Fälle', en: 'The four cases' },
    body: {
      en: `German shows what a noun is doing in the sentence by its **case**, which you see on the article and the adjective, and now and then on the noun itself. English does this with word order; German can move things around because the case carries the information.

| case | the question to ask | its job | example |
| --- | --- | --- | --- |
| **Nominativ** | wer? was? | the subject | **Der** Hund schläft. |
| **Akkusativ** | wen? was? | the direct object | Ich sehe **den** Hund. |
| **Dativ** | wem? | the indirect object, the person something is given to | Ich gebe **dem** Hund einen Knochen. |
| **Genitiv** | wessen? | possession, *of* | das Spielzeug **des** Hundes |

**The definite and indefinite article in all four cases:**

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | der / ein | die / eine | das / ein | die / keine |
| Akkusativ | **den / einen** | die / eine | das / ein | die / keine |
| Dativ | **dem / einem** | **der / einer** | **dem / einem** | **den / keinen** |
| Genitiv | **des / eines** | **der / einer** | **des / eines** | **der / keiner** |

Three things to notice:
- The accusative changes **only the masculine**: *der → den, ein → einen*. Feminine, neuter and plural look like the nominative.
- In the dative plural the noun itself takes **-n**: *den Kindern, den Hunden, mit meinen Freunden* (not after a plural in -s: *den Autos*).
- In the genitive, masculine and neuter nouns take **-s** or **-es**: *des Mannes, des Kindes, des Autos*.

**What decides the case?**

1. **The verb.** Most verbs take an accusative object: *Ich sehe den Mann. Ich habe einen Hund.* A smaller group takes the **dative** instead, and these are worth learning as a list: *helfen, danken, gefallen, gehören, antworten, folgen, glauben, gratulieren, passen, schmecken, fehlen, begegnen, vertrauen*. *Ich helfe **dir**. Das Buch gehört **meinem** Bruder. Der Film gefällt **mir**.*
2. **Two objects.** When a verb has a person and a thing, the person is dative and the thing accusative: *Ich schenke **meiner Mutter** (dative) **ein Buch** (accusative).* *Er erklärt **den Schülern** **die Regel**.*
3. **Prepositions**, each with its own case or pair of cases: see *Präpositionen*.
4. **Sein, werden, bleiben** take the nominative on both sides: *Er ist **ein guter Lehrer**. Sie wird **Ärztin**.*

**The genitive** belongs to writing. In speech it is very often replaced by **von + dative**: *das Auto **von meinem** Bruder* instead of *das Auto **meines** Bruders*. Both are understood; the genitive is what you write. The same goes for the genitive prepositions *wegen, trotz, während*: in careful German *wegen **des** Regens*, in everyday speech *wegen **dem** Regen*. A teacher will want the genitive on paper.

A good habit: ask the question. *Wen oder was?* gives the accusative, *wem?* the dative. It works in German because the question words themselves carry the case.`,
      de: `Das Deutsche zeigt die Rolle eines Nomens im Satz durch den **Kasus** (den Fall), den man am Artikel und am Adjektiv erkennt, manchmal auch am Nomen selbst. Das Englische macht das mit der Wortstellung; im Deutschen kann man die Satzglieder umstellen, weil der Kasus die Information trägt.

| Fall | Frage | Aufgabe | Beispiel |
| --- | --- | --- | --- |
| **Nominativ** | wer? was? | das Subjekt | **Der** Hund schläft. |
| **Akkusativ** | wen? was? | das direkte Objekt | Ich sehe **den** Hund. |
| **Dativ** | wem? | das indirekte Objekt, die Person, der man etwas gibt | Ich gebe **dem** Hund einen Knochen. |
| **Genitiv** | wessen? | die Zugehörigkeit | das Spielzeug **des** Hundes |

**Der bestimmte und der unbestimmte Artikel in allen vier Fällen:**

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | der / ein | die / eine | das / ein | die / keine |
| Akkusativ | **den / einen** | die / eine | das / ein | die / keine |
| Dativ | **dem / einem** | **der / einer** | **dem / einem** | **den / keinen** |
| Genitiv | **des / eines** | **der / einer** | **des / eines** | **der / keiner** |

Drei Dinge fallen auf:
- Der Akkusativ verändert **nur das Maskulinum**: *der → den, ein → einen*. Femininum, Neutrum und Plural sehen aus wie im Nominativ.
- Im Dativ Plural bekommt auch das Nomen ein **-n**: *den Kindern, den Hunden, mit meinen Freunden* (nicht nach einem Plural auf -s: *den Autos*).
- Im Genitiv bekommen maskuline und neutrale Nomen **-s** oder **-es**: *des Mannes, des Kindes, des Autos*.

**Was bestimmt den Fall?**

1. **Das Verb.** Die meisten Verben haben ein Akkusativobjekt: *Ich sehe den Mann. Ich habe einen Hund.* Eine kleinere Gruppe verlangt den **Dativ**, und diese Verben lernt man am besten als Liste: *helfen, danken, gefallen, gehören, antworten, folgen, glauben, gratulieren, passen, schmecken, fehlen, begegnen, vertrauen*. *Ich helfe **dir**. Das Buch gehört **meinem** Bruder. Der Film gefällt **mir**.*
2. **Zwei Objekte.** Hat ein Verb eine Person und eine Sache, steht die Person im Dativ und die Sache im Akkusativ: *Ich schenke **meiner Mutter** (Dativ) **ein Buch** (Akkusativ).* *Er erklärt **den Schülern** **die Regel**.*
3. **Die Präpositionen**, jede mit ihrem eigenen Fall oder Fallpaar: siehe *Präpositionen*.
4. **Sein, werden, bleiben** haben auf beiden Seiten den Nominativ: *Er ist **ein guter Lehrer**. Sie wird **Ärztin**.*

**Der Genitiv** gehört zur Schriftsprache. In der gesprochenen Sprache wird er sehr oft durch **von + Dativ** ersetzt: *das Auto **von meinem** Bruder* statt *das Auto **meines** Bruders*. Beides versteht jeder; der Genitiv ist die Form, die man schreibt. Dasselbe gilt für die Genitivpräpositionen *wegen, trotz, während*: im gepflegten Deutsch *wegen **des** Regens*, im Alltag *wegen **dem** Regen*. Auf dem Papier erwartet die Lehrkraft den Genitiv.

Eine gute Gewohnheit: die Frage stellen. *Wen oder was?* ergibt den Akkusativ, *wem?* den Dativ. Das funktioniert im Deutschen, weil die Fragewörter selbst den Fall tragen.`,
    },
  },

  {
    id: 'der-die-das',
    keywords: ['der die das', 'artikel', 'der artikel', 'bestimmter artikel', 'unbestimmter artikel', 'ein eine',
      'genus', 'grammatisches geschlecht', 'maskulin', 'feminin', 'neutrum', 'maskulin oder feminin',
      'welcher artikel', 'der oder die', 'der oder das', 'die oder das', 'plural', 'pluralbildung', 'pluralform',
      'pluralformen', 'pluralendungen', 'mehrzahl', 'plural von', 'gender', 'noun gender', 'articles', 'article',
      'definite article', 'indefinite article', 'masculine feminine neuter', 'which article', 'plurals',
      'plural forms', 'plural endings', 'plural of'],
    title: { de: 'Der, die, das: Genus, Artikel und Plural', en: 'Der, die, das: gender, articles and plurals' },
    body: {
      en: `Every German noun is masculine (**der**), feminine (**die**) or neuter (**das**), and the gender is a property of the word, not of the thing: *das Mädchen* (the girl) is neuter, *der Löffel, die Gabel, das Messer* are three genders for three pieces of cutlery. So learn every noun **with its article**: *der Tisch*, never just *Tisch*. Everything else, the cases, the adjective endings, the pronouns, depends on it.

**The indefinite article** is *ein* for masculine and neuter, *eine* for feminine: *ein Mann, ein Kind, eine Frau*. It has no plural; the negative *kein* does: *keine Kinder*.

**Clues to the gender.** They are not rules, but they cover a great deal:

| usually **der** | usually **die** | usually **das** |
| --- | --- | --- |
| male people and animals: *der Vater, der Hahn* | female people: *die Mutter, die Lehrerin* | **-chen, -lein** always: *das Mädchen, das Fräulein, das Brötchen* |
| days, months, seasons, weather: *der Montag, der Juli, der Winter, der Regen* | **-ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei, -ie, -ur**: *die Zeitung, die Freiheit, die Nation, die Universität, die Bäckerei* | **-um, -ment, -tum**: *das Zentrum, das Dokument, das Eigentum* |
| **-er** for people who do something: *der Lehrer, der Bäcker* | most nouns in **-e**: *die Lampe, die Blume, die Straße* | infinitives used as nouns: *das Essen, das Lesen* |
| **-ling, -ismus, -or, -ig, -ich**: *der Frühling, der Tourismus, der Motor, der Honig, der Teppich* | *-in* for the female form: *die Ärztin* | letters, colours, metals: *das A, das Blau, das Gold* |

The exceptions worth knowing: *der Name, der Junge, der Käse, das Auge, das Ende* end in -e but are not feminine; *das Mädchen* is neuter because of *-chen*.

**Plurals.** The article in the plural is always **die**, whatever the gender. There is no single plural ending; there are five patterns, and the dictionary tells you which one a noun takes, so learn it with the word: *der Tisch, -e*.

| pattern | examples |
| --- | --- |
| **-e**, often with an umlaut | *der Tisch → die Tische, der Stuhl → die Stühle, die Hand → die Hände, das Jahr → die Jahre* |
| **-(e)n** | *die Frau → die Frauen, die Lampe → die Lampen, die Zeitung → die Zeitungen, der Junge → die Jungen* |
| **-er**, with an umlaut where possible | *das Kind → die Kinder, das Buch → die Bücher, der Mann → die Männer* |
| **no ending**, sometimes an umlaut | *der Lehrer → die Lehrer, das Mädchen → die Mädchen, der Vater → die Väter, der Apfel → die Äpfel* |
| **-s** | *das Auto → die Autos, das Handy → die Handys, der Park → die Parks* |

Some regularities inside that:
- nearly every feminine noun takes **-(e)n**: everything in *-e, -ung, -heit, -keit, -ion, -schaft*. *-in* doubles the n: *die Lehrerin → die Lehrerinnen*.
- masculine and neuter nouns in **-er, -el, -en** and the **-chen, -lein** nouns take **no ending**: *der Löffel → die Löffel, der Wagen → die Wagen*.
- **-s** belongs to borrowed words and words ending in a vowel other than -e: *die Hotels, die Kinos, die Babys*.
- one-syllable neuter nouns often take **-er** with an umlaut: *Haus → Häuser, Land → Länder, Dorf → Dörfer*.

In the dative plural the noun adds **-n** if it does not already end in one: *mit den Kindern, von den Büchern, aus den Häusern*, but *mit den Autos*. See *die vier Fälle*.`,
      de: `Jedes deutsche Nomen ist maskulin (**der**), feminin (**die**) oder neutral (**das**), und das Genus gehört zum Wort, nicht zur Sache: *das Mädchen* ist sächlich, und *der Löffel, die Gabel, das Messer* sind drei Geschlechter für drei Teile des Bestecks. Darum lernt man jedes Nomen **mit seinem Artikel**: *der Tisch*, nie nur *Tisch*. Alles Weitere, die Fälle, die Adjektivendungen, die Pronomen, hängt davon ab.

**Der unbestimmte Artikel** heißt *ein* im Maskulinum und Neutrum, *eine* im Femininum: *ein Mann, ein Kind, eine Frau*. Er hat keinen Plural; die Verneinung *kein* hat einen: *keine Kinder*.

**Hinweise auf das Genus.** Keine Regeln, aber sie decken sehr viel ab:

| meist **der** | meist **die** | meist **das** |
| --- | --- | --- |
| männliche Personen und Tiere: *der Vater, der Hahn* | weibliche Personen: *die Mutter, die Lehrerin* | **-chen, -lein** immer: *das Mädchen, das Fräulein, das Brötchen* |
| Tage, Monate, Jahreszeiten, Wetter: *der Montag, der Juli, der Winter, der Regen* | **-ung, -heit, -keit, -schaft, -ion, -tät, -ik, -ei, -ie, -ur**: *die Zeitung, die Freiheit, die Nation, die Universität, die Bäckerei* | **-um, -ment, -tum**: *das Zentrum, das Dokument, das Eigentum* |
| **-er** für Personen, die etwas tun: *der Lehrer, der Bäcker* | die meisten Nomen auf **-e**: *die Lampe, die Blume, die Straße* | substantivierte Infinitive: *das Essen, das Lesen* |
| **-ling, -ismus, -or, -ig, -ich**: *der Frühling, der Tourismus, der Motor, der Honig, der Teppich* | *-in* für die weibliche Form: *die Ärztin* | Buchstaben, Farben, Metalle: *das A, das Blau, das Gold* |

Die wichtigsten Ausnahmen: *der Name, der Junge, der Käse, das Auge, das Ende* enden auf -e, sind aber nicht feminin; *das Mädchen* ist wegen *-chen* sächlich.

**Der Plural.** Im Plural heißt der Artikel immer **die**, egal welches Genus. Eine einzige Pluralendung gibt es nicht; es gibt fünf Muster, und das Wörterbuch sagt, welches ein Nomen nimmt. Also mit dem Wort lernen: *der Tisch, -e*.

| Muster | Beispiele |
| --- | --- |
| **-e**, oft mit Umlaut | *der Tisch → die Tische, der Stuhl → die Stühle, die Hand → die Hände, das Jahr → die Jahre* |
| **-(e)n** | *die Frau → die Frauen, die Lampe → die Lampen, die Zeitung → die Zeitungen, der Junge → die Jungen* |
| **-er**, mit Umlaut, wo er möglich ist | *das Kind → die Kinder, das Buch → die Bücher, der Mann → die Männer* |
| **ohne Endung**, manchmal mit Umlaut | *der Lehrer → die Lehrer, das Mädchen → die Mädchen, der Vater → die Väter, der Apfel → die Äpfel* |
| **-s** | *das Auto → die Autos, das Handy → die Handys, der Park → die Parks* |

Einige Regelmäßigkeiten darin:
- Fast alle femininen Nomen bilden den Plural auf **-(e)n**: alles auf *-e, -ung, -heit, -keit, -ion, -schaft*. Bei *-in* wird das n verdoppelt: *die Lehrerin → die Lehrerinnen*.
- Maskuline und neutrale Nomen auf **-er, -el, -en** sowie die Nomen auf **-chen, -lein** bleiben **ohne Endung**: *der Löffel → die Löffel, der Wagen → die Wagen*.
- **-s** haben Fremdwörter und Wörter, die auf einen anderen Vokal als -e enden: *die Hotels, die Kinos, die Babys*.
- Einsilbige neutrale Nomen bilden oft **-er** mit Umlaut: *Haus → Häuser, Land → Länder, Dorf → Dörfer*.

Im Dativ Plural bekommt das Nomen ein **-n**, wenn es nicht schon auf -n endet: *mit den Kindern, von den Büchern, aus den Häusern*, aber *mit den Autos*. Siehe *die vier Fälle*.`,
    },
  },

  {
    id: 'sein-haben',
    keywords: ['sein und haben', 'sein oder haben', 'haben oder sein', 'haben und sein', 'sein', 'haben',
      'konjugation von sein', 'konjugation von haben', 'hilfsverb', 'hilfsverben', 'welches hilfsverb',
      'unterschied zwischen sein und haben', 'to be', 'to have', 'auxiliary', 'auxiliaries', 'auxiliary verb',
      'auxiliary verbs', 'which auxiliary', 'sein or haben', 'haben or sein', 'sein vs haben'],
    title: { de: 'Sein und haben', en: 'Sein and haben' },
    body: {
      en: `The two most common verbs in German, and the two auxiliaries of the perfect tenses. Both are irregular in the present.

| | sein | haben |
| --- | --- | --- |
| ich | bin | habe |
| du | bist | hast |
| er / sie / es | ist | hat |
| wir | sind | haben |
| ihr | seid | habt |
| sie / Sie | sind | haben |

In the Präteritum: *ich war, du warst, er war, wir waren, ihr wart, sie waren* and *ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten*. These past forms are used in speech too, where other verbs would be in the Perfekt: *Ich **war** gestern krank* is far more usual than *Ich bin gestern krank gewesen*.

**Where English says *to be*, German sometimes says *haben*:**
- *Ich **habe** Hunger / Durst.* (I'm hungry / thirsty)
- *Ich **habe** Angst.* (I'm afraid) *Du **hast** recht.* (You're right)
- But age is *sein*: *Ich **bin** sechzehn.* And *Mir ist kalt* (I'm cold) uses neither: the person is in the dative.

**As auxiliaries** they build the Perfekt and the Plusquamperfekt: *Ich **habe** gegessen. Ich **bin** gekommen.*

**Haben** is the default: every verb with an accusative object, all reflexive verbs, the modal verbs, and most verbs that take neither: *Ich habe das Buch gelesen. Ich habe mich gefreut. Wir haben geschlafen. Es hat geregnet.*

**Sein** with three groups of verbs that have no object:
1. **movement from one place to another**: *gehen, kommen, fahren, fliegen, laufen, reisen, fallen, steigen*: *Ich **bin** nach Hause gegangen. Sie **ist** nach Rom geflogen.*
2. **a change of state**: *aufwachen, einschlafen, sterben, werden, wachsen, aufstehen, passieren, geschehen*: *Er **ist** eingeschlafen. Was **ist** passiert?*
3. **sein** itself and **bleiben**: *Ich **bin** gewesen. Wir **sind** geblieben.*

The object test settles the verbs that can go either way. With an object they take *haben*: *Ich **habe** das Auto in die Garage gefahren.* Without one, *sein*: *Ich **bin** nach Berlin gefahren.*

**Regional usage.** In the south of Germany, in Austria and in Switzerland, *sitzen, stehen* and *liegen* take *sein*: *Ich **bin** den ganzen Tag gesessen.* In the north, and in standard written German, they take *haben*: *Ich **habe** gesessen.* Both are correct where they are spoken; a textbook will use *haben*.

Unlike French or Italian, the participle **never agrees** with the subject: *sie ist gekommen, sie sind gekommen*, one form for all. See *Perfekt und Präteritum* for the full picture.`,
      de: `Die zwei häufigsten Verben des Deutschen und die zwei Hilfsverben der Perfektzeiten. Beide sind im Präsens unregelmäßig.

| | sein | haben |
| --- | --- | --- |
| ich | bin | habe |
| du | bist | hast |
| er / sie / es | ist | hat |
| wir | sind | haben |
| ihr | seid | habt |
| sie / Sie | sind | haben |

Im Präteritum: *ich war, du warst, er war, wir waren, ihr wart, sie waren* und *ich hatte, du hattest, er hatte, wir hatten, ihr hattet, sie hatten*. Diese Präteritumformen benutzt man auch beim Sprechen, wo andere Verben im Perfekt stehen: *Ich **war** gestern krank* ist viel üblicher als *Ich bin gestern krank gewesen*.

**Wo das Englische *to be* sagt, sagt das Deutsche manchmal *haben*:**
- *Ich **habe** Hunger / Durst.* (englisch: *I'm hungry / thirsty*)
- *Ich **habe** Angst.* *Du **hast** recht.*
- Beim Alter aber *sein*: *Ich **bin** sechzehn.* Und *Mir ist kalt* braucht keines von beiden als Vollverb mit Subjekt: die Person steht im Dativ.

**Als Hilfsverben** bilden sie das Perfekt und das Plusquamperfekt: *Ich **habe** gegessen. Ich **bin** gekommen.*

**Haben** ist der Normalfall: alle Verben mit Akkusativobjekt, alle reflexiven Verben, die Modalverben und die meisten Verben ohne Objekt: *Ich habe das Buch gelesen. Ich habe mich gefreut. Wir haben geschlafen. Es hat geregnet.*

**Sein** bei drei Gruppen von Verben ohne Objekt:
1. **Bewegung von einem Ort zum anderen**: *gehen, kommen, fahren, fliegen, laufen, reisen, fallen, steigen*: *Ich **bin** nach Hause gegangen. Sie **ist** nach Rom geflogen.*
2. **Zustandsveränderung**: *aufwachen, einschlafen, sterben, werden, wachsen, aufstehen, passieren, geschehen*: *Er **ist** eingeschlafen. Was **ist** passiert?*
3. **sein** selbst und **bleiben**: *Ich **bin** gewesen. Wir **sind** geblieben.*

Der Objekttest entscheidet bei den Verben, die beides können. Mit Objekt nehmen sie *haben*: *Ich **habe** das Auto in die Garage gefahren.* Ohne Objekt *sein*: *Ich **bin** nach Berlin gefahren.*

**Regionaler Gebrauch.** In Süddeutschland, in Österreich und in der Schweiz bildet man *sitzen, stehen* und *liegen* mit *sein*: *Ich **bin** den ganzen Tag gesessen.* Im Norden und in der geschriebenen Standardsprache steht *haben*: *Ich **habe** gesessen.* Beides ist dort richtig, wo es gesprochen wird; das Lehrbuch nimmt *haben*.

Anders als im Französischen oder Italienischen wird das Partizip **nie** an das Subjekt angeglichen: *sie ist gekommen, sie sind gekommen*, eine Form für alle. Das ganze Bild steht unter *Perfekt und Präteritum*.`,
    },
  },

  {
    id: 'wortstellung',
    keywords: ['wortstellung', 'satzstellung', 'satzbau', 'verbzweitstellung', 'verb an zweiter stelle',
      'verb am ende', 'verb am satzende', 'satzklammer', 'nebensatz', 'nebensätze', 'hauptsatz', 'hauptsätze',
      'hauptsatz und nebensatz', 'inversion', 'tekamolo', 'te ka mo lo', 'word order', 'verb second',
      'verb in second position', 'verb last', 'verb at the end', 'verb final', 'subordinate clause',
      'subordinate clauses', 'main clause', 'sentence structure', 'time manner place', 'sentence bracket'],
    title: { de: 'Die Wortstellung', en: 'Word order' },
    body: {
      en: `German word order rests on one rule with two faces: in a **main clause the conjugated verb stands in second position**; in a **subordinate clause it stands at the end**.

**Verb second.** "Second" means the second *element*, not the second word. Anything can come first: the subject, a time, a place, an object. Whatever it is, the verb comes next and the subject, if it was not first, follows the verb.
- **Ich** gehe heute ins Kino.
- **Heute** gehe ich ins Kino.
- **Ins Kino** gehe ich heute.

English keeps the subject first (*Today I'm going*); German does not. Putting something other than the subject first is normal, not emphatic, and it is how German links sentences: *Dann … Deshalb … Leider …* each take the first slot and push the subject behind the verb.

**Verb first** in yes/no questions and commands: *Gehst du ins Kino? Geh ins Kino!*

**The bracket (Satzklammer).** When the verb has two parts, the conjugated part stays in second position and the rest goes to the **very end**: the participle, the infinitive, the separable prefix.
- *Ich **habe** gestern einen Film **gesehen**.*
- *Ich **muss** heute viel **arbeiten**.*
- *Ich **stehe** um sieben Uhr **auf**.*
- *Er **wird** morgen nach Berlin **fahren**.*

Everything else lives inside the bracket.

**Verb last** after a subordinating conjunction (*weil, dass, wenn, als, ob, obwohl, damit, bevor, nachdem, während*) and in relative clauses. The whole verb goes to the end, conjugated part last of all:
- *Ich bleibe zu Hause, **weil** es **regnet**.*
- *Ich weiß, **dass** er gestern einen Film **gesehen hat**.*
- *…, **weil** ich um sieben **aufstehen muss**.*

**Und, oder, aber, denn, sondern** are not subordinating. They join two main clauses and take no slot of their own: *Ich bleibe zu Hause, **denn** es **regnet**.* Compare *weil es regnet* with the verb at the end: see *weil, denn, dass, ob, wenn, als, wann*.

**A subordinate clause in first position** counts as the first element, so the main verb follows it immediately: *Weil es regnet, **bleibe** ich zu Hause.* Verb, verb, side by side, with a comma between: that is correct and very common.

**Inside the bracket:**
- the usual order of adverbials is **time, reason, manner, place** (Te-Ka-Mo-Lo): *Ich fahre **morgen** **wegen der Prüfung** **mit dem Zug** **nach Berlin**.*
- a dative noun comes before an accusative noun (Ich gebe **meinem Bruder** **das Buch**), but a pronoun comes before a noun, and an accusative pronoun before a dative one: Ich gebe **ihm** das Buch. Ich gebe **es ihm**.
- pronouns go as early as they can, right after the verb or the subject.

**In speech** you will hear *weil* followed by main-clause order (*weil, ich habe keine Zeit*). It is extremely common and nobody misunderstands it, but it is not standard, and in writing the verb goes to the end.`,
      de: `Die deutsche Wortstellung beruht auf einer Regel mit zwei Gesichtern: Im **Hauptsatz steht das konjugierte Verb an zweiter Stelle**, im **Nebensatz steht es am Ende**.

**Verbzweitstellung.** "Zweite Stelle" heißt das zweite *Satzglied*, nicht das zweite Wort. Vorne kann alles stehen: das Subjekt, eine Zeitangabe, ein Ort, ein Objekt. Was es auch ist, danach kommt das Verb, und das Subjekt folgt dem Verb, wenn es nicht selbst vorne stand.
- **Ich** gehe heute ins Kino.
- **Heute** gehe ich ins Kino.
- **Ins Kino** gehe ich heute.

Das Englische lässt das Subjekt vorne (*Today I'm going*); das Deutsche nicht. Etwas anderes als das Subjekt an den Anfang zu stellen ist normal, nicht betont, und so verbindet das Deutsche seine Sätze: *Dann … Deshalb … Leider …* besetzen die erste Stelle und schieben das Subjekt hinter das Verb.

**Verberststellung** in Ja-Nein-Fragen und Befehlen: *Gehst du ins Kino? Geh ins Kino!*

**Die Satzklammer.** Hat das Verb zwei Teile, bleibt der konjugierte Teil an zweiter Stelle, und der Rest geht **ganz ans Ende**: das Partizip, der Infinitiv, die trennbare Vorsilbe.
- *Ich **habe** gestern einen Film **gesehen**.*
- *Ich **muss** heute viel **arbeiten**.*
- *Ich **stehe** um sieben Uhr **auf**.*
- *Er **wird** morgen nach Berlin **fahren**.*

Alles andere steht in der Klammer.

**Verbletztstellung** nach einer unterordnenden Konjunktion (*weil, dass, wenn, als, ob, obwohl, damit, bevor, nachdem, während*) und im Relativsatz. Das ganze Verb wandert ans Ende, der konjugierte Teil als Letztes:
- *Ich bleibe zu Hause, **weil** es **regnet**.*
- *Ich weiß, **dass** er gestern einen Film **gesehen hat**.*
- *…, **weil** ich um sieben **aufstehen muss**.*

**Und, oder, aber, denn, sondern** ordnen nicht unter. Sie verbinden zwei Hauptsätze und besetzen keine eigene Stelle: *Ich bleibe zu Hause, **denn** es **regnet**.* Vergleiche *weil es regnet* mit dem Verb am Ende: siehe *weil, denn, dass, ob, wenn, als, wann*.

**Ein Nebensatz an erster Stelle** zählt als erstes Satzglied, also folgt das Verb des Hauptsatzes direkt darauf: *Weil es regnet, **bleibe** ich zu Hause.* Verb, Komma, Verb: das ist richtig und sehr häufig.

**In der Klammer:**
- Die übliche Reihenfolge der Angaben ist **temporal, kausal, modal, lokal** (Te-Ka-Mo-Lo): *Ich fahre **morgen** **wegen der Prüfung** **mit dem Zug** **nach Berlin**.*
- Ein Dativ-Nomen steht vor einem Akkusativ-Nomen (Ich gebe **meinem Bruder** **das Buch**), aber ein Pronomen steht vor einem Nomen, und ein Akkusativpronomen vor einem Dativpronomen: Ich gebe **ihm** das Buch. Ich gebe **es ihm**.
- Pronomen stehen so weit vorne wie möglich, gleich nach dem Verb oder dem Subjekt.

**Beim Sprechen** hört man *weil* mit Hauptsatzstellung (*weil, ich habe keine Zeit*). Das ist sehr verbreitet, und niemand missversteht es, aber es ist nicht standardsprachlich; beim Schreiben steht das Verb am Ende.`,
    },
  },

  {
    id: 'perfekt-praeteritum',
    keywords: ['perfekt', 'das perfekt', 'präteritum', 'das präteritum', 'perfekt oder präteritum',
      'präteritum oder perfekt', 'perfekt und präteritum', 'präteritum und perfekt',
      'unterschied zwischen perfekt und präteritum', 'perfekt mit haben', 'perfekt mit sein', 'partizip ii',
      'partizip 2', 'partizip perfekt', 'plusquamperfekt', 'vergangenheit', 'imperfekt', 'starke verben',
      'schwache verben', 'unregelmäßige verben', 'ablaut', 'vergangenheitsformen', 'past tense', 'past tenses',
      'present perfect', 'simple past', 'past participle', 'pluperfect', 'which past tense', 'strong verbs',
      'weak verbs', 'irregular verbs', 'perfect tense', 'preterite'],
    title: { de: 'Perfekt und Präteritum', en: 'Perfekt and Präteritum: the past tenses' },
    body: {
      en: `German has two simple ways of talking about the past, and the choice between them is about **register**, not meaning. *Ich habe gegessen* and *ich aß* both mean *I ate*.

**The Perfekt**: *haben* or *sein* in the present + the **Partizip II** at the end of the clause. It is the past tense of **speech**, of letters, messages and conversation: *Gestern habe ich Pizza gegessen. Wir sind ins Kino gegangen.*

Do not read it as the English present perfect. *Ich habe gestern Pizza gegessen* is simply *I ate pizza yesterday*; there is no "have eaten" meaning to it.

**The Präteritum** is the past tense of **writing**: stories, novels, news reports, history. *Er öffnete die Tür und sah sie.* In speech it survives for a handful of verbs, and these you must use it with:
- **sein** and **haben**: *Ich war müde. Wir hatten keine Zeit.*
- the **modal verbs**: *Ich konnte nicht kommen. Er musste arbeiten. Sie wollte schlafen.*
- *es gab* (there was) and, in the north, a few frequent verbs: *ich wusste, ich dachte, er kam, er ging*.

In the south of the German-speaking world the Präteritum is hardly spoken at all, even *ich bin gewesen* is heard; in the north it reaches a little further. Either way, the safe spoken pattern is **Perfekt for everything, Präteritum for sein, haben and the modals**.

**Forming the Partizip II.** Two main families:

| | weak (regular) | strong (vowel change) |
| --- | --- | --- |
| pattern | **ge** + stem + **t** | **ge** + changed stem + **en** |
| examples | *machen → gemacht, lernen → gelernt, arbeiten → gearbeitet* | *singen → gesungen, schreiben → geschrieben, finden → gefunden* |

A small **mixed** group has the weak ending with a changed stem: *bringen → gebracht, denken → gedacht, kennen → gekannt, wissen → gewusst, nennen → genannt*.

**No ge-** for verbs with an inseparable prefix (*be-, emp-, ent-, er-, ge-, ver-, zer-*) and for verbs in **-ieren**: *besuchen → besucht, verstehen → verstanden, erklären → erklärt, studieren → studiert*. Separable verbs put *ge-* between the prefix and the stem: *aufstehen → aufgestanden, einkaufen → eingekauft*.

**Forming the Präteritum.** Weak verbs add **-te**: *ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten* (*arbeitete* with an extra *e*). Strong verbs change the vowel and take **no ending** in the first and third person singular: *ich ging, du gingst, er ging, wir gingen, ihr gingt, sie gingen*.

**The strong verbs to know first**, with the Präteritum and the Partizip II:

| infinitive | Präteritum | Partizip II |
| --- | --- | --- |
| gehen | ging | ist gegangen |
| kommen | kam | ist gekommen |
| fahren | fuhr | ist gefahren |
| bleiben | blieb | ist geblieben |
| werden | wurde | ist geworden |
| sehen | sah | gesehen |
| essen | aß | gegessen |
| trinken | trank | getrunken |
| geben | gab | gegeben |
| nehmen | nahm | genommen |
| finden | fand | gefunden |
| lesen | las | gelesen |
| schreiben | schrieb | geschrieben |
| sprechen | sprach | gesprochen |
| wissen | wusste | gewusst |
| bringen | brachte | gebracht |
| denken | dachte | gedacht |

Which auxiliary goes with the Perfekt is explained under *sein und haben*.

**The Plusquamperfekt** (*had done*) moves the auxiliary into the Präteritum: *Als ich ankam, **hatte** der Film schon **angefangen**. Nachdem wir gegessen **hatten**, gingen wir spazieren.* It is the tense that *nachdem* asks for.`,
      de: `Das Deutsche hat zwei einfache Zeitformen für die Vergangenheit, und die Wahl zwischen ihnen ist eine Frage des **Registers**, nicht der Bedeutung. *Ich habe gegessen* und *ich aß* bedeuten dasselbe.

**Das Perfekt**: *haben* oder *sein* im Präsens + das **Partizip II** am Ende des Satzes. Es ist die Vergangenheit des **Sprechens**, der Briefe, Nachrichten und Gespräche: *Gestern habe ich Pizza gegessen. Wir sind ins Kino gegangen.*

Nicht mit dem englischen *present perfect* verwechseln: *Ich habe gestern Pizza gegessen* heißt einfach *I ate pizza yesterday*; eine Bedeutung wie *have eaten* steckt nicht darin.

**Das Präteritum** ist die Vergangenheit des **Schreibens**: Erzählungen, Romane, Nachrichten, Geschichte. *Er öffnete die Tür und sah sie.* Beim Sprechen lebt es bei einer Handvoll Verben weiter, und bei denen muss man es auch benutzen:
- **sein** und **haben**: *Ich war müde. Wir hatten keine Zeit.*
- die **Modalverben**: *Ich konnte nicht kommen. Er musste arbeiten. Sie wollte schlafen.*
- *es gab* und, im Norden, einige häufige Verben: *ich wusste, ich dachte, er kam, er ging*.

Im Süden des deutschen Sprachraums wird das Präteritum kaum gesprochen, dort hört man sogar *ich bin gewesen*; im Norden reicht es etwas weiter. So oder so ist das sichere Muster beim Sprechen: **Perfekt für alles, Präteritum für sein, haben und die Modalverben**.

**Die Bildung des Partizips II.** Zwei große Familien:

| | schwach (regelmäßig) | stark (mit Vokalwechsel) |
| --- | --- | --- |
| Muster | **ge** + Stamm + **t** | **ge** + veränderter Stamm + **en** |
| Beispiele | *machen → gemacht, lernen → gelernt, arbeiten → gearbeitet* | *singen → gesungen, schreiben → geschrieben, finden → gefunden* |

Eine kleine **gemischte** Gruppe hat die schwache Endung mit verändertem Stamm: *bringen → gebracht, denken → gedacht, kennen → gekannt, wissen → gewusst, nennen → genannt*.

**Kein ge-** bei Verben mit untrennbarer Vorsilbe (*be-, emp-, ent-, er-, ge-, ver-, zer-*) und bei Verben auf **-ieren**: *besuchen → besucht, verstehen → verstanden, erklären → erklärt, studieren → studiert*. Trennbare Verben setzen *ge-* zwischen Vorsilbe und Stamm: *aufstehen → aufgestanden, einkaufen → eingekauft*.

**Die Bildung des Präteritums.** Schwache Verben hängen **-te** an: *ich machte, du machtest, er machte, wir machten, ihr machtet, sie machten* (*arbeitete* mit einem zusätzlichen *e*). Starke Verben wechseln den Vokal und haben in der ersten und dritten Person Singular **keine Endung**: *ich ging, du gingst, er ging, wir gingen, ihr gingt, sie gingen*.

**Die starken Verben, die man zuerst lernen sollte**, mit Präteritum und Partizip II:

| Infinitiv | Präteritum | Partizip II |
| --- | --- | --- |
| gehen | ging | ist gegangen |
| kommen | kam | ist gekommen |
| fahren | fuhr | ist gefahren |
| bleiben | blieb | ist geblieben |
| werden | wurde | ist geworden |
| sehen | sah | gesehen |
| essen | aß | gegessen |
| trinken | trank | getrunken |
| geben | gab | gegeben |
| nehmen | nahm | genommen |
| finden | fand | gefunden |
| lesen | las | gelesen |
| schreiben | schrieb | geschrieben |
| sprechen | sprach | gesprochen |
| wissen | wusste | gewusst |
| bringen | brachte | gebracht |
| denken | dachte | gedacht |

Welches Hilfsverb zum Perfekt gehört, steht unter *sein und haben*.

**Das Plusquamperfekt** setzt das Hilfsverb ins Präteritum: *Als ich ankam, **hatte** der Film schon **angefangen**. Nachdem wir gegessen **hatten**, gingen wir spazieren.* Es ist die Zeitform, die *nachdem* verlangt.`,
    },
  },

  {
    id: 'trennbare-verben',
    keywords: ['trennbare verben', 'trennbares verb', 'trennbar', 'untrennbare verben', 'untrennbares verb',
      'untrennbar', 'trennbar oder untrennbar', 'präfix', 'präfixe', 'vorsilbe', 'vorsilben', 'trennbare vorsilben',
      'verben mit vorsilbe', 'separable verbs', 'separable verb', 'separable', 'inseparable', 'inseparable verbs',
      'inseparable verb', 'separable prefix', 'separable prefixes', 'prefix verbs', 'verb prefixes', 'prefix'],
    title: { de: 'Trennbare und untrennbare Verben', en: 'Separable and inseparable verbs' },
    body: {
      en: `Many German verbs are a prefix plus a verb: *auf + stehen, be + suchen, ver + stehen*. The prefix decides how the verb behaves, and the clue is **stress**: a stressed prefix separates, an unstressed one never does.

**Separable prefixes** (stressed): *ab-, an-, auf-, aus-, bei-, ein-, fest-, her-, hin-, los-, mit-, nach-, vor-, weg-, zu-, zurück-, zusammen-*.

In a main clause the prefix breaks off and goes to the **end**:
- *aufstehen*: *Ich **stehe** um sieben **auf**.*
- *anrufen*: *Sie **ruft** mich jeden Abend **an**.*
- einkaufen: **Kaufst** du heute **ein**?

It rejoins the verb whenever the verb is not in second position:
- in a subordinate clause: *…, weil ich um sieben **aufstehe**.*
- as an infinitive after a modal: *Ich muss um sieben **aufstehen**.*
- in the **Partizip II**, where ge- goes **between** the two parts: **aufgestanden**, **angerufen**, **eingekauft**
- with *zu*, which also goes between: *Ich habe keine Lust **aufzustehen**.*

**Inseparable prefixes** (unstressed): *be-, emp-, ent-, er-, ge-, miss-, ver-, zer-*. They never come off, and the Partizip II has **no ge-**:
- *besuchen*: *Ich **besuche** dich. Ich habe dich **besucht**.*
- *verstehen*: *Ich **verstehe** das nicht. Ich habe es nicht **verstanden**.*
- *erklären, bekommen, entdecken, gefallen, zerstören* → *erklärt, bekommen, entdeckt, gefallen, zerstört*

**Prefixes that do both**: *durch-, über-, um-, unter-, wieder-, wider-, voll-*. Stressed, the verb is separable and keeps the literal, physical meaning; unstressed, it is inseparable and the meaning is figurative:
- **um**fahren (separable): Er fährt den Pfosten **um**. (he knocks the post down)
- *um**fah**ren* (inseparable): *Er **umfährt** den Pfosten.* (he drives round it)
- **über**setzen: Die Fähre setzt uns **über**. (ferries across) against über**set**zen: Sie **übersetzt** den Text. (translates)
- *wieder**ho**len* (repeat) is inseparable: *Ich **wiederhole** die Frage.*

**Spotting a separable verb in a sentence.** The prefix at the end is easy to miss, and *Ich stehe um sieben auf* is not about standing. If a sentence ends in a small word like *an, auf, aus, ein, mit, zu, vor* that has nothing to attach to, read it back onto the verb: *stehe … auf → aufstehen*, and look that up.

In a dictionary or on a verb card the prefix is written together with the verb (*aufstehen*); in the conjugation tables the present shows it at the end, and the Perfekt shows the *-ge-* inside.`,
      de: `Viele deutsche Verben bestehen aus einer Vorsilbe und einem Verb: *auf + stehen, be + suchen, ver + stehen*. Die Vorsilbe entscheidet, wie sich das Verb verhält, und das Erkennungszeichen ist die **Betonung**: Eine betonte Vorsilbe trennt sich ab, eine unbetonte nie.

**Trennbare Vorsilben** (betont): *ab-, an-, auf-, aus-, bei-, ein-, fest-, her-, hin-, los-, mit-, nach-, vor-, weg-, zu-, zurück-, zusammen-*.

Im Hauptsatz löst sich die Vorsilbe und geht ans **Ende**:
- *aufstehen*: *Ich **stehe** um sieben **auf**.*
- *anrufen*: *Sie **ruft** mich jeden Abend **an**.*
- einkaufen: **Kaufst** du heute **ein**?

Sie verbindet sich wieder mit dem Verb, sobald das Verb nicht an zweiter Stelle steht:
- im Nebensatz: *…, weil ich um sieben **aufstehe**.*
- als Infinitiv nach einem Modalverb: *Ich muss um sieben **aufstehen**.*
- im **Partizip II**, wo ge- **zwischen** die beiden Teile tritt: **aufgestanden**, **angerufen**, **eingekauft**
- mit *zu*, das ebenfalls dazwischentritt: *Ich habe keine Lust **aufzustehen**.*

**Untrennbare Vorsilben** (unbetont): *be-, emp-, ent-, er-, ge-, miss-, ver-, zer-*. Sie lösen sich nie ab, und das Partizip II hat **kein ge-**:
- *besuchen*: *Ich **besuche** dich. Ich habe dich **besucht**.*
- *verstehen*: *Ich **verstehe** das nicht. Ich habe es nicht **verstanden**.*
- *erklären, bekommen, entdecken, gefallen, zerstören* → *erklärt, bekommen, entdeckt, gefallen, zerstört*

**Vorsilben, die beides können**: *durch-, über-, um-, unter-, wieder-, wider-, voll-*. Betont ist das Verb trennbar und behält die wörtliche, räumliche Bedeutung; unbetont ist es untrennbar, und die Bedeutung ist übertragen:
- **um**fahren (trennbar): Er fährt den Pfosten **um**. (er wirft ihn um)
- *um**fah**ren* (untrennbar): *Er **umfährt** den Pfosten.* (er fährt um ihn herum)
- **über**setzen: Die Fähre setzt uns **über**. gegenüber über**set**zen: Sie **übersetzt** den Text.
- *wieder**ho**len* (noch einmal machen) ist untrennbar: *Ich **wiederhole** die Frage.*

**Ein trennbares Verb im Satz erkennen.** Die Vorsilbe am Ende übersieht man leicht, und *Ich stehe um sieben auf* handelt nicht vom Stehen. Endet ein Satz mit einem kleinen Wort wie *an, auf, aus, ein, mit, zu, vor*, das zu nichts gehört, dann gehört es zum Verb: *stehe … auf → aufstehen*, und das schlägt man nach.

Im Wörterbuch und auf der Verbkarte steht die Vorsilbe mit dem Verb zusammen (*aufstehen*); in den Konjugationstabellen zeigt das Präsens sie am Ende, und das Perfekt zeigt das *-ge-* in der Mitte.`,
    },
  },

  {
    id: 'modalverben',
    keywords: ['modalverben', 'modalverb', 'die modalverben', 'können', 'dürfen', 'müssen', 'sollen', 'wollen',
      'mögen', 'möchte', 'möchten', 'ich möchte', 'können oder dürfen', 'dürfen oder können', 'müssen oder sollen',
      'sollen oder müssen', 'nicht müssen', 'nicht dürfen', 'modal verbs', 'modal verb', 'modals', 'can could',
      'must should', 'have to', 'must not', 'be allowed to', 'would like'],
    title: { de: 'Die Modalverben', en: 'The modal verbs' },
    body: {
      en: `Six verbs that modify another verb: **können, dürfen, müssen, sollen, wollen, mögen**, plus **möchte**, which is a form of *mögen* with a life of its own. The other verb stands at the **end of the clause as a bare infinitive**, with no *zu*: *Ich muss heute **arbeiten**.*

**Present tense.** The singular changes its vowel and the first and third person take **no ending**; the plural is regular.

| | können | dürfen | müssen | sollen | wollen | mögen | möchte |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ich | kann | darf | muss | soll | will | mag | möchte |
| du | kannst | darfst | musst | sollst | willst | magst | möchtest |
| er / sie / es | kann | darf | muss | soll | will | mag | möchte |
| wir | können | dürfen | müssen | sollen | wollen | mögen | möchten |
| ihr | könnt | dürft | müsst | sollt | wollt | mögt | möchtet |
| sie / Sie | können | dürfen | müssen | sollen | wollen | mögen | möchten |

**What they mean:**
- **können**: ability or possibility. *Ich kann schwimmen. Kannst du mir helfen? Das kann sein.* Also *to know* a language or a skill: *Ich kann Deutsch.*
- **dürfen**: permission. *Darf ich das Fenster öffnen? Hier darf man nicht rauchen.*
- **müssen**: necessity. *Ich muss lernen. Du musst nicht kommen.*
- **sollen**: an obligation that comes from someone else, an instruction, or what is said to be the case. *Du sollst deine Hausaufgaben machen. Soll ich das Fenster schließen? Er soll sehr reich sein.* (he is said to be)
- **wollen**: want, intention. *Ich will nach Hause. Wir wollen ein Haus kaufen.*
- **mögen**: to like, usually with a noun. *Ich mag Pizza. Ich mag ihn nicht.*
- **möchte**: would like, the polite way to ask. *Ich möchte einen Kaffee. Möchtest du mitkommen?*

**Two traps for English speakers.**
- *must not* is **nicht dürfen**, not *nicht müssen*. *Du darfst das nicht* = you must not; *Du musst das nicht* = you don't have to.
- *ich will* means *I want*, not *I will*. The future is made with *werden*: see *werden: Passiv und Futur*.

**Präteritum**, the past tense you actually use in speech: *konnte, durfte, musste, sollte, wollte, mochte* (no umlaut), conjugated like a weak verb: *ich konnte, du konntest, er konnte, wir konnten*. *Ich konnte gestern nicht kommen. Wir mussten lange warten.*

**Konjunktiv II**, the polite and hypothetical forms, bring the umlaut back: *könnte, dürfte, müsste, sollte, wollte, möchte*. *Könnten Sie mir helfen? Du solltest mehr schlafen.* (you should) *Das müsste reichen.* (that ought to be enough)

**Perfekt** with a modal is a double infinitive, *Ich habe arbeiten müssen*, which is correct but rarely said; use the Präteritum: *Ich musste arbeiten.*

**On their own**, with no second verb: *Ich kann das. Ich will das nicht. Ich muss nach Hause. Ich mag Schokolade.*

**In a subordinate clause** the modal goes last: *…, weil ich heute arbeiten **muss**.*`,
      de: `Sechs Verben, die ein anderes Verb näher bestimmen: **können, dürfen, müssen, sollen, wollen, mögen**, dazu **möchte**, eine Form von *mögen* mit eigenem Leben. Das andere Verb steht **am Ende des Satzes als reiner Infinitiv**, ohne *zu*: *Ich muss heute **arbeiten**.*

**Präsens.** Der Singular wechselt den Vokal, und die erste und dritte Person haben **keine Endung**; der Plural ist regelmäßig.

| | können | dürfen | müssen | sollen | wollen | mögen | möchte |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ich | kann | darf | muss | soll | will | mag | möchte |
| du | kannst | darfst | musst | sollst | willst | magst | möchtest |
| er / sie / es | kann | darf | muss | soll | will | mag | möchte |
| wir | können | dürfen | müssen | sollen | wollen | mögen | möchten |
| ihr | könnt | dürft | müsst | sollt | wollt | mögt | möchtet |
| sie / Sie | können | dürfen | müssen | sollen | wollen | mögen | möchten |

**Was sie bedeuten:**
- **können**: Fähigkeit oder Möglichkeit. *Ich kann schwimmen. Kannst du mir helfen? Das kann sein.* Auch für eine Sprache oder eine Fertigkeit: *Ich kann Deutsch.*
- **dürfen**: Erlaubnis. *Darf ich das Fenster öffnen? Hier darf man nicht rauchen.*
- **müssen**: Notwendigkeit. *Ich muss lernen. Du musst nicht kommen.*
- **sollen**: eine Verpflichtung, die von jemand anderem kommt, ein Auftrag, oder das, was man sagt. *Du sollst deine Hausaufgaben machen. Soll ich das Fenster schließen? Er soll sehr reich sein.* (so sagt man)
- **wollen**: Wunsch, Absicht. *Ich will nach Hause. Wir wollen ein Haus kaufen.*
- **mögen**: gern haben, meist mit einem Nomen. *Ich mag Pizza. Ich mag ihn nicht.*
- **möchte**: die höfliche Form des Wunsches. *Ich möchte einen Kaffee. Möchtest du mitkommen?*

**Zwei Fallen für Englischsprachige.**
- *must not* heißt **nicht dürfen**, nicht *nicht müssen*. *Du darfst das nicht* ist ein Verbot; *Du musst das nicht* heißt, dass es nicht nötig ist.
- *ich will* bedeutet *I want*, nicht *I will*. Das Futur bildet man mit *werden*: siehe *werden: Passiv und Futur*.

**Präteritum**, die Vergangenheitsform, die man auch beim Sprechen benutzt: *konnte, durfte, musste, sollte, wollte, mochte* (ohne Umlaut), konjugiert wie ein schwaches Verb: *ich konnte, du konntest, er konnte, wir konnten*. *Ich konnte gestern nicht kommen. Wir mussten lange warten.*

**Konjunktiv II**, die höflichen und hypothetischen Formen, holen den Umlaut zurück: *könnte, dürfte, müsste, sollte, wollte, möchte*. *Könnten Sie mir helfen? Du solltest mehr schlafen. Das müsste reichen.*

**Perfekt** mit Modalverb ist ein doppelter Infinitiv, *Ich habe arbeiten müssen*: richtig, aber selten gesagt; man nimmt das Präteritum: *Ich musste arbeiten.*

**Allein**, ohne zweites Verb: *Ich kann das. Ich will das nicht. Ich muss nach Hause. Ich mag Schokolade.*

**Im Nebensatz** steht das Modalverb ganz am Ende: *…, weil ich heute arbeiten **muss**.*`,
    },
  },

  {
    id: 'praepositionen',
    keywords: ['präpositionen', 'präposition', 'die präpositionen', 'präpositionen mit akkusativ',
      'präpositionen mit dativ', 'präpositionen mit genitiv', 'akkusativpräpositionen', 'dativpräpositionen',
      'wechselpräpositionen', 'wechselpräposition', 'durch für gegen ohne um', 'aus bei mit nach seit von zu',
      'an auf hinter in neben', 'wo oder wohin', 'wohin oder wo', 'in dem oder in den', 'im oder ins',
      'nach oder zu', 'zu oder nach', 'prepositions', 'preposition', 'two-way prepositions', 'two way prepositions',
      'accusative prepositions', 'dative prepositions', 'genitive prepositions', 'dual prepositions',
      'prepositions with dative', 'prepositions with accusative', 'in or into'],
    title: { de: 'Die Präpositionen', en: 'Prepositions and their cases' },
    body: {
      en: `Every preposition governs a case. Some always take the same one; nine of them switch between two, and those are the ones that cause the trouble.

**Always accusative**: *durch, für, gegen, ohne, um* (and *bis, entlang*, which follows its noun).
- *durch **den** Park, für **meinen** Bruder, gegen **die** Wand, ohne **dich**, um **die** Ecke*

**Always dative**: *aus, bei, mit, nach, seit, von, zu* (and *gegenüber, ab*).
- aus **der** Schweiz, bei **meiner** Oma, mit **dem** Zug, nach **dem** Essen, seit **einem** Jahr, von **meinem** Vater, zu **mir**

**Genitive** in writing: *während, wegen, trotz, (an)statt, innerhalb, außerhalb*.
- *während **des** Sommers, wegen **des** Wetters, trotz **der** Kälte*
- In speech *wegen* and *trotz* are very often heard with the dative (*wegen dem Wetter*). Write the genitive.

**The two-way prepositions (Wechselpräpositionen)**: *an, auf, hinter, in, neben, über, unter, vor, zwischen*.

| the question | the case | the idea | example |
| --- | --- | --- | --- |
| **wohin?** (where to?) | **accusative** | movement towards a destination, a change of place | *Ich gehe **in die** Schule.* |
| **wo?** (where?) | **dative** | position, where something is or happens | *Ich bin **in der** Schule.* |

- *Er hängt das Bild **an die** Wand.* (puts it up) against *Das Bild hängt **an der** Wand.* (it is there)
- *Sie setzt sich **auf den** Stuhl.* against *Sie sitzt **auf dem** Stuhl.*
- *Wir fahren **ans** Meer.* against *Wir wohnen **am** Meer.*
- *Stell die Flasche **in den** Kühlschrank.* against *Die Flasche steht **im** Kühlschrank.*

Movement alone is not enough: the question is whether there is a **destination**. *Ich laufe im Park* (I run around inside the park, dative) against *Ich laufe in den Park* (I run into the park, accusative).

**Contractions** are normal, not casual: an dem → **am**, an das → **ans**, in dem → **im**, in das → **ins**, zu dem → **zum**, zu der → **zur**, von dem → **vom**, bei dem → **beim**. Ich gehe ins Kino. Wir treffen uns am Bahnhof.

**Nach, zu or in for "to"?**
- **nach** with cities, countries and continents that have no article, and in *nach Hause*: *nach Berlin, nach Deutschland, nach Hause*
- **in** + accusative with countries that have an article, and for going **into** a building: *in die Schweiz, in die Türkei, in die USA, ins Kino, in die Stadt*
- **zu** + dative for people, and for a place as a destination you are heading towards: *zu Lisa, zum Arzt, zur Arbeit, zum Bahnhof*
- and *at home* is *zu Hause*, with *zu*.

**Verbs come with their own preposition**, and the case is fixed with it: *warten **auf** (A), sich freuen **auf** (A, something coming) / **über** (A, something that happened), denken **an** (A), sich interessieren **für** (A), Angst haben **vor** (D), sprechen **mit** (D) / **über** (A), träumen **von** (D)*. Learn the verb, the preposition and the case as one item: *warten auf + Akkusativ*. For *darauf, worauf* and the rest see *da- und wo-Komposita*.`,
      de: `Jede Präposition regiert einen Fall. Einige nehmen immer denselben; neun wechseln zwischen zwei Fällen, und die machen die Schwierigkeiten.

**Immer Akkusativ**: *durch, für, gegen, ohne, um* (und *bis, entlang*, das hinter seinem Nomen steht).
- *durch **den** Park, für **meinen** Bruder, gegen **die** Wand, ohne **dich**, um **die** Ecke*

**Immer Dativ**: *aus, bei, mit, nach, seit, von, zu* (und *gegenüber, ab*).
- aus **der** Schweiz, bei **meiner** Oma, mit **dem** Zug, nach **dem** Essen, seit **einem** Jahr, von **meinem** Vater, zu **mir**

**Genitiv** in der Schriftsprache: *während, wegen, trotz, (an)statt, innerhalb, außerhalb*.
- *während **des** Sommers, wegen **des** Wetters, trotz **der** Kälte*
- Beim Sprechen hört man *wegen* und *trotz* sehr oft mit dem Dativ (*wegen dem Wetter*). Geschrieben wird der Genitiv.

**Die Wechselpräpositionen**: *an, auf, hinter, in, neben, über, unter, vor, zwischen*.

| die Frage | der Fall | die Idee | Beispiel |
| --- | --- | --- | --- |
| **wohin?** | **Akkusativ** | Bewegung auf ein Ziel zu, Ortswechsel | *Ich gehe **in die** Schule.* |
| **wo?** | **Dativ** | Lage, wo etwas ist oder geschieht | *Ich bin **in der** Schule.* |

- *Er hängt das Bild **an die** Wand.* gegenüber *Das Bild hängt **an der** Wand.*
- *Sie setzt sich **auf den** Stuhl.* gegenüber *Sie sitzt **auf dem** Stuhl.*
- *Wir fahren **ans** Meer.* gegenüber *Wir wohnen **am** Meer.*
- *Stell die Flasche **in den** Kühlschrank.* gegenüber *Die Flasche steht **im** Kühlschrank.*

Bewegung allein genügt nicht; die Frage ist, ob es ein **Ziel** gibt. *Ich laufe im Park* (ich laufe innerhalb des Parks herum, Dativ) gegenüber *Ich laufe in den Park* (ich laufe hinein, Akkusativ).

**Verschmelzungen** sind normal, nicht salopp: an dem → **am**, an das → **ans**, in dem → **im**, in das → **ins**, zu dem → **zum**, zu der → **zur**, von dem → **vom**, bei dem → **beim**. Ich gehe ins Kino. Wir treffen uns am Bahnhof.

**Nach, zu oder in?**
- **nach** bei Städten, Ländern und Kontinenten ohne Artikel und in *nach Hause*: *nach Berlin, nach Deutschland, nach Hause*
- **in** + Akkusativ bei Ländern mit Artikel und beim Betreten eines Gebäudes: *in die Schweiz, in die Türkei, in die USA, ins Kino, in die Stadt*
- **zu** + Dativ bei Personen und bei einem Ort als Ziel, auf das man zugeht: *zu Lisa, zum Arzt, zur Arbeit, zum Bahnhof*
- und *zu Hause* mit *zu*, wenn man dort ist.

**Verben bringen ihre eigene Präposition mit**, und der Fall ist damit festgelegt: *warten **auf** (A), sich freuen **auf** (A, etwas Kommendes) / **über** (A, etwas Geschehenes), denken **an** (A), sich interessieren **für** (A), Angst haben **vor** (D), sprechen **mit** (D) / **über** (A), träumen **von** (D)*. Verb, Präposition und Fall lernt man als eine Einheit: *warten auf + Akkusativ*. Zu *darauf, worauf* und Verwandtem siehe *da- und wo-Komposita*.`,
    },
  },

  {
    id: 'adjektivendungen',
    keywords: ['adjektivendungen', 'adjektivendung', 'adjektivdeklination', 'deklination der adjektive',
      'deklination des adjektivs', 'adjektive', 'adjektiv', 'adjektive deklinieren', 'endungen der adjektive',
      'starke deklination', 'schwache deklination', 'gemischte deklination', 'ein guter mann', 'der gute mann',
      'adjective endings', 'adjective ending', 'adjective declension', 'adjectives', 'adjective', 'declension',
      'weak declension', 'strong declension', 'mixed declension', 'endings on adjectives'],
    title: { de: 'Die Adjektivendungen', en: 'Adjective endings' },
    body: {
      en: `An adjective **after** its noun, or after *sein*, takes no ending at all: *Der Mann ist alt. Das Haus ist groß.* An adjective **before** its noun always has an ending, and the ending depends on three things: the gender and case of the noun, and **what stands in front of the adjective**.

The logic is that the case has to be shown **once**. If the article shows it (*der, dem, des*), the adjective can relax and take a weak ending, *-e* or *-en*. If there is no article, the adjective has to show the case itself and takes the article's own ending. *Ein* is in between: it shows the case in some forms and not in others.

**1. After der, die, das** (and *dieser, jeder, welcher, alle*): the **weak** endings. Only *-e* and *-en*.

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | der alt**e** Mann | die alt**e** Frau | das alt**e** Haus | die alt**en** Leute |
| Akkusativ | den alt**en** Mann | die alt**e** Frau | das alt**e** Haus | die alt**en** Leute |
| Dativ | dem alt**en** Mann | der alt**en** Frau | dem alt**en** Haus | den alt**en** Leuten |
| Genitiv | des alt**en** Mannes | der alt**en** Frau | des alt**en** Hauses | der alt**en** Leute |

The rule in one line: **-e** in the nominative singular and in the feminine and neuter accusative singular; **-en** everywhere else.

**2. After ein, kein and the possessives** (*mein, dein, sein, ihr, unser, euer, Ihr*): the **mixed** endings. Where *ein* has no ending of its own (masculine nominative, neuter nominative and accusative), the adjective supplies it: *-er, -es*. Elsewhere, as after *der*.

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | ein alt**er** Mann | eine alt**e** Frau | ein alt**es** Haus | keine alt**en** Leute |
| Akkusativ | einen alt**en** Mann | eine alt**e** Frau | ein alt**es** Haus | keine alt**en** Leute |
| Dativ | einem alt**en** Mann | einer alt**en** Frau | einem alt**en** Haus | keinen alt**en** Leuten |
| Genitiv | eines alt**en** Mannes | einer alt**en** Frau | eines alt**en** Hauses | keiner alt**en** Leute |

**3. No article** (plurals, materials, abstract nouns, after numbers): the **strong** endings, which are the endings of *der, die, das* moved onto the adjective (except the genitive singular masculine and neuter, where the noun's *-s* already shows the case and the adjective takes *-en*).

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | alt**er** Wein | frisch**e** Milch | kalt**es** Wasser | gut**e** Freunde |
| Akkusativ | alt**en** Wein | frisch**e** Milch | kalt**es** Wasser | gut**e** Freunde |
| Dativ | alt**em** Wein | frisch**er** Milch | kalt**em** Wasser | gut**en** Freunden |
| Genitiv | alt**en** Weines | frisch**er** Milch | kalt**en** Wassers | gut**er** Freunde |

*Ich trinke gern kalt**es** Wasser. Mit freundlich**en** Grüßen. Viele Grüße von gut**en** Freunden.*

**Several adjectives** in a row all take the same ending: *ein kleines, altes, gemütliches Haus.*

**Small spelling changes**: *hoch → ein hoh**es** Haus* (the *c* drops), *dunkel → ein dunkl**es** Zimmer, teuer → ein teur**es** Auto* (the *e* drops), and colour words from other languages take no ending: *ein rosa Kleid, eine lila Tasche*.

Comparatives and superlatives before a noun take exactly the same endings: *ein älterer Bruder, die schönste Stadt*. See *Komparativ und Superlativ*.

The honest advice: the tables are learnt by use, not by heart. Say *der alte Mann, ein alter Mann, alter Wein* out loud until the wrong one sounds wrong.`,
      de: `Ein Adjektiv **nach** seinem Nomen oder nach *sein* hat gar keine Endung: *Der Mann ist alt. Das Haus ist groß.* Ein Adjektiv **vor** seinem Nomen hat immer eine Endung, und die hängt von drei Dingen ab: vom Genus und Kasus des Nomens und davon, **was vor dem Adjektiv steht**.

Die Logik dahinter: Der Kasus muss **einmal** sichtbar sein. Zeigt ihn der Artikel (*der, dem, des*), kann sich das Adjektiv entspannen und nimmt eine schwache Endung, *-e* oder *-en*. Steht kein Artikel, muss das Adjektiv den Kasus selbst zeigen und übernimmt die Endung des Artikels. *Ein* liegt dazwischen: In manchen Formen zeigt es den Kasus, in anderen nicht.

**1. Nach der, die, das** (und *dieser, jeder, welcher, alle*): die **schwachen** Endungen. Nur *-e* und *-en*.

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | der alt**e** Mann | die alt**e** Frau | das alt**e** Haus | die alt**en** Leute |
| Akkusativ | den alt**en** Mann | die alt**e** Frau | das alt**e** Haus | die alt**en** Leute |
| Dativ | dem alt**en** Mann | der alt**en** Frau | dem alt**en** Haus | den alt**en** Leuten |
| Genitiv | des alt**en** Mannes | der alt**en** Frau | des alt**en** Hauses | der alt**en** Leute |

Die Regel in einem Satz: **-e** im Nominativ Singular sowie im Akkusativ Singular Femininum und Neutrum; **-en** überall sonst.

**2. Nach ein, kein und den Possessivartikeln** (*mein, dein, sein, ihr, unser, euer, Ihr*): die **gemischten** Endungen. Wo *ein* selbst keine Endung hat (Nominativ Maskulinum, Nominativ und Akkusativ Neutrum), liefert das Adjektiv sie nach: *-er, -es*. Sonst wie nach *der*.

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | ein alt**er** Mann | eine alt**e** Frau | ein alt**es** Haus | keine alt**en** Leute |
| Akkusativ | einen alt**en** Mann | eine alt**e** Frau | ein alt**es** Haus | keine alt**en** Leute |
| Dativ | einem alt**en** Mann | einer alt**en** Frau | einem alt**en** Haus | keinen alt**en** Leuten |
| Genitiv | eines alt**en** Mannes | einer alt**en** Frau | eines alt**en** Hauses | keiner alt**en** Leute |

**3. Ohne Artikel** (Plural, Stoffe, Abstrakta, nach Zahlen): die **starken** Endungen, also die Endungen von *der, die, das* am Adjektiv (außer im Genitiv Singular Maskulinum und Neutrum, wo das *-s* des Nomens den Kasus schon zeigt und das Adjektiv *-en* nimmt).

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | alt**er** Wein | frisch**e** Milch | kalt**es** Wasser | gut**e** Freunde |
| Akkusativ | alt**en** Wein | frisch**e** Milch | kalt**es** Wasser | gut**e** Freunde |
| Dativ | alt**em** Wein | frisch**er** Milch | kalt**em** Wasser | gut**en** Freunden |
| Genitiv | alt**en** Weines | frisch**er** Milch | kalt**en** Wassers | gut**er** Freunde |

*Ich trinke gern kalt**es** Wasser. Mit freundlich**en** Grüßen. Viele Grüße von gut**en** Freunden.*

**Mehrere Adjektive** hintereinander bekommen alle dieselbe Endung: *ein kleines, altes, gemütliches Haus.*

**Kleine Veränderungen in der Schreibung**: *hoch → ein hoh**es** Haus* (das *c* fällt weg), *dunkel → ein dunkl**es** Zimmer, teuer → ein teur**es** Auto* (das *e* fällt weg), und Farbwörter aus anderen Sprachen bleiben ohne Endung: *ein rosa Kleid, eine lila Tasche*.

Komparativ und Superlativ vor dem Nomen bekommen genau dieselben Endungen: *ein älterer Bruder, die schönste Stadt*. Siehe *Komparativ und Superlativ*.

Ehrlicher Rat: Die Tabellen lernt man durch den Gebrauch, nicht auswendig. *Der alte Mann, ein alter Mann, alter Wein* so oft laut sagen, bis die falsche Form falsch klingt.`,
    },
  },

  {
    id: 'konjunktiv-ii',
    keywords: ['konjunktiv ii', 'konjunktiv 2', 'konjunktiv zwei', 'konjunktiv', 'der konjunktiv', 'würde',
      'hätte', 'wäre', 'würde hätte wäre', 'hätte wäre würde', 'wäre hätte würde', 'wurde oder würde',
      'konditional', 'konditionalsatz', 'konditionalsätze', 'bedingungssatz', 'wenn ich wäre',
      'wenn ich hätte', 'irreal', 'irrealis', 'wünsche', 'höfliche bitte', 'höfliche bitten', 'subjunctive',
      'conditional', 'if clauses', 'if clause', 'hypothetical', 'hypotheticals', 'polite requests',
      'unreal conditions', 'wishes', 'would have'],
    title: { de: 'Der Konjunktiv II: würde, hätte, wäre', en: 'Konjunktiv II: würde, hätte, wäre' },
    body: {
      en: `The Konjunktiv II is the mood of what is **not** the case: what you would do, what you wish were true, what you ask for politely. English does it with *would*, *could*, *were*; German has one set of forms for all of that.

**Three forms carry almost everything:**

| | würde | hätte | wäre |
| --- | --- | --- | --- |
| ich | würde | hätte | wäre |
| du | würdest | hättest | wär(e)st |
| er / sie / es | würde | hätte | wäre |
| wir | würden | hätten | wären |
| ihr | würdet | hättet | wär(e)t |
| sie / Sie | würden | hätten | wären |

- For **almost every verb**, use **würde + infinitive** at the end: *Ich würde gern nach Japan reisen. Was würdest du machen?*
- For **haben** and **sein**, use **hätte** and **wäre** themselves, never *würde haben* or *würde sein*: *Ich hätte gern einen Kaffee. Das wäre schön.*
- The **modal verbs** have their own forms, which are the Präteritum with an umlaut: *könnte, müsste, dürfte, sollte, wollte, möchte*: *Könntest du mir helfen? Du solltest mehr schlafen.*
- A few common strong verbs keep a one-word form, used mainly in writing: *käme, ginge, gäbe, wüsste, ließe, fände, bliebe*. *Es gäbe* and *ich wüsste* are heard in speech too. In speech, *würde kommen* is fine instead of *käme*.

The one-word forms come from the **Präteritum plus an umlaut**: *hatte → hätte, war → wäre, konnte → könnte, kam → käme, wusste → wüsste*. That is why **wurde** (Präteritum: *it became*, or the passive) and **würde** (Konjunktiv: *would*) are two different words, two dots apart.

**When:**
1. **Politeness.** *Ich hätte gern ein Brot. Könnten Sie das wiederholen? Würdest du mir bitte helfen? Ich möchte zahlen.*
2. **Wishes.** *Wenn ich doch mehr Zeit hätte! Ich wünschte, ich wäre am Meer. Wenn er nur käme!*
3. **Unreal conditions** (*if I were …*): Konjunktiv II in **both** halves. *Wenn ich reich wäre, würde ich ein Haus kaufen. Wenn ich du wäre, würde ich das nicht machen.* The *wenn* clause has verb-last order; the main clause starts with the verb when the *wenn* clause comes first.
4. **Advice.** *An deiner Stelle würde ich warten. Du solltest zum Arzt gehen.*
5. **Careful statements.** *Das wäre alles. Ich würde sagen, das stimmt. Das dürfte reichen.*

**The past**: *hätte* or *wäre* + the Partizip II, for *would have done*. *Wenn ich das gewusst hätte, wäre ich nicht gekommen. Ich hätte dich angerufen, aber mein Handy war leer.* With a modal, both verbs go to the end as infinitives: *Ich hätte das wissen müssen.* (I should have known) *Du hättest kommen können.*

**Real conditions** stay in the indicative: *Wenn es regnet, bleibe ich zu Hause.* The Konjunktiv II is only for the ones that are not, or not yet, true.

In everyday speech *würde* spreads further than the grammar books like, and *bräuchte* (for *brauchte*) is heard everywhere and is now in the dictionary as colloquial. *Hätte, wäre* and the modal forms are never replaced, though: *ich würde sein* marks a learner.`,
      de: `Der Konjunktiv II ist der Modus für das, was **nicht** der Fall ist: was man tun würde, was man sich wünscht, worum man höflich bittet. Das Englische macht das mit *would, could, were*; das Deutsche hat dafür einen einzigen Satz von Formen.

**Drei Formen tragen fast alles:**

| | würde | hätte | wäre |
| --- | --- | --- | --- |
| ich | würde | hätte | wäre |
| du | würdest | hättest | wär(e)st |
| er / sie / es | würde | hätte | wäre |
| wir | würden | hätten | wären |
| ihr | würdet | hättet | wär(e)t |
| sie / Sie | würden | hätten | wären |

- Bei **fast allen Verben** nimmt man **würde + Infinitiv** am Satzende: *Ich würde gern nach Japan reisen. Was würdest du machen?*
- Bei **haben** und **sein** nimmt man **hätte** und **wäre** selbst, nie *würde haben* oder *würde sein*: *Ich hätte gern einen Kaffee. Das wäre schön.*
- Die **Modalverben** haben eigene Formen, das Präteritum mit Umlaut: *könnte, müsste, dürfte, sollte, wollte, möchte*: *Könntest du mir helfen? Du solltest mehr schlafen.*
- Einige häufige starke Verben behalten eine Einwortform, vor allem in der Schriftsprache: *käme, ginge, gäbe, wüsste, ließe, fände, bliebe*. *Es gäbe* und *ich wüsste* hört man auch beim Sprechen. Gesprochen ist *würde kommen* statt *käme* völlig in Ordnung.

Die Einwortformen entstehen aus dem **Präteritum plus Umlaut**: *hatte → hätte, war → wäre, konnte → könnte, kam → käme, wusste → wüsste*. Deshalb sind **wurde** (Präteritum von *werden*, auch im Passiv) und **würde** (Konjunktiv) zwei verschiedene Wörter, zwei Punkte voneinander entfernt.

**Wann:**
1. **Höflichkeit.** *Ich hätte gern ein Brot. Könnten Sie das wiederholen? Würdest du mir bitte helfen? Ich möchte zahlen.*
2. **Wünsche.** *Wenn ich doch mehr Zeit hätte! Ich wünschte, ich wäre am Meer. Wenn er nur käme!*
3. **Irreale Bedingungen**: Konjunktiv II in **beiden** Hälften. *Wenn ich reich wäre, würde ich ein Haus kaufen. Wenn ich du wäre, würde ich das nicht machen.* Der *wenn*-Satz hat das Verb am Ende; steht er vorne, beginnt der Hauptsatz mit dem Verb.
4. **Ratschläge.** *An deiner Stelle würde ich warten. Du solltest zum Arzt gehen.*
5. **Vorsichtige Aussagen.** *Das wäre alles. Ich würde sagen, das stimmt. Das dürfte reichen.*

**Die Vergangenheit**: *hätte* oder *wäre* + Partizip II. *Wenn ich das gewusst hätte, wäre ich nicht gekommen. Ich hätte dich angerufen, aber mein Handy war leer.* Mit Modalverb stehen beide Verben als Infinitive am Ende: *Ich hätte das wissen müssen. Du hättest kommen können.*

**Reale Bedingungen** bleiben im Indikativ: *Wenn es regnet, bleibe ich zu Hause.* Der Konjunktiv II ist nur für das, was nicht oder noch nicht wahr ist.

In der Alltagssprache breitet sich *würde* weiter aus, als es den Grammatiken lieb ist, und *bräuchte* (statt *brauchte*) hört man überall; es steht inzwischen als umgangssprachlich im Wörterbuch. *Hätte, wäre* und die Modalformen werden aber nie ersetzt: *ich würde sein* verrät den Lernenden.`,
    },
  },

  {
    id: 'konjunktiv-i',
    keywords: ['konjunktiv i', 'konjunktiv 1', 'konjunktiv eins', 'indirekte rede', 'die indirekte rede',
      'redewiedergabe', 'er sagte dass', 'er sagt er sei', 'er sei', 'sie habe', 'sie sei', 'reported speech',
      'indirect speech', 'he said that', 'quoting someone', 'konjunktiv der indirekten rede'],
    title: { de: 'Der Konjunktiv I und die indirekte Rede', en: 'Konjunktiv I and reported speech' },
    body: {
      en: `The Konjunktiv I is the mood of **reported speech**: it marks that you are passing on what someone said, without saying whether it is true. It belongs to writing, above all to news reporting, and a learner needs to recognise it long before producing it.

**Formation.** The stem of the infinitive + **-e, -est, -e, -en, -et, -en**. No vowel change anywhere, so *er habe, er könne, er wisse, er fahre*.

| | haben | können | kommen | sein |
| --- | --- | --- | --- | --- |
| ich | habe | könne | komme | **sei** |
| du | habest | könnest | kommest | sei(e)st |
| er / sie / es | **habe** | **könne** | **komme** | **sei** |
| wir | haben | können | kommen | **seien** |
| ihr | habet | könnet | kommet | seiet |
| sie / Sie | haben | können | kommen | **seien** |

*Sein* is the only verb that is irregular, and the only one with a complete set of distinct forms.

**In practice only the third person singular matters**, because the other forms look exactly like the indicative. Where the Konjunktiv I would be identical to the indicative (*wir haben, sie kommen*), the **Konjunktiv II** steps in: *Sie sagten, sie **hätten** keine Zeit* rather than *sie haben*.

**Reported speech.**
- *Er sagt: „Ich habe keine Zeit.“* → *Er sagt, er **habe** keine Zeit.*
- *Sie sagte: „Ich bin krank.“* → *Sie sagte, sie **sei** krank.*
- *„Ich kann morgen kommen.“* → *Er sagte, er **könne** morgen kommen.*
- The past of what was said becomes *habe / sei + Partizip II*: *„Ich habe das Buch gelesen.“* → *Sie sagte, sie **habe** das Buch **gelesen**.* *„Ich war in Berlin.“* → *Er sagte, er **sei** in Berlin **gewesen**.*
- With *dass*, the verb goes to the end: *Er sagte, **dass** er keine Zeit **habe**.*

Notice that the tense of the main verb does not matter: *er sagt* and *er sagte* are both followed by *er habe*. There is no backshift as in English (*he said he had*).

**In speech**, nobody says *er habe*. Everyday German reports with the **indicative**, usually after *dass*: *Er hat gesagt, dass er keine Zeit hat.* Or with the Konjunktiv II when you want to keep your distance: *Er hat gesagt, er hätte keine Zeit.* All three are heard; the Konjunktiv I is what a newspaper writes and what a teacher expects in a formal text.

**Fixed expressions** keep old Konjunktiv I forms alive: *Gott sei Dank* (thank God), *Es lebe die Königin!* (long live), *Man nehme zwei Eier …* (take two eggs, in recipes), *Sei es, wie es sei* (be that as it may).`,
      de: `Der Konjunktiv I ist der Modus der **indirekten Rede**: Er zeigt, dass man weitergibt, was jemand gesagt hat, ohne zu sagen, ob es stimmt. Er gehört zur Schriftsprache, vor allem zu den Nachrichten, und wer Deutsch lernt, muss ihn lange erkennen können, bevor er ihn selbst bildet.

**Bildung.** Der Stamm des Infinitivs + **-e, -est, -e, -en, -et, -en**. Nirgends ein Vokalwechsel, also *er habe, er könne, er wisse, er fahre*.

| | haben | können | kommen | sein |
| --- | --- | --- | --- | --- |
| ich | habe | könne | komme | **sei** |
| du | habest | könnest | kommest | sei(e)st |
| er / sie / es | **habe** | **könne** | **komme** | **sei** |
| wir | haben | können | kommen | **seien** |
| ihr | habet | könnet | kommet | seiet |
| sie / Sie | haben | können | kommen | **seien** |

*Sein* ist das einzige unregelmäßige Verb und das einzige mit einem vollständigen Satz eigener Formen.

**Praktisch zählt nur die dritte Person Singular**, denn die anderen Formen sehen genau aus wie der Indikativ. Wo der Konjunktiv I mit dem Indikativ zusammenfiele (*wir haben, sie kommen*), springt der **Konjunktiv II** ein: *Sie sagten, sie **hätten** keine Zeit* statt *sie haben*.

**Die indirekte Rede.**
- *Er sagt: „Ich habe keine Zeit.“* → *Er sagt, er **habe** keine Zeit.*
- *Sie sagte: „Ich bin krank.“* → *Sie sagte, sie **sei** krank.*
- *„Ich kann morgen kommen.“* → *Er sagte, er **könne** morgen kommen.*
- Die Vergangenheit des Gesagten wird zu *habe / sei + Partizip II*: *„Ich habe das Buch gelesen.“* → *Sie sagte, sie **habe** das Buch **gelesen**.* *„Ich war in Berlin.“* → *Er sagte, er **sei** in Berlin **gewesen**.*
- Mit *dass* geht das Verb ans Ende: *Er sagte, **dass** er keine Zeit **habe**.*

Die Zeitform des einleitenden Verbs spielt keine Rolle: Auf *er sagt* und auf *er sagte* folgt gleichermaßen *er habe*. Eine Zeitverschiebung wie im Englischen (*he said he had*) gibt es nicht.

**Beim Sprechen** sagt niemand *er habe*. Die Alltagssprache gibt Gesagtes im **Indikativ** wieder, meist mit *dass*: *Er hat gesagt, dass er keine Zeit hat.* Oder mit dem Konjunktiv II, wenn man Abstand halten will: *Er hat gesagt, er hätte keine Zeit.* Alle drei Formen hört man; der Konjunktiv I ist das, was die Zeitung schreibt und was die Lehrkraft in einem formellen Text erwartet.

**Feste Wendungen** halten alte Formen des Konjunktivs I am Leben: *Gott sei Dank*, *Es lebe die Königin!*, *Man nehme zwei Eier …* (in Rezepten), *Sei es, wie es sei*.`,
    },
  },

  {
    id: 'nicht-kein',
    keywords: ['nicht oder kein', 'kein oder nicht', 'nicht und kein', 'kein und nicht', 'nicht vs kein',
      'unterschied zwischen nicht und kein', 'verneinung', 'die verneinung', 'negation', 'kein', 'keine', 'keinen',
      'position von nicht', 'stellung von nicht', 'wo steht nicht', 'nicht am ende', 'noch nicht',
      'nicht mehr', 'negative', 'negatives', 'negative sentences', 'how to negate', 'negating', 'not or no',
      'where does nicht go', 'position of nicht', 'double negative', 'double negatives'],
    title: { de: 'Nicht und kein: die Verneinung', en: 'Nicht and kein: negation' },
    body: {
      en: `German has two words for *not*, and which one you use depends on **what you are negating**.

**Kein** negates a **noun** that has an indefinite article or no article at all. It replaces *ein*, and declines like it:
- *Ich habe **einen** Hund.* → *Ich habe **keinen** Hund.*
- *Ich habe Zeit.* → *Ich habe **keine** Zeit.*
- *Das ist **ein** Problem.* → *Das ist **kein** Problem.*
- *Ich habe Geschwister.* → *Ich habe **keine** Geschwister.*

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | kein | keine | kein | keine |
| Akkusativ | keinen | keine | kein | keine |
| Dativ | keinem | keiner | keinem | keinen |
| Genitiv | keines | keiner | keines | keiner |

*Kein* often translates as *no* or *not any*: *Ich habe kein Geld* = I have no money.

**Nicht** negates **everything else**: the verb, an adjective, an adverb, a prepositional phrase, and a noun that has a definite article or a possessive.
- *Ich komme **nicht**.* *Das ist **nicht** mein Auto.* *Ich kenne **den** Mann **nicht**.*
- *Er ist **nicht** müde.* *Sie wohnt **nicht** in Berlin.*

**Where does nicht go?** The rough rule: as far to the **right** as it can, but **in front of** anything that belongs to the verb.

1. Negating the whole sentence, with a simple verb: **at the end**. *Ich verstehe das nicht. Er kommt heute nicht.*
2. **In front of** the second part of the verb: the participle, the infinitive, the separable prefix. *Ich habe das **nicht** verstanden. Ich kann heute **nicht** kommen. Ich rufe dich **nicht** an.*
3. **In front of** a predicate adjective or noun after *sein, werden, bleiben*: *Das ist **nicht** richtig. Er wird **nicht** Lehrer.*
4. **In front of** a prepositional phrase of place or direction: *Ich fahre **nicht** nach Hamburg. Wir sind **nicht** zu Hause.*
5. **In front of** the one word it contrasts, in which case a *sondern* usually follows: *Ich komme **nicht** heute, sondern morgen.*

Time expressions, by contrast, come before *nicht*: *Ich komme heute nicht.*

**Other negative words**: *nie* / *niemals* (never), *nichts* (nothing), *niemand* (nobody), *nirgends* / *nirgendwo* (nowhere), *noch nicht* (not yet), *nicht mehr* (no longer), *noch kein* (none yet), *kein … mehr* (no more). *Ich habe **noch nicht** gegessen. Ich habe **kein** Geld **mehr**.*

**No double negative**: one negative word per idea. *Ich habe nichts gesehen*, not *ich habe nicht nichts gesehen*. *Niemand war da*, and that is all.

**Doch** is the answer English lacks: *yes* to a negative question. *Kommst du nicht mit?* *Doch!* (Yes, I am.) *Hast du keine Zeit?* *Doch, ich habe Zeit.* A plain *ja* would be ambiguous; *doch* contradicts the *nicht*.`,
      de: `Das Deutsche hat zwei Wörter für die Verneinung, und welches man nimmt, hängt davon ab, **was man verneint**.

**Kein** verneint ein **Nomen**, das einen unbestimmten Artikel oder gar keinen Artikel hat. Es ersetzt *ein* und wird genauso dekliniert:
- *Ich habe **einen** Hund.* → *Ich habe **keinen** Hund.*
- *Ich habe Zeit.* → *Ich habe **keine** Zeit.*
- *Das ist **ein** Problem.* → *Das ist **kein** Problem.*
- *Ich habe Geschwister.* → *Ich habe **keine** Geschwister.*

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | kein | keine | kein | keine |
| Akkusativ | keinen | keine | kein | keine |
| Dativ | keinem | keiner | keinem | keinen |
| Genitiv | keines | keiner | keines | keiner |

Im Englischen entspricht *kein* oft *no* oder *not any*: *Ich habe kein Geld* = *I have no money*.

**Nicht** verneint **alles andere**: das Verb, ein Adjektiv, ein Adverb, eine Präpositionalgruppe und ein Nomen mit bestimmtem Artikel oder Possessivartikel.
- *Ich komme **nicht**.* *Das ist **nicht** mein Auto.* *Ich kenne **den** Mann **nicht**.*
- *Er ist **nicht** müde.* *Sie wohnt **nicht** in Berlin.*

**Wo steht nicht?** Die Faustregel: so weit **rechts** wie möglich, aber **vor** allem, was zum Verb gehört.

1. Verneint man den ganzen Satz und das Verb ist einteilig: **am Ende**. *Ich verstehe das nicht. Er kommt heute nicht.*
2. **Vor** dem zweiten Teil des Verbs: dem Partizip, dem Infinitiv, der trennbaren Vorsilbe. *Ich habe das **nicht** verstanden. Ich kann heute **nicht** kommen. Ich rufe dich **nicht** an.*
3. **Vor** einem Adjektiv oder Nomen nach *sein, werden, bleiben*: *Das ist **nicht** richtig. Er wird **nicht** Lehrer.*
4. **Vor** einer Orts- oder Richtungsangabe mit Präposition: *Ich fahre **nicht** nach Hamburg. Wir sind **nicht** zu Hause.*
5. **Vor** dem einen Wort, das man gezielt verneint; dann folgt meist *sondern*: *Ich komme **nicht** heute, sondern morgen.*

Zeitangaben stehen dagegen vor *nicht*: *Ich komme heute nicht.*

**Weitere Verneinungswörter**: *nie* / *niemals*, *nichts*, *niemand*, *nirgends* / *nirgendwo*, *noch nicht*, *nicht mehr*, *noch kein*, *kein … mehr*. *Ich habe **noch nicht** gegessen. Ich habe **kein** Geld **mehr**.*

**Keine doppelte Verneinung**: ein Verneinungswort pro Gedanke. *Ich habe nichts gesehen*, nicht *ich habe nicht nichts gesehen*. *Niemand war da*, und damit fertig.

**Doch** ist die Antwort, die dem Englischen fehlt: ein Ja auf eine verneinte Frage. *Kommst du nicht mit?* *Doch!* *Hast du keine Zeit?* *Doch, ich habe Zeit.* Ein bloßes *ja* wäre hier unklar; *doch* widerspricht dem *nicht*.`,
    },
  },

  {
    id: 'pronomen-du-sie',
    keywords: ['personalpronomen', 'die personalpronomen', 'pronomen', 'du oder sie', 'du und sie', 'sie oder du',
      'duzen', 'siezen', 'duzen oder siezen', 'höflichkeitsform', 'anrede', 'ich du er sie es', 'mir oder mich',
      'mich oder mir', 'ihm oder ihn', 'ihn oder ihm', 'dir oder dich', 'dich oder dir', 'personal pronouns',
      'personal pronoun', 'pronouns', 'pronoun', 'subject pronouns', 'object pronouns', 'formal you',
      'informal you', 'formal', 'informal', 'du vs sie', 'three meanings of sie', 'when to use sie', 'register'],
    title: { de: 'Die Personalpronomen: du, ihr und Sie', en: 'Personal pronouns, and du against Sie' },
    body: {
      en: `**The pronouns in three cases.** They change with the case like the articles do, and the genitive is so rare it is left out here.

| | Nominativ | Akkusativ | Dativ |
| --- | --- | --- | --- |
| I | ich | mich | mir |
| you (one person, informal) | du | dich | dir |
| he | er | ihn | ihm |
| she | sie | sie | ihr |
| it | es | es | ihm |
| we | wir | uns | uns |
| you (several people, informal) | ihr | euch | euch |
| they | sie | sie | ihnen |
| you (formal, one or many) | Sie | Sie | Ihnen |

- *Ich sehe **dich**. Ich helfe **dir**.* (helfen takes the dative)
- *Kennst du **ihn**? Gib **ihm** das Buch.*
- *Ich danke **Ihnen**.* (formal) *Ich danke **euch**.* (to friends)

*Er, sie, es* stand for nouns, not only for people, and follow the **grammatical** gender: *Der Tisch? **Er** ist neu. Die Tür? **Sie** ist offen. Das Mädchen? **Es** heißt Anna* (grammatically; in speech *sie* is common for a girl).

**Sie, sie, sie.** Three different words share one spelling: **sie** = she (verb in the singular), **sie** = they (verb in the plural), **Sie** = you, formal, always with a **capital S** and always with the **plural** verb: *Sie kommen, Sie haben, Sie sind.* In writing the capital settles it; in speech the verb and the context do.

**Three ways of saying *you*:**
- **du** to one person you are on familiar terms with: family, friends, children, fellow students, pets, God. Young people use it among themselves as a matter of course, and it is the norm online and in most sports clubs.
- **ihr** to several people you would each call *du*: *Kommt ihr mit?*
- **Sie** to one or more adults you do not know, and in formal settings: shop staff, officials, teachers, colleagues at first, anyone older in a professional situation. *Können Sie mir helfen? Woher kommen Sie?*

At school the teacher says *du* to pupils up to about the age of sixteen and often *Sie* after that; pupils say *Sie* to their teachers throughout.

**Everything follows along.** The possessives are *dein / euer / Ihr*, the reflexive is *dich / euch / sich*, and the imperative has three forms: *Komm! Kommt! Kommen Sie!* The formal pronouns *Sie, Ihnen, Ihr* are capitalised everywhere; *du, dich, dein* may be capitalised in letters as a courtesy, but need not be.

**Switching** from *Sie* to *du* is a small ceremony, and the offer comes from the older or more senior person: *Wir können uns duzen. Sag doch du.* When in doubt, start with *Sie*: too formal is a small mistake, too familiar can be a real one.`,
      de: `**Die Pronomen in drei Fällen.** Sie verändern sich mit dem Kasus wie die Artikel; der Genitiv ist so selten, dass er hier fehlt.

| | Nominativ | Akkusativ | Dativ |
| --- | --- | --- | --- |
| 1. Person Singular | ich | mich | mir |
| 2. Person Singular | du | dich | dir |
| 3. Person Singular, maskulin | er | ihn | ihm |
| 3. Person Singular, feminin | sie | sie | ihr |
| 3. Person Singular, neutral | es | es | ihm |
| 1. Person Plural | wir | uns | uns |
| 2. Person Plural | ihr | euch | euch |
| 3. Person Plural | sie | sie | ihnen |
| Höflichkeitsform | Sie | Sie | Ihnen |

- *Ich sehe **dich**. Ich helfe **dir**.* (helfen verlangt den Dativ)
- *Kennst du **ihn**? Gib **ihm** das Buch.*
- *Ich danke **Ihnen**.* (höflich) *Ich danke **euch**.* (unter Freunden)

*Er, sie, es* stehen für Nomen, nicht nur für Personen, und richten sich nach dem **grammatischen** Geschlecht: *Der Tisch? **Er** ist neu. Die Tür? **Sie** ist offen. Das Mädchen? **Es** heißt Anna* (grammatisch korrekt; beim Sprechen sagt man für ein Mädchen oft *sie*).

**Sie, sie, sie.** Drei verschiedene Wörter teilen sich eine Schreibung: **sie** = die Frau oder die Sache im Femininum (Verb im Singular), **sie** = mehrere (Verb im Plural), **Sie** = die höfliche Anrede, immer mit **großem S** und immer mit dem Verb im **Plural**: *Sie kommen, Sie haben, Sie sind.* Beim Schreiben entscheidet der Großbuchstabe, beim Sprechen das Verb und der Zusammenhang.

**Drei Arten, jemanden anzusprechen:**
- **du** zu einer Person, der man vertraut ist: Familie, Freunde, Kinder, Mitschüler, Haustiere, Gott. Junge Leute duzen sich untereinander selbstverständlich, und im Internet und in den meisten Sportvereinen ist das Du die Regel.
- **ihr** zu mehreren Personen, die man einzeln duzen würde: *Kommt ihr mit?*
- **Sie** zu einem oder mehreren Erwachsenen, die man nicht kennt, und in formellen Situationen: Verkäufer, Beamte, Lehrkräfte, anfangs auch Kollegen, ältere Menschen im beruflichen Umfeld. *Können Sie mir helfen? Woher kommen Sie?*

In der Schule duzt die Lehrkraft die Schüler bis etwa sechzehn und siezt sie danach oft; die Schüler siezen ihre Lehrkräfte durchgehend.

**Alles richtet sich danach.** Die Possessivartikel heißen *dein / euer / Ihr*, das Reflexivpronomen *dich / euch / sich*, und der Imperativ hat drei Formen: *Komm! Kommt! Kommen Sie!* Die höflichen Formen *Sie, Ihnen, Ihr* schreibt man immer groß; *du, dich, dein* kann man in Briefen aus Höflichkeit großschreiben, muss es aber nicht.

**Der Wechsel** vom Sie zum Du ist eine kleine Zeremonie, und das Angebot kommt von der älteren oder ranghöheren Person: *Wir können uns duzen. Sag doch du.* Im Zweifel mit *Sie* beginnen: Zu förmlich ist ein kleiner Fehler, zu vertraulich kann ein echter sein.`,
    },
  },

  {
    id: 'reflexive-verben',
    keywords: ['reflexive verben', 'reflexives verb', 'reflexiv', 'reflexivpronomen',
      'sich', 'mich dich sich', 'mir dir sich', 'sich freuen', 'sich waschen', 'sich erinnern', 'reflexive verbs',
      'reflexive verb', 'reflexive', 'reflexive pronouns', 'reflexive pronoun', 'myself yourself',
      'verbs with sich', 'reciprocal', 'each other', 'einander'],
    title: { de: 'Die reflexiven Verben', en: 'Reflexive verbs' },
    body: {
      en: `A reflexive verb has **sich** in front of its infinitive in the dictionary: *sich freuen, sich waschen, sich erinnern*. The *sich* points back at the subject, and it changes with the person.

| | accusative | dative |
| --- | --- | --- |
| ich | mich | mir |
| du | dich | dir |
| er / sie / es | sich | sich |
| wir | uns | uns |
| ihr | euch | euch |
| sie / Sie | sich | sich |

Only *ich* and *du* have different accusative and dative forms. Everyone else uses the same word in both.

**Position.** The reflexive pronoun stands right after the conjugated verb, or right after the subject when the subject has moved behind the verb:
- *Ich freue **mich**.* *Heute freue ich **mich**.* *Freust du **dich**?*
- in a subordinate clause, before the verb at the end: *…, weil ich **mich** freue.*
- with a modal: *Ich muss **mich** beeilen.*

**Three kinds of reflexive verb.**

1. **Always reflexive**, with no non-reflexive twin: *sich beeilen* (hurry), *sich erholen* (recover), *sich erkälten* (catch a cold), *sich verabschieden* (say goodbye), *sich bedanken* (say thank you), *sich ausruhen* (rest). *Beeil dich! Ich habe mich erkältet.*
2. **Reflexive with a preposition**, where the preposition carries the meaning: sich freuen **auf** (look forward to), sich freuen **über** (be pleased about), sich erinnern **an** (remember), sich interessieren **für** (be interested in), sich kümmern **um** (look after), sich ärgern **über** (be annoyed at). Ich freue mich auf das Wochenende. Erinnerst du dich an ihn?
3. **Reflexive only when the action turns back on the subject**: waschen, anziehen, setzen, kämmen, verletzen. Ich wasche **mich** (myself) against Ich wasche **das Auto**. Setz **dich**! (sit down) against Setz **das Kind** auf den Stuhl.

**Accusative or dative?** Accusative when the reflexive pronoun is the only object. **Dative when there is another, accusative object**, which is very often a part of the body or a piece of clothing:
- *Ich wasche **mich**.* but *Ich wasche **mir** die Hände.*
- *Ich ziehe **mich** an.* but *Ich ziehe **mir** eine Jacke an.*
- *Ich kaufe **mir** ein Eis.* *Ich habe **mir** den Arm gebrochen.*

Note the article where English has a possessive: *die Hände*, not *meine Hände*. The dative pronoun already says whose.

**Perfekt**: always with **haben**, and the pronoun stays where it was: *Ich habe mich gefreut. Wir haben uns gut erholt.* French and Italian switch auxiliary here; German does not.

**Reciprocal**, *each other*: the plural reflexive does the job, and *einander* or *gegenseitig* can make it explicit. *Wir kennen **uns** seit Jahren. Sie lieben **sich**. Wir helfen **einander**.*

**Impersonal uses** with *sich* to watch for: *Das Buch liest **sich** gut.* (reads well) *Es lohnt **sich**.* (it is worth it) *Das versteht **sich** von selbst.*`,
      de: `Ein reflexives Verb steht im Wörterbuch mit **sich** vor dem Infinitiv: *sich freuen, sich waschen, sich erinnern*. Das *sich* bezieht sich auf das Subjekt zurück und ändert sich mit der Person.

| | Akkusativ | Dativ |
| --- | --- | --- |
| ich | mich | mir |
| du | dich | dir |
| er / sie / es | sich | sich |
| wir | uns | uns |
| ihr | euch | euch |
| sie / Sie | sich | sich |

Nur *ich* und *du* haben im Akkusativ und Dativ verschiedene Formen. Alle anderen benutzen in beiden Fällen dasselbe Wort.

**Die Stellung.** Das Reflexivpronomen steht gleich nach dem konjugierten Verb oder gleich nach dem Subjekt, wenn das Subjekt hinter das Verb gerückt ist:
- *Ich freue **mich**.* *Heute freue ich **mich**.* *Freust du **dich**?*
- im Nebensatz vor dem Verb am Ende: *…, weil ich **mich** freue.*
- mit Modalverb: *Ich muss **mich** beeilen.*

**Drei Arten von reflexiven Verben.**

1. **Immer reflexiv**, ohne nicht-reflexiven Zwilling: *sich beeilen, sich erholen, sich erkälten, sich verabschieden, sich bedanken, sich ausruhen*. *Beeil dich! Ich habe mich erkältet.*
2. **Reflexiv mit Präposition**, wobei die Präposition die Bedeutung trägt: sich freuen **auf** (etwas Kommendes), sich freuen **über** (etwas Geschehenes), sich erinnern **an**, sich interessieren **für**, sich kümmern **um**, sich ärgern **über**. Ich freue mich auf das Wochenende. Erinnerst du dich an ihn?
3. **Nur dann reflexiv, wenn die Handlung auf das Subjekt zurückfällt**: waschen, anziehen, setzen, kämmen, verletzen. Ich wasche **mich** gegenüber Ich wasche **das Auto**. Setz **dich**! gegenüber Setz **das Kind** auf den Stuhl.

**Akkusativ oder Dativ?** Akkusativ, wenn das Reflexivpronomen das einzige Objekt ist. **Dativ, wenn es noch ein Akkusativobjekt gibt**, sehr oft einen Körperteil oder ein Kleidungsstück:
- *Ich wasche **mich**.* aber *Ich wasche **mir** die Hände.*
- *Ich ziehe **mich** an.* aber *Ich ziehe **mir** eine Jacke an.*
- *Ich kaufe **mir** ein Eis.* *Ich habe **mir** den Arm gebrochen.*

Man beachte den Artikel, wo das Englische ein Possessivpronomen setzt: *die Hände*, nicht *meine Hände*. Das Dativpronomen sagt schon, wessen Hände.

**Perfekt**: immer mit **haben**, und das Pronomen bleibt, wo es war: *Ich habe mich gefreut. Wir haben uns gut erholt.* Französisch und Italienisch wechseln hier das Hilfsverb; das Deutsche nicht.

**Reziprok**, also gegenseitig: Das Reflexivpronomen im Plural übernimmt das, und *einander* oder *gegenseitig* kann es deutlich machen. *Wir kennen **uns** seit Jahren. Sie lieben **sich**. Wir helfen **einander**.*

**Unpersönliche Wendungen** mit *sich*, die man kennen sollte: *Das Buch liest **sich** gut. Es lohnt **sich**. Das versteht **sich** von selbst.*`,
    },
  },

  {
    id: 'komparativ-superlativ',
    keywords: ['komparativ', 'superlativ', 'komparativ und superlativ', 'steigerung', 'steigerungsformen',
      'steigerung der adjektive', 'adjektive steigern', 'vergleich', 'vergleiche', 'als oder wie', 'wie oder als',
      'größer als', 'so groß wie', 'am besten', 'am meisten', 'besser', 'gern lieber am liebsten', 'lieber',
      'immer besser', 'je desto', 'comparative', 'comparatives', 'superlative', 'superlatives', 'comparison',
      'comparisons', 'more than', 'bigger than', 'as as', 'the most', 'the best'],
    title: { de: 'Komparativ und Superlativ', en: 'Comparatives and superlatives' },
    body: {
      en: `German compares the way English compares short adjectives, with endings, and it does it for **every** adjective, however long. There is no more interesting: it is interessant**er**.

**Comparative: -er. Superlative: -st** (or *-est* after *-d, -t, -s, -ß, -z, -sch*, for the sake of pronunciation).

| | comparative | superlative |
| --- | --- | --- |
| schnell | schneller | am schnellsten |
| klein | kleiner | am kleinsten |
| interessant | interessanter | am interessantesten |
| laut | lauter | am lautesten |
| heiß | heißer | am heißesten |

**Many one-syllable adjectives with a, o, u take an umlaut**: *alt → älter → am ältesten, jung → jünger, groß → größer, lang → länger, kurz → kürzer, warm → wärmer, kalt → kälter, stark → stärker, klug → klüger, hart → härter, oft → öfter*. Not all do: *laut, bunt, klar, voll, rund* stay as they are.

**Irregular**, and used all the time:

| | comparative | superlative |
| --- | --- | --- |
| gut | besser | am besten |
| viel | mehr | am meisten |
| gern | lieber | am liebsten |
| hoch | höher | am höchsten |
| nah | näher | am nächsten |
| groß | größer | am größten |

**Comparing two things.**
- **als** after a comparative: *Ich bin älter **als** du. Berlin ist größer **als** Hamburg.*
- **(genau)so … wie** for equality: *Er ist **so** groß **wie** ich. Sie ist genauso klug wie ihr Bruder.*
- English speakers mix *als* and *wie* up; German speakers do too, in speech (*größer wie*), and it is one of the mistakes teachers mark most readily. After a comparative, always *als*.
- *Mehr* and *weniger* work as expected, but are never doubled onto an adjective: *mehr Zeit*, yes; *mehr groß*, no.

**The superlative** has two shapes:
- **am -sten**, which never changes, after a verb: *Dieser Weg ist **am kürzesten**. Ich laufe **am schnellsten**. Ich trinke **am liebsten** Tee.*
- **der / die / das -ste** before a noun, or standing for one, with the normal adjective endings: *der kürzeste Weg, die schönste Stadt, das beste Buch. Anna ist **die Beste**.*

**Comparatives before a noun** take the normal endings too: *ein jünger**er** Bruder, ein besser**es** Angebot, mit schneller**en** Autos*. See *Adjektivendungen*.

**Adverbs** use the same forms, since German does not mark adverbs separately: *Sie läuft schnell, er läuft schneller, ich laufe am schnellsten.*

**Gern, lieber, am liebsten** is how you say what you like doing: *Ich spiele gern Fußball. Ich schwimme lieber. Am liebsten lese ich.* (I like, I prefer, I like best.)

**Two useful patterns**: *immer* + comparative for *more and more* (*Es wird immer kälter. Sie spricht immer besser Deutsch.*), and *je … desto* for *the … the* (*Je mehr ich übe, desto besser werde ich.*), with the verb at the end of the *je* clause.`,
      de: `Das Deutsche vergleicht so, wie das Englische kurze Adjektive vergleicht, mit Endungen, und es tut das bei **jedem** Adjektiv, egal wie lang. Ein more interesting gibt es nicht: Es heißt interessant**er**.

**Komparativ: -er. Superlativ: -st** (oder *-est* nach *-d, -t, -s, -ß, -z, -sch*, der Aussprache wegen).

| | Komparativ | Superlativ |
| --- | --- | --- |
| schnell | schneller | am schnellsten |
| klein | kleiner | am kleinsten |
| interessant | interessanter | am interessantesten |
| laut | lauter | am lautesten |
| heiß | heißer | am heißesten |

**Viele einsilbige Adjektive mit a, o, u bekommen einen Umlaut**: *alt → älter → am ältesten, jung → jünger, groß → größer, lang → länger, kurz → kürzer, warm → wärmer, kalt → kälter, stark → stärker, klug → klüger, hart → härter, oft → öfter*. Nicht alle: *laut, bunt, klar, voll, rund* bleiben, wie sie sind.

**Unregelmäßig**, und ständig im Gebrauch:

| | Komparativ | Superlativ |
| --- | --- | --- |
| gut | besser | am besten |
| viel | mehr | am meisten |
| gern | lieber | am liebsten |
| hoch | höher | am höchsten |
| nah | näher | am nächsten |
| groß | größer | am größten |

**Zwei Dinge vergleichen.**
- **als** nach dem Komparativ: *Ich bin älter **als** du. Berlin ist größer **als** Hamburg.*
- **(genau)so … wie** bei Gleichheit: *Er ist **so** groß **wie** ich. Sie ist genauso klug wie ihr Bruder.*
- *Als* und *wie* werden auch von Muttersprachlern beim Sprechen verwechselt (*größer wie*), und es gehört zu den Fehlern, die Lehrkräfte am schnellsten anstreichen. Nach dem Komparativ steht immer *als*.
- *Mehr* und *weniger* funktionieren wie erwartet, werden aber nie zusätzlich vor ein Adjektiv gesetzt: *mehr Zeit* ja, *mehr groß* nein.

**Der Superlativ** hat zwei Gestalten:
- **am -sten**, unveränderlich, nach dem Verb: *Dieser Weg ist **am kürzesten**. Ich laufe **am schnellsten**. Ich trinke **am liebsten** Tee.*
- **der / die / das -ste** vor einem Nomen oder an dessen Stelle, mit den normalen Adjektivendungen: *der kürzeste Weg, die schönste Stadt, das beste Buch. Anna ist **die Beste**.*

**Komparative vor einem Nomen** bekommen ebenfalls die normalen Endungen: *ein jünger**er** Bruder, ein besser**es** Angebot, mit schneller**en** Autos*. Siehe *Adjektivendungen*.

**Adverbien** benutzen dieselben Formen, denn das Deutsche markiert Adverbien nicht eigens: *Sie läuft schnell, er läuft schneller, ich laufe am schnellsten.*

**Gern, lieber, am liebsten** drückt aus, was man gern tut: *Ich spiele gern Fußball. Ich schwimme lieber. Am liebsten lese ich.*

**Zwei nützliche Muster**: *immer* + Komparativ für eine Steigerung (*Es wird immer kälter. Sie spricht immer besser Deutsch.*) und *je … desto* für eine Abhängigkeit (*Je mehr ich übe, desto besser werde ich.*), mit dem Verb am Ende des *je*-Satzes.`,
    },
  },

  {
    id: 'relativsaetze',
    keywords: ['relativsatz', 'relativsätze', 'der relativsatz', 'relativpronomen', 'das relativpronomen',
      'relativpronomen der die das', 'dessen', 'deren', 'denen', 'den oder dem', 'welcher welche welches',
      'relative clause', 'relative clauses', 'relative pronoun', 'relative pronouns', 'who which that',
      'who or which', 'whose', 'the man who', 'the woman who'],
    title: { de: 'Die Relativsätze', en: 'Relative clauses' },
    body: {
      en: `A relative clause tells you more about a noun: the man **who lives next door**. In German it is introduced by a **relative pronoun**, it is always set off by **commas**, and its verb goes to the **end**.

*Der Mann, **der** nebenan wohnt, ist Arzt.*

**The relative pronouns** are the definite articles, with three exceptions in bold:

| | masculine | feminine | neuter | plural |
| --- | --- | --- | --- | --- |
| Nominativ | der | die | das | die |
| Akkusativ | den | die | das | die |
| Dativ | dem | der | dem | **denen** |
| Genitiv | **dessen** | **deren** | **dessen** | **deren** |

**Two decisions, made separately.** The **gender and number** come from the noun being described. The **case** comes from the pronoun's job inside the relative clause. Look at the relative clause on its own and ask what the pronoun is doing there.

- *Der Mann, **der** dort steht, …* (he is standing: subject, nominative)
- *Der Mann, **den** ich kenne, …* (I know him: direct object, accusative)
- *Der Mann, **dem** ich geholfen habe, …* (I helped him: *helfen* takes the dative)
- *Der Mann, **dessen** Auto dort steht, …* (his car: genitive, *whose*)
- *Die Frau, **die** ich kenne, …* and *Die Frau, **der** ich geholfen habe, …*
- *Die Kinder, **denen** ich geholfen habe, …* (dative plural)
- *Das Mädchen, **das** dort steht, …* (neuter, after *Mädchen*)

Nothing is ever left out: English says *the man I know*, German says *der Mann, den ich kenne*, pronoun included.

**With a preposition**, the preposition comes first and decides the case: *Der Freund, **mit dem** ich wohne. Die Stadt, **in der** ich geboren bin. Das Thema, **über das** wir gesprochen haben.* For places, **wo** is a common alternative: *Die Stadt, **wo** ich geboren bin.* For things, *über das* can become **worüber**, *mit dem* becomes **womit**: see *da- und wo-Komposita*.

**Was** instead of *das* after *alles, nichts, etwas, vieles, das* and after a neuter superlative or a whole clause: *Alles, **was** ich weiß. Das ist etwas, **was** ich nicht verstehe. Das Beste, **was** mir passieren konnte. Er kam zu spät, **was** mich ärgerte.*

**Welcher, welche, welches** also exist as relative pronouns, with the same endings but no genitive. They sound formal and are mostly used to avoid *die, die*: *die Frau, welche die Tür öffnete*. In everyday German, *der, die, das* is the norm.

**Word order.** The relative clause comes straight after its noun whenever possible, even if that splits the main clause: *Ich habe den Film, **den du empfohlen hast**, gestern gesehen.* Where the gap would be awkward, it moves to the end: *Ich habe gestern den Film gesehen, den du empfohlen hast.* Both are correct.`,
      de: `Ein Relativsatz sagt mehr über ein Nomen: der Mann, **der nebenan wohnt**. Er wird von einem **Relativpronomen** eingeleitet, steht immer zwischen **Kommas**, und sein Verb steht am **Ende**.

*Der Mann, **der** nebenan wohnt, ist Arzt.*

**Die Relativpronomen** sind die bestimmten Artikel, mit drei Ausnahmen in Fettdruck:

| | maskulin | feminin | neutral | Plural |
| --- | --- | --- | --- | --- |
| Nominativ | der | die | das | die |
| Akkusativ | den | die | das | die |
| Dativ | dem | der | dem | **denen** |
| Genitiv | **dessen** | **deren** | **dessen** | **deren** |

**Zwei Entscheidungen, getrennt getroffen.** **Genus und Numerus** kommen vom Nomen, das beschrieben wird. Der **Kasus** kommt von der Aufgabe des Pronomens im Relativsatz. Man betrachtet den Relativsatz für sich und fragt, was das Pronomen dort tut.

- *Der Mann, **der** dort steht, …* (er steht: Subjekt, Nominativ)
- *Der Mann, **den** ich kenne, …* (ich kenne ihn: Akkusativobjekt)
- *Der Mann, **dem** ich geholfen habe, …* (ich habe ihm geholfen: *helfen* verlangt den Dativ)
- *Der Mann, **dessen** Auto dort steht, …* (sein Auto: Genitiv)
- *Die Frau, **die** ich kenne, …* und *Die Frau, **der** ich geholfen habe, …*
- *Die Kinder, **denen** ich geholfen habe, …* (Dativ Plural)
- *Das Mädchen, **das** dort steht, …* (neutral, nach *Mädchen*)

Es wird nie etwas weggelassen: Das Englische sagt *the man I know*, das Deutsche sagt *der Mann, den ich kenne*, mit Pronomen.

**Mit Präposition** steht die Präposition zuerst und bestimmt den Fall: *Der Freund, **mit dem** ich wohne. Die Stadt, **in der** ich geboren bin. Das Thema, **über das** wir gesprochen haben.* Bei Orten ist **wo** eine häufige Alternative: *Die Stadt, **wo** ich geboren bin.* Bei Sachen kann aus *über das* **worüber** werden, aus *mit dem* **womit**: siehe *da- und wo-Komposita*.

**Was** statt *das* nach *alles, nichts, etwas, vieles, das*, nach einem neutralen Superlativ und nach einem ganzen Satz: *Alles, **was** ich weiß. Das ist etwas, **was** ich nicht verstehe. Das Beste, **was** mir passieren konnte. Er kam zu spät, **was** mich ärgerte.*

**Welcher, welche, welches** gibt es ebenfalls als Relativpronomen, mit denselben Endungen, aber ohne Genitiv. Sie klingen förmlich und dienen meist dazu, ein *die, die* zu vermeiden: *die Frau, welche die Tür öffnete*. Im Alltag ist *der, die, das* die Regel.

**Wortstellung.** Der Relativsatz folgt seinem Nomen möglichst direkt, auch wenn er dafür den Hauptsatz teilt: *Ich habe den Film, **den du empfohlen hast**, gestern gesehen.* Wo die Lücke unschön wäre, rückt er ans Ende: *Ich habe gestern den Film gesehen, den du empfohlen hast.* Beides ist richtig.`,
    },
  },

  {
    id: 'werden-passiv-futur',
    keywords: ['passiv', 'das passiv', 'vorgangspassiv', 'zustandspassiv', 'passivsatz', 'passivsätze',
      'passiv mit werden', 'passiv bilden', 'worden', 'worden oder geworden', 'geworden oder worden',
      'man oder passiv', 'werden', 'futur', 'futur i', 'futur 1', 'futur ii', 'futur 2', 'zukunft', 'die zukunft',
      'werden oder wollen', 'wollen oder werden', 'passive', 'passive voice', 'the passive', 'future',
      'future tense', 'the future', 'future perfect', 'going to', 'will or werden', 'how to say will',
      'three uses of werden', 'to become'],
    title: { de: 'Werden: Passiv und Futur', en: 'Werden: the passive and the future' },
    body: {
      en: `One verb does three jobs. On its own, **werden** means *to become*. As an auxiliary it builds the **future** (with an infinitive) and the **passive** (with a participle). Learn its forms once and you have all three.

| | present | Präteritum |
| --- | --- | --- |
| ich | werde | wurde |
| du | wirst | wurdest |
| er / sie / es | wird | wurde |
| wir | werden | wurden |
| ihr | werdet | wurdet |
| sie / Sie | werden | wurden |

Partizip II: **geworden** as a full verb, **worden** as the passive auxiliary. Perfekt with *sein*.

**1. To become.** *Es wird kalt. Sie wird Ärztin. Er ist krank geworden. Ich werde müde.* English often has a different verb here: *get cold, turn, grow*.

**2. The future: werden + infinitive** at the end of the clause.
- *Ich **werde** dich morgen **anrufen**. Wir **werden** sehen.*

But German uses the future tense far less than English does. For anything planned or clearly placed in time, the **present with a time word** is the normal form: *Ich rufe dich **morgen** an. **Nächstes Jahr** fahren wir nach Italien. Der Zug kommt um acht.* *Werden* comes in for predictions, promises, and firm intentions: *Es wird regnen. Ich werde es nie vergessen.*

Two traps: there is no *going to*, and **ich will** is *I want*, not *I will*. The modal *wollen* expresses a wish; the future is *werden*.

The future also makes a **guess about the present**, usually with *wohl*: *Er wird wohl krank sein.* (He is probably ill.) The **Futur II**, *werden + Partizip II + haben / sein*, does the same for the past, or says what will be finished by a certain time: *Er wird den Zug verpasst haben. Bis Freitag werde ich das Buch gelesen haben.*

**3. The passive: werden + Partizip II** at the end of the clause. What was the object becomes the subject.
- *Der Mechaniker repariert das Auto.* → *Das Auto **wird** repariert.*

| tense | example |
| --- | --- |
| present | *Das Haus **wird** gebaut.* |
| Präteritum | *Das Haus **wurde** gebaut.* |
| Perfekt | *Das Haus **ist** gebaut **worden**.* |
| Plusquamperfekt | *Das Haus **war** gebaut **worden**.* |
| with a modal | *Das Haus **muss** gebaut **werden**.* |
| future | *Das Haus **wird** gebaut **werden**.* |

Note **worden**, not *geworden*, in the Perfekt of the passive: *ist gebaut worden*.

- The person who does it, if mentioned at all, comes with **von** + dative: *Das Auto wird **von** einem Mechaniker repariert.* A means or cause takes *durch*: *Die Stadt wurde **durch** ein Erdbeben zerstört.*
- A **dative object stays dative**; it never becomes the subject. Man hilft mir. → **Mir** wird geholfen. or Es wird mir geholfen. Not ich werde geholfen.
- Verbs with no object at all can form an **impersonal passive**: *Hier wird getanzt. Es wurde viel gelacht.* (There is dancing here. There was a lot of laughter.)

**Sein + Partizip II** is the **Zustandspassiv**, the state after the action: *Das Fenster **ist** geöffnet* (it stands open) against *Das Fenster **wird** geöffnet* (someone is opening it). English *is opened* covers both; German keeps them apart.

**Man** is the everyday alternative to the passive when the doer does not matter: *Man spricht hier Deutsch. Das macht man nicht.* In speech it is often preferred.`,
      de: `Ein Verb mit drei Aufgaben. Allein bedeutet **werden** eine Veränderung. Als Hilfsverb bildet es das **Futur** (mit Infinitiv) und das **Passiv** (mit Partizip). Wer seine Formen einmal lernt, hat alle drei.

| | Präsens | Präteritum |
| --- | --- | --- |
| ich | werde | wurde |
| du | wirst | wurdest |
| er / sie / es | wird | wurde |
| wir | werden | wurden |
| ihr | werdet | wurdet |
| sie / Sie | werden | wurden |

Partizip II: **geworden** als Vollverb, **worden** als Hilfsverb des Passivs. Perfekt mit *sein*.

**1. Als Vollverb.** *Es wird kalt. Sie wird Ärztin. Er ist krank geworden. Ich werde müde.* Das Englische hat hier oft ein anderes Verb: *get cold, turn, grow*.

**2. Das Futur: werden + Infinitiv** am Satzende.
- *Ich **werde** dich morgen **anrufen**. Wir **werden** sehen.*

Das Deutsche benutzt das Futur aber viel seltener als das Englische. Für alles Geplante oder zeitlich klar Eingeordnete ist das **Präsens mit einer Zeitangabe** die normale Form: *Ich rufe dich **morgen** an. **Nächstes Jahr** fahren wir nach Italien. Der Zug kommt um acht.* *Werden* kommt bei Vorhersagen, Versprechen und festen Absichten ins Spiel: *Es wird regnen. Ich werde es nie vergessen.*

Zwei Fallen: Ein *going to* gibt es nicht, und **ich will** heißt *I want*, nicht *I will*. Das Modalverb *wollen* drückt einen Wunsch aus; das Futur ist *werden*.

Das Futur drückt auch eine **Vermutung über die Gegenwart** aus, meist mit *wohl*: *Er wird wohl krank sein.* Das **Futur II**, *werden + Partizip II + haben / sein*, tut dasselbe für die Vergangenheit oder sagt, was bis zu einem Zeitpunkt abgeschlossen sein wird: *Er wird den Zug verpasst haben. Bis Freitag werde ich das Buch gelesen haben.*

**3. Das Passiv: werden + Partizip II** am Satzende. Das Objekt wird zum Subjekt.
- *Der Mechaniker repariert das Auto.* → *Das Auto **wird** repariert.*

| Zeitform | Beispiel |
| --- | --- |
| Präsens | *Das Haus **wird** gebaut.* |
| Präteritum | *Das Haus **wurde** gebaut.* |
| Perfekt | *Das Haus **ist** gebaut **worden**.* |
| Plusquamperfekt | *Das Haus **war** gebaut **worden**.* |
| mit Modalverb | *Das Haus **muss** gebaut **werden**.* |
| Futur | *Das Haus **wird** gebaut **werden**.* |

Im Perfekt des Passivs heißt es **worden**, nicht *geworden*: *ist gebaut worden*.

- Wer es tut, steht, wenn überhaupt, mit **von** + Dativ: *Das Auto wird **von** einem Mechaniker repariert.* Ein Mittel oder eine Ursache steht mit *durch*: *Die Stadt wurde **durch** ein Erdbeben zerstört.*
- Ein **Dativobjekt bleibt Dativ**; es wird nie zum Subjekt. Man hilft mir. → **Mir** wird geholfen. oder Es wird mir geholfen. Nicht ich werde geholfen.
- Verben ohne Objekt bilden ein **unpersönliches Passiv**: *Hier wird getanzt. Es wurde viel gelacht.*

**Sein + Partizip II** ist das **Zustandspassiv**, der Zustand nach der Handlung: *Das Fenster **ist** geöffnet* (es steht offen) gegenüber *Das Fenster **wird** geöffnet* (jemand öffnet es gerade). Das englische *is opened* deckt beides ab; das Deutsche hält es auseinander.

**Man** ist die Alltagsalternative zum Passiv, wenn der Handelnde keine Rolle spielt: *Man spricht hier Deutsch. Das macht man nicht.* Beim Sprechen wird es oft vorgezogen.`,
    },
  },

  {
    id: 'konjunktionen',
    keywords: ['weil', 'weil oder denn', 'denn oder weil', 'weil und denn', 'unterschied zwischen weil und denn',
      'dass oder ob', 'ob oder dass', 'dass und ob', 'dass-satz', 'dass satz', 'dass sätze', 'nebensatz mit dass',
      'wenn oder als', 'als oder wenn', 'wenn und als', 'wann oder wenn', 'wenn oder wann', 'wenn wann als',
      'wenn als wann', 'als wenn wann', 'unterschied zwischen wenn und als', 'konjunktionen', 'konjunktion',
      'die konjunktionen', 'nebenordnende konjunktionen', 'unterordnende konjunktionen', 'subjunktionen',
      'obwohl', 'conjunctions', 'conjunction', 'because', 'whether', 'when if whether', 'weil vs denn', 'weil and denn',
      'weil or denn', 'between weil and denn', 'dass and ob', 'dass or ob', 'wenn and als', 'wenn or als', 'als or wenn',
      'how do i say because', 'how do i say when',
      'wenn vs als', 'dass vs ob', 'how to say because', 'how to say when', 'subordinating conjunctions',
      'coordinating conjunctions'],
    title: { de: 'Weil, denn, dass, ob, wenn, als, wann', en: 'Weil, denn, dass, ob, wenn, als, wann' },
    body: {
      en: `Seven small words that English folds into three (*because, that, when*), and that German keeps apart. The first question with each is always the same: **does it send the verb to the end?**

**Weil and denn** both mean *because*.
- **weil** is subordinating: the verb goes to the **end**. *Ich bleibe zu Hause, weil es **regnet**.*
- **denn** joins two main clauses: the word order **stays** as it was. *Ich bleibe zu Hause, denn es **regnet**.*
- Both are correct; *weil* is far more common, and *denn* sounds a little more written. *Da* is a third, more formal *because*, with the verb at the end like *weil*: *Da es regnet, bleibe ich zu Hause.*
- In speech you will hear *weil* with main-clause order (*weil, ich habe keine Zeit*). Everybody says it; nobody should write it.

**Dass and ob** both introduce a clause after verbs like *wissen, glauben, sagen, fragen*.
- **dass** = *that*, for a statement: *Ich weiß, dass er kommt. Ich glaube, dass es regnet.*
- **ob** = *whether, if*, for a **yes/no question** reported indirectly: *Ich weiß nicht, ob er kommt. Sie fragt, ob du Zeit hast.*
- Test: if the English *if* can be replaced by *whether*, it is *ob*. If it means *in case*, it is *wenn*.
- Spelling: **dass** with two s is the conjunction; **das** with one is the article or the relative pronoun. If you can replace it with *dieses* or *welches*, it is *das*. See *ß, Umlaute und Rechtschreibung*.

**Wenn, als and wann** all come out as *when* in English.

| | use it for | example |
| --- | --- | --- |
| **wenn** | *if*; *whenever*, repeated events in any tense; *when* in the present or future | *Wenn es regnet, bleibe ich zu Hause. Wenn ich in Berlin bin, besuche ich dich. Immer wenn er kam, brachte er Blumen.* |
| **als** | one single event or period **in the past** | *Als ich zehn war, sind wir umgezogen. Als er kam, war das Essen fertig.* |
| **wann** | the question *when?*, direct or indirect | *Wann kommst du? Ich weiß nicht, wann er kommt.* |

So: a single past event takes *als*; everything repeated, conditional or in the future takes *wenn*; a question takes *wann*. *Als ich jung war* (once); *Wenn ich jung war* is a mistake unless it means *whenever*.

All three send the verb to the end, and when the clause comes first, the main clause starts with its verb: *Wenn es regnet, **bleibe** ich zu Hause.*

**Other subordinating conjunctions** (verb at the end): *obwohl* (although), *damit* (so that), *bevor* (before), *nachdem* (after), *während* (while), *seit / seitdem* (since), *bis* (until), *sobald* (as soon as), *falls* (in case): *Obwohl es regnet, gehen wir spazieren.*

**The other coordinating conjunctions** (word order unchanged): *und, oder, aber, sondern*. *Aber* is *but* in general; **sondern** is *but* after a negative, correcting it: *nicht heute, sondern morgen.*

**Adverbs that look like conjunctions** take the first position and push the subject behind the verb: *deshalb, deswegen, darum* (therefore), *trotzdem* (nevertheless), *dann* (then), *also* (so). *Es regnet, **deshalb** bleibe ich zu Hause.* Compare *weil* in the same sentence: three ways to say the same thing, three word orders.`,
      de: `Sieben kleine Wörter, die das Englische auf drei zusammenzieht (*because, that, when*) und die das Deutsche auseinanderhält. Die erste Frage ist bei jedem dieselbe: **Schickt es das Verb ans Ende?**

**Weil und denn** bedeuten beide dasselbe.
- **weil** ordnet unter: Das Verb geht ans **Ende**. *Ich bleibe zu Hause, weil es **regnet**.*
- **denn** verbindet zwei Hauptsätze: Die Wortstellung **bleibt**, wie sie war. *Ich bleibe zu Hause, denn es **regnet**.*
- Beides ist richtig; *weil* ist viel häufiger, *denn* klingt etwas schriftlicher. *Da* ist ein drittes, förmlicheres Wort für den Grund, mit dem Verb am Ende wie bei *weil*: *Da es regnet, bleibe ich zu Hause.*
- Beim Sprechen hört man *weil* mit Hauptsatzstellung (*weil, ich habe keine Zeit*). Alle sagen es; schreiben sollte es niemand.

**Dass und ob** leiten beide einen Nebensatz nach Verben wie *wissen, glauben, sagen, fragen* ein.
- **dass** für eine Aussage: *Ich weiß, dass er kommt. Ich glaube, dass es regnet.*
- **ob** für eine indirekt wiedergegebene **Ja-Nein-Frage**: *Ich weiß nicht, ob er kommt. Sie fragt, ob du Zeit hast.*
- Probe: Kann man im Englischen *if* durch *whether* ersetzen, ist es *ob*. Bedeutet es *in case*, ist es *wenn*.
- Schreibung: **dass** mit zwei s ist die Konjunktion; **das** mit einem s ist Artikel oder Relativpronomen. Lässt es sich durch *dieses* oder *welches* ersetzen, ist es *das*. Siehe *ß, Umlaute und Rechtschreibung*.

**Wenn, als und wann** heißen im Englischen alle *when*.

| | wofür | Beispiel |
| --- | --- | --- |
| **wenn** | Bedingung; wiederholte Ereignisse in jeder Zeit; Zeitpunkt in Gegenwart oder Zukunft | *Wenn es regnet, bleibe ich zu Hause. Wenn ich in Berlin bin, besuche ich dich. Immer wenn er kam, brachte er Blumen.* |
| **als** | ein einzelnes Ereignis oder ein Zeitraum **in der Vergangenheit** | *Als ich zehn war, sind wir umgezogen. Als er kam, war das Essen fertig.* |
| **wann** | die Frage nach dem Zeitpunkt, direkt oder indirekt | *Wann kommst du? Ich weiß nicht, wann er kommt.* |

Also: Ein einmaliges Ereignis in der Vergangenheit nimmt *als*; alles Wiederholte, Bedingte oder Zukünftige nimmt *wenn*; eine Frage nimmt *wann*. *Als ich jung war* (einmal); *Wenn ich jung war* ist ein Fehler, außer es bedeutet *immer wenn*.

Alle drei schicken das Verb ans Ende, und steht der Nebensatz vorne, beginnt der Hauptsatz mit seinem Verb: *Wenn es regnet, **bleibe** ich zu Hause.*

**Weitere unterordnende Konjunktionen** (Verb am Ende): *obwohl, damit, bevor, nachdem, während, seit / seitdem, bis, sobald, falls*: *Obwohl es regnet, gehen wir spazieren.*

**Die übrigen nebenordnenden Konjunktionen** (Wortstellung unverändert): *und, oder, aber, sondern*. *Aber* ist der allgemeine Gegensatz; **sondern** steht nach einer Verneinung und korrigiert sie: *nicht heute, sondern morgen.*

**Adverbien, die wie Konjunktionen aussehen**, besetzen die erste Stelle und schieben das Subjekt hinter das Verb: *deshalb, deswegen, darum, trotzdem, dann, also*. *Es regnet, **deshalb** bleibe ich zu Hause.* Zum Vergleich *weil* im selben Satz: drei Arten, dasselbe zu sagen, drei Wortstellungen.`,
    },
  },

  {
    id: 'kennen-wissen',
    keywords: ['kennen', 'wissen', 'kennen oder wissen', 'wissen oder kennen', 'kennen und wissen',
      'wissen und kennen', 'kennen wissen können', 'wissen oder können', 'können oder wissen',
      'unterschied zwischen kennen und wissen', 'kennenlernen', 'bescheid wissen', 'to know', 'know how to',
      'kennen vs wissen', 'wissen vs kennen', 'know a person', 'know a fact'],
    title: { de: 'Kennen, wissen und können', en: 'Kennen, wissen and können: three ways to know' },
    body: {
      en: `English has one verb *to know*; German has two, plus *können* for the things you know how to do.

**Kennen**: to be acquainted with, to be familiar with. It always takes a **direct object**, a person, a place or a thing:
- *Ich kenne ihn. Kennst du Berlin? Ich kenne das Lied. Wir kennen uns seit Jahren.*
- Regular in the present (*kenne, kennst, kennt*), mixed in the past: *kannte, gekannt*.

**Wissen**: to know a fact, to have information. It is followed by a **clause** (*dass, ob, wo, wann, wie, warum …*) or by a small pronoun like *es, das, alles, nichts, viel*:
- *Ich weiß, dass er kommt. Weißt du, wo sie wohnt? Ich weiß es nicht. Er weiß alles.*
- Irregular, conjugated like a modal verb in the singular:

| | wissen |
| --- | --- |
| ich | weiß |
| du | weißt |
| er / sie / es | weiß |
| wir | wissen |
| ihr | wisst |
| sie / Sie | wissen |

Präteritum *wusste*, Partizip II *gewusst*: *Das habe ich nicht gewusst.*

The test: **a noun after it means kennen, a clause after it means wissen**. Ich kenne die Antwort (I know the answer: a thing) but Ich weiß die Antwort is also said, and Ich weiß, wie die Antwort lautet (a clause) can only be wissen. Kennst du den Weg? (familiar with it) against Weißt du, wo es ist?

**Können**: to know how to, a skill, and a language:
- *Ich kann schwimmen. Kannst du Klavier spielen? Sie kann Deutsch und Französisch.*
- Not *ich weiß schwimmen* or *ich kenne Deutsch*.

**Kennenlernen** is *to meet* for the first time, *to get to know*: *Ich habe sie in Berlin kennengelernt. Freut mich, Sie kennenzulernen.* The past of *kennen* is never the way to say you met someone.

Two useful expressions: *Bescheid wissen* (to be informed: *Weißt du schon Bescheid?*) and *sich auskennen* (to know one's way around: *Ich kenne mich hier nicht aus.*).`,
      de: `Das Englische hat ein Verb *to know*; das Deutsche hat zwei, dazu *können* für das, was man beherrscht.

**Kennen**: mit etwas vertraut sein. Es hat immer ein **Akkusativobjekt**, eine Person, einen Ort oder eine Sache:
- *Ich kenne ihn. Kennst du Berlin? Ich kenne das Lied. Wir kennen uns seit Jahren.*
- Regelmäßig im Präsens (*kenne, kennst, kennt*), gemischt in der Vergangenheit: *kannte, gekannt*.

**Wissen**: eine Tatsache kennen, eine Information haben. Darauf folgt ein **Nebensatz** (*dass, ob, wo, wann, wie, warum …*) oder ein kleines Pronomen wie *es, das, alles, nichts, viel*:
- *Ich weiß, dass er kommt. Weißt du, wo sie wohnt? Ich weiß es nicht. Er weiß alles.*
- Unregelmäßig, im Singular konjugiert wie ein Modalverb:

| | wissen |
| --- | --- |
| ich | weiß |
| du | weißt |
| er / sie / es | weiß |
| wir | wissen |
| ihr | wisst |
| sie / Sie | wissen |

Präteritum *wusste*, Partizip II *gewusst*: *Das habe ich nicht gewusst.*

Die Probe: **Folgt ein Nomen, ist es kennen; folgt ein Nebensatz, ist es wissen**. Ich kenne die Antwort (eine Sache), aber auch Ich weiß die Antwort wird gesagt, und Ich weiß, wie die Antwort lautet (ein Nebensatz) geht nur mit wissen. Kennst du den Weg? gegenüber Weißt du, wo es ist?

**Können**: eine Fertigkeit beherrschen, auch eine Sprache:
- *Ich kann schwimmen. Kannst du Klavier spielen? Sie kann Deutsch und Französisch.*
- Nicht *ich weiß schwimmen* oder *ich kenne Deutsch*.

**Kennenlernen** heißt, jemanden zum ersten Mal treffen: *Ich habe sie in Berlin kennengelernt. Freut mich, Sie kennenzulernen.* Die Vergangenheit von *kennen* bedeutet nie, dass man jemanden getroffen hat.

Zwei nützliche Wendungen: *Bescheid wissen* (informiert sein: *Weißt du schon Bescheid?*) und *sich auskennen* (sich zurechtfinden: *Ich kenne mich hier nicht aus.*).`,
    },
  },

  {
    id: 'imperativ',
    keywords: ['imperativ', 'der imperativ', 'befehlsform', 'befehle', 'aufforderung', 'aufforderungen',
      'imperativ bilden', 'imperativ mit sie', 'imperativ mit du', 'imperative', 'imperatives', 'command form',
      'commands', 'command', 'giving orders', 'orders', 'how to tell someone to', 'instructions'],
    title: { de: 'Der Imperativ', en: 'The imperative' },
    body: {
      en: `The imperative has three forms, one for each way of saying *you*: **du**, **ihr** and **Sie**. The verb comes **first** in the sentence, and the separable prefix, if there is one, goes to the end.

| | kommen | nehmen | fahren | arbeiten |
| --- | --- | --- | --- | --- |
| du | Komm! | Nimm! | Fahr! | Arbeite! |
| ihr | Kommt! | Nehmt! | Fahrt! | Arbeitet! |
| Sie | Kommen Sie! | Nehmen Sie! | Fahren Sie! | Arbeiten Sie! |

**The du form** is the present *du* form **without -st and without the pronoun**: *du kommst → Komm! du gehst → Geh! du machst → Mach!*
- Verbs that change **e to i / ie** in the *du* form keep the change: *du nimmst → Nimm! du gibst → Gib! du sprichst → Sprich! du liest → Lies! du isst → Iss!*
- Verbs that take an **umlaut** in the *du* form lose it again: *du fährst → Fahr! du schläfst → Schlaf! du läufst → Lauf!*
- An **-e** may be added (*Komme! Gehe!*), which sounds formal or old-fashioned, but it is **required** when the stem ends in *-d, -t, -ig* or in a consonant cluster that would be unpronounceable: *Arbeite! Warte! Rede! Entschuldige! Öffne! Atme!*

**The ihr form** is simply the present *ihr* form without the pronoun: *ihr kommt → Kommt! ihr wartet → Wartet!*

**The Sie form** is the infinitive followed by *Sie*: *Kommen Sie! Warten Sie bitte! Nehmen Sie Platz!* It is also the form used for strangers, so it is the one you need most when travelling.

**Sein, haben, werden** are irregular:

| | sein | haben | werden |
| --- | --- | --- | --- |
| du | Sei ruhig! | Hab keine Angst! | Werde nicht nervös! |
| ihr | Seid leise! | Habt Geduld! | Werdet nicht nervös! |
| Sie | Seien Sie so nett! | Haben Sie Geduld! | Werden Sie nicht nervös! |

**Separable and reflexive verbs**: the prefix goes to the end, the reflexive pronoun follows the verb: *Steh auf! Ruf mich an! Macht die Tür zu! Setz dich! Beeilt euch! Setzen Sie sich!*

**Softening it.** A bare imperative can sound brusque; German adds **bitte**, **mal** or **doch**: *Komm doch mal her. Gib mir bitte das Salz. Mach mal das Fenster auf.* For a real request to a stranger, the Konjunktiv II is politer still: *Könnten Sie mir bitte helfen?*

**Wir**: *Gehen wir! Fangen wir an!* or *Lass uns gehen!* (let's go).

**Written instructions**, signs and recipes often use the bare **infinitive** instead: *Bitte hier warten. Nicht öffnen. Zwiebeln klein schneiden.*`,
      de: `Der Imperativ hat drei Formen, eine für jede Art der Anrede: **du**, **ihr** und **Sie**. Das Verb steht **vorne** im Satz, und die trennbare Vorsilbe, wenn es eine gibt, am Ende.

| | kommen | nehmen | fahren | arbeiten |
| --- | --- | --- | --- | --- |
| du | Komm! | Nimm! | Fahr! | Arbeite! |
| ihr | Kommt! | Nehmt! | Fahrt! | Arbeitet! |
| Sie | Kommen Sie! | Nehmen Sie! | Fahren Sie! | Arbeiten Sie! |

**Die du-Form** ist die *du*-Form des Präsens **ohne -st und ohne Pronomen**: *du kommst → Komm! du gehst → Geh! du machst → Mach!*
- Verben, die in der *du*-Form **e zu i / ie** wechseln, behalten den Wechsel: *du nimmst → Nimm! du gibst → Gib! du sprichst → Sprich! du liest → Lies! du isst → Iss!*
- Verben, die in der *du*-Form einen **Umlaut** bekommen, verlieren ihn wieder: *du fährst → Fahr! du schläfst → Schlaf! du läufst → Lauf!*
- Ein **-e** kann angehängt werden (*Komme! Gehe!*), was förmlich oder altmodisch klingt, ist aber **Pflicht**, wenn der Stamm auf *-d, -t, -ig* oder auf eine Konsonantengruppe endet, die sich sonst nicht sprechen ließe: *Arbeite! Warte! Rede! Entschuldige! Öffne! Atme!*

**Die ihr-Form** ist einfach die *ihr*-Form des Präsens ohne Pronomen: *ihr kommt → Kommt! ihr wartet → Wartet!*

**Die Sie-Form** ist der Infinitiv mit nachgestelltem *Sie*: *Kommen Sie! Warten Sie bitte! Nehmen Sie Platz!* Das ist zugleich die Form für Fremde, also die, die man unterwegs am meisten braucht.

**Sein, haben, werden** sind unregelmäßig:

| | sein | haben | werden |
| --- | --- | --- | --- |
| du | Sei ruhig! | Hab keine Angst! | Werde nicht nervös! |
| ihr | Seid leise! | Habt Geduld! | Werdet nicht nervös! |
| Sie | Seien Sie so nett! | Haben Sie Geduld! | Werden Sie nicht nervös! |

**Trennbare und reflexive Verben**: Die Vorsilbe geht ans Ende, das Reflexivpronomen folgt dem Verb: *Steh auf! Ruf mich an! Macht die Tür zu! Setz dich! Beeilt euch! Setzen Sie sich!*

**Abmildern.** Ein nackter Imperativ kann schroff klingen; das Deutsche setzt **bitte**, **mal** oder **doch** dazu: *Komm doch mal her. Gib mir bitte das Salz. Mach mal das Fenster auf.* Für eine echte Bitte an Fremde ist der Konjunktiv II noch höflicher: *Könnten Sie mir bitte helfen?*

**Wir**: *Gehen wir! Fangen wir an!* oder *Lass uns gehen!*

**Schriftliche Anweisungen**, Schilder und Rezepte benutzen oft den bloßen **Infinitiv**: *Bitte hier warten. Nicht öffnen. Zwiebeln klein schneiden.*`,
    },
  },

  {
    id: 'zu-infinitiv',
    keywords: ['infinitiv mit zu', 'zu infinitiv', 'zu-infinitiv', 'infinitiv ohne zu', 'um zu', 'um … zu',
      'ohne zu', 'anstatt zu', 'statt zu', 'infinitivsatz', 'infinitivsätze', 'infinitivgruppe', 'wann steht zu',
      'zu vor dem infinitiv', 'damit oder um zu', 'um zu oder damit', 'infinitive with zu', 'infinitive clause',
      'infinitive clauses', 'in order to', 'when do i use zu', 'zu before the infinitive', 'to infinitive',
      'zu or no zu', 'anzurufen', 'aufzustehen'],
    title: { de: 'Der Infinitiv mit zu und um … zu', en: 'The infinitive with zu, and um … zu' },
    body: {
      en: `When one verb depends on another, German usually puts **zu** in front of the dependent infinitive and sends it to the **end** of the clause, exactly where English puts *to*.

**Zu + infinitive** after most verbs, adjectives and nouns:
- after verbs: *Ich habe vor, nach Berlin **zu fahren**. Er versucht, Deutsch **zu lernen**. Sie hat vergessen, mich **anzurufen**. Ich hoffe, dich bald **zu sehen**.*
- after *es ist + adjective*: *Es ist schwer, Deutsch **zu lernen**. Es ist wichtig, pünktlich **zu sein**.*
- after nouns like *Lust, Zeit, Angst, die Möglichkeit*: *Ich habe keine Lust **zu kochen**. Hast du Zeit, mir **zu helfen**?*
- after *beginnen, anfangen, aufhören, scheinen, brauchen (nicht / nur)*: *Es fängt an **zu regnen**. Du brauchst nicht **zu kommen**.* (you needn't come)

**With a separable verb, zu goes between the prefix and the stem**, written as one word: *an**zu**rufen, auf**zu**stehen, ein**zu**kaufen, mit**zu**kommen*. With an inseparable verb or any other verb, *zu* is a separate word: *zu besuchen, zu verstehen, zu lesen*.

**No zu** after:
- the **modal verbs**: *Ich muss gehen. Ich kann schwimmen.*
- **werden** in the future: *Ich werde kommen.*
- **lassen**: *Ich lasse das Auto reparieren.* (I'm having it repaired)
- the **perception verbs** *sehen, hören, fühlen*: *Ich sehe ihn kommen. Ich höre sie singen.*
- **gehen, fahren, bleiben** + an activity: *Ich gehe schwimmen. Wir fahren einkaufen. Er bleibt stehen.*
- *lernen* and *helfen* when the infinitive stands alone: *Ich lerne schwimmen. Ich helfe dir tragen.* (with more words, *zu* returns: *Ich helfe dir, die Kisten zu tragen.*)

**The comma.** When the infinitive brings its own words along (an object, an adverb), a comma before it is recommended and makes the sentence easier to read: *Ich habe vor, morgen nach Berlin zu fahren.* With a bare *zu* + verb it is usually left out: *Er versucht zu schlafen.*

**Um … zu** = *in order to*, the purpose. The clause opens with *um* and closes with *zu + infinitive*:
- *Ich lerne Deutsch, **um** in Berlin **zu studieren**.*
- *Sie spart, **um** ein Auto **zu kaufen**.*
- The subject of the *um … zu* clause is the subject of the main clause. When the two subjects differ, use **damit** with a full clause instead: *Ich erkläre es langsam, **damit** du es verstehst.* (so that you understand)

**Ohne … zu** and **(an)statt … zu** work the same way: *Er ging, **ohne** ein Wort **zu sagen**.* (without saying a word) *Sie sah fern, **statt zu lernen**.* (instead of studying)

Do not confuse this *zu* with the preposition *zu* (*zum Arzt, zu Hause*) or the adverb *zu* (*zu groß*, too big). Same spelling, three words.`,
      de: `Hängt ein Verb von einem anderen ab, setzt das Deutsche meist **zu** vor den abhängigen Infinitiv und stellt ihn ans **Ende** des Satzes, genau dorthin, wo das Englische *to* setzt.

**Zu + Infinitiv** nach den meisten Verben, Adjektiven und Nomen:
- nach Verben: *Ich habe vor, nach Berlin **zu fahren**. Er versucht, Deutsch **zu lernen**. Sie hat vergessen, mich **anzurufen**. Ich hoffe, dich bald **zu sehen**.*
- nach *es ist + Adjektiv*: *Es ist schwer, Deutsch **zu lernen**. Es ist wichtig, pünktlich **zu sein**.*
- nach Nomen wie *Lust, Zeit, Angst, die Möglichkeit*: *Ich habe keine Lust **zu kochen**. Hast du Zeit, mir **zu helfen**?*
- nach *beginnen, anfangen, aufhören, scheinen, brauchen (nicht / nur)*: *Es fängt an **zu regnen**. Du brauchst nicht **zu kommen**.*

**Bei einem trennbaren Verb steht zu zwischen Vorsilbe und Stamm**, in einem Wort: *an**zu**rufen, auf**zu**stehen, ein**zu**kaufen, mit**zu**kommen*. Bei untrennbaren und allen anderen Verben ist *zu* ein eigenes Wort: *zu besuchen, zu verstehen, zu lesen*.

**Kein zu** nach:
- den **Modalverben**: *Ich muss gehen. Ich kann schwimmen.*
- **werden** im Futur: *Ich werde kommen.*
- **lassen**: *Ich lasse das Auto reparieren.*
- den **Wahrnehmungsverben** *sehen, hören, fühlen*: *Ich sehe ihn kommen. Ich höre sie singen.*
- **gehen, fahren, bleiben** + Tätigkeit: *Ich gehe schwimmen. Wir fahren einkaufen. Er bleibt stehen.*
- *lernen* und *helfen*, wenn der Infinitiv allein steht: *Ich lerne schwimmen. Ich helfe dir tragen.* (mit mehr Wörtern kommt *zu* zurück: *Ich helfe dir, die Kisten zu tragen.*)

**Das Komma.** Bringt der Infinitiv eigene Wörter mit (ein Objekt, ein Adverb), ist ein Komma davor empfohlen und macht den Satz leichter lesbar: *Ich habe vor, morgen nach Berlin zu fahren.* Bei bloßem *zu* + Verb lässt man es meist weg: *Er versucht zu schlafen.*

**Um … zu** nennt den Zweck. Der Satz beginnt mit *um* und endet mit *zu + Infinitiv*:
- *Ich lerne Deutsch, **um** in Berlin **zu studieren**.*
- *Sie spart, **um** ein Auto **zu kaufen**.*
- Das Subjekt des *um … zu*-Satzes ist das Subjekt des Hauptsatzes. Sind die Subjekte verschieden, nimmt man **damit** mit einem vollständigen Nebensatz: *Ich erkläre es langsam, **damit** du es verstehst.*

**Ohne … zu** und **(an)statt … zu** funktionieren genauso: *Er ging, **ohne** ein Wort **zu sagen**. Sie sah fern, **statt zu lernen**.*

Dieses *zu* nicht mit der Präposition *zu* (*zum Arzt, zu Hause*) oder dem Adverb *zu* (*zu groß*) verwechseln. Gleiche Schreibung, drei Wörter.`,
    },
  },

  {
    id: 'da-wo-komposita',
    keywords: ['da-komposita', 'da komposita', 'dakomposita', 'wo-komposita', 'wo komposita', 'wokomposita',
      'pronominaladverbien', 'pronominaladverb', 'präpositionaladverb', 'präpositionaladverbien', 'darauf',
      'davon', 'darüber', 'dafür', 'daran', 'dazu', 'worauf', 'wovon', 'worüber', 'wofür', 'woran', 'womit',
      'wozu', 'damit darauf davon', 'da compounds', 'wo compounds', 'da- compounds', 'wo- compounds',
      'da words', 'wo words', 'da and wo', 'darauf worauf', 'what does darauf mean', 'what is darauf'],
    title: { de: 'Da- und wo-Komposita: darauf, worauf', en: 'Da- and wo-compounds: darauf, worauf' },
    body: {
      en: `Where English says *on it, about it, for it*, German does not put a pronoun after the preposition. It glues **da-** in front of the preposition instead: *darauf, darüber, dafür*. For the question (*on what? about what?*), it glues **wo-**: *worauf, worüber, wofür*.

**Formation.** da + preposition; if the preposition starts with a vowel, an **r** is inserted so it can be said: da + mit → damit, da + auf → dar**auf**, da + über → dar**über**.

| preposition | *it* | *what?* |
| --- | --- | --- |
| an | daran | woran |
| auf | darauf | worauf |
| aus | daraus | woraus |
| bei | dabei | wobei |
| durch | dadurch | wodurch |
| für | dafür | wofür |
| in | darin | worin |
| mit | damit | womit |
| nach | danach | wonach |
| über | darüber | worüber |
| um | darum | worum |
| von | davon | wovon |
| vor | davor | wovor |
| zu | dazu | wozu |

**The rule: things take the compound, people take the pronoun.**
- *Ich warte auf **den Bus**.* → *Ich warte **darauf**.* (I'm waiting for it)
- *Ich warte auf **meinen Bruder**.* → *Ich warte **auf ihn**.* (for him)
- *Sie spricht über **das Buch**.* → *Sie spricht **darüber**.*
- *Sie spricht über **ihre Lehrerin**.* → *Sie spricht **über sie**.*

Likewise in questions: **Worauf** wartest du? (what are you waiting for?) but **Auf wen** wartest du? (who are you waiting for?). **Womit** fährst du? (by what?) but **Mit wem** fährst du? (with whom?).

**Pointing forward.** The compound can announce a clause or an infinitive that follows, especially after verbs that take a fixed preposition:
- *Ich freue mich **darauf**, dich zu sehen.* (I'm looking forward to seeing you)
- *Er denkt **daran**, dass er morgen arbeiten muss.*
- *Es hängt **davon** ab, ob es regnet.* (it depends on whether it rains)
- *Ich habe keine Lust **dazu**, aufzuräumen.* (and the *dazu* is often dropped: *keine Lust aufzuräumen*)

That is why the preposition each verb takes is worth learning with it: *warten auf, sich freuen auf, denken an, sprechen über, sich interessieren für, abhängen von*: see *Präpositionen*.

**In relative clauses** the *wo-* form stands for a thing: *das Thema, **worüber** wir gesprochen haben* (the topic we talked about), or just as well *das Thema, über das wir gesprochen haben*. See *Relativsätze*.

**Some have a life of their own**: *damit* is also the conjunction *so that*, *darum* and *dadurch* mean *therefore* and *thereby*, *dabei* means *at the same time*, and *Dafür!* or *Dagegen!* are *for it* and *against it* in a vote. *Wozu?* is *what for?*

Not every preposition does this: *ohne, seit, außer, gegenüber* have no compounds. *Ohne das* is simply *ohne das*.`,
      de: `Wo das Englische *on it, about it, for it* sagt, stellt das Deutsche kein Pronomen hinter die Präposition. Es klebt stattdessen **da-** vor die Präposition: *darauf, darüber, dafür*. Für die Frage klebt es **wo-** davor: *worauf, worüber, wofür*.

**Bildung.** da + Präposition; beginnt die Präposition mit einem Vokal, wird ein **r** eingeschoben, damit man es sprechen kann: da + mit → damit, da + auf → dar**auf**, da + über → dar**über**.

| Präposition | Aussage | Frage |
| --- | --- | --- |
| an | daran | woran |
| auf | darauf | worauf |
| aus | daraus | woraus |
| bei | dabei | wobei |
| durch | dadurch | wodurch |
| für | dafür | wofür |
| in | darin | worin |
| mit | damit | womit |
| nach | danach | wonach |
| über | darüber | worüber |
| um | darum | worum |
| von | davon | wovon |
| vor | davor | wovor |
| zu | dazu | wozu |

**Die Regel: Sachen bekommen das Kompositum, Personen das Pronomen.**
- *Ich warte auf **den Bus**.* → *Ich warte **darauf**.*
- *Ich warte auf **meinen Bruder**.* → *Ich warte **auf ihn**.*
- *Sie spricht über **das Buch**.* → *Sie spricht **darüber**.*
- *Sie spricht über **ihre Lehrerin**.* → *Sie spricht **über sie**.*

Ebenso in Fragen: **Worauf** wartest du? (auf eine Sache) aber **Auf wen** wartest du? (auf eine Person). **Womit** fährst du? aber **Mit wem** fährst du?

**Vorausweisend.** Das Kompositum kann einen Nebensatz oder einen Infinitiv ankündigen, besonders nach Verben mit fester Präposition:
- *Ich freue mich **darauf**, dich zu sehen.*
- *Er denkt **daran**, dass er morgen arbeiten muss.*
- *Es hängt **davon** ab, ob es regnet.*
- *Ich habe keine Lust **dazu**, aufzuräumen.* (das *dazu* fällt oft weg: *keine Lust aufzuräumen*)

Deshalb lohnt es sich, die Präposition jedes Verbs mitzulernen: *warten auf, sich freuen auf, denken an, sprechen über, sich interessieren für, abhängen von*: siehe *Präpositionen*.

**Im Relativsatz** steht die *wo*-Form für eine Sache: *das Thema, **worüber** wir gesprochen haben*, oder ebenso gut *das Thema, über das wir gesprochen haben*. Siehe *Relativsätze*.

**Einige führen ein Eigenleben**: *damit* ist auch die Konjunktion des Zwecks, *darum* und *dadurch* nennen Grund und Mittel, *dabei* heißt *gleichzeitig*, und *Dafür!* oder *Dagegen!* sind die Stimmen bei einer Abstimmung. *Wozu?* fragt nach dem Zweck.

Nicht jede Präposition macht das mit: *ohne, seit, außer, gegenüber* haben keine Komposita. *Ohne das* bleibt einfach *ohne das*.`,
    },
  },

  {
    id: 'ss-umlaute',
    keywords: ['scharfes s', 'eszett', 'esszett', 'ss oder scharfes s', 'wann scharfes s', 'umlaut', 'umlaute',
      'die umlaute', 'ae oe ue', 'umlautpunkte', 'rechtschreibung', 'aussprache', 'dass oder das',
      'das oder dass', 'das und dass', 'wann schreibt man dass', 'wann dass oder das', 'das or dass', 'groß oder klein', 'großschreibung', 'kleinschreibung', 'gross oder klein',
      'grossschreibung', 'umlauts', 'sharp s', 'double s', 'spelling', 'pronunciation', 'how to type umlauts',
      'capital letters', 'capitalisation', 'capitalization', 'why are nouns capitalised',
      'why are nouns capitalized', 'das vs dass', 'what is eszett', 'how to pronounce umlauts'],
    title: { de: 'ß, Umlaute und Rechtschreibung', en: 'ß, umlauts and spelling' },
    body: {
      en: `**ß** is a letter of its own, called *Eszett* or *scharfes S*, and it stands for a single **voiceless s**, the sound in *hiss*. It is never a b.

**ß or ss?** Since the 1996 reform the rule is about the vowel in front:
- **ß** after a **long vowel or a diphthong**: *Straße, groß, heißen, Fuß, draußen, Spaß*
- **ss** after a **short vowel**: *Fluss, muss, essen, dass, Schloss, Wasser*

That is why *dass* (short a) is spelt with ss and *Maß* (long a) with ß, and why older texts have *daß* and *muß*: the old rule was different. Switzerland and Liechtenstein write **ss** everywhere (*Strasse, gross*), and that is correct there.

In capitals, *ß* becomes **SS** (*STRASSE*) or, since 2017, the capital **ẞ**. If your keyboard has no ß, writing **ss** is understood everywhere; a teacher will mark it, a German will not blink.

**The umlauts** ä, ö, ü are separate sounds, not decorated a, o, u, and the dots **change the meaning**:
- *schon* (already) against *schön* (beautiful)
- *Mutter* (mother) against *Mütter* (mothers)
- *wurde* (became) against *würde* (would)
- *konnte* (could) against *könnte* (could, hypothetically)
- *zahlen* (to pay) against *zählen* (to count)
- *Apfel* against *Äpfel*, *Buch* against *Bücher*

Without the keys, write **ae, oe, ue**: *Muenchen, schoen, fuer*. That is the official substitute and it is what Germans do in e-mail addresses and crosswords. Never just drop the dots: *schon* is a different word from *schön*.

**Where the umlaut turns up:** in plurals (*Haus → Häuser*), comparatives (*alt → älter*), the Konjunktiv II (*hatte → hätte*), diminutives (*Haus → Häuschen*), and the *du* and *er* forms of some strong verbs (*fahren → du fährst, er fährt*).

**Pronouncing them**, roughly: **ä** is the e of *bed*, longer in *spät*; **ö** is the e of *bed* said with rounded lips, as in French *peu*; **ü** is the i of *see* said with rounded lips, as in French *tu*. Round the lips first, then say the vowel.

**Capital letters.** German capitalises **every noun**, not only names: *der Tisch, die Freiheit, das Lesen* (an infinitive used as a noun), *etwas Neues* (an adjective used as a noun). Adjectives of nationality and language are lowercase (*deutsch, die deutsche Sprache*) but the language as a noun is capitalised (*Ich lerne Deutsch*). The formal *Sie, Ihnen, Ihr* always take a capital; *du* and *ihr* need not, even in letters.

**Das or dass?** *das* (one s) is the article (*das Haus*), the demonstrative (*Das ist gut*) and the relative pronoun (*das Haus, das ich sehe*). *dass* (two s) is the conjunction: *Ich weiß, dass du kommst.* The test: if *dieses* or *welches* could replace it, it is *das*.

**Other spelling habits to know:** *ck* and *tz* after a short vowel (*Zucker, Katze*), *ie* for a long i (*lieben, Spiel*), *h* lengthening a vowel without being heard (*gehen, Zahl*), and compound nouns written as one word, however long: *die Straßenbahnhaltestelle*.`,
      de: `**ß** ist ein eigener Buchstabe, *Eszett* oder *scharfes S* genannt, und steht für ein einziges **stimmloses s**. Es ist nie ein b.

**ß oder ss?** Seit der Reform von 1996 entscheidet der Vokal davor:
- **ß** nach einem **langen Vokal oder Diphthong**: *Straße, groß, heißen, Fuß, draußen, Spaß*
- **ss** nach einem **kurzen Vokal**: *Fluss, muss, essen, dass, Schloss, Wasser*

Deshalb schreibt man *dass* (kurzes a) mit ss und *Maß* (langes a) mit ß, und deshalb steht in älteren Texten *daß* und *muß*: Die alte Regel war eine andere. In der Schweiz und in Liechtenstein schreibt man überall **ss** (*Strasse, gross*), und dort ist das richtig.

In Großbuchstaben wird *ß* zu **SS** (*STRASSE*) oder, seit 2017, zum großen **ẞ**. Wer kein ß auf der Tastatur hat, schreibt **ss**; das versteht jeder. Die Lehrkraft streicht es an, ein Deutscher zuckt nicht mit der Wimper.

**Die Umlaute** ä, ö, ü sind eigene Laute, keine verzierten a, o, u, und die Punkte **ändern die Bedeutung**:
- *schon* gegenüber *schön*
- *Mutter* gegenüber *Mütter*
- *wurde* gegenüber *würde*
- *konnte* gegenüber *könnte*
- *zahlen* gegenüber *zählen*
- *Apfel* gegenüber *Äpfel*, *Buch* gegenüber *Bücher*

Ohne die Tasten schreibt man **ae, oe, ue**: *Muenchen, schoen, fuer*. Das ist der offizielle Ersatz, und so machen es Deutsche in E-Mail-Adressen und Kreuzworträtseln. Die Punkte einfach weglassen geht nicht: *schon* ist ein anderes Wort als *schön*.

**Wo der Umlaut auftaucht:** im Plural (*Haus → Häuser*), im Komparativ (*alt → älter*), im Konjunktiv II (*hatte → hätte*), in Verkleinerungsformen (*Haus → Häuschen*) und in den *du*- und *er*-Formen mancher starker Verben (*fahren → du fährst, er fährt*).

**Aussprache**, ungefähr: **ä** ist das e in *Bett*, lang in *spät*; **ö** ist ein e mit gerundeten Lippen, wie im französischen *peu*; **ü** ist ein i mit gerundeten Lippen, wie im französischen *tu*. Erst die Lippen runden, dann den Vokal sprechen.

**Großschreibung.** Das Deutsche schreibt **jedes Nomen** groß, nicht nur Namen: *der Tisch, die Freiheit, das Lesen* (ein substantivierter Infinitiv), *etwas Neues* (ein substantiviertes Adjektiv). Adjektive für Nationalität und Sprache schreibt man klein (*deutsch, die deutsche Sprache*), die Sprache als Nomen groß (*Ich lerne Deutsch*). Das höfliche *Sie, Ihnen, Ihr* schreibt man immer groß; *du* und *ihr* muss man auch in Briefen nicht großschreiben.

**Das oder dass?** *das* (ein s) ist der Artikel (*das Haus*), das Demonstrativpronomen (*Das ist gut*) und das Relativpronomen (*das Haus, das ich sehe*). *dass* (zwei s) ist die Konjunktion: *Ich weiß, dass du kommst.* Die Probe: Lässt es sich durch *dieses* oder *welches* ersetzen, ist es *das*.

**Weitere Schreibgewohnheiten:** *ck* und *tz* nach kurzem Vokal (*Zucker, Katze*), *ie* für ein langes i (*lieben, Spiel*), ein *h*, das den Vokal dehnt, ohne gesprochen zu werden (*gehen, Zahl*), und zusammengesetzte Nomen in einem Wort, egal wie lang: *die Straßenbahnhaltestelle*.`,
    },
  },
];

/**
 * The counterparts to the profe's interjections, fired on the same three
 * moments: a word found (good), a question outside what the tutor covers
 * (bad), and a verb hairy enough to deserve a reaction (wow): one that is
 * both irregular and takes *sein*.
 *
 * *Da bin ich überfragt* ("that one is beyond me") is how a German teacher
 * admits a gap without making a drama of it, which is exactly the moment the
 * bad ones are for.
 */
export const EXCLAMATIONS = {
  good: ['Na bitte!', 'Genau!', 'Prima!', 'Sehr gut!'],
  bad: ['Oje!', 'Ach du liebe Zeit!', 'Da bin ich überfragt!'],
  wow: ['Donnerwetter!', 'Ach du meine Güte!', 'Alle Achtung!', 'Mensch!'],
};

/**
 * Conversational openers the tutor answers without looking anything up.
 *
 * Matched against the folded question, so umlauts are already gone (*tschüss*
 * arrives as *tschuss*) but ß is not (*grüß* arrives as *gruß*), which is why
 * the greeting pattern accepts both spellings of it. *Hallo* is only a hello;
 * the goodbyes have words of their own.
 */
export const SMALL_TALK = [
  {
    match: /^(hallo|hi|hey|hello|guten tag|guten morgen|guten abend|moin|servus|gru(ß|ss) gott|gru(ß|ss) dich|wie geht['’]?s|wie geht es dir|wie geht es ihnen)\b/,
    reply: {
      de: 'Hallo! Ich kann Verben konjugieren, Wörter im Wörterbuch nachschlagen, Sätze übersetzen und dir die Grammatik erklären. Womit fangen wir an?',
      en: 'Hello! I can conjugate verbs, look words up in the dictionary, translate phrases and explain grammar. Where would you like to start?',
    },
  },
  {
    match: /^(danke|danke schon|dankeschon|danke sehr|vielen dank|thanks|thank you|ok|okay|alles klar|super|prima|toll|klasse|wunderbar)\b/,
    reply: {
      de: 'Gern geschehen! Frag mich ruhig alles, was du wissen willst.',
      en: "You're welcome. Ask me anything else you need.",
    },
  },
  {
    match: /^(tschuss|tschau|ciao|auf wiedersehen|wiedersehen|bis bald|bis spater|bis morgen|bis dann|gute nacht|schonen tag|schonen tag noch|mach['’]?s gut|bye|goodbye)\b/,
    reply: {
      de: 'Bis bald! Und viel Erfolg beim Deutschlernen.',
      en: 'See you! Good luck with your German.',
    },
  },
];
