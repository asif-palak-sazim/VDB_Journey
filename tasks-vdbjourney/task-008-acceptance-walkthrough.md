# Task 8: Polish & full acceptance walkthrough

Goal: Every root-to-leaf path is traversable end-to-end by keyboard to the CORRECT database (with correct Qdrant flavor); Undo re-asks the parent; Reset returns to Q1; Restart-from-outcome works. Success criterion met.

Description:
Final polish pass and an exhaustive manual walkthrough of the decision tree against its verified structure.

Steps:
1. Walk EVERY terminal path, including the longest (7 commits: Q1→Q2→Q3→Q4→Q5→Q6→Q7→outcome), confirming:
   - Correct destination database for each path.
   - Correct Qdrant qualifier per path (Q1b→dedicated service; Q4a-no→cluster; Q2a/Q3a/Q6→single-node).
   - Verbatim secondary notes appear on the relevant outcomes.
2. Confirm Undo from various depths re-asks the correct parent question and drives the car back correctly.
3. Confirm Reset (with confirm) returns to Q1 with empty history and reframed camera.
4. Confirm Restart-from-outcome CTA restarts cleanly.
5. Polish: label legibility, camera smoothness, edge-highlight sync with keyboard highlight, no console errors.

Verification:
- All paths reach the correct outcome (matches the verified tree).
- Undo/Reset/Restart all behave per spec.
- No console errors/warnings; smooth 60fps-ish interaction on desktop.

Notes:
- This task encodes the agreed success criterion. Do not mark complete until every path is verified.
