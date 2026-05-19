import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Component, FileText, MessageSquare, BarChart, Settings, LogOut, FileImage, Globe, X } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { useEffect } from "react";

import { useGlobalSettings } from "../../lib/SettingsContext";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  const settings = useGlobalSettings();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard", exact: true, shortcut: "O" },
    { icon: FolderKanban, label: "Projects", path: "/dashboard/projects", shortcut: "P" },
    { icon: Component, label: "Services", path: "/dashboard/services", shortcut: "V" },
    { icon: FileText, label: "Blogs", path: "/dashboard/blogs", shortcut: "B" },
    { icon: MessageSquare, label: "Messages", path: "/dashboard/messages", shortcut: "M" },
    { icon: BarChart, label: "Analytics", path: "/dashboard/analytics", shortcut: "A" },
    { icon: FileImage, label: "Media", path: "/dashboard/media", shortcut: "E" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings", shortcut: "S" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore text input focus
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      
      const key = e.key.toUpperCase();
      const targetItem = navItems.find(item => item.shortcut === key);
      
      if (targetItem) {
        navigate(targetItem.path);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" 
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1B1B1B] border-r border-white/5 flex flex-col h-full transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex flex-shrink-0 items-center justify-between px-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-3">
            {(!settings?.logo_type || settings?.logo_type === 'image' || settings?.logo_type === 'both') && settings?.logo_url && (
              <img src={settings.logo_url} alt="Logo" className="w-8 h-8 rounded-full object-cover" />
            )}
            {(!settings?.logo_url || settings?.logo_type === 'text' || settings?.logo_type === 'both') && (
              <span className="font-display font-bold text-xl tracking-wider uppercase text-[#2984FF]">
                {settings?.logo_text || settings?.company_name || 'SAMAXON'}
              </span>
            )}
          </Link>
          <button className="md:hidden text-[#A8AFBD] hover:text-white" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-semibold text-[#A8AFBD] uppercase tracking-wider mb-4 px-4">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.exact}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              title={`Shortcut: ${item.shortcut}`}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#2984FF]/10 text-[#2984FF] shadow-[0_0_15px_rgba(41,132,255,0.1)]"
                    : "text-[#A8AFBD] hover:text-white hover:bg-white/5"
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex-shrink-0 space-y-2">
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-[#A8AFBD] hover:bg-white/5 hover:text-white transition-colors w-full">
          <Globe className="w-5 h-5" />
          <span className="font-medium">View Site</span>
        </Link>
        <button onClick={logOut} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
}
