import { motion } from "framer-motion"
import { Download, Code, Palette, Zap, Globe } from "lucide-react"
import { useGlobalSettings } from "../lib/SettingsContext";

export default function About() {
  const settings = useGlobalSettings();
  
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">About Me</span>
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-neo-elevated rounded-full overflow-hidden">
               <motion.span 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1 }}
                 className="block h-full bg-gradient-to-r from-neo-accent to-neo-purple"
               />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Bio Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 geo-card p-8 md:p-10"
          >
            <h3 className="text-2xl font-bold font-display mb-4">{settings?.aboutTitle || "My Journey"}</h3>
            <p className="text-neo-text-dim text-lg leading-relaxed mb-8">
              {settings?.aboutBio || "I am a passionate creative developer bridging the gap between beautiful design and robust engineering. With a deep focus on neumorphism, modern interfaces, and scalable architectures, I craft digital products that not only look stunning but perform flawlessly."}
            </p>
            
            {settings?.resumeUrl && (
               <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-2 geo-btn px-6 py-3 rounded-xl font-medium text-neo-accent hover:text-neo-cyan transition-colors">
                 <Download className="w-5 h-5" />
                 <span>Download CV</span>
               </a>
            )}

          </motion.div>

          {/* Stats Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 md:flex md:flex-col"
          >
            <div className="geo-card p-6 flex flex-col items-center justify-center text-center h-full">
              <span className="text-4xl font-bold font-display text-neo-purple mb-2">3+</span>
              <span className="text-sm font-medium text-neo-text-dim uppercase tracking-wider">Years Exp.</span>
            </div>
            
            <div className="geo-card p-6 flex flex-col items-center justify-center text-center h-full">
              <span className="text-4xl font-bold font-display text-neo-cyan mb-2">50+</span>
              <span className="text-sm font-medium text-neo-text-dim uppercase tracking-wider">Projects</span>
            </div>
          </motion.div>

          {/* Mini Skill Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
             {[
               { icon: <Code />, title: "Frontend" },
               { icon: <Palette />, title: "UI/UX" },
               { icon: <Zap />, title: "Optimization" },
               { icon: <Globe />, title: "Responsive" }
             ].map((item, i) => (
               <div key={i} className="geo-inner-shadow bg-neo-surface p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                 <div className="w-12 h-12 rounded-full geo-btn flex items-center justify-center mb-4 text-neo-text-dim group-hover:text-neo-accent transition-colors">
                   {item.icon}
                 </div>
                 <span className="font-semibold">{item.title}</span>
               </div>
             ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
