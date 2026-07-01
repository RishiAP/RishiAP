import React from 'react';
import { getExperience } from '@/lib/api';
import { ExperienceList } from '@/components/ExperienceList';

export const metadata = {
  title: 'Experience | Rishi',
  description: 'My professional experience, internships, and open-source contributions.',
};

export default async function ExperiencePage() {
  const experiences = await getExperience().catch(() => []);

  return (
    <div className="flex-1 h-full px-4 py-8 md:px-8 lg:px-12 md:py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
        Experience
      </h1>
      <p className="text-xl text-zinc-400 mb-16 max-w-2xl">
        My professional journey, including full-time roles, internships, and significant open-source contributions.
      </p>

      <div className="relative border-l border-zinc-800 ml-4 md:ml-0 space-y-12 pb-12">
        <ExperienceList experiences={experiences} />
      </div>
    </div>
  );
}
