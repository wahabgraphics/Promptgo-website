import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Crown, Lock, MessageCircle, ExternalLink } from 'lucide-react';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { BackgroundBeamsWithCollision } from './ui/background-beams-with-collision';

const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Va7MRrl7YScwkslIqS0F';

interface PremiumPicturesShowcaseProps {
  prompts: PromptItem[];
  onSelectPrompt: (prompt: PromptItem) => void;
}

export const PremiumPicturesShowcase: React.FC<PremiumPicturesShowcaseProps> = ({
  prompts,
  onSelectPrompt
}) => {
  const { isPremium } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [hoveredGroup, setHoveredGroup] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const premiumThree = useMemo(() => {
    const onlyPremium = prompts
      .filter((p) => p.is_premium)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (onlyPremium.length === 0) return [];

    const cards: PromptItem[] = [];
    for (let i = 0; i < 3; i++) {
      cards.push(onlyPremium[i % onlyPremium.length]);
    }
    return cards;
  }, [prompts]);

  if (premiumThree.length === 0) {
    return null;
  }

  const cardConfigs = [
    {
      rest: { rotate: -8, x: 24, y: 10, scale: 0.96 },
      fan: { rotate: -14, x: -18, y: -4, scale: 1.02 },
      zIndex: 'z-10'
    },
    {
      rest: { rotate: 0, x: 0, y: -8, scale: 1.02 },
      fan: { rotate: 0, x: 0, y: -20, scale: 1.08 },
      zIndex: 'z-20'
    },
    {
      rest: { rotate: 8, x: -24, y: 10, scale: 0.96 },
      fan: { rotate: 14, x: 18, y: -4, scale: 1.02 },
      zIndex: 'z-10'
    }
  ];

  return (
    <BackgroundBeamsWithCollision
      as="section"
      className="w-full mb-0 px-4 sm:px-6 pt-[100px] pb-[100px] bg-white"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          onMouseEnter={() => setHoveredGroup(true)}
          onMouseLeave={() => setHoveredGroup(false)}
          className="relative flex items-center justify-center h-56 sm:h-72 mb-10 select-none"
        >
          {premiumThree.map((prompt, index) => {
            const cfg = cardConfigs[index];
            const imgKey = `${prompt.id}-${index}`;
            const hasFailed = failedImages[imgKey];

            return (
              <motion.button
                key={imgKey}
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                title={prompt.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.92 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : hoveredGroup
                    ? { opacity: 1, ...cfg.fan }
                    : { opacity: 1, ...cfg.rest }
                }
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -26, scale: 1.09, rotate: 0, zIndex: 30 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                className={`group relative ${cfg.zIndex} w-36 h-48 sm:w-48 sm:h-60 md:w-52 md:h-64 rounded-2xl p-1.5 border bg-white border-zinc-200/90 shadow-xl shadow-zinc-900/10 transition-shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]`}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900">
                  {hasFailed || !prompt.thumbnail_url ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center p-2 text-white">
                      <Crown className="w-5 h-5 mb-1 text-sky-200" />
                      <span className="text-[10px] font-bold line-clamp-2">{prompt.title}</span>
                    </div>
                  ) : (
                    <img
                      src={prompt.thumbnail_url}
                      alt={prompt.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [imgKey]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-extrabold tracking-wide shadow">
                    {isPremium ? <Crown className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                    <span>VIP</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-left">
                    <p className="text-[11px] font-bold text-white line-clamp-1">
                      {prompt.title}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-xl text-balance text-zinc-900">
          Join our WhatsApp channel and receive new prompts daily.
        </h2>

        <p className="mt-2.5 text-sm sm:text-[15px] max-w-md leading-relaxed text-zinc-600">
          Your first 3 prompts are on us, forever. Join Premium to unlock unlimited viral prompts.
        </p>

        <div className="mt-6 flex items-center justify-center">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default PremiumPicturesShowcase;