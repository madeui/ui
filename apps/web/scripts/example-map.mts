// Writes the Example map (site/examples.generated.tsx, gitignored) from the
// registry's examples folder.
//
//   node scripts/example-map.mts                    # once (predev, prebuild, typecheck)
//   node scripts/example-map.mts --watch next dev   # rewrite on add/remove while the command runs
//
// The file is only rewritten when the set of Examples changes: edits to an
// Example reach the page through Turbopack's own HMR.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const app = path.resolve(import.meta.dirname, '..');
// The resolver finds the examples folder from the app root.
process.chdir(app);
const { renderExampleMap } = await import('../site/example-map.ts');
const { EXAMPLES_DIR, listExamples } = await import('../site/examples.ts');

const out = path.join(app, 'site/examples.generated.tsx');

function write(): void {
  const paths = listExamples(EXAMPLES_DIR);
  const source = renderExampleMap(paths);
  if (fs.existsSync(out) && fs.readFileSync(out, 'utf8') === source) return;
  fs.writeFileSync(out, source);
  console.log(`example-map: ${paths.length} Examples → site/examples.generated.tsx`);
}

write();

const watchAt = process.argv.indexOf('--watch');
if (watchAt !== -1) {
  let timer: NodeJS.Timeout | undefined;
  const watcher = fs.watch(EXAMPLES_DIR, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(write, 50);
  });

  // The command after --watch runs as a child; the watcher lives as long as it.
  const [command, ...args] = process.argv.slice(watchAt + 1);
  if (command !== undefined) {
    const child = spawn(command, args, { cwd: app, stdio: 'inherit', shell: process.platform === 'win32' });
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.on(signal, () => child.kill(signal));
    }
    child.on('exit', (code, signal) => {
      watcher.close();
      process.exitCode = code ?? (signal ? 1 : 0);
    });
  }
}
