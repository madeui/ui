'use client';

import * as React from 'react';

import { Toast as BaseToast } from '@base-ui/react/toast';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

export const ToastProvider = BaseToast.Provider;

/** Imperative API: `const toast = useToast(); toast.add({ title, description })`. */
export function useToast() {
  return BaseToast.useToastManager();
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      {...stylex.props(styles.root)}
    >
      <div {...stylex.props(styles.text)}>
        <BaseToast.Title {...stylex.props(styles.title)} />
        <BaseToast.Description {...stylex.props(styles.description)} />
      </div>
      <BaseToast.Close aria-label="Close" {...stylex.props(styles.close)}>
        <svg
          width="12"
          height="12"
          viewBox={`0 0 12 12`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d={`m2 2 8 8M10 2l-8 8`} />
        </svg>
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

/** Mount once (inside ToastProvider) — renders the stacked toasts. */
export function Toaster() {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport {...stylex.props(styles.viewport)}>
        <ToastList />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

const toastIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(0.5rem)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  viewport: {
    bottom: space.s4,
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
    position: 'fixed',
    right: space.s4,
    width: container.md,
    zIndex: z.toast,
  },
  root: {
    alignItems: 'flex-start',
    animationDuration: duration.fast,
    animationName: toastIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.lg,
    color: colors.popoverForeground,
    display: 'flex',
    fontFamily: font.sans,
    gap: space.s2,
    justifyContent: 'space-between',
    padding: space.s4,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.snug,
    margin: 0,
  },
  close: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    borderRadius: radius.sm,
    borderStyle: 'none',
    color: colors.mutedForeground,
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: space.s6,
    justifyContent: 'center',
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    padding: 0,
    width: space.s6,
  },
});
