import { fetchApi } from '@/lib/api-client';
import { type ExperienceResponse } from '@rishicodes/shared-types';
import { ExperienceManager } from './experience-manager';

export const dynamic = 'force-dynamic';

export default async function ExperiencePage() {
  const experienceList = await fetchApi<ExperienceResponse[]>('/admin/experience');

  return <ExperienceManager initialData={experienceList} />;
}
