import { motion } from "motion/react"
import { ExternalLink, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0,0);
    let mounted = true;

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'Published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted && data) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();

    const sub = supabase.channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchProjects)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, []);

  return (
    <>
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-neo-cyan font-mono text-sm tracking-widest uppercase hover:underline">
            ← Return to Base
          </Link>
        </div>
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-display tracking-[0.1em] uppercase text-white"
          >
            Full <span className="text-neo-cyan">Inventory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-neo-text-dim text-lg max-w-2xl mx-auto uppercase tracking-widest font-mono"
          >
            All gathered artifacts and projects.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (idx % 3) * 0.1, duration: 0.5 }}
                className="bg-neo-surface rounded-md relative flex flex-col group border border-neo-surface hover:border-neo-cyan transition-colors"
              >
                {/* Rectangular thumbnail */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-md">
                  <div className="absolute inset-0 bg-neo-bg/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img 
                    src={proj.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} 
                    alt={proj.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                  />
                </div>
                
                {/* Circular logo/icon overlapping the border */}
                <div className="absolute top-48 left-8 w-16 h-16 bg-[#1E2029] border-4 border-neo-surface rounded-full flex items-center justify-center z-20 group-hover:border-neo-cyan transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                
                {/* Content Box */}
                <div className="p-8 pt-12 flex-1 flex flex-col">
                  <div className="text-xs font-mono text-neo-text-dim mb-3 uppercase flex items-center justify-between">
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                    <span>{proj.timeline || "Class: Unidentified"}</span>
                  </div>
                  
                  <Link to={`/projects/${proj.id}`} className="hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-bold font-display text-neo-accent mb-4 tracking-[0.1em] uppercase">
                      {proj.title}
                    </h3>
                  </Link>

                  <p className="text-white mb-6 flex-1 line-clamp-3 text-sm">
                    {proj.description || "No description available."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                     <div className="flex gap-2">
                       {proj.url && (
                         <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-neo-text-dim hover:text-neo-cyan transition-colors">
                           <ExternalLink className="w-5 h-5" />
                         </a>
                       )}
                     </div>
                     <Link to={`/projects/${proj.id}`} className="text-xs font-mono text-neo-cyan uppercase hover:underline">
                        Examine &rarr;
                     </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
