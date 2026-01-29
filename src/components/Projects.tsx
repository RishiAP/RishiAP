"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/commonTypes";
import { FiExternalLink, FiGithub, FiStar, FiGitBranch } from "react-icons/fi";

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      axios.get("https://rishiap.vercel.app/api/projects")
        .then((response) => {
          setProjects(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch projects", error);
        }).finally(() => {
          setLoading(false);
        });
    };

    fetchProjects();
  }, []);

  function formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const getLanguageColor = (lang: string) => {
    const colors: {[key: string]: string} = {
      'JavaScript': 'bg-yellow-400/10 text-yellow-300 border-yellow-400/30',
      'TypeScript': 'bg-blue-400/10 text-blue-300 border-blue-400/30',
      'Python': 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
      'Java': 'bg-orange-400/10 text-orange-300 border-orange-400/30',
      'CSS': 'bg-pink-400/10 text-pink-300 border-pink-400/30',
      'HTML': 'bg-red-400/10 text-red-300 border-red-400/30',
      'React': 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30',
      'Node.js': 'bg-green-400/10 text-green-300 border-green-400/30',
    };
    return colors[lang] || 'bg-green-400/10 text-green-300 border-green-400/30';
  };

  return (
    <section id="projects" className="container py-16 md:py-24 px-4 md:px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center space-y-3 relative z-10 mb-10">
        <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-sm mb-4">
          <FiGithub />
          <span>~/projects</span>
          <span className="text-gray-500">$</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <p className="text-gray-300 md:text-lg">
          Some of my recent work and open-source contributions
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 relative z-10">
          <div className="inline-block">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            </div>
            <p className="text-gray-400 font-mono text-sm mt-4 text-center">Loading projects...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
          {projects.map((project) => (
            <a 
              key={project.id} 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative block"
            >
              {/* Rotating Aura Line Animation - Border effect */}
              <div className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-green-400 via-purple-400 via-cyan-400 to-transparent animate-spin-slow"></div>
                <div className="absolute inset-[2px] bg-slate-900 rounded-lg"></div>
              </div>
              
              <Card 
                className="relative flex flex-col justify-between border border-green-400/20 bg-slate-900/50 backdrop-blur group-hover:border-transparent hover:shadow-2xl hover:shadow-green-400/10 transition-all duration-300 overflow-hidden h-full cursor-pointer"
              >
                {/* Project Image */}
                <CardContent className="p-0 relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <Image
                    src={`https://opengraph.githubassets.com/1/${project.full_name}`}
                    alt={project.name}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-20"></div>
                </CardContent>

                {/* Project Info */}
                <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-300 font-mono">{project.name}</CardTitle>
                <p className="text-gray-300 text-sm line-clamp-2">{project.description || "No description provided"}</p>
              </CardHeader>

              <CardFooter className="flex flex-col gap-4 pt-0">
                {/* Languages */}
                <div className="w-full space-y-2">
                  <p className="text-xs text-gray-400 font-mono">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.languages?.slice(0, 3).map((lang, index) => (
                      <Badge
                        key={index}
                        className={`text-xs font-mono border ${getLanguageColor(lang.language)}`}
                        variant="outline"
                      >
                        {lang.language} {lang.percentage.toFixed(0)}%
                      </Badge>
                    ))}
                    {project.languages && project.languages.length > 3 && (
                      <Badge className="text-xs font-mono bg-gray-800 text-gray-300 border-gray-600" variant="outline">
                        +{project.languages.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-2 flex-wrap text-xs">
                  <Badge className="bg-cyan-400/10 text-cyan-300 border-cyan-400/30 gap-1" variant="outline">
                    <FiStar size={12} />
                    {project.stargazers_count}
                  </Badge>
                  <Badge className="bg-purple-400/10 text-purple-300 border-purple-400/30 gap-1" variant="outline">
                    <FiGitBranch size={12} />
                    {project.forks_count}
                  </Badge>
                  <Badge className="bg-green-400/10 text-green-300 border-green-400/30" variant="outline">
                    Updated: {formatDate(new Date(project.updated_at))}
                  </Badge>
                </div>

                {/* View Project Button */}
                <div className="w-full">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 group/btn border border-green-400/30 pointer-events-none"
                  >
                    <FiExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    View Project
                  </Button>
                </div>
              </CardFooter>
            </Card>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
