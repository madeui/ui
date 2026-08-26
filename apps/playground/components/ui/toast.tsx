'use client';

import * as React from 'react';

import { Toast as BaseToast } from '@base-ui/react/toast';
import * as stylex from '@stylexjs/stylex';

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
    bottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    position: 'fixed',
    right: '1rem',
    width: '20rem',
    zIndex: 100,
  },
  root: {
    alignItems: 'flex-start',
    animationDuration: '150ms',
    animationName: toastIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.lg,
    color: colors.popoverForeground,
    display: 'flex',
    fontFamily: font.sans,
    gap: '0.5rem',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.3,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.4,
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
    height: '1.5rem',
    justifyContent: 'center',
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    padding: 0,
    width: '1.5rem',
  },
});
