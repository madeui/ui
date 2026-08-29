import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Separator } from '@/components/ui/separator';
import { space, fontSize, fontWeight, container } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

const notifications = [
  { title: 'Your invoice has been paid', time: '2h ago' },
  { title: 'New comment on your PR', time: '4h ago' },
  { title: 'Weekly digest is ready', time: '1d ago' },
];

export default function SeparatorList() {
  return (
    <div {...stylex.props(styles.root)}>
      {notifications.map((item, index) => (
        <React.Fragment key={item.title}>
          {index > 0 && <Separator />}
          <div {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.title)}>{item.title}</span>
            <span {...stylex.props(styles.time)}>{item.time}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s3,
    width: container.sm,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  time: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
