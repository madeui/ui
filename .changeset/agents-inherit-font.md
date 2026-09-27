---
'@madeui/cli': patch
---

The AGENTS.md block that `init` writes now says components carry no `fontFamily`: they inherit the page's font, set on `<html>`. It no longer lists fonts among the tokens in `tokens.stylex.ts`, which has no font token anymore. Existing AGENTS.md files are left as they are.
