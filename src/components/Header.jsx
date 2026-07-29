import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, QrCode, Search, FileText, Image as ImageIcon, 
  Wrench, FileSearch, ArrowRightLeft, Grid, Globe, Gamepad2, Download, Scan, ShieldCheck 
} from 'lucide-react';

export const Header = () => {
  const { activeTab, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Zap },
    { id: 'pdf', label: 'PDF Studio', icon: FileText, badge: 'Gallery' },
    { id: 'doc-scanner', label: 'Doc Scanner', icon: Scan, badge: 'OCR' },
    { id: 'image', label: 'Image Studio', icon: ImageIcon },
    { id: 'resume-designer', label: 'Resume Studio', icon: FileText, badge: 'Live PDF' },
    { id: 'web-designer', label: 'Web Builder', icon: Globe, badge: 'No-Code' },
    { id: 'game-designer', label: 'Game Studio', icon: Gamepad2, badge: 'Arcade' },
    { id: 'downloader', label: 'Downloader', icon: Download, badge: 'Vault' },
    { id: 'converters', label: 'Converters', icon: ArrowRightLeft },
    { id: 'qr', label: 'QR Engine', icon: QrCode },
  ];

  const handleSearchSelect = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery('');
  };

  const filteredNav = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* Top Navbar Row */}
      <div className="bg-zinc-950 border-b border-zinc-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Brand */}
            <div 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                O
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block leading-none">
                  OmniSuite
                </span>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                  Professional Suite
                </span>
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="relative hidden md:block w-80">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search tools, converters, designers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 text-xs font-medium rounded-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:bg-black focus:border-purple-500 focus:outline-none transition shadow-inner"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  ⌘K
                </span>
              </div>

              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 text-white rounded-2xl p-2 border border-zinc-700 shadow-2xl z-50 animate-fadeIn">
                  {filteredNav.length > 0 ? (
                    filteredNav.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSearchSelect(item.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-800 rounded-xl text-left transition"
                      >
                        <item.icon className="w-4 h-4 text-purple-400" />
                        <span>{item.label}</span>
                      </button>
                    ))
                  ) : (
                    <p className="p-3 text-xs text-zinc-400 text-center">No matching tools found</p>
                  )}
                </div>
              )}
            </div>

            {/* Status & Quick Action */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                System Active
              </div>

              <button
                onClick={() => setActiveTab('pdf')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition active:scale-95"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Image to PDF</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b border-zinc-800 bg-black px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
                    isActive ? 'bg-white text-purple-700' : 'bg-zinc-800 text-purple-300 border border-zinc-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
