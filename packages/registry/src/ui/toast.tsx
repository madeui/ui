'use client';

import * as React from 'react';

import { Toast as BaseToast } from '@base-ui/react/toast';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { space, fontSize, lineHeight, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

/** The manager behind the imperative `toast` API — pass to `useToast` consumers if needed. */
export const toastManager = BaseToast.createToastManager();

type ToastAddOptions = Omit<
  Parameters<typeof toastManager.add>[0],
  'title'
>;

function addToast(
  title: React.ReactNode,
  options?: ToastAddOptions & { type?: string }
) {
  return toastManager.add({ title, ...options });
}

/**
 * Imperative API, callable anywhere — event handlers, stores, outside React:
 * `toast('Saved')`, `toast.error('Failed', { description: '…' })`,
 * `toast.promise(save(), { loading: '…', success: '…', error: '…' })`.
 * Requires `ToastProvider` + `Toaster` to be mounted (e.g. in the root layout).
 */
export const toast = Object.assign(addToast, {
  success: (title: React.ReactNode, options?: ToastAddOptions) =>
    addToast(title, { ...options, type: 'success' }),
  error: (title: React.ReactNode, options?: ToastAddOptions) =>
    addToast(title, { ...options, type: 'error' }),
  promise: toastManager.promise.bind(toastManager),
  update: toastManager.update.bind(toastManager),
  close: toastManager.close.bind(toastManager),
});

/** Hook form of the same API: `const t = useToast(); t.add({ title })`. */
export function useToast() {
  return BaseToast.useToastManager();
}

// Wired to the shared manager so the imperative `toast` reaches it; pass your
// own `toastManager` to opt out.
export function ToastProvider(
  props: React.ComponentPropsWithoutRef<typeof BaseToast.Provider>
) {
  return <BaseToast.Provider toastManager={toastManager} {...props} />;
}

type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;

interface ToastRootState {
  transitionStatus: TransitionStatus;
  expanded: boolean;
  limited: boolean;
  swiping: boolean;
}

function ToastList({
  swipeDirection,
}: {
  swipeDirection: React.ComponentPropsWithoutRef<
    typeof BaseToast.Root
  >['swipeDirection'];
}) {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((t) => (
    <BaseToast.Root
      key={t.id}
      toast={t}
      swipeDirection={swipeDirection}
      {...stateProps((s: ToastRootState) => [
        styles.root,
        s.expanded && styles.rootExpanded,
        (s.transitionStatus === 'starting' ||
          s.transitionStatus === 'ending') &&
          styles.rootClosed,
        s.swiping && styles.rootSwiping,
        s.limited && styles.rootLimited,
      ])}
    >
      <div {...stylex.props(styles.content)}>
        <div {...stylex.props(styles.text)}>
          <BaseToast.Title {...stylex.props(styles.title)} />
          <BaseToast.Description {...stylex.props(styles.description)} />
        </div>
        <BaseToast.Action {...stylex.props(styles.action)} />
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
      </div>
    </BaseToast.Root>
  ));
}

export interface ToasterProps {
  /** Direction(s) a toast can be swiped to dismiss. */
  swipeDirection?: React.ComponentPropsWithoutRef<
    typeof BaseToast.Root
  >['swipeDirection'];
  /** StyleX styles for the viewport, merged last. */
  style?: stylex.StyleXStyles;
}

/**
 * Mount once (inside ToastProvider) — renders the toast stack. Toasts pile up
 * behind the newest one; hovering or focusing the stack expands it. Swipe
 * down/right (touch or mouse) to dismiss.
 */
export function Toaster({
  swipeDirection = ['down', 'right'],
  style,
}: ToasterProps) {
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport {...stylex.props(styles.viewport, style)}>
        <ToastList swipeDirection={swipeDirection} />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

const stackEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

const styles = stylex.create({
  viewport: {
    bottom: space.s4,
    position: 'fixed',
    right: space.s4,
    width: container.md,
    zIndex: z.toast,
  },
  root: {
    // Behind toasts peek out above the frontmost one, shrunk slightly; swipe
    // movement rides along via the Base UI-provided CSS variables.
    '--toast-gap': space.s2,
    alignItems: 'flex-start',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    bottom: 0,
    boxShadow: shadow.lg,
    boxSizing: 'border-box',
    color: colors.popoverForeground,
    display: 'flex',
    fontFamily: font.sans,
    // All toasts share the frontmost height while collapsed so the stack
    // reads as one card with edges peeking out.
    height: 'var(--toast-frontmost-height)',
    opacity: 1,
    overflow: 'hidden',
    padding: space.s4,
    position: 'absolute',
    right: 0,
    transform: `translateX(var(--toast-swipe-movement-x, 0px)) translateY(calc(var(--toast-swipe-movement-y, 0px) + min(var(--toast-index), 10) * -1 * var(--toast-gap))) scale(calc(max(0.8, 1 - var(--toast-index) * 0.05)))`,
    transformOrigin: 'center bottom',
    transitionDuration: duration.slow,
    transitionProperty: 'transform, opacity, height',
    transitionTimingFunction: stackEase,
    width: '100%',
    zIndex: `calc(${z.toast} - var(--toast-index))`,
  },
  rootExpanded: {
    '--toast-content-visible': '1',
    height: 'var(--toast-height)',
    transform: `translateX(var(--toast-swipe-movement-x, 0px)) translateY(calc(var(--toast-swipe-movement-y, 0px) - var(--toast-offset-y) - var(--toast-index) * var(--toast-gap)))`,
  },
  rootClosed: {
    opacity: 0,
    transform: `translateY(calc(100% + ${space.s4}))`,
  },
  rootSwiping: {
    transitionDuration: '0s',
  },
  // Over the provider's limit: kept mounted by Base UI, hidden by us.
  rootLimited: {
    opacity: 0,
  },
  content: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: space.s2,
    justifyContent: 'space-between',
    // Behind toasts hide their content so the collapsed stack shows only the
    // frontmost card's text; expanding reveals every card (custom property set
    // by rootExpanded).
    opacity: `var(--toast-content-visible, calc(max(0, 1 - var(--toast-index))))`,
    transitionDuration: duration.fast,
    transitionProperty: 'opacity',
    width: '100%',
  },
  text: {
    display: 'flex',
    flex: 1,
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
  action: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    height: space.s6,
    justifyContent: 'center',
    outline: { default: 'none', ':focus-visible': `${stroke.focus} solid ${colors.ring}` },
    paddingInline: space.s2,
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
