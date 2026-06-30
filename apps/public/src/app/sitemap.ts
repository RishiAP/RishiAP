import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rishicodes.com';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  // Fetch published projects and posts from API
  let projects: { slug: string; updatedAt: string }[] = [];
  let posts: { slug: string; publishedAt: string }[] = [];

  try {
    const [projectsRes, postsRes] = await Promise.all([
      fetch(`${apiBase}/api/projects`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase}/api/posts`, { next: { revalidate: 3600 } }),
    ]);

    if (projectsRes.ok) {
      const data = await projectsRes.json();
      projects = data.data ?? data;
    }
    if (postsRes.ok) {
      const data = await postsRes.json();
      posts = data.data ?? data;
    }
  } catch {
    // If API is unreachable, return static pages only
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
