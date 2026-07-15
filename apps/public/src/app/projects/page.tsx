import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: "A collection of system architectures, APIs, packages, firmware, and full-stack applications I've built.",
};
import { getProjects } from '@/lib/api';
import { ProjectResponse } from '@rishicodes/shared-types';
import { ExternalLink, GitBranch, Package, Cpu, FlaskConical, Wrench, AppWindow } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

const categoryIcons: Record<string, React.ReactNode> = {
  CASE_STUDY: null,
  PACKAGE: <Package className="w-3.5 h-3.5" />,
  LIBRARY: <Package className="w-3.5 h-3.5" />,
  EXPERIMENT: <FlaskConical className="w-3.5 h-3.5" />,
  FIRMWARE: <Cpu className="w-3.5 h-3.5" />,
  TOOL: <Wrench className="w-3.5 h-3.5" />,
  APPLICATION: <AppWindow className="w-3.5 h-3.5" />,
};

const categoryLabels: Record<string, string> = {
  CASE_STUDY: 'Case Study',
  PACKAGE: 'Package',
  LIBRARY: 'Library',
  EXPERIMENT: 'Experiment',
  FIRMWARE: 'Firmware',
  TOOL: 'Tool',
  APPLICATION: 'Application',
  OTHER: 'Other',
};

export default async function Projects() {
  const projects = await getProjects().catch(() => []);
  
  const flagshipProjects = projects.filter((p: ProjectResponse) => p.tier === 'FLAGSHIP');
  const supportingProjects = projects.filter((p: ProjectResponse) => p.tier !== 'FLAGSHIP');

  return (
    <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_500px] h-full">
      {/* Middle Prose Pane */}
      <div className="px-4 py-8 md:px-8 lg:px-12 md:py-12 max-w-3xl mx-auto lg:mx-0 w-full">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Projects
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          A collection of system architectures, APIs, packages, firmware, and full-stack applications I've built.
        </p>

        {/* Flagship Projects Section */}
        {flagshipProjects.length > 0 && (
          <div className="space-y-10 mt-16">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <AppWindow className="w-5 h-5 text-indigo-400" />
                Flagship Projects
              </h2>
              <p className="text-sm text-zinc-500 mt-1">Major architectural builds and applications.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {flagshipProjects.map((project: ProjectResponse) => (
                <div key={project.id} className="group relative flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden hover:bg-zinc-800/40 hover:border-zinc-700/50 hover:-translate-y-1 transition-all hover:shadow-2xl">
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:z-0">
                        <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      {project.category && project.category !== 'CASE_STUDY' && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-700">
                          {categoryLabels[project.category] ?? project.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                      {project.summary}
                    </p>
                    
                    <div className="mt-auto">
                      {(project.techStack?.length > 0 || project.languages?.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.languages?.slice(0, 2).map((lang: string) => (
                            <span key={lang} className="text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/50">
                              {lang}
                            </span>
                          ))}
                          {project.techStack?.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-4 mt-auto relative z-10">
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-300 transition-colors">
                            {project.repoUrl.includes('github.com') ? <FaGithub className="w-3.5 h-3.5" /> : <GitBranch className="w-3.5 h-3.5" />}
                            Code
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                          </a>
                        )}
                        {project.packageUrl && (
                          <a href={project.packageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors">
                            <Package className="w-3.5 h-3.5" />
                            {project.packageRegistry || 'Package'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Projects Section */}
        {supportingProjects.length > 0 && (
          <div className="space-y-8 mt-24 mb-12">
            <div className="border-b border-zinc-800/50 pb-4 mb-8">
              <h2 className="text-xl font-semibold text-zinc-200 flex items-center gap-2">
                <Package className="w-5 h-5 text-zinc-500" />
                Supporting Work & Tools
              </h2>
              <p className="text-sm text-zinc-500 mt-1">Libraries, utilities, scripts, and smaller packages.</p>
            </div>

            <div className="grid gap-4">
              {supportingProjects.map((project: ProjectResponse) => (
                <div key={project.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-zinc-900/20 border border-zinc-800/40 rounded-xl hover:bg-zinc-800/40 hover:border-zinc-700/50 transition-colors">
                  <div className="max-w-xl mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:z-0">
                        <h3 className="text-lg font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                      </Link>
                      {project.category && project.category !== 'CASE_STUDY' && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-700">
                          {categoryLabels[project.category] ?? project.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-1">{project.summary}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {project.techStack?.slice(0, 2).map((tech: string) => (
                      <span key={tech} className="hidden md:inline-block text-[10px] uppercase tracking-wider font-mono px-2 py-1 rounded bg-zinc-950 text-zinc-500 border border-zinc-800/50">
                        {tech}
                      </span>
                    ))}
                    <div className="flex gap-2 relative z-10">
                      {project.repoUrl && (
                        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-950 border border-zinc-800/50 text-zinc-400 hover:text-zinc-300 transition-colors">
                          <FaGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-indigo-950/30 border border-indigo-900/30 text-indigo-400 hover:text-indigo-300 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {project.packageUrl && (
                        <a href={project.packageUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/30 text-amber-400 hover:text-amber-300 transition-colors" title={project.packageRegistry || 'Package'}>
                          <Package className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Code Snippet Pane */}
      <div className="hidden xl:block sticky top-8 self-start w-full">
        <ScrollArea className="h-[calc(100vh-8rem)] w-full">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl h-fit">
            <div className="flex flex-col gap-8 p-6 lg:p-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Request</div>
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-sm text-zinc-300">
              <span className="text-indigo-400 font-bold">GET</span> /api/v1/projects?sort=tier
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Response</div>
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-sm text-zinc-300 overflow-x-auto">
              <pre>
{JSON.stringify(projects.slice(0, 2).map((p: ProjectResponse) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  tier: p.tier,
  techStack: p.techStack,
  languages: p.languages
})), null, 2)}
              </pre>
            </div>
            {projects.length > 2 && (
              <div className="text-[10px] text-zinc-500 mt-3 font-mono uppercase tracking-wider">... {projects.length - 2} more items omitted</div>
            )}
          </div>
        </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
