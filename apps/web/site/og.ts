// The OG cards: what each page's /og/<route>.png shows. Pure: content pages
// in, card text out. The route handler (app/og) renders these; the list of
// cards is the route list, so a new .mdx gets its card with no code change.

import { site } from './artifacts/site.ts';
import { changelogEntries } from './changelog.ts';
import { changelogIndex, landing } from './head.ts';
import { customPages, ogImagePath, routeList, type ContentPage } from './routes.ts';

export interface OgCard {
  /** The headline. */
  title: string;
  /** One line under it (the page's frontmatter description). */
  description?: string;
  /** The page's address, without the scheme: `madeui.com/docs/cli`. */
  url: string;
  /** The foot of the card: the command a reader runs, or an entry's facts. */
  footer?: { kind: 'command' | 'meta'; text: string };
  /** The landing's headline is a statement: it ends in the brand's square period. */
  statement?: true;
}

const INIT = 'npx @madeui/cli init';
const COMPONENT = /^\/docs\/components\/([^/]+)$/u;

const address = (route: string) => `madeui.com${route === '/' ? '' : route}`;

function contentCard(page: ContentPage, meta: Map<string, string>): OgCard {
  const card: OgCard = { title: page.title, url: address(page.route) };
  if (page.file.startsWith('changelog/')) {
    const facts = meta.get(page.route);
    return facts ? { ...card, footer: { kind: 'meta', text: facts } } : card;
  }
  const component = COMPONENT.exec(page.route)?.[1];
  return {
    ...card,
    ...(page.description ? { description: page.description } : {}),
    footer: { kind: 'command', text: component ? `npx @madeui/cli add ${component}` : INIT },
  };
}

/** Every page's card, keyed by its image path (`/og/docs/cli.png`). */
export function ogCards(pages: ContentPage[]): Map<string, OgCard> {
  const meta = new Map(
    changelogEntries(pages).map((entry) => [entry.route, [entry.category, entry.date].filter(Boolean).join(' · ')]),
  );
  const cards = new Map<string, OgCard>();
  for (const page of customPages) {
    cards.set(
      ogImagePath(page.route),
      page.route === '/'
        ? {
            title: landing.headline,
            description: site.description,
            url: address('/'),
            footer: { kind: 'command', text: INIT },
            statement: true,
          }
        : { title: changelogIndex.title, description: changelogIndex.description, url: address(page.route) },
    );
  }
  for (const page of routeList(pages)) cards.set(ogImagePath(page.route), contentCard(page, meta));
  return cards;
}

/** generateStaticParams for app/og/[...slug]: `/og/docs/cli.png` → `['docs', 'cli.png']`. */
export const ogParams = (pages: ContentPage[]) =>
  [...ogCards(pages).keys()].map((path) => ({ slug: path.replace(/^\/og\//u, '').split('/') }));
