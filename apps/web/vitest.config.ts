import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The site's `@/` import paths (tsconfig paths), for tests that load its components.
  resolve: {
    alias: {
      '@/site': `${import.meta.dirname}/site`,
      '@/components/site': `${import.meta.dirname}/components/site`,
    },
  },
  test: {
    include: ['test/**/*.test.ts'],
  },
});
