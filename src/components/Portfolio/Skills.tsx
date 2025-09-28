import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SkillsProps {
  data?: Array<{
    id: string;
    name: string;
    category: 'frontend' | 'backend' | 'framework' | 'database' | 'aiml' | 'tools';
    percentage: number;
  }>;
}

interface SkillBarProps {
  skill: string;
  percentage: number;
  delay: number;
}

const SkillBar = ({ skill, percentage, delay }: SkillBarProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-foreground">{skill}</span>
        <span className="text-sm text-muted-foreground">{percentage}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-progress"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

interface SkillCategoryProps {
  title: string;
  skills: Array<{
    id: string;
    name: string;
    percentage: number;
  }>;
  color: string;
  delay: number;
  isTools?: boolean;
}

const SkillCategoryCard = ({ title, skills, color, delay, isTools = false }: SkillCategoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const skillsToShow = showAll ? skills : skills.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="glass-card p-8"
    >
      <h3 className={`text-2xl font-bold mb-8 ${color} text-center`}>{title}</h3>
      <div>
        {skillsToShow.map((item, index) => (
          <SkillBar
            key={item.id}
            skill={item.name}
            percentage={item.percentage}
            delay={0.1 * index}
          />
        ))}
      </div>
      {skills.length > 4 && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.4 }}
          viewport={{ once: true }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-secondary flex items-center gap-2 mx-auto text-sm"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show More ({skills.length - 4} more)
              </>
            )}
          </button>
        </motion.div>
      )}
      {skills.length === 0 && (
        <p className="text-muted-foreground text-center">No {title.toLowerCase()} skills yet</p>
      )}
    </motion.div>
  );
};

export const Skills = ({ data = [] }: SkillsProps) => {
  // Group skills by category
  const skillsByCategory = data.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);

  const frontendSkills = skillsByCategory.frontend || [];
  const backendSkills = skillsByCategory.backend || [];
  const frameworkSkills = skillsByCategory.framework || [];
  const databaseSkills = skillsByCategory.database || [];
  const aimlSkills = skillsByCategory.aiml || [];
  const toolsSkills = skillsByCategory.tools || [];

  const getCategoryData = (category: string) => {
    switch (category) {
      case 'frontend':
        return { skills: frontendSkills, color: 'text-primary', isTools: false };
      case 'backend':
        return { skills: backendSkills, color: 'text-secondary', isTools: false };
      case 'framework':
        return { skills: frameworkSkills, color: 'text-accent', isTools: false };
      case 'database':
        return { skills: databaseSkills, color: 'text-green-500', isTools: false };
      case 'aiml':
        return { skills: aimlSkills, color: 'text-purple-500', isTools: false };
      case 'tools':
        return { skills: toolsSkills, color: 'text-primary', isTools: true };
      default:
        return { skills: [], color: 'text-primary', isTools: false };
    }
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      frontend: 'Frontend',
      backend: 'Backend',
      framework: 'Frameworks',
      database: 'Database',
      aiml: 'AI/ML',
      tools: 'Tools'
    };
    return titles[category as keyof typeof titles] || category;
  };

  return (
    <section id="skills" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            A comprehensive overview of my technical skills and the tools I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Two-column layout: Left (Frontend, Backend, AI/ML), Right (Framework, Database, Tools) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left column */}
          <div className="space-y-6 sm:space-y-8">
            {['frontend', 'backend', 'aiml'].map((category, index) => {
              const categoryData = getCategoryData(category);
              return (
                <SkillCategoryCard
                  key={category}
                  title={getCategoryTitle(category)}
                  skills={categoryData.skills}
                  color={categoryData.color}
                  delay={0.1 * (index + 1)}
                  isTools={categoryData.isTools}
                />
              );
            })}
          </div>
          {/* Right column */}
          <div className="space-y-6 sm:space-y-8">
            {['framework', 'database', 'tools'].map((category, index) => {
              const categoryData = getCategoryData(category);
              return (
                <SkillCategoryCard
                  key={category}
                  title={getCategoryTitle(category)}
                  skills={categoryData.skills}
                  color={categoryData.color}
                  delay={0.1 * (index + 1)}
                  isTools={categoryData.isTools}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};