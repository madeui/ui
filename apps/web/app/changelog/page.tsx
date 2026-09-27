import * as stylex from '@stylexjs/stylex';
import type { Metadata } from 'next';

import { ChangelogUpdate } from '@/components/site/changelog-update';
import { PageTitle, proseComponents } from '@/components/site/prose';
import { layout } from '@/components/site/site.stylex';
import { SiteHeader } from '@/components/site/site-header';
import { breakpoint, space } from '@/lib/constants.stylex';
import { changelogEntries } from '@/site/changelog';
import { contentPages } from '@/site/content';
import { sidebar } from '@/site/nav';
import { changelogSource } from '@/site/source';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Product updates, new features, and fixes from every release.',
};

/**
 * The changelog index: every entry newest first, each with its full body.
 * A bare page (no sidebar, no ToC); below lg the header's drawer lists the
 * entries, as on an entry page.
 */
export default function ChangelogIndex() {
  const pages = contentPages();
  const entries = changelogEntries(pages);
  const bodies = new Map(changelogSource.getPages().map((page) => [page.url, page.data.body]));
  return (
    <>
      <SiteHeader nav={{ label: 'Changelog', groups: sidebar(pages, '/changelog') }} />
      <main id="content" {...stylex.props(styles.main)}>
        <article {...stylex.props(styles.column)}>
          <PageTitle title="Changelog" />
          {entries.length === 0 ? (
            <p>No changelog entries yet.</p>
          ) : (
            <div>
              {entries.map((entry) => {
                const Body = bodies.get(entry.route)!;
                return (
                  <ChangelogUpdate key={entry.route} entry={entry}>
                    <Body components={proseComponents} />
                  </ChangelogUpdate>
                );
              })}
            </div>
          )}
        </article>
      </main>
    </>
  );
}

const styles = stylex.create({
  main: {
    paddingBlockEnd: space.s10,
    paddingBlockStart: space.s6,
    paddingInline: { default: space.s6, [breakpoint.lg]: space.s8, [breakpoint.xl]: space.s10 },
  },
  column: {
    marginInline: 'auto',
    maxWidth: layout.bare,
  },
});
