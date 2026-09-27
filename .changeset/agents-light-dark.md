---
'@madeui/cli': patch
---

The AGENTS.md block that `init` writes now describes dark mode as `light-dark()` color tokens switched by `colorScheme` on `<html>` (with `data-theme="light"|"dark"` to force a mode), instead of a `darkTheme` to apply. It also notes that two brand themes on one element do not merge. Existing AGENTS.md files are left as they are.
