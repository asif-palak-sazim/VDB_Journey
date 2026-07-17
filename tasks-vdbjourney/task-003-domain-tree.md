# Task 3: Domain model — decision tree data & pure traversal

Goal: Manually eyeball all 13 question nodes, 5 outcomes, and every edge in `tree.constants.ts` against the verified tree parse; `resolveNext` returns the correct next node for each branch.

Description:
Encode the fact-checked decision tree as typed, pure data and a pure resolver — no React, no 3D. Convention: enums/types/constants/helpers live in dedicated files.

Files:
- `src/domain/tree.types.ts`
- `src/domain/tree.constants.ts`
- `src/domain/tree.helpers.ts`

Steps:
1. `tree.types.ts` — define:
   - `NodeId` (string literal union of the 13 question ids + a marker for outcomes).
   - `DatabaseName` = `'PGVector' | 'Qdrant' | 'ChromaDB' | 'Milvus' | 'LanceDB'`.
   - `Answer` — models both YES/NO nodes and the Q7 two-option node (e.g., `{ label: string; nextId: string }` per branch so Q7 is uniform).
   - `QuestionNode` = `{ id; kind: 'question'; prompt; branches: Answer[] }`.
   - `OutcomeNode` = `{ id; kind: 'outcome'; database: DatabaseName; qualifier?: string; notes: string[]; neutralLine: string }`.
   - `TreeNode` = `QuestionNode | OutcomeNode`.
2. `tree.constants.ts` — encode the verified tree exactly:
   - Q1: yes→Q1a, no→Q2
   - Q1a: yes→PGVector, no→Q1b
   - Q1b: yes→PGVector, no→Qdrant (qualifier: "dedicated service"; note verbatim: upgrade path → Milvus for extreme scale)
   - Q2: yes→Q2a, no→Q3
   - Q2a: yes→ChromaDB, no→Qdrant (single-node)
   - Q3: yes→Q3a, no→Q4
   - Q3a: yes→Q3b, no→Qdrant (single-node; note verbatim: store dense + sparse vectors, do fusion/reranking in the app)
   - Q3b: yes→Milvus, no→LanceDB (note verbatim: best when you prefer embedded + disk-first economics / "data-lake" style operation)
   - Q4: yes→Q4a, no→Q5
   - Q4a: yes→Milvus (note verbatim: alternative if you want simpler ops → Qdrant cluster), no→Qdrant (qualifier: "cluster")
   - Q5: yes→LanceDB, no→Q6
   - Q6: yes→Qdrant (single-node), no→Q7
   - Q7: SQL/relational→PGVector, simplest→ChromaDB
   - Store the Qdrant **qualifier** and the secondary **notes** on the outcome as reached per path (so the correct Qdrant flavor and notes surface on the card). Since outcomes differ by path, model outcome instances per terminal edge rather than a single shared Qdrant node.
   - Each outcome carries exactly ONE short neutral factual `neutralLine` per database (no hype). Notes from the tree are VERBATIM.
   - Prompts are the exact question texts from the decision tree.
3. `tree.helpers.ts` — `resolveNext(nodeId, branchIndex | answerKey): string` pure function returning the next node id; plus a small `getNode(id)` accessor.

Verification:
- Walk each of the 13 question nodes in the data and confirm both branches point where the verified parse says.
- Confirm 5 distinct databases appear; Qdrant qualifiers present on the correct paths (Q1b→dedicated service, Q4a-no→cluster; others single-node).
- Longest root-to-outcome path commits 7 answers (Q1→Q2→Q3→Q4→Q5→Q6→Q7→outcome).

Notes:
- No tests required (per user). Verification is manual against the verified parse.
- Keep data declarative and flat; no cleverness.
