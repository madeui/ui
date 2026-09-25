---
'@madeui/cli': minor
---

Add `madeui diff`: compares installed components with the registry and marks each file `same`, `differs`, or `missing`. Name components to see their patches. `--json` prints a machine-readable report with patches and a fix command per item, and `--exit-code` fails when anything differs. Files that differ only in line endings (CRLF) now count as up to date. `add --overwrite` now replaces only the components you name: registry dependencies such as rethemed tokens are no longer overwritten unless you name them too. New projects get an "Updating components" section in the AGENTS.md block.
