import { motion } from "framer-motion";
import { Code, Palette, Rocket, Users } from "lucide-react";

interface AboutProps {
  data?: {
    about_title?: string;
    about_content?: string;
    profile_image_url?: string;
  };
}

export const About = ({ data }: AboutProps) => {
  const features = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices."
    },
    {
      icon: Palette,
      title: "Creative Design",
      description: "Crafting beautiful and intuitive user interfaces with attention to detail."
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Building fast, responsive applications optimized for all devices."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working effectively with teams to deliver exceptional results."
    }
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {data?.about_title || "About Me"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            {data?.about_content || "I'm a passionate developer with 5+ years of experience creating digital experiences that are not only functional but also beautiful and user-friendly."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Profile Image */}
            {data?.profile_image_url && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex justify-center lg:justify-start"
              >
                <div className="relative">
                  <img
                    src={data.profile_image_url}
                    alt="Profile"
                    className="w-64 h-64 rounded-full border-4 border-primary/20 shadow-2xl object-cover"
                  />
                </div>
              </motion.div>
            )}

            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">
                {data?.journey_title || "My Journey"}
              </h3>
              <div className="text-muted-foreground mb-6 leading-relaxed">
                {data?.journey_content ? (
                  data.journey_content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="mb-4">
                      Started as a curious student exploring the world of programming, I've evolved into a full-stack developer 
                      who loves turning complex problems into simple, beautiful, and intuitive solutions.
                    </p>
                    <p>
                      When I'm not coding, you can find me exploring new technologies, contributing to open source projects, 
                      or sharing knowledge with the developer community.
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {(data?.journey_technologies ? 
                  data.journey_technologies.split(',').map(tech => tech.trim()).filter(tech => tech) :
                  ["React", "TypeScript", "Node.js", "Python", "AWS"]
                ).map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center hover:shadow-glow transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <feature.icon className="text-primary-foreground" size={24} />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};