import { Billboard, Text } from '@react-three/drei';
import { getNode } from '../domain/tree.helpers';
import { COLORS, LAYOUT } from '../ui/ui.constants';
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

        const label = isOutcome
          ? node.database
          : id;

        return (
          <group key={id} position={pos}>
            {isOutcome ? (
              <mesh castShadow>
                <icosahedronGeometry args={[LAYOUT.nodeRadius, 0]} />
                <meshStandardMaterial color={color} flatShading />
              </mesh>
            ) : (
              <mesh castShadow scale={isCurrent ? 1.15 : 1}>
                <dodecahedronGeometry args={[LAYOUT.nodeRadius, 0]} />
                <meshStandardMaterial color={color} flatShading />
              </mesh>
            )}
            <Billboard position={[0, LAYOUT.nodeRadius + 0.7, 0]}>
              <Text
                fontSize={0.55}
                color={COLORS.textDark}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.04}
                outlineColor="#ffffff"
              >
                {label}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}
