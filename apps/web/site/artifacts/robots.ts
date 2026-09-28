import { absoluteUrl } from './site.ts';

/**
 * `/robots.txt`: every crawler allowed, the Content-Signal usage
 * declaration (search, AI input and AI training all allowed), the sitemap.
 */
export function robots(): string {
  return [
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    'Allow: /',
    '',
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    '',
  ].join('\n');
}
