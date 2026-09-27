import { textResponse } from '@/site/artifacts/load';
import { sitemap } from '@/site/artifacts/sitemap';
import { contentPages } from '@/site/content';
import { pageRoutes } from '@/site/routes';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(sitemap(pageRoutes(contentPages())), 'application/xml');
}
