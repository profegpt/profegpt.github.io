/**
 * Curated grammar explanations for the tutor, Dutch side.
 *
 * The same contract as data/grammar.js, data/grammar-fr.js and
 * data/grammar-it.js: each topic carries the words that should summon it and
 * a short explanation in both languages, so the tutor can answer in whichever
 * one it was asked. Bodies are markdown.
 *
 * Hand-written rather than generated, for the same reason as the other three
 * sets — everything the tutor says about Dutch should be something a teacher
 * would actually sign off on. Where standard Dutch and everyday speech part
 * ways (*groter als*, *hun hebben*, *het meisje die*, *ik leg in bed*), the
 * notes say so rather than pretend the spoken form does not exist.
 *
 * Keywords are matched against the question with its accents folded away, so
 * *één* and *een* summon the same note. Single, very common words — *er*,
 * *te*, *de*, *het*, *om*, *als*, *die*, *dat* — are deliberately not keywords
 * on their own: they turn up in half of all Dutch questions, and a note
 * offered on the strength of one of them would be offered to almost everybody.
 */

export const TOPICS = [
  {
    id: 'de-het',
    keywords: ['de of het', 'de en het', 'de vs het', 'het of de', 'de or het', 'de het', 'when do i use het',
      'when do i use de', 'when to use het', 'when to use de', 'de-woorden', 'het-woorden', 'de woorden', 'het woorden',
      'de-woord', 'het-woord', 'lidwoord', 'lidwoorden', 'bepaald lidwoord', 'onbepaald lidwoord', 'articles', 'article',
      'definite article', 'indefinite article', 'gender', 'genders', 'geslacht', 'woordgeslacht', 'onzijdig', 'zijdig',
      'deze of die', 'dit of dat', 'deze die dit dat', 'deze dit', 'demonstrative', 'demonstratives',
      'aanwijzend voornaamwoord', 'aanwijzende voornaamwoorden', 'welke of welk', 'ons of onze'],
    title: { nl: 'De en het', en: 'De vs. het' },
    body: {
      en: `Dutch has two words for *the*: **de** and **het**. Which one a noun takes is its gender, and it has to be learned together with the noun: *de tafel*, *het huis*.

| | singular | plural |
| --- | --- | --- |
| de-words | **de** man, **de** tafel, **de** stad | **de** mannen, **de** tafels, **de** steden |
| het-words | **het** huis, **het** kind, **het** boek | **de** huizen, **de** kinderen, **de** boeken |
| indefinite | **een** man, **een** huis | mannen, huizen (no article) |

Two things make it easier than it looks:
- **Every plural takes de.** *Het huis*, but *de huizen*.
- Most nouns are de-words. When you have to guess, guess *de*.

**Always het:**
- every diminutive: *het meisje, het huisje, het tafeltje* (even though it is *de tafel*)
- an infinitive used as a noun: *het eten, het zwemmen, het lezen*
- languages, metals and compass points: *het Nederlands, het goud, het noorden*
- words in *-isme, -ment, -sel, -um*: *het toerisme, het moment, het voedsel, het museum*
- most two-syllable words beginning with *be-, ge-, ver-, ont-*: *het begin, het gevoel, het verhaal, het ontbijt*

**Always de:**
- people and their jobs: *de man, de vrouw, de dokter, de leraar*. The exceptions are *het kind* and the diminutives *het meisje, het jongetje*.
- words in *-heid, -ing, -ie, -teit, -ij*: *de vrijheid, de regering, de politie, de universiteit, de bakkerij* (but *het schilderij*)
- fruit, trees and plants, rivers, letters and numbers: *de appel, de eik, de Rijn, de a, de zeven*

**A whole family of words follows the same split.** Getting the gender right matters beyond the article:

| | de-word | het-word |
| --- | --- | --- |
| this / that | **deze** tafel, **die** tafel | **dit** huis, **dat** huis |
| which | **welke** tafel | **welk** huis |
| our | **onze** tafel | **ons** huis |
| every | **elke / iedere** dag | **elk / ieder** jaar |
| the adjective after *een* | een grot**e** tafel | een groot huis |
| the relative pronoun | de tafel **die** ik kocht | het huis **dat** ik kocht |

See *het bijvoeglijk naamwoord* and *die, dat, wie, wat* for the last two.

**Referring back.** A het-word is *het*; a de-word that is a thing is usually *hij* in the Netherlands: *Waar is mijn fiets? Hij staat buiten.* (Where is my bike? It is outside.)

A few nouns take both articles with different meanings: *het pad* (the path) and *de pad* (the toad), *het bos* (the forest) and *de bos* (the bunch: *een bos bloemen*), *het portier* (the car door) and *de portier* (the doorman). And a handful officially take either: *de* or *het aanrecht, matras, deksel*.

Learn every noun with its article: *het huis*, not *huis*. Recovering it later is much harder than storing it now.`,
      nl: `Het Nederlands heeft twee lidwoorden voor *the*: **de** en **het**. Welk lidwoord een woord krijgt, is zijn geslacht, en dat leer je samen met het woord: *de tafel*, *het huis*.

| | enkelvoud | meervoud |
| --- | --- | --- |
| de-woorden | **de** man, **de** tafel, **de** stad | **de** mannen, **de** tafels, **de** steden |
| het-woorden | **het** huis, **het** kind, **het** boek | **de** huizen, **de** kinderen, **de** boeken |
| onbepaald | **een** man, **een** huis | mannen, huizen (geen lidwoord) |

Twee dingen maken het makkelijker dan het lijkt:
- **Elk meervoud krijgt de.** *Het huis*, maar *de huizen*.
- De meeste woorden zijn de-woorden. Als je moet gokken, gok dan *de*.

**Altijd het:**
- elk verkleinwoord: *het meisje, het huisje, het tafeltje* (ook al is het *de tafel*)
- een infinitief die als zelfstandig naamwoord wordt gebruikt: *het eten, het zwemmen, het lezen*
- talen, metalen en windstreken: *het Nederlands, het goud, het noorden*
- woorden op *-isme, -ment, -sel, -um*: *het toerisme, het moment, het voedsel, het museum*
- de meeste tweelettergrepige woorden die beginnen met *be-, ge-, ver-, ont-*: *het begin, het gevoel, het verhaal, het ontbijt*

**Altijd de:**
- personen en beroepen: *de man, de vrouw, de dokter, de leraar*. De uitzonderingen zijn *het kind* en de verkleinwoorden *het meisje, het jongetje*.
- woorden op *-heid, -ing, -ie, -teit, -ij*: *de vrijheid, de regering, de politie, de universiteit, de bakkerij* (maar *het schilderij*)
- fruit, bomen en planten, rivieren, letters en cijfers: *de appel, de eik, de Rijn, de a, de zeven*

**Een hele familie van woorden volgt dezelfde tweedeling.** Het geslacht gaat verder dan het lidwoord alleen:

| | de-woord | het-woord |
| --- | --- | --- |
| aanwijzend | **deze** tafel, **die** tafel | **dit** huis, **dat** huis |
| vragend | **welke** tafel | **welk** huis |
| bezittelijk | **onze** tafel | **ons** huis |
| elk | **elke / iedere** dag | **elk / ieder** jaar |
| het bijvoeglijk naamwoord na *een* | een grot**e** tafel | een groot huis |
| het betrekkelijk voornaamwoord | de tafel **die** ik kocht | het huis **dat** ik kocht |

Zie *het bijvoeglijk naamwoord* en *die, dat, wie, wat* voor de laatste twee.

**Terugverwijzen.** Naar een het-woord verwijs je met *het*; naar een de-woord dat een ding is, in Nederland meestal met *hij*: *Waar is mijn fiets? Hij staat buiten.*

Een paar woorden hebben beide lidwoorden, met een verschillende betekenis: *het pad* (de weg) en *de pad* (het dier), *het bos* (met bomen) en *de bos* (*een bos bloemen*), *het portier* (van een auto) en *de portier* (de man bij de deur). En bij een handvol woorden mag het allebei: *de* of *het aanrecht, matras, deksel*.

Leer elk woord met zijn lidwoord: *het huis*, niet *huis*. Later opzoeken kost veel meer moeite dan het nu meteen onthouden.`,
    },
  },

  {
    id: 'hebben-zijn',
    keywords: ['hebben of zijn', 'zijn of hebben', 'hebben en zijn', 'zijn en hebben', 'hebben vs zijn', 'zijn vs hebben',
      'hebben or zijn', 'zijn or hebben', 'verschil tussen hebben en zijn', 'difference between hebben and zijn',
      'hulpwerkwoord', 'hulpwerkwoorden', 'hulpwerkwoord van tijd', 'auxiliary', 'auxiliaries', 'auxiliary verb',
      'auxiliary verbs', 'which auxiliary', 'welk hulpwerkwoord', 'heb of ben', 'ben of heb', 'ik ben gegaan',
      'to be', 'to have', 'honger hebben', 'ik heb het koud'],
    title: { nl: 'Hebben en zijn', en: 'Hebben vs. zijn' },
    body: {
      en: `The two most common verbs in Dutch, and the two auxiliaries of the perfect tenses.

| | hebben | zijn |
| --- | --- | --- |
| ik | heb | ben |
| jij / je | hebt | bent |
| u | hebt (also heeft) | bent |
| hij / zij / het | heeft | is |
| wij, jullie, zij | hebben | zijn |
| past | had, hadden | was, waren |
| participle | gehad | geweest |

When *jij* follows the verb, the *-t* disappears: *heb jij, ben jij* (see *woordvolgorde*).

**Where English says to be, Dutch often says hebben:**
- *Ik heb honger / dorst / slaap / haast.* (I'm hungry, thirsty, sleepy, in a hurry)
- *Je hebt gelijk.* (you're right) *Ik heb zin in koffie.* (I feel like a coffee)
- *Ik heb het koud / warm.* (I'm cold, warm) *Ik ben koud* describes a cold body.

Age uses *zijn*, as in English: *Ik ben twintig.*

**As auxiliaries** they build the perfectum and the plusquamperfectum, with the participle at the end of the clause: *Ik heb gewerkt. Hij is vertrokken.*

- **hebben** with most verbs: with every verb that takes a direct object, and with every reflexive verb (*Ik heb me vergist*, unlike French or Italian).
- **zijn** with verbs of **change**, of state or place: *gaan, komen, worden, blijven, zijn, beginnen, stoppen, gebeuren, vallen, sterven, groeien, veranderen, verhuizen, vertrekken, aankomen, opstaan, slagen, lukken, verdwijnen.* *Blijven* and *zijn* take *zijn* too: *Ik ben thuis gebleven. Ik ben in Parijs geweest.*

**Verbs of movement take both**: *zijn* when a destination or direction is named, *hebben* when the activity itself is the point:
- *Ik* **ben** *naar huis gelopen.* (I walked home) *Ik* **heb** *twee uur gelopen.* (I walked for two hours)
- *We* **zijn** *naar Utrecht gefietst.* *We* **hebben** *de hele dag gefietst.*

The same with an object: *Hij* **is** *veranderd* (he has changed) but *Hij* **heeft** *zijn plan veranderd* (he changed his plan). *Vergeten* takes either: *Ik ben / heb het vergeten.*

The participle never agrees with anything: *Zij is gegaan, zij zijn gegaan.* One form, always.

See *'t kofschip* for how the participle is made and *perfectum en imperfectum* for when to use it.`,
      nl: `De twee meest gebruikte werkwoorden van het Nederlands, en de twee hulpwerkwoorden van de voltooide tijden.

| | hebben | zijn |
| --- | --- | --- |
| ik | heb | ben |
| jij / je | hebt | bent |
| u | hebt (ook heeft) | bent |
| hij / zij / het | heeft | is |
| wij, jullie, zij | hebben | zijn |
| verleden tijd | had, hadden | was, waren |
| voltooid deelwoord | gehad | geweest |

Als *jij* na het werkwoord komt, verdwijnt de *-t*: *heb jij, ben jij* (zie *woordvolgorde*).

**Waar het Engels to be zegt, zegt het Nederlands vaak hebben:**
- *Ik heb honger / dorst / slaap / haast.*
- *Je hebt gelijk.* *Ik heb zin in koffie.*
- *Ik heb het koud / warm.* (*Ik ben koud* zegt iets over je lichaamstemperatuur.)

Leeftijd gaat met *zijn*, zoals in het Engels: *Ik ben twintig.*

**Als hulpwerkwoord** vormen ze het perfectum en het plusquamperfectum, met het voltooid deelwoord aan het eind van de zin: *Ik heb gewerkt. Hij is vertrokken.*

- **hebben** bij de meeste werkwoorden: bij alle werkwoorden met een lijdend voorwerp, en bij alle wederkerende werkwoorden (*Ik heb me vergist*, anders dan in het Frans of het Italiaans).
- **zijn** bij werkwoorden die een **verandering** uitdrukken, van toestand of van plaats: *gaan, komen, worden, blijven, zijn, beginnen, stoppen, gebeuren, vallen, sterven, groeien, veranderen, verhuizen, vertrekken, aankomen, opstaan, slagen, lukken, verdwijnen.* Ook *blijven* en *zijn* zelf gaan met *zijn*: *Ik ben thuis gebleven. Ik ben in Parijs geweest.*

**Bewegingswerkwoorden krijgen allebei**: *zijn* als er een bestemming of richting wordt genoemd, *hebben* als het om de activiteit zelf gaat:
- *Ik* **ben** *naar huis gelopen.* *Ik* **heb** *twee uur gelopen.*
- *We* **zijn** *naar Utrecht gefietst.* *We* **hebben** *de hele dag gefietst.*

Hetzelfde met een lijdend voorwerp: *Hij* **is** *veranderd*, maar *Hij* **heeft** *zijn plan veranderd*. *Vergeten* kan allebei: *Ik ben / heb het vergeten.*

Het voltooid deelwoord verandert nooit van vorm: *Zij is gegaan, zij zijn gegaan.* Eén vorm, altijd.

Zie *'t kofschip* voor de vorming van het voltooid deelwoord en *perfectum en imperfectum* voor het gebruik.`,
    },
  },

  {
    id: 'woordvolgorde',
    keywords: ['woordvolgorde', 'zinsvolgorde', 'zinsbouw', 'volgorde van de zin', 'word order', 'sentence structure',
      'sentence order', 'inversie', 'inversion', 'hoofdzin', 'bijzin', 'hoofdzin en bijzin', 'hoofdzin of bijzin',
      'main clause', 'subordinate clause', 'subordinate clauses', 'verb second', 'v2', 'persoonsvorm',
      'verb at the end', 'verb to the end', 'werkwoord achteraan', 'werkwoord aan het eind', 'werkwoord op de tweede plaats',
      'where does the verb go', 'tijd manier plaats', 'time manner place', 'tangconstructie'],
    title: { nl: 'Woordvolgorde', en: 'Word order' },
    body: {
      en: `Dutch word order follows a few firm rules, and most of them are about **where the verbs go**.

**1. In a main clause the conjugated verb is always the second element.** Not the second word: the second *element*, which may be several words long.

| 1 | 2: verb | rest | end: other verbs |
| --- | --- | --- | --- |
| Ik | ga | morgen naar Amsterdam. | |
| Morgen | ga | ik naar Amsterdam. | |
| Ik | heb | gisteren een boek | gekocht. |
| Mijn broer en ik | willen | volgend jaar in Spanje | gaan wonen. |

**2. Inversion.** When something other than the subject comes first (a time, a place, an object), the verb stays second and the subject moves to third: *Morgen* **ga ik***.* *Dat* **weet ik** *niet.* Learners who put the subject straight after a time word (*Morgen ik ga*) break the most important rule in the language.

When *je / jij* follows the verb, the *-t* drops: *Je gaat* but *ga je*, *Jij komt* but *kom jij*. Only for *jij*: *gaat u, gaat hij*.

**3. Questions.** A yes/no question puts the verb first: *Ga je morgen naar Amsterdam?* A question word takes position 1, the verb follows: *Waar woon je?*

**4. Everything else that is a verb goes to the end**: participles, infinitives and the prefixes of separable verbs. The two parts enclose the rest of the sentence like pincers (the *tangconstructie*):
- *Ik* **heb** *gisteren een boek* **gekocht***.*
- *Ik* **kan** *morgen niet* **komen***.*
- *Ik* **bel** *je vanavond* **op***.*

**5. In a subordinate clause all the verbs go to the end**, including the conjugated one. A subordinate clause starts with *dat, omdat, als, toen, terwijl, hoewel, voordat, nadat, zodat, of* (whether) or a relative pronoun:
- *Ik blijf thuis, omdat ik ziek* **ben***.*
- *Hij zegt dat hij morgen* **komt***.*
- *Ik weet niet of ze het boek* **heeft gelezen***.* or *...* **gelezen heeft***.* Both orders are correct. Putting the auxiliary first is a little more common in writing; participle first is a little more common in speech in the Netherlands.
- With a modal the infinitive comes last: *... omdat ik morgen* **moet werken***.*

When the subordinate clause comes first, it fills position 1 of the main clause, so the two verbs meet at the comma: **Omdat ik ziek ben, blijf** *ik thuis.*

**6. En, maar, of, want, dus do not count.** They join two main clauses and the order after them does not change: *Ik blijf thuis,* **want** *ik ben ziek.* Compare *omdat ik ziek ben*. See *omdat en want*.

**7. In the middle** the usual order is **time, manner, place**: *Ik ga* **morgen met de trein naar Utrecht***.* A definite object tends to come before a time word and an indefinite one after it: *Ik heb het boek gisteren gelezen.* *Ik heb gisteren een boek gelezen.* For the place of *niet*, see *niet en geen*.`,
      nl: `De Nederlandse woordvolgorde volgt een paar vaste regels, en de meeste gaan over **de plaats van de werkwoorden**.

**1. In een hoofdzin staat de persoonsvorm altijd op de tweede plaats.** Niet het tweede woord, maar het tweede *zinsdeel*, en dat kan uit meerdere woorden bestaan.

| 1 | 2: persoonsvorm | rest | eind: andere werkwoorden |
| --- | --- | --- | --- |
| Ik | ga | morgen naar Amsterdam. | |
| Morgen | ga | ik naar Amsterdam. | |
| Ik | heb | gisteren een boek | gekocht. |
| Mijn broer en ik | willen | volgend jaar in Spanje | gaan wonen. |

**2. Inversie.** Als iets anders dan het onderwerp vooraan staat (een tijd, een plaats, een lijdend voorwerp), blijft de persoonsvorm op de tweede plaats en schuift het onderwerp naar de derde: *Morgen* **ga ik***.* *Dat* **weet ik** *niet.* Wie het onderwerp meteen na een tijdsbepaling zet (*Morgen ik ga*), overtreedt de belangrijkste regel van de taal.

Als *je / jij* na de persoonsvorm komt, valt de *-t* weg: *Je gaat* maar *ga je*, *Jij komt* maar *kom jij*. Alleen bij *jij*: *gaat u, gaat hij*.

**3. Vragen.** Een ja/nee-vraag begint met de persoonsvorm: *Ga je morgen naar Amsterdam?* Een vraagwoord staat op plaats 1, de persoonsvorm volgt: *Waar woon je?*

**4. Alle andere werkwoordsvormen gaan naar het eind**: voltooide deelwoorden, infinitieven en de voorvoegsels van scheidbare werkwoorden. De twee delen omsluiten de rest van de zin als een tang (de *tangconstructie*):
- *Ik* **heb** *gisteren een boek* **gekocht***.*
- *Ik* **kan** *morgen niet* **komen***.*
- *Ik* **bel** *je vanavond* **op***.*

**5. In een bijzin gaan alle werkwoorden naar het eind**, ook de persoonsvorm. Een bijzin begint met *dat, omdat, als, toen, terwijl, hoewel, voordat, nadat, zodat, of* of met een betrekkelijk voornaamwoord:
- *Ik blijf thuis, omdat ik ziek* **ben***.*
- *Hij zegt dat hij morgen* **komt***.*
- *Ik weet niet of ze het boek* **heeft gelezen***.* of *...* **gelezen heeft***.* Allebei correct. Het hulpwerkwoord vooraan is iets gebruikelijker in geschreven taal; het deelwoord vooraan hoor je in Nederland iets vaker in de spreektaal.
- Bij een modaal werkwoord komt de infinitief helemaal achteraan: *... omdat ik morgen* **moet werken***.*

Staat de bijzin vooraan, dan vult hij plaats 1 van de hoofdzin, zodat de twee persoonsvormen elkaar bij de komma ontmoeten: **Omdat ik ziek ben, blijf** *ik thuis.*

**6. En, maar, of, want, dus tellen niet mee.** Ze verbinden twee hoofdzinnen en de volgorde erna verandert niet: *Ik blijf thuis,* **want** *ik ben ziek.* Vergelijk *omdat ik ziek ben*. Zie *omdat en want*.

**7. In het middenstuk** is de gewone volgorde **tijd, manier, plaats**: *Ik ga* **morgen met de trein naar Utrecht***.* Een bepaald lijdend voorwerp staat meestal vóór de tijdsbepaling, een onbepaald erna: *Ik heb het boek gisteren gelezen.* *Ik heb gisteren een boek gelezen.* Voor de plaats van *niet*, zie *niet en geen*.`,
    },
  },

  {
    id: 'perfectum-imperfectum',
    keywords: ['perfectum', 'imperfectum', 'perfectum of imperfectum', 'imperfectum of perfectum', 'perfectum en imperfectum',
      'perfectum vs imperfectum', 'verschil tussen perfectum en imperfectum', 'difference between perfectum and imperfectum',
      'voltooid tegenwoordige tijd', 'onvoltooid verleden tijd', 'voltooide tijd', 'vtt', 'ovt', 'present perfect',
      'simple past', 'perfect or imperfect', 'perfect vs imperfect', 'which past tense', 'welke verleden tijd',
      'verleden tijd', 'past tense', 'past tenses', 'plusquamperfectum', 'voltooid verleden tijd', 'pluperfect',
      'past perfect', 'ik heb gedaan of ik deed'],
    title: { nl: 'Perfectum en imperfectum', en: 'Perfectum vs. imperfectum' },
    body: {
      en: `Both are past tenses. The split is not the English one, and that is the main thing to unlearn.

**The perfectum** (*voltooid tegenwoordige tijd*: *hebben* or *zijn* + participle) is the everyday past. It reports **what happened**, in conversation, even with a precise time:
- *Ik* **heb** *gisteren een film* **gezien***.* (I saw a film yesterday)
- *Wat* **heb** *je in het weekend* **gedaan***?*
- *Ik* **ben** *vorig jaar naar Spanje* **geweest***.*

English would never say *I have seen a film yesterday*; Dutch says exactly that. In speech, a completed event almost always goes in the perfectum.

**The imperfectum** (*onvoltooid verleden tijd*: *werkte, ging, was*) gives the **background and the setting**: descriptions, habits, states, what was going on, and the flow of a story:
- *Het* **regende** *en de straat* **was** *leeg.* (description)
- *Vroeger* **woonde** *ik in Utrecht.* (a state in the past)
- *Als kind* **speelde** *ik elke dag buiten.* (habit)
- *Hij* **stond** *op,* **pakte** *zijn jas en* **ging** *naar buiten.* (narrative, mostly in writing)

**The typical pattern** in conversation is one sentence of perfectum to announce the event, then imperfectum for the details:
- *Ik* **ben** *gisteren naar Amsterdam* **geweest***. Het* **was** *druk en het* **regende** *de hele dag.*

**A few verbs prefer the imperfectum even in speech**: *zijn, hebben* and the modals. *Ik was ziek. Ik had geen tijd. Ik moest werken.* sound more natural than *Ik ben ziek geweest*, which suggests the illness is over and done with.

After **toen** (when, a single moment in the past) the imperfectum is normal: *Toen ik klein was, woonde ik in Groningen.* See *omdat en want* for *toen* and *als*.

**Two English traps:**
- *I have lived here for three years* (and still do) is **present** tense with *al*: *Ik* **woon** *hier* **al** *drie jaar.* *Ik heb hier drie jaar gewoond* means you no longer do.
- *I was reading when...* is the imperfectum, or *aan het* + infinitive: *Ik* **las** */ Ik* **was aan het lezen** *toen de telefoon ging.*

**The plusquamperfectum** is the same construction one step further back, with *had* or *was*: *Toen ik aankwam,* **was** *de trein al* **vertrokken***.* *Ik* **had** *het nog nooit* **gezien***.*

For the forms, see *'t kofschip* (regular verbs) and *hebben en zijn* (which auxiliary).`,
      nl: `Allebei verleden tijd. De verdeling is niet die van het Engels, en dat is vooral wat je moet afleren.

**Het perfectum** (*voltooid tegenwoordige tijd*: *hebben* of *zijn* + voltooid deelwoord) is de verleden tijd van alledag. Het vertelt **wat er is gebeurd**, in een gesprek, ook met een precieze tijd erbij:
- *Ik* **heb** *gisteren een film* **gezien***.*
- *Wat* **heb** *je in het weekend* **gedaan***?*
- *Ik* **ben** *vorig jaar naar Spanje* **geweest***.*

In het Engels kan *I have seen a film yesterday* niet; in het Nederlands is dat precies de gewone zin. In de spreektaal gaat een afgeronde gebeurtenis bijna altijd in het perfectum.

**Het imperfectum** (*onvoltooid verleden tijd*: *werkte, ging, was*) geeft **de achtergrond en de omstandigheden**: beschrijvingen, gewoontes, toestanden, wat er aan de gang was, en de loop van een verhaal:
- *Het* **regende** *en de straat* **was** *leeg.* (beschrijving)
- *Vroeger* **woonde** *ik in Utrecht.* (een toestand in het verleden)
- *Als kind* **speelde** *ik elke dag buiten.* (gewoonte)
- *Hij* **stond** *op,* **pakte** *zijn jas en* **ging** *naar buiten.* (vertelling, vooral in geschreven taal)

**Het typische patroon** in een gesprek: één zin in het perfectum om de gebeurtenis aan te kondigen, dan imperfectum voor de details:
- *Ik* **ben** *gisteren naar Amsterdam* **geweest***. Het* **was** *druk en het* **regende** *de hele dag.*

**Een paar werkwoorden kiezen ook in de spreektaal liever het imperfectum**: *zijn, hebben* en de modale werkwoorden. *Ik was ziek. Ik had geen tijd. Ik moest werken.* klinkt natuurlijker dan *Ik ben ziek geweest*, dat suggereert dat de ziekte helemaal voorbij is.

Na **toen** (één moment in het verleden) is het imperfectum gewoon: *Toen ik klein was, woonde ik in Groningen.* Zie *omdat en want* voor *toen* en *als*.

**Twee valkuilen vanuit het Engels:**
- *I have lived here for three years* (en nog steeds) is **tegenwoordige tijd** met *al*: *Ik* **woon** *hier* **al** *drie jaar.* *Ik heb hier drie jaar gewoond* betekent dat je er niet meer woont.
- *I was reading when...* is imperfectum, of *aan het* + infinitief: *Ik* **las** */ Ik* **was aan het lezen** *toen de telefoon ging.*

**Het plusquamperfectum** is dezelfde constructie een stap verder terug, met *had* of *was*: *Toen ik aankwam,* **was** *de trein al* **vertrokken***.* *Ik* **had** *het nog nooit* **gezien***.*

Voor de vormen, zie *'t kofschip* (regelmatige werkwoorden) en *hebben en zijn* (welk hulpwerkwoord).`,
    },
  },

  {
    id: 'kofschip',
    keywords: ['kofschip', "'t kofschip", 't kofschip', 'het kofschip', 'fokschaap', "'t fokschaap", 'zwakke werkwoorden',
      'zwak werkwoord', 'zwakke verleden tijd', 'regelmatige werkwoorden', 'regelmatig werkwoord', 'weak verbs', 'weak verb',
      'regular verbs', 'regular past tense', 'regular past', 'te of de', 'de of te', '-te of -de', 'd of t', 't of d',
      'd of dt', 'dt', 'dt-fout', 'dt-regel', 'wordt of word', 'word of wordt', 'voltooid deelwoord', 'voltooide deelwoorden',
      'past participle', 'past participles', 'participle', 'participles', 'sterke werkwoorden', 'sterk werkwoord',
      'strong verbs', 'strong verb', 'onregelmatige werkwoorden', 'onregelmatig werkwoord', 'irregular verbs',
      'irregular verb', 'irregular past'],
    title: { nl: "'t Kofschip en de verleden tijd", en: "'t Kofschip: the regular past" },
    body: {
      en: `Most Dutch verbs are **weak** (regular). Their past tense and past participle are built on the **stem**, which is the *ik*-form of the verb: *werken → werk, wonen → woon, maken → maak*.

- past tense: stem + **-te** or **-de** (plural **-ten / -den**)
- past participle: **ge-** + stem + **-t** or **-d**

**'t Kofschip decides between t and d.** Take the infinitive, drop *-en*, and look at the last letter. If it is one of the consonants in *'t kofschip* (**t, k, f, s, ch, p**), the ending is *-te / -t*. Otherwise it is *-de / -d*.

| infinitive | stem | past singular | past plural | participle |
| --- | --- | --- | --- | --- |
| werken | werk | werkte | werkten | gewerkt |
| fietsen | fiets | fietste | fietsten | gefietst |
| praten | praat | praatte | praatten | gepraat |
| wonen | woon | woonde | woonden | gewoond |
| spelen | speel | speelde | speelden | gespeeld |
| antwoorden | antwoord | antwoordde | antwoordden | geantwoord |
| reizen | reis | reisde | reisden | gereisd |
| leven | leef | leefde | leefden | geleefd |

Some teachers say *'t fokschaap* or *'t ex-kofschip*; they are the same letters, with *x* added for loan verbs: *faxen → faxte, gefaxt*.

**Watch the last two rows.** Take the letter from the infinitive, not from the stem: *reizen* ends in *z* and *leven* in *v*, neither of which is in *'t kofschip*, so it is *reisde, gereisd* and *leefde, geleefd*, even though the stem is written *reis* and *leef*. The same goes for *verhuizen → verhuisde, geloven → geloofde*.

**A stem that already ends in t or d** doubles it in the past (*praatte, antwoordde*) but not in the participle, which never ends in *-tt* or *-dd*: *gepraat, geantwoord*.

The past singular has one form for all persons: *ik / jij / hij werkte*. In speech *werkte* and *werkten* sound alike, so the spelling has to do the work.

**No ge-** on verbs that begin with an unstressed *be-, ge-, her-, ont-, ver-, er-*: *betalen → betaald, gebeuren → gebeurd, herhalen → herhaald, ontmoeten → ontmoet, vertellen → verteld*. A separable verb puts *ge* in the middle: *opbellen → opgebeld* (see *scheidbare werkwoorden*).

Loan verbs follow the sound of the stem: *appen → appte, geappt; googelen → googelde, gegoogeld; updaten → updatete, geüpdatet*.

**D, t or dt?** The same logic covers the mistake Dutch speakers make most. In the present tense the *hij*-form is stem + *t*, even when the stem ends in *d*: *ik word, hij wordt, jij wordt* but *word jij*. The participle follows *'t kofschip*: *het is gebeurd, verhuisd*. Ask what the ending would be with a stem like *werk*, and the answer carries over.

**Strong and irregular verbs** do not use *'t kofschip* at all. Strong verbs change their vowel and their participle ends in *-en*: *lopen, liep, gelopen; schrijven, schreef, geschreven; drinken, dronk, gedronken; nemen, nam, genomen; zien, zag, gezien; gaan, ging, gegaan; komen, kwam, gekomen; eten, at, gegeten; doen, deed, gedaan; zijn, was, geweest*. A few mix the two systems: *lachen, lachte, gelachen; bakken, bakte, gebakken; vragen, vroeg, gevraagd*, and a small group is simply irregular: *zeggen, zei, gezegd; kopen, kocht, gekocht; brengen, bracht, gebracht; denken, dacht, gedacht; weten, wist, geweten*. Learn these three forms together, as one word.`,
      nl: `De meeste Nederlandse werkwoorden zijn **zwak** (regelmatig). Hun verleden tijd en voltooid deelwoord worden gebouwd op de **stam**, en de stam is de *ik*-vorm van het werkwoord: *werken → werk, wonen → woon, maken → maak*.

- verleden tijd: stam + **-te** of **-de** (meervoud **-ten / -den**)
- voltooid deelwoord: **ge-** + stam + **-t** of **-d**

**'t Kofschip bepaalt de keuze tussen t en d.** Neem de infinitief, haal *-en* eraf en kijk naar de laatste letter. Is het een van de medeklinkers van *'t kofschip* (**t, k, f, s, ch, p**), dan is de uitgang *-te / -t*. Anders is het *-de / -d*.

| infinitief | stam | verleden tijd enkelvoud | verleden tijd meervoud | voltooid deelwoord |
| --- | --- | --- | --- | --- |
| werken | werk | werkte | werkten | gewerkt |
| fietsen | fiets | fietste | fietsten | gefietst |
| praten | praat | praatte | praatten | gepraat |
| wonen | woon | woonde | woonden | gewoond |
| spelen | speel | speelde | speelden | gespeeld |
| antwoorden | antwoord | antwoordde | antwoordden | geantwoord |
| reizen | reis | reisde | reisden | gereisd |
| leven | leef | leefde | leefden | geleefd |

Sommige docenten zeggen *'t fokschaap* of *'t ex-kofschip*; dat zijn dezelfde letters, met een *x* erbij voor leenwerkwoorden: *faxen → faxte, gefaxt*.

**Let op de laatste twee rijen.** Neem de letter uit de infinitief, niet uit de stam: *reizen* eindigt op een *z* en *leven* op een *v*, en die staan geen van beide in *'t kofschip*. Dus *reisde, gereisd* en *leefde, geleefd*, ook al schrijf je de stam als *reis* en *leef*. Zo ook *verhuizen → verhuisde, geloven → geloofde*.

**Een stam die al op t of d eindigt** verdubbelt die letter in de verleden tijd (*praatte, antwoordde*), maar niet in het voltooid deelwoord, dat nooit op *-tt* of *-dd* eindigt: *gepraat, geantwoord*.

De verleden tijd enkelvoud heeft één vorm voor alle personen: *ik / jij / hij werkte*. In de spreektaal klinken *werkte* en *werkten* hetzelfde, dus de spelling moet het verschil maken.

**Geen ge-** bij werkwoorden die beginnen met een onbeklemtoond *be-, ge-, her-, ont-, ver-, er-*: *betalen → betaald, gebeuren → gebeurd, herhalen → herhaald, ontmoeten → ontmoet, vertellen → verteld*. Een scheidbaar werkwoord zet *ge* in het midden: *opbellen → opgebeld* (zie *scheidbare werkwoorden*).

Leenwerkwoorden volgen de klank van de stam: *appen → appte, geappt; googelen → googelde, gegoogeld; updaten → updatete, geüpdatet*.

**D, t of dt?** Dezelfde logica dekt de fout die Nederlandstaligen zelf het vaakst maken. In de tegenwoordige tijd is de *hij*-vorm stam + *t*, ook als de stam op een *d* eindigt: *ik word, hij wordt, jij wordt*, maar *word jij*. Het voltooid deelwoord volgt *'t kofschip*: *het is gebeurd, verhuisd*. Vraag je af wat de uitgang zou zijn bij een stam als *werk*, en het antwoord geldt ook hier.

**Sterke en onregelmatige werkwoorden** gebruiken *'t kofschip* helemaal niet. Sterke werkwoorden veranderen van klinker en hun voltooid deelwoord eindigt op *-en*: *lopen, liep, gelopen; schrijven, schreef, geschreven; drinken, dronk, gedronken; nemen, nam, genomen; zien, zag, gezien; gaan, ging, gegaan; komen, kwam, gekomen; eten, at, gegeten; doen, deed, gedaan; zijn, was, geweest*. Een paar werkwoorden mengen de twee systemen: *lachen, lachte, gelachen; bakken, bakte, gebakken; vragen, vroeg, gevraagd*, en een kleine groep is gewoon onregelmatig: *zeggen, zei, gezegd; kopen, kocht, gekocht; brengen, bracht, gebracht; denken, dacht, gedacht; weten, wist, geweten*. Leer deze drie vormen samen, als één woord.`,
    },
  },

  {
    id: 'spelling',
    keywords: ['spelling', 'spellingregels', 'spellingsregels', 'spelling rules', 'open en gesloten lettergrepen',
      'open lettergreep', 'gesloten lettergreep', 'open syllable', 'closed syllable', 'open and closed syllables',
      'lange en korte klinkers', 'lange klinker', 'korte klinker', 'long and short vowels', 'long vowel', 'short vowel',
      'dubbele klinker', 'dubbele medeklinker', 'double vowel', 'double consonant', 'double consonants', 'double letters',
      'f of v', 'v of f', 's of z', 'z of s', 'f en v', 's en z', 'f v s z', 'huis huizen', 'man mannen', 'maan manen',
      'waarom twee a', 'why two a', 'klinkers', 'vowels', 'uitspraak', 'pronunciation', 'een of een'],
    title: { nl: 'Spelling: open en gesloten lettergrepen', en: 'Spelling: long and short vowels' },
    body: {
      en: `Dutch spelling looks unstable (*maan, manen; man, mannen*) until you see the one rule behind it: **the spelling of a vowel depends on whether its syllable is open or closed**.

- A **closed** syllable ends in a consonant: *man, bos, pen, bus*. A single vowel there is **short**. A long vowel in a closed syllable is written **double**: *maan, boom, been, muur*.
- An **open** syllable ends in the vowel: *ma-nen, bo-men, be-nen, mu-ren*. A single vowel there is automatically **long**, so it is never doubled.

The consequence is that **adding an ending changes the spelling** to keep the sound the same:

| sound | one syllable | with an ending | rule |
| --- | --- | --- | --- |
| long a | maan | manen | one vowel letter drops |
| long o | boom | bomen, grote, ik loop / wij lopen | one vowel letter drops |
| long e | been | benen | one vowel letter drops |
| short a | man | mannen | the consonant doubles |
| short o | bom | bommen, dikke, ik zit / wij zitten | the consonant doubles |
| short e | pen | pennen | the consonant doubles |

Doubling the consonant **closes** the syllable (*man-nen*) and keeps the vowel short; dropping a vowel letter is possible because the **open** syllable (*ma-nen*) is long anyway.

Pairs that differ only in this: *manen* (moons) and *mannen* (men), *bomen* (trees) and *bommen* (bombs), *zonen* (sons) and *zonnen* (suns), *zaken* (matters) and *zakken* (bags).

**Vowels written with two letters never change**: *ie, oe, eu, ui, ij, ei, ou, au* are long by nature, and the consonant after them is never doubled: *boek, boeken; huis, huizen; deur, deuren; trein, treinen*. Only *i* is odd: short *i* is *i* (*zit, zitten*), long *i* is *ie* (*dier, dieren*).

A long *e* at the end of a word keeps its double: *zee, twee, mee, thee*. And a single *e* at the end is the unstressed sound of *de*: *de, me, je*.

**f / v and s / z.** Dutch never ends a word in *v* or *z*. Inside the word, between vowels, they often come back:
- *brief, brieven; lief, lieve; ik leef, wij leven; ik geef, hij geeft, wij geven*
- *huis, huizen; boos, boze; ik reis, wij reizen; ik lees, wij lezen*

Often, but not always: after a short vowel the consonant is doubled instead (*stof, stoffen; bus, bussen; les, lessen*), and some words keep *f* or *s* (*kans, kansen; mens, mensen; dans, dansen; fotograaf, fotografen*). Learn the plural with the noun. For verbs, start from the infinitive: *leven → ik leef, leefde; reizen → ik reis, reisde* (see *'t kofschip*).

**Final d and b** are spoken as *t* and *p* (*hond* sounds like *hont*, *heb* like *hep*) but written after the longer form: *honden*, *hebben*. The same applies to *goed / goede, paard / paarden*.

**Een or één?** *Een* (the article *a*) is unstressed. The number one is written with accents when it could be confused: *Ik heb maar* **één** *zus.* (I have only one sister.)`,
      nl: `De Nederlandse spelling lijkt onvast (*maan, manen; man, mannen*) tot je de ene regel erachter ziet: **hoe je een klinker schrijft, hangt af van de vraag of zijn lettergreep open of gesloten is**.

- Een **gesloten** lettergreep eindigt op een medeklinker: *man, bos, pen, bus*. Eén klinkerletter is daar **kort**. Een lange klinker in een gesloten lettergreep schrijf je **dubbel**: *maan, boom, been, muur*.
- Een **open** lettergreep eindigt op de klinker: *ma-nen, bo-men, be-nen, mu-ren*. Eén klinkerletter is daar vanzelf **lang**, dus hij wordt nooit verdubbeld.

Het gevolg is dat **een uitgang de spelling verandert**, zodat de klank gelijk blijft:

| klank | één lettergreep | met uitgang | regel |
| --- | --- | --- | --- |
| lange a | maan | manen | één klinkerletter valt weg |
| lange o | boom | bomen, grote, ik loop / wij lopen | één klinkerletter valt weg |
| lange e | been | benen | één klinkerletter valt weg |
| korte a | man | mannen | de medeklinker verdubbelt |
| korte o | bom | bommen, dikke, ik zit / wij zitten | de medeklinker verdubbelt |
| korte e | pen | pennen | de medeklinker verdubbelt |

De verdubbelde medeklinker **sluit** de lettergreep (*man-nen*) en houdt de klinker kort; één klinkerletter weglaten kan, omdat de **open** lettergreep (*ma-nen*) toch al lang klinkt.

Paren die alleen hierin verschillen: *manen* en *mannen*, *bomen* en *bommen*, *zonen* en *zonnen*, *zaken* en *zakken*.

**Klinkers die met twee letters worden geschreven, veranderen nooit**: *ie, oe, eu, ui, ij, ei, ou, au* zijn van zichzelf lang, en de medeklinker erna wordt nooit verdubbeld: *boek, boeken; huis, huizen; deur, deuren; trein, treinen*. Alleen de *i* doet vreemd: de korte *i* is *i* (*zit, zitten*), de lange *i* is *ie* (*dier, dieren*).

Een lange *e* aan het eind van een woord houdt zijn dubbele letter: *zee, twee, mee, thee*. En één *e* aan het eind is de onbeklemtoonde klank van *de*: *de, me, je*.

**f / v en s / z.** Een Nederlands woord eindigt nooit op *v* of *z*. In het woord, tussen klinkers, komen ze vaak terug:
- *brief, brieven; lief, lieve; ik leef, wij leven; ik geef, hij geeft, wij geven*
- *huis, huizen; boos, boze; ik reis, wij reizen; ik lees, wij lezen*

Vaak, maar niet altijd: na een korte klinker wordt de medeklinker verdubbeld (*stof, stoffen; bus, bussen; les, lessen*), en sommige woorden houden hun *f* of *s* (*kans, kansen; mens, mensen; dans, dansen; fotograaf, fotografen*). Leer het meervoud samen met het woord. Bij werkwoorden ga je uit van de infinitief: *leven → ik leef, leefde; reizen → ik reis, reisde* (zie *'t kofschip*).

**Een d of b aan het eind** spreek je uit als *t* en *p* (*hond* klinkt als *hont*, *heb* als *hep*), maar je schrijft ze naar de langere vorm: *honden*, *hebben*. Zo ook *goed / goede, paard / paarden*.

**Een of één?** *Een* (het lidwoord) is onbeklemtoond. Het telwoord krijgt accenten als er verwarring mogelijk is: *Ik heb maar* **één** *zus.*`,
    },
  },

  {
    id: 'scheidbare-werkwoorden',
    keywords: ['scheidbare werkwoorden', 'scheidbaar werkwoord', 'scheidbare werkwoord', 'scheidbaar', 'scheidbare',
      'onscheidbare werkwoorden', 'onscheidbaar werkwoord', 'onscheidbaar', 'scheidbaar of onscheidbaar',
      'scheidbaar en onscheidbaar', 'separable verbs', 'separable verb', 'separable', 'inseparable verbs', 'inseparable verb',
      'inseparable', 'separable and inseparable', 'separable prefix', 'separable prefixes', 'prefix verbs', 'phrasal verbs',
      'opbellen', 'voorvoegsel', 'voorvoegsels', 'samengestelde werkwoorden', 'samengesteld werkwoord'],
    title: { nl: 'Scheidbare en onscheidbare werkwoorden', en: 'Separable and inseparable verbs' },
    body: {
      en: `Many Dutch verbs are a verb with a prefix stuck on: *opbellen* (to phone), *meenemen* (to take along), *uitgaan* (to go out), *aankomen* (to arrive), *afwassen* (to wash up), *schoonmaken* (to clean), *thuisblijven* (to stay home). They are **separable** when the stress is on the prefix (*ÓPbellen*), and then the prefix comes off and goes to the end of the clause.

| | opbellen |
| --- | --- |
| present | Ik **bel** je morgen **op**. |
| past | Hij **belde** me gisteren **op**. |
| imperative | **Bel** me **op**! |
| subordinate clause | ... omdat ik je morgen **opbel**. |
| infinitive | Ik wil je morgen **opbellen**. |
| with te | Ik probeer je **op te bellen**. |
| participle | Ik heb je **opgebeld**. |

Four things to notice:
- In a main clause the prefix goes **to the very end**, after objects, time and place: *Ik bel je morgen om acht uur op.*
- In a subordinate clause the two parts are **rejoined** at the end: *... dat ik je opbel.*
- With *te*, the *te* goes **between** the two parts, three separate words: *op te bellen*.
- The participle puts **ge** in the middle: *opgebeld, aangekomen, meegenomen, schoongemaakt*.

Where two verbs end up together, the prefix may stay attached or not; both are standard: *... omdat ik je wil opbellen* / *... omdat ik je op wil bellen*.

**Inseparable verbs** have an unstressed prefix: *be-, ge-, her-, ont-, ver-, er-* (*betalen, gebruiken, herhalen, ontmoeten, vertellen, ervaren*). They never split, and their participle has no *ge-*: *Ik heb betaald. Ik heb hem ontmoet.*

**A few prefixes can be either**, and the stress decides the meaning:
- *vóórkomen* (to occur): *Dat komt vaak voor. Het is voorgekomen.* against *voorkómen* (to prevent): *Hij voorkomt problemen. Hij heeft het voorkomen.*
- *óndergaan* (to set, go down): *De zon gaat onder.* against *ondergáán* (to undergo): *Hij ondergaat een operatie.*
- *dóórlopen* (to keep walking): *Loop maar door!* against *doorlópen* (to go through): *Hij doorloopt de hele procedure.*

**Reading tip.** In a main clause the verb is not complete until the last word: *Hij gaf het na drie jaar eindelijk* **op***.* is *opgeven* (to give up), not *geven*. Read to the end before looking anything up, because the prefix changes the meaning entirely: *opgeven* (give up), *uitgeven* (spend, publish), *toegeven* (admit), *aangeven* (hand, report), *doorgeven* (pass on), *teruggeven* (give back).`,
      nl: `Veel Nederlandse werkwoorden zijn een werkwoord met een voorvoegsel eraan vast: *opbellen, meenemen, uitgaan, aankomen, afwassen, schoonmaken, thuisblijven*. Ze zijn **scheidbaar** als de klemtoon op het voorvoegsel ligt (*ÓPbellen*), en dan gaat het voorvoegsel los en naar het eind van de zin.

| | opbellen |
| --- | --- |
| tegenwoordige tijd | Ik **bel** je morgen **op**. |
| verleden tijd | Hij **belde** me gisteren **op**. |
| gebiedende wijs | **Bel** me **op**! |
| bijzin | ... omdat ik je morgen **opbel**. |
| infinitief | Ik wil je morgen **opbellen**. |
| met te | Ik probeer je **op te bellen**. |
| voltooid deelwoord | Ik heb je **opgebeld**. |

Vier dingen om op te letten:
- In een hoofdzin gaat het voorvoegsel **helemaal naar het eind**, na lijdend voorwerp, tijd en plaats: *Ik bel je morgen om acht uur op.*
- In een bijzin komen de twee delen aan het eind weer **bij elkaar**: *... dat ik je opbel.*
- Bij *te* komt *te* **tussen** de twee delen, drie losse woorden: *op te bellen*.
- Het voltooid deelwoord zet **ge** in het midden: *opgebeld, aangekomen, meegenomen, schoongemaakt*.

Waar twee werkwoorden samen aan het eind staan, mag het voorvoegsel vast blijven zitten of niet; allebei is standaardtaal: *... omdat ik je wil opbellen* / *... omdat ik je op wil bellen*.

**Onscheidbare werkwoorden** hebben een onbeklemtoond voorvoegsel: *be-, ge-, her-, ont-, ver-, er-* (*betalen, gebruiken, herhalen, ontmoeten, vertellen, ervaren*). Ze splitsen nooit, en hun voltooid deelwoord krijgt geen *ge-*: *Ik heb betaald. Ik heb hem ontmoet.*

**Een paar voorvoegsels kunnen allebei**, en de klemtoon bepaalt de betekenis:
- *vóórkomen* (gebeuren): *Dat komt vaak voor. Het is voorgekomen.* tegenover *voorkómen* (verhinderen): *Hij voorkomt problemen. Hij heeft het voorkomen.*
- *óndergaan* (naar beneden gaan): *De zon gaat onder.* tegenover *ondergáán* (meemaken): *Hij ondergaat een operatie.*
- *dóórlopen* (verder lopen): *Loop maar door!* tegenover *doorlópen* (van begin tot eind afleggen): *Hij doorloopt de hele procedure.*

**Leestip.** In een hoofdzin is het werkwoord pas compleet bij het laatste woord: *Hij gaf het na drie jaar eindelijk* **op***.* is *opgeven*, niet *geven*. Lees tot het eind voordat je iets opzoekt, want het voorvoegsel verandert de betekenis volledig: *opgeven, uitgeven, toegeven, aangeven, doorgeven, teruggeven*.`,
    },
  },

  {
    id: 'modale-werkwoorden',
    keywords: ['modale werkwoorden', 'modaal werkwoord', 'modale hulpwerkwoorden', 'modaal hulpwerkwoord', 'modal verbs',
      'modal verb', 'modals', 'modal', 'kunnen mogen moeten', 'kunnen mogen moeten willen', 'kunnen mogen moeten willen zullen',
      'kunnen of mogen', 'mogen of kunnen', 'moeten of hoeven', 'hoeven of moeten', 'niet hoeven', 'hoeven', 'hoeft niet',
      'moeten niet', 'niet moeten', 'kan of kunt', 'kunt of kan', 'jij kan of jij kunt', 'wil of wilt', 'wilt of wil',
      'hij wilt', 'zal of zult', 'can in dutch', 'must in dutch', 'may in dutch', 'have to in dutch', 'dont have to',
      "don't have to", 'must not', 'mustnt', "mustn't"],
    title: { nl: 'De modale werkwoorden', en: 'The modal verbs' },
    body: {
      en: `*Kunnen, mogen, moeten, willen* and *zullen* (and, with a negative, *hoeven*) are the modal verbs. They are irregular in the present, they take an infinitive **without te** at the end of the clause, and they are the verbs you will use most after *hebben* and *zijn*.

| | kunnen | mogen | moeten | willen | zullen |
| --- | --- | --- | --- | --- | --- |
| ik | kan | mag | moet | wil | zal |
| jij / je | kunt, kan | mag | moet | wilt, wil | zult, zal |
| u | kunt | mag | moet | wilt | zult |
| hij / zij / het | kan | mag | moet | wil | zal |
| wij, jullie, zij | kunnen | mogen | moeten | willen | zullen |
| past | kon, konden | mocht, mochten | moest, moesten | wilde, wilden | zou, zouden |
| participle | gekund | gemogen | gemoeten | gewild | (none) |

With *jij*, both *kunt* and *kan*, *wilt* and *wil*, *zult* and *zal* are correct; the *-t* forms are a little more formal, and the only ones used with *u*. The *hij*-form has **no -t**: *hij kan, hij mag, hij wil, hij zal*. *Hij wilt* is a common native mistake, and a mistake all the same. In speech *wou* is often heard for *wilde*.

**What they mean:**
- **kunnen**: ability and possibility: *Ik kan zwemmen. Kun je me helpen? Dat kan.* (that's possible)
- **mogen**: permission: *Mag ik iets vragen? Je mag hier niet roken.* Also liking a person: *Ik mag hem graag.*
- **moeten**: obligation and necessity: *Ik moet morgen werken. Je moet dit boek lezen!* (you have to, you really should)
- **willen**: wanting: *Ik wil koffie. Wil je mee?* Politely: *Ik wil graag een koffie.* or *Ik zou graag een koffie willen.*
- **zullen**: promises, offers and suggestions, and a formal future: *Ik zal het doen. Zal ik je helpen? Zullen we gaan?* (shall we). Its past, *zou*, is English *would*: *Zou je me kunnen helpen?* See *de toekomst*.

**Word order.** The modal is the conjugated verb in second place; the infinitive goes to the end, with no *te*: *Ik* **kan** *morgen niet* **komen***.* In a subordinate clause both go to the end: *... omdat ik morgen niet* **kan komen***.*

The infinitive is often **left out** when it is obvious, usually *gaan, doen* or *hebben*: *Ik moet naar huis. Ik wil een ijsje. Dat mag niet. Dat kan.*

**Not having to.** This is where English speakers go wrong:
- *You don't have to come* is **niet hoeven te**: *Je* **hoeft** *niet* **te** *komen.* *Hoeven* takes *te*, and only appears with a negative or with *alleen maar*: *Je hoeft alleen maar te bellen.*
- *Je* **moet** *niet komen* means *you shouldn't come*, strong advice against it.
- *You mustn't* is **mogen niet**: *Je mag hier niet parkeren.*

**In the perfect** a modal keeps its infinitive form instead of becoming a participle, when another verb follows: *Ik heb gisteren* **moeten werken***. Ik heb niet* **kunnen komen***.* The participle only appears when the modal stands alone: *Dat heb ik nooit gewild.*`,
      nl: `*Kunnen, mogen, moeten, willen* en *zullen* (en, met een ontkenning, *hoeven*) zijn de modale werkwoorden. Ze zijn onregelmatig in de tegenwoordige tijd, ze krijgen een infinitief **zonder te** aan het eind van de zin, en na *hebben* en *zijn* zijn het de werkwoorden die je het meest gebruikt.

| | kunnen | mogen | moeten | willen | zullen |
| --- | --- | --- | --- | --- | --- |
| ik | kan | mag | moet | wil | zal |
| jij / je | kunt, kan | mag | moet | wilt, wil | zult, zal |
| u | kunt | mag | moet | wilt | zult |
| hij / zij / het | kan | mag | moet | wil | zal |
| wij, jullie, zij | kunnen | mogen | moeten | willen | zullen |
| verleden tijd | kon, konden | mocht, mochten | moest, moesten | wilde, wilden | zou, zouden |
| voltooid deelwoord | gekund | gemogen | gemoeten | gewild | (geen) |

Bij *jij* zijn zowel *kunt* als *kan*, *wilt* als *wil*, *zult* als *zal* correct; de vormen op *-t* zijn iets formeler, en de enige die bij *u* horen. De *hij*-vorm heeft **geen -t**: *hij kan, hij mag, hij wil, hij zal*. *Hij wilt* is een veelgemaakte fout van moedertaalsprekers, en toch een fout. In de spreektaal hoor je vaak *wou* voor *wilde*.

**Wat ze betekenen:**
- **kunnen**: vermogen en mogelijkheid: *Ik kan zwemmen. Kun je me helpen? Dat kan.*
- **mogen**: toestemming: *Mag ik iets vragen? Je mag hier niet roken.* Ook sympathie: *Ik mag hem graag.*
- **moeten**: verplichting en noodzaak: *Ik moet morgen werken. Je moet dit boek lezen!*
- **willen**: een wens: *Ik wil koffie. Wil je mee?* Beleefd: *Ik wil graag een koffie.* of *Ik zou graag een koffie willen.*
- **zullen**: beloftes, aanbiedingen en voorstellen, en een formele toekomst: *Ik zal het doen. Zal ik je helpen? Zullen we gaan?* De verleden tijd *zou* is het Engelse *would*: *Zou je me kunnen helpen?* Zie *de toekomst*.

**Woordvolgorde.** Het modale werkwoord is de persoonsvorm op de tweede plaats; de infinitief gaat naar het eind, zonder *te*: *Ik* **kan** *morgen niet* **komen***.* In een bijzin gaan ze allebei naar het eind: *... omdat ik morgen niet* **kan komen***.*

De infinitief wordt vaak **weggelaten** als hij vanzelf spreekt, meestal *gaan, doen* of *hebben*: *Ik moet naar huis. Ik wil een ijsje. Dat mag niet. Dat kan.*

**Niet hoeven.** Hier gaat het bij Engelstaligen mis:
- *You don't have to come* is **niet hoeven te**: *Je* **hoeft** *niet* **te** *komen.* *Hoeven* krijgt *te*, en komt alleen voor met een ontkenning of met *alleen maar*: *Je hoeft alleen maar te bellen.*
- *Je* **moet** *niet komen* betekent dat je beter niet kunt komen: een dringend advies.
- *You mustn't* is **niet mogen**: *Je mag hier niet parkeren.*

**In de voltooide tijd** houdt een modaal werkwoord de vorm van de infinitief in plaats van een voltooid deelwoord te worden, als er een ander werkwoord op volgt: *Ik heb gisteren* **moeten werken***. Ik heb niet* **kunnen komen***.* Het voltooid deelwoord verschijnt alleen als het modale werkwoord alleen staat: *Dat heb ik nooit gewild.*`,
    },
  },

  {
    id: 'er',
    keywords: ['het woord er', 'het woordje er', 'er in dutch', 'er in het nederlands', 'wanneer gebruik je er',
      'when do i use er', 'when to use er', 'how to use er', 'how do i use er', 'what does er mean', 'use of er',
      'gebruik van er', 'er is', 'er zijn', 'er is of er zijn', 'there is', 'there are', 'ik heb er twee',
      'er plus voorzetsel', 'er met voorzetsel', 'er en voorzetsel', 'erop', 'eraan', 'ervan', 'ermee', 'erover', 'ernaar',
      'eruit', 'erin', 'erbij', 'daarmee', 'daarop', 'daarvan', 'daaraan', 'daarover', 'hiermee', 'hierop', 'hiervan',
      'waarmee', 'waarop', 'waarvan', 'waaraan', 'waarover', 'waarnaar', 'voornaamwoordelijk bijwoord',
      'voornaamwoordelijke bijwoorden', 'pronominal adverb', 'pronominal adverbs', 'daar en er', 'er of daar',
      'daar of er', 'er daar hier waar'],
    title: { nl: 'Er, erop, daarmee, waarvan', en: 'Er, and erop, daarmee, waarvan' },
    body: {
      en: `*Er* is the hardest small word in Dutch, because it does five different jobs. It is always unstressed and it stands, as a rule, **right after the conjugated verb** (or after the subject when there is inversion).

**1. Place**: an unstressed *there*. *Ben je weleens in Parijs geweest? Ja, ik ben* **er** *twee keer geweest.* The stressed forms are *daar* and *hier*: *Daar ben ik nooit geweest.*

**2. Introducing an indefinite subject**: *there is, there are*. When the subject is *een ..., geen ..., veel ..., iemand, niemand, iets*, Dutch starts the clause with *er* and, where it can, uses a verb of position rather than *zijn*:
- **Er** *staat een man voor de deur.* (there is a man at the door)
- **Er** *zijn veel mensen.* **Er** *is geen melk meer.*
- *Is* **er** *iemand thuis? Wat is* **er** *gebeurd?*
- *Morgen komt* **er** *een nieuwe collega.*

Not with a definite subject: *De man staat voor de deur.*

**3. With a number or a quantity**, for *of them*, which English leaves out and Dutch cannot: *Hoeveel kinderen heb je? Ik heb* **er** *twee.* *Heb je nog broodjes? Ik heb* **er** *genoeg / geen meer.*

**4. With a preposition, for things.** *Op het, van het, met ze* do not exist in Dutch; a preposition plus a pronoun for a **thing** becomes *er* + preposition, written as one word:
- *Ik wacht op de bus.* → *Ik wacht* **erop***.*
- *Ik denk aan mijn examen.* → *Ik denk* **eraan***.*
- *Ik schrijf met een pen.* → *Ik schrijf* **ermee***.* (*met* becomes **mee**, *tot* becomes **toe**: *ertoe*)

For a **person** the pronoun stays: *Ik wacht op hem. Ik denk aan haar.*

The two parts are very often **split**, with the preposition at the end: *Ik wacht* **er** *al een uur* **op***. Ik heb* **er** *niet* **aan** *gedacht.* In speech the split is the norm.

*Er* has three stressed relatives that work the same way and give the whole family its grammar name, **pronominal adverbs**:

| | er (unstressed) | daar (that) | hier (this) | waar (which, what) |
| --- | --- | --- | --- | --- |
| op | erop | daarop | hierop | waarop |
| aan | eraan | daaraan | hieraan | waaraan |
| van | ervan | daarvan | hiervan | waarvan |
| over | erover | daarover | hierover | waarover |
| met | ermee | daarmee | hiermee | waarmee |
| tot | ertoe | daartoe | hiertoe | waartoe |

- **Daar** *weet ik niets* **van***.* (I know nothing about that)
- **Hiermee** *kun je de deur openen.*
- **Waar** *denk je* **aan***?* or, more formally, **Waaraan** *denk je?*
- *de pen* **waarmee** *ik schrijf* (the pen I write with; see *die, dat, wie, wat*)
- Also *ergens, nergens, overal*: *Ik denk* **nergens aan***. Hij praat* **overal over***.*

It can announce a clause as well: *Ik reken* **erop** *dat je komt.* *Ik heb* **er** *geen zin* **in** *om te koken.* A few prepositions do not combine: *zonder, tijdens, sinds, volgens*.

**5. In a passive without a subject**: *Er wordt gebeld.* (someone is at the door) *Er werd veel gelachen.* *Er wordt hier niet gerookt.* See *het passief*.

Two jobs can stack, and then there are two *er*s: *Hoeveel stoelen zijn er?* **Er** *zijn* **er** *drie.*

**In speech** *er* is often reduced to *d'r* or *'r*: *Ik heb d'r twee.* Write *er*.`,
      nl: `*Er* is het lastigste kleine woord van het Nederlands, omdat het vijf verschillende dingen doet. Het is altijd onbeklemtoond en staat in de regel **direct na de persoonsvorm** (of na het onderwerp als er inversie is).

**1. Plaats**: een onbeklemtoond *daar*. *Ben je weleens in Parijs geweest? Ja, ik ben* **er** *twee keer geweest.* De beklemtoonde vormen zijn *daar* en *hier*: *Daar ben ik nooit geweest.*

**2. Een onbepaald onderwerp inleiden.** Als het onderwerp *een ..., geen ..., veel ..., iemand, niemand, iets* is, begint de zin met *er*, en waar het kan gebruikt het Nederlands liever een positiewerkwoord dan *zijn*:
- **Er** *staat een man voor de deur.*
- **Er** *zijn veel mensen.* **Er** *is geen melk meer.*
- *Is* **er** *iemand thuis? Wat is* **er** *gebeurd?*
- *Morgen komt* **er** *een nieuwe collega.*

Niet bij een bepaald onderwerp: *De man staat voor de deur.*

**3. Bij een telwoord of een hoeveelheid**, waar het Engels *of them* weglaat en het Nederlands dat niet kan: *Hoeveel kinderen heb je? Ik heb* **er** *twee.* *Heb je nog broodjes? Ik heb* **er** *genoeg / geen meer.*

**4. Met een voorzetsel, voor dingen.** *Op het, van het, met ze* bestaan niet in het Nederlands; een voorzetsel plus een voornaamwoord voor een **ding** wordt *er* + voorzetsel, aan elkaar geschreven:
- *Ik wacht op de bus.* → *Ik wacht* **erop***.*
- *Ik denk aan mijn examen.* → *Ik denk* **eraan***.*
- *Ik schrijf met een pen.* → *Ik schrijf* **ermee***.* (*met* wordt **mee**, *tot* wordt **toe**: *ertoe*)

Voor een **persoon** blijft het voornaamwoord staan: *Ik wacht op hem. Ik denk aan haar.*

De twee delen worden heel vaak **gesplitst**, met het voorzetsel achteraan: *Ik wacht* **er** *al een uur* **op***. Ik heb* **er** *niet* **aan** *gedacht.* In de spreektaal is splitsen de norm.

*Er* heeft drie beklemtoonde familieleden die op dezelfde manier werken en de hele familie haar grammaticale naam geven, **voornaamwoordelijke bijwoorden**:

| | er (onbeklemtoond) | daar | hier | waar |
| --- | --- | --- | --- | --- |
| op | erop | daarop | hierop | waarop |
| aan | eraan | daaraan | hieraan | waaraan |
| van | ervan | daarvan | hiervan | waarvan |
| over | erover | daarover | hierover | waarover |
| met | ermee | daarmee | hiermee | waarmee |
| tot | ertoe | daartoe | hiertoe | waartoe |

- **Daar** *weet ik niets* **van***.*
- **Hiermee** *kun je de deur openen.*
- **Waar** *denk je* **aan***?* of, formeler, **Waaraan** *denk je?*
- *de pen* **waarmee** *ik schrijf* (zie *die, dat, wie, wat*)
- Ook *ergens, nergens, overal*: *Ik denk* **nergens aan***. Hij praat* **overal over***.*

Het kan ook een bijzin aankondigen: *Ik reken* **erop** *dat je komt.* *Ik heb* **er** *geen zin* **in** *om te koken.* Een paar voorzetsels combineren niet: *zonder, tijdens, sinds, volgens*.

**5. In een passief zonder onderwerp**: *Er wordt gebeld.* *Er werd veel gelachen.* *Er wordt hier niet gerookt.* Zie *het passief*.

Twee functies kunnen samenvallen, en dan staan er twee keer *er*: *Hoeveel stoelen zijn er?* **Er** *zijn* **er** *drie.*

**In de spreektaal** wordt *er* vaak *d'r* of *'r*: *Ik heb d'r twee.* Schrijf *er*.`,
    },
  },

  {
    id: 'niet-geen',
    keywords: ['niet of geen', 'geen of niet', 'niet en geen', 'geen en niet', 'niet vs geen', 'geen vs niet',
      'niet or geen', 'geen or niet', 'verschil tussen niet en geen', 'difference between niet and geen',
      'when do i use geen', 'when to use geen', 'when do i use niet', 'when to use niet', 'plaats van niet',
      'waar staat niet', 'where does niet go', 'position of niet', 'negatie', 'ontkenning', 'ontkennende zin',
      'ontkennende zinnen', 'negation', 'negative', 'negatives', 'negative sentence', 'negative sentences',
      'double negative', 'dubbele ontkenning', 'jawel', 'niets of niks', 'niks of niets', 'nooit niet'],
    title: { nl: 'Niet en geen', en: 'Niet vs. geen' },
    body: {
      en: `Dutch has two words for *not*, and the choice is mechanical once you see it.

**Geen** negates a noun that has *een* or **no article** at all. It is *niet* + *een* fused into one word, and it also covers plurals and uncountables:
- *Ik heb een fiets.* → *Ik heb* **geen** *fiets.* (I don't have a bike)
- *Ik drink koffie.* → *Ik drink* **geen** *koffie.*
- *Ik heb kinderen.* → *Ik heb* **geen** *kinderen.*
- *Ik spreek* **geen** *Frans. Ik heb* **geen** *tijd / honger / zin.*

**Niet** negates everything else: verbs, adjectives, adverbs, prepositional phrases, and nouns with *de, het, deze, die, mijn* or a name:
- *Ik werk* **niet***. Het is* **niet** *duur. Hij woont* **niet** *in Utrecht.*
- *Ik heb* **de** *fiets* **niet***. Dat is* **niet** *mijn fiets. Ik ken Anna* **niet***.*

**Where niet goes.** Its default place is towards the **end** of the clause, after the (definite) object and the time:
- *Ik zie hem* **niet***. Ik ken die man* **niet***. Ik kom morgen* **niet***.*

But it goes **before**:
- the adjective or adverb it negates: *Het is* **niet** *duur. Hij loopt* **niet** *snel.*
- a prepositional phrase: *Ik woon* **niet** *in Amsterdam. Ik ga* **niet** *naar school.*
- the verbs at the end: a participle, an infinitive or a separable prefix: *Ik heb het boek* **niet** *gelezen. Ik kan morgen* **niet** *komen. Ik bel je* **niet** *op.*
- the word it contrasts: *Ik kom* **niet** *morgen, maar overmorgen.*

| | |
| --- | --- |
| niet after | *Ik zie hem niet.* *Ik kom morgen niet.* |
| niet before adjective, preposition, final verbs | *Het is niet duur.* *Ik woon niet in Utrecht.* *Ik heb niet gebeld.* |
| geen before a noun with een or no article | *Ik heb geen auto.* *Ik drink geen melk.* |

**Other negative words**: *nooit* (never), *niets* (nothing; in speech *niks*), *niemand* (nobody), *nergens* (nowhere), *nog niet* (not yet), *niet meer* (no longer), *geen ... meer* (no more): *Ik heb niets gezien. Ik heb geen geld meer. Hij woont hier niet meer.*

Standard Dutch does **not** double its negatives: *Ik heb niets gezien*, not *nooit niks*. You will hear *nooit niet* and *nooit geen* in some regions and in casual speech; they count as mistakes in writing.

**Wel** is the positive counterpart of *niet* and corrects a negative: *Ik heb geen auto, maar* **wel** *een fiets. Hij komt niet, zij* **wel***.* And to contradict a negative question or claim, the answer is **jawel**, not *ja*: *Kom je niet?* **Jawel!** (Yes I am.)

For *don't have to*, which is *niet hoeven*, see *de modale werkwoorden*.`,
      nl: `Het Nederlands heeft twee woorden voor *not*, en de keuze is bijna mechanisch als je het eenmaal ziet.

**Geen** ontkent een zelfstandig naamwoord met *een* of **helemaal zonder lidwoord**. Het is *niet* + *een* in één woord, en het dekt ook meervouden en niet-telbare woorden:
- *Ik heb een fiets.* → *Ik heb* **geen** *fiets.*
- *Ik drink koffie.* → *Ik drink* **geen** *koffie.*
- *Ik heb kinderen.* → *Ik heb* **geen** *kinderen.*
- *Ik spreek* **geen** *Frans. Ik heb* **geen** *tijd / honger / zin.*

**Niet** ontkent al het andere: werkwoorden, bijvoeglijke naamwoorden, bijwoorden, voorzetselgroepen, en zelfstandige naamwoorden met *de, het, deze, die, mijn* of een naam:
- *Ik werk* **niet***. Het is* **niet** *duur. Hij woont* **niet** *in Utrecht.*
- *Ik heb* **de** *fiets* **niet***. Dat is* **niet** *mijn fiets. Ik ken Anna* **niet***.*

**De plaats van niet.** Standaard staat het richting het **eind** van de zin, na het (bepaalde) lijdend voorwerp en de tijd:
- *Ik zie hem* **niet***. Ik ken die man* **niet***. Ik kom morgen* **niet***.*

Maar het staat **vóór**:
- het bijvoeglijk naamwoord of bijwoord dat het ontkent: *Het is* **niet** *duur. Hij loopt* **niet** *snel.*
- een voorzetselgroep: *Ik woon* **niet** *in Amsterdam. Ik ga* **niet** *naar school.*
- de werkwoorden aan het eind: een voltooid deelwoord, een infinitief of een scheidbaar voorvoegsel: *Ik heb het boek* **niet** *gelezen. Ik kan morgen* **niet** *komen. Ik bel je* **niet** *op.*
- het woord waarmee het contrasteert: *Ik kom* **niet** *morgen, maar overmorgen.*

| | |
| --- | --- |
| niet erna | *Ik zie hem niet.* *Ik kom morgen niet.* |
| niet vóór bijvoeglijk naamwoord, voorzetsel, werkwoorden aan het eind | *Het is niet duur.* *Ik woon niet in Utrecht.* *Ik heb niet gebeld.* |
| geen vóór een zelfstandig naamwoord met een of zonder lidwoord | *Ik heb geen auto.* *Ik drink geen melk.* |

**Andere ontkennende woorden**: *nooit, niets* (in de spreektaal *niks*), *niemand, nergens, nog niet, niet meer, geen ... meer*: *Ik heb niets gezien. Ik heb geen geld meer. Hij woont hier niet meer.*

Het Standaardnederlands verdubbelt zijn ontkenningen **niet**: *Ik heb niets gezien*, niet *nooit niks*. In sommige streken en in informele spreektaal hoor je *nooit niet* en *nooit geen*; op papier gelden ze als fouten.

**Wel** is de positieve tegenhanger van *niet* en corrigeert een ontkenning: *Ik heb geen auto, maar* **wel** *een fiets. Hij komt niet, zij* **wel***.* En om een ontkennende vraag of bewering tegen te spreken, antwoord je **jawel**, niet *ja*: *Kom je niet?* **Jawel!**

Voor *don't have to*, dat *niet hoeven* is, zie *de modale werkwoorden*.`,
    },
  },

  {
    id: 'bijvoeglijk-naamwoord',
    keywords: ['bijvoeglijk naamwoord', 'bijvoeglijke naamwoorden', 'bijvoeglijk', 'adjectief', 'adjectieven',
      'adjective', 'adjectives', 'adjective endings', 'adjective ending', 'uitgang van het bijvoeglijk naamwoord',
      'buigings-e', 'buigingse', 'de e van het bijvoeglijk naamwoord', 'wanneer krijgt het bijvoeglijk naamwoord een e',
      'when does the adjective get an e', 'adjective e', 'groot of grote', 'grote of groot', 'een groot huis',
      'mooi of mooie', 'adjective agreement', 'verbuiging', 'iets leuks', 'iets moois', 'houten', 'gouden'],
    title: { nl: 'Het bijvoeglijk naamwoord: wel of geen -e', en: 'Adjectives: when they take -e' },
    body: {
      en: `An adjective in front of a noun takes **-e**, with exactly **one exception**: a **singular het-word** with *een*, *geen*, or no article at all. After the verb (predicate) it never changes.

| | de-word | het-word |
| --- | --- | --- |
| definite: de / het, deze, die, dit, dat, mijn ... | de grot**e** tafel | het grot**e** huis |
| indefinite singular: een, geen, elk, zo'n, no article | een grot**e** tafel | een groot huis |
| plural | grot**e** tafels | grot**e** huizen |
| after the verb | De tafel is groot. | Het huis is groot. |

So: *een mooi boek, geen goed idee, elk nieuw begin, zo'n leuk kind, koud water, lekker brood*, but *het mooie boek, mijn nieuwe huis, twee mooie boeken, een mooie dag*.

**Spelling** when *-e* is added follows the usual rules (see *spelling*): *groot → grote, dik → dikke, lief → lieve, boos → boze, vies → vieze*.

In speech, *goede, rode, oude, koude* are often *goeie, rooie, ouwe, kouwe*. Write the full forms.

**Adjectives that never take -e:**
- adjectives of material ending in *-en*: *een houten tafel, de gouden ring, wollen sokken, katoenen kleren*
- participles ending in *-en* used as adjectives: *de gesloten deur, een gebroken been, het verloren geld*; also *open, eigen, tevreden*: *mijn eigen kamer*
- a few loanwords and colours: *een plastic tas, een roze jurk, een oranje shirt, een aluminium pan*
- *linker* and *rechter*, which are written onto the noun: *de linkerhand, het rechterbeen*

**Meaning can hang on the -e.** With a het-word after *een*, the ending is sometimes dropped to say *great* rather than *big*, or to name a type: *een groot man* (a great man) against *een grote man* (a tall man). Fixed names keep the bare form too: *het openbaar vervoer, het voortgezet onderwijs, het dagelijks leven, het centraal station*.

**After iets, niets, wat, veel, weinig, genoeg**, the adjective takes **-s**: *iets leuks, niets bijzonders, wat lekkers, veel goeds, iets nieuws*.

**An adjective can stand for the noun**, and then it takes *-e*: *Welke wil je? De rode.* (Which one do you want? The red one.) *Een grote of een kleine?* *Het leuke is dat ...* (the nice thing is that ...) *De rijken en de armen.*

**Comparatives** behave exactly like other adjectives: *een grotere tafel*, *een groter huis*, *het grootste huis* (see *trappen van vergelijking*).`,
      nl: `Een bijvoeglijk naamwoord vóór een zelfstandig naamwoord krijgt **-e**, met precies **één uitzondering**: een **het-woord in het enkelvoud** met *een*, *geen* of helemaal geen lidwoord. Na het werkwoord (als naamwoordelijk deel) verandert het nooit.

| | de-woord | het-woord |
| --- | --- | --- |
| bepaald: de / het, deze, die, dit, dat, mijn ... | de grot**e** tafel | het grot**e** huis |
| onbepaald enkelvoud: een, geen, elk, zo'n, geen lidwoord | een grot**e** tafel | een groot huis |
| meervoud | grot**e** tafels | grot**e** huizen |
| na het werkwoord | De tafel is groot. | Het huis is groot. |

Dus: *een mooi boek, geen goed idee, elk nieuw begin, zo'n leuk kind, koud water, lekker brood*, maar *het mooie boek, mijn nieuwe huis, twee mooie boeken, een mooie dag*.

**De spelling** bij het toevoegen van *-e* volgt de gewone regels (zie *spelling*): *groot → grote, dik → dikke, lief → lieve, boos → boze, vies → vieze*.

In de spreektaal worden *goede, rode, oude, koude* vaak *goeie, rooie, ouwe, kouwe*. Schrijf de volledige vormen.

**Bijvoeglijke naamwoorden die nooit -e krijgen:**
- stofnamen op *-en*: *een houten tafel, de gouden ring, wollen sokken, katoenen kleren*
- deelwoorden op *-en* die als bijvoeglijk naamwoord worden gebruikt: *de gesloten deur, een gebroken been, het verloren geld*; ook *open, eigen, tevreden*: *mijn eigen kamer*
- een paar leenwoorden en kleuren: *een plastic tas, een roze jurk, een oranje shirt, een aluminium pan*
- *linker* en *rechter*, die aan het zelfstandig naamwoord vast worden geschreven: *de linkerhand, het rechterbeen*

**De betekenis kan aan de -e hangen.** Bij een het-woord na *een* valt de uitgang soms weg om een kwaliteit of een soort aan te duiden: *een groot man* (belangrijk) tegenover *een grote man* (lang). Vaste benamingen houden de onverbogen vorm ook: *het openbaar vervoer, het voortgezet onderwijs, het dagelijks leven, het centraal station*.

**Na iets, niets, wat, veel, weinig, genoeg** krijgt het bijvoeglijk naamwoord **-s**: *iets leuks, niets bijzonders, wat lekkers, veel goeds, iets nieuws*.

**Een bijvoeglijk naamwoord kan het zelfstandig naamwoord vervangen**, en krijgt dan *-e*: *Welke wil je? De rode.* *Een grote of een kleine?* *Het leuke is dat ...* *De rijken en de armen.*

**Vergrotende trappen** gedragen zich precies als andere bijvoeglijke naamwoorden: *een grotere tafel*, *een groter huis*, *het grootste huis* (zie *trappen van vergelijking*).`,
    },
  },

  {
    id: 'verkleinwoorden',
    keywords: ['verkleinwoord', 'verkleinwoorden', 'verkleinwoordjes', 'verkleining', 'diminutief', 'diminutieven',
      'diminutive', 'diminutives', 'je of tje', 'tje of je', 'je tje etje pje kje', '-je', '-tje', '-etje', '-pje', '-kje',
      'wanneer tje', 'when tje', 'when do i use tje', 'how to make a diminutive', 'hoe maak je een verkleinwoord',
      'meisje', 'huisje', 'biertje', 'small words', 'little words'],
    title: { nl: 'Verkleinwoorden', en: 'Diminutives' },
    body: {
      en: `Dutch uses diminutives all the time, and not only for small things. *Een biertje* is a glass of beer, *een kaartje* a ticket, *een telefoontje* a phone call, *een momentje* a moment, *een feestje* a party. They make a thing more casual, more friendly or more countable, and quite a few have become words of their own: *het meisje* (girl), *het koekje* (biscuit), *het toetje* (dessert), *het sprookje* (fairy tale).

Two rules with no exceptions: every diminutive is a **het-word**, and every plural ends in **-s**: *het huisje, de huisjes*.

**The ending** is *-je*, in five shapes depending on how the word ends:

| ending | after | examples |
| --- | --- | --- |
| **-je** | most consonants: *b, d, f, g, k, p, s, t, ch* | huis → huisje, boek → boekje, hond → hondje, kat → katje, brood → broodje |
| **-tje** | a vowel; a long vowel or diphthong + *l, n, r, w*; unstressed *-el, -en, -er, -or* | ei → eitje, auto → autootje, stoel → stoeltje, schoen → schoentje, deur → deurtje, vrouw → vrouwtje, tafel → tafeltje, kamer → kamertje |
| **-etje** | a short vowel + *l, m, n, ng, r* | bal → balletje, kam → kammetje, man → mannetje, ring → ringetje, ster → sterretje |
| **-pje** | *m* after a long vowel, a diphthong, *l, r* or an unstressed syllable | boom → boompje, raam → raampje, film → filmpje, arm → armpje, bodem → bodempje |
| **-kje** | unstressed *-ing* (the *g* drops) | koning → koninkje, woning → woninkje, ketting → kettinkje |

Compare *ring → ringetje* (stressed) with *koning → koninkje* (unstressed *-ing*).

**Spelling.** A final long vowel is doubled to stay long: *auto → autootje, oma → omaatje, foto → fotootje, paraplu → parapluutje, café → cafeetje*. A short vowel followed by *b, g, p* sometimes takes *-etje* with a doubled consonant: *brug → bruggetje, weg → weggetje, pop → poppetje, kip → kippetje*.

**A few change their vowel**, like their plurals do: *glas → glaasje, schip → scheepje, pad → paadje, gat → gaatje, blad → blaadje*. And *jongen → jongetje*, *bloem → bloemetje* (a bunch of flowers; *bloempje* is a small flower).

**The meaning often shifts**:
- *het brood* (bread) and *een broodje* (a roll)
- *de kaart* (map, card) and *een kaartje* (a ticket)
- *het ijs* (ice) and *een ijsje* (an ice cream)
- *de koek* (cake) and *een koekje* (a biscuit)
- *een kop koffie* (a mug) and *een kopje koffie* (a cup)
- *een uur* (an hour) and *een uurtje* (an hour or so, no hurry)

Adverbs take them too: *even → eventjes* (just a moment), *zacht → zachtjes* (softly), *stil → stilletjes*, *net → netjes* (neatly, properly).

**In speech** you will hear *-ie* in the west of the Netherlands (*huisie, koppie, meisie*) and *-ke* in the south and in Flanders (*huiske, meiske*). Recognise them; write *-je*.`,
      nl: `Het Nederlands gebruikt voortdurend verkleinwoorden, en niet alleen voor kleine dingen. *Een biertje* is een glas bier, *een kaartje* een toegangsbewijs, *een telefoontje* een telefoongesprek, *een momentje* een ogenblik, *een feestje* een feest. Het verkleinwoord maakt iets informeler, vriendelijker of telbaar, en heel wat verkleinwoorden zijn zelfstandige woorden geworden: *het meisje, het koekje, het toetje, het sprookje*.

Twee regels zonder uitzondering: elk verkleinwoord is een **het-woord**, en elk meervoud eindigt op **-s**: *het huisje, de huisjes*.

**De uitgang** is *-je*, in vijf gedaanten, afhankelijk van het eind van het woord:

| uitgang | na | voorbeelden |
| --- | --- | --- |
| **-je** | de meeste medeklinkers: *b, d, f, g, k, p, s, t, ch* | huis → huisje, boek → boekje, hond → hondje, kat → katje, brood → broodje |
| **-tje** | een klinker; een lange klinker of tweeklank + *l, n, r, w*; onbeklemtoond *-el, -en, -er, -or* | ei → eitje, auto → autootje, stoel → stoeltje, schoen → schoentje, deur → deurtje, vrouw → vrouwtje, tafel → tafeltje, kamer → kamertje |
| **-etje** | een korte klinker + *l, m, n, ng, r* | bal → balletje, kam → kammetje, man → mannetje, ring → ringetje, ster → sterretje |
| **-pje** | *m* na een lange klinker, een tweeklank, *l, r* of een onbeklemtoonde lettergreep | boom → boompje, raam → raampje, film → filmpje, arm → armpje, bodem → bodempje |
| **-kje** | onbeklemtoond *-ing* (de *g* valt weg) | koning → koninkje, woning → woninkje, ketting → kettinkje |

Vergelijk *ring → ringetje* (beklemtoond) met *koning → koninkje* (onbeklemtoond *-ing*).

**Spelling.** Een lange klinker aan het eind wordt verdubbeld om lang te blijven: *auto → autootje, oma → omaatje, foto → fotootje, paraplu → parapluutje, café → cafeetje*. Een korte klinker gevolgd door *b, g, p* krijgt soms *-etje* met een dubbele medeklinker: *brug → bruggetje, weg → weggetje, pop → poppetje, kip → kippetje*.

**Een paar woorden veranderen van klinker**, net als in hun meervoud: *glas → glaasje, schip → scheepje, pad → paadje, gat → gaatje, blad → blaadje*. En *jongen → jongetje*, *bloem → bloemetje* (een boeket; *bloempje* is een kleine bloem).

**De betekenis verschuift vaak**:
- *het brood* en *een broodje*
- *de kaart* en *een kaartje* (voor de trein, de bioscoop)
- *het ijs* en *een ijsje*
- *de koek* en *een koekje*
- *een kop koffie* (een mok) en *een kopje koffie*
- *een uur* en *een uurtje* (ongeveer een uur, zonder haast)

Ook bijwoorden krijgen ze: *even → eventjes, zacht → zachtjes, stil → stilletjes, net → netjes*.

**In de spreektaal** hoor je in het westen van Nederland *-ie* (*huisie, koppie, meisie*) en in het zuiden en in Vlaanderen *-ke* (*huiske, meiske*). Herken ze; schrijf *-je*.`,
    },
  },

  {
    id: 'meervoud',
    keywords: ['meervoud', 'meervouden', 'meervoudsvorm', 'meervoudsvormen', 'het meervoud', 'plural', 'plurals',
      'plural form', 'plural forms', 'en of s', 's of en', '-en of -s', 'meervoud op en', 'meervoud op s',
      'meervoud op -en', 'meervoud op -s', 'plural in en', 'plural in s', 'wanneer s en wanneer en', 'apostrof s',
      "auto's", 'meervoud met apostrof', 'eieren', 'kinderen', 'stad steden', 'twee jaar of twee jaren',
      'how do i make the plural', 'hoe maak je het meervoud', 'how to form the plural'],
    title: { nl: 'Het meervoud: -en en -s', en: 'Plurals: -en and -s' },
    body: {
      en: `Dutch plurals end in **-en** or **-s**. Which one depends mostly on the **sound** of the end of the word, and every plural, whatever its singular, takes the article **de**.

**-en** is the usual ending, especially for words of one syllable or with the stress on the last syllable: *boek → boeken, stoel → stoelen, fiets → fietsen, kantoor → kantoren*. The spelling rules apply (see *spelling*): *maan → manen, man → mannen, brief → brieven, huis → huizen*.

**-s** goes on:
- words ending in an unstressed **-el, -em, -en, -er, -je**: *tafel → tafels, bezem → bezems, jongen → jongens, kamer → kamers*, and every diminutive: *meisje → meisjes*
- most **loanwords**: *film → films, hotel → hotels, tram → trams, computer → computers, restaurant → restaurants*
- many words ending in an unstressed **-e**: *tante → tantes, dame → dames* (some take both: *gemeente → gemeenten / gemeentes*)
- words for family members and professions ending in a vowel or *-ier, -eur*: *oma → oma's, broer → broers, winkelier → winkeliers, chauffeur → chauffeurs*

**The apostrophe.** After a single *a, i, o, u* or *y* that is pronounced long, the *s* is attached with an apostrophe, otherwise the vowel would read as short: *auto → auto's, foto → foto's, taxi → taxi's, menu → menu's, baby → baby's, opa → opa's*. Not after *-e, -é* or a two-letter vowel: *tantes, cafés, cadeaus*.

| singular | plural | why |
| --- | --- | --- |
| boek | boeken | one syllable |
| tafel | tafels | unstressed -el |
| meisje | meisjes | diminutive |
| auto | auto's | long vowel at the end |
| kind | kinderen | -eren group |
| stad | steden | vowel change |
| museum | musea (museums) | Latin |

**-eren** is a small group of het-words: *kind → kinderen, ei → eieren, lied → liederen, blad → bladeren* (leaves; *bladen* is sheets or magazines), *kalf → kalveren, lam → lammeren, rund → runderen, volk → volkeren, been → beenderen* (bones; *benen* is legs).

**The vowel changes** in some common words. A short vowel becomes long: *dag → dagen, glas → glazen, weg → wegen, dak → daken, bad → baden, gat → gaten, slot → sloten, spel → spelen, oorlog → oorlogen*. A few change altogether: *stad → steden, schip → schepen, lid → leden, koe → koeien*, and *-heid* becomes *-heden*: *mogelijkheid → mogelijkheden*.

**Latin and Greek words** keep their old plural beside a Dutch one: *museum → musea / museums, datum → data / datums, politicus → politici, musicus → musici, catalogus → catalogi / catalogussen*.

**Both endings** are correct for some words, and *-en* tends to sound a little more formal: *appel → appels / appelen, aardappel → aardappels / aardappelen, leraar → leraren / leraars, ziekte → ziektes / ziekten*.

**After a number**, units of measure, time and money stay **singular**: *twee jaar, drie uur, een kwartier, vijf euro, tien kilo, twee meter, drie keer, honderd gram*. But *dag, week, maand, minuut, seconde* take the plural: *twee dagen, drie weken, tien minuten*. *Drie uur* is a length of time; *de laatste drie uren* counts them one by one.

**Singular in Dutch, plural in English**: *de bril* (glasses), *de broek* (trousers), *de schaar* (scissors), *de politie is* (the police are). And the other way round: *de hersenen* (the brain), *de Verenigde Staten zijn*.`,
      nl: `Het Nederlandse meervoud eindigt op **-en** of **-s**. Welke van de twee hangt vooral af van de **klank** van het woordeinde, en elk meervoud, wat het enkelvoud ook is, krijgt het lidwoord **de**.

**-en** is de gewone uitgang, vooral bij woorden van één lettergreep of met de klemtoon op de laatste lettergreep: *boek → boeken, stoel → stoelen, fiets → fietsen, kantoor → kantoren*. De spellingregels gelden (zie *spelling*): *maan → manen, man → mannen, brief → brieven, huis → huizen*.

**-s** komt na:
- woorden op een onbeklemtoond **-el, -em, -en, -er, -je**: *tafel → tafels, bezem → bezems, jongen → jongens, kamer → kamers*, en elk verkleinwoord: *meisje → meisjes*
- de meeste **leenwoorden**: *film → films, hotel → hotels, tram → trams, computer → computers, restaurant → restaurants*
- veel woorden op een onbeklemtoonde **-e**: *tante → tantes, dame → dames* (sommige kunnen allebei: *gemeente → gemeenten / gemeentes*)
- woorden voor familieleden en beroepen op een klinker of op *-ier, -eur*: *oma → oma's, broer → broers, winkelier → winkeliers, chauffeur → chauffeurs*

**De apostrof.** Na één *a, i, o, u* of *y* die lang wordt uitgesproken, komt de *s* met een apostrof, anders zou de klinker kort gelezen worden: *auto → auto's, foto → foto's, taxi → taxi's, menu → menu's, baby → baby's, opa → opa's*. Niet na *-e, -é* of een klinker van twee letters: *tantes, cafés, cadeaus*.

| enkelvoud | meervoud | waarom |
| --- | --- | --- |
| boek | boeken | één lettergreep |
| tafel | tafels | onbeklemtoond -el |
| meisje | meisjes | verkleinwoord |
| auto | auto's | lange klinker aan het eind |
| kind | kinderen | groep op -eren |
| stad | steden | klinkerverandering |
| museum | musea (museums) | Latijn |

**-eren** is een kleine groep het-woorden: *kind → kinderen, ei → eieren, lied → liederen, blad → bladeren* (van een boom; *bladen* zijn vellen papier of tijdschriften), *kalf → kalveren, lam → lammeren, rund → runderen, volk → volkeren, been → beenderen* (botten; *benen* zijn lichaamsdelen).

**De klinker verandert** in een aantal veelgebruikte woorden. Een korte klinker wordt lang: *dag → dagen, glas → glazen, weg → wegen, dak → daken, bad → baden, gat → gaten, slot → sloten, spel → spelen, oorlog → oorlogen*. Een paar veranderen helemaal: *stad → steden, schip → schepen, lid → leden, koe → koeien*, en *-heid* wordt *-heden*: *mogelijkheid → mogelijkheden*.

**Latijnse en Griekse woorden** houden hun oude meervoud naast een Nederlands: *museum → musea / museums, datum → data / datums, politicus → politici, musicus → musici, catalogus → catalogi / catalogussen*.

**Beide uitgangen** zijn bij sommige woorden correct, en *-en* klinkt dan meestal iets formeler: *appel → appels / appelen, aardappel → aardappels / aardappelen, leraar → leraren / leraars, ziekte → ziektes / ziekten*.

**Na een telwoord** blijven maten, tijdseenheden en geldbedragen in het **enkelvoud**: *twee jaar, drie uur, een kwartier, vijf euro, tien kilo, twee meter, drie keer, honderd gram*. Maar *dag, week, maand, minuut, seconde* krijgen het meervoud: *twee dagen, drie weken, tien minuten*. *Drie uur* is een tijdsduur; *de laatste drie uren* telt ze een voor een.

**Enkelvoud in het Nederlands, meervoud in het Engels**: *de bril* (glasses), *de broek* (trousers), *de schaar* (scissors), *de politie is* (the police are). En andersom: *de hersenen* (the brain), *de Verenigde Staten zijn*.`,
    },
  },

  {
    id: 'persoonlijke-voornaamwoorden',
    keywords: ['persoonlijk voornaamwoord', 'persoonlijke voornaamwoorden', 'voornaamwoord', 'voornaamwoorden',
      'personal pronoun', 'personal pronouns', 'pronoun', 'pronouns', 'subject pronouns', 'object pronouns',
      'onderwerpsvorm', 'voorwerpsvorm', 'jij of je', 'je of jij', 'zij of ze', 'ze of zij', 'wij of we', 'we of wij',
      'mij of me', 'me of mij', 'jou of je', 'jij of u', 'u of jij', 'je of u', 'u of je', 'jij en u', 'u en jij',
      'tutoyeren', 'when to use u', 'when do i use u', 'formal you', 'informal you', 'formeel of informeel', 'beleefdheidsvorm',
      'hen of hun', 'hun of hen', 'hen hun ze', 'hun hebben', 'stressed and unstressed', 'beklemtoond en onbeklemtoond',
      'gereduceerde vormen', 'bezittelijk voornaamwoord', 'bezittelijke voornaamwoorden', 'possessive', 'possessives',
      'possessive pronouns', 'mijn jouw zijn haar'],
    title: { nl: 'Persoonlijke voornaamwoorden: jij, je en u', en: 'Personal pronouns: jij, je and u' },
    body: {
      en: `Most Dutch pronouns come in a **stressed** and an **unstressed** form. The unstressed one is the default in speech and in ordinary writing; the stressed one is for emphasis and contrast.

| | subject | object | possessive |
| --- | --- | --- | --- |
| I | ik | mij, me | mijn |
| you (informal) | jij, je | jou, je | jouw, je |
| you (polite) | u | u | uw |
| he | hij | hem | zijn |
| she | zij, ze | haar | haar |
| it | het | het | zijn |
| we | wij, we | ons | ons / onze |
| you (plural) | jullie | jullie | jullie |
| they | zij, ze | hen, hun, ze | hun |

- *Ga* **je** *mee?* (unstressed, the normal question) *Ga* **jij** *mee, of hij?* (stressed, contrast)
- *Ik heb* **je** *gezien.* against *Ik heb* **jou** *gezien, niet hem.*
- *Ons* goes with het-words, *onze* with de-words and plurals: *ons huis, onze tafel, onze kinderen* (see *de en het*).

**Je** also means *one, you in general*: *In Nederland fiets* **je** *veel.* (In the Netherlands people cycle a lot.)

**Jij or u?** *U* is the polite form, singular and plural, and takes the verb form of *jij* or of *hij*: *u bent, u hebt* (also *u heeft*), *u kunt, u wilt*. Use *u* for strangers who are older than you, for customers, officials and in formal letters; *jij* for family, friends, children, fellow students and most colleagues. The Netherlands moves to *je* quickly, and someone who wants it will say so: *Zeg maar je.* (Do call me *je*.) When in doubt with an older stranger, start with *u*.

**Hen, hun or ze?** The official rule has *hen* for a direct object and after a preposition (*Ik zie* **hen***. Ik geef het aan* **hen***.*) and *hun* for an indirect object without a preposition (*Ik geef* **hun** *het boek.*). In practice, the unstressed *ze* does both jobs and is what people say: *Ik zie ze. Ik geef ze het boek.* For things, only *ze*. What is **not** standard is *hun* as a subject: *Hun hebben het gedaan* is heard everywhere and counted wrong everywhere; say *Zij hebben het gedaan.*

**Referring to things.** A de-word is *hij* / *hem*, a het-word is *het*: *Waar is mijn fiets?* **Hij** *staat buiten. Ik heb* **hem** *gisteren gekocht.* But *het* can never carry stress; the stressed form is *dat*: **Dat** *weet ik niet.* (not *Het weet ik niet*). After a preposition, *het* and *ze* for things become *er* + preposition: see *er*.

**Spoken forms** you will hear but should not write: *'k* (ik), *'m* (hem), *d'r* (haar), *'t* (het), *ie* (hij after the verb: *Komt-ie?*), and *me* for *mijn* (*me fiets*), which is a mistake in writing.`,
      nl: `De meeste Nederlandse voornaamwoorden hebben een **beklemtoonde** en een **onbeklemtoonde** vorm. De onbeklemtoonde is de gewone vorm in de spreektaal en in alledaagse teksten; de beklemtoonde gebruik je voor nadruk en contrast.

| | onderwerp | voorwerp | bezittelijk |
| --- | --- | --- | --- |
| 1e persoon enkelvoud | ik | mij, me | mijn |
| 2e persoon enkelvoud | jij, je | jou, je | jouw, je |
| beleefdheidsvorm | u | u | uw |
| 3e persoon mannelijk | hij | hem | zijn |
| 3e persoon vrouwelijk | zij, ze | haar | haar |
| 3e persoon onzijdig | het | het | zijn |
| 1e persoon meervoud | wij, we | ons | ons / onze |
| 2e persoon meervoud | jullie | jullie | jullie |
| 3e persoon meervoud | zij, ze | hen, hun, ze | hun |

- *Ga* **je** *mee?* (onbeklemtoond, de gewone vraag) *Ga* **jij** *mee, of hij?* (beklemtoond, contrast)
- *Ik heb* **je** *gezien.* tegenover *Ik heb* **jou** *gezien, niet hem.*
- *Ons* hoort bij het-woorden, *onze* bij de-woorden en meervouden: *ons huis, onze tafel, onze kinderen* (zie *de en het*).

**Je** betekent ook *men, iedereen*: *In Nederland fiets* **je** *veel.*

**Jij of u?** *U* is de beleefdheidsvorm, enkelvoud en meervoud, en krijgt de werkwoordsvorm van *jij* of van *hij*: *u bent, u hebt* (ook *u heeft*), *u kunt, u wilt*. Gebruik *u* tegen onbekenden die ouder zijn dan jij, tegen klanten, ambtenaren en in formele brieven; *jij* tegen familie, vrienden, kinderen, medestudenten en de meeste collega's. In Nederland gaat men snel over op *je*, en wie dat wil, zegt het: *Zeg maar je.* Bij twijfel tegenover een oudere onbekende begin je met *u*.

**Hen, hun of ze?** De officiële regel geeft *hen* voor een lijdend voorwerp en na een voorzetsel (*Ik zie* **hen***. Ik geef het aan* **hen***.*) en *hun* voor een meewerkend voorwerp zonder voorzetsel (*Ik geef* **hun** *het boek.*). In de praktijk doet het onbeklemtoonde *ze* allebei, en dat is wat mensen zeggen: *Ik zie ze. Ik geef ze het boek.* Voor dingen alleen *ze*. Wat **geen** standaardtaal is: *hun* als onderwerp. *Hun hebben het gedaan* hoor je overal en geldt overal als fout; zeg *Zij hebben het gedaan.*

**Verwijzen naar dingen.** Een de-woord is *hij* / *hem*, een het-woord is *het*: *Waar is mijn fiets?* **Hij** *staat buiten. Ik heb* **hem** *gisteren gekocht.* Maar *het* kan nooit klemtoon krijgen; de beklemtoonde vorm is *dat*: **Dat** *weet ik niet.* (niet *Het weet ik niet*). Na een voorzetsel worden *het* en *ze* voor dingen *er* + voorzetsel: zie *er*.

**Spreektaalvormen** die je wel hoort maar niet schrijft: *'k* (ik), *'m* (hem), *d'r* (haar), *'t* (het), *ie* (hij na het werkwoord: *Komt-ie?*), en *me* voor *mijn* (*me fiets*), wat in geschreven taal een fout is.`,
    },
  },

  {
    id: 'wederkerende-werkwoorden',
    keywords: ['wederkerend werkwoord', 'wederkerende werkwoorden', 'wederkerend', 'wederkerende', 'reflexief', 'reflexieve werkwoorden',
      'reflexive', 'reflexive verb', 'reflexive verbs', 'reflexive pronoun', 'reflexive pronouns', 'wederkerend voornaamwoord',
      'wederkerende voornaamwoorden', 'zich', 'zichzelf', 'zich of zichzelf', 'zichzelf of zich', 'me je zich',
      'zich vergissen', 'zich herinneren', 'elkaar', 'each other', 'myself', 'yourself', 'himself', 'themselves'],
    title: { nl: 'Wederkerende werkwoorden', en: 'Reflexive verbs' },
    body: {
      en: `A reflexive verb is listed with **zich**: *zich wassen, zich vergissen, zich herinneren*. The pronoun changes with the subject:

| | zich voelen (to feel) |
| --- | --- |
| ik | voel **me** |
| jij / je | voelt **je** |
| u | voelt **zich** (or **u**) |
| hij / zij / het | voelt **zich** |
| wij | voelen **ons** |
| jullie | voelen **je** |
| zij | voelen **zich** |

The unstressed *me, je* are the normal forms. With *u*, *zich* is preferred where *u* would otherwise appear twice: *Hebt u zich vergist?*

**Two kinds of reflexive verbs.**

Some are **always reflexive**: the pronoun is part of the verb and means nothing on its own. Many of these are not reflexive in English at all:
- *zich vergissen* (to be mistaken): *Ik heb me vergist.*
- *zich herinneren* (to remember): *Herinner je je dat nog?*
- *zich voelen* (to feel): *Ik voel me niet lekker.*
- *zich schamen* (to be ashamed), *zich haasten* (to hurry), *zich vervelen* (to be bored), *zich afvragen* (to wonder), *zich verheugen op* (to look forward to), *zich zorgen maken* (to worry), *zich gedragen* (to behave), *zich voorstellen* (to introduce oneself; to imagine), *zich inschrijven* (to register), *zich ergeren aan* (to be annoyed by).

Others are **ordinary verbs used reflexively**, when the action turns back on the subject: *wassen, scheren, aankleden, omkleden, verstoppen, snijden*. *Ik was de auto* but *Ik was me*. With these, and only these, **-zelf** adds emphasis or contrast: *Hij wast* **zichzelf** (not the baby), *Ik ken* **mezelf** *goed.* Never with the first kind: *Ik vergis mezelf* is wrong.

**Word order.** The pronoun comes **right after the conjugated verb**, or right after the subject when the subject follows the verb:
- *Ik voel* **me** *vandaag niet lekker.* *Vandaag voel ik* **me** *niet lekker.*
- *... omdat ik* **me** *niet lekker voel.* *Ik moet* **me** *haasten.* *Je hoeft* **je** *niet te schamen.*
- Imperative: *Haast* **je***! Vergis* **je** *niet!*

**In the perfect, every reflexive verb takes hebben**, unlike French, Italian or Spanish: *Ik* **heb** *me vergist. Hij* **heeft** *zich gewassen.*

**Each other** is **elkaar**, not *zich*: *Wij kennen* **elkaar***. Ze helpen* **elkaar***.* (In speech also *mekaar*.)

**Parts of the body** go with a possessive, as in English and unlike French: *Ik was* **mijn** *handen. Hij heeft* **zijn** *been gebroken.*

**Two things to unlearn from everyday speech**: *zich beseffen* is not a verb (*ik besef*, without a pronoun), and *zich irriteren aan* is colloquial for *zich ergeren aan*; the standard is *Het irriteert me* or *Ik erger me eraan.*`,
      nl: `Een wederkerend werkwoord staat in het woordenboek met **zich**: *zich wassen, zich vergissen, zich herinneren*. Het voornaamwoord verandert met het onderwerp:

| | zich voelen |
| --- | --- |
| ik | voel **me** |
| jij / je | voelt **je** |
| u | voelt **zich** (of **u**) |
| hij / zij / het | voelt **zich** |
| wij | voelen **ons** |
| jullie | voelen **je** |
| zij | voelen **zich** |

De onbeklemtoonde vormen *me, je* zijn de gewone vormen. Bij *u* heeft *zich* de voorkeur waar anders twee keer *u* zou staan: *Hebt u zich vergist?*

**Twee soorten wederkerende werkwoorden.**

Sommige zijn **altijd wederkerend**: het voornaamwoord hoort bij het werkwoord en betekent op zichzelf niets. Veel daarvan zijn in het Engels helemaal niet wederkerend:
- *zich vergissen*: *Ik heb me vergist.*
- *zich herinneren*: *Herinner je je dat nog?*
- *zich voelen*: *Ik voel me niet lekker.*
- *zich schamen, zich haasten, zich vervelen, zich afvragen, zich verheugen op, zich zorgen maken, zich gedragen, zich voorstellen, zich inschrijven, zich ergeren aan*.

Andere zijn **gewone werkwoorden die wederkerend worden gebruikt**, als de handeling op het onderwerp terugslaat: *wassen, scheren, aankleden, omkleden, verstoppen, snijden*. *Ik was de auto*, maar *Ik was me*. Bij deze werkwoorden, en alleen bij deze, geeft **-zelf** nadruk of contrast: *Hij wast* **zichzelf** (niet de baby), *Ik ken* **mezelf** *goed.* Nooit bij de eerste soort: *Ik vergis mezelf* is fout.

**Woordvolgorde.** Het voornaamwoord komt **direct na de persoonsvorm**, of direct na het onderwerp als dat na de persoonsvorm staat:
- *Ik voel* **me** *vandaag niet lekker.* *Vandaag voel ik* **me** *niet lekker.*
- *... omdat ik* **me** *niet lekker voel.* *Ik moet* **me** *haasten.* *Je hoeft* **je** *niet te schamen.*
- Gebiedende wijs: *Haast* **je***! Vergis* **je** *niet!*

**In de voltooide tijd krijgt elk wederkerend werkwoord hebben**, anders dan in het Frans, Italiaans of Spaans: *Ik* **heb** *me vergist. Hij* **heeft** *zich gewassen.*

**Each other** is **elkaar**, niet *zich*: *Wij kennen* **elkaar***. Ze helpen* **elkaar***.* (In de spreektaal ook *mekaar*.)

**Lichaamsdelen** gaan met een bezittelijk voornaamwoord, zoals in het Engels en anders dan in het Frans: *Ik was* **mijn** *handen. Hij heeft* **zijn** *been gebroken.*

**Twee dingen uit de spreektaal om af te leren**: *zich beseffen* bestaat niet (*ik besef*, zonder voornaamwoord), en *zich irriteren aan* is spreektaal voor *zich ergeren aan*; de standaardvorm is *Het irriteert me* of *Ik erger me eraan.*`,
    },
  },

  {
    id: 'trappen-van-vergelijking',
    keywords: ['trappen van vergelijking', 'trap van vergelijking', 'vergrotende trap', 'overtreffende trap',
      'vergrotende en overtreffende trap', 'comparatief', 'superlatief', 'comparative', 'comparatives', 'superlative',
      'superlatives', 'comparison', 'comparisons', 'dan of als', 'als of dan', 'groter dan', 'groter als', 'groter dan of als',
      'dan ik of dan mij', 'even als', 'net zo als', 'beter best', 'goed beter best', 'liever liefst', 'graag liever liefst',
      'meer en meest', 'the most', 'more than', 'bigger than', 'as big as', 'hoe meer hoe beter'],
    title: { nl: 'Trappen van vergelijking', en: 'Comparatives and superlatives' },
    body: {
      en: `**Formation.** The comparative adds **-er**, the superlative **-st**, whatever the length of the adjective. Dutch does not switch to *more* and *most* the way English does:

| | comparative | superlative |
| --- | --- | --- |
| klein | kleiner | kleinst |
| mooi | mooier | mooist |
| interessant | interessanter | interessantst |
| groot | groter | grootst |
| dik | dikker | dikst |
| lief | liever | liefst |
| boos | bozer | boost |

The spelling rules apply (*groot → groter, dik → dikker, lief → liever, boos → bozer*; see *spelling*).

- Adjectives ending in **-r** add **-der**: *duur → duurder, lekker → lekkerder, zwaar → zwaarder, ver → verder, donker → donkerder*.
- Adjectives ending in **-s** add only **-t** in the superlative: *vies → viest, fris → frist*.
- *Meest* is used with long or awkward words, especially those in *-isch* and *-st*: *de meest praktische oplossing, het meest fantastische verhaal*.

**Irregular:**

| | | |
| --- | --- | --- |
| goed | beter | best |
| veel | meer | meest |
| weinig | minder | minst |
| graag | liever | liefst |

*Graag* is how Dutch says *to like doing*, and its forms give preference: *Ik drink* **graag** *thee, maar* **liever** *koffie, en het* **liefst** *chocolademelk.*

**Comparing.**
- *than* is **dan**: *Jan is groter* **dan** *Piet. Dit is duurder* **dan** *ik dacht.* In everyday speech you will constantly hear *groter* **als**; it has been around for centuries and is accepted by some, but in writing and in careful speech it is **dan**, and teachers mark *als* wrong.
- after *dan*, standard Dutch keeps the subject form: *Hij is groter* **dan ik***.* (*dan mij* is common in speech)
- *as ... as* is **even ... als** or **net zo ... als**: *Zij is* **even** *oud* **als** *ik. Hij is* **net zo** *groot* **als** *zijn vader. Dat is* **niet zo** *moeilijk* **als** *het lijkt.*
- *the more ... the more* is **hoe ... hoe**: **Hoe** *meer,* **hoe** *beter.* **Hoe** *ouder hij wordt,* **hoe** *minder hij slaapt.* (also *des te*: *hoe ouder, des te wijzer*)
- *more and more* is **steeds**: *Het wordt* **steeds** *beter.*

**The superlative** before a noun takes *-e* like any adjective: *de grootste stad, het mooiste boek, mijn beste vriend*. After the verb it takes **het**, with or without *-e*: *Dit huis is* **het grootst** */* **het grootste***.* As an adverb too: *Zij zingt* **het mooist***.* *Of* is **van**: *de grootste* **van** *allemaal, de oudste* **van** *de klas*.

**A comparative before a noun** takes *-e* by the normal rule: *een grotere tafel, een groter huis, betere resultaten* (see *het bijvoeglijk naamwoord*).`,
      nl: `**Vorming.** De vergrotende trap krijgt **-er**, de overtreffende trap **-st**, hoe lang het bijvoeglijk naamwoord ook is. Het Nederlands stapt niet over op *meer* en *meest* zoals het Engels op *more* en *most*:

| | vergrotende trap | overtreffende trap |
| --- | --- | --- |
| klein | kleiner | kleinst |
| mooi | mooier | mooist |
| interessant | interessanter | interessantst |
| groot | groter | grootst |
| dik | dikker | dikst |
| lief | liever | liefst |
| boos | bozer | boost |

De spellingregels gelden (*groot → groter, dik → dikker, lief → liever, boos → bozer*; zie *spelling*).

- Bijvoeglijke naamwoorden op **-r** krijgen **-der**: *duur → duurder, lekker → lekkerder, zwaar → zwaarder, ver → verder, donker → donkerder*.
- Bijvoeglijke naamwoorden op **-s** krijgen in de overtreffende trap alleen **-t**: *vies → viest, fris → frist*.
- *Meest* gebruik je bij lange of onhandige woorden, vooral die op *-isch* en *-st*: *de meest praktische oplossing, het meest fantastische verhaal*.

**Onregelmatig:**

| | | |
| --- | --- | --- |
| goed | beter | best |
| veel | meer | meest |
| weinig | minder | minst |
| graag | liever | liefst |

Met *graag* zeg je dat je iets leuk vindt om te doen, en de trappen geven een voorkeur aan: *Ik drink* **graag** *thee, maar* **liever** *koffie, en het* **liefst** *chocolademelk.*

**Vergelijken.**
- na een vergrotende trap komt **dan**: *Jan is groter* **dan** *Piet. Dit is duurder* **dan** *ik dacht.* In de spreektaal hoor je voortdurend *groter* **als**; het bestaat al eeuwen en sommigen keuren het goed, maar in geschreven en verzorgde taal is het **dan**, en docenten rekenen *als* fout.
- na *dan* houdt het Standaardnederlands de onderwerpsvorm: *Hij is groter* **dan ik***.* (*dan mij* is gewoon in de spreektaal)
- gelijkheid is **even ... als** of **net zo ... als**: *Zij is* **even** *oud* **als** *ik. Hij is* **net zo** *groot* **als** *zijn vader. Dat is* **niet zo** *moeilijk* **als** *het lijkt.*
- *the more ... the more* is **hoe ... hoe**: **Hoe** *meer,* **hoe** *beter.* **Hoe** *ouder hij wordt,* **hoe** *minder hij slaapt.* (ook *des te*: *hoe ouder, des te wijzer*)
- *more and more* is **steeds**: *Het wordt* **steeds** *beter.*

**De overtreffende trap** vóór een zelfstandig naamwoord krijgt *-e* zoals elk bijvoeglijk naamwoord: *de grootste stad, het mooiste boek, mijn beste vriend*. Na het werkwoord krijgt hij **het**, met of zonder *-e*: *Dit huis is* **het grootst** */* **het grootste***.* Ook als bijwoord: *Zij zingt* **het mooist***.* *Of* is **van**: *de grootste* **van** *allemaal, de oudste* **van** *de klas*.

**Een vergrotende trap vóór een zelfstandig naamwoord** krijgt *-e* volgens de gewone regel: *een grotere tafel, een groter huis, betere resultaten* (zie *het bijvoeglijk naamwoord*).`,
    },
  },

  {
    id: 'te-om-te',
    keywords: ['om te', 'om ... te', 'om te plus infinitief', 'om te infinitief', 'te plus infinitief', 'te infinitief',
      'te + infinitief', 'te of om te', 'om te of te', 'wanneer te', 'wanneer om te', 'when do i use te', 'when to use te',
      'when do i use om te', 'when to use om te', 'te in dutch', 'om te in dutch', 'infinitief met te', 'infinitief zonder te',
      'met of zonder te', 'infinitive with te', 'infinitive without te', 'infinitive', 'infinitives', 'infinitief',
      'infinitieven', 'in order to', 'zonder te', 'door te', 'te koop', 'proberen te'],
    title: { nl: 'Te en om ... te', en: 'Te and om ... te' },
    body: {
      en: `A second verb in a Dutch sentence is an infinitive at the end of the clause. The question is whether it comes **bare**, with **te**, or with **om ... te**.

**No te** after the modal verbs and a handful of others: *kunnen, mogen, moeten, willen, zullen, hoeven* (only in the negative: see below), *gaan, komen, blijven, laten, zien, horen, voelen*, and usually *leren* and *helpen*:
- *Ik* **ga** *morgen* **zwemmen***.* *Hij* **blijft** *liever* **zitten***.*
- *Ik* **laat** *mijn haar* **knippen***.* (I'm having my hair cut) *Ik* **zie** *hem* **lopen***.*
- *Kom je me* **helpen***?*

**Te** after almost every other verb: *proberen, beginnen, vergeten, beloven, besluiten, durven, hoeven, lijken, schijnen, blijken, weigeren, hopen*, and *zitten, staan, liggen, lopen* (see *aan het*):
- *Ik* **probeer te** *slapen.* *Het* **begint te** *regenen.* *Hij* **vergeet** *altijd* **te** *bellen.*
- *Je* **hoeft** *niet* **te** *komen.* *Hij* **lijkt** *moe* **te** *zijn.* *Ik* **zit te** *lezen.*

With a separable verb, *te* goes between the two parts: *Ik probeer je* **op te bellen***.* (see *scheidbare werkwoorden*)

**Om ... te** wraps a whole infinitive clause: *om* at the start, *te* + infinitive at the end, everything else in between.

1. **Purpose** (*in order to*). Here *om* is obligatory: *Ik ga naar de winkel* **om** *brood* **te** *kopen. Ik leer Nederlands* **om** *hier* **te** *kunnen werken.*
2. **After an adjective or a noun**: *Het is leuk* **om te** *zwemmen. Het is moeilijk* **om** *Nederlands* **te** *leren. Ik heb geen tijd / geen zin* **om te** *koken.* In these, *om* is often left out in formal writing (*Het is moeilijk Nederlands te leren*) and almost always said in speech. Both are correct.
3. **Too ... to, enough ... to**: *Het is* **te** *koud* **om te** *zwemmen. Hij is oud genoeg* **om te** *stemmen.*
4. **Something to ...**: *iets* **om te** *eten, een boek* **om te** *lezen, niets* **om** *aan* **te** *trekken* (nothing to wear).

**Other little words that take te**: *zonder te* (without -ing), *door te* (by -ing), *in plaats van te* (instead of -ing): *Hij ging weg* **zonder** *iets* **te** *zeggen. Je leert het* **door** *veel* **te** *oefenen.* **In plaats van te** *werken zat hij te lezen.*

**The subject must be the same.** English *I want you to come* cannot be built with an infinitive; the second subject needs a *dat*-clause: *Ik wil* **dat je komt***.* Likewise *Ik hoop* **dat** *hij komt*, against *Ik hoop* **te** *komen* (I hope to come, myself).

**Te + infinitive after zijn** says what can or must be done: *Dat is niet* **te** *geloven.* (unbelievable) *Het huis is* **te** *koop.* (for sale) *De film is nergens* **te** *zien.* *Dat is* **te** *doen.* (that's doable)

Two look-alikes: *te* before an adjective is *too* (*te duur, te laat*), and *te* before a place name is a formal *in* (*geboren te Utrecht*).`,
      nl: `Een tweede werkwoord in een Nederlandse zin is een infinitief aan het eind van de zin. De vraag is of die **kaal** komt, met **te**, of met **om ... te**.

**Zonder te** na de modale werkwoorden en een handvol andere: *kunnen, mogen, moeten, willen, zullen, hoeven* (alleen ontkennend: zie hieronder), *gaan, komen, blijven, laten, zien, horen, voelen*, en meestal *leren* en *helpen*:
- *Ik* **ga** *morgen* **zwemmen***.* *Hij* **blijft** *liever* **zitten***.*
- *Ik* **laat** *mijn haar* **knippen***.* *Ik* **zie** *hem* **lopen***.*
- *Kom je me* **helpen***?*

**Te** na bijna alle andere werkwoorden: *proberen, beginnen, vergeten, beloven, besluiten, durven, hoeven, lijken, schijnen, blijken, weigeren, hopen*, en *zitten, staan, liggen, lopen* (zie *aan het*):
- *Ik* **probeer te** *slapen.* *Het* **begint te** *regenen.* *Hij* **vergeet** *altijd* **te** *bellen.*
- *Je* **hoeft** *niet* **te** *komen.* *Hij* **lijkt** *moe* **te** *zijn.* *Ik* **zit te** *lezen.*

Bij een scheidbaar werkwoord komt *te* tussen de twee delen: *Ik probeer je* **op te bellen***.* (zie *scheidbare werkwoorden*)

**Om ... te** omsluit een hele infinitiefzin: *om* vooraan, *te* + infinitief achteraan, al het andere ertussen.

1. **Doel**. Hier is *om* verplicht: *Ik ga naar de winkel* **om** *brood* **te** *kopen. Ik leer Nederlands* **om** *hier* **te** *kunnen werken.*
2. **Na een bijvoeglijk of zelfstandig naamwoord**: *Het is leuk* **om te** *zwemmen. Het is moeilijk* **om** *Nederlands* **te** *leren. Ik heb geen tijd / geen zin* **om te** *koken.* Hier wordt *om* in formele teksten vaak weggelaten (*Het is moeilijk Nederlands te leren*) en in de spreektaal bijna altijd gezegd. Allebei correct.
3. **Te ... om te, genoeg ... om te**: *Het is* **te** *koud* **om te** *zwemmen. Hij is oud genoeg* **om te** *stemmen.*
4. **Iets om te ...**: *iets* **om te** *eten, een boek* **om te** *lezen, niets* **om** *aan* **te** *trekken*.

**Andere kleine woorden met te**: *zonder te, door te, in plaats van te*: *Hij ging weg* **zonder** *iets* **te** *zeggen. Je leert het* **door** *veel* **te** *oefenen.* **In plaats van te** *werken zat hij te lezen.*

**Het onderwerp moet hetzelfde zijn.** Het Engelse *I want you to come* kan niet met een infinitief; het tweede onderwerp vraagt om een *dat*-zin: *Ik wil* **dat je komt***.* Zo ook *Ik hoop* **dat** *hij komt*, tegenover *Ik hoop* **te** *komen* (ikzelf).

**Te + infinitief na zijn** zegt wat kan of moet gebeuren: *Dat is niet* **te** *geloven. Het huis is* **te** *koop. De film is nergens* **te** *zien. Dat is* **te** *doen.*

Twee dubbelgangers: *te* vóór een bijvoeglijk naamwoord betekent *te veel* (*te duur, te laat*), en *te* vóór een plaatsnaam is een formeel *in* (*geboren te Utrecht*).`,
    },
  },

  {
    id: 'aan-het-liggen-staan-zitten',
    keywords: ['aan het', 'zijn aan het', 'aan het plus infinitief', 'aan het infinitief', 'aan het + infinitief',
      'ik ben aan het', 'bezig zijn', 'zitten te', 'staan te', 'liggen te', 'lopen te', 'zit te lezen', 'progressive',
      'present progressive', 'present continuous', 'continuous', 'continuous tense', 'duratief', 'ing form', 'ing-form',
      '-ing', 'i am doing', 'i am reading', 'how do i say i am doing', 'what is happening', 'wat er gebeurt',
      'liggen staan zitten', 'staan liggen zitten', 'zitten staan liggen', 'liggen zitten staan', 'liggen of staan',
      'staan of liggen', 'ligt of staat', 'staat of ligt', 'zitten of staan', 'liggen staan zitten hangen',
      'positiewerkwoorden', 'positiewerkwoord', 'position verbs', 'positional verbs', 'posture verbs', 'leggen of liggen',
      'liggen of leggen', 'leggen en liggen', 'zetten of leggen', 'leggen of zetten', 'zetten leggen stoppen',
      'where things are', 'how to say put', 'put in dutch'],
    title: { nl: 'Aan het, zitten te, en liggen, staan, zitten', en: 'Aan het, zitten te, and liggen, staan, zitten' },
    body: {
      en: `English says that a thing *is* somewhere and that someone *is doing* something. Dutch prefers to say **how**: lying, standing or sitting. The same three verbs do both jobs.

**1. Saying what is going on.** Dutch has no *-ing* tense. Most of the time the **simple present** does the work: *Wat doe je? Ik kook.* (What are you doing? I'm cooking.) *Ik lees een boek.* means both *I read* and *I am reading*. Learners overuse the forms below; natives use them only to stress that something is in progress right now.

- **zijn + aan het + infinitive**: *Ik* **ben aan het** *koken. We* **waren aan het** *eten toen hij belde.* The object goes **before** *aan het*: *Ik ben een boek aan het lezen.* A separable verb stays in one piece: *Ik ben de kamer aan het opruimen.* Not with states (*weten, hebben, wonen, kennen*).
- **zitten, staan, liggen, lopen, hangen + te + infinitive**, which also says the posture: *Ik* **zit te** *lezen. Hij* **staat te** *wachten. De baby* **ligt te** *slapen. Zij* **loopt te** *bellen. De was* **hangt te** *drogen.* The posture often fades to nothing: *Zit niet zo* **te** *zeuren!* (Stop whining!) In the perfect the *te* disappears and the verb stays an infinitive: *Ik heb de hele middag* **zitten lezen***.*
- **bezig zijn met** (to be busy with): *Ik ben bezig met mijn huiswerk.* *Ik ben bezig de kamer op te ruimen.*

An English *-ing* that is not a tense is not translated with any of these: *I like swimming* is *Ik zwem graag*; *Swimming is healthy* is *Zwemmen is gezond*.

**2. Saying where things are.** *Het boek is op tafel* is understood but sounds foreign. Dutch picks the verb that fits the position:

| | used for | examples |
| --- | --- | --- |
| **staan** | things upright, on a base, feet or wheels; buildings; printed text | De fles **staat** op tafel. De auto **staat** voor de deur. Het **staat** in de krant. De borden **staan** in de kast. |
| **liggen** | things lying flat or without a base; places on the map | Het boek **ligt** op tafel. De sleutels **liggen** in de la. Utrecht **ligt** in het midden van het land. |
| **zitten** | things inside something, or attached; people and animals sitting | De sleutels **zitten** in mijn tas. Er **zit** suiker in de koffie. Er **zit** een vlek op je trui. Hij **zit** op school. |
| **hangen** | hanging things | De jas **hangt** aan de kapstok. Het schilderij **hangt** aan de muur. |

A plate *staat* on the table (it rests on its base), a book *ligt* on the table but *staat* on the shelf, and a town *ligt*. With an indefinite subject, *er* comes first: *Er staat een fiets voor de deur. Er ligt een brief op de mat.* (see *er*)

**Putting things** follows the same split, and English *put* has four translations:
- **zetten** (to make stand): *Ik* **zet** *de fles op tafel.*
- **leggen** (to make lie): *Ik* **leg** *het boek op tafel.*
- **stoppen** or **doen** (into something): *Ik* **stop** *de sleutels in mijn tas.* **Doe** *de melk in de koelkast.*
- **hangen**: *Ik* **hang** *mijn jas op.*

**Liggen or leggen?** *Liggen* (to lie: *lag, gelegen*) is what the thing does; *leggen* (to lay: *legde, gelegd*) is what you do to it. *Ik lig in bed. Ik leg het boek weg.* In everyday speech many Dutch people say *Ik leg in bed*; it is one of the best-known mistakes in the language.`,
      nl: `Het Engels zegt dat iets ergens *is* en dat iemand iets *is doing*. Het Nederlands zegt liever **hoe**: liggend, staand of zittend. Dezelfde drie werkwoorden doen allebei de klussen.

**1. Zeggen wat er aan de gang is.** Het Nederlands heeft geen *-ing*-tijd. Meestal doet de **gewone tegenwoordige tijd** het werk: *Wat doe je? Ik kook.* *Ik lees een boek* betekent zowel *I read* als *I am reading*. Wie Nederlands leert, gebruikt de vormen hieronder te vaak; moedertaalsprekers gebruiken ze alleen om te benadrukken dat iets nu bezig is.

- **zijn + aan het + infinitief**: *Ik* **ben aan het** *koken. We* **waren aan het** *eten toen hij belde.* Het lijdend voorwerp staat **vóór** *aan het*: *Ik ben een boek aan het lezen.* Een scheidbaar werkwoord blijft heel: *Ik ben de kamer aan het opruimen.* Niet bij toestanden (*weten, hebben, wonen, kennen*).
- **zitten, staan, liggen, lopen, hangen + te + infinitief**, dat ook de houding noemt: *Ik* **zit te** *lezen. Hij* **staat te** *wachten. De baby* **ligt te** *slapen. Zij* **loopt te** *bellen. De was* **hangt te** *drogen.* De houding verbleekt vaak helemaal: *Zit niet zo* **te** *zeuren!* In de voltooide tijd verdwijnt *te* en blijft het werkwoord een infinitief: *Ik heb de hele middag* **zitten lezen***.*
- **bezig zijn met**: *Ik ben bezig met mijn huiswerk.* *Ik ben bezig de kamer op te ruimen.*

Een Engelse *-ing* die geen tijd is, vertaal je met geen van deze vormen: *I like swimming* is *Ik zwem graag*; *Swimming is healthy* is *Zwemmen is gezond*.

**2. Zeggen waar iets is.** *Het boek is op tafel* wordt begrepen, maar klinkt vreemd. Het Nederlands kiest het werkwoord dat bij de positie past:

| | voor | voorbeelden |
| --- | --- | --- |
| **staan** | dingen die rechtop staan, op een voet, poten of wielen; gebouwen; gedrukte tekst | De fles **staat** op tafel. De auto **staat** voor de deur. Het **staat** in de krant. De borden **staan** in de kast. |
| **liggen** | dingen die plat liggen of geen voet hebben; plaatsen op de kaart | Het boek **ligt** op tafel. De sleutels **liggen** in de la. Utrecht **ligt** in het midden van het land. |
| **zitten** | dingen in iets anders, of vastgemaakt; mensen en dieren die zitten | De sleutels **zitten** in mijn tas. Er **zit** suiker in de koffie. Er **zit** een vlek op je trui. Hij **zit** op school. |
| **hangen** | dingen die hangen | De jas **hangt** aan de kapstok. Het schilderij **hangt** aan de muur. |

Een bord *staat* op tafel (het rust op zijn voet), een boek *ligt* op tafel maar *staat* in de kast, en een stad *ligt*. Bij een onbepaald onderwerp komt *er* vooraan: *Er staat een fiets voor de deur. Er ligt een brief op de mat.* (zie *er*)

**Iets ergens neerzetten** volgt dezelfde tweedeling, en het Engelse *put* heeft vier vertalingen:
- **zetten**: *Ik* **zet** *de fles op tafel.*
- **leggen**: *Ik* **leg** *het boek op tafel.*
- **stoppen** of **doen** (ergens in): *Ik* **stop** *de sleutels in mijn tas.* **Doe** *de melk in de koelkast.*
- **hangen**: *Ik* **hang** *mijn jas op.*

**Liggen of leggen?** *Liggen* (*lag, gelegen*) is wat het ding doet; *leggen* (*legde, gelegd*) is wat jij ermee doet. *Ik lig in bed. Ik leg het boek weg.* In de spreektaal zeggen veel Nederlanders *Ik leg in bed*; het is een van de bekendste fouten in de taal.`,
    },
  },

  {
    id: 'voegwoorden',
    keywords: ['omdat', 'doordat', 'omdat of want', 'want of omdat', 'omdat en want', 'want en omdat', 'omdat vs want',
      'want vs omdat', 'verschil tussen omdat en want', 'difference between omdat and want', 'omdat or want',
      'omdat of doordat', 'doordat of omdat', 'because in dutch', 'because', 'als of toen', 'toen of als', 'als en toen',
      'toen en als', 'als toen wanneer', 'toen als wanneer', 'als of wanneer', 'wanneer of als', 'toen of wanneer',
      'wanneer of toen', 'when in dutch', 'if in dutch', 'als of of', 'of of als', 'whether', 'voegwoord', 'voegwoorden',
      'conjunction', 'conjunctions', 'nevenschikkend', 'onderschikkend', 'nevenschikkende voegwoorden',
      'onderschikkende voegwoorden', 'dus of daarom', 'daarom of dus'],
    title: { nl: 'Omdat en want, als, toen en wanneer', en: 'Omdat and want; als, toen and wanneer' },
    body: {
      en: `Conjunctions come in two kinds, and the kind decides the word order (see *woordvolgorde*):
- **coordinating**: *en, maar, of* (or), *want, dus*. They join two main clauses and change nothing: the verb stays second.
- **subordinating**: *omdat, dat, als, toen, terwijl, hoewel, voordat, nadat, totdat, zodat, of* (whether) and the rest. They open a subordinate clause and send **all the verbs to the end**.

**Omdat and want** both mean *because*.
- **want** is coordinating: main-clause order follows, and it cannot start the sentence. *Ik blijf thuis,* **want** *ik* **ben** *ziek.*
- **omdat** is subordinating: the verb goes to the end, and the clause can come first. *Ik blijf thuis* **omdat** *ik ziek* **ben***.* **Omdat** *ik ziek* **ben***, blijf ik thuis.*

The nuance: *omdat* gives the **reason** for the fact, and is the only answer to *waarom?*: *Waarom blijf je thuis? Omdat ik ziek ben.* *Want* gives the **argument** for saying something: *Hij is vast ziek, want zijn auto staat er nog.* (He must be ill, because his car is still there.)

**Doordat** is for a pure **cause** with no one intending anything: *Doordat het sneeuwde, kwam de trein te laat.* In speech *omdat* covers this too; in careful writing the difference is kept.

**Dus and daarom** turn it round (*so, therefore*): *Ik ben ziek,* **dus** *ik blijf thuis.* / *Ik ben ziek.* **Daarom** *blijf ik thuis.* (*daarom* is an adverb and triggers inversion.)

| | | order | example |
| --- | --- | --- | --- |
| want | because (argument) | main clause | *Ik blijf thuis, want ik ben ziek.* |
| omdat | because (reason) | verb last | *Ik blijf thuis omdat ik ziek ben.* |
| doordat | because (cause) | verb last | *Doordat het regende, was de weg nat.* |
| dus | so | main clause | *Het regent, dus ik blijf thuis.* |
| daarom | that is why | inversion | *Het regent. Daarom blijf ik thuis.* |

**Als, toen and wanneer** all translate *when*, and they are not interchangeable.
- **toen**: **one occasion or period in the past**, with a past tense: *Toen ik klein was, woonde ik in Groningen. Toen ik thuiskwam, ging de telefoon.* Never for the present or the future.
- **als**: the **present and the future**, and **repeated** events in the past (*whenever*): *Als ik thuiskom, bel ik je. Als het regent, blijf ik thuis. Als ik bij oma kwam, kreeg ik altijd een koekje.*
- **wanneer**: the **question word**, direct or indirect: *Wanneer kom je? Ik weet niet wanneer hij komt.* As a conjunction it is a more formal *als*: *Wanneer u klaar bent, kunt u gaan.*

**Toen** is also the adverb *then* in a past story, with inversion: *Toen ging hij weg.* For a sequence in the present or future it is **dan**: *Eerst eten we, dan gaan we weg.*

**Als also means if.** But English *if* in the sense of *whether* is **of**, never *als*: *Ik weet niet* **of** *hij komt.* (I don't know if he is coming.) *Als hij komt, ga ik weg.* (If he comes, I'll leave.) Mixing these up is one of the commonest learner mistakes, and *of* also means *or*, so read the sentence twice.`,
      nl: `Er zijn twee soorten voegwoorden, en de soort bepaalt de woordvolgorde (zie *woordvolgorde*):
- **nevenschikkend**: *en, maar, of, want, dus*. Ze verbinden twee hoofdzinnen en veranderen niets: de persoonsvorm blijft op de tweede plaats.
- **onderschikkend**: *omdat, dat, als, toen, terwijl, hoewel, voordat, nadat, totdat, zodat, of* (in de betekenis *whether*) en de rest. Ze openen een bijzin en sturen **alle werkwoorden naar het eind**.

**Omdat en want** betekenen allebei *because*.
- **want** is nevenschikkend: er volgt hoofdzinvolgorde, en het kan niet vooraan in de zin staan. *Ik blijf thuis,* **want** *ik* **ben** *ziek.*
- **omdat** is onderschikkend: de persoonsvorm gaat naar het eind, en de bijzin kan vooraan staan. *Ik blijf thuis* **omdat** *ik ziek* **ben***.* **Omdat** *ik ziek* **ben***, blijf ik thuis.*

De nuance: *omdat* geeft de **reden** van het feit, en is het enige antwoord op *waarom?*: *Waarom blijf je thuis? Omdat ik ziek ben.* *Want* geeft het **argument** om iets te zeggen: *Hij is vast ziek, want zijn auto staat er nog.*

**Doordat** is voor een zuivere **oorzaak**, zonder dat iemand iets bedoelt: *Doordat het sneeuwde, kwam de trein te laat.* In de spreektaal dekt *omdat* dit ook; in verzorgde geschreven taal blijft het verschil bestaan.

**Dus en daarom** draaien het om: *Ik ben ziek,* **dus** *ik blijf thuis.* / *Ik ben ziek.* **Daarom** *blijf ik thuis.* (*daarom* is een bijwoord en geeft inversie.)

| | | volgorde | voorbeeld |
| --- | --- | --- | --- |
| want | argument | hoofdzin | *Ik blijf thuis, want ik ben ziek.* |
| omdat | reden | werkwoord achteraan | *Ik blijf thuis omdat ik ziek ben.* |
| doordat | oorzaak | werkwoord achteraan | *Doordat het regende, was de weg nat.* |
| dus | gevolg | hoofdzin | *Het regent, dus ik blijf thuis.* |
| daarom | gevolg | inversie | *Het regent. Daarom blijf ik thuis.* |

**Als, toen en wanneer** vertalen alle drie *when*, en ze zijn niet uitwisselbaar.
- **toen**: **één keer of één periode in het verleden**, met een verleden tijd: *Toen ik klein was, woonde ik in Groningen. Toen ik thuiskwam, ging de telefoon.* Nooit voor het heden of de toekomst.
- **als**: **heden en toekomst**, en **herhaalde** gebeurtenissen in het verleden: *Als ik thuiskom, bel ik je. Als het regent, blijf ik thuis. Als ik bij oma kwam, kreeg ik altijd een koekje.*
- **wanneer**: het **vraagwoord**, direct of indirect: *Wanneer kom je? Ik weet niet wanneer hij komt.* Als voegwoord is het een formeler *als*: *Wanneer u klaar bent, kunt u gaan.*

**Toen** is ook het bijwoord *then* in een verhaal over vroeger, met inversie: *Toen ging hij weg.* Voor een volgorde in het heden of de toekomst is het **dan**: *Eerst eten we, dan gaan we weg.*

**Als betekent ook if.** Maar het Engelse *if* in de betekenis *whether* is **of**, nooit *als*: *Ik weet niet* **of** *hij komt.* *Als hij komt, ga ik weg.* Deze twee verwarren is een van de meest gemaakte fouten van wie Nederlands leert, en *of* betekent ook nog *or*, dus lees de zin twee keer.`,
    },
  },

  {
    id: 'kennen-weten',
    keywords: ['kennen of weten', 'weten of kennen', 'kennen en weten', 'weten en kennen', 'kennen vs weten', 'weten vs kennen',
      'kennen or weten', 'verschil tussen kennen en weten', 'difference between kennen and weten', 'to know', 'know in dutch',
      'kennen', 'weten', 'kennen of kunnen', 'kunnen of kennen', 'kennen en kunnen', 'ik ken niet', 'leren kennen',
      'te weten komen', 'how to say know'],
    title: { nl: 'Kennen en weten', en: 'Kennen vs. weten' },
    body: {
      en: `Both are *to know*, and Dutch never lets one stand in for the other.

| | kennen | weten |
| --- | --- | --- |
| ik | ken | weet |
| jij, hij | kent | weet |
| wij, jullie, zij | kennen | weten |
| past | kende, kenden | wist, wisten |
| participle | gekend | geweten |

**Weten**: facts and information. It is the verb before a clause (*dat, of, waar, wie, hoe ...*) and with *het, dat, iets, niets, alles, veel*:
- *Ik* **weet** *dat hij ziek is.* *Weet je* **of** *ze komt?* *Weet jij* **waar** *hij woont?*
- *Ik* **weet** *het niet.* *Hij* **weet** *alles / niets / veel.*
- *Ik* **weet** *zijn adres niet.* (a piece of information)

**Kennen**: being acquainted with a person, a place or a thing, or knowing something through and through:
- *Ik* **ken** *hem al jaren.* *Ken je Amsterdam?* *Ik* **ken** *dat liedje.* *Ik* **ken** *het gedicht uit mijn hoofd.* (by heart)

So *Ik ken het antwoord* means you have learned it; *Ik weet het antwoord* means you can give it. Both are fine, and the second is what people usually say.

**Kennen or kunnen?** *Kunnen* is *can*. In parts of the Netherlands you will hear *Ik ken niet komen* and *Dat ken niet*, with *kennen* for *kunnen*; it is dialect, and a well-known mistake in standard Dutch. The standard is *Ik kan niet komen. Dat kan niet.* The other way round, *Ik kan hem niet* for *Ik ken hem niet*, is heard too and is just as wrong.

**I know how to** is **kunnen**, not *weten*: *Ik* **kan** *zwemmen.* (I know how to swim) *Weet je hoe het werkt?* asks for the explanation; *Kun je het?* asks whether you are able to.

**Useful combinations:**
- *leren kennen*: to get to know, to meet: *Ik heb haar in Utrecht* **leren kennen***.*
- *te weten komen*: to find out: *Ik* **ben te weten gekomen** *dat hij verhuist.* (also *erachter komen*)
- *weten te*: to manage to: *Hij* **wist te** *ontsnappen.*
- *ervan weten*: to know about it: *Ik* **weet** *er niets* **van***.*
- *herkennen*: to recognise. *kennis*: knowledge, and an acquaintance.

**Idioms**: *Weet je wat?* (I tell you what) *Je weet maar nooit.* (You never know.) *Voor zover ik weet.* (As far as I know.) *Weet ik veel!* (How should I know!) *Ons kent ons.* (Everyone knows everyone here.)`,
      nl: `Allebei *to know*, en in het Nederlands kan de een nooit de plaats van de ander innemen.

| | kennen | weten |
| --- | --- | --- |
| ik | ken | weet |
| jij, hij | kent | weet |
| wij, jullie, zij | kennen | weten |
| verleden tijd | kende, kenden | wist, wisten |
| voltooid deelwoord | gekend | geweten |

**Weten**: feiten en informatie. Het is het werkwoord vóór een bijzin (*dat, of, waar, wie, hoe ...*) en bij *het, dat, iets, niets, alles, veel*:
- *Ik* **weet** *dat hij ziek is.* *Weet je* **of** *ze komt?* *Weet jij* **waar** *hij woont?*
- *Ik* **weet** *het niet.* *Hij* **weet** *alles / niets / veel.*
- *Ik* **weet** *zijn adres niet.* (een stukje informatie)

**Kennen**: bekend zijn met een persoon, een plaats of een ding, of iets door en door beheersen:
- *Ik* **ken** *hem al jaren.* *Ken je Amsterdam?* *Ik* **ken** *dat liedje.* *Ik* **ken** *het gedicht uit mijn hoofd.*

*Ik ken het antwoord* betekent dus dat je het geleerd hebt; *Ik weet het antwoord* dat je het kunt geven. Allebei goed, en het tweede is wat mensen meestal zeggen.

**Kennen of kunnen?** *Kunnen* is *can*. In delen van Nederland hoor je *Ik ken niet komen* en *Dat ken niet*, met *kennen* voor *kunnen*; het is dialect, en een bekende fout in het Standaardnederlands. De standaardvorm is *Ik kan niet komen. Dat kan niet.* Andersom, *Ik kan hem niet* voor *Ik ken hem niet*, hoor je ook, en dat is net zo fout.

**I know how to** is **kunnen**, niet *weten*: *Ik* **kan** *zwemmen.* *Weet je hoe het werkt?* vraagt om de uitleg; *Kun je het?* vraagt of je het kunt.

**Nuttige combinaties:**
- *leren kennen*: *Ik heb haar in Utrecht* **leren kennen***.*
- *te weten komen*: *Ik* **ben te weten gekomen** *dat hij verhuist.* (ook *erachter komen*)
- *weten te*: erin slagen: *Hij* **wist te** *ontsnappen.*
- *ervan weten*: *Ik* **weet** *er niets* **van***.*
- *herkennen*; *kennis*: wat je weet, en ook iemand die je kent.

**Uitdrukkingen**: *Weet je wat?* *Je weet maar nooit.* *Voor zover ik weet.* *Weet ik veel!* *Ons kent ons.*`,
    },
  },

  {
    id: 'toekomst',
    keywords: ['toekomst', 'de toekomst', 'toekomende tijd', 'toekomstige tijd', 'futurum', 'future', 'future tense',
      'the future', 'gaan of zullen', 'zullen of gaan', 'gaan en zullen', 'zullen en gaan', 'gaan vs zullen',
      'zullen vs gaan', 'gaan or zullen', 'verschil tussen gaan en zullen', 'difference between gaan and zullen',
      'zullen', 'zal zult zullen', 'zou', 'zou zouden', 'zou of zal', 'will in dutch', 'going to in dutch', 'going to',
      'would in dutch', 'ik zal of ik ga', 'future perfect', 'voltooid toekomende tijd', 'conditional', 'conditionals',
      'voorwaardelijke wijs', 'if clauses', 'als-zinnen'],
    title: { nl: 'De toekomst: gaan en zullen', en: 'The future: gaan and zullen' },
    body: {
      en: `Dutch has three ways to talk about the future, and the one English speakers reach for first, *zullen*, is the one Dutch uses least.

**1. The present tense with a time word.** This is the normal future: *Morgen* **ga** *ik naar Amsterdam. Ik* **bel** *je vanavond. Volgende week* **heb** *ik vakantie. De trein* **vertrekt** *om tien uur.* If the time is clear, nothing else is needed.

**2. Gaan + infinitive**: plans, intentions and things about to happen, much like *going to*: *Ik* **ga** *morgen een fiets* **kopen***. Het* **gaat regenen***. Wat* **ga** *je* **doen***?* Not with *gaan* or *komen* themselves (*Ik ga naar huis*, never *Ik ga naar huis gaan*), and in the Netherlands rarely with *zijn, hebben* or the modals; in Flanders *Het gaat moeilijk zijn* is normal.

**3. Zullen + infinitive**: a **promise**, an **offer** or **proposal**, or a **formal prediction**:
- *Ik* **zal** *het morgen doen.* (I will, promise)
- **Zal** *ik je helpen?* (shall I) **Zullen** *we gaan?* (shall we)
- *Het* **zal** *morgen regenen.* (forecast) *De winkel* **zal** *om negen uur opengaan.* (announcement)
- *Hij* **zal** *wel ziek zijn.* (he is probably ill: a guess about the present)

| | zullen |
| --- | --- |
| ik | zal |
| jij / je | zult, zal |
| u | zult |
| hij / zij / het | zal |
| wij, jullie, zij | zullen |
| past | zou, zouden |

Using *zullen* for every English *will* sounds stiff, or like a solemn promise. *I'll call you tomorrow* is simply *Ik bel je morgen.*

**After als, wanneer, zodra and other time words** the present is used, as in English: *Als ik tijd* **heb***, kom ik langs. Zodra hij* **aankomt***, bel ik je.*

**Zou and zouden** are the past of *zullen* and do the work of English *would*:
- **future in the past**: *Hij zei dat hij* **zou** *komen.*
- **conditional**: *Als ik rijk was,* **zou** *ik een boot kopen.* The *als*-clause takes the simple past (*was, had*), the main clause *zou* + infinitive; in speech the past is often used in both halves: *Als ik rijk was, kocht ik een boot.*
- **politeness and advice**: **Zou** *je me kunnen helpen? Ik* **zou** *graag een koffie willen. Je* **zou** *eens naar de dokter moeten gaan.*
- **hearsay**: *Hij* **zou** *in Parijs wonen.* (he is said to live in Paris)

**Being about to**: *Ik* **sta op het punt** *te vertrekken.* **Planning to**: *Ik* **ben van plan** *(om) te verhuizen.*

The future perfect (*zal gedaan hebben*) exists, but Dutch mostly uses the perfect with a time word instead: *Morgen* **heb** *ik het* **af***.* (I'll have it finished tomorrow.)`,
      nl: `Het Nederlands heeft drie manieren om over de toekomst te praten, en de manier die Engelstaligen het eerst kiezen, *zullen*, gebruikt het Nederlands het minst.

**1. De tegenwoordige tijd met een tijdsbepaling.** Dit is de gewone toekomst: *Morgen* **ga** *ik naar Amsterdam. Ik* **bel** *je vanavond. Volgende week* **heb** *ik vakantie. De trein* **vertrekt** *om tien uur.* Als de tijd duidelijk is, is er niets anders nodig.

**2. Gaan + infinitief**: plannen, voornemens en dingen die op het punt staan te gebeuren, ongeveer als *going to*: *Ik* **ga** *morgen een fiets* **kopen***. Het* **gaat regenen***. Wat* **ga** *je* **doen***?* Niet bij *gaan* en *komen* zelf (*Ik ga naar huis*, nooit *Ik ga naar huis gaan*), en in Nederland zelden bij *zijn, hebben* of de modale werkwoorden; in Vlaanderen is *Het gaat moeilijk zijn* gewoon.

**3. Zullen + infinitief**: een **belofte**, een **aanbod** of **voorstel**, of een **formele voorspelling**:
- *Ik* **zal** *het morgen doen.* (belofte)
- **Zal** *ik je helpen?* **Zullen** *we gaan?*
- *Het* **zal** *morgen regenen.* (weerbericht) *De winkel* **zal** *om negen uur opengaan.* (aankondiging)
- *Hij* **zal** *wel ziek zijn.* (waarschijnlijk: een vermoeden over het heden)

| | zullen |
| --- | --- |
| ik | zal |
| jij / je | zult, zal |
| u | zult |
| hij / zij / het | zal |
| wij, jullie, zij | zullen |
| verleden tijd | zou, zouden |

Wie *zullen* gebruikt voor elk Engels *will*, klinkt stijf, of alsof hij een plechtige belofte doet. *I'll call you tomorrow* is gewoon *Ik bel je morgen.*

**Na als, wanneer, zodra en andere tijdwoorden** gebruik je de tegenwoordige tijd, net als in het Engels: *Als ik tijd* **heb***, kom ik langs. Zodra hij* **aankomt***, bel ik je.*

**Zou en zouden** zijn de verleden tijd van *zullen* en doen het werk van het Engelse *would*:
- **toekomst in het verleden**: *Hij zei dat hij* **zou** *komen.*
- **voorwaarde**: *Als ik rijk was,* **zou** *ik een boot kopen.* De *als*-zin krijgt de verleden tijd (*was, had*), de hoofdzin *zou* + infinitief; in de spreektaal staat de verleden tijd vaak in beide helften: *Als ik rijk was, kocht ik een boot.*
- **beleefdheid en advies**: **Zou** *je me kunnen helpen? Ik* **zou** *graag een koffie willen. Je* **zou** *eens naar de dokter moeten gaan.*
- **van horen zeggen**: *Hij* **zou** *in Parijs wonen.*

**Op het punt staan**: *Ik* **sta op het punt** *te vertrekken.* **Van plan zijn**: *Ik* **ben van plan** *(om) te verhuizen.*

De voltooid toekomende tijd (*zal gedaan hebben*) bestaat, maar het Nederlands gebruikt meestal het perfectum met een tijdsbepaling: *Morgen* **heb** *ik het* **af***.*`,
    },
  },

  {
    id: 'passief',
    keywords: ['passief', 'het passief', 'passieve zin', 'passieve zinnen', 'lijdende vorm', 'de lijdende vorm',
      'bedrijvende en lijdende vorm', 'passive', 'the passive', 'passive voice', 'passive sentence', 'passive sentences',
      'worden of zijn', 'zijn of worden', 'worden en zijn', 'worden vs zijn', 'worden', 'wordt', 'werd', 'geworden',
      'is geworden', 'er wordt', 'er wordt gebeld', 'door in passive', 'was built', 'is being built', 'how to make the passive',
      'hoe maak je een passieve zin'],
    title: { nl: 'Het passief: worden en zijn', en: 'The passive: worden and zijn' },
    body: {
      en: `The passive is built with **worden** (to become) + past participle for an action in progress, and with **zijn** + past participle for a completed one. English has one auxiliary for both, which is where the confusion starts.

| | active | passive |
| --- | --- | --- |
| present | Hij schildert het huis. | Het huis **wordt** geschilderd. (is being painted) |
| imperfectum | Hij schilderde het huis. | Het huis **werd** geschilderd. (was being painted, was painted) |
| perfectum | Hij heeft het huis geschilderd. | Het huis **is** geschilderd. (has been painted, was painted) |
| plusquamperfectum | Hij had het huis geschilderd. | Het huis **was** geschilderd. (had been painted) |
| future | Hij zal het huis schilderen. | Het huis **zal** geschilderd **worden**. |
| with a modal | Hij moet het huis schilderen. | Het huis **moet** geschilderd **worden**. |

| | worden |
| --- | --- |
| ik | word |
| jij / je | wordt (word jij) |
| hij / zij / het | wordt |
| wij, jullie, zij | worden |
| past | werd, werden |
| participle | geworden |

**The rule to remember**: the perfect of the passive is *is* + participle, never *is ... geworden*. *Het huis is in 1900 gebouwd* is *the house was built in 1900*; *is gebouwd geworden* is a mistake. *Geworden* only appears when *worden* means *to become*: *Hij* **is** *dokter* **geworden***.* (He has become a doctor.)

So English *was built* can be two things:
- *Het huis* **werd** *in 1900 gebouwd.* (the event, told as a story)
- *Het huis* **is** *in 1900 gebouwd.* (the fact, as seen from now: the normal choice in conversation)

And *is built*, as a state, is *is gebouwd* too. The English *is being built* is *wordt gebouwd*.

**The agent** takes **door**: *Het boek is geschreven* **door** *Harry Mulisch.* The means takes *met*: *De deur is* **met** *een sleutel geopend.*

**Er + passive.** Dutch can make a passive with no subject at all, even from an intransitive verb, where English has to say *people* or *there is*:
- **Er wordt** *gebeld.* (someone is ringing the bell)
- **Er werd** *veel gelachen.* (there was a lot of laughter)
- **Er wordt** *hier niet gerookt.* (no smoking here)
- *In Nederland* **wordt er** *veel gefietst.*

**What cannot be done**: English turns an indirect object into the subject (*I was given a book*); Dutch cannot. Say *Ik* **kreeg** *een boek* or *Ze* **gaven** *me een boek*, or the formal *Mij werd een boek gegeven.*

**In a subordinate clause** the two verbs go to the end, in either order: *... dat het huis* **gebouwd wordt** */* **wordt gebouwd***.*

In speech the passive is less common than in English; Dutch prefers *ze, je* or *men*: *Ze bouwen hier een nieuwe school.* (A new school is being built here.) *Dat doe je niet.* (That isn't done.)`,
      nl: `Het passief wordt gevormd met **worden** + voltooid deelwoord voor een handeling die bezig is, en met **zijn** + voltooid deelwoord voor een voltooide handeling. Het Engels heeft één hulpwerkwoord voor allebei, en daar begint de verwarring.

| | bedrijvend | lijdend |
| --- | --- | --- |
| tegenwoordige tijd | Hij schildert het huis. | Het huis **wordt** geschilderd. |
| imperfectum | Hij schilderde het huis. | Het huis **werd** geschilderd. |
| perfectum | Hij heeft het huis geschilderd. | Het huis **is** geschilderd. |
| plusquamperfectum | Hij had het huis geschilderd. | Het huis **was** geschilderd. |
| toekomst | Hij zal het huis schilderen. | Het huis **zal** geschilderd **worden**. |
| met een modaal werkwoord | Hij moet het huis schilderen. | Het huis **moet** geschilderd **worden**. |

| | worden |
| --- | --- |
| ik | word |
| jij / je | wordt (word jij) |
| hij / zij / het | wordt |
| wij, jullie, zij | worden |
| verleden tijd | werd, werden |
| voltooid deelwoord | geworden |

**De regel om te onthouden**: het perfectum van het passief is *is* + voltooid deelwoord, nooit *is ... geworden*. *Het huis is in 1900 gebouwd* is correct; *is gebouwd geworden* is een fout. *Geworden* komt alleen voor als *worden* zelf het werkwoord is: *Hij* **is** *dokter* **geworden***.*

Het Engelse *was built* kan dus twee dingen zijn:
- *Het huis* **werd** *in 1900 gebouwd.* (de gebeurtenis, als verhaal verteld)
- *Het huis* **is** *in 1900 gebouwd.* (het feit, gezien vanuit nu: de gewone keuze in een gesprek)

En *is built*, als toestand, is ook *is gebouwd*. Het Engelse *is being built* is *wordt gebouwd*.

**De handelende persoon** krijgt **door**: *Het boek is geschreven* **door** *Harry Mulisch.* Het middel krijgt *met*: *De deur is* **met** *een sleutel geopend.*

**Er + passief.** Het Nederlands kan een passief maken zonder onderwerp, zelfs van een onovergankelijk werkwoord, waar het Engels *people* of *there is* nodig heeft:
- **Er wordt** *gebeld.*
- **Er werd** *veel gelachen.*
- **Er wordt** *hier niet gerookt.*
- *In Nederland* **wordt er** *veel gefietst.*

**Wat niet kan**: het Engels maakt van een meewerkend voorwerp een onderwerp (*I was given a book*); het Nederlands niet. Zeg *Ik* **kreeg** *een boek* of *Ze* **gaven** *me een boek*, of het formele *Mij werd een boek gegeven.*

**In een bijzin** gaan de twee werkwoorden naar het eind, in beide volgordes: *... dat het huis* **gebouwd wordt** */* **wordt gebouwd***.*

In de spreektaal is het passief minder gewoon dan in het Engels; het Nederlands kiest liever *ze, je* of *men*: *Ze bouwen hier een nieuwe school.* *Dat doe je niet.*`,
    },
  },

  {
    id: 'betrekkelijke-voornaamwoorden',
    keywords: ['betrekkelijk voornaamwoord', 'betrekkelijke voornaamwoorden', 'betrekkelijke bijzin', 'betrekkelijke bijzinnen',
      'relatieve bijzin', 'relative pronoun', 'relative pronouns', 'relative clause', 'relative clauses', 'die of dat',
      'dat of die', 'die en dat', 'die vs dat', 'die or dat', 'when do i use die', 'when do i use dat', 'when to use die',
      'when to use dat', 'difference between die and dat', 'verschil tussen die en dat', 'dat of wat', 'wat of dat',
      'die dat wie wat', 'die dat wat wie', 'die dat wat', 'met wie', 'aan wie', 'wiens', 'wiens of wier', 'whose',
      'who which that', 'which in dutch', 'that in dutch', 'het meisje die', 'het boek wat'],
    title: { nl: 'Die, dat, wie, wat', en: 'Relative pronouns: die, dat, wie, wat' },
    body: {
      en: `A relative pronoun (*who, which, that*) opens a subordinate clause, so the verb goes to the end (see *woordvolgorde*), and it can never be left out as it can in English: *the book I read* is *het boek* **dat** *ik lees*.

**Die or dat** follows the gender of the word it refers to, exactly like *deze / dit*:
- **die** for de-words and for all plurals: *de man* **die** *daar staat, de tafel* **die** *ik heb gekocht, de kinderen* **die** *buiten spelen*
- **dat** for singular het-words: *het boek* **dat** *ik lees, het huis* **dat** *te koop staat*

| refers to | pronoun | example |
| --- | --- | --- |
| a de-word, or any plural | **die** | de vrouw **die** hier woont |
| a singular het-word | **dat** | het boek **dat** ik lees |
| a person, after a preposition | **(preposition) wie** | de man **met wie** ik praat |
| a thing, after a preposition | **waar + preposition** | de pen **waarmee** ik schrijf |
| alles, iets, niets, a superlative, a whole clause | **wat** | alles **wat** ik weet |
| a place | **waar** | de stad **waar** ik woon |

Grammar wins over meaning: *het meisje* **dat** *daar woont*, because *meisje* is a het-word. In speech *het meisje die* is extremely common; in writing it is *dat*.

**Wat** after the indefinite words *alles, iets, niets, veel, weinig, het enige*, after a superlative used as a noun, and when it refers back to a whole sentence:
- *Alles* **wat** *ik weet. Dat is iets* **wat** *ik niet begrijp. Het beste* **wat** *je kunt doen.*
- *Hij kwam te laat,* **wat** *ik vervelend vond.* (which I found annoying)
- Standing alone: **Wat** *je zegt, is waar.* (What you say is true.)

*Het boek* **wat** *ik lees* is heard everywhere and is still *dat* in writing: *wat* is for indefinite things, *dat* for a specific het-word.

**Wie** for people after a preposition, and on its own for *whoever*: *de vrouw* **aan wie** *ik het gaf, de collega* **met wie** *ik werk*; **Wie** *het weet, mag het zeggen.*

**Waar + preposition** for things after a preposition, with the two parts often split in speech: *de stoel* **waarop** *ik zit* / *de stoel* **waar** *ik* **op** *zit*; *het boek* **waarover** *we praten*. (*Met* becomes *mee*: *waarmee*; see *er*.) In everyday speech *waar* is used for people too: *de man* **waar** *ik* **mee** *praat*; careful writing keeps *met wie*.

**Whose** is **wiens** (masculine singular) and **wier** (feminine and plural), both formal; everyday Dutch says **van wie**: *de man* **wiens** *auto gestolen is* / *de man* **van wie** *de auto gestolen is*. For things, *waarvan*: *het huis* **waarvan** *het dak lekt*.

**Where and when**: *de stad* **waar** *ik woon*; *de dag* **dat** */* **waarop** *we elkaar ontmoetten*.`,
      nl: `Een betrekkelijk voornaamwoord opent een bijzin, dus de persoonsvorm gaat naar het eind (zie *woordvolgorde*), en het kan nooit worden weggelaten zoals in het Engels: *the book I read* is *het boek* **dat** *ik lees*.

**Die of dat** volgt het geslacht van het woord waarnaar het verwijst, precies als *deze / dit*:
- **die** bij de-woorden en bij alle meervouden: *de man* **die** *daar staat, de tafel* **die** *ik heb gekocht, de kinderen* **die** *buiten spelen*
- **dat** bij het-woorden in het enkelvoud: *het boek* **dat** *ik lees, het huis* **dat** *te koop staat*

| verwijst naar | voornaamwoord | voorbeeld |
| --- | --- | --- |
| een de-woord, of een meervoud | **die** | de vrouw **die** hier woont |
| een het-woord in het enkelvoud | **dat** | het boek **dat** ik lees |
| een persoon, na een voorzetsel | **(voorzetsel) wie** | de man **met wie** ik praat |
| een ding, na een voorzetsel | **waar + voorzetsel** | de pen **waarmee** ik schrijf |
| alles, iets, niets, een overtreffende trap, een hele zin | **wat** | alles **wat** ik weet |
| een plaats | **waar** | de stad **waar** ik woon |

De grammatica wint van de betekenis: *het meisje* **dat** *daar woont*, omdat *meisje* een het-woord is. In de spreektaal is *het meisje die* heel gewoon; in geschreven taal is het *dat*.

**Wat** na de onbepaalde woorden *alles, iets, niets, veel, weinig, het enige*, na een zelfstandig gebruikte overtreffende trap, en als het terugverwijst naar een hele zin:
- *Alles* **wat** *ik weet. Dat is iets* **wat** *ik niet begrijp. Het beste* **wat** *je kunt doen.*
- *Hij kwam te laat,* **wat** *ik vervelend vond.*
- Zelfstandig: **Wat** *je zegt, is waar.*

*Het boek* **wat** *ik lees* hoor je overal, en het blijft op papier *dat*: *wat* is voor onbepaalde dingen, *dat* voor een bepaald het-woord.

**Wie** voor personen na een voorzetsel, en zelfstandig in de betekenis *iedereen die*: *de vrouw* **aan wie** *ik het gaf, de collega* **met wie** *ik werk*; **Wie** *het weet, mag het zeggen.*

**Waar + voorzetsel** voor dingen na een voorzetsel, in de spreektaal vaak gesplitst: *de stoel* **waarop** *ik zit* / *de stoel* **waar** *ik* **op** *zit*; *het boek* **waarover** *we praten*. (*Met* wordt *mee*: *waarmee*; zie *er*.) In de spreektaal wordt *waar* ook voor personen gebruikt: *de man* **waar** *ik* **mee** *praat*; verzorgde schrijftaal houdt *met wie*.

**Whose** is **wiens** (mannelijk enkelvoud) en **wier** (vrouwelijk en meervoud), allebei formeel; alledaags Nederlands zegt **van wie**: *de man* **wiens** *auto gestolen is* / *de man* **van wie** *de auto gestolen is*. Voor dingen *waarvan*: *het huis* **waarvan** *het dak lekt*.

**Plaats en tijd**: *de stad* **waar** *ik woon*; *de dag* **dat** */* **waarop** *we elkaar ontmoetten*.`,
    },
  },
];

/**
 * The counterparts to the profe's interjections, fired on the same three
 * moments: a word found (good), a question outside what the tutor covers
 * (bad), and a verb hairy enough to deserve a reaction (wow): irregular and
 * conjugated with zijn.
 *
 * *Helaas pindakaas* — "alas, peanut butter" — is the most Dutch way there is
 * of admitting, cheerfully, that something cannot be helped.
 */
export const EXCLAMATIONS = {
  good: ['Kijk eens aan!', 'Alsjeblieft!', 'Hebbes!', 'Prima!'],
  bad: ['Helaas!', 'Jammer!', 'Helaas pindakaas!'],
  wow: ['Tjonge!', 'Nou zeg!', 'Allemachtig!'],
};

/**
 * Conversational openers the tutor answers without looking anything up.
 *
 * Matched against the folded question, so accents are already gone. *Dag* is
 * both hello and goodbye in Dutch; a lone *dag* is read as a greeting, a
 * doubled *dag dag* (or *doei*) as a goodbye, which is how it is used.
 */
export const SMALL_TALK = [
  {
    match: /^(hallo|hoi|hai|hee|hey|hi|hello|dag(?!\s+dag)|goedemorgen|goedemiddag|goedenavond|goeiemorgen|goeiemiddag|goeienavond|hoe gaat het|hoe is het|alles goed)\b/,
    reply: {
      nl: 'Hallo! Ik kan werkwoorden vervoegen, woorden opzoeken in het woordenboek, zinnen vertalen en grammatica uitleggen. Waar zullen we beginnen?',
      en: 'Hello! I can conjugate verbs, look words up in the dictionary, translate phrases and explain grammar. Where would you like to start?',
    },
  },
  {
    match: /^(bedankt|dank je|dank je wel|dankjewel|dank u|dank u wel|dankuwel|thanks|thank you|ok|oke|okay|prima|top|mooi|super|geweldig|perfect)\b/,
    reply: {
      nl: 'Graag gedaan! Vraag gerust verder.',
      en: "You're welcome. Ask me anything else you need.",
    },
  },
  {
    match: /^(doei|doeg|dag dag|tot ziens|tot later|tot morgen|tot zo|tot straks|welterusten|slaap lekker|fijne dag|bye|goodbye)\b/,
    reply: {
      nl: 'Tot ziens! En veel succes met je Nederlands.',
      en: 'See you! Good luck with your Dutch.',
    },
  },
];
