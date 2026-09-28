// The OG card (1200x630), rendered to PNG at build time by next/og. next/og
// lays out with its own flexbox engine from inline style objects; it reads no
// CSS, so this file is the one place in the site that styles inline. Colors
// are the registry tokens (og-palette.ts), the faces are Geist and Geist Mono.
//
// Layout: the lockup and the page's address on top; the title (and a line of
// description) on the left; the foot carries the command that installs the
// page's component (or the entry's date). On the right, the brand glyph at
// scale: three placed squares in the muted tone and the dashed piece that
// snaps into its slot in ink, over the landing's dot grid.

import type { OgCard } from '@/site/og';

import { ogPalette as c } from './og-palette';

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Card fonts: family names the style objects below refer to. */
export const OG_FONT = { sans: 'Geist', mono: 'Geist Mono' } as const;

const EDGE = 72;
const TEXT_WIDTH = 660;
const MOTIF = 340;
/** Display tracking, in em: the docs title's (prose.tracking); tighter closes up figures ("v1.1.0"). */
const TRACKING = -0.02;

/** Title size by length: short titles fill the column, long ones stay within three lines. */
function titleSize(title: string): number {
  if (title.length <= 16) return 104;
  if (title.length <= 28) return 84;
  if (title.length <= 44) return 68;
  return 60;
}

/** An SVG source as an <img> src: next/og takes images as data URIs. */
const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** The glyph's geometry (brand/glyph.svg), drawn large: placed squares muted, the snapping piece in ink. */
function glyphMotif(size: number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="6 -1.05 59.05 59.05" width="${size}" height="${size}">
<rect x="6" y="6" width="24" height="24" rx="7" fill="${c.muted}" stroke="${c.border}" stroke-width="0.25"/>
<rect x="6" y="34" width="24" height="24" rx="7" fill="${c.muted}" stroke="${c.border}" stroke-width="0.25"/>
<rect x="34" y="34" width="24" height="24" rx="7" fill="${c.muted}" stroke="${c.border}" stroke-width="0.25"/>
<rect x="38" y="2" width="24" height="24" rx="7" fill="none" stroke="${c.foreground}" stroke-width="1.5" stroke-dasharray="3 2.5" stroke-linecap="round" transform="rotate(8 50 14)"/>
</svg>`;
  return svgDataUri(svg);
}

/** The landing's dot grid, fading out from behind the glyph. */
function dotGrid() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_SIZE.width}" height="${OG_SIZE.height}">
<defs>
<pattern id="d" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.4" fill="${c.border}"/></pattern>
<radialGradient id="g" cx="0.77" cy="0.46" r="0.5"><stop offset="0.35" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
<mask id="m"><rect width="100%" height="100%" fill="url(#g)"/></mask>
</defs>
<rect width="100%" height="100%" fill="url(#d)" mask="url(#m)"/>
</svg>`;
  return svgDataUri(svg);
}

/** The lockup file with its currentColor set to ink. */
const inked = (svg: string) => svgDataUri(svg.replaceAll('currentColor', c.foreground));

export function OgCardImage({ card, lockup }: { card: OgCard; lockup: string }) {
  const size = titleSize(card.title);
  const title = clip(card.title, 80);
  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: c.background,
        color: c.foreground,
        fontFamily: OG_FONT.sans,
      }}
    >
      <img src={dotGrid()} width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: 'absolute', top: 0, left: 0 }} alt="" />
      <img src={glyphMotif(MOTIF)} width={MOTIF} height={MOTIF} style={{ position: 'absolute', right: EDGE - 8, top: (OG_SIZE.height - MOTIF) / 2 }} alt="" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: `${EDGE - 8}px ${EDGE}px ${EDGE - 16}px`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={inked(lockup)} height={40} width={Math.round((40 * 99) / 28)} alt="madeui" />
          <div style={{ display: 'flex', fontFamily: OG_FONT.mono, fontSize: 20, color: c.mutedForeground }}>{card.url}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: TEXT_WIDTH }}>
          {card.statement ? (
            <Statement text={title} />
          ) : (
            <div style={{ display: 'flex', fontSize: size, fontWeight: 700, letterSpacing: TRACKING * size, lineHeight: 1.04 }}>
              {title}
            </div>
          )}
          {card.description ? (
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                maxWidth: TEXT_WIDTH - 40,
                fontSize: 28,
                textWrap: 'balance',
                lineHeight: 1.4,
                color: c.mutedForeground,
              }}
            >
              {clip(card.description, 130)}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', height: 48 }}>
          {card.footer?.kind === 'command' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 48,
                padding: '0 22px',
                borderRadius: 999,
                border: `1px solid ${c.border}`,
                backgroundColor: c.muted,
                fontFamily: OG_FONT.mono,
                fontSize: 22,
              }}
            >
              <span style={{ color: c.mutedForeground, marginRight: 14 }}>$</span>
              {card.footer.text}
            </div>
          ) : card.footer ? (
            <div style={{ display: 'flex', fontFamily: OG_FONT.mono, fontSize: 22, color: c.mutedForeground }}>{card.footer.text}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * The landing headline, broken after its comma as the hero sets it, with the
 * brand's square period after the last word.
 */
function Statement({ text }: { text: string }) {
  const size = 76;
  const lines = text.split(/(?<=,) /u);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: size, fontWeight: 700, letterSpacing: TRACKING * size, lineHeight: 1.04 }}>
      {lines.map((line, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'flex-end', whiteSpace: 'nowrap' }}>
          {line}
          {index === lines.length - 1 ? (
            <div
              style={{
                width: 0.12 * size,
                height: 0.12 * size,
                marginLeft: 0.01 * size,
                marginBottom: 0.2 * size,
                backgroundColor: c.foreground,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
