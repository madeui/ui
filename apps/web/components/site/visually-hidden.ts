import * as stylex from '@stylexjs/stylex';

import { space } from '@/lib/constants.stylex';

/**
 * Text that assistive technology reads but the page does not show: a status
 * message, a label an icon stands in for.
 *
 *   <span {...stylex.props(visuallyHidden.always)}>Actions</span>
 *   <a href="#content" {...stylex.props(styles.skip, visuallyHidden.untilFocus)}>…</a>
 */
export const visuallyHidden = stylex.create({
  always: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: space.px,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: space.px,
  },
  /** Clipped away until it takes keyboard focus (a skip link); the element keeps its own box. */
  untilFocus: {
    clipPath: { default: 'inset(50%)', ':focus-visible': 'none' },
  },
});
