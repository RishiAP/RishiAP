import { z } from 'zod';

export const CreateEducationSchema = z.object({
  branch: z.string().max(200).optional(),
  startDate: z.string().min(1).max(20),       // e.g. "2022-08"
  endDate: z.string().max(20).nullable().optional(),
  degree: z.string().min(1).max(200),      // e.g. "B.Tech"
  institution: z.string().min(1).max(200), // e.g. "GB Pant University · Pantnagar"
  description: z.string().max(500).optional().default(''),
  order: z.number().int().min(0).default(0),
});

export const UpdateEducationSchema = CreateEducationSchema.partial();

export type CreateEducationDto = z.infer<typeof CreateEducationSchema>;
export type UpdateEducationDto = z.infer<typeof UpdateEducationSchema>;

export const EducationResponseSchema = CreateEducationSchema.extend({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EducationResponse = z.infer<typeof EducationResponseSchema>;
