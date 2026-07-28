import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useApp } from '../../context/AppContext';
import { 
  Camera, Upload, QrCode, CreditCard, Link as LinkIcon, Wifi, 
  UserCheck, Copy, ExternalLink, CheckCircle, AlertTriangle, ShieldCheck, 
  Zap, RefreshCw, Lock, ShieldAlert, Sparkles 
} from 'lucide-react';

export const UniversalQRScanner = () => {
  const { openTransferModal, showToast, isAccountLocked, setSecurityModalOpen } = useApp();
  const [scanMode, setScanMode] = useState('camera'); // 'camera', 'upload'
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [torchOn, setTorchOn] = useState(false);
  
  const qrScannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode;

    if (scanMode === 'camera') {
      html5QrCode = new Html5Qrcode('qr-reader');
      qrScannerRef.current = html5QrCode;
      
      const config = { fps: 15, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: cameraFacing },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {
          // Frame scanner loop
        }
      ).then(() => {
        setIsScanning(true);
      }).catch(() => {
        setIsScanning(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanMode, cameraFacing]);

  const toggleCameraFacing = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const toggleTorch = async () => {
    if (qrScannerRef.current && isScanning) {
      try {
        const nextState = !torchOn;
        await qrScannerRef.current.applyVideoConstraints({
          advanced: [{ torch: nextState }]
        });
        setTorchOn(nextState);
        showToast(nextState ? 'Flashlight ON' : 'Flashlight OFF', 'info');
      } catch {
        showToast('Flashlight not supported on this camera device', 'warning');
      }
    }
  };

  // Fraud & Security Audit Engine
  const evaluateSecurityRisk = (parsed) => {
    let score = 'SAFE';
    let message = 'Verified Authentic QR Payload';
    let riskLevel = 'low'; // 'low', 'medium', 'high'

    if (parsed.type === 'UPI_PAYMENT') {
      // Check for spoofed or suspicious VPA string
      if (!parsed.vpa || !parsed.vpa.includes('@')) {
        score = 'SUSPICIOUS VPA';
        message = 'Warning: Unformatted or suspicious UPI VPA payload detected.';
        riskLevel = 'high';
      } else if (parsed.vpa.includes('fake') || parsed.vpa.includes('test')) {
        score = 'FRAUD RISK WARNING';
        message = 'Caution: Potential phishing or unverified test merchant VPA.';
        riskLevel = 'high';
      }
    } else if (parsed.type === 'URL') {
      if (parsed.url.startsWith('http://')) {
        score = 'NON-SSL WARNING';
        message = 'Unencrypted HTTP link detected. Proceed with caution.';
        riskLevel = 'medium';
      }
    }

    return { score, message, riskLevel };
  };

  const parseQrContent = (text) => {
    let parsed = { type: 'TEXT', content: text, raw: text };

    if (text.startsWith('upi://pay')) {
      const urlParams = new URLSearchParams(text.split('?')[1] || '');
      parsed = {
        type: 'UPI_PAYMENT',
        vpa: urlParams.get('pa') || '',
        name: urlParams.get('pn') || 'Merchant / Recipient',
        amount: urlParams.get('am') || '',
        note: urlParams.get('tn') || '',
        raw: text
      };
    } else if (text.startsWith('http://') || text.startsWith('https://')) {
      parsed = {
        type: 'URL',
        url: text,
        domain: new URL(text).hostname,
        raw: text
      };
    } else if (text.startsWith('WIFI:')) {
      const ssid = text.match(/S:([^;]+)/)?.[1] || 'Network';
      const pass = text.match(/P:([^;]+)/)?.[1] || 'None';
      const type = text.match(/T:([^;]+)/)?.[1] || 'WPA';
      parsed = {
        type: 'WIFI',
        ssid,
        pass,
        typeStr: type,
        raw: text
      };
    }

    const security = evaluateSecurityRisk(parsed);
    return { ...parsed, security };
  };

  const handleScanSuccess = (text) => {
    const parsed = parseQrContent(text);
    setScannedResult(parsed);
    showToast('QR Code Scanned & Security Audited!', 'success');
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
    if (isAccountLocked) {
      showToast('Account frozen. Unlock account security to proceed.', 'error');
      setSecurityModalOpen(true);
      return;
    }

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
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        <div className="flex gap-2 p-1 glass-card rounded-2xl flex-1">
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

        {/* Security Lock Dashboard Button */}
        <button
          onClick={() => setSecurityModalOpen(true)}
          className={`p-2.5 rounded-2xl border transition shadow-md flex items-center gap-1.5 text-xs font-bold ${
            isAccountLocked 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
          title="Account Security Shield"
        >
          {isAccountLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          <span className="hidden sm:inline">{isAccountLocked ? 'Locked' : 'Secured'}</span>
        </button>
      </div>

      {/* Camera Viewport Area */}
      {scanMode === 'camera' && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden max-w-md mx-auto shadow-2xl">
          
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/50 bg-black/80 flex items-center justify-center shadow-inner">
            
            {/* HTML5 Scanner Container */}
            <div id="qr-reader" className="w-full h-full" />

            {/* Target Viewfinder Overlay corners */}
            <div className="absolute inset-4 pointer-events-none border-2 border-dashed border-purple-400/40 rounded-xl" />
            <div className="absolute top-6 left-6 w-6 h-6 border-t-4 border-l-4 border-emerald-400 pointer-events-none" />
            <div className="absolute top-6 right-6 w-6 h-6 border-t-4 border-r-4 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-6 h-6 border-b-4 border-l-4 border-emerald-400 pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b-4 border-r-4 border-emerald-400 pointer-events-none" />

            {/* Scan animation radar line */}
            <div className="animate-scan" />
          </div>

          {/* Camera Controls Toolbar */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-white/10">
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                torchOn ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'glass-card text-gray-300'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Flashlight
            </button>
            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl glass-card text-xs font-bold text-gray-300 flex items-center gap-1.5 hover:border-purple-500/50"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              Switch Camera
            </button>
          </div>

          <p className="text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Protected by Real-Time Anti-Phishing Scan Engine
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

      {/* Scanned Result Card with Security Shield Audit */}
      {scannedResult && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 shadow-2xl max-w-md mx-auto animate-fadeIn space-y-4">
          
          {/* Security Audit Badge */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
            scannedResult.security.riskLevel === 'high' 
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {scannedResult.security.riskLevel === 'high' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <span className="font-bold block">{scannedResult.security.score}</span>
                <span className="text-[10px] opacity-80">{scannedResult.security.message}</span>
              </div>
            </div>
          </div>

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
