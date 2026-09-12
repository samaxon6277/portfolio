import React, { useState, useRef, useEffect } from 'react';
import { 
  Crown, Image, Upload, RotateCcw, Move, ZoomIn, ZoomOut, 
  RotateCw, Sliders, Eye, EyeOff, Plus, Trash2, ArrowUp, ArrowDown, 
  Check, Link as LinkIcon, Monitor, Tablet, Smartphone, Sparkles, 
  Save, AlertCircle, RefreshCw, Layers, Shield
} from 'lucide-react';
import { WebsiteSettings } from '../../utils/mockAdminData';
import { NavItemConfig, DEFAULT_HEADER_NAV_ITEMS } from '../../config/siteConfig';
import SleekLuxurySlider from '../tools/SleekLuxurySlider';

interface NavbarStudioProps {
  settings: WebsiteSettings;
  onSave: (updated: WebsiteSettings) => void;
}

export const NavbarStudio: React.FC<NavbarStudioProps> = ({ settings, onSave }) => {
  // Local working copy of settings
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>(() => ({
    ...settings,
    logoScale: settings.logoScale !== undefined ? settings.logoScale : 1.0,
    logoOffsetX: settings.logoOffsetX !== undefined ? settings.logoOffsetX : 0,
    logoOffsetY: settings.logoOffsetY !== undefined ? settings.logoOffsetY : 0,
    logoRotation: settings.logoRotation !== undefined ? settings.logoRotation : 0,
    logoBorderRadius: settings.logoBorderRadius !== undefined ? settings.logoBorderRadius : 12,
    logoPadding: settings.logoPadding !== undefined ? settings.logoPadding : 4,
    logoBrightness: settings.logoBrightness !== undefined ? settings.logoBrightness : 100,
    logoContrast: settings.logoContrast !== undefined ? settings.logoContrast : 100,
    logoBgEnabled: settings.logoBgEnabled !== undefined ? settings.logoBgEnabled : (settings.logoType === 'image' ? false : true),
    logoBgColor: settings.logoBgColor || '#111111',
    logoBorderEnabled: settings.logoBorderEnabled !== undefined ? settings.logoBorderEnabled : true,
    headerBrandTextVisible: settings.headerBrandTextVisible !== undefined ? settings.headerBrandTextVisible : true,
    headerSubText: settings.headerSubText !== undefined ? settings.headerSubText : '48-HR Digital Studio',
    headerSubTextVisible: settings.headerSubTextVisible !== undefined ? settings.headerSubTextVisible : true,
    headerShowCrown: settings.headerShowCrown !== undefined ? settings.headerShowCrown : true,
    headerCtaText: settings.headerCtaText || 'Start Build',
    headerCtaLink: settings.headerCtaLink || '/contact',
    headerCtaVisible: settings.headerCtaVisible !== undefined ? settings.headerCtaVisible : true,
    headerNavItems: Array.isArray(settings.headerNavItems) && settings.headerNavItems.length > 0 
      ? settings.headerNavItems 
      : DEFAULT_HEADER_NAV_ITEMS
  }));

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string>('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Drag & Stage State
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffsets, setInitialOffsets] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [stageBgTheme, setStageBgTheme] = useState<'dark' | 'checker' | 'light'>('dark');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [mobileDrawerSimOpen, setMobileDrawerSimOpen] = useState(false);

  // Direct Drag inside Live Header Preview
  const [isHeaderLogoDragging, setIsHeaderLogoDragging] = useState(false);
  const [headerDragStart, setHeaderDragStart] = useState({ x: 0, y: 0 });
  const [headerInitialOffsets, setHeaderInitialOffsets] = useState({ x: 0, y: 0 });

  // New Link Form State
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkPath, setNewLinkPath] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);

  // Sync state if external settings change
  useEffect(() => {
    setLocalSettings(prev => ({
      ...prev,
      ...settings,
      headerNavItems: Array.isArray(settings.headerNavItems) && settings.headerNavItems.length > 0 
        ? settings.headerNavItems 
        : (prev.headerNavItems || DEFAULT_HEADER_NAV_ITEMS)
    }));
  }, [settings]);

  // Non-passive wheel event listener for stage zoom
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setLocalSettings(prev => {
        const nextScale = Math.max(0.5, Math.min(2.5, Number(((prev.logoScale || 1.0) + delta).toFixed(2))));
        return { ...prev, logoScale: nextScale };
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Pointer drag events
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialOffsets({ 
      x: localSettings.logoOffsetX || 0, 
      y: localSettings.logoOffsetY || 0 
    });
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = Math.round(clientX - dragStart.x);
    const deltaY = Math.round(clientY - dragStart.y);
    const nextX = Math.max(-140, Math.min(140, initialOffsets.x + deltaX));
    const nextY = Math.max(-80, Math.min(80, initialOffsets.y + deltaY));
    setLocalSettings(prev => ({
      ...prev,
      logoOffsetX: nextX,
      logoOffsetY: nextY
    }));
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Direct Pointer Handlers for Dragging Logo within the Live Header Preview
  const handleHeaderLogoPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setIsHeaderLogoDragging(true);
    setHeaderDragStart({ x: e.clientX, y: e.clientY });
    setHeaderInitialOffsets({ 
      x: localSettings.logoOffsetX || 0, 
      y: localSettings.logoOffsetY || 0 
    });
  };

  const handleHeaderLogoPointerMove = (e: React.PointerEvent) => {
    if (!isHeaderLogoDragging) return;
    const deltaX = Math.round(e.clientX - headerDragStart.x);
    const deltaY = Math.round(e.clientY - headerDragStart.y);
    const nextX = Math.max(-150, Math.min(150, headerInitialOffsets.x + deltaX));
    const nextY = Math.max(-100, Math.min(100, headerInitialOffsets.y + deltaY));
    setLocalSettings(prev => ({
      ...prev,
      logoOffsetX: nextX,
      logoOffsetY: nextY
    }));
  };

  const handleHeaderLogoPointerUp = (e: React.PointerEvent) => {
    if (isHeaderLogoDragging) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setIsHeaderLogoDragging(false);
    }
  };

  // Reset logo transformations to defaults
  const handleResetLogoTransform = () => {
    setLocalSettings(prev => ({
      ...prev,
      logoScale: 1.0,
      logoOffsetX: 0,
      logoOffsetY: 0,
      logoRotation: 0,
      logoBorderRadius: 12,
      logoPadding: 4,
      logoBrightness: 100,
      logoContrast: 100
    }));
    showToast('Reset logo placement and filters to studio defaults');
  };

  // Nav Links Management
  const navItems = localSettings.headerNavItems || DEFAULT_HEADER_NAV_ITEMS;

  const handleToggleNavVisibility = (id: string) => {
    const updated = navItems.map(item => 
      item.id === id ? { ...item, visible: item.visible === false ? true : false } : item
    );
    setLocalSettings(prev => ({ ...prev, headerNavItems: updated }));
  };

  const handleMoveNavLink = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setLocalSettings(prev => ({ ...prev, headerNavItems: newItems }));
  };

  const handleDeleteNavLink = (id: string) => {
    if (navItems.length <= 1) {
      showToast('Navigation must keep at least 1 link');
      return;
    }
    const filtered = navItems.filter(item => item.id !== id);
    setLocalSettings(prev => ({ ...prev, headerNavItems: filtered }));
    showToast('Navigation link removed');
  };

  const handleUpdateNavLink = (id: string, field: keyof NavItemConfig, val: any) => {
    const updated = navItems.map(item => 
      item.id === id ? { ...item, [field]: val } : item
    );
    setLocalSettings(prev => ({ ...prev, headerNavItems: updated }));
  };

  const handleAddNewNavLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkPath.trim()) {
      showToast('Link title and URL path are required');
      return;
    }
    const cleanId = newLinkLabel.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    const newLink: NavItemConfig = {
      id: cleanId,
      label: newLinkLabel.trim(),
      path: newLinkPath.trim(),
      badge: newLinkBadge.trim() || undefined,
      visible: true
    };
    setLocalSettings(prev => ({
      ...prev,
      headerNavItems: [...(prev.headerNavItems || DEFAULT_HEADER_NAV_ITEMS), newLink]
    }));
    setNewLinkLabel('');
    setNewLinkPath('');
    setNewLinkBadge('');
    setShowAddLinkForm(false);
    showToast(`Added "${newLink.label}" to navigation menu!`);
  };

  const handleRestoreDefaultNavItems = () => {
    setLocalSettings(prev => ({
      ...prev,
      headerNavItems: DEFAULT_HEADER_NAV_ITEMS
    }));
    showToast('Navigation links restored to default structure');
  };

  // Master Save Handler
  const handleSaveAll = () => {
    onSave(localSettings);
    try {
      localStorage.setItem('samaxon_website_settings', JSON.stringify(localSettings));
      window.dispatchEvent(new Event('samaxon_website_settings_updated'));
    } catch {}
    showToast('Header & Navbar settings successfully saved and applied to entire website!');
  };

  // Helper to render live logo inside simulated header or canvas
  const renderLogoPreview = (scaleMultiplier: number = 1, isBeingDragged: boolean = false) => {
    const isImage = localSettings.logoType === 'image' && localSettings.logoUrl && localSettings.logoUrl.length > 5;
    const logoChar = localSettings.logoText || (localSettings.logoUrl && localSettings.logoUrl.length <= 4 ? localSettings.logoUrl : 'S');
    const scale = (localSettings.logoScale || 1.0) * scaleMultiplier;
    const offsetX = (localSettings.logoOffsetX || 0) * scaleMultiplier;
    const offsetY = (localSettings.logoOffsetY || 0) * scaleMultiplier;
    const isBgActive = localSettings.logoBgEnabled !== false;
    const isBorderActive = localSettings.logoBorderEnabled !== false;
    const bgColor = isBgActive ? (localSettings.logoBgColor || '#111111') : 'transparent';

    return (
      <div 
        className={`w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0 relative transition-all ${
          isBgActive ? 'shadow-md' : ''
        } ${isBorderActive ? 'border border-[#D6B46A]/50' : ''} ${
          isBeingDragged ? 'ring-2 ring-[#D6B46A] shadow-[0_0_20px_rgba(214,180,106,0.6)]' : ''
        }`}
        style={{
          backgroundColor: bgColor,
          borderRadius: `${localSettings.logoBorderRadius ?? 12}px`,
          padding: `${localSettings.logoPadding ?? 4}px`,
          filter: `brightness(${localSettings.logoBrightness ?? 100}%) contrast(${localSettings.logoContrast ?? 100}%)`,
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px) rotate(${localSettings.logoRotation ?? 0}deg)`,
            transformOrigin: 'center center'
          }}
        >
          {isImage ? (
            <img 
              src={localSettings.logoUrl} 
              alt={localSettings.brandName || "Logo"} 
              className="w-full h-full object-contain p-0.5 select-none pointer-events-none" 
            />
          ) : (
            <span className="text-[#D6B46A] font-bold text-lg font-display select-none">
              {logoChar}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-left" id="header-navbar-studio">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-mono font-bold animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#D6B46A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D6B46A]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#D6B46A]/15 text-[#BFA15A] text-[10px] font-mono font-bold tracking-widest uppercase">
              Live Website Architecture
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Sync Active
            </span>
          </div>
          <h2 className="font-display font-black text-2xl text-[#111111] tracking-tight">
            Header &amp; Navbar Customization Studio
          </h2>
          <p className="text-xs text-[#8A8178] mt-1 max-w-2xl leading-relaxed">
            Take 100% granular control over the website's floating header, logo placement, drag-and-drop position, custom text tags, navigation links hierarchy, CTA button, and responsive mobile behavior.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6B46A] to-[#BFA15A] hover:from-[#BFA15A] hover:to-[#9E8240] text-[#111111] font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D6B46A]/25 transition-all cursor-pointer active:scale-95"
            id="btn-save-navbar-settings"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Apply Changes</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Live Interactive Header Simulation Surface */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 shadow-sm space-y-5" id="header-simulation-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D6B46A]/15">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-5 h-5 text-[#D6B46A]" />
            <div>
              <h3 className="font-display font-black text-base text-[#111111] uppercase tracking-wide">
                Live Interactive Header Preview
              </h3>
              <p className="text-[11px] text-[#8A8178]">
                Changes update in real-time. Toggle viewport modes to simulate desktop and mobile displays.
              </p>
            </div>
          </div>

          {/* Device viewport switcher */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF8] border border-[#D6B46A]/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                previewDevice === 'desktop' 
                  ? 'bg-[#111111] text-[#D6B46A] shadow-sm' 
                  : 'text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                previewDevice === 'tablet' 
                  ? 'bg-[#111111] text-[#D6B46A] shadow-sm' 
                  : 'text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                previewDevice === 'mobile' 
                  ? 'bg-[#111111] text-[#D6B46A] shadow-sm' 
                  : 'text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* The Simulated Stage Canvas */}
        <div className="w-full bg-[#FAF7F0] border border-[#D6B46A]/20 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[180px] relative overflow-hidden">
          
          {/* Desktop & Tablet Simulation */}
          {previewDevice !== 'mobile' ? (
            <div className={`w-full transition-all duration-300 ${previewDevice === 'tablet' ? 'max-w-2xl' : 'max-w-5xl'}`}>
              <div className="w-full bg-white/95 backdrop-blur-xl border border-[#D6B46A]/30 rounded-full px-5 sm:px-7 py-3 shadow-[0_10px_30px_rgba(214,180,106,0.15)] flex items-center justify-between gap-4">
                
                {/* Brand Logo & Text Block */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Direct Draggable Logo inside Header Preview */}
                  <div 
                    onPointerDown={handleHeaderLogoPointerDown}
                    onPointerMove={handleHeaderLogoPointerMove}
                    onPointerUp={handleHeaderLogoPointerUp}
                    onPointerCancel={handleHeaderLogoPointerUp}
                    className="relative cursor-grab active:cursor-grabbing select-none group touch-none shrink-0"
                    title="Click/Touch and drag to position logo directly inside header"
                  >
                    {renderLogoPreview(1, isHeaderLogoDragging)}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/30 text-[9px] font-mono px-2 py-0.5 rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                      Drag logo (X: {localSettings.logoOffsetX || 0}px, Y: {localSettings.logoOffsetY || 0}px)
                    </div>
                  </div>

                  {localSettings.headerBrandTextVisible !== false ? (
                    <div className="flex flex-col text-left group/brand relative">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={localSettings.brandName || ''}
                          onChange={(e) => setLocalSettings(prev => ({ ...prev, brandName: e.target.value }))}
                          title="Click to edit Brand Name inline"
                          className="font-display font-black tracking-[0.16em] text-sm sm:text-base text-[#111111] uppercase leading-none bg-transparent hover:bg-neutral-100/70 focus:bg-white focus:ring-1 focus:ring-[#D6B46A] rounded px-1 -ml-1 transition-all outline-none"
                          style={{ width: `${Math.max(6, (localSettings.brandName || 'SamaXon').length + 1)}ch` }}
                        />
                        {localSettings.headerShowCrown !== false && (
                          <span 
                            className="cursor-pointer hover:scale-110 transition-transform" 
                            onClick={() => setLocalSettings(prev => ({ ...prev, headerShowCrown: false }))} 
                            title="Click to hide Crown Crest"
                          >
                            <Crown className="w-3.5 h-3.5 text-[#D6B46A] fill-[#D6B46A]/25 hover:text-rose-500" />
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setLocalSettings(prev => ({ ...prev, headerBrandTextVisible: false }))}
                          className="w-4 h-4 rounded-full bg-neutral-200 hover:bg-rose-500 hover:text-white text-neutral-600 flex items-center justify-center text-[10px] opacity-0 group-hover/brand:opacity-100 transition-opacity cursor-pointer shrink-0"
                          title="Hide / Cut Brand Name"
                        >
                          ✕
                        </button>
                      </div>

                      {localSettings.headerSubTextVisible !== false && (
                        <div className="flex items-center gap-1 mt-1 group/sub">
                          <input
                            type="text"
                            value={localSettings.headerSubText || ''}
                            onChange={(e) => setLocalSettings(prev => ({ ...prev, headerSubText: e.target.value }))}
                            title="Click to edit Sub-Tagline inline"
                            className="text-[10px] font-mono tracking-[0.14em] text-[#BFA15A] uppercase leading-none font-bold bg-transparent hover:bg-neutral-100/70 focus:bg-white focus:ring-1 focus:ring-[#D6B46A] rounded px-1 -ml-1 transition-all outline-none"
                            style={{ width: `${Math.max(12, (localSettings.headerSubText || '48-HR Digital Studio').length + 1)}ch` }}
                          />
                          <button
                            type="button"
                            onClick={() => setLocalSettings(prev => ({ ...prev, headerSubTextVisible: false }))}
                            className="w-3.5 h-3.5 rounded-full bg-neutral-200 hover:bg-rose-500 hover:text-white text-neutral-600 flex items-center justify-center text-[8px] opacity-0 group-hover/sub:opacity-100 transition-opacity cursor-pointer shrink-0"
                            title="Hide / Cut Sub-Tagline"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLocalSettings(prev => ({ ...prev, headerBrandTextVisible: true }))}
                      className="text-[10px] font-mono font-bold text-[#D6B46A] hover:underline flex items-center gap-1 border border-dashed border-[#D6B46A]/40 px-2 py-0.5 rounded-full cursor-pointer bg-white"
                    >
                      + Show Brand Name
                    </button>
                  )}
                </div>

                {/* Navigation Links (Desktop/Tablet) */}
                <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-[#111111]/[0.04] border border-[#D6B46A]/25 overflow-x-auto scrollbar-none">
                  {navItems.filter(i => i.visible !== false).map((item) => (
                    <div
                      key={item.id}
                      className="px-3 py-1 text-xs font-semibold rounded-full text-[#111111] hover:bg-[#D6B46A]/15 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-full bg-[#D6B46A]/25 text-[#111111]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Header CTA Button */}
                {localSettings.headerCtaVisible !== false && (
                  <div className="shrink-0">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#D6B46A] text-[#111111] text-xs font-bold tracking-wider rounded-full shadow-md hover:bg-[#BFA15A] transition-all flex items-center gap-1"
                    >
                      <span>{localSettings.headerCtaText || 'Start Build'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Mobile Device Simulation */
            <div className="w-full max-w-sm bg-white border-2 border-neutral-300 rounded-[32px] p-4 shadow-2xl relative">
              <div className="w-16 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />
              
              {/* Mobile Header Bar */}
              <div className="w-full bg-[#FFFDF8] border border-[#D6B46A]/30 rounded-full px-4 py-2.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div
                    onPointerDown={handleHeaderLogoPointerDown}
                    onPointerMove={handleHeaderLogoPointerMove}
                    onPointerUp={handleHeaderLogoPointerUp}
                    onPointerCancel={handleHeaderLogoPointerUp}
                    className="relative cursor-grab active:cursor-grabbing select-none group touch-none"
                    title="Drag logo to position"
                  >
                    {renderLogoPreview(0.85, isHeaderLogoDragging)}
                  </div>
                  <span className="font-display font-black text-xs text-[#111111] uppercase tracking-wider">
                    {localSettings.brandName ? localSettings.brandName.split(' ')[0] : 'SamaXon'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileDrawerSimOpen(!mobileDrawerSimOpen)}
                  className="p-1.5 rounded-lg bg-[#111111]/5 text-[#111111] text-xs font-mono font-bold flex items-center gap-1"
                >
                  <span>{mobileDrawerSimOpen ? '✕ Close' : '☰ Menu'}</span>
                </button>
              </div>

              {/* Mobile Expanded Simulation */}
              {mobileDrawerSimOpen && (
                <div className="mt-3 p-4 bg-neutral-900 rounded-2xl text-neutral-200 space-y-3 animate-in fade-in">
                  <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-widest block font-bold">
                    Mobile Menu Links
                  </span>
                  <div className="space-y-1.5">
                    {navItems.filter(i => i.visible !== false).map(item => (
                      <div key={item.id} className="flex items-center justify-between py-1 border-b border-white/5 text-xs">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono bg-[#D6B46A]/25 text-[#D6B46A] px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {localSettings.headerCtaVisible !== false && (
                    <button
                      type="button"
                      className="w-full py-2 bg-[#D6B46A] text-[#111111] rounded-xl font-bold text-xs mt-2"
                    >
                      {localSettings.headerCtaText || 'Start Build'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: Interactive Drag, Scale & Transform Studio */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="logo-drag-studio-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B46A]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A] shadow-inner">
              <Move className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
                Direct Touch &amp; Mouse Manipulation
              </span>
              <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
                Logo Drag, Scale &amp; Position Engine
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetLogoTransform}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:border-[#D6B46A]/50 bg-neutral-50 hover:bg-white text-neutral-700 hover:text-neutral-900 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Reset position and size to standard studio defaults"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#BFA15A]" />
              <span>Reset Position</span>
            </button>
          </div>
        </div>

        {/* Mode Selector: Monogram vs Custom Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
          <button
            type="button"
            onClick={() => setLocalSettings(prev => ({ ...prev, logoType: 'monogram' }))}
            className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              (localSettings.logoType || 'monogram') === 'monogram'
                ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                : 'text-[#8A8178] hover:text-[#111111]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Monogram Typography (S)</span>
          </button>

          <button
            type="button"
            onClick={() => setLocalSettings(prev => ({ ...prev, logoType: 'image' }))}
            className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              localSettings.logoType === 'image'
                ? 'bg-[#111111] text-[#D6B46A] shadow-md'
                : 'text-[#8A8178] hover:text-[#111111]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Custom Image / Vector Logo</span>
          </button>
        </div>

        {/* Image Mode Source Inputs */}
        {localSettings.logoType === 'image' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            {/* File Upload */}
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1.5">
                Upload Logo File (PNG, SVG, JPG, WebP)
              </label>
              <label className="border-2 border-dashed border-[#D6B46A]/35 hover:border-[#D6B46A] bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#D6B46A]/5 text-center group min-h-[110px]">
                <Upload className="w-6 h-6 text-[#D6B46A] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#111111]">Click to Browse or Drag File</span>
                <span className="text-[10px] text-[#8A8178] font-mono mt-0.5">Transparent PNG or SVG recommended</span>
                <input
                  type="file"
                  accept="image/png, image/svg+xml, image/jpeg, image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const res = event.target?.result as string;
                        if (res) {
                          setLocalSettings(prev => ({ 
                            ...prev, 
                            logoUrl: res, 
                            logoType: 'image',
                            logoBgEnabled: false // default to transparent so any PNG/SVG renders cleanly without black box!
                          }));
                          showToast('Logo image uploaded successfully!');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Direct URL */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1.5">
                  Or Enter Direct Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://.../logo.png or /logo.png"
                  value={localSettings.logoUrl && localSettings.logoUrl.startsWith('data:') ? 'Custom File Uploaded (Active)' : (localSettings.logoUrl || '')}
                  onChange={e => setLocalSettings(prev => ({ ...prev, logoUrl: e.target.value, logoType: 'image' }))}
                  className="w-full px-3.5 py-2.5 border border-[#D6B46A]/25 bg-white rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-[#D6B46A]"
                />
              </div>
              <p className="text-[11px] text-[#8A8178] mt-2">
                Tip: Use high-resolution transparent assets for the sharpest rendering across retina screens.
              </p>
            </div>
          </div>
        )}

        {/* Logo Container Background & Rim Border Customizer */}
        <div className="p-5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
                Logo Container Background
              </span>
              <h4 className="font-display font-bold text-sm text-[#111111]">
                Background Box &amp; Rim Border
              </h4>
              <p className="text-[11px] text-[#8A8178]">
                Turn off background box for transparent PNGs/SVGs (e.g. black X logo), or pick a custom container color.
              </p>
            </div>

            {/* Toggle: Background Box On / Off & Border Rim */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings(prev => ({ ...prev, logoBgEnabled: !prev.logoBgEnabled }))}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  localSettings.logoBgEnabled !== false
                    ? 'bg-[#111111] text-[#D6B46A] border border-[#D6B46A]/40'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-400/30'
                }`}
              >
                <span>{localSettings.logoBgEnabled !== false ? '■ Background Box: ON' : '◫ Transparent (No Box): ACTIVE'}</span>
              </button>

              {/* Border Rim Toggle */}
              <button
                type="button"
                onClick={() => setLocalSettings(prev => ({ ...prev, logoBorderEnabled: prev.logoBorderEnabled === false ? true : false }))}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  localSettings.logoBorderEnabled !== false
                    ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                    : 'bg-neutral-50 text-neutral-400 border-neutral-200'
                }`}
              >
                <span>Border: {localSettings.logoBorderEnabled !== false ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Quick Background Color Presets if Box is enabled */}
          {localSettings.logoBgEnabled !== false && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D6B46A]/15">
              <span className="text-[10px] font-mono text-[#8A8178] uppercase font-bold mr-1">Color Presets:</span>
              {[
                { label: 'Transparent', color: 'transparent', bgClass: 'bg-white border-dashed text-neutral-700' },
                { label: 'Matte Black', color: '#111111', bgClass: 'bg-[#111111] text-[#D6B46A]' },
                { label: 'Pure White', color: '#FFFFFF', bgClass: 'bg-white text-neutral-900 border-neutral-300' },
                { label: 'Champagne Gold', color: '#D6B46A', bgClass: 'bg-[#D6B46A] text-[#111111]' },
                { label: 'Charcoal Dark', color: '#262626', bgClass: 'bg-[#262626] text-white' },
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    if (preset.color === 'transparent') {
                      setLocalSettings(prev => ({ ...prev, logoBgEnabled: false, logoBgColor: 'transparent' }));
                    } else {
                      setLocalSettings(prev => ({ ...prev, logoBgEnabled: true, logoBgColor: preset.color }));
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 cursor-pointer transition-all ${
                    (localSettings.logoBgColor === preset.color || (preset.color === 'transparent' && localSettings.logoBgEnabled === false))
                      ? 'ring-2 ring-[#D6B46A] font-bold shadow-xs'
                      : 'hover:opacity-80'
                  } ${preset.bgClass}`}
                >
                  <span>{preset.label}</span>
                </button>
              ))}

              {/* Custom Hex Color Picker */}
              <div className="flex items-center gap-2 ml-auto bg-white px-3 py-1 rounded-xl border border-neutral-200">
                <label className="text-[10px] font-mono text-[#8A8178] font-bold">Custom Hex:</label>
                <input
                  type="color"
                  value={localSettings.logoBgColor && localSettings.logoBgColor !== 'transparent' ? localSettings.logoBgColor : '#111111'}
                  onChange={e => setLocalSettings(prev => ({ ...prev, logoBgEnabled: true, logoBgColor: e.target.value }))}
                  className="w-6 h-6 rounded border border-neutral-300 cursor-pointer p-0 bg-transparent"
                />
                <span className="text-xs font-mono text-neutral-700 uppercase font-bold">
                  {localSettings.logoBgColor || '#111111'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Monogram Mode Letter Input */}
        {localSettings.logoType !== 'image' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">
                Monogram Initials (1-3 Characters)
              </label>
              <input
                type="text"
                maxLength={4}
                value={localSettings.logoText || (localSettings.logoUrl && localSettings.logoUrl.length <= 4 ? localSettings.logoUrl : 'S')}
                onChange={e => {
                  const val = e.target.value.toUpperCase();
                  setLocalSettings(prev => ({
                    ...prev,
                    logoText: val,
                    logoUrl: val,
                    logoType: 'monogram'
                  }));
                }}
                className="w-full px-4 py-2.5 border border-[#D6B46A]/25 bg-white rounded-xl font-display font-black text-lg text-[#111111]"
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8A8178] leading-relaxed">
              <Sparkles className="w-5 h-5 text-[#D6B46A] shrink-0" />
              <span>
                Displays in the royal champagne gold beveled emblem on matte black with gold rim accents.
              </span>
            </div>
          </div>
        )}

        {/* The Drag Stage Canvas */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[11px] text-[#8A8178] uppercase font-bold">
              Interactive Canvas (Drag with mouse/touch to position)
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#D6B46A] font-bold bg-[#111111] px-2 py-0.5 rounded-lg border border-[#D6B46A]/30">
                X: {localSettings.logoOffsetX || 0}px · Y: {localSettings.logoOffsetY || 0}px · Zoom: {(localSettings.logoScale || 1.0).toFixed(2)}x
              </span>

              {/* Stage background switcher (so black PNGs are clearly visible) */}
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setStageBgTheme('dark')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                    stageBgTheme === 'dark' ? 'bg-[#111111] text-white font-bold' : 'text-neutral-600'
                  }`}
                  title="Dark Stage"
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setStageBgTheme('checker')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                    stageBgTheme === 'checker' ? 'bg-[#D6B46A] text-[#111111] font-bold' : 'text-neutral-600'
                  }`}
                  title="Checkerboard Stage (for black/dark PNGs)"
                >
                  Checker
                </button>
                <button
                  type="button"
                  onClick={() => setStageBgTheme('light')}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                    stageBgTheme === 'light' ? 'bg-white text-[#111111] font-bold shadow-xs' : 'text-neutral-600'
                  }`}
                  title="Light Stage"
                >
                  Light
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-[10px] font-mono text-neutral-700 cursor-pointer"
              >
                Grid: {showGrid ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div
            ref={stageRef}
            onMouseMove={e => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchMove={e => {
              if (e.touches.length === 1) {
                handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handlePointerUp}
            className={`relative w-full h-72 rounded-3xl border-2 border-dashed border-[#D6B46A]/35 overflow-hidden flex items-center justify-center select-none shadow-inner cursor-grab active:cursor-grabbing transition-colors ${
              stageBgTheme === 'dark'
                ? 'bg-neutral-950'
                : stageBgTheme === 'checker'
                ? 'bg-[#E5E5E5]'
                : 'bg-white'
            }`}
            style={{
              backgroundImage: showGrid 
                ? (stageBgTheme === 'dark' 
                    ? 'radial-gradient(rgba(214, 180, 106, 0.25) 1px, transparent 0)'
                    : stageBgTheme === 'checker'
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                    : 'radial-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 0)')
                : 'none',
              backgroundSize: stageBgTheme === 'checker' ? '20px 20px' : '24px 24px',
              backgroundPosition: stageBgTheme === 'checker' ? '0 0, 0 10px, 10px -10px, -10px 0px' : undefined
            }}
          >
            {/* Center target crosshairs */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#D6B46A]/25 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#D6B46A]/25 pointer-events-none" />
            <div className="absolute w-12 h-12 border border-[#D6B46A]/30 rounded-xl pointer-events-none" />

            {/* Hint pill */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl border border-[#D6B46A]/30 text-[10px] font-mono text-[#D6B46A] flex items-center gap-1.5 pointer-events-none">
              <Move className="w-3.5 h-3.5" />
              <span>Touch or Mouse Drag Target</span>
            </div>

            {/* The Draggable Logo */}
            <div
              className={`relative select-none cursor-grab active:cursor-grabbing transition-shadow ${
                isDragging ? 'ring-2 ring-[#D6B46A] shadow-[0_0_25px_rgba(214,180,106,0.6)]' : 'hover:shadow-[0_0_15px_rgba(214,180,106,0.3)]'
              }`}
              style={{
                width: `${44 * (localSettings.logoScale || 1.0)}px`,
                height: `${44 * (localSettings.logoScale || 1.0)}px`,
                transform: `translate(${localSettings.logoOffsetX || 0}px, ${localSettings.logoOffsetY || 0}px) rotate(${localSettings.logoRotation || 0}deg)`,
                filter: `brightness(${localSettings.logoBrightness || 100}%) contrast(${localSettings.logoContrast || 100}%)`,
                borderRadius: `${localSettings.logoBorderRadius || 12}px`,
                padding: `${localSettings.logoPadding || 4}px`,
                backgroundColor: localSettings.logoBgEnabled !== false ? (localSettings.logoBgColor || '#111111') : 'transparent',
                border: localSettings.logoBorderEnabled !== false ? '1.5px solid rgba(214, 180, 106, 0.5)' : 'none',
                touchAction: 'none'
              }}
              onMouseDown={e => handlePointerDown(e.clientX, e.clientY)}
              onTouchStart={e => {
                if (e.touches.length === 1) {
                  handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
            >
              {localSettings.logoType === 'image' && localSettings.logoUrl && localSettings.logoUrl.length > 5 ? (
                <img
                  src={localSettings.logoUrl}
                  alt={localSettings.brandName || 'Logo'}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display font-black text-xl text-[#D6B46A] pointer-events-none select-none">
                  {localSettings.logoText || (localSettings.logoUrl && localSettings.logoUrl.length <= 4 ? localSettings.logoUrl : 'S')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fine Adjustment Sliders Grid powered by SleekLuxurySlider with visible golden tracks and stepper buttons */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-[#111111] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D6B46A]" />
              <span>Precision Geometry &amp; Filter Sliders</span>
            </h4>
            <span className="text-[10px] font-mono text-[#8A8178]">
              Use sliders or +/- step buttons to nudge values by 1 unit
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <SleekLuxurySlider
              label="Zoom / Scale"
              value={localSettings.logoScale || 1.0}
              min={0.5}
              max={2.5}
              step={0.05}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoScale: val }))}
              formatValue={v => `${v.toFixed(2)}x`}
              minLabel="0.5x"
              midLabel="1.5x"
              maxLabel="2.5x"
            />

            <SleekLuxurySlider
              label="Offset X (Horizontal)"
              value={localSettings.logoOffsetX || 0}
              min={-150}
              max={150}
              step={1}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoOffsetX: val }))}
              formatValue={v => `${v}px`}
              minLabel="-150px"
              midLabel="0px"
              maxLabel="+150px"
            />

            <SleekLuxurySlider
              label="Offset Y (Vertical)"
              value={localSettings.logoOffsetY || 0}
              min={-100}
              max={100}
              step={1}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoOffsetY: val }))}
              formatValue={v => `${v}px`}
              minLabel="-100px"
              midLabel="0px"
              maxLabel="+100px"
            />

            <SleekLuxurySlider
              label="Rotation Angle"
              value={localSettings.logoRotation || 0}
              min={-180}
              max={180}
              step={5}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoRotation: val }))}
              formatValue={v => `${v}°`}
              minLabel="-180°"
              midLabel="0°"
              maxLabel="+180°"
            />

            <SleekLuxurySlider
              label="Corner Radius"
              value={localSettings.logoBorderRadius ?? 12}
              min={0}
              max={40}
              step={1}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoBorderRadius: val }))}
              formatValue={v => `${v}px`}
              minLabel="0px (Square)"
              midLabel="20px"
              maxLabel="40px (Round)"
            />

            <SleekLuxurySlider
              label="Inner Padding"
              value={localSettings.logoPadding ?? 4}
              min={0}
              max={20}
              step={1}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoPadding: val }))}
              formatValue={v => `${v}px`}
              minLabel="0px"
              midLabel="10px"
              maxLabel="20px"
            />

            <SleekLuxurySlider
              label="Brightness"
              value={localSettings.logoBrightness ?? 100}
              min={50}
              max={150}
              step={5}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoBrightness: val }))}
              formatValue={v => `${v}%`}
              minLabel="50%"
              midLabel="100%"
              maxLabel="150%"
            />

            <SleekLuxurySlider
              label="Contrast"
              value={localSettings.logoContrast ?? 100}
              min={50}
              max={150}
              step={5}
              onChange={val => setLocalSettings(prev => ({ ...prev, logoContrast: val }))}
              formatValue={v => `${v}%`}
              minLabel="50%"
              midLabel="100%"
              maxLabel="150%"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Header Typography & Brand Identity */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="header-branding-card">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D6B46A]/15">
          <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
              Branding &amp; Tagline
            </span>
            <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
              Header Titles &amp; Crown Badge
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Name Input + Visibility */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] uppercase">Brand Name in Header</label>
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, headerBrandTextVisible: !localSettings.headerBrandTextVisible })}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  localSettings.headerBrandTextVisible !== false 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {localSettings.headerBrandTextVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{localSettings.headerBrandTextVisible !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
            <input
              type="text"
              value={localSettings.brandName || ''}
              onChange={e => setLocalSettings({ ...localSettings, brandName: e.target.value })}
              placeholder="SamaXon"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D6B46A]/25 rounded-xl text-sm font-display font-black text-[#111111] focus:outline-none focus:border-[#D6B46A]"
            />
            <p className="text-[11px] text-[#8A8178]">
              Displayed next to the logo on desktop and mobile viewports.
            </p>
          </div>

          {/* Subtitle / Tagline Input + Visibility */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#111111] uppercase">Header Sub-Tagline</label>
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, headerSubTextVisible: !localSettings.headerSubTextVisible })}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  localSettings.headerSubTextVisible !== false 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {localSettings.headerSubTextVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{localSettings.headerSubTextVisible !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
            <input
              type="text"
              value={localSettings.headerSubText || ''}
              onChange={e => setLocalSettings({ ...localSettings, headerSubText: e.target.value })}
              placeholder="48-HR DIGITAL STUDIO"
              className="w-full px-3.5 py-2.5 bg-white border border-[#D6B46A]/25 rounded-xl text-xs font-mono font-bold text-[#BFA15A] focus:outline-none focus:border-[#D6B46A]"
            />
            <p className="text-[11px] text-[#8A8178]">
              Micro-typography shown immediately beneath the brand name.
            </p>
          </div>
        </div>

        {/* Crown Icon Toggle */}
        <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-[#D6B46A]" />
            <div>
              <span className="text-xs font-bold text-[#111111] block">Royal Crown Crest Icon</span>
              <span className="text-[11px] text-[#8A8178]">Display imperial gold crown symbol beside the brand name</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocalSettings({ ...localSettings, headerShowCrown: !localSettings.headerShowCrown })}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
              localSettings.headerShowCrown !== false 
                ? 'bg-[#111111] text-[#D6B46A]' 
                : 'bg-neutral-200 text-neutral-600'
            }`}
          >
            {localSettings.headerShowCrown !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{localSettings.headerShowCrown !== false ? 'Active' : 'Disabled'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: Navigation Menu Items Manager */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="navbar-links-manager-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6B46A]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A]">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
                Menu Architecture
              </span>
              <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
                Navigation Links Customizer
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefaultNavItems}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-[#D6B46A]/50 text-neutral-600 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-[#BFA15A]" />
              <span>Restore Defaults</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddLinkForm(!showAddLinkForm)}
              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-neutral-800 text-[#D6B46A] text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Link</span>
            </button>
          </div>
        </div>

        {/* Add Link Form Drawer */}
        {showAddLinkForm && (
          <form onSubmit={handleAddNewNavLink} className="p-5 bg-[#FFFDF8] border-2 border-[#D6B46A]/40 rounded-2xl space-y-4 animate-in fade-in">
            <span className="text-[10px] font-mono uppercase font-bold text-[#BFA15A] tracking-wider block">
              Add New Navigation Item
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Title / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Careers"
                  value={newLinkLabel}
                  onChange={e => setNewLinkLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6B46A]/25 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Target Route URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /careers or https://..."
                  value={newLinkPath}
                  onChange={e => setNewLinkPath(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6B46A]/25 rounded-xl text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8A8178] block mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Hiring or New"
                  value={newLinkBadge}
                  onChange={e => setNewLinkBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D6B46A]/25 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddLinkForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-[#8A8178] hover:text-[#111111]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-bold text-xs shadow-sm cursor-pointer"
              >
                Confirm &amp; Add Link
              </button>
            </div>
          </form>
        )}

        {/* Navigation Items List */}
        <div className="space-y-3">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                item.visible !== false 
                  ? 'bg-[#FFFDF8] border-[#D6B46A]/25 shadow-sm' 
                  : 'bg-neutral-100/70 border-neutral-200 opacity-60'
              }`}
            >
              {/* Order buttons + Label & Path inputs */}
              <div className="flex items-center gap-3 flex-1">
                {/* Reorder Up / Down */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveNavLink(index, 'up')}
                    className="p-1 rounded bg-neutral-200/80 hover:bg-[#D6B46A]/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3 h-3 text-[#111111]" />
                  </button>
                  <button
                    type="button"
                    disabled={index === navItems.length - 1}
                    onClick={() => handleMoveNavLink(index, 'down')}
                    className="p-1 rounded bg-neutral-200/80 hover:bg-[#D6B46A]/30 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3 h-3 text-[#111111]" />
                  </button>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  <div>
                    <span className="text-[9px] font-mono text-[#8A8178] uppercase font-bold block mb-0.5">Label</span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={e => handleUpdateNavLink(item.id, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D6B46A]/20 rounded-lg text-xs font-bold text-[#111111]"
                    />
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-[#8A8178] uppercase font-bold block mb-0.5">Target Path</span>
                    <input
                      type="text"
                      value={item.path}
                      onChange={e => handleUpdateNavLink(item.id, 'path', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D6B46A]/20 rounded-lg text-xs font-mono text-neutral-700"
                    />
                  </div>

                  <div>
                    <span className="text-[9px] font-mono text-[#8A8178] uppercase font-bold block mb-0.5">Badge</span>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={item.badge || ''}
                      onChange={e => handleUpdateNavLink(item.id, 'badge', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-[#D6B46A]/20 rounded-lg text-xs font-mono text-[#BFA15A]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions: Toggle Visibility & Delete */}
              <div className="flex items-center gap-2 shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => handleToggleNavVisibility(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    item.visible !== false 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {item.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.visible !== false ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNavLink(item.id)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  title="Delete Navigation Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Header Call-To-Action (CTA) Button */}
      <div className="bg-white border border-[#D6B46A]/25 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="header-cta-customizer-card">
        <div className="flex items-center gap-3 pb-4 border-b border-[#D6B46A]/15">
          <div className="w-10 h-10 rounded-2xl bg-[#D6B46A]/15 border border-[#D6B46A]/40 flex items-center justify-center text-[#D6B46A]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#BFA15A] block">
              Call-To-Action Control
            </span>
            <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
              Header Action Button
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Button Text */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#8A8178] block">Button Text</label>
            <input
              type="text"
              value={localSettings.headerCtaText || ''}
              onChange={e => setLocalSettings({ ...localSettings, headerCtaText: e.target.value })}
              placeholder="Start Build"
              className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#D6B46A]"
            />
          </div>

          {/* Button Link */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#8A8178] block">Target Destination URL</label>
            <input
              type="text"
              value={localSettings.headerCtaLink || ''}
              onChange={e => setLocalSettings({ ...localSettings, headerCtaLink: e.target.value })}
              placeholder="/contact or WhatsApp link"
              className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#D6B46A]/25 rounded-xl text-xs font-mono text-neutral-800 focus:outline-none focus:border-[#D6B46A]"
            />
          </div>

          {/* Visibility Toggle */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-[#8A8178] block">CTA Button Status</label>
            <button
              type="button"
              onClick={() => setLocalSettings({ ...localSettings, headerCtaVisible: !localSettings.headerCtaVisible })}
              className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                localSettings.headerCtaVisible !== false 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
              }`}
            >
              {localSettings.headerCtaVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{localSettings.headerCtaVisible !== false ? 'CTA Button Displayed' : 'CTA Button Hidden'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="sticky bottom-4 z-40 bg-[#111111] border border-[#D6B46A]/40 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-neutral-300">
          <Shield className="w-4 h-4 text-[#D6B46A]" />
          <span className="hidden sm:inline">Settings synchronize instantly across all open browser sessions.</span>
          <span className="sm:hidden">Real-time sync active.</span>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-[#D6B46A] hover:bg-[#BFA15A] text-[#111111] font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D6B46A]/30 transition-all cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Save &amp; Apply Changes</span>
        </button>
      </div>

    </div>
  );
};
