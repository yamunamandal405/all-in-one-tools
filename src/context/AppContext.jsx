import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_CONTACTS = [
  { id: '1', name: 'Priya Sharma', phone: '+91 98765 43210', upiId: 'priya@okhdfcbank', avatar: 'PS', color: 'from-pink-500 to-rose-600' },
  { id: '2', name: 'Rahul Verma', phone: '+91 91234 56789', upiId: 'rahul.verma@paytm', avatar: 'RV', color: 'from-blue-500 to-indigo-600' },
  { id: '3', name: 'Aarav Patel', phone: '+91 99887 76655', upiId: 'aarav@icici', avatar: 'AP', color: 'from-emerald-500 to-teal-600' },
  { id: '4', name: 'Sneha Reddy', phone: '+91 97654 32109', upiId: 'sneha.r@ybl', avatar: 'SR', color: 'from-amber-500 to-orange-600' },
  { id: '5', name: 'Tech Store UPI', phone: '+91 80000 11122', upiId: 'techstore@upi', avatar: 'TS', color: 'from-purple-500 to-indigo-600' }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
    type: 'sent',
    recipient: 'Priya Sharma',
    upiId: 'priya@okhdfcbank',
    amount: 1500,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'SUCCESS',
    category: 'Transfer',
    utr: '602918374019'
  },
  {
    id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
    type: 'received',
    recipient: 'Rahul Verma',
    upiId: 'rahul.verma@paytm',
    amount: 3200,
    timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
    status: 'SUCCESS',
    category: 'Transfer',
    utr: '602981726354'
  },
  {
    id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
    type: 'sent',
    recipient: 'Jio Prepaid Recharge',
    upiId: 'jio.recharge@billdesk',
    amount: 749,
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: 'SUCCESS',
    category: 'Recharge',
    utr: '602973645102'
  }
];

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('omni_wallet_balance');
    return saved ? parseFloat(saved) : 24850.50;
  });

  const [bankAccounts, setBankAccounts] = useState([
    { id: 'b1', bankName: 'HDFC Bank', accNo: '•••• 4812', isPrimary: true, balance: 142500.00, logo: '🏛️' },
    { id: 'b2', bankName: 'State Bank of India', accNo: '•••• 9031', isPrimary: false, balance: 68200.00, logo: '🏦' },
    { id: 'b3', bankName: 'ICICI Bank', accNo: '•••• 1120', isPrimary: false, balance: 19450.00, logo: '💳' }
  ]);

  const [contacts] = useState(INITIAL_CONTACTS);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('omni_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Account Security & Protection State
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [securitySettings, setSecuritySettings] = useState(() => {
    const saved = localStorage.getItem('omni_security_settings');
    return saved ? JSON.parse(saved) : {
      shieldActive: true,
      biometricEnabled: true,
      antiPhishingCode: 'OMNI-7892',
      dailyLimit: 100000,
      trustedDevice: true,
      scanFraudCheck: true
    };
  });

  // Modals state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferInitialData, setTransferInitialData] = useState(null);
  const [receiptModalData, setReceiptModalData] = useState(null);
  const [fileSenderModalData, setFileSenderModalData] = useState(null);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Custom Tools state
  const [customTools, setCustomTools] = useState(() => {
    const saved = localStorage.getItem('omni_custom_tools');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('omni_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('omni_custom_tools', JSON.stringify(customTools));
  }, [customTools]);

  useEffect(() => {
    localStorage.setItem('omni_security_settings', JSON.stringify(securitySettings));
  }, [securitySettings]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleAccountLock = () => {
    setIsAccountLocked(prev => {
      const next = !prev;
      showToast(next ? 'Account Emergency Frozen / Locked' : 'Account Unlocked via Biometric Check', next ? 'warning' : 'success');
      return next;
    });
  };

  const openTransferModal = (data = null) => {
    if (isAccountLocked) {
      showToast('Account is currently locked. Unlock in Security Settings to pay.', 'error');
      setSecurityModalOpen(true);
      return;
    }
    setTransferInitialData(data);
    setTransferModalOpen(true);
  };

  const processPayment = (paymentData) => {
    if (isAccountLocked) {
      showToast('Transaction blocked: Account is frozen.', 'error');
      return;
    }

    if (parseFloat(paymentData.amount) > securitySettings.dailyLimit) {
      showToast(`Transaction exceeds daily security limit of ₹${securitySettings.dailyLimit.toLocaleString()}`, 'error');
      return;
    }

    const newTxn = {
      id: 'TXN' + Math.floor(100000 + Math.random() * 900000),
      type: 'sent',
      recipient: paymentData.recipient || paymentData.upiId || 'Payment',
      upiId: paymentData.upiId || 'merchant@upi',
      amount: parseFloat(paymentData.amount),
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      category: paymentData.category || 'Transfer',
      utr: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      bankUsed: paymentData.bankUsed || 'HDFC Bank •••• 4812',
      note: paymentData.note || ''
    };

    if (paymentData.useWallet) {
      setWalletBalance(prev => Math.max(0, prev - parseFloat(paymentData.amount)));
    }

    setTransactions(prev => [newTxn, ...prev]);
    setReceiptModalData(newTxn);
    showToast(`Payment of ₹${paymentData.amount} successful!`, 'success');
  };

  const addCustomTool = (tool) => {
    setCustomTools(prev => [tool, ...prev]);
    showToast(`Custom Tool "${tool.name}" created!`, 'success');
  };

  const deleteCustomTool = (toolId) => {
    setCustomTools(prev => prev.filter(t => t.id !== toolId));
    showToast('Tool removed', 'info');
  };

  const openFileSender = (fileObj) => {
    setFileSenderModalData(fileObj);
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      walletBalance,
      setWalletBalance,
      bankAccounts,
      contacts,
      transactions,
      isAccountLocked,
      toggleAccountLock,
      securitySettings,
      setSecuritySettings,
      securityModalOpen,
      setSecurityModalOpen,
      transferModalOpen,
      setTransferModalOpen,
      transferInitialData,
      openTransferModal,
      processPayment,
      receiptModalData,
      setReceiptModalData,
      fileSenderModalData,
      setFileSenderModalData,
      openFileSender,
      customTools,
      addCustomTool,
      deleteCustomTool,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
