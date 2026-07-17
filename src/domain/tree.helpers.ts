import { TREE } from './tree.constants';
import type { TreeNode } from './tree.types';

/** Look up a node by id. Throws if the id is unknown (data bug). */
export function getNode(id: string): TreeNode {
  const node = TREE[id];
  if (!node) {
    throw new Error(`Unknown node id: ${id}`);
  }
  return node;
}

/**
 * Resolve the next node id from a question node and the chosen branch index.
 * Returns null if the node is an outcome (no next) or the index is invalid.
 */
export function resolveNext(nodeId: string, branchIndex: number): string | null {
  const node = getNode(nodeId);
  if (node.kind !== 'question') {
    return null;
  }
  const branch = node.branches[branchIndex];
  return branch ? branch.nextId : null;
}
