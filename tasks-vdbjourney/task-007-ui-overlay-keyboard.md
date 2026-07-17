# Task 7: UI overlay + keyboard interaction + power bar

Goal: The entire journey is playable with the keyboard only (arrows highlight, Enter commits); the power bar (Undo / Reset-with-confirm) works; outcomes show a rich card with path recap and a Start-over CTA.

Description:
Build the HTML overlay chrome and wire global keyboard input to journey state.

Files:
- `src/ui/QuestionPanel.tsx`
- `src/ui/PowerBar.tsx`
- `src/ui/OutcomeCard.tsx`
- (input wiring in `App.tsx` or a small `useKeyboard` helper)

Steps:
1. Global keydown handler:
   - `Left/Right` (and `Up/Down` as aliases) move a highlight index across the current question's branches.
   - `Enter` commits the highlighted branch (calls `commit`).
   - `Enter`/`Space` also advances intro/outcome screens where applicable.
   - Highlighting the branch also glows the corresponding 3D edge (coordinate with GraphEdges highlight state).
2. `QuestionPanel.tsx` — shows the current prompt, the branch labels with the highlighted one emphasized, and an "Enter to choose" hint. Uniform for YES/NO and Q7's two options.
3. `PowerBar.tsx` — top-of-screen bar with:
   - **Undo** button (disabled when `!canUndo`), triggers `undo()`.
   - **Reset** button → shows a confirm ("Reset journey?") before `reset()`.
   - Buttons are clickable by mouse (allowed) and reflect state.
4. `OutcomeCard.tsx` — when `isAtOutcome`:
   - Database name + correct Qdrant qualifier when applicable.
   - The tree's secondary notes VERBATIM (upgrade path / alternative / approach) + one neutral factual line.
   - **Path recap** (from `pathRecap`) listing the answers taken.
   - **Start over** CTA (= Reset), and Undo remains available to step back into the tree.
5. Centralize labels/colors in `ui.constants.ts`; no magic strings.

Verification:
- Keyboard-only: traverse several representative paths to different DBs.
- Undo/Reset behave correctly; Reset asks for confirmation.
- Q7 works with arrows+Enter (non-YES/NO branches).
- Outcome card shows correct DB, correct Qdrant flavor, verbatim notes, neutral line, and accurate path recap.

Notes:
- Desktop keyboard-first; no mobile/touch controls.
- No component tests (per user & convention).
