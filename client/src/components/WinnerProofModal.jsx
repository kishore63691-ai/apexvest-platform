import React, { useState } from 'react';
import {
  Trophy, CheckCircle2, ShieldCheck, ExternalLink, X,
  Clock, FileText, Download, Sparkles, Building, Coins, AlertCircle
} from 'lucide-react';

export default function WinnerProofModal({ investment, isOpen, onClose }) {
  const [zoomImage, setZoomImage] = useState(false);

  if (!isOpen || !investment || !investment.winner) return null;

  const winner = investment.winner;
  const isDisbursed = winner.payoutStatus === 'disbursed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Golden Celebration Header */}
        <div className="p-6 bg-gradient-to-b from-amber-500/20 via-slate-900/80 to-slate-900 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Target Reached • Lucky Winner Selected
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                {investment.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Winner Hero Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Randomly Selected Winner
              </span>
              <p className="text-base font-black text-white mt-0.5">
                {winner.userName}
              </p>
              <span className="text-[11px] font-mono text-slate-400">
                User ID: {winner.userId?.slice(0, 5)}***
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                Full Target Amount Won
              </span>
              <p className="text-xl font-black text-amber-300 mt-0.5">
                ₹{Number(winner.amountWon).toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold">
                100% Target Pool Awarded
              </span>
            </div>
          </div>

          {/* Details Ledger */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Date of Draw:</span>
              <span className="font-semibold text-white">
                {new Date(winner.selectedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Selection Method:</span>
              <span className="text-slate-300 font-medium">
                Verified Random Investor Selection
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Payout Status:</span>
              <span>
                {isDisbursed ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Disbursed & Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Payout Processing
                  </span>
                )}
              </span>
            </div>

            {winner.payoutTxnId && (
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Bank Transfer / UTR Ref:</span>
                <span className="font-mono font-bold text-amber-300 text-xs">
                  {winner.payoutTxnId}
                </span>
              </div>
            )}

            {winner.payoutNotes && (
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Admin Remarks:</span>
                <span className="text-slate-300 font-medium">
                  {winner.payoutNotes}
                </span>
              </div>
            )}
          </div>

          {/* Proof of Payment Image Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4 text-emerald-400" />
                Proof of Payout / Bank Transfer Receipt
              </span>
              {winner.payoutProofUrl && (
                <a
                  href={winner.payoutProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {winner.payoutProofUrl ? (
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 p-2 text-center group relative">
                <img
                  src={winner.payoutProofUrl}
                  alt="Bank transfer proof"
                  onClick={() => setZoomImage(!zoomImage)}
                  className="w-full max-h-64 object-contain rounded-xl cursor-pointer hover:opacity-95 transition"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Click image to expand / zoom
                </span>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-dashed border-slate-800 text-center text-slate-400 space-y-1">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />
                <p className="font-semibold text-white text-xs">Payout Transfer in Progress</p>
                <p className="text-[11px] text-slate-500">
                  The administrator is completing the banking transfer of ₹{Number(winner.amountWon).toLocaleString('en-IN')}. The official bank UTR transfer proof will appear here once finalized.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
