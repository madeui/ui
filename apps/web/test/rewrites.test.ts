import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { getPathMatch } from 'next/dist/shared/lib/router/utils/path-match';
import { describe, expect, test } from 'vitest';

import config from '../next.config.mjs';

type Rewrite = { source: string; destination: string; has?: unknown[] };

const app = path.join(import.meta.dirname, '..', 'app');
const beforeFiles = async () => ((await config.rewrites!()) as { beforeFiles: Rewrite[] }).beforeFiles;
const matches = (rule: Rewrite, pathname: string) => getPathMatch(rule.source, { strict: true })(pathname) !== false;

describe('the internal Markdown mirror path', () => {
  test('a direct request is rewritten before any other rule', async () => {
    const [first] = await beforeFiles();
    for (const pathname of ['/markdown-mirror', '/markdown-mirror/md/docs/components/button', '/markdown-mirror/mdx/index'])
      expect(matches(first, pathname), pathname).toBe(true);
    for (const pathname of ['/docs/components/button.md', '/docs/components/button', '/markdown-mirror-notes'])
      expect(matches(first, pathname), pathname).toBe(false);
  });

  // Vercel serves a request that ends on a route (Next's own `/_not-found`
  // included) with that route's status, 200 for a prerendered page. Only a
  // request that matches nothing gets the 404 page with status 404, so the
  // destination must be a path no route, file or built-in serves.
  test('the destination matches no route, so the response is a real 404', async () => {
    const [first] = await beforeFiles();
    const segments = first.destination.split('/').filter(Boolean);
    expect(segments).toHaveLength(1);
    const [segment] = segments;
    // Next's built-in routes: `/_not-found`, `/_global-error`, `/_next/*`.
    expect(['_not-found', '_global-error', '_next']).not.toContain(segment);
    // A folder that starts with `_` is private in the app router: it can never become a route.
    expect(segment.startsWith('_')).toBe(true);
    // And nothing at the app root catches every path (a root `[slug]` or `[...slug]`).
    expect(readdirSync(app).filter((name) => name.startsWith('['))).toEqual([]);
    expect(existsSync(path.join(import.meta.dirname, '..', 'public', segment))).toBe(false);
  });
});
