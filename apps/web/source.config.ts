import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { defineCollections, defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import remarkSmartypants from 'remark-smartypants';
import { z } from 'zod';

import { codeThemes, transformerLanguage } from './site/shiki.ts';

// Content lives in content/ (docs pages, changelog entries); paths are
// relative to this app (next dev/build and fumadocs-mdx run from apps/web).
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      sidebar: z
        .object({
          order: z.number().optional(),
          badge: z.string().optional(),
        })
        .optional(),
    }),
  },
});

export const changelog = defineCollections({
  type: 'doc',
  dir: 'content/changelog',
  schema: frontmatterSchema.extend({
    type: z.literal('changelog'),
    date: z.coerce.date(),
    changelog: z
      .object({
        version: z.string().optional(),
        category: z.string().optional(),
      })
      .optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // Typographic quotes, dashes and ellipses in prose, as the pages have
    // always rendered them. The Markdown mirrors keep the source characters.
    remarkPlugins: [remarkSmartypants],
    rehypeCodeOptions: {
      ...codeThemes,
      // The label comes from data-language; no language icon.
      icon: false,
      transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), transformerLanguage],
    },
    // The content has no `npm` fences or `tab` metas: keep the output plain.
    remarkNpmOptions: false,
    remarkCodeTabOptions: false,
  },
});
