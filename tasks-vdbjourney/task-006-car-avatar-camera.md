# Task 6: Car avatar + hybrid camera + travel animation

Goal: On committing an answer, the low-poly car drives from the current node to the next along the edge; the camera follows while moving and pulls back to frame branches at each question. Undo drives the car back along the same edge.

Description:
Build the primitive low-poly car (swappable seam) and the hybrid camera rig, and animate travel driven by journey state.

Files:
- `src/three/CarAvatar.tsx`
- `src/three/CameraRig.tsx`

Steps:
1. `CarAvatar.tsx` — compose a low-poly car from primitives: body box + cabin box + 4 cylinder wheels, bright colors. Expose a single clean component boundary so a `.glb` (via drei `useGLTF`) can replace it later WITHOUT touching journey logic. Car orients toward its direction of travel.
2. Travel animation — when `currentNodeId` changes, tween the car position from the previous node position to the new one along the edge (single source of truth for car position). Reverse tween for Undo (reuse same edge). Use a frame loop (`useFrame`) or a small tween utility.
3. `CameraRig.tsx` — hybrid behavior:
   - While the car is traveling: third-person follow (camera trails behind/above the car).
   - When arriving at a question node (idle): pull back slightly to frame the current node + its answer branches, so the user can see where YES/NO lead before committing.
   - Smooth transitions between the two modes.
4. Car starts at Q1 on load and after Reset.

Verification:
- Commit → car drives smoothly to the next node; camera follows then re-frames.
- Undo → car drives back one edge; parent question framed again.
- Reset → car returns to Q1; camera reframes root.
- No camera jank on reverse travel (shared edge tween).

Notes:
- Swappable avatar seam is required now (component boundary), but ship the primitive car as default.
- No sound.
