"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Project } from "@/types/commonTypes";

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
    const day = date.getDate(); // Get the day as a number
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get abbreviated month name
    const year = date.getFullYear(); // Get the full year
  
    return `${day} ${month} ${year}`;
  }
  return (
    <section id="projects" className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Projects</h2>
        <p className="text-muted-foreground md:text-lg">Some of my recent work</p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading projects...</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between group hover:shadow-lg transition-all md:mx-0 mx-4">
              <CardContent className="p-0 relative w-full" style={{ aspectRatio: "16/9" }}>
                <img
                  src={`https://opengraph.githubassets.com/1/${project.full_name}`}
                  alt={project.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </CardContent>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <p className="text-muted-foreground">{project.description || "No description provided"}</p>
              </CardHeader>
              <CardFooter className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span>Languages Used</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.languages?.map((lang, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                      >
                        {lang.language} ({lang.percentage.toFixed(2)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{project.stargazers_count} Stars</Badge>
                <Badge variant="outline">{project.forks_count} Forks</Badge>
                <Badge variant="outline">Updated : {formatDate(new Date(project.updated_at))}</Badge>
                </div>
                <a href={project.html_url} className="w-full" target="_blank">
                <Button
                  rel="noopener noreferrer"
                  className="w-full"
                  >
                  View Project
                </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
