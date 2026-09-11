import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadImage, buildCardCanvas } from "./cardCanvas";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

// Normalize to (-PI, PI] so angular distance-from-center is always the
// shortest way around the circle.
function normalizeAngle(angle) {
  let a = angle % (Math.PI * 2);
  if (a > Math.PI) a -= Math.PI * 2;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
}

export default function TeamCarousel({ members }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || members.length === 0) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 34;

    const gallery = new THREE.Group();
    scene.add(gallery);

    const count = members.length;
    // Each panel gets an equal angular slice of the circle, but its own
    // visible arc is only a fraction of that slice — real gaps between
    // cards instead of one merged wraparound band.
    const slice = (Math.PI * 2) / count;
    const arcFraction = 0.46;
    const thetaLength = slice * arcFraction;
    const radius = 12;
    // thetaStart centers the arc on local angle 0, so rotation.y = index *
    // slice puts the panel's midpoint (not its leading edge) at that angle.
    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      8,
      32,
      1,
      true,
      -thetaLength / 2,
      thetaLength
    );

    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let hostVisible = true;
    let documentVisible = !document.hidden;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Placeholder textures (card background + name/role, no photo yet) so
    // panels/materials/meshes can be built synchronously. Crucially these
    // are already CARD_W x CARD_H — swapping in the photo later reuses the
    // same canvas dimensions, avoiding a WebGL texture-resize error.
    const textures = members.map((member) => {
      const texture = new THREE.CanvasTexture(buildCardCanvas(null, member));
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      return texture;
    });

    members.forEach((member, i) => {
      loadImage(member.image).then((image) => {
        if (disposed) return;
        const cardCanvas = buildCardCanvas(image, member);
        textures[i].image = cardCanvas;
        textures[i].needsUpdate = true;
        render();
      });
    });

    const materials = textures.map(
      (texture) =>
        new THREE.MeshBasicMaterial({
          map: texture,
          opacity: 1,
          side: THREE.DoubleSide,
          toneMapped: false,
          transparent: true,
        })
    );

    // One ring of panels (no vertical stacking — this is a horizontal
    // carousel), evenly spaced by actual member count.
    const panels = materials.map((material, index) => {
      const panel = new THREE.Mesh(geometry, material);
      panel.rotation.y = index * slice;
      panel.userData.index = index;
      gallery.add(panel);
      return panel;
    });

    // desiredRotation accumulates freely (not wrapped) so scrolling through
    // several full turns feels continuous instead of snapping backwards.
    let desiredRotation = -currentIndexRef.current * slice;
    if (isReducedMotion) gallery.rotation.y = desiredRotation;

    // Only the panel facing the camera should read as sharp/prominent —
    // everything else dims by angular distance from dead-center, so side
    // cards feel like peeking neighbors rather than equally-prominent tiles.
    const updatePanelAppearance = () => {
      panels.forEach((panel) => {
        const absoluteAngle = normalizeAngle(panel.rotation.y + gallery.rotation.y);
        const distance = Math.abs(absoluteAngle);
        const focus = clamp(1 - distance / (slice * 2.2), 0.12, 1);
        panel.material.opacity = focus;
        panel.material.color.setScalar(0.3 + focus * 0.7);
      });
    };

    const render = () => {
      updatePanelAppearance();
      renderer.render(scene, camera);
    };

    const tick = (time) => {
      if (disposed || !hostVisible || !documentVisible) {
        frame = 0;
        previousTime = 0;
        return;
      }
      if (previousTime) {
        const dt = Math.min((time - previousTime) / 1000, 0.05);
        gallery.rotation.y += (desiredRotation - gallery.rotation.y) * clamp(dt * 10, 0, 1);
      }
      previousTime = time;
      render();
      const closeEnough = Math.abs(desiredRotation - gallery.rotation.y) < 0.0005;
      if (!closeEnough) {
        frame = window.requestAnimationFrame(tick);
      } else {
        gallery.rotation.y = desiredRotation;
        render();
        frame = 0;
        previousTime = 0;
      }
    };

    const start = () => {
      if (!frame && hostVisible && documentVisible) frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };

    const setActiveFromRotation = (rotation) => {
      const rawIndex = Math.round(-rotation / slice);
      const wrapped = ((rawIndex % count) + count) % count;
      currentIndexRef.current = wrapped;
      return rawIndex;
    };

    const goTo = (rawIndex) => {
      desiredRotation = -rawIndex * slice;
      setActiveFromRotation(desiredRotation);
      if (isReducedMotion) {
        gallery.rotation.y = desiredRotation;
        render();
      } else {
        start();
      }
    };

    // Wheel/trackpad scroll spins the cylinder directly — deliberately high
    // sensitivity so it feels immediate and physical, not a subtle nudge.
    let snapTimeout = null;
    const WHEEL_SENSITIVITY = 0.006;
    const SNAP_DELAY = 140;

    const scheduleSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        const nearestRawIndex = Math.round(-desiredRotation / slice);
        goTo(nearestRawIndex);
      }, SNAP_DELAY);
    };

    const handleWheel = (event) => {
      event.preventDefault();
      desiredRotation -= event.deltaY * WHEEL_SENSITIVITY;
      setActiveFromRotation(desiredRotation);
      start();
      scheduleSnap();
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handleClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(panels)[0];
      if (hit) {
        const index = hit.object.userData.index;
        if (index !== currentIndexRef.current) {
          // Step by the shortest direction (not necessarily forward) so
          // clicking a neighbor never spins the long way around.
          const currentRaw = Math.round(-desiredRotation / slice);
          const currentWrapped = ((currentRaw % count) + count) % count;
          let diff = index - currentWrapped;
          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;
          goTo(currentRaw + diff);
        }
      }
    };
    canvas.addEventListener("click", handleClick);

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      hostVisible = entry?.isIntersecting ?? true;
      if (hostVisible) start();
      else stop();
    });
    const handleVisibility = () => {
      documentVisible = !document.hidden;
      if (documentVisible) start();
      else stop();
    };

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);
    resize();
    render();

    return () => {
      disposed = true;
      stop();
      if (snapTimeout) clearTimeout(snapTimeout);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("click", handleClick);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      gallery.clear();
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-2">
      <div ref={hostRef} className="relative h-[420px] w-full cursor-grab sm:h-[500px] md:h-[600px]">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      </div>
    </div>
  );
}
