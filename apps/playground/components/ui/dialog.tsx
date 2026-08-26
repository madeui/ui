'use client';

import * as React from 'react';

import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import * as stylex from '@stylexjs/stylex';

import { space, fontSize, lineHeight, fontWeight, z, duration, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius, shadow } from '@/lib/tokens.stylex';

interface StyleXStyleProps {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogPortal = BaseDialog.Portal;
export const DialogClose = BaseDialog.Close;

export function DialogOverlay({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseDialog.Backdrop {...props} {...stylex.props(styles.overlay, style)} />
  );
}

export function DialogContent({
  style,
  children,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseDialog.Portal>
      <DialogOverlay />
      <BaseDialog.Popup {...props} {...stylex.props(styles.content, style)}>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> &
  StyleXStyleProps) {
  return <div {...props} {...stylex.props(styles.header, style)} />;
}

export function DialogFooter({
  style,
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'> &
  StyleXStyleProps) {
  return <div {...props} {...stylex.props(styles.footer, style)} />;
}

export function DialogTitle({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return <BaseDialog.Title {...props} {...stylex.props(styles.title, style)} />;
}

export function DialogDescription({
  style,
  ...props
}: Omit<
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>,
  'className' | 'style'
> &
  StyleXStyleProps) {
  return (
    <BaseDialog.Description
      {...props}
      {...stylex.props(styles.description, style)}
    />
  );
}

const overlayIn = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const contentIn = stylex.keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-50%, -50%) scale(0.97)',
  },
  to: {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
});

const styles = stylex.create({
  overlay: {
    animationDuration: duration.fast,
    animationName: overlayIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.overlay,
    inset: 0,
    position: 'fixed',
    zIndex: z.popup,
  },
  content: {
    animationDuration: duration.fast,
    animationName: contentIn,
    animationTimingFunction: 'ease-out',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    boxShadow: shadow.lg,
    color: colors.popoverForeground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s4,
    left: '50%',
    maxWidth: `calc(100% - ${space.s8})`,
    padding: space.s6,
    position: 'fixed',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: container.xxl,
    zIndex: z.popup,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s15,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    gap: space.s2,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: fontSize.lg,
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
});
