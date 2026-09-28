// Copies the generated registry JSON (packages/registry/public/r, built by
// `pnpm build:registry`) into public/r, where the site serves it as /r/*.json.
// Byte for byte: the madeui CLI and other registry tools fetch these files.
// Runs before `next dev` and `next build` (the build regenerates the JSON
// first); public/r is gitignored.
import fs from 'node:fs';
import path from 'node:path';

const app = path.resolve(import.meta.dirname, '..');
const from = path.resolve(app, '../../packages/registry/public/r');
const to = path.join(app, 'public/r');

if (!fs.existsSync(from)) {
  console.error(`copy-registry: ${from} not found; run \`pnpm build:registry\` first.`);
  process.exit(1);
}
fs.rmSync(to, { recursive: true, force: true });
fs.cpSync(from, to, { recursive: true });
const count = fs.readdirSync(to).filter((file) => file.endsWith('.json')).length;
console.log(`copy-registry: ${count} files → public/r`);
