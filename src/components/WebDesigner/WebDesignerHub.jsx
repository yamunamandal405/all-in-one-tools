import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, Monitor, Tablet, Smartphone, Code, Download, 
  Plus, Trash2, ArrowUp, ArrowDown, Eye, Sparkles, Layers, Check 
} from 'lucide-react';

const INITIAL_SECTIONS = [
  {
    id: 's_nav',
    type: 'navbar',
    title: 'OmniApp',
    links: ['Home', 'Features', 'Pricing', 'Contact'],
    buttonText: 'Get Started'
  },
  {
    id: 's_hero',
    type: 'hero',
    headline: 'Build Stunning Digital Platforms Fast',
    subheadline: 'The ultimate all-in-one suite with document processing, image design, code utilities, and interactive web tools.',
    ctaPrimary: 'Explore Suite',
    ctaSecondary: 'Watch Demo'
  },
  {
    id: 's_features',
    type: 'features',
    title: 'Why Creators Choose Us',
    items: [
      { name: 'Ultra-Fast Performance', desc: 'Optimized speed with zero loading delay.' },
      { name: 'Bank-Grade Security', desc: 'Encrypted storage and 256-bit authentication.' },
      { name: 'No-Code Tools', desc: 'Design websites, games, and resumes effortlessly.' }
    ]
  },
  {
    id: 's_cta',
    type: 'cta',
    headline: 'Ready to Transform Your Workflow?',
    subtext: 'Join thousands of developers and creators using OmniSuite today.',
    buttonText: 'Launch Free Trial'
  },
  {
    id: 's_footer',
    type: 'footer',
    copyright: '© 2026 OmniSuite Inc. All rights reserved.'
  }
];

export const WebDesignerHub = () => {
  const { showToast } = useApp();
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [activeTheme, setActiveTheme] = useState('dark'); // 'dark', 'cyber', 'light'
  const [selectedSectionId, setSelectedSectionId] = useState('s_hero');
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Section manipulation
  const moveSection = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setSections(updated);
  };

  const removeSection = (id) => {
    setSections(prev => prev.filter(s => s.id !== id));
    showToast('Section removed', 'info');
  };

  const addSection = (type) => {
    const newSec = {
      id: 'sec_' + Date.now(),
      type,
      ...(type === 'hero' ? { headline: 'New Hero Headline', subheadline: 'Add subheadline text here...', ctaPrimary: 'Action' } :
        type === 'features' ? { title: 'New Features', items: [{ name: 'Feature 1', desc: 'Description' }] } :
        type === 'cta' ? { headline: 'Call to Action', subtext: 'Subtitle', buttonText: 'Click Here' } :
        { title: 'New Component' })
    };
    setSections(prev => [...prev, newSec]);
    showToast(`Added new ${type} block`, 'success');
  };

  const updateSectionField = (id, field, value) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // HTML / CSS Code Generator
  const generateHtmlCode = () => {
    let html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Created with OmniSuite Website Builder</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body className="${activeTheme === 'dark' ? 'bg-black text-white' : activeTheme === 'cyber' ? 'bg-slate-950 text-cyan-300' : 'bg-white text-slate-900'}">\n`;

    sections.forEach(sec => {
      if (sec.type === 'navbar') {
        html += `  <nav className="p-6 flex items-center justify-between border-b border-white/10 max-w-6xl mx-auto">\n    <div className="text-xl font-bold font-sans">${sec.title}</div>\n    <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">${sec.buttonText}</button>\n  </nav>\n`;
      } else if (sec.type === 'hero') {
        html += `  <section className="py-20 text-center max-w-4xl mx-auto px-4">\n    <h1 className="text-4xl font-extrabold mb-4">${sec.headline}</h1>\n    <p className="text-gray-400 mb-8 max-w-xl mx-auto">${sec.subheadline}</p>\n    <button className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold">${sec.ctaPrimary}</button>\n  </section>\n`;
      } else if (sec.type === 'features') {
        html += `  <section className="py-16 max-w-5xl mx-auto px-4">\n    <h2 className="text-2xl font-bold text-center mb-10">${sec.title}</h2>\n    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n`;
        sec.items.forEach(item => {
          html += `      <div className="p-6 rounded-2xl bg-zinc-900 border border-white/10">\n        <h3 className="font-bold mb-2">${item.name}</h3>\n        <p className="text-xs text-gray-400">${item.desc}</p>\n      </div>\n`;
        });
        html += `    </div>\n  </section>\n`;
      } else if (sec.type === 'cta') {
        html += `  <section className="py-16 text-center max-w-4xl mx-auto my-10 p-10 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900">\n    <h2 className="text-3xl font-extrabold mb-3">${sec.headline}</h2>\n    <p className="text-sm text-purple-200 mb-6">${sec.subtext}</p>\n    <button className="px-6 py-3 bg-white text-purple-950 font-extrabold rounded-xl">${sec.buttonText}</button>\n  </section>\n`;
      } else if (sec.type === 'footer') {
        html += `  <footer className="py-8 border-t border-white/10 text-center text-xs text-gray-500">\n    ${sec.copyright}\n  </footer>\n`;
      }
    });

    html += `</body>\n</html>`;
    return html;
  };

  const downloadHtmlFile = () => {
    const code = generateHtmlCode();
    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `OmniWeb_Project_${Date.now()}.html`;
    link.click();
    showToast('Downloaded website source code!', 'success');
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-indigo-400" />
            No-Code Website Builder Tools
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Drag, drop, and edit live website section blocks with responsive previews (Desktop/Tablet/Mobile) and HTML export.
          </p>
        </div>

        {/* Viewport & Actions */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 p-1 bg-slate-950 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCodeModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white shadow-md flex items-center gap-2"
          >
            <Code className="w-4 h-4 text-indigo-400" />
            View Code
          </button>
          <button
            onClick={downloadHtmlFile}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-extrabold text-white shadow-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download HTML
          </button>
        </div>
      </div>

      {/* Main Workspace Layout (Left Builder Tree - 4 Cols, Right Live Viewport - 8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section Tree & Property Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section Blocks Tree */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Page Sections ({sections.length})
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => addSection('hero')}
                  className="px-2 py-1 bg-indigo-600/80 hover:bg-indigo-500 rounded-lg text-[10px] font-bold text-white flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Hero
                </button>
                <button
                  onClick={() => addSection('cta')}
                  className="px-2 py-1 bg-purple-600/80 hover:bg-purple-500 rounded-lg text-[10px] font-bold text-white flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> CTA
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    selectedSectionId === sec.id
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <span className="text-xs font-bold capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    {sec.type} Block
                  </span>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => moveSection(idx, -1)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, 1)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeSection(sec.id)}
                      className="p-1 text-red-400 hover:text-red-300 ml-1"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Inspector Panel */}
          {selectedSection && (
            <div className="glass-panel p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                Edit Block Properties ({selectedSection.type})
              </h3>

              {selectedSection.type === 'hero' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold block mb-1">Headline</label>
                    <input
                      type="text"
                      value={selectedSection.headline}
                      onChange={(e) => updateSectionField(selectedSection.id, 'headline', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold block mb-1">Subheadline</label>
                    <textarea
                      value={selectedSection.subheadline}
                      onChange={(e) => updateSectionField(selectedSection.id, 'subheadline', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={selectedSection.ctaPrimary}
                      onChange={(e) => updateSectionField(selectedSection.id, 'ctaPrimary', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {selectedSection.type === 'cta' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold block mb-1">CTA Headline</label>
                    <input
                      type="text"
                      value={selectedSection.headline}
                      onChange={(e) => updateSectionField(selectedSection.id, 'headline', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-400 font-bold block mb-1">Button Label</label>
                    <input
                      type="text"
                      value={selectedSection.buttonText}
                      onChange={(e) => updateSectionField(selectedSection.id, 'buttonText', e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Live Viewport Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex justify-center">
          <div 
            className={`transition-all duration-300 bg-black rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col ${
              viewMode === 'desktop' ? 'w-full min-h-[650px]' :
              viewMode === 'tablet' ? 'w-[640px] min-h-[650px]' : 'w-[360px] min-h-[650px]'
            }`}
          >
            {/* Viewport Frame Bar */}
            <div className="px-4 py-3 bg-zinc-950 border-b border-white/10 flex items-center justify-between text-xs text-gray-400">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="font-mono text-[10px] text-gray-500">
                https://my-app.omnisuite.dev ({viewMode})
              </span>
            </div>

            {/* Rendered Live Website Output */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950 text-white">
              {sections.map(sec => (
                <div key={sec.id} className="transition hover:outline hover:outline-2 hover:outline-indigo-500/50 rounded-2xl p-2">
                  {sec.type === 'navbar' && (
                    <nav className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white tracking-tight">{sec.title}</span>
                      <button className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-xs font-bold text-white">
                        {sec.buttonText}
                      </button>
                    </nav>
                  )}

                  {sec.type === 'hero' && (
                    <div className="py-12 px-6 text-center space-y-4 bg-gradient-to-b from-indigo-950/40 to-transparent rounded-3xl border border-indigo-500/20">
                      <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{sec.headline}</h1>
                      <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">{sec.subheadline}</p>
                      <div className="flex justify-center gap-3 pt-2">
                        <button className="px-5 py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white shadow-lg">
                          {sec.ctaPrimary}
                        </button>
                      </div>
                    </div>
                  )}

                  {sec.type === 'features' && (
                    <div className="py-6 space-y-4">
                      <h3 className="text-lg font-bold text-center text-white">{sec.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {sec.items.map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-1">
                            <span className="font-bold text-xs text-indigo-300 block">{item.name}</span>
                            <p className="text-[11px] text-gray-400">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sec.type === 'cta' && (
                    <div className="p-8 text-center rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-500/30 space-y-3">
                      <h2 className="text-xl font-extrabold text-white">{sec.headline}</h2>
                      <p className="text-xs text-indigo-200">{sec.subtext}</p>
                      <button className="px-5 py-2 rounded-xl bg-white text-indigo-950 font-extrabold text-xs shadow-md">
                        {sec.buttonText}
                      </button>
                    </div>
                  )}

                  {sec.type === 'footer' && (
                    <footer className="py-6 text-center text-xs text-gray-500 border-t border-white/10">
                      {sec.copyright}
                    </footer>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl max-w-3xl w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> Generated HTML/CSS Source Code
              </h3>
              <button onClick={() => setShowCodeModal(false)} className="text-gray-400 hover:text-white font-bold">×</button>
            </div>
            <textarea
              readOnly
              value={generateHtmlCode()}
              rows={14}
              className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-200 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateHtmlCode());
                  showToast('Code copied to clipboard!', 'success');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
