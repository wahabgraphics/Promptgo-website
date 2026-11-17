import React, { useState } from 'react';
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
import OrbitalGalleryHero from './OrbitalGalleryHero';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentTab: 'prompts' | 'master' | 'tools' | 'community' | 'saved';
  setCurrentTab: (tab: 'prompts' | 'master' | 'tools' | 'community' | 'saved') => void;
  onOpenSubscribe: () => void;
  prompts?: PromptItem[];
  onSelectPrompt?: (prompt: PromptItem) => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSubscribe,
  prompts,
  onSelectPrompt,
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
    <header className="w-full shadow-md">
      {/* 1. Top Navigation Bar */}
      <div className="relative z-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between gap-4 py-4 sm:py-5">
            {/* Brand / Logo */}
            <button
              onClick={() => {
                setCurrentTab('prompts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight font-['Plus_Jakarta_Sans'] text-zinc-900">
                    AI Prompt <span className="text-[#2563eb]">Hub</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-[#2563eb] border border-blue-200">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] hidden sm:block -mt-0.5 text-zinc-500">
                  Viral AI Video Directory &amp; Academy
                </p>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold">
              <button
                onClick={() => setCurrentTab('prompts')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'prompts'
                    ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                    : 'text-zinc-900 hover:text-[#2563eb] hover:bg-zinc-100'
                }`}
              >
                All Prompts
              </button>
              <button
                onClick={() => setCurrentTab('master')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'master'
                    ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                    : 'text-zinc-900 hover:text-[#2563eb] hover:bg-zinc-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Master Prompts
              </button>
              <button
                onClick={() => setCurrentTab('tools')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'tools'
                    ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                    : 'text-zinc-900 hover:text-[#2563eb] hover:bg-zinc-100'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                Tools &amp; AI
              </button>
              <button
                onClick={() => setCurrentTab('community')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentTab === 'community'
                    ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                    : 'text-zinc-900 hover:text-[#2563eb] hover:bg-zinc-100'
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
                      ? 'bg-[#2563eb] text-white font-bold shadow-sm'
                      : 'text-zinc-900 hover:text-[#2563eb] hover:bg-zinc-100'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Saved
                  {userProfile?.saved_prompt_ids && userProfile.saved_prompt_ids.length > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        currentTab === 'saved'
                          ? 'bg-white/20 text-white'
                          : 'bg-zinc-100 text-zinc-900'
                      }`}
                    >
                      {userProfile.saved_prompt_ids.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Light / Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl border bg-zinc-100 border-zinc-200 text-zinc-900 hover:bg-zinc-200 transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-zinc-900" />}
              </button>

              {/* User Sign In / Profile */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2.5 border rounded-xl bg-zinc-100 border-zinc-200 hover:bg-zinc-200 transition cursor-pointer"
                  >
                    <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline text-zinc-900">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-zinc-300"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
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
                        {isPremium ? 'Manage Membership' : 'Subscribe for $2/month'}
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
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200 transition cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Login
                </button>
              )}

              {/* Primary CTA Button */}
              <button
                onClick={onOpenSubscribe}
                className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#2563eb] hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/20 rounded-xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white fill-white/20" />
                <span className="hidden xs:inline">
                  {isPremium ? 'VIP Active' : 'Get Started'}
                </span>
                <span className="xs:hidden">VIP</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="md:hidden p-2 rounded-xl border text-zinc-900 bg-zinc-100 border-zinc-200 hover:bg-zinc-200"
                aria-label="Toggle navigation menu"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile Drawer */}
          {mobileNavOpen && (
            <div className="md:hidden pb-5">
              <div className="border border-zinc-200 bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-2 text-zinc-900">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Navigation</span>
                  <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg border border-zinc-200 bg-zinc-100 flex items-center gap-1.5 text-xs font-medium text-zinc-900"
                  >
                    {isDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-zinc-900" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('prompts');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                    currentTab === 'prompts' ? 'bg-[#2563eb] text-white' : 'text-zinc-900 hover:bg-zinc-100'
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
                    currentTab === 'master' ? 'bg-[#2563eb] text-white' : 'text-zinc-900 hover:bg-zinc-100'
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
                    currentTab === 'tools' ? 'bg-[#2563eb] text-white' : 'text-zinc-900 hover:bg-zinc-100'
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
                    currentTab === 'community' ? 'bg-[#2563eb] text-white' : 'text-zinc-900 hover:bg-zinc-100'
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
                      currentTab === 'saved' ? 'bg-[#2563eb] text-white' : 'text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    Saved Prompts ({userProfile?.saved_prompt_ids?.length || 0})
                  </button>
                )}

                <div className="pt-2 border-t border-zinc-200 flex flex-col gap-2">
                  {currentUser ? (
                    <button
                      onClick={() => {
                        setMobileNavOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-zinc-200 bg-zinc-100 text-zinc-900"
                    >
                      <UserIcon className="w-4 h-4 text-[#2563eb]" />
                      My Profile &amp; Subscription
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileNavOpen(false);
                        navigate('/login');
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-zinc-200 bg-zinc-100 text-zinc-900"
                    >
                      <UserIcon className="w-4 h-4 text-[#2563eb]" />
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Orbital Gallery Hero Area */}
      {children && (
        <OrbitalGalleryHero prompts={prompts} onSelectPrompt={onSelectPrompt}>
          {children}
        </OrbitalGalleryHero>
      )}
    </header>
  );
};