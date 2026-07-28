import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, QrCode, Wallet, Search, Sparkles, FileText, Image as ImageIcon, 
  Wrench, FileSearch, ArrowRightLeft, Grid, Plus, CheckCircle, Smartphone
} from 'lucide-react';

export const Header = () => {
  const { 
    activeTab, setActiveTab, walletBalance, openTransferModal, showToast,
    setWalletBalance 
  } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Zap },
    { id: 'pay', label: 'OmniPay UPI', icon: Wallet, badge: 'Pay' },
    { id: 'qr', label: 'Universal QR', icon: QrCode },
    { id: 'pdf', label: 'PDF Suite', icon: FileText },
    { id: 'image', label: 'Image Studio', icon: ImageIcon },
    { id: 'tool-builder', label: 'Tool Designer', icon: Wrench, badge: 'New' },
    { id: 'ai-files', label: 'AI File Hub', icon: FileSearch },
    { id: 'converters', label: 'Converters', icon: ArrowRightLeft },
    { id: 'more-tools', label: 'Utility Tools', icon: Grid },
  ];

  const handleTopup = (e) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (!amt || amt <= 0) {
      showToast('Enter a valid amount', 'warning');
      return;
    }
    setWalletBalance(prev => prev + amt);
    showToast(`Added ₹${amt.toLocaleString()} to Omni Wallet!`, 'success');
    setTopupAmount('');
    setTopupOpen(false);
  };

  const handleSearchSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  const filteredNav = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                OmniSuite
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                All-In-One Pro
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative hidden md:block w-72">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools, converters, pay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full glass-input text-gray-200 placeholder-gray-400"
              />
            </div>
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl p-2 border border-white/10 shadow-2xl z-50">
                {filteredNav.length > 0 ? (
                  filteredNav.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchSelect(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-purple-600/20 rounded-xl text-left transition"
                    >
                      <item.icon className="w-4 h-4 text-purple-400" />
                      <span>{item.label}</span>
                    </button>
                  ))
                ) : (
                  <p className="p-3 text-xs text-gray-400 text-center">No tools found</p>
                )}
              </div>
            )}
          </div>

          {/* Wallet Balance Pill & Quick Actions */}
          <div className="flex items-center gap-3">
            
            {/* Wallet Pill */}
            <div className="flex items-center bg-slate-900/80 border border-purple-500/30 rounded-full p-1 pl-3 shadow-inner">
              <div className="flex items-center gap-2 mr-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider leading-none">Wallet</span>
                  <span className="text-xs font-bold text-emerald-300">
                    ₹{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setTopupOpen(true)}
                className="p-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-600/30"
                title="Add Money to Wallet"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Scan & Pay Button */}
            <button
              onClick={() => setActiveTab('qr')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-purple-500/25 transition active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Navigation Tabs Bar */}
      <div className="hidden lg:block border-t border-white/5 bg-slate-950/40 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-purple-300 border border-purple-500/40 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topup Modal */}
      {topupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-purple-500/30 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Top Up Omni Wallet
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Add simulated funds to your digital wallet for instant UPI payments and bill recharges.
            </p>
            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Enter Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-lg font-bold text-emerald-300"
                  autoFocus
                />
              </div>

              {/* Quick Amount Pills */}
              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setTopupAmount(amt.toString())}
                    className="py-1.5 text-xs font-medium glass-card rounded-lg hover:border-purple-500/50 text-gray-300"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTopupOpen(false)}
                  className="flex-1 py-2.5 text-xs rounded-xl glass-card text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30"
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
