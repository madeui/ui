'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { space, fontSize, lineHeight, fontWeight } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

interface StyleProp {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

type DivProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> &
  StyleProp;

export function FieldSet({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'fieldset'>, 'className' | 'style'> &
  StyleProp) {
  return <fieldset {...props} {...stylex.props(styles.set, style)} />;
}

export type FieldLegendVariant = 'legend' | 'label';

export function FieldLegend({
  variant = 'legend',
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'legend'>, 'className' | 'style'> &
  StyleProp & { variant?: FieldLegendVariant }) {
  return (
    <legend
      {...props}
      {...stylex.props(styles.legend, legendVariants[variant], style)}
    />
  );
}

export function FieldGroup({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.group, style)} />;
}

export type FieldOrientation = 'vertical' | 'horizontal';

export function Field({
  orientation = 'vertical',
  style,
  ...props
}: DivProps & { orientation?: FieldOrientation }) {
  return (
    <div
      role="group"
      {...props}
      {...stylex.props(styles.field, orientations[orientation], style)}
    />
  );
}

export function FieldContent({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.content, style)} />;
}

export function FieldLabel({
  style,
  ...props
}: React.ComponentPropsWithoutRef<typeof Label>) {
  return <Label {...props} style={[styles.label, style]} />;
}

export function FieldTitle({ style, ...props }: DivProps) {
  return <div {...props} {...stylex.props(styles.title, style)} />;
}

export function FieldDescription({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'p'>, 'className' | 'style'> &
  StyleProp) {
  return <p {...props} {...stylex.props(styles.description, style)} />;
}

export function FieldSeparator({
  children,
  style,
  ...props
}: DivProps) {
  return (
    <div {...props} {...stylex.props(styles.separator, style)}>
      <Separator style={styles.separatorLine} />
      {children && (
        <span {...stylex.props(styles.separatorContent)}>{children}</span>
      )}
    </div>
  );
}

export function FieldError({
  children,
  errors,
  style,
  ...props
}: DivProps & { errors?: Array<{ message?: string } | undefined> }) {
  const content = React.useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;
    const unique = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ].filter((error): error is { message: string } => !!error?.message);
    if (unique.length === 0) return null;
    if (unique.length === 1) return unique[0].message;
    return (
      <ul {...stylex.props(styles.errorList)}>
        {unique.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div role="alert" {...props} {...stylex.props(styles.error, style)}>
      {content}
    </div>
  );
}

const styles = stylex.create({
  set: {
    borderStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s4,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  legend: {
    fontWeight: fontWeight.medium,
    marginBottom: space.s15,
    padding: 0,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s5,
    width: '100%',
  },
  field: {
    display: 'flex',
    fontFamily: font.sans,
    gap: space.s2,
    width: '100%',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: space.s05,
    lineHeight: lineHeight.snug,
  },
  label: {
    lineHeight: lineHeight.snug,
    width: 'fit-content',
  },
  title: {
    alignItems: 'center',
    display: 'flex',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    gap: space.s2,
    lineHeight: lineHeight.snug,
    width: 'fit-content',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    margin: 0,
    textAlign: 'left',
  },
  separator: {
    fontSize: fontSize.sm,
    height: space.s5,
    marginBlock: `calc(-1 * ${space.s2})`,
    position: 'relative',
  },
  separatorLine: {
    inset: 0,
    position: 'absolute',
    top: '50%',
  },
  separatorContent: {
    backgroundColor: colors.background,
    color: colors.mutedForeground,
    display: 'block',
    marginInline: 'auto',
    paddingInline: space.s2,
    position: 'relative',
    width: 'fit-content',
  },
  error: {
    color: colors.destructive,
    fontSize: fontSize.sm,
  },
  errorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s1,
    listStyle: 'disc',
    margin: 0,
    paddingLeft: space.s4,
  },
});

const legendVariants = stylex.create({
  legend: {
    fontSize: fontSize.base,
  },
  label: {
    fontSize: fontSize.sm,
  },
});

const orientations = stylex.create({
  vertical: {
    flexDirection: 'column',
  },
  horizontal: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
