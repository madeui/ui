import fs from 'node:fs';
import path from 'node:path';

// The Example source resolver: `<Component path="button-demo" />` in the docs
// content names packages/registry/examples/button-demo.tsx. The live preview,
// the Code tab, the .md mirrors and llms-full.txt all resolve it here.

/**
 * The registry's examples folder. From process.cwd(), not import.meta: Next
 * runs from apps/web, and Turbopack rewrites module paths to a virtual root.
 */
export const EXAMPLES_DIR = path.resolve(process.cwd(), '../../packages/registry/examples');

/** Example files render as React components: .tsx and .jsx. */
const EXAMPLE_FILE = /\.(?<ext>tsx|jsx)$/u;

export interface Example {
  /** The `<Component path>` key: the file's path under the examples folder, without extension. */
  path: string;
  /** Absolute path of the source file. */
  file: string;
  /** Code fence / highlighter language: the file extension. */
  lang: string;
  /** The raw file contents, verbatim. */
  source: string;
}

interface ExampleFile {
  file: string;
  lang: string;
}

// Builds scan once; dev rescans so a new example resolves without a restart.
const cache = new Map<string, Map<string, ExampleFile>>();
const useCache = process.env.NODE_ENV === 'production';

function scan(dir: string): Map<string, ExampleFile> {
  let found = useCache ? cache.get(dir) : undefined;
  if (found) return found;
  found = new Map();
  const files = fs.readdirSync(dir, { recursive: true, encoding: 'utf8' }).sort();
  for (const relative of files) {
    const match = EXAMPLE_FILE.exec(relative);
    if (!match?.groups) continue;
    const key = relative.slice(0, match.index).split(path.sep).join('/');
    found.set(key, { file: path.join(dir, relative), lang: match.groups.ext! });
  }
  if (useCache) cache.set(dir, found);
  return found;
}

/** Every example path, sorted. */
export function listExamples(dir: string = EXAMPLES_DIR): string[] {
  return [...scan(dir).keys()];
}

/** The example a `<Component path>` names, or undefined when there is none. */
export function resolveExample(examplePath: string, dir: string = EXAMPLES_DIR): Example | undefined {
  const entry = scan(dir).get(examplePath);
  if (!entry) return undefined;
  return { path: examplePath, file: entry.file, lang: entry.lang, source: fs.readFileSync(entry.file, 'utf8') };
}

/**
 * Whether an Example's block hydrates when it nears the viewport instead of
 * at load: the Examples that render the Chart component. Hydrating a chart
 * (recharts) holds a phone's main thread for long, and a chart page shows
 * many; every other Example is light and hydrates at load.
 */
export function hydratesWhenVisible(source: string): boolean {
  return /from\s+['"]@\/components\/ui\/chart['"]/u.test(source);
}
