import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group, MathUtils, Vector3 } from 'three';
import { COLORS } from '../ui/ui.constants';
import { LAYOUT } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CarAvatarProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
}

const CAR_LIFT = 0.2;
/** Park the car slightly toward the front of the flat checkpoint mat. */
const PARK_OFFSET_Z = LAYOUT.nodeRadius * 0.6;

/** Ease an angle toward a target along the shortest path (no wrap snap). */
function dampAngle(current: number, target: number, t: number): number {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * MathUtils.clamp(t, 0, 1);
}

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
    // Park in front of the node rather than on top of it.
    target.current.set(pos[0], pos[1] + CAR_LIFT, pos[2] + PARK_OFFSET_Z);
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

    // Ease position toward target (frame-rate independent).
    const posStep = Math.min(1, delta * 3);
    group.position.lerp(target.current, posStep);

    // Smoothly turn to face the direction of travel while actually moving.
    if (dist > 0.05) {
      const desiredYaw = Math.atan2(dir.x, dir.z);
      group.rotation.y = dampAngle(group.rotation.y, desiredYaw, delta * 6);
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
