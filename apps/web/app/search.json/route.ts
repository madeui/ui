import { pageSources } from '@/site/artifacts/load';
import { checkSearchIndex, searchIndex } from '@/site/search-index';

// Static: built once by `next build` (and on request in dev), fetched by the
// search dialog on its first open and by the WebMCP search tool.
export const dynamic = 'force-static';

export function GET() {
  const sources = pageSources();
  const index = searchIndex(sources);
  const problems = checkSearchIndex(
    index,
    sources.map((entry) => entry.page),
  );
  // Thrown during prerendering, this fails the build.
  if (problems.length > 0) throw new Error(`Search index check failed:\n- ${problems.join('\n- ')}`);
  return Response.json(index);
}
