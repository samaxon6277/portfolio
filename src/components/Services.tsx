import { motion } from "motion/react"
import { MonitorSmartphone, Layout, PenTool, Sparkles, Box, Presentation, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

export default function Services() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    const fetchServices = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted && data) {
          setServices(data);
        }
      } catch (err: any) {
        console.error("Failed to fetch services:", err.message || err);
        if (mounted) setError(err.message || 'Connection error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServices();

    const sub = supabase.channel(`realtime:services_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchServices)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, []);

  const getIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('web') || lower.includes('dev')) return <MonitorSmartphone className="w-8 h-8" />;
    if (lower.includes('ui') || lower.includes('ux') || lower.includes('design')) return <Layout className="w-8 h-8" />;
    if (lower.includes('brand')) return <Box className="w-8 h-8" />;
    if (lower.includes('art') || lower.includes('ai') || lower.includes('graphic')) return <PenTool className="w-8 h-8" />;
    return <Sparkles className="w-8 h-8" />;
  };

  return (
    <section id="services" className="py-24 relative min-h-[50vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display inline-block relative text-white tracking-[0.2em] uppercase">
            Protocols
          </h2>
          <p className="text-neo-text-dim uppercase tracking-widest text-sm mt-4 font-mono">Service Inventory</p>
        </motion.div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 text-neo-accent animate-spin" />
           </div>
        ) : error ? (
           <div className="text-center py-20">
             <div className="text-neo-red mb-4 font-mono uppercase tracking-[0.2em]">Data Link Failure</div>
             <p className="text-neo-text-dim text-sm max-w-xs mx-auto mb-6">{error}</p>
             <button onClick={() => window.location.reload()} className="px-6 py-2 bg-neo-cyan/10 border border-neo-cyan/30 text-neo-cyan text-xs uppercase tracking-widest hover:bg-neo-cyan/20 transition-all">
               Reset Connection
             </button>
           </div>
        ) : services.length === 0 ? (
           <div className="text-center text-neo-text-dim py-20">
             No active services found.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, idx) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#1E2029] border border-neo-surface p-8 group hover:border-neo-cyan transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-neo-cyan/5 -translate-y-16 translate-x-16 rounded-full blur-3xl group-hover:bg-neo-cyan/10 transition-colors"></div>
                
                <div className="w-16 h-16 border border-neo-surface flex items-center justify-center text-neo-cyan mb-6 group-hover:bg-neo-cyan group-hover:text-[#1E2029] transition-all duration-500 shrink-0">
                  {getIcon(svc.category)}
                </div>
                <div className="text-[10px] font-mono text-neo-text-disabled uppercase tracking-widest mb-2">
                  System Mode: {svc.category}
                </div>
                <h3 className="text-xl font-bold font-display text-white uppercase tracking-wider mb-3 group-hover:text-neo-cyan transition-colors">
                  {svc.title}
                </h3>
                <p className="text-neo-text-dim leading-relaxed flex-1 font-mono text-sm uppercase tracking-tighter">
                  {svc.description || "Operational parameters established for digital deployment."}
                </p>
                <div className="mt-8 pt-6 border-t border-neo-surface/30 flex justify-between items-center">
                   <span className="text-neo-cyan font-mono text-xs uppercase tracking-widest">{svc.pricing}</span>
                   <Link to="/contact" className="text-[10px] font-mono uppercase tracking-widest bg-neo-surface px-3 py-1 text-neo-text-dim hover:text-white transition-colors">
                      Execute &rarr;
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
