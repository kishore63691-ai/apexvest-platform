import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import InvestModal from './components/InvestModal';
import LegalModal from './components/LegalModal';

import HomeView from './views/HomeView';
import InvestmentsView from './views/InvestmentsView';
import BusinessFundingView from './views/BusinessFundingView';
import CommunityInvestmentsView from './views/CommunityInvestmentsView';
import DashboardView from './views/DashboardView';
import MyInvestmentsView from './views/MyInvestmentsView';
import TransactionsView from './views/TransactionsView';
import ProfileView from './views/ProfileView';
import AdminDashboardView from './views/AdminDashboardView';

function MainApp() {
  const { user, isAdmin, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [investments, setInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  // Investment flow modal
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [investModalOpen, setInvestModalOpen] = useState(false);

  // Legal modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('risk');

  const fetchInvestments = async () => {
    try {
      const res = await fetch('/api/investments?status=all');
      if (res.ok) {
        const data = await res.json();
        setInvestments(data.investments || []);
      }
    } catch (err) {
      console.error('Failed to load investments:', err);
    } finally {
      setLoadingInvestments(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
    // Poll updates every 10 seconds to catch live rate changes or progress updates
    const interval = setInterval(fetchInvestments, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenInvest = (investment) => {
    if (investment?.type === 'commodity' || investment?.type === 'community') {
      return; // Locked future option
    }
    if (!user) {
      openAuthModal('login', 'user');
      return;
    }
    setSelectedInvestment(investment);
    setInvestModalOpen(true);
  };

  const handleInvestmentSuccess = () => {
    fetchInvestments();
  };

  const handleOpenLegal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  // If user signs in and is on home or clicked portfolio, keep them oriented
  useEffect(() => {
    if (user && activeTab === 'home') {
      // Optional: keep on home or let user click
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode, role) => openAuthModal(mode, role)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            investments={investments}
            onInvest={handleOpenInvest}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'investments' && (
          <InvestmentsView
            investments={investments}
            onInvest={handleOpenInvest}
            onRefresh={fetchInvestments}
          />
        )}

        {activeTab === 'business' && (
          <BusinessFundingView
            investments={investments}
            onInvest={handleOpenInvest}
          />
        )}

        {activeTab === 'community' && (
          <CommunityInvestmentsView
            investments={investments}
            onInvest={handleOpenInvest}
          />
        )}

        {activeTab === 'portfolio' && (
          user ? (
            <MyInvestmentsView
              onNavigate={(tab) => setActiveTab(tab)}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-slate-400">Please sign in to view your confirmed investments and portfolio metrics.</p>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'transactions' && (
          user ? (
            <TransactionsView />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <p className="text-xs text-slate-400">Please sign in to view your transaction audit history.</p>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In Now
              </button>
            </div>
          )
        )}

        {activeTab === 'profile' && (
          user ? (
            <ProfileView />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Sign In Required</h3>
              <button
                onClick={() => openAuthModal('login', 'user')}
                className="w-full py-2.5 bg-emerald-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In
              </button>
            </div>
          )
        )}

        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminDashboardView
              onInvestmentUpdated={fetchInvestments}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-rose-500/30 rounded-2xl text-center space-y-4">
              <h3 className="text-lg font-bold text-white">Admin Privileges Required</h3>
              <p className="text-xs text-slate-400">Only authorized administrators can access this portal.</p>
              <button
                onClick={() => openAuthModal('login', 'admin')}
                className="w-full py-2.5 bg-amber-500 font-bold text-slate-950 text-xs rounded-xl"
              >
                Sign In as Administrator
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Global Modals */}
      <AuthModal />

      <InvestModal
        investment={selectedInvestment}
        isOpen={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        onSuccess={handleInvestmentSuccess}
      />

      <LegalModal
        type={legalModalType}
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
