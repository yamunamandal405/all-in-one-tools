import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Wallet, QrCode, FileText, Image as ImageIcon, Wrench } from 'lucide-react';

export const NavigationMobile = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs = [
    { id: 'home', label: 'Home', icon: Zap },
    { id: 'pdf', label: 'PDF Studio', icon: FileText },
    { id: 'doc-scanner', label: 'Scanner', icon: QrCode, highlight: true },
    { id: 'image', label: 'Designer', icon: ImageIcon },
    { id: 'web-designer', label: 'Web Builder', icon: Wrench },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-white/10 px-2 py-2 backdrop-blur-2xl">
      <div className="flex items-center justify-around">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-lg shadow-purple-600/50 group-active:scale-95 transition-transform">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-300 animate-pulse" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-300 mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                isActive ? 'text-purple-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
