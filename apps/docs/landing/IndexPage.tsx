'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Kbd } from '@/components/ui/kbd';
import {
  space,
  fontSize,
  fontWeight,
  lineHeight,
  z,
  duration,
  easing,
  stroke,
} from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

import Footer from './Footer';
import { ArrowRightIcon, CheckIcon, CopyIcon, GitHubIcon, MoonIcon, SearchIcon, SunIcon } from './icons';
import { Lockup } from './Lockup';
import { Rule } from './Rule';
import Scenes from './scenes/Scenes';

// Geist is the brand face on marketing surfaces; the components inherit it
// through the `font.sans` token so every control in the scenes matches.
const geist = stylex.createTheme(font, {
  sans: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
});

function ThemeMenu() {
  const [open, setOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  // Follow the resolved theme the shell stamps on <html> (data-theme).
  React.useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.dataset.theme === 'dark');
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  const pick = (mode: 'light' | 'dark' | 'system') => {
    (window as unknown as { __setTheme?: (m: string) => void }).__setTheme?.(mode);
    setOpen(false);
  };

  return (
    <div {...stylex.props(styles.theme)}>
      <button
        type="button"
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={open}
        {...stylex.props(styles.iconBtn)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {dark ? <MoonIcon size={16} /> : <SunIcon size={16} />}
      </button>
      {open && (
        <div role="menu" {...stylex.props(styles.themeMenu)}>
          {(['light', 'dark', 'system'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="menuitem"
              {...stylex.props(styles.themeItem)}
              onClick={() => pick(mode)}
            >
              {mode === 'light' ? 'Light' : mode === 'dark' ? 'Dark' : 'System'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Opens the docs' own search dialog (Blume's <blume-search> element, rendered
// by the Astro shell). The dialog carries its own ⌘K / "/" handlers, so this
// button is the pointer path; the shortcut hint tells the rest.
function SearchTrigger() {
  const [modifier, setModifier] = React.useState('⌘');

  React.useEffect(() => {
    if (!/mac|iphone|ipad|ipod/iu.test(navigator.platform)) setModifier('Ctrl');
  }, []);

  const open = () => {
    const el = document.querySelector('blume-search') as
      | (HTMLElement & { open?: () => void })
      | null;
    if (el?.open) {
      el.open();
      return;
    }
    document.querySelector<HTMLElement>('[data-blume-search-open]')?.click();
  };

  return (
    <button type="button" onClick={open} aria-label="Search docs" {...stylex.props(styles.search)}>
      <SearchIcon size={16} />
      <span {...stylex.props(styles.searchLabel)}>Search docs…</span>
      <span {...stylex.props(styles.searchKbd)}>
        <Kbd>{modifier}</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}

// One copyable command. The copy button is the whole chip: nothing else on
// it is interactive, so a 40px-wide icon target would just be a smaller
// version of the same action.
function CopyCommand({ command, compact }: { command: string; compact?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return; // no clipboard (insecure context) — leave the chip untouched
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${command}`}
      {...stylex.props(styles.cmd, compact && styles.cmdCompact)}
    >
      <span aria-hidden {...stylex.props(styles.cmdPrompt)}>
        $
      </span>
      <code {...stylex.props(styles.cmdText)}>{command}</code>
      <span aria-hidden {...stylex.props(styles.cmdIcons)}>
        <CopyIcon size={16} {...stylex.props(styles.cmdIcon, copied && styles.cmdIconOut)} />
        <CheckIcon
          size={16}
          {...stylex.props(styles.cmdIcon, styles.cmdCheck, copied && styles.cmdIconIn)}
        />
      </span>
      <span role="status" aria-live="polite" {...stylex.props(styles.srOnly)}>
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}

const principles = [
  {
    title: 'Source you own',
    body: 'Components land in components/ui as plain TSX. Change anything; there is no package to fork and no override API to learn.',
  },
  {
    title: 'Tokens, not literals',
    body: 'Color, space, type, radius, and motion come from typed scales in lib/. A value off the scale does not compile, so nothing drifts.',
  },
  {
    title: 'Base UI underneath',
    body: 'Focus, keyboard, and positioning from headless primitives. Every state is a data attribute you style in place.',
  },
];

export default function IndexPage() {
  return (
    <div {...stylex.props(geist, styles.page)}>
      <div {...stylex.props(styles.wrap)}>
        <header {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.headerStart)}>
            <a href="/" aria-label="madeui" {...stylex.props(styles.lockup)}>
              <Lockup height={28} />
            </a>
            <nav aria-label="Primary" {...stylex.props(styles.nav)}>
              <a href="/docs" {...stylex.props(styles.navLink)}>
                Docs
              </a>
              <a href="/docs/components/accordion" {...stylex.props(styles.navLink, styles.navSecondary)}>
                Components
              </a>
              <a href="/changelog" {...stylex.props(styles.navLink, styles.navSecondary)}>
                Changelog
              </a>
            </nav>
          </div>
          <div {...stylex.props(styles.headerEnd)}>
            <SearchTrigger />
            <a
              href="https://github.com/madeui/ui"
              aria-label="madeui on GitHub"
              rel="noreferrer"
              target="_blank"
              {...stylex.props(styles.iconBtn)}
            >
              <GitHubIcon size={16} />
            </a>
            <ThemeMenu />
          </div>
        </header>

        <section {...stylex.props(styles.hero)}>
          <div aria-hidden {...stylex.props(styles.heroDots)} />
          <a href="/changelog" {...stylex.props(styles.pill)}>
            <span {...stylex.props(styles.pillVersion)}>v1.0.0</span> First release
            <ArrowRightIcon size={12} />
          </a>
          <h1 {...stylex.props(styles.h1)}>
            UI you own, down to the token
            <i {...stylex.props(styles.dot)} />
          </h1>
          <p {...stylex.props(styles.sub)}>
            madeui copies <b {...stylex.props(styles.subStrong)}>Base UI</b> components into your
            project as editable source and styles them with compile-time{' '}
            <b {...stylex.props(styles.subStrong)}>StyleX tokens</b>. Off-scale values don't
            compile, so the result stays consistent, for you and for your agent.
          </p>
          <div {...stylex.props(styles.cta)}>
            <a href="/docs/installation" {...stylex.props(styles.btn, styles.btnSolid)}>
              Get started
            </a>
            <a href="/docs/components/accordion" {...stylex.props(styles.btn, styles.btnGhost)}>
              Browse components
            </a>
          </div>
          <div {...stylex.props(styles.cmdline)}>
            <CopyCommand command="npx @madeui/cli init" />
          </div>
        </section>

        <section aria-label="Example screens built from madeui components" {...stylex.props(styles.stage)}>
          <Scenes />
          <p {...stylex.props(styles.caption)}>
            Every control above is the real component, running from the same source you
            would install.
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

        <div {...stylex.props(styles.compat)}>
          <span>Already on the shadcn CLI? The registry is compatible:</span>
          <CopyCommand command="npx shadcn@latest add @madeui/button" compact />
        </div>

        <Footer />
      </div>
    </div>
  );
}

const appear = stylex.keyframes({
  to: { opacity: 1 },
});

const HOVER = '@media (hover: hover) and (pointer: fine)' as const;
const TABLET = '@media (max-width: 61.25rem)' as const;
const MOBILE = '@media (max-width: 40rem)' as const;
const REDUCED = '@media (prefers-reduced-motion: reduce)' as const;

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: font.sans,
    lineHeight: lineHeight.normal,
    minHeight: '100dvh',
  },
  // Two dashed rails run the full height of the page at the column edges:
  // the layout guide left visible. Phones drop them.
  wrap: {
    borderInlineColor: colors.border,
    borderInlineStyle: 'dashed',
    borderInlineWidth: { default: stroke.border, [MOBILE]: 0 },
    marginInline: 'auto',
    maxWidth: '80rem',
    paddingInline: { default: space.s6, [MOBILE]: space.s4 },
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
  nav: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    gap: space.s05,
  },
  // Docs carries the header on phones; Components and Changelog are one tap
  // away from it and both sit in the footer.
  navSecondary: {
    display: { default: null, [MOBILE]: 'none' },
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
  search: {
    alignItems: 'center',
    backgroundColor: colors.background,
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
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    gap: space.s2,
    height: space.s9,
    marginRight: space.s1,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    outlineOffset: stroke.focus,
    paddingInline: { default: space.s3, [MOBILE]: 0 },
    justifyContent: 'center',
    // A null condition emits no rule in StyleX 0.19, so the tablet reset is
    // an explicit 0.
    minWidth: { default: '14rem', [TABLET]: 0 },
    width: { default: null, [MOBILE]: space.s9 },
    transitionDuration: duration.fast,
    transitionProperty: 'color, border-color',
  },
  searchLabel: {
    display: { default: null, [MOBILE]: 'none' },
    flex: 1,
    textAlign: 'left',
  },
  searchKbd: {
    display: { default: 'inline-flex', [MOBILE]: 'none' },
    gap: space.s05,
  },
  iconBtn: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', [HOVER]: { default: null, ':hover': colors.muted } },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ':hover': colors.foreground },
    },
    cursor: 'pointer',
    display: 'inline-flex',
    height: space.s9,
    justifyContent: 'center',
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    padding: 0,
    textDecoration: 'none',
    transitionDuration: duration.fast,
    transitionProperty: 'color, background-color',
    width: space.s9,
  },
  theme: {
    position: 'relative',
  },
  themeMenu: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.md,
    display: 'flex',
    flexDirection: 'column',
    minWidth: '7.5rem',
    padding: space.s1,
    position: 'absolute',
    right: 0,
    top: `calc(100% + ${space.s15})`,
    zIndex: z.popup,
  },
  themeItem: {
    backgroundColor: { default: 'transparent', [HOVER]: { default: null, ':hover': colors.muted } },
    borderRadius: radius.md,
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s15,
    paddingInline: space.s25,
    textAlign: 'left',
  },

  hero: {
    animationDuration: { default: duration.slow, [REDUCED]: '0s' },
    animationFillMode: 'forwards',
    animationName: appear,
    animationTimingFunction: easing.out,
    isolation: 'isolate',
    opacity: 0,
    paddingBlock: {
      default: `${space.s12} ${space.s10}`,
      [MOBILE]: `${space.s8} ${space.s8}`,
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
    fontFamily: font.sans,
    // Display scale — a marketing size with no place on the control type scale.
    fontSize: 'clamp(2.375rem, 5.4vw, 3.75rem)',
    fontWeight: fontWeight.bold,
    letterSpacing: '-0.04em',
    lineHeight: lineHeight.tight,
    marginBlock: `${space.s5} 0`,
    marginInline: 'auto',
    maxWidth: '18ch',
    textWrap: 'balance',
  },
  dot: {
    backgroundColor: colors.foreground,
    borderRadius: radius.full,
    display: 'inline-block',
    height: '0.12em',
    marginLeft: '0.04em',
    width: '0.12em',
  },
  sub: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    marginBlock: `${space.s5} 0`,
    marginInline: 'auto',
    maxWidth: '58ch',
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
  cmd: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ':hover': colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.mono,
    fontSize: fontSize.xs,
    gap: space.s2,
    paddingBlock: space.s2,
    paddingInline: space.s4,
    transform: { default: 'scale(1)', ':active': 'scale(0.97)' },
    transitionDuration: duration.fast,
    transitionProperty: {
      default: 'transform, border-color',
      [REDUCED]: 'border-color',
    },
    transitionTimingFunction: easing.out,
  },
  cmdCompact: {
    paddingBlock: space.s05,
    paddingInline: space.s25,
  },
  cmdPrompt: {
    color: colors.foreground,
  },
  cmdText: {
    fontFamily: font.mono,
  },
  // Both icons share one cell so the swap is a crossfade in place, not a
  // width change that would shift the command text.
  cmdIcons: {
    color: colors.mutedForeground,
    display: 'inline-block',
    height: space.s4,
    marginLeft: space.s1,
    position: 'relative',
    width: space.s4,
  },
  cmdIcon: {
    insetInlineStart: 0,
    opacity: 1,
    position: 'absolute',
    top: 0,
    transform: 'scale(1)',
    transitionDuration: duration.fast,
    transitionProperty: {
      default: 'transform, opacity',
      [REDUCED]: 'opacity',
    },
    transitionTimingFunction: easing.out,
  },
  cmdIconOut: {
    opacity: 0,
    transform: 'scale(0.8)',
  },
  cmdCheck: {
    color: colors.foreground,
    opacity: 0,
    transform: 'scale(0.8)',
  },
  cmdIconIn: {
    opacity: 1,
    transform: 'scale(1)',
  },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
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
    gap: { default: space.s10, [MOBILE]: space.s7 },
    gridTemplateColumns: {
      default: 'repeat(3, minmax(0, 1fr))',
      [MOBILE]: 'minmax(0, 1fr)',
    },
    paddingTop: space.s10,
  },
  principle: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  principleTitle: {
    fontFamily: font.sans,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    letterSpacing: '-0.01em',
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  principleBody: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
    maxWidth: '42ch',
    textWrap: 'pretty',
  },

  compat: {
    alignItems: 'center',
    color: colors.mutedForeground,
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: fontSize.sm,
    gap: `${space.s25} ${space.s5}`,
    justifyContent: 'center',
    marginTop: space.s12,
    textAlign: 'center',
  },
});
