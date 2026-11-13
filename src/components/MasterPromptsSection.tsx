import React, { useState } from 'react';
import { BookOpen, Sparkles, Crown, ArrowRight, Clock, Eye, Layers } from 'lucide-react';
import { MasterPromptGuide } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MasterPromptDetailModal } from './MasterPromptDetailModal';

interface MasterPromptsSectionProps {
  guides: MasterPromptGuide[];
  onOpenSubscribe: () => void;
}

export const MasterPromptsSection: React.FC<MasterPromptsSectionProps> = ({
  guides,
  onOpenSubscribe
}) => {
  const { isPremium } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedGuide, setSelectedGuide] = useState<MasterPromptGuide | null>(null);

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto animate-fade-in transition-colors">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${
            isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Academy & Long-form Guides (theradiotv.net style)
        </div>
        <h2
          className={`text-3xl sm:text-4xl font-black uppercase tracking-tight font-['Plus_Jakarta_Sans'] ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          Universal <span className="text-blue-600">Master Prompts</span>
        </h2>
        <p className={`mt-2 text-sm sm:text-base max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Deep-dive prompt blueprints, parameter formulas, and step-by-step video workflows used by high-follower viral creators.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => {
          return (
            <article
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className={`group flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer text-left border ${
                isDark
                  ? 'bg-[#111827] hover:bg-[#1e293b] border-white/10 hover:border-blue-500/40 shadow-xl'
                  : 'bg-white hover:bg-white border-zinc-200/90 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10'
              }`}
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={guide.featured_image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  {guide.is_premium ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                      <Crown className="w-3 h-3" /> VIP MASTER
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shadow">
                      FREE GUIDE
                    </span>
                  )}
                </div>

                {/* Views & Reading Time */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300">
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" /> {guide.read_time || '5 min read'}
                  </span>
                  <span className="flex items-center gap-1 bg-black/60 backdrop-blur px-2 py-0.5 rounded">
                    <Eye className="w-3 h-3 text-blue-400" /> {guide.views_count || '150K'} views
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className={`p-5 flex-1 flex flex-col justify-between ${isDark ? 'bg-[#111827]' : 'bg-white'}`}>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                    {guide.category}
                  </span>
                  <h3
                    className={`mt-1.5 text-base sm:text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    {guide.title}
                  </h3>
                  <p className={`mt-2 text-xs line-clamp-3 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {guide.description}
                  </p>
                </div>

                <div className={`mt-5 pt-3 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-zinc-100'}`}>
                  <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    Read Master Guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    {guide.recommended_tools?.[0] || 'AI Studio'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedGuide && (
        <MasterPromptDetailModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
          onOpenSubscribe={onOpenSubscribe}
        />
      )}
    </section>
  );
};
