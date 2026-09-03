# Changesets

This folder holds pending release notes for `@madeui/cli`, managed by
[Changesets](https://github.com/changesets/changesets).

- Only the CLI is versioned here. The registry and the docs site deploy
  continuously from `main` and are not npm packages (they are listed under
  `ignore` in `config.json`).
- Any pull request that changes `packages/cli/` must add a changeset:
  `pnpm changeset`. CI fails otherwise.
- The release workflow turns accumulated changesets into a "Version Packages"
  pull request. Merging that PR publishes to npm and creates the GitHub
  release. See `CONTRIBUTING.md` → "Releases".
