import React, { useEffect, useRef } from 'react';

const GridTrail = ({ palette = ['#ea4336', '#2bdde1', '#ff00a2', '#ffffff'] }) => {
  const canvasRef = useRef(null);
  const paletteRef = useRef(palette);

  // Update ref when palette changes without resetting effect
  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);
  
  const G = 35; // Grid size
  const LIFE = 800; // Trail life in ms
  const SPREAD = 2; // How many tiles to spawn around cursor

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let tiles = {};
    let keys = [];
    let isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile = window.innerWidth < 768;
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnAround = (cx, cy) => {
      const now = Date.now();
      const currentPalette = paletteRef.current;
      
      for (let dx = -SPREAD; dx <= SPREAD; dx++) {
        for (let dy = -SPREAD; dy <= SPREAD; dy++) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > SPREAD) continue;
          
          const prob = 0.8 - dist * 0.2;
          if (Math.random() > prob) continue;
          
          const gx = cx + dx;
          const gy = cy + dy;
          if (gx < 0 || gy < 0) continue;
          
          const key = `${gx},${gy}`;
          const szChoices = [1, 1, 2];
          const sz = szChoices[Math.floor(Math.random() * szChoices.length)];
          const delay = dist * 40 + Math.random() * 30;
          const baseCol = currentPalette[Math.floor(Math.random() * currentPalette.length)];
          
          let col = baseCol;
          if (baseCol.startsWith('#')) {
            const hex = baseCol.substring(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            col = `rgba(${r}, ${g}, ${b}, 0.25)`;
          }

          if (!tiles[key]) keys.push(key);
          tiles[key] = { gx, gy, col, born: now + delay, sz };
        }
      }
      
      if (keys.length > 300) {
        const dead = keys.splice(0, keys.length - 300);
        dead.forEach(k => delete tiles[k]);
      }
    };

    let animationFrameId;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      const alive = [];
      
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const t = tiles[k];
        if (!t) continue;
        
        const age = now - t.born;
        if (age < 0) {
          alive.push(k);
          continue;
        }
        if (age >= LIFE) {
          delete tiles[k];
          continue;
        }
        
        alive.push(k);
        const prog = age / LIFE;
        let op = prog < 0.2 ? prog / 0.2 : 1 - (prog - 0.2) / 0.8;
        
        ctx.globalAlpha = Math.max(0, op) * 0.8;
        ctx.fillStyle = t.col;
        const px = t.gx * G;
        const py = t.gy * G;
        const size = G * t.sz - 2;
        
        ctx.fillRect(px, py, size, size);
        ctx.shadowBlur = 15;
        ctx.shadowColor = t.col;
      }
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      keys = alive;
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    let lastGX = -99, lastGY = -99;
    const handleMouseMove = (e) => {
      if (isMobile) return;
      
      const gx = Math.floor(e.clientX / G);
      const gy = Math.floor(e.clientY / G);
      
      if (gx === lastGX && gy === lastGY) return;
      lastGX = gx;
      lastGY = gy;
      spawnAround(gx, gy);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Only run once on mount

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 50, // Above rooms, below nav
        mixBlendMode: 'screen',
        opacity: 0.8,
      }}
    />
  );
};

export default GridTrail;
