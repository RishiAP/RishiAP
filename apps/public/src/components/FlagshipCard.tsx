"use client";

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { type ProjectResponse } from '@rishicodes/shared-types';

export function FlagshipCard({ project, index }: { project: ProjectResponse; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group py-12"
    >
      {/* Image container */}
      <div className={`lg:col-span-7 relative z-10 ${!isEven ? 'lg:order-2' : ''}`}>
        <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-border bg-muted/20 backdrop-blur-sm group-hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay group-hover:bg-transparent transition-colors z-10" />
          {/* Placeholder for project image, can use an actual next/image if we had coverUrls. For now, abstract gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
          {project.diagramUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={project.diagramUrl} 
              alt={project.title} 
              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 mix-blend-luminosity group-hover:mix-blend-normal" 
            />
          )}
        </div>
      </div>

      {/* Content container */}
      <div className={`lg:col-span-5 relative z-20 ${!isEven ? 'lg:text-right lg:order-1' : ''}`}>
        <p className="text-primary font-mono text-sm mb-2 tracking-wider">Featured Project</p>
        <h3 className="text-3xl font-bold text-foreground mb-6">{project.title}</h3>
        
        <div className={`p-6 rounded-xl bg-card border border-border shadow-xl backdrop-blur-sm relative mb-6 hover:shadow-primary/5 transition-shadow`}>
          <p className="text-muted-foreground leading-relaxed">{project.summary}</p>
        </div>

        <ul className={`flex flex-wrap gap-3 font-mono text-xs text-muted-foreground mb-8 ${!isEven ? 'lg:justify-end' : ''}`}>
          {project.techStack.map(tech => (
            <li key={tech} className="px-2 py-1 rounded-md bg-muted border border-border/50">
              {tech}
            </li>
          ))}
        </ul>

        <div className={`flex items-center gap-4 ${!isEven ? 'lg:justify-end' : ''}`}>
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
