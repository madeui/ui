import * as stylex from '@stylexjs/stylex';

import { stroke } from './constants.stylex';
import { colors, shadow } from './tokens.stylex';

/** Re-exported so component files only import from one place. */
export type StyleXStyles = stylex.StyleXStyles;

/**
 * `ring` — the Tailwind `ring-*` equivalent, defined once as a StyleX dynamic
 * style. Draws the edge as a box-shadow instead of a border and composes like
 * any style:
 *
 *   {...stylex.props(styles.popup, ring({ shadow: shadow.md }), style)}
 *   {...stylex.props(styles.card, ring({ width: stroke.focus, color: colors.ring }))}
 *
 * Use it on popups instead of a border: Base UI's align-item-with-trigger
 * math ignores borders (a border shifts the aligned text by its width), and a
 * ring paints outside the box, overlapping the trigger's border for a single
 * crisp edge.
 */
const recipes = stylex.create({
  boxShadow: (value: string) => ({ boxShadow: value }),
});

export interface RingOptions {
  /** Ring thickness. Default: `stroke.border` (1px). */
  width?: string;
  /** Ring color. Default: `colors.border`. */
  color?: string;
  /** Extra drop shadow layered under the ring (e.g. `shadow.md`). Default: none. */
  shadow?: string | null;
}

export const ring = ({
  width = stroke.border,
  color = colors.border,
  shadow: drop = null,
}: RingOptions = {}) =>
  recipes.boxShadow(`0 0 0 ${width} ${color}${drop ? `, ${drop}` : ''}`);

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
