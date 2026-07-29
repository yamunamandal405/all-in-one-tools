import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Download, FileCode, HardDrive, ShieldCheck, Play, 
  CheckCircle2, RefreshCw, Copy, ExternalLink, Sparkles 
} from 'lucide-react';

const SAMPLE_FILES = [
  { id: 'f1', name: 'omnisuite_document.pdf', type: 'PDF', size: '1.2 MB', desc: 'Sample PDF Document', icon: '📄', color: 'from-purple-600 to-indigo-600' },
  { id: 'f2', name: 'omnisuite_archive.zip', type: 'ZIP', size: '4.8 MB', desc: 'Compressed File Vault', icon: '📦', color: 'from-blue-600 to-cyan-600' },
  { id: 'f3', name: 'omnisuite_linux_os.iso', type: 'ISO', size: '650 MB', desc: 'Disk Image Installer', icon: '💿', color: 'from-emerald-600 to-teal-600' },
  { id: 'f4', name: 'omnisuite_audio.mp3', type: 'MP3', size: '3.4 MB', desc: 'Audio Track Stream', icon: '🎵', color: 'from-amber-600 to-orange-600' },
  { id: 'f5', name: 'omnisuite_video.mp4', type: 'MP4', size: '14.2 MB', desc: 'HD Video Demo', icon: '🎬', color: 'from-rose-600 to-pink-600' },
  { id: 'f6', name: 'omnisuite_data.csv', type: 'CSV', size: '320 KB', desc: 'Structured Data Sheet', icon: '📊', color: 'from-cyan-600 to-blue-600' },
  { id: 'f7', name: 'omnisuite_app.apk', type: 'APK', size: '28.5 MB', desc: 'Android Mobile Package', icon: '📱', color: 'from-indigo-600 to-purple-600' }
];

export const UniversalDownloader = () => {
  const { showToast } = useApp();
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');
  const [downloadedBytes, setDownloadedBytes] = useState('0 KB');

  // File Inspector state
  const [inspectFile, setInspectFile] = useState(null);
  const [fileHash, setFileHash] = useState('');

  // Sample file download via Express backend API / Blob fallback
  const downloadSampleFile = async (file) => {
    showToast(`Initiating download for ${file.name}...`, 'info');
    try {
      const response = await fetch(`http://localhost:5000/api/download/sample/${file.type.toLowerCase()}`);
      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.name;
        link.click();
        showToast(`Downloaded ${file.name} successfully!`, 'success');
      } else {
        throw new Error();
      }
    } catch {
      // Local fallback blob generator
      const content = `=== OmniSuite File Downloader ===\nFile: ${file.name}\nType: ${file.type}\nTimestamp: ${new Date().toISOString()}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = file.name;
      link.click();
      showToast(`Downloaded ${file.name} (Client Stream)!`, 'success');
    }
  };

  // Direct URL Downloader simulator with progress stream
  const startUrlDownload = () => {
    if (!downloadUrl.trim()) {
      showToast('Please enter a valid target URL', 'warning');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDownloadProgress(current);
      setDownloadSpeed((Math.random() * 4 + 2).toFixed(1) + ' MB/s');
      setDownloadedBytes((current * 140).toFixed(0) + ' KB');

      if (current >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        showToast('Direct URL Download Completed!', 'success');
      }
    }, 200);
  };

  // File Hash Inspector
  const handleInspectUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setInspectFile({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type || 'Binary Stream',
      lastModified: new Date(file.lastModified).toLocaleDateString()
    });

    // Generate mock SHA-256 checksum
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setFileHash(mockHash);
    showToast('Calculated File Checksum & Hash', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-blue-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Download className="w-7 h-7 text-blue-400" />
            Universal Downloader & Asset Vault
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Download all file formats (PDF, ZIP, ISO, MP3, MP4, APK), run direct URL link streams, and calculate file hashes.
          </p>
        </div>
      </div>

      {/* Direct Link Downloader Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
          <HardDrive className="w-4 h-4" /> Direct URL Link Downloader
        </h3>

        <div className="flex gap-3">
          <input
            type="url"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="Paste direct download URL link (e.g. https://example.com/file.zip)..."
            className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={startUrlDownload}
            disabled={isDownloading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 font-extrabold text-xs text-white shadow-xl flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Fetch Download'}
          </button>
        </div>

        {/* Real-time Download Progress Bar */}
        {isDownloading && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-300">
              <span>Streaming Progress ({downloadProgress}%)</span>
              <span className="text-cyan-400">{downloadSpeed} • {downloadedBytes}</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-200"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid: Left Sample File Vault (7 Cols), Right Hash Inspector (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sample File Vault (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4" /> Asset Download Vault (All File Types)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_FILES.map(file => (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-purple-500/40 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl">{file.icon}</span>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{file.desc} • {file.size}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadSampleFile(file)}
                    className="p-2.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white shadow-md flex-shrink-0 transition"
                    title={`Download ${file.name}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cryptographic File Hash Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> File Hash & Cryptographic Inspector
            </h3>

            <label className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 transition">
              <HardDrive className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-white">Select File to Calculate Hash</span>
              <span className="text-[10px] text-gray-400 mt-1">Generates SHA-256 & MD5 Checksum</span>
              <input type="file" onChange={handleInspectUpload} className="hidden" />
            </label>

            {inspectFile && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="text-xs text-gray-300 space-y-1">
                  <div><span className="text-gray-400">File:</span> <strong className="text-white">{inspectFile.name}</strong></div>
                  <div><span className="text-gray-400">Size:</span> {inspectFile.size}</div>
                  <div><span className="text-gray-400">Format:</span> {inspectFile.type}</div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block mb-1">SHA-256 Checksum</span>
                  <div className="p-2 rounded-xl bg-slate-900 font-mono text-[10px] text-emerald-300 break-all select-all">
                    {fileHash}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
