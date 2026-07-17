import { DoubleSide } from 'three';
import { getNode } from '../domain/tree.helpers';
import { COLORS, LAYOUT } from '../ui/ui.constants';
import { CameraFacingLabel } from './CameraFacingLabel';
import type { Vec3 } from './graphLayout.helpers';

interface GraphNodesProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
  isAtOutcome: boolean;
}

export function GraphNodes({
  positions,
  currentNodeId,
  isAtOutcome,
}: GraphNodesProps) {
  const outcomeEntries = [...positions.entries()]
    .filter(([id]) => getNode(id).kind === 'outcome')
    .sort((a, b) => a[1][0] - b[1][0]);

  const crowdedLabelOffsets = new Map<string, [number, number]>();
  const crowdGap = LAYOUT.siblingGap * 1.35;
  const patterns: [number, number][] = [
    [0, -6],
    [-18, -20],
    [18, -20],
    [-10, -34],
    [10, -34],
  ];

  let i = 0;
  while (i < outcomeEntries.length) {
    let j = i + 1;
    while (
      j < outcomeEntries.length &&
      outcomeEntries[j][1][0] - outcomeEntries[j - 1][1][0] <= crowdGap
    ) {
      j += 1;
    }

    const group = outcomeEntries.slice(i, j);
    if (group.length === 1) {
      crowdedLabelOffsets.set(group[0][0], patterns[0]);
    } else {
      group.forEach(([id], index) => {
        crowdedLabelOffsets.set(id, patterns[index % patterns.length]);
      });
    }

    i = j;
  }

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
          <group key={id}>
          <group position={pos}>
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
          </group>
          {!isAtOutcome && node.kind === 'outcome' && (
            <CameraFacingLabel
              key={`${id}-label`}
              text={node.database}
              position={[pos[0], pos[1], pos[2]]}
              screenOffsetPx={crowdedLabelOffsets.get(id)}
            />
          )}
          </group>
        );
      })}
    </>
  );
}
