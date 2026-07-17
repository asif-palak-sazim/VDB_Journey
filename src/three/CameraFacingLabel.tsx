import { Html } from '@react-three/drei';
import { COLORS } from '../ui/ui.constants';
import type { Vec3 } from './graphLayout.helpers';

interface CameraFacingLabelProps {
  text: string;
  position: Vec3;
}

/**
 * Screen-space projected label.
 *
 * We intentionally render database names as DOM projected from world space
 * instead of 3D text/billboards. World-space text will always pick up some
 * perspective distortion/skew near the screen edges, which is exactly the bug
 * the user reported. Html without `transform` stays flat in screen space, so
 * it is always readable from the viewer's current POV.
 */
export function CameraFacingLabel({ text, position }: CameraFacingLabelProps) {
  return (
    <Html
      position={position}
      center
      zIndexRange={[1, 0]}
      style={{
        pointerEvents: 'none',
        zIndex: 0,
        color: COLORS.textDark,
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        textShadow: '0 0 2px #ffffff, 0 0 6px rgba(255,255,255,0.9)',
        userSelect: 'none',
      }}
      >
      {text}
    </Html>
  );
}
