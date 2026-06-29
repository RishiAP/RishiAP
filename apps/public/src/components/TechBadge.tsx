"use client";

import { motion } from 'framer-motion';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiNestjs,
  SiJavascript
} from 'react-icons/si';

// Map of common tech names to their corresponding react-icons component
const iconMap: Record<string, React.ElementType> = {
  'React': SiReact,
  'Next.js': SiNextdotjs,
  'TypeScript': SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  'PostgreSQL': SiPostgresql,
  'Prisma': SiPrisma,
  'Docker': SiDocker,
  'NestJS': SiNestjs,
  'JavaScript': SiJavascript,
};

export function TechBadge({ name, delay = 0 }: { name: string; delay?: number }) {
  const Icon = iconMap[name];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur hover:bg-muted hover:border-primary/50 transition-colors cursor-default"
    >
      {Icon && <Icon className="text-primary w-4 h-4" />}
      <span className="text-sm font-medium text-foreground">{name}</span>
    </motion.div>
  );
}

export function SkillsSection({ categories }: { categories: Array<{id: string, name: string, skills: Array<{id: string, name: string, field: string}>}> }) {
  return (
    <div className="space-y-12">
      {categories.map((category, idx) => (
        <div key={category.id} className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
          <div className="flex flex-wrap gap-3">
            {category.skills.map((skill: {id: string, name: string, field: string}, i: number) => (
              <TechBadge 
                key={skill.id} 
                name={skill.name} 
                delay={(idx * 0.1) + (i * 0.05)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
