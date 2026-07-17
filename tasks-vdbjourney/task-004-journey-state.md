# Task 4: Journey state (in-memory history stack)

Goal: Console-drive a full path then Undo and Reset; state transitions match the tree (verified manually).

Description:
Implement the in-memory journey state as a React hook over a history stack. No persistence.

Files:
- `src/state/journey.types.ts`
- `src/state/useJourney.ts`

Steps:
1. `journey.types.ts`:
   - `HistoryEntry` = `{ fromNodeId; branchLabel; toNodeId }`.
   - `JourneyState` = `{ currentNodeId: string; history: HistoryEntry[] }`.
2. `useJourney.ts` — a hook exposing:
   - `currentNode` (resolved via `getNode`).
   - `commit(branchIndex)` — resolves next node via `resolveNext`, pushes a `HistoryEntry`, updates `currentNodeId`. No-op if current node is an outcome.
   - `undo()` — pops the last entry, sets `currentNodeId` back to that entry's `fromNodeId`. No-op at root (empty history).
   - `reset()` — clears history, `currentNodeId` back to Q1.
   - `canUndo` (history non-empty), `isAtOutcome` (current node kind === 'outcome').
   - `pathRecap` — derived readable trace from history (for the outcome card).
3. State is purely in-memory (`useState`/`useReducer`); refresh returns to Q1.

Verification (manual, via a temporary console harness or dev UI):
- Commit answers down a known path → reaches expected outcome.
- `undo()` from mid-tree steps back one edge and re-exposes the parent question.
- `reset()` returns to Q1 with empty history.
- `undo()` at Q1 and `commit()` at an outcome are safe no-ops.

Notes:
- No Redo (per user).
- No localStorage (per user).
