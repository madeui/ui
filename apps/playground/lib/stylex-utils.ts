import * as stylex from '@stylexjs/stylex';

import { iconSize, stroke } from './constants.stylex';
import { colors } from './tokens.stylex';

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

// Base UI state styling needs no JS adapter: since StyleX 0.18, attribute
// selectors are valid condition keys, and Base UI mirrors every state as a
// data attribute — style it inline:
//
//   backgroundColor: { default: 'transparent', '[data-highlighted]': colors.accent }

/**
 * `icon` — box sizes for lucide icons (which default to 24px). Spread onto
 * the icon; CSS wins over the SVG's width/height attributes:
 *
 *   <Plus {...stylex.props(icon.md)} />
 *   <ChevronDown {...stylex.props(icon.sm, styles.chevron)} />
 *
 * `md` (16px) is the default for buttons, menus, and inputs.
 */
export const icon = stylex.create({
  xxs: { flexShrink: 0, height: iconSize.xxs, width: iconSize.xxs },
  xs: { flexShrink: 0, height: iconSize.xs, width: iconSize.xs },
  sm: { flexShrink: 0, height: iconSize.sm, width: iconSize.sm },
  md: { flexShrink: 0, height: iconSize.md, width: iconSize.md },
  lg: { flexShrink: 0, height: iconSize.lg, width: iconSize.lg },
});
