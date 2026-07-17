import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { COLORS } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CameraFacingLabelProps {
  text: string;
  position: Vec3;
}

/**
 * A text label that stays parallel to the camera's view plane. Unlike a
 * point-facing billboard (which rolls/skews for nodes near the screen edges
 * under perspective), copying the camera's world quaternion keeps every label
 * upright and undistorted regardless of screen position.
 */
export function CameraFacingLabel({ text, position }: CameraFacingLabelProps) {
  const ref = useRef<Group>(null);

  useFrame(({ camera }) => {
    if (ref.current) ref.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={ref} position={position}>
      <Text
        fontSize={0.55}
        color={COLORS.textDark}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#ffffff"
      >
        {text}
      </Text>
    </group>
  );
}
