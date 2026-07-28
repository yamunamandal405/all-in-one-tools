import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, ShieldAlert, Lock, Unlock, Fingerprint, 
  CheckCircle2, AlertTriangle, Key, Smartphone, Sliders 
} from 'lucide-react';

export const AccountSecurityModal = () => {
  const { 
    securityModalOpen, setSecurityModalOpen, isAccountLocked, 
    toggleAccountLock, securitySettings, setSecuritySettings, showToast 
  } = useApp();

  const [biometricSimulating, setBiometricSimulating] = useState(false);

  if (!securityModalOpen) return null;

  const handleBiometricUnlock = () => {
    setBiometricSimulating(true);
    setTimeout(() => {
      setBiometricSimulating(false);
      toggleAccountLock();
    }, 1200);
  };

  const handleLimitChange = (e) => {
    const limit = parseInt(e.target.value);
    setSecuritySettings(prev => ({ ...prev, dailyLimit: limit }));
  };

  const toggleBiometricSetting = () => {
    setSecuritySettings(prev => {
      const next = !prev.biometricEnabled;
      showToast(next ? 'Biometric 2FA Authentication Enabled' : 'Biometric 2FA Disabled', 'info');
      return { ...prev, biometricEnabled: next };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-purple-500/30 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isAccountLocked ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isAccountLocked ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ACCOUNT SECURITY SHIELD</h3>
              <p className="text-[10px] text-gray-400">NPCI & Banking Fraud Protection System</p>
            </div>
          </div>
          <button onClick={() => setSecurityModalOpen(false)} className="text-xs text-gray-400 hover:text-white px-2 py-1">
            Close
          </button>
        </div>

        {/* Lock Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isAccountLocked 
            ? 'bg-rose-950/60 border-rose-500/40 text-rose-200' 
            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
        }`}>
          <div className="flex items-center gap-3">
            {isAccountLocked ? <Lock className="w-6 h-6 text-rose-400 animate-pulse" /> : <ShieldCheck className="w-6 h-6 text-emerald-400" />}
            <div>
              <h4 className="text-xs font-bold">{isAccountLocked ? 'Account Freeze Active' : 'Account Secured (Score 98%)'}</h4>
              <p className="text-[10px] opacity-80">{isAccountLocked ? 'Payments & Transfers blocked' : '256-Bit Encrypted & Anti-Phishing active'}</p>
            </div>
          </div>

          <button
            onClick={isAccountLocked ? handleBiometricUnlock : toggleAccountLock}
            disabled={biometricSimulating}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition ${
              isAccountLocked 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {biometricSimulating ? 'Verifying...' : isAccountLocked ? 'Unlock Account' : 'Freeze Account'}
          </button>
        </div>

        {/* Security Controls */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5 text-xs">
          
          {/* Biometric Toggle */}
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-bold text-gray-200 block">Biometric 2FA Authentication</span>
                <span className="text-[10px] text-gray-400">Require fingerprint / Face ID for transactions</span>
              </div>
            </div>
            <button
              onClick={toggleBiometricSetting}
              className={`w-10 h-5 rounded-full transition p-0.5 ${
                securitySettings.biometricEnabled ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                securitySettings.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Daily Limit Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-gray-300 font-medium">
              <span>Daily UPI Transfer Limit</span>
              <span className="text-emerald-400 font-bold">₹{securitySettings.dailyLimit.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="200000"
              step="10000"
              value={securitySettings.dailyLimit}
              onChange={handleLimitChange}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Anti-Phishing Security Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-gray-200 block">Anti-Phishing Verification Code</span>
                <span className="text-[10px] text-gray-400">Verifies authentic OmniPay popups</span>
              </div>
            </div>
            <span className="font-mono text-xs text-amber-300 font-bold px-2 py-0.5 bg-amber-500/20 rounded-md border border-amber-500/30">
              {securitySettings.antiPhishingCode}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
