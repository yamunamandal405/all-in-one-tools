import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { NavigationMobile } from './components/NavigationMobile';
import { Toast } from './components/Toast';
import { Dashboard } from './components/Dashboard';
import { OmniPayHub } from './components/OmniPay/OmniPayHub';
import { UniversalQRScanner } from './components/QRStudio/UniversalQRScanner';
import { QRGenerator } from './components/QRStudio/QRGenerator';
import { PdfHub } from './components/PdfTools/PdfHub';
import { ImageHub } from './components/ImageStudio/ImageHub';
import { ToolDesigner } from './components/ToolBuilder/ToolDesigner';
import { AiFileSearchHub } from './components/AiFileSearch/AiFileSearchHub';
import { ConvertersHub } from './components/Converters/ConvertersHub';
import { MoreToolsHub } from './components/MoreTools/MoreToolsHub';
import { QrCode, Sparkles } from 'lucide-react';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'home' && <Dashboard />}
      {activeTab === 'pay' && <OmniPayHub />}
      {activeTab === 'qr' && (
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <QrCode className="w-7 h-7 text-purple-400" />
                Universal QR Engine (Scanner & Generator)
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                Scan payment, link, and Wi-Fi QRs, or build custom styled high-res QR codes.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <UniversalQRScanner />
            </div>
            <div className="lg:col-span-6">
              <QRGenerator />
            </div>
          </div>
        </div>
      )}
      {activeTab === 'pdf' && <PdfHub />}
      {activeTab === 'image' && <ImageHub />}
      {activeTab === 'tool-builder' && <ToolDesigner />}
      {activeTab === 'ai-files' && <AiFileSearchHub />}
      {activeTab === 'converters' && <ConvertersHub />}
      {activeTab === 'more-tools' && <MoreToolsHub />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-purple-500 selection:text-white">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        <NavigationMobile />
        <Toast />
      </div>
    </AppProvider>
  );
}

export default App;
