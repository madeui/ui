# Global CSS reset for StyleX apps (what `madeui init` should write)

Date: 2026-09-04
Status: research, no code changed. Sources are primary (StyleX docs and
source, Astryx source and docs, the CSS Cascade spec, Tailwind Preflight
source, our own repo). Every claim carries its source.

## Question

`madeui init` now removes Tailwind (and therefore Preflight) from freshly
scaffolded Next.js and Vite apps. Afterwards the app has no reset:
`box-sizing: content-box`, body margin, default heading and list margins, form
controls with their own font. Our components are developed and screenshot
under a reset (playground: a three-property `@layer base` reset; docs
previews: full Tailwind Preflight). What reset should `init` write, in which
form, in which file for Next.js vs Vite, in which cascade layer, and why?

## Findings

### 1. What StyleX itself recommends

1.1 The PostCSS installation guide shows exactly one global CSS file that
contains the `@stylex` directive, and its example puts a reset in a layer
**before** the directive:

```css
@layer base {
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  /* other base styles */
}

@stylex;
```

"If your build pipeline supports CSS imports, we recommend importing this in
your root layout component, so that it is included for all routes of your
app." The plugin "replace[s] the `@stylex` directive with the generated CSS".
Source: https://stylexjs.com/docs/learn/installation/postcss

1.2 The Next.js guide repeats the pattern with the layer named `resets` and
`useCSSLayers: true` in `postcss.config.js`:
https://stylexjs.com/docs/learn/installation/nextjs. The official example app
ships the same file (`@layer resets { * { box-sizing; padding: 0; margin: 0 }
html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale } }`
followed by `@stylex;`) and `useCSSLayers: true`:
https://github.com/facebook/stylex/blob/main/examples/example-nextjs/app/app.css
https://github.com/facebook/stylex/blob/main/examples/example-nextjs/postcss.config.js

1.3 The Vite guide: "it is useful to have at least one CSS file that is
imported by a component that is part of every route, such as the root layout
component. This CSS file is also a good place for any CSS resets or global
styles that you may want." The unplugin will "inject the generated CSS in the
existing CSS asset". Its example `vite.config.ts` sets `useCSSLayers: true`,
and the StyleX plugin is listed before `react()`.
Source: https://stylexjs.com/docs/learn/installation/vite

1.4 StyleX has no reset of its own and no doc page about resets beyond the
snippets above. Its docs on `defineVars` only say variables are global CSS
custom properties (emitted on `:root`), nothing about ordering against a
reset. Source: https://stylexjs.com/docs/api/javascript/defineVars

### 2. How StyleX emits layers (`useCSSLayers`)

2.1 Option shape and default, identical for the PostCSS plugin and the
unplugin:

```ts
useCSSLayers: boolean | { before?: string[], after?: string[], prefix?: string } // default: false
```

`before`: "extra layer names placed before StyleX's priority layers in the
ordering header"; `after`: placed after; `prefix`: "prepended to every StyleX
layer name (joined with `.`)". With layers off, StyleX manages specificity
with `:not(#\#)` bumps instead of `@layer`.
Sources: https://stylexjs.com/docs/api/configuration/postcss-plugin ,
https://stylexjs.com/docs/api/configuration/unplugin

2.2 Documented output for `{ before: ['reset','base'], after: ['utilities'], prefix: 'stylex' }`:

```css
@layer reset, base, stylex.priority1, stylex.priority2, utilities;
@layer stylex.priority1 { /* low-priority rules */ }
@layer stylex.priority2 { /* higher-priority rules */ }
```

Source: https://stylexjs.com/docs/api/configuration/postcss-plugin

2.3 Layer names come from `processStylexRules` in the Babel plugin: rules are
grouped by `Math.floor(priority / 1000)`; each group becomes
`priority{index+1}` (or `{prefix}.priority{index+1}`); the header is
`@layer <before...>, priority1, ..., priorityN, <after...>;`. The group with
priority 0 is deliberately **not** wrapped in a layer ("Don't put @property,
@keyframe, @position-try in layers"; `useLayers && pri > 0`).
Source: https://github.com/facebook/stylex/blob/main/packages/%40stylexjs/babel-plugin/src/index.js
(functions `processStylexRules`, `layerName`, the `header` and the
`collectedCSS` map). Our own experience matches: a conditional custom
property with a non-null default is emitted unlayered and beats the layered
`[data-*]` rule (`packages/registry/STYLEX.md` lines 99-101; `ROADMAP.md`
research log 2026-08-29).

2.4 Where the CSS lands:
- PostCSS plugin: in place of the `@stylex` directive, so the position of the
  directive in the user's file decides the order (finding 1.1).
- unplugin, Vite build: the collected CSS is **appended** to the chosen CSS
  asset: `const nextSource = current ? current + '\n' + css : css;` in
  `generateBundle`; the dev "css-only" path writes the same
  `current + '\n' + css`. Target asset: a file named `index.css` or
  `style.css` (hashed or not), else the first CSS asset, else a new
  `stylex.css`.
  Sources: https://github.com/facebook/stylex/blob/main/packages/%40stylexjs/unplugin/src/vite.js
  (lines 149-160 and 195-212),
  https://github.com/facebook/stylex/blob/main/packages/%40stylexjs/unplugin/src/core.js
  (`INDEX_CSS_RE`, `STYLE_CSS_RE`, `cssInjectionTarget` docs at
  https://stylexjs.com/docs/api/configuration/unplugin ).
- The unplugin defaults to `useCSSLayers = false` (`core.js`, option
  destructuring around line 235). Only the Bun adapter defaults it to `true`
  (`bun.js`). Our `init` Vite snippet does not set it, so Vite apps we set up
  today get **unlayered** StyleX output (`packages/cli/src/vite.mjs`,
  `STYLEX_PLUGIN_SNIPPET`; `packages/cli/src/init.mjs` framework entry
  `vite`, comment "with unlayered output no reset-layer concern").

### 3. CSS Cascade Level 5: the ordering rule

3.1 "any declaration not assigned to an explicit layer is added to an
implicit final layer. Cascade layers (like declarations) are ordered by order
of appearance. When comparing declarations that belong to different layers,
then for normal rules the declaration whose cascade layer is last wins, and
for important rules the declaration whose cascade layer is first wins."
(§6.4). Layers are compared **before** specificity: the sort order is origin
and importance, context, element-attached styles, layers, specificity, order
of appearance (§6.1).
Source: https://www.w3.org/TR/css-cascade-5/#layering ,
https://www.w3.org/TR/css-cascade-5/#cascade-sort

3.2 "Cascade layers are sorted by the order in which they first are declared"
and the statement form `@layer a, b;` declares "each of the layers in the
order specified" (§6.4.3). So a bare `@layer base;` at the top of the file
fixes `base` as the first (lowest) layer even if its block comes later.
Source: https://www.w3.org/TR/css-cascade-5/#layer-ordering

3.3 Consequences for us, with `useCSSLayers` on:
- A reset inside `@layer base`, with `base` declared before StyleX's
  `priority*` layers, loses to **every** StyleX rule regardless of
  specificity. Desired.
- Any unlayered author CSS (a stray `button { padding: 0 }` anywhere in the
  app) beats every StyleX rule. This is the bug we hit on 2026-08-28
  (`ROADMAP.md` research log: "paddings/margins silently zeroed").
- `!important` inside `@layer base` beats StyleX (first layer wins for
  important declarations). The reset must not use `!important`. Preflight's
  `[hidden] { display: none !important }` is the one rule we must not copy
  blindly.
- With layers **off** (our current Vite path), StyleX's selectors carry
  `:not(#\#)` bumps (finding 2.1) and win over element-selector resets by
  specificity, so ordering is irrelevant there, but consumer CSS also cannot
  override component styles from a stylesheet.

### 4. What Meta's Astryx does (a StyleX design system)

4.1 Astryx ships a real reset file, `@astryxdesign/core/reset.css`, wrapped
in `@layer reset`, every selector in `:where()` for zero specificity, and
describes itself as "Built on the same principles as Tailwind Preflight and
modern-normalize". Its header documents the layer order
`reset → astryx-base → astryx-theme` and "Consumer styles (unlayered) always
override all Astryx layers."
Source: https://github.com/facebook/astryx/blob/main/packages/core/src/reset.css

4.2 Contents (abridged, all inside `@layer reset` and `:where()`):
`*, *::before, *::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: currentColor }`;
`html { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4; color-scheme: light dark; -webkit-tap-highlight-color: transparent }`;
`body { margin: 0; line-height: inherit; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale }`;
headings `font-size: inherit; font-weight: inherit`; margins zeroed on
`h1-h6, p, blockquote, figure, pre, dl, dd`; `a { color: inherit; text-decoration: inherit }`;
`ol, ul, menu { list-style: none; margin: 0; padding: 0 }`;
`img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle }`;
`img, video { max-width: 100%; height: auto }`;
`button, input, optgroup, select, textarea { font: inherit; color: inherit; margin: 0; padding: 0 }`;
`button, [type=button|reset|submit] { appearance: button; background-color: transparent; background-image: none }`;
`textarea { resize: vertical }`; `::placeholder { opacity: 1; color: var(--color-text-secondary, …) }`;
`fieldset { margin: 0; padding: 0 }`; `legend { padding: 0 }`;
`table { text-indent: 0; border-color: inherit; border-collapse: collapse }`;
`hr`, `summary`, `dialog`, `[hidden] { display: none }` (no `!important`),
plus `html[data-theme]` to `color-scheme` mapping. Same source as 4.1.

4.3 Wiring. Getting started tells consumers to import
`@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css` and a theme
CSS, and warns: "If your project has existing global CSS, a legacy reset, or
Tailwind, declare the layer order explicitly and assign every stylesheet to a
layer deliberately: unlayered styles and later layers both override
astryx-base regardless of specificity."
Source: https://astryx.atmeta.com/docs/getting-started

4.4 Their Next.js + PostCSS example makes StyleX write the layer order by
using the `before` option:

```js
useCSSLayers: {
  // Declare Astryx dist layers before StyleX app layers so
  // product styles always win over component defaults.
  before: ['reset', 'astryx-base', 'astryx-theme'],
},
```

and the app CSS is just the three imports followed by `@stylex;`.
Sources: https://github.com/facebook/astryx/blob/main/apps/example-nextjs-stylex/postcss.config.js ,
https://github.com/facebook/astryx/blob/main/apps/example-nextjs-stylex/src/app/globals.css

4.5 Their non-StyleX Next.js example instead imports a dedicated
`layers.css` first, with this warning about bundlers:
"Layer order declaration — must be the first CSS in the bundle. Separate file
because webpack hoists @import content above inline CSS, so an inline @layer
statement in globals.css would appear after reset.css and theme.css content
in the output." Relevant if we ever ship the reset as an `@import`ed file.
Source: https://github.com/facebook/astryx/blob/main/apps/example-nextjs-source/src/app/layers.css

4.6 Migration guide: "Layers change the rules twice: unlayered styles beat
every named layer, and a later layer beats an earlier one, both regardless of
specificity." Tailwind v4 coexistence is done by importing Preflight into a
named layer: `@import "tailwindcss/preflight.css" layer(base);`.
Source: https://astryx.atmeta.com/docs/migration ,
https://github.com/facebook/astryx/blob/main/packages/cli/assets/docs/migration.doc.mjs

### 5. Other StyleX projects in the wild

5.1 `brijr/craft` (StyleX app) — a small hand-written layered reset before
`@stylex;`: `@layer reset { *, *::before, *::after { box-sizing: border-box }
html { line-height: 1.5; tab-size: 4; text-size-adjust: 100% } body { margin: 0 }
button, input, optgroup, select, textarea { color: inherit; font: inherit }
img, svg, video { display: block } }`.
Source: https://github.com/brijr/craft/blob/main/apps/stylex/app/globals.css

5.2 `polarsource/polar` and `clerk/javascript` keep Tailwind next to StyleX
(`@import 'tailwindcss'; @stylex;`), so Preflight is their reset. Not our
path after `init` removes Tailwind.
Sources: https://github.com/polarsource/polar/blob/main/clients/apps/web/src/styles/globals.css ,
https://github.com/clerk/javascript/blob/main/packages/swingset/src/app/globals.css

5.3 A GitHub code search for `@stylex;` in CSS files (grep.app) returned only
the above plus StyleX's own examples; there is no widespread convention
beyond "small layered reset, then `@stylex`", or "Tailwind + `@stylex`".

### 6. Reference resets (rules that matter for our components)

Preflight source: https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/preflight.css
modern-normalize: https://github.com/sindresorhus/modern-normalize/blob/main/modern-normalize.css
Josh Comeau: https://www.joshwcomeau.com/css/custom-css-reset/

| Rule | Preflight | modern-normalize | Comeau | Astryx | StyleX docs example |
|---|---|---|---|---|---|
| `box-sizing: border-box` on `*, ::before, ::after` | yes (+`::backdrop`, `::file-selector-button`) | yes | yes | yes | yes (`*`) |
| `margin: 0` / `padding: 0` universally | yes (+ `border: 0 solid`) | no (body, forms only) | `*:not(dialog) { margin: 0 }` | per element group | yes |
| `html { line-height: 1.5; -webkit-text-size-adjust: 100%; tab-size: 4 }` | yes (+ font stack, tap highlight) | `line-height: 1.15`, text-size-adjust, tab-size | `body { line-height: 1.5 }` | yes | no (font smoothing only) |
| headings `font-size/weight: inherit` | yes | no | no | yes | no |
| `a { color: inherit; text-decoration: inherit }` | yes | no | no | yes | no |
| `ol, ul, menu { list-style: none }` | yes | no | no | yes | no |
| media `display: block; vertical-align: middle`, `img, video { max-width: 100%; height: auto }` | yes | no | `display: block; max-width: 100%` | yes | no |
| form controls `font: inherit; color: inherit` | yes (+ letter-spacing, `border-radius: 0`, `background-color: transparent`, `opacity: 1`) | font-family/size/line-height, `margin: 0` | `font: inherit` | yes (+ margin/padding 0) | no |
| `button, [type=…] { appearance: button }` | yes | `-webkit-appearance: button` | no | yes (+ transparent bg) | no |
| `::placeholder { opacity: 1 }` (Firefox) | yes (+ color-mix color) | no | no | yes | no |
| `textarea { resize: vertical }` | yes | no | no | yes | no |
| `table { border-collapse: collapse; text-indent: 0; border-color: inherit }` | yes | `border-color: currentcolor` | no | yes | no |
| `[hidden] { display: none }` | `!important` | no | no | no `!important` | no |

modern-normalize's reason for `margin: 0` on form controls: "Remove the margin
in Firefox and Safari" (UA margins on buttons/inputs there). Preflight's
reason for `appearance: button`: "Correct the inability to style the border
radius in iOS Safari."

### 7. What our components already set vs. what they inherit from a reset

Checked in `packages/registry/src/ui/*.tsx` (grep on 2026-09-04).

Hard reliance (components break without it):
- **`box-sizing: border-box`.** Only `toast.tsx` sets `boxSizing`. `input.tsx`
  sets `height: space.s9`, `borderWidth: stroke.border`, `paddingInline`,
  `width: '100%'`; `button.tsx` sizes set `height` and the `outline` variant
  adds a border; `select.tsx` trigger likewise. Under `content-box` heights
  grow by the border and the full-width input overflows its container by its
  padding. This is the one rule everything depends on.

Soft reliance (visible differences, no layout breakage):
- **Form-control margins.** `button.tsx`, `input.tsx`, `textarea.tsx`,
  `checkbox.tsx`, `switch.tsx` set no `margin`; Safari/Firefox UA margins
  would show (modern-normalize note in §6). Universal `margin: 0` covers it.
- **`::placeholder` opacity.** `input.tsx`/`textarea.tsx` set placeholder
  `color: colors.mutedForeground`; without `::placeholder { opacity: 1 }`
  Firefox dims it further (Preflight comment, tailwindcss issue 3300).
- **`appearance: button`** on `<button>`/`<a>` rendered as buttons: legacy
  iOS Safari border-radius issue; harmless to include.

Already handled in components (a reset is not needed for these):
- Fonts: `button`, `input`, `textarea`, `select`, `label`, `kbd`, `table`,
  `card`, `alert`, `dialog`, `sheet` all set `fontFamily: font.sans` and
  `fontSize`; `button`/`select`/`textarea` set `lineHeight`.
- Text-element margins: `card.tsx` (`<h3>`, `<p>`), `alert.tsx` (`<h5>`),
  `dialog.tsx`, `sheet.tsx`, `item.tsx` set `margin: 0` on titles and
  descriptions (14 files set `margin: 0`, 15 set `padding: 0`).
- Lists: `breadcrumb.tsx` (`<ol>`), `pagination.tsx` (`<ul>`) set
  `listStyle: 'none'`, `margin: 0`, `padding: 0`; `field.tsx` error list
  sets its own `listStyle: 'disc'` and padding.
- Buttons/controls: `button.tsx` `borderStyle: 'none'` + per-variant
  `backgroundColor` + `textDecoration: 'none'` (so `PaginationLink`'s `<a>`
  render is covered); `checkbox.tsx`/`radio-group.tsx` `padding: 0`,
  `borderStyle: 'solid'`; `switch.tsx` `borderStyle: 'none'`.
- `textarea.tsx` `resize: 'vertical'`; `table.tsx` `borderCollapse`;
  `avatar.tsx` image `objectFit: 'cover'`; icons get explicit width/height via
  `icon.*` (`lib/stylex-utils.ts`) inside flex containers, so `svg { display:
  block }` is not needed for them.

Not relied on, app-level only: heading `font-size/weight: inherit`,
`a { color: inherit }`, `ol, ul { list-style: none }`, `img { max-width: 100% }`.
These change the consumer's own markup, not ours.

### 8. What our surfaces render under today

- **Playground** (`apps/playground/app/globals.css`): `@layer base;` first,
  then `@stylex;`, then `@layer base { * { box-sizing: border-box; margin: 0;
  padding: 0 } }`, with `useCSSLayers: true` in
  `apps/playground/postcss.config.js`. The VRT baseline was produced under
  this three-property reset.
- **Docs previews**: Blume renders every example in its own iframe whose
  stylesheet starts with `@import "tailwindcss";` ("Tailwind (preflight +
  utilities scanned from the example sources)"), then `@layer base { body {…} }`,
  then our `examples.css` (which only holds `@stylex;`). So previews render
  under **full Preflight**, and the docs' StyleX plugin runs **without**
  layers ("the docs' own (unlayered) styles would beat layered StyleX rules").
  Sources: `apps/docs/node_modules/blume/src/theme/entry.ts`
  (`examplesEntryTemplate`, lines ~794-830), `apps/docs/blume.config.ts`
  (lines ~145-183), `apps/docs/styles/examples.css`, `ROADMAP.md` spike
  gotcha 2.
- **CLI `init` today** (`packages/cli/src/init.mjs`): fresh Next.js globals
  get the playground template (`GLOBALS_CSS`); an existing non-Tailwind
  `globals.css` is wrapped whole in `@layer base` with `@layer base;` and
  `@stylex;` prepended (`ensureGlobalsCss`). The Tailwind-removal path
  (`packages/cli/src/tailwind.mjs`) strips the Tailwind at-rules but adds no
  reset. After removal, create-next-app's `app-tw` template leaves only
  `:root` variables and `body { background; color; font-family: Arial }`
  (https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/app-tw/ts/app/globals.css)
  — no `box-sizing`. The plain create-next-app template already contains
  `* { box-sizing: border-box; padding: 0; margin: 0 }`
  (https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/app/ts/app/globals.css).
  For Vite, `init` writes no CSS at all (`css: null`); create-vite's
  `src/index.css` has `body { margin: 0 }`, `p { margin: 0 }` and
  `box-sizing` only on `#root`, no form-control font inheritance
  (https://github.com/vitejs/vite/blob/main/packages/create-vite/template-react-ts/src/index.css).

## Recommendation

### Layer and mechanism

1. **Keep resets in `@layer base`, always declared before StyleX's layers.**
   This is the StyleX-documented pattern (1.1, 1.2), the Astryx pattern (4.1,
   4.4) and what the spec guarantees (3.1-3.3): layered reset < StyleX
   `priority*` layers < unlayered consumer CSS. Keep the layer name `base`
   (playground, `init`, StyleX docs all use it; `resets` is a synonym in the
   Next.js guide).
2. **Make StyleX declare the order itself** with
   `useCSSLayers: { before: ['base'] }` in the generated `postcss.config.js`
   (Next.js) and in the Vite plugin snippet. StyleX then emits
   `@layer base, priority1, …;` at the top of its own output (2.2, 2.3),
   exactly as Astryx does (4.4). Keep the bare `@layer base;` statement at the
   top of the CSS file as well: it costs nothing and protects the order if the
   user moves `@stylex;` or the file later gains `@import`s (4.5). Both must
   agree on the name `base`.
3. **Vite: turn layers on** (`useCSSLayers: { before: ['base'] }`) for parity
   with Next.js and one rule in the docs. StyleX's Vite guide enables layers
   in its example (1.3), and in builds the unplugin appends its CSS after the
   user's `index.css` content (2.4), so the `@layer base;` statement in
   `index.css` precedes the StyleX header. In dev the CSS is served through
   virtual modules and a runtime `<style>` element, where the relative order
   is not something we verified; this is why recommendation 2 matters: with
   `before: ['base']` StyleX's own header declares `base` first wherever its
   CSS lands, in either order. Trade-off to record in
   the docs and in `AGENTS.md` written by `init`: with layers on, unlayered
   consumer CSS overrides component styles (3.3), so the rule "global CSS
   lives in `@layer base`" applies to Vite too. (Alternative: keep Vite
   unlayered, see open question 1.)
4. **No `!important` and no `:where()` needed.** Inside a layer that sits
   below every StyleX layer, specificity is irrelevant against StyleX;
   `:where()` only matters between the reset and other rules in `base`, where
   later source order already wins. Astryx uses `:where()` because its reset
   is a shipped file consumers cannot edit; ours is written into the user's
   file. Never use `!important` in `base` (3.3).

### The reset to write (both frameworks)

Keep the three properties the playground uses (they define the VRT baseline),
add only rules our components measurably depend on or that align with the
Preflight baseline the docs render under (§6, §7). Everything app-level
(heading resets, link colors, list styles) stays out.

```css
/* madeui: global reset. It lives in @layer base, declared before the StyleX
   layers, so every component style wins over it. Unlayered CSS beats ALL
   StyleX rules — keep your own global styles inside @layer base too. */
@layer base;

@stylex;

@layer base {
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
  }

  button,
  input,
  select,
  optgroup,
  textarea {
    font: inherit;
    color: inherit;
  }

  button,
  input:where([type='button'], [type='reset'], [type='submit']) {
    appearance: button;
  }

  ::placeholder {
    opacity: 1;
  }

  img,
  svg,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }
}
```

Rationale per block: universal `box-sizing/margin/padding` is the hard
dependency and the existing playground baseline (§7, §8; Preflight and the
StyleX docs example do the same); `html` line-height/text-size-adjust/tab-size
is shared by Preflight, modern-normalize, Astryx and brijr/craft (§6, 5.1) and
gives the consumer's own text the same baseline as docs previews; form-control
`font/color: inherit` is in every reference reset, components set their own
fonts anyway, but consumer forms and Base UI parts we do not style (e.g. a
native `<select>` fallback) inherit correctly; `appearance: button` and
`::placeholder { opacity: 1 }` fix Safari/Firefox rendering of our own
controls (§7); block media with `max-width: 100%` is the Comeau/Preflight
rule that avoids the inline-image gap under Card and Avatar content. Order
of the `@stylex;` marker: after the `@layer base;` statement, before the
block, matching the current playground file (ordering of the block itself
does not matter once `base` is declared first, 3.2).

Note the `input:where([type=…])` selector is Preflight's; `:where()` there is
only to keep the type-selector list readable, not for specificity.

### Where `init` writes it

Next.js (PostCSS plugin, `app/globals.css` / `src/app/globals.css`):
- Fresh file: write the block above verbatim.
- Existing file, Tailwind removed by `init`: after stripping the Tailwind
  at-rules, prepend `@layer base;` and `@stylex;`, then write our reset
  block, then wrap the remaining user CSS in its own `@layer base { … }`
  after it (user rules later in the same layer override ours by source
  order, 3.1). Today this path adds no reset (§8), which is the gap.
- Existing non-Tailwind file (create-next-app plain template already has the
  `*` reset): keep today's wrap-in-`@layer base` behaviour and still insert
  our block first; duplicated declarations in the same layer are harmless.
- `postcss.config.js`: `useCSSLayers: { before: ['base'] }` instead of
  `true`.

Vite (unplugin, `src/index.css`):
- Prepend `@layer base;`, then our reset block (no `@stylex;` marker; the
  unplugin appends its CSS to the `index.css` asset, 2.4), then wrap the
  template's existing CSS in `@layer base { … }`. Record the file in
  `madeui.json` `css` (today `null`).
- Plugin snippet: add `useCSSLayers: { before: ['base'] }` (recommendation 3).
- The app must import `src/index.css` from its root (create-vite does in
  `main.tsx`); otherwise the unplugin creates a separate `stylex.css` (2.4)
  and the `@layer base;` statement in an unlinked file has no effect.

Playground: replace `apps/playground/app/globals.css` with the same block so
the playground is the reference implementation of what `init` writes, and
switch its `postcss.config.js` to `{ before: ['base'] }`. Re-run VRT after
(open question 3).

## Open questions

1. **Layers on or off for Vite?** On (recommended) gives one model for both
   frameworks and lets consumer stylesheets override components, as StyleX
   and Astryx intend; off (today) makes components immune to stray consumer
   CSS but blocks stylesheet overrides and diverges from Next.js. Decision
   needed before touching `vite.mjs`.
2. **Single source of truth for the reset text.** Today it would live in
   `init.mjs` (`GLOBALS_CSS`), `apps/playground/app/globals.css`, and
   implicitly in Blume's Preflight for docs previews. Options: a
   `packages/registry/src/reset.css` that `build-registry` copies into the
   CLI and playground, or a registry item (`madeui add reset`) that `init`
   installs. If it ever becomes an `@import`ed file, the layer-order
   statement must precede the import or the import must use `layer(base)`
   (4.5).
3. **VRT impact.** Adding `html { line-height: 1.5 }` and form-control
   `font: inherit` may move pixels in playground screenshots (inputs inherit
   `line-height` under Preflight-style resets). Docs previews already render
   this way under Preflight, so the docs are the reference; expect small
   playground diffs and re-baseline deliberately.
4. **Should docs previews stop using Preflight?** Previews run under full
   Preflight (§8), a superset of our reset (headings, links, lists reset
   too). Examples that look right in the docs may show UA heading margins or
   link underlines in a consumer app. Either make examples not depend on the
   extra Preflight rules, or feed our reset into `examples.css` and compare.
5. **`::backdrop`, `::file-selector-button`, `[hidden]`.** Preflight resets
   these too. Dialog backdrops are styled by `dialog.tsx`; `input.tsx` styles
   `::file-selector-button` itself; `[hidden]` would need `!important` to
   beat StyleX `display` values, which 3.3 rules out. Left out on purpose;
   revisit if a component starts relying on them.
6. **`color-scheme` / font smoothing.** Astryx sets `color-scheme: light dark`
   and font smoothing in its reset; StyleX's example sets font smoothing.
   Both are taste, not component requirements; `themes.ts` is the better home
   for `color-scheme` if we want it.
