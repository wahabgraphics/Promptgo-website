import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  BookOpen,
  Crown,
  Lock,
  Clock,
  Eye,
  Share2,
  Sparkles,
  ArrowRight,
  Layers,
  Wrench
} from 'lucide-react';
import { MasterPromptGuide } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface MasterPromptDetailModalProps {
  guide: MasterPromptGuide | null;
  onClose: () => void;
  onOpenSubscribe: () => void;
}

export const MasterPromptDetailModal: React.FC<MasterPromptDetailModalProps> = ({
  guide,
  onClose,
  onOpenSubscribe
}) => {
  const { isPremium } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!guide) return null;

  const isLocked = guide.is_premium && !isPremium;

  const handleCopyTemplate = () => {
    if (isLocked) {
      onOpenSubscribe();
      return;
    }
    navigator.clipboard.writeText(guide.universal_template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors ${
          isDark ? 'bg-[#111827] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between transition-colors ${
            isDark ? 'bg-[#0f172a] border-white/10' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Master Prompt Guide
            </span>
            <span className="text-zinc-400">•</span>
            <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{guide.category}</span>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 border-white/10 text-zinc-400'
                : 'bg-zinc-100 hover:bg-blue-50 hover:text-blue-600 border-zinc-200 text-zinc-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Header Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {guide.is_premium ? (
                <span className="flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                  <Crown className="w-3 h-3" /> MASTER VIP
                </span>
              ) : (
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  FREE MASTERCLASS
                </span>
              )}
              {guide.read_time && (
                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <Clock className="w-3.5 h-3.5" /> {guide.read_time}
                </span>
              )}
              {guide.views_count && (
                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <Eye className="w-3.5 h-3.5 text-blue-600" /> {guide.views_count} views
                </span>
              )}
            </div>

            <h1
              className={`text-2xl sm:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans'] leading-tight ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {guide.title}
            </h1>
            <p className={`mt-3 text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {guide.description}
            </p>
          </div>

          {/* Featured Image */}
          <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-zinc-800 shadow-lg bg-black">
            <img
              src={guide.featured_image}
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Universal Template Block */}
          <div
            className={`p-5 rounded-2xl border shadow-lg relative ${
              isDark ? 'bg-[#0a0c12] border-blue-500/30' : 'bg-blue-50/40 border-blue-200'
            }`}
          >
            <div className={`flex items-center justify-between pb-3 border-b mb-3 ${isDark ? 'border-white/10' : 'border-blue-200/60'}`}>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" />
                The Universal Prompt Formula (Fill in Bracketed Variables)
              </span>

              {!isLocked && (
                <button
                  onClick={handleCopyTemplate}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    copiedTemplate ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied!' : 'Copy Formula'}</span>
                </button>
              )}
            </div>

            <div className={`font-mono text-xs sm:text-sm leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
              <p className={isLocked ? 'blur-md select-none opacity-40' : ''}>
                {guide.universal_template}
              </p>

              {isLocked && (
                <div
                  className={`absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 rounded-2xl transition-colors ${
                    isDark ? 'bg-[#0d0f17]/90 text-white' : 'bg-white/90 text-zinc-900'
                  }`}
                >
                  <Lock className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className={`text-base font-bold uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    VIP Master Formula Locked
                  </h4>
                  <p className={`text-xs max-w-sm mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    Subscribe to AI Prompt Hub to unlock this universal template, parameter breakdowns, and high-conversion workflows.
                  </p>
                  <button
                    onClick={onOpenSubscribe}
                    className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-sky-200" />
                    <span>Unlock Master Guide ($5/MO)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full Long-Form Guide Markdown / Text */}
          <div className="prose prose-invert max-w-none space-y-4 text-sm leading-relaxed">
            {guide.full_guide.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={idx}
                    className={`text-lg font-bold pt-3 pb-1 border-b font-['Plus_Jakarta_Sans'] ${
                      isDark ? 'text-white border-white/10' : 'text-zinc-900 border-zinc-200'
                    }`}
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-blue-500 my-2 space-y-1">
                    {paragraph.split('\n').map((line, lIdx) => (
                      <p key={lIdx} className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                );
              }
              return (
                <p key={idx} className={isDark ? 'text-zinc-300' : 'text-zinc-600'}>
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Recommended Tool Stack */}
          {guide.recommended_tools && guide.recommended_tools.length > 0 && (
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className={`text-xs font-bold flex items-center gap-1.5 mb-2 ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                <Wrench className="w-3.5 h-3.5 text-blue-600" />
                Recommended Production Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {guide.recommended_tools.map((tool) => (
                  <span
                    key={tool}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                      isDark ? 'bg-black/40 border-white/10 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                    }`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
