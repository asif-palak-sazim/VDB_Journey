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
 * Database name rendered as upright 3D text standing on the checkpoint mat,
 * like a signpost (perpendicular to the mat, not lying flat on it).
 *
 * This is part of the 3D scene graph (not a projected DOM overlay), so it can
 * never detach, drift, skew, or mis-project the way an <Html> label can — it is
 * physically glued to the node. It stands vertically above the mat and reads
 * toward the default camera.
 */
export function CameraFacingLabel({
  text,
  position,
  maxWidth,
}: CameraFacingLabelProps) {
  return (
    <Text
      position={[position[0], position[1] + 0.2, position[2]]}
      fontSize={0.62}
      maxWidth={maxWidth * 1.6}
      color={COLORS.textDark}
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.05}
      outlineColor="#ffffff"
    >
      {text}
    </Text>
  );
}
