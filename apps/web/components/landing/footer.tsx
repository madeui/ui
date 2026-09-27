import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { brand, landing, tracking } from '@/components/landing/landing.stylex';
import { Rule } from '@/components/landing/rule';
import { Lockup, Mark } from '@/components/site/lockup';
import { breakpoint, duration, fontSize, fontWeight, lineHeight, space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Components', href: '/docs/components/accordion' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'CLI', href: '/docs/cli' },
      { label: 'Customization', href: '/docs/customization' },
      { label: 'Dark mode', href: '/docs/dark-mode' },
      { label: 'For agents', href: '/docs/agents' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: 'https://github.com/madeui/ui', external: true },
      { label: 'npm', href: 'https://www.npmjs.com/package/@madeui/cli', external: true },
      // The X account does not exist yet; add it here once it is live.
    ],
  },
];

export function Footer() {
  return (
    <footer {...stylex.props(styles.footer)}>
      <Rule />
      <div {...stylex.props(styles.top)}>
        <div {...stylex.props(styles.brand)}>
          <Link href="/" aria-label="madeui home" {...stylex.props(styles.lockup)}>
            <Lockup style={styles.lockupSize} />
          </Link>
          <p {...stylex.props(styles.tagline)}>Components, made yours.</p>
          <p {...stylex.props(styles.blurb)}>
            Base UI components you own, styled with compile-time StyleX tokens. Open source, MIT licensed.
          </p>
        </div>
        <nav aria-label="Footer" {...stylex.props(styles.columns)}>
          {columns.map((col) => (
            <div key={col.title} {...stylex.props(styles.column)}>
              <h3 {...stylex.props(styles.columnTitle)}>{col.title}</h3>
              <ul {...stylex.props(styles.links)}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} rel="noreferrer" target="_blank" {...stylex.props(styles.link)}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} {...stylex.props(styles.link)}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div {...stylex.props(styles.bottom)}>
        <span {...stylex.props(styles.legal)}>MIT © {new Date().getFullYear()} madeui</span>
        <span {...stylex.props(styles.legal)}>Built on Base UI and StyleX.</span>
      </div>
      {/* The bare mark signs the page off: bottom-right, in the border tone. */}
      <span aria-hidden {...stylex.props(styles.mark)}>
        <Mark style={styles.markSize} />
      </span>
    </footer>
  );
}

const HOVER = '@media (hover: hover) and (pointer: fine)' as const;

const styles = stylex.create({
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s12,
    marginTop: space.s16,
    paddingBottom: space.s10,
    position: 'relative',
  },
  top: {
    display: 'grid',
    gap: { default: space.s10, [breakpoint.lg]: space.s12 },
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoint.lg]: 'minmax(0, 1.4fr) minmax(0, 2fr)',
    },
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    maxWidth: landing.brandMeasure,
  },
  lockup: {
    color: colors.foreground,
    display: 'inline-flex',
    marginBottom: space.s2,
    textDecoration: 'none',
    width: 'fit-content',
  },
  lockupSize: {
    height: brand.footerLockup,
  },
  tagline: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    letterSpacing: tracking.tagline,
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  blurb: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
  },
  columns: {
    display: 'grid',
    gap: space.s8,
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      [breakpoint.sm]: 'repeat(3, minmax(0, 1fr))',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  columnTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 'normal',
    margin: 0,
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s25,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
    },
    fontSize: fontSize.sm,
    textDecoration: 'none',
    textUnderlineOffset: space.s1,
    transitionDuration: duration.fast,
    transitionProperty: 'color',
  },
  bottom: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s6,
  },
  legal: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
  mark: {
    bottom: space.s10,
    color: colors.border,
    display: { default: 'none', [breakpoint.sm]: 'inline-flex' },
    insetInlineEnd: 0,
    position: 'absolute',
  },
  markSize: {
    height: brand.signature,
  },
});
