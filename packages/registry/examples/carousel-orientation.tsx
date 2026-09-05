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

export default function CarouselOrientation() {
  return (
    <Carousel orientation="vertical" style={styles.carousel}>
      <CarouselContent style={styles.content}>
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselItem key={index}>
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
  // Room for the previous/next buttons, which sit above and below the track.
  carousel: {
    marginBlock: space.s12,
    maxWidth: container.md,
    width: '100%',
  },
  // A vertical track needs a fixed height; slides fill it.
  content: {
    height: container.xs,
  },
  slide: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  number: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
  },
});
