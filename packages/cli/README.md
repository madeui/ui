# madeui

CLI for [madeui](https://madeui.com) — Base UI + StyleX components you own.

```bash
npx @madeui/cli init   # wires the StyleX build (Next.js or Vite), copies design tokens
npx @madeui/cli add button dialog select
npx @madeui/cli list
```

`init` detects your framework, sets up the StyleX build, installs
`@stylexjs/stylex` + `@base-ui/react`, and copies the design tokens into
`lib/`. If the app was scaffolded with Tailwind it offers to remove it
(`--remove-tailwind` / `--keep-tailwind` skip the prompt). `add` copies components (and anything they depend on) into
`components/ui/` — the source is yours to edit.

Docs: **https://madeui.com** · Source: **https://github.com/madeui/ui**
