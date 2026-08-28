// Visual regression for the playground showcase: captures the full page in
// light and dark mode and compares against committed baselines.
//
//   npm run vrt          — compare against vrt/baseline/*.png (exit 1 on diff)
//   npm run vrt:update   — rewrite the baselines
//
// Baselines are rendering-environment-specific (fonts, GPU): keep them per
// machine/OS. CI runs build + typecheck + registry-diff instead.
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const baselineDir = join(root, 'vrt', 'baseline');
const outputDir = join(root, 'vrt', 'output');
const update = process.argv.includes('--update');
const PORT = 3311;
// Anti-aliasing and subpixel text vary run to run; tolerate a small drift.
const MAX_DIFF_RATIO = 0.001;

const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('playground server did not start');
}

async function capture(page, theme) {
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle' });
  if (theme === 'dark') {
    await page.getByRole('button', { name: 'Dark mode' }).click();
  }
  // Let theme swap + entry transitions settle.
  await page.waitForTimeout(700);
  return page.screenshot({ fullPage: true, animations: 'disabled' });
}

async function compare(name, actualBuffer) {
  const baselinePath = join(baselineDir, `${name}.png`);
  const exists = await access(baselinePath)
    .then(() => true)
    .catch(() => false);

  if (update || !exists) {
    await writeFile(baselinePath, actualBuffer);
    console.log(`  ${exists ? 'updated' : 'created'} baseline: ${name}.png`);
    return true;
  }

  const expected = PNG.sync.read(await readFile(baselinePath));
  const actual = PNG.sync.read(actualBuffer);
  if (expected.width !== actual.width || expected.height !== actual.height) {
    await writeFile(join(outputDir, `${name}.actual.png`), actualBuffer);
    console.error(
      `  ✘ ${name}: size changed ${expected.width}x${expected.height} → ${actual.width}x${actual.height}`
    );
    return false;
  }

  const diff = new PNG({ width: expected.width, height: expected.height });
  const mismatched = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: 0.2 }
  );
  const ratio = mismatched / (expected.width * expected.height);
  if (ratio > MAX_DIFF_RATIO) {
    await writeFile(join(outputDir, `${name}.actual.png`), actualBuffer);
    await writeFile(
      join(outputDir, `${name}.diff.png`),
      PNG.sync.write(diff)
    );
    console.error(
      `  ✘ ${name}: ${mismatched} pixels differ (${(ratio * 100).toFixed(3)}%) — see vrt/output/${name}.diff.png`
    );
    return false;
  }
  console.log(`  ✔ ${name} (${mismatched} px within tolerance)`);
  return true;
}

try {
  await mkdir(baselineDir, { recursive: true });
  await mkdir(outputDir, { recursive: true });
  await waitForServer();

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });

  let ok = true;
  for (const theme of ['light', 'dark']) {
    const shot = await capture(page, theme);
    ok = (await compare(theme, shot)) && ok;
  }

  await browser.close();
  process.exitCode = ok ? 0 : 1;
} finally {
  server.kill();
}
