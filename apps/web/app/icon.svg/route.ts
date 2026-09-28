import { svgResponse } from '@/site/brand-assets';

// The favicon, served from assets/icon.svg (site/brand-assets.ts).

export const dynamic = 'force-static';

export function GET() {
  return svgResponse('icon.svg');
}
