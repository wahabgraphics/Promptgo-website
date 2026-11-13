import React from 'react';
import { Wrench, ExternalLink, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { AI_TOOLS_DIRECTORY } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export const ToolsSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto animate-fade-in transition-colors">
      <div className="text-center mb-10">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${
            isDark ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Recommended Tool Stack
        </div>
        <h2
          className={`text-3xl sm:text-4xl font-black uppercase tracking-tight font-['Plus_Jakarta_Sans'] ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          AI Video & Image <span className="text-blue-600">Studios</span>
        </h2>
        <p className={`mt-2 text-sm sm:text-base max-w-2xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          The best AI generation engines to pair with AI Prompt Hub prompts for viral TikTok, YouTube Shorts, and Instagram Reels creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AI_TOOLS_DIRECTORY.map((tool) => (
          <div
            key={tool.name}
            className={`flex flex-col justify-between rounded-2xl p-6 transition-all group border ${
              isDark
                ? 'bg-[#141622] border-white/10 hover:border-blue-500/40 shadow-xl hover:shadow-2xl'
                : 'bg-white border-zinc-200/90 hover:border-blue-500/40 shadow-sm hover:shadow-xl hover:shadow-zinc-300/50 text-zinc-900'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                    isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  {tool.category}
                </span>
                {tool.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-600/10 text-blue-600 border border-blue-500/30 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> {tool.badge}
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-bold group-hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {tool.name}
              </h3>
              <p className={`mt-2 text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {tool.description}
              </p>

              <div
                className={`mt-4 p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-black/40 border-white/5 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                }`}
              >
                <span className="text-zinc-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                  BEST USE CASE:
                </span>
                <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{tool.bestFor}</span>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-zinc-100'}`}>
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-white/5 hover:bg-blue-600 hover:text-white text-zinc-300'
                    : 'bg-zinc-100 hover:bg-blue-600 hover:text-white text-zinc-800'
                }`}
              >
                <span>Launch {tool.name.split(' ')[0]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
