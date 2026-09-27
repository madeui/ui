import './globals.css';

import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { themeScript } from '@/components/site/theme-script';
import { colorScheme, page } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'madeui',
  description: 'Base UI + StyleX components you own. Agent-friendly by design.',
};

// Geist on <html>, so every component (and every portaled popup) inherits
// it; Geist Mono as a variable for code (site.stylex.ts `font.mono`).
const sans = Geist({ subsets: ['latin'] });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

// The page styles init applies: colorScheme on <html> picks a side of every
// light-dark() token (portaled popups inherit it), page on <body> gives the
// page colors. The pre-paint script restores a stored theme onto
// <html data-theme> before first paint; the attribute it adds is why <html>
// suppresses the hydration warning.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.className} ${mono.variable} ${stylex.props(colorScheme).className}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body {...stylex.props(page)}>{children}</body>
    </html>
  );
}
