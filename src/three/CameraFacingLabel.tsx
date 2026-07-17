import { Text } from '@react-three/drei';
import { COLORS } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CameraFacingLabelProps {
  text: string;
  /** Node (mat) centre in world space. */
  position: Vec3;
  /** Max width to fit the text within (mat diameter). */
  maxWidth: number;
}

/**
 * Database name rendered as flat 3D text lying on the checkpoint mat.
 *
 * This is part of the 3D scene graph (not a projected DOM overlay), so it can
 * never detach, drift, skew, or mis-project the way an <Html> label can — it is
 * physically glued to the node. It lies in the ground plane just above the mat
 * surface and reads toward the default camera.
 */
export function CameraFacingLabel({
  text,
  position,
  maxWidth,
}: CameraFacingLabelProps) {
  return (
    <Text
      position={[position[0], position[1] + 0.14, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={0.62}
      maxWidth={maxWidth * 1.6}
      color={COLORS.textDark}
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.05}
      outlineColor="#ffffff"
    >
      {text}
    </Text>
  );
}
