import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Group, MathUtils, Vector3 } from 'three';
import { resolveNext } from '../domain/tree.helpers';
import { COLORS } from '../ui/ui.constants';
import { LAYOUT } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CarAvatarProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
  /** The branch currently highlighted in the question modal (or null). */
  highlightedBranchIndex: number | null;
}

const CAR_LIFT = 0.2;
/** Park the car slightly toward the front of the flat checkpoint mat. */
const PARK_OFFSET_Z = LAYOUT.nodeRadius * 0.6;

// Kinematic "feel" tuning (no physics engine — velocity integrated per frame).
const MAX_SPEED = 14; // units/sec cruising speed
const ACCEL = 22; // units/sec^2 accelerating away from a stop
const BRAKE_DISTANCE = 4; // start slowing within this distance of the checkpoint
const ARRIVE_EPSILON = 0.04; // close enough to snap and stop
const TURN_RATE = 7; // how fast the heading eases toward travel direction
const MAX_LEAN = 0.28; // max body roll (radians) when turning

/** Ease an angle toward a target along the shortest path (no wrap snap). */
function dampAngle(current: number, target: number, t: number): number {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * MathUtils.clamp(t, 0, 1);
}

/** Signed shortest angular difference target-current in [-PI, PI]. */
function angleDelta(current: number, target: number): number {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * Low-poly car built from primitives. This component is the swappable seam:
 * a .glb model can replace the primitive body later without touching journey
 * logic — only the meshes inside <group> change.
 */
export function CarAvatar({
  positions,
  currentNodeId,
  highlightedBranchIndex,
}: CarAvatarProps) {
  const groupRef = useRef<Group>(null);
  const leanRef = useRef<Group>(null);
  const target = useRef(new Vector3());
  const speed = useRef(0);
  const initialised = useRef(false);

  // World position of the highlighted branch's destination node, so the car
  // can face it while the option is highlighted in the modal.
  const aimAt = useRef<Vector3 | null>(null);
  useEffect(() => {
    if (highlightedBranchIndex == null) {
      aimAt.current = null;
      return;
    }
    const nextId = resolveNext(currentNodeId, highlightedBranchIndex);
    const pos = nextId ? positions.get(nextId) : undefined;
    aimAt.current = pos ? new Vector3(pos[0], pos[1], pos[2]) : null;
  }, [currentNodeId, highlightedBranchIndex, positions]);

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
    const dt = Math.min(delta, 0.05); // clamp to avoid tab-switch jumps

    const toTarget = target.current.clone().sub(group.position);
    const dist = toTarget.length();

    if (dist <= ARRIVE_EPSILON) {
      // Arrived: snap and come to rest.
      group.position.copy(target.current);
      speed.current = 0;
    } else {
      // Speed limit that brakes as we approach the checkpoint (arrival easing).
      const brakeCap = MAX_SPEED * Math.min(1, dist / BRAKE_DISTANCE);
      // Accelerate toward the cruising/brake cap, but never exceed it.
      speed.current = Math.min(brakeCap, speed.current + ACCEL * dt);
      // Move along the heading; don't overshoot the target this frame.
      const move = Math.min(dist, speed.current * dt);
      group.position.addScaledVector(toTarget.normalize(), move);
    }

    // Decide which way to face: travel direction while moving, otherwise the
    // highlighted branch's direction while parked at a question.
    let facingDir: Vector3 | null = null;
    if (dist > 0.08) {
      facingDir = toTarget; // already points toward the travel target
    } else if (aimAt.current) {
      const toAim = aimAt.current.clone().sub(group.position);
      if (toAim.lengthSq() > 0.0001) facingDir = toAim;
    }

    // Smoothly turn toward the facing direction; lean the body into the turn.
    if (facingDir) {
      const desiredYaw = Math.atan2(facingDir.x, facingDir.z);
      const yawErr = angleDelta(group.rotation.y, desiredYaw);
      group.rotation.y = dampAngle(group.rotation.y, desiredYaw, dt * TURN_RATE);
      if (leanRef.current) {
        const targetLean = MathUtils.clamp(-yawErr * 1.2, -MAX_LEAN, MAX_LEAN);
        leanRef.current.rotation.z +=
          (targetLean - leanRef.current.rotation.z) * Math.min(1, dt * 8);
      }
    } else if (leanRef.current) {
      // Level out when settled.
      leanRef.current.rotation.z +=
        (0 - leanRef.current.rotation.z) * Math.min(1, dt * 8);
    }
  });

  return (
    <group ref={groupRef}>
     <group ref={leanRef}>
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
    </group>
  );
}
