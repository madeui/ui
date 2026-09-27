---
'@madeui/cli': patch
---

The AGENTS.md block that `init` writes now covers responsive styles: mobile-first, with `breakpoint` keys from `constants.stylex.ts` (`sm` 640px, `md` 768, `lg` 1024, `xl` 1280, `xxl` 1536) instead of literal media queries. Existing AGENTS.md files are left as they are.
