import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MessageSquare, CheckCircle2, Copy, Download, RotateCcw, 
  QrCode, ExternalLink, Sliders, Smartphone, Check, Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import ToolHeader from './common/ToolHeader';
import { CopyButton, DownloadButton, ResetButton } from './common/ToolActions';

interface CountryCode {
  name: string;
  code: string;
  dial: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { name: 'United States / Canada', code: 'US', dial: '1' },
  { name: 'United Kingdom', code: 'GB', dial: '44' },
  { name: 'India', code: 'IN', dial: '91' },
  { name: 'United Arab Emirates', code: 'AE', dial: '971' },
  { name: 'Saudi Arabia', code: 'SA', dial: '966' },
  { name: 'Germany', code: 'DE', dial: '49' },
  { name: 'France', code: 'FR', dial: '33' },
  { name: 'Australia', code: 'AU', dial: '61' },
  { name: 'Singapore', code: 'SG', dial: '65' },
  { name: 'Brazil', code: 'BR', dial: '55' },
  { name: 'Nigeria', code: 'NG', dial: '234' },
  { name: 'Pakistan', code: 'PK', dial: '92' },
  { name: 'Kenya', code: 'KE', dial: '254' },
  { name: 'South Africa', code: 'ZA', dial: '27' },
  { name: 'Custom Dial Code', code: 'XX', dial: '' }
];

export default function WhatsAppLinkGenerator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [customDial, setCustomDial] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('5551234567');
  const [message, setMessage] = useState('Hello! I would like to inquire about SamaXon Digital Solutions services.');
  const [buttonText, setButtonText] = useState('Chat on WhatsApp');
  const [buttonTheme, setButtonTheme] = useState<'whatsapp' | 'dark' | 'gold' | 'outline'>('whatsapp');

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Normalize phone number (digits only, no leading zeros)
  const normalizedFullNumber = useMemo(() => {
    const dial = selectedCountry.code === 'XX' ? customDial.replace(/\D/g, '') : selectedCountry.dial;
    let local = phoneNumber.replace(/\D/g, '');
    // Strip leading zero if present
    if (local.startsWith('0')) local = local.slice(1);
    return `${dial}${local}`;
  }, [selectedCountry, customDial, phoneNumber]);

  // Generate Official wa.me Link
  const generatedLink = useMemo(() => {
    if (!normalizedFullNumber) return '';
    const base = `https://wa.me/${normalizedFullNumber}`;
    if (!message.trim()) return base;
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }, [normalizedFullNumber, message]);

  // Generate QR Code via canvas
  useEffect(() => {
    if (qrCanvasRef.current && generatedLink) {
      QRCode.toCanvas(qrCanvasRef.current, generatedLink, {
        width: 240,
        margin: 2,
        color: {
          dark: buttonTheme === 'whatsapp' ? '#075E54' : '#111111',
          light: '#ffffff'
        }
      }, (err) => {
        if (err) console.error('QR code generation failed:', err);
      });
    }
  }, [generatedLink, buttonTheme]);

  // Button HTML Snippet
  const buttonHtml = useMemo(() => {
    let style = 'background-color: #25D366; color: #ffffff;';
    if (buttonTheme === 'dark') style = 'background-color: #111111; color: #D6B46A;';
    else if (buttonTheme === 'gold') style = 'background-color: #D6B46A; color: #111111;';
    else if (buttonTheme === 'outline') style = 'background-color: transparent; color: #25D366; border: 2px solid #25D366;';

    return `<a href="${generatedLink}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-family: sans-serif; font-weight: bold; font-size: 14px; ${style}">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg>
  <span>${buttonText}</span>
</a>`;
  }, [generatedLink, buttonText, buttonTheme]);

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const url = qrCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `whatsapp-qr-${normalizedFullNumber}.png`;
    a.click();
  };

  return (
    <div className="space-y-8 text-left" id="whatsapp-link-generator">
      <ToolHeader
        title="Direct WhatsApp Link & QR Generator"
        description="Create official WhatsApp click-to-chat links (wa.me) with pre-filled messages, scannable high-resolution QR codes, and embeddable CTA buttons."
        icon={MessageSquare}
        categoryName="Branding & Identity"
        categorySlug="branding-identity"
        badgeText="100% CLIENT-SIDE · OFFICIAL WA.ME FORMAT"
      />

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#A68936]" />
              WhatsApp Contact Details
            </h3>
            <ResetButton
              onReset={() => {
                setPhoneNumber('5551234567');
                setMessage('Hello! I would like to inquire about SamaXon Digital Solutions services.');
              }}
              label="Reset"
            />
          </div>

          <div className="space-y-4">
            {/* Country Selector & Number */}
            <div className="space-y-1.5">
              <label htmlFor="country-selector" className="text-xs font-mono font-bold text-neutral-800 block">
                Destination Phone Number
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-6">
                  <select
                    id="country-selector"
                    value={selectedCountry.name}
                    onChange={(e) => {
                      const c = COUNTRY_CODES.find(x => x.name === e.target.value);
                      if (c) setSelectedCountry(c);
                    }}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} {c.dial ? `(+${c.dial})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCountry.code === 'XX' && (
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="e.g. 351"
                      value={customDial}
                      onChange={(e) => setCustomDial(e.target.value)}
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-xs font-mono"
                      title="Custom country dial code"
                    />
                  </div>
                )}

                <div className={selectedCountry.code === 'XX' ? 'sm:col-span-4' : 'sm:col-span-6'}>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Local phone number"
                    className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Normalized International E.164 target: +{normalizedFullNumber}
              </span>
            </div>

            {/* Pre-filled Message */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono">
                <label htmlFor="message-textarea" className="font-bold text-neutral-800">Pre-filled Chat Message (Optional)</label>
                <span className="text-neutral-400">{message.length} chars</span>
              </div>
              <textarea
                id="message-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the message that users will automatically have in their chat box..."
                rows={4}
                className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono leading-relaxed focus:outline-none"
              />
            </div>

            {/* CTA Button Customization */}
            <div className="pt-3 border-t border-neutral-100 space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-800 uppercase block">
                CTA Button Customizer
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="cta-label-input" className="text-[11px] font-mono text-neutral-500">Button Label</label>
                  <input
                    id="cta-label-input"
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-neutral-500">Theme Style</label>
                  <div className="grid grid-cols-4 gap-1">
                    {(['whatsapp', 'dark', 'gold', 'outline'] as const).map(th => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setButtonTheme(th)}
                        className={`py-2 rounded-lg text-[10px] font-mono font-bold capitalize cursor-pointer transition-all ${
                          buttonTheme === th ? 'bg-[#111111] text-[#D6B46A]' : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: QR Code & Link Output */}
        <div className="lg:col-span-5 space-y-6">
          {/* QR Code Card */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-4 shadow-xs text-center flex flex-col items-center">
            <div className="flex items-center justify-between w-full border-b border-neutral-100 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#A68936]" />
                Scannable WhatsApp QR
              </span>
              <DownloadButton onDownload={handleDownloadQr} label="Download PNG" />
            </div>

            <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs inline-block">
              <canvas ref={qrCanvasRef} className="rounded-lg" />
            </div>

            <p className="text-[11px] font-mono text-neutral-500 max-w-xs">
              Scan with any mobile camera or WhatsApp app to instantly open the chat dialogue.
            </p>
          </div>

          {/* Generated Link Card */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                Official Direct Link
              </span>
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={generatedLink} label="Copy Link" />
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono inline-flex items-center gap-1"
                  title="Test link in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="p-3 bg-neutral-900 text-[#D6B46A] font-mono text-xs rounded-xl break-all">
              {generatedLink}
            </div>
          </div>

          {/* Embeddable HTML Button Snippet */}
          <div className="bg-[#111111] text-[#FFFDF8] border border-neutral-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D6B46A]">
                Embeddable Button HTML
              </span>
              <CopyButton textToCopy={buttonHtml} label="Copy HTML" />
            </div>
            <pre className="p-3 bg-black/50 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 overflow-x-auto selection:bg-[#D6B46A]/30">
              {buttonHtml}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
