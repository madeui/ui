import './globals.css';

import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Analytics } from '@/components/site/analytics';
import { themeScript } from '@/components/site/theme-script';
import { colorScheme, page } from '@/lib/themes';
import { site } from '@/site/artifacts/site';

// Defaults every page overrides through site/head.ts; the icon is shared.
export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: { icon: { url: '/icon.svg', type: 'image/svg+xml' } },
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
      dir="ltr"
      suppressHydrationWarning
      className={`${sans.className} ${mono.variable} ${stylex.props(colorScheme).className}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Vercel Analytics: page views, and the feedback event (feedback.tsx). */}
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
      </head>
      <body {...stylex.props(page)}>{children}</body>
    </html>
  );
}
