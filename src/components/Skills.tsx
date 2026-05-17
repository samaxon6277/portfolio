import { motion } from "framer-motion"
import { useGlobalSettings } from "../lib/SettingsContext"

export default function Skills() {
  const settings = useGlobalSettings();
  const defaultSkills = [
    "React", "Firebase", "Cloudinary", "Tailwind CSS",
    "Vite", "Responsive Design", "Graphic Design", "AI Tools"
  ];

  const skillsToDisplay = settings?.skills && settings.skills.length > 0 ? settings.skills : defaultSkills;

  return (
    <section id="skills" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">Core Skills</span>
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-neo-elevated rounded-full overflow-hidden">
               <motion.span 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1 }}
                 className="block h-full bg-gradient-to-r from-neo-purple to-neo-cyan"
               />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsToDisplay.map((skill: string, idx: number) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="geo-card hover:border-neo-accent/30 transition-colors bg-neo-surface p-6 rounded-2xl flex flex-col items-center justify-center text-center h-32"
            >
              <h3 className="font-bold font-display text-neo-text">{skill}</h3>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  )
}
