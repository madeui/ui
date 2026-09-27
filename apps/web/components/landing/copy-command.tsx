'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { CheckIcon, CopyIcon } from '@/components/landing/icons';
import { font } from '@/components/site/site.stylex';
import { duration, easing, fontSize, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

const HOVER = '@media (hover: hover) and (pointer: fine)' as const;
const REDUCED = '@media (prefers-reduced-motion: reduce)' as const;

/** How long the check mark stays after a copy. */
const COPIED_MS = 1600;

/**
 * One copyable command. The copy button is the whole chip: nothing else on
 * it is interactive, so a 40px-wide icon target would just be a smaller
 * version of the same action.
 */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return; // no clipboard (insecure context): leave the chip untouched
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <button type="button" onClick={copy} aria-label={`Copy ${command}`} {...stylex.props(styles.cmd)}>
      <span aria-hidden {...stylex.props(styles.prompt)}>
        $
      </span>
      <code {...stylex.props(styles.text)}>{command}</code>
      <span aria-hidden {...stylex.props(styles.icons)}>
        <CopyIcon size={16} {...stylex.props(styles.icon, copied && styles.iconOut)} />
        <CheckIcon size={16} {...stylex.props(styles.icon, styles.check, copied && styles.iconIn)} />
      </span>
      <span role="status" aria-live="polite" {...stylex.props(styles.srOnly)}>
        {copied ? 'Copied' : ''}
      </span>
    </button>
  );
}

const styles = stylex.create({
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
  prompt: {
    color: colors.foreground,
  },
  text: {
    fontFamily: font.mono,
  },
  // Both icons share one cell so the swap is a crossfade in place, not a
  // width change that would shift the command text.
  icons: {
    color: colors.mutedForeground,
    display: 'inline-block',
    height: space.s4,
    marginLeft: space.s1,
    position: 'relative',
    width: space.s4,
  },
  icon: {
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
  iconOut: {
    opacity: 0,
    transform: 'scale(0.8)',
  },
  check: {
    color: colors.foreground,
    opacity: 0,
    transform: 'scale(0.8)',
  },
  iconIn: {
    opacity: 1,
    transform: 'scale(1)',
  },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: space.px,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: space.px,
  },
});
