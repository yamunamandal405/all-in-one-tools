import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TransferModal } from './TransferModal';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { Passbook } from './Passbook';
import { 
  Wallet, QrCode, Phone, Building2, UserCheck, Smartphone, Zap, Tv, 
  Car, ShieldCheck, ArrowRight, Plus, CheckCircle, CreditCard, RefreshCw 
} from 'lucide-react';

export const OmniPayHub = () => {
  const { 
    walletBalance, bankAccounts, contacts, transactions, 
    openTransferModal, receiptModalData, setReceiptModalData, setActiveTab 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('hub'); // 'hub', 'passbook'
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  const [rechargeNumber, setRechargeNumber] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('749');

  const recharges = [
    { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: 'from-purple-500 to-indigo-600' },
    { id: 'dth', label: 'DTH TV', icon: Tv, color: 'from-emerald-500 to-teal-600' },
    { id: 'electricity', label: 'Electricity Bill', icon: Zap, color: 'from-amber-500 to-orange-600' },
    { id: 'fastag', label: 'FASTag Recharge', icon: Car, color: 'from-blue-500 to-cyan-600' },
  ];

  const handleQuickRecharge = (e) => {
    e.preventDefault();
    if (!rechargeNumber) return;
    
    openTransferModal({
      upiId: `${selectedRecharge.id}.billdesk@upi`,
      name: `${selectedRecharge.label} (${rechargeNumber})`,
      amount: rechargeAmount
    });

    setSelectedRecharge(null);
    setRechargeNumber('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fadeIn">
      
      {/* Financial Hub Banner Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] uppercase font-bold tracking-wider">
                UPI 2.0 Empowered
              </span>
              <span className="text-xs text-gray-400">Zero Transaction Fees</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              OmniPay Financial Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg">
              Send money instantly via UPI to mobile contacts, VPAs, or bank accounts, pay bills, and manage multi-bank balances in one place.
            </p>
          </div>

          {/* Wallet & Total Funds Display */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Omni Digital Wallet</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                ₹{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-purple-500/30 flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Linked Primary Bank</span>
                <span className="text-xs text-purple-300 font-bold">HDFC Bank</span>
              </div>
              <div className="text-2xl font-black text-purple-300">
                ₹142,500.00
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveSubTab('hub')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'hub' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Payment Hub
          </button>
          <button
            onClick={() => setActiveSubTab('passbook')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'passbook' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Passbook & History
          </button>
        </div>
      </div>

      {activeSubTab === 'passbook' ? (
        <Passbook />
      ) : (
        <>
          {/* Quick Money Transfer Actions (PhonePe style grid) */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              Money Transfer Modes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => openTransferModal()}
                className="glass-card p-4 rounded-2xl cursor-pointer text-center group hover:border-purple-500/60 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mx-auto flex items-center justify-center text-white mb-2 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white">To Mobile / Contact</h4>
                <p className="text-[10px] text-gray-400">Phone numbers</p>
              </div>

              <div
                onClick={() => openTransferModal({ type: 'upi' })}
                className="glass-card p-4 rounded-2xl cursor-pointer text-center group hover:border-indigo-500/60 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 mx-auto flex items-center justify-center text-white mb-2 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white">To UPI ID / VPA</h4>
                <p className="text-[10px] text-gray-400">Direct VPA pay</p>
              </div>

              <div
                onClick={() => openTransferModal({ type: 'bank' })}
                className="glass-card p-4 rounded-2xl cursor-pointer text-center group hover:border-emerald-500/60 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 mx-auto flex items-center justify-center text-white mb-2 shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white">To Bank Account</h4>
                <p className="text-[10px] text-gray-400">Acc No & IFSC</p>
              </div>

              <div
                onClick={() => setActiveTab('qr')}
                className="glass-card p-4 rounded-2xl cursor-pointer text-center group hover:border-amber-500/60 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 mx-auto flex items-center justify-center text-white mb-2 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
                  <QrCode className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-white">Scan & Pay QR</h4>
                <p className="text-[10px] text-gray-400">Universal Scanner</p>
              </div>
            </div>
          </div>

          {/* Quick Pay Contacts Slider */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                Recent Payees
              </h3>
              <span className="text-xs text-purple-400 cursor-pointer hover:underline" onClick={() => openTransferModal()}>
                View All
              </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => openTransferModal({ contact })}
                  className="flex flex-col items-center min-w-[75px] cursor-pointer group"
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${contact.color} p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition`}>
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      {contact.avatar}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-200 mt-1.5 truncate max-w-[80px]">
                    {contact.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    Pay
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recharge & Utility Bills Section */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Recharge & Pay Bills
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recharges.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedRecharge(item)}
                    className="glass-card p-4 rounded-2xl cursor-pointer text-center group hover:border-purple-500/60 transition"
                  >
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} mx-auto flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{item.label}</h4>
                    <span className="text-[9px] text-emerald-400 font-medium">Cashback 5%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Linked Bank Accounts */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Linked Bank Accounts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bankAccounts.map((b) => (
                <div key={b.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{b.logo}</span>
                    {b.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.bankName}</h4>
                    <p className="text-xs text-gray-400">{b.accNo}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Available Balance</span>
                    <span className="text-sm font-bold text-emerald-400">₹{b.balance.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </>
      )}

      {/* Quick Recharge Modal */}
      {selectedRecharge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-purple-500/30 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              {selectedRecharge.label}
            </h3>
            <form onSubmit={handleQuickRecharge} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  {selectedRecharge.id === 'electricity' ? 'Consumer Number' : 'Mobile / Account No.'}
                </label>
                <input
                  type="text"
                  placeholder="Enter number..."
                  value={rechargeNumber}
                  onChange={(e) => setRechargeNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Select Amount (₹)</label>
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl glass-input font-bold text-emerald-300"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecharge(null)}
                  className="flex-1 py-2 text-xs rounded-xl glass-card text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                >
                  Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TransferModal />
      <PaymentReceiptModal receipt={receiptModalData} onClose={() => setReceiptModalData(null)} />
    </div>
  );
};
