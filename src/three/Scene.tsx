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
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[12, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
      >
        {/* Widen the shadow frustum to cover the whole graph so the car's
            shadow is computed everywhere it travels. */}
        <orthographicCamera
          attach="shadow-camera"
          args={[-40, 40, 40, -40, 1, 80]}
        />
      </directionalLight>

      {/* Low-poly ground — sits just beneath the checkpoint mats so the car's
          shadow lands directly under it and stays visible. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -20]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={COLORS.ground} flatShading />
      </mesh>

      <GraphEdges
        edges={layout.edges}
        positions={layout.positions}
        activeNodeId={currentNodeId}
        highlightedBranchIndex={highlightedBranchIndex}
      />
      <GraphNodes
        positions={layout.positions}
        currentNodeId={currentNodeId}
        isAtOutcome={isAtOutcome}
      />

      <CarAvatar
        positions={layout.positions}
        currentNodeId={currentNodeId}
        highlightedBranchIndex={highlightedBranchIndex}
      />
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
