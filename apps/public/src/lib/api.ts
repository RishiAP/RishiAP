import { type ProjectResponse, type PostResponse, type EducationResponse, type ExperienceResponse, type SocialLinkResponse } from '@rishicodes/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const DEFAULT_REVALIDATE = process.env.REVALIDATE_TIME 
  ? parseInt(process.env.REVALIDATE_TIME, 10) 
  : 60;
const GITHUB_REVALIDATE = process.env.GITHUB_REVALIDATE_TIME
  ? parseInt(process.env.GITHUB_REVALIDATE_TIME, 10)
  : 600;

export async function fetchPublicApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { 
      // In production, fallback to 1-hour time-based revalidation so date expirations automatically refresh.
      // In development, strict tag-based caching ensures 1-refresh updates.
      ...(process.env.NODE_ENV === 'production' ? { revalidate: 3600 } : {}),
      ...options?.next 
    },
  });

  if (!response.ok) {
    throw new Error(`Public API fetch failed for ${endpoint}`);
  }

  const data = await response.json();
  return data.data ?? data;
}

export async function getProjects(category?: string) {
  const query = category ? `?category=${category}` : '';
  return fetchPublicApi<ProjectResponse[]>(`/projects${query}`, { next: { tags: ['projects-list'] } });
}

export async function getProjectBySlug(slug: string) {
  return fetchPublicApi<ProjectResponse>(`/projects/${slug}`, { next: { tags: [`project-${slug}`] } });
}

export interface GithubProjectMeta {
  stars: number;
  forks: number;
  openIssues: number;
  lastPushed: string;
  languages: { name: string; percentage: number }[];
}

export async function getProjectEnriched(slug: string) {
  return fetchPublicApi<ProjectResponse & { github: { meta: GithubProjectMeta; readme: string | null } | null }>(
    `/projects/${slug}/enriched`,
    { next: { tags: [`project-${slug}`] } },
  );
}

export async function getPosts() {
  return fetchPublicApi<PostResponse[]>('/posts', { next: { tags: ['posts-list'] } });
}

export async function getPostBySlug(slug: string) {
  return fetchPublicApi<PostResponse>(`/posts/${slug}`, { next: { tags: [`post-${slug}`] } });
}

export interface Skill {
  id: string;
  name: string;
  field: string;
  categoryId: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  skills: Skill[];
}

export async function getSkills() {
  return fetchPublicApi<SkillCategory[]>('/skills', { next: { tags: ['skills-list'] } });
}

export async function getEducation() {
  return fetchPublicApi<EducationResponse[]>('/education', { next: { tags: ['education-list'] } });
}

export async function getExperience() {
  return fetchPublicApi<ExperienceResponse[]>('/experience', { next: { tags: ['experience-list'] } });
}

export function computeActiveRole(experience: ExperienceResponse[]) {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const currentOngoingRoles = experience.filter((e) => {
    if (!e.endDate || e.endDate.trim() === '') return true;
    return e.endDate >= currentMonthStr;
  }).sort((a, b) => {
    const endA = (!a.endDate || a.endDate.trim() === '') ? '9999-99' : a.endDate;
    const endB = (!b.endDate || b.endDate.trim() === '') ? '9999-99' : b.endDate;
    if (endA === endB) return (b.startDate || '').localeCompare(a.startDate || '');
    return endB.localeCompare(endA);
  });

  if (currentOngoingRoles.length > 0) {
    return { 
      role: currentOngoingRoles[0].role, 
      company: currentOngoingRoles[0].org,
      activeRolesCount: currentOngoingRoles.length
    };
  }
  return { role: "Full Stack Developer", company: null, activeRolesCount: 0 };
}

export async function getSocialLinks() {
  return fetchPublicApi<SocialLinkResponse[]>('/v1/social-links', { next: { tags: ['social-links'] } });
}

export async function getGithubRepo(name: string) {
  // Use revalidate to cache at Next.js edge. Defaults to 10 minutes (600s).
  return fetchPublicApi<Record<string, unknown>>(`/github/repo/${name}`, { next: { revalidate: GITHUB_REVALIDATE } });
}

