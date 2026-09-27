// The route list: every page of the site in navigation order. The single
// source for the sidebar, prev/next, llms.txt, the sitemap, OG images and
// search. Pure: content in, routes out (site/content.ts feeds the real pages).

/** One content page (an .mdx file under apps/docs/content). */
export interface ContentPage {
  /** Clean URL path: `/docs/components/button`. */
  route: string;
  /** Source file relative to the content root: `docs/components/button.mdx`. */
  file: string;
  title: string;
  description?: string;
  /** Frontmatter `sidebar.order`. */
  order?: number;
  /** Frontmatter `sidebar.badge` ("New"). */
  badge?: string;
  /** Changelog entries: publish date. */
  date?: Date;
  /** Changelog entries: frontmatter `changelog.category` ("Release"). */
  category?: string;
}

/**
 * A sidebar group: a content folder. Depth 2 for a top-level folder (a header
 * tab: Docs, Changelog), 3 for a folder inside one (Components).
 */
export interface NavGroup {
  label: string;
  depth: number;
  pages: ContentPage[];
}

interface Folder {
  key: string;
  label: string;
  pages: ContentPage[];
  folders: Map<string, Folder>;
}

const humanize = (segment: string) =>
  segment
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const isIndex = (file: string) => /(^|\/)index\.mdx$/u.test(file);

/**
 * Sort key of a page within its folder: `sidebar.order` when set, a folder's
 * index page first, changelog entries newest first, the rest after all of
 * those (ties broken by title).
 */
function pageOrder(page: ContentPage): number {
  if (page.order !== undefined) return page.order;
  if (isIndex(page.file)) return Number.NEGATIVE_INFINITY;
  if (page.date) return -page.date.getTime();
  return Number.POSITIVE_INFINITY;
}

const byOrderThenTitle = (a: ContentPage, b: ContentPage) => {
  const oa = pageOrder(a);
  const ob = pageOrder(b);
  if (oa !== ob) return oa < ob ? -1 : 1;
  return a.title.localeCompare(b.title);
};

function folderTree(pages: ContentPage[]): Folder {
  const root: Folder = { key: '', label: '', pages: [], folders: new Map() };
  for (const page of pages) {
    const segments = page.file.split('/').slice(0, -1);
    let folder = root;
    for (const segment of segments) {
      let child = folder.folders.get(segment);
      if (!child) {
        child = { key: segment, label: humanize(segment), pages: [], folders: new Map() };
        folder.folders.set(segment, child);
      }
      folder = child;
    }
    folder.pages.push(page);
  }
  return root;
}

/**
 * The sidebar as a flat list of groups in reading order: each folder's own
 * pages, then its subfolders (pages above groups, as the sidebar shows
 * them). Folders sort by label.
 */
export function navGroups(pages: ContentPage[]): NavGroup[] {
  const groups: NavGroup[] = [];
  const visit = (folder: Folder, depth: number) => {
    const children = [...folder.folders.values()].sort((a, b) => a.label.localeCompare(b.label));
    for (const child of children) {
      groups.push({ label: child.label, depth, pages: [...child.pages].sort(byOrderThenTitle) });
      visit(child, depth + 1);
    }
  };
  visit(folderTree(pages), 2);
  return groups;
}

/** Every content page in navigation order (prev/next walks this within a tab). */
export function routeList(pages: ContentPage[]): ContentPage[] {
  return navGroups(pages).flatMap((group) => group.pages);
}

/** HTML pages that are not content files: the landing and the changelog index. */
export const customPages = [
  { route: '/', title: 'madeui' },
  { route: '/changelog', title: 'Changelog' },
] as const;

/** Agent artifacts at fixed URLs (the Markdown mirrors and OG images are per page). */
export const textArtifacts = [
  '/llms.txt',
  '/llms-full.txt',
  '/agent-readability.json',
  '/robots.txt',
  '/sitemap.xml',
  '/changelog/rss.xml',
] as const;

/** Every HTML page route: the sitemap's URL set. */
export function pageRoutes(pages: ContentPage[]): string[] {
  return [...customPages.map((page) => page.route), ...routeList(pages).map((page) => page.route)];
}

/** `/docs/components/button` → `/docs/components/button.md`; `/` → `/index.md`. */
export const markdownPath = (route: string, extension: 'md' | 'mdx') =>
  `${route === '/' ? '/index' : route}.${extension}`;

/** `/docs` → `/og/docs.png`; `/` → `/og/index.png`. */
export const ogImagePath = (route: string) => `/og${route === '/' ? '/index' : route}.png`;

/** The Published URLs the site serves besides /r/*.json and static assets. */
export interface Inventory {
  /** HTML pages (the sitemap's URLs). */
  html: string[];
  /** Markdown mirrors: every content page and the landing, as .md and .mdx. */
  markdown: string[];
  /** llms*, agent-readability.json, robots, sitemap, the changelog feed. */
  artifacts: string[];
  /** One OG image per HTML page. */
  og: string[];
}

export function publishedInventory(pages: ContentPage[]): Inventory {
  const html = pageRoutes(pages);
  // The landing's mirror is synthesized (it equals llms.txt); the changelog
  // index has none.
  const mirrored = ['/', ...routeList(pages).map((page) => page.route)];
  return {
    html,
    markdown: mirrored.flatMap((route) => [markdownPath(route, 'md'), markdownPath(route, 'mdx')]),
    artifacts: [...textArtifacts],
    og: html.map(ogImagePath),
  };
}
