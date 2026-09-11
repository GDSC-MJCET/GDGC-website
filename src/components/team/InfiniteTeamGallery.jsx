import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { loadImage, buildCardCanvas } from "./cardCanvas";

// One plane per member (not a cycling pool of fewer planes than images —
// unnecessary here since we only ever have a handful of GB members).
const DEPTH_RANGE = 70;
const CAMERA_Z = 42;

// Small per-card x/y offset (golden-angle distributed, like the original
// reference) so cards passing through similar depths at the same time don't
// visually stack directly on top of each other — kept tight enough that
// everything still reads as "the same central space", not scattered wide.
const MAX_H_OFFSET = 2.2;
const MAX_V_OFFSET = 1.6;

const FADE = { in: { start: 0.05, end: 0.28 }, out: { start: 0.75, end: 0.95 } };
const BLUR = { in: { start: 0.0, end: 0.15 }, out: { start: 0.85, end: 1.0 }, max: 4.0 };

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function createCardMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 0 },
      blurAmount: { value: 0 },
      scrollForce: { value: 0 },
      time: { value: 0 },
    },
    vertexShader: `
      uniform float scrollForce;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // Gentle curve across the plane, intensity tied to scroll speed —
        // a nod to the reference's "cloth" bend, kept subtle for a card.
        float dist = length(pos.xy);
        pos.z -= dist * dist * scrollForce * 0.2;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      varying vec2 vUv;
      void main() {
        vec4 color;
        if (blurAmount > 0.02) {
          vec2 texel = 1.0 / vec2(textureSize(map, 0));
          vec4 sum = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texel * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              sum += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = sum / total;
        } else {
          color = texture2D(map, vUv);
        }
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
}

function fadeAt(t) {
  if (t < FADE.in.start) return 0;
  if (t <= FADE.in.end) return (t - FADE.in.start) / (FADE.in.end - FADE.in.start);
  if (t < FADE.out.start) return 1;
  if (t <= FADE.out.end) return 1 - (t - FADE.out.start) / (FADE.out.end - FADE.out.start);
  return 0;
}

function blurAt(t) {
  if (t < BLUR.in.start) return BLUR.max;
  if (t <= BLUR.in.end) return BLUR.max * (1 - (t - BLUR.in.start) / (BLUR.in.end - BLUR.in.start));
  if (t < BLUR.out.start) return 0;
  if (t <= BLUR.out.end) return BLUR.max * ((t - BLUR.out.start) / (BLUR.out.end - BLUR.out.start));
  return BLUR.max;
}

function GalleryScene({ members, textures, scrollVelocityRef, autoPlayRef }) {
  const count = members.length;
  const materials = useMemo(() => members.map(() => createCardMaterial()), [members]);
  const meshRefs = useRef([]);
  const planeZ = useRef(members.map((_, i) => (DEPTH_RANGE / count) * i));

  // Golden-angle distributed x/y per card, computed once — separates cards
  // that happen to be at similar depths without scattering them far apart.
  const spatialOffsets = useMemo(
    () =>
      members.map((_, i) => {
        const hAngle = (i * 2.618) % (Math.PI * 2);
        const vAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
        return {
          x: Math.sin(hAngle) * MAX_H_OFFSET,
          y: Math.cos(vAngle) * MAX_V_OFFSET,
        };
      }),
    [members]
  );

  useEffect(() => {
    return () => materials.forEach((m) => m.dispose());
  }, [materials]);

  useFrame((state, delta) => {
    if (autoPlayRef.current) scrollVelocityRef.current += 0.25 * delta;
    scrollVelocityRef.current *= 0.95;

    const time = state.clock.getElapsedTime();
    const velocity = scrollVelocityRef.current;

    for (let i = 0; i < count; i++) {
      let z = planeZ.current[i] + velocity * delta * 8;
      z = ((z % DEPTH_RANGE) + DEPTH_RANGE) % DEPTH_RANGE;
      planeZ.current[i] = z;

      const t = z / DEPTH_RANGE;
      const worldZ = z - DEPTH_RANGE / 2;

      const material = materials[i];
      material.uniforms.opacity.value = clamp(fadeAt(t), 0, 1);
      material.uniforms.blurAmount.value = clamp(blurAt(t), 0, BLUR.max);
      material.uniforms.scrollForce.value = velocity;
      material.uniforms.time.value = time;
      const texture = textures[i];
      if (texture && material.uniforms.map.value !== texture) {
        material.uniforms.map.value = texture;
      }

      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.z = worldZ;
        mesh.position.x = spatialOffsets[i].x;
        mesh.position.y = spatialOffsets[i].y;
      }
    }
  });

  return (
    <>
      {members.map((_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} material={materials[i]}>
          <planeGeometry args={[4.2, 5.6, 24, 24]} />
        </mesh>
      ))}
    </>
  );
}

export default function InfiniteTeamGallery({ members }) {
  const wrapRef = useRef(null);
  const scrollVelocityRef = useRef(0);
  const autoPlayRef = useRef(true);
  const lastInteractionRef = useRef(Date.now());
  const [textures, setTextures] = useState(() => members.map(() => null));

  useEffect(() => {
    let disposed = false;
    members.forEach((member, i) => {
      loadImage(member.image).then((image) => {
        if (disposed) return;
        const canvas = buildCardCanvas(image, member);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        setTextures((prev) => {
          const next = [...prev];
          next[i] = texture;
          return next;
        });
      });
    });
    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const markInteraction = () => {
      autoPlayRef.current = false;
      lastInteractionRef.current = Date.now();
    };

    const handleWheel = (e) => {
      e.preventDefault();
      scrollVelocityRef.current += e.deltaY * 0.01;
      markInteraction();
    };

    const handleKey = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        scrollVelocityRef.current -= 2;
        markInteraction();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        scrollVelocityRef.current += 2;
        markInteraction();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);

    const idleCheck = setInterval(() => {
      if (Date.now() - lastInteractionRef.current > 3000) {
        autoPlayRef.current = true;
      }
    }, 1000);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
      clearInterval(idleCheck);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[500px] w-full cursor-grab sm:h-[600px] md:h-[680px]">
      <Canvas camera={{ position: [0, 0, CAMERA_Z], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <GalleryScene
          members={members}
          textures={textures}
          scrollVelocityRef={scrollVelocityRef}
          autoPlayRef={autoPlayRef}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center mix-blend-exclusion">
        <img src="/logo.svg" alt="" className="h-16 w-auto opacity-90 sm:h-20 md:h-24" />
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
        Scroll or use arrow keys to browse &middot; auto-plays after 3s idle
      </p>
    </div>
  );
}
