'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { space, duration, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, radius } from '@/lib/tokens.stylex';

// Embla's public types, taken from the React binding so consumers only need
// `embla-carousel-react` installed (the core package is its transitive
// dependency and is not guaranteed to be resolvable from the app).
export type CarouselApi = NonNullable<UseEmblaCarouselType[1]>;
export type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;
export type CarouselPlugins = NonNullable<Parameters<typeof useEmblaCarousel>[1]>;

export type CarouselOrientation = 'horizontal' | 'vertical';

interface StyleProp {
  /** StyleX styles merged last — always win over the component's own. */
  style?: stylex.StyleXStyles;
}

type DivProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'style'>;

interface CarouselContextValue {
  carouselRef: UseEmblaCarouselType[0];
  api: CarouselApi | undefined;
  orientation: CarouselOrientation;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  snapCount: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('Carousel parts must be used within <Carousel>.');
  }
  return context;
}

export interface CarouselProps extends DivProps, StyleProp {
  /** Embla options (`loop`, `align`, `dragFree`, …). `axis` is derived from `orientation`. */
  opts?: CarouselOptions;
  /** Embla plugins, e.g. `Autoplay()` from `embla-carousel-autoplay`. */
  plugins?: CarouselPlugins;
  orientation?: CarouselOrientation;
  /** Receives the Embla API once the carousel has initialised. */
  setApi?: (api: CarouselApi) => void;
}

export function Carousel({
  opts,
  plugins,
  orientation = 'horizontal',
  setApi,
  style,
  children,
  onKeyDownCapture,
  ...props
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);
  const scrollTo = React.useCallback((index: number) => api?.scrollTo(index), [api]);

  React.useEffect(() => {
    if (!api) return;
    const sync = (instance: CarouselApi) => {
      setCanScrollPrev(instance.canScrollPrev());
      setCanScrollNext(instance.canScrollNext());
      setSelectedIndex(instance.selectedScrollSnap());
      setSnapCount(instance.scrollSnapList().length);
    };
    sync(api);
    api.on('init', sync);
    api.on('reInit', sync);
    api.on('select', sync);
    return () => {
      api.off('init', sync);
      api.off('reInit', sync);
      api.off('select', sync);
    };
  }, [api]);

  React.useEffect(() => {
    if (api && setApi) setApi(api);
  }, [api, setApi]);

  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCapture?.(event);
    if (event.defaultPrevented) return;
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === prevKey) {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === nextKey) {
      event.preventDefault();
      scrollNext();
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        scrollTo,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        snapCount,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        {...props}
        onKeyDownCapture={handleKeyDownCapture}
        {...stylex.props(styles.root, style)}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/**
 * Viewport + slide track. `style` (and all other props) land on the inner
 * flex track — override `marginLeft` (horizontal) / `marginTop` (vertical)
 * there to change the slide gap, together with the matching padding on
 * `CarouselItem`. Vertical carousels need a fixed `height` here.
 */
export function CarouselContent({ style, ...props }: DivProps & StyleProp) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} {...stylex.props(styles.viewport)}>
      <div
        {...props}
        {...stylex.props(styles.track, trackOrientations[orientation], style)}
      />
    </div>
  );
}

/**
 * One slide. Override `flexBasis` via `style` to show several slides per
 * view; override `paddingLeft` (horizontal) / `paddingTop` (vertical) to
 * change the gap, together with the matching margin on `CarouselContent`.
 */
export function CarouselItem({ style, ...props }: DivProps & StyleProp) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      {...props}
      {...stylex.props(styles.item, itemOrientations[orientation], style)}
    />
  );
}

export type CarouselButtonProps = Omit<ButtonProps, 'children'>;

export function CarouselPrevious({
  variant = 'outline',
  size = 'iconSm',
  style,
  ...props
}: CarouselButtonProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      variant={variant}
      size={size}
      aria-label="Previous slide"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
      style={[styles.navButton, previousPositions[orientation], style]}
    >
      <ArrowLeft
        {...stylex.props(icon.md, orientation === 'vertical' && styles.rotated)}
      />
    </Button>
  );
}

export function CarouselNext({
  variant = 'outline',
  size = 'iconSm',
  style,
  ...props
}: CarouselButtonProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      variant={variant}
      size={size}
      aria-label="Next slide"
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
      style={[styles.navButton, nextPositions[orientation], style]}
    >
      <ArrowRight
        {...stylex.props(icon.md, orientation === 'vertical' && styles.rotated)}
      />
    </Button>
  );
}

/** One dot button per scroll snap; the active one is `aria-current="true"`. */
export function CarouselDots({ style, ...props }: DivProps & StyleProp) {
  const { snapCount, selectedIndex, scrollTo } = useCarousel();
  return (
    <div {...props} {...stylex.props(styles.dots, style)}>
      {Array.from({ length: snapCount }, (_, index) => {
        const active = index === selectedIndex;
        return (
          <button
            key={index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={active ? 'true' : undefined}
            onClick={() => scrollTo(index)}
            {...stylex.props(styles.dotButton)}
          >
            <span {...stylex.props(styles.dot, active && styles.dotActive)} />
          </button>
        );
      })}
    </div>
  );
}

const styles = stylex.create({
  root: {
    position: 'relative',
  },
  viewport: {
    overflow: 'hidden',
  },
  track: {
    display: 'flex',
  },
  item: {
    boxSizing: 'border-box',
    flexBasis: '100%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  },
  navButton: {
    borderRadius: radius.full,
    position: 'absolute',
  },
  rotated: {
    rotate: '90deg',
  },
  dots: {
    display: 'flex',
    gap: space.s2,
    justifyContent: 'center',
    marginTop: space.s4,
  },
  dotButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius.full,
    borderStyle: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    height: space.s4,
    justifyContent: 'center',
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    outlineOffset: stroke.focus,
    padding: 0,
    width: space.s4,
  },
  dot: {
    backgroundColor: {
      default: colors.border,
      ':hover': colors.mutedForeground,
    },
    borderRadius: radius.full,
    height: space.s2,
    transitionDuration: duration.fast,
    transitionProperty: 'background-color',
    width: space.s2,
  },
  dotActive: {
    backgroundColor: {
      default: colors.primary,
      ':hover': colors.primary,
    },
  },
});

// The track carries a negative margin equal to the slide gap; each item pays
// it back as padding, so the first slide sits flush with the viewport edge.
const trackOrientations = stylex.create({
  horizontal: {
    flexDirection: 'row',
    marginLeft: `calc(-1 * ${space.s4})`,
  },
  vertical: {
    flexDirection: 'column',
    marginTop: `calc(-1 * ${space.s4})`,
  },
});

const itemOrientations = stylex.create({
  horizontal: {
    paddingLeft: space.s4,
  },
  vertical: {
    paddingTop: space.s4,
  },
});

// Nav buttons sit outside the viewport, centred on the cross axis. `translate`
// (not `transform`) so Button's own press-nudge transform still applies.
const previousPositions = stylex.create({
  horizontal: {
    left: `calc(-1 * ${space.s12})`,
    top: '50%',
    translate: '0 -50%',
  },
  vertical: {
    left: '50%',
    top: `calc(-1 * ${space.s12})`,
    translate: '-50% 0',
  },
});

const nextPositions = stylex.create({
  horizontal: {
    right: `calc(-1 * ${space.s12})`,
    top: '50%',
    translate: '0 -50%',
  },
  vertical: {
    bottom: `calc(-1 * ${space.s12})`,
    left: '50%',
    translate: '-50% 0',
  },
});
