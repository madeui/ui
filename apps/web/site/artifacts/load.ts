import fs from 'node:fs';
import path from 'node:path';

import { contentPages } from '../content.ts';
import { resolveExample } from '../examples.ts';
import type { ContentPage } from '../routes.ts';
import type { PageSource } from './llms.ts';
import type { ResolveExample } from './markdown.ts';

// The one impure step in front of the text-artifact generators: read every
// content page's raw .mdx and look up Example sources on disk. The route
// handlers call these; the generators themselves only see strings.

/** content/, from the app root (Next runs from apps/web). */
const CONTENT_DIR = path.resolve(process.cwd(), 'content');

/** A content page's source file, verbatim. */
export const readSource = (page: ContentPage): string => fs.readFileSync(path.join(CONTENT_DIR, page.file), 'utf8');

/** Every content page with its source. */
export function pageSources(): PageSource[] {
  return contentPages().map((page) => ({ page, source: readSource(page) }));
}

/** `<Component path>` → the Example's language and raw source. */
export const exampleSource: ResolveExample = (examplePath) => {
  const example = resolveExample(examplePath);
  return example && { lang: example.lang, source: example.source };
};

/** A text response with an explicit Content-Type, plus any extra headers. */
export const textResponse = (body: string, contentType: string, headers: Record<string, string> = {}) =>
  new Response(body, { headers: { 'Content-Type': contentType, ...headers } });
