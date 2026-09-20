import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Lock, Unlock, Eye, EyeOff, Upload, Download, Copy, RefreshCw, 
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, FileText, 
  FileUp, Image as ImageIcon, HelpCircle, ArrowRight, Check, KeyRound,
  Sliders, Info, Zap, Sparkles, FileArchive, Layers, Trash2, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';
import {
  calculateCapacity,
  encryptPayload,
  decryptPayload,
  constructStegoFrame,
  embedFrameIntoImageData,
  probeStegoHeader,
  extractCiphertextFromImageData,
  sanitizeFilename,
  formatBytes,
  calculatePasswordStrength,
  StegoSecretPayload,
  StegoCapacity,
  StegoHeaderInfo
} from '../../utils/steganography';

type StegoTab = 'hide' | 'extract';
type SecretType = 'text' | 'file';

interface CoverImageState {
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  format: 'png' | 'bmp' | 'jpeg' | 'webp' | 'other';
  isLossless: boolean;
}

export default function ImageSteganography() {
  const { showToast, showConfirm } = useCustomUi();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<StegoTab>('hide');

  // ==========================================
  // HIDE WORKFLOW STATE
  // ==========================================
  const [coverImage, setCoverImage] = useState<CoverImageState | null>(null);
  const [isConvertingLossy, setIsConvertingLossy] = useState(false);
  const [secretType, setSecretType] = useState<SecretType>('text');
  
  // Secret Content
  const [secretText, setSecretText] = useState<string>('');
  const [secretFile, setSecretFile] = useState<{
    file: File;
    name: string;
    size: number;
    mime: string;
    base64: string;
  } | null>(null);

  // Security Credentials
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [bitsPerChannel, setBitsPerChannel] = useState<1 | 2>(1);

  // Processing & Output
  const [isEmbedding, setIsEmbedding] = useState<boolean>(false);
  const [stegoResult, setStegoResult] = useState<{
    dataUrl: string;
    blob: Blob;
    width: number;
    height: number;
    filename: string;
    sizeBytes: number;
    payloadSizeBytes: number;
  } | null>(null);
  const [copiedRecoveryNote, setCopiedRecoveryNote] = useState<boolean>(false);

  // File Inputs Ref
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const secretFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // EXTRACT WORKFLOW STATE
  // ==========================================
  const [extractImage, setExtractImage] = useState<{
    file: File;
    dataUrl: string;
    width: number;
    height: number;
    sizeBytes: number;
  } | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [headerInfo, setHeaderInfo] = useState<StegoHeaderInfo | null>(null);
  const [extractedImageData, setExtractedImageData] = useState<ImageData | null>(null);

  // Extraction Password & Results
  const [extractPassword, setExtractPassword] = useState<string>('');
  const [showExtractPassword, setShowExtractPassword] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [decryptedResult, setDecryptedResult] = useState<StegoSecretPayload | null>(null);
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [copiedExtractedText, setCopiedExtractedText] = useState<boolean>(false);

  const extractImageInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // CAPACITY CALCULATIONS
  // ==========================================
  const capacityInfo: StegoCapacity | null = useMemo(() => {
    if (!coverImage) return null;
    return calculateCapacity(coverImage.width, coverImage.height, bitsPerChannel);
  }, [coverImage, bitsPerChannel]);

  // Estimate payload size in bytes
  const estimatedPayloadBytes = useMemo(() => {
    if (secretType === 'text') {
      const textBytes = new TextEncoder().encode(secretText).length;
      // Plaintext JSON wrapper overhead + GCM tag (16) + Header (42)
      return textBytes > 0 ? textBytes + 120 : 0;
    } else if (secretFile) {
      // Base64 string adds ~33% overhead + JSON metadata + GCM tag
      const base64Bytes = Math.ceil(secretFile.size * 1.37);
      return base64Bytes + 160;
    }
    return 0;
  }, [secretType, secretText, secretFile]);

  const isOverCapacity = useMemo(() => {
    if (!capacityInfo || estimatedPayloadBytes === 0) return false;
    return estimatedPayloadBytes > capacityInfo.maxPayloadBytes;
  }, [capacityInfo, estimatedPayloadBytes]);

  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(password);
  }, [password]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (stegoResult?.dataUrl) {
        URL.revokeObjectURL(stegoResult.dataUrl);
      }
    };
  }, [stegoResult]);

  // ==========================================
  // COVER IMAGE HANDLERS
  // ==========================================
  const handleCoverImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG or BMP recommended)', 'error');
      return;
    }

    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    const isBmp = file.type === 'image/bmp' || file.name.toLowerCase().endsWith('.bmp');
    const isLossless = isPng || isBmp;

    let format: CoverImageState['format'] = 'other';
    if (isPng) format = 'png';
    else if (isBmp) format = 'bmp';
    else if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) format = 'jpeg';
    else if (file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp')) format = 'webp';

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setCoverImage({
          file,
          dataUrl,
          width: img.width,
          height: img.height,
          sizeBytes: file.size,
          format,
          isLossless
        });
        setStegoResult(null);
      };
      img.onerror = () => {
        showToast('Could not load image. File may be corrupted.', 'error');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Convert lossy JPEG/WebP to Lossless PNG via canvas
  const handleConvertToLosslessPng = () => {
    if (!coverImage) return;
    setIsConvertingLossy(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsConvertingLossy(false);
        showToast('Canvas rendering error', 'error');
        return;
      }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setIsConvertingLossy(false);
        if (!blob) {
          showToast('Conversion failed', 'error');
          return;
        }

        const newFile = new File([blob], coverImage.file.name.replace(/\.[^.]+$/, '') + '-lossless.png', {
          type: 'image/png'
        });

        const newUrl = URL.createObjectURL(blob);
        setCoverImage({
          file: newFile,
          dataUrl: newUrl,
          width: img.width,
          height: img.height,
          sizeBytes: blob.size,
          format: 'png',
          isLossless: true
        });
        showToast('Image successfully converted to lossless PNG format!', 'success');
      }, 'image/png');
    };
    img.src = coverImage.dataUrl;
  };

  // Secret file upload handler
  const handleSecretFileSelect = (file: File) => {
    // 5MB safety threshold for browser canvas stego
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size is too large (max 5 MB for browser steganography)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      // Strip Data URL prefix to get raw base64 data
      const commaIndex = base64.indexOf(',');
      const rawBase64 = commaIndex !== -1 ? base64.slice(commaIndex + 1) : base64;

      setSecretFile({
        file,
        name: sanitizeFilename(file.name),
        size: file.size,
        mime: file.type || 'application/octet-stream',
        base64: rawBase64
      });
      showToast(`Selected file: ${file.name} (${formatBytes(file.size)})`, 'info');
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // EMBED ACTION
  // ==========================================
  const handleEmbed = async () => {
    if (!coverImage) {
      showToast('Please upload a cover image first', 'error');
      return;
    }

    if (!coverImage.isLossless) {
      showToast('Cover image must be a lossless format (PNG or BMP). Convert it first.', 'error');
      return;
    }

    if (secretType === 'text' && !secretText.trim()) {
      showToast('Please enter a secret text message to hide', 'error');
      return;
    }

    if (secretType === 'file' && !secretFile) {
      showToast('Please select a file to hide', 'error');
      return;
    }

    if (!password) {
      showToast('Please enter an encryption password', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match. Please verify your confirmation.', 'error');
      return;
    }

    if (isOverCapacity) {
      showToast('The secret data exceeds the capacity of this image. Use a larger image or fewer bytes.', 'error');
      return;
    }

    setIsEmbedding(true);

    try {
      // 1. Prepare Plaintext Payload
      const payload: StegoSecretPayload = {
        type: secretType,
        text: secretType === 'text' ? secretText : undefined,
        file: secretType === 'file' && secretFile ? {
          name: secretFile.name,
          mime: secretFile.mime,
          size: secretFile.size,
          base64: secretFile.base64
        } : undefined,
        createdAt: Date.now()
      };

      const payloadJson = JSON.stringify(payload);
      const plaintextBytes = new TextEncoder().encode(payloadJson);

      // 2. Encrypt with Web Crypto API (PBKDF2 -> AES-256-GCM)
      const { salt, iv, ciphertextWithTag } = await encryptPayload(plaintextBytes, password);

      // 3. Construct Binary Frame
      const frame = constructStegoFrame(bitsPerChannel, salt, iv, ciphertextWithTag);

      // 4. Draw cover image to Canvas & Extract ImageData
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for embedding'));
        img.src = coverImage.dataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Failed to initialize 2D canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // 5. Embed Frame into ImageData using LSB (Alpha channel preserved!)
      embedFrameIntoImageData(imageData, frame, bitsPerChannel);
      ctx.putImageData(imageData, 0, 0);

      // 6. Export as Lossless PNG Blob
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/png');
      });

      const stegoUrl = URL.createObjectURL(pngBlob);
      const cleanBaseName = coverImage.file.name.replace(/\.[^.]+$/, '');

      setStegoResult({
        dataUrl: stegoUrl,
        blob: pngBlob,
        width: img.width,
        height: img.height,
        filename: `${cleanBaseName}-stego.png`,
        sizeBytes: pngBlob.size,
        payloadSizeBytes: frame.length
      });

      showToast('Encrypted secret data embedded successfully into lossless PNG!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error occurred while embedding data', 'error');
    } finally {
      setIsEmbedding(false);
    }
  };

  // Download Stego Image
  const handleDownloadStego = () => {
    if (!stegoResult) return;
    const link = document.createElement('a');
    link.href = stegoResult.dataUrl;
    link.download = stegoResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Stego image downloaded!', 'success');
  };

  // Copy Recovery Instructions Note (Never includes password!)
  const handleCopyRecoveryNote = async () => {
    if (!stegoResult) return;
    const note = [
      '==================================================',
      'SAMAXON IMAGE STEGANOGRAPHY RECOVERY GUIDE',
      '==================================================',
      `File Name: ${stegoResult.filename}`,
      `Dimensions: ${stegoResult.width} × ${stegoResult.height} px`,
      `Created At: ${new Date().toLocaleString()}`,
      `Payload Type: ${secretType.toUpperCase()}`,
      '',
      'HOW TO DECRYPT & EXTRACT:',
      '1. Open https://samaxon.site/tools/image-steganography',
      '2. Switch to the "Extract Secret Data" tab.',
      '3. Upload this stego PNG file.',
      '4. Enter the private password you created during encryption.',
      '5. Extract your hidden message or download the original file.',
      '',
      'IMPORTANT NOTES:',
      '• Never upload this stego image to platforms that re-compress images (like WhatsApp, Twitter, or Instagram) as lossy recompression will destroy hidden pixels.',
      '• Store your password safely; it cannot be recovered without the correct key.'
    ].join('\n');

    try {
      await navigator.clipboard.writeText(note);
      setCopiedRecoveryNote(true);
      showToast('Recovery instructions copied to clipboard!', 'success');
      setTimeout(() => setCopiedRecoveryNote(false), 2500);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Reset Hide Workflow
  const handleResetHide = () => {
    showConfirm({
      title: 'Reset Steganography Form?',
      message: 'This will clear your uploaded cover image, secret message or file, and password.',
      confirmText: 'Yes, Reset',
      cancelText: 'Cancel',
      onConfirm: () => {
        setCoverImage(null);
        setSecretText('');
        setSecretFile(null);
        setPassword('');
        setConfirmPassword('');
        setStegoResult(null);
        if (coverImageInputRef.current) coverImageInputRef.current.value = '';
        if (secretFileInputRef.current) secretFileInputRef.current.value = '';
        showToast('Form reset', 'info');
      }
    });
  };

  // ==========================================
  // EXTRACT WORKFLOW HANDLERS
  // ==========================================
  const handleExtractImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setExtractImage({
          file,
          dataUrl,
          width: img.width,
          height: img.height,
          sizeBytes: file.size
        });
        setDecryptedResult(null);
        setDecryptionError(null);
        setExtractPassword('');

        // Probe for SamaXon Stego Header
        probeImageForStego(img);
      };
      img.onerror = () => {
        showToast('Failed to load image for extraction', 'error');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const probeImageForStego = (img: HTMLImageElement) => {
    setIsProbing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas context failure');

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      setExtractedImageData(imgData);

      const probeResult = probeStegoHeader(imgData);
      setHeaderInfo(probeResult);

      if (probeResult.hasPayload && !probeResult.isCorrupted) {
        showToast('Valid SamaXon stego payload detected! Enter password to decrypt.', 'success');
      } else if (probeResult.isCorrupted) {
        showToast('Image header detected, but data appears corrupted or modified.', 'error');
      } else {
        showToast('No SamaXon steganography payload detected in this image.', 'info');
      }
    } catch (err: any) {
      setHeaderInfo({ hasPayload: false, isCorrupted: false, errorMessage: err.message });
    } finally {
      setIsProbing(false);
    }
  };

  // Execute Decryption
  const handleDecrypt = async () => {
    if (!extractedImageData || !headerInfo || !headerInfo.hasPayload) {
      showToast('No valid stego payload loaded', 'error');
      return;
    }

    if (!extractPassword) {
      showToast('Please enter the secret password', 'error');
      return;
    }

    setIsDecrypting(true);
    setDecryptionError(null);
    setDecryptedResult(null);

    try {
      const mode = headerInfo.mode || 1;
      const payloadLength = headerInfo.payloadLength || 0;
      const salt = headerInfo.salt!;
      const iv = headerInfo.iv!;

      // 1. Extract exact ciphertext from pixel LSBs
      const ciphertextWithTag = extractCiphertextFromImageData(extractedImageData, mode, payloadLength);

      // 2. Decrypt with PBKDF2 -> AES-256-GCM
      const decryptedBytes = await decryptPayload(ciphertextWithTag, extractPassword, salt, iv);

      // 3. Decode JSON payload
      const jsonString = new TextDecoder().decode(decryptedBytes);
      const parsed: StegoSecretPayload = JSON.parse(jsonString);

      setDecryptedResult(parsed);
      showToast('Decryption successful! Secret data unlocked.', 'success');
    } catch (err: any) {
      setDecryptionError('Incorrect password or the stego payload was modified/corrupted.');
      showToast('Decryption failed. Incorrect password.', 'error');
    } finally {
      setIsDecrypting(false);
    }
  };

  // Copy Extracted Text
  const handleCopyExtractedText = async () => {
    if (!decryptedResult?.text) return;
    try {
      await navigator.clipboard.writeText(decryptedResult.text);
      setCopiedExtractedText(true);
      showToast('Secret message copied to clipboard!', 'success');
      setTimeout(() => setCopiedExtractedText(false), 2500);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Download Extracted File
  const handleDownloadExtractedFile = () => {
    if (!decryptedResult?.file) return;
    const { name, mime, base64 } = decryptedResult.file;

    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime || 'application/octet-stream' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = sanitizeFilename(name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`Downloaded: ${name}`, 'success');
    } catch (err) {
      showToast('Failed to reconstruct file', 'error');
    }
  };

  // Reset Extract Workflow
  const handleResetExtract = () => {
    setExtractImage(null);
    setHeaderInfo(null);
    setExtractedImageData(null);
    setExtractPassword('');
    setDecryptedResult(null);
    setDecryptionError(null);
    if (extractImageInputRef.current) extractImageInputRef.current.value = '';
    showToast('Extraction workspace reset', 'info');
  };

  return (
    <div className="space-y-10 text-left" id="image-steganography-tool">
      {/* Tool Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            CRYPTOGRAPHY & STEGANOGRAPHY
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% Client-Side · AES-256-GCM Authenticated
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          Image Steganography
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Hide encrypted messages or files inside an image and extract them later using this tool.
        </p>

        {/* Genuine Local Privacy Notice */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-medium">
            <strong>Strict Local Privacy Guarantee:</strong> Your image, message, file, and password are processed locally in your browser and are not uploaded to SamaXon.
          </p>
        </div>
      </div>

      {/* Main Workflow Switcher Tabs */}
      <div className="flex border-b border-neutral-200" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'hide'}
          onClick={() => setActiveTab('hide')}
          className={`px-6 py-3 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'hide'
              ? 'border-[#D6B46A] text-[#111111] bg-[#FFFDF8]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Lock className="w-4 h-4 text-[#A68936]" />
          <span>Hide Secret Data</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'extract'}
          onClick={() => setActiveTab('extract')}
          className={`px-6 py-3 font-mono text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'extract'
              ? 'border-[#D6B46A] text-[#111111] bg-[#FFFDF8]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Unlock className="w-4 h-4 text-[#A68936]" />
          <span>Extract Secret Data</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HIDE SECRET DATA WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'hide' && (
        <div className="space-y-8">
          {/* STEP 1: UPLOAD COVER IMAGE */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                  Select Cover Image (Lossless PNG / BMP)
                </h2>
              </div>

              {coverImage && (
                <button
                  type="button"
                  onClick={handleResetHide}
                  className="text-xs font-mono text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {!coverImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleCoverImageSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => coverImageInputRef.current?.click()}
                className="border-2 border-dashed border-[#D6B46A]/40 hover:border-[#A68936] bg-[#FFFDF8]/50 hover:bg-[#FFFDF8] rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group space-y-3"
              >
                <input
                  ref={coverImageInputRef}
                  type="file"
                  accept="image/png,image/bmp,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleCoverImageSelect(e.target.files[0]);
                  }}
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <ImageIcon className="w-7 h-7 text-[#A68936]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-900">
                    Drag and drop your cover image here, or <span className="text-[#A68936] underline">browse</span>
                  </p>
                  <p className="text-xs font-mono text-neutral-500">
                    Recommended: Lossless PNG or BMP · High resolution provides higher storage capacity
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <img
                    src={coverImage.dataUrl}
                    alt="Cover preview"
                    className="w-24 h-24 object-cover rounded-xl border border-neutral-300 shadow-xs shrink-0"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate font-mono">
                      {coverImage.file.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-600">
                      <span>Dimensions: <strong>{coverImage.width} × {coverImage.height}</strong> px</span>
                      <span>•</span>
                      <span>Size: <strong>{formatBytes(coverImage.sizeBytes)}</strong></span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        coverImage.isLossless ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Format: {coverImage.format.toUpperCase()} ({coverImage.isLossless ? 'Lossless' : 'Lossy'})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => coverImageInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-mono rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    Change Image
                  </button>
                  <input
                    ref={coverImageInputRef}
                    type="file"
                    accept="image/png,image/bmp,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleCoverImageSelect(e.target.files[0]);
                    }}
                  />
                </div>

                {/* Lossy Format Warning & Auto-Convert Banner */}
                {!coverImage.isLossless && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-xs text-amber-900">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-sm">
                          Lossy Format Warning ({coverImage.format.toUpperCase()})
                        </p>
                        <p className="text-amber-800 leading-relaxed">
                          JPEG and WebP use lossy compression algorithms that alter pixel values every time the image is saved. Embedding secret data directly into a lossy file will destroy the hidden payload. To protect your data, convert this image to a lossless PNG before embedding.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleConvertToLosslessPng}
                      disabled={isConvertingLossy}
                      className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isConvertingLossy ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Converting to Lossless PNG...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Convert to Lossless PNG (Recommended)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: SELECT SECRET DATA TYPE */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                Choose Secret Data Type
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSecretType('text')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  secretType === 'text'
                    ? 'border-[#A68936] bg-[#FFFDF8] ring-2 ring-[#D6B46A]/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${secretType === 'text' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-200 text-neutral-600'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-xs sm:text-sm text-neutral-900">Secret Text Message</p>
                  <p className="text-[11px] text-neutral-500">Hide passwords, private notes, seed phrases, or Unicode/emoji messages.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSecretType('file')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  secretType === 'file'
                    ? 'border-[#A68936] bg-[#FFFDF8] ring-2 ring-[#D6B46A]/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${secretType === 'file' ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-200 text-neutral-600'}`}>
                  <FileArchive className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-xs sm:text-sm text-neutral-900">Secret File</p>
                  <p className="text-[11px] text-neutral-500">Embed TXT, PDF, DOCX, ZIP, JSON, CSV, or code files inside pixels.</p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 3: ENTER SECRET CONTENT OR UPLOAD FILE */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                  {secretType === 'text' ? 'Enter Secret Message' : 'Select Secret File'}
                </h2>
              </div>

              {secretType === 'text' && (
                <div className="text-[11px] font-mono text-neutral-400">
                  {secretText.length} chars · {new TextEncoder().encode(secretText).length} bytes
                </div>
              )}
            </div>

            {secretType === 'text' ? (
              <div className="space-y-2">
                <textarea
                  value={secretText}
                  onChange={(e) => setSecretText(e.target.value)}
                  placeholder="Type or paste your secret message here (supports Unicode, international text, and emojis 🔒)..."
                  rows={6}
                  className="w-full p-4 font-mono text-xs sm:text-sm bg-neutral-50 border border-neutral-200 focus:border-[#A68936] rounded-2xl focus:outline-none focus:bg-white transition-all resize-y"
                />
                <p className="text-[11px] text-neutral-500">
                  Messages are encrypted in-memory before being embedded into pixel bytes. Never stored or logged.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {!secretFile ? (
                  <div
                    onClick={() => secretFileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 hover:border-[#A68936] bg-neutral-50 hover:bg-[#FFFDF8] rounded-2xl p-8 text-center transition-all cursor-pointer group space-y-2"
                  >
                    <input
                      ref={secretFileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleSecretFileSelect(e.target.files[0]);
                      }}
                    />
                    <FileUp className="w-8 h-8 text-[#A68936] mx-auto group-hover:scale-110 transition-transform" />
                    <p className="text-xs sm:text-sm font-bold text-neutral-800">
                      Click to choose a secret file to embed (TXT, PDF, DOCX, ZIP, JSON, CSV...)
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500">
                      Maximum recommended: 5 MB · Preserves original filename & MIME type inside encrypted payload
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-[#FFFDF8] border border-[#D6B46A]/40 rounded-2xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-[#111111] text-[#D6B46A]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs sm:text-sm font-bold font-mono text-neutral-900 truncate">
                          {secretFile.name}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-500">
                          {formatBytes(secretFile.size)} · {secretFile.mime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => secretFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-mono rounded-xl cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setSecretFile(null)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-xl"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      ref={secretFileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleSecretFileSelect(e.target.files[0]);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 4: ENCRYPTION PASSWORD & SECURITY */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                  Encryption Key / Password (PBKDF2 + AES-256-GCM)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Required for decryption</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>Secret Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong encryption password..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-neutral-50 border border-neutral-200 focus:border-[#A68936] rounded-xl focus:outline-none focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm..."
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : 'border-neutral-200 focus:border-[#A68936]'
                  }`}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-rose-600 font-mono">Passwords do not match.</p>
                )}
              </div>
            </div>

            {/* Password Strength Meter */}
            {password && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-600">Password Strength:</span>
                  <span className={`font-bold ${
                    passwordStrength.label === 'Weak' ? 'text-rose-600' :
                    passwordStrength.label === 'Moderate' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`}>
                    {passwordStrength.label} ({passwordStrength.score}/100)
                  </span>
                </div>

                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      passwordStrength.score < 40 ? 'bg-rose-500' :
                      passwordStrength.score < 70 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  />
                </div>

                {passwordStrength.tips.length > 0 && (
                  <div className="text-[11px] text-neutral-500 space-y-0.5 pt-1">
                    {passwordStrength.tips.map((tip, idx) => (
                      <p key={idx} className="flex items-center gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{tip}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* STEP 5: CAPACITY & STEALTH SETTINGS */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                  5
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                  Steganography Capacity & Stealth Mode
                </h2>
              </div>
            </div>

            {/* Embedding Mode Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                bitsPerChannel === 1 
                  ? 'border-[#A68936] bg-[#FFFDF8] ring-2 ring-[#D6B46A]/20' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input
                  type="radio"
                  name="bitsPerChannel"
                  checked={bitsPerChannel === 1}
                  onChange={() => setBitsPerChannel(1)}
                  className="mt-1 accent-[#A68936]"
                />
                <div className="space-y-0.5">
                  <p className="font-bold text-xs sm:text-sm text-neutral-900">1-Bit LSB (Maximum Stealth)</p>
                  <p className="text-[11px] text-neutral-500">
                    Modifies only the least significant bit per RGB channel (3 bits/pixel). 100% imperceptible to human eyes.
                  </p>
                </div>
              </label>

              <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                bitsPerChannel === 2 
                  ? 'border-[#A68936] bg-[#FFFDF8] ring-2 ring-[#D6B46A]/20' 
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}>
                <input
                  type="radio"
                  name="bitsPerChannel"
                  checked={bitsPerChannel === 2}
                  onChange={() => setBitsPerChannel(2)}
                  className="mt-1 accent-[#A68936]"
                />
                <div className="space-y-0.5">
                  <p className="font-bold text-xs sm:text-sm text-neutral-900">2-Bit LSB (High Capacity)</p>
                  <p className="text-[11px] text-neutral-500">
                    Modifies 2 bits per channel (6 bits/pixel). Doubles storage capacity while maintaining high visual quality.
                  </p>
                </div>
              </label>
            </div>

            {/* Capacity Stats Matrix */}
            {capacityInfo ? (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-neutral-500 block">Total Pixels:</span>
                    <strong className="text-neutral-900">{capacityInfo.totalPixels.toLocaleString()} px</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Max Image Capacity:</span>
                    <strong className="text-neutral-900">{formatBytes(capacityInfo.maxPayloadBytes)}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Secret Payload Size:</span>
                    <strong className={isOverCapacity ? 'text-rose-600 font-bold' : 'text-[#A68936]'}>
                      {formatBytes(estimatedPayloadBytes)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Remaining Room:</span>
                    <strong className="text-emerald-700">
                      {formatBytes(Math.max(0, capacityInfo.maxPayloadBytes - estimatedPayloadBytes))}
                    </strong>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOverCapacity ? 'bg-rose-500' : 'bg-[#D6B46A]'
                      }`}
                      style={{
                        width: `${Math.min(100, (estimatedPayloadBytes / (capacityInfo.maxPayloadBytes || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>0 B</span>
                    <span>
                      {((estimatedPayloadBytes / (capacityInfo.maxPayloadBytes || 1)) * 100).toFixed(1)}% Capacity Used
                    </span>
                    <span>{formatBytes(capacityInfo.maxPayloadBytes)}</span>
                  </div>
                </div>

                {/* Over-capacity warning */}
                {isOverCapacity && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-mono">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Payload exceeds image storage room! Upload a larger cover image or switch to 2-bit mode.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-center text-xs font-mono text-neutral-500">
                Upload a cover image above to calculate real storage capacity.
              </div>
            )}
          </div>

          {/* STEP 6: MAIN ACTION BUTTON */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#111111] rounded-3xl border border-neutral-800 text-white">
            <div className="space-y-0.5 text-left w-full sm:w-auto">
              <p className="text-sm font-bold font-mono text-[#D6B46A]">
                Ready to Encrypt & Hide Payload
              </p>
              <p className="text-xs text-neutral-400">
                Generates a lossless PNG with embedded encrypted bytes in your browser.
              </p>
            </div>

            <button
              type="button"
              onClick={handleEmbed}
              disabled={isEmbedding || isOverCapacity || !coverImage}
              className={`w-full sm:w-auto px-6 py-3 bg-[#D6B46A] hover:bg-[#c4a159] text-[#111111] font-mono font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 active:scale-95`}
            >
              {isEmbedding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Encrypting & Embedding Pixels...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Encrypt & Hide Secret in Image</span>
                </>
              )}
            </button>
          </div>

          {/* STEP 7 & 8: RESULT PREVIEW & DOWNLOAD */}
          {stegoResult && (
            <div className="bg-white border-2 border-[#D6B46A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="text-sm sm:text-base font-mono font-bold text-neutral-900 uppercase">
                      Stego Image Successfully Generated!
                    </h2>
                    <p className="text-xs text-neutral-500 font-mono">
                      Payload encrypted with AES-256-GCM and embedded in lossless pixel channels.
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-lg">
                  Lossless PNG
                </span>
              </div>

              {/* Preview & Stats */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <img
                  src={stegoResult.dataUrl}
                  alt="Stego Result"
                  className="max-h-60 max-w-full rounded-xl border border-neutral-300 shadow-sm object-contain"
                />

                <div className="space-y-2 flex-1 text-xs font-mono">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
                    <p className="text-neutral-500">Result File Name:</p>
                    <p className="font-bold text-neutral-900 text-sm truncate">{stegoResult.filename}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">Dimensions:</span>
                      <strong className="text-neutral-900">{stegoResult.width} × {stegoResult.height} px</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">File Size:</span>
                      <strong className="text-neutral-900">{formatBytes(stegoResult.sizeBytes)}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">Embedded Payload:</span>
                      <strong className="text-[#A68936]">{formatBytes(stegoResult.payloadSizeBytes)}</strong>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-neutral-200">
                      <span className="text-neutral-500 block">Visual Distortion:</span>
                      <strong className="text-emerald-700">None (&plusmn;1 LSB delta)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download & Note Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyRecoveryNote}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono font-medium rounded-xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  {copiedRecoveryNote ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedRecoveryNote ? 'Copied Instructions!' : 'Copy Recovery Instructions Note'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStego}
                  className="px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs sm:text-sm font-mono font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Stego Image (PNG)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EXTRACT SECRET DATA WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'extract' && (
        <div className="space-y-8">
          {/* UPLOAD STEGO IMAGE */}
          <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                  Upload Suspected Stego Image
                </h2>
              </div>

              {extractImage && (
                <button
                  type="button"
                  onClick={handleResetExtract}
                  className="text-xs font-mono text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {!extractImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleExtractImageSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => extractImageInputRef.current?.click()}
                className="border-2 border-dashed border-[#D6B46A]/40 hover:border-[#A68936] bg-[#FFFDF8]/50 hover:bg-[#FFFDF8] rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer group space-y-3"
              >
                <input
                  ref={extractImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleExtractImageSelect(e.target.files[0]);
                  }}
                />
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFFDF8] border border-[#D6B46A]/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Unlock className="w-7 h-7 text-[#A68936]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-neutral-900">
                    Drag and drop your stego image here, or <span className="text-[#A68936] underline">browse</span>
                  </p>
                  <p className="text-xs font-mono text-neutral-500">
                    Upload a PNG created by this tool to detect and decrypt hidden messages or files
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <img
                    src={extractImage.dataUrl}
                    alt="Extract preview"
                    className="w-24 h-24 object-cover rounded-xl border border-neutral-300 shadow-xs shrink-0"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate font-mono">
                      {extractImage.file.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-600">
                      <span>Dimensions: <strong>{extractImage.width} × {extractImage.height}</strong> px</span>
                      <span>•</span>
                      <span>File Size: <strong>{formatBytes(extractImage.sizeBytes)}</strong></span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => extractImageInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 text-xs font-mono rounded-xl cursor-pointer shrink-0"
                  >
                    Select Another
                  </button>
                  <input
                    ref={extractImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleExtractImageSelect(e.target.files[0]);
                    }}
                  />
                </div>

                {/* Stego Header Detection Status */}
                {isProbing ? (
                  <div className="p-4 bg-neutral-100 rounded-2xl flex items-center gap-2.5 text-xs font-mono text-neutral-600">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#A68936]" />
                    <span>Scanning image pixel channels for SamaXon stego signature...</span>
                  </div>
                ) : headerInfo?.hasPayload && !headerInfo.isCorrupted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Supported Stego Payload Detected!</p>
                      <p className="text-emerald-800">
                        Found valid signature (SMXSTEGO v{headerInfo.version}) with {headerInfo.mode}-bit LSB encoding.
                        Payload length: <strong>{formatBytes(headerInfo.payloadLength || 0)}</strong>.
                      </p>
                    </div>
                  </div>
                ) : headerInfo?.isCorrupted ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Corrupted or Incompatible Stego Header</p>
                      <p className="text-rose-800">
                        {headerInfo.errorMessage || 'The stego payload appears to have been modified or truncated by an external image editor or compression algorithm.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-2xl flex items-start gap-3 text-xs text-neutral-700">
                    <Info className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm">No Supported Stego Payload Detected</p>
                      <p className="text-neutral-600">
                        This image does not contain a SamaXon steganography header signature. Ensure you are uploading the unmodified PNG exported from this tool.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DECRYPTION PASSWORD PROMPT */}
          {headerInfo?.hasPayload && !headerInfo.isCorrupted && (
            <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D6B46A] text-xs font-mono font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-xs sm:text-sm font-mono font-bold text-neutral-900 uppercase">
                    Enter Decryption Key / Password
                  </h2>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                  <span>Password:</span>
                  <button
                    type="button"
                    onClick={() => setShowExtractPassword(!showExtractPassword)}
                    className="text-neutral-400 hover:text-neutral-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    {showExtractPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showExtractPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type={showExtractPassword ? 'text' : 'password'}
                    value={extractPassword}
                    onChange={(e) => setExtractPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleDecrypt();
                    }}
                    placeholder="Enter password used during encryption..."
                    className="flex-1 px-4 py-3 text-xs sm:text-sm font-mono bg-neutral-50 border border-neutral-200 focus:border-[#A68936] rounded-xl focus:outline-none focus:bg-white transition-colors"
                  />

                  <button
                    type="button"
                    onClick={handleDecrypt}
                    disabled={isDecrypting || !extractPassword}
                    className="px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isDecrypting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Decrypting...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        <span>Decrypt & Extract</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Banner */}
                {decryptionError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-mono">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{decryptionError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DECRYPTED DATA DISPLAY CARD */}
          {decryptedResult && (
            <div className="bg-white border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="text-sm sm:text-base font-mono font-bold text-neutral-900 uppercase">
                      Decryption Verified & Complete!
                    </h2>
                    <p className="text-xs text-neutral-500 font-mono">
                      Authenticated by AES-256-GCM · Created {new Date(decryptedResult.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-lg uppercase">
                  {decryptedResult.type} Payload
                </span>
              </div>

              {/* Text Message Result */}
              {decryptedResult.type === 'text' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-neutral-500">
                      <span>Decrypted Secret Message:</span>
                      <span>{decryptedResult.text?.length || 0} characters</span>
                    </div>

                    <div className="p-4 bg-neutral-900 text-neutral-100 font-mono text-xs sm:text-sm rounded-2xl border border-neutral-800 whitespace-pre-wrap break-words leading-relaxed select-all">
                      {decryptedResult.text}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCopyExtractedText}
                      className="px-4 py-2 bg-[#D6B46A] hover:bg-[#c4a159] text-[#111111] font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      {copiedExtractedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedExtractedText ? 'Copied Message!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* File Result */}
              {decryptedResult.type === 'file' && decryptedResult.file && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-3 bg-[#111111] text-[#D6B46A] rounded-xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-mono font-bold text-neutral-900 truncate">
                          {decryptedResult.file.name}
                        </p>
                        <p className="text-xs font-mono text-neutral-500">
                          {formatBytes(decryptedResult.file.size)} · MIME: {decryptedResult.file.mime}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownloadExtractedFile}
                      className="px-5 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] font-mono font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download File ({formatBytes(decryptedResult.file.size)})</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-500 font-mono">
                    Security Policy: The extracted file is not automatically executed or previewed to protect your device. Click above to safely save it locally.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDUCATIONAL & LIMITATIONS SECTION */}
      {/* ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-lg font-mono font-bold text-neutral-900 uppercase flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#A68936]" />
            How Image Steganography Works & Security Architecture
          </h2>
          <p className="text-xs font-mono text-neutral-500 mt-1">
            Technical explanation of Least Significant Bit (LSB) embedding and AES-GCM cryptography
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
            <p className="font-bold text-neutral-900 font-mono text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#A68936]" />
              LSB Pixel Embedding
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Every pixel is composed of Red, Green, and Blue channels (0–255). Steganography replaces only the least significant bit (1 or 2 bits) of each color byte. A shift of ±1 in color intensity is indistinguishable to the human eye, keeping the image visually pristine while storing binary data.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
            <p className="font-bold text-neutral-900 font-mono text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#A68936]" />
              Steganography vs Encryption
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Encryption scrambles data into unreadable ciphertext so unauthorized parties cannot read it. Steganography conceals the very fact that a secret exists at all. SamaXon combines both: data is first encrypted with authenticated AES-256-GCM, then embedded into pixel bytes.
            </p>
          </div>

          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2 text-xs">
            <p className="font-bold text-neutral-900 font-mono text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A68936]" />
              Why Lossless PNG is Required
            </p>
            <p className="text-neutral-600 leading-relaxed">
              Lossless formats (PNG, BMP) preserve exact pixel values. Lossy formats (JPEG, WebP) discard minor color variations during compression to reduce file size. Uploading a stego image to platforms like WhatsApp or Twitter will trigger lossy recompression and erase the hidden payload.
            </p>
          </div>
        </div>

        {/* Real Security Limitations & Disclosure */}
        <div className="p-5 bg-neutral-100 rounded-2xl border border-neutral-200 space-y-2 text-xs text-neutral-700">
          <p className="font-bold text-neutral-900 font-mono uppercase flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#A68936]" />
            Realistic Security & Statistical Limitations Disclosure
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-neutral-600 leading-relaxed">
            <li>
              <strong>Not Impossible to Detect:</strong> While visually identical to humans, statistical steganalysis tools (e.g. Chi-Square attack, Sample Pairs Analysis) can detect mathematical alterations in the least significant bit distribution of an image.
            </li>
            <li>
              <strong>Proprietary Framing:</strong> This tool uses an open, standard binary frame format with signature <code className="bg-neutral-200 px-1 py-0.5 rounded font-mono">SMXSTEGO</code>. Anyone with technical knowledge can inspect the LSBs to find the header and encrypted ciphertext.
            </li>
            <li>
              <strong>Strong Password Requirement:</strong> Confidentiality depends entirely on your password strength. Weak passwords can be vulnerable to offline dictionary attacks against the PBKDF2 salt. Always use 12+ characters with symbols and numbers.
            </li>
            <li>
              <strong>Social Media & Cloud Compression:</strong> Never transmit stego images through services that re-encode images (messaging apps, social platforms). Transmit as original uncompressed files or inside a ZIP archive.
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-base font-mono font-bold text-neutral-900 uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#A68936]" />
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
            <h3 className="font-bold text-neutral-900 font-mono">
              Does SamaXon see my hidden messages, files, or passwords?
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              No. All operations — image canvas rendering, PBKDF2 key derivation, AES-256-GCM encryption, and LSB embedding — execute 100% locally in your web browser using HTML5 Canvas and the standard Web Crypto API. No files or keys are transmitted to our servers.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
            <h3 className="font-bold text-neutral-900 font-mono">
              What happens if I forget my password?
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Because AES-256-GCM authenticated encryption is used without any backdoors or master recovery keys, data cannot be recovered without the correct password. Please record your password safely.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
            <h3 className="font-bold text-neutral-900 font-mono">
              How much data can fit inside an image?
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              In 1-bit mode, an image can store approximately 3 bits per pixel (1 bit for Red, Green, and Blue). A 1920×1080 image has 2,073,600 pixels, providing approximately 777 KB of storage room — plenty for long documents, keys, or compressed archives.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
            <h3 className="font-bold text-neutral-900 font-mono">
              Can I hide files other than plain text?
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Yes. The tool supports embedding any file format (PDF, DOCX, ZIP, JSON, CSV, code files) as long as the file size fits within the capacity of your cover image.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RELATED TOOLS */}
      {/* ========================================================================= */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xs font-mono font-bold text-neutral-900 uppercase">
          Related Security & Image Tools
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/tools/password-generator"
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#FFFDF8] border border-neutral-200 hover:border-[#A68936] transition-all text-left group"
          >
            <KeyRound className="w-4 h-4 text-[#A68936] mb-1.5" />
            <p className="font-mono text-xs font-bold text-neutral-900 group-hover:text-[#A68936] transition-colors">
              Password Generator
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">Crypto-grade passphrases</p>
          </Link>

          <Link
            to="/tools/compressor"
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#FFFDF8] border border-neutral-200 hover:border-[#A68936] transition-all text-left group"
          >
            <ImageIcon className="w-4 h-4 text-[#A68936] mb-1.5" />
            <p className="font-mono text-xs font-bold text-neutral-900 group-hover:text-[#A68936] transition-colors">
              Photo Compressor
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">Optimize image file size</p>
          </Link>

          <Link
            to="/tools/resizer"
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#FFFDF8] border border-neutral-200 hover:border-[#A68936] transition-all text-left group"
          >
            <Layers className="w-4 h-4 text-[#A68936] mb-1.5" />
            <p className="font-mono text-xs font-bold text-neutral-900 group-hover:text-[#A68936] transition-colors">
              Photo Resizer
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">Increase pixel dimensions</p>
          </Link>

          <Link
            to="/tools/qr-generator"
            className="p-3.5 rounded-2xl bg-neutral-50 hover:bg-[#FFFDF8] border border-neutral-200 hover:border-[#A68936] transition-all text-left group"
          >
            <ExternalLink className="w-4 h-4 text-[#A68936] mb-1.5" />
            <p className="font-mono text-xs font-bold text-neutral-900 group-hover:text-[#A68936] transition-colors">
              QR Code Generator
            </p>
            <p className="text-[10px] text-neutral-500 font-mono">Create scannable codes</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
