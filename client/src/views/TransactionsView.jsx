import React, { useState, useEffect } from 'react';
import { Receipt, Clock, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TransactionsView() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/payments/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Payment Audit Trail
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track all submitted UPI reference IDs and their administrator verification status.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No payment transactions recorded yet</p>
          <p className="text-xs text-slate-500 mt-1">When you invest and submit your UTR, it will appear here.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                  <th className="py-3 px-4">Payment Ref</th>
                  <th className="py-3 px-4">Investment Opportunity</th>
                  <th className="py-3 px-4">Amount Paid</th>
                  <th className="py-3 px-4">UTR / Transaction ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Admin Notes / Rejection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                      {p.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {p.investmentTitle}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'confirmed' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Payment Confirmed
                        </span>
                      ) : p.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          Payment Rejected
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-[10px] flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          Verification Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {p.status === 'rejected' ? (
                        <span className="text-rose-400 font-medium">
                          Reason: {p.rejectionReason || 'Verification rejected by Admin'}
                        </span>
                      ) : p.status === 'confirmed' ? (
                        <div className="space-y-1.5">
                          <span className="text-slate-300 block">
                            {p.adminNotes || 'Confirmed by Admin'}
                          </span>
                          {p.adminProofUrl && (
                            <a
                              href={p.adminProofUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                            >
                              <span>📄 View Admin Verified Proof</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-400/80 italic">
                          Awaiting Admin verification against UPI bank records
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
