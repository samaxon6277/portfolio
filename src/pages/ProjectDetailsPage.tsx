import { motion } from "framer-motion"
import { ExternalLink, Loader2, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const [project, setProject] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    const docRef = doc(db, "projects", id);
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProject(null);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-neo-bg text-neo-text font-sans min-h-screen">
         <Navbar />
         <div className="flex justify-center items-center h-screen">
           <Loader2 className="w-12 h-12 text-neo-accent animate-spin" />
         </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="bg-neo-bg text-neo-text font-sans min-h-screen">
         <Navbar />
         <div className="flex flex-col justify-center items-center h-screen space-y-4">
           <h1 className="text-3xl font-display font-bold">Project not found</h1>
           <Link to="/projects" className="text-neo-accent hover:underline flex items-center gap-2">
             <ArrowLeft className="w-4 h-4"/> Back to Projects
           </Link>
         </div>
      </div>
    )
  }

  return (
    <div className="bg-neo-bg text-neo-text font-sans min-h-screen">
      <Navbar />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <Link to="/projects" className="inline-flex items-center gap-2 text-neo-text-dim hover:text-neo-text transition-colors mb-10">
          <ArrowLeft className="w-4 h-4"/> Back to Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-neo-text-dim mb-10">
            {project.client && (
              <div className="bg-neo-surface px-4 py-2 rounded-xl geo-inner-shadow">
                <span className="font-bold block text-xs uppercase opacity-70">Client</span>
                <span className="text-white">{project.client}</span>
              </div>
            )}
            {project.role && (
              <div className="bg-neo-surface px-4 py-2 rounded-xl geo-inner-shadow">
                <span className="font-bold block text-xs uppercase opacity-70">Role</span>
                <span className="text-white">{project.role}</span>
              </div>
            )}
            {project.timeline && (
              <div className="bg-neo-surface px-4 py-2 rounded-xl geo-inner-shadow">
                <span className="font-bold block text-xs uppercase opacity-70">Timeline</span>
                <span className="text-white">{project.timeline}</span>
              </div>
            )}
          </div>

          <div className="w-full h-[400px] md:h-[500px] mb-12 rounded-3xl overflow-hidden geo-card">
            <img 
               src={project.clientLogo || "https://res.cloudinary.com/demo/image/upload/w_1200,q_80/sample.jpg"} 
               alt={project.title}
               className="w-full h-full object-cover" 
             />
          </div>

          <div className="prose prose-invert max-w-none text-neo-text-dim pt-4">
             <h2 className="text-2xl font-display font-bold text-white mb-4">Overview</h2>
             <p className="whitespace-pre-wrap text-lg leading-relaxed">{project.description}</p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            {project.techStack?.map((tech: string, i: number) => (
               <span key={i} className="px-4 py-2 text-sm font-mono rounded-xl geo-inner-shadow bg-neo-surface text-neo-text">
                 {tech}
               </span>
            ))}
          </div>

          {project.url && (
            <div className="mt-16">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="geo-btn inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold bg-neo-accent text-white">
                 Visit Live Site <ExternalLink className="w-5 h-5"/>
              </a>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
