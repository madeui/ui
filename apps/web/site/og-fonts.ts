import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The OG cards' faces. They ship with the app (assets/fonts, SIL OFL): the
// build fetches nothing.
//
// They are loaded with kerning switched off. next/og places each word at the
// sum of its letters' plain advances but draws the word kerned, so every
// kerning pair inside a word widens the gap after it ("components  you").
// Without kerning both agree and every word gap is one space.

/** assets/fonts, from the app root (Next runs from apps/web). */
const FONT_DIR = path.resolve(process.cwd(), 'assets/fonts');

/** Card fonts: family names the card's style objects refer to. */
export const OG_FONT = { sans: 'Geist', mono: 'Geist Mono' } as const;

const face = async (file: string) => withoutKerning(await readFile(path.join(FONT_DIR, file)));

/**
 * The font with its GPOS `kern` feature renamed to an unregistered tag, so no
 * layout engine applies it. The outlines and advances are untouched.
 */
export function withoutKerning(font: Buffer): Buffer {
  const out = Buffer.from(font);
  const tables = out.readUInt16BE(4);
  for (let record = 12; record < 12 + tables * 16; record += 16) {
    if (out.toString('latin1', record, record + 4) !== 'GPOS') continue;
    const gpos = out.readUInt32BE(record + 8);
    const featureList = gpos + out.readUInt16BE(gpos + 6);
    const features = out.readUInt16BE(featureList);
    for (let feature = featureList + 2; feature < featureList + 2 + features * 6; feature += 6) {
      if (out.toString('latin1', feature, feature + 4) === 'kern') out.write('xern', feature, 'latin1');
    }
  }
  return out;
}

/** The `fonts` option of the cards' ImageResponse. */
export async function ogFonts() {
  const [regular, bold, mono] = await Promise.all([
    face('Geist-Regular.ttf'),
    face('Geist-Bold.ttf'),
    face('GeistMono-Regular.ttf'),
  ]);
  const normal = 'normal' as const;
  return [
    { name: OG_FONT.sans, data: regular, weight: 400 as const, style: normal },
    { name: OG_FONT.sans, data: bold, weight: 700 as const, style: normal },
    { name: OG_FONT.mono, data: mono, weight: 400 as const, style: normal },
  ];
}
