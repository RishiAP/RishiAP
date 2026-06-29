import { fetchApi } from '@/lib/api-client';
import { type UpdateSkillCategoryDto, type UpdateSkillDto } from '@rishicodes/shared-types';
import { SkillsManager } from './skills-manager';

export const dynamic = 'force-dynamic';

interface Skill extends UpdateSkillDto {
  id: string;
}

interface Category extends UpdateSkillCategoryDto {
  id: string;
  skills: Skill[];
}

export default async function SkillsPage() {
  const categories = await fetchApi<Category[]>('/admin/skills');

  return <SkillsManager initialData={categories} />;
}
