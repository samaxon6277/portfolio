import { motion } from "motion/react"
import { useGlobalSettings } from "../lib/SettingsContext"
import { Link } from "react-router-dom"

export default function Hero() {
  const settings = useGlobalSettings()

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden text-center px-4 w-full">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 max-w-3xl rounded-full bg-neo-cyan/5 blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-12 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex-col items-center"
        >
          {/* Top Identifier */}
          <div className="mb-6 flex space-x-2 items-center justify-center text-neo-text-disabled">
            <span className="h-px bg-neo-surface w-8"></span>
            <span className="font-mono text-xs tracking-widest uppercase">Version 2.0.4 Online</span>
            <span className="h-px bg-neo-surface w-8"></span>
          </div>

          {/* Subtitle */}
          <h2 className="text-neo-cyan font-mono text-sm sm:text-base md:text-lg mb-6 tracking-[0.2em] uppercase">
            {settings?.tagline || "Odyssey of a Full-Stack Developer"}
          </h2>

          {/* Huge Main Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display text-white tracking-[0.2em] mb-12 uppercase" style={{ fontWeight: 100 }}>
            {settings?.company_name || "SAMAR"}
          </h1>
          
          {/* Brief Intro */}
          <p className="text-neo-text-dim text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed uppercase tracking-widest font-mono">
            {settings?.about_subtitle || "Crafting digital experiences across the web canvas. Ready for deployment and execution."}
          </p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/contact" 
              className="px-10 py-4 bg-neo-cyan text-[#1E2029] font-bold rounded-full hover:opacity-90 transition-opacity tracking-widest uppercase text-sm w-64 text-center geo-shadow"
            >
              Summon Me
            </Link>
            <Link 
              to="/about" 
              className="px-10 py-4 bg-transparent border-2 border-neo-text-disabled text-white font-bold rounded-full hover:bg-neo-surface transition-colors tracking-widest uppercase text-sm w-64 text-center"
            >
              About Me
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator Bottom */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-neo-text-disabled pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase mb-2">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-neo-cyan to-transparent"></div>
      </motion.div>
    </section>
  )
}
