import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <mesh rotation={[0.4, 0.8, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
    </Canvas>
  );
}
