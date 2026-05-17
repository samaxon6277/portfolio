import { Link } from "react-router-dom";
import { useGlobalSettings } from "../lib/SettingsContext";

export default function Footer() {
  const settings = useGlobalSettings();

  return (
    <footer className="py-12 mt-24 border-t border-neo-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <a href="#home" className="text-2xl font-bold font-display geo-gradient-text tracking-wider inline-block mb-2 uppercase">
              {settings?.portfolioName || "SAMAXON"}
            </a>
            <p className="text-neo-text-dim text-sm">
              {settings?.tagline || "Crafting premium digital experiences."}
            </p>
          </div>
          
          <div className="flex space-x-6 items-center">
            {["Home", "Projects", "Services", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-neo-text-dim hover:text-neo-accent transition-colors">
                {link}
              </a>
            ))}
          </div>
          
          <div className="text-sm text-neo-text-disabled text-center md:text-right">
            &copy; {new Date().getFullYear()} {settings?.businessName || "SamaXon"}. <br className="md:hidden" /> All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
