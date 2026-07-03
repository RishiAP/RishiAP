import React from 'react';
import { Metadata } from 'next';
import { getEducation } from '@/lib/api';
import { EducationTable } from '@/components/EducationTable';

export const metadata: Metadata = {
  title: 'Education',
  description: 'My academic background, degrees, certifications, and educational qualifications.',
  openGraph: {
    title: 'Education & Qualifications',
    description: 'My academic background, degrees, certifications, and educational qualifications.',
    type: 'website',
  },
};

export default async function EducationPage() {
  const education = await getEducation().catch(() => []);

  return (
    <div className="flex-1 h-full px-4 py-8 md:px-8 lg:px-12 md:py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
        Education
      </h1>
      <p className="text-xl text-zinc-400 mb-16 max-w-2xl">
        My academic background, degrees, and institutions.
      </p>

      {education.length > 0 ? (
        <EducationTable education={education} />
      ) : (
        <div className="pl-4 text-zinc-500 italic">No education records found.</div>
      )}
    </div>
  );
}
