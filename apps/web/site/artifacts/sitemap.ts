import { absoluteUrl } from './site.ts';
import { escapeXml } from './xml.ts';

/**
 * `/sitemap.xml`: one `<url><loc>` line per HTML page, no `<lastmod>`, the
 * lines in plain string order (so `/docs` sorts after every page under it).
 */
export function sitemap(routes: string[]): string {
  const lines = [...new Set(routes)].map((route) => `  <url><loc>${escapeXml(absoluteUrl(route))}</loc></url>`).sort();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.join('\n')}
</urlset>
`;
}
