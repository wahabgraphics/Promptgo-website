import React from 'react';
import { Search, Sparkles, Unlock, Crown, ArrowUpDown, X } from 'lucide-react';

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
  return (
    <section className="pt-12 pb-6 sm:pt-16 sm:pb-8 text-center px-4 max-w-5xl mx-auto">
      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-['Plus_Jakarta_Sans']">
        ALL PROMPTS
      </h1>

      {/* Description Text */}
      <p className="mt-4 text-sm sm:text-base font-medium text-blue-100 max-w-2xl mx-auto">
        Discover <span className="text-white font-extrabold">{totalPromptsCount || 12}+</span> viral AI prompts for Kling, Runway Gen-3, Luma &amp; Midjourney
      </p>

      {/* Large Centered White Search Bar with Sort Dropdown & Search Button */}
      <div className="mt-9 max-w-3xl mx-auto">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-white text-zinc-900 shadow-xl shadow-blue-950/25 border border-white/40 focus-within:ring-4 focus-within:ring-white/30 transition-all"
        >
          {/* Search Input */}
          <div className="relative flex-1 flex items-center pl-4">
            <Search className="w-5 h-5 shrink-0 mr-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword, trend, animal, style, or camera motion..."
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

          {/* Sort Dropdown & Search Submit */}
          <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-3 px-2">
            <div className="relative flex items-center">
              <ArrowUpDown className="w-4 h-4 absolute left-2.5 pointer-events-none text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'views' | 'oldest')}
                className="text-xs font-semibold py-2.5 pl-8 pr-7 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 hover:border-zinc-300 focus:outline-none focus:border-[#2563eb] cursor-pointer appearance-none transition"
              >
                <option value="newest">Newest First</option>
                <option value="views">Most Viral (Views)</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Buttons: "All Prompts", "Free", "Premium VIP" */}
      <div className="mt-6 flex items-center justify-center gap-2.5 flex-wrap">
        <button
          onClick={() => setTierFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tierFilter === 'all'
              ? 'bg-white text-[#2563eb] shadow-md'
              : 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          All Prompts
        </button>

        <button
          onClick={() => setTierFilter('free')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tierFilter === 'free'
              ? 'bg-white text-[#2563eb] shadow-md'
              : 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
          }`}
        >
          <Unlock className={`w-3.5 h-3.5 ${tierFilter === 'free' ? 'text-[#2563eb]' : 'text-blue-100'}`} />
          Free ({categoryCounts['Free'] || 0})
        </button>

        <button
          onClick={() => setTierFilter('premium')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            tierFilter === 'premium'
              ? 'bg-white text-[#2563eb] shadow-md'
              : 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
          }`}
        >
          <Crown className={`w-3.5 h-3.5 ${tierFilter === 'premium' ? 'text-amber-500' : 'text-amber-300'}`} />
          Premium VIP ({categoryCounts['Premium'] || 0})
        </button>
      </div>
    </section>
  );
};
