import fs from 'node:fs';
import path from 'node:path';

import kleur from 'kleur';

import { cliCommand } from './project.ts';
import type { FrameworkName } from './types.ts';

/**
 * Applies the page styles from the installed `themes.ts` in the app's root:
 * `colorScheme` on <html> (light/dark for every token) and `page` on <body>
 * (background and text color). Same contract as the vite.config patcher: one
 * targeted string edit when the file has the expected shape, otherwise the
 * exact snippet as a manual step.
 */

/** Which themes.ts export goes on which root element. */
const PAGE_STYLES = [
  { style: 'colorScheme', tag: 'html', element: 'document.documentElement' },
  { style: 'page', tag: 'body', element: 'document.body' },
] as const;

type PageStyle = (typeof PAGE_STYLES)[number];

const STYLE_NAMES = PAGE_STYLES.map((s) => s.style);

/** Quote and semicolon style of the file's first import, so ours match. */
function importStyle(source: string): { quote: string; semi: string } {
  const first = /^import\s[^\n]*?(['"])[^'"\n]*\1(;?)/m.exec(source);
  return { quote: first?.[1] ?? "'", semi: first ? (first[2] ?? '') : ';' };
}

function importLines(source: string, importPath: string, names: readonly string[]): string[] {
  const { quote: q, semi } = importStyle(source);
  const lines: string[] = [];
  if (!/import\s+\*\s+as\s+stylex\s+from\s+['"]@stylexjs\/stylex['"]/.test(source)) {
    lines.push(`import * as stylex from ${q}@stylexjs/stylex${q}${semi}`);
  }
  if (names.length > 0) lines.push(`import { ${names.join(', ')} } from ${q}${importPath}${q}${semi}`);
  return lines;
}

/** Offset just past the leading directives, comments and import statements. */
function endOfImports(source: string): number {
  let offset = 0;
  let end = 0;
  let inImport = false;
  let inComment = false;
  for (const line of source.split('\n')) {
    const next = offset + line.length + 1;
    const trimmed = line.trim();
    if (inComment) {
      inComment = !trimmed.includes('*/');
    } else if (inImport) {
      if (/['"][^'"]*['"];?$/.test(trimmed)) {
        inImport = false;
        end = next;
      }
    } else if (trimmed.startsWith('import ') || trimmed.startsWith('import{')) {
      if (/['"][^'"]*['"];?$/.test(trimmed)) end = next;
      else inImport = true;
    } else if (/^['"]use \w+['"];?$/.test(trimmed)) {
      // Directives must stay first.
      end = next;
    } else if (trimmed.startsWith('/*')) {
      inComment = !trimmed.includes('*/');
    } else if (!(trimmed === '' || trimmed.startsWith('//'))) {
      break;
    }
    offset = next;
  }
  return Math.min(end, source.length);
}

/** `import { … } from '…/<lib>/themes'`: the installed themes module, not any file named themes. */
function themesImport(source: string, libDir: string): RegExpExecArray | null {
  const dir = path.posix.basename(libDir).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*(['"])[^'"]*\\/${dir}\\/themes\\2`).exec(source);
}

/**
 * Styles the file already imports from themes (`colorScheme as scheme`
 * counts as `colorScheme`). An imported style counts as applied, however the
 * file uses it: spread, hoisted to a variable, …
 */
function importedFromThemes(source: string, libDir: string): string[] {
  return (themesImport(source, libDir)?.[1] ?? '')
    .split(',')
    .map((specifier) => specifier.trim().split(/\s+as\s+/)[0] ?? '')
    .filter(Boolean);
}

/**
 * Imports `names` from themes: into the existing themes import when there is
 * one, otherwise as new lines after the last import.
 */
function addImports(source: string, importPath: string, libDir: string, names: readonly string[]): string {
  const existing = themesImport(source, libDir);
  if (existing) {
    const specifiers = (existing[1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const merged = `{ ${[...specifiers, ...names].join(', ')} }`;
    source = source.replace(existing[0], existing[0].replace(/\{[^}]*\}/, merged));
    names = [];
  }
  const lines = importLines(source, importPath, names);
  if (lines.length === 0) return source;
  const at = endOfImports(source);
  const before = source.slice(0, at);
  const separator = at > 0 && !before.endsWith('\n') ? '\n' : '';
  return `${before}${separator}${lines.join('\n')}\n${source.slice(at)}`;
}

/** Blanks out comments, keeping offsets, so a `<html>` in a comment is not a match. */
function maskComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (comment) => comment.replace(/[^\n]/g, ' '));
}

/** Start and end (exclusive, after `>`) of the first `<tag …>` opening tag outside comments. */
function findOpeningTag(source: string, tag: string): { start: number; end: number } | null {
  const code = maskComments(source);
  const match = new RegExp(`<${tag}(?=[\\s>])`).exec(code);
  if (!match) return null;
  let depth = 0;
  let quote: string | null = null;
  for (let i = match.index + match[0].length; i < code.length; i++) {
    const ch = code[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      if (depth === 0) quote = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
    } else if (ch === '>' && depth === 0) {
      return { start: match.index, end: i + 1 };
    }
  }
  return null;
}

/**
 * Adds `style` to the tag's classes. Without a className the props are
 * spread; a string or template-literal className gets the StyleX class
 * appended. A tag that already spreads props (a brand theme, say) returns
 * null, like any other shape: a second spread's className would replace the
 * first one's.
 */
function addStyleToTag(source: string, { tag, style }: PageStyle): string | null {
  const found = findOpeningTag(source, tag);
  if (!found) return null;
  const opening = source.slice(found.start, found.end);
  if (opening.includes('{...')) return null;
  const props = `stylex.props(${style})`;
  let patched: string;
  if (!/\sclassName\s*=/.test(opening)) {
    patched = `${opening.slice(0, -1).trimEnd()} {...${props}}>`;
  } else {
    const literal = /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\})/.exec(opening);
    if (!literal) return null;
    const classes = literal[1] ?? literal[2] ?? literal[3];
    patched = opening.replace(literal[0], `className={\`${classes} \${${props}.className}\`}`);
  }
  return source.slice(0, found.start) + patched + source.slice(found.end);
}

/**
 * `@/lib/themes` when a tsconfig maps `@/*` over the lib folder (what the
 * docs and the components use), otherwise a relative path from `file`.
 */
function importPathFrom(cwd: string, file: string, libDir: string): string {
  // Vite splits tsconfig: the app's paths usually live in tsconfig.app.json.
  // The most specific base wins (`./src/*` over `./*` for `src/lib`).
  const base = ['tsconfig.json', 'tsconfig.app.json']
    .map((f) => path.join(cwd, f))
    .filter((f) => fs.existsSync(f))
    .map((f) => /"@\/\*"\s*:\s*\[\s*"(?:\.\/)?([^"*]*)\*"/.exec(fs.readFileSync(f, 'utf8'))?.[1])
    .filter((b): b is string => b !== undefined && `${libDir}/`.startsWith(b))
    .sort((a, b) => b.length - a.length)[0];
  if (base !== undefined) return `@/${libDir.slice(base.length)}/themes`;
  const relative = path.posix.relative(path.posix.dirname(file), path.posix.join(libDir, 'themes'));
  return relative.startsWith('.') ? relative : `./${relative}`;
}

/** The app's root module and how the page styles go into it. */
interface Root {
  files: string[];
  /** What to do by hand: `file` is the module found, or null when there is none. */
  manualStep(file: string | null, source: string, importPath: string): string;
  /** The module with `missing` applied, or null when its shape is not recognised. */
  apply(source: string, missing: readonly PageStyle[], importPath: string, libDir: string): string | null;
}

const NEXT_JSX = `  <html {...stylex.props(colorScheme)}>
    <body {...stylex.props(page)}>`;

// <html> and <body> come from index.html in a Vite app, outside the React
// tree, so the entry adds the classes once at startup.
const VITE_COMMENT = '// Page styles from lib/themes.ts: colorScheme on <html>, page on <body>.';

function viteStatement({ element, style }: PageStyle): string {
  return `${element}.classList.add(...(stylex.props(${style}).className?.split(' ') ?? []))`;
}

const ROOTS: Record<FrameworkName, Root> = {
  next: {
    files: ['app/layout.tsx', 'app/layout.jsx', 'app/layout.js', 'src/app/layout.tsx', 'src/app/layout.jsx', 'src/app/layout.js'],
    manualStep(file, source, importPath) {
      const where = file
        ? `${file}: put the page styles on <html> and <body> (keep an existing className and append \${stylex.props(…).className} to it)`
        : 'no app/layout found: put the page styles on the root <html> and <body> (Pages Router: <Html> and <body> in pages/_document)';
      return `${where}:\n  ${importLines(source, importPath, STYLE_NAMES).join('\n  ')}\n\n${NEXT_JSX}`;
    },
    apply(source, missing, importPath, libDir) {
      let patched: string | null = source;
      for (const style of missing) patched = patched && addStyleToTag(patched, style);
      return patched && addImports(patched, importPath, libDir, missing.map((s) => s.style));
    },
  },
  vite: {
    files: ['src/main.tsx', 'src/main.jsx', 'src/main.ts', 'src/main.js', 'src/index.tsx', 'src/index.jsx'],
    manualStep(_file, source, importPath) {
      const lines = [...importLines(source, importPath, STYLE_NAMES), '', VITE_COMMENT, ...PAGE_STYLES.map(viteStatement)];
      return `no src/main entry found: add to the module that renders your app:\n  ${lines.join('\n  ')}`;
    },
    apply(source, missing, importPath, libDir) {
      const withImports = addImports(source, importPath, libDir, missing.map((s) => s.style));
      const at = endOfImports(withImports);
      const block = `\n${VITE_COMMENT}\n${missing.map(viteStatement).join('\n')}\n`;
      return withImports.slice(0, at) + block + withImports.slice(at);
    },
  },
};

/** The installed themes.ts must export both styles, or the edit would not compile. */
function missingThemeExports(cwd: string, libDir: string): string[] {
  const file = path.join(cwd, libDir, 'themes.ts');
  const source = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  return STYLE_NAMES.filter((name) => !new RegExp(`export\\s+const\\s+${name}\\b`).test(source));
}

/** Applies the page styles in the app's root module; returns manual steps for what it could not write. */
export function applyPageStyles(cwd: string, framework: FrameworkName, libDir: string, changed: string[]): string[] {
  const missingExports = missingThemeExports(cwd, libDir);
  if (missingExports.length > 0) {
    return [
      `${libDir}/themes.ts has no ${missingExports.map((n) => `\`${n}\``).join(' or ')} export (installed before it existed): run \`${cliCommand(cwd, 'add theme --overwrite')}\` (review your token edits first) and run init again, or copy it from the registry.`,
    ];
  }
  const root = ROOTS[framework];
  const file = root.files.find((f) => fs.existsSync(path.join(cwd, f)));
  if (!file) {
    return [root.manualStep(null, '', importPathFrom(cwd, root.files[0] ?? '', libDir))];
  }
  const source = fs.readFileSync(path.join(cwd, file), 'utf8');
  const importPath = importPathFrom(cwd, file, libDir);
  const imported = importedFromThemes(source, libDir);
  const missing = PAGE_STYLES.filter((s) => !imported.includes(s.style));
  if (missing.length === 0) {
    console.log(kleur.dim(`  = ${file} already applies the page styles`));
    return [];
  }
  const patched = root.apply(source, missing, importPath, libDir);
  if (!patched) return [root.manualStep(file, source, importPath)];
  fs.writeFileSync(path.join(cwd, file), patched);
  changed.push(file);
  console.log(kleur.green(`  ~ ${file}: ${missing.map((s) => `${s.style} on <${s.tag}>`).join(', ')}`));
  return [];
}
