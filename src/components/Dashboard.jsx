import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, Image as ImageIcon, Scan, Globe, Gamepad2, 
  Download, ArrowRightLeft, QrCode, Wrench, Grid, ArrowRight, ShieldCheck, Sparkles 
} from 'lucide-react';

export const Dashboard = () => {
  const { setActiveTab } = useApp();

  const toolCards = [
    {
      id: 'pdf',
      title: 'Image to PDF & PDF Gallery',
      desc: 'Convert multiple images to PDF, PDF thumbnail viewer gallery, page extraction, PDF merger & splitter.',
      icon: FileText,
      badge: 'Document Studio',
      color: 'bg-purple-950/60 text-purple-300 border-purple-500/30'
    },
    {
      id: 'doc-scanner',
      title: 'AI Document Scanner',
      desc: 'Live camera scan with perspective crop box, B&W magic contrast filters, text OCR extraction, & PDF export.',
      icon: Scan,
      badge: 'AI Scan',
      color: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'image',
      title: 'Image Graphic Designer',
      desc: 'HTML5 canvas graphics editor with drawing brush, Cyberpunk & Sepia FX filters, text overlay, stickers, & cropping.',
      icon: ImageIcon,
      badge: 'Graphic Studio',
      color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'resume-designer',
      title: 'Resume Designer Studio',
      desc: 'Multi-step resume builder, Executive / Minimalist themes, live visual preview, & printable PDF export.',
      icon: FileText,
      badge: 'Live PDF',
      color: 'bg-amber-950/60 text-amber-300 border-amber-500/30'
    },
    {
      id: 'web-designer',
      title: 'Website Designer Tools',
      desc: 'Drag & drop section builder (Hero, Navbar, Features, CTA), responsive preview (Desktop/Mobile), & HTML download.',
      icon: Globe,
      badge: 'No-Code',
      color: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'game-designer',
      title: 'Game Site & 2D Builder',
      desc: 'Playable 2D retro arcade games (Space Defender) + visual 2D level builder with custom gravity & jump physics.',
      icon: Gamepad2,
      badge: 'Arcade & Builder',
      color: 'bg-teal-950/60 text-teal-300 border-teal-500/30'
    },
    {
      id: 'downloader',
      title: 'Universal Downloader Vault',
      desc: 'Download all file formats (PDF, ZIP, ISO, MP3, MP4, APK), direct URL stream downloader, & SHA-256 hash calculator.',
      icon: Download,
      badge: 'Asset Vault',
      color: 'bg-blue-950/60 text-blue-300 border-blue-500/30'
    },
    {
      id: 'converters',
      title: 'Smart All-Type Converters',
      desc: 'Unit converter, JSON to CSV/XML, Base64 encoder/decoder, & real-time currency exchange rates matrix.',
      icon: ArrowRightLeft,
      badge: 'Converters',
      color: 'bg-rose-950/60 text-rose-300 border-rose-500/30'
    },
    {
      id: 'qr',
      title: 'Universal QR Engine',
      desc: 'Scan URLs, Wi-Fi, & text QRs live with camera controls or design custom QRs with logo overlays & SVG export.',
      icon: QrCode,
      badge: 'QR Engine',
      color: 'bg-purple-950/60 text-purple-300 border-purple-500/30'
    },
    {
      id: 'more-tools',
      title: 'Developer Utility Extras',
      desc: 'Strong key generator, network speed test gauge, color palette picker, & Markdown live editor.',
      icon: Grid,
      badge: 'Utilities',
      color: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12 text-base">
      
      {/* Black Obsidian Hero Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified OmniSuite Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              OmniSuite <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Multi-Tool Platform</span>
            </h1>
            <p className="text-base text-zinc-400 max-w-2xl leading-relaxed font-medium">
              Your complete all-in-one suite for Image to PDF conversion, PDF Gallery, AI Document Scanning, Graphic Design, Resume Building, Website Building, 2D Game Designing, File Downloading, & Smart Converters.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('pdf')}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-xs font-extrabold text-white shadow-xl shadow-purple-600/30 flex items-center gap-2 transition"
            >
              <FileText className="w-4 h-4" />
              Image to PDF
            </button>
            <button
              onClick={() => setActiveTab('web-designer')}
              className="px-5 py-3 rounded-2xl glass-card text-xs font-extrabold text-white hover:border-purple-500/50 transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              Website Builder
            </button>
          </div>
        </div>
      </div>

      {/* Main Suite Tools Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Grid className="w-4 h-4 text-purple-400" />
            Workspace Applications & Multi-Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="glass-card p-6 rounded-3xl cursor-pointer border border-white/10 hover:border-purple-500/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    {card.badge && (
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${card.color}`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-extrabold text-white group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Open Application</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
