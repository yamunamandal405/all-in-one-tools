import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileSearch, Search, Upload, Share2, FileText, Image as ImageIcon, 
  Copy, Download, QrCode, Mail, Smartphone, ExternalLink, Filter 
} from 'lucide-react';

const SAMPLE_INDEXED_FILES = [
  { id: 'f1', name: 'Invoice_HDFC_July_2026.pdf', type: 'PDF', size: '1.2 MB', tags: ['invoice', 'hdfc', 'july', 'finance'], date: '2026-07-15' },
  { id: 'f2', name: 'Profile_Avatar_Hd.png', type: 'Image', size: '850 KB', tags: ['image', 'avatar', 'photo'], date: '2026-07-20' },
  { id: 'f3', name: 'Project_Contract_Signed.pdf', type: 'PDF', size: '3.4 MB', tags: ['contract', 'agreement', 'legal'], date: '2026-07-22' },
  { id: 'f4', name: 'UPI_Payment_Receipt_60291.pdf', type: 'PDF', size: '420 KB', tags: ['payment', 'receipt', 'upi', 'transfer'], date: '2026-07-28' },
  { id: 'f5', name: 'Logo_Vector_Transparent.svg', type: 'Image', size: '120 KB', tags: ['logo', 'brand', 'vector'], date: '2026-07-25' }
];

export const AiFileSearchHub = () => {
  const { showToast, fileSenderModalData, setFileSenderModalData, openFileSender } = useApp();
  const [indexedFiles, setIndexedFiles] = useState(SAMPLE_INDEXED_FILES);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newIndexed = files.map((file, idx) => ({
      id: 'f_' + Date.now() + idx,
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'Image' : 'Document',
      size: (file.size / 1024).toFixed(1) + ' KB',
      tags: file.name.toLowerCase().split(/[\s._-]+/),
      date: new Date().toISOString().slice(0, 10)
    }));

    setIndexedFiles(prev => [...newIndexed, ...prev]);
    showToast(`Indexed ${files.length} document(s) for fast search!`, 'success');
  };

  const filteredFiles = indexedFiles.filter(f => {
    if (!searchQuery) return true;
    const queryLower = searchQuery.toLowerCase();
    const matchesName = f.name.toLowerCase().includes(queryLower);
    const matchesType = f.type.toLowerCase().includes(queryLower);
    const matchesTags = f.tags.some(t => t.includes(queryLower));
    return matchesName || matchesType || matchesTags;
  });

  const handleNativeShare = async (file) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.name,
          text: `File shared via OmniSuite: ${file.name}`,
          url: window.location.href
        });
        showToast('Shared via System Share!', 'success');
      } catch {
        // Share cancelled
      }
    } else {
      openFileSender(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileSearch className="w-7 h-7 text-purple-400" />
            Universal Document Search & Cross-App Sender
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Search document index by title, category, or file tag, and export directly to any messaging or email app.
          </p>
        </div>

        {/* File Indexer Button */}
        <label className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition">
          <Upload className="w-4 h-4" />
          Index Files to Workspace
          <input type="file" multiple onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search documents by keyword, e.g. 'receipt', 'invoice pdf', 'contract'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl glass-input font-medium text-white placeholder-gray-400"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {['pdf', 'invoice', 'receipt', 'image', 'contract'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1 rounded-full glass-card text-[11px] font-medium text-purple-300 hover:border-purple-500/50"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Indexed Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 hover:border-purple-500/50 transition group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2.5 rounded-xl ${
                  file.type === 'PDF' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {file.type === 'PDF' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate max-w-[160px]">
                    {file.name}
                  </h4>
                  <p className="text-[10px] text-gray-400">{file.size} • {file.date}</p>
                </div>
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1">
              {file.tags.map((t, i) => (
                <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 font-mono">
                  {t}
                </span>
              ))}
            </div>

            {/* Share Actions */}
            <div className="pt-2 border-t border-white/5 flex gap-2">
              <button
                onClick={() => handleNativeShare(file)}
                className="flex-1 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-[11px] font-bold text-purple-300 flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Universal Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Universal File Sender Modal */}
      {fileSenderModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-purple-500/30 shadow-2xl relative space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-400" />
                Cross-App File Sender
              </h3>
              <button onClick={() => setFileSenderModalData(null)} className="text-xs text-gray-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{fileSenderModalData.name}</h4>
                <p className="text-[10px] text-gray-400">{fileSenderModalData.size || 'Shared File'}</p>
              </div>
            </div>

            {/* Target Apps Grid */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out file: ' + fileSenderModalData.name)}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl glass-card text-center hover:border-emerald-500/50 transition block"
              >
                <Smartphone className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">WhatsApp</span>
                <span className="text-[9px] text-gray-400">Direct Message</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Shared File: ' + fileSenderModalData.name)}&body=${encodeURIComponent('Please find file attached: ' + fileSenderModalData.name)}`}
                className="p-3 rounded-2xl glass-card text-center hover:border-blue-500/50 transition block"
              >
                <Mail className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">Email</span>
                <span className="text-[9px] text-gray-400">Mail Draft</span>
              </a>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Share link copied!', 'info');
              }}
              className="w-full py-2.5 rounded-xl bg-purple-600 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Direct Transfer Link
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
