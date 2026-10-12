import React, { useState, useEffect } from 'react';
import {
  PieChart, TrendingUp, Calendar, Hash, ArrowUpRight,
  Shield, CheckCircle2, Building, Coins, X, ExternalLink, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyInvestmentsView({ onNavigate }) {
  const { token } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const fetchInvestments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvestments(data.investments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [token]);

  const filtered = investments.filter(inv => {
    if (filterType !== 'all') {
      if (filterType === 'commodity') {
        if (inv.investmentType !== 'commodity' && inv.investmentType !== 'community') return false;
      } else if (inv.investmentType !== filterType) {
        return false;
      }
    }
    return true;
  });

  const totalInvested = filtered.reduce((acc, i) => acc + Number(i.amount), 0);
  const totalValue = filtered.reduce((acc, i) => acc + Number(i.currentValue), 0);
  const totalGains = Math.max(0, totalValue - totalInvested);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Portfolio Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            My Confirmed Investments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detailed ledger of verified holdings, allocated units, and real-time market value.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchInvestments}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('investments')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
          >
            + New Investment
          </button>
        </div>
      </div>

      {/* Portfolio Totals Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs text-slate-400">Total Confirmed Capital</span>
          <p className="text-2xl font-black text-white mt-1">
            ₹{totalInvested.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="md:border-l border-slate-800 md:pl-6">
          <span className="text-xs text-slate-400">Current Portfolio Value</span>
          <p className="text-2xl font-black text-blue-400 mt-1">
            ₹{totalValue.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="md:border-l border-slate-800 md:pl-6">
          <span className="text-xs text-slate-400">Accrued Return / Appreciation</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            +₹{totalGains.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Type Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Assets ({investments.length})
        </button>
        <button
          onClick={() => setFilterType('business')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            filterType === 'business' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-emerald-400'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          Business Lots
        </button>
        <button
          onClick={() => setFilterType('commodity')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
            filterType === 'commodity' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-amber-400'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Commodity Asset Reserves
        </button>
      </div>

      {/* Table & Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <PieChart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No confirmed investments in this category</p>
          <p className="text-xs text-slate-500 mt-1">Investments appear here only after Admin verifies the transaction.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Investment ID</th>
                  <th className="py-3 px-4">Opportunity</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount Invested</th>
                  <th className="py-3 px-4">Allocated Lots/Units</th>
                  <th className="py-3 px-4">Rate at Purchase</th>
                  <th className="py-3 px-4">Current Rate</th>
                  <th className="py-3 px-4">Current Value</th>
                  <th className="py-3 px-4">Transaction UTR</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvestment(inv)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {inv.investmentTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inv.investmentType === 'business'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {inv.investmentType === 'business' ? 'Business' : 'Commodity'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                      {inv.lots.toLocaleString()} {inv.investmentType === 'business' ? 'Lots' : 'Units'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      ₹{inv.rateAtInvestment.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-amber-300 font-semibold">
                      ₹{inv.currentRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{inv.currentValue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {inv.transactionId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvestment(inv);
                        }}
                        className="text-xs text-slate-400 hover:text-emerald-400"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investment Detail Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${selectedInvestment.investmentType === 'business' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {selectedInvestment.investmentType === 'business' ? <Building className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedInvestment.id}</span>
                  <h3 className="text-base font-bold text-white">{selectedInvestment.investmentTitle}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvestment(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Investment Type:</span>
                <span className="font-semibold text-white capitalize">{selectedInvestment.investmentType} Investment</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount Invested:</span>
                <span className="font-bold text-white">₹{selectedInvestment.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Units / Lots Allocated:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {selectedInvestment.lots.toLocaleString()} {selectedInvestment.investmentType === 'business' ? 'Lots' : 'Units'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Rate at Investment:</span>
                <span className="font-mono text-slate-300">₹{selectedInvestment.rateAtInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Market Rate:</span>
                <span className="font-mono text-amber-400 font-bold">₹{selectedInvestment.currentRate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Market Value:</span>
                <span className="font-bold text-emerald-400 text-sm">₹{selectedInvestment.currentValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID (UTR):</span>
                <span className="font-mono text-white">{selectedInvestment.transactionId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Verification Date:</span>
                <span className="text-slate-300">{new Date(selectedInvestment.purchaseDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Payment Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                  Confirmed by Admin
                </span>
              </div>

              {/* Admin Uploaded Verification Proof */}
              {selectedInvestment.adminProofUrl && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Official Bank / Verification Proof from Admin:</span>
                  </span>
                  <a
                    href={selectedInvestment.adminProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block group relative rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 hover:border-amber-400 transition"
                  >
                    <img
                      src={selectedInvestment.adminProofUrl}
                      alt="Admin confirmation proof"
                      className="w-full max-h-44 object-contain bg-slate-950 p-2"
                    />
                    <div className="p-2 bg-slate-950/90 text-center text-[10px] text-amber-300 font-medium group-hover:underline">
                      🔍 Click to view full verification receipt
                    </div>
                  </a>
                  {selectedInvestment.adminNotes && (
                    <p className="text-[11px] text-slate-400 italic">
                      Admin note: "{selectedInvestment.adminNotes}"
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedInvestment(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
