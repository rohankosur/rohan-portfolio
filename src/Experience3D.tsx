import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Vignette, 
  Noise, 
  ToneMapping 
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';

/* ══════════════════════════════════════════════════════════════════════
   DETERMINISTIC COSMIC STREAM PRNG (Mulberry32 - 100% Pure)
   ══════════════════════════════════════════════════════════════════════ */
const STREAM_COUNT = 650;

function generateCosmicStream(count: number, seed = 777) {
  let s = seed;
  const rand = () => {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const list = [];
  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * 28;
    const y = (rand() - 0.5) * 28;
    const z = (rand() - 0.5) * 20;
    list.push({
      x,
      y,
      z,
      speed: rand() * 0.9 + 0.35,
      scale: rand() * 0.04 + 0.015,
      color: rand() > 0.4 ? '#00f2fe' : '#10b981',
    });
  }
  return list;
}

const COSMIC_STREAM = generateCosmicStream(STREAM_COUNT);

/* ══════════════════════════════════════════════════════════════════════
   MACHINED CALIBRATION DIAL RING (Instanced Ticks)
   ══════════════════════════════════════════════════════════════════════ */
const TICK_COUNT = 72;

function CalibrationTickRing() {
  const ticksRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!ticksRef.current) return;
    const radius = 3.52;

    for (let i = 0; i < TICK_COUNT; i++) {
      const angle = (i / TICK_COUNT) * Math.PI * 2;
      const isMajor = i % 6 === 0;
      const tickLength = isMajor ? 0.22 : 0.11;
      const tickWidth = isMajor ? 0.024 : 0.012;

      dummy.position.set(
        Math.cos(angle) * (radius - tickLength / 2),
        Math.sin(angle) * (radius - tickLength / 2),
        0
      );
      dummy.rotation.set(0, 0, angle + Math.PI / 2);
      dummy.scale.set(tickWidth, tickLength, 0.02);
      dummy.updateMatrix();
      ticksRef.current.setMatrixAt(i, dummy.matrix);
    }
    ticksRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={ticksRef} args={[undefined, undefined, TICK_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#cbd5e1"
        metalness={0.9}
        roughness={0.25}
      />
    </instancedMesh>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DAMPED TELEMETRY NEEDLE (Spring Overshoot Dynamics)
   Exact harmonic oscillator: x'' + 2*zeta*omega*x' + omega²*(x - target) = 0
   ══════════════════════════════════════════════════════════════════════ */
function TelemetryNeedle({ scrollProgress, totalProgress = 0 }: { scrollProgress: number; totalProgress?: number }) {
  const needleGroup = useRef<THREE.Group>(null);
  const springState = useRef({
    angle: 0,
    velocity: 0,
  });

  useFrame((_, delta) => {
    if (!needleGroup.current) return;

    // Dial sweep angle [-2.1 rad, +2.1 rad] (~120 deg each side)
    // Synchronized with portfolio chapters:
    // Hero: 0 rad (resting center)
    // Subsystems: +1.2 rad (systems active)
    // Proof of Work: +1.8 rad (high activity telemetry peak)
    // Toolkit & Repos: +0.6 rad (calibrated nominal)
    let targetAngle = (scrollProgress - 0.5) * 3.8;
    if (totalProgress > 0.40 && totalProgress <= 0.65) {
      targetAngle = 1.75;
    } else if (totalProgress > 0.65) {
      targetAngle = 0.55;
    }

    const dt = Math.min(delta, 0.08);
    const omega = 13.0; // Natural frequency rad/s
    const zeta = 0.44;  // Damping ratio (<1 produces mechanical spring overshoot)
    const decay = zeta * omega;
    const dampedOmega = omega * Math.sqrt(Math.max(0.0001, 1 - zeta * zeta));

    const state = springState.current;
    const displacement = state.angle - targetAngle;
    const envelope = Math.exp(-decay * dt);
    const cosine = Math.cos(dampedOmega * dt);
    const sine = Math.sin(dampedOmega * dt);

    const newAngle =
      targetAngle +
      envelope *
        (displacement * cosine +
          ((state.velocity + decay * displacement) / dampedOmega) * sine);

    const newVelocity =
      envelope *
      (state.velocity * cosine -
        ((decay * state.velocity + omega * omega * displacement) /
          dampedOmega) *
          sine);

    state.angle = newAngle;
    state.velocity = newVelocity;

    needleGroup.current.rotation.z = newAngle;
  });

  return (
    <group ref={needleGroup} position={[0, 0, 0.04]}>
      {/* Needle Blade */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.04, 2.6, 0.02]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* HDR Luminous Needle Core Indicator Tip (toneMapped=false for Restrained Bloom) */}
      <mesh position={[0, 2.65, 0.015]}>
        <boxGeometry args={[0.02, 0.35, 0.02]} />
        <meshBasicMaterial
          color={[0.4, 5.0, 8.5]}
          toneMapped={false}
        />
      </mesh>

      {/* Amber Counterweight Tip */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.09, 0.6, 0.04]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Center Pivot Boss */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.22, 0.26, 0.08, 32]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   4D HYPERCUBE QUANTUM CORE (Tesseract Folding Geometry + HDR Knot)
   ══════════════════════════════════════════════════════════════════════ */
const HypercubeQuantumCore = () => {
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const innerBoxRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const CUBE_VERTS = useMemo(() => [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
  ], []);

  const linePositions = useMemo(() => new Float32Array(16 * 3), []);

  useFrame((state) => {
    if (!outerBoxRef.current || !innerBoxRef.current || !knotRef.current || !linesRef.current) return;
    const t = state.clock.getElapsedTime();

    // 4D Folding Cycle
    const fold = (Math.sin(t * 1.4) + 1) / 2;
    const outerScale = 1.0 + (1 - fold) * 0.8;
    const innerScale = 0.4 + fold * 0.9;

    outerBoxRef.current.scale.setScalar(outerScale);
    innerBoxRef.current.scale.setScalar(innerScale);

    outerBoxRef.current.rotation.x = t * 0.35;
    outerBoxRef.current.rotation.y = t * 0.45;
    innerBoxRef.current.rotation.y = -t * 0.55;
    innerBoxRef.current.rotation.z = t * 0.3;

    knotRef.current.rotation.x = -t * 0.8;
    knotRef.current.rotation.y = t * 1.1;

    // Update connector vertices
    const attr = linesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    let idx = 0;
    CUBE_VERTS.forEach(v => {
      attr.setXYZ(idx++, v[0] * outerScale * 0.45, v[1] * outerScale * 0.45, v[2] * outerScale * 0.45);
      attr.setXYZ(idx++, v[0] * innerScale * 0.45, v[1] * innerScale * 0.45, v[2] * innerScale * 0.45);
    });
    attr.needsUpdate = true;
  });

  return (
    <group>
      {/* Outer Hypercube Shroud */}
      <mesh ref={outerBoxRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial
          color={[0.2, 3.8, 7.5]}
          toneMapped={false}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner Hypercube Shroud */}
      <mesh ref={innerBoxRef}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshBasicMaterial
          color={[0.2, 5.5, 2.5]}
          toneMapped={false}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Connecting 4D Ray Segments */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={16} array={linePositions} itemSize={3} args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Glowing Torus Core Knot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.3, 0.022, 96, 16, 3, 5]} />
        <meshBasicMaterial
          color={[0.2, 7.0, 3.2]}
          toneMapped={false}
          wireframe
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Radiant Central Emitter Sphere */}
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshBasicMaterial
          color={[0.4, 4.5, 8.0]}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   HIGH-ALTITUDE ATMOSPHERIC TERMINAL ASSEMBLY
   ══════════════════════════════════════════════════════════════════════ */
interface AssemblyProps {
  scrollProgress: number;
  totalProgress?: number;
}

const AtmosphericTerminalAssembly = ({ scrollProgress, totalProgress = 0 }: AssemblyProps) => {
  const rootGroup = useRef<THREE.Group>(null);
  const sensorBayRef = useRef<THREE.Group>(null);
  const powerCellRef = useRef<THREE.Group>(null);
  const leftBoomRef = useRef<THREE.Group>(null);
  const rightBoomRef = useRef<THREE.Group>(null);
  const outerGimbalRef = useRef<THREE.Group>(null);
  const midGimbalRef = useRef<THREE.Mesh>(null);
  const innerGimbalRef = useRef<THREE.Mesh>(null);
  const schematicLinesRef = useRef<THREE.LineSegments>(null);

  const pointer = useRef({ x: 0, y: 0 });

  // PBR Cold Titanium and Obsidian Finishes
  const titaniumPbr = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.94,
    roughness: 0.16,
  }), []);

  const obsidianPbr = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0a0d13',
    metalness: 0.82,
    roughness: 0.28,
  }), []);

  const cyanWire = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.3, 3.8, 7.5),
    toneMapped: false,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
  }), []);

  const lineBuffer = useMemo(() => new Float32Array(8 * 3), []);

  useFrame((state, delta) => {
    if (!rootGroup.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Inertial Parallax with subtle mouse damping
    const targetX = state.pointer.x * (Math.PI / 4.5);
    const targetY = state.pointer.y * (Math.PI / 4.5);
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, targetX, 2.4, delta);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, targetY, 2.4, delta);

    // Root Group: Idle precession + inertial tilt
    rootGroup.current.rotation.y = pointer.current.x * 0.85 + t * 0.22;
    rootGroup.current.rotation.x = -pointer.current.y * 0.85 + Math.sin(t * 0.35) * 0.08;
    rootGroup.current.rotation.z = Math.cos(t * 0.25) * 0.06;

    // 2. Exploded-View Interpolation strictly tied to scrollProgress & totalProgress chapters
    let explode = 0;
    if (totalProgress < 0.14) {
      explode = THREE.MathUtils.clamp(scrollProgress * 1.8, 0, 1);
    } else if (totalProgress <= 0.44) {
      explode = 1.0;
    } else if (totalProgress <= 0.68) {
      const p = (totalProgress - 0.44) / 0.24;
      explode = THREE.MathUtils.lerp(1.0, 0.4, p);
    } else {
      explode = 0.35;
    }

    // Subsystem 1: Upper Atmospheric Radiometer Sensor Bay (CAP Telemetry)
    if (sensorBayRef.current) {
      const targetY = THREE.MathUtils.lerp(0.9, 3.6, explode);
      const targetZ = THREE.MathUtils.lerp(0, 1.4, explode);
      sensorBayRef.current.position.y = THREE.MathUtils.damp(sensorBayRef.current.position.y, targetY, 3.2, delta);
      sensorBayRef.current.position.z = THREE.MathUtils.damp(sensorBayRef.current.position.z, targetZ, 3.2, delta);
      sensorBayRef.current.rotation.y = t * 0.45;
    }

    // Subsystem 2: Lower Power Cell / Capacitor Matrix (Quant Backtester)
    if (powerCellRef.current) {
      const targetY = THREE.MathUtils.lerp(-0.9, -3.4, explode);
      const targetZ = THREE.MathUtils.lerp(0, -0.8, explode);
      powerCellRef.current.position.y = THREE.MathUtils.damp(powerCellRef.current.position.y, targetY, 3.2, delta);
      powerCellRef.current.position.z = THREE.MathUtils.damp(powerCellRef.current.position.z, targetZ, 3.2, delta);
      powerCellRef.current.rotation.y = -t * 0.35;
    }

    // Subsystem 3: Lateral Deployable Telemetry Booms (180 Math Engine)
    if (leftBoomRef.current && rightBoomRef.current) {
      const lateralDist = THREE.MathUtils.lerp(1.2, 4.1, explode);
      leftBoomRef.current.position.x = THREE.MathUtils.damp(leftBoomRef.current.position.x, -lateralDist, 3.2, delta);
      rightBoomRef.current.position.x = THREE.MathUtils.damp(rightBoomRef.current.position.x, lateralDist, 3.2, delta);
    }

    // Subsystem 4: Triple Concentric Orbital Gimbals
    if (outerGimbalRef.current && midGimbalRef.current && innerGimbalRef.current) {
      const gimbalScale = THREE.MathUtils.lerp(1.0, 1.45, explode);
      outerGimbalRef.current.scale.setScalar(gimbalScale);
      midGimbalRef.current.scale.setScalar(gimbalScale * 0.88);
      innerGimbalRef.current.scale.setScalar(gimbalScale * 0.76);

      outerGimbalRef.current.rotation.x = t * 0.5;
      outerGimbalRef.current.rotation.y = t * 0.28;
      midGimbalRef.current.rotation.y = -t * 0.65;
      midGimbalRef.current.rotation.z = t * 0.35;
      innerGimbalRef.current.rotation.x = -t * 0.75;
      innerGimbalRef.current.rotation.y = t * 0.9;
    }

    // 3. Dynamic Laser Schematic Vector Rays
    if (schematicLinesRef.current) {
      const pos = schematicLinesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      if (sensorBayRef.current && powerCellRef.current && leftBoomRef.current && rightBoomRef.current) {
        pos.setXYZ(0, 0, 0, 0);
        pos.setXYZ(1, sensorBayRef.current.position.x, sensorBayRef.current.position.y, sensorBayRef.current.position.z);
        pos.setXYZ(2, 0, 0, 0);
        pos.setXYZ(3, powerCellRef.current.position.x, powerCellRef.current.position.y, powerCellRef.current.position.z);
        pos.setXYZ(4, 0, 0, 0);
        pos.setXYZ(5, leftBoomRef.current.position.x, leftBoomRef.current.position.y, leftBoomRef.current.position.z);
        pos.setXYZ(6, 0, 0, 0);
        pos.setXYZ(7, rightBoomRef.current.position.x, rightBoomRef.current.position.y, rightBoomRef.current.position.z);
        pos.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={rootGroup}>
      {/* ─── 1. UPPER ATMOSPHERIC SENSOR BAY ─── */}
      <group ref={sensorBayRef} position={[0, 0.9, 0]}>
        <mesh material={titaniumPbr}>
          <cylinderGeometry args={[1.1, 1.4, 0.65, 32]} />
        </mesh>
        <mesh position={[0, 0.45, 0]} material={obsidianPbr}>
          <cylinderGeometry args={[0.7, 1.0, 0.4, 32]} />
        </mesh>

        {/* Triple Optical Radiometer Lenses */}
        {[-0.45, 0, 0.45].map((xOffset, i) => (
          <group key={i} position={[xOffset, 0.72, 0]}>
            <mesh material={titaniumPbr}>
              <cylinderGeometry args={[0.16, 0.16, 0.28, 16]} />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.14, 16, 16]} />
              <meshBasicMaterial
                color={[0.2, 6.0, 2.5]}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* High-Altitude Telemetry Antenna */}
        <mesh position={[0, 1.4, 0]} material={titaniumPbr}>
          <cylinderGeometry args={[0.02, 0.05, 1.2, 12]} />
        </mesh>
        <mesh position={[0, 2.0, 0]} material={cyanWire}>
          <octahedronGeometry args={[0.12, 0]} />
        </mesh>

        {/* Holographic Wireframe Shroud */}
        <mesh position={[0, 0.2, 0]} material={cyanWire}>
          <cylinderGeometry args={[1.55, 1.55, 1.5, 16]} />
        </mesh>
      </group>

      {/* ─── 2. LOWER POWER CELL / CAPACITOR MATRIX ─── */}
      <group ref={powerCellRef} position={[0, -0.9, 0]}>
        <mesh material={titaniumPbr}>
          <cylinderGeometry args={[1.5, 1.75, 0.55, 6]} />
        </mesh>

        {/* 6 Cylindrical Energy Units */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const angle = (idx / 6) * Math.PI * 2;
          const radius = 0.98;
          return (
            <group key={idx} position={[Math.cos(angle) * radius, -0.55, Math.sin(angle) * radius]}>
              <mesh material={obsidianPbr}>
                <cylinderGeometry args={[0.22, 0.22, 0.75, 16]} />
              </mesh>
              <mesh position={[0, -0.42, 0]}>
                <cylinderGeometry args={[0.16, 0.16, 0.15, 16]} />
                <meshBasicMaterial
                  color={[0.2, 5.5, 2.5]}
                  toneMapped={false}
                />
              </mesh>
            </group>
          );
        })}

        {/* Machined Radial Radiator Cooling Fins */}
        {[0, 1, 2, 3].map((fin) => (
          <mesh key={fin} position={[0, -0.95, 0]} rotation={[0, (fin * Math.PI) / 4, 0]} material={titaniumPbr}>
            <boxGeometry args={[3.0, 0.25, 0.04]} />
          </mesh>
        ))}
      </group>

      {/* ─── 3. LATERAL DEPLOYABLE TELEMETRY BOOMS ─── */}
      <group ref={leftBoomRef} position={[-1.2, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={titaniumPbr}>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 12]} />
        </mesh>
        <mesh position={[-1.1, 0, 0]} material={cyanWire}>
          <torusGeometry args={[0.38, 0.04, 12, 24]} />
        </mesh>
      </group>

      <group ref={rightBoomRef} position={[1.2, 0, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 2]} material={titaniumPbr}>
          <cylinderGeometry args={[0.08, 0.08, 2.2, 12]} />
        </mesh>
        <mesh position={[1.1, 0, 0]} material={cyanWire}>
          <torusGeometry args={[0.38, 0.04, 12, 24]} />
        </mesh>
      </group>

      {/* ─── 4. TRIPLE CONCENTRIC GYROSCOPE GIMBALS WITH CALIBRATION DIAL ─── */}
      <group ref={outerGimbalRef}>
        <mesh material={titaniumPbr}>
          <torusGeometry args={[3.5, 0.075, 16, 80]} />
        </mesh>
        {/* Instanced Laser Calibration Ticks */}
        <CalibrationTickRing />
        {/* Precision Damped Telemetry Needle */}
        <TelemetryNeedle scrollProgress={scrollProgress} totalProgress={totalProgress} />
      </group>

      <mesh ref={midGimbalRef} material={obsidianPbr}>
        <torusGeometry args={[3.0, 0.065, 16, 80]} />
      </mesh>
      <mesh ref={innerGimbalRef} material={titaniumPbr}>
        <torusGeometry args={[2.5, 0.055, 16, 80]} />
      </mesh>

      {/* Recessed Glowing Cyan Ring Filament */}
      <mesh>
        <torusGeometry args={[2.2, 0.012, 8, 96]} />
        <meshBasicMaterial
          color={[0.4, 4.5, 8.0]}
          toneMapped={false}
        />
      </mesh>

      {/* ─── 5. CENTRAL 4D HYPERCUBE & RADIANT CORE ─── */}
      <HypercubeQuantumCore />

      {/* ─── 6. DYNAMIC LASER SCHEMATIC VECTOR RAYS ─── */}
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
          opacity={scrollProgress > 0.06 ? 0.85 : 0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   INSTANCED COSMIC RAY STREAM (High-Altitude Drift)
   ══════════════════════════════════════════════════════════════════════ */
const CosmicStreamField = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    COSMIC_STREAM.forEach((p, i) => {
      const yPos = ((p.y + t * p.speed * 2.2 + 14) % 28) - 14;
      dummy.position.set(p.x, yPos, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STREAM_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#00f2fe"
        wireframe
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   CINEMATIC CAMERA RIG (Choreographed to scrollProgress & totalProgress)
   Seamless multi-chapter camera staging sweeping smoothly across viewport
   ══════════════════════════════════════════════════════════════════════ */
const CinematicCameraRig = ({ 
  scrollProgress = 0, 
  totalProgress = 0 
}: { 
  scrollProgress: number; 
  totalProgress: number;
}) => {
  useFrame((state, delta) => {
    let targetX = state.pointer.x * 0.7;
    let targetY = state.pointer.y * 0.7;
    let targetZ = 13.5;
    let lookTargetY = 0;

    if (totalProgress < 0.18) {
      // Chapter 1: Hero — Intimate centered view
      targetX += scrollProgress * 1.6;
      targetY -= scrollProgress * 1.0;
      targetZ = 13.5 + scrollProgress * 1.8;
      lookTargetY = -scrollProgress * 0.5;
    } else if (totalProgress < 0.45) {
      // Chapter 2: Subsystems — Angles right to frame exploded assembly adjacent to cards
      const p = (totalProgress - 0.18) / 0.27;
      targetX += 2.2 + p * 0.6;
      targetY -= 1.2 + p * 0.5;
      targetZ = 15.2 + p * 1.0;
      lookTargetY = -0.9;
    } else if (totalProgress < 0.72) {
      // Chapter 3: About & Heatmap — Isometric elevated vantage on rotating gimbals & needle
      const p = (totalProgress - 0.45) / 0.27;
      targetX += 2.6 - p * 1.4;
      targetY += 0.6 + p * 1.4;
      targetZ = 16.0 - p * 1.2;
      lookTargetY = -0.3;
    } else if (totalProgress < 0.90) {
      // Chapter 4: Toolkit & Repos — High-altitude vantage over particle stream
      const p = (totalProgress - 0.72) / 0.18;
      targetX -= 1.2 + p * 0.4;
      targetY += 2.0 - p * 0.8;
      targetZ = 15.2 + p * 0.8;
      lookTargetY = 0;
    } else {
      // Chapter 5: Off-Screen & Footer — Distant orbital telemetry perspective
      targetX += 0.2;
      targetY -= 0.5;
      targetZ = 14.8;
      lookTargetY = 0;
    }

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.0, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.0, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.0, delta);
    state.camera.lookAt(0, lookTargetY, 0);
  });

  return null;
};

/* ══════════════════════════════════════════════════════════════════════
   CANVAS CONTAINER WITH FABLE-GRADE CINEMATIC POSTPROCESSING
   Restrained HDR finish: mipmapBlur bloom + ACES Filmic + chromatic aberration
   ══════════════════════════════════════════════════════════════════════ */
export interface Experience3DProps {
  scrollProgress?: number;
  totalProgress?: number;
}

export default function Experience3D({ scrollProgress = 0, totalProgress = 0 }: Experience3DProps) {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 13.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      <CinematicCameraRig scrollProgress={scrollProgress} totalProgress={totalProgress} />

      {/* ─── Studio Glancing & Raking Lighting Rig ─── */}
      {/* 1. Shallow Raking Cold Key Light (reveals brushed titanium chamfers) */}
      <directionalLight position={[-6, 4, 3]} intensity={4.5} color="#e0f2fe" />
      {/* 2. Deep Obsidian / Emerald Rim Fill */}
      <directionalLight position={[6, -4, 4]} intensity={2.2} color="#10b981" />
      {/* 3. Intense Specular Amber/Cyan Rim Glint */}
      <directionalLight position={[2, -7, -5]} intensity={5.2} color="#ffd0a0" />
      <ambientLight intensity={0.5} color="#080b12" />

      {/* ─── Centerpiece Assembly ─── */}
      <AtmosphericTerminalAssembly scrollProgress={scrollProgress} totalProgress={totalProgress} />
      <CosmicStreamField />

      {/* ─── Fable / Cinematic Post-Processing Pipeline ─── */}
      <EffectComposer multisampling={0}>
        {/* Restrained HDR Bloom with mipmapBlur */}
        <Bloom
          mipmapBlur
          luminanceThreshold={1.0}
          luminanceSmoothing={0.3}
          intensity={0.65}
        />
        {/* Subtle Radial Chromatic Aberration */}
        <ChromaticAberration
          offset={chromaticOffset}
          radialModulation={true}
          modulationOffset={0.32}
        />
        {/* ACES Filmic Tone Mapping */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        {/* 35mm Cinema Lens Vignette */}
        <Vignette
          eskil={false}
          offset={0.2}
          darkness={0.65}
        />
        {/* Fine Optical Film Grain */}
        <Noise opacity={0.024} />
      </EffectComposer>
    </Canvas>
  );
}
