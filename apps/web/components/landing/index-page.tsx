import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';

import { CopyCommand } from '@/components/landing/copy-command';
import { Footer } from '@/components/landing/footer';
import { ArrowRightIcon, GitHubIcon } from '@/components/landing/icons';
import { display, landing, tracking } from '@/components/landing/landing.stylex';
import { Rule } from '@/components/landing/rule';
import Scenes from '@/components/landing/scenes/scenes';
import { SearchTrigger } from '@/components/landing/search-trigger';
import { layout } from '@/components/site/site.stylex';
import { Lockup } from '@/components/site/lockup';
import { ThemeToggle } from '@/components/site/theme-toggle';
import { breakpoint, duration, easing, fontSize, fontWeight, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

// The landing page. Geist, the brand face, is set on <html> by the root
// layout; registry components carry no font of their own and inherit it.
// The theme toggle and its stored choice are the docs' own.

const principles = [
  {
    title: 'Source you own',
    body: 'Components land in components/ui as plain TSX. Change anything; there is no package to fork and no override API to learn.',
  },
  {
    title: 'Tokens, not literals',
    body: 'Color, space, type, radius, and motion come from typed scales in lib/. Tokens are imports, not strings: a name that does not exist is a type error, and a rename reaches every use.',
  },
  {
    title: 'Base UI underneath',
    body: 'Focus, keyboard, and positioning from headless primitives. Every state is a data attribute you style in place.',
  },
];

export function IndexPage() {
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.wrap)}>
        <header {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.headerStart)}>
            <Link href="/" aria-label="madeui" {...stylex.props(styles.lockup)}>
              <Lockup style={styles.lockupSize} />
            </Link>
            <nav aria-label="Primary" {...stylex.props(styles.nav)}>
              <Link href="/docs" {...stylex.props(styles.navLink)}>
                Docs
              </Link>
              <Link href="/docs/components/accordion" {...stylex.props(styles.navLink, styles.navSecondary)}>
                Components
              </Link>
              <Link href="/changelog" {...stylex.props(styles.navLink, styles.navSecondary)}>
                Changelog
              </Link>
            </nav>
          </div>
          <div {...stylex.props(styles.headerEnd)}>
            <SearchTrigger />
            <a
              href="https://github.com/madeui/ui"
              aria-label="madeui on GitHub"
              rel="noreferrer"
              target="_blank"
              {...stylex.props(styles.iconLink)}
            >
              <GitHubIcon size={16} />
            </a>
            <ThemeToggle />
          </div>
        </header>

        <section {...stylex.props(styles.hero)}>
          <div aria-hidden {...stylex.props(styles.heroDots)} />
          <Link href="/changelog" {...stylex.props(styles.pill)}>
            <span {...stylex.props(styles.pillVersion)}>v1.1.0</span> Five new components
            <ArrowRightIcon size={12} />
          </Link>
          <h1 {...stylex.props(styles.h1)}>
            UI you own, down to the token
            <i {...stylex.props(styles.dot)} />
          </h1>
          <p {...stylex.props(styles.sub)}>
            madeui copies <b {...stylex.props(styles.subStrong)}>Base UI</b> components into your project as
            editable source and styles them with compile-time{' '}
            <b {...stylex.props(styles.subStrong)}>StyleX tokens</b>. The rules live in your repo, where you and
            your agent both read them.
          </p>
          <div {...stylex.props(styles.cta)}>
            <Link href="/docs/installation" {...stylex.props(styles.btn, styles.btnSolid)}>
              Get started
            </Link>
            <Link href="/docs/components/accordion" {...stylex.props(styles.btn, styles.btnGhost)}>
              Browse components
            </Link>
          </div>
          <div {...stylex.props(styles.cmdline)}>
            <CopyCommand command="npx @madeui/cli init" />
          </div>
        </section>

        <section aria-label="Example screens built from madeui components" {...stylex.props(styles.stage)}>
          <Scenes />
          <p {...stylex.props(styles.caption)}>
            Every control above is the real component, running from the same source you would install.
          </p>
        </section>

        <Rule style={styles.principlesRule} />
        <section aria-label="How it works" {...stylex.props(styles.principles)}>
          {principles.map((p) => (
            <div key={p.title} {...stylex.props(styles.principle)}>
              <h2 {...stylex.props(styles.principleTitle)}>{p.title}</h2>
              <p {...stylex.props(styles.principleBody)}>{p.body}</p>
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </div>
  );
}

const appear = stylex.keyframes({
  to: { opacity: 1 },
});

const HOVER = '@media (hover: hover) and (pointer: fine)' as const;
const REDUCED = '@media (prefers-reduced-motion: reduce)' as const;

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
    color: colors.foreground,
    lineHeight: lineHeight.normal,
    minHeight: '100dvh',
  },
  // Two dashed rails run the full height of the page at the column edges:
  // the layout guide left visible. Phones drop them.
  wrap: {
    borderInlineColor: colors.border,
    borderInlineStyle: 'dashed',
    borderInlineWidth: { default: 0, [breakpoint.sm]: stroke.border },
    marginInline: 'auto',
    maxWidth: landing.column,
    paddingInline: { default: space.s4, [breakpoint.sm]: space.s6 },
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s3,
    justifyContent: 'space-between',
    paddingBlock: space.s4,
  },
  headerStart: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s5,
    minWidth: 0,
  },
  headerEnd: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: space.s1,
  },
  lockup: {
    color: colors.foreground,
    display: 'inline-flex',
    flexShrink: 0,
    textDecoration: 'none',
  },
  lockupSize: {
    height: layout.logo,
  },
  nav: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: space.s05,
  },
  // Docs carries the header on phones; Components and Changelog are one tap
  // away from it and both sit in the footer.
  navSecondary: {
    display: { default: 'none', [breakpoint.sm]: 'inline' },
  },
  navLink: {
    borderRadius: radius.md,
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
    },
    fontSize: fontSize.sm,
    paddingBlock: space.s15,
    paddingInline: space.s25,
    textDecoration: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'color',
    whiteSpace: 'nowrap',
  },
  iconLink: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', [HOVER]: { default: null, ':hover': colors.muted } },
    borderRadius: radius.md,
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
    },
    display: 'inline-flex',
    height: space.s9,
    justifyContent: 'center',
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    textDecoration: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'color, background-color',
    width: space.s9,
  },

  hero: {
    animationDuration: { default: duration.slow, [REDUCED]: '0s' },
    animationFillMode: 'forwards',
    animationName: appear,
    animationTimingFunction: easing.out,
    isolation: 'isolate',
    opacity: 0,
    paddingBlock: {
      default: `${space.s8} ${space.s8}`,
      [breakpoint.sm]: `${space.s12} ${space.s10}`,
    },
    position: 'relative',
    textAlign: 'center',
  },
  // A dot grid on the token spacing, faded to nothing at the edges: the
  // components' own layout grid showing through behind the headline.
  heroDots: {
    backgroundImage: `radial-gradient(${colors.border} ${stroke.border}, transparent ${stroke.border})`,
    backgroundPosition: 'center',
    backgroundSize: `${space.s6} ${space.s6}`,
    inset: 0,
    maskImage: 'radial-gradient(ellipse 60% 70% at 50% 45%, black 30%, transparent 100%)',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: -1,
  },
  pill: {
    alignItems: 'center',
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ':hover': colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
    },
    display: 'inline-flex',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    gap: space.s15,
    paddingBlock: space.s1,
    paddingInline: space.s3,
    textDecoration: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'color, border-color',
  },
  pillVersion: {
    color: colors.foreground,
  },
  h1: {
    fontSize: display.size,
    fontWeight: fontWeight.bold,
    letterSpacing: display.tracking,
    lineHeight: lineHeight.tight,
    marginBlock: `${space.s5} 0`,
    marginInline: 'auto',
    maxWidth: landing.headlineMeasure,
    textWrap: 'balance',
  },
  dot: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    display: 'inline-block',
    height: display.dot,
    marginLeft: display.dotGap,
    width: display.dot,
  },
  sub: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    marginBlock: `${space.s5} 0`,
    marginInline: 'auto',
    maxWidth: landing.subMeasure,
    textWrap: 'pretty',
  },
  subStrong: {
    color: colors.foreground,
    fontWeight: fontWeight.medium,
  },
  cta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s25,
    justifyContent: 'center',
    marginTop: space.s7,
  },
  btn: {
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    cursor: 'pointer',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingBlock: space.s25,
    paddingInline: space.s5,
    textDecoration: 'none',
    transform: { default: 'scale(1)', ':active': 'scale(0.97)' },
    transitionDuration: duration.fast,
    transitionProperty: {
      default: 'transform, opacity, border-color',
      [REDUCED]: 'opacity, border-color',
    },
    transitionTimingFunction: easing.out,
  },
  btnSolid: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
    opacity: { default: 1, [HOVER]: { default: null, ':hover': 0.88 } },
  },
  btnGhost: {
    backgroundColor: 'transparent',
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ':hover': colors.mutedForeground },
    },
    color: colors.foreground,
  },
  cmdline: {
    marginTop: space.s5,
  },

  stage: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  caption: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    margin: 0,
    textAlign: 'center',
  },

  principlesRule: {
    marginTop: space.s16,
  },
  principles: {
    display: 'grid',
    gap: { default: space.s7, [breakpoint.sm]: space.s10 },
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoint.sm]: 'repeat(3, minmax(0, 1fr))',
    },
    paddingTop: space.s10,
  },
  principle: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  principleTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    letterSpacing: tracking.title,
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  principleBody: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
    maxWidth: landing.principleMeasure,
    textWrap: 'pretty',
  },
});
