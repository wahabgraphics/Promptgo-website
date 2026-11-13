import React, { useState } from 'react';
import {
  Play,
  Lock,
  Copy,
  Check,
  Eye,
  Crown,
  Bookmark,
  Share2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface PromptCardProps {
  prompt: PromptItem;
  onSelect: (prompt: PromptItem) => void;
  onUnlockClick: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onSelect,
  onUnlockClick
}) => {
  const { subscriptionStatus, isPremium, isPromptSaved, toggleSavePrompt } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [copied, setCopied] = useState(false);

  const hasSubscriptionAccess = subscriptionStatus === 'active' || isPremium;
  const isLocked = prompt.is_premium && !hasSubscriptionAccess;
  const isSaved = isPromptSaved(prompt.id);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      onUnlockClick();
      return;
    }

    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnlockClick();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavePrompt(prompt.id);
  };

  return (
    <div
      onClick={() => onSelect(prompt)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer text-left border ${
        isDark
          ? 'bg-[#111827] hover:bg-[#1e293b] border-white/10 hover:border-blue-500/40 shadow-lg hover:shadow-2xl hover:shadow-blue-950/20'
          : 'bg-white hover:bg-white border-zinc-200/90 hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-black/60">
        <img
          src={prompt.thumbnail_url}
          alt={prompt.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Video Preview or Play Button Overlay */}
        {prompt.video_url ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
        )}

        {/* Status Badge: FREE (green) or PREMIUM (blue crown) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {prompt.is_premium ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-black/40 border border-blue-400/40">
              <Crown className="w-3 h-3 text-sky-200 fill-sky-200" />
              PREMIUM
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-emerald-600 text-white shadow-md shadow-black/40 border border-emerald-400/40">
              FREE
            </span>
          )}
        </div>

        {/* View Count Overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-md text-zinc-200 border border-white/10 shadow-md">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{prompt.views_count}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            title={isSaved ? 'Remove bookmark' : 'Save prompt'}
            className={`p-1.5 rounded-full backdrop-blur-md border shadow-md transition-all cursor-pointer ${
              isSaved
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-black/60 text-zinc-300 hover:text-white border-white/10 hover:bg-black/80'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Model Tag Pill */}
        {prompt.model_recommended && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/80 backdrop-blur border border-white/10 text-zinc-300">
              {prompt.model_recommended.split('/')[0].trim()}
            </span>
          </div>
        )}

        {/* Aspect Ratio Pill */}
        {prompt.aspect_ratio && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/80 backdrop-blur border border-white/10 text-zinc-400">
              {prompt.aspect_ratio}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between ${isDark ? 'bg-[#111827]' : 'bg-white'}`}>
        <div>
          {/* Category Tag */}
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 mb-1.5 flex items-center gap-1">
            <span>{prompt.category}</span>
          </div>

          {/* Title */}
          <h2
            className={`text-sm sm:text-base font-extrabold uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            {prompt.title}
          </h2>

          {/* Prompt Preview Snippet (Blurred when locked) */}
          <div className="mt-2.5 relative overflow-hidden rounded-xl">
            <p
              className={`text-xs line-clamp-2 font-mono leading-relaxed p-2.5 rounded-xl border ${
                isDark
                  ? 'bg-black/30 border-white/5 text-zinc-400'
                  : 'bg-zinc-50 border-zinc-200/80 text-zinc-700'
              } ${isLocked ? 'blur-[5px] select-none opacity-45 pointer-events-none' : ''}`}
              aria-hidden={isLocked}
            >
              {prompt.prompt_text}
            </p>
            {isLocked && (
              <div
                className={`absolute inset-0 flex items-center justify-center text-xs font-bold gap-1.5 backdrop-blur-[1px] ${
                  isDark ? 'bg-black/25 text-blue-300' : 'bg-white/40 text-blue-700'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Premium Prompt Locked</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className={`mt-4 pt-3 border-t flex flex-col gap-2 ${isDark ? 'border-white/10' : 'border-zinc-100'}`}>
          {isLocked ? (
            <>
              <button
                type="button"
                onClick={handleUnlock}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <span aria-hidden="true">🔒</span>
                <span>
                  {subscriptionStatus === 'pending'
                    ? 'Pending Admin Approval'
                    : 'Unlock Premium Prompt'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleUnlock}
                className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>
                  {subscriptionStatus === 'pending'
                    ? 'View Payment Status'
                    : 'Subscribe for $5/month'}
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 active:scale-98'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};