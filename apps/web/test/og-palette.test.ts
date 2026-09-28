import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';

import { ogPalette } from '../components/site/og-palette.ts';

// The OG card cannot read the tokens at render time; this keeps its colors
// equal to the light side of the registry's light-dark() pairs.

const tokens = fs.readFileSync(path.resolve(import.meta.dirname, '../../../packages/registry/src/lib/tokens.stylex.ts'), 'utf8');

/** The light side of a color token: `oklch(L C H)`. */
function lightSide(name: string): [number, number, number] {
  const match = new RegExp(`\\b${name}: 'light-dark\\(oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)\\)`, 'u').exec(tokens);
  if (!match) throw new Error(`token ${name} not found`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** OKLCH → sRGB hex (Björn Ottosson's OKLab matrices). */
function oklchToHex([l, c, h]: [number, number, number]): string {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return `#${linear
    .map((x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055))
    .map((x) => Math.round(Math.min(1, Math.max(0, x)) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

test.each(Object.keys(ogPalette))('%s is the registry token, light side', (name) => {
  expect(ogPalette[name as keyof typeof ogPalette]).toBe(oklchToHex(lightSide(name)));
});
