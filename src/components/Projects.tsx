import { motion } from "motion/react"
import { ExternalLink, Loader2, Code2 } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (mounted) {
          if (error) throw error;
          if (data) {
            setProjects(data);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Fetch projects error:", err.message || err);
        if (mounted) {
          setError(err.message || 'Connection error');
          setLoading(false);
        }
      }
    };

    fetchProjects();

    const subscription = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, payload => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <section id="projects" className="py-24 relative min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display inline-block relative text-white tracking-[0.2em] uppercase">
            Inventory
          </h2>
          <p className="text-neo-text-dim uppercase tracking-widest text-sm mt-4 font-mono">Select an artifact</p>
        </motion.div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 text-neo-cyan animate-spin" />
           </div>
        ) : error ? (
           <div className="text-center py-20">
             <div className="text-neo-red mb-4 font-mono uppercase tracking-[0.2em]">Inventory Access Failure</div>
             <p className="text-neo-text-dim text-sm max-w-xs mx-auto mb-6">{error}</p>
             <button onClick={() => window.location.reload()} className="px-10 py-3 border border-neo-cyan/30 text-neo-cyan text-xs uppercase tracking-widest hover:bg-neo-cyan/10 transition-all">
               Retry Sync
             </button>
           </div>
        ) : projects.length === 0 ? (
           <div className="text-center text-neo-text-dim py-20">
             Inventory is empty.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            {projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-neo-surface rounded-md relative flex flex-col group border border-neo-surface hover:border-neo-cyan transition-colors"
                /* Dark background #252836, slightly rounded, sharp aesthetic */
              >
                {/* Rectangular thumbnail */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-md">
                  <div className="absolute inset-0 bg-neo-bg/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img 
                    src={proj.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"} 
                    alt={proj.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                  />
                </div>
                
                {/* Circular logo/icon overlapping the border */}
                <div className="absolute top-48 left-8 w-16 h-16 bg-[#1E2029] border-4 border-neo-surface rounded-full flex items-center justify-center z-20 group-hover:border-neo-cyan transition-colors">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                
                {/* Content Box */}
                <div className="p-8 pt-12 flex-1 flex flex-col">
                  <div className="text-xs font-mono text-neo-text-dim mb-3 uppercase flex items-center justify-between">
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                    <span>{proj.category || "Class: Unidentified"}</span>
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
                       {proj.live_link && (
                         <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="text-neo-text-dim hover:text-neo-cyan transition-colors">
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

        <div className="mt-16 text-center">
          <Link to="/projects" className="inline-block px-10 py-4 bg-transparent border-2 border-neo-cyan text-white font-bold rounded-full hover:bg-neo-cyan/10 transition-colors tracking-widest uppercase text-sm">
            View Full Inventory
          </Link>
        </div>
      </div>
    </section>
  )
}

