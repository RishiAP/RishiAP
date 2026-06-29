import { fetchApi } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FolderKanban, FileText, Wrench, GraduationCap, Plus, ArrowRight, Activity, Cpu, Server, HardDrive, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { formatDate } from '@/lib/utils';

export default async function DashboardHomePage() {
  const user = await currentUser();
  const firstName = user?.firstName || 'Admin';

  const [projects, posts, skills, edu, exp] = await Promise.all([
    fetchApi<any[]>('/admin/projects').catch(() => []),
    fetchApi<any[]>('/admin/posts').catch(() => []),
    fetchApi<any[]>('/admin/skills').catch(() => []),
    fetchApi<any[]>('/admin/education').catch(() => []),
    fetchApi<any[]>('/admin/experience').catch(() => []),
  ]);

  const publishedPosts = posts.filter((p: any) => p.published).length;
  const publishedProjects = projects.filter((p: any) => p.published).length;
  const publishedExp = exp.filter((e: any) => e.published).length;
  const totalSkills = skills.reduce((acc: number, cat: any) => acc + (cat.skills?.length || 0), 0);

  const stats = {
    projects: `${publishedProjects}/${projects.length}`,
    posts: `${publishedPosts}/${posts.length}`,
    skills: totalSkills.toString(),
    education: edu.length.toString(),
  };

  const recentPosts = posts.slice(0, 3);
  const recentProjects = projects.slice(0, 3);
  
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const currentRoles = exp.filter((e: any) => {
    if (!e.endDate || e.endDate.trim() === '') return true;
    return e.endDate >= currentMonthStr;
  });

  const cards = [
    { title: 'Projects', count: stats.projects, icon: FolderKanban, href: '/projects', color: 'from-blue-500/20 to-transparent text-blue-400', border: 'hover:border-blue-500/50' },
    { title: 'Blog Posts', count: stats.posts, icon: FileText, href: '/posts', color: 'from-emerald-500/20 to-transparent text-emerald-400', border: 'hover:border-emerald-500/50' },
    { title: 'Skills', count: stats.skills, icon: Wrench, href: '/skills', color: 'from-amber-500/20 to-transparent text-amber-400', border: 'hover:border-amber-500/50' },
    { title: 'Education', count: stats.education, icon: GraduationCap, href: '/education', color: 'from-purple-500/20 to-transparent text-purple-400', border: 'hover:border-purple-500/50' },
  ];

  // System Stats
  const memoryUsage = process.memoryUsage();
  const memoryMb = Math.round(memoryUsage.rss / 1024 / 1024);
  const uptimeTotalSeconds = process.uptime();
  const uptimeDays = Math.floor(uptimeTotalSeconds / (3600 * 24));
  const uptimeHours = Math.floor((uptimeTotalSeconds % (3600 * 24)) / 3600);
  const uptimeMinutes = Math.floor((uptimeTotalSeconds % 3600) / 60);

  return (
    <div className="max-w-6xl mx-auto space-y-10 w-full pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-zinc-950/50 border border-zinc-800/60 p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-mono tracking-wider uppercase">System Online</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-zinc-400 max-w-lg">
            Here's what's happening across your digital ecosystem today. Manage your content, monitor system health, and deploy updates.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link href="/posts/new" className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 hover:shadow-indigo-900/40 hover:-translate-y-0.5 h-11 px-6">
            <Plus className="w-4 h-4 mr-2" />
            Write Post
          </Link>
          <Link href="/projects/new" className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all border border-zinc-700 bg-zinc-900/80 backdrop-blur-md shadow-lg hover:bg-zinc-800 hover:text-zinc-50 hover:border-zinc-600 hover:-translate-y-0.5 h-11 px-6">
            <FolderKanban className="w-4 h-4 mr-2" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link href={card.href} key={card.title} className="block group outline-none">
            <div className={`relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm p-6 transition-all duration-500 ${card.border} hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group-hover:bg-zinc-900/80`}>
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} blur-[32px] rounded-full transition-opacity opacity-20 group-hover:opacity-40`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg bg-zinc-900/80 border border-zinc-800/80 ${card.color.split(' ').pop()}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="text-4xl font-bold tracking-tight text-zinc-50 font-mono">
                  {card.count.toString().padStart(2, '0')}
                </div>
                
                <div className="mt-4 flex items-center text-xs font-semibold text-zinc-500 transition-all group-hover:text-zinc-300">
                  Manage records <ArrowRight className="ml-1.5 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Column (Takes up 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity Card */}
          <Card className="bg-zinc-950/50 border-zinc-800/60 shadow-xl backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                <CardDescription className="text-zinc-400">Your latest blog posts and projects</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Posts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> Latest Posts
                    </h3>
                    <Link href="/posts" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">View all</Link>
                  </div>
                  <div className="space-y-3">
                    {recentPosts.length > 0 ? recentPosts.map((post: any) => (
                      <Link href={`/posts/${post.slug}/edit`} key={post.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors group">
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-sm font-medium text-zinc-200 truncate group-hover:text-indigo-300 transition-colors">{post.title}</span>
                          <span className="text-xs text-zinc-500 truncate">{post.excerpt || 'No excerpt'}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${post.published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                            {post.published ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                          <span className="text-xs text-zinc-600 font-mono hidden sm:inline-block">{formatDate(post.createdAt)}</span>
                        </div>
                      </Link>
                    )) : (
                      <div className="text-sm text-zinc-500 p-4 text-center border border-dashed border-zinc-800 rounded-lg">No posts found</div>
                    )}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-blue-400" /> Latest Projects
                    </h3>
                    <Link href="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">View all</Link>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recentProjects.length > 0 ? recentProjects.map((project: any) => (
                      <Link href={`/projects/${project.slug}/edit`} key={project.id} className="flex flex-col p-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-500/10 transition-colors" />
                        <span className="text-sm font-medium text-zinc-200 mb-1 group-hover:text-indigo-300 transition-colors relative z-10">{project.title}</span>
                        <div className="flex items-center justify-between mt-auto pt-4 relative z-10">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                            {project.category.replace('_', ' ')}
                          </span>
                          <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                        </div>
                      </Link>
                    )) : (
                      <div className="col-span-2 text-sm text-zinc-500 p-4 text-center border border-dashed border-zinc-800 rounded-lg">No projects found</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Roles Card */}
          <Card className="bg-zinc-950/50 border-zinc-800/60 shadow-xl backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-400" /> Current Roles
                </CardTitle>
                <Link href="/experience" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">Manage</Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentRoles.length > 0 ? currentRoles.map((role: any) => (
                  <div key={role.id} className="flex flex-col p-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30">
                    <span className="text-sm font-medium text-zinc-200">{role.role}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-zinc-400 font-medium">{role.org}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {role.type}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-zinc-500 p-4 text-center border border-dashed border-zinc-800 rounded-lg">No ongoing roles</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status Column */}
        <div className="space-y-6">
          <Card className="bg-zinc-950/50 border-zinc-800/60 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Server className="w-5 h-5 text-indigo-400" /> System Status
              </CardTitle>
              <CardDescription className="text-zinc-400">Node environment metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-zinc-800 border border-zinc-700">
                      <Cpu className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Node.js</div>
                      <div className="text-sm font-semibold text-zinc-200">{process.version}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-zinc-800 border border-zinc-700">
                      <HardDrive className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Memory (RSS)</div>
                      <div className="text-sm font-semibold text-zinc-200">{memoryMb} MB</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-zinc-800 border border-zinc-700">
                      <Clock className="w-4 h-4 text-zinc-300" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Uptime</div>
                      <div className="text-sm font-semibold text-zinc-200">
                        {uptimeDays > 0 && `${uptimeDays}d `}
                        {uptimeHours > 0 && `${uptimeHours}h `}
                        {uptimeMinutes}m
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-400">Environment</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {process.env.NODE_ENV || 'development'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Database</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-emerald-400 font-mono">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
