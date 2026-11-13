import React, { useRef, useState } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Upload,
  Copy,
  Check,
  Smartphone,
  Building2,
  Clock,
  AlertCircle,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_ACCOUNTS: {
  method: PaymentMethod;
  label: string;
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
}[] = [
  {
    method: 'JazzCash',
    label: 'JazzCash Mobile Account',
    accountTitle: 'AI Prompt Hub (Shayan)',
    accountNumber: '0300-1234567'
  },
  {
    method: 'Easypaisa',
    label: 'Easypaisa Mobile Account',
    accountTitle: 'AI Prompt Hub (Shayan)',
    accountNumber: '0345-1234567'
  },
  {
    method: 'Bank Transfer',
    label: 'Bank Transfer (IBFT / Raast)',
    bankName: 'Meezan Bank',
    accountTitle: 'AI Prompt Hub',
    accountNumber: 'PK00MEZN0000000000000000'
  }
];

const compressScreenshotToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read screenshot file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
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

          let quality = 0.8;
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

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    subscriptionStatus,
    loginAsMember,
    submitPaymentProof
  } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('JazzCash');
  const [trxId, setTrxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [processingImage, setProcessingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image screenshot (PNG, JPG, WebP).');
      return;
    }

    setProcessingImage(true);
    setError(null);
    try {
      const base64 = await compressScreenshotToBase64(file);
      setScreenshotUrl(base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process screenshot.');
    } finally {
      setProcessingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      await loginAsMember();
      return;
    }

    if (!trxId.trim()) {
      setError('Please enter your Transaction ID (TRX ID).');
      return;
    }

    if (!screenshotUrl) {
      setError('Please upload a screenshot of your payment receipt.');
      return;
    }

    setSubmitting(true);
    try {
      await submitPaymentProof(trxId.trim(), screenshotUrl, selectedMethod);
      setSubmittedMessage('Payment submitted. Please wait for admin approval.');
      setTrxId('');
      setScreenshotUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      let detail = 'Could not submit payment proof. Please try again.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) detail = parsed.error;
        } catch {
          detail = err.message;
        }
      }
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div
        className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors ${
          isDark ? 'bg-[#141622] border-white/15 text-white' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#10121a] border-white/10' : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Crown className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider">
                VIP Subscription — $5/month (PKR 1,400)
              </h2>
              <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Pay via JazzCash, Easypaisa, or Bank Transfer &amp; upload receipt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition cursor-pointer ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/10'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border-zinc-200'
            }`}
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {submittedMessage || subscriptionStatus === 'pending' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black">
                {submittedMessage || 'Payment Submitted & Pending Approval'}
              </h3>
              <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                Our admin is verifying your Transaction ID and payment screenshot. Your account status is currently{' '}
                <strong className="text-amber-500 uppercase">Pending</strong> and will switch to{' '}
                <strong className="text-emerald-500 uppercase">Active</strong> shortly.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Return to Directory
              </button>
            </div>
          ) : subscriptionStatus === 'active' ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black">Your VIP Subscription is Active!</h3>
              <p className={`text-xs sm:text-sm max-w-md mx-auto ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                You already have full access to all Premium prompts and Master guides.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Browse Prompts
              </button>
            </div>
          ) : (
            <>
              {!currentUser && (
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                    isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                      Sign In Required
                    </span>
                    <span className={`text-xs ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      Sign in with Google so we can link your payment to your account.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => loginAsMember()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer transition"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}

              {/* Step 1: Payment Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                    Step 1 — Send $5/month (PKR 1,400) to Any Account
                  </h3>
                </div>

                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_ACCOUNTS.map((acc) => {
                    const active = selectedMethod === acc.method;
                    return (
                      <button
                        key={acc.method}
                        type="button"
                        onClick={() => setSelectedMethod(acc.method)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        {acc.method === 'Bank Transfer' ? (
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span className="truncate">{acc.method}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Account Details Card */}
                {PAYMENT_ACCOUNTS.filter((a) => a.method === selectedMethod).map((acc) => (
                  <div
                    key={acc.method}
                    className={`p-4 rounded-2xl border space-y-2.5 ${
                      isDark ? 'bg-[#0b0f19] border-white/10' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Method</span>
                      <span className="font-bold">{acc.label}</span>
                    </div>
                    {acc.bankName && (
                      <div className="flex items-center justify-between text-xs">
                        <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Bank Name</span>
                        <span className="font-bold">{acc.bankName}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Account Title</span>
                      <span className="font-bold">{acc.accountTitle}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs pt-1 border-t border-zinc-200 dark:border-white/10">
                      <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Account / IBAN</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">
                          {acc.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyValue(acc.method, acc.accountNumber)}
                          className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                            isDark
                              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-zinc-200'
                              : 'bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {copiedField === acc.method ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Step 2: Submit Proof Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Step 2 — Submit Transaction Proof
                </h3>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}
                  >
                    Transaction ID (TRX ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 084512938471 or Bank Ref #"
                    className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 ${
                      isDark
                        ? 'bg-[#0b0f19] border-white/10 text-white'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-zinc-300' : 'text-zinc-700'
                    }`}
                  >
                    Upload Payment Screenshot
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <label
                      className={`flex-1 w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition ${
                        isDark
                          ? 'border-white/15 hover:border-blue-500 bg-[#0b0f19] text-zinc-300'
                          : 'border-zinc-300 hover:border-blue-500 bg-zinc-50 text-zinc-700'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-bold">
                        {processingImage
                          ? 'Compressing screenshot...'
                          : 'Click to upload payment screenshot (PNG, JPG)'}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Automatically optimized for quick admin verification
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                    </label>

                    {screenshotUrl && (
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-zinc-300 dark:border-white/15 shrink-0">
                        <img
                          src={screenshotUrl}
                          alt="Payment screenshot preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotUrl('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/75 text-white hover:bg-red-600 transition cursor-pointer"
                          aria-label="Remove screenshot"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || processingImage}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Payment...' : 'Submit Payment for Approval'}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
