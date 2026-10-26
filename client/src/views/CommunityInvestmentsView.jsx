import React from 'react';
import { Coins, Sparkles, Shield, TrendingUp, Info, Lock } from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function CommunityInvestmentsView({ investments, onInvest }) {
  const commodityItems = investments.filter(i => i.type === 'commodity' || i.type === 'community');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner - Transparent Glass with Locked Future Option Badge */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-amber border-2 border-amber-500/40 border-dashed relative overflow-hidden backdrop-blur-md opacity-90 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>OPTION B – Hard Commodity Reserves & Bullion Holdings</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-200 text-xs font-mono font-extrabold shadow-sm">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>LOCKED • FUTURE OPTION</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Commodity & Asset Investments</span>
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            <strong className="text-amber-300">Notice: This module is locked as an upcoming Future Option.</strong> Physical 24K Gold, Pure 999 Silver, and Prime Commercial Land Parcels are currently displayed in a transparent preview mode with live depository rates. Investment participation will open in a future release.
          </p>

          <div className="mt-6 p-5 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-amber-500/30 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-amber-300 text-sm block">
                🔒 Future Option Showcase Mode
              </span>
              <p className="leading-relaxed">
                All commodity items are currently locked against new investment orders. Admin-controlled live rates and vault reserves are shown for platform transparency and preview calculations only.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Asset Rates Ticker (Transparent Preview) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {commodityItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel border border-amber-500/30 border-dashed opacity-80 hover:opacity-100 backdrop-blur-md flex items-center justify-between transition-all"
          >
            <div>
              <span className="text-xs font-semibold text-slate-400">{item.category} Live Rate</span>
              <p className="text-2xl font-black text-amber-300 mt-0.5">
                ₹{Number(item.rate).toLocaleString('en-IN')}
                <span className="text-xs font-medium text-slate-400 ml-1">/{item.unitName || 'unit'}</span>
              </p>
            </div>
            <span className="text-[11px] bg-amber-500/15 text-amber-300 font-bold px-2.5 py-1.5 rounded-xl border border-amber-500/30 font-mono shadow-sm flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              Future Option
            </span>
          </div>
        ))}
      </div>

      {/* Grid of Commodity Assets */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Commodity Reserve Vaults ({commodityItems.length})</span>
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🔒 Locked • Future Option
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                🎲 Includes 100% Target Lucky Draw Pool
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Vault assets are presented in transparent preview mode. Direct investments are locked for this future option.
            </p>
          </div>
          <span className="text-xs text-amber-300/80 font-mono shrink-0">
            🔒 Future platform release
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commodityItems.map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      </div>
    </div>
  );
}
