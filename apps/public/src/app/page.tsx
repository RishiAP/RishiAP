import React from 'react';
import { getSkills, getExperience, getProjects, getPosts, getEducation, getSocialLinks } from '@/lib/api';
import { HomeClient } from '@/components/home-client';

export default async function Home() {
  const startTime = Date.now();
  const [skills, experience, projects, posts, education, socialLinks] = await Promise.all([
    getSkills().catch(() => []),
    getExperience().catch(() => []),
    getProjects().catch(() => []),
    getPosts().catch(() => []),
    getEducation().catch(() => []),
    getSocialLinks().catch(() => [])
  ]);
  const fetchTimeMs = Date.now() - startTime;
  const timestamp = new Date().toISOString();

  return (
    <HomeClient 
      skills={skills}
      experience={experience}
      projects={projects}
      posts={posts}
      socialLinks={socialLinks}
      fetchTimeMs={fetchTimeMs}
      timestamp={timestamp}
    />
  );
}