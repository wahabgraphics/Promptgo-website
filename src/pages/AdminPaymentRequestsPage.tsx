import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  ZoomIn,
  X,
  Mail,
  Hash
} from 'lucide-react';
import { PaymentRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  fetchPaymentRequests,
  approvePaymentRequest,
  rejectPaymentRequest
} from '../services/paymentService';

export const AdminPaymentRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'pending' | 'all'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<PaymentRequest | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadRequests = async (mode = filterMode) => {
    setLoading(true);
    try {
      const data = await fetchPaymentRequests(mode === 'pending');
      setRequests(data);
    } catch (err) {
      let msg = 'Failed to load payment requests.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) msg = parsed.error;
        } catch {
          msg = err.message;
        }
      }
      setNotice({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests(filterMode);
  }, [filterMode]);

  const handleApprove = async (req: PaymentRequest) => {
    setProcessingId(req.id);
    setNotice(null);
    try {
      await approvePaymentRequest(req.id, req.userId, currentUser?.email);
      setNotice({
        type: 'success',
        text: `Approved payment for ${req.userEmail}. User subscription is now Active.`
      });
      await loadRequests(filterMode);
    } catch (err) {
      let msg = 'Failed to approve payment request.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) msg = parsed.error;
        } catch {
          msg = err.message;
        }
      }
      setNotice({ type: 'error', text: msg });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: PaymentRequest) => {
    setProcessingId(req.id);
    setNotice(null);
    try {
      await rejectPaymentRequest(req.id, req.userId, currentUser?.email);
      setNotice({
        type: 'success',
        text: `Rejected payment for ${req.userEmail}. User status reset to Inactive.`
      });
      await loadRequests(filterMode);
    } catch (err) {
      let msg = 'Failed to reject payment request.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) msg = parsed.error;
        } catch {
          msg = err.message;
        }
      }
      setNotice({ type: 'error', text: msg });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span>Payment Requests</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Verify JazzCash, Easypaisa, and Bank Transfer screenshots to approve VIP subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-white border border-zinc-200 p-1">
            <button
              type="button"
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterMode === 'pending'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Pending Only
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              All History
            </button>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(filterMode)}
            className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition cursor-pointer"
            title="Refresh payment requests"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {notice && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="p-1 hover:bg-black/5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <RefreshCw className="w-7 h-7 text-zinc-400 animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold text-zinc-500">
            Loading manual payment requests...
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-2">
          <Clock className="w-10 h-10 text-zinc-300 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-800">
            {filterMode === 'pending'
              ? 'No Pending Payment Requests'
              : 'No Payment Requests Found'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {filterMode === 'pending'
              ? 'All submitted JazzCash, Easypaisa, and Bank Transfer receipts have been reviewed.'
              : 'No payment requests have been submitted by users yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => {
            const isPending = req.status === 'pending';
            const isBusy = processingId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
              >
                {/* Screenshot Preview + Metadata */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setPreviewScreenshot(req)}
                    className="relative group w-28 h-28 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shrink-0 cursor-pointer"
                    title="Click to zoom screenshot"
                  >
                    <img
                      src={req.screenshotUrl}
                      alt={`Receipt for ${req.trxId}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </button>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          req.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {req.status}
                      </span>

                      {req.paymentMethod && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {req.paymentMethod}
                        </span>
                      )}

                      <span className="text-[11px] text-zinc-400">
                        {new Date(req.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900 truncate">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{req.userEmail}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg w-fit">
                      <Hash className="w-3.5 h-3.5 text-blue-600" />
                      <span>TRX ID: {req.trxId}</span>
                    </div>

                    <p className="text-[11px] text-zinc-400 font-mono truncate">
                      User ID: {req.userId}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewScreenshot(req)}
                    className="px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition cursor-pointer"
                  >
                    View Receipt
                  </button>

                  {isPending && (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleApprove(req)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBusy ? 'Processing...' : 'Approve'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleReject(req)}
                        className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-size Screenshot Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setPreviewScreenshot(null)}
          />
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">
                  Payment Receipt — {previewScreenshot.userEmail}
                </h3>
                <p className="text-xs font-mono text-blue-600">
                  TRX ID: {previewScreenshot.trxId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-zinc-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewScreenshot.screenshotUrl}
                alt={`Full screenshot for ${previewScreenshot.trxId}`}
                className="max-w-full max-h-[68vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};