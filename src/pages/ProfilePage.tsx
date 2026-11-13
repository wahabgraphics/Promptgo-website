import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Crown,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  LogOut,
  CreditCard,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PaymentModal } from '../components/PaymentModal';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    userProfile,
    subscriptionStatus,
    isAdmin,
    loading,
    refreshUserProfile,
    cancelSubscription,
    logout
  } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center gap-3 font-['Plus_Jakarta_Sans'] ${
          isDark ? 'bg-[#0b0f19] text-white' : 'bg-[#fafafa] text-zinc-900'
        }`}
      >
        <RefreshCw className="w-8 h-8 text-[#2563eb] animate-spin" />
        <p className="text-sm font-medium text-zinc-500">Loading your account profile...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isSubscriptionActive = subscriptionStatus === 'active';
  const isSubscriptionPending = subscriptionStatus === 'pending';

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await refreshUserProfile();
    setRefreshing(false);
  };

  const handleConfirmCancel = async () => {
    setCanceling(true);
    await cancelSubscription();
    setCanceling(false);
    setConfirmCancel(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
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

      {/* Main Profile Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 space-y-6">
        <div
          className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${
            isDark ? 'bg-[#111827] border-white/10' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
            <div className="flex items-center gap-4">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 dark:border-white/15"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center text-xl font-black">
                  {currentUser.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div>
                <h1 className="text-xl font-black tracking-tight">
                  {userProfile?.display_name || currentUser.displayName || 'Member'}
                </h1>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {currentUser.email}
                </p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isSubscriptionActive
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400'
                        : isSubscriptionPending
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400'
                        : 'bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400'
                    }`}
                  >
                    {isSubscriptionActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Subscription: Active
                      </>
                    ) : isSubscriptionPending ? (
                      <>
                        <Clock className="w-3 h-3" />
                        Subscription: Pending Approval
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Subscription: Inactive
                      </>
                    )}
                  </span>

                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/30 dark:text-blue-400">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isDark
                  ? 'border-white/15 text-zinc-300 hover:text-white hover:bg-white/5'
                  : 'border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Subscription Management Section */}
          <div className="pt-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#2563eb]" />
                <span>Membership &amp; Manual Payment Status</span>
              </h2>
              <button
                type="button"
                onClick={handleRefreshStatus}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border cursor-pointer transition ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>

            {isSubscriptionActive ? (
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">
                      VIP Membership Active ($5/month)
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      You have unlimited access to copy all Premium prompts, negative prompts, and Master guides.
                      {userProfile?.premium_until &&
                        ` Valid until ${new Date(userProfile.premium_until).toLocaleDateString()}.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold transition"
                  >
                    Browse All Premium Prompts
                  </Link>

                  {!confirmCancel ? (
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(true)}
                      className="px-4 py-2 rounded-xl border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-bold transition cursor-pointer"
                    >
                      Deactivate Subscription
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={canceling}
                        onClick={handleConfirmCancel}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-60"
                      >
                        {canceling ? 'Updating...' : 'Confirm'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmCancel(false)}
                        className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-white/15 text-xs font-semibold cursor-pointer"
                      >
                        Keep Active
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : isSubscriptionPending ? (
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/80 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Payment Submitted — Pending Admin Approval</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      We received your Transaction ID and payment screenshot. Once the admin approves it, your subscription will automatically switch to Active.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/70 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold">Free Account (Subscription Inactive)</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Free prompts are unlocked for you. Pay $5/month (PKR 1,400) via JazzCash, Easypaisa, or Bank Transfer and upload your receipt to unlock all Premium prompts.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-red-600/20 flex items-center gap-2 transition cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Subscribe for $5/month</span>
                </button>
              </div>
            )}

            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-[#2563eb]" />
                <div>
                  <p className="text-xs font-bold">Saved Bookmarks</p>
                  <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {userProfile?.saved_prompt_ids?.length || 0} prompt(s) saved to your account
                  </p>
                </div>
              </div>
              <Link to="/" className="text-xs font-bold text-[#2563eb] hover:underline">
                View Directory
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
};