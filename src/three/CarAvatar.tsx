import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group, Vector3 } from 'three';
import { COLORS } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CarAvatarProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
}

const CAR_LIFT = 0.2;

/**
 * Low-poly car built from primitives. This component is the swappable seam:
 * a .glb model can replace the primitive body later without touching journey
 * logic — only the meshes inside <group> change.
 */
export function CarAvatar({ positions, currentNodeId }: CarAvatarProps) {
  const groupRef = useRef<Group>(null);
  const target = useRef(new Vector3());
  const initialised = useRef(false);

  // Update the travel target whenever the current node changes.
  useEffect(() => {
    const pos = positions.get(currentNodeId);
    if (!pos) return;
    target.current.set(pos[0], pos[1] + CAR_LIFT, pos[2]);
    if (!initialised.current && groupRef.current) {
      groupRef.current.position.copy(target.current);
      initialised.current = true;
    }
  }, [currentNodeId, positions]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dir = target.current.clone().sub(group.position);
    const dist = dir.length();
    if (dist > 0.01) {
      // Face direction of travel.
      group.rotation.y = Math.atan2(dir.x, dir.z);
      // Ease toward target (frame-rate independent).
      const step = Math.min(1, delta * 3);
      group.position.lerp(target.current, step);
    }
  });

  return (
    <group ref={groupRef}>
      {/* body */}
      <mesh castShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.2, 0.45, 2]} />
        <meshStandardMaterial color={COLORS.carBody} flatShading />
      </mesh>
      {/* cabin */}
      <mesh castShadow position={[0, 0.75, -0.1]}>
        <boxGeometry args={[0.9, 0.4, 1]} />
        <meshStandardMaterial color={COLORS.carCabin} flatShading />
      </mesh>
      {/* wheels */}
      {(
        [
          [-0.65, 0.15, 0.6],
          [0.65, 0.15, 0.6],
          [-0.65, 0.15, -0.6],
          [0.65, 0.15, -0.6],
        ] as Vec3[]
      ).map((wp, i) => (
        <mesh key={i} position={wp} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.25, 10]} />
          <meshStandardMaterial color={COLORS.wheel} flatShading />
        </mesh>
      ))}
    </group>
  );
}
