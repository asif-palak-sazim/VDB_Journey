import type { DatabaseName } from '../domain/tree.types';

/** Bright low-poly palette. */
export const COLORS = {
  background: '#8ecae6',
  ground: '#a7d474',
  questionNode: '#ffb703',
  questionNodeActive: '#fb8500',
  outcomeNode: '#8338ec',
  edge: '#5a6472',
  edgeHighlight: '#ff006e',
  carBody: '#ef476f',
  carCabin: '#ffd166',
  wheel: '#22223b',
  textDark: '#1a1a2e',
  panelBg: 'rgba(20, 24, 48, 0.88)',
  panelText: '#f8f9fb',
  accent: '#ffd166',
  disabled: '#6c757d',
} as const;

/** Per-database accent color for the outcome card. */
export const DB_COLOR: Record<DatabaseName, string> = {
  PGVector: '#3d9970',
  Qdrant: '#ff006e',
  ChromaDB: '#ff9f1c',
  Milvus: '#118ab2',
  LanceDB: '#8338ec',
};

/** Layout spacing (world units). */
export const LAYOUT = {
  depthGap: 6,
  siblingGap: 3.4,
  nodeRadius: 0.9,
} as const;
