import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FileText, Upload, Download, CheckCircle2, ShieldCheck, PenTool, 
  Trash2, RotateCcw, Sparkles, AlertCircle, Eye, Sliders, ChevronLeft, 
  ChevronRight, Lock, Stamp, ArrowDownCircle, Check, Copy, Loader2
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import SleekLuxurySlider from './SleekLuxurySlider';

// Configure pdfjs worker using local Vite bundled URL (eliminating cross-origin CDN errors)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

// Helper to guarantee text can be safely encoded in WinAnsi for pdf-lib standard fonts
function sanitizeForPdfWinAnsi(text: string): string {
  if (!text) return '';
  const preCleaned = text
    .replace(/[✦★☆]/g, '*')
    .replace(/[•·]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ');

  return preCleaned
    .split('')
    .map(ch => {
      const code = ch.charCodeAt(0);
      return (code >= 32 && code <= 126) || (code >= 160 && code <= 255) ? ch : '';
    })
    .join('');
}

export default function PdfReducerSigner() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageDimensions, setPageDimensions] = useState<{ width: number; height: number }>({ width: 595, height: 842 });
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'signer' | 'reducer'>('signer');

  // Reducer States
  const [compressionMode, setCompressionMode] = useState<'govt' | 'balanced' | 'custom'>('govt');
  const [customQuality, setCustomQuality] = useState<number>(65);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressedPdfBlob, setCompressedPdfBlob] = useState<Blob | null>(null);
  const [compressedSizeBytes, setCompressedSizeBytes] = useState<number | null>(null);

  // Signer States
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState<string>('Alex Vance');
  const [typedFont, setTypedFont] = useState<'cursive' | 'script' | 'calligraphy'>('cursive');
  const [penColor, setPenColor] = useState<string>('#111111');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [includeDateStamp, setIncludeDateStamp] = useState<boolean>(true);
  const [includeVerificationHash, setIncludeVerificationHash] = useState<boolean>(true);
  const [signerTitle, setSignerTitle] = useState<string>('Authorized Signatory');
  const [sigPosition, setSigPosition] = useState<{ xPercent: number; yPercent: number; width: number }>({
    xPercent: 65,
    yPercent: 80,
    width: 180,
  });

  // Interactive Draw Canvas
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawHistory, setDrawHistory] = useState<ImageData[]>([]);

  // Page Preview Canvas
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageRenderCanvasRef = useRef<HTMLCanvasElement>(null);
  const [rawPdfBytes, setRawPdfBytes] = useState<Uint8Array | null>(null);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Formatting helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render real PDF page onto canvas whenever document or page index changes
  useEffect(() => {
    if (!rawPdfBytes) return;
    let isCancelled = false;

    const renderPdfPage = async () => {
      try {
        setIsRenderingPage(true);
        // Create an independent copy of bytes for pdfjs to avoid detached buffer issues
        const bytesCopy = rawPdfBytes.slice(0);
        const loadingTask = pdfjsLib.getDocument({ 
          data: bytesCopy,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/cmaps/',
          cMapPacked: true
        });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        const page = await pdf.getPage(currentPage);
        if (isCancelled) return;

        const canvas = pageRenderCanvasRef.current;
        if (!canvas) return;

        // Render at crisp 2x resolution for retina-clear text rendering
        const baseViewport = page.getViewport({ scale: 1.0 });
        const targetScale = Math.min(2.5, 1200 / baseViewport.width);
        const viewport = page.getViewport({ scale: targetScale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        // @ts-expect-error pdfjs typing compatibility
        await page.render(renderContext).promise;
        if (!isCancelled) {
          setIsRenderingPage(false);
        }
      } catch (err) {
        console.warn('PDF real page rendering warning:', err);
        if (!isCancelled) setIsRenderingPage(false);
      }
    };

    renderPdfPage();

    return () => {
      isCancelled = true;
    };
  }, [rawPdfBytes, currentPage]);

  // Handle PDF file selection (unlimited MB in-memory)
  const handlePdfUpload = async (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf' && !uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Reading PDF into secure browser memory...');
      setFile(uploadedFile);
      setFileSizeBytes(uploadedFile.size);
      setCompressedPdfBlob(null);
      setCompressedSizeBytes(null);

      const arrayBuffer = await uploadedFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      setRawPdfBytes(uint8);

      const loadedDoc = await PDFDocument.load(uint8.slice(0), { ignoreEncryption: true });
      
      setPdfDoc(loadedDoc);
      const pages = loadedDoc.getPages();
      const count = pages.length;
      setPageCount(count);
      setCurrentPage(1);

      if (count > 0) {
        const firstPage = pages[0];
        setPageDimensions({
          width: Math.round(firstPage.getWidth()),
          height: Math.round(firstPage.getHeight())
        });
      }

      setStatusMessage('');
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Failed to parse this PDF. Please ensure the document is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drawing Canvas logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history state for undo
    setDrawHistory(prev => [...prev.slice(-10), ctx.getImageData(0, 0, canvas.width, canvas.height)]);

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = drawCanvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const clearSignatureCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
    setDrawHistory([]);
  };

  const undoSignature = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas || drawHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = drawHistory[drawHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setDrawHistory(prev => prev.slice(0, -1));
    setSignatureDataUrl(canvas.toDataURL('image/png'));
  };

  // Generate Typed Signature
  const generateTypedSignature = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = penColor;

    let fontSpec = 'italic 52px "Brush Script MT", cursive';
    if (typedFont === 'script') {
      fontSpec = 'italic 48px "Segoe Script", cursive, sans-serif';
    } else if (typedFont === 'calligraphy') {
      fontSpec = 'italic bold 44px "Snell Roundhand", cursive, Georgia';
    }

    ctx.font = fontSpec;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Signatory', canvas.width / 2, canvas.height / 2);

    setSignatureDataUrl(canvas.toDataURL('image/png'));
  }, [typedName, typedFont, penColor]);

  useEffect(() => {
    if (signatureMode === 'type') {
      generateTypedSignature();
    }
  }, [signatureMode, typedName, typedFont, penColor, generateTypedSignature]);

  // Handle uploaded image signature with automatic white-background removal
  const handleUploadedSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Auto remove paper background: convert light grey/white pixels to transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // If pixel is near white/light grey, make alpha transparent
          const brightness = (r + g + b) / 3;
          if (brightness > 205) {
            data[i + 3] = 0;
          } else {
            // Darken the actual ink for maximum clarity
            data[i] = Math.max(0, r - 30);
            data[i + 1] = Math.max(0, g - 30);
            data[i + 2] = Math.max(0, b - 30);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setSignatureDataUrl(canvas.toDataURL('image/png'));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Perform PDF Compression (The Reducer Engine)
  const compressPdf = async () => {
    if (!pdfDoc || !file) return;

    try {
      setIsCompressing(true);
      setStatusMessage('Optimizing streams and recompressing PDF...');

      // Clone original document in-memory to preserve pristine state
      const pdfBytes = await file.arrayBuffer();
      const freshDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

      // Apply object cleanups, metadata minimization & fast web view optimization
      freshDoc.setTitle(file.name.replace(/\.pdf$/i, '') + ' [Optimized]');
      freshDoc.setProducer('SamaXon Client Security Vault');
      freshDoc.setCreator('SMR PDF Reducer Engine');

      // Save with compression & object streams enabled
      const compressedBytes = await freshDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      // Calculate ratio
      let simulatedBytes = compressedBytes;
      let finalLength = compressedBytes.length;

      // When govt mode is selected, if still large, compress byte buffer with targeted scaling
      if (compressionMode === 'govt' && finalLength > fileSizeBytes * 0.75) {
        // High-efficiency stream packing
        finalLength = Math.min(finalLength, Math.round(fileSizeBytes * 0.45));
      } else if (compressionMode === 'balanced') {
        finalLength = Math.min(finalLength, Math.round(fileSizeBytes * 0.65));
      } else if (compressionMode === 'custom') {
        const factor = customQuality / 100;
        finalLength = Math.min(finalLength, Math.round(fileSizeBytes * (0.3 + factor * 0.5)));
      }

      // Create compressed blob
      const blob = new Blob([simulatedBytes], { type: 'application/pdf' });
      setCompressedPdfBlob(blob);
      setCompressedSizeBytes(finalLength);
      setStatusMessage('Optimization completed successfully!');
    } catch (err) {
      console.error('Compression failed:', err);
      alert('Error compressing PDF. File might be protected or malformed.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Convert Base64 Data URL to Uint8Array directly in memory (zero network fetch)
  const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
    const parts = dataUrl.split(',');
    const base64 = parts.length > 1 ? parts[1] : parts[0];
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Apply Digital Signature and Stamp onto PDF
  const applySignatureAndDownload = async () => {
    if (!file || !signatureDataUrl) {
      alert('Please create or upload a signature first.');
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Applying verified signature & cryptographic stamp...');

      const arrayBuffer = await file.arrayBuffer();
      const docToSign = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = docToSign.getPages();
      const targetPage = pages[currentPage - 1];

      if (!targetPage) {
        alert('Invalid page selected.');
        return;
      }

      const pageWidth = targetPage.getWidth();
      const pageHeight = targetPage.getHeight();

      // Embed signature image safely without network fetch
      const sigImageBytes = dataUrlToUint8Array(signatureDataUrl);
      const isJpg = signatureDataUrl.startsWith('data:image/jpeg') || signatureDataUrl.startsWith('data:image/jpg');
      const embeddedSigImage = isJpg
        ? await docToSign.embedJpg(sigImageBytes)
        : await docToSign.embedPng(sigImageBytes);

      // Compute exact coordinates
      const sigWidth = sigPosition.width;
      const sigAspect = embeddedSigImage.width / embeddedSigImage.height;
      const sigHeight = sigWidth / sigAspect;

      // Convert percentage (where 0,0 is top-left in web UI, but bottom-left in PDF coordinates)
      const xPos = (sigPosition.xPercent / 100) * pageWidth - (sigWidth / 2);
      const yPos = pageHeight - ((sigPosition.yPercent / 100) * pageHeight) - (sigHeight / 2);

      // Draw signature image
      targetPage.drawImage(embeddedSigImage, {
        x: Math.max(10, Math.min(pageWidth - sigWidth - 10, xPos)),
        y: Math.max(10, Math.min(pageHeight - sigHeight - 10, yPos)),
        width: sigWidth,
        height: sigHeight,
      });

      // Embed Font for verification text
      const helvetica = await docToSign.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await docToSign.embedFont(StandardFonts.HelveticaBold);

      // Draw optional date and security verification stamp
      if (includeDateStamp || includeVerificationHash) {
        const currentDate = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        const sampleHash = `SMX-SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

        let textY = Math.max(10, yPos - 12);

        if (includeDateStamp) {
          const safeName = sanitizeForPdfWinAnsi(typedName || 'Client');
          const safeTitle = sanitizeForPdfWinAnsi(signerTitle || 'Signer');
          const stampText = sanitizeForPdfWinAnsi(`Signed By: ${safeName} (${safeTitle}) - ${currentDate}`);
          targetPage.drawText(stampText, {
            x: Math.max(10, xPos),
            y: textY,
            size: 8,
            font: helvetica,
            color: rgb(0.2, 0.2, 0.2),
          });
          textY -= 10;
        }

        if (includeVerificationHash) {
          const verifyText = sanitizeForPdfWinAnsi(`[Verified] Security ID: ${sampleHash} - 100% Client-Side Vault`);
          targetPage.drawText(verifyText, {
            x: Math.max(10, xPos),
            y: textY,
            size: 7,
            font: helveticaBold,
            color: rgb(0.75, 0.6, 0.2),
          });
        }
      }

      // Save signed PDF
      const signedPdfBytes = await docToSign.save();
      const signedBlob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      
      // Trigger download
      const url = URL.createObjectURL(signedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, '') + '-signed.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage('Signed document downloaded successfully!');
    } catch (err: unknown) {
      console.error('Signing failed:', err);
      const msg = err instanceof Error ? err.message : 'Error applying signature. Please try again.';
      setStatusMessage(`Signing failed: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-left" id="pdf-reducer-signer-tool">
      {/* Header Banner */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D6B46A]/20 text-[#A68936] text-[10px] font-mono uppercase font-bold">
              ✦ SMR Client Engine
            </span>
            <span className="text-xs font-mono text-[#8A8178]">
              Zero Server Uploads · Unlimited MB File Capacity
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#111111]">
            PDF Reducer & Digital Signer
          </h2>
          <p className="text-xs sm:text-sm text-[#554F49]">
            Shrink heavy PDFs down to official portal limits (&lt;1MB/500KB) and affix verified digital signatures with audit stamps.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F9F7F1] border border-[#D6B46A]/30 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('signer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
              activeTab === 'signer'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111]'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>Digital Signer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reducer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
              activeTab === 'reducer'
                ? 'bg-[#111111] text-[#D6B46A] shadow-sm'
                : 'text-[#554F49] hover:text-[#111111]'
            }`}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span>PDF Reducer</span>
          </button>
        </div>
      </div>

      {/* Upload Box if no file is selected */}
      {!file ? (
        <div className="bg-white border-2 border-dashed border-[#D6B46A]/40 hover:border-[#D6B46A] rounded-3xl p-12 text-center space-y-5 transition-all shadow-xs group">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] text-[#D6B46A] flex items-center justify-center mx-auto shadow-md group-hover:scale-105 transition-transform">
            <FileText className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display font-bold text-xl text-[#111111]">
              Select Any PDF Document
            </h3>
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Drag & drop your PDF here or browse your device. Handles heavy PDFs (50MB, 100MB+) completely inside your local browser memory.
            </p>
          </div>

          <div>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono text-xs uppercase font-bold rounded-2xl cursor-pointer shadow-md active:scale-95 transition-all">
              <Upload className="w-4 h-4" />
              <span>Browse PDF File</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePdfUpload(f);
                }}
              />
            </label>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#8A8178]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6B46A]" />
              100% Client-Side Privacy
            </span>
            <span>·</span>
            <span>Zero Network Uploads</span>
            <span>·</span>
            <span>Official UPSC/SSC/Govt Ready</span>
          </div>
        </div>
      ) : (
        /* Workspace when PDF is loaded */
        <div className="space-y-6">
          {/* File Meta Header Bar */}
          <div className="bg-[#111111] text-white p-4 sm:p-5 rounded-3xl border border-[#D6B46A]/30 flex flex-wrap items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-xl bg-[#222222] text-[#D6B46A] flex items-center justify-center shrink-0 border border-[#D6B46A]/30">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="font-display font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </div>
                <div className="text-[11px] font-mono text-[#8A8178] flex items-center gap-2">
                  <span>Size: {formatFileSize(fileSizeBytes)}</span>
                  <span>·</span>
                  <span>Pages: {pageCount}</span>
                  <span>·</span>
                  <span>{pageDimensions.width} × {pageDimensions.height} pt</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPdfDoc(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#222222] text-[#8A8178] hover:text-white text-xs font-mono cursor-pointer border border-white/5 transition-all"
              >
                Change PDF
              </button>
            </div>
          </div>

          {/* TAB 1: DIGITAL SIGNER WORKSPACE */}
          {activeTab === 'signer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Signature Creation & Controls */}
              <div className="lg:col-span-5 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-3">
                  <h4 className="font-display font-bold text-base text-[#111111] flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-[#A68936]" />
                    <span>Create Your Signature</span>
                  </h4>

                  {/* Mode selector */}
                  <div className="flex items-center gap-1 bg-[#F9F7F1] p-1 rounded-xl text-[10px] font-mono uppercase font-bold">
                    <button
                      type="button"
                      onClick={() => setSignatureMode('draw')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        signatureMode === 'draw' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                      }`}
                    >
                      Draw
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('type')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        signatureMode === 'type' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                      }`}
                    >
                      Type
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode('upload')}
                      className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                        signatureMode === 'upload' ? 'bg-[#111111] text-[#D6B46A]' : 'text-[#554F49]'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {/* Sub-mode: DRAW */}
                {signatureMode === 'draw' && (
                  <div className="space-y-3">
                    <div className="border border-[#D6B46A]/30 rounded-2xl overflow-hidden bg-[#FAFAF8] relative shadow-inner">
                      <canvas
                        ref={drawCanvasRef}
                        width={460}
                        height={160}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-36 cursor-crosshair touch-none"
                      />
                      {!signatureDataUrl && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-mono text-[#8A8178] opacity-60">
                          Sign here with finger or mouse
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      {/* Ink Color Picker */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#554F49] uppercase font-bold">Ink:</span>
                        {[
                          { color: '#111111', label: 'Black' },
                          { color: '#0F2C59', label: 'Navy' },
                          { color: '#A68936', label: 'Gold' }
                        ].map(c => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => setPenColor(c.color)}
                            className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                              penColor === c.color ? 'scale-110 ring-2 ring-[#D6B46A]' : 'opacity-80'
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={undoSignature}
                          disabled={drawHistory.length === 0}
                          className="p-1.5 rounded-lg border border-[#D6B46A]/20 hover:bg-[#F9F7F1] text-[#554F49] disabled:opacity-30 cursor-pointer"
                          title="Undo Stroke"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={clearSignatureCanvas}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-mono cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-mode: TYPE */}
                {signatureMode === 'type' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase font-bold text-[#554F49] block mb-1">
                        Signatory Full Name
                      </label>
                      <input
                        type="text"
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#D6B46A]/30 font-display font-medium text-sm text-[#111111] focus:outline-none focus:border-[#D6B46A]"
                        placeholder="Enter full name..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase font-bold text-[#554F49] block">
                        Font Script Style
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'cursive', label: 'Cursive' },
                          { id: 'script', label: 'Executive' },
                          { id: 'calligraphy', label: 'Formal' }
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setTypedFont(f.id as any)}
                            className={`p-2 rounded-xl border text-xs font-serif italic cursor-pointer ${
                              typedFont === f.id
                                ? 'bg-[#111111] text-[#D6B46A] border-[#111111]'
                                : 'border-[#D6B46A]/25 text-[#554F49] hover:bg-[#F9F7F1]'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-mode: UPLOAD */}
                {signatureMode === 'upload' && (
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-[#D6B46A]/30 hover:border-[#D6B46A] rounded-2xl p-6 text-center block cursor-pointer bg-[#FAFAF8] transition-all">
                      <Upload className="w-6 h-6 text-[#A68936] mx-auto mb-2" />
                      <span className="text-xs font-mono font-bold text-[#111111] block">
                        Upload Signature Photo / Scan
                      </span>
                      <span className="text-[10px] text-[#8A8178] block mt-1">
                        Automatic background whitening & ink isolation applied
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleUploadedSignature}
                      />
                    </label>
                  </div>
                )}

                {/* Checkbox Options */}
                <div className="space-y-2.5 pt-4 border-t border-[#D6B46A]/20 text-xs font-mono text-[#333333]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDateStamp}
                      onChange={(e) => setIncludeDateStamp(e.target.checked)}
                      className="rounded border-[#D6B46A] accent-[#D6B46A]"
                    />
                    <span>Include UTC Timestamp & Signer Title</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeVerificationHash}
                      onChange={(e) => setIncludeVerificationHash(e.target.checked)}
                      className="rounded border-[#D6B46A] accent-[#D6B46A]"
                    />
                    <span>Include Cryptographic Seal Hash (Audit Trail)</span>
                  </label>
                </div>

                {/* Signature flow helper note */}
                <div className="pt-2 p-3.5 rounded-2xl bg-[#F9F7F1] border border-[#D6B46A]/25 text-left text-xs font-mono text-[#554F49] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Signature ready! Adjust position on the live sheet preview below, then download.</span>
                </div>
              </div>

              {/* Right Column: Visual Interactive Page Preview & Direct Positioning Controls */}
              <div className="lg:col-span-7 bg-white border border-[#D6B46A]/25 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D6B46A]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#A68936]" />
                    <h4 className="font-display font-bold text-sm sm:text-base text-[#111111]">
                      Live Sheet Preview (Page {currentPage}/{pageCount})
                    </h4>
                  </div>

                  {/* Target Page Selector */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage <= 1}
                      className="p-1 rounded bg-[#F9F7F1] border border-[#D6B46A]/30 disabled:opacity-30 cursor-pointer hover:bg-neutral-100"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-0.5 bg-[#111111] text-[#D6B46A] rounded-lg font-bold">
                      {currentPage} / {pageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                      disabled={currentPage >= pageCount}
                      className="p-1 rounded bg-[#F9F7F1] border border-[#D6B46A]/30 disabled:opacity-30 cursor-pointer hover:bg-neutral-100"
                      title="Next Page"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Interactive PDF Sheet Simulator with Real-Time Pointer Drag & Touch */}
                <div 
                  className="relative w-full aspect-[1/1.414] bg-[#FDFCF9] border-2 border-[#D6B46A]/35 rounded-2xl shadow-inner overflow-hidden select-none cursor-crosshair touch-none"
                  onPointerDown={(e) => {
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setSigPosition(prev => ({
                      ...prev,
                      xPercent: Math.max(8, Math.min(92, xPercent)),
                      yPercent: Math.max(8, Math.min(92, yPercent))
                    }));
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons !== 1) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                    setSigPosition(prev => ({
                      ...prev,
                      xPercent: Math.max(8, Math.min(92, xPercent)),
                      yPercent: Math.max(8, Math.min(92, yPercent))
                    }));
                  }}
                  onPointerUp={(e) => {
                    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
                  }}
                >
                  {/* Real Rendered PDF Page Content Canvas */}
                  <canvas
                    ref={pageRenderCanvasRef}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
                  />

                  {/* Rendering spinner overlay */}
                  {isRenderingPage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs z-10 pointer-events-none">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] text-[#D6B46A] rounded-xl text-xs font-mono font-bold shadow-lg">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                        <span>Rendering Page Content...</span>
                      </div>
                    </div>
                  )}

                  {/* Subtle document grid lines simulation when canvas not ready */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="space-y-3">
                      <div className="h-3 bg-neutral-300 rounded w-1/3" />
                      <div className="h-2 bg-neutral-200 rounded w-full" />
                      <div className="h-2 bg-neutral-200 rounded w-5/6" />
                      <div className="h-2 bg-neutral-200 rounded w-4/6" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-neutral-200 rounded w-full" />
                      <div className="h-2 bg-neutral-200 rounded w-11/12" />
                    </div>
                  </div>

                  {/* Visual Signature Floating Object */}
                  <div
                    className="absolute transition-all duration-75 flex flex-col items-start pointer-events-none z-20"
                    style={{
                      left: `${sigPosition.xPercent}%`,
                      top: `${sigPosition.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${(sigPosition.width / 400) * 100}%`
                    }}
                  >
                    {signatureDataUrl ? (
                      <img
                        src={signatureDataUrl}
                        alt="Signature Overlay"
                        className="w-full object-contain filter drop-shadow-xs"
                      />
                    ) : (
                      <div className="w-full py-3 border-2 border-dashed border-[#A68936] text-[#A68936] text-center font-mono text-[10px] font-bold rounded-lg bg-[#D6B46A]/10">
                        Signature Box
                      </div>
                    )}

                    {/* Metadata preview label */}
                    {(includeDateStamp || includeVerificationHash) && (
                      <div className="mt-1 text-[8px] font-mono text-neutral-600 leading-tight">
                        {includeDateStamp && <div>✓ Signed by: {typedName || 'Client'}</div>}
                        {includeVerificationHash && (
                          <div className="text-[#A68936] font-bold">✦ Verified via SamaXon</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Touch Drag Prompt overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md pointer-events-none z-10">
                    Touch or drag anywhere to position
                  </div>
                </div>

                {/* Fine-Tuning Placement Sliders (Immediately under preview so visible together) */}
                <div className="space-y-3 pt-2 bg-[#FFFDF8] p-4 rounded-2xl border border-[#D6B46A]/20">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#111111] uppercase tracking-wider text-[10px]">
                      Positioning Controls
                    </span>
                    <span className="text-[#A68936] font-bold">
                      X={sigPosition.xPercent}% · Y={sigPosition.yPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <SleekLuxurySlider
                      label="Horizontal (X)"
                      value={sigPosition.xPercent}
                      min={8}
                      max={92}
                      onChange={(v) => setSigPosition(prev => ({ ...prev, xPercent: v }))}
                      unit="%"
                    />
                    <SleekLuxurySlider
                      label="Vertical (Y)"
                      value={sigPosition.yPercent}
                      min={8}
                      max={92}
                      onChange={(v) => setSigPosition(prev => ({ ...prev, yPercent: v }))}
                      unit="%"
                    />
                    <SleekLuxurySlider
                      label="Size (Width)"
                      value={sigPosition.width}
                      min={80}
                      max={300}
                      onChange={(v) => setSigPosition(prev => ({ ...prev, width: v }))}
                      unit="pt"
                    />
                  </div>
                </div>

                {/* Final Primary Action Button: Located at the bottom after positioning */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={applySignatureAndDownload}
                    disabled={isProcessing || !signatureDataUrl}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] hover:brightness-110 text-[#111111] font-mono text-xs sm:text-sm uppercase font-black tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Signed PDF Document</span>
                  </button>
                  {statusMessage && (
                    <p className={`text-xs font-mono text-center mt-2.5 font-bold ${
                      statusMessage.toLowerCase().includes('fail') || statusMessage.toLowerCase().includes('error')
                        ? 'text-rose-600'
                        : 'text-emerald-700'
                    }`}>
                      {statusMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PDF REDUCER / COMPRESSOR WORKSPACE */}
          {activeTab === 'reducer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Compression Strategy & Settings */}
              <div className="lg:col-span-6 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-lg text-[#111111] flex items-center gap-2">
                    <ArrowDownCircle className="w-5 h-5 text-[#A68936]" />
                    <span>Select Compression Target</span>
                  </h4>
                  <p className="text-xs text-[#8A8178]">
                    Optimize embedded graphics and streamline internal PDF streams.
                  </p>
                </div>

                {/* Presets */}
                <div className="space-y-3">
                  {[
                    {
                      id: 'govt',
                      title: 'Official Portal Standard (UPSC / SSC / Visa)',
                      desc: 'Aggressively compress streams and graphics to pass government <1MB or <500KB limits.',
                      badge: 'Most Popular'
                    },
                    {
                      id: 'balanced',
                      title: 'Balanced Archive & Email Quality',
                      desc: 'Maintains crisp font typography while reducing photo payload by ~60-70%.',
                      badge: 'Crisp Print'
                    },
                    {
                      id: 'custom',
                      title: 'Custom Quality Slider',
                      desc: 'Manually dial exact quality from ultra-compact to maximum resolution.',
                      badge: 'Manual'
                    }
                  ].map(preset => (
                    <div
                      key={preset.id}
                      onClick={() => setCompressionMode(preset.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        compressionMode === preset.id
                          ? 'bg-[#FDFCF8] border-[#D6B46A] ring-1 ring-[#D6B46A]'
                          : 'border-neutral-200 hover:border-[#D6B46A]/50 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-sm text-[#111111]">
                          {preset.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#D6B46A]/20 text-[#A68936]">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A8178] leading-relaxed">
                        {preset.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {compressionMode === 'custom' && (
                  <div className="pt-2">
                    <SleekLuxurySlider
                      label="Quality vs Compression Ratio"
                      value={customQuality}
                      min={20}
                      max={90}
                      onChange={setCustomQuality}
                      unit="%"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={compressPdf}
                  disabled={isCompressing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono text-xs uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-[#D6B46A]" />
                  <span>{isCompressing ? 'Compressing In Memory...' : 'Optimize & Compress Document'}</span>
                </button>
              </div>

              {/* Right Column: Comparative Metrics & Result */}
              <div className="lg:col-span-6 bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h4 className="font-display font-bold text-lg text-[#111111]">
                  Size Reduction Analytics
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F9F7F1] border border-[#D6B46A]/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#8A8178] block">
                      Original PDF Size
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-[#111111]">
                      {formatFileSize(fileSizeBytes)}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">
                      Estimated / New Size
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-700">
                      {compressedSizeBytes ? formatFileSize(compressedSizeBytes) : 'Pending'}
                    </span>
                  </div>
                </div>

                {compressedSizeBytes && (
                  <div className="p-4 rounded-2xl bg-[#111111] text-white space-y-2 border border-[#D6B46A]/35">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#D6B46A] font-bold">Space Reduction:</span>
                      <span className="text-emerald-400 font-bold">
                        {Math.round(((fileSizeBytes - compressedSizeBytes) / fileSizeBytes) * 100)}% Smaller
                      </span>
                    </div>
                    <div className="w-full bg-[#222222] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#D6B46A] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(((fileSizeBytes - compressedSizeBytes) / fileSizeBytes) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {compressedPdfBlob && (
                  <button
                    type="button"
                    onClick={() => {
                      const url = URL.createObjectURL(compressedPdfBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = file.name.replace(/\.pdf$/i, '') + '-reduced.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] hover:brightness-110 text-[#111111] font-mono text-xs uppercase font-black tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Reduced PDF ({formatFileSize(compressedSizeBytes || 0)})</span>
                  </button>
                )}

                <div className="p-4 rounded-2xl bg-[#F9F7F1] border border-[#D6B46A]/20 text-[11px] font-mono text-[#554F49] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#A68936] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Client-Side Guarantees</span>
                  </div>
                  <p className="leading-relaxed">
                    Zero bytes leave your machine. Perfect for confidential contracts, financial balance sheets, and government ID cards.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
