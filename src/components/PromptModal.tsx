import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Lock,
  Crown,
  Sparkles,
  Bookmark,
  Share2,
  Eye,
  ExternalLink,
  SlidersHorizontal,
  Film,
  Clock
} from 'lucide-react';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface PromptModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  onOpenSubscribe: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  prompt,
  onClose,
  onOpenSubscribe
}) => {
  const { subscriptionStatus, isPremium, isPromptSaved, toggleSavePrompt } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!prompt) return null;

  const hasSubscriptionAccess = subscriptionStatus === 'active' || isPremium;
  const isLocked = prompt.is_premium && !hasSubscriptionAccess;
  const isSaved = isPromptSaved(prompt.id);

  const handleCopyPrompt = () => {
    if (isLocked) {
      onOpenSubscribe();
      return;
    }
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyNegative = () => {
    if (isLocked || !prompt.negative_prompt) return;
    navigator.clipboard.writeText(prompt.negative_prompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const formattedDate = (() => {
    try {
      return new Date(prompt.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return prompt.created_at;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#0f172a] border-white/10 text-white'
            : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b shrink-0 ${
            isDark ? 'border-white/10 bg-[#0b1120]' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div className="flex items-center flex-wrap gap-2 min-w-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-600 border border-blue-600/20">
              {prompt.category}
            </span>

            {prompt.is_premium ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                <Crown className="w-3 h-3 text-sky-200 fill-sky-200" />
                VIP PREMIUM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wide uppercase bg-emerald-600 text-white shadow-sm">
                FREE PROMPT
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleSavePrompt(prompt.id)}
              title={isSaved ? 'Remove bookmark' : 'Bookmark prompt'}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-blue-600 text-white border-blue-600'
                  : isDark
                  ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              title="Copy share link"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                copiedShare
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark
                  ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isDark
                  ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Title & Metadata Stats */}
          <div>
            <h2
              id="prompt-modal-title"
              className={`text-xl sm:text-2xl font-black uppercase tracking-tight leading-snug ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              {prompt.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-zinc-300'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                {prompt.views_count} views
              </span>

              {prompt.model_recommended && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-zinc-300'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {prompt.model_recommended}
                </span>
              )}

              {prompt.aspect_ratio && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-zinc-300'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-emerald-500" />
                  Ratio {prompt.aspect_ratio}
                </span>
              )}
            </div>
          </div>

          {/* Media Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video max-h-[380px] w-full flex items-center justify-center">
            {prompt.video_url ? (
              <video
                src={prompt.video_url}
                poster={prompt.thumbnail_url}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <img
                src={prompt.thumbnail_url}
                alt={prompt.title}
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>

          {/* Prompt Text Section */}
          <div
            className={`rounded-2xl border overflow-hidden ${
              isDark
                ? 'bg-[#0b1120] border-white/10'
                : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'
              }`}
            >
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Master Production Prompt
              </span>

              {!isLocked && (
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    copiedPrompt
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Prompt
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="relative p-4 sm:p-5">
              <pre
                className={`whitespace-pre-wrap break-words font-mono text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-zinc-200' : 'text-zinc-800'
                } ${isLocked ? 'blur-md select-none opacity-40 filter pointer-events-none' : ''}`}
                aria-hidden={isLocked}
              >
                {prompt.prompt_text}
              </pre>

              {isLocked && (
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px] ${
                    isDark ? 'bg-slate-950/60' : 'bg-white/70'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-extrabold ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    Subscribe to Unlock Full Prompt
                  </h3>
                  <p
                    className={`mt-1 text-xs sm:text-sm max-w-md ${
                      isDark ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {subscriptionStatus === 'pending'
                      ? 'Your payment screenshot has been submitted and is waiting for admin verification.'
                      : 'Get instant access to all VIP prompts, negative prompts, and production settings for $5/month.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenSubscribe}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-600/25 transition cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>
                      {subscriptionStatus === 'pending'
                        ? 'Payment Pending Admin Approval'
                        : 'Subscribe for $5/month'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Unlocked Extras: Negative Prompt + AI Generation Settings + Launchers */}
          {!isLocked && (
            <div className="space-y-5">
              {prompt.negative_prompt && (
                <div
                  className={`rounded-2xl border overflow-hidden ${
                    isDark
                      ? 'bg-[#0b1120] border-white/10'
                      : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 border-b ${
                      isDark ? 'border-white/10 bg-white/[0.02]' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500">
                      Negative Prompt
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNegative}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                        copiedNegative
                          ? 'bg-emerald-600 text-white'
                          : isDark
                          ? 'bg-white/10 hover:bg-white/20 text-zinc-200'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {copiedNegative ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    className={`p-4 font-mono text-xs leading-relaxed ${
                      isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}
                  >
                    {prompt.negative_prompt}
                  </p>
                </div>
              )}

              {/* Recommended AI Generation Settings */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 ${
                  isDark
                    ? 'bg-[#0b1120] border-white/10'
                    : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-3">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Recommended AI Generation Settings</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-zinc-200'
                    }`}
                  >
                    <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Model</div>
                    <div className="font-bold mt-0.5 truncate">
                      {prompt.model_recommended || 'Kling / Runway / Veo'}
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-zinc-200'
                    }`}
                  >
                    <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Aspect Ratio</div>
                    <div className="font-bold mt-0.5">{prompt.aspect_ratio || '16:9'}</div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-zinc-200'
                    }`}
                  >
                    <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Motion Value</div>
                    <div className="font-bold mt-0.5">5 to 7 (Smooth Camera)</div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-zinc-200'
                    }`}
                  >
                    <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Framerate</div>
                    <div className="font-bold mt-0.5">1080p 60fps / High Quality</div>
                  </div>
                </div>

                {/* Direct Generation Launchers */}
                <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-white/10 flex flex-wrap items-center gap-2.5">
                  <span
                    className={`text-xs font-bold mr-1 ${
                      isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}
                  >
                    Launch in AI Tool:
                  </span>
                  <a
                    href="https://klingai.com"
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
                        : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <span>Kling AI</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://runwayml.com"
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
                        : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <span>Runway</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://lumalabs.ai/dream-machine"
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'
                        : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100'
                    }`}
                  >
                    <span>Luma</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div
          className={`flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t shrink-0 ${
            isDark ? 'border-white/10 bg-[#0b1120]' : 'border-zinc-200 bg-zinc-50'
          }`}
        >
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Added {formattedDate}</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isDark
                  ? 'border-white/10 text-zinc-300 hover:bg-white/5'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Close
            </button>

            {isLocked ? (
              <button
                type="button"
                onClick={onOpenSubscribe}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>
                  {subscriptionStatus === 'pending'
                    ? 'View Payment Status'
                    : 'Subscribe to Unlock ($5/mo)'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer ${
                  copiedPrompt
                    ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                }`}
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};