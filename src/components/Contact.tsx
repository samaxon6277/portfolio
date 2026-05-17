import React, { useState } from "react";
import { motion } from "framer-motion"
import { Mail, Instagram, MessageCircle, Send, CheckCircle, Linkedin, Github } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db, handleFirestoreError, OperationType } from "../lib/firebase"
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
      setError("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const msgRef = await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        subject: formData.projectType || "General Inquiry",
        content: formData.message,
        status: "New",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      try {
        await addDoc(collection(db, "notifications"), {
           title: `New Inquiry from ${formData.name}`,
           description: formData.message.substring(0, 50) + (formData.message.length > 50 ? '...' : ''),
           type: "inquiry",
           status: "New",
           read: false,
           actionUrl: "/dashboard/messages",
           createdAt: serverTimestamp(),
           updatedAt: serverTimestamp()
        });
      } catch (notifErr) {
        console.error("Failed to create notification", notifErr);
      }

      setSuccess(true);
      setFormData({ name: "", email: "", projectType: "", message: "" });
    } catch (err: unknown) {
      console.error(err);
      try {
        handleFirestoreError(err, OperationType.CREATE, "messages");
      } catch (firebaseErr: unknown) {
        if (firebaseErr instanceof Error) {
           setError("Failed to send message: " + firebaseErr.message);
        } else {
           setError("Failed to send message.");
        }
      }
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display inline-block relative">
            <span className="geo-gradient-text z-10 relative">Let's Connect</span>
            <span className="absolute -bottom-4 left-0 w-full h-1 bg-neo-elevated rounded-full overflow-hidden">
               <motion.span 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1 }}
                 className="block h-full bg-gradient-to-r from-neo-purple to-neo-accent"
               />
            </span>
          </h2>
          <p className="mt-8 text-neo-text-dim text-lg max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Drop me a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="geo-card p-8 flex items-center space-x-6 hover:-translate-y-1 transition-transform cursor-pointer group hover:shadow-[0_0_20px_rgba(77,168,255,0.2)]">
              <div className="w-16 h-16 rounded-2xl geo-inner-shadow flex items-center justify-center text-neo-accent group-hover:text-white group-hover:bg-[#2984FF] group-hover:shadow-[0_0_20px_rgba(77,168,255,0.6)] transition-all">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display mb-1 text-neo-text-dim">Email Us</h3>
                <p className="font-semibold text-lg hover:text-neo-accent transition-colors"><a href={`mailto:${settings?.contactEmail || "hello@samaxon.com"}`}>{settings?.contactEmail || "hello@samaxon.com"}</a></p>
              </div>
            </div>

            <div className="geo-card p-8 flex items-center space-x-6 hover:-translate-y-1 transition-transform cursor-pointer group hover:shadow-[0_0_20px_rgba(37,211,102,0.2)]">
              <div className="w-16 h-16 rounded-2xl geo-inner-shadow flex items-center justify-center text-[#25D366] group-hover:text-white group-hover:bg-[#25D366] group-hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display mb-1 text-neo-text-dim">WhatsApp</h3>
                <p className="font-semibold text-lg hover:text-[#25D366] transition-colors"><a href={`https://wa.me/${settings?.whatsappNumber?.replace(/\D/g, '') || "12345678900"}`} target="_blank" rel="noopener noreferrer">{settings?.whatsappNumber || "+1 (234) 567-8900"}</a></p>
              </div>
            </div>

            {settings?.socialLinks && settings.socialLinks.find(s => s.platform === 'Instagram' && s.enabled && s.url) && (
              <div className="geo-card p-8 flex items-center space-x-6 hover:-translate-y-1 transition-transform cursor-pointer group hover:shadow-[0_0_20px_rgba(225,48,108,0.2)]">
                <div className="w-16 h-16 rounded-2xl geo-inner-shadow flex items-center justify-center text-[#E1306C] group-hover:text-white group-hover:bg-gradient-to-tr from-[#F56040] to-[#E1306C] group-hover:shadow-[0_0_20px_rgba(225,48,108,0.6)] transition-all">
                  <Instagram className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display mb-1 text-neo-text-dim">Instagram</h3>
                  <p className="font-semibold text-lg hover:text-[#E1306C] transition-colors"><a href={settings.socialLinks.find(s => s.platform === 'Instagram')?.url} target="_blank" rel="noopener noreferrer">@samar.designs</a></p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="geo-card p-8 md:p-10 relative overflow-hidden"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-neo-text-dim ml-2 uppercase tracking-wide">Name *</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-6 py-4 rounded-xl geo-input text-neo-text placeholder:text-neo-text-disabled"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-neo-text-dim ml-2 uppercase tracking-wide">Email *</label>
                  <input 
                    id="contact-email"
                    type="email"
                    name="email" 
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-6 py-4 rounded-xl geo-input text-neo-text placeholder:text-neo-text-disabled"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-project-type" className="text-sm font-medium text-neo-text-dim ml-2 uppercase tracking-wide">Project Type</label>
                <input 
                  id="contact-project-type"
                  type="text"
                  name="projectType" 
                  autoComplete="off"
                  value={formData.projectType}
                  onChange={handleChange}
                  placeholder="Website Design, Development..."
                  className="w-full px-6 py-4 rounded-xl geo-input text-neo-text placeholder:text-neo-text-disabled"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-neo-text-dim ml-2 uppercase tracking-wide">Message *</label>
                <textarea 
                  id="contact-message"
                  rows={4}
                  name="message"
                  autoComplete="off"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell me about your project..."
                  className="w-full px-6 py-4 rounded-xl geo-input text-neo-text placeholder:text-neo-text-disabled resize-none"
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full geo-btn py-4 rounded-xl font-bold text-neo-text hover:text-neo-cyan flex justify-center items-center gap-2 mt-4 transition-all hover:geo-inner-shadow hover:scale-[0.99] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Sending...</span>
                ) : success ? (
                  <><span>Message Sent!</span><CheckCircle className="w-5 h-5 text-green-500" /></>
                ) : (
                  <><span>Send Message</span><Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
