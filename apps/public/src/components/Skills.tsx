"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { FaReact, FaNodeJs, FaLink, FaGitAlt, FaBootstrap, FaJava, FaPython } from "react-icons/fa";
import { SiTailwindcss, SiTypescript, SiNextdotjs, SiMongodb, SiPostgresql, SiArchlinux, SiPostman, SiGraphql, SiFlask, SiMysql, SiNeo4J, SiJavascript, SiC } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { useState } from "react";
import { FiCode } from "react-icons/fi";

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

const getLevelColor = (level: string) => {
  switch(level) {
    case "Expert": return "bg-green-400/10 text-green-300 border-green-400/30";
    case "Advanced": return "bg-cyan-400/10 text-cyan-300 border-cyan-400/30";
    case "Intermediate": return "bg-blue-400/10 text-blue-300 border-blue-400/30";
    default: return "bg-purple-400/10 text-purple-300 border-purple-400/30";
  }
};

export function Skills() {
  const [currentYear] = useState(new Date().getFullYear());

  const calculateExperience = (startYear: number): string => {
    const years = currentYear - startYear;
    return `${years}+ years`;
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
    <section id="skills" className="container py-16 md:py-24 px-4 md:px-6 relative scroll-mt-2">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 right-1/3 w-80 h-80 bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center space-y-3 relative z-10 mb-10">
        <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-sm mb-4">
          <FiCode />
          <span>~/skills</span>
          <span className="text-gray-500">$</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          Skills & Expertise
        </h2>
        <p className="text-gray-300 md:text-lg">
          Technologies I&apos;ve mastered
        </p>
      </div>

      <div className="grid gap-6 w-full relative z-10">
        {skillCategories.map((category) => (
          <Card key={category.title} className="border border-green-400/20 bg-slate-900/50 backdrop-blur hover:border-green-400/40 transition-colors duration-300 overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono text-green-400">
                {`> ${category.title}`}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {category.skills.map((skill) => (
                  <HoverCard key={skill.name}>
                    <HoverCardTrigger asChild>
                      <div className={`px-4 py-3 rounded border cursor-pointer transition-all duration-200 ${getLevelColor(skill.level)} hover:shadow-lg hover:shadow-green-400/20 flex items-center gap-2`}>
                        <span className="text-lg">{skill.icon}</span>
                        <span className="text-xs font-mono">{skill.name}</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 bg-slate-900 border-green-400/20" side="top">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-mono text-green-400 font-medium text-lg">{skill.name}</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-cyan-300">
                            Experience: <span className="text-green-400 font-mono">{calculateExperience(skill.startYear)}</span>
                          </p>
                          <p className="text-cyan-300">
                            Level: <span className={`font-mono font-semibold ${getLevelColor(skill.level).split(' ')[2]}`}>{skill.level}</span>
                          </p>
                        </div>
                        <div className="h-1 bg-green-400/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                            style={{
                              width: skill.level === "Expert" ? "100%" : skill.level === "Advanced" ? "85%" : skill.level === "Intermediate" ? "65%" : "40%"
                            }}
                          />
                        </div>
                      </div>
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
