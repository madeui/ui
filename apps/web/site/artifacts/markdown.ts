import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

// The Markdown mirrors. `/<route>.mdx` is the page's source verbatim;
// `/<route>.md` is the same source with the components an agent can't render
// downleveled to plain Markdown: `<Component path>` becomes a fenced block
// holding the Example's source, `<Callout>` a blockquote. The transform is a
// position splice, not a re-stringify: the MDX is parsed only to find where
// those components start and end, and everything around them stays
// byte-identical to what the author wrote. A component it can't convert (an
// unknown Example, a component with no serializer) stays as written, and
// markup inside code fences is never touched (it parses as code).

/** What a `<Component path>` resolves to: the fence language and the raw file. */
export interface ExampleSource {
  lang: string;
  source: string;
}

export type ResolveExample = (path: string) => ExampleSource | undefined;

/** The parts of an mdast node the splice reads. */
interface Node {
  type: string;
  name?: string | null;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: Node[];
  position?: { start: { offset?: number }; end: { offset?: number } };
}

interface Splice {
  start: number;
  end: number;
  text: string;
}

interface Walk {
  source: string;
  resolve: ResolveExample;
}

/** Props of a component: string attributes, and `true` for bare ones. */
type Props = Record<string, string | true>;

type Serializer = (props: Props, children: string, walk: Walk) => string | null;

/** Fence `code` so the fence outgrows any backtick run inside it. */
export function fencedBlock(lang: string, code: string): string {
  const trimmed = code.replace(/(?<!\n)\n+$/u, '');
  const runs = trimmed.match(/`+/gu) ?? [];
  const longest = Math.max(0, ...runs.map((run) => run.length));
  const fence = '`'.repeat(Math.max(3, longest + 1));
  return `${fence}${lang}\n${trimmed}\n${fence}`;
}

const serializers: Record<string, Serializer> = {
  Component: (props, _children, walk) => {
    const example = typeof props.path === 'string' ? walk.resolve(props.path) : undefined;
    return example ? fencedBlock(example.lang, example.source) : null;
  },
  Callout: (props, children) => {
    const type = typeof props.type === 'string' ? props.type : 'info';
    const label =
      typeof props.title === 'string' && props.title !== '' ? props.title : type.charAt(0).toUpperCase() + type.slice(1);
    if (!children) return `> **${label}**`;
    const body = children
      .split('\n')
      .map((line) => (line.trim() === '' ? '>' : `> ${line}`))
      .join('\n');
    return `> **${label}**\n>\n${body}`;
  },
};

// Skip the parse when no serializable component appears at all.
const hint = new RegExp(`<(?:${Object.keys(serializers).join('|')})[\\s/>]`, 'u');

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---[\t ]*(?:\r?\n|$)/u;

/**
 * Blank out a leading frontmatter block (keeping every offset) so the MDX
 * parser never reads YAML as Markdown.
 */
const maskFrontmatter = (source: string) =>
  source.replace(FRONTMATTER, (block) => block.replace(/[^\r\n]/gu, ' '));

/** The source with its frontmatter block removed. */
export const stripFrontmatter = (source: string) => source.replace(FRONTMATTER, '');

const offsets = (node: Node): { start: number; end: number } | undefined => {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  return start === undefined || end === undefined ? undefined : { start, end };
};

function readProps(node: Node): Props {
  const props: Props = {};
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== 'mdxJsxAttribute' || !attribute.name) continue;
    if (attribute.value === null || attribute.value === undefined) props[attribute.name] = true;
    else if (typeof attribute.value === 'string') props[attribute.name] = attribute.value;
  }
  return props;
}

/** Apply non-overlapping splices, repeating an element's indent on continuation lines. */
function applySplices(text: string, splices: Splice[]): string {
  let result = text;
  for (const splice of splices.toSorted((a, b) => b.start - a.start)) {
    const lineStart = result.lastIndexOf('\n', splice.start - 1) + 1;
    const prefix = result.slice(lineStart, splice.start);
    const indent = /^[\t ]+$/u.test(prefix) ? prefix : '';
    const replacement = indent
      ? splice.text
          .split('\n')
          .map((line, index) => (index === 0 || line === '' ? line : `${indent}${line}`))
          .join('\n')
      : splice.text;
    result = result.slice(0, splice.start) + replacement + result.slice(splice.end);
  }
  return result;
}

/** Strip the common indent of every line after the first. */
function dedent(text: string): string {
  const lines = text.split('\n');
  const rest = lines.slice(1).filter((line) => line.trim() !== '');
  if (rest.length === 0) return text;
  const indent = Math.min(...rest.map((line) => line.length - line.trimStart().length));
  if (indent === 0) return text;
  return [lines[0], ...lines.slice(1).map((line) => (line.trim() === '' ? '' : line.slice(indent)))].join('\n');
}

/** An element's body: its children's source slice, downleveled, dedented, trimmed. */
function renderChildren(walk: Walk, node: Node): string {
  const children = (node.children ?? []).filter((child) => offsets(child));
  if (children.length === 0) return '';
  const start = offsets(children[0]!)!.start;
  const end = offsets(children.at(-1)!)!.end;
  const splices: Splice[] = [];
  collectSplices(walk, children, splices);
  const spliced = applySplices(
    walk.source.slice(start, end),
    splices.map((splice) => ({ ...splice, start: splice.start - start, end: splice.end - start })),
  );
  return dedent(spliced).trim();
}

/**
 * Collect replacements. A replaced element owns its subtree; when a
 * serializer declines, the walk continues inside it.
 */
function collectSplices(walk: Walk, nodes: Node[], out: Splice[]): void {
  for (const node of nodes) {
    const serializer = node.type === 'mdxJsxFlowElement' && node.name ? serializers[node.name] : undefined;
    const range = offsets(node);
    if (serializer && range) {
      const text = serializer(readProps(node), renderChildren(walk, node), walk);
      if (text !== null) {
        out.push({ ...range, text });
        continue;
      }
    }
    collectSplices(walk, node.children ?? [], out);
  }
}

const parser = unified().use(remarkParse).use(remarkMdx);

/**
 * Downlevel the supported components in an MDX source to plain Markdown. A
 * source without any, or one that doesn't parse as MDX, comes back unchanged.
 */
export function downlevel(source: string, resolve: ResolveExample): string {
  if (!hint.test(source)) return source;
  let tree: Node;
  try {
    tree = parser.parse(maskFrontmatter(source)) as Node;
  } catch {
    return source;
  }
  const splices: Splice[] = [];
  collectSplices({ source, resolve }, tree.children ?? [], splices);
  return splices.length > 0 ? applySplices(source, splices) : source;
}

/** The text served at `/<route>.md` or `/<route>.mdx` for a content page. */
export function markdownMirror(format: 'md' | 'mdx', source: string, resolve: ResolveExample): string {
  return format === 'mdx' ? source : downlevel(source, resolve);
}
