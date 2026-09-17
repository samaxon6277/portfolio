import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Trash2, AlignLeft, Upload, Loader2 } from 'lucide-react';

interface ButtonBaseProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  title?: string;
}

export const CopyButton: React.FC<ButtonBaseProps & {
  textToCopy?: string;
  onCopySuccess?: () => void;
  label?: string;
  successLabel?: string;
}> = ({
  textToCopy,
  onClick,
  onCopySuccess,
  disabled = false,
  className = '',
  label = 'Copy',
  successLabel = 'Copied!',
  id,
  title = 'Copy to clipboard',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (disabled) return;
    if (textToCopy !== undefined) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        onCopySuccess?.();
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for clipboard API if permissions restricted
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        onCopySuccess?.();
        setTimeout(() => setCopied(false), 2000);
      }
    } else if (onClick) {
      onClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleCopy}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${
        copied
          ? 'bg-emerald-600 text-white shadow-xs'
          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200/80'
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
          <span>{successLabel}</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-neutral-600" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export const DownloadButton: React.FC<ButtonBaseProps & {
  onDownload: () => void;
  label?: string;
  loading?: boolean;
}> = ({
  onDownload,
  disabled = false,
  loading = false,
  className = '',
  label = 'Download',
  id,
  title = 'Download file',
}) => {
  return (
    <button
      type="button"
      id={id}
      onClick={onDownload}
      disabled={disabled || loading}
      title={title}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] border border-[#D6B46A]/40 shadow-xs ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      <span>{label}</span>
    </button>
  );
};

export const ResetButton: React.FC<ButtonBaseProps & {
  onReset: () => void;
  label?: string;
}> = ({
  onReset,
  disabled = false,
  className = '',
  label = 'Reset',
  id,
  title = 'Reset to defaults',
}) => {
  return (
    <button
      type="button"
      id={id}
      onClick={onReset}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <RotateCcw className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export const ClearButton: React.FC<ButtonBaseProps & {
  onClear: () => void;
  label?: string;
}> = ({
  onClear,
  disabled = false,
  className = '',
  label = 'Clear',
  id,
  title = 'Clear content',
}) => {
  return (
    <button
      type="button"
      id={id}
      onClick={onClear}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export const FormatButton: React.FC<ButtonBaseProps & {
  onFormat: () => void;
  label?: string;
}> = ({
  onFormat,
  disabled = false,
  className = '',
  label = 'Format',
  id,
  title = 'Format / Beautify',
}) => {
  return (
    <button
      type="button"
      id={id}
      onClick={onFormat}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <AlignLeft className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};

export const UploadButton: React.FC<{
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}> = ({
  onFileSelect,
  accept,
  label = 'Upload File',
  disabled = false,
  className = '',
  id,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    // reset input so same file can be re-selected if needed
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id={id ? `${id}-input` : undefined}
      />
      <button
        type="button"
        id={id}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label={label}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 shadow-2xs transition-all cursor-pointer select-none active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      >
        <Upload className="w-3.5 h-3.5 text-neutral-600" />
        <span>{label}</span>
      </button>
    </>
  );
};
