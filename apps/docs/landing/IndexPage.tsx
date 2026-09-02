"use client";

import * as React from "react";

import * as stylex from "@stylexjs/stylex";

import {
  space,
  fontSize,
  fontWeight,
  lineHeight,
  z,
  duration,
  easing,
  stroke,
} from "@/lib/constants.stylex";
import { colors, font, radius, shadow } from "@/lib/tokens.stylex";

import ApiKeyCard from "./ApiKeyCard";
import BackupCard from "./BackupCard";
import { WORDMARK_PATH } from "./brand";
import ComposeCard from "./ComposeCard";
import FocusCard from "./FocusCard";
import KitchenSink from "./KitchenSink";
import ReviewerCard from "./ReviewerCard";
import RsvpCard from "./RsvpCard";
import ShortcutsCard from "./ShortcutsCard";

// Marketing accent — deliberately outside the token scale (the brand violet
// is not a component color; see the wordmark dot).
const VIOLET = "#6D5CE8";

function Lockup() {
  return (
    <svg viewBox={`0 0 112 28`} width="112" height="28" aria-hidden>
      <rect width="28" height="28" rx="8.5" fill="currentColor" />
      <path
        d={`M7.9 19 V13.4 Q7.9 9.9 11.1 9.9 Q14 9.9 14 13.4 V19 M14 13.4 Q14 9.9 16.9 9.9 Q20.1 9.9 20.1 13.4 V19`}
        fill="none"
        stroke={`var(--madeui-page-bg, #fff)`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <g transform={`translate(37,21) scale(0.185)`} fill="currentColor">
        <path d={WORDMARK_PATH} />
      </g>
      <circle cx="106.8" cy="18.4" r="2.6" fill={VIOLET} />
    </svg>
  );
}

function ThemeMenu() {
  const [open, setOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  // Follow the resolved theme the shell stamps on <html> (data-theme).
  React.useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.dataset.theme === "dark");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const pick = (mode: "light" | "dark" | "system") => {
    (window as unknown as { __setTheme?: (m: string) => void }).__setTheme?.(mode);
    setOpen(false);
  };

  return (
    <div {...stylex.props(styles.theme)}>
      <button
        type="button"
        aria-label="Theme"
        aria-haspopup="menu"
        {...stylex.props(styles.themeBtn)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {dark ? (
          <svg
            width="16"
            height="16"
            viewBox={`0 0 24 24`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d={`M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z`} />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox={`0 0 24 24`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="4" />
            <path
              d={`M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4`}
            />
          </svg>
        )}
      </button>
      {open && (
        <div role="menu" {...stylex.props(styles.themeMenu)}>
          {(["light", "dark", "system"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              role="menuitem"
              {...stylex.props(styles.themeItem)}
              onClick={() => pick(mode)}
            >
              {mode === "light" ? "Light" : mode === "dark" ? "Dark" : "System"}
            </button>
          ))}
        </div>
      )}
    </div>
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
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...stylex.props(styles.cmdIcon, copied && styles.cmdIconOut)}
        >
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          {...stylex.props(styles.cmdIcon, styles.cmdCheck, copied && styles.cmdIconIn)}
        >
          <path d="m4 12.5 5.2 5.2L20 7" />
        </svg>
      </span>
      <span role="status" aria-live="polite" {...stylex.props(styles.srOnly)}>
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

export default function IndexPage() {
  // Merges the StyleX cell styles with the one global utility class the
  // astro shell provides (break-inside — see the compiler-bug note below).
  const cellProps = (extra?: stylex.StyleXStyles) => {
    const sx = stylex.props(styles.cell, extra);
    return { ...sx, className: `${sx.className ?? ''} bento-cell` };
  };
  return (
    <div {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.wrap)}>
        <header {...stylex.props(styles.header)}>
          <a href="/" aria-label="madeui" {...stylex.props(styles.lockup)}>
            <Lockup />
          </a>
          <nav {...stylex.props(styles.nav)}>
            <a href="/docs" {...stylex.props(styles.navLink)}>
              Docs
            </a>
            <a href="/docs/components/accordion" {...stylex.props(styles.navLink, styles.navSecondary)}>
              Components
            </a>
            <a href="/changelog" {...stylex.props(styles.navLink, styles.navSecondary)}>
              Changelog
            </a>
            <a href="https://github.com/madeui/ui" {...stylex.props(styles.navLink)}>
              GitHub
            </a>
            <ThemeMenu />
          </nav>
        </header>

        <section {...stylex.props(styles.hero)}>
          <a href="/changelog" {...stylex.props(styles.pill)}>
            <span {...stylex.props(styles.pillVersion)}>v1.0.0</span> First release{" "}
            <span aria-hidden>→</span>
          </a>
          <h1 {...stylex.props(styles.h1)}>
            Components, made yours
            <i {...stylex.props(styles.dot)} />
          </h1>
          <p {...stylex.props(styles.sub)}>
            Copied into your project as <b {...stylex.props(styles.subStrong)}>editable source</b>,
            styled with compile-time <b {...stylex.props(styles.subStrong)}>StyleX tokens</b>, built
            on headless <b {...stylex.props(styles.subStrong)}>Base UI</b> — and constrained enough
            that your AI agent can't break it.
          </p>
          <div {...stylex.props(styles.cta)}>
            <a href="/docs/installation" {...stylex.props(styles.btn, styles.btnSolid)}>
              Get Started
            </a>
            <a href="/docs/components/accordion" {...stylex.props(styles.btn, styles.btnGhost)}>
              View Components
            </a>
          </div>
          <div {...stylex.props(styles.cmdline)}>
            <CopyCommand command="npx @madeui/cli init" />
          </div>
        </section>

        <section {...stylex.props(styles.bento)} aria-label="Live component previews">
          <div {...cellProps(styles.sink)}>
            <KitchenSink />
          </div>
          <div {...cellProps()}>
            <ApiKeyCard />
          </div>
          <div {...cellProps()}>
            <ComposeCard />
          </div>
          <div {...cellProps()}>
            <BackupCard />
          </div>
          <div {...cellProps()}>
            <RsvpCard />
          </div>
          <div {...cellProps()}>
            <FocusCard />
          </div>
          <div {...cellProps()}>
            <ReviewerCard />
          </div>
          <div {...cellProps()}>
            <ShortcutsCard />
          </div>
        </section>

        <div {...stylex.props(styles.compat)}>
          <span>Every preview above is the real component. shadcn CLI works too:</span>
          <CopyCommand command="npx shadcn@latest add @madeui/button" compact />
        </div>

        <footer {...stylex.props(styles.footer)}>
          <span>MIT © madeui</span>
          <div {...stylex.props(styles.footerLinks)}>
            <a href="/docs" {...stylex.props(styles.footerLink)}>
              Docs
            </a>
            <a href="/changelog" {...stylex.props(styles.footerLink)}>
              Changelog
            </a>
            <a href="https://github.com/madeui/ui" {...stylex.props(styles.footerLink)}>
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

const appear = stylex.keyframes({
  to: { opacity: 1 },
});

const HOVER = "@media (hover: hover) and (pointer: fine)" as const;
const MOBILE = "@media (max-width: 36rem)" as const;

const styles = stylex.create({
  page: {
    // The chip's m and the theme menu shadow read the page ground through
    // this var (defined here, themed by the color tokens).
    "--madeui-page-bg": colors.background,
    backgroundColor: colors.background,
    color: colors.foreground,
    fontFamily: font.sans,
    lineHeight: lineHeight.normal,
    minHeight: "100dvh",
  },
  wrap: {
    marginInline: "auto",
    maxWidth: "75rem",
    paddingInline: { default: space.s6, [MOBILE]: space.s4 },
  },
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: space.s4,
  },
  lockup: {
    color: colors.foreground,
    display: "inline-flex",
    textDecoration: "none",
  },
  nav: {
    alignItems: "center",
    display: "flex",
    // Without this the links compress past their text and overlap on
    // narrow screens instead of the row simply getting tighter.
    flexShrink: 0,
    gap: space.s05,
  },
  // Docs and GitHub carry the header on phones; Components and Changelog
  // are one tap away from either, and both sit in the footer.
  navSecondary: {
    display: { default: null, [MOBILE]: "none" },
  },
  navLink: {
    borderRadius: radius.md,
    whiteSpace: "nowrap",
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ":hover": colors.foreground },
    },
    fontSize: fontSize.sm,
    paddingBlock: space.s15,
    paddingInline: space.s25,
    textDecoration: "none",
    transitionDuration: duration.fast,
    transitionProperty: "color",
  },
  theme: {
    marginLeft: space.s15,
    position: "relative",
  },
  themeBtn: {
    alignItems: "center",
    backgroundColor: { default: "transparent", [HOVER]: { default: null, ":hover": colors.muted } },
    borderRadius: radius.md,
    borderStyle: "none",
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ":hover": colors.foreground },
    },
    cursor: "pointer",
    display: "flex",
    height: space.s8,
    justifyContent: "center",
    outline: { default: "none", ":focus-visible": `${stroke.focus} solid ${colors.ring}` },
    padding: 0,
    transitionDuration: duration.fast,
    transitionProperty: "color, background-color",
    width: space.s8,
  },
  themeMenu: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: stroke.border,
    boxShadow: shadow.md,
    display: "flex",
    flexDirection: "column",
    minWidth: "7.5rem",
    padding: space.s1,
    position: "absolute",
    right: 0,
    top: `calc(100% + ${space.s15})`,
    zIndex: z.popup,
  },
  themeItem: {
    backgroundColor: { default: "transparent", [HOVER]: { default: null, ":hover": colors.muted } },
    borderRadius: radius.md,
    borderStyle: "none",
    color: colors.foreground,
    cursor: "pointer",
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    outline: { default: "none", ":focus-visible": `${stroke.focus} solid ${colors.ring}` },
    paddingBlock: space.s15,
    paddingInline: space.s25,
    textAlign: "left",
  },

  hero: {
    animationDuration: duration.slow,
    animationFillMode: "forwards",
    animationName: appear,
    animationTimingFunction: easing.out,
    opacity: 0,
    paddingBlock: {
      default: `${space.s16} ${space.s12}`,
      [MOBILE]: `${space.s10} ${space.s9}`,
    },
    textAlign: "center",
  },
  pill: {
    alignItems: "center",
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ":hover": colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: "solid",
    borderWidth: stroke.border,
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ":hover": colors.foreground },
    },
    display: "inline-flex",
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    gap: space.s15,
    paddingBlock: space.s1,
    paddingInline: space.s3,
    textDecoration: "none",
    transitionDuration: duration.fast,
    transitionProperty: "color, border-color",
  },
  pillVersion: {
    color: VIOLET,
  },
  h1: {
    // Display scale — a marketing size with no place on the control type scale.
    fontSize: "clamp(2.375rem, 5.6vw, 3.75rem)",
    fontWeight: fontWeight.bold,
    letterSpacing: "-0.04em",
    lineHeight: lineHeight.tight,
    marginBlock: `${space.s5} 0`,
    marginInline: "auto",
    maxWidth: "20ch",
    textWrap: "balance",
  },
  dot: {
    backgroundColor: VIOLET,
    borderRadius: radius.full,
    display: "inline-block",
    height: "0.12em",
    marginLeft: "0.04em",
    width: "0.12em",
  },
  sub: {
    color: colors.mutedForeground,
    fontSize: fontSize.base,
    marginBlock: `${space.s4} 0`,
    marginInline: "auto",
    maxWidth: "62ch",
  },
  subStrong: {
    color: colors.foreground,
    fontWeight: fontWeight.medium,
  },
  cta: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.s25,
    justifyContent: "center",
    marginTop: space.s7,
  },
  btn: {
    borderRadius: radius.full,
    borderStyle: "solid",
    borderWidth: stroke.border,
    cursor: "pointer",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    paddingBlock: space.s25,
    paddingInline: space.s5,
    textDecoration: "none",
    transform: { default: "scale(1)", ":active": "scale(0.97)" },
    transitionDuration: duration.fast,
    transitionProperty: {
      default: "transform, opacity, border-color",
      "@media (prefers-reduced-motion: reduce)": "opacity, border-color",
    },
    transitionTimingFunction: easing.out,
  },
  btnSolid: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.primaryForeground,
    opacity: { default: 1, [HOVER]: { default: null, ":hover": 0.88 } },
  },
  btnGhost: {
    backgroundColor: "transparent",
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ":hover": colors.mutedForeground },
    },
    color: colors.foreground,
  },
  cmdline: {
    marginTop: space.s5,
  },
  // A real surface: the bare mono line read as text floating on the page,
  // and it never looked like something you could click.
  cmd: {
    alignItems: "center",
    backgroundColor: colors.muted,
    // muted and accent are the same value in both themes, so the hover
    // signal has to come from the border.
    borderColor: {
      default: colors.border,
      [HOVER]: { default: null, ":hover": colors.mutedForeground },
    },
    borderRadius: radius.full,
    borderStyle: "solid",
    borderWidth: stroke.border,
    color: colors.foreground,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: font.mono,
    fontSize: fontSize.xs,
    gap: space.s2,
    paddingBlock: space.s2,
    paddingInline: space.s4,
    transform: { default: "scale(1)", ":active": "scale(0.97)" },
    transitionDuration: duration.fast,
    transitionProperty: {
      default: "transform, border-color",
      "@media (prefers-reduced-motion: reduce)": "border-color",
    },
    transitionTimingFunction: easing.out,
  },
  cmdCompact: {
    paddingBlock: space.s05,
    paddingInline: space.s25,
  },
  cmdPrompt: {
    color: VIOLET,
  },
  cmdText: {
    fontFamily: font.mono,
  },
  // Both icons share one cell so the swap is a crossfade in place, not a
  // width change that would shift the command text.
  cmdIcons: {
    color: colors.mutedForeground,
    display: "inline-block",
    height: "14px",
    marginLeft: space.s1,
    position: "relative",
    width: "14px",
  },
  cmdIcon: {
    insetInlineStart: 0,
    opacity: 1,
    position: "absolute",
    top: 0,
    transform: "scale(1)",
    transitionDuration: duration.fast,
    transitionProperty: {
      default: "transform, opacity",
      "@media (prefers-reduced-motion: reduce)": "opacity",
    },
    transitionTimingFunction: easing.out,
  },
  cmdIconOut: {
    opacity: 0,
    transform: "scale(0.8)",
  },
  cmdCheck: {
    color: VIOLET,
    opacity: 0,
    transform: "scale(0.8)",
  },
  cmdIconIn: {
    opacity: 1,
    transform: "scale(1)",
  },
  srOnly: {
    borderWidth: 0,
    clipPath: "inset(50%)",
    height: "1px",
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px",
  },

  bento: {
    columnGap: space.s4,
    columnCount: {
      default: 3,
      '@media (max-width: 61.25rem)': 2,
      '@media (max-width: 40rem)': 1,
    },
    paddingBottom: space.s6,
  },
  // break-inside lives in the astro shell's global block ("bento-cell") —
  // StyleX 0.19 emits an empty value for it (compiler bug).
  cell: {
    marginBottom: space.s4,
  },
  sink: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: "solid",
    borderWidth: stroke.border,
    paddingBlock: space.s5,
    paddingInline: space.s4,
  },

  compat: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopStyle: "solid",
    borderTopWidth: stroke.border,
    color: colors.mutedForeground,
    display: "flex",
    flexWrap: "wrap",
    fontSize: fontSize.sm,
    gap: `${space.s25} ${space.s7}`,
    justifyContent: "center",
    marginTop: space.s10,
    paddingBlock: space.s5,
    textAlign: "center",
  },

  footer: {
    borderTopColor: colors.border,
    borderTopStyle: "solid",
    borderTopWidth: stroke.border,
    color: colors.mutedForeground,
    display: "flex",
    flexWrap: "wrap",
    fontSize: fontSize.xs,
    gap: space.s4,
    justifyContent: "space-between",
    paddingBlock: `${space.s5} ${space.s12}`,
  },
  footerLinks: {
    display: "flex",
    gap: space.s5,
  },
  footerLink: {
    color: {
      default: colors.mutedForeground,
      [HOVER]: { default: null, ":hover": colors.foreground },
    },
    textDecoration: "none",
    transitionDuration: duration.fast,
    transitionProperty: "color",
  },
});
