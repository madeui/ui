import { llmsIndex } from '@/site/artifacts/llms';
import { exampleSource, readSource, textResponse } from '@/site/artifacts/load';
import { markdownMirror } from '@/site/artifacts/markdown';
import { contentPages } from '@/site/content';

// The Markdown mirrors. `/<route>.md` and `/<route>.mdx` reach this handler
// through a rewrite in next.config.mjs (`/docs/cli.md` →
// `/markdown-mirror/md/docs/cli`); a direct request to this path is a 404.
// The landing has no source file: its mirror, `/index.md`, is llms.txt.

export const dynamic = 'force-static';
export const dynamicParams = false;

const formats = ['md', 'mdx'] as const;

/** `['docs', 'cli']` → `/docs/cli`; `['index']` → `/`. */
const routeOf = (segments: string[]) => (segments.join('/') === 'index' ? '/' : `/${segments.join('/')}`);

export function generateStaticParams() {
  const routes = ['/', ...contentPages().map((page) => page.route)];
  return formats.flatMap((format) =>
    routes.map((route) => ({ format, route: route === '/' ? ['index'] : route.slice(1).split('/') })),
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ format: string; route: string[] }> }) {
  const { format, route: segments } = await params;
  const route = routeOf(segments);
  const pages = contentPages();
  let body: string | undefined;
  if (route === '/') body = llmsIndex(pages);
  else {
    const page = pages.find((candidate) => candidate.route === route);
    if (page && (format === 'md' || format === 'mdx')) body = markdownMirror(format, readSource(page), exampleSource);
  }
  if (body === undefined) return new Response('Not Found', { status: 404 });
  return textResponse(body, 'text/markdown; charset=utf-8');
}
