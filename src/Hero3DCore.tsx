import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Orbital ring ─── */
const Ring = ({
  radius,
  color,
  opacity,
  rotationAxis,
  speed,
}: {
  radius: number;
  color: string;
  opacity: number;
  rotationAxis: [number, number, number];
  speed: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = rotationAxis[0] + t * speed;
    ref.current.rotation.y = rotationAxis[1] + t * speed * 0.7;
    ref.current.rotation.z = rotationAxis[2] + t * speed * 0.3;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 120]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};

/* ─── Floating particle nodes ─── */
const Particles = ({ count }: { count: number }) => {
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
    }
    return arr;
  }, [count]);

  const colors = ['#00f3ff', '#b026ff', '#ffffff'];

  return (
    <>
      {positions.map((pos, i) => (
        <ParticleNode key={i} position={pos} color={colors[i % 3]} index={i} />
      ))}
    </>
  );
};

const ParticleNode = ({
  position,
  color,
  index,
}: {
  position: [number, number, number];
  color: string;
  index: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const size = useMemo(() => 0.03 + Math.random() * 0.08, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.008 + index * 0.0005;
    ref.current.rotation.y += 0.012;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </mesh>
  );
};

/* ─── Central core assembly ─── */
const CoreAssembly = () => {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!group.current || !core.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth mouse tracking
    mouse.current.x += (state.pointer.x * 0.4 - mouse.current.x) * 0.05;
    mouse.current.y += (state.pointer.y * 0.4 - mouse.current.y) * 0.05;

    group.current.rotation.x = Math.sin(t * 0.2) * 0.3 + mouse.current.y;
    group.current.rotation.y = t * 0.15 + mouse.current.x;

    core.current.rotation.y = -t * 0.8;
    core.current.rotation.x = t * 0.4;
  });

  return (
    <group ref={group}>
      {/* 5 orbital rings at varying angles */}
      <Ring radius={3.0} color="#00f3ff" opacity={0.25} rotationAxis={[0, 0, 0]} speed={0.4} />
      <Ring radius={2.6} color="#b026ff" opacity={0.35} rotationAxis={[Math.PI / 2, 0, 0]} speed={-0.6} />
      <Ring radius={3.4} color="#ffffff" opacity={0.08} rotationAxis={[Math.PI / 4, Math.PI / 4, 0]} speed={0.25} />
      <Ring radius={2.2} color="#00f3ff" opacity={0.15} rotationAxis={[Math.PI / 3, 0, Math.PI / 6]} speed={0.5} />
      <Ring radius={3.8} color="#b026ff" opacity={0.1} rotationAxis={[0, Math.PI / 3, Math.PI / 4]} speed={-0.3} />

      {/* Particles */}
      <Particles count={60} />

      {/* Core icosahedron */}
      <mesh ref={core}>
        <Icosahedron args={[1.4, 4]}>
          <MeshDistortMaterial
            color="#050505"
            emissive="#00f3ff"
            emissiveIntensity={0.6}
            distort={0.35}
            speed={1.5}
            wireframe
          />
        </Icosahedron>

        {/* Breathing lights */}
        <BreathingLight color="#b026ff" intensity={3} />
        <BreathingLight color="#00f3ff" intensity={2} offset={Math.PI} />
      </mesh>
    </group>
  );
};

const BreathingLight = ({
  color,
  intensity,
  offset = 0,
}: {
  color: string;
  intensity: number;
  offset?: number;
}) => {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.intensity = intensity + Math.sin(t * 2 + offset) * intensity * 0.4;
  });

  return <pointLight ref={ref} color={color} intensity={intensity} distance={12} />;
};

/* ─── Canvas wrapper ─── */
export default function Hero3DCore() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.3} />
      <CoreAssembly />
    </Canvas>
  );
}
