# madeui

**Components, made yours.** An open-source UI library following the shadcn
code-ownership model — components are copied into your project as editable
source — built on [Base UI](https://base-ui.com) (headless behavior and
accessibility) and [StyleX](https://stylexjs.com) (compile-time atomic CSS)
instead of Radix + Tailwind.

- **54 components** — Button and Dialog through Combobox with multi-select
  chips, Command palette, Drawer, Toast, plus Autocomplete, Meter, Number
  Field, Toolbar, and Checkbox Group
- **You own the source** — no package to depend on; edit anything
- **Type-safe, token-bound styles** — every color, space, type, and motion
  value comes from a typed design-token scale; out-of-bounds styling doesn't
  compile. That constraint is also what makes the library work well with AI
  agents: they can read the real source and can't invent one-off styles
- **Consistent API** — `variant`, `size`, and a `style` prop merged last on
  every component
- **Dark mode as a theme object** — one `stylex.createTheme`, no
  per-component dark styling

## Quick start

```bash
npx @madeui/cli init   # wires the StyleX build (Next.js or Vite), copies tokens
npx @madeui/cli add button dialog select
```

The registry is shadcn-compatible, so once the build is set up this works
too:

```bash
npx shadcn@latest add @madeui/button
```

## Docs

Guides, live examples for every component feature, and the API reference:
**[madeui.com](https://madeui.com)**

## Repository layout

```
packages/registry/   # component sources, tokens, examples
packages/cli/        # madeui init / add / list
apps/docs/           # documentation site (also serves the registry)
apps/playground/     # Next.js smoke-test app
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, the development flow,
and how releases work.

## License

[MIT](./LICENSE)
