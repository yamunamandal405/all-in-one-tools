import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Wallet, QrCode, FileText, Image as ImageIcon, 
  Wrench, FileSearch, ArrowRightLeft, Grid, Lock, CheckCircle2, Heart 
} from 'lucide-react';

export const Footer = () => {
  const { setActiveTab, setSecurityModalOpen } = useApp();

  return (
    <footer className="mt-16 bg-black text-slate-300 text-sm border-t border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                O
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  OmniSuite
                </span>
                <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                  Dark Blue Enterprise Suite
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-sm">
              All-in-One Utility Platform featuring PDF Studio & Gallery, PDF to JPG, Image to PDF, Custom Tool Designer, Universal QR Engine, and PhonePe-style UPI Money Transfer.
            </p>

            {/* Security Badge Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted & NPCI Fraud Guard</span>
            </div>
          </div>

          {/* Column 1: Financial Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Financial Suite
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <button onClick={() => setActiveTab('pay')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-sky-400" />
                  OmniPay UPI Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('qr')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  Universal QR Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pay')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Passbook & History
                </button>
              </li>
              <li>
                <button onClick={() => setSecurityModalOpen(true)} className="hover:text-sky-400 transition flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Security Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: PDF & Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              PDF & Media Studio
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <button onClick={() => setActiveTab('pdf')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  PDF Gallery & Viewer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pdf')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  PDF to JPG Converter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('pdf')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Image to PDF Converter
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('image')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  Image Studio & Canvas FX
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Utilities & Builder */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
              Tools & Builder
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <button onClick={() => setActiveTab('tool-builder')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  Custom Tool Designer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-files')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-indigo-400" />
                  Document Search & Sender
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('converters')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-teal-400" />
                  Unit & Currency Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('more-tools')} className="hover:text-sky-400 transition flex items-center gap-2">
                  <Grid className="w-4 h-4 text-purple-400" />
                  Password Generator & Extras
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-semibold text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>NPCI UPI Systems Operational • 256-Bit SSL Encrypted</span>
          </div>

          <p>© {new Date().getFullYear()} OmniSuite Platform. Built for Enterprise Utility & Payments.</p>
        </div>
      </div>
    </footer>
  );
};
