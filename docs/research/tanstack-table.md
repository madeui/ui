# TanStack Table (Data Grid, deferred)

Researched 2026-09-05. The data grid is not in the current batch; notes kept
for when it is picked up.

## Facts

- `@tanstack/react-table` 9.2.4 (v9 since 2026-08-04). Peer React ≥18.
  Dependencies: `@tanstack/table-core`, `@tanstack/react-store`.
- v9: `useReactTable` → `useTable`; features are registered explicitly
  (`tableFeatures({...})`, tree-shakable and enforced by TypeScript); state
  through `table.state` / `table.store`. Source:
  https://tanstack.com/blog/announcing-tanstack-table-v9
- A full-featured reference grid on v9 exists in the ecosystem: the user owns
  the table instance (`useTable({ features, data, columns })`) and passes it
  to a root that provides context; column header menus (sort, pin, move,
  hide), faceted filters, visibility, pagination, row selection; optional
  virtualization (`@tanstack/react-virtual`), drag-and-drop (`@dnd-kit/*`),
  and cell selection/editing; appearance through a `tableLayout` flag object.

## Decisions (provisional)

- Name `data-grid`; user owns the `useTable` instance; we export a bundled
  feature set and render parts.
- v1 scope: core parts only (no DnD, virtualization, cell editing).
- Multi-file registry item; `build-registry` needs multi-file ui support.
