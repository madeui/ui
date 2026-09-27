import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';

import { changelog, docs } from '../.source/server.ts';

// fumadocs-core used headless: page lookup, static params, ToC and
// structured data. Navigation order is ours (routes.ts), not fumadocs' tree.
export const docsSource = loader({ baseUrl: '/docs', source: docs.toFumadocsSource() });

export const changelogSource = loader({
  baseUrl: '/changelog',
  source: toFumadocsSource(changelog, []),
});
