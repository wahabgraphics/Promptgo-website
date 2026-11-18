import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

interface BeamConfig {
  left: string;
  duration?: number;
  delay?: number;
  repeatDelay?: number;
  heightClass?: string;
}

const DEFAULT_BEAMS: BeamConfig[] = [
  { left: '5%', duration: 7, repeatDelay: 3, delay: 1, heightClass: 'h-14' },
  { left: '15%', duration: 4, repeatDelay: 5, delay: 3, heightClass: 'h-10' },
  { left: '26%', duration: 6, repeatDelay: 4, delay: 0.5, heightClass: 'h-20' },
  { left: '38%', duration: 5, repeatDelay: 6, delay: 2, heightClass: 'h-8' },
  { left: '50%', duration: 8, repeatDelay: 3, delay: 4, heightClass: 'h-16' },
  { left: '63%', duration: 4.5, repeatDelay: 4, delay: 1.5, heightClass: 'h-12' },
  { left: '75%', duration: 6.5, repeatDelay: 3.5, delay: 2.5, heightClass: 'h-14' },
  { left: '86%', duration: 5.5, repeatDelay: 5, delay: 0, heightClass: 'h-10' },
  { left: '94%', duration: 7.5, repeatDelay: 4, delay: 3.5, heightClass: 'h-16' }
];

interface BackgroundBeamsWithCollisionProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
}

export const BackgroundBeamsWithCollision: React.FC<BackgroundBeamsWithCollisionProps> = ({
  children,
  className = '',
  as = 'div'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const shouldReduceMotion = useReducedMotion();

  const innerContent = (
    <>
      {!shouldReduceMotion &&
        DEFAULT_BEAMS.map((beam, idx) => (
          <CollisionMechanism
            key={`beam-${idx}-${beam.left}`}
            beamOptions={beam}
            containerRef={containerRef}
            parentRef={parentRef}
          />
        ))}

      <div className="relative z-10">{children}</div>

      <div
        ref={containerRef}
        className={`pointer-events-none absolute bottom-0 inset-x-0 w-full h-px ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-blue-500/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-blue-500/25 to-transparent'
        }`}
        aria-hidden="true"
      />
    </>
  );

  if (as === 'section') {
    return (
      <section
        ref={(el) => {
          parentRef.current = el;
        }}
        className={`relative w-full overflow-hidden bg-white ${className}`}
      >
        {innerContent}
      </section>
    );
  }

  return (
    <div
      ref={(el) => {
        parentRef.current = el;
      }}
      className={`relative w-full overflow-hidden bg-white ${className}`}
    >
      {innerContent}
    </div>
  );
};

interface CollisionMechanismProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLElement | null>;
  beamOptions: BeamConfig;
}

const CollisionMechanism: React.FC<CollisionMechanismProps> = ({
  containerRef,
  parentRef,
  beamOptions
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({
    detected: false,
    coordinates: null
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = containerRect.top - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY
            }
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = window.setInterval(checkCollision, 40);
    return () => window.clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      const resetTimer = window.setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 1600);

      const restartTimer = window.setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 1650);

      return () => {
        window.clearTimeout(resetTimer);
        window.clearTimeout(restartTimer);
      };
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: '-200px'
        }}
        variants={{
          animate: {
            translateY: '900px'
          }
        }}
        transition={{
          duration: beamOptions.duration || 6,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0
        }}
        style={{ left: beamOptions.left }}
        className={`pointer-events-none absolute top-0 w-[2px] rounded-full bg-gradient-to-t from-blue-600 via-purple-500 to-transparent ${
          beamOptions.heightClass || 'h-14'
        }`}
        aria-hidden="true"
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

const Explosion: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...props
}) => {
  const spans = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -55 - 10)
  }));

  return (
    <div
      {...props}
      className={`pointer-events-none absolute z-20 h-2 w-2 ${className}`}
      aria-hidden="true"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-12 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0
          }}
          transition={{ duration: Math.random() * 1.1 + 0.5, ease: 'easeOut' }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-500"
        />
      ))}
    </div>
  );
};

export default BackgroundBeamsWithCollision;