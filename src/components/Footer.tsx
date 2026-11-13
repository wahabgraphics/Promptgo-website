import React from 'react';
import { Flame, ArrowUp } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: 'prompts' | 'master' | 'tools' | 'community' | 'saved') => void;
  onOpenSubscribe: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenSubscribe }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t border-zinc-800 py-10 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2563eb] flex items-center justify-center text-white shadow-md shadow-blue-600/25">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight font-['Plus_Jakarta_Sans'] text-white">
              AI Prompt <span className="text-blue-400">Hub</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            The curated directory for viral AI video prompts and masterclasses. Designed for short-form creators on TikTok, Reels, and Shorts.
          </p>
          <div className="text-[11px] text-zinc-500">
            Inspired by soniprompts.com, umairtiktokwala.com &amp; theradiotv.net
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-white">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <button
                onClick={() => {
                  setCurrentTab('prompts');
                  scrollToTop();
                }}
                className="hover:text-white transition cursor-pointer"
              >
                All Prompts Directory
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentTab('master');
                  scrollToTop();
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Universal Master Prompts (Blog)
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentTab('tools');
                  scrollToTop();
                }}
                className="hover:text-white transition cursor-pointer"
              >
                AI Video &amp; Image Tools
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setCurrentTab('community');
                  scrollToTop();
                }}
                className="hover:text-white transition cursor-pointer"
              >
                Creator Community &amp; Bounties
              </button>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-3 text-white">
            Top Categories
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><span className="hover:text-zinc-200 transition">Animal &amp; Pets (Pixar style)</span></li>
            <li><span className="hover:text-zinc-200 transition">Cinematic &amp; Cyberpunk</span></li>
            <li><span className="hover:text-zinc-200 transition">ASMR Culinary &amp; Sand Slicing</span></li>
            <li><span className="hover:text-zinc-200 transition">Stop-Motion Papercraft</span></li>
            <li><span className="hover:text-zinc-200 transition">TikTok Comedy Skits</span></li>
          </ul>
        </div>

        {/* Membership CTA */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1 text-white">
            VIP Membership
          </h4>
          <p className="text-xs text-zinc-400">
            Get unlimited 1-click prompt copies, negative prompt formulas, and weekly viral drops.
          </p>
          <button
            onClick={onOpenSubscribe}
            className="w-full py-2.5 bg-[#2563eb] hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition cursor-pointer"
          >
            Upgrade for $5/mo
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-zinc-400">
        <p>© 2026 AI Prompt Hub. All rights reserved.</p>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};