// WebMCP: read-only tools an agentic browser can call on the page — search,
// a page's Markdown, the page index. components/site/web-mcp.tsx loads this
// module only when the browser exposes a model context; everywhere else it
// never loads. Tool names, descriptions and input schemas are a contract with
// the agents that call them: keep them as they are.

import type { Search } from './search.ts';

interface WebMcpResult {
  content: { text: string; type: 'text' }[];
  isError?: boolean;
}

/** Arguments as the agent sent them: WebMCP does not validate them against the schema. */
export interface WebMcpToolArgs {
  query?: unknown;
  route?: unknown;
}

export interface WebMcpTool {
  annotations: { openWorldHint: boolean; readOnlyHint: boolean };
  description: string;
  execute: (input: WebMcpToolArgs) => Promise<WebMcpResult>;
  inputSchema: {
    properties: Record<string, { description: string; type: 'string' }>;
    required?: string[];
    type: 'object';
  };
  name: string;
}

/** The two registration shapes browsers have shipped: the whole set at once, or tool by tool. */
export interface ModelContext {
  provideContext?: (context: { tools: WebMcpTool[] }) => void;
  registerTool?: (tool: WebMcpTool) => void;
}

export interface WebMcpToolOptions {
  /** The search over the site index, loaded on the first search_docs call. */
  loadSearch: () => Promise<Search>;
  fetchFn?: typeof fetch;
}

const text = (value: string, isError = false): WebMcpResult =>
  isError ? { content: [{ text: value, type: 'text' }], isError: true } : { content: [{ text: value, type: 'text' }] };

const readOnly = { openWorldHint: false, readOnlyHint: true };

export function webMcpTools({ loadSearch, fetchFn = (input, init) => fetch(input, init) }: WebMcpToolOptions): WebMcpTool[] {
  // One search per page; a failed load retries on the next call.
  let search: Promise<Search> | undefined;
  return [
    {
      annotations: readOnly,
      description:
        'Full-text search across this documentation site. Returns matching pages with their title, URL, and a short excerpt.',
      async execute(input) {
        const query = typeof input.query === 'string' ? input.query : '';
        if (!query.trim()) return text('Provide a non-empty `query` string.', true);
        try {
          search ??= loadSearch();
          const { hits } = (await search)(query);
          if (hits.length === 0) return text(`No results for "${query}".`);
          return text(hits.map((hit) => `${hit.title} — ${hit.route}\n${hit.excerpt}`).join('\n\n'));
        } catch {
          search = undefined;
          return text('Search is unavailable right now.', true);
        }
      },
      inputSchema: {
        properties: { query: { description: 'The search query.', type: 'string' } },
        required: ['query'],
        type: 'object',
      },
      name: 'search_docs',
    },
    {
      annotations: readOnly,
      description: "Fetch a page of this site as plain Markdown. Pass the page's root-relative route, e.g. `/quickstart`.",
      async execute(input) {
        const route = typeof input.route === 'string' ? input.route : '';
        if (!route.startsWith('/')) return text('Pass a root-relative route, e.g. `/quickstart`.', true);
        const trimmed = route.length > 1 ? route.replace(/\/+$/u, '') : route;
        const response = await fetchFn(`${trimmed === '/' ? '/index' : trimmed}.md`).catch(() => null);
        if (!response?.ok) return text(`No Markdown found for ${route}.`, true);
        return text(await response.text());
      },
      inputSchema: {
        properties: { route: { description: 'Root-relative page route, e.g. `/quickstart`.', type: 'string' } },
        required: ['route'],
        type: 'object',
      },
      name: 'get_page',
    },
    {
      annotations: readOnly,
      description:
        "List this site's pages: the llms.txt index of every page with its URL and summary, organized by section.",
      async execute() {
        const response = await fetchFn('/llms.txt').catch(() => null);
        if (!response?.ok) return text('The page index (llms.txt) is unavailable.', true);
        return text(await response.text());
      },
      inputSchema: { properties: {}, type: 'object' },
      name: 'list_pages',
    },
  ];
}

/** Registers the tools on the context; false when it offers neither registration shape. */
export function registerWebMcpTools(tools: WebMcpTool[], context: ModelContext): boolean {
  if (typeof context.provideContext === 'function') {
    context.provideContext({ tools });
    return true;
  }
  if (typeof context.registerTool === 'function') {
    for (const tool of tools) context.registerTool(tool);
    return true;
  }
  return false;
}
