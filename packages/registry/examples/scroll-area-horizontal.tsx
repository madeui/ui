import * as stylex from '@stylexjs/stylex';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { space, fontSize, fontWeight, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

const artworks = [
  { title: 'Ocean Horizon', artist: 'Reyes' },
  { title: 'Desert Bloom', artist: 'Okafor' },
  { title: 'City Lights', artist: 'Petrova' },
  { title: 'Quiet Forest', artist: 'Lindgren' },
  { title: 'Northern Sky', artist: 'Haruki' },
  { title: 'Red Canyon', artist: 'Alvarez' },
];

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea style={styles.root}>
      <div {...stylex.props(styles.row)}>
        {artworks.map((art) => (
          <div key={art.title} {...stylex.props(styles.card)}>
            <div {...stylex.props(styles.thumb)} />
            <div {...stylex.props(styles.title)}>{art.title}</div>
            <div {...stylex.props(styles.artist)}>{art.artist}</div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

const styles = stylex.create({
  root: {
    width: container.xl,
  },
  row: {
    display: 'flex',
    gap: space.s4,
    paddingBottom: space.s4,
    width: 'max-content',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s2,
    width: container.card,
  },
  thumb: {
    backgroundColor: colors.muted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: space.s16,
    width: '100%',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  artist: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
