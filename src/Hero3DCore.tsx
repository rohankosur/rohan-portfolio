import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const ComplexCore = () => {
  const group = useRef<THREE.Group>(null);
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!group.current || !outerRing.current || !innerRing.current || !coreRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Complex intertwined rotations
    group.current.rotation.x = Math.sin(time * 0.3) * 0.5;
    group.current.rotation.y = time * 0.2;
    
    outerRing.current.rotation.x = time * 0.5;
    outerRing.current.rotation.y = time * 0.3;
    
    innerRing.current.rotation.z = -time * 0.8;
    innerRing.current.rotation.x = Math.cos(time * 0.5);

    coreRef.current.rotation.y = -time;
    coreRef.current.rotation.x = time * 0.5;

    // React to mouse parallax
    const mouseX = (state.pointer.x * Math.PI) * 0.2;
    const mouseY = (state.pointer.y * Math.PI) * 0.2;

    group.current.rotation.x += (mouseY - group.current.rotation.x) * 0.1;
    group.current.rotation.y += (mouseX - group.current.rotation.y) * 0.1;
  });

  return (
    <group ref={group}>
      {/* Outer Cage */}
      <mesh ref={outerRing}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.2} />
      </mesh>
      
      <mesh ref={innerRing} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.7, 0.02, 16, 100]} />
        <meshBasicMaterial color="#b026ff" wireframe transparent opacity={0.4} />
      </mesh>
      
      {/* 3rd angled ring */}
      <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
        <torusGeometry args={[3.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Scattered Cubes/Tech Nodes */}
      {Array.from({ length: 40 }).map((_, i) => (
        <TechNode key={i} index={i} />
      ))}

      {/* Central Distorted Core */}
      <mesh ref={coreRef}>
        <Icosahedron args={[1.5, 3]}>
          <MeshDistortMaterial 
            color="#050505" 
            emissive="#00f3ff"
            emissiveIntensity={0.5}
            distort={0.4} 
            speed={2} 
            wireframe={true}
          />
        </Icosahedron>
        {/* Glow */}
        <pointLight color="#b026ff" intensity={2} distance={10} />
        <pointLight color="#00f3ff" intensity={2} distance={10} />
      </mesh>
    </group>
  );
};

const TechNode = ({ index }: { index: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  // Random starting positions in a spherical distribution
  const radius = 3.8 + Math.random() * 2.0;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.01 + index * 0.001;
    ref.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <boxGeometry args={[Math.random()*0.15 + 0.05, Math.random()*0.15 + 0.05, Math.random()*0.15 + 0.05]} />
      <meshBasicMaterial color={index % 3 === 0 ? "#b026ff" : (index % 2 === 0 ? "#00f3ff" : "#ffffff")} wireframe transparent opacity={0.6} />
    </mesh>
  );
};

export default function Hero3DCore() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <ComplexCore />
    </Canvas>
  );
}
