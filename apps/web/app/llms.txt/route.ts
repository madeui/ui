import { contentPages } from '@/site/content';
import { llmsIndex } from '@/site/artifacts/llms';
import { textResponse } from '@/site/artifacts/load';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(llmsIndex(contentPages()), 'text/plain; charset=utf-8');
}
