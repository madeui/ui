// Markdown content negotiation: the `Accept` headers that get a page's
// Markdown mirror at the page's own URL. next.config.mjs uses the pattern as
// a `has` header condition, which Next matches against the whole header.
//
// A header that lists `text/markdown` (or `text/x-markdown`) negotiates
// Markdown. `(.*,)?` absorbs earlier list entries, and the media type must end
// at `;`, `,` or the end of the header. An entry whose parameters say `q=0`
// ("not acceptable", RFC 9110 12.4.2) does not count; other q-values are not
// compared. Browsers never send `text/markdown`, so page requests from
// browsers are unaffected.
const MEDIA_TYPE = String.raw`text/(x-)?markdown`;
/** The rest of this list entry carries a zero q-value: `;q=0`, `; q=0.0`, `;charset=utf-8;q=0`. */
const ZERO_Q = String.raw`[^,]*;\s*[qQ]\s*=\s*0(\.0{0,3})?\s*(,|;|$)`;

export const ACCEPTS_MARKDOWN = String.raw`(.*,)?\s*${MEDIA_TYPE}(?!${ZERO_Q})(\s*[;,].*)?`;
