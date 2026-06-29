import { z } from 'zod';

export const ExperienceType = z.enum([
  'WORK',
  'INTERNSHIP',
  'VOLUNTEER',
  'FREELANCE',
  'OPEN_SOURCE',
  'LEADERSHIP',
]);
export type ExperienceTypeValue = z.infer<typeof ExperienceType>;

export const CreateExperienceSchema = z.object({
  type: ExperienceType,
  role: z.string().min(1, 'Role is required').max(200),
  org: z.string().min(1, 'Organization is required').max(200),
  orgUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().max(200).optional().default(''),
  startDate: z.string().min(1, 'Start date is required').max(10), // e.g. "2024-06"
  endDate: z.string().max(10).optional().default(''), // empty = present
  description: z.string().max(5000).optional().default(''),
  techStack: z.array(z.string()).optional().default([]),
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const UpdateExperienceSchema = CreateExperienceSchema.partial();

export type CreateExperienceDto = z.infer<typeof CreateExperienceSchema>;
export type UpdateExperienceDto = z.infer<typeof UpdateExperienceSchema>;

export const ExperienceResponseSchema = CreateExperienceSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ExperienceResponse = z.infer<typeof ExperienceResponseSchema>;
