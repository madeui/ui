# StyleX doctrine

How StyleX is written in this codebase. These rules exist because StyleX is
strong at exactly this: tokens, named style objects, deterministic composition,
narrow public style APIs. Do not write Tailwind-in-StyleX.

Companion documents:
- [stylex-authoring.md](./stylex-authoring.md) — the API-level authoring guide
  (create/props, pseudo-classes, media queries, defineConsts/defineVars,
  themes, dynamic styles, TypeScript types, antipatterns). Read it before
  writing StyleX.
- [Thinking in StyleX](https://stylexjs.com/docs/learn/thinking-in-stylex) —
  the upstream philosophy this doctrine builds on.

## Mental model (from "Thinking in StyleX")

- **Co-location over DRY.** Styles live in the same file as the markup they
  style. Don't extract "shared" style modules to save lines; extract them when
  they are genuinely shared patterns.
- **Deterministic merge is the contract.** "The last style applied always
  wins" — across files, across packages. That's why `style` props work without
  specificity wars: composition order is the API.
- **Encapsulation.** All styles on an element are caused by class names on
  that element itself. No descendant selectors, no style-at-a-distance.
- **Everything is a typed import.** Class names, variables, keyframes are
  JavaScript constants — never magic strings or global naming conventions.
- **Constraints are the product.** The compiler only accepts what it can
  statically see; don't work around that, design within it.

## Non-negotiable rules

1. **No magic numbers or raw colors in components.**
   Forbidden: `padding: 16`, `gap: 8`, `borderRadius: 12`, `fontSize: 14`,
   `#18181b`, `rgb(...)`, `rgba(...)`.
   Required: design tokens from `lib/tokens.stylex.ts` (`defineVars`).
   If a needed token does not exist, add it to the token layer first, then use
   it. Never invent a one-off value inside a component.

2. **Never imitate Tailwind.**
   Forbidden: className utility soup, arbitrary values, `px-4`-style thinking,
   string-built class lists, `clsx`/`cn` of utilities, ad-hoc hex "just this
   once", extra spacing because it "looks closer".
   If you catch yourself choosing a value by eye, stop and map it to the
   existing scale.

3. **One way to express one thing.**
   Spacing comes only from the `space` scale. Color comes only from semantic
   tokens (`colors.foreground`, `colors.mutedForeground`, `colors.accent`, ...)
   — never raw palette values scattered in components. Radius, typography,
   z-index, shadow, duration, stroke widths, container widths come only from
   their scales. Do not mix `padding: space.s4` in one file and
   `paddingInline: '1rem'` in another.

4. **Styles are named objects, not inline inventions.**
   Use `stylex.create`. Reuse existing style objects (`root`, `content`,
   `label`, size variants, tone variants) instead of creating near-duplicates.
   Compose with `stylex.props(base, variant, override)`. Do not fight
   specificity; if a variant should exist, add the variant — not "one more
   exception style".

5. **Components encapsulate styling.**
   A component styles itself and its internal slots. Never reach out and style
   another component's descendants with parent CSS.

6. **Prefer semantic variants over open-ended styling.**
   Good: `size="sm" | "md" | "lg"`, `variant="primary" | "outline" | ...`.
   If a consumer need keeps recurring, add a variant or a token — do not widen
   the escape hatch.

## Token policy

- If the visual value already exists on the scale, use that token.
- If it is a new recurring value, add a named token with a semantic name.
- A truly one-off value is a smell: challenge it; most one-offs snap to the
  nearest scale step.
- Do not add `spaceMd2`, `gray700Alt`, `radiusAlmostMd`. Extend the scale
  deliberately or use the existing step.
- Dark mode / theme changes happen through vars (`stylex.createTheme`) — never
  by forking component styles.

## StyleX usage policy

- Follow [stylex-authoring.md](./stylex-authoring.md) for API mechanics:
  longhand properties over multi-value shorthands, `null` to unset, nested
  (not top-level) pseudo-classes and media queries, `defineConsts` for
  non-themed values / `defineVars` for themable ones, no `style`/`className`
  alongside a `stylex.props()` spread, prefer real elements over
  `::before`/`::after`, prefer JS over `:nth-child`.
- Colocate styles with the component that owns them.
- Shared patterns (state adapters, focus ring recipe) live in
  `lib/stylex-utils.ts` / the token layer — not copy-pasted.
- Real CSS property names (`paddingInline`, `backgroundColor`, `alignItems`).
- Pseudo-states (`:hover`, `:focus-visible`, `:disabled`) AND Base UI state
  live inside the style objects as conditional values. Base UI mirrors every
  state as a data attribute — target it directly (StyleX ≥0.18 accepts
  attribute selectors as condition keys):
  `backgroundColor: { default: 'transparent', '[data-highlighted]': colors.accent }`.
  No JS state adapter; the component spreads plain `stylex.props(...)`.
  One gotcha: a conditional **custom property** must not define a `default`
  value (StyleX emits it unlayered, beating the layered `[data-*]` rule) —
  use `default: null` and a `var(--x, fallback)` at the consumption site.
- Dynamic values go through StyleX APIs or CSS variables. No raw inline
  `style={{}}` in components or examples.
- Keep compilation-friendly code: static style objects only; avoid patterns
  the compiler cannot see.

## Review checklist (run before finishing any styling task)

- Any raw number, hex, rgb, or px string in a component file?
- Same visual concept expressed two ways?
- Duplicate `stylex.create` blocks that should reuse a shared style?
- Tailwind-like thinking (one-off arbitrary spacing)?
- Component styling another component's internals?
- Missing semantic variants that callers will otherwise fake with overrides?
- Values that should have become tokens but were hardcoded?
- Unused styles, inconsistent property names (`padding` vs `paddingInline`
  without reason)?

If a check fails, fix it — do not explain the violation and leave it.

## Adaptations for this library (deliberate deviations)

- **The `style` prop stays broadly typed** (`StyleXStyles`, merged last). The
  doctrine prefers whitelisted slot overrides; here the distribution model is
  code ownership — the component source in the consumer's project
  is the real escape hatch, and a broad `style` prop is a core, documented
  selling point. Variants remain the recommended path; the guide says so.
- **SVG geometry attributes** (`viewBox`, `path d`, icon `width`/`height`) are
  not CSS and stay literal.
- **Motion micro-values** inside keyframes (`scale(0.97)`) stay literal; the
  duration comes from the `duration` scale.

## Doctrine

Consistency > local prettiness. Tokens > literals. Variants > escape hatches.
Reuse > new style objects. StyleX constraints are the product — do not weaken
them.
