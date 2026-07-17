import { Line } from '@react-three/drei';
import { COLORS } from '../ui/ui.constants';
import type { LayoutEdge, Vec3 } from './graphLayout.helpers';

interface GraphEdgesProps {
  edges: LayoutEdge[];
  positions: Map<string, Vec3>;
  /** Node whose outgoing branches may be highlighted (the current question). */
  activeNodeId: string;
  /** Which branch index is currently highlighted at the active node (or null). */
  highlightedBranchIndex: number | null;
}

export function GraphEdges({
  edges,
  positions,
  activeNodeId,
  highlightedBranchIndex,
}: GraphEdgesProps) {
  return (
    <>
      {edges.map((edge) => {
        const from = positions.get(edge.fromId);
        const to = positions.get(edge.toId);
        if (!from || !to) return null;

        const isHighlighted =
          edge.fromId === activeNodeId &&
          highlightedBranchIndex === edge.branchIndex;

        return (
          <Line
            key={`${edge.fromId}-${edge.branchIndex}`}
            points={[from, to]}
            color={isHighlighted ? COLORS.edgeHighlight : COLORS.edge}
            lineWidth={isHighlighted ? 5 : 2}
          />
        );
      })}
    </>
  );
}
