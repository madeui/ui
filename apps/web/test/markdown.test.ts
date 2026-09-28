import { describe, expect, test } from 'vitest';

import { downlevel, markdownMirror, markdownTokens } from '../site/artifacts/markdown.ts';
import { buttonDemo, resolve, sources } from './fixtures/content.ts';

const buttonSource = sources.find((entry) => entry.page.route === '/docs/components/button')!.source;
const introductionSource = sources.find((entry) => entry.page.route === '/docs')!.source;

describe('the .mdx mirror', () => {
  test('is the source file verbatim, frontmatter included', () => {
    expect(markdownMirror('mdx', buttonSource, resolve)).toBe(buttonSource);
  });
});

describe('the .md mirror', () => {
  const md = markdownMirror('md', buttonSource, resolve);

  test('keeps the frontmatter block', () => {
    expect(md.startsWith('---\ntitle: Button\ndescription: "Displays a button …"\n---\n\n')).toBe(true);
  });

  test("inlines each Example's source as a fenced block in place of <Component>", () => {
    expect(md).toContain(`---\n\n\`\`\`tsx\n${buttonDemo.trimEnd()}\n\`\`\`\n\n## Install\n`);
  });

  test('turns a Callout into a blockquote headed by its title or capitalized type', () => {
    expect(md).toContain(
      '> **Warning**\n>\n> Buttons submit forms by default.\n>\n> Set `type="button"` otherwise.\n\n## Usage',
    );
  });

  test('leaves component markup inside code fences and unknown Examples as written', () => {
    expect(md).toContain('```mdx\n<Component path="button-demo" />\n```');
    expect(md).toContain('<Component path="does-not-exist" />\n');
  });

  test('a page without components is the source unchanged', () => {
    expect(markdownMirror('md', introductionSource, resolve)).toBe(introductionSource);
  });
});

describe('downlevel', () => {
  test('the fence outgrows any backtick run inside the Example source', () => {
    const source = 'const md = "```js";\n\n\n';
    const out = downlevel('<Component path="x" />\n', () => ({ lang: 'jsx', source }));
    expect(out).toBe('````jsx\nconst md = "```js";\n````\n');
  });

  test('a Component inside a Callout is inlined too', () => {
    const out = downlevel('<Callout title="Try it">\n  <Component path="button-demo" />\n</Callout>\n', resolve);
    expect(out).toBe(`> **Try it**\n>\n${['```tsx', ...buttonDemo.trimEnd().split('\n'), '```'].map((line) => `> ${line}`).join('\n')}\n`);
  });
});

describe('markdownTokens (the x-markdown-tokens estimate)', () => {
  test('is about four characters per token, rounded up', () => {
    expect(markdownTokens('')).toBe(0);
    expect(markdownTokens('abc')).toBe(1);
    expect(markdownTokens('abcd')).toBe(1);
    expect(markdownTokens('abcde')).toBe(2);
    expect(markdownTokens('x'.repeat(4000))).toBe(1000);
  });

  test('counts characters, not UTF-8 bytes', () => {
    expect(markdownTokens('— …')).toBe(1);
  });
});
