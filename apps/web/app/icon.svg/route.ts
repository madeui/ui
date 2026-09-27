import { svgResponse } from '@/site/brand-assets';

// The favicon, served from apps/docs/public (site/brand-assets.ts).

export const dynamic = 'force-static';

export function GET() {
  return svgResponse('icon.svg');
}
