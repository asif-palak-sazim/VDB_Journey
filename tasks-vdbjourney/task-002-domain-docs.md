# Task 2: Domain docs (CONTEXT.md glossary + ADR)

Goal: `CONTEXT.md` and `docs/adr/0001-react-three-fiber.md` exist and are consistent with the locked decisions.

Description:
Capture the crystallized domain vocabulary and the one hard-to-reverse architectural decision.

Steps:
1. Create `CONTEXT.md` as a pure glossary (NO implementation details). Define, one term per entry:
   - **Journey** — a traversal from the root question (Q1) to a terminal database recommendation.
   - **Question Node** — a node posing a prompt with 2 answer branches (Q7 branches are non-YES/NO).
   - **Outcome Node** — a terminal leaf naming one of 5 databases (PGVector, Qdrant, ChromaDB, Milvus, LanceDB).
   - **Branch / Edge** — a labeled connection from a question to its next node.
   - **Avatar (Car)** — the low-poly car that marks the user's current position and travels along edges.
   - **History Stack** — the ordered list of committed answers defining the current position.
   - **Commit** — confirming a highlighted branch (Enter), moving the avatar forward.
   - **Undo** — pop the last committed answer; avatar travels back; parent question re-asked.
   - **Reset** — clear history; avatar returns to Q1.
   - **Path Recap** — the readable trace of answers shown on the outcome card.
   - **Qdrant flavor** — the deployment qualifier for a Qdrant outcome (dedicated service / single-node / cluster) which differs by path.
2. Create `docs/adr/0001-react-three-fiber.md` recording the choice of React Three Fiber over vanilla Three.js:
   - Context: state-driven app (current node, history stack) with significant UI chrome (prompt, power bar, outcome card).
   - Decision: use R3F + drei; React manages state and HTML overlay.
   - Consequences: larger dependency footprint; declarative scene; drei provides camera/text/HTML helpers.
   - Alternatives considered: vanilla three.js + Vite (smaller footprint, hand-written camera tweening/state wiring).

Verification:
- Both files exist; `CONTEXT.md` contains only glossary entries (no code/impl details).
- ADR states context, decision, consequences, and the vanilla alternative.

Notes:
- Follow the domain-modeling formats (CONTEXT is a glossary, not a spec).
