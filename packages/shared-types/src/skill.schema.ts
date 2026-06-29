import { z } from 'zod';

export const CreateSkillCategorySchema = z.object({
  name: z.string().min(1).max(50),
  order: z.number().int().min(0).default(0),
});

export const UpdateSkillCategorySchema = CreateSkillCategorySchema.partial();

export const CreateSkillSchema = z.object({
  name: z.string().min(1).max(100),
  field: z.string().min(1).max(50), // e.g. "languages", "frameworks"
  categoryId: z.string().min(1),
  order: z.number().int().min(0).default(0),
});

export const UpdateSkillSchema = CreateSkillSchema.partial();

export type CreateSkillCategoryDto = z.infer<typeof CreateSkillCategorySchema>;
export type UpdateSkillCategoryDto = z.infer<typeof UpdateSkillCategorySchema>;
export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
