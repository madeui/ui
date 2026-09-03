# Contributing to madeui

Thanks for helping. This guide covers the setup, the three kinds of change
this repo sees, and how things reach users. Read it once; the checklists at
the end are what you will come back to.

## Setup

- Node 20 or newer and [pnpm](https://pnpm.io).
- `pnpm install` at the root.
- `pnpm docs:dev` runs the docs site with live component previews.
- `pnpm playground:dev` runs the Next.js smoke-test app.

```
packages/registry/   component sources, tokens, examples, registry build script
packages/cli/        @madeui/cli — init / add / list
apps/docs/           docs site; also serves the registry at /r/*.json
apps/playground/     Next.js smoke-test app (manual copy of registry sources)
```

## How things ship

There are two very different tracks. Know which one you are on before you
start.

| Track | What it covers | How it reaches users | Versioned? |
| --- | --- | --- | --- |
| Registry + docs | `packages/registry/`, `apps/docs/` | Every merge to `main` deploys the docs site, and the registry JSON with it. Live within minutes. | No. `main` is what users get. |
| CLI | `packages/cli/` | Published to npm by the release workflow, only when a changeset says so. | Yes, `@madeui/cli@x.y.z`. |

Consequence for the registry track: **only finished work merges to `main`.**
There is no release gate after merge. Keep unfinished components on a branch.

## Adding or changing a component

1. Branch from `main`: `feat/<component>` or `fix/<component>-<what>`.
2. Read `packages/registry/STYLEX.md`, `packages/registry/stylex-authoring.md`
   and `packages/registry/CONVENTIONS.md` before writing styles or examples.
   Tokens over literals, no raw colors or magic numbers, `variant` / `size` /
   `style` on every component.
3. Source lives in `packages/registry/src/ui/<name>.tsx`. Shared helpers in
   `packages/registry/src/lib/`.
4. Examples: one file per feature or variant in `packages/registry/examples/`.
   Docs page in `apps/docs/content/docs/components/<name>.mdx`, one H2 per
   example. Composition tree for multi-part components, API table only for
   props we add, Base UI links for the rest.
5. Regenerate the registry JSON: `pnpm build:registry`. Commit the output
   under `packages/registry/public/r/`; CI fails if it drifts from source.
6. Sync the playground so it smoke-tests the same code:
   `cp packages/registry/src/ui/*.tsx apps/playground/components/ui/`
   (same for any changed `src/lib/` file), then
   `pnpm playground:build`.
7. Open a PR. CI runs the registry diff check, playground typecheck + build,
   and the docs build. The Vercel preview link on the PR shows the docs page
   and the `/r/<name>.json` endpoint before anything is live.
8. Merge. It is live.

## Docs-only changes

Same as above without steps 3 to 6. Edit under `apps/docs/`, check the
preview, merge.

## Changing the CLI

1. Branch: `feat/cli-<what>` or `fix/cli-<what>`.
2. Make the change under `packages/cli/src/`.
3. Add a changeset:

   ```bash
   pnpm changeset
   ```

   Pick `@madeui/cli`, choose the bump (`patch` for fixes, `minor` for new
   flags or commands, `major` for breaking behavior), and write the note the
   way a user will read it in the release. Commit the generated
   `.changeset/*.md` with your change.
4. Open a PR. CI fails if `packages/cli/` changed and no changeset was added.
5. Merge. Nothing is published yet.

A change that touches both tracks (a new registry field the CLI must read)
is one PR with a changeset for the CLI part. The registry side goes live on
merge; the CLI side ships with the next CLI release.

## Docs changelog

The changelog on the docs site is written by hand, not generated. Entries
live in `apps/docs/content/changelog/<version>.mdx` with this frontmatter:

```md
---
title: v1.1.0
type: changelog
date: 2026-09-15
changelog:
  version: 1.1.0
  category: Release
---
```

Write one when a batch of components or a notable change is worth
announcing, in a PR of its own or together with the last component of the
batch. It is a product announcement, not a commit log: what shipped, why it
matters, how to install it. Components are already live by the time the
entry goes up; the entry announces them.

## Releases

**Registry and docs** have no release step. Merge is release.

**CLI** releases are automated by `.github/workflows/release.yml`:

1. Changesets accumulate on `main` as CLI PRs merge.
2. The workflow keeps a "Version Packages" PR open. It bumps
   `packages/cli/package.json` and prepends the notes to
   `packages/cli/CHANGELOG.md`.
3. Merging that PR publishes `@madeui/cli` to npm, tags
   `@madeui/cli@x.y.z`, and creates the GitHub release with the same notes.
   Publishing uses npm trusted publishing (OIDC); there is no token to
   rotate.

Do not edit the Version Packages PR by hand. It is regenerated on every push
to `main`. Fix the wording in the changeset file instead.

## Commits and pull requests

- Conventional commits: `feat(scope): …`, `fix(scope): …`, `docs: …`,
  `chore: …`. Scope is the component or `cli`. PRs are squash-merged, so the
  PR title becomes the commit message; write it the same way.
- Repo language is English: code, comments, docs, commits.
- One concern per PR. A new component and an unrelated CLI fix are two PRs.

### PR checklist

- [ ] Registry track: JSON regenerated, playground synced and building,
      docs page with one example per feature, preview checked.
- [ ] CLI track: changeset added with a user-facing note.
- [ ] No hardcoded colors, spacing, type, z-index, or durations in styles.
- [ ] Nothing unfinished is included. It goes live on merge.
