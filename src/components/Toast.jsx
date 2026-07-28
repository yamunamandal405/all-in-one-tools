import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/40',
    error: 'border-rose-500/40 bg-rose-950/40',
    warning: 'border-amber-500/40 bg-amber-950/40',
    info: 'border-indigo-500/40 bg-indigo-950/40'
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-bounce">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border ${borders[toast.type] || borders.info} shadow-2xl backdrop-blur-xl max-w-sm`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-gray-100">{toast.message}</p>
      </div>
    </div>
  );
};
