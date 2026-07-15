import React from 'react';
import { Metadata } from 'next';
import { getSkills, type SkillCategory, type Skill } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Skills & Technologies',
  description: 'A comprehensive overview of my technical skills, programming languages, frameworks, and tools I use to build scalable applications.',
  openGraph: {
    title: 'Skills & Technologies',
    description: 'A comprehensive overview of my technical skills, programming languages, frameworks, and tools I use to build scalable applications.',
    type: 'website',
  },
};
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default async function Skills() {
  const skillsCategories = await getSkills().catch(() => []);

  const getColorForField = (field: string) => {
    if (!field) return { text: 'text-zinc-400', hover: 'hover:text-zinc-200' };
    
    const colors = [
      { text: 'text-emerald-400', hover: 'hover:text-emerald-300' },
      { text: 'text-blue-400', hover: 'hover:text-blue-300' },
      { text: 'text-violet-400', hover: 'hover:text-violet-300' },
      { text: 'text-rose-400', hover: 'hover:text-rose-300' },
      { text: 'text-amber-400', hover: 'hover:text-amber-300' },
      { text: 'text-cyan-400', hover: 'hover:text-cyan-300' },
    ];
    
    const normalized = field.toLowerCase().trim();
    if (normalized === 'language' || normalized === 'languages') return colors[0];
    if (normalized === 'framework' || normalized === 'frameworks') return colors[1];
    if (normalized === 'database' || normalized === 'databases') return colors[4];
    if (normalized === 'tool' || normalized === 'tools') return colors[5];
    if (normalized === 'platform' || normalized === 'platforms') return colors[2];
    
    // Normalize plurals to singulars for the hash (so "ORMs" and "ORM" get the exact same color)
    let hashKey = normalized;
    if (hashKey.endsWith('s') && hashKey.length > 3 && !hashKey.endsWith('ss')) {
      hashKey = hashKey.slice(0, -1);
    }
    
    let hash = 0;
    for (let i = 0; i < hashKey.length; i++) {
      hash = hashKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const dynamicDependencies: Record<string, string> = {};
  skillsCategories.forEach((category: SkillCategory) => {
    category.skills.forEach((skill: Skill) => {
      // Use order for fake versioning
      const fakeVersion = `^${(skill.order % 10) + 1}.0.0`;
      dynamicDependencies[skill.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')] = fakeVersion;
    });
  });

  const uniqueFields = Array.from(new Set(
    skillsCategories.flatMap((c: SkillCategory) => c.skills.map((s: Skill) => s.field))
  )).filter(Boolean).sort();

  const allDeps = Object.entries(dynamicDependencies);
  const truncatedDeps = Object.fromEntries(allDeps.slice(0, 8));
  if (allDeps.length > 8) {
    truncatedDeps[`... ${allDeps.length - 8} more`] = "omitted";
  }

  const packageJson = {
    name: "@rishi/stack",
    version: "1.0.0",
    dependencies: Object.keys(truncatedDeps).length > 0 ? truncatedDeps : {
      "@nestjs/core": "^10.0.0",
      "react": "^18.2.0"
    }
  };

  const highlightedPackageJson = JSON.stringify(packageJson, null, 2)
    .replace(/"([^"]+)":/g, '<span class="text-indigo-300">"$1"</span>:')
    .replace(/: "(.*?)"/g, ': <span class="text-amber-200">"$1"</span>');

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_500px] h-full">
      {/* Middle Prose Pane */}
      <div className="px-4 py-8 md:px-8 lg:px-12 md:py-12 max-w-3xl mx-auto lg:mx-0 w-full">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Skills & Technologies
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          The core stack I use to build robust, scalable applications.
        </p>

        <div className="space-y-12 mt-8">
          {skillsCategories.length > 0 ? skillsCategories.map((category: SkillCategory) => (
            <div key={category.id} className="group scroll-mt-24" id={`category-${category.id}`}>
              <h2 className="text-2xl font-semibold text-zinc-100 mb-6">
                {category.name}
              </h2>
              
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {category.skills.map((skill: Skill) => {
                  const color = getColorForField(skill.field);
                  return (
                    <Tooltip key={skill.id}>
                      <TooltipTrigger asChild>
                        <span 
                          className={`cursor-default text-lg font-semibold tracking-wide transition-colors ${color.text} ${color.hover}`}
                        >
                          {skill.name}
                        </span>
                      </TooltipTrigger>
                      {skill.field && (
                        <TooltipContent side="top" sideOffset={5}>
                          <p className="font-bold uppercase tracking-wider text-[10px]">{skill.field}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  );
                })}
              </div>
              
              <hr className="mt-12 border-zinc-800/50" />
            </div>
          )) : (
            <div className="text-zinc-500 italic">No skills registered.</div>
          )}
        </div>

        {uniqueFields.length > 0 && (
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <span className="text-sm font-semibold text-zinc-600 uppercase tracking-widest">Legend:</span>
              {uniqueFields.map((field: string) => {
                const color = getColorForField(field);
                return (
                  <span key={field} className={`text-sm font-bold uppercase tracking-wider ${color.text}`}>
                    {field}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Code Snippet Pane */}
      <div className="hidden xl:flex flex-col sticky top-8 self-start w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl max-h-[calc(100vh-8rem)]">
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex flex-col gap-8 p-6 lg:p-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Configuration</div>
              <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-[13px] leading-relaxed text-zinc-300">
                <span className="text-zinc-500">// package.json</span>
                <pre 
                  className="mt-2 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: highlightedPackageJson }}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Infrastructure</div>
              <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800/50 font-mono text-[13px] leading-relaxed text-zinc-300 overflow-x-auto">
                 <span className="text-zinc-500"># docker-compose.yml</span>
                <pre className="mt-2 text-indigo-300">
{`services:
  db:
    image: postgres:15-alpine
  redis:
    image: redis:7-alpine`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </TooltipProvider>
  );
}
