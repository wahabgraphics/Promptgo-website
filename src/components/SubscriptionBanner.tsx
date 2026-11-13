import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SubscriptionBannerProps {
  onOpenSubscribe: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ onOpenSubscribe }) => {
  const { currentUser, subscriptionStatus, isPremium } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  if (subscriptionStatus === 'pending' && !isPremium) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400 p-4 sm:p-5 shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20 border border-white/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold tracking-wide uppercase">
                ⏳ Payment Submitted — Awaiting Admin Approval
              </h3>
              <p className="text-xs mt-0.5 text-amber-50">
                Your transaction receipt is being reviewed. Premium prompts will unlock automatically once approved.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-700 font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer shrink-0"
          >
            Check Status
          </button>
        </div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
            isDark
              ? 'bg-[#111827] border-white/10 text-white'
              : 'bg-white border-zinc-200/90 text-zinc-900 shadow-zinc-200/50'
          }`}
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isDark ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'
            }`}>
              <Crown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  VIP Membership Active
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> UNLOCKED
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                You have unrestricted access to all viral prompts, negative prompts, camera matrices &amp; master templates.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSubscribe}
            className={`px-4 py-2 border text-xs font-semibold rounded-xl transition cursor-pointer ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 shadow-xs'
            }`}
          >
            Membership Perks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 border border-red-500 p-4 sm:p-5 shadow-xl shadow-red-600/15 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/15 border border-white/25 text-white">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-wide uppercase text-white">
              🔒 Subscribe to unlock all prompts — full text, images &amp; copy button
            </h3>
            <p className="text-xs mt-0.5 text-red-100">
              Instant access to secret camera parameters, negative prompts, and 100M+ TikTok viral formulas.
            </p>
          </div>
        </div>

        <div className="z-10 flex items-center gap-2 shrink-0 flex-wrap justify-center">
          {!currentUser && (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              Member Sign In
            </button>
          )}
          <button
            onClick={onOpenSubscribe}
            className="px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 font-black text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Subscribe for $5/month</span>
            <ArrowRight className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};