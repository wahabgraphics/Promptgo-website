import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowLeft, Crown, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const { currentUser, loading, loginAsMember } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/', { replace: true });
    }
  }, [currentUser, loading, navigate]);

  const handleCustomerAuth = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const role = await loginAsMember();
      if (role !== 'guest') {
        navigate('/', { replace: true });
      }
    } catch {
      setError('Sign-in was cancelled or failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] ${
        isDark ? 'bg-[#0b0f19] text-white' : 'bg-[#fafafa] text-zinc-900'
      }`}
    >
      {/* Top Royal Blue Bar */}
      <div className="w-full bg-[#2563eb] text-white py-5 px-4 sm:px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#2563eb]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              AI Prompt <span className="text-blue-100">Hub</span>
            </span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Directory
          </Link>
        </div>
      </div>

      {/* Main Centered Login / Signup Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className={`w-full max-w-md rounded-3xl border p-7 sm:p-8 shadow-xl ${
            isDark ? 'bg-[#141622] border-white/10' : 'bg-white border-zinc-200'
          }`}
        >
          {/* Mode Switcher */}
          <div
            className={`flex p-1 rounded-2xl border mb-6 ${
              isDark ? 'bg-[#0b0f19] border-white/10' : 'bg-zinc-100 border-zinc-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Customer Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/25 text-[#2563eb] flex items-center justify-center mx-auto mb-3">
              {mode === 'login' ? <UserCheck className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Member Account'}
            </h1>
            <p className={`text-xs mt-1.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {mode === 'login'
                ? 'Sign in to access your VIP prompts, saved bookmarks, and subscription.'
                : 'Sign up in seconds to bookmark prompts and unlock $5/mo VIP access.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCustomerAuth}
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z" />
            </svg>
            <span>
              {submitting
                ? 'Connecting...'
                : mode === 'login'
                ? 'Sign In with Google'
                : 'Sign Up with Google'}
            </span>
          </button>

          <div
            className={`mt-6 pt-5 border-t space-y-2.5 text-xs ${
              isDark ? 'border-white/10 text-zinc-300' : 'border-zinc-200 text-zinc-600'
            }`}
          >
            <p className="font-bold uppercase tracking-wider text-[11px] text-[#2563eb]">
              Member Benefits
            </p>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Save favorite prompts to your personal bookmarks</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Instant VIP unlock after $5/mo subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Access from any device with your Google account</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};