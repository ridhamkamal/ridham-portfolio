"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox } from "@react-three/drei";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

export interface HeroSceneProps {
  /** 0 at page top, 1 when the hero has scrolled away. Mutated by the parent; read per frame. */
  scroll: MutableRefObject<number>;
  /** Intensity multiplier from motion prefs (0 = still). */
  intensity: number;
  frameloop: "always" | "demand" | "never";
  onContextLost: () => void;
}

const VIOLET = new THREE.Color("#a594ff");
const CYAN = new THREE.Color("#67e0f0");
const WARM = new THREE.Color("#f2c46d");

/** Smooth 0→1 entrance after `delay` seconds. */
const enter = (t: number, delay: number, dur = 1.1) => {
  const x = THREE.MathUtils.clamp((t - delay) / dur, 0, 1);
  return 1 - Math.pow(1 - x, 4);
};

function ProductCore({ scroll, intensity }: Pick<HeroSceneProps, "scroll" | "intensity">) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current;
    const k = Math.max(intensity, 0.15);
    const e = intensity > 0 ? enter(t, 0.1, 1.4) : 1;
    if (!group.current || !shell.current || !ring.current) return;
    group.current.scale.setScalar(e * (1 - p * 0.35));
    group.current.rotation.y += dt * 0.18 * k * (1 + p * 3);
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.35 * intensity + p * 0.8,
      0.05,
    );
    shell.current.rotation.z -= dt * 0.12 * k;
    ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.4) * 0.08 * k;
    ring.current.rotation.z += dt * 0.25 * k;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 6]} />
        <meshPhysicalMaterial
          color="#6d5ae6"
          roughness={0.12}
          metalness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[200, 800]}
          envMapIntensity={1.3}
        />
      </mesh>
      <mesh ref={shell} scale={1.32}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[1.85, 0.012, 16, 160]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

type PanelKind = "enterprise" | "consumer" | "responsible";

/** Abstract product-interface glyphs drawn on each floating panel. */
function PanelGlyph({ kind, color }: { kind: PanelKind; color: THREE.Color }) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }), [color]);
  const dim = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#f4efe6", transparent: true, opacity: 0.18 }),
    [],
  );
  if (kind === "enterprise") {
    // Bar chart + header line: analytics platform
    return (
      <group position={[0, 0, 0.04]}>
        <mesh position={[-0.42, 0.33, 0]} material={dim}>
          <planeGeometry args={[0.5, 0.05]} />
        </mesh>
        {[0.18, 0.32, 0.24, 0.46, 0.38].map((h, i) => (
          <mesh key={i} position={[-0.5 + i * 0.25, -0.32 + h / 2, 0]} material={mat}>
            <planeGeometry args={[0.13, h]} />
          </mesh>
        ))}
      </group>
    );
  }
  if (kind === "consumer") {
    // Reading line with highlighted word + mascot dot: the read-along experience
    return (
      <group position={[0, 0, 0.04]}>
        <mesh position={[0.42, 0.24, 0]} material={mat}>
          <circleGeometry args={[0.12, 32]} />
        </mesh>
        {[0.2, 0.02, -0.16].map((y, i) => (
          <mesh key={i} position={[-0.16, y - 0.1, 0]} material={dim}>
            <planeGeometry args={[0.8 - i * 0.12, 0.06]} />
          </mesh>
        ))}
        <mesh position={[-0.28, -0.08, 0.005]} material={mat}>
          <planeGeometry args={[0.22, 0.09]} />
        </mesh>
      </group>
    );
  }
  // Guardrail checklist: responsible decisions
  return (
    <group position={[0, 0, 0.04]}>
      {[0.24, 0.02, -0.2].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh position={[-0.46, 0, 0]} material={i < 2 ? mat : dim}>
            <circleGeometry args={[0.06, 24]} />
          </mesh>
          <mesh position={[0.02, 0, 0]} material={dim}>
            <planeGeometry args={[0.7, 0.05]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Panel({
  kind,
  color,
  base,
  rot,
  delay,
  spread,
  scroll,
  intensity,
}: {
  kind: PanelKind;
  color: THREE.Color;
  base: [number, number, number];
  rot: [number, number, number];
  delay: number;
  spread: [number, number];
  scroll: MutableRefObject<number>;
  intensity: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.current;
    const e = intensity > 0 ? enter(t, delay) : 1;
    ref.current.position.set(
      base[0] + spread[0] * p,
      base[1] + spread[1] * p - (1 - e) * 1.2,
      base[2] - (1 - e) * 2,
    );
    ref.current.scale.setScalar(0.6 + 0.4 * e);
    ref.current.rotation.set(rot[0] + p * 0.4, rot[1] + state.pointer.x * 0.25 * intensity, rot[2]);
  });
  return (
    <group ref={ref}>
      <Float speed={1.4} rotationIntensity={0.15 * intensity} floatIntensity={0.5 * intensity}>
        <RoundedBox args={[1.5, 1.0, 0.06]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color="#1b1b25"
            roughness={0.25}
            metalness={0.4}
            transmission={0}
            clearcoat={0.6}
            transparent
            opacity={0.92}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.5, 1.0]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} />
        </mesh>
        <lineSegments position={[0, 0, 0.033]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.46, 0.96)]} />
          <lineBasicMaterial color={color} transparent opacity={0.55} />
        </lineSegments>
        <PanelGlyph kind={kind} color={color} />
      </Float>
    </group>
  );
}

function Particles({ intensity }: { intensity: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(ph) - 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02 * Math.max(intensity, 0.2);
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.025}
        color="#cfc8ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Keeps the composition clear of the headline on wide screens. */
function Stage({ children }: { children: React.ReactNode }) {
  const { viewport, size } = useThree();
  const wide = size.width / size.height > 1.25;
  return (
    <group position={[wide ? viewport.width * 0.14 : 0, wide ? 0 : -0.6, 0]} scale={wide ? 0.88 : 0.72}>
      {children}
    </group>
  );
}

function CameraRig({ scroll, intensity }: Pick<HeroSceneProps, "scroll" | "intensity">) {
  const { camera } = useThree();
  useFrame((state) => {
    const p = scroll.current;
    const tx = state.pointer.x * 0.6 * intensity;
    const ty = state.pointer.y * 0.35 * intensity + p * 0.6;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.4 + p * 2.4, 0.08);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ scroll, intensity, frameloop, onContextLost }: HeroSceneProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
      }}
      // The canvas is decoration: never focusable, hidden from assistive tech by the wrapper.
      tabIndex={-1}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={1.2} />
      <pointLight position={[-4, -1, 2]} intensity={18} color={VIOLET} />
      <pointLight position={[4, 1, 1]} intensity={14} color={CYAN} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#a594ff" position={[-5, 2, -2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#67e0f0" position={[5, -1, -1]} scale={[5, 3, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#f4efe6" position={[0, 4, 3]} scale={3} />
      </Environment>
      <CameraRig scroll={scroll} intensity={intensity} />
      <Stage>
        <ProductCore scroll={scroll} intensity={intensity} />
        <Panel
          kind="enterprise"
          color={CYAN}
          base={[-2.7, 0.9, -0.6]}
          rot={[0.05, 0.42, -0.04]}
          delay={0.35}
          spread={[-1.6, 0.6]}
          scroll={scroll}
          intensity={intensity}
        />
        <Panel
          kind="consumer"
          color={WARM}
          base={[2.7, 0.55, -0.4]}
          rot={[-0.04, -0.45, 0.05]}
          delay={0.5}
          spread={[1.6, 0.5]}
          scroll={scroll}
          intensity={intensity}
        />
        <Panel
          kind="responsible"
          color={VIOLET}
          base={[0.2, -1.75, 0.4]}
          rot={[-0.35, 0.05, 0]}
          delay={0.65}
          spread={[0, -1.2]}
          scroll={scroll}
          intensity={intensity}
        />
      </Stage>
      <Particles intensity={intensity} />
    </Canvas>
  );
}
