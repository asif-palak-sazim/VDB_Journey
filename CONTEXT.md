# Context — VDB Journey

Glossary of domain terms for the vector-database decision-tree journey. This file is a glossary only — no implementation details.

## Terms

- **Journey** — a traversal from the root question (Q1) to a terminal database recommendation.
- **Question Node** — a node that poses a prompt and offers two answer branches. All question nodes are YES/NO except Q7, whose branches are non-YES/NO (SQL/relational vs simplest).
- **Outcome Node** — a terminal leaf naming one of five databases: PGVector, Qdrant, ChromaDB, Milvus, LanceDB.
- **Branch / Edge** — a labeled connection from a question node to its next node (question or outcome).
- **Avatar (Car)** — the low-poly car that marks the user's current position in the graph and travels along edges when an answer is committed.
- **History Stack** — the ordered list of committed answers that defines the current position in the journey.
- **Commit** — confirming a highlighted branch (Enter), which moves the avatar forward to the next node.
- **Undo** — pop the last committed answer; the avatar travels back along the edge and the parent question is re-asked.
- **Reset** — clear the entire history; the avatar returns to Q1.
- **Path Recap** — the readable trace of the answers taken, shown on the outcome card.
- **Qdrant flavor** — the deployment qualifier for a Qdrant outcome (dedicated service / single-node / cluster), which differs depending on the path taken to reach Qdrant.
