import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Download, Copy, Check, RefreshCw, Upload, 
  Trash2, AlertTriangle, ShieldCheck, Info, Sparkles, 
  Globe, Mail, Phone, MessageSquare, Wifi, UserCheck, 
  FileText, Calendar, ArrowRight, ExternalLink
} from 'lucide-react';
import CustomSelect from '../CustomSelect';
import CustomSlider from '../ui/CustomSlider';
import FormField from '../ui/FormField';
import CustomInput from '../ui/CustomInput';
import CustomTextarea from '../ui/CustomTextarea';
import CustomCheckbox from '../ui/CustomCheckbox';
import CustomBadge from '../ui/CustomBadge';
import { useCustomUi } from '../../context/CustomUiContext';

export type QrContentType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'whatsapp' 
  | 'wifi' 
  | 'vcard' 
  | 'sms' 
  | 'event';

export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

// Color Presets
const FOREGROUND_COLORS = [
  { name: 'Matte Black', hex: '#111111' },
  { name: 'Champagne Gold', hex: '#D6B46A' },
  { name: 'Deep Charcoal', hex: '#262626' },
  { name: 'Rich Bronze', hex: '#5B4019' },
  { name: 'Navy Midnight', hex: '#0F172A' },
  { name: 'Forest Emerald', hex: '#064E3B' }
];

const BACKGROUND_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Soft Ivory', hex: '#FFFDF8' },
  { name: 'Pearl Mist', hex: '#F8F4EE' },
  { name: 'Matte Black', hex: '#111111' }
];

// Helper to calculate relative luminance & contrast ratio
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export default function QrCodeGenerator() {
  const { showToast } = useCustomUi();
  const [contentType, setContentType] = useState<QrContentType>('url');

  // Payload fields
  const [url, setUrl] = useState('https://samaxon.com');
  const [text, setText] = useState('SamaXon Digital Solutions — Premium Web Design & High-Conversion Architecture');
  
  // Email fields
  const [emailTo, setEmailTo] = useState('contact@samaxon.com');
  const [emailSubject, setEmailSubject] = useState('Project Inquiry: High-Conversion Website');
  const [emailBody, setEmailBody] = useState('Hello SamaXon team, I would like to schedule an architectural consultation for our company.');
  
  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  
  // WhatsApp fields
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210');
  const [whatsappText, setWhatsappText] = useState('Hello SamaXon, I am interested in building a high-speed website.');
  
  // Wi-Fi fields
  const [wifiSsid, setWifiSsid] = useState('SamaXon-Guest');
  const [wifiPassword, setWifiPassword] = useState('LuxurySpeed2026');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // vCard fields
  const [vcardName, setVcardName] = useState('Sameer Khan');
  const [vcardOrg, setVcardOrg] = useState('SamaXon Digital Solutions');
  const [vcardTitle, setVcardTitle] = useState('Principal Digital Architect');
  const [vcardPhone, setVcardPhone] = useState('+919876543210');
  const [vcardEmail, setVcardEmail] = useState('contact@samaxon.com');
  const [vcardUrl, setVcardUrl] = useState('https://samaxon.com');

  // SMS fields
  const [smsNumber, setSmsNumber] = useState('+919876543210');
  const [smsMessage, setSmsMessage] = useState('Requesting website portfolio and pricing guide.');

  // Event fields
  const [eventTitle, setEventTitle] = useState('SamaXon Luxury Digital Showcase');
  const [eventLocation, setEventLocation] = useState('Taj Palace, New Delhi / Virtual');
  const [eventStartDate, setEventStartDate] = useState('2026-10-15T18:00');
  const [eventEndDate, setEventEndDate] = useState('2026-10-15T21:00');

  // QR Customization
  const [fgColor, setFgColor] = useState('#111111');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrSize, setQrSize] = useState<number>(1024);
  const [errorCorrection, setErrorCorrection] = useState<QrErrorCorrection>('H');
  const [marginModules, setMarginModules] = useState<number>(2);

  // Logo Overlay
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoScalePercent, setLogoScalePercent] = useState<number>(20);

  // Outputs
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Compute QR raw string based on content type
  const rawQrPayload = useMemo(() => {
    switch (contentType) {
      case 'url':
        return url.trim() || 'https://samaxon.com';
      case 'text':
        return text.trim() || 'SamaXon';
      case 'email': {
        const params = new URLSearchParams();
        if (emailSubject) params.append('subject', emailSubject);
        if (emailBody) params.append('body', emailBody);
        const query = params.toString();
        return `mailto:${emailTo}${query ? `?${query}` : ''}`;
      }
      case 'phone':
        return `tel:${phoneNumber.replace(/\s+/g, '')}`;
      case 'whatsapp': {
        const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
        const encodedMsg = encodeURIComponent(whatsappText.trim());
        return `https://wa.me/${cleanNum}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      }
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:;${vcardName};;;
FN:${vcardName}
ORG:${vcardOrg}
TITLE:${vcardTitle}
TEL:${vcardPhone}
EMAIL:${vcardEmail}
URL:${vcardUrl}
END:VCARD`;
      case 'sms':
        return `smsto:${smsNumber}:${smsMessage}`;
      case 'event': {
        const formatCalDate = (d: string) => d.replace(/[-:]/g, '') + '00Z';
        return `BEGIN:VEVENT
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DTSTART:${formatCalDate(eventStartDate)}
DTEND:${formatCalDate(eventEndDate)}
DESCRIPTION:Organized by SamaXon Digital Solutions
END:VEVENT`;
      }
      default:
        return 'https://samaxon.com';
    }
  }, [
    contentType, url, text, emailTo, emailSubject, emailBody, 
    phoneNumber, whatsappNumber, whatsappText, wifiSsid, wifiPassword, 
    wifiEncryption, wifiHidden, vcardName, vcardOrg, vcardTitle, 
    vcardPhone, vcardEmail, vcardUrl, smsNumber, smsMessage, 
    eventTitle, eventLocation, eventStartDate, eventEndDate
  ]);

  // Check Contrast
  const contrastRatio = useMemo(() => {
    return getContrastRatio(fgColor, bgColor);
  }, [fgColor, bgColor]);

  const hasLowContrast = contrastRatio < 4.0;

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image (PNG or JPG).', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Logo image must be under 2MB.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      setLogoFile(file);
      setLogoDataUrl(result);
      // Automatically bump error correction to H to guarantee scan reliability
      setErrorCorrection('H');
      showToast('Logo affixed. Error correction set to High (H) for optimal scanning.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoDataUrl(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
    showToast('Center logo removed.', 'info');
  };

  // Re-generate QR Code onto Canvas & SVG
  useEffect(() => {
    let isCancelled = false;

    const generate = async () => {
      setIsRendering(true);
      try {
        // 1. Generate SVG String
        const svg = await QRCode.toString(rawQrPayload, {
          type: 'svg',
          errorCorrectionLevel: errorCorrection,
          margin: marginModules,
          color: {
            dark: fgColor,
            light: bgColor
          }
        });
        if (!isCancelled) setQrSvgString(svg);

        // 2. Generate Canvas with optional logo overlay
        const renderCanvas = document.createElement('canvas');
        renderCanvas.width = qrSize;
        renderCanvas.height = qrSize;

        await QRCode.toCanvas(renderCanvas, rawQrPayload, {
          width: qrSize,
          margin: marginModules,
          errorCorrectionLevel: errorCorrection,
          color: {
            dark: fgColor,
            light: bgColor
          }
        });

        // Overlay Logo if exists
        if (logoDataUrl) {
          const ctx = renderCanvas.getContext('2d');
          if (ctx) {
            await new Promise<void>((resolve) => {
              const logoImg = new Image();
              logoImg.crossOrigin = 'anonymous';
              logoImg.onload = () => {
                const logoSize = (qrSize * logoScalePercent) / 100;
                const logoX = (qrSize - logoSize) / 2;
                const logoY = (qrSize - logoSize) / 2;

                // Draw background plate behind logo so it doesn't clash with QR modules
                ctx.fillStyle = bgColor;
                const padding = logoSize * 0.12;
                const r = logoSize * 0.18;
                
                // Rounded background plate
                ctx.beginPath();
                ctx.roundRect(logoX - padding, logoY - padding, logoSize + padding * 2, logoSize + padding * 2, r);
                ctx.fill();

                // Draw image
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                resolve();
              };
              logoImg.onerror = () => resolve();
              logoImg.src = logoDataUrl;
            });
          }
        }

        const finalDataUrl = renderCanvas.toDataURL('image/png');
        if (!isCancelled) {
          setQrDataUrl(finalDataUrl);
        }
      } catch (err) {
        console.error('QR rendering error:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    };

    generate();

    return () => {
      isCancelled = true;
    };
  }, [rawQrPayload, fgColor, bgColor, qrSize, errorCorrection, marginModules, logoDataUrl, logoScalePercent]);

  // Download Handlers
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `samaxon-qrcode-${contentType}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('High-resolution QR code PNG downloaded.', 'success');
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samaxon-qrcode-${contentType}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vector QR code SVG downloaded.', 'success');
  };

  const handleCopyRawPayload = () => {
    navigator.clipboard.writeText(rawQrPayload);
    setCopiedPayload(true);
    showToast('Raw QR payload string copied to clipboard.', 'success');
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const handleReset = () => {
    setContentType('url');
    setUrl('https://samaxon.com');
    setFgColor('#111111');
    setBgColor('#FFFFFF');
    setQrSize(1024);
    setErrorCorrection('H');
    setMarginModules(2);
    setLogoFile(null);
    setLogoDataUrl(null);
    showToast('QR parameters reset to default baseline.', 'info');
  };

  return (
    <div className="space-y-10 text-left" id="qr-code-generator-tool">
      {/* Hero Header */}
      <div className="bg-[#111111] text-[#FFFDF8] border border-[#D6B46A]/25 rounded-[32px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <CustomBadge variant="gold" size="md" icon={<QrCode className="w-3 h-3" />}>
              Vector & Print Engine
            </CustomBadge>
            <span className="text-[10px] font-mono text-[#D6B46A]/80 uppercase tracking-wider">
              Zero Server Uploads · 100% Private
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Custom High-Resolution <span className="text-[#D6B46A]">QR Code</span> Generator
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            Create publication-grade, vector-crisp QR codes for websites, WhatsApp, Wi-Fi access, vCards, and marketing collateral. Customize brand colors, quiet margins, and center logos with real-time scan verification.
          </p>
        </div>
      </div>

      {/* Main Grid: Builder Controls (Left) vs Live Preview & Downloads (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Forms & Settings (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7">
          {/* Header with Type Selector */}
          <div className="flex items-center justify-between border-b border-[#D6B46A]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">Content Type</span>
              <h3 className="font-display text-lg font-bold text-[#111111]">Choose QR Data Paradigm</h3>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Content Type Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: 'url', label: 'Website URL', icon: Globe },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'vcard', label: 'vCard Contact', icon: UserCheck },
              { id: 'wifi', label: 'Wi-Fi Access', icon: Wifi },
              { id: 'phone', label: 'Phone Call', icon: Phone },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'text', label: 'Plain Text', icon: FileText },
              { id: 'sms', label: 'SMS Text', icon: MessageSquare },
              { id: 'event', label: 'Calendar Event', icon: Calendar }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = contentType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setContentType(item.id as QrContentType)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111111] border-[#D6B46A] text-[#D6B46A] shadow-md'
                      : 'bg-[#FAF6F0] border-[#D6B46A]/20 text-[#111111] hover:border-[#D6B46A]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D6B46A]' : 'text-[#8A8178]'}`} />
                  <span className="text-[10px] font-bold truncate max-w-full">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Form */}
          <div className="p-5 bg-[#FAF6F0]/60 border border-[#D6B46A]/25 rounded-2xl space-y-4">
            {contentType === 'url' && (
              <FormField
                label="Destination Website URL"
                description="Enter the full target URL including https://"
                required
              >
                <CustomInput
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  startIcon={<Globe className="w-4 h-4" />}
                />
              </FormField>
            )}

            {contentType === 'whatsapp' && (
              <div className="space-y-4">
                <FormField
                  label="WhatsApp Phone Number (with Country Code)"
                  description="e.g. 919876543210 (without + or hyphens)"
                  required
                >
                  <CustomInput
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="919876543210"
                    startIcon={<MessageSquare className="w-4 h-4" />}
                  />
                </FormField>

                <FormField
                  label="Pre-Filled Message"
                  description="Message that opens automatically in the user's WhatsApp chat"
                >
                  <CustomTextarea
                    value={whatsappText}
                    onChange={(e) => setWhatsappText(e.target.value)}
                    rows={2}
                    placeholder="Hello! I would like to inquire about your website design packages."
                  />
                </FormField>
              </div>
            )}

            {contentType === 'vcard' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Full Name" required>
                    <CustomInput
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                    />
                  </FormField>
                  <FormField label="Company / Organization">
                    <CustomInput
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      placeholder="e.g. Acme Corp"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Job Title">
                    <CustomInput
                      value={vcardTitle}
                      onChange={(e) => setVcardTitle(e.target.value)}
                      placeholder="e.g. Managing Director"
                    />
                  </FormField>
                  <FormField label="Mobile / Direct Phone" required>
                    <CustomInput
                      type="tel"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Email Address">
                    <CustomInput
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      placeholder="jane@example.com"
                    />
                  </FormField>
                  <FormField label="Website URL">
                    <CustomInput
                      type="url"
                      value={vcardUrl}
                      onChange={(e) => setVcardUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {contentType === 'wifi' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Network Name (SSID)" required>
                    <CustomInput
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. Office-Guest"
                      startIcon={<Wifi className="w-4 h-4" />}
                    />
                  </FormField>
                  <FormField label="Password">
                    <CustomInput
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Network Password"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <FormField label="Security Encryption">
                    <CustomSelect
                      value={wifiEncryption}
                      onChange={(val) => setWifiEncryption(val as any)}
                      options={[
                        { value: 'WPA', label: 'WPA / WPA2 / WPA3 (Standard)' },
                        { value: 'WEP', label: 'WEP (Legacy)' },
                        { value: 'nopass', label: 'No Password (Open Network)' }
                      ]}
                    />
                  </FormField>

                  <div className="flex items-center pt-5">
                    <CustomCheckbox
                      id="wifi-hidden-toggle"
                      checked={wifiHidden}
                      onChange={setWifiHidden}
                      label="Hidden Network"
                      description="Network does not broadcast SSID"
                    />
                  </div>
                </div>
              </div>
            )}

            {contentType === 'phone' && (
              <FormField
                label="Phone Number to Dial"
                description="Triggers device dialer directly when scanned"
                required
              >
                <CustomInput
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  startIcon={<Phone className="w-4 h-4" />}
                />
              </FormField>
            )}

            {contentType === 'email' && (
              <div className="space-y-3">
                <FormField label="Recipient Email Address" required>
                  <CustomInput
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@example.com"
                    startIcon={<Mail className="w-4 h-4" />}
                  />
                </FormField>
                <FormField label="Email Subject">
                  <CustomInput
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Project Inquiry"
                  />
                </FormField>
                <FormField label="Email Body Message">
                  <CustomTextarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={2}
                    placeholder="Write pre-composed email message..."
                  />
                </FormField>
              </div>
            )}

            {contentType === 'text' && (
              <FormField
                label="Plain Text Content"
                description="Any notes, serial numbers, voucher codes, or instructions"
                required
              >
                <CustomTextarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="Enter text payload..."
                />
              </FormField>
            )}

            {contentType === 'sms' && (
              <div className="space-y-3">
                <FormField label="Recipient Phone Number" required>
                  <CustomInput
                    type="tel"
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </FormField>
                <FormField label="Pre-Filled SMS Message">
                  <CustomTextarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={2}
                    placeholder="SMS text body..."
                  />
                </FormField>
              </div>
            )}

            {contentType === 'event' && (
              <div className="space-y-3">
                <FormField label="Event Title" required>
                  <CustomInput
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="Annual Gala"
                  />
                </FormField>
                <FormField label="Event Location">
                  <CustomInput
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Grand Ballroom / Zoom Link"
                  />
                </FormField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Start Date & Time">
                    <CustomInput
                      type="datetime-local"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                    />
                  </FormField>
                  <FormField label="End Date & Time">
                    <CustomInput
                      type="datetime-local"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                    />
                  </FormField>
                </div>
              </div>
            )}
          </div>

          {/* Styling & Color Controls */}
          <div className="space-y-4 pt-2">
            <h4 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider">
              Color Palette & Visual Styling
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreground Color */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111111]">
                  Pattern Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-[#D6B46A]/40 p-1 cursor-pointer bg-white"
                  />
                  <CustomInput
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {FOREGROUND_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFgColor(c.hex)}
                      className="w-6 h-6 rounded-lg border border-neutral-300 transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#111111]">
                  Quiet Zone Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-[#D6B46A]/40 p-1 cursor-pointer bg-white"
                  />
                  <CustomInput
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {BACKGROUND_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setBgColor(c.hex)}
                      className="w-6 h-6 rounded-lg border border-neutral-300 transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Contrast Warning */}
            {hasLowContrast && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Low contrast ratio ({contrastRatio.toFixed(1)}:1). Dark patterns on light backgrounds ensure reliable scanning across older smartphone cameras.</span>
              </div>
            )}
          </div>

          {/* Advanced Technical Controls: Error Correction, Margins, Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#D6B46A]/15">
            <FormField
              label="Error Correction"
              description="Restoration capability if printed QR is damaged or obscured"
            >
              <CustomSelect
                value={errorCorrection}
                onChange={(val) => setErrorCorrection(val as QrErrorCorrection)}
                options={[
                  { value: 'L', label: 'Level L (7% Recovery)', sublabel: 'Simplest matrix' },
                  { value: 'M', label: 'Level M (15% Recovery)', sublabel: 'Standard everyday use' },
                  { value: 'Q', label: 'Level Q (25% Recovery)', sublabel: 'Heavy industrial prints' },
                  { value: 'H', label: 'Level H (30% Recovery)', sublabel: 'Best for logo overlays' }
                ]}
              />
            </FormField>

            <FormField
              label="Quiet Margin"
              description="Blank modules surrounding pattern"
            >
              <CustomSelect
                value={String(marginModules)}
                onChange={(val) => setMarginModules(Number(val))}
                options={[
                  { value: '0', label: '0 Modules (Tightest)' },
                  { value: '1', label: '1 Module' },
                  { value: '2', label: '2 Modules (Recommended)' },
                  { value: '4', label: '4 Modules (Strict Standard)' }
                ]}
              />
            </FormField>

            <FormField
              label="Export Dimension"
              description="PNG output resolution"
            >
              <CustomSelect
                value={String(qrSize)}
                onChange={(val) => setQrSize(Number(val))}
                options={[
                  { value: '512', label: '512 × 512 px (Web)' },
                  { value: '1024', label: '1024 × 1024 px (High Res)' },
                  { value: '2048', label: '2048 × 2048 px (Billboard / 300 DPI)' }
                ]}
              />
            </FormField>
          </div>

          {/* Optional Center Logo Upload */}
          <div className="p-4 bg-[#FAF6F0] border border-[#D6B46A]/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#111111] block">Affix Center Brand Logo (Optional)</span>
                <span className="text-[11px] text-[#8A8178]">Adds your brand mark in the center of the QR matrix</span>
              </div>

              {logoDataUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Logo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-[#111111] text-[#D6B46A] hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Logo</span>
                </button>
              )}
            </div>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
              className="sr-only"
            />

            {logoDataUrl && (
              <div className="space-y-3 pt-2 border-t border-[#D6B46A]/15">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-[#D6B46A]/30 p-1 bg-white flex items-center justify-center shrink-0">
                    <img src={logoDataUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="text-xs text-[#8A8178]">
                    <p className="font-semibold text-[#111111]">{logoFile?.name}</p>
                    <p className="text-[10px]">Scale: {logoScalePercent}% (Recommended 15%–22%)</p>
                  </div>
                </div>

                <CustomSlider
                  min={12}
                  max={28}
                  step={1}
                  value={logoScalePercent}
                  onChange={setLogoScalePercent}
                  label="Center Logo Size Scale"
                  unit="%"
                  minLabel="12% Subtle"
                  maxLabel="28% Maximum Safe"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Responsive Preview & Exports (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#85641C] font-bold">
                Real-Time Vector Preview
              </span>
              <h3 className="font-display text-lg font-bold text-[#111111]">
                Scannable Preview Plate
              </h3>
            </div>

            {/* QR Code Presentation Box */}
            <div 
              className="p-6 sm:p-8 rounded-3xl border border-[#D6B46A]/25 flex items-center justify-center shadow-inner relative transition-all duration-300"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl ? (
                <div className="relative max-w-[260px] sm:max-w-[280px] w-full aspect-square flex items-center justify-center">
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="w-full h-full object-contain drop-shadow-md rounded-lg"
                  />
                  {isRendering && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center rounded-lg">
                      <RefreshCw className="w-6 h-6 text-[#D6B46A] animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-[#8A8178] text-xs">
                  Generating Matrix...
                </div>
              )}
            </div>

            {/* Test Scanner Advisory */}
            <div className="p-3.5 bg-[#FAF6F0] border border-[#D6B46A]/25 rounded-2xl flex items-start gap-2.5 text-left text-xs text-[#8A8178] leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#85641C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111111] block mb-0.5">Verification Mandate:</strong>
                Test your QR code with multiple devices and ambient lighting conditions before mass printing or publishing.
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="w-full py-3 bg-[#111111] text-[#D6B46A] hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG ({qrSize} × {qrSize} px)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={!qrSvgString}
                className="w-full py-2.5 bg-[#FFFDF8] border border-[#D6B46A] text-[#111111] hover:bg-[#FAF6F0] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#85641C]" />
                <span>Download Scalable SVG (Vector)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyRawPayload}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPayload ? 'Payload Copied' : 'Copy Raw QR Text Payload'}</span>
              </button>
            </div>

            {/* Payload preview snippet */}
            <div className="text-left p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-[10px] font-mono text-[#8A8178] break-all max-h-20 overflow-y-auto">
              <span className="text-[#111111] font-bold block mb-0.5 uppercase tracking-wider">Payload Content:</span>
              {rawQrPayload}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
