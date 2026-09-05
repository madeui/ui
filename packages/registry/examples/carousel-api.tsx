'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { container, fontSize, fontWeight, space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

const SLIDES = [1, 2, 3, 4, 5];

export default function CarouselApiExample() {
  const [api, setApi] = React.useState<CarouselApi>();
  // Seeded from the slide list so the first paint reads "Slide 1 of 5"
  // instead of "Slide 0 of 0"; Embla corrects both once it has measured.
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(SLIDES.length);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  return (
    <div {...stylex.props(styles.root)}>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide}>
              <Card style={styles.slide}>
                <span {...stylex.props(styles.number)}>{slide}</span>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <p {...stylex.props(styles.status)}>{`Slide ${current} of ${count}`}</p>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
    maxWidth: container.md,
    width: '100%',
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
  status: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    margin: 0,
    textAlign: 'center',
  },
});
