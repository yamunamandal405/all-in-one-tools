import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, Download, Share2, Palette, CreditCard, Link as LinkIcon, 
  Wifi, Phone, Sparkles, Copy 
} from 'lucide-react';

export const QRGenerator = () => {
  const { showToast, openFileSender } = useApp();
  const [qrType, setQrType] = useState('upi'); // 'upi', 'url', 'wifi', 'vcard'
  
  // Form fields
  const [upiVpa, setUpiVpa] = useState('user@okhdfcbank');
  const [upiName, setUpiName] = useState('Alex Smith');
  const [upiAmount, setUpiAmount] = useState('');
  
  const [url, setUrl] = useState('https://omnisuite.app');
  const [wifiSsid, setWifiSsid] = useState('Home_5G');
  const [wifiPass, setWifiPass] = useState('Secret123');

  // Styling options
  const [fgColor, setFgColor] = useState('#7c3aed');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const canvasRef = useRef(null);

  const getPayload = () => {
    if (qrType === 'upi') {
      let str = `upi://pay?pa=${encodeURIComponent(upiVpa)}&pn=${encodeURIComponent(upiName)}`;
      if (upiAmount) str += `&am=${encodeURIComponent(upiAmount)}`;
      return str;
    }
    if (qrType === 'url') return url;
    if (qrType === 'wifi') return `WIFI:S:${wifiSsid};T:WPA;P:${wifiPass};;`;
    return 'OmniSuite Universal QR';
  };

  useEffect(() => {
    const payload = getPayload();
    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor
      }
    }, (err, url) => {
      if (!err) {
        setQrDataUrl(url);
      }
    });
  }, [qrType, upiVpa, upiName, upiAmount, url, wifiSsid, wifiPass, fgColor, bgColor]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `OmniQR_${qrType}_${Date.now()}.png`;
    a.click();
    showToast('High-Res QR Code downloaded!', 'success');
  };

  const handleShare = () => {
    openFileSender({
      name: `OmniQR_${qrType}.png`,
      type: 'image',
      content: qrDataUrl,
      mime: 'image/png'
    });
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Universal QR Generator Studio
          </h2>
          <p className="text-xs text-gray-400">Design custom styled QR codes for UPI payments, links, Wi-Fi, and contacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setQrType('upi')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                qrType === 'upi' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              UPI Payment
            </button>
            <button
              onClick={() => setQrType('url')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                qrType === 'url' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Web Link
            </button>
            <button
              onClick={() => setQrType('wifi')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                qrType === 'wifi' ? 'bg-purple-600 text-white shadow-md' : 'glass-card text-gray-400'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              Wi-Fi Config
            </button>
          </div>

          {/* Type Specific Fields */}
          {qrType === 'upi' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Your UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono text-purple-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Payee / Business Name</label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Preset Amount (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={upiAmount}
                    onChange={(e) => setUpiAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-emerald-300 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {qrType === 'url' && (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <label className="block text-xs text-gray-300 mb-1">Target URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono text-blue-300"
              />
            </div>
          )}

          {qrType === 'wifi' && (
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Network SSID</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Password</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono text-amber-300"
                />
              </div>
            </div>
          )}

          {/* Color Customizer */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-purple-400" />
              Color Customizer
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Foreground (QR Pattern)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-gray-300">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Background Card</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-gray-300">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Preview & Export Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 glass-card rounded-3xl border border-white/10 text-center space-y-4">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Live QR Preview</span>
          
          {qrDataUrl && (
            <div className="p-4 rounded-2xl bg-white shadow-2xl border-4 border-purple-500/30 animate-scaleIn">
              <img src={qrDataUrl} alt="Generated QR" className="w-48 h-48 mx-auto" />
            </div>
          )}

          <div className="flex gap-2 w-full pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </button>
            <button
              onClick={handleShare}
              className="py-2.5 px-4 rounded-xl glass-card text-xs font-bold text-gray-200 hover:border-purple-500/50 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              Share
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
