'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import Autoplay from 'embla-carousel-autoplay';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { container, fontSize, fontWeight } from '@/lib/constants.stylex';

export default function CarouselAutoplay() {
  // One plugin instance for the component's lifetime; it pauses while the
  // pointer is over the carousel and keeps going after button clicks.
  const autoplay = React.useRef(
    Autoplay({ delay: 2000, stopOnMouseEnter: true, stopOnInteraction: false })
  );

  return (
    <Carousel opts={{ loop: true }} plugins={[autoplay.current]} style={styles.carousel}>
      <CarouselContent>
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
  carousel: {
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
});
