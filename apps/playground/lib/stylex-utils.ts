import * as stylex from '@stylexjs/stylex';

/** Re-exported so component files only import from one place. */
export type StyleXStyles = stylex.StyleXStyles;

/**
 * Adapter between StyleX and Base UI's state-driven styling.
 *
 * Base UI parts accept `className`/`style` as functions of the part's state
 * (checked, open, highlighted, ...). StyleX has no attribute selectors, so
 * state variants are expressed as conditional styles resolved per state:
 *
 *   <Switch.Root
 *     {...stateProps((s) => [styles.root, s.checked && styles.checked, style])}
 *   />
 */
export function stateProps<State>(
  resolve: (state: State) => ReadonlyArray<stylex.StyleXStyles | false | null | undefined>
) {
  return {
    className: (state: State) => stylex.props(...(resolve(state) as any)).className ?? '',
    style: (state: State) => stylex.props(...(resolve(state) as any)).style ?? {},
  };
}
