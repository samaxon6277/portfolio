import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderEdit, Sparkles, Check, Trash2, Plus, Edit2, Copy, Globe, EyeOff, Info, Award, FileText,
  Smartphone, X, Link as LinkIcon
} from 'lucide-react';
import { Service, PortfolioProject, Testimonial, BlogPost } from '../../types';
import { PageSectionContent, WebsiteSettings } from '../../utils/mockAdminData';
import { compressImage, cropAndCompressImage } from '../../utils/imageCompressor';
import CustomSelect from '../../components/CustomSelect';
import { useCustomUi } from '../../context/CustomUiContext';

function SmartAdminThumbnail({ src, alt }: { src: string; alt: string }) {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > naturalWidth * 1.05) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  return (
    <div className={`w-full rounded-xl overflow-hidden border border-[#D6B46A]/10 mb-3 transition-all duration-300 ${
      isPortrait
        ? 'aspect-[3/4] h-60 mx-auto'
        : 'aspect-[16/10] h-32'
    }`}>
      <img src={src} className="w-full h-full object-cover" alt={alt} onLoad={handleLoad} />
    </div>
  );
}

interface ContentSettingsTabProps {
  services: Service[];
  portfolioProjects: PortfolioProject[];
  testimonials: Testimonial[];
  pageSections: PageSectionContent[];
  blogs: BlogPost[];
  legalPages: any;
  onUpdateServices: (items: Service[]) => void;
  onUpdatePortfolio: (items: PortfolioProject[]) => void;
  onUpdateTestimonials: (items: Testimonial[]) => void;
  onUpdatePageSections: (items: PageSectionContent[]) => void;
  onUpdateBlogs: (items: BlogPost[]) => void;
  onUpdateLegalPages: (pages: any) => void;
}

export default function ContentSettingsTab({
  services, portfolioProjects, testimonials, pageSections, blogs, legalPages,
  onUpdateServices, onUpdatePortfolio, onUpdateTestimonials, onUpdatePageSections, onUpdateBlogs, onUpdateLegalPages
}: ContentSettingsTabProps) {
  const { showToast, showConfirm } = useCustomUi();
  const [subTab, setSubTab] = useState<'services' | 'portfolio' | 'testimonials' | 'pages' | 'blog' | 'legal'>('services');

  // Unified editing entity modals tracker
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingSection, setEditingSection] = useState<PageSectionContent | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // States for thumbnail uploading & category tracking
  const [portfolioCategory, setPortfolioCategory] = useState<string>('all');
  
  // Custom aspect-ratio image cropper states
  const [rawUploadedImage, setRawUploadedImage] = useState<string | null>(null);
  const [selectedCropRatio, setSelectedCropRatio] = useState<'16:9' | '9:16' | '3:4' | '1:1' | 'original'>('16:9');
  const [isProcessingCrop, setIsProcessingCrop] = useState<boolean>(false);
  const [editingImageIsPortrait, setEditingImageIsPortrait] = useState<boolean>(false);
  
  // Create entity templates
  const handleAddService = () => {
    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      title: 'New Custom Capability',
      headline: 'Next-Gen Luxury Provisioning',
      category: 'websites',
      painPoint: 'Obsolete manual pipelines.',
      solutionCopy: 'Complete premium digital remote automation.',
      deliverables: ['deliverable placeholder 1', 'deliverable placeholder 2'],
      ctaText: 'Assemble 48h Sprint',
      benefitPoints: ['Zero overhead lag', 'Complete local isolations']
    };
    onUpdateServices([newSrv, ...services]);
  };

  const handleDuplicateService = (srv: Service) => {
    const dup: Service = {
      ...srv,
      id: `srv-${Date.now()}`,
      title: `${srv.title} (Copy)`
    };
    onUpdateServices([dup, ...services]);
  };

  const handleDeleteService = (srvId: string) => {
    showConfirm({
      title: 'Delete Service Entry?',
      message: 'Are you absolutely sure you want to permanently delete this service capability? This directly modifies the public website capabilities grid.',
      confirmText: 'Yes, Delete',
      onConfirm: () => {
        onUpdateServices(services.filter(s => s.id !== srvId));
        showToast('Service deleted successfully.', 'success');
      }
    });
  };

  const handleAddProject = (category: 'websites' | 'apps' | 'brand-identity' | 'graphics' | 'automations' | 'bots' | 'admin-ready' = 'websites') => {
    let type = 'Premium Web Layout';
    let title = 'New Website Case Study';
    if (category === 'apps') { type = 'High-End App Core'; title = 'New App Case Study'; }
    if (category === 'brand-identity') { type = 'Corporate Visual Brand'; title = 'New Brand Case Study'; }
    if (category === 'automations') { type = 'High-Speed Automation'; title = 'New Automation Study'; }
    if (category === 'bots') { type = 'Interactive Telegram Bot'; title = 'New Bot Project'; }
    if (category === 'admin-ready') { type = 'Custom Admin Interface'; title = 'New Admin Suite Case'; }

    const newProj: PortfolioProject = {
      id: `proj-${Date.now()}`,
      title: title,
      type: type,
      category: category,
      problem: 'The targeted business suffered from major workflow processing latency.',
      solution: 'Constructed custom micro-container systems with fast deployment assets.',
      result: 'Lowered response cycles by 94% with massive client volume expansion.',
      visualTag: category,
      accentColor: '#D6B46A'
    };
    onUpdatePortfolio([newProj, ...portfolioProjects]);
    setEditingProject(newProj);
  };

  const handleDeleteProject = (projId: string) => {
    showConfirm({
      title: 'Delete Case Study?',
      message: 'Are you absolutely certain you want to permanently delete this case study? This action will immediately remove it from the client showcase.',
      confirmText: 'Delete Case Study',
      onConfirm: () => {
        onUpdatePortfolio(portfolioProjects.filter(p => p.id !== projId));
        showToast('Case study removed successfully.', 'success');
      }
    });
  };

  const handleAddTestimonial = () => {
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      quote: "Humein lagta tha 48 hours me high end design possible nahi hai, but is digital team ne benchmark khade kar diye.",
      author: "Rajiv Singhal",
      role: "Founder & Director",
      company: "Singhal Heritage Jewelry",
      founderNote: true
    };
    onUpdateTestimonials([newTest, ...testimonials]);
  };

  const handleDeleteTestimonial = (testId: string) => {
    showConfirm({
      title: 'Delete Client Recommendation?',
      message: 'Remove this client recommendation of the executive reviews section?',
      confirmText: 'Remove Quote',
      onConfirm: () => {
        onUpdateTestimonials(testimonials.filter(t => t.id !== testId));
        showToast('Client recommendation removed.', 'success');
      }
    });
  };

  const handleAddBlog = () => {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      title: 'How Ultra-Optimized Code Drastically Doubles Visual Customer Retention',
      excerpt: 'Static pre-rendering and clean tracking structures can convert higher lead values.',
      content: 'Every luxury business relies on responsive interactive feedback. We analyze modern edge-routing microservices and visual weights ratios...',
      author: 'Senior Systems Writer',
      publishedAt: 'May 23, 2026',
      readTime: '5 min read'
    };
    onUpdateBlogs([newBlog, ...blogs]);
  };

  const handleDeleteBlog = (blogId: string) => {
    showConfirm({
      title: 'Delete Insight Post?',
      message: 'Are you absolutely sure you want to delete this insight article permanently?',
      confirmText: 'Delete Post',
      onConfirm: () => {
        onUpdateBlogs(blogs.filter(b => b.id !== blogId));
        showToast('Insight article deleted.', 'success');
      }
    });
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setRawUploadedImage(reader.result);
          // Auto-select intelligent initial ratio based on the project's selected category
          if (editingProject) {
            const cat = editingProject.category;
            if (cat === 'apps' || cat === 'bots') {
              setSelectedCropRatio('3:4');
            } else if (cat === 'brand-identity' || cat === 'graphics') {
              setSelectedCropRatio('1:1');
            } else {
              setSelectedCropRatio('16:9');
            }
          } else {
            setSelectedCropRatio('16:9');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyCrop = async () => {
    if (!rawUploadedImage || !editingProject) return;
    setIsProcessingCrop(true);
    try {
      const croppedBase64 = await cropAndCompressImage(rawUploadedImage, selectedCropRatio, 1920, 0.95);
      setEditingProject({
        ...editingProject,
        thumbnailUrl: croppedBase64
      });
      setRawUploadedImage(null);
    } catch (err) {
      console.warn('Error processing high-res crop client-side:', err);
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleThumbnailUrlSubmit = () => {
    const url = prompt('Enter thumbnail image URL:');
    if (url && editingProject) {
      setEditingProject({ ...editingProject, thumbnailUrl: url });
    }
  };

  return (
    <div className="space-y-6" id="content-settings-manager">
      
      {/* Tab Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D6B46A]/15 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-widest font-bold">Studio Content Management</span>
          <h2 className="font-display text-2xl font-black text-[#111111] tracking-tight mt-0.5">Website Content Manager</h2>
        </div>
        
        {/* Sub-navigation controls tab buttons */}
        <div className="flex flex-wrap bg-[#FFFDF8] border border-[#D6B46A]/20 p-1 rounded-xl text-[10px] font-mono font-bold tracking-widest uppercase" id="content-sub-navigator">
          {[
            { id: 'services', label: 'Services' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'testimonials', label: 'Quotes' },
            { id: 'pages', label: 'Page Text' },
            { id: 'blog', label: 'Insights blog' },
            { id: 'legal', label: 'Legal text' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                subTab === tab.id 
                  ? 'bg-[#111111] text-white' 
                  : 'text-[#8A8178] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- SERVICES SUB MODE --- */}
      {subTab === 'services' && (
        <div className="space-y-4" id="subtab-services-view">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#8A8178]">Core Capabilities Grid Items: {services.length}</span>
            <button 
              onClick={handleAddService}
              className="px-4 py-2 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-[#D6B46A] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {services.map(srv => (
              <div key={srv.id} className="bg-white border border-[#D6B46A]/12 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between border-b border-[#D6B46A]/10 pb-3 mb-3">
                    <div>
                      <h4 className="font-display font-black text-sm text-[#111111]">{srv.title}</h4>
                      <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#BFA15A] block mt-0.5">{srv.category}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-emerald-100 bg-emerald-50 text-emerald-700 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8178] leading-relaxed mb-3"><strong>Core Deliverables:</strong> {srv.deliverables.join(', ')}</p>
                  <p className="text-xs text-[#111111]/80 italic">“{srv.headline} — {srv.solutionCopy}”</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D6B46A]/10">
                  <button 
                    onClick={() => setEditingService(srv)}
                    className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[10px] font-bold uppercase tracking-wider text-[#BFA15A] hover:text-[#111111] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Fields
                  </button>
                  <button 
                    onClick={() => handleDuplicateService(srv)}
                    className="p-1.5 bg-neutral-50 hover:bg-[#F8F4EE] border border-neutral-200 text-[#8A8178] hover:text-[#111111] rounded-lg transition-colors cursor-pointer"
                    title="Duplicate Service"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-200 hover:border-rose-300 text-[#8A8178] hover:text-rose-600 rounded-lg transition-colors cursor-pointer ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PORTFOLIO SUB MODE --- */}
      {subTab === 'portfolio' && (
        <div className="space-y-6" id="subtab-portfolio-view">
          
          {/* Sub Navigation for Portfolio Categories */}
          <div className="p-4 bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-2xl space-y-3 text-left">
            <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-wider font-extrabold block">Select Portfolio Category to Manage</span>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'websites', label: 'Websites' },
                { id: 'apps', label: 'Apps' },
                { id: 'brand-identity', label: 'Brand Identity' },
                { id: 'automations', label: 'Automations' },
                { id: 'bots', label: 'Telegram Bots' },
                { id: 'admin-ready', label: 'Admin-Ready Systems' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setPortfolioCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase cursor-pointer transition-all ${
                    portfolioCategory === cat.id
                      ? 'bg-[#111111] text-[#D6B46A] border-[#111111]'
                      : 'bg-white text-[#8A8178] border-[#D6B46A]/15 hover:border-[#D6B46A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Adds Section */}
          <div className="bg-white border border-[#D6B46A]/12 rounded-2xl p-4 space-y-3 text-left">
            <span className="text-[10px] font-mono text-[#8A8178] block uppercase font-bold tracking-wider">Quick Add Case Study Direct to Category</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleAddProject('websites')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Websites
              </button>
              <button 
                onClick={() => handleAddProject('apps')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Apps
              </button>
              <button 
                onClick={() => handleAddProject('brand-identity')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Brand Identity
              </button>
              <button 
                onClick={() => handleAddProject('automations')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Automations
              </button>
              <button 
                onClick={() => handleAddProject('bots')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Telegram Bots
              </button>
              <button 
                onClick={() => handleAddProject('admin-ready')}
                className="px-3 py-2 bg-[#FFFDF8] hover:bg-neutral-50 text-[10px] text-[#111111] font-mono font-bold uppercase tracking-wider rounded-xl border border-[#D6B46A]/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#BFA15A]" /> + Admin-Ready Systems
              </button>
            </div>
          </div>

          <div className="border-[#D6B46A]/10 border-t pt-2 text-left">
            <span className="text-xs font-mono font-bold text-[#8A8178]">
              {portfolioCategory === 'all' ? 'All' : portfolioCategory.charAt(0).toUpperCase() + portfolioCategory.slice(1)} Case Studies listed: {
                portfolioProjects.filter(p => portfolioCategory === 'all' || p.category === portfolioCategory).length
              }
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {portfolioProjects
              .filter(p => portfolioCategory === 'all' || p.category === portfolioCategory)
              .map(proj => (
                <div key={proj.id} className="bg-white border border-[#D6B46A]/12 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-[#D6B46A]/30 transition-all">
                  <div>
                    <div className="flex items-start justify-between border-b border-[#D6B46A]/10 pb-3 mb-3">
                      <div>
                        <h4 className="font-display font-black text-sm text-[#111111]">{proj.title}</h4>
                        <span className="text-[10px] font-mono text-[#8A8178] block mt-0.5">{proj.type}</span>
                      </div>
                      <span className="text-[9px] uppercase font-mono font-extrabold px-2.5 py-1 bg-[#D6B46A]/15 text-[#BFA15A] rounded border border-[#D6B46A]/20">
                        {proj.category}
                      </span>
                    </div>

                    {proj.thumbnailUrl && (
                      <SmartAdminThumbnail src={proj.thumbnailUrl} alt={proj.title} />
                    )}

                    <div className="space-y-1.5 text-xs text-[#8A8178]">
                      <p><strong>Problem:</strong> {proj.problem.slice(0, 95)}...</p>
                      <p><strong>Result:</strong> {proj.result}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[#D6B46A]/10">
                    <button 
                      onClick={() => setEditingProject(proj)}
                      className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[10px] font-bold uppercase tracking-wider text-[#BFA15A] hover:text-[#111111] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Case Study
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-100 hover:border-rose-300 text-[#8A8178] hover:text-rose-600 rounded-lg transition-colors cursor-pointer ml-auto"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- TESTIMONIALS SUB MODE --- */}
      {subTab === 'testimonials' && (
        <div className="space-y-4" id="subtab-testimonials-view">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#8A8178]">Core Client Testimonials: {testimonials.length}</span>
            <button 
              onClick={handleAddTestimonial}
              className="px-4 py-2 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-[#D6B46A] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Testimonial Quote
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white border border-[#D6B46A]/12 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between border-b border-[#D6B46A]/10 pb-3 mb-3">
                    <div>
                      <h4 className="font-display font-black text-sm text-[#111111]">{t.author}</h4>
                      <span className="text-[10px] text-[#8A8178] font-medium block mt-0.5">{t.role}, {t.company}</span>
                    </div>
                    {t.founderNote && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-yellow-50 text-amber-700 border border-amber-200 rounded">
                        Founder Highlight
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#111111]/85 italic leading-relaxed font-sans">“{t.quote}”</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[#D6B46A]/10">
                  <button 
                    onClick={() => setEditingTestimonial(t)}
                    className="px-3 py-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[10px] font-bold uppercase tracking-wider text-[#BFA15A] hover:text-[#111111] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Quote
                  </button>
                  <button 
                    onClick={() => handleDeleteTestimonial(t.id)}
                    className="p-1.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-100 hover:border-rose-300 text-[#8A8178] hover:text-rose-600 rounded-lg transition-colors cursor-pointer ml-auto"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PAGES SECTIONS SUB MODE --- */}
      {subTab === 'pages' && (
        <div className="space-y-4 text-left" id="subtab-sections-view">
          <div className="bg-[#FFFDF8] border border-[#D6B46A]/15 rounded-2xl p-5 flex items-center gap-3">
            <Info className="w-5 h-5 text-[#BFA15A] shrink-0" />
            <p className="text-xs text-[#8A8178] leading-relaxed">
              Below are the public static page sections dynamically initialized for SamaXon text controllers. Direct modifications instantly adjust Hero headings or paragraph quotes.
            </p>
          </div>

          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[#D6B46A]/10 bg-neutral-50 text-[10px] text-[#8A8178] font-bold uppercase tracking-wider">
              Static Section Content Blocks
            </div>
            <div className="divide-y divide-[#D6B46A]/10">
              {pageSections.map(sec => (
                <div key={sec.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FFFDF8] border border-[#D6B46A]/25 text-[#BFA15A] text-[9px] font-mono uppercase font-black rounded">
                        {sec.pageName}
                      </span>
                      <strong className="text-xs text-[#111111] font-display uppercase tracking-wider">{sec.sectionKey} section</strong>
                    </div>
                    {sec.sectionSubtitle && <p className="text-[10px] text-[#8A8178] font-bold">{sec.sectionSubtitle}</p>}
                    <h5 className="text-xs font-bold text-[#111111]">{sec.sectionTitle}</h5>
                    <p className="text-xs text-[#8A8178] italic line-clamp-2 pr-4">{sec.content}</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setEditingSection(sec)}
                      className="px-3.5 py-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[10px] font-bold uppercase tracking-wider text-[#BFA15A] hover:text-[#111111] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- RECENT INSIGHTS BLOG MODE --- */}
      {subTab === 'blog' && (
        <div className="space-y-4" id="subtab-blog-view">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#8A8178]">Published Insights: {blogs.length}</span>
            <button 
              onClick={handleAddBlog}
              className="px-4 py-2 bg-[#111111] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-[#D6B46A] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Draft New Blog Post
            </button>
          </div>

          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl overflow-hidden shadow-sm text-left">
            <div className="divide-y divide-[#D6B46A]/10">
              {blogs.map(post => (
                <div key={post.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-6 hover:bg-[#FFFDF8]/40 transition-colors">
                  <div className="space-y-1.5 max-w-xl">
                    <span className="text-[9px] font-mono uppercase bg-neutral-100 text-[#8A8178] px-2 py-0.5 rounded font-black">
                      {post.readTime}
                    </span>
                    <h4 className="font-display font-black text-sm text-[#111111]">{post.title}</h4>
                    <p className="text-xs text-[#8A8178]">{post.excerpt}</p>
                    <span className="text-[10px] text-[#8A8178] block">Published Date: {post.publishedAt} — by {post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingBlog(post)}
                      className="px-3.5 py-1.5 bg-[#FFFDF8] hover:bg-[#F8F4EE] border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[10px] font-bold uppercase tracking-wider text-[#BFA15A] hover:text-[#111111] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Post
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(post.id)}
                      className="p-1.5 bg-neutral-50 hover:bg-rose-50 border border-neutral-100 hover:border-rose-300 text-[#8A8178] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- LEGAL PAGES DISCLOSURES SUB MODE --- */}
      {subTab === 'legal' && (
        <div className="space-y-6 text-left" id="subtab-legal-view">
          <div className="bg-white border border-[#D6B46A]/15 rounded-3xl p-6 shadow-sm space-y-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#BFA15A] block border-b border-[#D6B46A]/10 pb-1.5">Configure Corporate Disclosures</span>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Privacy block */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-4 flex flex-col justify-between h-[200px]">
                <div>
                  <h4 className="text-xs font-bold text-[#111111] font-display uppercase tracking-wider">{legalPages.privacy?.title || 'Privacy Policy'}</h4>
                  <span className="text-[9px] font-mono text-[#8A8178] block mt-0.5">Updated: {legalPages.privacy?.lastUpdated}</span>
                  <p className="text-xs text-[#8A8178] mt-3 line-clamp-4 leading-relaxed font-sans">{legalPages.privacy?.content}</p>
                </div>
                <button 
                  onClick={() => {
                    const nextContent = prompt('Edit Privacy Policy body text:', legalPages.privacy?.content);
                    if (nextContent !== null) {
                      onUpdateLegalPages({
                        ...legalPages,
                        privacy: { ...legalPages.privacy, content: nextContent, lastUpdated: 'May 2026' }
                      });
                    }
                  }}
                  className="w-full text-center py-2 border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[9px] font-mono font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Edit privacy disclosure
                </button>
              </div>

              {/* Terms block */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-4 flex flex-col justify-between h-[200px]">
                <div>
                  <h4 className="text-xs font-bold text-[#111111] font-display uppercase tracking-wider">{legalPages.terms?.title || 'Terms & Conditions'}</h4>
                  <span className="text-[9px] font-mono text-[#8A8178] block mt-0.5">Updated: {legalPages.terms?.lastUpdated}</span>
                  <p className="text-xs text-[#8A8178] mt-3 line-clamp-4 leading-relaxed font-sans">{legalPages.terms?.content}</p>
                </div>
                <button 
                  onClick={() => {
                    const nextContent = prompt('Edit Terms and Conditions body text:', legalPages.terms?.content);
                    if (nextContent !== null) {
                      onUpdateLegalPages({
                        ...legalPages,
                        terms: { ...legalPages.terms, content: nextContent, lastUpdated: 'May 2026' }
                      });
                    }
                  }}
                  className="w-full text-center py-2 border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[9px] font-mono font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Edit terms contract
                </button>
              </div>

              {/* Refund block */}
              <div className="bg-[#FFFDF8] border border-[#D6B46A]/20 rounded-2xl p-4 flex flex-col justify-between h-[200px]">
                <div>
                  <h4 className="text-xs font-bold text-[#111111] font-display uppercase tracking-wider">{legalPages.refund?.title || 'Refund Policy'}</h4>
                  <span className="text-[9px] font-mono text-[#8A8178] block mt-0.5">Updated: {legalPages.refund?.lastUpdated}</span>
                  <p className="text-xs text-[#8A8178] mt-3 line-clamp-4 leading-relaxed font-sans">{legalPages.refund?.content}</p>
                </div>
                <button 
                  onClick={() => {
                    const nextContent = prompt('Edit Refund Policy body text:', legalPages.refund?.content);
                    if (nextContent !== null) {
                      onUpdateLegalPages({
                        ...legalPages,
                        refund: { ...legalPages.refund, content: nextContent, lastUpdated: 'May 2026' }
                      });
                    }
                  }}
                  className="w-full text-center py-2 border border-[#D6B46A]/20 hover:border-[#D6B46A] text-[9px] font-mono font-bold uppercase tracking-widest text-[#BFA15A] hover:text-[#111111] bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Edit Refund framework
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL OVERLAYS DIRECT CONTROLS --- */}
      <AnimatePresence>
        
        {/* EDITING SERVICE MODAL */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEditingService(null)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white border border-[#D6B46A]/35 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left">
              <h4 className="font-display font-black text-base text-[#111111]">Update Capability Card</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Service Title Name</label>
                  <input type="text" value={editingService.title} onChange={e => setEditingService({ ...editingService, title: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Target Headline Tag</label>
                  <input type="text" value={editingService.headline} onChange={e => setEditingService({ ...editingService, headline: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Client Pain point Statement</label>
                  <input type="text" value={editingService.painPoint} onChange={e => setEditingService({ ...editingService, painPoint: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">SamaXon Studio Solution</label>
                  <textarea rows={2} value={editingService.solutionCopy} onChange={e => setEditingService({ ...editingService, solutionCopy: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button onClick={() => setEditingService(null)} className="px-4 py-2 border border-neutral-200 text-xs text-[#8A8178] rounded-xl font-bold uppercase tracking-wider">Cancel</button>
                <button onClick={() => {
                  onUpdateServices(services.map(s => s.id === editingService.id ? editingService : s));
                  setEditingService(null);
                }} className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDITING OUTCOME PORTFOLIO MODAL */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEditingProject(null)} className="fixed inset-0 bg-neutral-900/60" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white border border-[#D6B46A]/35 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left my-8 z-10">
              <div className="flex items-center justify-between border-b border-[#D6B46A]/15 pb-3">
                <h4 className="font-display font-black text-base text-[#111111]">Update Portfolio Case Study</h4>
                <button 
                  onClick={() => setEditingProject(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Project Name</label>
                  <input type="text" value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg focus:border-[#D6B46A] outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Client Tag (e.g. Modern Web App)</label>
                    <input type="text" value={editingProject.type} onChange={e => setEditingProject({ ...editingProject, type: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg focus:border-[#D6B46A] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Category Group</label>
                    <CustomSelect 
                      value={editingProject.category} 
                      onChange={val => setEditingProject({ ...editingProject, category: val as any })}
                      options={[
                        { value: 'websites', label: 'Websites' },
                        { value: 'apps', label: 'Apps' },
                        { value: 'brand-identity', label: 'Brand Identity' },
                        { value: 'graphics', label: '8K Graphics' },
                        { value: 'automations', label: 'Automations' },
                        { value: 'bots', label: 'Telegram Bots' },
                        { value: 'admin-ready', label: 'Admin-Ready Systems' }
                      ]}
                    />
                  </div>
                </div>

                {/* --- IMAGE THUMBNAIL UPLOADER CORES --- */}
                <div className="space-y-2 border border-[#D6B46A]/15 bg-[#FFFDF8] p-3 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-[#BFA15A] tracking-wider font-extrabold block">Project Showcase Thumbnail</span>
                  
                  {editingProject.thumbnailUrl ? (
                    <div className="space-y-2">
                      <div className={`relative rounded-xl overflow-hidden border border-neutral-200 group transition-all duration-300 ${
                        editingImageIsPortrait
                          ? 'aspect-[3/4] h-60 mx-auto'
                          : 'aspect-[16/10] h-32 w-full'
                      }`}>
                        <img 
                          src={editingProject.thumbnailUrl} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover" 
                          onLoad={e => setEditingImageIsPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth * 1.05)} 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            type="button" 
                            onClick={() => setEditingProject({ ...editingProject, thumbnailUrl: undefined })}
                            className="px-3 py-1.5 bg-rose-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-lg shadow hover:bg-rose-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#8A8178] italic text-center">Thumbnail configured. Hover image to remove or click to replace.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      <label className="border border-dashed border-[#D6B46A]/30 hover:border-[#D6B46A] bg-white rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                        <Smartphone className="w-6 h-6 text-[#BFA15A] group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[11px] font-bold text-[#111111]">Upload local mockup image</span>
                        <span className="text-[9px] text-[#8A8178]">Drag & drop or Click to browse</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleThumbnailFileChange} 
                          className="hidden" 
                        />
                      </label>
                      <div className="text-center text-[10px] text-[#8A8178] my-0.5 font-bold">OR</div>
                      <button
                        type="button"
                        onClick={handleThumbnailUrlSubmit}
                        className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-200 text-[#111111] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-[#BFA15A]" />
                        Import Image via Public Web URL
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Diagnosed Obstacle (Problem)</label>
                  <textarea rows={2} value={editingProject.problem} onChange={e => setEditingProject({ ...editingProject, problem: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg outline-none focus:border-[#D6B46A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Visual Re-construction (Solution)</label>
                  <textarea rows={2} value={editingProject.solution} onChange={e => setEditingProject({ ...editingProject, solution: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg outline-none focus:border-[#D6B46A]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Validated Growth (Result)</label>
                  <input type="text" value={editingProject.result} onChange={e => setEditingProject({ ...editingProject, result: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg focus:border-[#D6B46A] outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3.5 border-t border-neutral-100">
                <button onClick={() => setEditingProject(null)} className="px-4 py-2 border border-neutral-200 text-xs text-[#8A8178] rounded-xl font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors">Cancel</button>
                <button 
                  onClick={() => {
                    onUpdatePortfolio(portfolioProjects.map(p => p.id === editingProject.id ? editingProject : p));
                    setEditingProject(null);
                  }} 
                  className="px-5 py-2 bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Save Case Study
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDITING SECTION CONTENT */}
        {editingSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setEditingSection(null)} className="absolute inset-0 bg-neutral-900/60" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white border border-[#D6B46A]/35 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left">
              <h4 className="font-display font-black text-base text-[#111111]">Update Page Section Title & Text</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Headline Text Title</label>
                  <input type="text" value={editingSection.sectionTitle} onChange={e => setEditingSection({ ...editingSection, sectionTitle: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A8178] uppercase block mb-1">Description Content</label>
                  <textarea rows={4} value={editingSection.content} onChange={e => setEditingSection({ ...editingSection, content: e.target.value })} className="w-full px-3 py-2 border border-[#D6B46A]/20 rounded-lg outline-none leading-relaxed" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setEditingSection(null)} className="px-4 py-2 border border-neutral-200 text-xs text-[#8A8178] rounded-xl font-bold uppercase tracking-wider">Cancel</button>
                <button onClick={() => {
                  onUpdatePageSections(pageSections.map(s => s.id === editingSection.id ? editingSection : s));
                  setEditingSection(null);
                }} className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded-xl">Apply section update</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* INTERACTIVE ASPECT RATIO & QUALITY CROPPER MODAL */}
        {rawUploadedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-xs font-sans" id="cropper-lab-portal">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.6 }} 
              exit={{ opacity: 0 }} 
              onClick={() => { if (!isProcessingCrop) setRawUploadedImage(null); }} 
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative bg-[#111111] leading-normal text-white border border-[#D6B46A]/25 rounded-[32px] p-6 w-full max-w-2xl shadow-2xl flex flex-col justify-between max-h-[95vh] z-10"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D6B46A] animate-pulse" />
                    <span className="text-[9px] font-mono uppercase text-[#D6B46A] tracking-wider font-extrabold text-left">Creative Crop Lab</span>
                  </div>
                  <h3 className="font-display text-lg font-black tracking-tight text-white mt-0.5 text-left">Custom Aspect Ratio & Sharp Crop Assistant</h3>
                  <p className="text-[#8A8178] text-[11px] mt-0.5 text-left">Choose the standard layout viewport to automatically crop and focus your screenshot.</p>
                </div>
                
                {!isProcessingCrop && (
                  <button 
                    onClick={() => setRawUploadedImage(null)}
                    className="p-1.5 border border-white/10 text-neutral-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Visual Crop Frame Area */}
              <div className="py-5 flex flex-col md:flex-row gap-5 items-stretch">
                
                {/* Live Sandbox Preview */}
                <div className="flex-1 bg-neutral-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4 relative min-h-[220px] max-h-[300px] overflow-hidden">
                  <span className="absolute top-2 left-3 text-[8px] font-mono text-neutral-500 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded font-bold">Center-Focused Preview Frame</span>
                  
                  <div className={`overflow-hidden rounded-xl border border-[#D6B46A]/40 transition-all duration-300 relative shadow-xl bg-black ${
                    selectedCropRatio === '16:9' ? 'aspect-video w-full max-w-[280px]' :
                    selectedCropRatio === '9:16' ? 'aspect-[9/16] h-48' :
                    selectedCropRatio === '3:4' ? 'aspect-[3/4] h-48' :
                    selectedCropRatio === '1:1' ? 'aspect-square h-44' : 'w-full max-h-48 object-contain'
                  }`}>
                    <img src={rawUploadedImage} className="w-full h-full object-cover" alt="Crop Viewport Content" />
                    <div className="absolute inset-0 border border-white/20 pointer-events-none flex items-center justify-center">
                      {/* Grid lines to feel super laboratory precise */}
                      <div className="absolute inset-x-0 h-px bg-white/20" />
                      <div className="absolute inset-y-0 w-px bg-white/20" />
                      <div className="absolute top-1/3 inset-x-0 h-px bg-white/10" />
                      <div className="absolute bottom-1/3 inset-x-0 h-px bg-white/10" />
                      <div className="absolute left-1/3 inset-y-0 w-px bg-white/10" />
                      <div className="absolute right-1/3 inset-y-0 w-px bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Ratio Selector Sidebar Panels */}
                <div className="w-full md:w-64 space-y-2 flex flex-col justify-center text-left">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 font-extrabold tracking-wider block">Standard Crop Layouts</span>
                  
                  {[
                    { id: '16:9', title: '16:9 Widescreen', desc: 'Websites, automations & web interfaces' },
                    { id: '3:4', title: '3:4 Portrait Screen', desc: 'Premium Telegram bots & classic screen structures' },
                    { id: '9:16', title: '9:16 Mobile Portrait', desc: 'Mobile App concepts & high-end layouts' },
                    { id: '1:1', title: '1:1 Balanced Square', desc: 'Logos, graphics & typography shapes' },
                    { id: 'original', title: 'Keep Source', desc: 'No structural cropping (retains raw aspect)' }
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedCropRatio(option.id as any)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        selectedCropRatio === option.id 
                          ? 'bg-[#D6B46A] border-[#D6B46A] text-black shadow-lg shadow-[#D6B46A]/10 scale-[1.02]' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <h5 className="text-[11px] font-bold leading-tight">{option.title}</h5>
                        <p className={`text-[9px] mt-0.5 leading-snug ${selectedCropRatio === option.id ? 'text-black/80' : 'text-neutral-400'}`}>{option.desc}</p>
                      </div>
                      {selectedCropRatio === option.id && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality & Sharpness guarantee */}
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-2.5 mb-2 text-left">
                <Sparkles className="w-4 h-4 text-champagne-gold shrink-0 mt-0.5" />
                <p className="text-[10px] text-neutral-300 leading-normal font-sans">
                  <strong>High-Resolution Assurance:</strong> To answer your quality preference, SamaXon Studio processes details up to <strong>1920px</strong> wide with <strong>95% JPEG sharpness</strong>. This preserves extreme screenshot details while keeping memory limits stable.
                </p>
              </div>

              {/* Action Buttons Footer block */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  disabled={isProcessingCrop}
                  onClick={() => setRawUploadedImage(null)}
                  className="px-4 py-2 border border-white/10 text-xs text-neutral-400 hover:text-white rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessingCrop}
                  onClick={handleApplyCrop}
                  className="px-6 py-2 bg-[#D6B46A] hover:bg-[#BFA15A] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
                >
                  {isProcessingCrop ? (
                    <>
                      <span className="w-3 h-3 rounded-full border border-black/30 border-t-black animate-spin shrink-0" />
                      Processing Image...
                    </>
                  ) : (
                    'Confirm & Process Crop'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}



      </AnimatePresence>

    </div>
  );
}
