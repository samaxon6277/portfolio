import { Github, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { useGlobalSettings } from "../lib/SettingsContext";

export default function Footer() {
  const settings = useGlobalSettings();

  return (
    <footer className="relative pt-32 pb-12 mt-24 overflow-hidden bg-neo-bg">
      {/* Top curve */}
      <div className="absolute top-0 left-0 w-full h-[100px] border-t border-neo-surface bg-neo-surface/30" style={{ borderTopLeftRadius: '50%', borderTopRightRadius: '50%', transform: 'scaleX(1.5) translateY(-50px)' }}></div>
      <div className="absolute top-0 left-0 w-full h-[150px] bg-neo-bg" style={{ borderTopLeftRadius: '50%', borderTopRightRadius: '50%', transform: 'scaleX(1.5) translateY(0)' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {/* Social Icons row */}
        <div className="flex space-x-6 mb-12">
          {settings?.socialLinks?.find((l: any) => l.platform === 'GitHub' && l.url) ? (
             <a href={settings.socialLinks.find((l: any) => l.platform === 'GitHub').url} className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all">
                <Github className="w-5 h-5" />
             </a>
          ) : (
            <a href="#" className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all"><Github className="w-5 h-5" /></a>
          )}

          {settings?.socialLinks?.find((l: any) => l.platform === 'Twitter' && l.url) ? (
             <a href={settings.socialLinks.find((l: any) => l.platform === 'Twitter').url} className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all">
                <Twitter className="w-5 h-5" />
             </a>
          ) : (
            <a href="#" className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all"><Twitter className="w-5 h-5" /></a>
          )}
          
          {settings?.socialLinks?.find((l: any) => l.platform === 'LinkedIn' && l.url) ? (
             <a href={settings.socialLinks.find((l: any) => l.platform === 'LinkedIn').url} className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all">
                <Linkedin className="w-5 h-5" />
             </a>
          ) : (
             <a href="#" className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all"><Linkedin className="w-5 h-5" /></a>
          )}
          
          {settings?.socialLinks?.find((l: any) => l.platform === 'Instagram' && l.url) ? (
             <a href={settings.socialLinks.find((l: any) => l.platform === 'Instagram').url} className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all">
                <Instagram className="w-5 h-5" />
             </a>
          ) : (
             <a href="#" className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all"><Instagram className="w-5 h-5" /></a>
          )}

          <a href="#contact" className="w-12 h-12 rounded-full border-2 border-neo-cyan text-neo-cyan flex items-center justify-center hover:bg-neo-cyan hover:text-[#1E2029] transition-all">
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-neo-text-dim text-xs font-mono uppercase tracking-widest mb-2">
            &copy; {new Date().getFullYear()} {settings?.company_name || "SamaXon"}
          </p>
          <p className="text-neo-text-disabled text-xs font-mono">
            Proudly powered by AI Studio
          </p>
        </div>
      </div>
    </footer>
  )
}
