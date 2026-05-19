import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useGlobalSettings } from "../lib/SettingsContext"
import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { main: "Restart", sub: "Home Page", href: "/" },
  { main: "Status", sub: "About", href: "/about" },
  { main: "Inventory", sub: "Portfolio", href: "/projects" },
  { main: "Quest Log", sub: "Blog", href: "/quests" },
  { main: "Summon", sub: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const settings = useGlobalSettings()
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-neo-bg/80 backdrop-blur-md geo-shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                {settings?.logoImageUrl ? (
                  <img src={settings.logoImageUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-neo-surface" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neo-surface flex items-center justify-center border-2 border-neo-surface text-neo-heading font-display">
                    P1
                  </div>
                )}
              </Link>
            </div>
            
            <div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 rounded-full border-2 border-neo-text-disabled flex items-center justify-center text-neo-text-dim hover:text-neo-text hover:border-neo-text transition-colors focus:outline-none"
              >
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-current rounded-full" />
                  <div className="w-1 h-4 bg-current rounded-full" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Heavy Gaussian Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neo-bg/50 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#1E2029] p-8 pb-10 border border-neo-surface"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-neo-surface border-2 border-neo-bg rounded-full flex items-center justify-center text-neo-text-dim hover:text-white transition-colors geo-shadow"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <h2 className="text-center text-2xl font-display text-white mb-10 tracking-[0.2em] uppercase">
                Pause Menu
              </h2>

              {/* Menu Links */}
              <div className="flex flex-col items-center space-y-6 mb-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center group text-center"
                  >
                    <span className="text-xl font-bold text-white group-hover:text-neo-cyan transition-colors">
                      {link.main}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-neo-text-dim mt-1">
                      {link.sub}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Search Box */}
              <div className="mt-8 pt-8 border-t border-neo-surface/50">
                <label className="block text-xs uppercase tracking-widest text-neo-text-dim mb-2 text-center">
                  Search
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="..."
                    className="w-full bg-[#15171E] text-white px-4 py-3 rounded-md border-none outline-none focus:ring-1 focus:ring-neo-cyan text-center"
                  />
                  <button className="w-full py-3 bg-neo-cyan text-[#1E2029] font-bold rounded-full hover:opacity-90 transition-opacity">
                    SEARCH
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
