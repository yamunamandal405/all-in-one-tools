import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { NavigationMobile } from './components/NavigationMobile';
import { Toast } from './components/Toast';
import { AccountSecurityModal } from './components/AccountSecurityModal';
import { SystemUpdateModal } from './components/SystemUpdateModal';
import { Dashboard } from './components/Dashboard';
import { UniversalQRScanner } from './components/QRStudio/UniversalQRScanner';
import { QRGenerator } from './components/QRStudio/QRGenerator';
import { PdfHub } from './components/PdfTools/PdfHub';
import { ImageHub } from './components/ImageStudio/ImageHub';
import { ToolDesigner } from './components/ToolBuilder/ToolDesigner';
import { AiFileSearchHub } from './components/AiFileSearch/AiFileSearchHub';
import { ConvertersHub } from './components/Converters/ConvertersHub';
import { MoreToolsHub } from './components/MoreTools/MoreToolsHub';
import { DocumentScannerHub } from './components/DocScanner/DocumentScannerHub';
import { ResumeDesignerHub } from './components/ResumeDesigner/ResumeDesignerHub';
import { WebDesignerHub } from './components/WebDesigner/WebDesignerHub';
import { GameStudioHub } from './components/GameStudio/GameStudioHub';
import { UniversalDownloader } from './components/Downloader/UniversalDownloader';
import { QrCode } from 'lucide-react';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full text-base">
      {activeTab === 'home' && <Dashboard />}
      {activeTab === 'qr' && (
        <div className="space-y-6 animate-fadeIn pb-12">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <QrCode className="w-7 h-7 text-purple-400" />
                Universal QR Engine (Scanner & Generator)
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-medium">
                Scan payment, link, and Wi-Fi QRs live with camera controls & anti-fraud safety verification.
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
      {activeTab === 'doc-scanner' && <DocumentScannerHub />}
      {activeTab === 'resume-designer' && <ResumeDesignerHub />}
      {activeTab === 'web-designer' && <WebDesignerHub />}
      {activeTab === 'game-designer' && <GameStudioHub />}
      {activeTab === 'downloader' && <UniversalDownloader />}
      {activeTab === 'tool-builder' && <ToolDesigner />}
      {activeTab === 'ai-files' && <AiFileSearchHub />}
      {activeTab === 'converters' && <ConvertersHub />}
      {activeTab === 'more-tools' && <MoreToolsHub />}
    </main>
  );
};

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-black dark:bg-black light:bg-slate-50 text-white dark:text-white light:text-slate-900 selection:bg-purple-600 selection:text-white font-sans text-base transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <MainContent />
          <Footer />
        </div>
      </div>

      <NavigationMobile />
      <SystemUpdateModal />
      <Toast />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;

