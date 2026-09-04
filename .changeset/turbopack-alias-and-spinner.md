---
"@madeui/cli": patch
---

Fix the Next.js setup under Turbopack: `init` now anchors the StyleX `@/*` alias at `process.cwd()` instead of `__dirname`. Turbopack evaluates `postcss.config.mjs` (and the `babel.config.js` it imports) inside its own bundle, where `__dirname` is a virtual `/ROOT/`, so every `import ... from '@/lib/tokens.stylex'` in an added component failed with "Could not resolve the path to the imported file". If you ran `init` 1.1.0, change the `aliases` line in `babel.config.js` to `path.join(process.cwd(), '*')`.

Spinners no longer hang the CLI on terminals that report zero columns (some CI runners and agent-driven PTYs); they fall back to plain lines there.
