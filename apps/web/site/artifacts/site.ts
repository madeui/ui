// Site identity every text artifact prints: the name, the one-line
// description and the production origin its absolute URLs point at.
export const site = {
  name: 'madeui',
  description: 'Base UI + StyleX components you own. Agent-friendly by design.',
  url: 'https://madeui.com',
} as const;

/** `/docs` → `https://madeui.com/docs`; the home keeps its slash. */
export const absoluteUrl = (route: string) => encodeURI(route === '/' ? `${site.url}/` : `${site.url}${route}`);

/** The changelog's RSS feed. */
export const changelogFeed = {
  path: '/changelog/rss.xml',
  title: `${site.name} — Changelog`,
} as const;
