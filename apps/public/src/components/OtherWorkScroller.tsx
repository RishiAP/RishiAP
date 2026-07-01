"use client";

import { motion } from 'framer-motion';
import { Folder, ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { type ProjectResponse } from '@rishicodes/shared-types';

export function OtherWorkScroller({ projects }: { projects: ProjectResponse[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col justify-between p-6 rounded-xl bg-card border border-border hover:-translate-y-2 hover:border-primary/50 hover:shadow-xl transition-all group"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="text-primary">
                <Folder className="h-10 w-10 stroke-1" />
              </div>
              <div className="flex gap-3">
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <FaGithub className="h-5 w-5" />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-4">
              {project.summary}
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground mt-auto">
            {project.techStack.slice(0, 4).map(tech => (
              <li key={tech}>{tech}</li>
            ))}
            {project.techStack.length > 4 && <li>+{project.techStack.length - 4} more</li>}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
