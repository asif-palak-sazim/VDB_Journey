import { DoubleSide } from 'three';
import { getNode } from '../domain/tree.helpers';
import { COLORS, LAYOUT } from '../ui/ui.constants';
import { CameraFacingLabel } from './CameraFacingLabel';
import type { Vec3 } from './graphLayout.helpers';

interface GraphNodesProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
}

export function GraphNodes({ positions, currentNodeId }: GraphNodesProps) {
  return (
    <>
      {[...positions.entries()].map(([id, pos]) => {
        const node = getNode(id);
        const isCurrent = id === currentNodeId;
        const isOutcome = node.kind === 'outcome';
        const color = isOutcome
          ? COLORS.outcomeNode
          : isCurrent
            ? COLORS.questionNodeActive
            : COLORS.questionNode;

        // Outcome mats are a touch larger so destinations read as bigger checkpoints.
        const matRadius = isOutcome ? LAYOUT.nodeRadius * 1.35 : LAYOUT.nodeRadius * 1.2;

        return (
          <group key={id} position={pos}>
            {/* Flat checkpoint mat (disc lying in the ground plane). */}
            <mesh position={[0, 0.02, 0]} receiveShadow>
              <cylinderGeometry args={[matRadius, matRadius, 0.08, 40]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Accent ring on top for the checkpoint look; brighter when current. */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
              <ringGeometry args={[matRadius * 0.7, matRadius * 0.85, 40]} />
              <meshBasicMaterial
                color={isCurrent ? COLORS.edgeHighlight : COLORS.accent}
                side={DoubleSide}
              />
            </mesh>
            {/* Database name printed flat on the mat (outcome checkpoints). */}
            {node.kind === 'outcome' && (
              <CameraFacingLabel
                text={node.database}
                position={[0, 0, 0]}
                maxWidth={matRadius * 1.9}
              />
            )}
          </group>
        );
      })}
    </>
  );
}
