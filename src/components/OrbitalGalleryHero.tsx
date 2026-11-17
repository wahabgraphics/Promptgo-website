import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { PromptItem } from '../types';

interface OrbitalGalleryHeroProps {
  prompts?: PromptItem[];
  onSelectPrompt?: (prompt: PromptItem) => void;
  children: React.ReactNode;
}

const MIN_ORBIT_SLOTS = 8;
const MAX_ORBIT_SLOTS = 12;

export const OrbitalGalleryHero: React.FC<OrbitalGalleryHeroProps> = ({
  prompts = [],
  onSelectPrompt,
  children
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const orbitItems = useMemo(() => {
    if (!prompts || prompts.length === 0) return [];

    const sortedNewest = [...prompts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const uniqueSource = sortedNewest.slice(0, MAX_ORBIT_SLOTS);
    const targetCount = Math.min(
      MAX_ORBIT_SLOTS,
      Math.max(uniqueSource.length, MIN_ORBIT_SLOTS)
    );

    const result: PromptItem[] = [];
    for (let i = 0; i < targetCount; i++) {
      result.push(uniqueSource[i % uniqueSource.length]);
    }
    return result;
  }, [prompts]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#2563eb] via-[#13265c] to-[#080d1a] min-h-[580px] sm:min-h-[680px] flex items-center justify-center py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.28) 0%, rgba(15, 23, 42, 0.55) 48%, rgba(8, 13, 26, 0.92) 85%)'
        }}
        aria-hidden="true"
      />

      {/* Yahan Circular Lines Ki Visibility Barha Di Gayi Hai */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center z-0"
        aria-hidden="true"
      >
        <div className="w-[460px] h-[460px] sm:w-[700px] sm:h-[700px] lg:w-[880px] lg:h-[880px] rounded-full border border-white/25" />
        <div className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] lg:w-[640px] lg:h-[640px] rounded-full border border-blue-300/30 border-dashed" />
        <div className="absolute w-[600px] h-[600px] sm:w-[920px] sm:h-[920px] lg:w-[1140px] lg:h-[1140px] rounded-full border border-white/15" />
      </div>

      {orbitItems.length > 0 && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center z-0"
          aria-hidden="true"
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    repeat: Infinity,
                    duration: 54,
                    ease: 'linear'
                  }
            }
            className="relative w-[520px] h-[520px] sm:w-[760px] sm:h-[760px] lg:w-[960px] lg:h-[960px]"
          >
            {orbitItems.map((item, index) => {
              const angleDeg = (360 / orbitItems.length) * index;
              const angleRad = (angleDeg * Math.PI) / 180;
              const leftPct = 50 + Math.cos(angleRad) * 46;
              const topPct = 50 + Math.sin(angleRad) * 46;
              const imgKey = `${item.id}-${index}`;
              const hasFailed = failedImages[imgKey];

              return (
                <div
                  key={imgKey}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="absolute pointer-events-auto"
                >
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (onSelectPrompt) {
                        onSelectPrompt(item);
                      }
                    }}
                    title={item.title}
                    animate={shouldReduceMotion ? undefined : { rotate: -360 }}
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            repeat: Infinity,
                            duration: 54,
                            ease: 'linear'
                          }
                    }
                    whileHover={{ scale: 1.08 }}
                    className="group relative w-20 h-24 sm:w-28 sm:h-36 lg:w-32 lg:h-40 rounded-2xl overflow-hidden border border-white/20 bg-slate-900/80 shadow-2xl shadow-blue-950/60 backdrop-blur-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                  >
                    {hasFailed || !item.thumbnail_url ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600/70 to-indigo-900 flex flex-col items-center justify-center p-2 text-center">
                        <Sparkles className="w-5 h-5 text-sky-200 mb-1" />
                        <span className="text-[10px] font-bold text-white/90 line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [imgKey]: true }))
                        }
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                    <div className="absolute bottom-1.5 inset-x-1.5 text-left">
                      <p className="text-[9px] sm:text-[10px] font-bold text-white/95 line-clamp-1">
                        {item.title}
                      </p>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(ellipse 58% 62% at 50% 50%, rgba(15, 29, 72, 0.86) 0%, rgba(15, 29, 72, 0.58) 55%, rgba(8, 13, 26, 0.15) 100%)'
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
};

export default OrbitalGalleryHero;