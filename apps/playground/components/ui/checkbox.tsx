'use client';

import * as React from 'react';

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import * as stylex from '@stylexjs/stylex';

import { stateProps } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

export interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
    'className' | 'style'
  > {
  style?: stylex.StyleXStyles;
}

export function Checkbox({ style, ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      {...props}
      {...stateProps(
        (s: { checked: boolean; indeterminate: boolean; disabled: boolean }) => [
          styles.root,
          (s.checked || s.indeterminate) && styles.rootChecked,
          s.disabled && styles.rootDisabled,
          style,
        ]
      )}
    >
      <BaseCheckbox.Indicator
        render={(indicatorProps, state) => (
          <span {...indicatorProps} {...stylex.props(styles.indicator)}>
            <svg
              width="12"
              height="12"
              viewBox={`0 0 12 12`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {state.indeterminate ? (
                <path d={`M2.5 6h7`} />
              ) : (
                <path d={`M2 6.5 4.5 9 10 3`} />
              )}
            </svg>
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.input,
    borderRadius: radius.sm,
    borderStyle: 'solid',
    borderWidth: '1px',
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    flexShrink: 0,
    height: '1rem',
    justifyContent: 'center',
    opacity: { default: 1, ':disabled': 0.5 },
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.ring}` },
    outlineOffset: '2px',
    padding: 0,
    transitionDuration: '150ms',
    transitionProperty: 'background-color, border-color',
    width: '1rem',
  },
  rootChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rootDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  indicator: {
    alignItems: 'center',
    color: colors.primaryForeground,
    display: 'flex',
    justifyContent: 'center',
  },
});
