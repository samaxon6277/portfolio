import React from 'react';
import { Download, FileText, Code2, Printer, Table } from 'lucide-react';
import CustomCopyButton from './CustomCopyButton';

export interface CustomExportControlsProps {
  onExportJson?: () => void;
  onExportMarkdown?: () => void;
  onExportTxt?: () => void;
  onExportCsv?: () => void;
  onPrint?: () => void;
  copyText?: string;
  copyLabel?: string;
  className?: string;
  compact?: boolean;
}

export default function CustomExportControls({
  onExportJson,
  onExportMarkdown,
  onExportTxt,
  onExportCsv,
  onPrint,
  copyText,
  copyLabel = 'Copy Report',
  className = '',
  compact = false
}: CustomExportControlsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {copyText && (
        <CustomCopyButton 
          text={copyText} 
          label={copyLabel} 
          variant={compact ? 'secondary' : 'primary'}
        />
      )}

      {onExportMarkdown && (
        <button
          type="button"
          onClick={onExportMarkdown}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Download Markdown (.md)"
        >
          <FileText className="w-3.5 h-3.5 text-neutral-500" />
          <span>Markdown</span>
        </button>
      )}

      {onExportJson && (
        <button
          type="button"
          onClick={onExportJson}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Download Structured JSON (.json)"
        >
          <Code2 className="w-3.5 h-3.5 text-neutral-500" />
          <span>JSON</span>
        </button>
      )}

      {onExportTxt && (
        <button
          type="button"
          onClick={onExportTxt}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Download Plain Text (.txt)"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500" />
          <span>TXT</span>
        </button>
      )}

      {onExportCsv && (
        <button
          type="button"
          onClick={onExportCsv}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Download Spreadsheet (.csv)"
        >
          <Table className="w-3.5 h-3.5 text-neutral-500" />
          <span>CSV</span>
        </button>
      )}

      {onPrint && (
        <button
          type="button"
          onClick={onPrint}
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Print Friendly View"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-500" />
          <span>Print</span>
        </button>
      )}
    </div>
  );
}
