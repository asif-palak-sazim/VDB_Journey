# ADR 0001: Use React Three Fiber for the 3D journey

## Status

Accepted

## Context

VDB Journey is a frontend-only, keyboard-driven 3D application. It is fundamentally
**state-driven**: the current node, an answer-history stack (for Undo/Reset), and a
highlighted-branch selection drive everything on screen. It also carries significant
**UI chrome** rendered as an HTML overlay: a question prompt panel, a power bar
(Undo / Reset), and a rich outcome card with a path recap.

We had to choose a Three.js foundation before building anything else, because the
choice shapes how scene code, state, and overlay are wired together. This decision is
costly to reverse once the scene, camera rig, and state wiring are built on top of it.

## Decision

Use **React Three Fiber** (`@react-three/fiber`) with **drei** (`@react-three/drei`),
on Vite + React + TypeScript. React manages application state and the HTML overlay;
R3F expresses the 3D scene declaratively; drei supplies camera helpers, text, and
HTML-in-3D labels.

## Consequences

- **Positive:** State/UI wiring (current node, history stack, selection) maps cleanly
  onto React state. drei provides camera transitions, `<Text>`/`<Html>` labels, and
  loaders out of the box, directly serving the hybrid camera and node labels. The
  HTML overlay (prompt, power bar, outcome card) is ordinary React.
- **Negative:** Larger dependency footprint than raw Three.js. Ties the project to the
  React + R3F version compatibility matrix (R3F 9 requires React 19).

## Alternatives considered

- **Vanilla Three.js + Vite** — smaller dependency footprint and total control, but
  requires hand-writing the render loop, camera tweening, text-in-3D, and all
  state/UI wiring. Rejected because the app's complexity lives in state and UI chrome,
  which React + R3F handle far more simply, not in exotic rendering.
