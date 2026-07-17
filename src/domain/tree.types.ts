export type DatabaseName =
  | 'PGVector'
  | 'Qdrant'
  | 'ChromaDB'
  | 'Milvus'
  | 'LanceDB';

/** A single answer branch of a question node. */
export interface Branch {
  /** Short label shown on the branch/edge (e.g. "Yes", "No", "SQL / relational"). */
  label: string;
  /** Id of the node this branch leads to. */
  nextId: string;
}

export interface QuestionNode {
  id: string;
  kind: 'question';
  /** The exact question text from the decision tree. */
  prompt: string;
  /** Ordered answer branches. Two for every node (Q7 included). */
  branches: [Branch, Branch];
}

export interface OutcomeNode {
  id: string;
  kind: 'outcome';
  database: DatabaseName;
  /** Deployment qualifier when it varies by path (e.g. Qdrant "dedicated service" / "cluster"). */
  qualifier?: string;
  /** Secondary notes carried verbatim from the decision tree. */
  notes: string[];
  /** One short neutral factual line about the database. */
  neutralLine: string;
}

export type TreeNode = QuestionNode | OutcomeNode;
