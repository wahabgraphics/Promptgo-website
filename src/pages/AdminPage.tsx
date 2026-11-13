import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Database,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Crown,
  Upload,
  Link as LinkIcon,
  X,
  Eye,
  Unlock,
  ArrowRight,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { PromptItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  fetchAllPrompts,
  createPromptInFirestore,
  deletePromptFromFirestore,
  deleteAllPromptsExcept,
  seedDatabaseIfEmpty
} from '../services/promptService';
import { INITIAL_CATEGORIES } from '../data/initialData';

interface AdminPageProps {
  section: 'dashboard' | 'add' | 'prompts';
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

export const AdminPage: React.FC<AdminPageProps> = ({ section }) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  // Add Prompt Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Animal & Pets');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('url');
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

  const loadPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const fetched = await fetchAllPrompts();
      setPrompts(fetched);
    } catch (err) {
      console.error('Error loading prompts in Admin:', err);
    } finally {
      setLoadingPrompts(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const sortedPrompts = [...prompts].sort(
    (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  );
  const latestPrompt = sortedPrompts[0];
  const freeCount = prompts.filter((p) => !p.is_premium).length;
  const vipCount = prompts.filter((p) => p.is_premium).length;

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
        text: 'Please provide a Title, Thumbnail Image (URL or file upload), and Prompt Text.'
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

      setStatusMessage({ type: 'success', text: 'Prompt saved to Firestore successfully!' });
      setTitle('');
      setPromptText('');
      setThumbnailUrl('');
      setVideoUrl('');
      setNegativePrompt('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadPrompts();
    } catch (err) {
      console.error('Failed to create prompt:', err);
      const detail = parseErrorText(err, 'Firestore write error.');
      setStatusMessage({
        type: 'error',
        text: `Failed to save prompt: ${detail}`
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
      await loadPrompts();
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
      await loadPrompts();
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
      await loadPrompts();
    } catch (err) {
      console.error('Seeding error:', err);
      setStatusMessage({
        type: 'error',
        text: `Error seeding database: ${parseErrorText(err, 'Permission denied')}`
      });
    } finally {
      setSeeding(false);
    }
  };

  const StatusAlert = statusMessage ? (
    <div
      className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 ${
        statusMessage.type === 'success'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {statusMessage.type === 'success' ? (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
        )}
        <span>{statusMessage.text}</span>
      </div>
      <button
        type="button"
        onClick={() => setStatusMessage(null)}
        className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  ) : null;

  const PromptsTable = (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900">
            Manage Prompts ({sortedPrompts.length})
          </h3>
          <p className="text-xs text-zinc-500">
            {loadingPrompts ? 'Loading Firestore records...' : 'Sorted newest first'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sortedPrompts.length > 1 && latestPrompt && (
            confirmKeepLatest ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-semibold text-red-700">
                  Keep only &ldquo;{latestPrompt.title.slice(0, 28)}{latestPrompt.title.length > 28 ? '...' : ''}&rdquo;?
                </span>
                <button
                  type="button"
                  onClick={handleKeepOnlyLatest}
                  disabled={cleaningOthers}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                >
                  {cleaningOthers ? 'Deleting...' : `Delete ${sortedPrompts.length - 1}`}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmKeepLatest(false)}
                  className="px-2 py-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmKeepLatest(true)}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Keep Only Latest ({sortedPrompts.length - 1} removed)</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding...' : 'Seed Starter Prompts'}</span>
          </button>
        </div>
      </div>

      {sortedPrompts.length === 0 ? (
        <div className="p-12 text-center text-xs text-zinc-500">
          {loadingPrompts ? 'Loading prompts...' : 'No prompts in Firestore yet. Add your first prompt above.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-3 px-5">Prompt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {sortedPrompts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-zinc-50/70 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <img
                        src={p.thumbnail_url}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {idx === 0 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-zinc-900 text-white uppercase">
                              LATEST
                            </span>
                          )}
                          <span className="font-bold text-zinc-900 truncate max-w-xs block">
                            {p.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500 truncate max-w-xs block font-mono">
                          {p.prompt_text}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-zinc-700 whitespace-nowrap">
                    {p.category}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                        p.is_premium
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {p.is_premium ? 'VIP' : 'FREE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-600 whitespace-nowrap">
                    {p.views_count}
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    {confirmDeleteId === p.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Dashboard Overview View (/admin)
  if (section === 'dashboard') {
    return (
      <div className="space-y-6">
        {StatusAlert}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Monitor your prompt catalog and publish new content to Firestore.
            </p>
          </div>
          <Link
            to="/admin/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Prompt
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Total Prompts</span>
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-zinc-900">{prompts.length}</div>
            <div className="mt-1 text-xs text-zinc-500">Live in directory</div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>Free Prompts</span>
              <Unlock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-600">{freeCount}</div>
            <div className="mt-1 text-xs text-zinc-500">Publicly accessible</div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <span>VIP Premium</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-3xl font-black text-blue-600">{vipCount}</div>
            <div className="mt-1 text-xs text-zinc-500">Requires $5/mo plan</div>
          </div>
        </div>

        {/* Quick Links Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/add"
            className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 p-5 flex items-center justify-between transition shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">Publish New Prompt</h3>
                <p className="text-xs text-zinc-500">Upload thumbnail image &amp; prompt text</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition" />
          </Link>

          <Link
            to="/admin/prompts"
            className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 p-5 flex items-center justify-between transition shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">View &amp; Manage Prompts</h3>
                <p className="text-xs text-zinc-500">Inspect, clean up, or delete entries</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition" />
          </Link>

          <Link
            to="/admin/payments"
            className="group bg-white rounded-2xl border border-zinc-200 hover:border-blue-400 p-5 flex items-center justify-between transition shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">Payment Requests</h3>
                <p className="text-xs text-zinc-500">Approve JazzCash / Easypaisa receipts</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 transition" />
          </Link>
        </div>

        {/* Manage Prompts Table directly on Dashboard */}
        {PromptsTable}
      </div>
    );
  }

  // View All Prompts (/admin/prompts)
  if (section === 'prompts') {
    return (
      <div className="space-y-6">
        {StatusAlert}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">All Prompts</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              View and delete prompts stored in your Firestore database.
            </p>
          </div>
          <Link
            to="/admin/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Prompt
          </Link>
        </div>

        {PromptsTable}
      </div>
    );
  }

  // Add New Prompt Form (/admin/add)
  return (
    <div className="space-y-6">
      {StatusAlert}

      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Add New Prompt</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Fill in the prompt details below to publish directly to the live directory.
        </p>
      </div>

      <form
        onSubmit={handleCreatePrompt}
        className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Prompt Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PAPER GRAPHICS ANIMATION EXPLAINER VIDEOS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              {INITIAL_CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Access */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Access Tier
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPremium(false)}
                className={`flex-1 py-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                  !isPremium
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-300 hover:bg-zinc-100'
                }`}
              >
                FREE PROMPT
              </button>
              <button
                type="button"
                onClick={() => setIsPremium(true)}
                className={`flex-1 py-3 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isPremium
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-300 hover:bg-zinc-100'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" /> PREMIUM (VIP)
              </button>
            </div>
          </div>

          {/* Thumbnail URL or File Upload */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Thumbnail Image (URL or File Upload)
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    imageMode === 'url'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" /> Thumbnail URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Upload className="w-3 h-3" /> Upload File
                </button>
              </div>
            </div>

            {imageMode === 'url' ? (
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnailUrl.startsWith('data:') ? '' : thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="flex-1 border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                />
                {thumbnailUrl && !thumbnailUrl.startsWith('data:') && (
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-300 shrink-0"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="flex-1 w-full border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition text-zinc-700">
                  <Upload className="w-5 h-5 text-zinc-700" />
                  <span className="text-xs font-bold">
                    {processingImage ? 'Optimizing image...' : 'Click to upload image (PNG, JPG, WebP)'}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Automatically compressed for Firestore
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
                  <div className="relative w-28 h-24 rounded-xl overflow-hidden border border-zinc-300 shrink-0">
                    <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Model & Video URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Recommended AI Model
            </label>
            <input
              type="text"
              value={modelRecommended}
              onChange={(e) => setModelRecommended(e.target.value)}
              placeholder="e.g. Kling AI 1.5 / Runway Gen-3 Alpha"
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Preview Video URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://.../preview.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          {/* Aspect Ratio & Views */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9' | '1:1')}
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              <option value="9:16">9:16 (Vertical)</option>
              <option value="16:9">16:9 (Cinematic)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Views Count
            </label>
            <input
              type="text"
              value={viewsCount}
              onChange={(e) => setViewsCount(e.target.value)}
              placeholder="e.g. 52.4M"
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          {/* Full Prompt Text */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Full Prompt Text
              </label>
              <span className="text-[11px] font-mono text-zinc-500">
                {promptText.length.toLocaleString()} / 50,000 chars
              </span>
            </div>
            <textarea
              required
              rows={6}
              maxLength={50000}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Paste the complete prompt text..."
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl p-4 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          {/* Negative Prompt */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
              Negative Prompt (Optional)
            </label>
            <textarea
              rows={2}
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blur, low quality, artifacts, distorted anatomy..."
              className="w-full border border-zinc-300 bg-zinc-50 rounded-xl p-3.5 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Large Save Prompt Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving || processingImage}
            className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{saving ? 'Saving Prompt...' : 'Save Prompt'}</span>
          </button>
        </div>
      </form>

      {/* Manage Prompts List below form for convenience */}
      {PromptsTable}
    </div>
  );
};