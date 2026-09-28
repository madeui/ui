import { ImageResponse } from 'next/og';
import { PNG } from 'pngjs';
import { createElement } from 'react';
import { expect, test } from 'vitest';

import { OG_FONT, ogFonts } from '../site/og-fonts.ts';

// next/og places each word at the sum of its letters' plain advances but
// draws the word kerned, so a word with kerning pairs leaves a wider gap
// after it ("components  you"). Joined by no-break spaces, the same words are
// one run that next/og lays out kerned throughout: the card's fonts must set
// both alike, so a line break opportunity never moves a word.

const WIDTH = 2000;

/** The right edge of the ink of one line of dark text on white. */
async function inkEnd(text: string, fontWeight: 400 | 700): Promise<number> {
  const response = new ImageResponse(
    createElement(
      'div',
      {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: 20,
          backgroundColor: '#fff',
          color: '#000',
          fontFamily: OG_FONT.sans,
          fontWeight,
          fontSize: 56,
          whiteSpace: 'nowrap',
        },
      },
      text,
    ),
    { width: WIDTH, height: 120, fonts: await ogFonts() },
  );
  const png = PNG.sync.read(Buffer.from(await response.arrayBuffer()));
  for (let x = png.width - 1; x >= 0; x--) {
    for (let y = 0; y < png.height; y++) if (png.data[(y * png.width + x) * 4]! < 128) return x;
  }
  throw new Error('no ink');
}

test.each([
  ['Base UI + StyleX components you own. Agent-friendly by design.', 400],
  ['Dark mode in the tokens, page styles from init', 700],
] as const)('word gaps are one space: "%s" (weight %d)', async (text, weight) => {
  const spaced = await inkEnd(text, weight);
  expect(spaced).toBeLessThan(WIDTH - 40);
  expect(spaced).toBe(await inkEnd(text.replaceAll(' ', ' '), weight));
});
