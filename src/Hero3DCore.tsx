import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

import * as THREE from 'three';

/* ─── 4D Tesseract Illusion ─── */
const TesseractIllusion = () => {
  const outerCube = useRef<THREE.Mesh>(null);
  const innerCube = useRef<THREE.Mesh>(null);
  const coreKnot = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  
  // Create edges geometry for the connection lines between inner and outer cubes
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!outerCube.current || !innerCube.current || !coreKnot.current || !group.current || !linesRef.current) return;
    const t = state.clock.getElapsedTime();

    // 4D Folding Effect: 
    // The inner cube expands while the outer shrinks, creating an endless folding illusion
    const foldPhase = (Math.sin(t * 1.5) + 1) / 2; // 0 to 1
    const currentOuterSize = 1.5 + (1 - foldPhase) * 1.5;
    const currentInnerSize = 0.5 + foldPhase * 1.5;

    outerCube.current.scale.setScalar(currentOuterSize);
    innerCube.current.scale.setScalar(currentInnerSize);

    // Complex continuous rotation
    group.current.rotation.x = t * 0.3;
    group.current.rotation.y = t * 0.4;
    group.current.rotation.z = t * 0.2;

    coreKnot.current.rotation.x = -t * 0.6;
    coreKnot.current.rotation.y = t * 0.8;
    
    // Update connecting lines between the two cubes' vertices
    const posAttribute = linesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    
    // 8 vertices of a cube
    const vertices = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
    ];

    let i = 0;
    vertices.forEach(v => {
      // Outer vertex
      posAttribute.setXYZ(i++, v[0] * currentOuterSize * 0.5, v[1] * currentOuterSize * 0.5, v[2] * currentOuterSize * 0.5);
      // Inner vertex
      posAttribute.setXYZ(i++, v[0] * currentInnerSize * 0.5, v[1] * currentInnerSize * 0.5, v[2] * currentInnerSize * 0.5);
    });
    posAttribute.needsUpdate = true;
  });

  // Initial empty buffer for the 8 connecting lines (16 vertices total, 2 per line)
  const linePositions = useMemo(() => new Float32Array(16 * 3), []);

  return (
    <group ref={group}>
      {/* Outer Hypercube boundary */}
      <mesh ref={outerCube}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Inner Hypercube boundary */}
      <mesh ref={innerCube}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Tesseract Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={16} array={linePositions} itemSize={3} args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Pulsing Core Knot */}
      <mesh ref={coreKnot}>
        <torusKnotGeometry args={[0.4, 0.02, 128, 16, 3, 5]} />
        <meshBasicMaterial color="#00ff66" wireframe transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

/* ─── Artisanal Painting Frame ─── */
const PaintingFrame = () => {
  const outerRing = useRef<THREE.Mesh>(null);
  const midRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!outerRing.current || !midRing.current || !innerRing.current) return;
    const t = state.clock.getElapsedTime();
    
    // Incredibly smooth lerp for mouse coordinates
    // Convert pointer to a desired rotation angle (approx 45 degrees max)
    const targetX = state.pointer.x * (Math.PI / 4);
    const targetY = state.pointer.y * (Math.PI / 4);
    
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, targetX, 0.03);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, targetY, 0.03);

    // Gyroscopic Orbital Effect
    // The rings rotate around the center, responding to the mouse but maintaining an orbital flow
    
    // Outer ring: dramatic follow
    outerRing.current.rotation.y = mouse.current.x * 1.2 + Math.sin(t * 0.2) * 0.1;
    outerRing.current.rotation.x = -mouse.current.y * 1.2 + Math.cos(t * 0.3) * 0.05;
    
    // Mid ring: inverted/counter-orbit follow for a complex mechanical feel
    midRing.current.rotation.y = -mouse.current.x * 0.6 + Math.sin(t * 0.3 + 1) * 0.2;
    midRing.current.rotation.x = mouse.current.y * 0.6 + Math.cos(t * 0.4 + 1) * 0.1;
    
    // Inner ring: stable continuous orbit with slight mouse influence
    innerRing.current.rotation.y = mouse.current.x * 0.3 + t * 0.4;
    innerRing.current.rotation.x = -mouse.current.y * 0.3 + Math.sin(t * 0.2) * 0.2;
  });

  return (
    <group>
      {/* Outer heavy frame */}
      <mesh ref={outerRing}>
        <boxGeometry args={[6.5, 6.5, 0.5]} />
        <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Inner intricate frame rails */}
      <mesh ref={midRing}>
        <boxGeometry args={[5.5, 5.5, 0.2]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={innerRing}>
        <boxGeometry args={[4.5, 4.5, 0.1]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Floating particles inside the frame boundary */}
      {Array.from({ length: 40 }).map((_, i) => (
        <FrameParticle key={i} index={i} />
      ))}

      {/* Center 4D Illusion */}
      <TesseractIllusion />
    </group>
  );
};

/* ─── Frame Particles ─── */
const FrameParticle = ({ index }: { index: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  // Position particles mostly along the edges of the frame
  const x = (Math.random() - 0.5) * 6;
  const y = (Math.random() - 0.5) * 6;
  const z = (Math.random() - 0.5) * 0.8;
  const color = index % 2 === 0 ? "#ff00ff" : "#00ffff";

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t + index;
    ref.current.rotation.y = t * 1.5;
    // Slight drift
    ref.current.position.z = z + Math.sin(t * 2 + index) * 0.2;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

/* ─── Canvas Wrapper (Transparent & Fast) ─── */
export default function Hero3DCore() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 14], fov: 45 }} 
      dpr={[1, 2]} 
      gl={{ alpha: true, antialias: false }}
    >
      <ambientLight intensity={2} />
      
      {/* The main scene */}
      <PaintingFrame />
    </Canvas>
  );
}
