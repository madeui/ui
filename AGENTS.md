# Agent instructions

Rules for any coding agent (Claude Code, Codex, Cursor, …) working in this
repo. `CLAUDE.md` only imports this file.

## Project context

**madeui** — an open-source UI library following the code-ownership model
(components are copied into the user's project as editable source), built on
**Base UI** (headless primitives) + **StyleX** (compile-time styling).
Distributed via our own CLI (`madeui init` handles the StyleX build setup)
and a shadcn-compatible registry. Docs site: **Blume**. Agent-friendliness is
a core requirement, not an afterthought.

## Ground rules

- Component API conventions: every component uses `variant`, `size`, and
  accepts a `style` prop merged last via `stylex.props(...)`. Consistency
  across components is a hard requirement (agents rely on it).
- **StyleX doctrine is binding**: `packages/registry/STYLEX.md` (rules:
  tokens over literals, no magic numbers/raw colors, variants over escape
  hatches) and `packages/registry/stylex-authoring.md` (API mechanics). Read
  both before writing any styles.
- Tokens live in `lib/tokens.stylex.ts` (`defineVars`, themable) and
  `lib/constants.stylex.ts` (`defineConsts`, non-themed scales: space,
  typography, z, duration, easing, stroke, container); themes via
  `stylex.createTheme`. Never hardcode colors/spacing/type/z/duration in
  component styles.
- Registry JSON is generated from source (`scripts/build-registry.mjs`),
  never hand-edited.
- Docs and examples: one focused example per feature/variant (own file, own
  H2 section), Composition tree for multi-part components, API tables only
  for props we add, Base UI links for the rest. Examples use StyleX — never
  inline `style={{...}}`. Full rules:
  `packages/registry/CONVENTIONS.md` → "Examples & docs authoring".
- Repo language: English (code, docs, commits).

## Layout

```
packages/registry/   # component sources, tokens, examples/
packages/cli/        # madeui init + add + list
apps/docs/           # Blume docs site + hosted registry endpoints
apps/playground/     # Next.js smoke-test app (manual sync from registry)
```

## Development flow

`CONTRIBUTING.md` is the canonical flow. Before touching code on any task,
identify the track and say it out loud: **registry + docs** (deploys live on
merge to `main`, no versioning, only finished work merges) or **CLI**
(`packages/cli/`, needs a changeset via `pnpm changeset`, published by the
release workflow). Then follow that track's steps and end the task with its
PR checklist.
