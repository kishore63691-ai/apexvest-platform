import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, ArrowRight, ShieldCheck, QrCode, Copy,
  Check, AlertTriangle, Clock, Upload, Sparkles, Building, Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function InvestModal({ investment, isOpen, onClose, onSuccess }) {
  const { user, token, openAuthModal } = useAuth();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [lots, setLots] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 2 QR details
  const [qrDetails, setQrDetails] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Step 3 Payment confirmation form
  const [transactionId, setTransactionId] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (investment) {
      setStep(1);
      setError('');
      setSubmittedSuccess(false);
      setTransactionId('');
      setScreenshotPreview(null);
      // Set reasonable default amount based on min investment
      const defaultAmount = investment.type === 'business' ? 100 : Math.max(500, investment.minInvestment);
      setAmount(String(defaultAmount));
    }
  }, [investment, isOpen]);

  // Dynamic lot/unit recalculation
  useEffect(() => {
    if (!investment || !amount) {
      setLots(0);
      return;
    }
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      setLots(0);
      return;
    }

    if (investment.type === 'business') {
      // Business: ₹10 per lot
      const calculatedLots = Math.floor(num / (investment.rate || 10));
      setLots(calculatedLots);
    } else {
      // Community: Asset fraction e.g. Gold at ₹15,000
      const calculatedUnits = Number((num / investment.rate).toFixed(4));
      setLots(calculatedUnits);
    }
  }, [amount, investment]);

  if (!isOpen || !investment) return null;

  // Handle Step 1 Confirmation -> fetch QR details
  const handleProceedToPayment = async () => {
    setError('');
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < investment.minInvestment) {
      setError(`Minimum investment is ₹${investment.minInvestment.toLocaleString('en-IN')}`);
      return;
    }

    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/payments/qr?investmentId=${investment.id}&amount=${numAmount}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to initialize payment');
      setQrDetails(data);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUpi = () => {
    if (!qrDetails?.upiId) return;
    navigator.clipboard.writeText(qrDetails.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 3: Submit payment for verification
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!transactionId.trim()) {
      setError('Please enter the 12-digit UPI UTR or Transaction Reference ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          investmentId: investment.id,
          amount: Number(amount),
          transactionId: transactionId.trim(),
          paymentDate,
          screenshotUrl: screenshotPreview
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment submission failed');

      setSubmittedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBusiness = investment.type === 'business';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg sm:max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className={`p-2 rounded-xl shrink-0 ${isBusiness ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {isBusiness ? <Building className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 block truncate">
                {isBusiness ? 'Business Funding' : 'Commodity Asset Investment'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight truncate">
                {investment.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="overflow-y-auto flex-1">
          {/* Step Progress Indicator */}
          {!submittedSuccess && (
            <div className="px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs sticky top-0 z-10 backdrop-blur-md">
              <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>
                  1
                </span>
                <span className="hidden xs:inline">Details</span>
              </div>
              <div className={`h-[1px] flex-1 mx-2 sm:mx-3 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>
                  2
                </span>
                <span className="hidden xs:inline">UPI Payment</span>
              </div>
              <div className={`h-[1px] flex-1 mx-2 sm:mx-3 ${step >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800'}`}>
                  3
                </span>
                <span className="hidden xs:inline">Verification</span>
              </div>
            </div>
          )}

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success View */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center animate-bounce">
              <Clock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Payment Verification Pending</h4>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Investment:</span>
                <span className="font-semibold text-white">{investment.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-semibold text-emerald-400">₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Transaction ID (UTR):</span>
                <span className="font-mono font-semibold text-amber-300">{transactionId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold text-[11px]">
                  Pending Admin Verification
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> As per platform rules, your investment will be officially confirmed and added to your active portfolio once Admin verifies the payment. The investment progress bar will update upon confirmation.
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 btn-primary-emerald text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              Done & View My Investments
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* STEP 1: Investment Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Current Rate</span>
                    <span className="text-base font-bold text-white mt-0.5 block">
                      {isBusiness ? `₹${investment.rate} per lot` : `₹${investment.rate.toLocaleString('en-IN')} / unit`}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Min Investment</span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5 block">
                      ₹{investment.minInvestment.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* User details */}
                {user && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Investor Account</span>
                      <span className="font-semibold text-white">{user.name} ({user.email})</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      ID: {user.id}
                    </span>
                  </div>
                )}

                {/* Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Enter Investment Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={investment.minInvestment}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Min ₹${investment.minInvestment}`}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Quick Chips */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {(isBusiness ? [100, 500, 1000, 5000, 10000] : [500, 1500, 5000, 15000, 30000]).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(String(preset))}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                          amount === String(preset)
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        +₹{preset.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculated Lots / Units Display */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                        {isBusiness ? 'Calculated Lot Allocation' : 'Calculated Asset Units'}
                      </span>
                      <p className="text-2xl font-black text-white mt-1">
                        {lots.toLocaleString()} <span className="text-sm font-medium text-slate-400">{isBusiness ? 'Lots' : 'Units'}</span>
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {isBusiness ? (
                        <>
                          <p>₹10 = 1 lot</p>
                          <p className="font-mono text-emerald-300">₹{amount || 0} ÷ ₹{investment.rate}</p>
                        </>
                      ) : (
                        <>
                          <p>Rate: ₹{investment.rate.toLocaleString('en-IN')}</p>
                          <p className="font-mono text-amber-300">₹{amount || 0} ÷ ₹{investment.rate}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading || !amount || Number(amount) < investment.minInvestment}
                  onClick={handleProceedToPayment}
                  className="w-full py-3.5 btn-primary-emerald disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Preparing Payment...' : 'Confirm Details & Proceed to Payment'}
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* STEP 2: UPI Payment Page */}
            {step === 2 && qrDetails && (
              <div className="space-y-5">
                <div className="text-center">
                  <span className="text-xs font-semibold text-slate-400">Scan & Pay Exact Amount</span>
                  <p className="text-3xl font-black text-emerald-400 mt-0.5 tracking-tight">
                    ₹{Number(amount).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-4 rounded-2xl w-60 mx-auto shadow-2xl text-center border-4 border-slate-700/80 ring-4 ring-emerald-500/20">
                  <img
                    src={qrDetails.qrDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-auto rounded"
                  />
                  <div className="mt-2 text-[11px] font-bold text-slate-800 flex items-center justify-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Scan with Any UPI App</span>
                  </div>
                </div>

                {/* UPI ID & Details */}
                <div className="glass-panel p-4 rounded-2xl border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Company UPI ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{qrDetails.upiId}</span>
                      <button
                        onClick={handleCopyUpi}
                        className="p-1 text-slate-400 hover:text-emerald-400 transition"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Payee Account:</span>
                    <span className="font-semibold text-white">{qrDetails.payeeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Investment Reference:</span>
                    <span className="font-mono text-amber-300 font-semibold">{qrDetails.referenceNumber}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Payment Instructions:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                    <li>Open GPay, PhonePe, Paytm, or BHIM UPI app.</li>
                    <li>Scan this dynamic QR Code or transfer to the UPI ID.</li>
                    <li>Ensure amount matches <strong>₹{Number(amount).toLocaleString('en-IN')}</strong>.</li>
                    <li>After completion, copy the 12-digit <strong>UTR / Transaction ID</strong>.</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl btn-secondary-glass text-xs font-bold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 btn-primary-emerald font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>I Have Made Payment → Submit Reference</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Confirmation */}
            {step === 3 && (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                  <span>Investment Amount Paid:</span>
                  <span className="text-sm font-bold text-white">₹{Number(amount).toLocaleString('en-IN')}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    UPI Transaction ID / UTR Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 428190382910 or TXN12345"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Find this 12-digit reference number in your payment receipt on GPay / PhonePe / Paytm.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Screenshot (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-4 text-center cursor-pointer bg-slate-950/60 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {screenshotPreview ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Screenshot attached</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                        <Upload className="w-5 h-5 text-slate-500" />
                        <span>Click or drag payment screenshot</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-xl btn-secondary-glass text-xs font-bold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !transactionId.trim()}
                    className="flex-1 py-3 btn-primary-emerald disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
                  >
                    <span>{loading ? 'Submitting...' : 'SUBMIT PAYMENT FOR VERIFICATION'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
