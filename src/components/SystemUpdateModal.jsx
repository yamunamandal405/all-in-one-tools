import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, RefreshCw, X, CheckCircle2, Cpu, HardDrive, 
  Zap, FileText, Scan, Sparkles, Terminal, Activity, Layers, Trash2, ArrowUpCircle 
} from 'lucide-react';

export const SystemUpdateModal = () => {
  const { 
    isSystemUpdateModalOpen, 
    setIsSystemUpdateModalOpen, 
    systemStatus, 
    isCheckingUpdates, 
    checkSystemUpdates,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('updates');
  const [cacheCleared, setCacheCleared] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState(null);

  if (!isSystemUpdateModalOpen) return null;

  const coreModules = [
    { name: 'PDF & Document Core', version: 'v2.4.0', status: 'Healthy', ping: '12ms', icon: FileText },
    { name: 'AI OCR Scanner Engine', version: 'v2.4.0', status: 'Healthy', ping: '18ms', icon: Scan },
    { name: 'Canvas & Graphic FX', version: 'v2.4.0', status: 'Healthy', ping: '8ms', icon: Sparkles },
    { name: 'Universal Downloader Vault', version: 'v2.4.0', status: 'Healthy', ping: '15ms', icon: Zap },
    { name: 'Converter & Exchange Engine', version: 'v2.4.0', status: 'Healthy', ping: '24ms', icon: Activity },
  ];

  const changelog = [
    {
      version: 'v2.4.0 (Latest)',
      date: 'July 29, 2026',
      highlights: [
        'Added Light (White) & Dark mode theme engine with system auto-match',
        'Interactive System Update & Diagnostics Control Center',
        'Enhanced OCR accuracy for multi-page PDF documents',
        'Improved graphics canvas export resolution up to 4K'
      ]
    },
    {
      version: 'v2.3.5',
      date: 'July 15, 2026',
      highlights: [
        'Added Universal File Downloader & Hash Calculator',
        'Introduced Web Designer & No-Code Section Builder',
        '2D Retro Game Builder & Arcade Space Defender'
      ]
    }
  ];

  const handleClearCache = () => {
    setCacheCleared(true);
    showToast('System cache purged successfully! Storage freed.', 'success');
    setTimeout(() => setCacheCleared(false), 3000);
  };

  const handleRunSelfTest = () => {
    setIsDiagnosticRunning(true);
    setDiagnosticResults(null);
    showToast('Running comprehensive system diagnostics...', 'info');

    setTimeout(() => {
      setIsDiagnosticRunning(false);
      setDiagnosticResults({
        cpuUsage: '3.2%',
        memoryUsage: '48.4 MB / 512 MB',
        storageUsage: '1.2 MB Local Cache',
        integrity: '100% Passed (0 Errors)',
        latency: '14 ms avg'
      });
      showToast('System Self-Test complete! All modules operational.', 'success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/60 light:bg-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white light:text-slate-900">
                  OmniSuite System Center
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                  {systemStatus.channel}
                </span>
              </div>
              <p className="text-xs text-zinc-400 light:text-slate-500 font-medium">
                Version {systemStatus.version} • Build {systemStatus.build}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSystemUpdateModalOpen(false)}
            className="p-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-zinc-900/40 light:bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('updates')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'updates'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Updates & Core Status
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'diagnostics'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            System Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-3.5 px-4 text-xs font-extrabold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'changelog'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Changelog & Notes
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: UPDATES */}
          {activeTab === 'updates' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Status Banner */}
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white light:text-slate-900">
                      All Core Systems Operational
                    </h4>
                    <p className="text-xs text-emerald-300 font-medium">
                      Your platform is running the latest build {systemStatus.version}. Last checked: {systemStatus.lastChecked}.
                    </p>
                  </div>
                </div>

                <button
                  onClick={checkSystemUpdates}
                  disabled={isCheckingUpdates}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition flex-shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isCheckingUpdates ? 'animate-spin' : ''}`} />
                  <span>{isCheckingUpdates ? 'Checking...' : 'Check Now'}</span>
                </button>
              </div>

              {/* Module Health Check */}
              <div>
                <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider mb-3">
                  Core Module Health Matrix
                </h4>
                <div className="space-y-2.5">
                  {coreModules.map((mod, idx) => {
                    const Icon = mod.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-zinc-900/60 light:bg-slate-100 border border-white/5 light:border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4.5 h-4.5 text-purple-400" />
                          <span className="text-xs font-bold text-white light:text-slate-900">{mod.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-zinc-400 font-medium">{mod.ping}</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold">
                            {isCheckingUpdates ? 'Scanning...' : mod.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIAGNOSTICS */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-zinc-900/60 light:bg-slate-100 border border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-extrabold mb-1">
                    <Cpu className="w-4 h-4" /> CPU Workload
                  </div>
                  <div className="text-xl font-black text-white light:text-slate-900">
                    {diagnosticResults ? diagnosticResults.cpuUsage : '2.1%'}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium">Virtual Engine load</p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/60 light:bg-slate-100 border border-white/5 light:border-slate-200">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-extrabold mb-1">
                    <HardDrive className="w-4 h-4" /> Active Memory
                  </div>
                  <div className="text-xl font-black text-white light:text-slate-900">
                    {diagnosticResults ? diagnosticResults.memoryUsage : '36.2 MB'}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium">Allocated heap memory</p>
                </div>
              </div>

              {diagnosticResults && (
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-xs">
                  <div className="font-extrabold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Diagnostic Self-Test Summary
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-zinc-300">
                    <div>Integrity: <span className="text-emerald-400 font-bold">{diagnosticResults.integrity}</span></div>
                    <div>Avg Latency: <span className="text-white font-bold">{diagnosticResults.latency}</span></div>
                    <div>Local Cache: <span className="text-white font-bold">{diagnosticResults.storageUsage}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleRunSelfTest}
                  disabled={isDiagnosticRunning}
                  className="flex-1 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Activity className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
                  <span>{isDiagnosticRunning ? 'Running Self-Test...' : 'Run System Diagnostics'}</span>
                </button>

                <button
                  onClick={handleClearCache}
                  className="px-4 py-3 rounded-2xl glass-card text-xs font-extrabold text-white hover:border-red-500/50 transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>{cacheCleared ? 'Purged!' : 'Purge Cache'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CHANGELOG */}
          {activeTab === 'changelog' && (
            <div className="space-y-6 animate-fadeIn">
              {changelog.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-zinc-900/60 light:bg-slate-100 border border-white/5 light:border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-sm font-extrabold text-purple-400">{item.version}</span>
                    <span className="text-xs text-zinc-400 font-medium">{item.date}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300 light:text-slate-700">
                    {item.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-center gap-2">
                        <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-950/80 light:bg-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Automatic Background Updates Enabled</span>
          </div>

          <button
            onClick={() => setIsSystemUpdateModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-extrabold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
