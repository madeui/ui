import * as stylex from '@stylexjs/stylex';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { container, fontSize, fontWeight } from '@/lib/constants.stylex';

export default function CarouselSizes() {
  return (
    <Carousel style={styles.carousel}>
      <CarouselContent>
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
  // Three slides per view: each item takes a third of the track.
  item: {
    flexBasis: '33.333%',
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
