import React, { useState } from 'react';
import { Lock, Delete, ShieldCheck, AlertCircle } from 'lucide-react';

export const UpiPinModal = ({ isOpen, onClose, onSuccess, recipientName, amount }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Please enter a 4 or 6-digit UPI PIN');
      return;
    }
    // Simulate PIN verification
    onSuccess();
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-purple-500/30 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ENTER UPI PIN</h3>
              <p className="text-[10px] text-gray-400">NPCI Secure Payment Gate</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white px-2 py-1"
          >
            Cancel
          </button>
        </div>

        {/* Recipient & Amount Badge */}
        <div className="my-5 text-center bg-slate-900/60 p-3 rounded-2xl border border-white/5">
          <span className="text-xs text-gray-400">Paying to <strong className="text-purple-300">{recipientName}</strong></span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            ₹{parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 my-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > index
                  ? 'bg-purple-500 border-purple-400 shadow-md shadow-purple-500/50 scale-110'
                  : 'border-gray-600 bg-slate-900/50'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-rose-400 text-center mb-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 my-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="py-3 rounded-2xl glass-card text-lg font-bold text-gray-200 hover:bg-purple-600/30 hover:border-purple-500/50 active:scale-95 transition"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="py-3 rounded-2xl glass-card text-gray-400 flex items-center justify-center hover:bg-rose-500/20 active:scale-95 transition"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3 rounded-2xl glass-card text-lg font-bold text-gray-200 hover:bg-purple-600/30 active:scale-95 transition"
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="py-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition"
          >
            SUBMIT
          </button>
        </div>

        <p className="text-[10px] text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" /> Encrypted 256-bit UPI PIN authorization
        </p>

      </div>
    </div>
  );
};
