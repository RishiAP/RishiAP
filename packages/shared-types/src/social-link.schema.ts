import { z } from 'zod';

const BaseSocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().min(1, 'URL or Email is required'),
  label: z.string().optional().nullable(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

const validateUrlOrEmail = (data: any, ctx: z.RefinementCtx) => {
  if (data.platform === 'email') {
    if (data.url) {
      const emailVal = data.url.replace(/^mailto:/i, '');
      const isEmail = z.string().email().safeParse(emailVal).success;
      if (!isEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['url'],
          message: 'Must be a valid email address',
        });
      }
    }
  } else {
    if (data.url) {
      const isUrl = z.string().url().safeParse(data.url).success;
      if (!isUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['url'],
          message: 'Must be a valid URL (starting with http:// or https://)',
        });
      }
    }
  }
};

export const CreateSocialLinkSchema = BaseSocialLinkSchema.superRefine(validateUrlOrEmail);
export const UpdateSocialLinkSchema = BaseSocialLinkSchema.partial().superRefine(validateUrlOrEmail);

export type CreateSocialLinkDto = z.infer<typeof CreateSocialLinkSchema>;
export type UpdateSocialLinkDto = z.infer<typeof UpdateSocialLinkSchema>;

export interface SocialLinkResponse {
  id: string;
  platform: string;
  url: string;
  label: string | null;
  order: number;
  isActive: boolean;
}
