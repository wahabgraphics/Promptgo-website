import React, { useState } from 'react';
import LightVortexFunnel from './LightVortexFunnel';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Wrench,
  Users,
  LogOut,
  User as UserIcon,
  Crown,
  Bookmark,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import DotField from './DotField';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentTab: 'prompts' | 'master' | 'tools' | 'community' | 'saved';
  setCurrentTab: (tab: 'prompts' | 'master' | 'tools' | 'community' | 'saved') => void;
  onOpenSubscribe: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSubscribe,
  children
}) => {
  const {
    currentUser,
    userProfile,
    isPremium,
    logout
  } = useAuth();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="w-full bg-[#2563eb] text-white shadow-md">
      {/* 1. Top Navigation Bar (Solid #2563eb background, no animation behind it) */}
      <div className="relative z-20 bg-[#2563eb] border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between gap-4 py-5 sm:py-6">
            {/* Brand / Logo */}
            <button
              onClick={() => {
                setCurrentTab('prompts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-blue-950/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-[#2563eb] fill-[#2563eb]/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight font-['Plus_Jakarta_Sans'] text-white">
                    AI Prompt <span className="text-blue-100">Hub</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white border border-white/30">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] hidden sm:block -mt-0.5 text-blue-100">
                  Viral AI Video Directory &amp; Academy
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
              <button
                onClick={() => setCurrentTab('prompts')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'prompts'
                    ? 'bg-white text-[#2563eb] font-bold shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                All Prompts
              </button>
              <button
                onClick={() => setCurrentTab('master')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'master'
                    ? 'bg-white text-[#2563eb] font-bold shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Master Prompts
              </button>
              <button
                onClick={() => setCurrentTab('tools')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'tools'
                    ? 'bg-white text-[#2563eb] font-bold shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Tools &amp; AI
              </button>
              <button
                onClick={() => setCurrentTab('community')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'community'
                    ? 'bg-white text-[#2563eb] font-bold shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Community
              </button>
              {currentUser && (
                <button
                  onClick={() => setCurrentTab('saved')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    currentTab === 'saved'
                      ? 'bg-white text-[#2563eb] font-bold shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Saved
                  {userProfile?.saved_prompt_ids && userProfile.saved_prompt_ids.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        currentTab === 'saved'
                          ? 'bg-blue-100 text-[#2563eb]'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {userProfile.saved_prompt_ids.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Right Action Buttons (Strictly End-User Login & Subscribe) */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl border bg-white/15 border-white/25 text-white hover:bg-white/25 transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-200" /> : <Moon className="w-4 h-4 text-white" />}
              </button>

              {/* User Sign In / Profile */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 border rounded-xl bg-white/15 border-white/25 hover:bg-white/25 transition cursor-pointer"
                  >
                    <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline text-white">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-white text-[#2563eb] flex items-center justify-center text-xs font-bold">
                        {currentUser.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-56 border rounded-2xl shadow-2xl p-2 py-3 z-50 transition-colors ${
                        isDark ? 'bg-[#161822] border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                      }`}
                    >
                      <div className={`px-3 pb-2 border-b mb-2 ${isDark ? 'border-white/10' : 'border-zinc-100'}`}>
                        <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {currentUser.displayName || 'Prompt Explorer'}
                        </p>
                        <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {isPremium ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" /> VIP SUBSCRIBER
                            </span>
                          ) : (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
                              Free Member
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/profile');
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 transition cursor-pointer ${
                          isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                        My Profile &amp; Subscription
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('saved');
                          setUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center gap-2 transition cursor-pointer ${
                          isDark ? 'text-zinc-300 hover:text-white hover:bg-white/5' : 'text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                        Saved Prompts ({userProfile?.saved_prompt_ids?.length || 0})
                      </button>

                      <button
                        onClick={() => {
                          onOpenSubscribe();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 font-semibold cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-blue-600" />
                        {isPremium ? 'Manage Membership' : 'Subscribe for $5/month'}
                      </button>

                      <div className={`border-t my-1 pt-1 ${isDark ? 'border-white/10' : 'border-zinc-100'}`}>
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border bg-white/15 hover:bg-white/25 text-white border-white/25 transition cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Login
                </button>
              )}

              {/* Primary CTA Button */}
              <button
                onClick={onOpenSubscribe}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#2563eb] bg-white hover:bg-blue-50 active:scale-95 transition-all shadow-lg shadow-blue-950/20 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#2563eb] fill-[#2563eb]/20" />
                <span className="hidden xs:inline">
                  {isPremium ? 'VIP Active' : 'Get Started'}
                </span>
                <span className="xs:hidden">VIP</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2 rounded-xl border text-white bg-white/15 border-white/25 hover:bg-white/25"
                aria-label="Toggle navigation menu"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer */}
          {mobileNavOpen && (
            <div className="md:hidden pb-5">
              <div className="border border-white/20 bg-blue-700/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex flex-col gap-2 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/15 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Navigation</span>
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg border border-white/20 bg-white/10 flex items-center gap-1.5 text-xs font-medium text-white"
                  >
                    {isDark ? <Sun className="w-3.5 h-3.5 text-amber-200" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('prompts');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    currentTab === 'prompts' ? 'bg-white text-[#2563eb]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  All Prompts
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('master');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    currentTab === 'master' ? 'bg-white text-[#2563eb]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Master Prompts (Blog)
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('tools');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    currentTab === 'tools' ? 'bg-white text-[#2563eb]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Tools &amp; AI
                </button>
                <button
                  onClick={() => {
                    setCurrentTab('community');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    currentTab === 'community' ? 'bg-white text-[#2563eb]' : 'text-white hover:bg-white/10'
                  }`}
                >
                  Community
                </button>
                {currentUser && (
                  <button
                    onClick={() => {
                      setCurrentTab('saved');
                      setMobileNavOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                      currentTab === 'saved' ? 'bg-white text-[#2563eb]' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Saved Prompts ({userProfile?.saved_prompt_ids?.length || 0})
                  </button>
                )}

                <div className="pt-2 border-t border-white/15 flex flex-col gap-2">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        setMobileNavOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/25 bg-white/15 text-white"
                    >
                      <UserIcon className="w-4 h-4" />
                      My Profile &amp; Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileNavOpen(false);
                        navigate('/login');
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-white/25 bg-white/15 text-white"
                    >
                      <UserIcon className="w-4 h-4" />
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

             {/* 2. Hero Section Area (Light Vortex Funnel animation ONLY behind Hero content) */}
        {children && (
          <div className="relative overflow-hidden bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#0b1120] min-h-[540px] sm:min-h-[640px] pt-2 sm:pt-6 pb-36 sm:pb-52 flex flex-col justify-start">
            {/* Light Vortex Funnel Backdrop (Strictly scoped to Hero area) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <LightVortexFunnel
                primaryColor="#60a5fa"
                secondaryColor="#e879f9"
                particleCount={180}
              />
            </div>

            {/* Hero Content Foreground */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
              {children}
            </div>
          </div>
        )}
    </header>
  );
};