import { describe, expect, test } from 'vitest';

import { agentReadability } from '../site/artifacts/agent-readability.ts';
import { robots } from '../site/artifacts/robots.ts';

describe('robots.txt', () => {
  test('allows every crawler, declares Content-Signal and points at the sitemap', () => {
    expect(robots()).toBe(
      'User-agent: *\n' +
        'Content-Signal: search=yes, ai-input=yes, ai-train=yes\n' +
        'Allow: /\n' +
        '\n' +
        'Sitemap: https://madeui.com/sitemap.xml\n',
    );
  });
});

describe('agent-readability.json', () => {
  const text = agentReadability();

  test('two-space JSON with a trailing newline, keys in the published order, no generator', () => {
    expect(text.endsWith('}\n')).toBe(true);
    const json = JSON.parse(text);
    expect(Object.keys(json)).toEqual(['artifacts', 'description', 'name', 'site', 'contentUsage']);
    expect(text).toContain('\n  "artifacts": {\n    "markdown": {\n      "pattern": "https://madeui.com/{route}.md"\n    },');
  });

  test('points agents at every text artifact', () => {
    expect(JSON.parse(text).artifacts).toEqual({
      markdown: { pattern: 'https://madeui.com/{route}.md' },
      llmsFullTxt: 'https://madeui.com/llms-full.txt',
      llmsTxt: 'https://madeui.com/llms.txt',
      sitemap: 'https://madeui.com/sitemap.xml',
      feeds: ['https://madeui.com/changelog/rss.xml'],
    });
  });
});
