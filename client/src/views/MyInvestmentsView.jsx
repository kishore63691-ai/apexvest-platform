import React, { useState, useEffect } from 'react';
import {
  PieChart, TrendingUp, Calendar, Hash, ArrowUpRight,
  Shield, CheckCircle2, Building, Coins, X, ExternalLink, RefreshCw,
  Clock, ArrowDownCircle, AlertCircle, FileCheck, Landmark, Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MyInvestmentsView({ onNavigate }) {
  const { user, token } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [filterType, setFilterType] = useState('all');

  // Withdrawal Request Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawingInvestment, setWithdrawingInvestment] = useState(null);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawMessage, setWithdrawMessage] = useState({ text: '', type: '' });
  const [withdrawForm, setWithdrawForm] = useState({
    payoutMethod: 'bank',
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    upiId: '',
    userNotes: ''
  });

  // Calculate Tenure & Maturity status
  const getTenureStatus = (inv) => {
    const tenureStr = inv.tenure || inv.investmentDetails?.tenure || 'Flexible Liquidity';
    const isFlexible = tenureStr.toLowerCase().includes('flexible');
    if (isFlexible) {
      return { isMatured: true, label: 'Flexible Liquidity', detail: 'Instant Withdrawal Eligible' };
    }

    const match = tenureStr.match(/(\d+)\s*month/i);
    const requiredMonths = match ? parseInt(match[1], 10) : 0;
    if (requiredMonths === 0) {
      return { isMatured: true, label: tenureStr, detail: 'Matured' };
    }

    const purchase = new Date(inv.purchaseDate || inv.createdAt || Date.now());
    const now = new Date();
    const diffMonths = (now.getFullYear() - purchase.getFullYear()) * 12 + (now.getMonth() - purchase.getMonth());
    const daysElapsed = Math.floor((now - purchase) / (1000 * 60 * 60 * 24));

    // For demo/realistic simulation: if purchase was in previous months or elapsed
    const isMatured = diffMonths >= requiredMonths || daysElapsed >= 30; // allows testing older/matured investments
    return {
      isMatured,
      label: tenureStr,
      detail: isMatured ? 'Tenure Completed • Matured' : `${requiredMonths} Months Tenure`
    };
  };

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

  const handleOpenWithdrawModal = (inv) => {
    setWithdrawingInvestment(inv);
    setWithdrawMessage({ text: '', type: '' });
    setWithdrawForm({
      payoutMethod: 'bank',
      accountHolder: user?.name || '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      upiId: '',
      userNotes: ''
    });
    setWithdrawModalOpen(true);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawingInvestment) return;
    setWithdrawSubmitting(true);
    setWithdrawMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/portfolio/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userInvestmentId: withdrawingInvestment.id,
          ...withdrawForm
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit withdrawal request.');

      setWithdrawMessage({ text: 'Withdrawal request submitted successfully! Admin will review and process payout.', type: 'success' });
      setTimeout(() => {
        setWithdrawModalOpen(false);
        setWithdrawingInvestment(null);
        fetchInvestments();
      }, 1500);
    } catch (err) {
      setWithdrawMessage({ text: err.message, type: 'error' });
    } finally {
      setWithdrawSubmitting(false);
    }
  };

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
                  <th className="py-3 px-4">Opportunity & Tenure</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount Invested</th>
                  <th className="py-3 px-4">Allocated Units</th>
                  <th className="py-3 px-4">Rate at Purchase</th>
                  <th className="py-3 px-4">Current Rate</th>
                  <th className="py-3 px-4">Current Value</th>
                  <th className="py-3 px-4">UTR</th>
                  <th className="py-3 px-4">Withdrawal Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((inv) => {
                  const tenure = getTenureStatus(inv);
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvestment(inv)}
                      className="hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {inv.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{inv.investmentTitle}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            tenure.isMatured ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                          }`}>
                            ⏱ {tenure.label}
                          </span>
                          {tenure.isMatured && (
                            <span className="text-[9px] text-emerald-400 font-bold">Matured</span>
                          )}
                        </div>
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
                        {inv.withdrawalStatus === 'approved' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Disbursed & Paid
                          </span>
                        ) : inv.withdrawalStatus === 'pending' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px] flex items-center gap-1 w-fit animate-pulse">
                            <Clock className="w-3 h-3" />
                            Pending Admin
                          </span>
                        ) : inv.withdrawalStatus === 'rejected' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                            <X className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            Active Holding
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {(!inv.withdrawalStatus || inv.withdrawalStatus === 'rejected') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWithdrawModal(inv);
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                            >
                              <ArrowDownCircle className="w-3 h-3" />
                              <span>Withdraw</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvestment(inv);
                            }}
                            className="text-xs text-slate-400 hover:text-emerald-400 font-semibold"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Investment Detail Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[90vh] overflow-y-auto">
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
                <span className="text-slate-400">Tenure / Time Limit:</span>
                <span className="font-semibold text-amber-300">{getTenureStatus(selectedInvestment).label} ({getTenureStatus(selectedInvestment).detail})</span>
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

              {/* Withdrawal Status Section */}
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Withdrawal Status:</span>
                {selectedInvestment.withdrawalStatus === 'approved' ? (
                  <span className="font-bold text-emerald-400">Disbursed (Ref: {selectedInvestment.payoutTxnId})</span>
                ) : selectedInvestment.withdrawalStatus === 'pending' ? (
                  <span className="font-bold text-amber-300">Withdrawal Requested (Under Review)</span>
                ) : selectedInvestment.withdrawalStatus === 'rejected' ? (
                  <span className="font-bold text-rose-400">Request Rejected</span>
                ) : (
                  <span className="font-semibold text-slate-300">Not Requested</span>
                )}
              </div>

              {/* Withdrawal Payout Proof Receipt */}
              {selectedInvestment.withdrawalStatus === 'approved' && selectedInvestment.payoutProofUrl && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Official Withdrawal Payout Bank Receipt:</span>
                  </span>
                  <a
                    href={selectedInvestment.payoutProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block group relative rounded-xl overflow-hidden border border-emerald-500/30 bg-slate-900 hover:border-emerald-400 transition"
                  >
                    <img
                      src={selectedInvestment.payoutProofUrl}
                      alt="Withdrawal payout proof"
                      className="w-full max-h-48 object-contain bg-slate-950 p-2"
                    />
                    <div className="p-2 bg-slate-950/90 text-center text-[10px] text-emerald-300 font-medium group-hover:underline">
                      🔍 Click to view full payout transfer receipt
                    </div>
                  </a>
                </div>
              )}

              {/* Admin Investment Verification Proof */}
              {selectedInvestment.adminProofUrl && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Investment Deposit Proof from Admin:</span>
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
                      🔍 Click to view verification receipt
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

            {/* Quick Action Button in modal */}
            {(!selectedInvestment.withdrawalStatus || selectedInvestment.withdrawalStatus === 'rejected') && (
              <button
                onClick={() => {
                  const inv = selectedInvestment;
                  setSelectedInvestment(null);
                  handleOpenWithdrawModal(inv);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <ArrowDownCircle className="w-4 h-4" />
                <span>Request Capital & Profit Withdrawal (₹{selectedInvestment.currentValue.toLocaleString('en-IN')})</span>
              </button>
            )}

            <button
              onClick={() => setSelectedInvestment(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: WITHDRAWAL REQUEST ================= */}
      {withdrawModalOpen && withdrawingInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ArrowDownCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Request Investment Withdrawal</h3>
                  <p className="text-xs text-slate-400">{withdrawingInvestment.investmentTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payout Calculation Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Principal Invested:</span>
                <span className="font-semibold text-white">₹{withdrawingInvestment.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Accrued Profit / Appreciation:</span>
                <span className="font-semibold text-emerald-400">
                  +₹{Math.max(0, withdrawingInvestment.currentValue - withdrawingInvestment.amount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center">
                <span className="font-bold text-amber-300">Total Net Payout to Receive:</span>
                <span className="text-xl font-black text-amber-300">
                  ₹{withdrawingInvestment.currentValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {withdrawMessage.text && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                withdrawMessage.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}>
                {withdrawMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{withdrawMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
              {/* Payout Method Toggle */}
              <div>
                <label className="block font-semibold text-slate-300 mb-2">Preferred Payout Destination:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawForm({ ...withdrawForm, payoutMethod: 'bank' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      withdrawForm.payoutMethod === 'bank'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Landmark className="w-4 h-4" />
                    <span>Bank Transfer (IMPS/NEFT)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawForm({ ...withdrawForm, payoutMethod: 'upi' })}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                      withdrawForm.payoutMethod === 'upi'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Instant UPI ID</span>
                  </button>
                </div>
              </div>

              {withdrawForm.payoutMethod === 'bank' ? (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Account Holder Name *</label>
                    <input
                      type="text"
                      required
                      value={withdrawForm.accountHolder}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, accountHolder: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Bank Account Number *</label>
                      <input
                        type="text"
                        required
                        value={withdrawForm.accountNumber}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                        placeholder="e.g. 50100234567890"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">IFSC Code *</label>
                      <input
                        type="text"
                        required
                        value={withdrawForm.ifsc}
                        onChange={(e) => setWithdrawForm({ ...withdrawForm, ifsc: e.target.value.toUpperCase() })}
                        placeholder="e.g. HDFC0001234"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Bank Name (Optional)</label>
                    <input
                      type="text"
                      value={withdrawForm.bankName}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                      placeholder="e.g. HDFC Bank, ICICI Bank"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">VPA / UPI ID *</label>
                    <input
                      type="text"
                      required
                      value={withdrawForm.upiId}
                      onChange={(e) => setWithdrawForm({ ...withdrawForm, upiId: e.target.value.trim() })}
                      placeholder="e.g. 9812345678@upi or name@okhdfcbank"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Additional Remarks (Optional)</label>
                <textarea
                  rows={2}
                  value={withdrawForm.userNotes}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, userNotes: e.target.value })}
                  placeholder="e.g. Please process withdrawal of matured lot."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed">
                ℹ️ Once submitted, the Admin finance desk will review the request and disburse the funds directly to your specified account with an official transfer UTR reference.
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1"
                >
                  {withdrawSubmitting ? 'Submitting Request...' : 'Confirm Withdrawal Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

