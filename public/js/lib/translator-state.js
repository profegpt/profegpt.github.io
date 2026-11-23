/**
 * Which way the translator is going, kept in one place.
 *
 * The page has two panes, a source and a target, and a button between them
 * that flips them. Everything that names a language (the pane labels, the
 * request sent to /api/translate, the check made on its answer, the swap) reads
 * the same `{ from, to }` pair from here, so the labels can never say
 * ENGLISH → FRENCH while the request goes the other way.
 *
 * The translator never guesses the source language. "hi", "no" and "pain"
 * are words in more than one language, and an engine left to detect them
 * will sometimes pick the wrong one. The source is always the source pane's
 * language and the target always the target pane's, and both are sent.
 *
 * Plain functions with no DOM, so test/translator-state.test.js can check
 * them in Node.
 */

/** The pair the page opens on: English into the language the side is about. */
export function initialDirection(study) {
  return { from: 'en', to: study };
}

/** The same two languages, the other way round. */
export function swapDirection(direction) {
  return { from: direction.to, to: direction.from };
}

/** What is sent for one translation: both ends, never left to be guessed. */
export function requestBody(text, direction, study) {
  return { text, from: direction.from, to: direction.to, study };
}

/**
 * Whether what the target pane shows is the translation of what the source
 * pane holds now, in the direction the labels show now. `shown` is what the
 * last applied answer was for.
 */
export function isCurrent(shown, text, direction) {
  return Boolean(shown)
    && shown.text === String(text).trim()
    && shown.from === direction.from
    && shown.to === direction.to;
}

/**
 * Whether an answer may go in the target pane.
 *
 * It has to be for the request the page is waiting on (the same text, the same
 * direction as the panes show now) and, where the server says which way it
 * went, that has to be the way it was asked. An answer for anything else is
 * dropped rather than shown under the wrong label.
 */
export function acceptsAnswer(request, current, data) {
  if (!request || !current || !data) return false;
  if (request.from !== current.direction.from || request.to !== current.direction.to) return false;
  if (request.text !== String(current.text).trim()) return false;
  if (data.from !== undefined && data.from !== request.from) return false;
  if (data.to !== undefined && data.to !== request.to) return false;
  return true;
}

/**
 * The swap button.
 *
 * When the target pane holds the translation of what is in the source pane,
 * the two trade places, so the translation becomes the new text to translate.
 * When it does not (the text was edited since, the answer has not come back,
 * or the last request failed), there is no pair to trade: carrying the old
 * output across would put text from one language under the other language's
 * label. Then only the languages turn round; the text stays in the source
 * pane and is translated afresh from the new source language.
 *
 * @returns {{ direction, input: string, output: string, shown: object|null }}
 */
export function swapPanes({ direction, input, output, shown }) {
  const next = swapDirection(direction);
  const paired = String(output || '').trim() !== '' && isCurrent(shown, input, direction);
  if (paired) {
    return {
      direction: next,
      input: output,
      output: input,
      // The old source text is a fair rendering of the old translation, and a
      // fresh request in the new direction follows at once anyway.
      shown: { text: String(output).trim(), from: next.from, to: next.to },
    };
  }
  return { direction: next, input, output: '', shown: null };
}
