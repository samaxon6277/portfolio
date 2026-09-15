import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FileText, Upload, Download, Trash2, RotateCw, 
  ArrowLeft, ArrowRight, ShieldCheck, Check, AlertCircle, 
  Layers, Split, Plus, RefreshCw, Eye, CheckSquare, Square,
  MoveLeft, MoveRight, Loader2, Sparkles
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useCustomUi } from '../../context/CustomUiContext';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

type PdfToolMode = 'organize' | 'merge' | 'split';

interface PageItem {
  id: string;
  originalIndex: number; // 0-based
  displayPageNumber: number; // 1-based current
  rotation: number; // 0, 90, 180, 270
  thumbnailUrl: string;
  selected: boolean;
}

interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  pageCount: number;
  pdfBytes: ArrayBuffer;
}

export default function PdfTools() {
  const { showToast, showConfirm } = useCustomUi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  // Active Tool Mode
  const [activeMode, setActiveMode] = useState<PdfToolMode>('organize');

  // Single PDF Workspace States (for Organize, Rotate, Extract, Delete)
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [pdfRawBytes, setPdfRawBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');

  // Split Specific State
  const [splitRangeText, setSplitRangeText] = useState<string>('1-2');
  const [splitError, setSplitError] = useState<string | null>(null);

  // Merge Specific States
  const [mergeFiles, setMergeFiles] = useState<MergeFileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);

  // Cleanup thumbnail URLs when unmounting or changing files
  const cleanupThumbnails = useCallback(() => {
    pages.forEach(p => {
      if (p.thumbnailUrl && p.thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(p.thumbnailUrl);
      }
    });
  }, [pages]);

  // Load and render pages from a single PDF
  const loadPdfDocument = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      showToast('File exceeds maximum size limit of 50MB.', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingProgress('Reading PDF file...');
    cleanupThumbnails();

    try {
      const buffer = await file.arrayBuffer();
      setPdfRawBytes(buffer);
      setCurrentFile(file);

      setLoadingProgress('Parsing pages and generating previews...');
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      const count = pdf.numPages;

      const newPages: PageItem[] = [];

      for (let i = 1; i <= count; i++) {
        setLoadingProgress(`Rendering page ${i} of ${count}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.35 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await (page.render as any)({ canvasContext: context, viewport, canvas }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          newPages.push({
            id: `page-${i}-${Date.now()}`,
            originalIndex: i - 1,
            displayPageNumber: i,
            rotation: 0,
            thumbnailUrl: dataUrl,
            selected: false
          });
        }
      }

      setPages(newPages);
      setSplitRangeText(`1-${Math.min(count, 3)}`);
      showToast(`Loaded ${count} pages from ${file.name}.`, 'success');
    } catch (err: any) {
      console.error(err);
      if (err?.name === 'PasswordException') {
        showToast('This PDF is password-protected. Please remove password protection first.', 'error');
      } else {
        showToast('Could not load PDF document. Please verify the file is not corrupted.', 'error');
      }
      setCurrentFile(null);
      setPages([]);
      setPdfRawBytes(null);
    } finally {
      setIsLoading(false);
      setLoadingProgress('');
    }
  };

  // Handle upload for Organize / Split
  const handleSingleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadPdfDocument(file);
    }
    e.target.value = '';
  };

  // Handle Multi-upload for Merge
  const handleMergeFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    setLoadingProgress('Loading documents for merge...');

    try {
      const newItems: MergeFileItem[] = [];
      for (const file of files) {
        if (file.size > 50 * 1024 * 1024) {
          showToast(`Skipped ${file.name}: exceeds 50MB limit.`, 'warning');
          continue;
        }
        const buffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        newItems.push({
          id: `merge-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          sizeBytes: file.size,
          pageCount: pdf.numPages,
          pdfBytes: buffer
        });
      }

      setMergeFiles(prev => [...prev, ...newItems]);
      showToast(`Added ${newItems.length} file(s) to merge list.`, 'success');
    } catch (err) {
      showToast('Error reading PDF files for merge.', 'error');
    } finally {
      setIsLoading(false);
      setLoadingProgress('');
      e.target.value = '';
    }
  };

  // Rotate single page
  const handleRotatePage = (index: number) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === index) {
        const nextRot = (p.rotation + 90) % 360;
        return { ...p, rotation: nextRot };
      }
      return p;
    }));
  };

  // Rotate all pages
  const handleRotateAll = (angle: number = 90) => {
    setPages(prev => prev.map(p => ({
      ...p,
      rotation: (p.rotation + angle) % 360
    })));
    showToast(`Rotated all pages by ${angle}°.`, 'info');
  };

  // Move page left/right
  const handleMovePage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    setPages(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
  };

  // Delete single page
  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      showToast('Cannot delete the only remaining page in document.', 'warning');
      return;
    }
    setPages(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
    });
    showToast('Page removed from workspace.', 'info');
  };

  // Select / Deselect page toggle
  const handleToggleSelectPage = (index: number) => {
    setPages(prev => prev.map((p, idx) => {
      if (idx === index) {
        return { ...p, selected: !p.selected };
      }
      return p;
    }));
  };

  // Select All / Deselect All
  const handleSelectAll = (select: boolean) => {
    setPages(prev => prev.map(p => ({ ...p, selected: select })));
  };

  // Delete selected pages
  const handleDeleteSelected = () => {
    const selectedCount = pages.filter(p => p.selected).length;
    if (selectedCount === 0) {
      showToast('No pages selected.', 'info');
      return;
    }
    if (selectedCount >= pages.length) {
      showToast('Cannot delete all pages. At least one page must remain.', 'warning');
      return;
    }

    showConfirm({
      title: `Delete ${selectedCount} Selected Page(s)?`,
      message: 'This will remove the selected pages from your working document.',
      confirmText: 'Delete Pages',
      cancelText: 'Cancel',
      onConfirm: () => {
        setPages(prev => {
          const updated = prev.filter(p => !p.selected);
          return updated.map((p, idx) => ({ ...p, displayPageNumber: idx + 1 }));
        });
        showToast(`Removed ${selectedCount} page(s).`, 'success');
      }
    });
  };

  // Save / Download Processed PDF (Organize mode)
  const handleDownloadOrganizedPdf = async (onlySelected: boolean = false) => {
    if (!pdfRawBytes || pages.length === 0) return;

    const exportPages = onlySelected ? pages.filter(p => p.selected) : pages;
    if (exportPages.length === 0) {
      showToast('No pages selected to export.', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const originalPdfDoc = await PDFDocument.load(pdfRawBytes);
      const newPdfDoc = await PDFDocument.create();

      for (const p of exportPages) {
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [p.originalIndex]);
        if (p.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + p.rotation) % 360));
        }
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = currentFile?.name.replace(/\.[^/.]+$/, '') || 'document';
      a.download = `${baseName}-${onlySelected ? 'extracted' : 'organized'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('PDF downloaded successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating modified PDF.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Parse page range string (e.g. "1-3, 5, 7") into 0-based indices
  const parsePageRange = (rangeStr: string, maxPages: number): number[] => {
    const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);
    const indices = new Set<number>();

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start < 1 || end > maxPages || start > end) {
          throw new Error(`Invalid range "${part}". Must be between 1 and ${maxPages}.`);
        }
        for (let i = start; i <= end; i++) {
          indices.add(i - 1);
        }
      } else {
        const num = parseInt(part, 10);
        if (isNaN(num) || num < 1 || num > maxPages) {
          throw new Error(`Invalid page number "${part}". Must be between 1 and ${maxPages}.`);
        }
        indices.add(num - 1);
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  // Download Split PDF by Range
  const handleDownloadSplitPdf = async () => {
    if (!pdfRawBytes || pages.length === 0) return;

    try {
      setSplitError(null);
      const targetIndices = parsePageRange(splitRangeText, pages.length);
      if (targetIndices.length === 0) {
        setSplitError('Please enter at least one valid page number or range.');
        return;
      }

      setIsProcessing(true);
      const originalPdfDoc = await PDFDocument.load(pdfRawBytes);
      const newPdfDoc = await PDFDocument.create();

      for (const idx of targetIndices) {
        const pageItem = pages[idx];
        const [copiedPage] = await newPdfDoc.copyPages(originalPdfDoc, [pageItem.originalIndex]);
        if (pageItem.rotation !== 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + pageItem.rotation) % 360));
        }
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = currentFile?.name.replace(/\.[^/.]+$/, '') || 'document';
      a.download = `${baseName}-split-p${splitRangeText.replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Split PDF (${targetIndices.length} pages) downloaded.`, 'success');
    } catch (err: any) {
      setSplitError(err.message || 'Invalid page range specification.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reorder Merge List
  const handleMoveMergeFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= mergeFiles.length) return;

    setMergeFiles(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Remove file from merge list
  const handleRemoveMergeFile = (id: string) => {
    setMergeFiles(prev => prev.filter(f => f.id !== id));
    showToast('File removed from merge list.', 'info');
  };

  // Execute Merge
  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      showToast('Please add at least 2 PDF files to merge.', 'warning');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of mergeFiles) {
        const doc = await PDFDocument.load(item.pdfBytes);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach(p => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `merged-document-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Merged PDF downloaded successfully.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to merge documents.', 'error');
    } finally {
      setIsMerging(false);
    }
  };

  // Reset workspace
  const handleResetWorkspace = () => {
    cleanupThumbnails();
    setCurrentFile(null);
    setPdfRawBytes(null);
    setPages([]);
    setMergeFiles([]);
    setSplitError(null);
    showToast('Workspace cleared.', 'info');
  };

  const selectedPagesCount = pages.filter(p => p.selected).length;

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto" id="pdf-tools-workspace">
      {/* 1. Header & Security Guarantee */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#111111] text-[#D6B46A] rounded-lg">
            <FileText className="w-5 h-5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
            PDF Tools
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#554F49]">
          Merge, split, reorder, rotate, and extract PDF pages entirely in your browser with complete privacy.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-md w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side: Documents are never uploaded to a server, saved, or exposed to third parties.</span>
        </div>
      </div>

      {/* 2. Sub-mode Selector Bar */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 flex-wrap gap-4">
        <div className="inline-flex p-1 bg-neutral-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMode('organize')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'organize' 
                ? 'bg-white text-[#111111] shadow-sm' 
                : 'text-neutral-600 hover:text-[#111111]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Organize & Rotate</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('merge')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'merge' 
                ? 'bg-white text-[#111111] shadow-sm' 
                : 'text-neutral-600 hover:text-[#111111]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Merge PDFs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('split')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'split' 
                ? 'bg-white text-[#111111] shadow-sm' 
                : 'text-neutral-600 hover:text-[#111111]'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Split by Range</span>
          </button>
        </div>

        {(currentFile || mergeFiles.length > 0) && (
          <button
            type="button"
            onClick={handleResetWorkspace}
            className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Workspace</span>
          </button>
        )}
      </div>

      {/* 3. MODE: ORGANIZE & ROTATE & EXTRACT */}
      {activeMode === 'organize' && (
        <div className="space-y-6">
          {!currentFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-[#D6B46A] bg-white hover:bg-neutral-50 rounded-2xl p-12 text-center transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-600">
                <Upload className="w-6 h-6 text-[#A68936]" />
              </div>
              <p className="text-base font-bold text-[#111111]">
                Click or drop a PDF to organize and rotate pages
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                Supports up to 50MB · Multi-page documents
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleSingleFileUpload}
                accept="application/pdf"
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Document Overview Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#111111] truncate max-w-md">
                    {currentFile.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {pages.length} pages · {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleRotateAll(90)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate All 90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectAll(selectedPagesCount !== pages.length)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {selectedPagesCount === pages.length ? <Square className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                    <span>{selectedPagesCount === pages.length ? 'Deselect All' : 'Select All'}</span>
                  </button>

                  {selectedPagesCount > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleDeleteSelected}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Selected ({selectedPagesCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadOrganizedPdf(true)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-[#D6B46A] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Extract Selected ({selectedPagesCount})</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Page Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pages.map((p, idx) => (
                  <div 
                    key={p.id}
                    className={`relative group bg-neutral-50 border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${
                      p.selected 
                        ? 'border-[#D6B46A] ring-2 ring-[#D6B46A]/30 bg-[#FFFDF8]' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {/* Top Checkbox & Page Badge */}
                    <div className="w-full flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleSelectPage(idx)}
                        className="text-neutral-500 hover:text-[#111111] cursor-pointer"
                      >
                        {p.selected ? (
                          <CheckSquare className="w-4 h-4 text-[#A68936]" />
                        ) : (
                          <Square className="w-4 h-4 text-neutral-400" />
                        )}
                      </button>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-white border border-neutral-200 rounded-full text-neutral-600">
                        Page {p.displayPageNumber}
                      </span>
                    </div>

                    {/* Thumbnail Image with CSS Rotation */}
                    <div className="w-full h-44 flex items-center justify-center overflow-hidden bg-white border border-neutral-100 rounded-lg shadow-2xs">
                      <img
                        src={p.thumbnailUrl}
                        alt={`Page ${p.displayPageNumber}`}
                        style={{ transform: `rotate(${p.rotation}deg)` }}
                        className="max-h-full max-w-full object-contain transition-transform duration-200"
                      />
                    </div>

                    {/* Action Controls for Single Page */}
                    <div className="w-full flex items-center justify-between pt-1 text-neutral-500">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMovePage(idx, 'left')}
                          className="p-1 hover:text-[#111111] hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          title="Move Left"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === pages.length - 1}
                          onClick={() => handleMovePage(idx, 'right')}
                          className="p-1 hover:text-[#111111] hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                          title="Move Right"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRotatePage(idx)}
                          className="p-1 hover:text-[#111111] hover:bg-neutral-200 rounded cursor-pointer"
                          title="Rotate 90° Clockwise"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePage(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {p.rotation !== 0 && (
                      <span className="text-[9px] font-mono text-[#A68936] font-bold">
                        Rotated {p.rotation}°
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Primary Download Button */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-neutral-500 font-mono">
                  {pages.length} total pages ready for export.
                </p>
                <button
                  type="button"
                  onClick={() => handleDownloadOrganizedPdf(false)}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-black text-[#D6B46A] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Processed PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. MODE: MERGE PDFs */}
      {activeMode === 'merge' && (
        <div className="space-y-6">
          <div 
            onClick={() => mergeInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 hover:border-[#D6B46A] bg-white hover:bg-neutral-50 rounded-2xl p-10 text-center transition-all cursor-pointer space-y-3"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-600">
              <Plus className="w-6 h-6 text-[#A68936]" />
            </div>
            <p className="text-base font-bold text-[#111111]">
              Select multiple PDFs to merge together
            </p>
            <p className="text-xs text-neutral-500 font-mono">
              You can reorder the documents before combining
            </p>
            <input
              type="file"
              ref={mergeInputRef}
              onChange={handleMergeFilesUpload}
              accept="application/pdf"
              multiple
              className="hidden"
            />
          </div>

          {mergeFiles.length > 0 && (
            <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-mono uppercase font-bold text-neutral-500">
                  Merge Queue ({mergeFiles.length} files)
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Total Pages: {mergeFiles.reduce((acc, f) => acc + f.pageCount, 0)}
                </span>
              </div>

              <div className="space-y-2">
                {mergeFiles.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs">
                    <div className="flex items-center gap-3 truncate">
                      <span className="font-mono text-neutral-400 font-bold w-4">{idx + 1}.</span>
                      <FileText className="w-4 h-4 text-[#A68936] shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-neutral-900 truncate">{item.name}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          {item.pageCount} pages · {(item.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveMergeFile(idx, 'up')}
                        className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === mergeFiles.length - 1}
                        onClick={() => handleMoveMergeFile(idx, 'down')}
                        className="p-1 hover:bg-neutral-200 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMergeFile(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleExecuteMerge}
                  disabled={isMerging || mergeFiles.length < 2}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-black text-[#D6B46A] disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isMerging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  <span>Merge & Download Combined PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. MODE: SPLIT BY RANGE */}
      {activeMode === 'split' && (
        <div className="space-y-6">
          {!currentFile ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 hover:border-[#D6B46A] bg-white hover:bg-neutral-50 rounded-2xl p-12 text-center transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-600">
                <Split className="w-6 h-6 text-[#A68936]" />
              </div>
              <p className="text-base font-bold text-[#111111]">
                Upload a PDF to split by page range
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                Extract page subsets into a fresh document
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleSingleFileUpload}
                accept="application/pdf"
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#111111]">{currentFile.name}</h3>
                <p className="text-xs text-neutral-500 font-mono">
                  Document has {pages.length} total pages.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="page-range-input" className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Page Range to Extract
                </label>
                <input
                  id="page-range-input"
                  type="text"
                  value={splitRangeText}
                  onChange={(e) => setSplitRangeText(e.target.value)}
                  placeholder="e.g., 1-3, 5, 8-10"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-sm text-[#111111] focus:outline-none focus:border-[#A68936] focus:bg-white"
                />
                <p className="text-[11px] text-neutral-400 font-mono">
                  Enter comma-separated page numbers or ranges (e.g. "1-2, 4").
                </p>
              </div>

              {splitError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{splitError}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownloadSplitPdf}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-black text-[#D6B46A] disabled:opacity-50 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Split Range</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center gap-3 text-sm text-neutral-700 font-mono">
          <Loader2 className="w-5 h-5 animate-spin text-[#A68936]" />
          <span>{loadingProgress || 'Processing PDF document...'}</span>
        </div>
      )}

      {/* 6. Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">Are my PDF files uploaded to your server?</p>
            <p className="text-neutral-600 mt-0.5">No. All PDF operations (merging, splitting, rotating, and rendering) occur strictly in memory in your web browser. Nothing is uploaded or stored.</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Can I merge files of different dimensions and orientations?</p>
            <p className="text-neutral-600 mt-0.5">Yes. The merge engine preserves each document's native dimensions, orientation, and color space.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
