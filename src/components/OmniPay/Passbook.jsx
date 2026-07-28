import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, ArrowDownLeft, ArrowUpRight, Search, Filter, 
  Download, Calendar, ShieldCheck, CheckCircle2 
} from 'lucide-react';

export const Passbook = () => {
  const { transactions, setReceiptModalData, showToast } = useApp();
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'sent', 'received', 'Recharge'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTxns = transactions.filter(t => {
    const matchesFilter = filterType === 'ALL' || t.type === filterType || t.category === filterType;
    const matchesSearch = t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.upiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.utr.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Recipient', 'UPI ID', 'Amount (INR)', 'Date', 'UTR', 'Status'];
    const rows = filteredTxns.map(t => [
      t.id, t.type, `"${t.recipient}"`, t.upiId, t.amount, `"${t.timestamp}"`, t.utr, t.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniPay_Passbook_Statement_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('Passbook CSV exported successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-3xl border border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Passbook & History
          </h2>
          <p className="text-xs text-gray-400">Complete record of payments, transfers, and wallet activity</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-xs font-semibold text-purple-300 transition"
        >
          <Download className="w-4 h-4" />
          Export Statement (.CSV)
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by recipient, UPI ID, UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'sent', 'received', 'Recharge'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
                filterType === type ? 'bg-purple-600 text-white font-bold' : 'glass-card text-gray-400'
              }`}
            >
              {type === 'ALL' ? 'All Txns' : type === 'sent' ? 'Paid' : type === 'received' ? 'Received' : 'Bills'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredTxns.length > 0 ? (
          filteredTxns.map((txn) => {
            const isReceived = txn.type === 'received';
            return (
              <div
                key={txn.id}
                onClick={() => setReceiptModalData(txn)}
                className="flex items-center justify-between p-3.5 glass-card rounded-2xl cursor-pointer hover:border-purple-500/50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isReceived ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {isReceived ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                      {txn.recipient}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {txn.upiId} • <span className="font-mono text-[10px] text-gray-500">UTR: {txn.utr}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {new Date(txn.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-extrabold block ${
                    isReceived ? 'text-emerald-400' : 'text-white'
                  }`}>
                    {isReceived ? '+' : '-'}₹{parseFloat(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium inline-block mt-1">
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-panel p-8 rounded-3xl text-center text-gray-400">
            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm">No transactions found for current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
