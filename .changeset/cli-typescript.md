---
'@madeui/cli': patch
---

The CLI is now written in TypeScript and published as a bundle built from that source. Behavior is unchanged. `engines` now states the real minimum, Node 22.12, which the CLI's dependencies already required.
