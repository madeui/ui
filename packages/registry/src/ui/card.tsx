'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface DivProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> {
  style?: stylex.StyleXStyles;
}

export function Card({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.root, style)} />;
}

export function CardHeader({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.header, style)} />;
}

export function CardTitle({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'h3'>, 'className' | 'style'> & {
  style?: stylex.StyleXStyles;
}) {
  return <h3 {...props} {...stylex.props(styles.title, style)} />;
}

export function CardDescription({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'p'>, 'className' | 'style'> & {
  style?: stylex.StyleXStyles;
}) {
  return <p {...props} {...stylex.props(styles.description, style)} />;
}

export function CardContent({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.content, style)} />;
}

export function CardFooter({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.footer, style)} />;
}

const styles = stylex.create({
  root: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: '1px',
    boxShadow: shadow.sm,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: '1.25rem',
    paddingBlock: '1.25rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    paddingInline: '1.25rem',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.3,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    margin: 0,
  },
  content: {
    paddingInline: '1.25rem',
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
    paddingInline: '1.25rem',
  },
});
