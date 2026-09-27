// The search index: one record per page, the page body as plain text, the
// section the sidebar shows it under; plus the Popular links the dialog shows
// before a query. Pure: page sources in, index out. app/search.json serves it,
// and checkSearchIndex() fails the build when it looks wrong.

import type { Nodes, Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import type { PageSource } from './artifacts/llms.ts';
import { navGroups, routeList, type ContentPage } from './routes.ts';

export interface SearchPage {
  route: string;
  title: string;
  description: string;
  /** The body as plain text (search.ts ranks and quotes it). */
  content: string;
  /** The sidebar group the page sits in: the filter pills group by it. */
  section: string;
}

export interface PopularPage {
  route: string;
  title: string;
}

export interface SearchIndex {
  /** Shown before a query: the first sidebar pages. */
  popular: PopularPage[];
  pages: SearchPage[];
}

/** How many sidebar pages Popular lists. */
const POPULAR_COUNT = 6;

/** A body shorter than this means the plain-text extraction lost the page. */
export const MIN_BODY_TEXT = 100;

// The body is parsed as Markdown (not MDX): a component is an HTML node whose
// tags are stripped and whose prose stays, so a <Callout> still indexes its
// text. Fenced code and images are left out (they are ranking noise), inline
// code is kept.
const TAG = /<\/?[a-zA-Z][^\n<>]*>|<\/?>/gu;
const WHITESPACE = /\s+/gu;
// Inline parents add no separator after their text, so `re*ally*` stays one word.
const INLINE = new Set(['delete', 'emphasis', 'footnoteReference', 'link', 'linkReference', 'strong']);
const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---[\t ]*(?:\r?\n|$)/u;

const markdown = unified().use(remarkParse).use(remarkGfm);

function collect(node: Nodes, out: string[]): void {
  switch (node.type) {
    case 'code':
    case 'image':
    case 'imageReference':
      return;
    case 'inlineCode':
      out.push(node.value);
      return;
    case 'html':
      out.push(node.value.replaceAll(TAG, ' '));
      return;
    case 'break':
      out.push(' ');
      return;
    default:
      break;
  }
  if ('value' in node) {
    out.push(node.value);
    return;
  }
  if ('children' in node) {
    for (const child of node.children) collect(child as Nodes, out);
    if (!INLINE.has(node.type)) out.push(' ');
  }
}

/** An .mdx source's body (frontmatter removed) as plain, searchable text. */
export function plainText(source: string): string {
  const tree = markdown.runSync(markdown.parse(source.replace(FRONTMATTER, ''))) as Root;
  const out: string[] = [];
  collect(tree, out);
  return out.join('').replaceAll(WHITESPACE, ' ').trim();
}

/** Each page's sidebar group label. */
function sections(pages: ContentPage[]): Map<string, string> {
  const byRoute = new Map<string, string>();
  for (const group of navGroups(pages)) for (const page of group.pages) byRoute.set(page.route, group.label);
  return byRoute;
}

const byRoute = (a: { route: string }, b: { route: string }) => (a.route < b.route ? -1 : a.route > b.route ? 1 : 0);

export function searchIndex(sources: PageSource[]): SearchIndex {
  const pages = sources.map((entry) => entry.page);
  const section = sections(pages);
  return {
    popular: routeList(pages)
      .slice(0, POPULAR_COUNT)
      .map(({ route, title }) => ({ route, title })),
    pages: sources
      .map(({ page, source }) => ({
        route: page.route,
        title: page.title,
        description: page.description ?? '',
        content: plainText(source),
        section: section.get(page.route) ?? '',
      }))
      .sort(byRoute),
  };
}

/** What is wrong with an index, as one line per problem (empty: nothing). */
export function checkSearchIndex(index: SearchIndex, pages: ContentPage[]): string[] {
  const problems: string[] = [];
  if (index.pages.length === 0) problems.push('the index is empty');
  if (index.pages.length !== pages.length) {
    problems.push(`${index.pages.length} records for ${pages.length} pages in the route list`);
  }
  const seen = new Set<string>();
  for (const page of index.pages) {
    if (seen.has(page.route)) problems.push(`${page.route} appears twice`);
    seen.add(page.route);
    if (page.content.length < MIN_BODY_TEXT) {
      problems.push(`${page.route}: ${page.content.length} characters of body text, fewer than ${MIN_BODY_TEXT}`);
    }
  }
  for (const link of index.popular) {
    if (!seen.has(link.route)) problems.push(`Popular links to ${link.route}, which has no page`);
  }
  return problems;
}
