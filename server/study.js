/**
 * The languages the site can be about, for the routes.
 *
 * Every route takes `study` from the page and has to decide what to do with a
 * value it does not recognise. They used to each keep their own list, which is
 * how one of them could quietly go on accepting a language the others had
 * dropped. One list, and anything not on it is Spanish — the site's default,
 * and the one whose dictionary is an authority.
 */

export const STUDY_LANGUAGES = ['es', 'fr', 'it'];

/** @returns {'es'|'fr'|'it'} */
export function studyOf(value) {
  return STUDY_LANGUAGES.includes(value) ? value : 'es';
}
