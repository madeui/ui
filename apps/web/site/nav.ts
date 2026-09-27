// The docs chrome's navigation, derived from the route list: the sidebar of a
// header tab, prev/next, and the eyebrow above a page title. Pure: content
// pages in, navigation out.

import { navGroups, type ContentPage } from './routes.ts';

/** A header tab: the top-level content folder a page belongs to. */
export type Tab = '/docs' | '/changelog';

export interface NavLink {
  route: string;
  title: string;
  /** Frontmatter `sidebar.badge` ("New"). */
  badge?: string;
}

export interface SidebarGroup {
  /** Group heading; the Changelog tab's entries have none. */
  label?: string;
  links: NavLink[];
}

/** Heading of a tab's own pages (the pages outside any subfolder). */
const TOP_GROUP_LABEL: Partial<Record<Tab, string>> = { '/docs': 'Getting started' };

export const tabOf = (route: string): Tab => (route.startsWith('/changelog') ? '/changelog' : '/docs');

const inTab = (route: string, tab: Tab) => route === tab || route.startsWith(`${tab}/`);

const toLink = (page: ContentPage): NavLink =>
  page.badge === undefined ? { route: page.route, title: page.title } : { route: page.route, title: page.title, badge: page.badge };

/** The sidebar of one header tab, in reading order. */
export function sidebar(pages: ContentPage[], tab: Tab): SidebarGroup[] {
  return navGroups(pages)
    .filter((group) => group.pages.length > 0 && group.pages.every((page) => inTab(page.route, tab)))
    .map((group) => {
      const label = group.depth === 2 ? TOP_GROUP_LABEL[tab] : group.label;
      const links = group.pages.map(toLink);
      return label === undefined ? { links } : { label, links };
    });
}

/** Previous and next page over the flattened sidebar of the page's tab. */
export function pager(pages: ContentPage[], route: string): { prev?: NavLink; next?: NavLink } {
  const links = sidebar(pages, tabOf(route)).flatMap((group) => group.links);
  const at = links.findIndex((link) => link.route === route);
  if (at === -1) return {};
  const strip = ({ route, title }: NavLink): NavLink => ({ route, title });
  const prev = links[at - 1];
  const next = links[at + 1];
  return { ...(prev ? { prev: strip(prev) } : {}), ...(next ? { next: strip(next) } : {}) };
}

/** The group label shown above a page title: only for pages inside a subfolder. */
export function eyebrow(pages: ContentPage[], route: string): string | undefined {
  const group = navGroups(pages).find((g) => g.depth > 2 && g.pages.some((page) => page.route === route));
  return group?.label;
}
