# @madeui/cli

## 1.2.1

### Patch Changes

- [#22](https://github.com/madeui/ui/pull/22) [`ad0b4f6`](https://github.com/madeui/ui/commit/ad0b4f66b6df3c2f55e788933347cd60d2761bba) Thanks [@emretfn](https://github.com/emretfn)! - The CLI is now written in TypeScript and published as a bundle built from that source. Behavior is unchanged. `engines` now states the real minimum, Node 22.12, which the CLI's dependencies already required.

## 1.2.0

### Minor Changes

- [#19](https://github.com/madeui/ui/pull/19) [`efd328e`](https://github.com/madeui/ui/commit/efd328e190b438a384dd030f92ce5396e856246d) Thanks [@emretfn](https://github.com/emretfn)! - Add `madeui diff`: compares installed components with the registry and marks each file `same`, `differs`, or `missing`. Name components to see their patches. `--json` prints a machine-readable report with patches and a fix command per item, and `--exit-code` fails when anything differs. Files that differ only in line endings (CRLF) now count as up to date. `add --overwrite` now replaces only the components you name: registry dependencies such as rethemed tokens are no longer overwritten unless you name them too. New projects get an "Updating components" section in the AGENTS.md block.

## 1.1.1

### Patch Changes

- [#13](https://github.com/madeui/ui/pull/13) [`ffbe5de`](https://github.com/madeui/ui/commit/ffbe5de6134b7bdccdd0dec81bd915dd5ecd19db) Thanks [@emretfn](https://github.com/emretfn)! - Fix the Next.js setup under Turbopack: `init` now anchors the StyleX `@/*` alias at `process.cwd()` instead of `__dirname`. Turbopack evaluates `postcss.config.mjs` (and the `babel.config.js` it imports) inside its own bundle, where `__dirname` is a virtual `/ROOT/`, so every `import ... from '@/lib/tokens.stylex'` in an added component failed with "Could not resolve the path to the imported file". If you ran `init` 1.1.0, change the `aliases` line in `babel.config.js` to `path.join(process.cwd(), '*')`.
  
  Spinners no longer hang the CLI on terminals that report zero columns (some CI runners and agent-driven PTYs); they fall back to plain lines there.

## 1.1.0

### Minor Changes

- [#8](https://github.com/madeui/ui/pull/8) [`c269035`](https://github.com/madeui/ui/commit/c269035ececbdd20672a08d341e160a00d2f42ff) Thanks [@emretfn](https://github.com/emretfn)! - `init` now detects Tailwind (e.g. an app scaffolded with `create-next-app --tailwind` or `@tailwindcss/vite`) and offers to remove it: uninstalls the Tailwind packages, deletes or edits the PostCSS / Vite plugin wiring and `tailwind.config.*`, and strips Tailwind at-rules (`@import "tailwindcss"`, `@theme`, `@plugin`, `@custom-variant`, …) from your stylesheets. New flags `--remove-tailwind` and `--keep-tailwind` skip the prompt; without a TTY Tailwind is kept.
  
  `init` also writes a browser reset into `@layer base` when the app's global stylesheet has none (Tailwind removal takes Preflight with it, and the Vite template never had a `border-box` rule). The reset (`reset.css` in the CLI package) has the same coverage as Tailwind Preflight, so an app moving off Tailwind keeps the baseline it rendered under. On Vite the reset goes to `src/index.css`, which is now recorded in `madeui.json`. The generated PostCSS config is now `postcss.config.mjs` (ESM, like the file `create-next-app` writes) and uses `useCSSLayers: { before: ['base'] }` so StyleX declares the layer order itself.
  
  Also fixes `init` on a Tailwind Next.js app when Tailwind is kept: it no longer writes a second `postcss.config.js` next to the existing `postcss.config.mjs`, and it inserts `@stylex` after `@import "tailwindcss"` instead of wrapping the import in `@layer base` (invalid CSS).
  
  `init` now appends its agent conventions to an existing `AGENTS.md` (between `<!-- BEGIN:madeui-agent-rules -->` markers, the way `next dev` adds its own block) instead of skipping the file; `create-next-app` writes one, so before this the conventions never landed. It also writes a `CLAUDE.md` containing `@AGENTS.md` when there is none (and adds that line to an existing `CLAUDE.md` that does not reference `AGENTS.md`), so Claude Code picks the conventions up too.
  
  Command hints (`init`'s closing line, `add`'s "run init first" error) now spell out the real invocation for the project's package manager (`npx @madeui/cli add …`, `pnpm dlx …`, `yarn dlx …`, `bunx …`) instead of a bare `madeui add`, and pin the version when running a prerelease snapshot.
  
  Package manager runs (`npm install`, `pnpm add`, `pnpm remove`, …) now sit behind a spinner; their own progress output is captured and only shown when the command fails.
