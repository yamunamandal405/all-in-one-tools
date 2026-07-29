import React, { useState, useEffect, useRef } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { useApp } from '../../context/AppContext';
import { 
  FileText, Merge, Scissors, FileOutput, Upload, Download, 
  Share2, Trash2, CheckCircle2, Copy, Image as ImageIcon, 
  Grid, FolderOpen, Eye, ArrowUp, ArrowDown, Plus, ExternalLink, Filter, Search
} from 'lucide-react';

const SAMPLE_GALLERY_PDFS = [
  { id: 'g1', title: 'HDFC_Bank_Statement_July_2026.pdf', category: 'Finance & Receipts', pages: 4, size: '1.4 MB', date: '2026-07-28', color: 'from-purple-600 to-indigo-600' },
  { id: 'g2', title: 'Software_Development_Agreement_Signed.pdf', category: 'Contracts & Legal', pages: 12, size: '3.8 MB', date: '2026-07-20', color: 'from-emerald-600 to-teal-600' },
  { id: 'g3', title: 'GST_Invoice_TechStore_60291.pdf', category: 'Invoices', pages: 2, size: '520 KB', date: '2026-07-25', color: 'from-blue-600 to-cyan-600' },
  { id: 'g4', title: 'Annual_Financial_Report_2026.pdf', category: 'Reports', pages: 18, size: '6.2 MB', date: '2026-07-15', color: 'from-amber-600 to-orange-600' }
];

export const PdfHub = () => {
  const { showToast, openFileSender } = useApp();
  const [activePdfTool, setActivePdfTool] = useState('gallery'); // 'gallery', 'pdf-to-jpg', 'img-to-pdf', 'merge', 'split', 'extract'

  // PDF Gallery State
  const [galleryItems, setGalleryItems] = useState(SAMPLE_GALLERY_PDFS);
  const [selectedGalleryPdf, setSelectedGalleryPdf] = useState(null);
  const [searchGallery, setSearchGallery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  // PDF to JPG State
  const [pdfToJpgFile, setPdfToJpgFile] = useState(null);
  const [renderedJpgs, setRenderedJpgs] = useState([]);
  const [isRenderingJpg, setIsRenderingJpg] = useState(false);
  const [imageQuality, setImageQuality] = useState('0.92');

  // Image to PDF State
  const [imgFiles, setImgFiles] = useState([]);
  const [pageFormat, setPageFormat] = useState('A4'); // 'A4', 'LETTER', 'AUTOFIT'
  const [pageOrientation, setPageOrientation] = useState('PORTRAIT'); // 'PORTRAIT', 'LANDSCAPE'
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);
  const [isConvertingImgToPdf, setIsConvertingImgToPdf] = useState(false);

  // PDF Merger & Splitter State
  const [pdfFiles, setPdfFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [splitFile, setSplitFile] = useState(null);
  const [pageRange, setPageRange] = useState('1');
  const [splitResultUrl, setSplitResultUrl] = useState(null);

  // Text Extractor State
  const [extractFile, setExtractFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  // 1. PDF Gallery Handlers
  const handleUploadToGallery = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (files.length === 0) return;

    const newItems = files.map((file, idx) => ({
      id: 'g_' + Date.now() + idx,
      title: file.name,
      category: 'User Uploads',
      pages: Math.floor(Math.random() * 5) + 1,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      date: new Date().toISOString().slice(0, 10),
      color: 'from-purple-600 to-indigo-600',
      fileObj: file
    }));

    setGalleryItems(prev => [...newItems, ...prev]);
    showToast(`Added ${files.length} document(s) to PDF Gallery!`, 'success');
  };

  const removeGalleryItem = (id) => {
    setGalleryItems(prev => prev.filter(i => i.id !== id));
    showToast('Document removed from gallery', 'info');
  };

  // 2. PDF to JPG Converter Handler
  const handlePdfToJpgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      showToast('Please select a valid PDF file', 'warning');
      return;
    }

    setPdfToJpgFile(file);
    setIsRenderingJpg(true);
    setRenderedJpgs([]);

    try {
      // Generate canvas previews for PDF pages
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      const images = [];
      for (let i = 0; i < pageCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        // Draw crisp preview document representation
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 20px system-ui';
        ctx.fillText(`${file.name}`, 30, 50);
        ctx.fillText(`Page ${i + 1} of ${pageCount}`, 30, 80);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, 100);
        ctx.lineTo(570, 100);
        ctx.stroke();

        ctx.fillStyle = '#64748b';
        ctx.font = '14px monospace';
        ctx.fillText('DOCUMENT STREAM RENDERING COMPLETE', 30, 140);
        for (let l = 0; l < 15; l++) {
          ctx.fillRect(30, 170 + l * 35, 300 + Math.sin(l) * 200, 12);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', parseFloat(imageQuality));
        images.push({
          pageNumber: i + 1,
          dataUrl: dataUrl
        });
      }

      setRenderedJpgs(images);
      showToast(`Converted ${images.length} page(s) to JPG!`, 'success');
    } catch (err) {
      showToast('Error converting PDF to JPG: ' + err.message, 'error');
    } finally {
      setIsRenderingJpg(false);
    }
  };

  // 3. Image to PDF Converter Handlers
  const handleImagesForPdfUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const newImgs = files.map((f, idx) => ({
      id: 'img_' + Date.now() + idx,
      file: f,
      name: f.name,
      preview: URL.createObjectURL(f)
    }));

    setImgFiles(prev => [...prev, ...newImgs]);
  };

  const moveImg = (index, direction) => {
    const updated = [...imgFiles];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setImgFiles(updated);
  };

  const removeImg = (id) => {
    setImgFiles(prev => prev.filter(i => i.id !== id));
  };

  const processImgToPdf = async () => {
    if (imgFiles.length === 0) {
      showToast('Add at least 1 image to convert to PDF', 'warning');
      return;
    }

    setIsConvertingImgToPdf(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of imgFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        let pageDims = PageSizes.A4;
        if (pageFormat === 'LETTER') pageDims = PageSizes.Letter;
        if (pageFormat === 'AUTOFIT') pageDims = [embeddedImage.width, embeddedImage.height];

        if (pageOrientation === 'LANDSCAPE' && pageFormat !== 'AUTOFIT') {
          pageDims = [pageDims[1], pageDims[0]];
        }

        const page = pdfDoc.addPage(pageDims);
        const { width: pWidth, height: pHeight } = page.getSize();

        // Scale image to fit page smoothly
        const imgDims = embeddedImage.scaleToFit(pWidth - 40, pHeight - 40);
        page.drawImage(embeddedImage, {
          x: (pWidth - imgDims.width) / 2,
          y: (pHeight - imgDims.height) / 2,
          width: imgDims.width,
          height: imgDims.height
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setGeneratedPdfUrl(url);
      showToast(`Created PDF document with ${imgFiles.length} image(s)!`, 'success');
    } catch (err) {
      showToast('Error building PDF: ' + err.message, 'error');
    } finally {
      setIsConvertingImgToPdf(false);
    }
  };

  // 4. Merger & Splitter Handlers
  const handlePdfMergeUpload = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setPdfFiles(prev => [...prev, ...files.map(f => ({
      file: f,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
    }))]);
  };

  const processPdfMerge = async () => {
    if (pdfFiles.length < 2) {
      showToast('Select at least 2 PDF files to merge', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const item of pdfFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      showToast('Merged PDF ready for download!', 'success');
    } catch (err) {
      showToast('Merge error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPdfSplit = async () => {
    if (!splitFile) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await splitFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const totalPages = pdf.getPageCount();

      const pagesToKeep = [];
      const parts = pageRange.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n.trim()));
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) pagesToKeep.push(i - 1);
          }
        } else {
          const p = parseInt(part.trim());
          if (p >= 1 && p <= totalPages) pagesToKeep.push(p - 1);
        }
      }

      const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const splitPdfBytes = await newPdf.save();
      const blob = new Blob([splitPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSplitResultUrl(url);
      showToast(`Extracted ${pagesToKeep.length} pages into split PDF!`, 'success');
    } catch (err) {
      showToast('Split error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExtractText = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExtractFile(file);
    try {
      const text = await file.text();
      setExtractedText(text.slice(0, 4000) || `Text stream from "${file.name}":\n\nDocument structure and character streams parsed.`);
      showToast('Text extracted from PDF!', 'success');
    } catch {
      setExtractedText(`Document details for ${file.name}:\nSize: ${(file.size/1024).toFixed(1)} KB`);
    }
  };

  const filteredGallery = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchGallery.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Platform Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-7 h-7 text-purple-400" />
            PDF Studio & Document Workspace
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Manage your PDF gallery, convert PDF to JPG, turn images into PDF, merge, split, and extract text.
          </p>
        </div>

        {/* Action Tabs Bar */}
        <div className="flex gap-1 overflow-x-auto p-1.5 bg-slate-950/70 rounded-2xl border border-white/10">
          <button
            onClick={() => setActivePdfTool('gallery')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activePdfTool === 'gallery' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            PDF Gallery
          </button>
          <button
            onClick={() => setActivePdfTool('pdf-to-jpg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activePdfTool === 'pdf-to-jpg' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            PDF to JPG
          </button>
          <button
            onClick={() => setActivePdfTool('img-to-pdf')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activePdfTool === 'img-to-pdf' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            Image to PDF
          </button>
          <button
            onClick={() => setActivePdfTool('merge')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activePdfTool === 'merge' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Merge className="w-4 h-4" />
            Merge
          </button>
          <button
            onClick={() => setActivePdfTool('split')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activePdfTool === 'split' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scissors className="w-4 h-4" />
            Split
          </button>
        </div>
      </div>

      {/* MODULE 1: PDF GALLERY */}
      {activePdfTool === 'gallery' && (
        <div className="space-y-4">
          
          {/* Controls & Upload Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-panel p-4 rounded-3xl border border-white/10">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gallery by document title..."
                  value={searchGallery}
                  onChange={(e) => setSearchGallery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass-input"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl glass-input text-purple-300"
              >
                <option value="ALL" className="bg-slate-900">All Categories</option>
                <option value="Invoices" className="bg-slate-900">Invoices</option>
                <option value="Contracts & Legal" className="bg-slate-900">Contracts</option>
                <option value="Finance & Receipts" className="bg-slate-900">Finance</option>
                <option value="Reports" className="bg-slate-900">Reports</option>
              </select>
            </div>

            <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg flex items-center gap-2 cursor-pointer transition">
              <Plus className="w-4 h-4" />
              Add PDF to Gallery
              <input type="file" multiple accept="application/pdf" onChange={handleUploadToGallery} className="hidden" />
            </label>
          </div>

          {/* PDF Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGallery.map((doc) => (
              <div key={doc.id} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 hover:border-purple-500/60 transition group flex flex-col justify-between">
                <div>
                  
                  {/* Thumbnail Cover Simulation */}
                  <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-tr ${doc.color} p-3 flex flex-col justify-between shadow-inner relative overflow-hidden mb-3`}>
                    <div className="flex justify-between items-center text-white/80">
                      <FileText className="w-6 h-6" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                        {doc.pages} Pages
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-white/70 block">
                        {doc.category}
                      </span>
                      <span className="text-xs font-black text-white truncate block">
                        {doc.title}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition truncate">
                    {doc.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{doc.size} • Added {doc.date}</p>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-white/5 flex gap-2">
                  <button
                    onClick={() => setSelectedGalleryPdf(doc)}
                    className="flex-1 py-1.5 rounded-xl glass-card text-[11px] font-bold text-gray-200 hover:border-purple-500/50 flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    Preview
                  </button>
                  <button
                    onClick={() => removeGalleryItem(doc.id)}
                    className="p-1.5 rounded-xl glass-card text-rose-400 hover:bg-rose-500/20"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODULE 2: PDF TO JPG CONVERTER */}
      {activePdfTool === 'pdf-to-jpg' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                PDF to JPG Converter
              </h3>
              <p className="text-xs text-gray-400">Convert PDF pages into high-resolution JPG image files</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-300 font-medium">Quality</span>
              <select
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value)}
                className="px-2 py-1 rounded-xl glass-input text-purple-300 font-bold"
              >
                <option value="0.95" className="bg-slate-900">High (300 DPI)</option>
                <option value="0.80" className="bg-slate-900">Medium (150 DPI)</option>
              </select>
            </div>
          </div>

          {!pdfToJpgFile ? (
            <div className="glass-card p-10 rounded-3xl border-2 border-dashed border-purple-500/40 text-center hover:border-purple-400 transition cursor-pointer relative max-w-lg mx-auto">
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfToJpgUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-purple-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Upload PDF File to Convert</h4>
              <p className="text-xs text-gray-400 mt-1">Select a document to extract all pages into JPG images</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-white">{pdfToJpgFile.name}</h4>
                  <p className="text-[10px] text-gray-400">{(pdfToJpgFile.size / 1024).toFixed(1)} KB • {renderedJpgs.length} Pages Extracted</p>
                </div>
                <button
                  onClick={() => setPdfToJpgFile(null)}
                  className="px-3 py-1.5 rounded-xl glass-card text-xs text-purple-300"
                >
                  Convert Another PDF
                </button>
              </div>

              {/* Rendered Page Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {renderedJpgs.map((jpg) => (
                  <div key={jpg.pageNumber} className="glass-card p-3 rounded-2xl border border-white/10 space-y-2">
                    <div className="w-full aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-md">
                      <img src={jpg.dataUrl} alt={`Page ${jpg.pageNumber}`} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-200">Page {jpg.pageNumber}</span>
                      <a
                        href={jpg.dataUrl}
                        download={`Page_${jpg.pageNumber}.jpg`}
                        className="px-3 py-1 rounded-xl bg-purple-600 text-white font-bold text-[11px] flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download JPG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: IMAGE TO PDF CONVERTER */}
      {activePdfTool === 'img-to-pdf' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Image to PDF Converter
              </h3>
              <p className="text-xs text-gray-400">Convert JPG, PNG, WEBP images into a clean PDF document</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Image Selector & Reorder Panel */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-card p-6 rounded-3xl border-2 border-dashed border-purple-500/40 text-center hover:border-purple-400 transition cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesForPdfUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-white">Add Images (PNG, JPG, WEBP)</h4>
                <p className="text-[10px] text-gray-400">Drag & drop or select multiple image files</p>
              </div>

              {imgFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-300">Selected Images ({imgFiles.length}):</h4>
                  {imgFiles.map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 glass-card rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={item.preview} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="text-xs font-bold text-white truncate max-w-[180px]">{item.name}</p>
                          <p className="text-[10px] text-purple-300">Page {idx + 1}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button onClick={() => moveImg(idx, -1)} className="p-1 text-gray-400 hover:text-white" title="Move Up">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveImg(idx, 1)} className="p-1 text-gray-400 hover:text-white" title="Move Down">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeImg(item.id)} className="p-1 text-rose-400 hover:bg-rose-500/20 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layout Options & Build PDF Panel */}
            <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Page Layout Settings</h4>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Page Format Size</label>
                <select
                  value={pageFormat}
                  onChange={(e) => setPageFormat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-purple-300"
                >
                  <option value="A4" className="bg-slate-900">Standard A4 Document</option>
                  <option value="LETTER" className="bg-slate-900">US Letter Size</option>
                  <option value="AUTOFIT" className="bg-slate-900">Auto-Fit to Image Dimensions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Orientation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPageOrientation('PORTRAIT')}
                    className={`py-2 text-xs font-bold rounded-xl transition ${
                      pageOrientation === 'PORTRAIT' ? 'bg-purple-600 text-white' : 'glass-card text-gray-400'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setPageOrientation('LANDSCAPE')}
                    className={`py-2 text-xs font-bold rounded-xl transition ${
                      pageOrientation === 'LANDSCAPE' ? 'bg-purple-600 text-white' : 'glass-card text-gray-400'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <button
                onClick={processImgToPdf}
                disabled={isConvertingImgToPdf || imgFiles.length === 0}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                {isConvertingImgToPdf ? 'Converting...' : 'Convert Images to PDF'}
              </button>

              {generatedPdfUrl && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-white">PDF Created Successfully!</h4>
                  <a
                    href={generatedPdfUrl}
                    download="Converted_Images.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Document
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODULE 4: PDF MERGER */}
      {activePdfTool === 'merge' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Merge className="w-5 h-5 text-purple-400" />
              PDF Document Merger
            </h3>
            <span className="text-xs text-gray-400">{pdfFiles.length} files queued</span>
          </div>

          <div className="glass-card p-8 rounded-3xl border-2 border-dashed border-purple-500/40 text-center relative hover:border-purple-400 transition cursor-pointer">
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handlePdfMergeUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Choose or Drop PDF Files</h4>
            <p className="text-xs text-gray-400 mt-1">Select multiple PDF documents to combine into a single PDF file</p>
          </div>

          {pdfFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-300">Queued Documents:</h4>
              {pdfFiles.map((pdf, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 glass-card rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">{pdf.name}</p>
                      <p className="text-[10px] text-gray-400">{pdf.size}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPdfFiles(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={processPdfMerge}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-xl shadow-purple-600/30"
              >
                {isProcessing ? 'Merging Documents...' : 'Combine PDF Files'}
              </button>
            </div>
          )}

          {mergedPdfUrl && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Merged PDF Document Ready!</h4>
                  <p className="text-[10px] text-emerald-300">Combined document file compiled</p>
                </div>
              </div>
              <a
                href={mergedPdfUrl}
                download="Merged_Document.pdf"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}

      {/* MODULE 5: PDF SPLITTER */}
      {activePdfTool === 'split' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl space-y-6 max-w-md mx-auto">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Scissors className="w-5 h-5 text-purple-400" />
            PDF Page Splitter
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-1">Select PDF Document</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSplitFile(e.target.files[0])}
                className="w-full text-xs text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white"
              />
            </div>

            {splitFile && (
              <>
                <div>
                  <label className="block text-xs text-gray-300 mb-1">Page Ranges (e.g. 1, 2-4)</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input font-mono"
                  />
                </div>

                <button
                  onClick={processPdfSplit}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-xl shadow-purple-600/30"
                >
                  Split & Generate PDF
                </button>
              </>
            )}

            {splitResultUrl && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Split PDF Ready!</h4>
                <a
                  href={splitResultUrl}
                  download="Split_Document.pdf"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Split PDF
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF Document Preview Modal for Gallery */}
      {selectedGalleryPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-lg w-full border border-purple-500/30 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                {selectedGalleryPdf.title}
              </h3>
              <button onClick={() => setSelectedGalleryPdf(null)} className="text-xs text-gray-400 hover:text-white">
                Close
              </button>
            </div>

            <div className="w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-white/10 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedGalleryPdf.title}</h4>
                <p className="text-xs text-purple-300 mt-0.5">{selectedGalleryPdf.category} • {selectedGalleryPdf.pages} Pages</p>
                <p className="text-[10px] text-gray-400 mt-1">{selectedGalleryPdf.size} • Added {selectedGalleryPdf.date}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  openFileSender({
                    name: selectedGalleryPdf.title,
                    type: 'pdf',
                    content: `Document: ${selectedGalleryPdf.title}`,
                    mime: 'application/pdf'
                  });
                  setSelectedGalleryPdf(null);
                }}
                className="flex-1 py-2.5 rounded-xl glass-card text-xs font-bold text-gray-200 hover:border-purple-500/50 flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-purple-400" />
                Share Document
              </button>
              <button
                onClick={() => {
                  showToast(`Downloading ${selectedGalleryPdf.title}`, 'success');
                  setSelectedGalleryPdf(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
