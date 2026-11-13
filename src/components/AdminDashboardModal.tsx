import React, { useState, useRef } from 'react';
import {
  X,
  ShieldCheck,
  PlusCircle,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Crown,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  createPromptInFirestore,
  deletePromptFromFirestore,
  deleteAllPromptsExcept,
  seedDatabaseIfEmpty
} from '../services/promptService';
import { INITIAL_CATEGORIES } from '../data/initialData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptItem[];
  onPromptAddedOrDeleted: () => void;
}

const compressImageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format.'));
      img.onload = () => {
        let maxWidth = 900;
        let dataUrl = '';

        for (let attempt = 0; attempt < 4; attempt++) {
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context unavailable.'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          while (dataUrl.length > 420000 && quality > 0.35) {
            quality -= 0.12;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          if (dataUrl.length <= 450000) break;
          maxWidth = Math.round(maxWidth * 0.72);
        }

        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onPromptAddedOrDeleted
}) => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'add' | 'manage'>('add');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Animal & Pets');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [promptText, setPromptText] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [viewsCount, setViewsCount] = useState('52.4M');
  const [modelRecommended, setModelRecommended] = useState('Kling AI 1.5');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');

  const [processingImage, setProcessingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [cleaningOthers, setCleaningOthers] = useState(false);
  const [confirmKeepLatest, setConfirmKeepLatest] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const sortedPrompts = [...prompts].sort(
    (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );
  const latestPrompt = sortedPrompts[0];

  const parseErrorText = (err: unknown, fallback: string) => {
    if (err instanceof Error) {
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) return parsed.error as string;
      } catch {
        return err.message;
      }
    }
    return fallback;
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }

    setProcessingImage(true);
    setStatusMessage(null);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setThumbnailUrl(dataUrl);
    } catch (err) {
      setStatusMessage({ type: 'error', text: parseErrorText(err, 'Failed to process image.') });
    } finally {
      setProcessingImage(false);
    }
  };

  const handleCreatePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptText.trim() || !thumbnailUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please provide a title, a prompt image (upload or URL), and the prompt text.'
      });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      await createPromptInFirestore({
        title: title.trim().toUpperCase(),
        category,
        thumbnail_url: thumbnailUrl.trim(),
        video_url: videoUrl.trim() || undefined,
        prompt_text: promptText.trim(),
        negative_prompt: negativePrompt.trim() || undefined,
        is_premium: isPremium,
        views_count: viewsCount.trim() || '10.0M',
        model_recommended: modelRecommended.trim() || undefined,
        aspect_ratio: aspectRatio,
        created_at: new Date().toISOString(),
        author_id: currentUser?.uid,
        author_email: currentUser?.email || undefined
      });

      setStatusMessage({ type: 'success', text: 'Prompt published to Firestore successfully!' });
      setTitle('');
      setPromptText('');
      setThumbnailUrl('');
      setVideoUrl('');
      setNegativePrompt('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onPromptAddedOrDeleted();
    } catch (err) {
      console.error('Failed to create prompt:', err);
      const detail = parseErrorText(err, 'Firestore write error.');
      setStatusMessage({
        type: 'error',
        text: `Failed to publish prompt (${currentUser?.email || 'not signed in'}, prompt: ${promptText.length} chars, image: ${Math.round(thumbnailUrl.length / 1024)}KB): ${detail}`
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePromptFromFirestore(id);
      setConfirmDeleteId(null);
      setStatusMessage({ type: 'success', text: 'Prompt deleted from Firestore.' });
      onPromptAddedOrDeleted();
    } catch (err) {
      console.error('Failed to delete prompt:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to delete prompt: ${parseErrorText(err, 'Permission denied')}`
      });
    }
  };

  const handleKeepOnlyLatest = async () => {
    if (!latestPrompt) return;
    setCleaningOthers(true);
    setStatusMessage(null);
    try {
      const removedCount = await deleteAllPromptsExcept(latestPrompt.id);
      setConfirmKeepLatest(false);
      setStatusMessage({
        type: 'success',
        text: removedCount > 0
          ? `Removed ${removedCount} older prompt(s). Only "${latestPrompt.title}" remains.`
          : `Only "${latestPrompt.title}" is currently in Firestore.`
      });
      onPromptAddedOrDeleted();
    } catch (err) {
      console.error('Failed to clean up prompts:', err);
      setStatusMessage({
        type: 'error',
        text: `Failed to remove other prompts: ${parseErrorText(err, 'Permission denied')}`
      });
    } finally {
      setCleaningOthers(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setStatusMessage(null);
    try {
      const count = await seedDatabaseIfEmpty();
      setStatusMessage({
        type: 'success',
        text: count > 0
          ? `Successfully synced ${count} curated viral prompts to Firestore!`
          : 'Firestore already contains prompts — synced cleanly!'
      });
      onPromptAddedOrDeleted();
    } catch (err) {
      console.error('Seeding error:', err);
      setStatusMessage({
        type: 'error',
        text: `Error seeding database: ${parseErrorText(err, 'Make sure you are signed in with an authorized admin account.')}`
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors ${
          isDark ? 'bg-[#141622] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between transition-colors ${
            isDark ? 'bg-[#10121a] border-white/10' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Admin Control Center
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 border border-blue-500/30">
                  FIRESTORE ADMIN
                </span>
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Logged in as: <strong className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{currentUser?.email || 'Not signed in'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div
          className={`px-6 pt-4 pb-2 border-b flex items-center justify-between gap-3 flex-wrap ${
            isDark ? 'bg-[#12141e] border-white/10' : 'bg-zinc-50/80 border-zinc-200'
          }`}
        >
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                  ? 'bg-white/5 text-zinc-400 hover:text-white'
                  : 'bg-zinc-200/80 text-zinc-700 hover:text-zinc-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add New Prompt
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isDark
                  ? 'bg-white/5 text-zinc-400 hover:text-white'
                  : 'bg-zinc-200/80 text-zinc-700 hover:text-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Manage All Prompts ({prompts.length})
            </button>
          </div>

          {/* Seed Button */}
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isDark
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700 shadow-xs'
            }`}
            title="Populate Firestore collection with curated starter prompts"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding...' : 'Seed Firestore'}</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? isDark
                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                  : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : isDark
                ? 'bg-red-950/70 border border-red-500/40 text-red-300'
                : 'bg-red-50 border border-red-300 text-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'add' ? (
            <form onSubmit={handleCreatePrompt} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    PROMPT TITLE (UPPERCASE)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ULTRA REALISTIC TINY CHEF HAMSTER COOKING PASTA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  >
                    {INITIAL_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tier: Free vs Premium */}
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    TIER ACCESS
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPremium(false)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        !isPremium
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDark
                          ? 'bg-[#0d0f17] text-zinc-400 border-white/10'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      FREE PROMPT
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPremium(true)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1 cursor-pointer ${
                        isPremium
                          ? 'bg-blue-600 text-white border-blue-500'
                          : isDark
                          ? 'bg-[#0d0f17] text-zinc-400 border-white/10'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      <Crown className="w-3 h-3" /> PREMIUM (VIP)
                    </button>
                  </div>
                </div>

                {/* Image Upload OR URL */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      PROMPT THUMBNAIL IMAGE
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          imageMode === 'upload'
                            ? 'bg-blue-600 text-white'
                            : isDark
                            ? 'bg-white/5 text-zinc-400 hover:text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Upload className="w-3 h-3" /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          imageMode === 'url'
                            ? 'bg-blue-600 text-white'
                            : isDark
                            ? 'bg-white/5 text-zinc-400 hover:text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <LinkIcon className="w-3 h-3" /> Paste URL
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <label
                        className={`flex-1 w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
                          isDark
                            ? 'bg-[#0d0f17] border-white/15 hover:border-blue-500/60 text-zinc-300'
                            : 'bg-zinc-50 border-zinc-300 hover:border-blue-500 text-zinc-700'
                        }`}
                      >
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-bold">
                          {processingImage ? 'Compressing image...' : 'Click to upload image (PNG, JPG, WebP)'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Automatically optimized for fast Firestore storage
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileSelect}
                          className="hidden"
                        />
                      </label>

                      {thumbnailUrl && (
                        <div className="relative w-28 h-24 rounded-xl overflow-hidden border border-zinc-300 dark:border-white/15 shrink-0">
                          <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnailUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={thumbnailUrl.startsWith('data:') ? '' : thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                          isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                      />
                      {thumbnailUrl && !thumbnailUrl.startsWith('data:') && (
                        <img
                          src={thumbnailUrl}
                          alt="Preview"
                          className="w-11 h-11 rounded-lg object-cover border border-zinc-200 shrink-0"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Video URL (Optional) */}
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    PREVIEW VIDEO URL (OPTIONAL MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../preview.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Recommended Model */}
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    RECOMMENDED AI MODEL
                  </label>
                  <input
                    type="text"
                    value={modelRecommended}
                    onChange={(e) => setModelRecommended(e.target.value)}
                    placeholder="e.g. Kling AI 1.5 / Runway Gen-3 Alpha"
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Aspect Ratio & Views */}
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      ASPECT RATIO
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9' | '1:1')}
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    >
                      <option value="9:16">9:16 (Vertical)</option>
                      <option value="16:9">16:9 (Cinematic)</option>
                      <option value="1:1">1:1 (Square)</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      VIEWS COUNT
                    </label>
                    <input
                      type="text"
                      value={viewsCount}
                      onChange={(e) => setViewsCount(e.target.value)}
                      placeholder="e.g. 149.2M"
                      className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      FULL PROMPT TEXT
                    </label>
                    <span className={`text-[11px] font-mono ${promptText.length > 50000 ? 'text-red-500 font-bold' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {promptText.length.toLocaleString()} / 50,000 chars
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={50000}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Write or paste the exact prompt..."
                    className={`w-full border rounded-xl p-3.5 text-xs font-mono focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                {/* Negative Prompt */}
                <div className="md:col-span-2">
                  <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    NEGATIVE PROMPT (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blur, low quality, artifacts, distorted anatomy, jitter..."
                    className={`w-full border rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-[#0d0f17] border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving || processingImage}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/25 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{saving ? 'Publishing to Firestore...' : 'Publish Prompt to Directory'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Manage Prompts List */
            <div className="space-y-3">
              <div className={`text-xs flex flex-wrap items-center justify-between gap-2 pb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <span>Showing {sortedPrompts.length} total prompt{sortedPrompts.length === 1 ? '' : 's'} (newest first)</span>

                {sortedPrompts.length > 1 && latestPrompt && (
                  confirmKeepLatest ? (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-[11px] font-semibold text-red-600 dark:text-red-300">
                        Keep only &ldquo;{latestPrompt.title.slice(0, 32)}{latestPrompt.title.length > 32 ? '...' : ''}&rdquo;?
                      </span>
                      <button
                        type="button"
                        onClick={handleKeepOnlyLatest}
                        disabled={cleaningOthers}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                      >
                        {cleaningOthers ? 'Removing...' : `Yes, Delete ${sortedPrompts.length - 1}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmKeepLatest(false)}
                        className="px-2 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmKeepLatest(true)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Keep Only Latest Prompt (Remove {sortedPrompts.length - 1})</span>
                    </button>
                  )
                )}
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {sortedPrompts.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition gap-3 ${
                      isDark
                        ? 'bg-[#0d0f17] border-white/10 hover:border-white/20'
                        : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.thumbnail_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {idx === 0 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase bg-blue-600 text-white">
                              LATEST
                            </span>
                          )}
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                              p.is_premium
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {p.is_premium ? 'VIP' : 'FREE'}
                          </span>
                          <span className="text-[10px] text-blue-600 font-bold uppercase truncate">
                            {p.category}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold truncate max-w-sm sm:max-w-md ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {p.title}
                        </h4>
                        <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          {p.views_count} views
                        </span>
                      </div>
                    </div>

                    {confirmDeleteId === p.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Delete prompt"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
