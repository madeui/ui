'use client';

import * as React from 'react';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, duration, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

interface StyleXStyleProps {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export function Accordion({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Root>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return <BaseAccordion.Root {...props} {...stylex.props(styles.root, style)} />;
}

export function AccordionItem({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return <BaseAccordion.Item {...props} {...stylex.props(styles.item, style)} />;
}

export function AccordionTrigger({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseAccordion.Header {...stylex.props(styles.header)}>
      <BaseAccordion.Trigger {...props} {...stylex.props(styles.trigger, style)}>
        {children}
        <svg
          width="16"
          height="16"
          viewBox={`0 0 16 16`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          {...stylex.props(styles.chevron)}
        >
          <path d={`m3 6 5 5 5-5`} />
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionContent({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseAccordion.Panel {...props} {...stylex.props(styles.panel)}>
      <div {...stylex.props(styles.inner, style)}>{children}</div>
    </BaseAccordion.Panel>
  );
}

const panelDown = stylex.keyframes({
  from: { height: 0 },
  to: { height: 'var(--accordion-panel-height)' },
});

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    width: '100%',
  },
  item: {
    borderBottomColor: colors.border,
    borderBottomStyle: { default: 'solid', ':last-child': 'none' },
    borderBottomWidth: { default: stroke.border, ':last-child': 0 },
  },
  header: {
    display: 'flex',
    margin: 0,
  },
  trigger: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    flex: 1,
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    gap: space.s4,
    justifyContent: 'space-between',
    lineHeight: lineHeight.control,
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    // Read by the chevron below — StyleX has no child selectors, so the
    // trigger's [data-panel-open] state travels via a custom property.
    // No `default` here: StyleX emits it unlayered, beating the layered
    // [data-*] rule; the chevron's var() fallback covers the closed state.
    '--accordion-trigger-rotation': {
      default: null,
      '[data-panel-open]': '180deg',
    },
    paddingBlock: space.s25,
    paddingInline: 0,
    textAlign: 'left',
    textDecoration: { default: 'none', ':hover': 'underline' },
  },
  chevron: {
    color: colors.mutedForeground,
    flexShrink: 0,
    marginLeft: 'auto',
    marginTop: space.s05,
    pointerEvents: 'none',
    transform: 'rotate(var(--accordion-trigger-rotation, 0deg))',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
  },
  panel: {
    animationDuration: duration.fast,
    animationName: panelDown,
    animationTimingFunction: 'ease-out',
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    overflow: 'hidden',
  },
  inner: {
    paddingBottom: space.s25,
  },
});
