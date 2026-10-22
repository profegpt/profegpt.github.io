# ProfeGPT

A language learning site for Spanish, French and Italian: for each, a two-way
translator, complete conjugation tables, a dictionary, and a grounded tutor.

Spanish came first and is still the default — its dictionary is the RAE, an
actual authority. French and Italian are the same site pointed at a different
language; see *[The French side](#the-french-side)* and *[The Italian
side](#the-italian-side)*.

```bash
npm install
npm start          # http://localhost:4000
```

No build step. The frontend is plain ES modules served straight out of `public/`.

## The pages

A home page, and four pages per language.

| Route          | What it does |
| -------------- | ------------ |
| `/`            | The **home page**: the title and the mascot, and a card per language — Español, Français, Italiano, and a dashed *More languages — coming soon*. See below. |
| `/es`          | The language's front page. A hero with the language's landmark; the **translator**, whose centre button flips the languages and carries the text across; and a **dictionary search** that opens the dictionary page with your query already applied. |
| `/es/conjugacion` | Every tense of the indicative, subjunctive and imperative. Three tabs for the regular **-ar / -er / -ir** models, plus a verb search that conjugates anything you type. Irregular forms are highlighted. |
| `/es/diccionario` | Definitions from the *Diccionario de la lengua española*, with senses, synonyms and locutions, plus real example sentences and — in English mode — an English gloss. |
| `/es/chat`     | A **grounded tutor** that answers from the site's own data — the conjugator, the dictionary, the translator, and hand-written grammar explanations. Needs no API key and invents nothing. |

`/fr` and `/it` carry the same four, with French and Italian behind them:
`/fr/conjugacion`, `/it/diccionario`, `/it/chat`. The paths keep their Spanish
names on every side — they belong to the site, not to the language, and links
that already exist should keep working. For the same reason an old link with no
language on it, `/conjugacion?v=ir`, is moved onto the Spanish side rather than
broken: every link from before the prefixes was Spanish.

### The home page

`public/js/views/home.js`. It sits a level above every language, so it is
deliberately small: a title, the choice, and a way in.

Spanish is selected every time the page opens, whatever was read last, because
it is the site's default. Choosing a box — with a click, or the arrow keys,
since the boxes are a radio group — does not go anywhere by itself. It
previews: the page's own words turn to that language, so the reader sees what
they are about to walk into.
**Enter**, the *Enter* button, or a second click on the chosen box goes in. The
keyboard path is the same three steps as the mouse one.

The ProfeGPT wordmark in the header always comes back here.

## The chat page

The tutor is deliberately not a language model. It routes a question to one of
the things it can actually ground an answer in:

| Ask | Where the answer comes from |
| --- | --- |
| *conjuga tener en subjuntivo* | the local conjugation engine |
| *qué es «dijeron»* | a reverse index of 15,000 conjugated forms, built in ~100 ms on first use |
| *qué significa sobremesa* | `/api/dictionary` → RAE |
| *cómo se dice "I'm tired" en español* | `/api/translate` |
| *to say in Spanish*, or just *to say* | the search index, read backwards |
| *ser y estar*, *por y para*, *el subjuntivo*… | 22 hand-written grammar topics in `public/js/data/grammar.js`, in both languages |

**"to say in Spanish" is a question, even without a question in it.** Most
people ask for a word that way — the direction named, nothing asking for a
translation — and it used to fall through unanswered. It is now answered from
the conjugator's own search index read backwards: every verb there is stored with its English gloss, so *to say* finds
*decir* exactly, offline, and gives the whole paradigm rather than one word.
Multi-sense glosses are indexed under each sense, and under the bare verb too,
since a reader is as likely to type *say* as *to say*.

**"How do you say X" translates X, even when X is a grammar term.** It used to
hand back the topic instead — asking how to say *the subjunctive* got an essay
on the subjunctive and never the words *el subjuntivo*. Those are two different
questions and the site answers both: "how do you say" asks what the words are,
"what is" asks what it does. The translation leads and the note follows it,
since a reader who asked about the subjunctive is not worse off for getting
both.

Grammar questions wearing the same shape stay grammar questions. *the subjunctive
in Spanish* is scored as a topic on the phrase alone — the trailing "in Spanish"
is what made it look like a translation request — and *to be in Spanish* gets ser
and estar rather than a single verb.

A question that names a verb *and* asks about its forms gets that verb's table,
not a general essay — "how do you say tener in the past tense" is about tener,
not about the preterite. An exact topic match still wins, so "el subjuntivo"
stays an explanation.

Anything it can't ground, it declines — it says so rather than guessing. That's
the whole point: on a site whose value is being correct about Spanish, a
confident wrong answer costs more than an honest "outside what I cover".

It replies in the language you asked in, and carries that choice forward for
follow-ups that have no language signal of their own.

**There is no language model behind it.** Every answer comes from the
sources above, so nothing leaves the site except the dictionary and translator
lookups those sources already make, and there is nothing to meter: the chat has
no allowance, no streaming and no tape. If the translator is down, a question
that needed it gets *"the translator is unavailable right now, so I'd rather
not guess"* — it is not passed anywhere else.

### When the tutor cannot answer

A bare "outside what I cover" tells the reader what went wrong but not what to
do next. So a declined question comes back with two to four ways it *could*
have been asked, built from the reader's own words (`suggestRephrasings` in
`lib/tutor.js`):

> *is magari a nice word* → **what does magari mean** · **how do you say "is
> magari a nice word" in Italian** · …

The longest word left once the question's scaffolding is stripped is the one
most likely being asked about, so it gets a definition; a short question may
simply have been a phrase to translate, so it gets that too. A verb the
conjugator knows leads the list as **conjugate X**, because its table is the
richest answer the site has. The pack's own example questions fill whatever
is left, so the list is never empty. The wording of each shape lives in the
language pack's `REPHRASE` (`tutor-es.js`, `tutor-fr.js`, `tutor-it.js`), in
the language of the reply.

Clicking a suggestion asks it, exactly as written — so the reader learns the
phrasing the tutor understands by using it, rather than from a help page.

### Typing without accents

*jamon* is not in any dictionary. *jamón* is. Students do not type accents, so a
perfectly ordinary vocabulary question came back as "not found" — the reader
told nothing about something the dictionary knew all along.

The word is now looked up a second time with its accents put back, and the entry
says so. Where the accented spelling comes from differs by language: the **RAE
returns it in its own 404** (asked for *jamon* it suggests *jamón*), while the
Wiktionnaire needs its **search** index rather than opensearch — asked for
*flaner*, opensearch offers Breton words that merely start the same way, and
search returns *flâner*. The Wikizionario is asked the same way, and Italian
needs it more than either: it writes an accent only on a final stressed vowel,
so the words that lose one are the commonest in the language — *citta* →
*città*, *perche* → *perché*, *piu* → *più*.

The rule is deliberately narrow, and both halves of it matter:

- it runs **only when the word as typed was not found at all**, so *bebe* is
  never quietly turned into *bebé* — both are words, the first lookup succeeds,
  and this never runs;
- it accepts **only the same word with its accents restored**, so *jamon* is
  never turned into *jabón*, which is a different word rather than a carelessly
  spelled one.

`server/accents.js`.

### Where definitions come from

**The RAE, always** — that is the point of the page, and the Spanish wording is
the authoritative text. Wiktionary appears in two places and neither replaces
it: as a short English gloss beside the headword in English mode, and as a
stand-in only when the RAE itself cannot be reached, in which case the entry
says so plainly rather than letting the authority change silently.

### Where example sentences come from

From [Tatoeba](https://tatoeba.org) — real sentences by native speakers,
already paired with English translations (CC BY), free and unmetered. Where
Tatoeba has nothing for a word, a short template frame stands in for each
part of speech, and the page labels it as a template so nobody mistakes it for
a real sentence. No model writes examples: an invented sentence with a mistake
in it is exactly the kind of thing a student copies down.

The English gloss beside the headword comes from
[Wiktionary](https://en.wiktionary.org) (CC BY-SA), not from a translation of
the definition.

Corpus sentences are attached to the word rather than to a sense, because a
sentence merely contains the word — it does not promise to illustrate one
particular meaning. Tatoeba's search also returns relatives, so "madrugar" can
come back with "madrugador"; sentences containing the word itself are ranked
first, then the ones short enough for a learner to hold in their head.

The source of the definitions is credited once, in a small footnote at the
foot of the dictionary page — the RAE, the Wiktionnaire or the Wikizionario,
whichever is behind that side — rather than in the site-wide footer, which now
carries only the site's name.

### Hearing the word

A dictionary that cannot say the word out loud is half a dictionary for anybody
learning to speak, and spelling does not settle the sound in any of these
languages: *chaleureux*, *corazón*, *scegliere*. A speaker button sits beside
the headword — filled cone, stroked waves, the same drawing logic as the other
icons, because an all-outline speaker is mush at 16px.

**The budget is the shape of the feature.** The free ElevenLabs tier is 10,000
characters a month for the whole site, so only single words are spoken, every
clip is cached by word and by the browser, and a class of twenty-five looking up
*chaleureux* spends ten characters once rather than two hundred and fifty. The
guard against sentences lives next to the spending rather than only at the
route, because a length cap alone lets "the quick brown fox jumps over it"
through at 33 characters.

**The engine is told which language it is speaking** — `es`, `fr` or `it`. It
used to be left to infer it from the text, and one word is not much to infer
from: *couvercle* came back as "couvercol", an English speaker sounding out
French spelling. The v2.5 models take a language code and the site always knows
which side it is on.

Without a key the button removes itself rather than standing there failing.

### The translator

**DeepL is the only engine that translates**, for all three languages in both
directions (`server/translators.js`). Free tier is 500,000 characters a month,
and only a free key (ending `:fx`) is used, so it cannot be billed. No language
model translates either; the site has none.

**Wikipedia keeps names right.** Machine translation renders a name literally —
*Cuban Missile Crisis* becomes *crisis de los misiles cubanos*, which says the
missiles were Cuban — and Wikipedia's cross-language links hold the name each
language actually uses. So Wikipedia is asked one narrow question, which is a
lookup and not a translation:

- an input that is **a name as a whole** is answered with the established name,
  and DeepL is not asked at all;
- **names inside a sentence** are found in one request and swapped into DeepL's
  output in place of its literal rendering;
- when Wikipedia fails or has nothing, **DeepL's sentence stands** as it was.

Only spans that contain something other than everyday words are candidates, and
only titles Wikipedia capitalises as proper nouns count. Without that guard
"I am tired" came back as "I Am fatigué" — Wikipedia has an album called *I Am*.

When DeepL cannot answer — no key, the month's characters spent (456), a
refused key (403), the service down, the network, an empty reply — **the
translator says it is unavailable** and shows nothing else: the route answers
503 with `unavailable: true`. The page clears whatever translation was there
before, so an old one is never read as the answer to a new sentence, and puts
*"The translator is unavailable."* in its place, in the interface's language.
The tutor says the same thing in the chat. The server prints `Translator:
DeepL` or `Translator: unavailable` when it starts.

That is a deliberate retreat. There used to be a chain of fallback engines
beneath DeepL, and every rung of it produced answers that looked exactly as
trustworthy as DeepL's and were not — *"Good morning **Najlaa** how are you?"*
for *Buenos días, ¿cómo estás?*, and *Les rêves de chat noirs* by way of
Catalan. A student copies what the box says. **No translation is better than a
wrong one**: a translator that admits it is down is simply tried again later,
and a wrong one is learned.

The other thing laid over DeepL's answer is the site's own idiom table (below):
hand-checked pairs, put in only where DeepL rendered the idiom word for word.
That is a correction from data the site already vouches for, not a second
engine.

Failures are never cached, so DeepL coming back is noticed on the next
translation. Successes are cached for twelve hours.

The translator waits **900ms** after you stop typing rather than 650. Every
pause is a DeepL request against a shared monthly allowance, so a beat more
patience is a lesson's worth of headroom.

### Idioms

Most idioms already survive translation — "it's raining cats and dogs" comes
back as *llueve a cántaros*, "he kicked the bucket" as *estiró la pata*. The
ones that do not come back word for word: *cost an arm and a leg* became *un
brazo y una pierna*.

The tempting repair is to flatten the idiom first — "it cost a lot" → *costó
mucho* — which is accurate and teaches the wrong thing, because Spanish has its
own idiom and a learner should meet it. So `server/idioms.js` pairs each idiom
with its **equivalent** rather than a paraphrase, and the plain meaning is shown
beside the translation as a note:

> it cost an arm and a leg **=** costó un ojo de la cara
> *to be extremely expensive*

Hand-written and hand-checked, like the grammar notes, and only the idioms a
translator actually gets wrong are listed. Matching ignores case and accents,
works inside a sentence, and is capped at two notes per translation.

**"Gets wrong" has to mean this rendering, not this idiom in general.** The
stored form is a citation — *llueve a cántaros*, third person present — and an
engine that produced the idiom in some other inflection has got it right. Pasting
the citation form over *está lloviendo a cántaros* gives **"está llueve a
cántaros"**: worse than the literal translation the feature exists to repair, and
wrong in a way a learner would copy.

So the idiom is only put in where it is genuinely absent, checked on both the
sentence and the span, by comparing the part of it that does not inflect. That
is everything after the verb in Spanish; the French forms open with a pronoun, so
the tail is checked too, and either hit counts. The test is deliberately
generous — a false yes leaves the engine's wording alone and shows the note,
which costs nothing, while a false no breaks the grammar.

The note is shown either way. The pairing is the thing being taught.

One more place the citation form does not fit: right after an auxiliary the
engine has already written. Spanish and Italian build the progressive the same
way — *está* + gerund, *sta* + gerund — so where the translation ends in a form
of *estar* or *stare*, an idiom that has a progressive form is put in as that:
*sta piovendo a catinelle*, not *sta piove a catinelle*. French has no entry
there, because its progressive is *être en train de* and an idiom dropped in
after one gives "il est en train de en train de pleuvoir". The Italian pattern
lists only the forms of *stare*, and leaves out *state*, which is just as often
the participle of *essere*.

There is one table per language — 27 Spanish, 29 French, 36 Italian — rather
than one table with extra columns, because the sets barely overlap: the idioms a
translator fumbles going into Spanish are not the ones it fumbles going into
French, and half of each list has no counterpart in the others. French gets
*coûter les yeux de la tête*, *casser sa pipe*, *quand les poules auront des
dents*; Italian gets *costare un occhio della testa*, *in bocca al lupo*, *ogni
morte di papa*. Where a well-known English idiom has no true Italian
counterpart it is left out rather than matched with a near miss.

### The teacher's lock

The site has one passcode left, and it is the teacher's. It seals the site
**for everyone at once**, not just this browser: the switch lives on the server
(`server/routes/lock.js`) and clients poll it, so a locked room reaches someone
already mid-page. Anyone holding the passcode can throw it either way, including
from the tape the lock puts up, so nobody is stranded. It is `TEACHER_PASSCODE`, default
`AP_Lit`, matched without regard to case or surrounding spaces.

The form lives in the settings menu — the gear at the right-hand end of the
header, on every page including the home page. The gear turns the accent colour
while the site is locked, so a teacher can see the state of the room without
opening anything.

The lock is held in memory, so restarting the server clears it — a deliberate
failsafe against being locked out by a process nobody is watching.

### The settings menu

`public/js/lib/settings.js`. Two things live in it, and both used to be buttons
of their own in the header: **light and dark mode**, and **the teacher's lock**.
Neither is something a student reaches for mid-lesson, and the header already
carries the page links and the language switch, so they are one click further
away and the header is quieter for it.

Light and dark are offered as a choice of two, with the current one marked,
rather than as a toggle. A toggle shows an icon for the mode you are *not* in,
which reads backwards half the time.

### Switching subject

The subject is the address. `/es`, `/fr` and `/it` are the three sides of the
site, and `public/js/lib/study.js` reads which one you are on from the first
part of the path (`studyFromPath`); nothing about it is kept in the browser's
storage. Views link through `page()` rather than writing `/conjugacion` by hand,
so a link never drops a reader from the Italian side onto the Spanish one, and
`pageOf()` takes the prefix back off for the router.

So the way to another language is the home page: the wordmark goes there, and a
box goes from there to the language's own front page. A link someone sends you
opens the language they were reading, rather than whichever one your own browser
happened to visit last.

Every page keeps what you looked at in the query — `?v=parler`, `?q=sobremesa` —
and the query belongs to the address of one language, so moving to another
starts the page empty rather than loading a French verb into the Italian
conjugator. The chat clears too.

### Site language

The **ES | EN** switch in the header changes the language of the interface and
nothing else. It reads **FR | EN** on the French side and **IT | EN** on the
Italian one, and either half is one click away — nothing is behind a passcode.
Strings live in `public/js/lib/i18n.js`; a language change re-renders the
current view.

What is remembered is the choice of English, not a language code. Somebody
reading the Spanish side in English and then picking Italian on the home page
meant "in English" rather than "in Spanish", so English carries across every
language, and otherwise the interface speaks whatever the site is about.

What the site is *about* stays in its own language either way — verb forms,
dictionary headwords, the subject pronouns in the conjugation tables. Grammatical labels do
follow the interface, and so do grounded chat answers: ask in English while the
site is in Spanish and the conjugation still comes back in Spanish, because that
is the language you chose to work in.

In English the conjugation tables lead with the English tense name and keep the
Spanish one underneath. Capitalisation belongs to the role rather than the
string, so the leading name is always capitalised and the hint never is.

### The profe's interjections

Three expressions she actually used, spelled as the RAE has them, fired on the
kind of moment that earned them rather than on every message:

| | When |
| --- | --- |
| **¡Olé!** | a word found in the dictionary |
| **¡Mecachis en todo!** | a question outside what the tutor covers |
| **¡La madre que me parió!** | a verb that is both irregular *and* stem-changing |

French has counterparts on the same three moments — *Et voilà !*, *Zut alors !*,
*Oh là là !* — fired where a verb is both irregular and takes *être*, which is
about as much as one French verb can ask of a learner. Italian has *Ecco qua!*,
*Accidenti!* and *Mamma mia!* among a few others, the last fired on the same
pairing — irregular, and conjugated with *essere*. All of them are stand-ins;
only the Spanish ones are things she actually said.

## The French side

`/fr`, reached from its box on the home page, is ProfeGPT as a French site.

What changes:

| | |
| --- | --- |
| the header switch | **ES \| EN** becomes **FR \| EN** |
| the translator | French ↔ English through DeepL, with French idioms |
| the conjugator | French tables, and the three tabs become **-er / -ir / -re** |
| the dictionary | a free French dictionary, credited where its licence requires it |
| the tutor | French grammar, French verb forms, answers in French |
| the interface | every string, in French or English |
| the picture | the Eiffel Tower |

What does not change: the theme, the teacher's lock, and the shape
of every page. It is the same site pointed at a different language, not a
second site.

The sides never mix. Ask a French question on the Spanish side and the tutor
declines it, and the other way round — each has its own grammar notes, its own
verb list and its own dictionary, and the chat clears when you switch, because
a Spanish transcript is not history a French tutor could have produced.

### How it is put together

One axis was added — `public/js/lib/study.js`, the language the site is *about*
— and everything language-specific hangs off it. It is deliberately separate
from `lib/i18n.js`, which is the language of the *chrome*: on the French side
the interface is French or English, on the Spanish side Spanish or English, and
someone who chose English stays in English across the switch.

The routing that decides what a question means is **shared**. `lib/tutor.js`
holds it, and `lib/tutor-es.js`, `lib/tutor-fr.js` and `lib/tutor-it.js` are
packs it reads: the conjugation engine to call, the words that signal an intent,
the shape of the paradigm, and the sentences the tutor says in its own voice.
That was worth the refactor — the interesting behaviour is all in the routing,
and three copies of it would have drifted apart within a week. The conjugation
page works the same way: one renderer, three sets of tense lists.

The string tables are the exception, and are duplicated on purpose. The English
half differs too — every mention of the dictionary behind each side is a
different sentence — so extra columns would have made a table of near-misses.

### The French conjugator

`public/js/lib/conjugator-fr.js`, built the same way as the Spanish one — rules
first, data only where rules run out:

1. **Regular endings** for the three groups: `-er`, `-ir` with the `-iss-`
   infix, and `-re`. The `-oir` verbs are irregular to a verb.
2. **Spelling that only preserves the sound** — `commencer → commençons`,
   `manger → mangeons`, `payer → paie`.
3. **The mute-e stem changes** — `lever → lève`, `appeler → appelle`,
   `acheter → achète`, `préférer → préfère`.
4. **Explicit irregulars**, inherited by prefixed derivatives, so `comprendre`
   comes free from `prendre` and `découvrir` from `couvrir`.

Two things have no Spanish counterpart and shape the code.

**The auxiliary.** Compound tenses take *avoir* or *être*, and the *être* ones
agree with their subject, so the table shows `je suis allé(e)` and `nous sommes
allé(e)s` rather than one string. Which auxiliary a verb takes is a chip on the
verb card, because it is half of learning its compound tenses.

**The stem splits rather than shifting.** French changes the stem before a
*mute* ending — je, tu, il, ils of the present and subjunctive — and leaves it
alone before nous and vous, where the ending is heard. Every verb carries a
strong stem and a weak one; for most verbs they are the same string.

The rules that took the most care:

- **`-eler` / `-eter` are checked before the plainer `e_er` shape**, because
  their stems satisfy both — otherwise *appeler* comes out *j'apèle*.
- **A single consonant after `e`, but one or two after `é`.** *lever → lève* and
  *régler → règle*, while *rester* stays *je reste* — two consonants after the
  `e` and the rule does not apply. That one line is the difference between
  correct French and *je rèste*.
- **`é` keeps its accent through the future** where `e` does not:
  *je préférerai*, but *je lèverai*.
- **`percevoir` is a prefixing of `cevoir`, not of `voir`.** Spelled out as its
  own entry it fell through to the shorter base and came back *je percevois*.
- **The `-uire` family is a rule**, not twelve near-identical entries, and a
  handful of them end in `-ui` rather than `-uit`.

`npm test` checks 163 reference forms against the Bescherelle paradigms, and a
further 183 that the page's tense lists and the engine's tables agree — a tense
named on the page but absent from the table would otherwise show as a quietly
missing row.

### Where French definitions come from

**There is no queryable authority for French** the way the RAE is for Spanish.
The obvious candidate publishes no API, its search is a POST so no URL carries a
word, and its entries live at opaque ids resolvable only by running its
JavaScript. Scraping that would be fragile and unkind.

So definitions come from the **Wiktionnaire** — French definitions of French
words, CC BY-SA — which `server/dictionary-fr.js` reads as wikitext and
normalises into exactly the shape the RAE route already returns, so the page and
the tutor never learn which dictionary answered. Every entry carries a single
line at its foot naming the source and its licence, which CC BY-SA requires,
and the page itself has a small footnote saying where its definitions come
from. It is a footer rather than a banner: the page does not
lecture the reader about where its words came from, and does not hide it
either.

Example sentences come from Tatoeba as before, asked for French rather than
Spanish; the English gloss beside the headword comes from the French section of
en.wiktionary.

Lookups follow redirects, which is not a detail: a French headword is titled
with a typographic apostrophe — *aujourd’hui*, *presqu’île*, *d’accord* — and
nobody types one. The straight-apostrophe spelling is a redirect on the wiki, so
three of the commonest words in the language used to come back "not in the
dictionary" until it was asked to resolve them.

**One lookup is up to three Wikimedia requests** — the entry, a search when the
word was typed without its accents, and that English gloss — so a class of
twenty-five looking words up at once is a burst, and Wikimedia answers a burst
with 429s that persist for a while afterwards. A dictionary that dies the moment
a whole class uses it is not a dictionary. `server/throttle.js` therefore holds
the calls to three lanes with a gap in each.

Three is measured, not guessed. Twenty-five simultaneous lookups, run twice
over: one lane took 75s, three took 23s, six took 40s, and none of them drew a
429 — past three the host simply stops answering any faster, so further lanes
queue behind its own pacing instead of the queue's. Before the throttle the same
sweep returned 6 of 22.

### The French translator

DeepL, as on every side, and nothing beneath it. French was the language the old
fallback chain served worst — its last rung had no English–French pair and
went through Catalan, so *The black cat sleeps on the old table* came back as *Les
rêves de chat noirs dans la table vieille* — and it is the clearest case for the
rule that the translator would rather say it is unavailable than say that.

## The Italian side

`/it` is ProfeGPT as an Italian site, built exactly the way the French side is:
the same pages, the same router, and a pack of its own for
everything that is about the language.

What changes:

| | |
| --- | --- |
| the header switch | **IT \| EN** |
| the translator | Italian ↔ English through DeepL, with Italian idioms |
| the conjugator | Italian tables, and the three tabs become **-are / -ere / -ire** |
| the dictionary | the Wikizionario, credited where its licence requires it |
| the tutor | Italian grammar, Italian verb forms, answers in Italian |
| the interface | every string, in Italian or English |
| the picture | the Leaning Tower of Pisa |

As with French, the sides never mix: the Italian tutor declines a Spanish
question, and the chat clears when you change language.

### The Italian conjugator

`public/js/lib/conjugator-it.js`, with its data in `public/js/data/verbs-it.js`.
Rules first, data only where rules run out:

1. **Regular endings** for the three conjugations, `-are`, `-ere` and `-ire`.
   The `-isc-` verbs — *capire → capisco*, against *dormire → dormo* — cannot be
   told apart from the outside: history and analogy put a verb in the group,
   not its spelling. So `ISC_VERBS` is a closed
   list.
2. **Spelling that only preserves the sound** — `cercare → cerchi` (c → ch),
   `pagare → paghiamo` (g → gh), `cominciare → cominci` (ci → c),
   `mangiare → mangi` (gi → g), `studiare → studi` (ii → i). *inviare* is the
   exception that needs its own short list: its i is stressed and a vowel in its
   own right, so it survives — *tu invii*.
3. **The contracted infinitives** — `-durre`, `-porre`, `-trarre` — which are
   regular from the longer form they were cut down from: *tradurre* conjugates
   as *traducere*, *porre* as *ponere*. That is also why they are filed, and
   reported, as `-ere` verbs: it is where their full infinitives put them.
4. **Explicit irregulars**, about ninety-five of them, inherited by prefixed
   derivatives listed in `PREFIXABLE`, so `ottenere` comes free from `tenere`
   and `rifare` from `fare`. An Italian prefix can move the written accent —
   *fa* but *rifà* — so the engine adds it and the data stays plain.

Three things shape the code beyond what the other two engines needed.

**The 1-3-3 passato remoto.** An irregular passato remoto is irregular in
exactly three persons — io, lui, loro (*presi, prese, presero*) — while tu, noi
and voi stay regular (*prendesti, prendemmo, prendeste*). So most entries record
one strong stem and the engine fills in the rest.

**The auxiliary.** Compound tenses take *avere* or *essere*, and after *essere*
the participle agrees with its subject, so the table prints both genders the way
an Italian grammar does: `sono andato/a`, `siamo andati/e`. `ESSERE_VERBS` lists
the verbs by name, derivatives included, because a prefix can change the
auxiliary — *venire* takes *essere*, *mantenere* always takes *avere*. The table
gives the intransitive reading (*sono salito*, not *ho salito le scale*) and the
grammar note covers the rest. As on the French side, the auxiliary is a chip on
the verb card.

**Reflexive pronouns are part of the forms.** Spanish and French can leave them
out of a table and nobody minds; an Italian reflexive is learned *as* "mi
alzo", and its compound tenses change auxiliary. So *alzarsi* is conjugated with
its pronouns in the table — `mi alzo`, `mi sono alzato/a` — and is reported
under its citation form, so a link made from the result comes back to the same
table.

The conditional is a mood of its own in Italian grammar. It is filed under
*indicativo* here, as the tenses *condizionale* and *condizionale passato*, the
same way French files its conditionnel under the indicatif: the page draws two
moods of two tables each, and a third mood with a single row in each table
would only be a gap in the layout. The imperative carries a polite *Lei* beside
tu, noi and voi, because it is learned as part of the imperative even though it
is borrowed from the subjunctive.

`npm test` checks 272 reference forms against the Treccani and Zanichelli
paradigms.

### Where Italian definitions come from

The same situation as French. The Accademia della Crusca answers questions
rather than publishing a dictionary, and the commercial dictionaries — Treccani,
Zingarelli, Hoepli — publish no API and do not license their text for reuse.

So definitions come from the **Wikizionario** (it.wiktionary.org, CC BY-SA),
which `server/dictionary-it.js` reads as wikitext and normalises into exactly
the shape the French lookup returns, which is itself the shape the RAE route
returns. The page and the tutor never learn which dictionary answered, and the
entry carries the same one-line credit at its foot. Its markup is its own rather
than a dialect of the Wiktionnaire's, so little of the French parser could be
reused beyond the generic template and link handling: a part of speech is a bare
template like `{{-sost-|it}}` rather than a heading, and `{{-pron-}}` with no
language is the *pronunciation*, not the pronoun. Register labels come from the
wiki's own template category rather than from guesswork — `{{Lett}}` reads like
*letterario* and means *letteralmente*.

Example sentences come from Tatoeba, asked for Italian; the English gloss beside
the headword comes from the Italian section of en.wiktionary.

A word typed without its accent is looked up again through the wiki's search
index, as for French: *citta* → *città*, *perche* → *perché*, *piu* → *più*.
Where the search offers both a grave and an acute spelling its own order
decides, and the rarer *á í ó ú* spellings go to the back. The calls share
`server/throttle.js` with the French dictionary.

Two gaps are known and left as they are:

- **Synonym lists are per page, not per part of speech.** The Wikizionario keeps
  one synonyms section below every entry and marks which lines belong to which
  part of speech with a qualifier. Lines before any qualifier go to the first
  part of speech, which is usually right and sometimes is not.
- **A placeholder page is not found.** Senses written as `{{Nodef}}` —
  "definition missing" — are dropped, since a placeholder is worse than nothing,
  and a page made only of them answers as not in the dictionary.

### The Italian tutor

`public/js/lib/tutor-it.js` is the third pack for the shared router, and
`public/js/data/grammar-it.js` holds its 20 grammar topics, in Italian and
English: essere and avere, the passato prossimo, passato prossimo against
imperfetto, the congiuntivo, gender and articles, prepositions with the
article, the partitive, object pronouns single and combined, *ci* and *ne*,
negation, adjectives, the future, the conditional and *se* clauses, *sapere*
and *conoscere*, *piacere*, *tu* and *Lei*, reflexive verbs, comparatives and
superlatives, *da*, *per* and *fa* for time, and double consonants and written
accents.

Where standard Italian and everyday speech part ways — the congiuntivo after
*penso che*, *gli* for "to them" — the notes say so rather than pretend the
spoken form does not exist. And very common short words — *ci*, *ne*, *da*,
*per* — are not keywords on their own, because they turn up in half of all
Italian questions.

### The Italian translator

DeepL, and nothing beneath it — when DeepL cannot answer, the page says the
translator is unavailable. Pronunciation goes to ElevenLabs with the language
code `it`.

## Design

Modelled on [investors.duolingo.com](https://investors.duolingo.com/), measured
from the live page rather than eyeballed: a white page, huge chunky **lowercase
headings in Duolingo green** (`#58CC02`), grey body text (`#4B4B4B`), and cards
and buttons with a **2px border and a 4px bottom edge** (`#E5E5E5`, 12–16px
corners) that press down two pixels when clicked. Duolingo blue (`#1CB0F6`) is
for links and secondary buttons, and marks what is selected — a chosen language
card, the active tab, the interface language — the way Duolingo marks a chosen
answer. Gold is for notices and idioms; red for irregular forms.

**Fonts.** Duolingo's own faces, Feather Bold and DIN Round, are not free.
**Fredoka** stands in for Feather on the big headings and **Nunito** for DIN
Round everywhere else, both from Google Fonts.

**The header is Duolingo's**: the mark and the lowercase wordmark on the left;
plain uppercase links on the right, light grey, a shade darker on hover and for
the page you are on; then the **ES | EN** switch and the settings gear, both
drawn as Duolingo buttons. On a phone the links move to a row of their own under
the logo, spread edge to edge. **There is no menu button at any width.**

**The illustrations are drawn SVGs in `public/assets/art/`**, generated by
`scripts/draw-art.py` (standard library only; run it again after editing):

| | |
| --- | --- |
| `logo.svg` | the mascot's head — a green speech bubble with big eyes and a mortarboard. Also the favicon. |
| `mascot.svg` | the home page: the mascot with an open book, waving, between *¡Hola!*, *Bonjour* and *Ciao* |
| `es.svg` `fr.svg` `it.svg` | each language's landmark: La Mancha windmills, the Eiffel Tower, the Leaning Tower of Pisa. On its card on the home page and in its front page's hero. |
| `translator.svg` `conjugator.svg` `dictionary.svg` `chat.svg` | the tilted icons on the feature cards and at the top right of each page, as on Duolingo's investor cards |
| `soon.svg` | the *More languages* card |

The mascot is original — a speech bubble, not an owl — and nothing is copied
from Duolingo's artwork. The style is theirs: flat shapes with no outlines, a
darker shade down one side, a light highlight pill, rounded everything, and
confetti around the big scenes. The script asserts that every shape stays inside
its canvas and that everything that should touch does — the mascot's feet on the
grass, every Eiffel platform covering the section below it, the Pisa drums
stacked without a gap after the lean — and every picture was rendered on both
the white and the dark background and looked at before it was kept.

**Everything is still.** No transitions, no animations, no canvas: the old
animated network behind the hero, the parallax wallpaper and the thrown confetti
are gone. Waiting is three still dots. The teacher's lock crosses the page with
two flat strips of yellow tape rather than rolling them in.

**The photographs are retired, not deleted.** The six city wallpapers (Madrid,
Paris, Rome; day and night) are in `archive/wallpapers/`, outside `public/`, so
they are kept but never served or loaded.

**Light and dark.** Light is the default, as Duolingo's page is; dark is a
choice in the settings menu, and uses Duolingo's own dark palette — deep
blue-grey `#131F24` rather than black, slate borders, the same green. The choice
is stamped onto `<html data-theme>` by an inline script before the first paint,
so the page never flashes the wrong one.

**Checkboxes are drawn, not the browser's**: a rounded box with a thick bottom
edge that fills green with a white tick.

**No rubber-band bounce** at either end of the page (`overscroll-behavior`).

Icons inside buttons are drawn sprites in `public/js/lib/dom.js`, not emoji or
text glyphs, which render differently on every platform.

## Configuration

The conjugator, the grammar notes and the tutor work with no setup at all. The
translator and pronunciation need a key each, and the dictionary works without
one but runs out quickly:

```bash
cp .env.example .env      # then put your keys in it
```

| Variable | Effect |
| -------- | ------ |
| `DEEPL_API_KEY` | The translator. A free key (ending `:fx`); without one the translator says it is unavailable. |
| `RAE_API_KEY` | Optional. Raises rae-api.com's limits from 100 lookups a day to 5,000. |
| `ELEVENLABS_API_KEY` | Pronunciation on the dictionary page. Without it the speaker button removes itself. |
| `ELEVENLABS_VOICE_ID` | Optional. A premade voice; the default is a clear educator voice. |
| `TEACHER_PASSCODE` | The teacher's lock. Default `AP_Lit` — change it. |
| `PORT` | Defaults to `4000`. |

Those three keys and the passcode are the only settings that matter. There is
no model key to set, because there is no model.

Without a key:

- **Translation** is unavailable without a DeepL key, and the page says so rather than guessing.
- **Pronunciation** is simply not offered.
- **Example sentences** still come from Tatoeba, which needs no key, and fall back to a per-part-of-speech template, labelled as such in the UI.
- **Chat** answers from the site's own data, and offers rephrasings for the rest.

### External services

Everything the site talks to, and nothing else:

| Service | What for | Key |
| --- | --- | --- |
| [DeepL](https://www.deepl.com/pro-api) | translation, all three languages both ways | `DEEPL_API_KEY` |
| [Wikipedia](https://www.wikipedia.org) | the established names inside translations | none |
| [rae-api.com](https://rae-api.com) | Spanish definitions, and the RAE's Spanish conjugation tables | `RAE_API_KEY`, optional |
| [fr.wiktionary.org](https://fr.wiktionary.org), [it.wiktionary.org](https://it.wiktionary.org) | French and Italian definitions | none |
| [en.wiktionary.org](https://en.wiktionary.org) | the English gloss beside a headword | none |
| [Tatoeba](https://tatoeba.org) | example sentences | none |
| [ElevenLabs](https://elevenlabs.io) | pronunciation | `ELEVENLABS_API_KEY` |
| [Google Fonts](https://fonts.google.com) | Fredoka and Nunito, loaded by the visitor's browser | none |

Plus the host itself — Render, or Google Apps Script. Every one of them is used
on a free tier.

## Where things live

Files marked **·fr** or **·it** are the French or Italian counterpart of the one
above them.

```
server/
  index.js              express app: /api routes, static files, SPA fallback
  study.js              the languages a route accepts; anything else is Spanish
  corpus.js             Tatoeba sentences and Wiktionary glosses, any language
  throttle.js           three lanes onto Wikimedia, so a whole class at once
                        does not draw a 429
  translators.js        DeepL, with Wikipedia's names and the idioms laid over
  idioms.js             one idiom table per language
  deepl.js              the translator; a free key only
  speech.js             pronunciation: one word, cached, told which language
  accents.js            puts back the accents a student did not type
  dictionary-fr.js   ·fr a free dictionary, parsed from wikitext
  dictionary-it.js   ·it the Wikizionario, parsed the same way into the same shape
  env.js                reads .env without a dependency
  routes/
    translate.js        DeepL or a plain 503 — failures never cached
    speak.js            one spoken word, refusing anything that is not one
    dictionary.js       picks a dictionary by `study`, then normalises all
                        three into one shape; rejects what is not a word before
                        spending a request on it
    verbs.js            RAE's own conjugation tables, normalised to our shape
    lock.js             the teacher's lock, held in memory
public/
  index.html            app shell
  styles.css            the whole design system
  js/
    app.js              history-API router: / is the home page, /es /fr /it
                        the languages, and old unprefixed links go to /es
    lib/study.js        the language the site is *about*, read from the address
    lib/settings.js     the gear: light or dark, and the teacher's lock
    lib/site-lock.js    the lock's form and state, polled from the server
    lib/conjugator.js   the Spanish conjugation engine
    lib/conjugator-fr.js ·fr the French one: two stems, two auxiliaries
    lib/conjugator-it.js ·it the Italian one: -isc-, the 1-3-3 passato remoto,
                             reflexive pronouns in the forms
    lib/art.js          the drawings, by name — one place for the paths
    lib/markdown.js     DOM-building markdown renderer (no innerHTML)
    lib/tutor.js        intent routing for the chat — shared by every language —
                        and the rephrasings offered when it cannot answer
    lib/tutor-es.js     what the router needs to know about Spanish
    lib/tutor-fr.js  ·fr the same, for French
    lib/tutor-it.js  ·it the same, for Italian
    lib/chat-session.js the conversation, held outside the view so navigating
                        away cannot interrupt an answer
    lib/theme.js        dark/light switching
    lib/tape.js         the X that seals the page when the teacher locks it
    lib/i18n.js         every interface string — one table per study language
    lib/language-switch.js  the ES/EN — or FR/EN, IT/EN — switch
    data/grammar.js     22 grammar explanations, Spanish and English
    data/grammar-fr.js ·fr 23 more, French and English
    data/grammar-it.js ·it 20 more, Italian and English
    data/verbs.js       stem changes, irregulars, the search index
    data/verbs-fr.js ·fr irregulars, the -er spelling exceptions, 232 verbs
    data/verbs-it.js ·it -isc- verbs, irregulars, essere verbs, 292 verbs
    views/home.js       the home page: the language boxes
    views/translator.js a language's front page: hero, translator, search
    views/              one module per page, driven by the study language
test/
  conjugator.test.js       204 reference forms checked against RAE paradigms
  conjugator-fr.test.js ·fr 163 checked against the Bescherelle paradigms
  conjugator-it.test.js ·it 272 checked against the Treccani and Zanichelli
                               paradigms
  conjugator-view.test.js 1123 that the page's tense lists match every engine,
                               and that every verb in every index conjugates
  markdown.test.js          20 on the renderer, mostly that tables are tables
  tutor.test.js             86 checks on intent routing, the form index and
                               the rephrasings offered when it declines
  tutor-fr.test.js      ·fr  70 that the French pack drives the same router
  tutor-it.test.js      ·it  89 that the Italian pack does too
  lock.test.js              16 on the padlock, against a real express app, and
                               that it is the only word the lock accepts
  corpus.test.js            24 checks on sentence ranking and gloss extraction
  speech.test.js            17 on what may be spoken and what is refused
                               before a character of the month is spent
  translators.test.js       62 checks that DeepL is the only engine asked, that
                               every way it can fail ends in "unavailable", that
                               Wikipedia puts names right without ever standing
                               in for DeepL, and that the idioms still correct it
  idioms.test.js            53 checks on idiom pairing in every direction
  dictionary-it.test.js ·it  26 on reading Wikizionario wikitext
  appscript.test.js         19 on the Apps Script build, run in a bare V8
                               context with stand-in Google services

appscript/
  build.mjs             server/ and public/ → an Apps Script project in dist/
  src/Code.js           the three functions a browser may call: doGet, api,
                        apiResult
  src/shim.js           fetch, URL, Buffer, timers and process.env, on
                        UrlFetchApp and friends; caches on CacheService
  src/client.js         fetch('/api/…') over google.script.run, routing
                        through the iframe
  src/modules/          stand-ins for Express and the throttle, and the
                        request handler
  emulator.mjs          enough Apps Script to run dist/ under Node
  preview.mjs           dist/ at localhost:4100, against the real services
```

`npm test` runs all 2,244 across 15 suites, offline, in a couple of seconds.

## The conjugation engine

There are three, one per language: `public/js/lib/conjugator.js` for Spanish,
`conjugator-fr.js` for French and `conjugator-it.js` for Italian — see *[The
French conjugator](#the-french-conjugator)* and *[The Italian
conjugator](#the-italian-conjugator)* for the other two. All build paradigms
from rules rather than a form table.

`public/js/lib/conjugator.js` applies its rules in this order:

1. **Regular endings** for the three classes.
2. **Orthographic changes** that only preserve pronunciation — `buscar → busqué`,
   `llegar → llegué`, `coger → cojo`, `conocer → conozco`, `leer → leyó`,
   `construir → construyo`, `gruñir → gruñó`, `seguir → sigo`.
3. **Stem changes** — `pensar → pienso`, `dormir → durmió`, `enviar → envío`.
4. **Explicit irregulars**, inherited by prefixed derivatives, so `obtener`
   comes free from `tener` and `proponer` from `poner`.

`npm test` checks 204 reference forms. The engine was also cross-checked
cell-by-cell against RAE's own tables (~1,200 cells) during development.

On the conjugation page the local engine renders instantly, then RAE's own table
is fetched and merged over it when the verb is in the dictionary — so the forms
you see are authoritative where RAE has them, and generated where it doesn't.
The badge on the verb card tells you which.

Neither French nor Italian has an equivalent to merge — no authority for
either publishes an API — so there the local engine *is* the table and the badge is left off rather than
claiming an authority behind it.

## Deploying

This is a Node server, not a static site, so GitHub Pages and Netlify's static
hosting cannot run it — the translator, dictionary, pronunciation and lock all
need the server.
Anything that runs Node works: Render, Railway, Fly.io, or a VPS. It also
builds into a Google Apps Script web app; see below.

Whatever you pick, it needs to be **one instance**. The teacher's lock and the
dictionary cache are held in memory, so a second instance would
have its own copy of each — a locked site would be unlocked for half the class.

### Render

There is a `render.yaml` in the repo, so this is a Blueprint rather than a form
to fill in:

1. *New → Blueprint* on Render, and point it at this repository.
2. It reads `render.yaml` and prompts for the keys marked `sync: false`.
3. Deploy.

The Blueprint pins **one instance** and a `/api/health` check. The instance
count is not a performance choice — see below.

To do it by hand instead: build `npm install`, start `npm start`, instance
count 1, and set the variables below.

**Change the passcode before anyone has the URL.** `TEACHER_PASSCODE` has a
default, and the default is in the source of a public repository — anyone who
reads it can seal your site.

The server already reads `PORT` from the environment, binds on all interfaces,
and exposes `GET /api/health` for a health check. It answers `{ ok, translator }`
— whether a DeepL key is set — and on Apps Script also the runtime and how many
of the three keys are present.

### Google Apps Script

The same site also runs as an Apps Script web app, alongside the Render one
rather than instead of it. It is not a second copy: `appscript/build.mjs` turns
`server/` and `public/` into an Apps Script project in `appscript/dist`, and
`appscript/src` supplies the parts Apps Script lacks. A change to the site is a
change to both; rebuild and push.

It runs on the same free tiers as the Render site, and the same keys go in its
script properties. Apps Script itself is free, and this site must never cost
anything.

To set it up:

1. `npm install -g @google/clasp`, then `clasp login`.
2. Create a standalone script at <https://script.google.com>, and put its ID in
   `appscript/.clasp.json` (copy `.clasp.json.example`).
3. `npm run appscript:push`, which builds and uploads.
4. In the editor: *Project Settings → Script properties*, one row for each
   variable you would put in `.env`. While none of `DEEPL_API_KEY`,
   `RAE_API_KEY` and `ELEVENLABS_API_KEY` is set, the page shows a notice
   pointing to the Render site; it goes away once any one of them is.
5. *Deploy → New deployment → Web app*, executing as yourself, access for
   anyone. Each later push needs *Manage deployments → Edit → New version*
   before visitors see it.

`npm run appscript:preview` serves the built project at
<http://localhost:4100> before any of that. It runs the generated code in a bare
V8 context, with curl standing in for UrlFetchApp and `.env` for the script
properties. `test/appscript.test.js` runs the same way, as part of `npm test`.

How it differs from the Node server:

- **Nothing is held in memory.** Each request is a fresh process. The caches
  and the teacher's lock live in CacheService instead. That is
  also why one instance is no longer a concern here. CacheService forgets
  after six hours at most, so a forgotten lock still lifts itself, as a
  restart lifts it on Render.
- **Requests run one after another.** UrlFetchApp is synchronous, so a French
  or Italian lookup that needs the entry, an accent search and an English gloss
  makes three requests in a row. It is slower than on Node, and it is the
  same answer.
- **The page is in an iframe** on another host. Routes are mirrored into the
  address bar as `?page=es/conjugacion&v=ir`, so links and the back button work.
- **The footer links to the Render site**, profegpt.onrender.com, so a reader
  in the Apps Script version always has the real address to bookmark or share.
  On the Render site itself the link is left out.
- **Quotas are the owner's.** Every visitor's request runs as the deploying
  account: about 20,000 URL fetches a day on a personal Google account, and
  30 requests at a time.

### Environment variables in production

| Variable | Why it matters live |
| --- | --- |
| `RAE_API_KEY` | **Get one.** Anonymous dictionary access is 100 lookups a day, which one class will exhaust. Free at <https://rae-api.com/login>. |
| `TEACHER_PASSCODE` | **Change it.** The default is in a public repo. |
| `DEEPL_API_KEY` | **Get one.** It is the translator, on every side; without it the translator says it is unavailable. Free tier, 500k characters a month; only a free key (ending `:fx`) is used, so it cannot be billed. |
| `ELEVENLABS_API_KEY` | Pronunciation. Free tier, 10,000 characters a month for the whole site; use a free account, which refuses past the limit rather than charging. |

### Things that will surprise you otherwise

- **Free tiers sleep.** Render's free plan spins down when idle; the first
  request afterwards is slow, and the lock and caches reset. That reset is
  harmless — arguably a feature for the lock — but the delay is visible.
- **The lock clears on every deploy and restart**, by design. Nobody should be
  locked out by a process nobody is watching.

## Notes

- Dictionary data comes from [rae-api.com](https://rae-api.com), which serves
  the RAE's *DLE* as JSON. `dle.rae.es` itself blocks direct requests.
  Anonymous access is **10 requests a minute and 100 a day** — enough for
  development, not for a class. A free self-service key at
  <https://rae-api.com/login> raises it to **60/minute and 5,000/day**; set
  `RAE_API_KEY` and it is sent automatically. Being rate-limited surfaces as a
  429 with a "come back in N minutes" message rather than a generic failure.
