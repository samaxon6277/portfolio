import { motion } from "framer-motion"
import { ArrowRight, Github, Code2, Sparkles, Linkedin, FileText } from "lucide-react"
import { useGlobalSettings } from "../lib/SettingsContext"

export default function Hero() {
  const settings = useGlobalSettings();

  return (
    <section id="home" className="min-h-screen pt-20 flex items-center relative overflow-hidden">
      {/* Floating abstract objects background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-neo-purple rounded-full blur-[100px] opacity-30"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neo-accent rounded-full blur-[120px] opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full geo-inner-shadow bg-neo-surface mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-medium text-neo-text-dim">Available for Freelance</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4">
                Hi, I'm <br/>
                <span className="geo-gradient-text">{settings?.portfolioName?.split(" ")[0] || "Samar"}</span>
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-neo-text-dim font-display">
                {settings?.aboutSubtitle || `Founder of ${settings?.businessName || "SamaXon"} Agency`}
              </h2>
              
              <p className="mt-6 text-lg text-neo-text-dim max-w-lg mx-auto md:mx-0">
                {settings?.tagline || settings?.aboutBio?.slice(0, 150) + "..." || "Crafting premium, interactive, and modern digital experiences with a futuristic touch. I turn ideas into converting realities."}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"
            >
              <a href="#projects" className="geo-btn px-8 py-4 rounded-xl flex items-center space-x-2 font-semibold">
                <span>View Projects</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="geo-inner-shadow bg-neo-surface px-8 py-4 rounded-xl flex items-center space-x-2 font-semibold hover:text-neo-accent transition-colors">
                <span>Contact Me</span>
              </a>
              <div className="flex pl-4 space-x-4">
                 {settings?.socialLinks?.find((l: any) => l.platform === 'GitHub' && l.enabled && l.url) && (
                  <a href={settings.socialLinks.find((l: any) => l.platform === 'GitHub')?.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full geo-btn flex items-center justify-center hover:text-neo-accent">
                    <Github className="w-5 h-5" />
                  </a>
                 )}
                 {settings?.socialLinks?.find((l: any) => l.platform === 'LinkedIn' && l.enabled && l.url) && (
                  <a href={settings.socialLinks.find((l: any) => l.platform === 'LinkedIn')?.url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full geo-btn flex items-center justify-center hover:text-neo-accent">
                    <Linkedin className="w-5 h-5" />
                  </a>
                 )}
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full max-w-md hidden md:block"
          >
            <div className="relative aspect-square">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-neo-text-disabled/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-neo-text-disabled/30 animate-[spin_15s_linear_infinite_reverse]" />
              
              {/* Center Element */}
              <div className="absolute inset-8 rounded-full geo-card flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neo-surface to-neo-elevated" />
                <div className="relative z-10 w-full h-full p-2">
                  {settings?.avatarUrl ? (
                     <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                     <div className="flex flex-col items-center justify-center space-y-4 w-full h-full">
                       <Code2 className="w-20 h-20 text-neo-accent" />
                       <Sparkles className="w-10 h-10 text-neo-purple" />
                     </div>
                  )}
                </div>
              </div>

              {/* Floating badges */}
              {settings?.skills && settings.skills.length >= 2 && (
                <>
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 -left-10 geo-btn px-4 py-2 rounded-xl flex items-center space-x-2 backdrop-blur-md"
                  >
                    <div className="w-3 h-3 rounded-full bg-neo-cyan geo-glow-text" />
                    <span className="font-medium text-sm">{settings.skills[0]}</span>
                  </motion.div>
                  
                  <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 -right-10 geo-btn px-4 py-2 rounded-xl flex items-center space-x-2 backdrop-blur-md"
                  >
                    <div className="w-3 h-3 rounded-full bg-neo-purple geo-glow-text" />
                    <span className="font-medium text-sm">{settings.skills[1]}</span>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
