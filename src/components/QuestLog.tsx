import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Loader2 } from "lucide-react"

export default function QuestLog() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    const fetchBlogs = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (mounted) {
          if (error) throw error;
          if (data) {
            setBlogs(data);
          }
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Fetch blogs error:", err.message || err);
        if (mounted) {
          setError(err.message || 'Connection error');
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="quests" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display inline-block relative text-white tracking-[0.2em] uppercase">
            Quest Log
          </h2>
          <p className="text-neo-text-dim uppercase tracking-widest text-sm mt-4 font-mono">Mission Archives</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-neo-cyan animate-spin" />
          </div>
        ) : error ? (
           <div className="text-center py-20">
             <div className="text-neo-red mb-4 font-mono uppercase tracking-[0.2em]">Log Access Denied</div>
             <p className="text-neo-text-dim text-sm max-w-xs mx-auto mb-6">{error}</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-neo-accent/10 border border-neo-accent/30 text-neo-accent text-xs uppercase tracking-widest hover:bg-neo-accent/20 transition-all">
               Reconnect
             </button>
           </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-neo-text-dim py-20 font-mono">
            No active quests found.
          </div>
        ) : (
          <div className="space-y-12">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row items-center md:items-start gap-8 group"
              >
                {/* Feature Image: Perfect large circle */}
                <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-4 border-neo-surface group-hover:border-neo-accent transition-colors relative">
                  <div className="absolute inset-0 bg-neo-accent/20 z-10 mix-blend-overlay group-hover:bg-transparent transition-colors"></div>
                  <img 
                    src={blog.image_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${blog.id}`} 
                    alt={blog.title} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-4">
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3 text-sm font-mono uppercase">
                    <span className="text-neo-text-dim">
                      STARDATE {new Date(blog.created_at).getTime().toString().substring(0, 7)}...
                    </span>
                    <span className="text-neo-accent bg-neo-accent/10 px-2 py-1 rounded">
                      {blog.category || "General"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-neo-accent mb-4 uppercase tracking-wider group-hover:text-white transition-colors">
                    {blog.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-white line-clamp-2 mb-4 text-sm leading-relaxed">
                    {blog.summary || "Secured the payload and progressed the primary directive."}
                  </p>

                  <a href={`/blog/${blog.slug || blog.id}`} className="text-neo-accent uppercase tracking-widest text-xs font-bold underline hover:text-white transition-colors">
                    Expand this log
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
