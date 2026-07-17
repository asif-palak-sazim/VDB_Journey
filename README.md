# VDB Journey

A frontend-only, keyboard-driven 3D decision-tree that recommends a vector
database. A low-poly car drives through a node-graph of questions; you answer
with the keyboard and arrive at one of five databases.

## Run

```bash
pnpm install
pnpm dev
```

Open the printed local URL.

## Controls

- **← / →** (or ↑ / ↓) — highlight an answer
- **Enter** (or Space) — confirm and drive to the next node
- **Backspace** — undo (revert to the previous question)
- **Undo / Reset** buttons (top-right) — Reset asks for confirmation
- Mouse — drag to orbit the scene; click buttons

## Stack

React Three Fiber (`@react-three/fiber` + `@react-three/drei`), Vite, React 19,
TypeScript. Journey state is in-memory only (a refresh returns to the start).

## Layout

- `src/domain/` — the decision tree data (`tree.constants.ts`), types, and the
  pure `resolveNext` traversal helper.
- `src/state/` — `useJourney` hook (history stack: commit / undo / reset).
- `src/three/` — 3D scene, tidy-tree layout, graph nodes/edges, car avatar,
  hybrid camera rig.
- `src/ui/` — question panel, power bar, outcome card, keyboard wiring.

See `CONTEXT.md` for the domain glossary and `docs/adr/` for architecture
decisions.
