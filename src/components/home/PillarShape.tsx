import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { CanvasTexture, Color, RepeatWrapping, type Group } from "three";

// A small glass object for each pillar: frosted spheres, a clear pyramid with a warm glow inside, and a
// translucent ring. Each lives in its own little canvas, turns slowly, and stops rendering while off screen.
// Lighting comes from a studio environment built from light panels (nothing downloaded).

export type ShapeKind = "cluster" | "pyramid" | "ring";

// sphere positions for the "cluster" (a loose molecule)
const BLOBS: [number, number, number, number][] = [
  [0, 0, 0, 0.6],
  [0.7, 0.38, 0.12, 0.44],
  [-0.64, 0.42, -0.1, 0.42],
  [0.34, -0.64, 0.22, 0.4],
  [-0.42, -0.54, 0.34, 0.36],
  [0.1, 0.76, -0.42, 0.34],
  [0.8, -0.3, -0.38, 0.3],
  [-0.84, -0.12, 0.42, 0.28],
];

// the glass itself is a pale tint of the pillar colour; the full colour comes from light passing through it
const tint = (hex: string, toWhite: number) => "#" + new Color(hex).lerp(new Color("#ffffff"), toWhite).getHexString();

// A soft glow of the pillar colour behind the object, so the glass has something to refract and catch.
function Backdrop({ color }: { color: string }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(255,255,255,0.95)");
    grad.addColorStop(0.25, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new CanvasTexture(c);
  }, [color]);
  return (
    <mesh position={[0.35, 0.25, -1.6]}>
      <planeGeometry args={[4.2, 4.2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} opacity={0.85} />
    </mesh>
  );
}

// Grain for the gritty, sandblasted surface: a tileable noise texture used as a bump and roughness map.
let grainTexture: CanvasTexture | null = null;
function grain() {
  if (grainTexture) return grainTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 60 + Math.random() * 195;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  grainTexture = new CanvasTexture(c);
  grainTexture.wrapS = grainTexture.wrapT = RepeatWrapping;
  grainTexture.repeat.set(2, 2);
  return grainTexture;
}

// Matte, gritty material: like sandblasted glass or stone. Light only partly passes through, the surface is
// rough and grainy, and there is no clearcoat or rainbow sheen, so nothing looks shiny or metallic.
function Glass({ color, kind }: { color: string; roughness?: number; kind: ShapeKind }) {
  const tex = grain();
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={0}
      roughness={0.9}
      roughnessMap={tex}
      bumpMap={tex}
      bumpScale={kind === "cluster" ? 0.14 : 0.2}
      transmission={0.3}
      thickness={1.2}
      ior={1.4}
      attenuationColor={color}
      attenuationDistance={1.2}
      sheen={0.25}
      sheenRoughness={0.9}
      sheenColor={tint(color, 0.5)}
      specularIntensity={0.25}
      envMapIntensity={0.75}
    />
  );
}

function Shape({ kind, color, running }: { kind: ShapeKind; color: string; running: boolean }) {
  const group = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !running) return;
    g.rotation.y += dt * 0.3;
    g.rotation.x = Math.sin(performance.now() / 2600) * 0.15;
    invalidate();
  });
  return (
    <group ref={group}>
      {kind === "cluster" &&
        BLOBS.map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 48, 48]} />
            <Glass color={color} roughness={0.28} kind={kind} />
          </mesh>
        ))}
      {kind === "pyramid" && (
        <group rotation={[0.18, 0.5, 0]} position={[0, -0.1, 0]}>
          {/* square-based pyramid, turned so two faces and the edges between them catch the light */}
          <mesh>
            <coneGeometry args={[1.15, 1.7, 4, 1]} />
            <Glass color={color} roughness={0.06} kind={kind} />
          </mesh>
          {/* warm light glowing inside the glass */}
          <pointLight position={[0, 0, 0]} intensity={4} distance={2.5} color="#ffb199" />
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#ffd2b8" transparent opacity={0.55} />
          </mesh>
        </group>
      )}
      {kind === "ring" && (
        <mesh rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[0.95, 0.34, 64, 160]} />
          <Glass color={color} roughness={0.14} kind={kind} />
        </mesh>
      )}
    </group>
  );
}

export default function PillarShape({ kind, color }: { kind: ShapeKind; color: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 4.4], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <directionalLight position={[-4, -1, -3]} intensity={2} color={color} />
        <Environment resolution={128}>
          {/* a soft studio: a big top light, two side strips and a coloured fill */}
          <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.4} position={[-4, 0.5, 1]} scale={[1, 5, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.4} position={[4, 0.5, 1]} scale={[1, 5, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="ring" intensity={2} color={color} position={[0, -2, -3]} scale={3} />
        </Environment>
        <Backdrop color={color} />
        <Shape kind={kind} color={color} running={onScreen && !reduce} />
        <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={4} blur={2.6} far={2.5} color={color} frames={1} />
      </Canvas>
    </div>
  );
}
