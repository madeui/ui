import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';

import { docs } from '@/components/site/site.stylex';
import { breakpoint, fontSize, fontWeight, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';
import { listExamples } from '@/site/examples';
import { Example } from '@/site/examples.generated';
import { registryComponents, showcaseSections } from '@/site/showcase';

// The Showcase: every registry component with all its Examples, live, one
// section per component, for eyeballing and for the local VRT
// (scripts/vrt.mts screenshots each `data-showcase` section). A page only in
// dev and in SHOWCASE=1 builds; see pageExtensions in next.config.mjs.
// Examples load through the same Example map the docs pages use.

export const metadata: Metadata = {
  title: 'Showcase',
  robots: { index: false, follow: false },
};

export default function ShowcasePage() {
  const sections = showcaseSections(registryComponents(), listExamples());
  return (
    <main {...stylex.props(styles.main)}>
      <h1 {...stylex.props(styles.title)}>Showcase</h1>
      {sections.map((section) => (
        <section key={section.name} id={section.name} data-showcase={section.name} {...stylex.props(styles.section)}>
          <h2 {...stylex.props(styles.heading)}>{section.title}</h2>
          <div {...stylex.props(styles.grid)}>
            {section.examples.map((path) => (
              <figure key={path} data-example={path} {...stylex.props(styles.example)}>
                <figcaption {...stylex.props(styles.caption)}>{path}</figcaption>
                <div {...stylex.props(styles.preview)}>
                  <Example path={path} />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

const styles = stylex.create({
  main: {
    paddingBlock: space.s10,
    paddingInline: space.s8,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBlock: 0,
  },
  section: {
    paddingBlock: space.s6,
  },
  heading: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBlockEnd: space.s4,
    marginBlockStart: 0,
  },
  grid: {
    display: 'grid',
    gap: space.s4,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoint.lg]: 'repeat(2, minmax(0, 1fr))',
    },
  },
  example: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    minWidth: 0,
  },
  caption: {
    borderBlockEndColor: colors.border,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: stroke.border,
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
  preview: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: docs.previewMinHeight,
    paddingBlock: space.s10,
    paddingInline: space.s6,
  },
});
