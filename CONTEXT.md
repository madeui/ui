# madeui

Glossary for the madeui registry: a code-ownership UI library on Base UI and
StyleX. Terms below have one meaning across code, docs, and discussion.

## Language

**Registry item**:
A unit installable with `madeui add <name>`: one or more source files plus the
npm packages and other registry items it needs.
_Avoid_: component package, module

**Component**:
A registry item of type `ui`, one file under `components/ui/`, exporting flat
compound parts.
_Avoid_: widget, element

**Part**:
One exported building block of a multi-part component (`DialogTrigger`,
`CarouselItem`). Parts compose in JSX; the root part owns shared state.
_Avoid_: sub-component, child component

**Compound component**:
A component whose behavior is spread over parts the user arranges in JSX
rather than configured through props on one root.
_Avoid_: composite, slot-based component

**Slot component**:
An exported replacement for an internal piece of a third-party component that
cannot be composed in JSX (react-day-picker's `DayButton`). Users pass it, or
their own, through the library's `components` prop.
_Avoid_: override component, custom renderer

**External dependency**:
An npm package other than Base UI, StyleX, and lucide that a component
imports. Declared on the registry item and installed by the CLI.
_Avoid_: third-party dep, peer

**Chart config**:
The object a chart is described by: one entry per series, keyed by its
`dataKey`, carrying the series' label and its color token. `ChartContainer`
provides it through context; the tooltip and legend bodies read labels and
swatch colors out of it, and the mark is filled from the same entry, so one
value reaches the plot and the chrome.
_Avoid_: theme bridge, chart theme, series map

**Token**:
A themable design value from `lib/tokens.stylex.ts` (colors, radius, font,
shadow) or a non-themed scale value from `lib/constants.stylex.ts`.
_Avoid_: variable, constant, design value

**Track**:
One of the two delivery flows: registry + docs (continuous deploy) or CLI
(versioned with Changesets).
_Avoid_: pipeline, lane
