import type { MDXComponents } from 'mdx/types';

import { Callout } from '@/components/site/callout';
import { CodeBlock } from '@/components/site/code-block';
import { ComponentPreview } from '@/components/site/component-preview';

/**
 * The Prose element map: what the docs content's elements and its two MDX
 * components render as. Everything else stays the plain element.
 */
export const proseComponents: MDXComponents = {
  pre: CodeBlock,
  Component: ComponentPreview,
  Callout,
};
