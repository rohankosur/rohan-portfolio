import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   ASTRONOMICAL CONSTANTS & DETERMINISTIC PRNG
   ══════════════════════════════════════════════════════════════════════ */
const PARTICLE_COUNT = 600;

function createCosmicStream(count: number, seed = 108) {
  let s = seed;
  const rand = () => {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * 26;
    const y = (rand() - 0.5) * 26;
    const z = (rand() - 0.5) * 18;
    list.push({
      x,
      y,
      z,
      speed: rand() * 0.8 + 0.3,
      scale: rand() * 0.04 + 0.015,
      color: rand() > 0.4 ? '#00f2fe' : '#10b981',
    });
  }
  return list;
}

const COSMIC_STREAM = createCosmicStream(PARTICLE_COUNT);

/* ══════════════════════════════════════════════════════════════════════
   HIGH-ALTITUDE ATMOSPHERIC TERMINAL ASSEMBLY
   ══════════════════════════════════════════════════════════════════════ */
interface AssemblyProps {
  scrollProgress: number;
}

const AtmosphericTerminalAssembly = ({ scrollProgress }: AssemblyProps) => {
  const rootGroup = useRef<THREE.Group>(null);
  const sensorBayRef = useRef<THREE.Group>(null);
  const powerCellRef = useRef<THREE.Group>(null);
  const leftBoomRef = useRef<THREE.Group>(null);
  const rightBoomRef = useRef<THREE.Group>(null);
  const outerGimbalRef = useRef<THREE.Mesh>(null);
  const innerGimbalRef = useRef<THREE.Mesh>(null);
  const coreEmitterRef = useRef<THREE.Mesh>(null);
  const schematicLinesRef = useRef<THREE.LineSegments>(null);

  const pointer = useRef({ x: 0, y: 0 });

  // Metallic PBR Materials
  const titaniumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cbd5e1',
      metalness: 0.92,
      roughness: 0.18,
      wireframe: false,
    });
  }, []);

  const obsidianMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0e1117',
      metalness: 0.7,
      roughness: 0.35,
    });
  }, []);

  const cyanEmissive = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#00f2fe',
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const emeraldEmissive = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#10b981',
      emissive: '#10b981',
      emissiveIntensity: 2.2,
      metalness: 0.2,
      roughness: 0.1,
    });
  }, []);

  // Buffer for 4 exploded schematic connection lines (8 vertices)
  const lineBuffer = useMemo(() => new Float32Array(8 * 3), []);

  useFrame((state, delta) => {
    if (!rootGroup.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Inertial Mouse Parallax
    const targetX = state.pointer.x * (Math.PI / 5);
    const targetY = state.pointer.y * (Math.PI / 5);
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, targetX, 2.5, delta);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, targetY, 2.5, delta);

    // Root Group: Idle precession + inertial tilt
    rootGroup.current.rotation.y = pointer.current.x * 0.9 + t * 0.25;
    rootGroup.current.rotation.x = -pointer.current.y * 0.9 + Math.sin(t * 0.4) * 0.08;
    rootGroup.current.rotation.z = Math.cos(t * 0.3) * 0.05;

    // 2. Exploded-View Interpolation based on scrollProgress (0 = assembled, 1 = exploded)
    const explode = THREE.MathUtils.clamp(scrollProgress * 1.8, 0, 1);

    // Subsystem 1: Upper Sensor Bay (Atmospheric Radiometer / Lens Cluster)
    if (sensorBayRef.current) {
      const targetY = THREE.MathUtils.lerp(0.85, 3.4, explode);
      const targetZ = THREE.MathUtils.lerp(0, 1.2, explode);
      sensorBayRef.current.position.y = THREE.MathUtils.damp(sensorBayRef.current.position.y, targetY, 3.0, delta);
      sensorBayRef.current.position.z = THREE.MathUtils.damp(sensorBayRef.current.position.z, targetZ, 3.0, delta);
      sensorBayRef.current.rotation.y = t * 0.5;
    }

    // Subsystem 2: Lower Power Cell / Capacitor Matrix
    if (powerCellRef.current) {
      const targetY = THREE.MathUtils.lerp(-0.85, -3.2, explode);
      const targetZ = THREE.MathUtils.lerp(0, -0.6, explode);
      powerCellRef.current.position.y = THREE.MathUtils.damp(powerCellRef.current.position.y, targetY, 3.0, delta);
      powerCellRef.current.position.z = THREE.MathUtils.damp(powerCellRef.current.position.z, targetZ, 3.0, delta);
      powerCellRef.current.rotation.y = -t * 0.4;
    }

    // Subsystem 3: Lateral Deployable Telemetry Booms
    if (leftBoomRef.current && rightBoomRef.current) {
      const lateralDist = THREE.MathUtils.lerp(1.2, 3.8, explode);
      leftBoomRef.current.position.x = THREE.MathUtils.damp(leftBoomRef.current.position.x, -lateralDist, 3.0, delta);
      rightBoomRef.current.position.x = THREE.MathUtils.damp(rightBoomRef.current.position.x, lateralDist, 3.0, delta);
      leftBoomRef.current.rotation.z = Math.sin(t * 0.8) * 0.1;
      rightBoomRef.current.rotation.z = -Math.sin(t * 0.8) * 0.1;
    }

    // Subsystem 4: Dual Orbital Gyroscopes
    if (outerGimbalRef.current && innerGimbalRef.current) {
      const gimbalScale = THREE.MathUtils.lerp(1.0, 1.45, explode);
      outerGimbalRef.current.scale.setScalar(gimbalScale);
      innerGimbalRef.current.scale.setScalar(gimbalScale * 0.85);

      outerGimbalRef.current.rotation.x = t * 0.6;
      outerGimbalRef.current.rotation.y = t * 0.3;
      innerGimbalRef.current.rotation.y = -t * 0.8;
      innerGimbalRef.current.rotation.z = t * 0.5;
    }

    // Subsystem 5: Central Pulsing Cosmic Core Emitter
    if (coreEmitterRef.current) {
      const pulse = Math.sin(t * 3.5) * 0.15 + 1.0;
      coreEmitterRef.current.scale.setScalar(pulse);
      coreEmitterRef.current.rotation.y = -t * 1.2;
    }

    // 3. Update Schematic Exploded-View Laser Lines
    if (schematicLinesRef.current) {
      const pos = schematicLinesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      if (sensorBayRef.current && powerCellRef.current && leftBoomRef.current && rightBoomRef.current) {
        // Line 1: Center to Sensor Bay
        pos.setXYZ(0, 0, 0, 0);
        pos.setXYZ(1, sensorBayRef.current.position.x, sensorBayRef.current.position.y, sensorBayRef.current.position.z);
        // Line 2: Center to Power Cell
        pos.setXYZ(2, 0, 0, 0);
        pos.setXYZ(3, powerCellRef.current.position.x, powerCellRef.current.position.y, powerCellRef.current.position.z);
        // Line 3: Center to Left Boom
        pos.setXYZ(4, 0, 0, 0);
        pos.setXYZ(5, leftBoomRef.current.position.x, leftBoomRef.current.position.y, leftBoomRef.current.position.z);
        // Line 4: Center to Right Boom
        pos.setXYZ(6, 0, 0, 0);
        pos.setXYZ(7, rightBoomRef.current.position.x, rightBoomRef.current.position.y, rightBoomRef.current.position.z);
        pos.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={rootGroup}>
      {/* ─── 1. CORE SENSOR BAY (Top Subsystem) ─── */}
      <group ref={sensorBayRef} position={[0, 0.85, 0]}>
        {/* Stepped Machined Cap */}
        <mesh material={titaniumMaterial}>
          <cylinderGeometry args={[1.1, 1.4, 0.6, 32]} />
        </mesh>
        <mesh position={[0, 0.45, 0]} material={obsidianMaterial}>
          <cylinderGeometry args={[0.7, 1.0, 0.4, 32]} />
        </mesh>

        {/* Multi-Spectral Radiometer Apertures (3 Lenses) */}
        {[-0.45, 0, 0.45].map((xOffset, i) => (
          <group key={i} position={[xOffset, 0.72, 0]}>
            <mesh material={titaniumMaterial}>
              <cylinderGeometry args={[0.16, 0.16, 0.25, 16]} />
            </mesh>
            <mesh position={[0, 0.14, 0]} material={emeraldEmissive}>
              <sphereGeometry args={[0.14, 16, 16]} />
            </mesh>
          </group>
        ))}

        {/* High-Frequency Telemetry Needle */}
        <mesh position={[0, 1.3, 0]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.02, 0.05, 1.0, 12]} />
        </mesh>
        <mesh position={[0, 1.8, 0]} material={cyanEmissive}>
          <octahedronGeometry args={[0.1, 0]} />
        </mesh>

        {/* Holographic Wireframe Cage */}
        <mesh position={[0, 0.2, 0]} material={cyanEmissive}>
          <cylinderGeometry args={[1.5, 1.5, 1.4, 16]} />
        </mesh>
      </group>

      {/* ─── 2. POWER CELL / CAPACITOR MATRIX (Bottom Subsystem) ─── */}
      <group ref={powerCellRef} position={[0, -0.85, 0]}>
        {/* Hexagonal Titanium Baseplate */}
        <mesh material={titaniumMaterial}>
          <cylinderGeometry args={[1.5, 1.7, 0.5, 6]} />
        </mesh>

        {/* Circular Battery / Supercapacitor Array */}
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index / 6) * Math.PI * 2;
          const radius = 0.95;
          return (
            <group key={index} position={[Math.cos(angle) * radius, -0.5, Math.sin(angle) * radius]}>
              <mesh material={obsidianMaterial}>
                <cylinderGeometry args={[0.22, 0.22, 0.7, 16]} />
              </mesh>
              <mesh position={[0, -0.4, 0]} material={emeraldEmissive}>
                <cylinderGeometry args={[0.16, 0.16, 0.15, 16]} />
              </mesh>
            </group>
          );
        })}

        {/* Heat Dissipation Radiator Fins */}
        {[0, 1, 2, 3].map((fin) => (
          <mesh key={fin} position={[0, -0.9, 0]} rotation={[0, (fin * Math.PI) / 4, 0]} material={titaniumMaterial}>
            <boxGeometry args={[2.8, 0.2, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* ─── 3. LATERAL DEPLOYABLE TELEMETRY BOOMS ─── */}
      <group ref={leftBoomRef} position={[-1.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
        </mesh>
        <mesh position={[-1.0, 0, 0]} material={cyanEmissive}>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
        </mesh>
      </group>

      <group ref={rightBoomRef} position={[1.2, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
        </mesh>
        <mesh position={[1.0, 0, 0]} material={cyanEmissive}>
          <torusGeometry args={[0.35, 0.04, 12, 24]} />
        </mesh>
      </group>

      {/* ─── 4. DUAL CONCENTRIC GYROSCOPE GIMBALS ─── */}
      <mesh ref={outerGimbalRef} material={titaniumMaterial}>
        <torusGeometry args={[3.4, 0.07, 16, 80]} />
      </mesh>
      <mesh ref={innerGimbalRef} material={obsidianMaterial}>
        <torusGeometry args={[2.8, 0.06, 16, 80]} />
      </mesh>

      {/* ─── 5. CENTRAL QUANTUM IONIZATION EMITTER ─── */}
      <mesh ref={coreEmitterRef}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={3.0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      {/* Outer Containment Field */}
      <mesh>
        <icosahedronGeometry args={[0.95, 2]} />
        <meshBasicMaterial
          color="#10b981"
          wireframe
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ─── 6. DYNAMIC SCHEMATIC EXPLODED-VIEW LASER RAYS ─── */}
      <lineSegments ref={schematicLinesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={8}
            array={lineBuffer}
            itemSize={3}
            args={[lineBuffer, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00f2fe"
          transparent
          opacity={scrollProgress > 0.08 ? 0.75 : 0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   COSMIC STREAM PARTICLES (High-Altitude Drift, Instanced)
   ══════════════════════════════════════════════════════════════════════ */
const CosmicParticles = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    COSMIC_STREAM.forEach((p, i) => {
      const yPos = ((p.y + t * p.speed * 2 + 13) % 26) - 13;
      dummy.position.set(p.x, yPos, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#00f2fe" wireframe transparent opacity={0.35} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
};

export interface Experience3DProps {
  scrollProgress?: number;
}

export default function Experience3D({ scrollProgress = 0 }: Experience3DProps) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0009, 0.0009), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      {/* ─── Three-Point Technical Lighting Rig ─── */}
      {/* 1. Cold High-Altitude Key Light */}
      <directionalLight position={[6, 8, 7]} intensity={3.0} color="#e0f2fe" />
      {/* 2. Emerald / Slate Fill Light */}
      <directionalLight position={[-6, -4, 4]} intensity={1.4} color="#10b981" />
      {/* 3. Intense Specular Cyan Rim Light */}
      <directionalLight position={[0, -8, -6]} intensity={4.5} color="#00f2fe" />
      <ambientLight intensity={0.65} color="#0e1117" />

      {/* ─── 3D Procedural Centric Assembly ─── */}
      <AtmosphericTerminalAssembly scrollProgress={scrollProgress} />
      <CosmicParticles />

      {/* ─── Awwwards-Grade Post-Processing Pipeline ─── */}
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.85}
          intensity={1.4}
        />
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={true}
          modulationOffset={0.25}
        />
        <Noise opacity={0.035} />
      </EffectComposer>
    </Canvas>
  );
}
