import { fetchApi } from '@/lib/api-client';
import { type SocialLinkResponse } from '@rishicodes/shared-types';
import { SocialLinksManager } from './social-links-manager';

export const dynamic = 'force-dynamic';

export default async function SocialLinksPage() {
  const socialLinks = await fetchApi<SocialLinkResponse[]>('/v1/social-links').catch(() => []);

  return <SocialLinksManager initialData={socialLinks} />;
}
