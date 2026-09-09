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
  // `rootNode` moves Autoplay's mouse listeners from the scroll viewport up
  // to the carousel root, so hovering the previous/next buttons — which sit
  // outside the viewport — pauses it too.
  const [autoplay] = React.useState(() =>
    Autoplay({
      delay: 2000,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
      stopOnFocusIn: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplay]}
      style={styles.carousel}
      // Autoplay's own `stopOnFocusIn` reacts to focus landing on a slide, so
      // the previous/next buttons would never pause it and a keyboard user
      // could not stop the slides. Pause on any focus inside the carousel and
      // resume when focus leaves, unless the pointer is still over it —
      // Autoplay restarts that case itself on mouse leave.
      onFocus={() => autoplay.stop()}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        if (!event.currentTarget.matches(':hover')) autoplay.play();
      }}
    >
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
