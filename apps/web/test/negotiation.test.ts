import { describe, expect, test } from 'vitest';

import { ACCEPTS_MARKDOWN } from '../site/negotiation.mjs';

// Next matches a `has` header value against the whole header.
const negotiates = (accept: string) => new RegExp(`^${ACCEPTS_MARKDOWN}$`).test(accept);

describe('Markdown negotiation (Accept header)', () => {
  test.each([
    'text/markdown',
    'text/x-markdown',
    'text/markdown, text/html;q=0.9',
    'application/json, text/markdown;q=0.9, */*;q=0.1',
    'text/markdown; charset=utf-8',
    'text/markdown;q=0.5',
    'text/markdown;q=0.001',
    'text/markdown;q=0, text/x-markdown',
  ])('serves Markdown for %s', (accept) => {
    expect(negotiates(accept)).toBe(true);
  });

  test.each([
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    '*/*',
    'text/html',
    'text/markdownx',
    'text/markdown-extra',
    // q=0 means "not acceptable" (RFC 9110, 12.4.2).
    'text/markdown;q=0',
    'text/markdown; q=0.0',
    'text/markdown;Q=0.000',
    'text/markdown;charset=utf-8;q=0',
    'text/markdown;q=0, text/html',
    'text/html, text/x-markdown ; q = 0',
  ])('serves HTML for %s', (accept) => {
    expect(negotiates(accept)).toBe(false);
  });
});
