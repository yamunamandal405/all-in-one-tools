import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UpiPinModal } from './UpiPinModal';
import { 
  User, Phone, CreditCard, Building2, CheckCircle2, ArrowRight, 
  Search, ShieldCheck, Wallet, RefreshCw 
} from 'lucide-react';

export const TransferModal = () => {
  const { 
    transferModalOpen, setTransferModalOpen, transferInitialData, 
    contacts, bankAccounts, walletBalance, processPayment, showToast 
  } = useApp();

  const [transferType, setTransferType] = useState('contact'); // 'contact', 'upi', 'bank'
  const [selectedContact, setSelectedContact] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [bankAccNo, setBankAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentSource, setPaymentSource] = useState('HDFC Bank •••• 4812');
  const [useWallet, setUseWallet] = useState(false);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [searchContact, setSearchContact] = useState('');

  useEffect(() => {
    if (transferInitialData) {
      if (transferInitialData.type === 'upi' || transferInitialData.upiId) {
        setTransferType('upi');
        setUpiId(transferInitialData.upiId || '');
        if (transferInitialData.name) setAccountHolder(transferInitialData.name);
        if (transferInitialData.amount) setAmount(transferInitialData.amount.toString());
      } else if (transferInitialData.contact) {
        setTransferType('contact');
        setSelectedContact(transferInitialData.contact);
        if (transferInitialData.amount) setAmount(transferInitialData.amount.toString());
      }
    }
  }, [transferInitialData]);

  if (!transferModalOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid transfer amount', 'warning');
      return;
    }

    if (useWallet && parseFloat(amount) > walletBalance) {
      showToast('Insufficient Omni Wallet balance', 'error');
      return;
    }

    if (transferType === 'upi' && !upiId.trim()) {
      showToast('Please enter a valid UPI ID', 'warning');
      return;
    }

    if (transferType === 'bank' && (!bankAccNo || !ifsc)) {
      showToast('Please fill in Account Number and IFSC Code', 'warning');
      return;
    }

    if (transferType === 'contact' && !selectedContact) {
      showToast('Select a recipient from contacts', 'warning');
      return;
    }

    setPinModalOpen(true);
  };

  const getRecipientName = () => {
    if (transferType === 'contact') return selectedContact ? selectedContact.name : 'Selected Contact';
    if (transferType === 'upi') return upiId || 'UPI Payee';
    if (transferType === 'bank') return accountHolder || 'Bank Beneficiary';
    return 'Recipient';
  };

  const getRecipientUpi = () => {
    if (transferType === 'contact') return selectedContact ? selectedContact.upiId : 'contact@upi';
    if (transferType === 'upi') return upiId;
    if (transferType === 'bank') return `A/C: ${bankAccNo.slice(-4)}`;
    return 'payee@upi';
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setTransferModalOpen(false);

    processPayment({
      recipient: getRecipientName(),
      upiId: getRecipientUpi(),
      amount: amount,
      category: 'Transfer',
      bankUsed: useWallet ? 'Omni Wallet' : paymentSource,
      useWallet: useWallet,
      note: note
    });

    // Reset form
    setAmount('');
    setNote('');
    setSelectedContact(null);
    setUpiId('');
    setBankAccNo('');
    setIfsc('');
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchContact.toLowerCase()) || 
    c.phone.includes(searchContact) ||
    c.upiId.toLowerCase().includes(searchContact.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-purple-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-400" />
              Transfer Money (UPI)
            </h2>
            <button
              onClick={() => setTransferModalOpen(false)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
          </div>

          {/* Transfer Type Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setTransferType('contact')}
              className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                transferType === 'contact' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              To Mobile
            </button>
            <button
              onClick={() => setTransferType('upi')}
              className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                transferType === 'upi' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              To UPI ID
            </button>
            <button
              onClick={() => setTransferType('bank')}
              className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                transferType === 'bank' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              To Bank
            </button>
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            
            {/* Mode 1: Contact Picker */}
            {transferType === 'contact' && (
              <div>
                <label className="block text-xs text-gray-300 mb-1 font-medium">Select Recipient</label>
                
                {selectedContact ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl glass-card border border-purple-500/50 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${selectedContact.color} flex items-center justify-center font-bold text-white text-xs`}>
                        {selectedContact.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedContact.name}</h4>
                        <p className="text-xs text-purple-300">{selectedContact.phone} • {selectedContact.upiId}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedContact(null)}
                      className="text-xs text-purple-400 underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contact or phone..."
                        value={searchContact}
                        onChange={(e) => setSearchContact(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-purple-600/20 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${contact.color} flex items-center justify-center text-xs font-bold text-white`}>
                              {contact.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-200">{contact.name}</p>
                              <p className="text-[10px] text-gray-400">{contact.phone}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-purple-400 font-mono">{contact.upiId}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: UPI ID */}
            {transferType === 'upi' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">UPI ID / VPA</label>
                  <input
                    type="text"
                    placeholder="e.g. username@okhdfcbank"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl glass-input font-mono text-purple-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Payee Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>
            )}

            {/* Mode 3: Bank Account */}
            {transferType === 'bank' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-medium">Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter 11-16 digit Account No."
                    value={bankAccNo}
                    onChange={(e) => setBankAccNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-medium">IFSC Code</label>
                    <input
                      type="text"
                      placeholder="HDFC0001234"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-medium">Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder="Account Holder"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amount Field */}
            <div>
              <label className="block text-xs font-bold text-gray-200 mb-1">Enter Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-extrabold text-emerald-400">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 text-xl font-bold rounded-xl glass-input text-emerald-300"
                  required
                  min="1"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2">
              {[100, 500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="flex-1 py-1 text-[11px] font-medium glass-card rounded-lg hover:border-purple-500/50 text-gray-300"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            {/* Note */}
            <div>
              <input
                type="text"
                placeholder="Add a note (e.g. Dinner split, Rent...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-300"
              />
            </div>

            {/* Payment Source Picker */}
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
              <label className="block text-[11px] text-gray-400 font-medium">Debited From</label>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useWallet}
                    onChange={(e) => setUseWallet(e.target.checked)}
                    className="rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                  />
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-gray-200">
                    Use Omni Wallet (₹{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                  </span>
                </label>
              </div>

              {!useWallet && (
                <select
                  value={paymentSource}
                  onChange={(e) => setPaymentSource(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-purple-300"
                >
                  {bankAccounts.map((b) => (
                    <option key={b.id} value={`${b.bankName} ${b.accNo}`} className="bg-slate-900 text-white">
                      {b.logo} {b.bankName} ({b.accNo}) - Bal: ₹{b.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Proceed Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition flex items-center justify-center gap-2"
            >
              Proceed to Pay
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

        </div>
      </div>

      <UpiPinModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        recipientName={getRecipientName()}
        amount={amount || '0'}
      />
    </>
  );
};
