import { motion } from "framer-motion"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore"
import { db } from "../lib/firebase"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0,0);
    const q = query(collection(db, "projects"), where("status", "==", "Published"), orderBy("createdAt", "desc"));
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
    <div className="bg-neo-bg text-neo-text font-sans min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display"
          >
            All <span className="geo-gradient-text">Projects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-neo-text-dim text-lg max-w-2xl mx-auto"
          >
            A comprehensive look at my portfolio and case studies.
          </motion.p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
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
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-neo-purple uppercase tracking-wider mb-2">
                    {proj.timeline || "Completed"}
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">
                    {proj.title}
                  </h3>
                  <p className="text-neo-text-dim text-sm mb-6 flex-1 line-clamp-3">
                    {proj.description || "No description available."}
                  </p>
                  <div className="flex gap-2">
                     <Link to={`/projects/${proj.id}`} className="text-sm font-bold text-neo-accent hover:underline">
                        Read Case Study →
                     </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
