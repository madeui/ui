// Route inventory assertion: the route list the site builds from its content
// must name every page, the site must serve every Published URL in the
// committed list (published-urls.txt), and (with --ref) every Published URL
// the reference site serves, no more and no fewer.
//
//   node scripts/check-inventory.mts               # content files and published-urls.txt
//   node scripts/check-inventory.mts --write       # rewrite published-urls.txt from the site
//   node scripts/check-inventory.mts --ref <dir>   # also vs a reference URL list dir
//
// published-urls.txt holds one URL path per line, sorted: pages, Markdown
// mirrors, text artifacts, OG images, /r/*.json and the brand SVGs. A URL
// the site stops serving fails (links to it would break); a new one fails
// until the list is rewritten on purpose, except a changelog entry's: a new
// entry's URLs follow from its .mdx, so announcing stays one file.
//
// <dir> holds html.txt (sitemap URLs), markdown.txt, artifacts.txt and og.txt,
// one path per line, as the migration's parity harness derives them from a
// built site. A missing file is a failure, never a skip.
//
// Content is loaded through fumadocs-mdx's Node loader: the same collections
// the Next build uses.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { postInstall } from 'fumadocs-mdx/next';
import { register } from 'fumadocs-mdx/node';

const { values } = parseArgs({ options: { ref: { type: 'string' }, write: { type: 'boolean' } } });
const ref = values.ref === undefined ? undefined : path.resolve(values.ref);

// fumadocs-mdx and the content paths resolve from the app root.
process.chdir(path.resolve(import.meta.dirname, '..'));
await postInstall({});
register();
const { contentPages } = await import('../site/content.ts');
const { compareUrlList, publishedInventory, publishedUrls } = await import('../site/routes.ts');
const { svgFiles } = await import('../site/brand-assets.ts');

const pages = contentPages();
const inventory = publishedInventory(pages);
const failures: string[] = [];

function compare(label: string, actual: string[], expected: string[]) {
  const have = new Set(actual);
  const want = new Set(expected);
  const missing = [...want].filter((url) => !have.has(url)).sort();
  const extra = [...have].filter((url) => !want.has(url)).sort();
  const duplicates = actual.length - have.size;
  if (missing.length === 0 && extra.length === 0 && duplicates === 0) {
    console.log(`ok   ${label}: ${have.size}`);
    return;
  }
  failures.push(label);
  console.log(`FAIL ${label}: expected ${want.size}, got ${have.size}`);
  for (const url of missing) console.log(`  missing ${url}`);
  for (const url of extra) console.log(`  extra   ${url}`);
  if (duplicates > 0) console.log(`  ${duplicates} duplicate entries`);
}

// Every .mdx under the content root is one page, reached at its path
// without the extension (a folder's index.mdx at the folder).
const contentRoot = path.resolve('content');
const files = fs
  .readdirSync(contentRoot, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.mdx'))
  .map((file) => file.split(path.sep).join('/'));
compare(
  'content pages',
  pages.map((page) => page.file),
  files,
);

// Every Published URL, against the committed list.
const LIST = 'published-urls.txt';
const REWRITE = `pnpm --filter @madeui/web check:inventory --write`;
const urls = publishedUrls(pages, {
  registry: fs.readdirSync('../../packages/registry/public/r').filter((file) => file.endsWith('.json')),
  brand: svgFiles('brand'),
});
if (values.write) {
  fs.writeFileSync(LIST, `${urls.join('\n')}\n`);
  console.log(`wrote ${LIST}: ${urls.length}`);
}
if (fs.existsSync(LIST)) {
  const expected = fs.readFileSync(LIST, 'utf8').split('\n').filter(Boolean);
  const { missing, added, changelog } = compareUrlList(urls, expected, pages);
  if (missing.length === 0 && added.length === 0) {
    console.log(`ok   published URLs (${LIST}): ${urls.length}`);
  } else {
    failures.push(LIST);
    console.log(`FAIL published URLs (${LIST}): expected ${expected.length}, got ${urls.length}`);
    for (const url of missing) console.log(`  missing ${url}`);
    for (const url of added) console.log(`  added   ${url}`);
    if (missing.length > 0) console.log('  A missing URL breaks every link to it.');
    console.log(`  If the change is intended, run \`${REWRITE}\` and commit ${LIST}.`);
  }
  if (changelog.length > 0) console.log(`  (${changelog.length} URLs of new changelog entries, derived from their .mdx)`);
} else {
  failures.push(LIST);
  console.log(`FAIL ${LIST}: not found; \`${REWRITE}\` writes it.`);
}

if (ref !== undefined) {
  const read = (name: string) => {
    const file = path.join(ref, name);
    if (!fs.existsSync(file)) {
      failures.push(name);
      console.log(`FAIL ${name}: not found in ${ref}`);
      return [];
    }
    return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean);
  };
  compare('html (sitemap URLs)', inventory.html, read('html.txt'));
  compare('markdown mirrors', inventory.markdown, read('markdown.txt'));
  compare('text artifacts', inventory.artifacts, read('artifacts.txt'));
  compare('og images', inventory.og, read('og.txt'));
}

if (failures.length > 0) {
  console.log(`\nRoute inventory: ${failures.length} failing list(s).`);
  process.exit(1);
}
console.log('\nRoute inventory matches.');
