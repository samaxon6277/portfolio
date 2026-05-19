import { motion } from "motion/react"
import { ExternalLink, Loader2, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
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
    let mounted = true;

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
             // Not found
             if (mounted) setProject(null);
          } else {
             throw error;
          }
        } else if (mounted && data) {
          setProject(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProject();

    const sub = supabase.channel(`public:projects:id=eq.${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${id}` }, fetchProject)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader2 className="w-12 h-12 text-neo-accent animate-spin" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center py-40 space-y-4">
        <h1 className="text-3xl font-display font-bold">Project not found</h1>
        <Link to="/projects" className="text-neo-accent hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4"/> Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/projects" className="inline-flex items-center text-neo-cyan font-mono text-sm tracking-widest uppercase hover:underline mb-10">
          ← Return to Inventory
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-[0.1em] uppercase text-white mb-6">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-xs font-mono tracking-widest uppercase text-neo-text-dim mb-10">
            {project.client && (
              <div className="bg-[#15171E] border border-neo-surface px-4 py-2">
                <span className="text-neo-cyan block mb-1">Client / Target</span>
                <span className="text-white">{project.client}</span>
              </div>
            )}
            {project.role && (
              <div className="bg-[#15171E] border border-neo-surface px-4 py-2">
                <span className="text-neo-cyan block mb-1">Role / Class</span>
                <span className="text-white">{project.role}</span>
              </div>
            )}
            {project.timeline && (
              <div className="bg-[#15171E] border border-neo-surface px-4 py-2">
                <span className="text-neo-cyan block mb-1">Stardate / Timeline</span>
                <span className="text-white">{project.timeline}</span>
              </div>
            )}
          </div>

          <div className="w-full h-[400px] md:h-[500px] mb-12 border-2 border-neo-surface">
            <img 
               src={project.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"} 
               alt={project.title}
               className="w-full h-full object-cover grayscale" 
             />
          </div>

          <div className="prose prose-invert max-w-none text-neo-text-dim pt-4">
             <h2 className="text-2xl font-display font-bold text-neo-cyan mb-4 uppercase tracking-widest">Mission Overview</h2>
             <p className="whitespace-pre-wrap text-lg leading-relaxed text-white">{project.description}</p>
             {project.content && (
               <div className="mt-8 text-white" dangerouslySetInnerHTML={{ __html: project.content }} />
             )}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            {project.tech_stack?.map((tech: string, i: number) => (
               <span key={i} className="px-3 py-1 text-xs font-mono border border-neo-surface bg-[#1E2029] text-neo-text-dim uppercase">
                 {tech}
               </span>
            ))}
          </div>

          {project.url && (
            <div className="mt-16 text-center">
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 bg-neo-cyan text-[#1E2029] font-bold rounded-full hover:opacity-90 transition-opacity tracking-widest uppercase text-sm geo-shadow">
                 Execute Link / Live Site
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}
