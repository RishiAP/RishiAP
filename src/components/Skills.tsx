"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FaReact, FaNodeJs, FaLink, FaGitAlt, FaBootstrap, FaJava, FaPython } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiMongodb, SiPostgresql, SiArchlinux, SiPostman, SiGraphql, SiFlask, SiMysql, SiNeo4J, SiJavascript, SiC } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { useState } from "react";

interface Skill {
  name: string;
  startYear: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  icon: React.ReactNode;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

export function Skills() {
  const [currentYear] = useState(new Date().getFullYear());

  const calculateExperience = (startYear: number): string => {
    const years = currentYear - startYear;
    return `${years} years experience`;
  };

  const skillCategories: SkillCategory[] = [
    {
      title: "Frontend Development",
      skills: [
        { name: "React", startYear: 2023, level: "Advanced", icon: <FaReact size={32} /> },
        { name: "Next.js", startYear: 2023, level: "Intermediate", icon: <SiNextdotjs size={32} /> },
        { name: "TypeScript", startYear: 2024, level: "Advanced", icon: <SiTypescript size={32} /> },
        { name: "Tailwind", startYear: 2023, level: "Intermediate", icon: <SiTailwindcss size={32} /> },
        { name: "Bootstrap", startYear: 2021, level: "Advanced", icon: <FaBootstrap size={32} /> },
    ],
    },
    {
      title: "Backend Development",
      skills: [
          { name: "Node.js", startYear: 2022, level: "Expert", icon: <FaNodeJs size={32} /> },
          { name: "Next.js", startYear: 2023, level: "Intermediate", icon: <SiNextdotjs size={32} /> },
        { name: "Flask", startYear: 2024, level: "Intermediate", icon: <SiFlask size={32} /> },
        { name: "REST APIs", startYear: 2021, level: "Expert", icon: <FaLink size={32} /> },
      ],
    },
    {
      title: "Database Management",
      skills: [
        { name: "PostgreSQL", startYear: 2024, level: "Intermediate", icon: <SiPostgresql size={32} /> },
        { name: "MySQL", startYear: 2021, level: "Advanced", icon: <SiMysql size={32} /> },
        { name: "MongoDB", startYear: 2022, level: "Advanced", icon: <SiMongodb size={32} /> },
        { name: "Neo4j", startYear: 2024, level: "Beginner", icon: <SiNeo4J size={32} /> },
      ],
    },
    {
      title: "Languages",
      skills: [
        { name: "Java", startYear: 2019, level: "Expert", icon: <FaJava size={32} /> },
        { name: "JavaScript", startYear: 2021, level: "Advanced", icon: <SiJavascript size={32} /> },
        { name: "Python", startYear: 2022, level: "Intermediate", icon: <FaPython size={32} /> },
        { name: "C Language", startYear: 2022, level: "Intermediate", icon: <SiC size={32} /> },
      ],
    },
    {
      title: "DevOps & Tools",
      skills: [
        { name: "Git", startYear: 2021, level: "Intermediate", icon: <FaGitAlt size={32} /> },
        { name: "Linux", startYear: 2022, level: "Intermediate", icon: <SiArchlinux size={32} /> },
        { name: "VS Code", startYear: 2021, level: "Advanced", icon: <VscVscode size={32} /> },
        { name: "Postman", startYear: 2021, level: "Intermediate", icon: <SiPostman size={32} /> },
        { name: "GraphQL", startYear: 2024, level: "Beginner", icon: <SiGraphql size={32} /> },
      ],
    },
  ];

  return (
    <section id="skills" className="container py-24 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Skills & Expertise
        </h2>
        <p className="text-muted-foreground md:text-lg">
          Technologies and tools I work with
        </p>
      </div>

      <div className="flex gap-8 flex-wrap justify-center">
        {skillCategories.map((category) => (
          <Card key={category.title} className="relative overflow-hidden w-full md:mx-0 mx-4 lg:w-[calc(30%-2rem)]">
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader>
              <CardTitle className="text-xl">{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {category.skills.map((skill) => (
                  <HoverCard key={skill.name}>
                    <HoverCardTrigger>
                      <Badge
                        variant="secondary"
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-secondary/80"
                      >
                        <div className="flex items-center gap-2">
                          {skill.icon}
                          <span>{skill.name}</span>
                        </div>
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2" side="top">
                      <h3 className="font-medium text-lg">{skill.name}</h3>
                      <p>{calculateExperience(skill.startYear)}</p>
                      <p className="text-sm text-muted-foreground">Level: {skill.level}</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
