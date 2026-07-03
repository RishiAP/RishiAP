import React from 'react';
import { Metadata } from 'next';
import { getExperience } from '@/lib/api';
import { ExperienceList } from '@/components/ExperienceList';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'My professional experience, career history, internships, and open-source contributions.',
  openGraph: {
    title: 'Professional Experience',
    description: 'My professional experience, career history, internships, and open-source contributions.',
    type: 'website',
  },
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
