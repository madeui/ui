import { describe, expect, test } from 'vitest';

import type { SearchResult } from '../site/search.ts';
import { registerWebMcpTools, webMcpTools, type WebMcpTool } from '../site/webmcp.ts';

const files: Record<string, string> = {
  '/docs/components/button.md': '# Button\n',
  '/index.md': '# madeui\n',
  '/llms.txt': '# madeui\n\n> Index.\n',
};
const fetchFn = (async (url: string) =>
  url in files ? new Response(files[url]) : new Response('Not found', { status: 404 })) as typeof fetch;

const result: SearchResult = {
  hits: [
    { route: '/docs/components/dialog', title: 'Dialog', section: 'Components', excerpt: 'A window over the page.', content: '' },
    { route: '/docs/components/sheet', title: 'Sheet', section: 'Components', excerpt: "Don't <close> it.", content: '' },
  ],
  sections: [{ label: 'Components', count: 2 }],
};

function tools(search: (query: string) => SearchResult = () => result) {
  const list = webMcpTools({ fetchFn, loadSearch: async () => search });
  const byName = (name: string) => list.find((tool) => tool.name === name)!;
  return { list, byName };
}

describe('WebMCP tools', () => {
  test('three read-only tools with their names and input schemas', () => {
    const { list } = tools();
    expect(list.map(({ name, inputSchema, annotations }) => ({ name, inputSchema, annotations }))).toEqual([
      {
        name: 'search_docs',
        inputSchema: {
          properties: { query: { description: 'The search query.', type: 'string' } },
          required: ['query'],
          type: 'object',
        },
        annotations: { openWorldHint: false, readOnlyHint: true },
      },
      {
        name: 'get_page',
        inputSchema: {
          properties: { route: { description: 'Root-relative page route, e.g. `/quickstart`.', type: 'string' } },
          required: ['route'],
          type: 'object',
        },
        annotations: { openWorldHint: false, readOnlyHint: true },
      },
      {
        name: 'list_pages',
        inputSchema: { properties: {}, type: 'object' },
        annotations: { openWorldHint: false, readOnlyHint: true },
      },
    ]);
  });

  test('search_docs lists each hit as "title — route" and its excerpt', async () => {
    expect(await tools().byName('search_docs').execute({ query: 'dialog' })).toEqual({
      content: [
        {
          type: 'text',
          text: "Dialog — /docs/components/dialog\nA window over the page.\n\nSheet — /docs/components/sheet\nDon't <close> it.",
        },
      ],
    });
  });

  test('search_docs: an empty query is an error, no hits a message', async () => {
    const empty = tools(() => ({ hits: [], sections: [] }));
    expect(await empty.byName('search_docs').execute({ query: '  ' })).toEqual({
      content: [{ type: 'text', text: 'Provide a non-empty `query` string.' }],
      isError: true,
    });
    expect(await empty.byName('search_docs').execute({ query: 'zzz' })).toEqual({
      content: [{ type: 'text', text: 'No results for "zzz".' }],
    });
  });

  test('get_page returns the page Markdown; the home is /index.md; a trailing slash is dropped', async () => {
    const getPage = tools().byName('get_page');
    expect(await getPage.execute({ route: '/docs/components/button/' })).toEqual({ content: [{ type: 'text', text: '# Button\n' }] });
    expect(await getPage.execute({ route: '/' })).toEqual({ content: [{ type: 'text', text: '# madeui\n' }] });
  });

  test('get_page: a relative route or a missing page is an error', async () => {
    const getPage = tools().byName('get_page');
    expect(await getPage.execute({ route: 'docs' })).toEqual({
      content: [{ type: 'text', text: 'Pass a root-relative route, e.g. `/quickstart`.' }],
      isError: true,
    });
    expect(await getPage.execute({ route: '/nope' })).toEqual({
      content: [{ type: 'text', text: 'No Markdown found for /nope.' }],
      isError: true,
    });
  });

  test('list_pages returns llms.txt', async () => {
    expect(await tools().byName('list_pages').execute({})).toEqual({ content: [{ type: 'text', text: files['/llms.txt'] }] });
  });
});

describe('registration', () => {
  const list: WebMcpTool[] = tools().list;

  test('provideContext takes the whole tool set', () => {
    let provided: WebMcpTool[] = [];
    expect(registerWebMcpTools(list, { provideContext: ({ tools }) => void (provided = tools) })).toBe(true);
    expect(provided).toBe(list);
  });

  test('registerTool takes them one by one', () => {
    const registered: string[] = [];
    expect(registerWebMcpTools(list, { registerTool: (tool) => void registered.push(tool.name) })).toBe(true);
    expect(registered).toEqual(['search_docs', 'get_page', 'list_pages']);
  });

  test('a context without either registers nothing', () => {
    expect(registerWebMcpTools(list, {})).toBe(false);
  });
});
