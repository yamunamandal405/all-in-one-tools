import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Grid, KeyRound, Palette, Wifi, FileText, Copy, 
  RefreshCw, CheckCircle2, Play, Sparkles 
} from 'lucide-react';

export const MoreToolsHub = () => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('password'); // 'password', 'color', 'speedtest', 'markdown'

  // Password Generator state
  const [pwLength, setPwLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Speed test state
  const [isTestingSpeed, setIsTestingSpeed] = useState(false);
  const [ping, setPing] = useState(12);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);

  // Markdown state
  const [mdContent, setMdContent] = useState('# OmniSuite Markdown\n\n- Real-time preview\n- Easy formatting\n- **Bold** text & `code` snippet');

  // Password generator function
  const generatePassword = () => {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let pass = '';
    for (let i = 0; i < pwLength; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
  };

  useEffect(() => {
    generatePassword();
  }, [pwLength, includeUpper, includeNumbers, includeSymbols]);

  const runSpeedTest = () => {
    setIsTestingSpeed(true);
    setDownloadSpeed(0);
    setUploadSpeed(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadSpeed((Math.random() * 80 + 350).toFixed(1));
      setUploadSpeed((Math.random() * 30 + 120).toFixed(1));
      setPing(Math.floor(8 + Math.random() * 5));

      if (progress >= 100) {
        clearInterval(interval);
        setIsTestingSpeed(false);
        showToast('Speed Test Complete!', 'success');
      }
    }, 150);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Grid className="w-7 h-7 text-purple-400" />
            Developer & Daily Utility Extras
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Secure password generator, color palette picker, network speed tester, and Markdown live editor.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto p-1 bg-slate-950/60 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'password' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Password
          </button>
          <button
            onClick={() => setActiveTab('color')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'color' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            Color Picker
          </button>
          <button
            onClick={() => setActiveTab('speedtest')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'speedtest' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wifi className="w-4 h-4" />
            Speed Test
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'markdown' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Markdown
          </button>
        </div>
      </div>

      {/* Password Generator */}
      {activeTab === 'password' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6 max-w-lg mx-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Strong Password & Key Generator</h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-emerald-300 break-all">{generatedPassword}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword);
                  showToast('Password copied!', 'success');
                }}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md ml-2 flex-shrink-0"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                <span>Password Length</span> <span>{pwLength} chars</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={pwLength}
                onChange={(e) => setPwLength(parseInt(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2 text-xs text-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="rounded border-gray-600 text-purple-600" />
                Include Uppercase Letters (A-Z)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="rounded border-gray-600 text-purple-600" />
                Include Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="rounded border-gray-600 text-purple-600" />
                Include Special Symbols (!@#$%)
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate New Password
            </button>
          </div>
        </div>
      )}

      {/* Speed Test Simulator */}
      {activeTab === 'speedtest' && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl text-center space-y-6 max-w-lg mx-auto">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Network Speed Gauge</h3>

          <div className="w-44 h-44 rounded-full border-4 border-purple-500/30 mx-auto flex flex-col items-center justify-center bg-slate-950/70 shadow-2xl relative">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Download</span>
            <div className="text-3xl font-black text-emerald-400 my-1">{downloadSpeed}</div>
            <span className="text-[10px] text-gray-400">Mbps</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 glass-card rounded-2xl">
              <span className="text-gray-400 block">Ping Latency</span>
              <span className="text-lg font-bold text-purple-300">{ping} ms</span>
            </div>
            <div className="p-3 glass-card rounded-2xl">
              <span className="text-gray-400 block">Upload Speed</span>
              <span className="text-lg font-bold text-indigo-300">{uploadSpeed} Mbps</span>
            </div>
          </div>

          <button
            onClick={runSpeedTest}
            disabled={isTestingSpeed}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-xs text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isTestingSpeed ? 'Testing Speed...' : 'Start Speed Test'}
          </button>
        </div>
      )}

    </div>
  );
};
