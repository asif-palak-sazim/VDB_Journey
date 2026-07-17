import type { DatabaseName, TreeNode } from './tree.types';

/** Root node id. */
export const ROOT_ID = 'Q1';

/** One short neutral factual line per database (no hype). */
const NEUTRAL_LINE: Record<DatabaseName, string> = {
  PGVector:
    'PGVector is a PostgreSQL extension that adds vector similarity search to an existing relational database.',
  Qdrant:
    'Qdrant is a dedicated vector search engine with rich payload filtering, available single-node or clustered.',
  ChromaDB:
    'ChromaDB is a lightweight, embeddable vector store aimed at local development and prototyping.',
  Milvus:
    'Milvus is a distributed vector database built for horizontal scaling to very large datasets.',
  LanceDB:
    'LanceDB is an embedded, disk-first vector database using the Lance columnar format.',
};

/**
 * The decision tree, fact-checked against the source.
 * Each terminal outcome is a distinct node (unique id) so per-path qualifiers
 * and notes are carried correctly, and the graph stays a strict tree.
 */
export const TREE: Record<string, TreeNode> = {
  Q1: {
    id: 'Q1',
    kind: 'question',
    prompt:
      'Do you already run PostgreSQL in production and want to minimize new infrastructure?',
    branches: [
      { label: 'Yes', nextId: 'Q1a' },
      { label: 'No', nextId: 'Q2' },
    ],
  },
  Q1a: {
    id: 'Q1a',
    kind: 'question',
    prompt:
      'Do you need strong ACID transactions where embeddings + metadata updates must be atomic with relational data?',
    branches: [
      { label: 'Yes', nextId: 'out-q1a-pgvector' },
      { label: 'No', nextId: 'Q1b' },
    ],
  },
  Q1b: {
    id: 'Q1b',
    kind: 'question',
    prompt:
      'Will the dataset likely stay at \u2264 a few million vectors, and are latency/QPS needs moderate?',
    branches: [
      { label: 'Yes', nextId: 'out-q1b-pgvector' },
      { label: 'No', nextId: 'out-q1b-qdrant' },
    ],
  },
  Q2: {
    id: 'Q2',
    kind: 'question',
    prompt:
      'Is this primarily a prototype, internal tool, or small-scale application?',
    branches: [
      { label: 'Yes', nextId: 'Q2a' },
      { label: 'No', nextId: 'Q3' },
    ],
  },
  Q2a: {
    id: 'Q2a',
    kind: 'question',
    prompt:
      'Do you want an embedded/local-dev experience with minimal ops overhead?',
    branches: [
      { label: 'Yes', nextId: 'out-q2a-chromadb' },
      { label: 'No', nextId: 'out-q2a-qdrant' },
    ],
  },
  Q3: {
    id: 'Q3',
    kind: 'question',
    prompt:
      'Do you require first-class hybrid search (semantic + keyword) inside the database?',
    branches: [
      { label: 'Yes', nextId: 'Q3a' },
      { label: 'No', nextId: 'Q4' },
    ],
  },
  Q3a: {
    id: 'Q3a',
    kind: 'question',
    prompt:
      'Do you want the database to handle text indexing / keyword search natively (no external BM25/Elastic, no DIY text pipeline)?',
    branches: [
      { label: 'Yes', nextId: 'Q3b' },
      { label: 'No', nextId: 'out-q3a-qdrant' },
    ],
  },
  Q3b: {
    id: 'Q3b',
    kind: 'question',
    prompt: 'Do you need horizontal scaling and high concurrency now?',
    branches: [
      { label: 'Yes', nextId: 'out-q3b-milvus' },
      { label: 'No', nextId: 'out-q3b-lancedb' },
    ],
  },
  Q4: {
    id: 'Q4',
    kind: 'question',
    prompt:
      'Do you need multi-node high availability (horizontal scaling) now?',
    branches: [
      { label: 'Yes', nextId: 'Q4a' },
      { label: 'No', nextId: 'Q5' },
    ],
  },
  Q4a: {
    id: 'Q4a',
    kind: 'question',
    prompt:
      'Is your target scale 100M+ vectors (or rapidly growing toward that)?',
    branches: [
      { label: 'Yes', nextId: 'out-q4a-milvus' },
      { label: 'No', nextId: 'out-q4a-qdrant' },
    ],
  },
  Q5: {
    id: 'Q5',
    kind: 'question',
    prompt:
      'Is your dataset too large for RAM, or do you explicitly want disk-first economics?',
    branches: [
      { label: 'Yes', nextId: 'out-q5-lancedb' },
      { label: 'No', nextId: 'Q6' },
    ],
  },
  Q6: {
    id: 'Q6',
    kind: 'question',
    prompt:
      'Is your top priority lowest latency plus strong filtering in a dedicated service?',
    branches: [
      { label: 'Yes', nextId: 'out-q6-qdrant' },
      { label: 'No', nextId: 'Q7' },
    ],
  },
  Q7: {
    id: 'Q7',
    kind: 'question',
    prompt: 'Do you prefer SQL/relational workflows, or the simplest setup?',
    branches: [
      { label: 'SQL / relational', nextId: 'out-q7-pgvector' },
      { label: 'Simplest setup', nextId: 'out-q7-chromadb' },
    ],
  },

  // --- Outcomes ---
  'out-q1a-pgvector': {
    id: 'out-q1a-pgvector',
    kind: 'outcome',
    database: 'PGVector',
    notes: [],
    neutralLine: NEUTRAL_LINE.PGVector,
  },
  'out-q1b-pgvector': {
    id: 'out-q1b-pgvector',
    kind: 'outcome',
    database: 'PGVector',
    notes: [],
    neutralLine: NEUTRAL_LINE.PGVector,
  },
  'out-q1b-qdrant': {
    id: 'out-q1b-qdrant',
    kind: 'outcome',
    database: 'Qdrant',
    qualifier: 'dedicated service',
    notes: ['If you later need extreme scale: upgrade path \u2192 Milvus'],
    neutralLine: NEUTRAL_LINE.Qdrant,
  },
  'out-q2a-chromadb': {
    id: 'out-q2a-chromadb',
    kind: 'outcome',
    database: 'ChromaDB',
    notes: [],
    neutralLine: NEUTRAL_LINE.ChromaDB,
  },
  'out-q2a-qdrant': {
    id: 'out-q2a-qdrant',
    kind: 'outcome',
    database: 'Qdrant',
    qualifier: 'single-node',
    notes: [],
    neutralLine: NEUTRAL_LINE.Qdrant,
  },
  'out-q3a-qdrant': {
    id: 'out-q3a-qdrant',
    kind: 'outcome',
    database: 'Qdrant',
    qualifier: 'single-node',
    notes: [
      'Approach: store dense + sparse vectors and do fusion/reranking in the app',
    ],
    neutralLine: NEUTRAL_LINE.Qdrant,
  },
  'out-q3b-milvus': {
    id: 'out-q3b-milvus',
    kind: 'outcome',
    database: 'Milvus',
    notes: [],
    neutralLine: NEUTRAL_LINE.Milvus,
  },
  'out-q3b-lancedb': {
    id: 'out-q3b-lancedb',
    kind: 'outcome',
    database: 'LanceDB',
    notes: [
      'Best when you prefer embedded + disk-first economics / \u201cdata-lake\u201d style operation',
    ],
    neutralLine: NEUTRAL_LINE.LanceDB,
  },
  'out-q4a-milvus': {
    id: 'out-q4a-milvus',
    kind: 'outcome',
    database: 'Milvus',
    notes: ['Alternative if you want simpler ops: Qdrant cluster'],
    neutralLine: NEUTRAL_LINE.Milvus,
  },
  'out-q4a-qdrant': {
    id: 'out-q4a-qdrant',
    kind: 'outcome',
    database: 'Qdrant',
    qualifier: 'cluster',
    notes: [],
    neutralLine: NEUTRAL_LINE.Qdrant,
  },
  'out-q5-lancedb': {
    id: 'out-q5-lancedb',
    kind: 'outcome',
    database: 'LanceDB',
    notes: [],
    neutralLine: NEUTRAL_LINE.LanceDB,
  },
  'out-q6-qdrant': {
    id: 'out-q6-qdrant',
    kind: 'outcome',
    database: 'Qdrant',
    qualifier: 'single-node',
    notes: [],
    neutralLine: NEUTRAL_LINE.Qdrant,
  },
  'out-q7-pgvector': {
    id: 'out-q7-pgvector',
    kind: 'outcome',
    database: 'PGVector',
    notes: [],
    neutralLine: NEUTRAL_LINE.PGVector,
  },
  'out-q7-chromadb': {
    id: 'out-q7-chromadb',
    kind: 'outcome',
    database: 'ChromaDB',
    notes: [],
    neutralLine: NEUTRAL_LINE.ChromaDB,
  },
};
