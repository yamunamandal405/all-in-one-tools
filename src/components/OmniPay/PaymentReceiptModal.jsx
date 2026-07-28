import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Share2, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PaymentReceiptModal = ({ receipt, onClose }) => {
  const { showToast, openFileSender } = useApp();

  useEffect(() => {
    if (receipt) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#f59e0b', '#7c3aed']
      });
    }
  }, [receipt]);

  if (!receipt) return null;

  const handleCopyUTR = () => {
    navigator.clipboard.writeText(receipt.utr);
    showToast('UTR copied to clipboard!', 'info');
  };

  const handleShare = () => {
    openFileSender({
      name: `Payment_Receipt_${receipt.utr}.pdf`,
      type: 'receipt',
      content: `Paid ₹${receipt.amount} to ${receipt.recipient} via OmniPay UPI. UTR: ${receipt.utr}`,
      mime: 'application/pdf'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        
        {/* Top Glow Decor */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="flex flex-col items-center text-center my-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Payment Successful</h2>
          <p className="text-xs text-emerald-400 font-medium">Transaction Complete</p>
        </div>

        {/* Amount */}
        <div className="text-center my-4 py-3 bg-slate-900/80 rounded-2xl border border-white/10">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Amount Paid</span>
          <span className="text-3xl font-black text-white tracking-tight">
            ₹{parseFloat(receipt.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Details Table */}
        <div className="space-y-2.5 text-xs bg-slate-950/50 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">Paid To</span>
            <span className="font-bold text-gray-100">{receipt.recipient}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">UPI ID</span>
            <span className="font-mono text-purple-300">{receipt.upiId}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">Payment Source</span>
            <span className="text-gray-300">{receipt.bankUsed || 'HDFC Bank •••• 4812'}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <span className="text-gray-400">UTR / Ref No.</span>
            <button 
              onClick={handleCopyUTR} 
              className="font-mono text-emerald-400 flex items-center gap-1 hover:underline"
            >
              {receipt.utr}
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Date & Time</span>
            <span className="text-gray-300">
              {new Date(receipt.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 my-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by OmniPay 256-bit UPI Encryption</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-card text-xs font-semibold text-gray-200 hover:border-purple-500/50"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
            Share Receipt
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-purple-600/30"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
