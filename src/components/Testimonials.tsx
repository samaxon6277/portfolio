import { motion } from "motion/react"
import { Quote } from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([])

  useEffect(() => {
    let mounted = true;
    
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && mounted && data) {
        setTestimonials(data);
      }
    };
    
    fetchTestimonials();
    
    const sub = supabase.channel('public:testimonials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchTestimonials)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(sub);
    };
  }, [])

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">Client Feedback</span>
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-neo-elevated rounded-full overflow-hidden">
               <motion.span 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1 }}
                 className="block h-full bg-gradient-to-r from-neo-cyan to-neo-purple"
               />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
             <motion.div 
               key={testi.id || idx}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="geo-card p-8 flex flex-col h-full relative"
             >
               <Quote className="absolute top-6 right-6 w-12 h-12 text-neo-accent/20" />
               
               <p className="flex-1 text-neo-text-dim text-lg italic mb-8 relative z-10">
                 "{testi.text}"
               </p>
               
               <div className="flex items-center space-x-4">
                 {testi.avatar && (
                   <img 
                     src={testi.avatar} 
                     alt={testi.name}
                     className="w-12 h-12 rounded-full object-cover border border-neo-accent/30"
                   />
                 )}
                 <div>
                   <h4 className="font-bold font-display text-neo-text">{testi.name}</h4>
                   <p className="text-sm text-neo-accent">{testi.role}</p>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
