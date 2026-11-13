import React, { useState } from 'react';
import { Users, Send, MessageSquare, Check, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const CommunitySection: React.FC = () => {
  const { currentUser, loginWithGoogle } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [submitted, setSubmitted] = useState(false);
  const [promptTitle, setPromptTitle] = useState('');
  const [promptCategory, setPromptCategory] = useState('Animal & Pets');
  const [promptText, setPromptText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTitle || !promptText) return;
    setSubmitted(true);
    setTimeout(() => {
      setPromptTitle('');
      setPromptText('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section className="py-8 px-4 max-w-5xl mx-auto animate-fade-in space-y-12 transition-colors">
      {/* Header */}
      <div className="text-center">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${
            isDark ? 'bg-blue-500/10 border-blue-500/25 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Viral Creators Community
        </div>
        <h2
          className={`text-3xl sm:text-4xl font-black uppercase tracking-tight font-['Plus_Jakarta_Sans'] ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}
        >
          Join 25,000+ <span className="text-blue-600">AI Video Creators</span>
        </h2>
        <p className={`mt-2 text-sm sm:text-base max-w-xl mx-auto ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Share your viral video prompt discoveries, get feedback, and compete in weekly prompt battles.
        </p>
      </div>

      {/* Community Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-2xl border transition ${
            isDark
              ? 'bg-[#141622] border-white/10 hover:border-blue-500/40'
              : 'bg-white border-zinc-200/90 hover:border-blue-500/40 shadow-sm text-zinc-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-500 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Discord Guild</h3>
          <p className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Real-time prompt testing channels, Kling AI motion recipes, and prompt engineering discussions.
          </p>
          <button
            onClick={() => window.open('https://discord.com', '_blank')}
            className="mt-4 w-full py-2 bg-indigo-600/15 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Join Discord
          </button>
        </div>

        <div
          className={`p-6 rounded-2xl border transition ${
            isDark
              ? 'bg-[#141622] border-white/10 hover:border-blue-500/40'
              : 'bg-white border-zinc-200/90 hover:border-blue-500/40 shadow-sm text-zinc-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-500 flex items-center justify-center mb-4">
            <Send className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Telegram Alerts</h3>
          <p className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Daily drops of the top 3 trending TikTok prompts with direct copy snippets and video previews.
          </p>
          <button
            onClick={() => window.open('https://telegram.org', '_blank')}
            className="mt-4 w-full py-2 bg-sky-600/15 hover:bg-sky-600 text-sky-600 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Subscribe Telegram
          </button>
        </div>

        <div
          className={`p-6 rounded-2xl border transition ${
            isDark
              ? 'bg-[#141622] border-white/10 hover:border-blue-500/40'
              : 'bg-white border-zinc-200/90 hover:border-blue-500/40 shadow-sm text-zinc-900'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-600 flex items-center justify-center mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Creator Bounty</h3>
          <p className={`mt-1 text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Submit a prompt that gets accepted into our VIP directory and earn free 6-month VIP membership!
          </p>
          <a
            href="#submit-prompt"
            className="mt-4 block text-center py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer border border-blue-200 hover:border-transparent"
          >
            Submit Below
          </a>
        </div>
      </div>

      {/* Submit Prompt Form */}
      <div
        id="submit-prompt"
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-colors ${
          isDark ? 'bg-[#12141c] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        <div className="max-w-xl mx-auto">
          <h3 className={`text-xl font-bold text-center flex items-center justify-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            <Sparkles className="w-5 h-5 text-blue-600" />
            Submit Your Viral Prompt
          </h3>
          <p className={`text-xs text-center mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Have you struck viral gold on TikTok or YouTube Shorts? Submit your prompt to get featured.
          </p>

          {submitted ? (
            <div className={`mt-6 p-6 rounded-2xl border text-center animate-fade-in ${
              isDark ? 'bg-emerald-950/60 border-emerald-500/40 text-white' : 'bg-emerald-50 border-emerald-300 text-zinc-900'
            }`}>
              <Check className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-base font-bold">Prompt Submitted for Review!</h4>
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Our curation team will review and test it on Kling & Runway. If approved, you will receive VIP creator perks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Prompt Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ULTRA REALISTIC TINY CHEF HAMSTER"
                  value={promptTitle}
                  onChange={(e) => setPromptTitle(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-[#181a26] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Category
                </label>
                <select
                  value={promptCategory}
                  onChange={(e) => setPromptCategory(e.target.value)}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-[#181a26] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                >
                  <option value="Animal & Pets">Animal & Pets</option>
                  <option value="Art & Animation">Art & Animation</option>
                  <option value="ASMR">ASMR</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Cinematic">Cinematic</option>
                  <option value="DIY & Crafts">DIY & Crafts</option>
                  <option value="TikTok Trends">TikTok Trends</option>
                </select>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Prompt Text & Parameters
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste your exact prompt text, aspect ratio, and model settings..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className={`w-full border rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-[#181a26] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition cursor-pointer"
              >
                Submit Viral Prompt
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
