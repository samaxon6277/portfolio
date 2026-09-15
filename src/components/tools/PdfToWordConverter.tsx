import React, { useState, useRef, useCallback } from 'react';
import { 
  FileText, Upload, Download, Copy, RefreshCw, 
  ShieldCheck, AlertCircle, Check, Loader2, Sparkles, 
  AlertTriangle, FileCheck, Eye, EyeOff
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } from 'docx';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useCustomUi } from '../../context/CustomUiContext';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

interface PageTextData {
  pageNumber: number;
  lines: { text: string; fontSize: number; isBold: boolean }[];
  rawText: string;
}

export default function PdfToWordConverter() {
  const { showToast } = useCustomUi();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [extractedPages, setExtractedPages] = useState<PageTextData[]>([]);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [isScannedWarning, setIsScannedWarning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Extract structured text from PDF
  const processPdfFile = async (selectedFile: File) => {
    if (selectedFile.size > 50 * 1024 * 1024) {
      showToast('File size exceeds the 50MB limit.', 'error');
      return;
    }

    setFile(selectedFile);
    setIsConverting(true);
    setConversionProgress('Reading PDF document...');
    setExtractedPages([]);
    setIsScannedWarning(false);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const pagesData: PageTextData[] = [];
      let allExtractedWords = 0;

      for (let i = 1; i <= numPages; i++) {
        setConversionProgress(`Extracting text from page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items roughly by vertical Y coordinate to reconstruct lines
        const items = textContent.items as any[];
        
        // Sort items: top-to-bottom (descending Y in PDF coordinates), then left-to-right (ascending X)
        items.sort((a, b) => {
          const yA = a.transform[5];
          const yB = b.transform[5];
          if (Math.abs(yA - yB) > 4) {
            return yB - yA;
          }
          return a.transform[4] - b.transform[4];
        });

        const lineGroups: { text: string; fontSize: number; isBold: boolean }[] = [];
        let currentLineText = '';
        let currentLineY: number | null = null;
        let maxFontSizeInLine = 12;
        let isLineBold = false;

        for (const item of items) {
          const textStr = item.str || '';
          if (!textStr.trim() && textStr !== ' ') continue;

          const itemY = item.transform[5];
          const fontSize = Math.abs(item.transform[0]) || 12;
          const fontName = (item.fontName || '').toLowerCase();
          const bold = fontName.includes('bold') || fontName.includes('black') || fontName.includes('heavy');

          if (currentLineY === null || Math.abs(itemY - currentLineY) <= 5) {
            currentLineText += (currentLineText && !currentLineText.endsWith(' ') && !textStr.startsWith(' ') ? ' ' : '') + textStr;
            currentLineY = itemY;
            if (fontSize > maxFontSizeInLine) maxFontSizeInLine = fontSize;
            if (bold) isLineBold = true;
          } else {
            if (currentLineText.trim()) {
              lineGroups.push({
                text: currentLineText.trim(),
                fontSize: Math.round(maxFontSizeInLine),
                isBold: isLineBold
              });
            }
            currentLineText = textStr;
            currentLineY = itemY;
            maxFontSizeInLine = fontSize;
            isLineBold = bold;
          }
        }

        if (currentLineText.trim()) {
          lineGroups.push({
            text: currentLineText.trim(),
            fontSize: Math.round(maxFontSizeInLine),
            isBold: isLineBold
          });
        }

        const pageRawText = lineGroups.map(l => l.text).join('\n');
        const pageWords = (pageRawText.match(/\S+/g) || []).length;
        allExtractedWords += pageWords;

        pagesData.push({
          pageNumber: i,
          lines: lineGroups,
          rawText: pageRawText
        });
      }

      setExtractedPages(pagesData);
      setTotalWordCount(allExtractedWords);

      // Honest detection of scanned/image-only PDFs
      if (allExtractedWords < 15) {
        setIsScannedWarning(true);
        showToast('Notice: Little or no text found. This may be a scanned image-only PDF.', 'warning');
      } else {
        showToast(`Successfully extracted text across ${numPages} page(s).`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      if (err?.name === 'PasswordException') {
        showToast('This PDF is password-protected. Please unlock the file first.', 'error');
      } else {
        showToast('Could not process this PDF document.', 'error');
      }
      setFile(null);
    } finally {
      setIsConverting(false);
      setConversionProgress('');
    }
  };

  // Generate and download DOCX file
  const handleDownloadDocx = async () => {
    if (extractedPages.length === 0) return;

    setIsGeneratingDocx(true);
    try {
      const docChildren: any[] = [];

      extractedPages.forEach((page, pageIdx) => {
        // If not first page, add a PageBreak
        if (pageIdx > 0) {
          docChildren.push(new Paragraph({
            children: [new PageBreak()]
          }));
        }

        page.lines.forEach((line) => {
          const text = line.text;
          const isHeading = line.fontSize >= 16 || (line.fontSize >= 14 && line.isBold);
          const isSubheading = line.fontSize >= 13 && line.fontSize < 16;

          if (isHeading) {
            docChildren.push(new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 240, after: 120 }
            }));
          } else if (isSubheading) {
            docChildren.push(new Paragraph({
              text: text,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 180, after: 80 }
            }));
          } else {
            docChildren.push(new Paragraph({
              children: [
                new TextRun({
                  text: text,
                  bold: line.isBold,
                  size: 24 // 12pt in half-points
                })
              ],
              spacing: { after: 120 }
            }));
          }
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'document';
      a.download = `${baseName}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Word document (.docx) generated and downloaded.', 'success');
    } catch (err) {
      console.error('DOCX generation error:', err);
      showToast('Error building DOCX file.', 'error');
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  // Copy all extracted text
  const handleCopyText = async () => {
    if (extractedPages.length === 0) return;
    const allText = extractedPages.map(p => `--- PAGE ${p.pageNumber} ---\n\n${p.rawText}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(allText);
      setCopied(true);
      showToast('Extracted text copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  // Reset
  const handleReset = () => {
    setFile(null);
    setExtractedPages([]);
    setIsScannedWarning(false);
    setTotalWordCount(0);
    showToast('Converter reset.', 'info');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto" id="pdf-to-word-tool">
      {/* 1. Header & Security Guarantee */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-[#111111] text-[#D6B46A] rounded-lg">
            <FileText className="w-5 h-5" />
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-display">
            PDF to Word Converter
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#554F49]">
          Convert text-based PDF documents into editable Microsoft Word (.docx) documents directly in your browser.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-md w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Client-Side: Document parsing and DOCX construction occur locally in memory. Files are never uploaded.</span>
        </div>
      </div>

      {/* 2. Upload Area or Active Workspace */}
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 hover:border-[#D6B46A] bg-white hover:bg-neutral-50 rounded-2xl p-12 text-center transition-all cursor-pointer space-y-3 shadow-sm"
        >
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-600">
            <Upload className="w-6 h-6 text-[#A68936]" />
          </div>
          <p className="text-base font-bold text-[#111111]">
            Click or drag & drop a PDF to convert to Word (.docx)
          </p>
          <p className="text-xs text-neutral-500 font-mono">
            Supports text-based PDFs up to 50MB
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processPdfFile(f);
              e.target.value = '';
            }}
            accept="application/pdf"
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white border border-[#D6B46A]/30 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Document Header & Overview */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111111] truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h3>
                <p className="text-xs text-neutral-500 font-mono">
                  {extractedPages.length} pages · {totalWordCount.toLocaleString()} words extracted
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-neutral-500 hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Convert Another File</span>
            </button>
          </div>

          {/* Loading Indicator */}
          {isConverting && (
            <div className="p-8 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#A68936] mx-auto" />
              <p className="text-sm font-mono text-neutral-700">{conversionProgress}</p>
            </div>
          )}

          {/* Honest Scanned Document Warning */}
          {isScannedWarning && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Scanned or Image-Only Document Detected</p>
                <p className="leading-relaxed text-amber-800">
                  This document contains very little or no machine-readable text layer ({totalWordCount} words found).
                  It is likely a scanned photo or image PDF. Converting scanned image PDFs without an OCR (Optical Character Recognition) engine will yield an empty Word document.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isConverting && extractedPages.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadDocx}
                  disabled={isGeneratingDocx}
                  className="w-full sm:flex-1 py-3.5 px-6 bg-[#111111] hover:bg-black text-[#D6B46A] text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isGeneratingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>Download Word Document (.docx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="w-full sm:w-auto py-3.5 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy All Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full sm:w-auto py-3.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title={showPreview ? 'Hide preview' : 'Show preview'}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              </div>

              {/* Text Preview Box */}
              {showPreview && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase font-bold text-neutral-500">
                      Extracted Content Preview ({extractedPages.length} Pages)
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      Includes headings and paragraph structures
                    </span>
                  </div>

                  <div className="max-h-96 overflow-y-auto p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-6 text-xs text-neutral-800 leading-relaxed font-sans">
                    {extractedPages.map((page) => (
                      <div key={page.pageNumber} className="space-y-2 border-b border-neutral-200 pb-4 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-white border border-neutral-300 rounded text-[10px] font-mono font-bold text-neutral-500">
                            Page {page.pageNumber}
                          </span>
                        </div>
                        <div className="space-y-1.5 pl-1">
                          {page.lines.map((line, lIdx) => {
                            const isH = line.fontSize >= 15;
                            return (
                              <p 
                                key={lIdx} 
                                className={`${isH ? 'font-bold text-sm text-[#111111] pt-1' : 'text-neutral-700'} ${line.isBold ? 'font-semibold' : ''}`}
                              >
                                {line.text}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[#111111]">Frequently Asked Questions</h3>
        <div className="space-y-3 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">What is the difference between a text PDF and a scanned PDF?</p>
            <p className="text-neutral-600 mt-0.5">Text PDFs contain digital text encoded directly within the file (such as documents exported from Microsoft Word, Google Docs, or LaTeX). Scanned PDFs are photographs or bitmap scans saved as a PDF container, which require an OCR engine to reconstruct text.</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Are my documents private?</p>
            <p className="text-neutral-600 mt-0.5">Yes, 100%. The entire text extraction and DOCX generation takes place in your computer's browser memory. No data is sent over the internet or saved to our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
