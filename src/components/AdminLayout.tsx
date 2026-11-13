import React, { useState, useEffect } from 'react';
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  List,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Lock,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { currentUser, isAdmin, loading, authError, clearAuthError, loginAsAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [accessDeniedRedirect, setAccessDeniedRedirect] = useState(false);

  useEffect(() => {
    if (accessDeniedRedirect) {
      const timer = setTimeout(() => {
        clearAuthError();
        navigate('/', { replace: true, state: { accessDenied: true } });
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [accessDeniedRedirect, clearAuthError, navigate]);

  const handleAdminSignIn = async () => {
    setSigningIn(true);
    setAccessDeniedRedirect(false);
    const ok = await loginAsAdmin();
    setSigningIn(false);
    if (!ok) {
      setAccessDeniedRedirect(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin', { replace: true });
  };

  // 1. Loading session
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center gap-3 font-['Plus_Jakarta_Sans']">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-zinc-400">Verifying administrator session...</p>
      </div>
    );
  }

  // 2. Non-admin customer logged in via /login attempting to visit /admin -> redirect home
  if (currentUser && !isAdmin) {
    return <Navigate to="/" replace state={{ accessDenied: true }} />;
  }

  // 3. Unauthenticated visitor on /admin -> Standalone Admin Login Screen (no public header/footer)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 py-12 font-['Plus_Jakarta_Sans']">
        <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-blue-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
              Restricted Area
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Admin Console Login
            </h1>
            <p className="text-xs mt-1.5 text-zinc-400">
              Sign in with your administrator Google account to manage prompts and Firestore records.
            </p>
          </div>

          {(authError || accessDeniedRedirect) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <div>
                <p>{authError || 'Access Denied: You do not have administrator permissions.'}</p>
                {accessDeniedRedirect && (
                  <p className="mt-1 text-[11px] text-red-400/80">Redirecting to homepage...</p>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAdminSignIn}
            disabled={signingIn}
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-zinc-700" />
            <span>{signingIn ? 'Verifying Admin Role...' : 'Sign In as Administrator'}</span>
          </button>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Verified Admin -> Dedicated Admin Dashboard Shell (Dark Sidebar + Clean Workspace)
  const navItems = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/add', label: 'Add New Prompt', icon: PlusCircle, end: false },
    { to: '/admin/prompts', label: 'View All Prompts', icon: List, end: false },
    { to: '/admin/payments', label: 'Payment Requests', icon: CreditCard, end: false }
  ];

  return (
    <div className="min-h-screen flex bg-zinc-100 text-zinc-900 font-['Plus_Jakarta_Sans']">
      {/* Desktop Dark Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-zinc-900 text-zinc-200 border-r border-zinc-800 shrink-0">
        {/* Sidebar Brand */}
        <div className="px-5 py-5 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-extrabold tracking-tight text-white truncate">
              Prompt Hub Admin
            </div>
            <div className="text-[11px] text-zinc-400 truncate">Control Panel</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions: View Live Site & Logout */}
        <div className="p-3 border-t border-zinc-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Right Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Admin Top Bar */}
        <header className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 tracking-tight">
                Admin Dashboard
              </h2>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Signed in as <span className="font-semibold text-zinc-800">{currentUser.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 transition"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Admin Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-900 text-zinc-100 px-4 py-3 border-b border-zinc-800 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                      isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Active Admin Route View */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};