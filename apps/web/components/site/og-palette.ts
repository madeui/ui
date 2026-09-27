// The OG card's colors: the light side of the registry color tokens
// (lib/tokens.stylex.ts), as sRGB hex. The card is rendered to PNG at build
// time by next/og, which reads neither CSS variables nor oklch(), so the
// values are written out here; test/og-palette.test.ts converts the tokens
// and fails when one drifts.
export const ogPalette = {
  /** colors.background */
  background: '#ffffff',
  /** colors.foreground */
  foreground: '#0a0a0a',
  /** colors.mutedForeground */
  mutedForeground: '#737373',
  /** colors.muted */
  muted: '#f5f5f5',
  /** colors.border */
  border: '#e5e5e5',
} as const;
