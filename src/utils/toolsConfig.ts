// Studio Digital Tools Configuration and Status Management
// Allows Admin to enable/disable any tool with instant real-time synchronization

export interface ToolItemConfig {
  id: 'converter' | 'calculator' | 'compressor' | 'resizer' | 'pdf-tool' | 'bg-remover' | 'upscaler' | 'vectorizer';
  name: string;
  shortName: string;
  category: 'Image' | 'Document' | 'Productivity' | 'AI Neural';
  badge: string;
  description: string;
  enabled: boolean;
  maintenanceNotice?: string;
  iconName: string;
}

export const DEFAULT_TOOLS_CONFIG: ToolItemConfig[] = [
  {
    id: 'converter',
    name: 'Universal Batch Image Converter',
    shortName: 'Image Converter',
    category: 'Image',
    badge: 'Multi-Format',
    description: 'Convert between PNG, JPG, WEBP, AVIF, BMP, GIF, and ICO favicon standards instantly in-browser. Zero server uploads and 1-click batch ZIP downloads.',
    enabled: true,
    iconName: 'RefreshCw'
  },
  {
    id: 'calculator',
    name: 'Universal Multi-Calculator',
    shortName: 'Calculator Suite',
    category: 'Productivity',
    badge: 'Pro Engine',
    description: 'Complete multi-paradigm calculator: Standard Basic, Scientific Pro (trig, roots, calculus), Loan & EMI planner, GST & tax solver, Mutual Fund SIP, and unit converter.',
    enabled: true,
    iconName: 'Calculator'
  },
  {
    id: 'compressor',
    name: 'Ultra-Fast Photo Compressor',
    shortName: 'Photo Compressor',
    category: 'Image',
    badge: 'Lossless & Web',
    description: 'Compress high-resolution images down to targeted KB limits (<20KB, <50KB, <100KB) with instant preview, zero server uploads, and batch export.',
    enabled: true,
    iconName: 'Minimize2'
  },
  {
    id: 'resizer',
    name: 'Photo Resizer & Transformer',
    shortName: 'Photo Resizer',
    category: 'Image',
    badge: '300 DPI Print',
    description: 'Resize by pixels, cm, mm, inch or percentage with aspect-ratio locking and 300 DPI print fidelity. Includes 1-click official ID standards (Indian Passport 3.5×4.5cm, US Visa 2×2").',
    enabled: true,
    iconName: 'Crop'
  },
  {
    id: 'pdf-tool',
    name: 'PDF Reducer & Digital Signer',
    shortName: 'PDF Signer',
    category: 'Document',
    badge: 'Unlimited MB',
    description: 'Shrink heavy PDFs to government specs (<100KB, <500KB) and draw, type, or affix verified signatures with interactive drag-and-drop placement.',
    enabled: true,
    iconName: 'FileText'
  },
  {
    id: 'bg-remover',
    name: 'AI Background Remover Studio',
    shortName: 'Background Remover',
    category: 'AI Neural',
    badge: 'Smart Isolation',
    description: 'Smart neural segmentation and color matting to isolate portrait, cartoon & product backgrounds with custom color backdrops and manual brush refine.',
    enabled: true,
    iconName: 'Wand2'
  },
  {
    id: 'upscaler',
    name: 'AI Image 4K Upscaler',
    shortName: 'Image Upscaler',
    category: 'AI Neural',
    badge: '4K Ultra',
    description: 'Enhance low-resolution graphics up to 4K using in-browser super-resolution, bicubic GPU acceleration, and smart unsharp detail enhancement.',
    enabled: true,
    iconName: 'Sparkles'
  },
  {
    id: 'vectorizer',
    name: 'Raster to SVG Vectorizer',
    shortName: 'SVG Vectorizer',
    category: 'Image',
    badge: 'Crisp Vector',
    description: 'Convert raster logos, icons, and artwork into infinitely scalable SVG paths with custom quantization and real-time bezier smoothing.',
    enabled: true,
    iconName: 'ImageIcon'
  }
];

const STORAGE_KEY = 'samaxon_tools_status';
const SYNC_EVENT = 'samaxon_tools_status_updated';

export function getToolsConfig(): ToolItemConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TOOLS_CONFIG;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_TOOLS_CONFIG;

    return DEFAULT_TOOLS_CONFIG.map(defaultTool => {
      const match = parsed.find((p: any) => p && p.id === defaultTool.id);
      if (!match) return defaultTool;
      return {
        ...defaultTool,
        enabled: typeof match.enabled === 'boolean' ? match.enabled : defaultTool.enabled,
        maintenanceNotice: match.maintenanceNotice || defaultTool.maintenanceNotice
      };
    });
  } catch (e) {
    return DEFAULT_TOOLS_CONFIG;
  }
}

export function saveToolStatus(toolId: string, enabled: boolean, maintenanceNotice?: string): ToolItemConfig[] {
  const current = getToolsConfig();
  const next = current.map(item => {
    if (item.id === toolId) {
      return {
        ...item,
        enabled,
        maintenanceNotice: maintenanceNotice !== undefined ? maintenanceNotice : item.maintenanceNotice
      };
    }
    return item;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: next }));
  } catch (e) {
    console.error('Failed to save tools config:', e);
  }

  return next;
}

export function resetToolsConfig(): ToolItemConfig[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: DEFAULT_TOOLS_CONFIG }));
  } catch (e) {
    console.error('Failed to reset tools config:', e);
  }
  return DEFAULT_TOOLS_CONFIG;
}
