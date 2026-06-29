"use client";

import { motion } from 'framer-motion';
import { type EducationResponse } from '@rishicodes/shared-types';

function formatMonthYear(dateStr: string) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export function EducationTable({ education }: { education: EducationResponse[] }) {
  return (
    <div className="max-w-3xl border-l-2 border-primary/20 pl-6 space-y-12 ml-3">
      {education.map((edu, i) => (
        <motion.div 
          key={edu.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
          className="relative"
        >
          {/* Timeline node */}
          <span className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full bg-primary/20 border-2 border-primary ring-4 ring-background" />
          
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
              <h3 className="text-xl font-bold text-foreground">{edu.institution}</h3>
              <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-1 rounded mt-2 sm:mt-0 w-fit">
                {formatMonthYear(edu.startDate)} – {edu.endDate ? formatMonthYear(edu.endDate) : 'Present'}
              </span>
            </div>
            
            <h4 className="text-lg font-medium text-muted-foreground mb-4">
              {edu.degree}
              {edu.branch && <span className="opacity-80"> • {edu.branch}</span>}
            </h4>
          
          {edu.description && (
            <p className="text-muted-foreground/80 leading-relaxed text-sm">
              {edu.description}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
