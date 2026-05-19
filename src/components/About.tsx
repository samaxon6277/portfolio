import { motion } from "motion/react"
import { useGlobalSettings } from "../lib/SettingsContext";

export default function About() {
  const settings = useGlobalSettings();
  
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display inline-block relative text-white tracking-[0.2em] uppercase">
            Status
          </h2>
          <p className="text-neo-text-dim uppercase tracking-widest text-sm mt-4 font-mono">Current Identity</p>
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Large circular photo */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="w-48 h-48 rounded-full border-4 border-neo-surface p-1 mb-10 overflow-hidden relative"
          >
            {settings?.avatarUrl ? (
              <img src={settings.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-500" />
            ) : (
              <div className="w-full h-full rounded-full bg-neo-surface flex items-center justify-center font-mono text-neo-text-dim text-sm">NO IMAGE</div>
            )}
            <div className="absolute inset-0 border-2 border-neo-cyan rounded-full mix-blend-overlay"></div>
          </motion.div>

          {/* Text heavy, left-aligned standard paragraphs */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="w-full text-left space-y-6 text-white mb-16"
          >
            <p className="text-lg leading-relaxed">
              {settings?.aboutBio || "I am Samar, a passionate creative Full-Stack Developer bridging the gap between beautiful design and robust engineering. I build tools for SamaXon to craft digital products that not only look stunning but perform flawlessly."}
            </p>
          </motion.div>

          {/* Resume/Skills formatting: Centered text, using thin horizontal lines */}
          <div className="w-full">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.1 }}
              className="border-t border-neo-text-disabled/30 pt-8 pb-8 text-center"
            >
              <h3 className="text-neo-cyan font-mono tracking-widest uppercase mb-4 text-sm">Freelance & Contract</h3>
              <p className="text-white">Full-Stack Developer, SamaXon</p>
              <p className="text-neo-text-dim text-sm mt-1">2020 - Present</p>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.2 }}
              className="border-t border-neo-text-disabled/30 pt-8 pb-8 text-center"
            >
              <h3 className="text-neo-cyan font-mono tracking-widest uppercase mb-4 text-sm">Employment</h3>
              <p className="text-white">Senior Software Engineer, TechCorp</p>
              <p className="text-neo-text-dim text-sm mt-1">2018 - 2020</p>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3 }}
              className="border-t border-neo-text-disabled/30 pt-8 pb-8 text-center"
            >
              <h3 className="text-neo-cyan font-mono tracking-widest uppercase mb-4 text-sm">Skills</h3>
              <div className="flex flex-wrap justify-center gap-4 text-white">
                {(settings?.skills || ["React", "TypeScript", "Node.js", "TailwindCSS"]).map((skill: string, i: number) => (
                  <motion.span 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="px-4 py-2 border border-neo-surface rounded-full text-sm hover:border-neo-cyan transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.4 }}
              className="border-t border-neo-text-disabled/30 pt-8 pb-8 text-center"
            >
              <h3 className="text-neo-cyan font-mono tracking-widest uppercase mb-4 text-sm">Education</h3>
              <p className="text-white">B.S. in Computer Science</p>
              <p className="text-neo-text-dim text-sm mt-1">University of Technology</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
