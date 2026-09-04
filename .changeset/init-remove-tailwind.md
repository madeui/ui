---
"@madeui/cli": minor
---

`init` now detects Tailwind (e.g. an app scaffolded with `create-next-app --tailwind` or `@tailwindcss/vite`) and offers to remove it: uninstalls the Tailwind packages, deletes or edits the PostCSS / Vite plugin wiring and `tailwind.config.*`, and strips Tailwind at-rules (`@import "tailwindcss"`, `@theme`, `@plugin`, `@custom-variant`, …) from your stylesheets. New flags `--remove-tailwind` and `--keep-tailwind` skip the prompt; without a TTY Tailwind is kept.

`init` also writes a browser reset into `@layer base` when the app's global stylesheet has none (Tailwind removal takes Preflight with it, and the Vite template never had a `border-box` rule). The reset (`reset.css` in the CLI package) has the same coverage as Tailwind Preflight, so an app moving off Tailwind keeps the baseline it rendered under. On Vite the reset goes to `src/index.css`, which is now recorded in `madeui.json`. The generated PostCSS config is now `postcss.config.mjs` (ESM, like the file `create-next-app` writes) and uses `useCSSLayers: { before: ['base'] }` so StyleX declares the layer order itself.

Also fixes `init` on a Tailwind Next.js app when Tailwind is kept: it no longer writes a second `postcss.config.js` next to the existing `postcss.config.mjs`, and it inserts `@stylex` after `@import "tailwindcss"` instead of wrapping the import in `@layer base` (invalid CSS).

`init` now appends its agent conventions to an existing `AGENTS.md` (between `<!-- BEGIN:madeui-agent-rules -->` markers, the way `next dev` adds its own block) instead of skipping the file; `create-next-app` writes one, so before this the conventions never landed.
