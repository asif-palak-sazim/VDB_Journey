# Task Progress

## Overview
- Total Tasks: 8
- Completed: 0

## Project
- **vdbjourney** — frontend-only, keyboard-driven 3D vector-database decision-tree journey (React Three Fiber).

## Locked decisions
- Node-graph in 3D space; avatar = low-poly **car** (primitive, swappable to glTF later).
- Camera: **Hybrid** (follow while moving, pull back to frame branches at questions).
- Stack: **React Three Fiber** + drei, Vite + React + **TypeScript**.
- Input: **Arrow keys highlight, Enter commits** (uniform incl. Q7).
- Power bar: **Undo** + **Reset (confirm)** + **Restart-from-outcome**; no Redo.
- Outcome: **Rich card + path recap**; verbatim tree notes + one neutral line/DB; correct Qdrant flavor per path.
- Style: **playful low-poly**, bright colors.
- Persistence: **in-memory only**.
- Scope: desktop keyboard-first; no backend/auth/analytics/sound/mobile/tests. Mouse only for optional orbit + power buttons.

## Success criterion
Every root-to-leaf path (longest = 7 commits) is traversable by keyboard to the correct one of the 5 DB outcomes; Undo steps back one committed edge and re-asks the parent; Reset returns to Q1 — all matching the fact-checked tree.

## Tasks
- [ ] Task 1: Scaffold project & foundation (pending)
- [ ] Task 2: Domain docs (CONTEXT.md glossary + ADR) (pending)
- [ ] Task 3: Domain model — decision tree data & pure traversal (pending)
- [ ] Task 4: Journey state (in-memory history stack) (pending)
- [ ] Task 5: 3D graph — layout, nodes, edges (pending)
- [ ] Task 6: Car avatar + hybrid camera + travel animation (pending)
- [ ] Task 7: UI overlay + keyboard interaction + power bar (pending)
- [ ] Task 8: Polish & full acceptance walkthrough (pending)

## Current Task: 1
