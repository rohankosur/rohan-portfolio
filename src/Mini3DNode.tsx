import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Octahedron, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Node = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.5;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.8;
  });

  return (
    <mesh ref={ref}>
      <Octahedron args={[1.5, 1]}>
        <MeshWobbleMaterial 
          color={color} 
          wireframe={true} 
          factor={1.5} 
          speed={3} 
          transparent
          opacity={0.8}
        />
      </Octahedron>
    </mesh>
  );
}

export default function Mini3DNode({ color = "#00f3ff" }: { color?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={1} />
      <Node color={color} />
    </Canvas>
  );
}
