import { navGroups, type ContentPage } from '../routes.ts';
import { downlevel, stripFrontmatter, type ResolveExample } from './markdown.ts';
import { absoluteUrl, changelogFeed, site } from './site.ts';

/** A content page with its raw .mdx source. */
export interface PageSource {
  page: ContentPage;
  source: string;
}

const header = `# ${site.name}\n\n> ${site.description}`;

const linkLine = (page: ContentPage) =>
  `- [${page.title}](${absoluteUrl(page.route)})${page.description ? `: ${page.description}` : ''}`;

/**
 * `/llms.txt` (also served as `/index.md`): the sidebar as Markdown. Each
 * group is a heading (`##` for a header tab, `###` inside one) followed by
 * its pages as a link list; a group with nothing under it is left out. The
 * changelog feed closes the file.
 */
export function llmsIndex(pages: ContentPage[]): string {
  const groups = navGroups(pages);
  const blocks: string[] = [header];
  groups.forEach((group, index) => {
    // A group counts when it, or a subgroup before the next sibling, has pages.
    const next = groups.findIndex((other, at) => at > index && other.depth <= group.depth);
    const subtree = groups.slice(index, next === -1 ? undefined : next);
    if (!subtree.some((entry) => entry.pages.length > 0)) return;
    blocks.push(`${'#'.repeat(Math.min(group.depth, 6))} ${group.label}`);
    if (group.pages.length > 0) blocks.push(group.pages.map(linkLine).join('\n'));
  });
  blocks.push('## RSS Feeds', `- [${changelogFeed.title}](${absoluteUrl(changelogFeed.path)})`);
  return `${blocks.join('\n\n')}\n`;
}

/**
 * `/llms-full.txt`: every page's Markdown body (frontmatter stripped,
 * Examples inlined as in the .md mirror) under its title and URL, sorted by
 * route.
 */
export function llmsFull(documents: PageSource[], resolve: ResolveExample): string {
  const sections = documents
    .toSorted((a, b) => a.page.route.localeCompare(b.page.route, 'en'))
    .map(({ page, source }) => {
      const body = stripFrontmatter(downlevel(source, resolve)).trim();
      return [`# ${page.title}`, `Source: ${absoluteUrl(page.route)}`, '', body].join('\n');
    });
  return `${header}\n\n${sections.join('\n\n---\n\n')}\n`;
}
