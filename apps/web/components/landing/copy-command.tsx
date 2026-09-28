'use client';

import * as stylex from '@stylexjs/stylex';

import { CheckIcon, CopyIcon } from '@/components/landing/icons';
import { media } from '@/components/landing/landing.stylex';
import { font } from '@/components/site/site.stylex';
import { useCopied } from '@/components/site/use-copied';
import { visuallyHidden } from '@/components/site/visually-hidden';
import { duration, easing, fontSize, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

/**
 * One copyable command. The copy button is the whole chip: nothing else on
 * it is interactive, so a 40px-wide icon target would just be a smaller
 * version of the same action.
 */
export function CopyCommand({ command }: { command: string }) {
  const [copied, flash] = useCopied();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      return; // no clipboard (insecure context): leave the chip untouched
    }
    flash();
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
      <span role="status" aria-live="polite" {...stylex.props(visuallyHidden.always)}>
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
      [media.hover]: { default: null, ':hover': colors.mutedForeground },
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
      [media.reducedMotion]: 'border-color',
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
      [media.reducedMotion]: 'opacity',
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
});
