import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface FreePromoSectionProps {
  onOpenSubscribe: () => void;
  onExploreFree?: () => void;
}

export const FreePromoSection: React.FC<FreePromoSectionProps> = ({
  onOpenSubscribe,
  onExploreFree
}) => {
  const { currentUser, isPremium } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // Yahan function update kiya gaya hai
  const handleCtaClick = () => {
    window.open('https://whatsapp.com/channel/0029Va7MRrl7YScwkslIqS0F', '_blank');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mb-8">
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-colors ${
          isDark
            ? 'bg-[#111827] border-white/10 shadow-xl shadow-black/30'
            : 'bg-white border-slate-200/80 shadow-[0_6px_30px_rgba(15,23,42,0.06)]'
        }`}
      >
        {/* Top-Left Soft Organic Wave Backdrop */}
        <svg
          className="pointer-events-none select-none absolute -top-2 -left-2 w-[55%] sm:w-[42%] h-[85%] z-0"
          viewBox="0 0 500 360"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 0H390C360 55 315 72 285 112C248 162 272 228 212 268C155 306 72 294 0 345V0Z"
            fill={isDark ? 'rgba(37, 99, 235, 0.14)' : '#eef4ff'}
          />
          <path
            d="M0 0H285C250 48 195 62 175 115C154 170 175 215 115 248C68 274 28 265 0 302V0Z"
            fill={isDark ? 'rgba(59, 130, 246, 0.10)' : '#e4efff'}
          />
        </svg>

        {/* Bottom-Right Soft Organic Wave Backdrop */}
        <svg
          className="pointer-events-none select-none absolute -bottom-2 -right-2 w-[60%] sm:w-[46%] h-[88%] z-0"
          viewBox="0 0 520 360"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M520 360H120C165 305 225 300 265 248C310 190 290 115 362 72C418 38 475 35 520 0V360Z"
            fill={isDark ? 'rgba(37, 99, 235, 0.14)' : '#eef4ff'}
          />
          <path
            d="M520 360H225C265 318 320 310 352 258C388 200 375 145 432 108C468 85 495 82 520 55V360Z"
            fill={isDark ? 'rgba(59, 130, 246, 0.10)' : '#e4efff'}
          />
        </svg>

        {/* Centered Foreground Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-11 sm:py-14">
          {/* Flat Minimalist Meditating Illustration */}
          <div className="mb-5 w-48 sm:w-56">
            <svg
              viewBox="0 0 280 155"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
              role="img"
              aria-label="Calm creator meditating beside books and weights"
            >
              {/* Subtle floating sparkles */}
              <circle cx="88" cy="40" r="1.4" fill={isDark ? '#64748b' : '#cbd5e1'} />
              <circle cx="96" cy="26" r="1.1" fill={isDark ? '#64748b' : '#cbd5e1'} />
              <circle cx="190" cy="34" r="1.4" fill={isDark ? '#64748b' : '#cbd5e1'} />
              <circle cx="182" cy="52" r="1.1" fill={isDark ? '#64748b' : '#cbd5e1'} />
              <path
                d="M104 42L105.5 45.5L109 47L105.5 48.5L104 52L102.5 48.5L99 47L102.5 45.5L104 42Z"
                fill={isDark ? '#475569' : '#e2e8f0'}
              />
              <path
                d="M174 22L175.2 24.8L178 26L175.2 27.2L174 30L172.8 27.2L170 26L172.8 24.8L174 22Z"
                fill={isDark ? '#475569' : '#e2e8f0'}
              />

              {/* Dark Yoga Mat Base */}
              <rect x="94" y="131" width="92" height="5" rx="2.5" fill="#232838" />

              {/* Left Stacked Books / Prompt Blocks */}
              <rect x="50" y="128" width="26" height="8" rx="1.5" fill="#7da7ff" />
              <rect x="52" y="120" width="24" height="8" rx="1.5" fill="#a8c7ff" />
              <rect x="57" y="112" width="18" height="8" rx="1.5" fill="#d9c6ff" />

              {/* Right Stacked Blocks + Dumbbell */}
              <rect x="201" y="128" width="26" height="8" rx="1.5" fill="#7da7ff" />
              <rect x="200" y="120" width="26" height="8" rx="1.5" fill="#a8c7ff" />
              {/* Dumbbell */}
              <rect x="205" y="106" width="16" height="4" rx="2" fill="#e5d4ff" />
              <rect x="200" y="101" width="5" height="14" rx="2" fill="#c7d8ff" />
              <rect x="221" y="101" width="5" height="14" rx="2" fill="#c7d8ff" />

              {/* Left & Right Arms (Slate Blue Sweater) */}
              <path
                d="M123 68C112 72 99 88 94 102C92 107 96 111 101 108C109 102 117 91 124 85"
                fill="#9ab0d4"
              />
              <path
                d="M157 68C168 72 181 88 186 102C188 107 184 111 179 108C171 102 163 91 156 85"
                fill="#9ab0d4"
              />

              {/* Torso (Slate Blue Sweater) */}
              <path
                d="M121 66C121 62 126 60 132 60H148C154 60 159 62 159 66L161 104H119L121 66Z"
                fill="#a6bbe0"
              />
              {/* Collar / Drawstrings */}
              <rect x="137" y="61" width="2" height="11" rx="1" fill="#ffffff" />
              <rect x="141" y="61" width="2" height="11" rx="1" fill="#ffffff" />

              {/* Crossed Legs (Warm Cream Trousers) */}
              <path
                d="M119 102C102 103 88 112 88 122C88 129 97 132 114 132H145C153 132 160 128 160 122C160 112 146 104 131 102H119Z"
                fill="#f6e5b3"
              />
              <path
                d="M161 102C178 103 192 112 192 122C192 129 183 132 166 132H135C127 132 120 128 120 122C120 112 134 104 149 102H161Z"
                fill="#fae9ba"
              />
              {/* Subtle leg fold line */}
              <path
                d="M118 119C128 117 148 119 162 124"
                stroke="#e2cfa0"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Hands resting on knees */}
              <ellipse cx="94" cy="105" rx="6" ry="4" transform="rotate(-18 94 105)" fill="#e86f68" />
              <ellipse cx="186" cy="105" rx="6" ry="4" transform="rotate(18 186 105)" fill="#e86f68" />

              {/* Feet */}
              <ellipse cx="116" cy="130" rx="8" ry="4" fill="#e86f68" />
              <ellipse cx="164" cy="130" rx="8" ry="4" fill="#e86f68" />

              {/* Neck */}
              <rect x="135" y="49" width="10" height="13" rx="4" fill="#dd625b" />

              {/* Ears */}
              <circle cx="129" cy="39" r="3.2" fill="#e86f68" />
              <circle cx="151" cy="39" r="3.2" fill="#e86f68" />

              {/* Head */}
              <rect x="130" y="24" width="20" height="27" rx="10" fill="#e86f68" />

              {/* Beard & Mustache */}
              <path
                d="M130 39C130 47 134.5 53 140 53C145.5 53 150 47 150 39C148 41 144.5 41.5 140 41.5C135.5 41.5 132 41 130 39Z"
                fill="#404659"
              />
              {/* Calm Closed Eyes */}
              <path
                d="M134 36.5C135 37.8 136.5 37.8 137.5 36.5"
                stroke="#2b3040"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M142.5 36.5C143.5 37.8 145 37.8 146 36.5"
                stroke="#2b3040"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {/* Tiny calm mouth highlight */}
              <path
                d="M138.5 44.5H141.5"
                stroke="#f3a4a0"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Main Headline */}
          <h2
            className={`text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-xl ${
              isDark ? 'text-white' : 'text-[#1f2430]'
            }`}
          >
            Join our WhatsApp channel and receive new prompts daily.
          </h2>

          {/* Subtitle */}
          <p
            className={`mt-3 text-sm sm:text-[15px] leading-relaxed max-w-md ${
              isDark ? 'text-zinc-400' : 'text-[#64748b]'
            }`}
          >
            Your first 3 prompts are on us, forever. Join Premium to unlock unlimited viral prompts.
          </p>

          {/* Primary Pill CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#0075ff] hover:bg-[#0063db] active:scale-95 text-white font-bold text-sm px-8 py-3.5 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            Join WhatsApp Channel
          </button>
        </div>
      </div>
    </section>
  );
};