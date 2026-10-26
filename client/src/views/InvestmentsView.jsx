import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Building, Coins, Sparkles, RefreshCw, Lock } from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

export default function InvestmentsView({ investments, onInvest, onRefresh }) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'Jute Business', 'AgriTech', 'Clean Energy', 'Gold', 'Silver', 'Land'];

  const filtered = investments.filter((item) => {
    // Type filter
    if (selectedType !== 'all') {
      if (selectedType === 'commodity') {
        if (item.type !== 'commodity' && item.type !== 'community') return false;
      } else if (item.type !== selectedType) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Status filter
    if (selectedStatus === 'active' && item.status !== 'active') return false;
    if (selectedStatus === 'fully_funded' && item.status !== 'fully_funded') return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Marketplace Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            All Investment Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover verified business co-funding deals from ₹10/lot and physical asset vaults.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start md:self-auto px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 glass-panel rounded-3xl border-white/10 space-y-4">
        {/* Top search & type switches */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business name, gold, silver, land, category..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition shadow-inner"
            />
          </div>

          {/* Type Switcher */}
          <div className="flex gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedType === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('business')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                selectedType === 'business' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              Business Funding
            </button>
            <button
              onClick={() => setSelectedType('commodity')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                selectedType === 'commodity' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Commodity Assets</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-200 border border-amber-500/30 font-mono font-bold flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                Future Option
              </span>
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}

          {/* Status filter toggle */}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[11px] text-slate-500 mr-1">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Opportunities</option>
              <option value="active">Active Only</option>
              <option value="fully_funded">Fully Funded Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Commodity Future Option Transparent Notice */}
      {selectedType === 'commodity' && (
        <div className="p-4 rounded-2xl glass-panel-amber border border-amber-500/40 border-dashed backdrop-blur-md opacity-85 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Commodity Reserves are locked as a Future Option</p>
              <p className="text-[11px] text-slate-300">Physical bullion and land vaults are presented in transparent preview mode only.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 font-bold">
            🔒 PREVIEW ONLY
          </span>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Showing <strong>{filtered.length}</strong> investment opportunities</span>
        {(search || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedType('all');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
            className="text-emerald-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white text-sm">No investment opportunities found</p>
          <p className="text-xs text-slate-500 mt-1">Try modifying your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      )}
    </div>
  );
}
