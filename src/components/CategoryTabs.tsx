import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CategoryTabsProps {
  totalPromptsCount: number;
  filteredCount: number;
  searchQuery: string;
  tierFilter: 'all' | 'free' | 'premium';
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
  categoryCounts: Record<string, number>;
  onResetFilters: () => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  totalPromptsCount,
  filteredCount,
  searchQuery,
  tierFilter,
  selectedCategory,
  setSelectedCategory,
  categories,
  categoryCounts,
  onResetFilters
}) => {
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollPills = (direction: 'left' | 'right') => {
    if (pillsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      pillsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="relative">
        <button
          onClick={() => scrollPills('left')}
          className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-8 h-8 rounded-full border items-center justify-center backdrop-blur shadow-md transition cursor-pointer ${
            isDark
              ? 'bg-[#161822]/90 border-white/20 text-zinc-300 hover:text-white hover:bg-white/10'
              : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm'
          }`}
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={pillsContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 text-xs"
        >
          {categories.map((cat) => {
            const count = categoryCounts[cat] || (cat === 'All Categories' ? totalPromptsCount : 0);
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563eb] text-white font-bold shadow-md shadow-blue-600/25'
                    : isDark
                    ? 'bg-[#161822] text-zinc-300 hover:text-white border border-white/10 hover:border-white/25'
                    : 'bg-white text-zinc-700 hover:text-[#2563eb] hover:border-blue-300 border border-zinc-200 shadow-xs'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-blue-700 text-white'
                        : isDark
                        ? 'bg-white/10 text-zinc-300'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollPills('right')}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-8 h-8 rounded-full border items-center justify-center backdrop-blur shadow-md transition cursor-pointer ${
            isDark
              ? 'bg-[#161822]/90 border-white/20 text-zinc-300 hover:text-white hover:bg-white/10'
              : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm'
          }`}
          aria-label="Scroll categories right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Result Indicator if filtered */}
      {(searchQuery || selectedCategory !== 'All Categories' || tierFilter !== 'all') && (
        <div className={`mt-3 flex items-center justify-center gap-2 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          <span>
            Found <strong className={isDark ? 'text-white' : 'text-zinc-900'}>{filteredCount}</strong> results
          </span>
          <button
            onClick={onResetFilters}
            className="text-[#2563eb] hover:underline font-bold ml-2 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
