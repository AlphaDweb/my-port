import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface HeroProps {
  data?: {
    hero_title?: string;
    hero_subtitle?: string;
    hero_image_url?: string;
    profile_image_url?: string;
  };
  contact?: {
    email?: string;
    github_url?: string;
    linkedin_url?: string;
  } | null;
}

export const Hero = ({ data, contact }: HeroProps) => {
  const normalizeUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const githubUrl = normalizeUrl(contact?.github_url) || "https://github.com";
  const linkedinUrl = normalizeUrl(contact?.linkedin_url) || "https://linkedin.com";
  const emailHref = `mailto:${contact?.email || "savanthhemanth@gmail.com"}`;
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${data?.hero_image_url || heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Floating shapes */}
      <div className="floating-shape w-64 h-64 top-20 left-10 animate-float" />
      <div className="floating-shape w-32 h-32 top-40 right-20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="floating-shape w-48 h-48 bottom-32 left-1/3 animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Profile Image */}
          {data?.profile_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <img
                  src={data.profile_image_url}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover"
                />
              </div>
            </motion.div>
          )}

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {data?.hero_title || "Creative Developer & Designer"}
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-4 text-muted-foreground px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {data?.hero_subtitle || "Building Amazing Digital Experiences"}
          </motion.p>
          
          <motion.p 
            className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto text-muted-foreground px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Creating beautiful, functional, and user-centered digital experiences with modern technologies.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <button 
            className="btn-hero w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work
          </button>
          <button 
            className="btn-secondary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </button>
        </motion.div>

        <motion.div 
          className="flex justify-center space-x-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform">
            <Github size={24} />
          </a>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform">
            <Linkedin size={24} />
          </a>
          <a href={emailHref} className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:scale-110 transform">
            <Mail size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};