import type { ContentPage } from '../routes.ts';
import { absoluteUrl, changelogFeed, site } from './site.ts';
import { escapeXml } from './xml.ts';

/** Most items a feed carries. */
const LIMIT = 50;

function item(entry: ContentPage): string {
  const link = escapeXml(absoluteUrl(entry.route));
  const parts = [
    `    <title>${escapeXml(entry.title)}</title>`,
    `    <link>${link}</link>`,
    `    <guid isPermaLink="true">${link}</guid>`,
  ];
  if (entry.description) parts.push(`    <description>${escapeXml(entry.description)}</description>`);
  if (entry.date) parts.push(`    <pubDate>${entry.date.toUTCString()}</pubDate>`);
  return `  <item>\n${parts.join('\n')}\n  </item>`;
}

/**
 * `/changelog/rss.xml`: RSS 2.0 over the changelog entries, newest first.
 * The GUID is the entry URL, so feed readers never re-announce an entry.
 */
export function rssFeed(entries: ContentPage[]): string {
  const items = entries
    .toSorted((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, LIMIT)
    .map(item);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(changelogFeed.title)}</title>
  <link>${escapeXml(site.url)}</link>
  <description>${escapeXml(site.description)}</description>
  <atom:link href="${escapeXml(absoluteUrl(changelogFeed.path))}" rel="self" type="application/rss+xml" />
${items.join('\n')}
</channel>
</rss>
`;
}
