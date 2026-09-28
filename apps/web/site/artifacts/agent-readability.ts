import { absoluteUrl, changelogFeed, site } from './site.ts';

/**
 * `/agent-readability.json`: where an agent finds the machine-readable
 * versions of the site, and how the content may be used. Key order is part
 * of the published bytes.
 */
export function agentReadability(): string {
  const document = {
    artifacts: {
      // A page URL requested with `Accept: text/markdown` serves the same
      // mirror (the negotiation rewrites in next.config.mjs).
      markdown: { contentNegotiation: 'text/markdown', pattern: `${site.url}/{route}.md` },
      llmsFullTxt: absoluteUrl('/llms-full.txt'),
      llmsTxt: absoluteUrl('/llms.txt'),
      sitemap: absoluteUrl('/sitemap.xml'),
      feeds: [absoluteUrl(changelogFeed.path)],
    },
    description: site.description,
    name: site.name,
    site: site.url,
    contentUsage: { search: true, 'ai-input': true, 'ai-train': true },
  };
  return `${JSON.stringify(document, null, 2)}\n`;
}
