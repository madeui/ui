import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { space, fontSize, fontWeight, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);

export default function ScrollAreaDemo() {
  return (
    <ScrollArea style={styles.root}>
      <div {...stylex.props(styles.inner)}>
        <h4 {...stylex.props(styles.heading)}>Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div {...stylex.props(styles.tag)}>{tag}</div>
            <Separator />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}

const styles = stylex.create({
  root: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: container.xs,
    width: container.xs,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s2,
    padding: space.s4,
  },
  heading: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    margin: 0,
  },
  tag: {
    fontSize: fontSize.sm,
  },
});
