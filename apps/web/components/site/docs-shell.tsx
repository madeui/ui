import type { ReactNode } from 'react';

import * as stylex from '@stylexjs/stylex';

import { Feedback } from '@/components/site/feedback';
import { PageActions } from '@/components/site/page-actions';
import { MobileToc, Toc, type TocItem } from '@/components/site/toc';
import { Pager } from '@/components/site/pager';
import { PageTitle } from '@/components/site/prose';
import { SidebarNav } from '@/components/site/sidebar-nav';
import { SiteHeader } from '@/components/site/site-header';
import { WebMcp } from '@/components/site/web-mcp';
import { layout } from '@/components/site/site.stylex';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { breakpoint, fontSize, lineHeight, space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';
import type { NavLink, SidebarGroup } from '@/site/nav';

/**
 * The docs layout: header, then sidebar | content | ToC. The sidebar sits in
 * the layout, so it survives client navigations (and keeps its scroll); each
 * page renders its own content column and ToC rail into the grid.
 */
export function DocsShell({ label, groups, children }: { label: string; groups: SidebarGroup[]; children: ReactNode }) {
  return (
    <>
      <SiteHeader nav={{ label, groups }} />
      <div {...stylex.props(styles.grid)}>
        <aside aria-label="Primary" {...stylex.props(styles.sidebar)}>
          <SidebarNav label={label} groups={groups} />
        </aside>
        {children}
      </div>
      <WebMcp />
    </>
  );
}

/** One docs page: eyebrow, mobile ToC, title + lead, the MDX body, prev/next; the ToC rail beside it. */
export function DocsPage({
  title,
  description,
  eyebrow,
  toc,
  prev,
  next,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  toc: TocItem[];
  prev?: NavLink;
  next?: NavLink;
  children: ReactNode;
}) {
  return (
    <>
      <main id="content" {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.column)}>
          {eyebrow === undefined ? null : (
            <Breadcrumb aria-label="Breadcrumb" style={styles.eyebrow}>
              <BreadcrumbList>
                <BreadcrumbItem>{eyebrow}</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
          {toc.length === 0 ? null : (
            <div {...stylex.props(styles.mobileToc)}>
              <MobileToc items={toc} />
            </div>
          )}
          <article>
            <PageTitle title={title} description={description} />
            {children}
          </article>
          <Feedback />
          <Pager prev={prev} next={next} />
        </div>
      </main>
      <aside aria-label="On this page" {...stylex.props(styles.rail)}>
        {toc.length === 0 ? null : <Toc items={toc} />}
        <PageActions />
      </aside>
    </>
  );
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      [breakpoint.lg]: `${layout.sidebar} minmax(0, 1fr)`,
      [breakpoint.xl]: `${layout.sidebar} minmax(0, 1fr) ${layout.toc}`,
    },
  },
  // Sidebar and ToC rail stay in view under the sticky header. The sidebar
  // is a native scroll area: no script, and its thin scrollbar follows the
  // theme through the color tokens.
  sidebar: {
    display: { default: 'none', [breakpoint.lg]: 'block' },
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    paddingBlockEnd: space.s6,
    paddingBlockStart: space.s4,
    paddingInline: space.s4,
    scrollbarColor: `${colors.border} transparent`,
    scrollbarWidth: 'thin',
    height: `calc(100dvh - ${layout.header})`,
    position: 'sticky',
    top: layout.header,
  },

  main: {
    minWidth: 0,
    paddingBlockEnd: space.s10,
    paddingBlockStart: space.s6,
    paddingInline: { default: space.s6, [breakpoint.lg]: space.s8, [breakpoint.xl]: space.s10 },
  },
  column: {
    marginInline: 'auto',
    maxWidth: layout.content,
  },
  eyebrow: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.control,
    marginBlockEnd: space.s2,
  },
  mobileToc: {
    display: { default: 'block', [breakpoint.xl]: 'none' },
    marginBlockEnd: space.s6,
  },
  rail: {
    display: { default: 'none', [breakpoint.xl]: 'block' },
    height: `calc(100dvh - ${layout.header})`,
    position: 'sticky',
    top: layout.header,
    overflowY: 'auto',
    paddingBlockEnd: space.s10,
    paddingBlockStart: space.s6,
    paddingInline: space.s4,
  },
});
