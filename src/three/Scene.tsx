import { OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import { computeLayout } from './graphLayout.helpers';
import { GraphEdges } from './GraphEdges';
import { GraphNodes } from './GraphNodes';
import { CarAvatar } from './CarAvatar';
import { CameraRig } from './CameraRig';
import { COLORS } from '../ui/ui.constants';

interface SceneProps {
  currentNodeId: string;
  highlightedBranchIndex: number | null;
  isAtOutcome: boolean;
}

export function Scene({
  currentNodeId,
  highlightedBranchIndex,
  isAtOutcome,
}: SceneProps) {
  const layout = useMemo(() => computeLayout(), []);

  return (
    <>
      <color attach="background" args={[COLORS.background]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 18, 8]} intensity={1.4} castShadow />

      {/* Low-poly ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, -20]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={COLORS.ground} flatShading />
      </mesh>

      <GraphEdges
        edges={layout.edges}
        positions={layout.positions}
        activeNodeId={currentNodeId}
        highlightedBranchIndex={highlightedBranchIndex}
      />
      <GraphNodes positions={layout.positions} currentNodeId={currentNodeId} />

      <CarAvatar positions={layout.positions} currentNodeId={currentNodeId} />
      <CameraRig
        positions={layout.positions}
        currentNodeId={currentNodeId}
        isAtOutcome={isAtOutcome}
      />

      {/* Mouse-only overview; keyboard never orbits. */}
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={40}
      />
    </>
  );
}
