// JS budget of the built pages: the brotli size of every script a page's
// prerendered HTML loads (script tags, preloads and the chunks its RSC data
// names, which include the Examples it renders). Run after `next build`.
//
//   node scripts/check-js-budget.mts /docs=152 /docs/components/button
//
// `route=KB` fails when the page's JS exceeds KB (KiB of brotli, quality 11);
// a bare route is only reported. The /docs ceiling catches a static Example
// import: all docs pages share one route, so one static import puts every
// Example on every page.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const next = path.resolve(import.meta.dirname, '../.next');
const CHUNK = /\/_next\/(static\/[^"'\\\s]+?\.js)\b|["'](static\/chunks\/[^"'\\\s]+?\.js)["']/gu;

const brotli = (buffer: Buffer) =>
  zlib.brotliCompressSync(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;

const sizes = new Map<string, number>();
function sizeOf(chunk: string): number {
  let size = sizes.get(chunk);
  if (size === undefined) {
    size = brotli(fs.readFileSync(path.join(next, chunk)));
    sizes.set(chunk, size);
  }
  return size;
}

/** The chunks a prerendered page loads, from its HTML. */
function chunksOf(route: string): string[] {
  const file = path.join(next, 'server/app', `${route === '/' ? 'index' : route}.html`);
  if (!fs.existsSync(file)) throw new Error(`${route}: no prerendered HTML at ${path.relative(process.cwd(), file)}`);
  const html = fs.readFileSync(file, 'utf8');
  // Legacy polyfills: browsers that run modules skip them.
  const noModule = new Set(
    [...html.matchAll(/<script[^>]*\bsrc="\/_next\/([^"]+)"[^>]*\bnoModule\b[^>]*>/gu)].map((match) => match[1]!),
  );
  const chunks = [...html.matchAll(CHUNK)].map((match) => (match[1] ?? match[2])!);
  return [...new Set(chunks)].filter((chunk) => !noModule.has(chunk)).sort();
}

const kb = (bytes: number) => (bytes / 1024).toFixed(1);
let failed = false;
for (const argument of process.argv.slice(2)) {
  const [route, limit] = argument.split('=') as [string, string | undefined];
  const chunks = chunksOf(route);
  const total = chunks.reduce((sum, chunk) => sum + sizeOf(chunk), 0);
  const ceiling = limit === undefined ? undefined : Number(limit) * 1024;
  const over = ceiling !== undefined && total > ceiling;
  failed ||= over;
  const verdict = ceiling === undefined ? 'info' : over ? 'FAIL' : 'ok  ';
  const budget = limit === undefined ? '' : ` (budget ${limit} KB)`;
  console.log(`${verdict} ${route}: ${kb(total)} KB JS brotli, ${chunks.length} files${budget}`);
}
if (failed) {
  console.log('\nJS budget exceeded. A static import of an Example (or of the Example map) is the usual cause.');
  process.exit(1);
}
