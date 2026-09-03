import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

// A region of a scene, named after the registry component(s) it is built
// from. The name is documentation for whoever edits the scene; the wrapper
// itself only carries layout.
type PartProps = {
  /** Component slug(s) as in /docs/components/<slug>. */
  name: string | string[];
  /** Fill the parent's flex/grid cell. */
  grow?: boolean;
  style?: stylex.StyleXStyles;
  children: React.ReactNode;
};

export function Part({ grow, style, children }: PartProps) {
  return <div {...stylex.props(styles.part, grow && styles.grow, style)}>{children}</div>;
}

const styles = stylex.create({
  part: {
    minWidth: 0,
    position: 'relative',
  },
  grow: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
});
