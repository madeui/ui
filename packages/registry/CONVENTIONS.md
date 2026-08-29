# Component API conventions

The contract every component in this registry follows. Consistency is a hard
requirement: agents and humans rely on the same shape everywhere.

## Structure

- One file per component in `src/ui/<name>.tsx`, `'use client'` at the top.
- Behavior comes from Base UI (`@base-ui/react/<part>`); we own only the styled
  layer and composition. Never re-implement focus/keyboard/aria logic.
- Multi-part components export flat compound names: `Dialog`, `DialogTrigger`,
  `DialogContent`, ... Pass-through parts (no styling) are re-exported directly.
- Simple elements with no Base UI primitive (Badge, Card, Alert, Textarea) wrap
  native elements.

## Props

- `variant?: '...'` and `size?: 'sm' | 'md' | 'lg'` where applicable; defaults
  `variant="primary"`-equivalent and `size="md"`.
- Every styled component accepts `style?: StyleXStyles`, merged LAST via
  `stylex.props(styles.x, variants[variant], style)` — caller overrides always
  win. Native `className`/`style` are omitted from the public props
  (`Omit<..., 'className' | 'style'>`).
- Everything else spreads through to the underlying part (`{...props}` before
  the stylex props).

## Styling

Binding rules: [STYLEX.md](./STYLEX.md) (doctrine) and
[stylex-authoring.md](./stylex-authoring.md) (API mechanics). Summary:

- Tokens only — no magic numbers or raw colors anywhere in components:
  - themable vars from `@/lib/tokens.stylex` (colors, radius, font, shadow);
  - non-themed scales from `@/lib/constants.stylex` (`space`, `fontSize`,
    `lineHeight`, `fontWeight`, `z`, `duration`, `stroke`, `container`).
  If a value is missing, extend the scale deliberately — never invent a
  one-off inside a component.
- Base UI state (checked, open, highlighted, transitionStatus) is styled with
  attribute-selector condition keys (StyleX ≥0.18) — Base UI mirrors every
  state as a data attribute:
  `backgroundColor: { default: 'transparent', '[data-highlighted]': colors.accent }`.
  Components spread plain `stylex.props(...)`; no className-as-function
  adapter. Conditional custom properties must use `default: null` + a
  `var(--x, fallback)` at the consumption site (a non-null default is emitted
  unlayered and beats the layered `[data-*]` rule).
- Interactive states use StyleX conditional values
  (`{ default: ..., ':hover': ..., ':focus-visible': ... }`).
- Enter/exit animations are transitions through Base UI's
  `[data-starting-style]` / `[data-ending-style]` frames (per-side slide via
  `[data-side]`-driven custom properties); `stylex.keyframes` only where a
  transition can't express it (e.g. accordion panel height).
- Focus ring: `outline: 2px solid colors.ring; outlineOffset: 2px` (or inset
  where offset clips).
- **Even metrics only.** Component metrics (heights, paddings, line boxes) land
  on the 4px grid — never a value that produces odd pixel sizes. Single-line
  control text uses `lineHeight.control` (20px, pairs with `fontSize.sm`);
  ratio line-heights (`normal` = 1.5 → 21px) are for prose, not controls.
- **Popup edges are shadow rings, not borders.** Base UI's
  align-item-with-trigger math ignores popup borders (a border shifts aligned
  text by its width). Use the recipes from `@/lib/stylex-utils` — StyleX
  dynamic styles, called like Tailwind shorthands:
  `stylex.props(styles.popup, ring({ shadow: shadow.md }))`,
  `ring({ width: stroke.focus, color: colors.ring })`.
  Raw multi-zero values (`'0 0 0 1px'`) must be template literals — the shadcn
  CLI transformer mangles zero runs in plain strings but leaves template
  literals intact.

## Token values (shadcn CLI transformer constraint)

The shadcn CLI rewrites some CSS-like strings inside distributed files. To
survive installation byte-identical:
- colors as `oklch()` (space syntax) or hex — never comma syntax like
  `rgba(0, 0, 0, 0.5)`;
- in `oklch(... / alpha)`, keep adjacent components distinct tokens: write
  black as `oklch(0% 0 0deg / 50%)`, never `oklch(0 0 0 / 50%)` (adjacent
  equal zeros get collapsed);
- shadow values: hex-alpha colors only (`0 1px 2px #0000000d`) — the CLI
  parses shadow shorthands separately and mangles `oklch()` inside them — and
  no lone `0` spread component;
- inline SVG attributes with number lists (`viewBox`, `path d`) as template
  literals — `viewBox={` + backtick + `0 0 12 12` + backtick + `}` — plain string
  literals AND `{'...'}` both get mangled (`"0 0 12 12"` → `"0 12"`).

## Examples & docs authoring


- **One focused example per feature.** Never a variant collage. Files are named
  `<component>-<feature>.tsx` (`button-outline.tsx`, `select-scrollable.tsx`);
  the hero is `<component>-demo.tsx` and shows the single most representative
  real-world use, not every variant at once.
- **Examples use StyleX, never inline `style={{...}}`.** Layout via
  `stylex.create`; text/colors via tokens (`colors.*`, `font.*`). Examples are
  teaching material — they must model the practice we want users to copy.
- **Docs page section order:**
  1. Hero `<Component />`
  2. `## Install` (CLI command)
  3. `## Usage` (imports + minimal snippet)
  4. `## Composition` — multi-part components only: the anatomy as a bare JSX
     tree in a code block
  5. One `## <Feature>` section per example (Default, Secondary, Sizes,
     Disabled, Scrollable, ...), each with its own `<Component />`; add a
     one-line explanation only when the example isn't self-evident
  6. `## API reference`
- **API reference rules:** start with the Base UI attribution + link
  ("built on Base UI X; other props forwarded — full list in the Base UI API
  reference"). Tables cover only props this library adds or changes. Every
  styled part must appear — either with its own table or in the closing
  `### Styling` line ("`X`, `Y` accept `style` ..."). Unstyled re-exports are
  labeled "Base UI parts re-exported unstyled".
- Docs pages are generated/edited under `apps/docs/content/components/`;
  frontmatter `description` values containing `:` must be quoted (YAML).

## Registry

- Registry JSON is generated by `scripts/build-registry.mjs` from the sources —
  never hand-edited. New component = source file + example + description entry
  in the script.
- Every ui item depends on `@ui-lib/theme` and `@ui-lib/utils`.
- Each component has a demo in `examples/<name>-demo.tsx` importing from
  `@/components/ui/<name>` (consumer-shaped paths), used by both docs previews
  and as agent-readable usage reference.
