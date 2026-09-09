---
status: accepted
date: 2026-09-05
---

# Components may declare external npm dependencies

Until now every component installed only Base UI, StyleX, and lucide. Calendar,
Date Picker, Carousel, Resizable, and Chart need behavior we will not
re-implement (date grids, touch carousels, panel resizing, chart layout). We
allow an external dependency per component, declared on the registry item so
`madeui add` installs it, and stated on the component's docs page right after
the install command. Components without such a need stay dependency-free; the
default is still "Base UI or nothing".

## Considered options

- Re-implement in-house: rejected for calendar and carousel (large, subtle
  behavior; accessibility and touch handling would lag mature libraries).
- Ship as docs-only recipes: rejected, agents and users expect one `add`
  command to yield a working component.
