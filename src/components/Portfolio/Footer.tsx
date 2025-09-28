import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

interface FooterProps {
  portfolio?: {
    hero_title?: string;
    hero_subtitle?: string;
    website_name?: string;
  } | null;
  contact?: {
    email?: string;
    github_url?: string;
    linkedin_url?: string;
  } | null;
}

export const Footer = ({ portfolio, contact }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const displayName = portfolio?.hero_title || portfolio?.website_name || "John Developer";
  const tagline = portfolio?.hero_subtitle || "Full Stack Developer passionate about creating beautiful, functional, and user-centered digital experiences.";
  const email = contact?.email || "john@developer.com";
  const github = contact?.github_url || "#";
  const linkedin = contact?.linkedin_url || "#";

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4">
              {displayName}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {tagline}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:text-center"
          >
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <div className="space-y-2">
              {["About", "Projects", "Skills", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    const element = document.querySelector(`#${link.toLowerCase()}`);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
            <div className="flex md:justify-end space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <a
                href={github || "#"}
                target={github && github !== '#' ? "_blank" : undefined}
                rel={github && github !== '#' ? "noopener noreferrer" : undefined}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <Github size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href={linkedin || "#"}
                target={linkedin && linkedin !== '#' ? "_blank" : undefined}
                rel={linkedin && linkedin !== '#' ? "noopener noreferrer" : undefined}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <Linkedin size={16} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              >
                <Mail size={16} className="sm:w-5 sm:h-5" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {email}
            </p>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4"
        >
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} {displayName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart size={14} className="sm:w-4 sm:h-4 text-red-500 animate-pulse" />
            <span>using React & TypeScript</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};