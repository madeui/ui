# Embla Carousel (Carousel)

Researched 2026-09-05 for the `carousel` registry item.

## Facts

- `embla-carousel-react` 8.6.0 (2026-08-21); peer React 16.8 through 19; only
  dependencies are `embla-carousel` and `embla-carousel-reactive-utils`.
- Ships no CSS. The consumer provides: viewport `overflow: hidden`, container
  `display: flex`, slides `flex: 0 0 100%`. Source:
  https://www.embla-carousel.com/get-started/react/
- Plugins (autoplay, wheel gestures, ...) are separate packages.

## Decisions

- Parts: `Carousel` (opts, plugins, orientation, setApi), `CarouselContent`,
  `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselDots`.
- Slide gap comes from the `space` scale; users change slide size and gap by
  passing `style` to `CarouselContent` and `CarouselItem`. No `gap` variant
  prop: it is a measure, not a variant.
- Autoplay is shown as a docs example with `embla-carousel-autoplay`, which the
  user installs; it is not a dependency of the registry item.
