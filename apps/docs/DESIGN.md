---
name: madeui
description: UI you own, down to the token — Base UI + StyleX components copied into your project as editable source.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-foreground: "oklch(0.985 0 0)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  overlay: "oklch(0% 0 0deg / 50%)"
  background-dark: "oklch(0.145 0 0)"
  foreground-dark: "oklch(0.985 0 0)"
  card-dark: "oklch(0.205 0 0)"
  primary-dark: "oklch(0.922 0 0)"
  primary-foreground-dark: "oklch(0.205 0 0)"
  secondary-dark: "oklch(0.269 0 0)"
  muted-foreground-dark: "oklch(0.708 0 0)"
  border-dark: "oklch(0.269 0 0)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
typography:
  display:
    fontFamily: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.375rem, 5.4vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.625rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  s05: "0.125rem"
  s1: "0.25rem"
  s15: "0.375rem"
  s2: "0.5rem"
  s25: "0.625rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.25rem"
  s6: "1.5rem"
  s7: "1.75rem"
  s8: "2rem"
  s9: "2.25rem"
  s10: "2.5rem"
  s12: "3rem"
  s16: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.foreground-dark}"
    textColor: "{colors.primary-foreground-dark}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.foreground-dark}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  badge-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.625rem"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: "1.25rem"
---

# Design System: madeui

## Overview

**Creative North Star: "The Operating Instrument"**

madeui's landing is not a components gallery; it is one product window — a
five-tab stage (Cards, Dashboard, Inbox, Team, Settings) that the visitor
can actually click through. The whole page is built to feel like an
instrument panel: flat, monochrome, precisely gridded, every control
legible because nothing is competing for attention with color. The visual
system is the argument. Because the interface has no hue accent to hide
behind, every spacing, radius, and weight decision has to be exactly right
— sloppy alignment would read immediately against a palette this quiet.

The page explicitly rejects the component-grid bento layout and the
metric-hero template that most dev-tool landings default to. There is no
decorative gradient, no illustration, no marketing screenshot standing in
for the product — the stage in the hero is dozens of real registry
components (Tabs, Card, Table, Button, Select, and two dozen more, down to
InputOTP and Meter), rendered live across five distinct screens, each
drawing its own chrome. Ink-on-paper is the whole palette: foreground and
background invert per theme, and every other color in the system is a step
of gray between them, plus one warm red reserved exclusively for
destructive actions.

**Key Characteristics:**
- Pure monochrome (oklch grays only); zero hue accent anywhere in chrome or components.
- A five-tab product stage as the hero's proof, not a grid of feature cards — four scenes draw their own bordered window, the fifth floats free as a card grid.
- Full-radius (pill) shape for every interactive chip: buttons, badges, the version pill, the search field, the command chip.
- Geist across the whole landing (a page-level theme on the `font.sans` token); the H1 alone adds −0.04em display tracking.
- Flat surfaces with a single low, tight shadow — no colored glow, no blur-heavy elevation.
- The page column is bounded by dashed layout rails; the scene stage stays inside that same column rather than breaking out of it.

## Colors

Every color in the system is an achromatic oklch gray (chroma 0) except the single destructive red; the accent itself is just the foreground/background inversion, and it flips wholesale between themes rather than shifting hue.

### Primary
- **Ink** (`oklch(0.205 0 0)` light / `oklch(0.922 0 0)` dark — token `primary`): the solid button and the primary badge (e.g. the "Overdue" status). This is the only color in the system that reads as "the brand," and it is a neutral, not a hue.

### Neutral
- **Paper** (`oklch(1 0 0)` light / `oklch(0.145 0 0)` dark — token `background`): page and card background.
- **Foreground** (`oklch(0.145 0 0)` light / `oklch(0.985 0 0)` dark — token `foreground`): body text, headings, icon strokes.
- **Muted foreground** (`oklch(0.556 0 0)` light / `oklch(0.708 0 0)` dark — token `mutedForeground`): secondary nav links, captions, timestamps, placeholder-weight copy.
- **Muted surface** (`oklch(0.97 0 0)` light / `oklch(0.269 0 0)` dark — token `muted`): hover fill for icon buttons and menu items, workspace-switcher hover, secondary badge fill.
- **Border** (`oklch(0.922 0 0)` light / `oklch(0.269 0 0)` dark — token `border`): every hairline — card edges, the frame, the header/footer top rules, dividers.
- **Ring** (`oklch(0.708 0 0)` light / `oklch(0.556 0 0)` dark — token `ring`): focus outline color.
- **Destructive** (`oklch(0.577 0.245 27.325)` light / `oklch(0.704 0.191 22.216)` dark — token `destructive`): the one chromatic color in the system, reserved for destructive button/badge variants only. It does not appear anywhere in the shipped landing page.

### Named Rules
**The No-Hue Rule.** Every token except `destructive` has chroma 0. Do not introduce a violet, blue, or brand hue accent anywhere in chrome, marketing surfaces, or component defaults — this was a deliberate reversal from an earlier violet-accent identity (see `47813a0`).

**The Dark-Class Bridge Rule.** Dark mode is a compiled StyleX theme (`darkTheme` from `stylex.createTheme`), applied to `<html>` — never a subtree wrapper — because dialogs and popovers portal to `<body>` and would escape a scoped theme.

## Typography

**Display Font:** Geist (with `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` fallback), loaded from Google Fonts and applied to the entire landing via a page-level `stylex.createTheme(font, …)` override of the `font.sans` token, so every registry component inside the scenes inherits it — the registry's default `font.sans` stays system-native outside the landing (docs previews, consumer apps).
**Body Font:** Geist as well, through the same token override; sizes come from the `fontSize` scale (xs–xl) and the H1 is the only element above it.
**Label/Mono Font:** `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace`, used only for the CLI install chip.

**Character:** one family at two registers: the H1 at large size and tight tracking gives the page its engineered voice; the same face at body and label sizes inside the scenes keeps the product screens reading as ordinary software rather than a second, marketing typeface.

### Hierarchy
- **Display** (700, `clamp(2.375rem, 5.4vw, 3.75rem)`, line-height 1.3, letter-spacing −0.04em): the hero H1 only. Ends with a literal `.` rendered as a separate small foreground dot for a full-stop flourish.
- **Title** (600, 1.125rem `fontSize.lg`, letter-spacing −0.02em): footer tagline, card titles.
- **Body** (400, 1rem `fontSize.base`, line-height 1.5): hero subhead (max 58ch) and default page body copy.
- **Body small** (400/500, 0.875rem `fontSize.sm`): nav links, principle body copy (max 42ch), footer links, captions, most in-scene UI text.
- **Label** (500, 0.75rem `fontSize.xs`, uppercase not used — sentence case throughout): version pill, badges, footer legal line.

### Named Rules
**The Single-Display-Moment Rule.** Display size and the −0.04em tracking exist only on the H1. No other element on the page uses display-weight type; nav, buttons, and captions all read at body or label scale.

## Layout

The page is a single centered column, `max-width: 80rem`, with `1.5rem` inline padding that drops to `1rem` under 40rem (mobile breakpoint). The column is bounded by dashed vertical rails — the wrapper's `borderInline` in `colors.border`, dashed, dropped on mobile — so the reading measure reads as a drafted layout guide rather than an implicit edge. There is no multi-column marketing grid above the fold: header and hero share the centered column, and the three "how it works" principles are the only place a 3-column grid appears (collapsing to a single column under 40rem).

The centerpiece is the scene stage, and it stays inside that same 80rem column — an earlier build let it break past the column to a 96rem cap; that breakout is gone. The stage is a plain `Tabs` root with no outer frame and no top bar of its own: a five-tab `TabsList` (Cards, Dashboard, Inbox, Team, Settings) sits directly on the page, and one `TabsContent` panel follows it for the active scene only. The five-tab list scrolls sideways rather than wrapping or clipping on narrow viewports. On desktop the stage holds a fixed `46rem` height so switching tabs never jumps page height; below the 61.25rem tablet breakpoint the height goes `auto` and the stage takes each screen's natural content height instead. Only the active scene is ever rendered — Base UI would otherwise keep an outgoing panel mounted while it settles, and two panels sharing that fixed height for a frame reads as a flicker.

Each of the five scenes supplies its own chrome; the stage supplies none. Dashboard, Inbox, Team, and Settings each draw their own bordered app window (`colors.background`, 1px `colors.border`, `radius.xl`, `overflow: hidden`), with inner padding at `space.s5` for Team and Settings, and their own pane layout for Dashboard (a `16rem`-wide, `container.card`, sidebar that hides entirely under 61.25rem) and Inbox (a three-pane mail layout: folder list, message list, reading pane). The Cards scene is the one exception — it floats free on the page with no border of its own, laying nine `size="sm"` task cards into a 4-column × 3-row CSS grid (`gridTemplateRows: repeat(3, minmax(0,1fr))`); three cells — Rate the onboarding, Choose a plan, Monthly budget — span two rows for the tasks with more steps, and every card's footer pins to its cell's baseline with `marginTop: auto` so the shorter cards' actions still line up along the row. The grid drops to 2 columns under tablet and 1 under mobile, falling back to flow order.

A hairline `Rule` — a plain 1px line, no cross marks — marks two structural transitions: above the "how it works" principles strip, and at the top of the footer. It is a layout-guide motif, not a divider style used freely; it appears only at those two section boundaries.

The hero itself sits on a faint decoration: a dot grid on the `space.s6` (24px) rhythm, in `colors.border`, radially masked so it fades to nothing away from the headline — the components' own spacing grid showing through behind the H1, rather than a gradient or illustration.

Spacing throughout follows the `space` scale in strict 0.25rem (4px) steps from `s05` (2px) to `s16` (64px) — nothing in the landing uses a raw pixel or rem value for spacing. Section rhythm is generous: `s16` (4rem) separates the hero/stage block from the principles row, and again precedes the footer; `s10`–`s12` separates sub-blocks within a section.

## Elevation & Depth

The system is flat by default: cards and each scene's own app window use a single hairline border (`stroke.border`, 1px, `colors.border`) as their primary edge treatment, not a shadow. Shadow appears only as a light structural cue on raised surfaces that need to read above the page — cards and the theme dropdown menu — never as a hover glow or decorative effect. There is no colored or diffuse ambient shadow anywhere in the system.

### Shadow Vocabulary
- **sm** (`box-shadow: 0 1px 2px #0000000d`): default card elevation — barely perceptible, just enough to separate a card from the page.
- **md** (`box-shadow: 0 4px 8px -2px #0000001a`): popover-tier surfaces (the theme menu, dropdown content).
- **lg** (`box-shadow: 0 10px 20px -5px #00000026`): reserved for the largest overlay tier (dialogs/sheets); not used on the landing itself.

### Named Rules
**The Border-First Rule.** Reach for a hairline border before a shadow. Shadow is a secondary, low-opacity signal layered on top of a bordered surface, never a replacement for the border.

## Shapes

Two radius families do all the work, and the choice between them is deliberate: **anything the user clicks as a discrete, single action is full-radius (pill)** — the version pill, primary/ghost buttons, the search field, the CLI copy chip, badges — while **anything that is a container or a compound surface uses the scale steps** (`radius.md` 0.5rem for nav links, icon buttons, menu items; `radius.lg` 0.625rem for cards and the theme dropdown; `radius.xl` 0.75rem for each scene's own bordered app window — Dashboard, Inbox, Team, Settings — the largest containers on the page). Borders are uniformly 1px (`stroke.border`) solid in `colors.border`; there is no double-border or inset-ring treatment.

## Components

### Buttons
- **Shape:** full radius (pill, `radius.full`) on marketing CTAs (hero "Get started" / "Browse components"); `radius.md` (0.5rem) on the registry `Button` component used inside the product scenes (Export, New invoice, sidebar nav items). The two shapes are a deliberate split: marketing chrome is pill-shaped, in-app chrome uses the tighter scale radius real software uses.
- **Primary:** solid foreground fill (`colors.primary` / `colors.primaryForeground`), `space.s25`/`space.s5` (10px/20px) padding on the marketing CTA size; hover dims to 88% opacity rather than shifting color. The registry variant instead darkens via `color-mix` on hover.
- **Hover / Focus:** all buttons scale to 0.97 on `:active` (150ms, `easing.out`); focus-visible gets a 2px solid ring in `colors.ring` with matching offset. Reduced-motion drops the transform-based feedback and keeps only the opacity/color transition.
- **Secondary / Outline / Ghost / Destructive:** the registry `Button` exposes `primary | secondary | outline | ghost | destructive` variants — `secondary` fills with `colors.secondary`, `outline` is bordered and transparent until hover, `ghost` is borderless until hover, `destructive` is the only place the red token appears (not used on the landing page itself).

### Badges
- **Style:** pill radius, `fontSize.xs`, `fontWeight.medium`, `space.s1`/`space.s25` (4px/10px) padding, no border by default.
- **Variants:** `primary` (solid ink fill — used for status like "Overdue"), `secondary` (muted-gray fill — used for "Paid"/counts), `outline` (bordered, transparent — used for "Pending" and the sidebar's unread-count badge).

### Cards / Containers
- **Corner Style:** `radius.lg` (0.625rem).
- **Background:** `colors.card` (equal to `colors.background` in light, one step lighter than the page in dark).
- **Shadow Strategy:** `shadow.sm` at rest; cards do not change elevation on hover.
- **Border:** 1px solid `colors.border`.
- **Internal Padding:** `space.s5` (20px) block padding by default, retunable per-instance via a `--card-spacing` custom property; the `size="sm"` variant tightens this for denser layouts and is what the Cards scene's whole 4×3 grid runs on.

### Chips (command / install)
- **Style:** pill radius, `colors.muted` background, `font.mono`, a `$` prompt glyph and a crossfading copy/check icon pair that share one absolutely-positioned cell so the icon swap never shifts the command text width.
- **State:** border tints to `colors.mutedForeground` on hover; scales to 0.97 on `:active`; the checkmark holds for 1.6s after a successful copy before reverting.

### Navigation
- **Style:** header nav links sit at `fontSize.sm` in `colors.mutedForeground`, moving to `colors.foreground` on hover (150ms color transition, no underline ever). "Components" and "Changelog" hide under the 40rem mobile breakpoint, leaving only "Docs" plus the icon-button row, since both hidden links are one tap away via the footer.
- **In-scene nav:** the Dashboard scene's sidebar reuses the registry `Button` (`variant="secondary"` for the active section, `variant="ghost"` otherwise, `size="sm"`) rather than a bespoke nav-item style, so its active state is exactly the same visual language as any other secondary button in the system.
- **Mobile:** the Dashboard scene's sidebar (workspace switcher, section nav, user row) hides entirely below the 61.25rem tablet breakpoint; the stage's top-level scene switching still works via the `TabsList`, which scrolls sideways rather than wrapping or clipping.

### The Scene Stage (signature component)
Five tabs sit directly on the page and switch between screens built from real registry components — there is no outer frame and no shared top bar; the stage supplies no chrome of its own. Each of the five scenes (Cards, Dashboard, Inbox, Team, Settings) is a self-contained layout: four draw their own bordered app window, and the fifth (Cards) floats free as a card grid. This is what makes the "real components, in real screens" thesis literal rather than illustrative. Switching scenes is an opacity-only fade (`duration.normal`, 200ms) on a wrapper inside the active `TabsContent`; only the active scene is ever mounted, since Base UI keeping an outgoing panel mounted while it settles would put two panels in the stage's fixed height for a frame and read as a flicker. A translate was tried and rejected for the same reason — it fights the fixed height.

Every notable region in every scene is wrapped in `<Part name="…">`, a plain layout wrapper (`position: relative`, an optional `grow` for flex children) that renders no visual chrome of its own. Its `name` prop documents which registry component(s) the region is built from, for whoever edits the scene next — there is no on-page toggle, label, or outline tied to it.

## Do's and Don'ts

### Do:
- **Do** keep every color in the system at chroma 0 except `colors.destructive`; the monochrome identity is the whole visual argument (see the No-Hue Rule).
- **Do** use full radius (`radius.full`) for single-action marketing chips (buttons, pills, chips) and scale-step radius (`md`/`lg`/`xl`) for containers and in-product controls.
- **Do** reach for `shadow.sm`/`shadow.md` only on surfaces that already have a border; never use a shadow alone to imply a raised edge.
- **Do** keep Geist as the one family on the landing, applied through the `font.sans` token override rather than per-element font stacks.
- **Do** drive all spacing from the `space` scale (`s05`…`s16`) and all durations from the `duration` scale (`fast` 150ms / `normal` 200ms / `slow` 350ms) — never a raw px/ms value in a component or example.
- **Do** wrap real, notable product-screen regions in `Part` with an accurate `name` prop, so the scene-to-component mapping stays correct as scenes evolve.

### Don't:
- **Don't** reintroduce a violet or any other hue accent into chrome, buttons, or focus rings — this was an explicit, committed reversal (`47813a0`).
- **Don't** stand in a screenshot, mockup, or static illustration for a real component; the landing's proof is that every control in the stage is the live registry component.
- **Don't** give the destructive red a role outside the `destructive` button/badge variant — it must stay rare enough that its appearance alone signals danger.
- **Don't** mix pill and scale-step radius on the same category of control; the split is by role (single-action chip vs. container), not by section.
- **Don't** animate anything beyond opacity/color when `prefers-reduced-motion: reduce` is set — every transform-based transition in this system (button scale, panel enter, icon crossfade) has a reduced-motion fallback that drops the transform and keeps only the softer property change.
- **Don't** scatter the `Rule` (a plain hairline) at arbitrary section breaks; it marks structural transitions only — above the principles strip and at the top of the footer — not a general-purpose divider.
