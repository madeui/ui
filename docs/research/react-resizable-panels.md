# react-resizable-panels (Resizable)

Researched 2026-09-05 for the `resizable` registry item.

## Facts

- 4.12.3 (v4 since 2025-12-16). No dependencies; peer React 18 or 19.
- v4 renamed the API: `Group`, `Panel`, `Separator` (v3: `PanelGroup`,
  `PanelResizeHandle`). Orientation is mirrored as `aria-orientation` on Group
  and Separator; `useDefaultLayout` persists layouts. Source:
  https://github.com/bvaughn/react-resizable-panels/blob/main/CHANGELOG.md

## Decisions

- Export names `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`
  (`withHandle` grip); docs link the upstream part names.
- Layout persistence stays a docs example over `useDefaultLayout`; no wrapper
  prop.
