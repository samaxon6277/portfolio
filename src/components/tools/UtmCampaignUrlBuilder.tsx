import React, { useState, useMemo } from 'react';
import { 
  Link2, Copy, Download, Trash2, Check, AlertCircle, AlertTriangle, 
  Sparkles, ArrowRight, ShieldCheck, HelpCircle, ExternalLink, QrCode, 
  Share2, CheckCircle2, RefreshCw, Wand2, Layers, Sliders, FileText, Globe
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomUi } from '../../context/CustomUiContext';

export interface UtmParams {
  websiteUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
  id: string;
}

const INITIAL_PARAMS: UtmParams = {
  websiteUrl: '',
  source: '',
  medium: '',
  campaign: '',
  term: '',
  content: '',
  id: ''
};

const SAMPLE_DATA: UtmParams = {
  websiteUrl: 'https://samaxon.site/pricing',
  source: 'newsletter',
  medium: 'email',
  campaign: 'spring_upgrade_2026',
  term: 'high_performance_website',
  content: 'primary_hero_cta',
  id: 'q1_promo_01'
};

interface PresetConfig {
  name: string;
  label: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

const CAMPAIGN_PRESETS: PresetConfig[] = [
  {
    name: 'Google Ads (Search / CPC)',
    label: 'Google Ads',
    source: 'google',
    medium: 'cpc',
    campaign: 'brand_search_2026',
    term: 'custom_web_design'
  },
  {
    name: 'Meta / Facebook Ads',
    label: 'Meta / FB',
    source: 'facebook',
    medium: 'cpc',
    campaign: 'retargeting_q1',
    content: 'carousel_ad_v2'
  },
  {
    name: 'LinkedIn Sponsored',
    label: 'LinkedIn',
    source: 'linkedin',
    medium: 'cpc',
    campaign: 'b2b_executive_outreach',
    content: 'thought_leadership_post'
  },
  {
    name: 'Email Newsletter',
    label: 'Newsletter',
    source: 'newsletter',
    medium: 'email',
    campaign: 'monthly_digest_apr2026',
    content: 'hero_featured_link'
  },
  {
    name: 'YouTube Video Link',
    label: 'YouTube',
    source: 'youtube',
    medium: 'social',
    campaign: 'case_study_walkthrough',
    content: 'video_description_link'
  },
  {
    name: 'Offline QR Code / Print',
    label: 'Print QR',
    source: 'offline_print',
    medium: 'qr',
    campaign: 'event_brochure_2026',
    content: 'back_cover_qr'
  }
];

const SOURCE_SUGGESTIONS = ['google', 'facebook', 'instagram', 'linkedin', 'twitter', 'youtube', 'newsletter', 'bing', 'partner'];
const MEDIUM_SUGGESTIONS = ['cpc', 'email', 'social', 'organic', 'referral', 'display', 'affiliate', 'qr', 'video'];

type SpaceReplacement = 'underscore' | 'hyphen' | 'plus' | 'percent';

export default function UtmCampaignUrlBuilder() {
  const { showToast, showConfirm } = useCustomUi();
  const navigate = useNavigate();

  const [params, setParams] = useState<UtmParams>(INITIAL_PARAMS);
  const [existingUtmAction, setExistingUtmAction] = useState<'replace' | 'preserve'>('replace');
  const [autoLowercase, setAutoLowercase] = useState<boolean>(true);
  const [spaceStyle, setSpaceStyle] = useState<SpaceReplacement>('underscore');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [copiedParams, setCopiedParams] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Clean / sanitize parameter value based on user settings
  const sanitizeValue = (val: string): string => {
    let result = val.trim();
    if (autoLowercase) {
      result = result.toLowerCase();
    }
    if (spaceStyle === 'underscore') {
      result = result.replace(/\s+/g, '_');
    } else if (spaceStyle === 'hyphen') {
      result = result.replace(/\s+/g, '-');
    } else if (spaceStyle === 'plus') {
      result = result.replace(/\s+/g, '+');
    }
    return result;
  };

  // Helper to handle field change
  const handleChange = (field: keyof UtmParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof UtmParams) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Check if any field has spaces or uppercase
  const qualityNotice = useMemo(() => {
    const fieldsWithSpaces: string[] = [];
    const fieldsWithUppercase: string[] = [];

    const checkFields: Array<{ key: keyof UtmParams; label: string }> = [
      { key: 'source', label: 'Source' },
      { key: 'medium', label: 'Medium' },
      { key: 'campaign', label: 'Campaign' },
      { key: 'term', label: 'Term' },
      { key: 'content', label: 'Content' },
      { key: 'id', label: 'Campaign ID' }
    ];

    checkFields.forEach(({ key, label }) => {
      const val = params[key];
      if (val && /\s/.test(val)) {
        fieldsWithSpaces.push(label);
      }
      if (val && /[A-Z]/.test(val)) {
        fieldsWithUppercase.push(label);
      }
    });

    return {
      hasSpaces: fieldsWithSpaces.length > 0,
      fieldsWithSpaces,
      hasUppercase: fieldsWithUppercase.length > 0,
      fieldsWithUppercase
    };
  }, [params]);

  // Sanitize all fields in place
  const handleAutoSanitizeAll = () => {
    setParams(prev => ({
      ...prev,
      source: sanitizeValue(prev.source),
      medium: sanitizeValue(prev.medium),
      campaign: sanitizeValue(prev.campaign),
      term: sanitizeValue(prev.term),
      content: sanitizeValue(prev.content),
      id: sanitizeValue(prev.id)
    }));
    showToast('Applied lowercase and space sanitization across all UTM fields', 'success');
  };

  // Inspect base URL for existing query strings and UTM parameters
  const existingUtmDetection = useMemo(() => {
    const raw = params.websiteUrl.trim();
    if (!raw) return { detected: false, keys: [], otherParams: [] };

    try {
      const urlObj = new URL(raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`);
      const detectedKeys: string[] = [];
      const otherParams: string[] = [];

      urlObj.searchParams.forEach((_, key) => {
        if (['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'].includes(key.toLowerCase())) {
          detectedKeys.push(key);
        } else {
          otherParams.push(key);
        }
      });

      return {
        detected: detectedKeys.length > 0,
        keys: detectedKeys,
        otherParams
      };
    } catch {
      return { detected: false, keys: [], otherParams: [] };
    }
  }, [params.websiteUrl]);

  // Comprehensive URL Construction & Validation
  const generatedResult = useMemo(() => {
    const rawUrl = params.websiteUrl.trim();
    if (!rawUrl) {
      return {
        url: '',
        queryString: '',
        isValidUrl: false,
        incomplete: true,
        missingFields: ['Website URL', 'Campaign Source (utm_source)', 'Campaign Medium (utm_medium)', 'Campaign Name (utm_campaign)'],
        error: 'Base website URL is required'
      };
    }

    let urlObj: URL;
    try {
      const formattedUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
        ? rawUrl 
        : `https://${rawUrl}`;
      urlObj = new URL(formattedUrl);

      // Verify domain has valid structure (e.g. at least one dot or localhost)
      if (!urlObj.hostname.includes('.') && urlObj.hostname !== 'localhost') {
        return {
          url: '',
          queryString: '',
          isValidUrl: false,
          incomplete: true,
          error: 'Please enter a valid domain name (e.g. yourdomain.com)'
        };
      }
    } catch {
      return {
        url: '',
        queryString: '',
        isValidUrl: false,
        incomplete: true,
        error: 'Please enter a valid website URL (e.g. https://example.com)'
      };
    }

    // Required fields check
    const cleanSource = sanitizeValue(params.source);
    const cleanMedium = sanitizeValue(params.medium);
    const cleanCampaign = sanitizeValue(params.campaign);
    const cleanTerm = sanitizeValue(params.term);
    const cleanContent = sanitizeValue(params.content);
    const cleanId = sanitizeValue(params.id);

    const hasSource = Boolean(cleanSource);
    const hasMedium = Boolean(cleanMedium);
    const hasCampaign = Boolean(cleanCampaign);

    const missingFields: string[] = [];
    if (!hasSource) missingFields.push('Campaign Source (utm_source)');
    if (!hasMedium) missingFields.push('Campaign Medium (utm_medium)');
    if (!hasCampaign) missingFields.push('Campaign Name (utm_campaign)');

    if (!hasSource || !hasMedium || !hasCampaign) {
      return {
        url: '',
        queryString: '',
        isValidUrl: true,
        incomplete: true,
        missingFields,
        baseUrl: `${urlObj.origin}${urlObj.pathname}`,
        hash: urlObj.hash
      };
    }

    // Clone search params to avoid mutating original
    const searchParams = new URLSearchParams(urlObj.search);

    // If replace mode, remove existing UTM keys first
    if (existingUtmAction === 'replace') {
      searchParams.delete('utm_source');
      searchParams.delete('utm_medium');
      searchParams.delete('utm_campaign');
      searchParams.delete('utm_term');
      searchParams.delete('utm_content');
      searchParams.delete('utm_id');
    }

    // Append new UTM parameters (URLSearchParams automatically handles standard RFC 3986 encoding)
    if (cleanSource && (existingUtmAction === 'replace' || !searchParams.has('utm_source'))) {
      searchParams.set('utm_source', cleanSource);
    }
    if (cleanMedium && (existingUtmAction === 'replace' || !searchParams.has('utm_medium'))) {
      searchParams.set('utm_medium', cleanMedium);
    }
    if (cleanCampaign && (existingUtmAction === 'replace' || !searchParams.has('utm_campaign'))) {
      searchParams.set('utm_campaign', cleanCampaign);
    }
    if (cleanId && (existingUtmAction === 'replace' || !searchParams.has('utm_id'))) {
      searchParams.set('utm_id', cleanId);
    }
    if (cleanTerm && (existingUtmAction === 'replace' || !searchParams.has('utm_term'))) {
      searchParams.set('utm_term', cleanTerm);
    }
    if (cleanContent && (existingUtmAction === 'replace' || !searchParams.has('utm_content'))) {
      searchParams.set('utm_content', cleanContent);
    }

    // Construct final URL preserving origin, pathname, new query, and existing hash fragment
    const queryString = searchParams.toString();
    const finalUrl = `${urlObj.origin}${urlObj.pathname}${queryString ? `?${queryString}` : ''}${urlObj.hash}`;

    return {
      url: finalUrl,
      isValidUrl: true,
      incomplete: false,
      baseUrl: `${urlObj.origin}${urlObj.pathname}`,
      queryString,
      hash: urlObj.hash,
      cleanParams: {
        source: cleanSource,
        medium: cleanMedium,
        campaign: cleanCampaign,
        term: cleanTerm,
        content: cleanContent,
        id: cleanId
      }
    };
  }, [params, existingUtmAction, autoLowercase, spaceStyle]);

  // Copy full URL to clipboard
  const handleCopyUrl = async () => {
    if (!generatedResult.url) {
      showToast('Please fill in required fields to generate a complete URL', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedResult.url);
      setCopiedUrl(true);
      showToast('Complete Campaign URL copied to clipboard!', 'success');
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  // Copy parameters only (e.g. ?utm_source=...)
  const handleCopyParamsOnly = async () => {
    if (!generatedResult.queryString) {
      showToast('No query parameters generated yet', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(`?${generatedResult.queryString}`);
      setCopiedParams(true);
      showToast('UTM parameter string copied to clipboard!', 'success');
      setTimeout(() => setCopiedParams(false), 2500);
    } catch {
      showToast('Failed to copy parameters', 'error');
    }
  };

  // Download TXT Report
  const handleDownloadReport = () => {
    if (!generatedResult.url) return;
    const content = [
      '==================================================',
      'SAMAXON UTM CAMPAIGN URL REPORT',
      '==================================================',
      `Generated Date:    ${new Date().toLocaleString()}`,
      `Final Campaign URL: ${generatedResult.url}`,
      '',
      '--- Campaign Breakdown ---',
      `Website Base:      ${params.websiteUrl}`,
      `Campaign Source:   ${params.source}`,
      `Campaign Medium:   ${params.medium}`,
      `Campaign Name:     ${params.campaign}`,
      `Campaign Term:     ${params.term || '(none)'}`,
      `Campaign Content:  ${params.content || '(none)'}`,
      `Campaign ID:       ${params.id || '(none)'}`,
      '',
      '--- Query String Only ---',
      `?${generatedResult.queryString}`,
      '',
      'Attribution Rules: RFC 3986 Standard · 100% Client-Side via SamaXon Studio'
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `utm-${params.campaign || 'campaign'}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Campaign report downloaded', 'success');
  };

  // Reset form
  const handleReset = () => {
    const isDirty = Object.values(params).some(v => Boolean(v.trim()));
    if (!isDirty) return;

    showConfirm({
      title: 'Reset Campaign Builder',
      message: 'Are you sure you want to clear all UTM campaign fields?',
      confirmText: 'Yes, Reset',
      cancelText: 'Cancel',
      onConfirm: () => {
        setParams(INITIAL_PARAMS);
        setTouched({});
        showToast('All fields reset', 'info');
      }
    });
  };

  // Load Example
  const handleLoadExample = () => {
    setParams(SAMPLE_DATA);
    setTouched({
      websiteUrl: true,
      source: true,
      medium: true,
      campaign: true
    });
    showToast('Sample campaign parameters loaded', 'info');
  };

  // Apply Preset
  const handleApplyPreset = (preset: PresetConfig) => {
    setParams(prev => ({
      ...prev,
      source: preset.source,
      medium: preset.medium,
      campaign: preset.campaign,
      term: preset.term || '',
      content: preset.content || ''
    }));
    setTouched(prev => ({
      ...prev,
      source: true,
      medium: true,
      campaign: true
    }));
    showToast(`Applied preset: ${preset.name}`, 'info');
  };

  return (
    <div className="space-y-12 text-left" id="utm-campaign-url-builder-tool">
      {/* Header & Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-[#111111] text-[#D6B46A] text-xs font-mono uppercase tracking-wider font-bold rounded-md">
            MARKETING & ATTRIBUTION LABS
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D6B46A]/15 text-[#A68936] text-[11px] font-mono font-bold rounded-md border border-[#D6B46A]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A68936]" />
            100% Client-Side · Local Validation
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#111111] tracking-tight">
          UTM Campaign URL Builder
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
          Input your destination URL, source, medium, and campaign details to generate an RFC 3986 encoded URL with real-time local validation, collision protection, and Google Analytics 4 (GA4) standards.
        </p>
      </div>

      {/* Quick Channel Presets Bar */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-neutral-900 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A68936]" />
            One-Click Channel Presets
          </span>
          <span className="text-[11px] font-mono text-neutral-500">Auto-fills standard Source & Medium</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {CAMPAIGN_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 bg-white hover:bg-neutral-50 border border-[#D6B46A]/30 hover:border-[#A68936] text-neutral-800 text-xs font-mono font-medium rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <span>{preset.label}</span>
              <span className="text-[10px] text-[#A68936] font-mono">({preset.medium})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Form Card */}
      <div className="bg-white border border-[#D6B46A]/30 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
        {/* Top Action & Options Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#A68936]" />
            <span className="text-xs font-mono font-bold text-neutral-900 uppercase">
              Campaign Parameters Input
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Auto Lowercase Toggle */}
            <button
              type="button"
              onClick={() => setAutoLowercase(!autoLowercase)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
                autoLowercase 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-neutral-50 text-neutral-500 border-neutral-200'
              }`}
              title="Ensure all UTM parameters are converted to lowercase for clean analytics grouping"
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${autoLowercase ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span>Auto-Lowercase: {autoLowercase ? 'ON' : 'OFF'}</span>
            </button>

            {/* Load Example Button */}
            <button
              type="button"
              onClick={handleLoadExample}
              className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F9F5EC] border border-[#D6B46A]/30 text-[#A68936] text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Load Example</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Reset All Fields"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Local Validation Quality Warnings Banner */}
        {(qualityNotice.hasSpaces || qualityNotice.hasUppercase) && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Attribution Quality Tip:</p>
                <p className="text-amber-800 leading-relaxed">
                  {qualityNotice.hasSpaces && `Spaces detected in: ${qualityNotice.fieldsWithSpaces.join(', ')}. `}
                  {qualityNotice.hasUppercase && !autoLowercase && `Uppercase letters detected in: ${qualityNotice.fieldsWithUppercase.join(', ')}. `}
                  Google Analytics considers different cases as separate channels.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoSanitizeAll}
              className="px-3 py-1.5 bg-[#111111] hover:bg-[#222222] text-[#D6B46A] text-xs font-mono font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              Auto-Format Parameters
            </button>
          </div>
        )}

        {/* Existing UTM Collision Banner */}
        {existingUtmDetection.detected && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-900">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1 w-full">
                <p className="font-bold">
                  Existing UTM Parameters Detected in Base URL:
                </p>
                <p className="text-amber-800">
                  The URL already contains: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">{existingUtmDetection.keys.join(', ')}</code>. Choose how you want to handle these collisions:
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="utm_collision_action"
                      checked={existingUtmAction === 'replace'}
                      onChange={() => setExistingUtmAction('replace')}
                      className="accent-[#A68936]"
                    />
                    <span>Replace Existing (Recommended)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-800">
                    <input
                      type="radio"
                      name="utm_collision_action"
                      checked={existingUtmAction === 'preserve'}
                      onChange={() => setExistingUtmAction('preserve')}
                      className="accent-[#A68936]"
                    />
                    <span>Preserve Existing</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Inputs Grid */}
        <div className="space-y-6">
          {/* Base Website URL (Full width) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#A68936]" />
                <span>Website URL</span>
                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-mono rounded font-bold">Required</span>
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">e.g. https://yourdomain.com/landing-page</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={params.websiteUrl}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
                onBlur={() => handleBlur('websiteUrl')}
                placeholder="https://samaxon.site/pricing"
                className={`w-full px-4 py-3 text-xs sm:text-sm font-mono bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                  touched.websiteUrl && (!params.websiteUrl.trim() || generatedResult.error)
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-neutral-200 focus:border-[#A68936]'
                }`}
              />
            </div>

            {touched.websiteUrl && !params.websiteUrl.trim() && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Website URL is required to construct the campaign destination.
              </p>
            )}

            {touched.websiteUrl && params.websiteUrl.trim() && generatedResult.error && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {generatedResult.error}
              </p>
            )}
          </div>

          {/* Core Required UTM Parameters (3-col Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Campaign Source */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Campaign Source</span>
                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-mono rounded font-bold">Required</span>
                </label>
                <code className="text-[10px] text-neutral-400">utm_source</code>
              </div>

              <input
                type="text"
                value={params.source}
                onChange={(e) => handleChange('source', e.target.value)}
                onBlur={() => handleBlur('source')}
                placeholder="google, newsletter, linkedin"
                className={`w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                  touched.source && !params.source.trim()
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-neutral-200 focus:border-[#A68936]'
                }`}
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] text-neutral-400 font-mono">Quick:</span>
                {SOURCE_SUGGESTIONS.slice(0, 5).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChange('source', s)}
                    className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-mono rounded cursor-pointer transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-neutral-500 leading-tight">
                Identifies the search engine, newsletter, or referring site.
              </p>
            </div>

            {/* Campaign Medium */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Campaign Medium</span>
                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-mono rounded font-bold">Required</span>
                </label>
                <code className="text-[10px] text-neutral-400">utm_medium</code>
              </div>

              <input
                type="text"
                value={params.medium}
                onChange={(e) => handleChange('medium', e.target.value)}
                onBlur={() => handleBlur('medium')}
                placeholder="cpc, email, social, referral"
                className={`w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                  touched.medium && !params.medium.trim()
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-neutral-200 focus:border-[#A68936]'
                }`}
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1 pt-1">
                <span className="text-[10px] text-neutral-400 font-mono">Quick:</span>
                {MEDIUM_SUGGESTIONS.slice(0, 5).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleChange('medium', m)}
                    className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-mono rounded cursor-pointer transition-colors"
                  >
                    {m}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-neutral-500 leading-tight">
                Marketing channel (e.g. cpc, email, social, display, qr).
              </p>
            </div>

            {/* Campaign Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Campaign Name</span>
                  <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-mono rounded font-bold">Required</span>
                </label>
                <code className="text-[10px] text-neutral-400">utm_campaign</code>
              </div>

              <input
                type="text"
                value={params.campaign}
                onChange={(e) => handleChange('campaign', e.target.value)}
                onBlur={() => handleBlur('campaign')}
                placeholder="spring_sale, launch_2026, webinar_q1"
                className={`w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border rounded-xl focus:outline-none focus:bg-white transition-colors ${
                  touched.campaign && !params.campaign.trim()
                    ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                    : 'border-neutral-200 focus:border-[#A68936]'
                }`}
              />

              <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                <span>Spaces replaced with:</span>
                <select
                  value={spaceStyle}
                  onChange={(e) => setSpaceStyle(e.target.value as SpaceReplacement)}
                  className="bg-neutral-100 border border-neutral-200 rounded px-1.5 py-0.5 text-[10px] font-mono focus:outline-none"
                >
                  <option value="underscore">_ (Underscore)</option>
                  <option value="hyphen">- (Hyphen)</option>
                  <option value="plus">+ (Plus)</option>
                  <option value="percent">%20 (Percent)</option>
                </select>
              </div>

              <p className="text-[11px] text-neutral-500 leading-tight">
                The specific product slogan, promo name, or campaign theme.
              </p>
            </div>
          </div>

          {/* Optional Parameters (3-col Grid: ID, Term, Content) */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-mono font-bold text-neutral-700 uppercase">
                Optional Parameters (GA4 & Paid Search)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Campaign ID */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <span>Campaign ID</span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-mono rounded">Optional</span>
                  </label>
                  <code className="text-[10px] text-neutral-400">utm_id</code>
                </div>
                <input
                  type="text"
                  value={params.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  placeholder="e.g. 984210 or q1_promo"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] focus:bg-white transition-colors"
                />
                <p className="text-[11px] text-neutral-500 leading-tight">
                  GA4 campaign identifier for importing custom advertising data.
                </p>
              </div>

              {/* Campaign Term */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <span>Campaign Term</span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-mono rounded">Optional</span>
                  </label>
                  <code className="text-[10px] text-neutral-400">utm_term</code>
                </div>
                <input
                  type="text"
                  value={params.term}
                  onChange={(e) => handleChange('term', e.target.value)}
                  placeholder="e.g. web_agency or seo_audit"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] focus:bg-white transition-colors"
                />
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Identifies paid search keywords or audience targets.
                </p>
              </div>

              {/* Campaign Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <span>Campaign Content</span>
                    <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-mono rounded">Optional</span>
                  </label>
                  <code className="text-[10px] text-neutral-400">utm_content</code>
                </div>
                <input
                  type="text"
                  value={params.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="e.g. hero_cta vs sidebar_link"
                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#A68936] focus:bg-white transition-colors"
                />
                <p className="text-[11px] text-neutral-500 leading-tight">
                  Differentiates identical links on the same page for A/B testing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Validation Status Matrix */}
        <div className="pt-4 border-t border-neutral-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
              generatedResult.isValidUrl 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${generatedResult.isValidUrl ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <div className="truncate">
                <span className="block font-bold">Base URL</span>
                <span className="text-[10px] opacity-80">{generatedResult.isValidUrl ? 'Valid Protocol & Host' : 'Awaiting Valid URL'}</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
              !generatedResult.incomplete 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${!generatedResult.incomplete ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <div className="truncate">
                <span className="block font-bold">Core UTM Tags</span>
                <span className="text-[10px] opacity-80">{!generatedResult.incomplete ? 'Source/Medium/Campaign' : 'Required Fields Incomplete'}</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
              !qualityNotice.hasSpaces 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50/70 border-amber-200 text-amber-800'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${!qualityNotice.hasSpaces ? 'text-emerald-600' : 'text-amber-500'}`} />
              <div className="truncate">
                <span className="block font-bold">Space Formatting</span>
                <span className="text-[10px] opacity-80">{!qualityNotice.hasSpaces ? 'Clean Formatting' : 'Spaces Formatted'}</span>
              </div>
            </div>

            <div className={`p-3 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
              generatedResult.url 
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-500'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${generatedResult.url ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <div className="truncate">
                <span className="block font-bold">RFC 3986 Encoding</span>
                <span className="text-[10px] opacity-80">{generatedResult.url ? 'Properly Escaped' : 'Awaiting Input'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Generated URL Output Box */}
        <div className="space-y-3 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A68936]" />
              Generated Encoded Campaign URL
            </span>

            {generatedResult.url && (
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✦ Ready for Distribution
              </span>
            )}
          </div>

          {generatedResult.url ? (
            <div className="p-5 bg-[#111111] rounded-2xl border border-neutral-800 space-y-4 shadow-sm">
              {/* Formatted Code Block with Syntax Differentiation */}
              <div className="font-mono text-xs sm:text-sm text-neutral-100 break-all leading-relaxed p-3 bg-neutral-900/90 rounded-xl border border-neutral-800 select-all">
                <span className="text-neutral-300">{generatedResult.baseUrl}</span>
                <span className="text-[#D6B46A] font-bold">?{generatedResult.queryString}</span>
                {generatedResult.hash && (
                  <span className="text-amber-400 font-bold">{generatedResult.hash}</span>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                  <span>Length: <strong className="text-white">{generatedResult.url.length}</strong> chars</span>
                  <span className="text-neutral-600">·</span>
                  <span className={generatedResult.url.length > 2000 ? 'text-amber-400' : 'text-emerald-400'}>
                    {generatedResult.url.length > 2000 ? 'Length Warning (>2000)' : 'Safe Length'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Test Link in new tab */}
                  <a
                    href={generatedResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>

                  {/* Copy Query String Only */}
                  <button
                    type="button"
                    onClick={handleCopyParamsOnly}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy only the '?utm_source=...' parameters (useful for CMS fields or ad managers)"
                  >
                    {copiedParams ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5 text-neutral-400" />}
                    <span>{copiedParams ? 'Copied Params!' : 'Params Only'}</span>
                  </button>

                  {/* Create QR Code */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/tools/qr-generator?text=${encodeURIComponent(generatedResult.url)}`);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Open in QR Code Generator"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#D6B46A]" />
                    <span>Create QR</span>
                  </button>

                  {/* Download Report */}
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors cursor-pointer"
                    title="Download URL Text Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Primary 1-Click Copy Full URL */}
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-4 py-2 bg-[#D6B46A] hover:bg-[#c4a159] text-[#111111] text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied Full URL!' : 'Copy Full URL'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl text-center space-y-2">
              <p className="text-xs font-mono text-neutral-600">
                Enter your Website URL, Campaign Source, Medium, and Campaign Name above to generate your tracked destination URL.
              </p>
              {generatedResult.incomplete && (
                <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                  {generatedResult.missingFields?.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono rounded">
                      Required: {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Parameter Breakdown Matrix Table */}
      {generatedResult.url && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-neutral-900 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A68936]" />
              Parameter Breakdown & GA4 Attribution Mapping
            </h3>
            <span className="text-[11px] font-mono text-neutral-500">RFC 3986 Standard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="pb-2 font-bold">Parameter</th>
                  <th className="pb-2 font-bold">Key</th>
                  <th className="pb-2 font-bold">Sanitized Value</th>
                  <th className="pb-2 font-bold">Role in GA4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Website URL</td>
                  <td className="py-2.5 text-neutral-400">—</td>
                  <td className="py-2.5 text-[#111111] font-semibold break-all">{generatedResult.baseUrl}</td>
                  <td className="py-2.5 text-neutral-600">Target landing page destination</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Source</td>
                  <td className="py-2.5 text-[#A68936]">utm_source</td>
                  <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.source}</td>
                  <td className="py-2.5 text-neutral-600">Traffic origin (referrer/platform)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Medium</td>
                  <td className="py-2.5 text-[#A68936]">utm_medium</td>
                  <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.medium}</td>
                  <td className="py-2.5 text-neutral-600">Marketing medium / channel grouping</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">Campaign</td>
                  <td className="py-2.5 text-[#A68936]">utm_campaign</td>
                  <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.campaign}</td>
                  <td className="py-2.5 text-neutral-600">Promotion or product name</td>
                </tr>
                {generatedResult.cleanParams?.id && (
                  <tr>
                    <td className="py-2.5 font-bold text-neutral-900">Campaign ID</td>
                    <td className="py-2.5 text-[#A68936]">utm_id</td>
                    <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.id}</td>
                    <td className="py-2.5 text-neutral-600">Custom ad data mapping ID</td>
                  </tr>
                )}
                {generatedResult.cleanParams?.term && (
                  <tr>
                    <td className="py-2.5 font-bold text-neutral-900">Term</td>
                    <td className="py-2.5 text-[#A68936]">utm_term</td>
                    <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.term}</td>
                    <td className="py-2.5 text-neutral-600">Paid search keyword targeting</td>
                  </tr>
                )}
                {generatedResult.cleanParams?.content && (
                  <tr>
                    <td className="py-2.5 font-bold text-neutral-900">Content</td>
                    <td className="py-2.5 text-[#A68936]">utm_content</td>
                    <td className="py-2.5 text-neutral-800 break-all">{generatedResult.cleanParams?.content}</td>
                    <td className="py-2.5 text-neutral-600">Link / creative variation for A/B testing</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recommended Naming Conventions Guide */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wide flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#A68936]" />
          Best Practices & Recommended Naming Rules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-600">
          <div className="p-3.5 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-mono font-bold text-neutral-900 block">1. Lowercase Always</span>
            <p className="text-neutral-500 leading-relaxed">
              Analytics platforms treat <code>Email</code>, <code>email</code>, and <code>EMAIL</code> as 3 separate channels. Always use lowercase.
            </p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-mono font-bold text-neutral-900 block">2. Underscores / Hyphens</span>
            <p className="text-neutral-500 leading-relaxed">
              Avoid spaces or special symbols. Use underscores (<code>summer_launch</code>) or hyphens (<code>summer-launch</code>) for clean URLs.
            </p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-mono font-bold text-neutral-900 block">3. Never Include PII</span>
            <p className="text-neutral-500 leading-relaxed">
              Never put customer emails, phone numbers, or names into UTM tags. This breaches Google Analytics Terms of Service.
            </p>
          </div>
          <div className="p-3.5 bg-neutral-50 rounded-xl space-y-1">
            <span className="font-mono font-bold text-neutral-900 block">4. Stay Consistent</span>
            <p className="text-neutral-500 leading-relaxed">
              Standardize mediums across your team: always use <code>cpc</code> instead of mixing with <code>paid-search</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-[#111111] font-mono">Frequently Asked Questions</h3>
        <div className="space-y-4 text-xs text-neutral-700">
          <div>
            <p className="font-bold text-neutral-900">What are UTM parameters?</p>
            <p className="text-neutral-600 mt-1 leading-relaxed">
              UTM (Urchin Tracking Module) parameters are standardized key-value tags appended to the end of a URL. When someone clicks your link, Google Analytics (GA4) and other attribution platforms read these tags to pinpoint traffic sources, mediums, and specific campaign return on investment.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">What happens if my destination URL already has query parameters?</p>
            <p className="text-neutral-600 mt-1 leading-relaxed">
              Our builder automatically detects existing query parameters. It correctly merges with an ampersand (<code>&</code>) rather than generating duplicate question marks (<code>?</code>), safeguarding your destination page's internal parameters.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Where should URL hash fragments (#anchor) go?</p>
            <p className="text-neutral-600 mt-1 leading-relaxed">
              Per RFC 3986 standards, hash fragments must always come at the very end of the URL after the query string. Our builder automatically preserves any existing hash fragment and places it at the end of the constructed link.
            </p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">Is my data sent to any external server?</p>
            <p className="text-neutral-600 mt-1 leading-relaxed">
              No. All URL validation, parameter construction, and encoding are performed 100% locally in your web browser. None of your marketing links or campaign strategies are ever sent to an external server.
            </p>
          </div>
        </div>
      </div>

      {/* Related Tools Recommendations */}
      <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-mono text-[#A68936] font-bold uppercase tracking-wider">Related Marketing Tools</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <Link
            to="/tools/qr-generator"
            className="p-3.5 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>QR Code Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Convert your tracked campaign URL into a high-res vector QR code.</p>
          </Link>

          <Link
            to="/tools/canonical-url-validator"
            className="p-3.5 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Canonical URL Validator</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Verify tracking query parameters do not dilute canonical SEO ranking.</p>
          </Link>

          <Link
            to="/tools/open-graph-preview-designer"
            className="p-3.5 bg-white border border-neutral-200 hover:border-[#D6B46A] rounded-xl transition-all group"
          >
            <p className="text-xs font-bold text-neutral-900 group-hover:text-[#A68936] flex items-center justify-between">
              <span>Open Graph Designer</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">Preview how social networks render your campaign preview card.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
