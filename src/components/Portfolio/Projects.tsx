import { motion } from "framer-motion";
import { ExternalLink, Github, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ProjectsProps {
  data?: Array<{
    id: string;
    title: string;
    description: string;
    image_url?: string;
    technologies: string[];
    github_url?: string;
    demo_url?: string;
  }>;
}

export const Projects = ({ data = [] }: ProjectsProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, cart management, and payment processing.",
      image: "/placeholder.svg",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/placeholder.svg",
      tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "AI-Powered Analytics",
      description: "Data analytics dashboard with machine learning insights, interactive charts, and predictive analysis capabilities.",
      image: "/placeholder.svg",
      tech: ["Python", "Django", "TensorFlow", "D3.js"],
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication, transaction history, and financial planning tools.",
      image: "/placeholder.svg",
      tech: ["React Native", "Firebase", "Redux", "Expo"],
      github: "#",
      demo: "#"
    }
  ];

  // Use data from props if available, otherwise use default projects
  const displayData = data.length > 0 ? data : projects;
  const projectsToShow = showAll ? displayData : displayData.slice(0, 2);

  return (
    <section id="projects" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            A collection of projects that showcase my skills in various technologies and domains.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projectsToShow.length > 0 ? projectsToShow.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="project-card group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image_url || project.image || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {(project.github_url || project.github) && (
                    <a 
                      href={project.github_url || project.github}
                      className="p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {(project.demo_url || project.demo) && (
                    <a 
                      href={project.demo_url || project.demo}
                      className="p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors duration-200"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {(project.technologies || project.tech || []).map((tech) => (
                    <span 
                      key={tech}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects to display yet.</p>
            </div>
          )}
        </div>
        
        {displayData.length > 2 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button 
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              {showAll ? (
                <>
                  <ChevronUp size={20} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                  View All Projects
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};