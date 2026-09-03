---
"@madeui/cli": minor
---

`init` now detects Tailwind (e.g. an app scaffolded with `create-next-app --tailwind` or `@tailwindcss/vite`) and offers to remove it: uninstalls the Tailwind packages, deletes or edits the PostCSS / Vite plugin wiring and `tailwind.config.*`, and strips Tailwind at-rules (`@import "tailwindcss"`, `@theme`, `@plugin`, `@custom-variant`, …) from your stylesheets. New flags `--remove-tailwind` and `--keep-tailwind` skip the prompt; without a TTY Tailwind is kept.

Also fixes `init` on a Tailwind Next.js app when Tailwind is kept: it no longer writes a second `postcss.config.js` next to the existing `postcss.config.mjs`, and it inserts `@stylex` after `@import "tailwindcss"` instead of wrapping the import in `@layer base` (invalid CSS).
