import React, { useEffect, useRef } from 'react';

export interface LightVortexFunnelProps {
  activeStage?: number;
  primaryColor?: string;
  secondaryColor?: string;
  particleCount?: number;
  className?: string;
}

interface StreamParticle {
  t: number;
  speed: number;
  lane: number;
  size: number;
  alpha: number;
  offsetY: number;
  hueMix: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return [96, 165, 250];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const LightVortexFunnel: React.FC<LightVortexFunnelProps> = ({
  activeStage = 0,
  primaryColor = '#60a5fa',
  secondaryColor = '#c084fc',
  particleCount = 150,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef(activeStage);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    stageRef.current = activeStage;
  }, [activeStage]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [r1, g1, b1] = hexToRgb(primaryColor);
    const [r2, g2, b2] = hexToRgb(secondaryColor);

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;

    const particles: StreamParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      t: (i / particleCount + Math.random() * 0.2) % 1,
      speed: 0.0014 + Math.random() * 0.0022,
      lane: (Math.random() - 0.5) * 2,
      size: 1.1 + Math.random() * 1.9,
      alpha: 0.35 + Math.random() * 0.55,
      offsetY: (Math.random() - 0.5) * 14,
      hueMix: Math.random()
    }));

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y, active: true };
      } else {
        mouseRef.current.active = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let time = 0;

    const getFunnelY = (t: number, lane: number, timeSec: number) => {
      const centerY = height * 0.68;
      const startSpread = height * 0.36;
      const endSpread = height * 0.08;
      const spread = lerp(startSpread, endSpread, Math.pow(t, 0.78));
      const swirl = Math.sin(t * Math.PI * 3.2 - timeSec * 1.5 + lane * 2.1) * (12 * (1 - t * 0.45));
      return centerY + lane * spread + swirl;
    };

    const render = () => {
      time += prefersReducedMotion ? 0 : 0.016;
      ctx.clearRect(0, 0, width, height);

      if (width === 0 || height === 0) {
        animationFrameId = window.requestAnimationFrame(render);
        return;
      }

      const glowGrad = ctx.createRadialGradient(
        width * 0.56,
        height * 0.68,
        12,
        width * 0.56,
        height * 0.68,
        Math.max(width * 0.5, 320)
      );
      glowGrad.addColorStop(0, `rgba(${r2}, ${g2}, ${b2}, 0.24)`);
      glowGrad.addColorStop(0.45, `rgba(${r1}, ${g1}, ${b1}, 0.16)`);
      glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      const laneCount = 11;
      for (let i = 0; i < laneCount; i++) {
        const lane = -1 + (i / (laneCount - 1)) * 2;
        ctx.beginPath();
        const steps = 40;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const x = t * width;
          const y = getFunnelY(t, lane, time);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const edgeFade = 1 - Math.abs(lane) * 0.4;
        ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${0.22 * edgeFade})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      const stagePositions = [0.16, 0.39, 0.62, 0.85];
      stagePositions.forEach((pos, idx) => {
        const sx = pos * width;
        const isActive = stageRef.current === idx;
        ctx.beginPath();
        ctx.moveTo(sx, height * 0.14);
        ctx.lineTo(sx, height * 0.94);
        ctx.strokeStyle = isActive
          ? `rgba(${r2}, ${g2}, ${b2}, 0.28)`
          : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = isActive ? 1.5 : 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.t += p.speed;
          if (p.t > 1) {
            p.t = 0;
            p.lane = (Math.random() - 0.5) * 2;
          }
        }

        let px = p.t * width;
        let py = getFunnelY(p.t, p.lane, time) + p.offsetY * (1 - p.t * 0.5);

        if (mouseRef.current.active) {
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0.1) {
            const force = (1 - dist / 140) * 18;
            px += (dx / dist) * force;
            py += (dy / dist) * force;
          }
        }

        const r = Math.round(lerp(r1, r2, p.hueMix * 0.65 + p.t * 0.35));
        const g = Math.round(lerp(g1, g2, p.hueMix * 0.65 + p.t * 0.35));
        const b = Math.round(lerp(b1, b2, p.hueMix * 0.65 + p.t * 0.35));

        const edgeAlpha = Math.sin(p.t * Math.PI);
        const finalAlpha = Math.max(0.05, p.alpha * edgeAlpha);

        const trailLen = 14 + p.speed * 4200;
        const trailGrad = ctx.createLinearGradient(px - trailLen, py, px, py);
        trailGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        trailGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${finalAlpha * 0.65})`);

        ctx.beginPath();
        ctx.moveTo(px - trailLen, py);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = p.size * 0.9;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, finalAlpha + 0.15)})`;
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [primaryColor, secondaryColor, particleCount]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default LightVortexFunnel;