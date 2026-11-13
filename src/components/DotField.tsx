import React, { useEffect, useRef } from 'react';

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  gradientFrom?: string;
  gradientTo?: string;
  cursorRadius?: number;
  bulgeStrength?: number;
  glowRadius?: number;
  lightMode?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
  if (Number.isNaN(num)) return [255, 255, 255];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const DotField: React.FC<DotFieldProps> = ({
  dotRadius = 1.5,
  dotSpacing = 14,
  gradientFrom = '#2563eb',
  gradientTo = '#FF9FFC',
  cursorRadius = 240,
  bulgeStrength = 0.6,
  glowRadius = 160,
  lightMode = false,
  className = '',
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false
  });
  const smoothMouseRef = useRef<{ x: number; y: number }>({
    x: -9999,
    y: -9999
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [r1, g1, b1] = hexToRgb(gradientFrom);
    const [r2, g2, b2] = hexToRgb(gradientTo);

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId = 0;

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

      if (
        x >= -cursorRadius &&
        x <= rect.width + cursorRadius &&
        y >= -cursorRadius &&
        y <= rect.height + cursorRadius
      ) {
        if (!mouseRef.current.active) {
          smoothMouseRef.current.x = x;
          smoothMouseRef.current.y = y;
        }
        mouseRef.current = { x, y, active: true };
      } else {
        mouseRef.current.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      if (mouseRef.current.active) {
        smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, 0.16);
        smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, 0.16);
      }

      const mx = smoothMouseRef.current.x;
      const my = smoothMouseRef.current.y;
      const isMouseActive = mouseRef.current.active;

      const spacing = Math.max(6, dotSpacing);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let row = 0; row < rows; row++) {
        const baseY = offsetY + row * spacing;
        const tY = height > 0 ? baseY / height : 0;

        for (let col = 0; col < cols; col++) {
          const baseX = offsetX + col * spacing;
          const tX = width > 0 ? baseX / width : 0;

          // Subtle ambient wave
          const wave = Math.sin(col * 0.25 + time) * Math.cos(row * 0.25 + time * 0.8);
          let drawX = baseX;
          let drawY = baseY;
          let radius = dotRadius + wave * 0.15;

          const gradT = Math.min(1, Math.max(0, (tX * 0.65 + tY * 0.35)));
          let r = Math.round(lerp(r1, r2, gradT));
          let g = Math.round(lerp(g1, g2, gradT));
          let b = Math.round(lerp(b1, b2, gradT));
          let alpha = lightMode ? 0.22 : 0.35;

          if (isMouseActive && cursorRadius > 0) {
            const dx = baseX - mx;
            const dy = baseY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < cursorRadius && dist > 0.001) {
              const norm = 1 - dist / cursorRadius;
              const ease = norm * norm;
              const push = ease * bulgeStrength * spacing * 1.4;
              drawX += (dx / dist) * push;
              drawY += (dy / dist) * push;
              radius += ease * dotRadius * (1 + bulgeStrength);
            }

            if (glowRadius > 0 && dist < glowRadius) {
              const glowNorm = 1 - dist / glowRadius;
              r = Math.round(lerp(r, r2, glowNorm * 0.75));
              g = Math.round(lerp(g, g2, glowNorm * 0.75));
              b = Math.round(lerp(b, b2, glowNorm * 0.75));
              alpha = Math.min(0.95, alpha + glowNorm * 0.55);
            }
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [dotRadius, dotSpacing, gradientFrom, gradientTo, cursorRadius, bulgeStrength, glowRadius, lightMode]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default DotField;
