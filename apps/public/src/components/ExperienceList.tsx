"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExperienceResponse } from '@rishicodes/shared-types';
import { ExternalLink, Briefcase, GraduationCap, HeartHandshake, Code, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const typeIcons: Record<string, React.ReactNode> = {
  WORK: <Briefcase className="w-4 h-4" />,
  INTERNSHIP: <GraduationCap className="w-4 h-4" />,
  VOLUNTEER: <HeartHandshake className="w-4 h-4" />,
  FREELANCE: <Briefcase className="w-4 h-4" />,
  OPEN_SOURCE: <Code className="w-4 h-4" />,
  LEADERSHIP: <Users className="w-4 h-4" />,
};

const typeLabels: Record<string, string> = {
  WORK: 'Work',
  INTERNSHIP: 'Internship',
  VOLUNTEER: 'Volunteer',
  FREELANCE: 'Freelance',
  OPEN_SOURCE: 'Open Source',
  LEADERSHIP: 'Leadership',
};

const formatMonthYear = (dateStr: string) => {
  if (!dateStr) return 'Present';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

export function ExperienceList({ experiences }: { experiences: ExperienceResponse[] }) {
  if (experiences.length === 0) {
    return <div className="pl-8 text-zinc-500 italic">No experience records found.</div>;
  }

  // Group consecutive experiences from the same organization
  const groupedExperiences: { org: string; orgUrl?: string; items: ExperienceResponse[] }[] = [];

  experiences.forEach((exp) => {
    if (groupedExperiences.length === 0) {
      groupedExperiences.push({ org: exp.org, orgUrl: exp.orgUrl, items: [exp] });
    } else {
      const lastGroup = groupedExperiences[groupedExperiences.length - 1];
      if (lastGroup.org.toLowerCase() === exp.org.toLowerCase()) {
        lastGroup.items.push(exp);
        if (!lastGroup.orgUrl && exp.orgUrl) lastGroup.orgUrl = exp.orgUrl;
      } else {
        groupedExperiences.push({ org: exp.org, orgUrl: exp.orgUrl, items: [exp] });
      }
    }
  });

  return (
    <>
      {groupedExperiences.map((group, i) => (
        <motion.div 
          key={`${group.org}-${i}`} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="relative pl-8 md:pl-12 group mb-12 last:mb-0"
        >
          {/* Main Timeline Dot for the Organization */}
          <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-zinc-950 border-2 border-zinc-800 group-hover:border-indigo-500 transition-colors z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-indigo-400 transition-colors" />
          </div>

          {/* Organization Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              {group.orgUrl ? (
                <a 
                  href={group.orgUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="hover:underline text-indigo-400 flex items-center gap-1.5"
                >
                  {group.org}
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-indigo-400">{group.org}</span>
              )}
            </h2>
          </div>

          {/* Nested Roles inside the Organization */}
          <div className="space-y-10 relative">
            {/* Inner nested line if multiple items exist */}
            {group.items.length > 1 && (
               <div className="absolute -left-[1.35rem] top-4 bottom-4 w-px bg-zinc-800/50" />
            )}

            {group.items.map((exp, j) => (
              <div key={exp.id} className="relative">
                {/* Sub-node dot if multiple items */}
                {group.items.length > 1 && (
                  <div className="absolute -left-[1.53rem] top-2.5 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-950 z-10" />
                )}

                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2 gap-2">
                  <h3 className="text-xl font-semibold text-zinc-200">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                    <span>{formatMonthYear(exp.startDate)}</span>
                    <span>—</span>
                    <span>{formatMonthYear(exp.endDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {typeIcons[exp.type]}
                    {typeLabels[exp.type] ?? exp.type}
                  </span>
                  {exp.location && (
                    <span className="text-zinc-500 text-sm">
                      • {exp.location}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:text-zinc-400 text-zinc-400 mb-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{exp.description}</ReactMarkdown>
                  </div>
                )}

                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.techStack.map((tech) => (
                      <span key={tech} className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </>
  );
}
