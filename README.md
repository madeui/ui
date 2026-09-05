# madeui

**Components, made yours.** An open-source UI library you own the source
of — components are copied into your project as editable files, not
installed as a package — built on [Base UI](https://base-ui.com) (headless
behavior and accessibility) and [StyleX](https://stylexjs.com) (compile-time
atomic CSS).

- **59 components** — Button and Dialog through Combobox with multi-select
  chips, Command palette, Drawer, Toast, plus Autocomplete, Meter, Number
  Field, Toolbar, Checkbox Group, Calendar, Date Picker, Carousel,
  Resizable, and Chart
- **You own the source** — no package to depend on; edit anything
- **Typed, token-bound styles** — every color, space, type, and motion
  value comes from a typed design-token scale. Tokens are imports, not
  strings: a token that doesn't exist is a type error. The house rules
  (tokens over literals, no magic numbers) live in the repo, and `init`
  writes them into `AGENTS.md` so coding agents follow them too
- **Consistent API** — `variant`, `size`, and a `style` prop merged last on
  every component
- **Dark mode as a theme object** — one `stylex.createTheme`, no
  per-component dark styling

## Quick start

```bash
npx @madeui/cli init   # wires the StyleX build (Next.js or Vite), copies tokens
npx @madeui/cli add button dialog select
```

Requires React 19 and Node 20+, on Next.js 15+ (App Router) or Vite with
`@vitejs/plugin-react`.

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
