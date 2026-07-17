import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import type { Vec3 } from './graphLayout.helpers';

interface CameraRigProps {
  positions: Map<string, Vec3>;
  currentNodeId: string;
  isAtOutcome: boolean;
}

// Follow offset while travelling; pulled-back offset while framing a question.
const FOLLOW_OFFSET = new Vector3(0, 5, 9);
const FRAME_OFFSET = new Vector3(0, 7, 13);

/**
 * Hybrid camera: follows the node while the car is moving toward it, then
 * eases to a pulled-back framing once it settles, so the branches are visible.
 * OrbitControls remains available for manual mouse inspection between moves.
 */
export function CameraRig({ positions, currentNodeId, isAtOutcome }: CameraRigProps) {
  const { camera } = useThree();
  const nodePos = useRef(new Vector3());
  const settled = useRef(false);
  const arrivedAt = useRef<string>('');

  useEffect(() => {
    const pos = positions.get(currentNodeId);
    if (!pos) return;
    nodePos.current.set(pos[0], pos[1], pos[2]);
    settled.current = false;
    arrivedAt.current = currentNodeId;
  }, [currentNodeId, positions]);

  useFrame((_, delta) => {
    const offset = isAtOutcome || settled.current ? FRAME_OFFSET : FOLLOW_OFFSET;
    const desired = nodePos.current.clone().add(offset);

    const step = Math.min(1, delta * 2.2);
    camera.position.lerp(desired, step);
    camera.lookAt(nodePos.current);

    if (!settled.current && camera.position.distanceTo(desired) < 0.4) {
      settled.current = true;
    }
  });

  return null;
}
