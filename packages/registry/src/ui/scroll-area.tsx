'use client';

import * as React from 'react';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import * as stylex from '@stylexjs/stylex';

import { space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';

interface StyleXStyleProps {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export function ScrollArea({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseScrollArea.Root {...props} {...stylex.props(styles.root, style)}>
      <BaseScrollArea.Viewport {...stylex.props(styles.viewport)}>
        {children}
      </BaseScrollArea.Viewport>
      <ScrollBar />
      <BaseScrollArea.Corner />
    </BaseScrollArea.Root>
  );
}

export function ScrollBar({
  orientation = 'vertical',
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseScrollArea.Scrollbar
      orientation={orientation}
      {...props}
      {...stylex.props(styles.scrollbar, scrollbarOrientations[orientation], style)}
    >
      <BaseScrollArea.Thumb {...stylex.props(styles.thumb)} />
    </BaseScrollArea.Scrollbar>
  );
}

const styles = stylex.create({
  root: {
    position: 'relative',
  },
  viewport: {
    borderRadius: 'inherit',
    height: '100%',
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    width: '100%',
  },
  scrollbar: {
    display: 'flex',
    padding: stroke.border,
    touchAction: 'none',
    userSelect: 'none',
  },
  thumb: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    flex: 1,
    position: 'relative',
  },
});

const scrollbarOrientations = stylex.create({
  vertical: {
    height: '100%',
    width: space.s25,
  },
  horizontal: {
    flexDirection: 'column',
    height: space.s25,
  },
});
