'use client';

import * as stylex from '@stylexjs/stylex';
import { GripVertical } from 'lucide-react';
import {
  Group,
  Panel,
  Separator,
  useDefaultLayout,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from 'react-resizable-panels';

import { duration, easing, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

/**
 * Persists a group's layout between page loads. Re-exported from
 * react-resizable-panels so persisted layouts need one import source:
 *
 *   const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: 'sidebar' });
 *   <ResizablePanelGroup defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
 */
export { useDefaultLayout };

export interface ResizablePanelGroupProps
  extends Omit<GroupProps, 'className' | 'style'> {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

// The handle draws a 1px line; the library widens the *pointer* target around
// it to this many CSS pixels. Its own default for coarse pointers (20) is
// under the 24px floor of WCAG 2.2 "Target Size (Minimum)", so a touch drag
// on the line is easy to miss. Module-level so the object identity is stable
// across renders. Override per group with `resizeTargetMinimumSize`.
const resizeTarget = { coarse: 24, fine: 10 };

/**
 * Fills its parent (width and height 100%) and lays the panels out as a flex
 * row (`horizontal`) or column (`vertical`); size the parent to size the group.
 */
export function ResizablePanelGroup({
  orientation = 'horizontal',
  resizeTargetMinimumSize = resizeTarget,
  style,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <Group
      orientation={orientation}
      resizeTargetMinimumSize={resizeTargetMinimumSize}
      {...props}
      {...stylex.props(style)}
    />
  );
}

export interface ResizablePanelProps
  extends Omit<PanelProps, 'className' | 'style'> {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

/** Styles land on the panel's content box (the library owns the flex item). */
export function ResizablePanel({ style, ...props }: ResizablePanelProps) {
  return <Panel {...props} {...stylex.props(style)} />;
}

export interface ResizableHandleProps
  extends Omit<SeparatorProps, 'className' | 'style'> {
  /** Render a centered grip pill on the line. */
  withHandle?: boolean;
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export function ResizableHandle({
  withHandle = false,
  style,
  children,
  ...props
}: ResizableHandleProps) {
  return (
    <Separator
      aria-label="Resize panels"
      {...props}
      {...stylex.props(styles.separator, style)}
    >
      {withHandle ? (
        <div {...stylex.props(styles.grip)}>
          <GripVertical {...stylex.props(icon.xs)} />
        </div>
      ) : null}
      {children}
    </Separator>
  );
}

// The library mirrors the *line's* orientation as `aria-orientation`: a
// horizontal group draws a vertical line (aria-orientation="vertical"), a
// vertical group a horizontal one. Styles key off the attribute so the handle
// needs no orientation prop. Hover/active/focus state arrives as
// `data-separator="hover" | "active" | "focus" | "disabled"`; the library also
// widens the pointer hit area itself, so the element stays a 1px line.
const styles = stylex.create({
  separator: {
    // No `default` for conditional custom properties (see STYLEX.md); the
    // var() fallback on the grip covers the unset case.
    '--grip-rotation': {
      default: null,
      '[aria-orientation="horizontal"]': '90deg',
    },
    alignItems: 'center',
    backgroundColor: {
      default: colors.border,
      '[data-separator="hover"]': colors.ring,
      '[data-separator="active"]': colors.ring,
    },
    cursor: {
      default: 'col-resize',
      '[aria-orientation="horizontal"]': 'row-resize',
    },
    display: 'flex',
    height: {
      default: '100%',
      '[aria-orientation="horizontal"]': stroke.border,
    },
    justifyContent: 'center',
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: stroke.focus,
    // Positioned so the overflowing grip paints above the neighbouring panels.
    position: 'relative',
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    transitionTimingFunction: easing.out,
    // A pointer press on the line is a drag, never a text selection: without
    // this the browser starts selecting the neighbouring panel's text.
    userSelect: 'none',
    width: {
      default: stroke.border,
      '[aria-orientation="horizontal"]': '100%',
    },
  },
  // 16x24 around a 12px icon: the pill's 1px border needs room, and a smaller
  // box would let the grip paint over its own edge.
  grip: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.foreground,
    display: 'flex',
    flexShrink: 0,
    height: space.s6,
    justifyContent: 'center',
    transform: 'rotate(var(--grip-rotation, 0deg))',
    width: space.s4,
  },
});
