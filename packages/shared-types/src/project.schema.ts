import { z } from 'zod';

export const ProjectTier = z.enum(['FLAGSHIP', 'SUPPORTING']);
export type ProjectTierType = z.infer<typeof ProjectTier>;

export const ProjectCategory = z.enum([
  'CASE_STUDY',
  'PACKAGE',
  'LIBRARY',
  'EXPERIMENT',
  'FIRMWARE',
  'TOOL',
  'APPLICATION',
  'OTHER',
]);
export type ProjectCategoryType = z.infer<typeof ProjectCategory>;

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .min(1)
    .max(100),
  summary: z.string().max(300),
  description: z.string().optional().default(''),
  category: ProjectCategory.default('CASE_STUDY'),
  techStack: z.array(z.string()).min(1, 'At least one technology required'),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  repoOwner: z.string().max(100).optional().default(''),
  repoName: z.string().max(200).optional().default(''),
  diagramUrl: z.string().url().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  tier: ProjectTier.default('SUPPORTING'),
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),

  // Case Study fields (optional)
  problem: z.string().optional().default(''),
  architectureNote: z.string().optional().default(''),
  keyDecision: z.string().optional().default(''),

  // Package/Library fields (optional)
  packageName: z.string().max(200).optional().default(''),
  packageRegistry: z.string().max(50).optional().default(''),
  packageUrl: z.string().url().optional().or(z.literal('')),

  // Metadata
  languages: z.array(z.string()).optional().default([]),
  topics: z.array(z.string()).optional().default([]),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectDto = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectSchema>;

// Response shape (what the API returns)
export const ProjectResponseSchema = CreateProjectSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
