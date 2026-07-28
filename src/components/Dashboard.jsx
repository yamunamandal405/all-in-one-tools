import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, QrCode, FileText, Image as ImageIcon, Wrench, 
  FileSearch, ArrowRightLeft, Grid, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, TrendingUp 
} from 'lucide-react';

export const Dashboard = () => {
  const { 
    setActiveTab, walletBalance, openTransferModal, 
    transactions, setReceiptModalData 
  } = useApp();

  const toolCards = [
    {
      id: 'pay',
      title: 'OmniPay UPI Hub',
      desc: 'Send money to mobile, UPI ID, or bank account with PIN protection & digital receipts.',
      icon: Wallet,
      gradient: 'from-purple-600 to-indigo-600',
      badge: 'PhonePe Style'
    },
    {
      id: 'qr',
      title: 'Universal QR Engine',
      desc: 'Scan payment, URL, & WiFi QRs live or upload image. Generate custom styled QRs.',
      icon: QrCode,
      gradient: 'from-amber-500 to-orange-600',
      badge: 'All-In-One'
    },
    {
      id: 'pdf',
      title: 'PDF Suite',
      desc: 'Merge multiple PDFs, split pages, compress file size, and extract raw text.',
      icon: FileText,
      gradient: 'from-rose-500 to-pink-600',
      badge: 'pdf-lib'
    },
    {
      id: 'image',
      title: 'Image Studio',
      desc: 'Lossless compression, WEBP/PNG/JPG format converter, aspect resizer & canvas FX.',
      icon: ImageIcon,
      gradient: 'from-emerald-500 to-teal-600',
      badge: 'Canvas API'
    },
    {
      id: 'tool-builder',
      title: 'Custom Tool Designer',
      desc: 'Build no-code formula calculators and utility widgets saved to your dashboard.',
      icon: Wrench,
      gradient: 'from-blue-600 to-cyan-600',
      badge: 'No-Code Builder'
    },
    {
      id: 'ai-files',
      title: 'AI File Hub & Sender',
      desc: 'Semantic natural language file search & cross-app universal sharing modal.',
      icon: FileSearch,
      gradient: 'from-indigo-600 to-purple-600',
      badge: 'AI Indexer'
    },
    {
      id: 'converters',
      title: 'Converters & Math',
      desc: 'Unit converter, real-time multi-currency exchange matrix, JSON/CSV & Base64.',
      icon: ArrowRightLeft,
      gradient: 'from-teal-500 to-emerald-600',
      badge: 'Real-time'
    },
    {
      id: 'more-tools',
      title: 'Utility Extras',
      desc: 'Password generator, network speed test gauge, color palette picker & markdown.',
      icon: Grid,
      gradient: 'from-purple-500 to-indigo-500',
      badge: 'Utilities'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/30 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              All-In-One Utility & Payments Ecosystem
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">OmniSuite</span>
            </h1>
            <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
              PDF tools, image suite, universal QR scanner, custom tool designer, AI file search, and PhonePe-style UPI money transfer hub — all in one platform.
            </p>
          </div>

          {/* Quick Pay / Wallet Card */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Digital Wallet Balance</span>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300">
              ₹{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => openTransferModal()}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md shadow-purple-600/30 transition"
              >
                Send Money
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className="flex-1 py-2 rounded-xl glass-card text-xs font-bold text-gray-200 hover:border-purple-500/50 transition flex items-center justify-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                Scan QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Suite Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase text-xs flex items-center gap-2">
            <Grid className="w-4 h-4 text-purple-400" />
            Core Platform Tools & Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {toolCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="glass-card p-5 rounded-3xl cursor-pointer border border-white/10 hover:border-purple-500/60 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {card.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Recent OmniPay Transactions
          </h3>
          <button onClick={() => setActiveTab('pay')} className="text-xs text-purple-400 hover:underline">
            View All in Passbook
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {transactions.slice(0, 3).map((txn) => (
            <div
              key={txn.id}
              onClick={() => setReceiptModalData(txn)}
              className="p-3.5 glass-card rounded-2xl cursor-pointer hover:border-purple-500/50 transition flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{txn.recipient}</h4>
                <p className="text-[10px] text-gray-400 font-mono">UTR: {txn.utr}</p>
              </div>
              <span className={`text-xs font-extrabold ${txn.type === 'received' ? 'text-emerald-400' : 'text-purple-300'}`}>
                {txn.type === 'received' ? '+' : '-'}₹{txn.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
