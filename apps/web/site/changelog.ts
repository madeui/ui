// The changelog index (/changelog): every entry, newest first, in the order
// the sidebar, RSS and llms.txt list them. Pure: content pages in, index
// entries out. A new changelog .mdx is picked up here with no code change.

import { routeList, type ContentPage } from './routes.ts';

export interface ChangelogEntry {
  route: string;
  title: string;
  /** The entry's anchor on the index page, from its title. Unique on the page. */
  id: string;
  /** Publish date, long `en` form in UTC ("September 9, 2026"). */
  date?: string;
  /** Frontmatter `changelog.category`, shown as a badge. */
  category?: string;
}

/** Lowercase ASCII words joined by hyphens: "v1.1.0" → "v1-1-0". */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'update';

const longDate = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export function changelogEntries(pages: ContentPage[]): ChangelogEntry[] {
  const seen = new Set<string>();
  return routeList(pages)
    .filter((page) => page.file.startsWith('changelog/'))
    .map((page) => {
      // Titles that slug alike get -2, -3, … so every entry keeps its own anchor.
      const base = slugify(page.title);
      let id = base;
      for (let n = 2; seen.has(id); n += 1) id = `${base}-${n}`;
      seen.add(id);
      return {
        route: page.route,
        title: page.title,
        id,
        ...(page.date ? { date: longDate.format(page.date) } : {}),
        ...(page.category ? { category: page.category } : {}),
      };
    });
}
