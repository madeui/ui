import './globals.css';

import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { colorScheme, page } from '@/lib/themes';

export const metadata: Metadata = {
  title: 'madeui',
  description: 'Base UI + StyleX components you own. Agent-friendly by design.',
};

// The page styles init applies: colorScheme on <html> picks a side of every
// light-dark() token (portaled popups inherit it), page on <body> gives the
// page colors.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" {...stylex.props(colorScheme)}>
      <body {...stylex.props(page)}>{children}</body>
    </html>
  );
}
