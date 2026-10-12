import React from 'react';
import {
  TrendingUp, Shield, ArrowRight, CheckCircle2, Sparkles,
  Building, Coins, Clock, Lock, Award, Users, ChevronRight
} from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function HomeView({ investments, onInvest, onNavigate }) {
  const businessItems = investments.filter(i => i.type === 'business');
  const commodityItems = investments.filter(i => i.type === 'commodity' || i.type === 'community');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient atmospheric aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-amber-500/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center px-4">
          {/* Top Elite Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-500/30 text-emerald-300 text-xs font-bold mb-8 shadow-xl shimmer-badge">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="tracking-wide">NEXT-GENERATION INSTITUTIONAL CO-INVESTMENT & BULLION VAULTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Wealth Generation Through Real Assets at{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-from-font">
              ₹10 per Lot
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Co-own vetted Indian manufacturing powerhouses or protect your wealth with insured vault reserves in <strong>24K Gold</strong>, <strong>Pure 999 Silver</strong>, and <strong>Commercial Land Parcels</strong>.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('business')}
              className="px-8 py-4 btn-primary-emerald text-xs sm:text-sm flex items-center gap-3 shadow-2xl cursor-pointer group"
            >
              <span>Explore Businesses (₹10/Lot)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => onNavigate('community')}
              className="px-8 py-4 btn-primary-amber text-xs sm:text-sm flex items-center gap-3 shadow-2xl cursor-pointer group"
            >
              <Coins className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Bullion & Land Vaults</span>
            </button>
          </div>

          {/* Institutional Metric Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Entry Standard</span>
              <p className="text-2xl font-black text-white mt-1">₹10 <span className="text-xs font-semibold text-emerald-400">/ Lot</span></p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Accessible to all</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-emerald-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Disbursed</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">₹87.50L+</p>
              <span className="text-[10px] text-emerald-400/80 mt-0.5 block">100% Ledger Audited</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-amber-500/30">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Target Yield</span>
              <p className="text-2xl font-black text-amber-300 mt-1">14 - 18% <span className="text-xs font-semibold text-slate-400">p.a.</span></p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Quarterly Payouts</span>
            </div>
            <div className="p-4 rounded-2xl glass-panel card-hover-glow border-white/10">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Verification</span>
              <p className="text-2xl font-black text-white mt-1">100% Bank UTR</p>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct Admin Audit</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Investment Options Spotlight Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option A Banner */}
          <div className="p-7 rounded-3xl glass-panel-emerald card-hover-glow flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Building className="w-3.5 h-3.5" />
                <span>OPTION A – Business Investment</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Co-Fund Scalable Operating Businesses</h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Empower profitable manufacturing plants, agritech ventures, and solar grids. Start with as little as <strong className="text-emerald-300 font-bold">₹10 per lot</strong>. Automated lot calculation and quarterly profit disbursements.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-emerald-500/20">
              <span className="text-xs font-mono font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">₹10 = 1 Lot | ₹1,000 = 100 Lots</span>
              <button
                onClick={() => onNavigate('business')}
                className="btn-primary-emerald px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Businesses</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Option B Banner */}
          <div className="p-7 rounded-3xl glass-panel-amber card-hover-glow flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Coins className="w-3.5 h-3.5" />
                <span>OPTION B – Commodity & Asset Reserves</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Physical Gold, Silver & Commercial Land</h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Invest in real asset reserves where the <strong className="text-amber-300 font-bold">Admin controls and updates live market rates</strong> (e.g., Gold = ₹15,000). Your unit value reflects real-time spot rates with vault custody.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-amber-500/20">
              <span className="text-xs font-mono font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">Admin Managed Spot Rates</span>
              <button
                onClick={() => onNavigate('community')}
                className="btn-primary-amber px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Asset Vaults</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Business Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              High Growth Enterprises
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              Active Business Funding Opportunities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('business')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>View all businesses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessItems.slice(0, 3).map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      </section>

      {/* Featured Commodity Assets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Securitized Hard Assets
            </span>
            <h2 className="text-2xl font-black text-white mt-1">
              Commodity Asset Reserves (Gold, Silver, Land)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('community')}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>View all assets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commodityItems.slice(0, 3).map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      </section>

      {/* How It Works Visual Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 mb-8">
            How The Investment Process Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                1
              </span>
              <h4 className="text-sm font-bold text-white">Select Opportunity</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Pick a business or asset. Enter your investment amount and see lots/units automatically calculated.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                2
              </span>
              <h4 className="text-sm font-bold text-white">Scan UPI QR Code</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Scan the dynamic company UPI QR code using GPay, PhonePe, or Paytm with the exact payment amount.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-amber-500/20">
                3
              </span>
              <h4 className="text-sm font-bold text-white">Submit UTR Reference</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Provide your 12-digit transaction ID. Your investment status becomes <em className="text-amber-300">Payment Verification Pending</em>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 card-hover-glow relative">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm mb-4 shadow-lg shadow-emerald-500/20">
                4
              </span>
              <h4 className="text-sm font-bold text-white">Admin Verification</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Admin verifies the payment against the bank ledger. Once confirmed, your portfolio credits and progress updates!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl glass-panel border-white/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <h4 className="font-bold text-white text-sm">Regulatory Notice & Investment Disclaimer</h4>
            <p>
              ApexVest is a technology co-investment and asset-tracking platform. Investments in early-stage businesses, manufacturing facilities, and commodities carry capital risk. Returns are targeted based on commercial performance and are not guaranteed fixed returns. All transactions require verified banking/UPI references.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
