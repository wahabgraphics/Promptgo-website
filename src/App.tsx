import React, { useState, useEffect, useMemo } from 'react';
import { FreePromoSection } from './components/FreePromoSection';
import AdsterraBanner from './components/AdsterraBanner';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryTabs } from './components/CategoryTabs';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { PromptCard } from './components/PromptCard';
import { PromptModal } from './components/PromptModal';
import { MasterPromptsSection } from './components/MasterPromptsSection';
import { ToolsSection } from './components/ToolsSection';
import { CommunitySection } from './components/CommunitySection';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { AdminPaymentRequestsPage } from './pages/AdminPaymentRequestsPage';
import { PromptItem, MasterPromptGuide } from './types';
import { fetchAllPrompts, fetchAllMasterPrompts } from './services/promptService';
import { INITIAL_CATEGORIES } from './data/initialData';
import { Bookmark, RefreshCw, AlertCircle, ShieldAlert, X } from 'lucide-react';

function HomePage() {
  const { currentUser, userProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();

  const [accessDeniedNotice, setAccessDeniedNotice] = useState(
    Boolean((location.state as { accessDenied?: boolean } | null)?.accessDenied)
  );

  useEffect(() => {
    if ((location.state as { accessDenied?: boolean } | null)?.accessDenied) {
      setAccessDeniedNotice(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'prompts' | 'master' | 'tools' | 'community' | 'saved'>('prompts');

  // Prompts & Master Guides Data
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [masterGuides, setMasterGuides] = useState<MasterPromptGuide[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'views' | 'oldest'>('newest');

  // Modals
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleSubscribe = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setPaymentModalOpen(true);
  };

  // Load prompts from Firestore
  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedPrompts, fetchedGuides] = await Promise.all([
        fetchAllPrompts(),
        fetchAllMasterPrompts()
      ]);
      setPrompts(fetchedPrompts);
      setMasterGuides(fetchedGuides);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Categories': prompts.length,
      'Free': 0,
      'Premium': 0
    };

    prompts.forEach((p) => {
      if (p.is_premium) {
        counts['Premium'] = (counts['Premium'] || 0) + 1;
      } else {
        counts['Free'] = (counts['Free'] || 0) + 1;
      }

      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return counts;
  }, [prompts]);

  const parseViews = (viewsStr: string): number => {
    const raw = viewsStr.toUpperCase().trim();
    if (raw.endsWith('M')) {
      return parseFloat(raw) * 1_000_000;
    }
    if (raw.endsWith('K')) {
      return parseFloat(raw) * 1_000;
    }
    return parseFloat(raw) || 0;
  };

  // Filtered and sorted prompts
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    if (currentTab === 'saved') {
      const savedIds = userProfile?.saved_prompt_ids || [];
      result = result.filter((p) => savedIds.includes(p.id));
    }

    if (selectedCategory !== 'All Categories') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (tierFilter === 'free') {
      result = result.filter((p) => !p.is_premium);
    } else if (tierFilter === 'premium') {
      result = result.filter((p) => p.is_premium);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt_text.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.model_recommended?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      }
      if (sortBy === 'views') {
        return parseViews(b.views_count) - parseViews(a.views_count);
      }
      return 0;
    });

    return result;
  }, [prompts, currentTab, userProfile?.saved_prompt_ids, selectedCategory, tierFilter, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setTierFilter('all');
  };

  return (
    <div className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#2563eb] selection:text-white">
      {/* 1. HEADER CONTAINER (Full-width #2563eb Royal Blue, non-sticky) */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSubscribe={handleSubscribe}
        prompts={prompts}
        onSelectPrompt={(p: PromptItem) => setSelectedPrompt(p)}
      >
        {currentTab === 'prompts' && (
          <HeroSection
            totalPromptsCount={prompts.length || 12}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            tierFilter={tierFilter}
            setTierFilter={setTierFilter}
            categoryCounts={categoryCounts}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        )}
      </Header>

      {/* Adsterra Banner (Below Header) */}
      <div className="w-full overflow-x-auto flex justify-center py-4 bg-[#fafafa] dark:bg-[#0b0f19]">
        <AdsterraBanner />
      </div>

      {/* 2. MAIN BODY CONTAINER */}
      <main
        className={`flex-1 w-full py-10 sm:py-12 transition-colors ${
          isDark ? 'bg-[#0b0f19] text-white' : 'bg-[#fafafa] text-zinc-900'
        }`}
      >
        {accessDeniedNotice && (
          <div className="max-w-6xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Access Denied: Administrator privileges are required to access /admin.</span>
              </div>
              <button
                onClick={() => setAccessDeniedNotice(false)}
                className="p-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {currentTab === 'prompts' && (
          <>
            <FreePromoSection
              onOpenSubscribe={handleSubscribe}
              onExploreFree={() => {
                setTierFilter('all');
                window.scrollBy({ top: 320, behavior: 'smooth' });
              }}
            />

            <CategoryTabs
              totalPromptsCount={prompts.length || 12}
              filteredCount={filteredPrompts.length}
              searchQuery={searchQuery}
              tierFilter={tierFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={INITIAL_CATEGORIES}
              categoryCounts={categoryCounts}
              onResetFilters={handleResetFilters}
            />

            <SubscriptionBanner onOpenSubscribe={handleSubscribe} />

            <section className="max-w-6xl mx-auto px-4 mt-8">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-[#2563eb] animate-spin" />
                  <p className={`text-sm font-semibold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Loading viral AI prompts from database...
                  </p>
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div
                  className={`py-16 text-center rounded-3xl border p-8 max-w-lg mx-auto ${
                    isDark ? 'bg-[#141622] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                  }`}
                >
                  <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>No Prompts Found</h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Try adjusting your search terms or clearing your category filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-4 py-2 bg-[#2563eb] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrompts.map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      onSelect={(p) => setSelectedPrompt(p)}
                      onUnlockClick={handleSubscribe}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {currentTab === 'saved' && (
          <section className="max-w-6xl mx-auto px-4 animate-fade-in">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border ${
                  isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-[#2563eb]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Your Bookmarks
              </div>
              <h2
                className={`text-3xl font-black uppercase tracking-tight ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}
              >
                Saved <span className="text-[#2563eb]">Prompts</span>
              </h2>
              <p className={`text-sm mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Quick access to your curated viral collection
              </p>
            </div>

            {filteredPrompts.length === 0 ? (
              <div
                className={`py-16 text-center rounded-3xl border p-8 max-w-md mx-auto ${
                  isDark ? 'bg-[#141622] border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                }`}
              >
                <Bookmark className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>No Saved Prompts Yet</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Click the bookmark icon on any prompt card in the directory to save it here.
                </p>
                <button
                  onClick={() => setCurrentTab('prompts')}
                  className="mt-4 px-5 py-2 bg-[#2563eb] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  Explore Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onSelect={(p) => setSelectedPrompt(p)}
                    onUnlockClick={handleSubscribe}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {currentTab === 'master' && (
          <MasterPromptsSection
            guides={masterGuides}
            onOpenSubscribe={handleSubscribe}
          />
        )}

        {currentTab === 'tools' && <ToolsSection />}

        {currentTab === 'community' && <CommunitySection />}
      </main>

      {/* Adsterra Banner (Before Footer) */}
      <div className="w-full overflow-x-auto flex justify-center py-4 bg-[#fafafa] dark:bg-[#0b0f19]">
        <AdsterraBanner />
      </div>

      {/* 3. FOOTER CONTAINER */}
      <Footer
        setCurrentTab={setCurrentTab}
        onOpenSubscribe={handleSubscribe}
      />

      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          onOpenSubscribe={() => {
            setSelectedPrompt(null);
            handleSubscribe();
          }}
        />
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes (Uses #2563eb Header & Footer inside HomePage / LoginPage / ProfilePage) */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Hidden Admin Routes (Uses standalone AdminLayout without public Header/Footer) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminPage section="dashboard" />} />
              <Route path="add" element={<AdminPage section="add" />} />
              <Route path="prompts" element={<AdminPage section="prompts" />} />
              <Route path="payments" element={<AdminPaymentRequestsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}