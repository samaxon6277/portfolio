import React, { useState } from "react";
import { motion } from "motion/react"
import { Send, CheckCircle } from "lucide-react"
import { supabase } from "../lib/supabase"
import { useGlobalSettings } from "../lib/SettingsContext";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", projectType: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const settings = useGlobalSettings();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("COMMUNICATION ERROR: Missing required parameters.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: msgErr } = await supabase.from('messages').insert({
        name: formData.name,
        email: formData.email,
        subject: formData.projectType || "General Inquiry",
        content: formData.message,
        status: "New"
      });

      if (msgErr) throw msgErr;
      
      try {
        await supabase.from('notifications').insert({
           title: `Transmission from ${formData.name}`,
           message: formData.message.substring(0, 50) + (formData.message.length > 50 ? '...' : ''),
           type: "inquiry",
           status: "New",
           read: false,
           link: "/dashboard/messages"
        });
      } catch (notifErr) {
        console.error("Failed to create notification", notifErr);
      }

      setSuccess(true);
      setFormData({ name: "", email: "", projectType: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setError("TRANSMISSION FAILED: " + (err.message || 'Unknown network error.'));
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display inline-block relative text-white tracking-[0.2em] uppercase">
            Summon
          </h2>
          <p className="text-neo-text-dim uppercase tracking-widest text-sm mt-4 font-mono">Establish Connection</p>
        </motion.div>

        <div className="flex flex-col items-center justify-center">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16 text-center w-full max-w-2xl bg-[#1E2029] p-8 border border-neo-surface"
          >
            <div>
              <h3 className="text-xs font-mono text-neo-cyan tracking-widest uppercase mb-2">Direct Line</h3>
              <p className="text-white hover:text-neo-text-dim transition-colors text-lg">
                 <a href={`tel:${settings?.phone || "+918076874034"}`}>{settings?.phone || "+91 80768 74034"}</a>
              </p>
            </div>
            <div className="w-px h-12 bg-neo-surface hidden md:block"></div>
            <div className="h-px w-32 bg-neo-surface md:hidden"></div>
            <div>
              <h3 className="text-xs font-mono text-neo-cyan tracking-widest uppercase mb-2">Transmission Email</h3>
              <p className="text-white hover:text-neo-text-dim transition-colors text-lg">
                 <a href={`mailto:${settings?.email || "samaxon6277@gmail.com"}`}>{settings?.email || "samaxon6277@gmail.com"}</a>
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-2xl bg-[#1E2029] border-2 border-neo-surface p-8 relative"
            /* No rounded corners, sharp */
          >
            <div className="absolute top-0 right-0 p-2 text-xs font-mono text-neo-text-disabled">COMMS LINK: SECURE</div>
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-xs font-mono text-neo-cyan uppercase tracking-widest">Operator Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="ENTER NAME"
                    required
                    className="w-full px-4 py-3 bg-[#15171E] text-white placeholder:text-neo-text-disabled rounded-sm border-none outline-none focus:ring-1 focus:ring-neo-cyan font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-xs font-mono text-neo-cyan uppercase tracking-widest">Network ID (Email)</label>
                  <input 
                    id="contact-email"
                    type="email"
                    name="email" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ENTER EMAIL"
                    required
                    className="w-full px-4 py-3 bg-[#15171E] text-white placeholder:text-neo-text-disabled rounded-sm border-none outline-none focus:ring-1 focus:ring-neo-cyan font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-project-type" className="text-xs font-mono text-neo-cyan uppercase tracking-widest">Mission Type</label>
                <input 
                  id="contact-project-type"
                  type="text"
                  name="projectType" 
                  autoComplete="off"
                  value={formData.projectType}
                  onChange={handleChange}
                  placeholder="(OPTIONAL)"
                  className="w-full px-4 py-3 bg-[#15171E] text-white placeholder:text-neo-text-disabled rounded-sm border-none outline-none focus:ring-1 focus:ring-neo-cyan font-mono"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-mono text-neo-cyan uppercase tracking-widest">Transmission Payload</label>
                <textarea 
                  id="contact-message"
                  rows={5}
                  name="message"
                  autoComplete="off"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="AWAITING INPUT..."
                  className="w-full px-4 py-3 bg-[#15171E] text-white placeholder:text-neo-text-disabled rounded-sm border-none outline-none focus:ring-1 focus:ring-neo-cyan font-mono resize-none"
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-full font-bold bg-neo-cyan text-[#1E2029] hover:opacity-90 flex justify-center items-center gap-2 mt-4 transition-opacity uppercase tracking-widest text-sm geo-shadow disabled:opacity-50"
              >
                {loading ? (
                  <span>TRANSMITTING...</span>
                ) : success ? (
                  <><span>PAYLOAD DELIVERED</span><CheckCircle className="w-4 h-4" /></>
                ) : (
                  <><span>TRANSMIT</span><Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
