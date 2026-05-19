import { motion } from "motion/react"
import { MonitorSmartphone, Layout, PenTool, Sparkles, Box, Presentation, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Services() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted && data) {
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServices();

    const sub = supabase.channel('public:services')
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
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">My Services</span>
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-neo-elevated rounded-full overflow-hidden">
               <motion.span 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1 }}
                 className="block h-full bg-gradient-to-r from-neo-cyan to-neo-accent"
               />
            </span>
          </h2>
          <p className="mt-8 text-neo-text-dim text-lg max-w-2xl mx-auto">
            Comprehensive digital solutions blending creative design with robust engineering.
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 className="w-8 h-8 text-neo-accent animate-spin" />
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
                className="geo-card p-8 group hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="w-16 h-16 rounded-2xl geo-inner-shadow bg-neo-surface flex items-center justify-center text-neo-accent mb-6 group-hover:text-neo-cyan transition-colors shrink-0">
                  {getIcon(svc.category)}
                </div>
                <div className="text-xs font-bold text-neo-cyan uppercase tracking-wider mb-2">
                  {svc.category}
                </div>
                <h3 className="text-xl font-bold font-display mb-3 group-hover:geo-glow-text transition-all">
                  {svc.title}
                </h3>
                <p className="text-neo-text-dim leading-relaxed flex-1">
                  Starting at {svc.pricing}
                </p>
                
                <div className="mt-8">
                  <a href="#contact" className="text-sm font-bold uppercase tracking-wider text-neo-text-disabled group-hover:text-neo-accent flex items-center transition-colors">
                    <span>Discuss Project</span>
                    <motion.span 
                      className="ml-2 inline-block opacity-0 group-hover:opacity-100"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      →
                    </motion.span>
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
