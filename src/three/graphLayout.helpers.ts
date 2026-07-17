import { ROOT_ID } from '../domain/tree.constants';
import { getNode } from '../domain/tree.helpers';
import { LAYOUT } from '../ui/ui.constants';

export type Vec3 = [number, number, number];

export interface LayoutEdge {
  fromId: string;
  toId: string;
  branchIndex: number;
  label: string;
}

export interface GraphLayout {
  positions: Map<string, Vec3>;
  edges: LayoutEdge[];
}

/**
 * Tidy-tree layout: x from an in-order leaf counter (internal nodes centre over
 * their children), z from depth. Deterministic; no overlap.
 */
export function computeLayout(): GraphLayout {
  const positions = new Map<string, Vec3>();
  const edges: LayoutEdge[] = [];
  let leafCursor = 0;

  function place(id: string, depth: number): number {
    const node = getNode(id);
    const z = -depth * LAYOUT.depthGap;

    if (node.kind === 'outcome') {
      const x = leafCursor * LAYOUT.siblingGap;
      leafCursor += 1;
      positions.set(id, [x, 0, z]);
      return x;
    }

    const childXs = node.branches.map((branch, branchIndex) => {
      edges.push({ fromId: id, toId: branch.nextId, branchIndex, label: branch.label });
      return place(branch.nextId, depth + 1);
    });
    const x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    positions.set(id, [x, 0, z]);
    return x;
  }

  place(ROOT_ID, 0);

  // Centre the whole graph on x = 0.
  const xs = [...positions.values()].map((p) => p[0]);
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
  for (const [id, [x, y, z]] of positions) {
    positions.set(id, [x - midX, y, z]);
  }

  return { positions, edges };
}
