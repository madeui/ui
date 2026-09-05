import * as stylex from '@stylexjs/stylex';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { container, fontSize, fontWeight, space } from '@/lib/constants.stylex';

export default function CarouselSpacing() {
  return (
    <Carousel style={styles.carousel}>
      <CarouselContent style={styles.content}>
        {Array.from({ length: 6 }, (_, index) => (
          <CarouselItem key={index} style={styles.item}>
            <Card style={styles.slide}>
              <span {...stylex.props(styles.number)}>{index + 1}</span>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

const styles = stylex.create({
  carousel: {
    maxWidth: container.lg,
    width: '100%',
  },
  // A tighter gap: the track's negative margin and each item's padding
  // must move together.
  content: {
    marginLeft: `calc(-1 * ${space.s1})`,
  },
  item: {
    flexBasis: '33.333%',
    paddingLeft: space.s1,
  },
  slide: {
    alignItems: 'center',
    aspectRatio: '1',
    justifyContent: 'center',
  },
  number: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
});
