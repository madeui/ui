import { defineCollections, defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Content stays in apps/docs/content until the cutover moves it; paths are
// relative to this app (next dev/build and fumadocs-mdx run from apps/web).
export const docs = defineDocs({
  dir: '../docs/content/docs',
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
  dir: '../docs/content/changelog',
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

export default defineConfig();
