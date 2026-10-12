import React from 'react';
import { User, Phone, Mail, ShieldCheck, Calendar, LogOut, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileView() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
          Investor Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your verified credentials and authentication settings.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <span className="inline-block mt-1.5 font-mono text-xs bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800 text-slate-300">
              User ID: {user.id}
            </span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" /> Full Name
            </span>
            <p className="text-sm font-semibold text-white">{user.name}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address
            </span>
            <p className="text-sm font-semibold text-white">{user.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-500" /> Mobile Number
            </span>
            <p className="text-sm font-semibold text-white">{user.mobile || 'Not set'}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Registration Date
            </span>
            <p className="text-sm font-semibold text-white">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
            </p>
          </div>
        </div>

        {/* Security & KYC Info */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white">Account Status: Tier-1 Verified</h4>
            <p className="text-emerald-300/80 leading-relaxed">
              Your mobile and email have been verified. You can co-fund business campaigns and acquire bullion fractions. All investments are registered directly against your PAN/Aadhaar profile upon maturity disbursement.
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
