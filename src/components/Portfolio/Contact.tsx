import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContactProps {
  data?: {
    email?: string;
    phone?: string;
    location?: string;
  };
}

export const Contact = ({ data }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    const payload = {
      name: formData.name,
      customerEmail: formData.email,
      message: formData.message,
      fromEmail: 'hemanthsavanth5555@gmail.com', // default sender
      toEmail: data?.email || 'savanthhemanth@gmail.com', // portfolio email (receiver)
    };

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: payload,
      });

      if (error) throw error;

      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      // Graceful fallback: open mail client if function is not available
      const subject = encodeURIComponent(`Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      window.location.href = `mailto:${payload.toEmail}?subject=${subject}&body=${body}`;
      // Reset form after triggering the default mail client
      setFormData({ name: '', email: '', message: '' });
      setStatus('Sent via email client.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">Get in Touch</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always open to discussing new opportunities, creative ideas, or potential collaborations. 
                Whether you have a question or just want to say hi, I'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-6">
                <motion.a 
                  href={`mailto:${data?.email || "savanthhemanth@gmail.com"}`}
                  className="flex items-center space-x-4 cursor-pointer group"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
                    <Mail className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors duration-200">
                      {data?.email || "savanthhemanth@gmail.com"}
                    </p>
                  </div>
                </motion.a>
                
                <motion.a 
                  href={`tel:${data?.phone || "+917349599759"}`}
                  className="flex items-center space-x-4 cursor-pointer group"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
                    <Phone className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors duration-200">
                      {data?.phone || "+91 7349599759"}
                    </p>
                  </div>
                </motion.a>
                
                <motion.div 
                  className="flex items-center space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="text-primary-foreground" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{data?.location || "Bengaluru, Whitefield"}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">Send a Message</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-hero flex items-center justify-center space-x-2"
                  disabled={sending}
                >
                  <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  <Send size={18} />
                </motion.button>

                {status && (
                  <p className="text-sm text-center text-muted-foreground">{status}</p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};