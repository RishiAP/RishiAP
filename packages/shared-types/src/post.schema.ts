import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only')
    .min(1)
    .max(100),
  excerpt: z.string().max(500).optional().default(''),
  contentHtml: z.string().optional(), // Now generated on the backend
  contentJson: z.any(), // JSON payload from @rishiap/lexiform
  coverUrl: z.string().url().optional().or(z.literal('')),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export type CreatePostDto = Omit<z.infer<typeof CreatePostSchema>, 'contentHtml'>;
export type UpdatePostDto = Partial<CreatePostDto>;

export const PostResponseSchema = CreatePostSchema.extend({
  id: z.string(),
  contentHtml: z.string(), // Guaranteed in response since it's stored in DB
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type PostResponse = z.infer<typeof PostResponseSchema>;
