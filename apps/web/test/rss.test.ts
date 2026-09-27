import { describe, expect, test } from 'vitest';

import { rssFeed } from '../site/artifacts/rss.ts';
import { pages } from './fixtures/content.ts';

describe('changelog/rss.xml', () => {
  const changelog = pages.filter((page) => page.route.startsWith('/changelog/'));
  const xml = rssFeed(changelog);

  test('RSS 2.0 channel for the changelog, entries newest first with a permalink GUID', () => {
    expect(xml).toBe(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>madeui — Changelog</title>
  <link>https://madeui.com</link>
  <description>Base UI + StyleX components you own. Agent-friendly by design.</description>
  <atom:link href="https://madeui.com/changelog/rss.xml" rel="self" type="application/rss+xml" />
  <item>
    <title>v1.1.0</title>
    <link>https://madeui.com/changelog/v1-1-0</link>
    <guid isPermaLink="true">https://madeui.com/changelog/v1-1-0</guid>
    <pubDate>Wed, 09 Sep 2026 00:00:00 GMT</pubDate>
  </item>
  <item>
    <title>v1.0.0</title>
    <link>https://madeui.com/changelog/v1-0-0</link>
    <guid isPermaLink="true">https://madeui.com/changelog/v1-0-0</guid>
    <pubDate>Wed, 02 Sep 2026 00:00:00 GMT</pubDate>
  </item>
</channel>
</rss>
`);
  });

  test('titles are XML-escaped; a description is only written when the entry has one', () => {
    const [entry] = changelog;
    const out = rssFeed([{ ...entry!, title: 'Tabs & <Toast>', description: 'New "line" variant' }]);
    expect(out).toContain('<title>Tabs &amp; &lt;Toast&gt;</title>');
    expect(out).toContain('<description>New &quot;line&quot; variant</description>');
  });
});
