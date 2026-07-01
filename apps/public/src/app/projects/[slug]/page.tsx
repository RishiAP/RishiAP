import React from 'react';
import { getProjectEnriched } from '@/lib/api';
import { GitBranch, ExternalLink, Star, GitFork, Package, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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


  const sidebarContent = (
    <>
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Request</div>
        <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 font-mono text-sm text-zinc-300">
          <span className="text-indigo-400 font-bold">GET</span> /api/v1/projects/{slug}
        </div>
      </div>

      {githubStatsContent}

      {isPackageOrLibrary && project.packageName && (
        <div className="mt-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Package Info</div>
          <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 space-y-2">
            <div className="text-sm text-zinc-300 font-mono">{project.packageName}</div>
            {project.packageRegistry && (
              <div className="text-xs text-zinc-500">
                Registry: <span className="text-zinc-400">{project.packageRegistry}</span>
              </div>
            )}
            <div className="mt-3 bg-zinc-900 rounded p-3 font-mono text-sm text-zinc-300">
              {project.packageRegistry === 'npm' && (
                <span>npm install {project.packageName}</span>
              )}
              {project.packageRegistry === 'pypi' && (
                <span>pip install {project.packageName}</span>
              )}
              {project.packageRegistry === 'maven' && (
                <span>&lt;dependency&gt;{project.packageName}&lt;/dependency&gt;</span>
              )}
              {!['npm', 'pypi', 'maven'].includes(project.packageRegistry ?? '') && (
                <span>{project.packageName}</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Response</div>
        <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 font-mono text-sm text-zinc-300 overflow-x-auto">
          <pre>
{JSON.stringify({
  id: project.id,
  title: project.title,
  category: project.category,
  tier: project.tier,
  github: githubMeta ? { stars: githubMeta.stars, forks: githubMeta.forks } : null,
}, null, 2)}
          </pre>
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

        {/* Tech Stack & Languages */}
        {(project.techStack?.length > 0 || project.languages?.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.languages?.map((lang: string) => (
              <span key={lang} className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-800/50">
                {lang}
              </span>
            ))}
            {project.techStack?.map((tech: string) => (
              <span key={tech} className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {tech}
              </span>
            ))}
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

        {/* Mobile GitHub Details (Inline) */}
        {githubMeta && (
          <div className="xl:hidden mb-10 space-y-4">
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
            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
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
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6 prose prose-invert prose-zinc max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                </div>
              </>
            ) : (
              <details className="group">
                <summary className="cursor-pointer text-lg font-semibold text-zinc-200 mb-4 font-mono hover:text-indigo-400 transition-colors">
                  <span className="text-indigo-400 mr-2">▸</span>
                  README.md
                </summary>
                <div className="mt-4 bg-zinc-900 rounded-lg border border-zinc-800 p-4 sm:p-6 prose prose-invert prose-zinc max-w-none prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-indigo-400 hover:prose-a:text-indigo-300">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Right Pane — GitHub Stats */}
      <div className="bg-zinc-900 border-l border-zinc-800 p-6 hidden xl:block sticky top-0 max-h-[calc(100dvh-7.5rem)] overflow-y-auto">
        {sidebarContent}
      </div>
    </div>
  );
}
