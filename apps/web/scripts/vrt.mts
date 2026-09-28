// Local visual regression over the Showcase: builds the site with SHOWCASE=1
// (into .next-vrt), serves it with `next start`, screenshots every Showcase
// section in light and dark at 1280px, and compares each shot with its
// baseline in .vrt/baseline.
//
//   pnpm vrt          # exit 1 on any differing, missing or unstable shot
//   pnpm vrt:update   # write this run's shots as the new baselines
//
// Baselines depend on the machine that rendered them (fonts, GPU, OS), so
// they stay local and gitignored: record them on a known-good commit, then
// run `pnpm vrt` on your change. Diffs land in .vrt/output.
import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';

import pixelmatch from 'pixelmatch';
import { chromium, type BrowserContext, type Locator } from 'playwright';
import { PNG } from 'pngjs';

// Examples whose pixels change between two runs of the same build, with why.
// MASK covers the Example's preview with a solid box (its frame and the
// layout around it are still compared); SKIP leaves a whole section out.
// Keep both short, and never put VRT code in an Example file.
const MASK: Record<string, string> = {
  'carousel-autoplay': 'advances to the next slide on a timer',
};
const SKIP: Record<string, string> = {};

const WIDTH = 1280;
const HEIGHT = 800;
// Date-based Examples (calendar, date picker) render this day, not today.
const CLOCK = new Date('2026-01-15T12:00:00Z');
const SCHEMES = ['light', 'dark'] as const;

const app = path.resolve(import.meta.dirname, '..');
const vrtDir = path.join(app, '.vrt');
const baselineDir = path.join(vrtDir, 'baseline');
const outputDir = path.join(vrtDir, 'output');
const update = process.argv.includes('--update');
const env = { ...process.env, SHOWCASE: '1' };

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: app, env, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`))));
  });
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer().listen(0, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

async function waitFor(url: string, server: ChildProcess): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (server.exitCode !== null) throw new Error(`next start exited ${server.exitCode}`);
    const status = await fetch(url).then((response) => response.status, () => 0);
    if (status === 200) return;
    if (status !== 0) throw new Error(`${url} answered ${status}; is the Showcase page built?`);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`${url} did not answer`);
}

// External images (avatars, photos) become one fixed placeholder, so a shot
// never depends on the network; other external requests fail.
const placeholder = (() => {
  const png = new PNG({ width: 64, height: 64 });
  png.data.fill(160);
  return PNG.sync.write(png);
})();

async function isolate(context: BrowserContext, origin: string): Promise<void> {
  await context.route(
    (url) => url.origin !== origin,
    (route) =>
      route.request().resourceType() === 'image'
        ? route.fulfill({ contentType: 'image/png', body: placeholder })
        : route.abort(),
  );
}

/** A shot of the section once two consecutive shots agree (late layout, fonts, JS animation). */
async function stableShot(section: Locator, mask: Locator[]): Promise<Buffer | undefined> {
  let previous: Buffer | undefined;
  for (let attempt = 0; attempt < 10; attempt++) {
    const shot = await section.screenshot({ animations: 'disabled', caret: 'hide', mask, scale: 'css' });
    if (previous?.equals(shot)) return shot;
    previous = shot;
    await section.page().waitForTimeout(100);
  }
  return undefined;
}

/** Mismatched pixels between a baseline and a shot, or undefined when their sizes differ. */
function diff(name: string, baseline: Buffer, shot: Buffer): number | undefined {
  const expected = PNG.sync.read(baseline);
  const actual = PNG.sync.read(shot);
  if (expected.width !== actual.width || expected.height !== actual.height) return undefined;
  const out = new PNG({ width: actual.width, height: actual.height });
  const mismatched = pixelmatch(expected.data, actual.data, out.data, actual.width, actual.height);
  if (mismatched > 0) fs.writeFileSync(path.join(outputDir, `${name}.diff.png`), PNG.sync.write(out));
  return mismatched;
}

await run('pnpm', ['run', 'build']);

const port = await freePort();
const origin = `http://localhost:${port}`;
const server = spawn(path.join(app, 'node_modules/.bin/next'), ['start', '-p', String(port)], {
  cwd: app,
  env,
  stdio: ['ignore', 'ignore', 'inherit'],
});

const failures: string[] = [];
const shots = new Set<string>();
try {
  await waitFor(`${origin}/showcase`, server);
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  if (update) fs.rmSync(baselineDir, { recursive: true, force: true });
  fs.mkdirSync(baselineDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    for (const scheme of SCHEMES) {
      const context = await browser.newContext({
        viewport: { width: WIDTH, height: HEIGHT },
        deviceScaleFactor: 1,
        colorScheme: scheme,
        reducedMotion: 'reduce',
        locale: 'en-US',
        timezoneId: 'UTC',
      });
      await isolate(context, origin);
      const page = await context.newPage();
      await page.clock.setFixedTime(CLOCK);
      await page.goto(`${origin}/showcase`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      const sections = await page
        .locator('[data-showcase]')
        .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.showcase!));
      for (const section of sections) {
        if (section in SKIP) continue;
        const name = `${section}.${scheme}`;
        shots.add(name);
        const locator = page.locator(`[data-showcase="${section}"]`);
        const mask = Object.keys(MASK)
          .filter((example) => example.startsWith(`${section}-`))
          .map((example) => locator.locator(`[data-example="${example}"] > div`));
        const shot = await stableShot(locator, mask);
        if (!shot) {
          failures.push(`${name}: unstable (no two consecutive shots agree); mask the Example that moves`);
          continue;
        }
        const baselineFile = path.join(baselineDir, `${name}.png`);
        if (update) {
          fs.writeFileSync(baselineFile, shot);
          continue;
        }
        if (!fs.existsSync(baselineFile)) {
          failures.push(`${name}: no baseline (run pnpm vrt:update)`);
          continue;
        }
        const mismatched = diff(name, fs.readFileSync(baselineFile), shot);
        if (mismatched === 0) continue;
        fs.writeFileSync(path.join(outputDir, `${name}.png`), shot);
        failures.push(mismatched === undefined ? `${name}: size changed` : `${name}: ${mismatched} pixels differ`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (!update) {
    for (const file of fs.readdirSync(baselineDir)) {
      const name = file.replace(/\.png$/u, '');
      if (!shots.has(name)) failures.push(`${name}: baseline has no shot in this run (section removed or skipped?)`);
    }
  }
} finally {
  server.kill();
}

const skipped = Object.keys(SKIP).length;
const masked = Object.keys(MASK).length;
const summary = `${shots.size} shots (${SCHEMES.length} schemes; ${skipped} sections skipped, ${masked} Examples masked)`;
if (update) {
  console.log(`vrt: ${summary} written to .vrt/baseline`);
  if (failures.length > 0) console.log(failures.map((failure) => `  ${failure}`).join('\n'));
} else if (failures.length === 0) {
  console.log(`vrt: ${summary}, 0 diffs`);
} else {
  console.log(`vrt: ${summary}, ${failures.length} diffs (see .vrt/output)`);
  console.log(failures.map((failure) => `  ${failure}`).join('\n'));
}
process.exitCode = failures.length > 0 ? 1 : 0;
