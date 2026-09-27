import { svgFiles, svgResponse } from '@/site/brand-assets';

// /brand/{glyph,lockup,wordmark}.svg, served from apps/docs/public/brand
// (site/brand-assets.ts). Any other name is a 404.

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return svgFiles('brand').map((file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  return svgResponse(`brand/${file}`);
}
