import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Share2, Eye, Download, Copy, RefreshCw, Globe, 
  Image as ImageIcon, Check, AlertTriangle, Sparkles, 
  Palette, Smartphone, Monitor, Layers, ArrowRight, ExternalLink
} from 'lucide-react';
import { useCustomUi } from '../../context/CustomUiContext';
import CustomSelect from '../ui/CustomSelect';
import CustomTabs from '../ui/CustomTabs';
import CustomCopyButton from '../ui/CustomCopyButton';
import CustomExportControls from '../ui/CustomExportControls';
import FormField from '../ui/FormField';

interface OgMetadata {
  title: string;
  description: string;
  url: string;
  siteName: string;
  imageUrl: string;
  cardType: 'summary_large_image' | 'summary';
  locale: string;
  brandColor: string;
}

const INITIAL_METADATA: OgMetadata = {
  title: 'SamaXon Digital Solutions | Bespoke Web Engineering in Noida',
  description: 'Bypass wedding and hotel aggregator commissions. We build high-conversion booking engines, interactive banquet calculators, and custom platforms in 48 hours.',
  url: 'https://samaxon.site',
  siteName: 'SamaXon Digital',
  imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=630&fit=crop&q=80',
  cardType: 'summary_large_image',
  locale: 'en_US',
  brandColor: '#D6B46A'
};

export default function OpenGraphPreviewDesigner() {
  const { showToast } = useCustomUi();
  const [meta, setMeta] = useState<OgMetadata>(INITIAL_METADATA);
  const [activePlatform, setActivePlatform] = useState<'twitter' | 'facebook' | 'linkedin' | 'discord' | 'google'>('twitter');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestUrl, setIngestUrl] = useState('');
  const [ingestError, setIngestError] = useState('');

  // Canvas ref for generating custom 1200x630 image
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render canvas banner
  const drawBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1200 x 630 dimensions (standard Open Graph specification)
    canvas.width = 1200;
    canvas.height = 630;

    // Background fill
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative gradient glow
    const grad = ctx.createRadialGradient(1000, 150, 50, 1000, 150, 600);
    grad.addColorStop(0, 'rgba(214, 180, 106, 0.25)');
    grad.addColorStop(1, 'rgba(17, 17, 17, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Border line
    ctx.strokeStyle = '#D6B46A';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 570);

    // Tag Pill
    ctx.fillStyle = '#D6B46A';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((meta.siteName || 'SAMAXON').toUpperCase(), 80, 120);

    // Title text wrapping
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 52px "Syne", "Playfair Display", serif';
    const titleWords = (meta.title || 'Your Title').split(' ');
    let line = '';
    let y = 220;
    for (let n = 0; n < titleWords.length; n++) {
      const testLine = line + titleWords[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 950 && n > 0) {
        ctx.fillText(line, 80, y);
        line = titleWords[n] + ' ';
        y += 65;
        if (y > 380) break;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);

    // Description text wrapping
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '26px "Plus Jakarta Sans", sans-serif';
    const descWords = (meta.description || 'Description').split(' ');
    let descLine = '';
    let descY = y + 70;
    for (let i = 0; i < descWords.length; i++) {
      const test = descLine + descWords[i] + ' ';
      if (ctx.measureText(test).width > 900 && i > 0) {
        ctx.fillText(descLine, 80, descY);
        descLine = descWords[i] + ' ';
        descY += 38;
        if (descY > 520) break;
      } else {
        descLine = test;
      }
    }
    ctx.fillText(descLine, 80, descY);

    // Domain Footer
    ctx.fillStyle = '#D6B46A';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(meta.url.replace(/^https?:\/\//, ''), 80, 560);
  };

  useEffect(() => {
    drawBanner();
  }, [meta]);

  // Handle URL Ingestion
  const handleIngestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingestUrl.trim()) return;

    let target = ingestUrl.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      new URL(target);
    } catch {
      setIngestError('Enter a valid URL starting with https://');
      return;
    }

    setIngestError('');
    setIsIngesting(true);

    try {
      const res = await fetch('/api/tools/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });

      const data = await res.json();
      if (!data.success) {
        setIngestError(data.error || 'Failed to inspect remote website metadata.');
        setIsIngesting(false);
        return;
      }

      const metaFound = data.data?.meta || {};
      setMeta(prev => ({
        ...prev,
        title: metaFound.ogTitle || metaFound.title || prev.title,
        description: metaFound.ogDescription || metaFound.metaDescription || prev.description,
        url: metaFound.canonicalUrl || target,
        imageUrl: metaFound.ogImage || prev.imageUrl,
        siteName: new URL(target).hostname.replace(/^www\./, '')
      }));

      showToast('Extracted existing Open Graph tags from website.', 'success');
    } catch (err) {
      setIngestError('Connection timeout or network error fetching target.');
    } finally {
      setIsIngesting(false);
    }
  };

  // Download generated canvas banner as PNG
  const handleDownloadBanner = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `og-banner-1200x630-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    showToast('Downloaded 1200x630px Open Graph banner PNG.', 'success');
  };

  // Generate HTML Meta tags
  const generatedMetaTagsHtml = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}" />
<meta name="description" content="${meta.description}" />
<link rel="canonical" href="${meta.url}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${meta.url}" />
<meta property="og:site_name" content="${meta.siteName}" />
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="${meta.locale}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="${meta.cardType}" />
<meta name="twitter:url" content="${meta.url}" />
<meta name="twitter:title" content="${meta.title}" />
<meta name="twitter:description" content="${meta.description}" />
<meta name="twitter:image" content="${meta.imageUrl}" />`;
  }, [meta]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in text-neutral-900" id="open-graph-preview-tool">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] text-white border border-[#D6B46A]/30 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B46A]/20 border border-[#D6B46A]/40 text-[#D6B46A] text-xs font-mono font-bold uppercase tracking-wider">
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Sharing & Card Design Engine</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Open Graph Preview Designer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl leading-relaxed">
            Craft, test, and render high-conversion social sharing cards across Twitter/X, Facebook, LinkedIn, Discord, and Google Search. Export pixel-perfect 1200x630px Open Graph banners and production-ready HTML meta tags.
          </p>
        </div>
      </div>

      {/* URL Fetch Ingestion Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D6B46A]" />
            <span>Inspect Existing URL Meta Tags (Optional)</span>
          </h3>
        </div>
        <form onSubmit={handleIngestUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={ingestUrl}
            onChange={(e) => setIngestUrl(e.target.value)}
            placeholder="e.g. https://yourwebsite.com"
            className="flex-1 h-11 px-4 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            disabled={isIngesting}
          />
          <button
            type="submit"
            disabled={isIngesting || !ingestUrl.trim()}
            className="h-11 px-6 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 shadow-md"
          >
            {isIngesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D6B46A]" />
                <span>Reading Tags...</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>Load Live Tags</span>
              </>
            )}
          </button>
        </form>
        {ingestError && (
          <p className="text-xs text-rose-600 font-medium" role="alert">{ingestError}</p>
        )}
      </div>

      {/* Main Designer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Open Graph Parameters
            </h3>
            <p className="text-xs text-neutral-500">Live adjustments immediately refresh previews.</p>
          </div>

          <FormField
            label="Page / Open Graph Title"
            required
            description={`Recommended under 60 characters (${meta.title.length}/60)`}
          >
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full h-10 px-3.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField
            label="Meta Description"
            required
            description={`Recommended 120–160 characters (${meta.description.length}/160)`}
          >
            <textarea
              rows={3}
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="w-full p-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <FormField
            label="Canonical URL"
            required
          >
            <input
              type="text"
              value={meta.url}
              onChange={(e) => setMeta({ ...meta, url: e.target.value })}
              className="w-full h-10 px-3.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Site Name">
              <input
                type="text"
                value={meta.siteName}
                onChange={(e) => setMeta({ ...meta, siteName: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
              />
            </FormField>

            <CustomSelect
              label="Twitter Card Type"
              value={meta.cardType}
              onChange={(v) => setMeta({ ...meta, cardType: v as any })}
              options={[
                { value: 'summary_large_image', label: 'Large Image (1200x630)' },
                { value: 'summary', label: 'Small Thumbnail' }
              ]}
            />
          </div>

          <FormField
            label="Card Image URL (og:image)"
            description="Use a direct URL or generate with our canvas generator below."
          >
            <input
              type="text"
              value={meta.imageUrl}
              onChange={(e) => setMeta({ ...meta, imageUrl: e.target.value })}
              className="w-full h-10 px-3.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D6B46A]"
            />
          </FormField>
        </div>

        {/* Right Area: Previews & Canvas Generator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#D6B46A]" />
                <span>Live Feed Unfurl Simulation</span>
              </h3>
            </div>

            {/* Platform Selector */}
            <CustomTabs
              tabs={[
                { id: 'twitter', label: 'Twitter / X' },
                { id: 'facebook', label: 'Facebook / Meta' },
                { id: 'linkedin', label: 'LinkedIn' },
                { id: 'discord', label: 'Discord' },
                { id: 'google', label: 'Google Search' }
              ]}
              activeTab={activePlatform}
              onChange={(p) => setActivePlatform(p as any)}
            />

            {/* Twitter / X Mock */}
            {activePlatform === 'twitter' && (
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2 animate-fade-in max-w-lg mx-auto">
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                  <div className="aspect-[1.91/1] w-full bg-neutral-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={meta.imageUrl} 
                      alt={meta.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded text-[10px] font-mono">
                      {meta.siteName}
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50">
                    <span className="text-[11px] text-neutral-500 font-mono block truncate">
                      {meta.url.replace(/^https?:\/\//, '')}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1 mt-0.5">
                      {meta.title}
                    </h5>
                    <p className="text-[11.5px] text-neutral-600 line-clamp-2 mt-0.5">
                      {meta.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Facebook Mock */}
            {activePlatform === 'facebook' && (
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2 animate-fade-in max-w-lg mx-auto">
                <div className="border border-neutral-200 bg-neutral-50 overflow-hidden">
                  <div className="aspect-[1.91/1] w-full bg-neutral-900">
                    <img 
                      src={meta.imageUrl} 
                      alt={meta.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3 border-t border-neutral-200">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                      {meta.siteName.toUpperCase()}
                    </span>
                    <h5 className="font-bold text-sm text-neutral-900 mt-0.5 line-clamp-1">
                      {meta.title}
                    </h5>
                    <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5">
                      {meta.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn Mock */}
            {activePlatform === 'linkedin' && (
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-2 animate-fade-in max-w-lg mx-auto">
                <div className="border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                  <div className="aspect-[1.91/1] w-full bg-neutral-900">
                    <img 
                      src={meta.imageUrl} 
                      alt={meta.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-3">
                    <h5 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                      {meta.title}
                    </h5>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-1">
                      {meta.url.replace(/^https?:\/\//, '').split('/')[0]} &bull; 1 min read
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Discord Mock */}
            {activePlatform === 'discord' && (
              <div className="p-4 bg-[#313338] text-white rounded-2xl shadow-xs space-y-2 animate-fade-in max-w-lg mx-auto">
                <div className="border-l-4 border-[#D6B46A] pl-3 py-1 space-y-1.5 bg-[#2B2D31] p-3 rounded-r-lg">
                  <span className="text-[11px] font-bold text-neutral-300 block">{meta.siteName}</span>
                  <h5 className="text-sm font-bold text-[#00A8FC] hover:underline cursor-pointer">
                    {meta.title}
                  </h5>
                  <p className="text-xs text-neutral-300 line-clamp-3">
                    {meta.description}
                  </p>
                  <div className="mt-2 rounded-lg overflow-hidden max-w-sm aspect-[1.91/1]">
                    <img src={meta.imageUrl} alt={meta.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* Google Search Mock */}
            {activePlatform === 'google' && (
              <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-1 animate-fade-in max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-700">
                    S
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-800 font-medium">{meta.siteName}</span>
                    <span className="block text-[10px] text-neutral-400 font-mono">{meta.url}</span>
                  </div>
                </div>
                <h5 className="text-base text-[#1a0dab] hover:underline cursor-pointer font-medium pt-1 line-clamp-1">
                  {meta.title}
                </h5>
                <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 pt-0.5">
                  {meta.description}
                </p>
              </div>
            )}
          </div>

          {/* Canvas Dynamic Generator Box */}
          <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-display text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Automated 1200x630 Open Graph Banner Render
                </h4>
                <p className="text-xs text-neutral-500">Rendered dynamically with high-resolution HTML5 Canvas.</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBanner}
                className="px-4 py-2 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-inner">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Code Export Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-display text-base font-bold text-neutral-900">
              HTML Open Graph & Twitter Card Meta Tags
            </h4>
            <p className="text-xs text-neutral-500">
              Paste these tags into your HTML &lt;head&gt; container.
            </p>
          </div>
          <CustomCopyButton text={generatedMetaTagsHtml} label="Copy HTML Tags" />
        </div>

        <pre className="p-4 rounded-2xl bg-neutral-900 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed">
          {generatedMetaTagsHtml}
        </pre>
      </div>
    </div>
  );
}
