// Search over the index app/search.json serves, in the browser: the dialog
// and the WebMCP search tool both query through createSearch().
//
// MiniSearch finds the matches (prefix on, typos off, any query word); the
// ranking is BM25 computed the way the docs search has always ranked (per
// field, over each field's distinct words, title ×3 and description ×2), so
// the order readers know stays. Excerpts and highlights are plain data: the
// dialog renders highlight segments as React elements, never as HTML.

import MiniSearch from 'minisearch';

import { loadSearchIndex } from './search-client.ts';
import type { PopularPage, SearchPage } from './search-index.ts';

/** Hits shown for a query. */
export const SEARCH_LIMIT = 12;
/** Matches ranked before the section filter; the pills count over these. */
export const RESULT_POOL = 48;

const FIELDS = ['title', 'description', 'content'] as const;
type Field = (typeof FIELDS)[number];
const BOOST: Record<Field, number> = { title: 3, description: 2, content: 1 };
const BM25 = { k: 1.2, b: 0.75, d: 0.5 };
/** Relative score difference below which two pages tie. */
const TIE = 1e-9;

// Words are runs of Latin letters, digits, `_`, `'` and `-` (so
// `date-picker` stays one word), lowercased, accents folded.
const SEPARATOR = /[^a-z0-9àèéìòóù_'-]+/u;
const MARKS = /\p{M}+/gu;

/** The distinct words of a text. */
function words(text: string): string[] {
  const out = new Set<string>();
  for (const word of text.toLowerCase().split(SEPARATOR)) {
    if (word) out.add(word.normalize('NFD').replace(MARKS, ''));
  }
  return [...out];
}

export interface SearchHit {
  route: string;
  title: string;
  section: string;
  /** Plain text: the body around the first match, or the description. */
  excerpt: string;
  /** The whole body, for the preview pane. */
  content: string;
}

export interface SectionCount {
  label: string;
  count: number;
}

export interface SearchResult {
  hits: SearchHit[];
  /** Matches per section across the ranked pool, in rank order. */
  sections: SectionCount[];
}

export type Search = (query: string, section?: string) => SearchResult;

interface FieldStats {
  /** Distinct words per page. */
  length: Map<string, number>;
  average: number;
  /** Pages containing each word. */
  pages: Map<string, number>;
}

export function createSearch(pages: SearchPage[]): Search {
  const mini = new MiniSearch<SearchPage>({
    idField: 'route',
    fields: [...FIELDS],
    tokenize: words,
    processTerm: (term) => term,
  });
  mini.addAll(pages);

  const total = pages.length;
  const order = new Map(pages.map((page, i) => [page.route, i]));
  const byRoute = new Map(pages.map((page) => [page.route, page]));
  const stats = {} as Record<Field, FieldStats>;
  for (const field of FIELDS) {
    const entry: FieldStats = { length: new Map(), average: 0, pages: new Map() };
    for (const page of pages) {
      const list = words(page[field]);
      entry.length.set(page.route, list.length);
      entry.average += list.length / total;
      for (const word of list) entry.pages.set(word, (entry.pages.get(word) ?? 0) + 1);
    }
    stats[field] = entry;
  }

  // Each distinct word counts once per field, so a word's frequency is one
  // over the field's distinct-word count.
  const score = (field: Field, word: string, route: string) => {
    const { length, average, pages: containing } = stats[field];
    const size = length.get(route) ?? 1;
    const count = containing.get(word) ?? 0;
    const frequency = 1 / size;
    const idf = Math.log(1 + (total - count + 0.5) / (count + 0.5));
    const weight = (idf * (BM25.d + frequency * (BM25.k + 1))) / (frequency + BM25.k * (1 - BM25.b + (BM25.b * size) / average));
    return BOOST[field] * weight;
  };

  const rank = (query: string) => {
    const queryWords = words(query);
    return mini
      .search(query, { prefix: true, fuzzy: false, combineWith: 'OR' })
      .map((result) => {
        let total = 0;
        for (const [word, fields] of Object.entries(result.match)) {
          // A word counts once for every query word it extends (`und` and
          // `unde` both reach "under").
          const reached = queryWords.filter((queryWord) => word.startsWith(queryWord)).length;
          for (const field of new Set(fields as Field[])) total += reached * score(field, word, result.id);
        }
        return { route: result.id as string, score: total, order: order.get(result.id) ?? 0 };
      })
      // Equal scores keep index order (summation order can differ in the
      // last bits, hence the tolerance).
      .sort((a, b) => (Math.abs(a.score - b.score) > TIE * a.score ? b.score - a.score : a.order - b.order))
      .slice(0, RESULT_POOL)
      .map((match) => byRoute.get(match.route)!);
  };

  return (query, section) => {
    const pool = rank(query);
    const counts = new Map<string, number>();
    for (const page of pool) if (page.section) counts.set(page.section, (counts.get(page.section) ?? 0) + 1);
    const hits = (section ? pool.filter((page) => page.section === section) : pool).slice(0, SEARCH_LIMIT).map((page) => ({
      route: page.route,
      title: page.title,
      section: page.section,
      excerpt: excerptFor(page.description, page.content, query),
      content: page.content,
    }));
    return { hits, sections: [...counts].map(([label, count]) => ({ label, count })) };
  };
}

export interface LoadedSearch {
  popular: PopularPage[];
  search: Search;
}

let loaded: Promise<LoadedSearch> | undefined;

/** The site index, fetched once and indexed once per page load; a failure retries on the next call. */
export function loadSearch(): Promise<LoadedSearch> {
  loaded ??= loadSearchIndex()
    .then((index) => ({ popular: index.popular, search: createSearch(index.pages) }))
    .catch((error: unknown) => {
      loaded = undefined;
      throw error;
    });
  return loaded;
}

const REGEXP_SPECIAL = /[$()*+.?[\\\]^{|}]/gu;

/** The query's words, escaped for a RegExp. */
const queryPatterns = (query: string) =>
  query
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((token) => token.replaceAll(REGEXP_SPECIAL, String.raw`\$&`));

function matchIndex(text: string, query: string): number {
  const patterns = queryPatterns(query);
  return patterns.length === 0 ? -1 : text.search(new RegExp(patterns.join('|'), 'iu'));
}

/** A window of `radius` characters around the first match (a third of it before), or the head of the text. */
export function matchSnippet(text: string, query: string, radius: number): string {
  const index = matchIndex(text, query);
  if (index < 0) {
    const head = text.slice(0, radius).trim();
    return head.length < text.length ? `${head}…` : head;
  }
  const start = Math.max(0, index - Math.floor(radius / 3));
  const end = Math.min(text.length, start + radius);
  const slice = text.slice(start, end).trim();
  return `${start > 0 ? '…' : ''}${slice}${end < text.length ? '…' : ''}`;
}

/** The line under a hit's title: the body around the match, else the description, else the body's head. */
export function excerptFor(description: string, content: string, query?: string): string {
  if (query && matchIndex(content, query) >= 0) return matchSnippet(content, query, 160);
  if (description) return description;
  const head = content.slice(0, 140);
  return head.length < content.length ? `${head}…` : head;
}

export interface Segment {
  text: string;
  mark: boolean;
}

/** The text split into runs, `mark` on every occurrence of a query word. */
export function highlight(text: string, query: string): Segment[] {
  const patterns = queryPatterns(query);
  if (patterns.length === 0) return [{ text, mark: false }];
  return text.split(new RegExp(`(${patterns.join('|')})`, 'giu')).map((part, i) => ({ text: part, mark: i % 2 === 1 }));
}
