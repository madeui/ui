import { textResponse } from '@/site/artifacts/load';
import { robots } from '@/site/artifacts/robots';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(robots(), 'text/plain; charset=utf-8');
}
