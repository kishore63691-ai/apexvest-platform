import React, { useState } from 'react';
import {
  TrendingUp, Users, Calendar, Shield, ArrowUpRight,
  Sparkles, CheckCircle2, Lock, Building, Coins, Trophy,
  FileCheck, Eye
} from 'lucide-react';
import WinnerProofModal from './WinnerProofModal';

export default function InvestmentCard({ investment, onInvest }) {
  const isBusiness = investment.type === 'business';
  const isFullyFunded = investment.status === 'fully_funded' || (investment.raisedAmount && investment.raisedAmount >= investment.targetAmount);
  const isInactive = investment.status === 'inactive';

  const [previewAmount, setPreviewAmount] = useState(investment.minInvestment || 10);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);

  const calculatedLots = isBusiness
    ? Math.floor(previewAmount / (investment.rate || 10))
    : Number((previewAmount / (investment.rate || 1)).toFixed(4));

  const progress = Math.min(100, investment.progressPercentage || 0);
  const winner = investment.winner;

  return (
    <>
      <div className={`glass-panel card-hover-glow rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group relative ${
        isFullyFunded ? 'border-amber-500/40 shadow-amber-500/10' : 'hover:border-emerald-500/40'
      }`}>
        {/* Header Image & Badges */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-950">
          <img
            src={investment.image}
            alt={investment.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/40 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-xl backdrop-blur-md border shadow-md ${
              isBusiness
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
            }`}>
              {investment.category}
            </span>

            {isFullyFunded ? (
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center gap-1 shadow-lg shadow-amber-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                Target Reached (100%)
              </span>
            ) : isInactive ? (
              <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-slate-800 text-slate-400">
                Paused
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-slate-950/80 text-slate-200 border border-slate-700/60 backdrop-blur-md">
                {investment.riskLevel} Risk
              </span>
            )}
          </div>

          {/* Floating Rate Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                {isBusiness ? 'Lot Price' : 'Admin Spot Rate'}
              </span>
              <span className="text-lg font-black text-white drop-shadow">
                ₹{Number(investment.rate).toLocaleString('en-IN')}
                <span className="text-xs font-medium text-slate-300 ml-1">
                  {isBusiness ? '/ lot' : `/${investment.unitName || 'unit'}`}
                </span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-semibold">
                Expected Return
              </span>
              <span className="text-xs font-bold text-white bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                {investment.expectedReturn}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
              {investment.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {investment.description}
            </p>
          </div>

          {/* Lucky Winner Highlight Banner if Target Reached (Commodity Only) */}
          {!isBusiness && winner && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Lucky Winner: {winner.userName}</span>
                </div>
                <span className="text-xs font-black text-amber-300">
                  ₹{Number(winner.amountWon).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWinnerModalOpen(true)}
                className="mt-2 w-full py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] flex items-center justify-center gap-1 border border-amber-500/30 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Payout Proof & Winner Certificate</span>
              </button>
            </div>
          )}

          {/* Business Funding Completion Banner */}
          {isBusiness && isFullyFunded && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center gap-2 text-emerald-300">
              <Building className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Capital Raised • Active Business Operations & Quarterly Yields</span>
            </div>
          )}

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Target</span>
              <span className="text-xs font-bold text-white mt-0.5 block">
                ₹{(investment.targetAmount / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="border-x border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Raised</span>
              <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                ₹{(investment.raisedAmount / 100000).toFixed(2)}L
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Remaining</span>
              <span className="text-xs font-bold text-slate-300 mt-0.5 block">
                ₹{(Math.max(0, investment.targetAmount - investment.raisedAmount) / 100000).toFixed(2)}L
              </span>
            </div>
          </div>

          {/* Visual Progress Bar System */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-[11px] font-medium">
                  ₹{Number(investment.raisedAmount).toLocaleString('en-IN')} / ₹{Number(investment.targetAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <span className={`font-bold text-xs ${isFullyFunded ? (isBusiness ? 'text-emerald-400' : 'text-amber-400') : 'text-emerald-400'}`}>
                {progress}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  progress >= 100
                    ? (isBusiness ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400')
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Metadata info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{investment.investorCount || 0} Investors</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{investment.tenure}</span>
            </div>
            <div className="flex items-center gap-1 font-medium text-slate-300">
              <span>Min: ₹{investment.minInvestment}</span>
            </div>
          </div>

          {/* Interactive CTA */}
          <div className="pt-2">
            {isFullyFunded ? (
              <div className="space-y-1.5">
                <button
                  disabled
                  className="w-full py-3 rounded-2xl bg-slate-800/80 text-slate-400 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700/50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Target Reached • Investments Closed</span>
                </button>
                {!isBusiness && !winner && (
                  <p className="text-[10px] text-center text-amber-400 font-semibold animate-pulse">
                    🎲 Target reached! Lucky Draw is being conducted for this Commodity Reserve.
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => onInvest(investment)}
                className="w-full py-3 rounded-2xl btn-primary-emerald text-xs font-black flex items-center justify-center gap-2 group/btn"
              >
                <span>INVEST NOW</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Winner and Payout Proof Modal */}
      <WinnerProofModal
        investment={investment}
        isOpen={winnerModalOpen}
        onClose={() => setWinnerModalOpen(false)}
      />
    </>
  );
}
