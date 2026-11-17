import React from 'react';
import {
  Search,
  Sparkles,
  Unlock,
  Crown,
  ArrowUpDown,
  X
} from 'lucide-react';

interface HeroSectionProps {
  totalPromptsCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tierFilter: 'all' | 'free' | 'premium';
  setTierFilter: (t: 'all' | 'free' | 'premium') => void;
  categoryCounts: Record<string, number>;
  sortBy: 'newest' | 'views' | 'oldest';
  setSortBy: (s: 'newest' | 'views' | 'oldest') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalPromptsCount,
  searchQuery,
  setSearchQuery,
  tierFilter,
  setTierFilter,
  categoryCounts,
  sortBy,
  setSortBy
}) => {
  const totalCount = totalPromptsCount || 12;
  const freeCount = categoryCounts['Free'] || 0;
  const premiumCount = categoryCounts['Premium'] || 0;

  return (
    <section className="py-4 sm:py-6 max-w-6xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-wider uppercase text-sky-200/90 mb-3">
          AI Video Prompt Directory · Kling · Runway Gen-3 · Luma
        </p>

        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.08] font-['Plus_Jakarta_Sans'] text-balance">
          Turn viral ideas into cinematic AI videos
        </h1>

        <p className="mt-4 text-sm sm:text-base font-medium text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
          Explore <span className="text-white font-bold tabular-nums">{totalCount}+</span> battle-tested AI video prompts with camera motion matrices, negative prompts, and instant one-click copy.
        </p>

        <div className="mt-8">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-white text-zinc-900 shadow-2xl shadow-blue-950/40 border border-white/50 focus-within:ring-4 focus-within:ring-sky-300/40 transition-all"
          >
            <div className="relative flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 shrink-0 mr-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts by keyword, trend, style, or camera motion..."
                className="w-full bg-transparent text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none py-2.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 rounded-full cursor-pointer text-zinc-500 hover:text-zinc-900 bg-zinc-100"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-3 px-2">
              <div className="relative flex items-center">
                <ArrowUpDown className="w-4 h-4 absolute left-2.5 pointer-events-none text-zinc-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'views' | 'oldest')}
                  className="text-xs font-semibold py-2.5 pl-8 pr-7 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-300 focus:outline-none focus:border-[#2563eb] cursor-pointer appearance-none transition whitespace-nowrap"
                >
                  <option value="newest">Newest First</option>
                  <option value="views">Most Viral (Views)</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              tierFilter === 'all'
                ? 'bg-white text-[#2563eb] shadow-md'
                : 'bg-white/12 text-white border border-white/25 hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            All Prompts
          </button>

          <button
            type="button"
            onClick={() => setTierFilter('free')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              tierFilter === 'free'
                ? 'bg-white text-[#2563eb] shadow-md'
                : 'bg-white/12 text-white border border-white/25 hover:bg-white/20'
            }`}
          >
            <Unlock className={`w-3.5 h-3.5 ${tierFilter === 'free' ? 'text-[#2563eb]' : 'text-blue-100'}`} />
            <span className="tabular-nums">Free ({freeCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setTierFilter('premium')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              tierFilter === 'premium'
                ? 'bg-white text-[#2563eb] shadow-md'
                : 'bg-white/12 text-white border border-white/25 hover:bg-white/20'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${tierFilter === 'premium' ? 'text-amber-500' : 'text-amber-300'}`} />
            <span className="tabular-nums">Premium VIP ({premiumCount})</span>
          </button>
        </div>
      </div>
    </section>
  );
};