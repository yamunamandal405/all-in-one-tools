import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Image as ImageIcon, Sliders, Minimize2, Crop, Download, 
  Upload, Wand2, RefreshCw, Layers, CheckCircle2, Eye 
} from 'lucide-react';

export const ImageHub = () => {
  const { showToast, openFileSender } = useApp();
  const [activeTab, setActiveTab] = useState('compress'); // 'compress', 'convert', 'resize', 'filter'
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);

  // Compression state
  const [quality, setQuality] = useState(0.8);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedDataUrl, setCompressedDataUrl] = useState(null);

  // Convert State
  const [targetFormat, setTargetFormat] = useState('image/webp');

  // Resize State
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [aspectRatio, setAspectRatio] = useState('custom');

  // Filter State
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Re-render compressed/processed image
  useEffect(() => {
    if (!imagePreview) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imagePreview;
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      const ctx = canvas.getContext('2d');

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL(targetFormat, quality);
      setCompressedDataUrl(dataUrl);

      // Estimate compressed size
      const base64Length = dataUrl.split(',')[1].length;
      const sizeInBytes = base64Length * (3 / 4);
      setCompressedSize(sizeInBytes);
    };
  }, [imagePreview, quality, targetFormat, width, height, brightness, contrast, blur, grayscale, sepia]);

  const handleAspectChange = (preset) => {
    setAspectRatio(preset);
    if (!imagePreview) return;
    const img = new Image();
    img.src = imagePreview;
    img.onload = () => {
      if (preset === '1:1') { setWidth(600); setHeight(600); }
      if (preset === '16:9') { setWidth(1280); setHeight(720); }
      if (preset === '4:3') { setWidth(800); setHeight(600); }
      if (preset === '9:16') { setWidth(720); setHeight(1280); }
    };
  };

  const handleDownload = () => {
    if (!compressedDataUrl) return;
    const ext = targetFormat.split('/')[1];
    const a = document.createElement('a');
    a.href = compressedDataUrl;
    a.download = `Processed_Image.${ext}`;
    a.click();
    showToast('Image exported successfully!', 'success');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-purple-400" />
            Image Studio & Canvas Processing
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Lossless compressor, format converter (WEBP/PNG/JPG/ICO), resizer, and canvas FX filters.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto p-1 bg-slate-950/60 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('compress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'compress' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compress className="w-4 h-4" />
            Compress
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'convert' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={() => setActiveTab('resize')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'resize' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crop className="w-4 h-4" />
            Resize
          </button>
          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'filter' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            FX Filters
          </button>
        </div>
      </div>

      {/* Main Upload / Editor Area */}
      {!imagePreview ? (
        <div className="glass-panel p-12 rounded-3xl border-2 border-dashed border-purple-500/40 text-center max-w-xl mx-auto hover:border-purple-400 transition cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-400 mb-3">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Select an Image to Edit</h3>
          <p className="text-xs text-gray-400">Supports PNG, JPG, WEBP, GIF, SVG, BMP</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
            
            {/* Compression Tab Controls */}
            {activeTab === 'compress' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compress className="w-4 h-4 text-purple-400" />
                  Compression Level
                </h3>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1 font-medium">
                    <span>Quality Slider</span>
                    <span className="text-purple-300 font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Original File Size:</span>
                    <span className="font-mono text-gray-200">{(originalSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Optimized Size:</span>
                    <span className="font-mono text-emerald-400 font-bold">{(compressedSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                    <span className="text-gray-300">File Size Savings:</span>
                    <span className="text-purple-300">
                      {Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))}% Saved
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Convert Format Controls */}
            {activeTab === 'convert' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Target Output Format</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'WEBP (Web)', mime: 'image/webp' },
                    { label: 'PNG (Lossless)', mime: 'image/png' },
                    { label: 'JPEG (Photo)', mime: 'image/jpeg' },
                    { label: 'BMP', mime: 'image/bmp' }
                  ].map(f => (
                    <button
                      key={f.mime}
                      onClick={() => setTargetFormat(f.mime)}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition border ${
                        targetFormat === f.mime ? 'bg-purple-600/30 border-purple-500 text-white' : 'glass-card text-gray-400 border-white/5'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resize Controls */}
            {activeTab === 'resize' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">Aspect Ratio Presets</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['1:1', '16:9', '4:3', '9:16'].map(preset => (
                    <button
                      key={preset}
                      onClick={() => handleAspectChange(preset)}
                      className="py-1.5 text-xs font-bold glass-card rounded-lg hover:border-purple-500 text-gray-300"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FX Filter Controls */}
            {activeTab === 'filter' && (
              <div className="space-y-3 text-xs">
                <h3 className="text-sm font-bold text-white">Canvas FX Sliders</h3>
                
                <div>
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Brightness</span> <span>{brightness}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Contrast</span> <span>{contrast}%</span>
                  </div>
                  <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Blur (px)</span> <span>{blur}px</span>
                  </div>
                  <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Grayscale</span> <span>{grayscale}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} className="w-full accent-purple-500" />
                </div>

                <div>
                  <div className="flex justify-between text-gray-300 mb-1 font-medium">
                    <span>Vintage Sepia</span> <span>{sepia}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(e.target.value)} className="w-full accent-purple-500" />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button
                onClick={() => setImagePreview(null)}
                className="py-2.5 px-4 rounded-xl glass-card text-xs text-gray-400 hover:text-white"
              >
                Change Image
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Image
              </button>
            </div>

          </div>

          {/* Canvas Live Preview */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-4 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-purple-400" />
              Live Canvas Render ({width} x {height} px)
            </span>

            {compressedDataUrl && (
              <img
                src={compressedDataUrl}
                alt="Canvas output"
                className="max-h-[450px] w-auto max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

        </div>
      )}

    </div>
  );
};
