---
'@madeui/cli': minor
---

`init` now applies the page styles from `lib/themes.ts` in your app's root: `colorScheme` on `<html>` (light and dark mode) and the new `page` style on `<body>` (background and text color from the `background` and `foreground` tokens). On Next.js it edits `app/layout.tsx`, appending to an existing string or template-literal `className`; on Vite it adds the classes from `src/main.tsx`. A layout it can't read safely is left alone and the exact snippet is printed instead, and a style the file already imports is not applied twice. If `lib/themes.ts` predates `page`, `init` says how to update it instead of editing the layout. The AGENTS.md block it writes mentions `page` too.
