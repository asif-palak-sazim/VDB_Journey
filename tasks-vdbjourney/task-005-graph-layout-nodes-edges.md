# Task 5: 3D graph — layout, nodes, edges

Goal: The full decision tree renders in 3D as positioned nodes with legible labels and connecting edges, with no overlapping/obscured labels.

Description:
Compute a deterministic 3D layout for all nodes and render the graph in the low-poly, bright-colored style.

Files:
- `src/three/graphLayout.helpers.ts` (pure)
- `src/three/GraphNodes.tsx`
- `src/three/GraphEdges.tsx`
- `src/three/Scene.tsx`
- `src/ui/ui.constants.ts` (colors/labels shared)

Steps:
1. `graphLayout.helpers.ts` — pure function assigning each node id a `[x, y, z]` position using a layered tree layout (depth → one axis, sibling spread → another). Deterministic; returns a `Map<nodeId, position>`. Also expose edge list (from→to + branch label) for rendering.
2. `Scene.tsx` — `<Canvas>` scene: bright ambient + directional light, a simple low-poly ground plane, cheerful background color. Optional `OrbitControls` (drei) for the mouse-only overview (keyboard never orbits).
3. `GraphNodes.tsx` — render each node as a low-poly mesh (question nodes vs outcome nodes visually distinct via color/shape). Attach a readable label using drei `<Text>` or `<Html>` billboard.
4. `GraphEdges.tsx` — render edges as lines/thin tubes between node positions; render branch labels near edges.
5. Palette/labels centralized in `ui.constants.ts` (no magic color strings scattered in components).

Verification:
- All 13 question nodes + all outcome leaves are visible and positioned without overlap.
- Labels are readable (switch `<Text>`→`<Html>` if legibility is poor).
- Question vs outcome nodes are visually distinguishable.

Notes:
- Layout helper is pure/deterministic so travel + camera can rely on stable positions.
- Keep meshes primitive and cheap; bright low-poly aesthetic.
