import { describe, expect, test } from 'vitest';

import { llmsFull, llmsIndex } from '../site/artifacts/llms.ts';
import { buttonDemo, pages, resolve, sources } from './fixtures/content.ts';

describe('llms.txt', () => {
  const text = llmsIndex(pages);

  test('mirrors the sidebar: a heading per group, changelog newest first, the feed last', () => {
    expect(text).toBe(
      [
        '# madeui',
        '> Base UI + StyleX components you own. Agent-friendly by design.',
        '## Changelog',
        '- [v1.1.0](https://madeui.com/changelog/v1-1-0)\n- [v1.0.0](https://madeui.com/changelog/v1-0-0)',
        '## Docs',
        '- [Introduction](https://madeui.com/docs): Components you own.',
        '### Components',
        '- [Button](https://madeui.com/docs/components/button): Displays a button …',
        '## RSS Feeds',
        '- [madeui — Changelog](https://madeui.com/changelog/rss.xml)',
      ].join('\n\n') + '\n',
    );
  });

  test('a group with no pages of its own still heads its subgroups', () => {
    const componentsOnly = pages.filter((page) => page.route.startsWith('/docs/components/'));
    expect(llmsIndex(componentsOnly)).toContain('\n\n## Docs\n\n### Components\n\n- [Button]');
  });
});

describe('llms-full.txt', () => {
  const text = llmsFull(sources, resolve);
  const sections = text.split('\n\n---\n\n');

  test('one section per page, sorted by route', () => {
    const urls = [...text.matchAll(/^Source: (.+)$/gmu)].map((match) => match[1]);
    expect(urls).toEqual([
      'https://madeui.com/changelog/v1-0-0',
      'https://madeui.com/changelog/v1-1-0',
      'https://madeui.com/docs',
      'https://madeui.com/docs/components/button',
    ]);
    expect(sections).toHaveLength(4);
  });

  test('header, then "# title", "Source: url", a blank line and the body without frontmatter', () => {
    expect(sections[0]).toBe(
      '# madeui\n\n> Base UI + StyleX components you own. Agent-friendly by design.\n\n' +
        '# v1.0.0\nSource: https://madeui.com/changelog/v1-0-0\n\nThe first release.',
    );
    expect(sections.at(-1)!.endsWith('<Component path="does-not-exist" />\n')).toBe(true);
    expect(text.endsWith('\n') && !text.endsWith('\n\n')).toBe(true);
  });

  test("bodies carry each Example's source as a fenced block", () => {
    expect(sections[3]).toContain(
      `Source: https://madeui.com/docs/components/button\n\n\`\`\`tsx\n${buttonDemo.trimEnd()}\n\`\`\`\n\n## Install`,
    );
  });
});
