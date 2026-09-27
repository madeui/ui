import { textResponse } from '@/site/artifacts/load';
import { rssFeed } from '@/site/artifacts/rss';
import { contentPages } from '@/site/content';

export const dynamic = 'force-static';

export function GET() {
  const entries = contentPages().filter((page) => page.file.startsWith('changelog/'));
  return textResponse(rssFeed(entries), 'application/xml');
}
