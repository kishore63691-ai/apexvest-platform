import React, { useState } from 'react';
import { Building, Sparkles, TrendingUp, CheckCircle, Calculator, ArrowRight } from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function BusinessFundingView({ investments, onInvest }) {
  const businessItems = investments.filter(i => i.type === 'business');
  const [calcAmount, setCalcAmount] = useState('1000');

  const lotsCount = Math.floor(Number(calcAmount || 0) / 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-emerald relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4">
            <Building className="w-3.5 h-3.5" />
            <span>OPTION A – Small & Medium Enterprise Co-Funding</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Business Investment Opportunities
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Allowing businesses across manufacturing, jute packaging, agritech, and clean energy to raise funds from everyday retail investors. Each business is vetted with equipment security and transparent quarterly yields.
          </p>

          {/* Lot Logic Explainer */}
          <div className="mt-6 p-5 rounded-2xl glass-panel border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Minimum Investment Standard
              </span>
              <p className="text-xl font-black text-white mt-0.5">
                ₹10 per Lot <span className="text-xs font-normal text-slate-400">(Fixed Platform Standard)</span>
              </p>
              <div className="flex gap-4 text-xs font-mono text-emerald-300/80 mt-1.5">
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">₹10 = 1 lot</span>
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">₹100 = 10 lots</span>
                <span className="bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">₹1,000 = 100 lots</span>
              </div>
            </div>

            {/* Quick Interactive Calculator Box */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 p-2.5 rounded-2xl border border-emerald-500/30 shadow-inner">
              <Calculator className="w-4 h-4 text-emerald-400 ml-1 shrink-0" />
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                placeholder="₹ Amount"
                className="w-28 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none transition"
              />
              <span className="text-xs text-slate-400 font-bold">=</span>
              <span className="text-xs font-extrabold text-emerald-300 px-2 bg-emerald-500/20 py-1.5 rounded-xl border border-emerald-500/30">
                {lotsCount.toLocaleString()} Lots
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Business Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Active Business Campaigns ({businessItems.length})
          </h2>
          <span className="text-xs text-slate-400">
            Progress updates only after Admin verifies payment
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessItems.map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      </div>
    </div>
  );
}
