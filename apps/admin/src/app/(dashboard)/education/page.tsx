import { fetchApi } from '@/lib/api-client';
import { type EducationResponse } from '@rishicodes/shared-types';
import { EducationManager } from './education-manager';

export const dynamic = 'force-dynamic';

export default async function EducationPage() {
  const educationList = await fetchApi<EducationResponse[]>('/admin/education');

  return <EducationManager initialData={educationList} />;
}
