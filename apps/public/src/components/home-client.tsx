"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, FileText, FolderKanban, Mail, Link as LinkIcon } from 'lucide-react';
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { formatDate, formatMonthYear } from '@/lib/utils';
import type { Skill, SkillCategory } from '@/lib/api';
import type { 
  SocialLinkResponse, 
  ExperienceResponse, 
  ProjectResponse, 
  PostResponse 
} from '@rishicodes/shared-types';

interface HomeClientProps {
  experience: ExperienceResponse[];
  projects: ProjectResponse[];
  posts: PostResponse[];
  skills: SkillCategory[];
  socialLinks: SocialLinkResponse[];
  fetchTimeMs: number;
  timestamp: string;
  currentRole: string;
  company: string | null;
  activeRolesCount: number;
}

const SocialIconMap: Record<string, React.FC<any>> = {
  github: FaGithub,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  email: Mail,
  resume: FileText,
  default: LinkIcon,
};

export function HomeClient({ experience, projects, posts, skills, socialLinks, fetchTimeMs, timestamp, currentRole, company, activeRolesCount }: HomeClientProps) {
  // State for interactive JSON pane
  const [hoveredItem, setHoveredItem] = useState<{ 
    type: 'project' | 'post' | 'profile'; 
    data?: ProjectResponse | PostResponse | ExperienceResponse | null 
  }>({ type: 'profile' });
  
  // Extract all skills from the nested categories
  const allSkills = skills.flatMap((category: SkillCategory) => category.skills || []);
  const coreCategory = skills.find((c: SkillCategory) => c.name.toLowerCase() === 'core' || c.name.toLowerCase() === 'primary');
  
  const primarySkills = coreCategory 
    ? coreCategory.skills.map((s: Skill) => s.name)
    : allSkills.slice(0, 5).map((s: Skill) => s.name);

  const topSkillsStr = primarySkills.length > 0 
    ? primarySkills.slice(0, 3).join(', ')
    : "TypeScript, Node.js, and C++";

  const publishedProjects = projects.filter((p) => p.published);
  const sortedProjects = [...publishedProjects].sort((a, b) => {
    if (a.tier === 'FLAGSHIP' && b.tier !== 'FLAGSHIP') return -1;
    if (a.tier !== 'FLAGSHIP' && b.tier === 'FLAGSHIP') return 1;
    return 0;
  });
  
  const publishedPosts = posts.filter((p) => p.published);

  // Generate the active JSON response based on hover state
  const getActiveJsonData = () => {
    if (hoveredItem.type === 'project' && hoveredItem.data) {
      const p = hoveredItem.data as ProjectResponse;
      return {
        endpoint: `GET /api/v1/projects/${p.slug}`,
        data: {
          id: p.id,
          title: p.title,
          tier: p.tier,
          category: p.category,
          techStack: p.techStack,
          languages: p.languages,
          metrics: {
            stars: 0,
            views: 0
          },
          status: p.published ? "Live" : "Development",
          links: {
            liveUrl: p.liveUrl,
            repoUrl: p.repoUrl
          }
        }
      };
    }
    
    if (hoveredItem.type === 'post' && hoveredItem.data) {
      const p = hoveredItem.data as PostResponse;
      return {
        endpoint: `GET /api/v1/posts/${p.slug}`,
        data: {
          id: p.id,
          title: p.title,
          publishedAt: p.publishedAt,
          tags: p.tags || [],
          metrics: {
            readingTime: Math.ceil((p.excerpt?.length || 200) / 200) + " min",
            views: 0
          }
        }
      };
    }
    
    // Default Profile Data
    return {
      endpoint: "GET /api/v1/developer/profile",
      data: {
        developer: {
          name: "Debjyoti Mondal",
          handle: "@rishicodes",
          currentRole: currentRole,
          activeCompany: company,
          location: "India"
        },
        metrics: {
          publishedProjects: publishedProjects.length,
          publishedArticles: publishedPosts.length,
          activeRoles: activeRolesCount
        },
        stack: {
          core: primarySkills.length > 0 ? primarySkills : ["TypeScript", "Node.js", "PostgreSQL"],
          recent: allSkills.slice(-5).map((s: Skill) => s.name)
        },
        status: "Available for new opportunities",
        fetchedAt: timestamp
      }
    };
  };

  const activeData = getActiveJsonData();
  const jsonString = JSON.stringify(activeData.data, null, 2);
  const highlightedJson = jsonString
    .replace(/"([^"]+)":/g, '<span class="text-indigo-300">"$1"</span>:')
    .replace(/: "(.*?)"/g, ': <span class="text-amber-200">"$1"</span>')
    .replace(/: (true|false|null|[0-9]+)/g, ': <span class="text-emerald-300">$1</span>');

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] h-full"
         onMouseLeave={() => setHoveredItem({ type: 'profile' })}>
      {/* Middle Prose Pane */}
      <div className="px-6 py-12 md:px-12 max-w-4xl mx-auto lg:mx-0 w-full space-y-20">
        
        {/* Intro Section */}
        <section className="relative" onMouseEnter={() => setHoveredItem({ type: 'profile' })}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-6">
            Debjyoti Mondal
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl font-light mb-8">
            {currentRole} {company ? `at ${company}` : ''} specializing in <span className="text-zinc-200 font-medium">backend architectures</span>, scalable APIs, and system design using <span className="text-indigo-400 font-medium">{topSkillsStr}</span>.
          </p>

          {socialLinks && socialLinks.filter(l => l.isActive).length > 0 && (
            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.filter(l => l.isActive).map((link) => {
                const Icon = SocialIconMap[link.platform.toLowerCase()] || SocialIconMap.default;
                return (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:text-indigo-400 transition-all text-zinc-400 text-sm font-medium group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>{link.label || link.platform}</span>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* Experience Section */}
        {experience.length > 0 && (
          <section className="space-y-6" onMouseEnter={() => setHoveredItem({ type: 'profile' })}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-zinc-500" />
                Experience
              </h2>
              <Link href="/experience" className="text-sm text-zinc-400 hover:text-indigo-400 flex items-center gap-1 group transition-colors">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              {experience.slice(0, 3).map((job) => (
                <div key={job.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-colors">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all hover:shadow-xl">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-zinc-200 text-lg">{job.role}</h3>
                    </div>
                    <div className="text-sm text-indigo-400 font-medium mb-3">{job.org}</div>
                    <div className="text-xs text-zinc-500 font-mono tracking-wider uppercase">
                      {formatMonthYear(job.startDate)} — {job.endDate ? formatMonthYear(job.endDate) : 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent Projects Section */}
        {sortedProjects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between" onMouseEnter={() => setHoveredItem({ type: 'profile' })}>
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-zinc-500" />
                Selected Work
              </h2>
              <Link href="/projects" className="text-sm text-zinc-400 hover:text-indigo-400 flex items-center gap-1 group transition-colors">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {sortedProjects.slice(0, 4).map((project) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all hover:-translate-y-1 overflow-hidden hover:shadow-xl p-6 relative"
                  onMouseEnter={() => setHoveredItem({ type: 'project', data: project })}
                >
                  <div className="flex items-center gap-2 mb-2 mt-2">
                    <h3 className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                    {project.category && project.category !== 'CASE_STUDY' && (
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-700/50">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-3 mb-6 leading-relaxed">{project.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.languages?.slice(0, 2).map((lang: string) => (
                      <span key={lang} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 rounded-md">
                        {lang}
                      </span>
                    ))}
                    {project.techStack?.slice(0, 4).map((tech: string, i: number) => (
                      <span key={i} className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono bg-zinc-950 text-zinc-400 border border-zinc-800/80 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Writings */}
        {publishedPosts.length > 0 && (
          <section className="space-y-6 pb-12">
            <div className="flex items-center justify-between" onMouseEnter={() => setHoveredItem({ type: 'profile' })}>
              <h2 className="text-2xl font-semibold text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-500" />
                Engineering Blog
              </h2>
              <Link href="/blog" className="text-sm text-zinc-400 hover:text-indigo-400 flex items-center gap-1 group transition-colors">
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-4">
              {publishedPosts.slice(0, 3).map((post) => (
                <div 
                  key={post.id} 
                  className="flex flex-col sm:flex-row p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700/50 transition-all hover:shadow-xl group relative overflow-hidden"
                  onMouseEnter={() => setHoveredItem({ type: 'post', data: post })}
                >
                  <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors" />
                  <div className="flex-1 flex flex-col justify-center pl-2">
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors text-lg mb-2">{post.title}</h3>
                    </Link>
                    <p className="text-sm text-zinc-500 line-clamp-2 max-w-2xl">{post.excerpt}</p>
                    <div className="mt-4 text-xs font-mono text-zinc-600 inline-flex items-center w-fit bg-zinc-950/50 px-3 py-1.5 rounded-lg border border-zinc-800/50">
                      <FileText className="w-3 h-3 mr-2" />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Right Code Snippet Pane (Sticky) */}
      <div className="bg-zinc-900/80 backdrop-blur-xl border-l border-zinc-800/80 p-8 hidden lg:flex flex-col sticky top-0 h-screen transition-colors duration-500">
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 flex items-center justify-between">
            <span>Request</span>
            <span className={`h-2 w-2 rounded-full animate-pulse ${hoveredItem.type !== 'profile' ? 'bg-indigo-500/50' : 'bg-emerald-500/50'}`} />
          </div>
          <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800/80 font-mono text-sm text-zinc-300 shadow-inner overflow-hidden text-ellipsis whitespace-nowrap">
            <span className={`${hoveredItem.type !== 'profile' ? 'text-emerald-400' : 'text-indigo-400'} font-bold mr-3 transition-colors`}>GET</span> 
            {activeData.endpoint.replace('GET ', '')}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Response</div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              200 OK • {fetchTimeMs}ms
            </div>
          </div>
          <div className="relative">
            {/* Glow effect behind the JSON block */}
            <div className={`absolute -inset-1 blur-xl opacity-50 transition-colors duration-500 ${hoveredItem.type === 'project' ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10' : hoveredItem.type === 'post' ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10' : 'bg-gradient-to-r from-indigo-500/10 to-emerald-500/10'}`} />
            
            <pre 
              className="relative bg-zinc-950 rounded-xl p-6 border border-zinc-800/80 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-x-auto shadow-2xl transition-all"
              dangerouslySetInnerHTML={{ __html: highlightedJson }}
            />
          </div>
        </div>
        
        {/* Decorative Grid at bottom of sidebar */}
        <div className="mt-12 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,1) 1px, transparent 0)', backgroundSize: '16px 16px', height: '200px' }} />
      </div>
    </div>
  );
}
