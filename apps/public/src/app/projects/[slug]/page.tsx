import React from 'react';
import { getProjectEnriched } from '@/lib/api';
import { GitBranch, ExternalLink, Star, GitFork, Package, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { highlightJson } from '@/lib/highlight';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { CopyPackageInfo } from '@/components/ui/copy-package-info';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectEnriched(slug);
    const images = project.coverUrl ? [project.coverUrl] : undefined;
    
    return {
      title: project.title,
      description: project.summary,
      openGraph: {
        title: project.title,
        description: project.summary,
        type: 'article',
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.summary,
        images,
      },
    };
  } catch {
    return { title: 'Project Not Found' };
  }
}

export async function generateStaticParams() {
  const { getProjects } = await import('@/lib/api');
  const projects = await getProjects().catch(() => []);
  return projects.map((project: { slug: string }) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project;
  try {
    project = await getProjectEnriched(slug);
  } catch {
    notFound();
  }

  const githubMeta = project.github?.meta;
  const readme = project.github?.readme;
  const isCaseStudy = project.category === 'CASE_STUDY';
  const isPackageOrLibrary = project.category === 'PACKAGE' || project.category === 'LIBRARY';

  const githubStatsContent = githubMeta && (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">GitHub Stats</div>
      <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 space-y-3">
            <a href={`${project.repoUrl}/stargazers`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors w-fit">
              <Star className="w-4 h-4 text-amber-400" />
              <span>{githubMeta.stars} stars</span>
            </a>
            <a href={`${project.repoUrl}/forks`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors w-fit">
              <GitFork className="w-4 h-4 text-zinc-400" />
              <span>{githubMeta.forks} forks</span>
            </a>
        {githubMeta.languages && githubMeta.languages.length > 0 && (
          <div className="pt-2 mt-2 border-t border-zinc-800/50">
            <div className="text-xs text-zinc-500 mb-2">Languages</div>
            <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-3">
              {githubMeta.languages.map((l: { name: string; percentage: number }, i: number) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                const color = colors[i % colors.length];
                return (
                  <div key={l.name} style={{ width: `${l.percentage}%` }} className={color} title={`${l.name} ${l.percentage}%`} />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {githubMeta.languages.map((l: { name: string; percentage: number }, i: number) => {
                const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                const color = colors[i % colors.length];
                return (
                  <div key={l.name} className="flex items-center gap-1.5 text-xs">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-zinc-300">{l.name}</span>
                    <span className="text-zinc-500">{l.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {githubMeta.lastPushed && (
          <div className="text-sm text-zinc-400">
            Last push: <span className="text-zinc-200">{formatDate(githubMeta.lastPushed)}</span>
          </div>
        )}
        {githubMeta.openIssues > 0 && (
          <div className="text-sm text-zinc-400">
            Open issues: <span className="text-zinc-200">{githubMeta.openIssues}</span>
          </div>
        )}
      </div>
    </div>
  );


  let packageCommand = project.packageName;
  if (project.packageRegistry === 'npm') packageCommand = `npm install ${project.packageName}`;
  else if (project.packageRegistry === 'pypi') packageCommand = `pip install ${project.packageName}`;
  else if (project.packageRegistry === 'maven') packageCommand = `<dependency>${project.packageName}</dependency>`;

  const packageInfoContent = isPackageOrLibrary && project.packageName && (
    <div className="mt-6 space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Package Info</div>
      <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 space-y-2">
        <div className="text-sm text-zinc-300 font-mono">{project.packageName}</div>
        {project.packageRegistry && (
          <div className="text-xs text-zinc-500">
            Registry: <span className="text-zinc-400">{project.packageRegistry}</span>
          </div>
        )}
        <CopyPackageInfo text={packageCommand} />
      </div>
    </div>
  );

  const mobilePackageInfoContent = isPackageOrLibrary && project.packageName && (
    <div className="pt-4 mt-4 border-t border-zinc-800/50">
      <div className="text-xs text-zinc-500 mb-2">Install Package</div>
      <CopyPackageInfo text={packageCommand} />
    </div>
  );

  const sidebarContent = (
    <>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Request</div>
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-sm text-zinc-300">
          <span className="text-indigo-400 font-bold">GET</span> /api/v1/projects/{slug}
        </div>
      </div>

      {githubStatsContent}
      {packageInfoContent}

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Response</div>
        <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-[13px] leading-relaxed text-zinc-300">
          <pre className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{
            __html: highlightJson({
              id: project.id,
              title: project.title,
              category: project.category,
              tier: project.tier,
              github: githubMeta ? { stars: githubMeta.stars, forks: githubMeta.forks } : null,
            })
          }} />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_500px] h-full">
      {/* Main Content */}
      <div className="px-4 py-8 md:px-8 lg:px-12 md:py-12 w-full">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          {project.title}
        </h1>
        <p className="text-xl text-zinc-400 mb-6">
          {project.summary}
        </p>

        {/* Tech Stack, Languages & Topics */}
        {(project.techStack?.length > 0 || project.languages?.length > 0 || project.topics?.length > 0) && (
          <div className="flex flex-col gap-3 mb-8">
            {project.languages?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 w-16">Languages</span>
                {project.languages.map((lang: string) => (
                  <span key={lang} className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-800/50">
                    {lang}
                  </span>
                ))}
              </div>
            )}
            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 w-16">Stack</span>
                {project.techStack.map((tech: string) => (
                  <span key={tech} className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            {project.topics?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-1 w-16">Topics</span>
                {project.topics.map((topic: string) => (
                  <span key={topic} className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-900/50">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mb-8">
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
              {project.repoUrl.includes('github.com') ? <FaGithub className="w-4 h-4" /> : <GitBranch className="w-4 h-4" />}
              Source Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
          {project.packageUrl && (
            <a href={project.packageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
              <Package className="w-4 h-4" />
              {project.packageRegistry ?? 'Registry'}
            </a>
          )}
        </div>

        {/* Mobile GitHub Details & Package Info (Inline) */}
        {(githubMeta || packageInfoContent) && (
          <div className="xl:hidden mb-10 space-y-4">
            {githubMeta && (
              <>
                {githubMeta.languages && githubMeta.languages.length > 0 && (
                  <div className="bg-zinc-900/40 rounded-lg p-4 border border-zinc-800/50 max-w-sm">
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden mb-3">
                  {githubMeta.languages.map((l: { name: string; percentage: number }, i: number) => {
                    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={l.name} style={{ width: `${l.percentage}%` }} className={color} title={`${l.name} ${l.percentage}%`} />
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {githubMeta.languages.map((l: { name: string; percentage: number }, i: number) => {
                    const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={l.name} className="flex items-center gap-1.5 text-xs">
                        <div className={`w-2 h-2 rounded-full ${color}`} />
                        <span className="text-zinc-300">{l.name}</span>
                        <span className="text-zinc-500 font-mono">{l.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {githubMeta.lastPushed && (
                <div className="text-xs text-zinc-500 flex items-center gap-1.5 mr-1">
                  <FaGithub className="w-3.5 h-3.5" />
                  Updated {formatDate(githubMeta.lastPushed)}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs font-mono">
                <a href={`${project.repoUrl}/stargazers`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-300 transition-colors px-2 py-1 rounded border border-zinc-800">
                  <Star className="w-3 h-3 text-amber-400" /> {githubMeta.stars}
                </a>
                <a href={`${project.repoUrl}/forks`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-300 transition-colors px-2 py-1 rounded border border-zinc-800">
                  <GitFork className="w-3 h-3 text-zinc-400" /> {githubMeta.forks}
                </a>
              </div>
            </div>
            </>
            )}
            
            {mobilePackageInfoContent}
          </div>
        )}

        {/* Case Study Content */}
        {isCaseStudy && (
          <div className="space-y-8">
            {project.problem && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-3 font-mono">
                  <span className="text-indigo-400">PROBLEM</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed">{project.problem}</p>
              </div>
            )}

            {project.architectureNote && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-3 font-mono">
                  <span className="text-indigo-400">ARCHITECTURE</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed">{project.architectureNote}</p>
              </div>
            )}

            {project.keyDecision && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-200 mb-3 font-mono">
                  <span className="text-indigo-400">KEY DECISION</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed">{project.keyDecision}</p>
              </div>
            )}
          </div>
        )}

        {/* General Description */}
        {project.description && (
          <div className="mt-8">
            <div className="prose prose-invert prose-zinc max-w-none prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-200 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:text-[inherit] [&_pre_code]:rounded-none">
              <MarkdownRenderer content={project.description} />
            </div>
          </div>
        )}

        {/* Diagram */}
        {project.diagramUrl && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-200 mb-3 font-mono">
              <span className="text-indigo-400">ARCHITECTURE DIAGRAM</span>
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.diagramUrl} alt="Architecture diagram" className="rounded-lg border border-zinc-800" />
          </div>
        )}

        {/* README (for packages/libraries this is primary; for others it's supplementary) */}
        {readme && (
          <div className="mt-10">
            {isPackageOrLibrary ? (
              <>
                <h2 className="text-lg font-semibold text-zinc-200 mb-4 font-mono">
                  <span className="text-indigo-400">README.md</span>
                </h2>
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6 prose prose-invert prose-zinc max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-indigo-400 [&_a:hover]:text-indigo-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-200 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-img:inline-block prose-img:m-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:text-[inherit] [&_pre_code]:rounded-none">
                  <MarkdownRenderer content={readme} />
                </div>
              </>
            ) : (
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold text-zinc-200 mb-4 font-mono hover:text-indigo-400 transition-colors">
                  <span className="text-indigo-400 mr-2">▸</span>
                  README.md
                </summary>
                <div className="mt-4 bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6 prose prose-invert prose-zinc max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-indigo-400 [&_a:hover]:text-indigo-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-zinc-200 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-img:inline-block prose-img:m-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:text-[inherit] [&_pre_code]:rounded-none">
                  <MarkdownRenderer content={readme} />
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Right Pane — GitHub Stats */}
      <div className="hidden xl:block sticky top-8 self-start w-full">
        <ScrollArea className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl w-full max-h-[calc(100vh-8rem)] [&>[data-slot=scroll-area-viewport]]:max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col gap-6 p-6 lg:p-8">
            {sidebarContent}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
