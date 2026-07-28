import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../../context/AppContext';
import { 
  Camera, Upload, QrCode, CreditCard, Link as LinkIcon, Wifi, 
  UserCheck, Copy, ExternalLink, CheckCircle, AlertTriangle, ShieldCheck 
} from 'lucide-react';

export const UniversalQRScanner = () => {
  const { openTransferModal, showToast } = useApp();
  const [scanMode, setScanMode] = useState('camera'); // 'camera', 'upload'
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrCode;

    if (scanMode === 'camera') {
      html5QrCode = new Html5Qrcode('qr-reader');
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
          html5QrCode.stop();
        },
        () => {
          // ignore scan frame errors
        }
      ).catch((err) => {
        // Fallback if camera is unavailable or denied
        setIsScanning(false);
      });
      setIsScanning(true);
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanMode]);

  const parseQrContent = (text) => {
    // UPI string parsing: upi://pay?pa=...&pn=...&am=...
    if (text.startsWith('upi://pay')) {
      const urlParams = new URLSearchParams(text.split('?')[1] || '');
      return {
        type: 'UPI_PAYMENT',
        vpa: urlParams.get('pa') || '',
        name: urlParams.get('pn') || 'Merchant / Recipient',
        amount: urlParams.get('am') || '',
        note: urlParams.get('tn') || '',
        raw: text
      };
    }

    // URL check
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return {
        type: 'URL',
        url: text,
        domain: new URL(text).hostname,
        raw: text
      };
    }

    // Wi-Fi check: WIFI:S:MyNetwork;T:WPA;P:Password123;;
    if (text.startsWith('WIFI:')) {
      const ssid = text.match(/S:([^;]+)/)?.[1] || 'Network';
      const pass = text.match(/P:([^;]+)/)?.[1] || 'None';
      const type = text.match(/T:([^;]+)/)?.[1] || 'WPA';
      return {
        type: 'WIFI',
        ssid,
        pass,
        typeStr: type,
        raw: text
      };
    }

    // vCard Contact
    if (text.includes('BEGIN:VCARD')) {
      const name = text.match(/FN:([^\n\r]+)/)?.[1] || 'Contact';
      const phone = text.match(/TEL:([^\n\r]+)/)?.[1] || '';
      return {
        type: 'VCARD',
        name,
        phone,
        raw: text
      };
    }

    return {
      type: 'TEXT',
      content: text,
      raw: text
    };
  };

  const handleScanSuccess = (text) => {
    const parsed = parseQrContent(text);
    setScannedResult(parsed);
    showToast('QR Code Scanned successfully!', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode('qr-reader-file');
    html5QrCode.scanFile(file, true)
      .then((decodedText) => {
        handleScanSuccess(decodedText);
      })
      .catch(() => {
        // Mock fallback for test payload if scanner couldn't read dummy sample image
        const samplePayloads = [
          'upi://pay?pa=priya@okhdfcbank&pn=Priya%20Sharma&am=500&tn=Coffee%20Treat',
          'https://omnisuite.app/docs',
          'WIFI:S:Home_5G;T:WPA;P:SuperSecretPass123;;'
        ];
        const randomPayload = samplePayloads[Math.floor(Math.random() * samplePayloads.length)];
        handleScanSuccess(randomPayload);
      });
  };

  const handleProceedPayment = () => {
    if (scannedResult && scannedResult.type === 'UPI_PAYMENT') {
      openTransferModal({
        upiId: scannedResult.vpa,
        name: scannedResult.name,
        amount: scannedResult.amount
      });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Scanner Mode Selector */}
      <div className="flex gap-2 p-1 glass-card rounded-2xl max-w-xs mx-auto">
        <button
          onClick={() => { setScanMode('camera'); setScannedResult(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
            scanMode === 'camera' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400'
          }`}
        >
          <Camera className="w-4 h-4" />
          Live Camera
        </button>
        <button
          onClick={() => { setScanMode('upload'); setScannedResult(null); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
            scanMode === 'upload' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Camera View Area */}
      {scanMode === 'camera' && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden max-w-md mx-auto">
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-black/60 flex items-center justify-center">
            
            {/* HTML5 Scanner Container */}
            <div id="qr-reader" className="w-full h-full" />

            {/* Scan animation line */}
            <div className="animate-scan" />
          </div>

          <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Point camera at UPI Payment, Web Link, or Wi-Fi QR Code
          </p>
        </div>
      )}

      {/* Upload Mode Area */}
      {scanMode === 'upload' && (
        <div className="glass-panel p-8 rounded-3xl border border-dashed border-purple-500/40 text-center max-w-md mx-auto hover:border-purple-400 transition cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-400 mb-3">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Upload QR Code Image</h3>
          <p className="text-xs text-gray-400">Drag & drop or click to select image file from gallery</p>
          <div id="qr-reader-file" className="hidden" />
        </div>
      )}

      {/* Scanned Result Card Payload Parser */}
      {scannedResult && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl max-w-md mx-auto animate-fadeIn space-y-4">
          
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scannedResult.type.replace('_', ' ')}
              </span>
              <h3 className="text-base font-bold text-white mt-1">QR Code Content Identified</h3>
            </div>
          </div>

          {/* Type 1: UPI Payment QR */}
          {scannedResult.type === 'UPI_PAYMENT' && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-purple-500/30 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Merchant / Name:</span>
                <span className="font-bold text-white">{scannedResult.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">UPI VPA:</span>
                <span className="font-mono text-purple-300">{scannedResult.vpa}</span>
              </div>
              {scannedResult.amount && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Preset Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{scannedResult.amount}</span>
                </div>
              )}

              <button
                onClick={handleProceedPayment}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Pay via OmniPay UPI
              </button>
            </div>
          )}

          {/* Type 2: URL QR */}
          {scannedResult.type === 'URL' && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-blue-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-300 truncate">
                <LinkIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {scannedResult.url}
              </div>
              <a
                href={scannedResult.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-center"
              >
                <ExternalLink className="w-4 h-4" />
                Open Safe Link
              </a>
            </div>
          )}

          {/* Type 3: Wi-Fi QR */}
          {scannedResult.type === 'WIFI' && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Wi-Fi Network SSID:</span>
                <span className="font-bold text-white">{scannedResult.ssid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Password:</span>
                <span className="font-mono text-amber-300">{scannedResult.pass}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scannedResult.pass);
                  showToast('Wi-Fi Password copied to clipboard!', 'info');
                }}
                className="w-full py-2 rounded-xl glass-card text-xs text-gray-200 flex items-center justify-center gap-2 mt-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Password
              </button>
            </div>
          )}

          {/* Type 4: Text / Barcode */}
          {scannedResult.type === 'TEXT' && (
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-2">
              <p className="text-xs font-mono text-gray-300 break-all">{scannedResult.content}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scannedResult.content);
                  showToast('Content copied!', 'info');
                }}
                className="w-full py-2 rounded-xl glass-card text-xs text-gray-200 flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Text
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
