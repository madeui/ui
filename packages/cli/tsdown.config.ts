import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'node',
  target: 'node22.12',
  outDir: 'dist',
  // Read at runtime next to the bundle (init's browser reset). It stays in
  // src/ because the docs link to it there.
  copy: ['src/reset.css'],
});
