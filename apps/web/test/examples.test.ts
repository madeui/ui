import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { hydratesWhenVisible, listExamples, resolveExample } from '../site/examples.ts';

const dir = path.join(import.meta.dirname, 'fixtures/examples');
const raw = (file: string) => fs.readFileSync(path.join(dir, file), 'utf8');

describe('resolveExample', () => {
  test('a <Component path> resolves to the example file and its raw source', () => {
    const example = resolveExample('button-demo', dir);
    expect(example).toEqual({
      path: 'button-demo',
      file: path.join(dir, 'button-demo.tsx'),
      lang: 'tsx',
      source: raw('button-demo.tsx'),
    });
  });

  test('a nested path keeps its folders; the language is the file extension', () => {
    const example = resolveExample('charts/bar-demo', dir);
    expect(example?.file).toBe(path.join(dir, 'charts/bar-demo.jsx'));
    expect(example?.lang).toBe('jsx');
    expect(example?.source).toBe(raw('charts/bar-demo.jsx'));
  });

  test('an unknown path, or a file that is not a component, resolves to nothing', () => {
    expect(resolveExample('does-not-exist', dir)).toBeUndefined();
    expect(resolveExample('helpers', dir)).toBeUndefined();
    expect(resolveExample('button-demo.tsx', dir)).toBeUndefined();
  });
});

describe('listExamples', () => {
  test('lists every example path, sorted', () => {
    expect(listExamples(dir)).toEqual(['button-demo', 'charts/bar-demo']);
  });
});

describe('hydratesWhenVisible', () => {
  test('an Example that renders the Chart component hydrates when it nears the viewport', () => {
    const chart = `import { Bar } from 'recharts';\n\nimport {\n  ChartContainer,\n  type ChartConfig,\n} from '@/components/ui/chart';\n`;
    expect(hydratesWhenVisible(chart)).toBe(true);
    expect(hydratesWhenVisible(`import { ChartContainer } from "@/components/ui/chart";`)).toBe(true);
  });

  test('every other Example hydrates at load', () => {
    expect(hydratesWhenVisible(raw('button-demo.tsx'))).toBe(false);
    expect(hydratesWhenVisible(`import { Card } from '@/components/ui/card';\n// sales chart below`)).toBe(false);
  });
});
