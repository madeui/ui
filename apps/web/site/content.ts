import type { ContentPage } from './routes.ts';
import { changelogSource, docsSource } from './source.ts';

/**
 * Every content page (apps/docs/content/{docs,changelog}) reduced to what the
 * route list needs. `file` is relative to the content root.
 */
export function contentPages(): ContentPage[] {
  const docs = docsSource.getPages().map(
    (page): ContentPage => ({
      route: page.url,
      file: `docs/${page.path}`,
      title: page.data.title,
      description: page.data.description,
      order: page.data.sidebar?.order,
      badge: page.data.sidebar?.badge,
    }),
  );
  const changelog = changelogSource.getPages().map(
    (page): ContentPage => ({
      route: page.url,
      file: `changelog/${page.path}`,
      title: page.data.title,
      description: page.data.description,
      date: page.data.date,
    }),
  );
  return [...docs, ...changelog];
}
