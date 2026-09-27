import { llmsFull } from '@/site/artifacts/llms';
import { exampleSource, pageSources, textResponse } from '@/site/artifacts/load';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(llmsFull(pageSources(), exampleSource), 'text/plain; charset=utf-8');
}
