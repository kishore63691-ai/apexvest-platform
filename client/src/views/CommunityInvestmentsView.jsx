import React from 'react';
import { Coins, Sparkles, Shield, TrendingUp, Info } from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function CommunityInvestmentsView({ investments, onInvest }) {
  const commodityItems = investments.filter(i => i.type === 'commodity' || i.type === 'community');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel-amber relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
            <Coins className="w-3.5 h-3.5" />
            <span>OPTION B – Hard Commodity Reserves & Bullion Holdings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Commodity & Asset Investments
          </h1>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Acquire fractional exposure to tangible stores of value: <strong>Physical 24K Gold</strong>, <strong>Pure 999 Silver</strong>, and <strong>Prime Commercial Land Parcels</strong>.
          </p>

          <div className="mt-6 p-5 rounded-2xl glass-panel border-white/10 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white text-sm block">
                Admin-Controlled Real-Time Rates
              </span>
              <p className="leading-relaxed">
                The platform Administrator updates and publishes official commodity valuation rates (e.g. <strong className="text-amber-300 font-bold">Gold Rate = ₹15,000</strong>). When the Admin modifies the rate in the Admin Panel, your active holdings and current portfolio values automatically re-evaluate in real time!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Asset Rates Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {commodityItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl glass-panel card-hover-glow border-white/10 flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-semibold text-slate-400">{item.category} Live Rate</span>
              <p className="text-2xl font-black text-amber-300 mt-0.5">
                ₹{Number(item.rate).toLocaleString('en-IN')}
                <span className="text-xs font-medium text-slate-400 ml-1">/{item.unitName || 'unit'}</span>
              </p>
            </div>
            <span className="text-[11px] bg-amber-500/15 text-amber-300 font-bold px-2.5 py-1.5 rounded-xl border border-amber-500/30 font-mono shadow-sm">
              Admin Managed
            </span>
          </div>
        ))}
      </div>

      {/* Grid of Commodity Assets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Commodity Reserve Vaults ({commodityItems.length})
          </h2>
          <span className="text-xs text-slate-400">
            Vault backing verified through monthly depository audits
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
