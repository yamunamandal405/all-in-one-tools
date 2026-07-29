import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, QrCode, Wallet, FileText, Image as ImageIcon, 
  Wrench, FileSearch, ArrowRightLeft, Grid, ChevronLeft, ChevronRight, 
  ShieldCheck, Lock
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { activeTab, setActiveTab } = useApp();

  const navCategories = [
    {
      title: 'DOCUMENTS & MEDIA',
      items: [
        { id: 'home', label: 'Dashboard Overview', icon: Zap },
        { id: 'pdf', label: 'PDF Studio & Gallery', icon: FileText, badge: 'Gallery' },
        { id: 'image', label: 'Image Graphic Designer', icon: ImageIcon },
        { id: 'doc-scanner', label: 'Document Scanner OCR', icon: FileSearch, badge: 'AI Scan' },
        { id: 'qr', label: 'Universal QR Engine', icon: QrCode },
      ]
    },
    {
      title: 'DESIGNERS & BUILDERS',
      items: [
        { id: 'resume-designer', label: 'Resume Designer Studio', icon: FileText, badge: 'Live PDF' },
        { id: 'web-designer', label: 'Website Designer Tools', icon: Grid, badge: 'No-Code' },
        { id: 'game-designer', label: 'Game Site & 2D Builder', icon: Wrench, badge: 'Arcade' },
        { id: 'tool-builder', label: 'Custom Tool Designer', icon: Wrench },
      ]
    },
    {
      title: 'UTILITIES & CONVERTERS',
      items: [
        { id: 'converters', label: 'All-Type Converters', icon: ArrowRightLeft },
        { id: 'downloader', label: 'Universal Downloader', icon: Wallet, badge: 'Vault' },
        { id: 'more-tools', label: 'Utility Extras', icon: Grid },
      ]
    }
  ];

  return (
    <aside 
      className={`hidden lg:flex flex-col bg-zinc-950 border-r border-zinc-800 transition-all duration-300 sticky top-0 h-screen z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md flex-shrink-0">
            O
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-extrabold text-white tracking-tight block leading-none">
                OmniSuite
              </span>
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                Black Edition
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navCategories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-2">
                {cat.title}
              </h4>
            )}

            {cat.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all relative group ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-purple-400'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ml-1 flex-shrink-0 ${
                          isActive ? 'bg-white text-purple-700' : 'bg-zinc-900 text-purple-300 border border-zinc-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Workspace Status Footer */}
      <div className="p-4 border-t border-zinc-800 bg-black/80">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">Omni Engine v1.0</span>
              <span className="text-[10px] text-zinc-400 font-medium block truncate">All Systems Operational</span>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
