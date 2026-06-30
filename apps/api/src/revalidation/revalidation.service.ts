import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Trigger on-demand ISR revalidation on the public Next.js site.
   * Sends revalidation tags so only affected pages are rebuilt.
   */
  async revalidate(tags: string[]): Promise<void> {
    const publicSiteUrl = this.configService.get<string>('PUBLIC_SITE_URL');
    const secret = this.configService.get<string>('REVALIDATE_SECRET');

    if (!publicSiteUrl || !secret) {
      this.logger.warn('Revalidation skipped: PUBLIC_SITE_URL or REVALIDATE_SECRET not set');
      return;
    }

    const response = await fetch(`${publicSiteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tags }),
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.status} ${response.statusText}`);
    }

    // Cache Warming: Silently hit the public URLs in the background.
    // This forces Vercel to rebuild the HTML immediately, so the first actual human visitor 
    // gets a 0ms cached response instead of taking the 500ms rebuild penalty.
    setTimeout(() => {
      const pathsToWarm = ['/'];
      if (tags.some(t => t.includes('project'))) pathsToWarm.push('/projects');
      if (tags.some(t => t.includes('post'))) pathsToWarm.push('/blog');
      
      pathsToWarm.forEach(path => {
        fetch(`${publicSiteUrl}${path}`)
          .then(res => this.logger.log(`Cache warmed for ${path} (${res.status})`))
          .catch(e => this.logger.warn(`Cache warming failed for ${path}: ${e.message}`));
      });
    }, 200); // Slight delay to ensure Vercel has fully registered the purge
  }
}
