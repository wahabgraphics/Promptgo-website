import React, { useMemo } from 'react';
import { PromptItem } from '../types';
import { PromptCard } from './PromptCard';

interface PromptMarqueeStripProps {
  prompts: PromptItem[];
  onSelect: (prompt: PromptItem) => void;
  onUnlockClick: () => void;
}

export const PromptMarqueeStrip: React.FC<PromptMarqueeStripProps> = ({
  prompts,
  onSelect,
  onUnlockClick
}) => {
  const baseTrack = useMemo(() => {
    if (prompts.length === 0) return [];
    const minCards = 6;
    const repeatCount = Math.max(1, Math.ceil(minCards / prompts.length));
    const list: PromptItem[] = [];
    for (let i = 0; i < repeatCount; i++) {
      list.push(...prompts);
    }
    return list;
  }, [prompts]);

  if (baseTrack.length === 0) return null;

  const durationSeconds = Math.max(28, baseTrack.length * 6);
  const fullLoopItems = [...baseTrack, ...baseTrack];

  return (
    <section
      aria-label="Featured Prompts Carousel"
      className="relative z-20 -mt-48 sm:-mt-60 mb-10 w-full overflow-hidden marquee-container"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 z-30 bg-gradient-to-r from-black/15 dark:from-[#0b0f19]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 z-30 bg-gradient-to-l from-black/15 dark:from-[#0b0f19]/60 to-transparent" />

      <div
        className="animate-marquee-rtl py-3"
        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        {fullLoopItems.map((prompt, index) => (
          <div
            key={`${prompt.id}-${index}`}
            className="flex-none w-[280px] sm:w-[320px] mr-4 sm:mr-5 flex"
          >
            <div className="w-full flex flex-col [&>div]:h-full [&>div]:shadow-xl [&>div]:shadow-blue-950/15">
              <PromptCard
                prompt={prompt}
                onSelect={onSelect}
                onUnlockClick={onUnlockClick}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};