import React, { useState, useEffect } from 'react';
import {
  Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle,
  Building, Coins, ArrowUpRight, ArrowRight, ShieldCheck,
  RefreshCw, FileText, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InvestmentCard from '../components/InvestmentCard';

export default function DashboardView({ onInvest, onNavigate, investments }) {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalInvested: 0,
    confirmedCount: 0,
    pendingAmount: 0,
    pendingCount: 0,
    currentPortfolioValue: 0,
    totalReturns: 0,
    roiPercentage: 0
  });
  const [myInvestments, setMyInvestments] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch stats
      const statsRes = await fetch('/api/portfolio/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch user investments
      const invRes = await fetch('/api/portfolio/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        setMyInvestments(invData.investments || []);
      }

      // 3. Fetch user payments
      const payRes = await fetch('/api/payments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (payRes.ok) {
        const payData = await payRes.json();
        setMyPayments(payData.payments || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const pendingPayments = myPayments.filter(p => p.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-semibold text-emerald-400">Investor Portfolio Hub</span>
          <h1 className="text-2xl font-black text-white mt-0.5">
            Welcome back, {user?.name || 'Investor'}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Account ID: <span className="font-mono text-slate-300">{user?.id}</span> • Status: <span className="text-emerald-400 font-semibold">KYC Verified</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Portfolio</span>
          </button>
          <button
            onClick={() => onNavigate('investments')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            Invest More
          </button>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invested Amount */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Invested Amount</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white mt-2">
            ₹{stats.totalInvested.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Confirmed capital in active assets
          </span>
        </div>

        {/* Total Confirmed Investments */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Confirmed Holdings</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-300 mt-2">
            {stats.confirmedCount} <span className="text-xs font-normal text-slate-400">Assets</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Verified by Admin against UTR
          </span>
        </div>

        {/* Pending Investments */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Verification</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-300 mt-2">
            ₹{stats.pendingAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-amber-400/80 mt-1 block">
            {stats.pendingCount} payment(s) awaiting Admin
          </span>
        </div>

        {/* Investment Returns / Current Value */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Portfolio Market Value</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-300 mt-2">
            ₹{stats.currentPortfolioValue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
            +₹{stats.totalReturns.toLocaleString('en-IN')} ({stats.roiPercentage}% gain)
          </span>
        </div>
      </div>

      {/* Pending Payment Notification Banner if any */}
      {pendingPayments.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">
                {pendingPayments.length} Payment Verification(s) in Progress
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Your submitted payments are currently being audited by the Admin team against bank UTR references. Your investment progress bar and active portfolio will update immediately upon approval.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs whitespace-nowrap"
          >
            Track Status
          </button>
        </div>
      )}

      {/* Recent Investments Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">My Active Investments</h3>
            <p className="text-xs text-slate-400">Directly held business lots and bullion units</p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View Full Portfolio</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {myInvestments.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
            <p className="text-xs font-semibold text-white">No confirmed investments yet</p>
            <p className="text-[11px] text-slate-500 mt-1">Start co-funding a business for ₹10/lot or secure gold vault fractions.</p>
            <button
              onClick={() => onNavigate('investments')}
              className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              Explore Opportunities
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">Investment ID</th>
                  <th className="py-2.5 px-3">Opportunity</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount Invested</th>
                  <th className="py-2.5 px-3">Allocated Lots/Units</th>
                  <th className="py-2.5 px-3">Current Value</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {myInvestments.slice(0, 4).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-mono text-slate-300 font-semibold">{inv.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{inv.investmentTitle}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inv.investmentType === 'business'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {inv.investmentType === 'business' ? 'Business' : 'Commodity'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">₹{inv.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{inv.lots.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">₹{inv.currentValue.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Featured Opportunities Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Current Investment Opportunities</h3>
            <p className="text-xs text-slate-400">Available co-funding and asset vault campaigns</p>
          </div>
          <button
            onClick={() => onNavigate('investments')}
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.slice(0, 3).map((item) => (
            <InvestmentCard key={item.id} investment={item} onInvest={onInvest} />
          ))}
        </div>
      </div>
    </div>
  );
}
