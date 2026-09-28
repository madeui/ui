import fs from 'node:fs';
import path from 'node:path';

// The brand SVGs (/icon.svg, /brand/*.svg) are Published URLs. They live in
// assets/ (not public/, so Next does not serve them itself) and are served
// from there byte for byte, with the headers they have always been served with.

/** assets/, from the app root (Next runs from apps/web). */
const ASSETS_DIR = path.resolve(process.cwd(), 'assets');

/** The SVG files in a folder of assets/ (`''` for its root). */
export const svgFiles = (folder: string): string[] =>
  fs.readdirSync(path.join(ASSETS_DIR, folder)).filter((file) => file.endsWith('.svg'));

/** One SVG's source (`brand/lockup.svg`), for the OG cards. */
export const svgSource = (file: string): string => fs.readFileSync(path.join(ASSETS_DIR, file), 'utf8');

/** One SVG, verbatim, as a static file response. */
export function svgResponse(file: string): Response {
  const body = fs.readFileSync(path.join(ASSETS_DIR, file));
  return new Response(new Uint8Array(body), {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Disposition': `inline; filename="${path.basename(file)}"`,
    },
  });
}
