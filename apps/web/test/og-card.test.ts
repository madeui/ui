import fs from 'node:fs';
import path from 'node:path';

import { isValidElement, type ReactNode } from 'react';
import { expect, test } from 'vitest';

import { OgCardImage } from '../components/site/og-card.tsx';
import { ogPalette } from '../components/site/og-palette.ts';

// The card draws the brand marks from their files: the lockup top left and
// the glyph at scale on the right, both in ink, geometry untouched.

const brand = (file: string) =>
  fs.readFileSync(path.resolve(import.meta.dirname, '../../docs/public/brand', file), 'utf8');

/** Every <img> source in the card, SVG data URIs decoded. */
function imageSources(node: ReactNode): string[] {
  if (Array.isArray(node)) return node.flatMap(imageSources);
  if (!isValidElement<{ src?: string; children?: ReactNode }>(node)) return [];
  const { src, children } = node.props;
  const own =
    node.type === 'img' && src?.startsWith('data:image/svg+xml;base64,')
      ? [Buffer.from(src.slice('data:image/svg+xml;base64,'.length), 'base64').toString('utf8')]
      : [];
  return [...own, ...imageSources(children)];
}

test('the glyph and the lockup are the brand files, drawn in ink', () => {
  const inked = (svg: string) => svg.replaceAll('currentColor', ogPalette.foreground);
  const card = OgCardImage({
    card: { title: 'Button', description: 'Displays a button.', url: 'madeui.com/docs/components/button' },
    lockup: brand('lockup.svg'),
    glyph: brand('glyph.svg'),
  });
  const images = imageSources(card);
  expect(images).toContain(inked(brand('glyph.svg')));
  expect(images).toContain(inked(brand('lockup.svg')));
  expect(images.join('\n')).not.toContain(`fill="${ogPalette.muted}"`);
});
