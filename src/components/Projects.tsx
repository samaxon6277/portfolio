import { motion } from "framer-motion"
import { ExternalLink, Github, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, limit, where } from "firebase/firestore"
import { db } from "../lib/firebase"
import { Link } from "react-router-dom"

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "projects"), where("status", "==", "Published"), orderBy("createdAt", "desc"), limit(4));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Failed to load projects:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <section id="projects" className="py-24 relative min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">Featured Work</span>
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

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 text-neo-accent animate-spin" />
           </div>
        ) : projects.length === 0 ? (
           <div className="text-center text-neo-text-dim py-20">
             No projects found.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="geo-card group overflow-hidden flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
                  <div className="absolute inset-0 bg-neo-surface mix-blend-color z-10 opacity-40 group-hover:opacity-0 transition-opacity duration-500" />
                  <img 
                    src={proj.clientLogo || "https://res.cloudinary.com/demo/image/upload/w_800,q_80/sample.jpg"} 
                    alt={proj.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-neo-bg/80 backdrop-blur-sm z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full geo-btn flex items-center justify-center text-neo-text hover:text-neo-accent">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <Link to={`/projects/${proj.id}`} className="px-4 h-12 rounded-full geo-btn flex items-center justify-center text-neo-text hover:text-neo-purple font-bold">
                      View Details
                    </Link>
                  </div>
                </div>
                
                {/* Content Box */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-sm font-bold text-neo-purple uppercase tracking-wider mb-2">
                    {proj.timeline || "Completed"}
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-neo-text-dim mb-6 flex-1 line-clamp-3">
                    {proj.role} - {proj.description || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {proj.techStack?.slice(0, 3).map((tag: string, tIdx: number) => (
                      <span 
                        key={tIdx}
                        className="px-3 py-1 text-xs font-mono rounded-lg geo-inner-shadow bg-neo-surface text-neo-text-dim"
                      >
                        {tag}
                      </span>
                    ))}
                    {proj.techStack && proj.techStack.length > 3 && (
                      <span className="px-3 py-1 text-xs font-mono rounded-lg geo-inner-shadow bg-neo-surface text-neo-text-dim">
                        +{proj.techStack.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/projects" className="inline-flex geo-btn px-8 py-4 rounded-xl font-bold text-neo-text hover:text-neo-accent transition-colors">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
