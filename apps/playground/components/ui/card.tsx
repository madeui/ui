'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, stroke } from '@/lib/constants.stylex';
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
    borderWidth: stroke.border,
    boxShadow: shadow.sm,
    color: colors.cardForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s5,
    paddingBlock: space.s5,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s15,
    paddingInline: space.s5,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    margin: 0,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
  },
  content: {
    paddingInline: space.s5,
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: space.s2,
    paddingInline: space.s5,
  },
});
