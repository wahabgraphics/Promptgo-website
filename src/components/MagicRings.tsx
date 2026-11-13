import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  motion?: 'pulse' | 'rotate' | 'wave';
  ringCount?: number;
  speed?: number;
  lineThickness?: number;
  glow?: number;
  hoverScale?: number;
  clickBurst?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  style?: React.CSSProperties;
}

interface Burst {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
  }[];
}

export const MagicRings: React.FC<MagicRingsProps> = ({
  color = '#A855F7',
  colorTwo = '#6366F1',
  motion = 'pulse',
  ringCount = 6,
  speed = 1,
  lineThickness = 2,
  glow = 1,
  hoverScale = 1.2,
  clickBurst = true,
  theme = 'light',
  className = '',
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scaleRef = useRef(1);
  const burstsRef = useRef<Burst[]>([]);

  // Convert hex to rgb
  const hexToRgb = (hex: string): [number, number, number] => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mousePos.current.targetX = x * 0.15;
    mousePos.current.targetY = y * 0.15;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickBurst || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const particles = [];
    const pCount = 14;
    for (let i = 0; i < pCount; i++) {
      const angle = (Math.PI * 2 * i) / pCount + (Math.random() - 0.5) * 0.5;
      const v = 2 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        size: 2 + Math.random() * 2.5,
        alpha: 1,
        color: Math.random() > 0.5 ? color : colorTwo
      });
    }

    burstsRef.current.push({
      x,
      y,
      radius: 10,
      maxRadius: 180 + Math.random() * 60,
      opacity: 1,
      particles
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const rgbOne = hexToRgb(color);
    const rgbTwo = hexToRgb(colorTwo);

    const render = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      // Smooth hover scale
      const targetScale = isHovered ? hoverScale : 1;
      scaleRef.current += (targetScale - scaleRef.current) * 0.08;

      const centerX = width / 2 + mousePos.current.x;
      const centerY = height / 2 + mousePos.current.y;
      const minDimension = Math.min(width, height);
      const baseRadiusStep = (minDimension * 0.42) / ringCount;

      time += 0.02 * speed;

      // Soft ambient background aura
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        minDimension * 0.55
      );
      ambientGrad.addColorStop(0, `rgba(${rgbOne[0]}, ${rgbOne[1]}, ${rgbOne[2]}, ${theme === 'dark' ? 0.12 : 0.08})`);
      ambientGrad.addColorStop(0.5, `rgba(${rgbTwo[0]}, ${rgbTwo[1]}, ${rgbTwo[2]}, ${theme === 'dark' ? 0.05 : 0.04})`);
      ambientGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, minDimension * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // Draw Rings
      for (let i = 0; i < ringCount; i++) {
        const ringIndex = i + 1;
        const progress = i / Math.max(ringCount - 1, 1);

        // Interpolate colors
        const r = Math.round(rgbOne[0] + (rgbTwo[0] - rgbOne[0]) * progress);
        const g = Math.round(rgbOne[1] + (rgbTwo[1] - rgbOne[1]) * progress);
        const b = Math.round(rgbOne[2] + (rgbTwo[2] - rgbOne[2]) * progress);

        // Motion dynamics
        let radiusOffset = 0;
        let waveDistortion = 0;

        if (motion === 'pulse') {
          radiusOffset = Math.sin(time + i * 0.6) * (8 + i * 2.5);
        } else if (motion === 'wave') {
          radiusOffset = Math.sin(time * 1.5 - i * 0.8) * 12;
        } else if (motion === 'rotate') {
          radiusOffset = Math.cos(time + i * 0.4) * 6;
        }

        const currentRadius = Math.max(
          12,
          (ringIndex * baseRadiusStep + radiusOffset) * scaleRef.current
        );

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);

        // Glow settings
        ctx.lineWidth = lineThickness;
        ctx.shadowBlur = glow * (12 + i * 2);
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.45 + 0.35 * Math.sin(time + i)})`;

        // Slight dashed styling for inner/outer accent rings
        if (i % 2 === 1) {
          ctx.setLineDash([6, 8]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.stroke();

        // Little sparkling orbital beads on rings
        const beadAngle = time * (0.8 - i * 0.08) * (i % 2 === 0 ? 1 : -1) + i;
        const beadX = centerX + Math.cos(beadAngle) * currentRadius;
        const beadY = centerY + Math.sin(beadAngle) * currentRadius;

        ctx.beginPath();
        ctx.arc(beadX, beadY, lineThickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx.shadowBlur = glow * 18;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.fill();

        ctx.restore();
      }

      // Process and render click bursts
      for (let bIndex = burstsRef.current.length - 1; bIndex >= 0; bIndex--) {
        const burst = burstsRef.current[bIndex];
        burst.radius += (burst.maxRadius - burst.radius) * 0.08;
        burst.opacity -= 0.022;

        if (burst.opacity <= 0) {
          burstsRef.current.splice(bIndex, 1);
          continue;
        }

        // Ripple ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = `rgba(${rgbOne[0]}, ${rgbOne[1]}, ${rgbOne[2]}, ${burst.opacity * 0.8})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.restore();

        // Burst particles
        burst.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.alpha -= 0.025;

          if (p.alpha > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.restore();
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [color, colorTwo, motion, ringCount, speed, lineThickness, glow, hoverScale, clickBurst, theme, isHovered]);

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        mousePos.current.targetX = 0;
        mousePos.current.targetY = 0;
      }}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-auto ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default MagicRings;
