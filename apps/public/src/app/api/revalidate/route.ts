import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    const { tags } = await req.json();

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: 'tags must be an array' }, { status: 400 });
    }

    for (const tag of tags) {
      // 1. Purge the raw data cache
      revalidateTag(tag, 'max');

      // 2. Surgically purge ONLY the HTML route caches that depend on this tag
      if (tag === 'experience-list' || tag === 'social-links' || tag === 'skills-list' || tag === 'education-list') {
        revalidatePath('/');
      } else if (tag === 'projects-list') {
        revalidatePath('/projects');
        revalidatePath('/'); // In case featured projects are on the home page
      } else if (tag.startsWith('project-')) {
        const slug = tag.replace('project-', '');
        revalidatePath(`/projects/${slug}`);
      } else if (tag === 'posts-list') {
        revalidatePath('/blog');
        revalidatePath('/'); // In case recent posts are on the home page
      } else if (tag.startsWith('post-')) {
        const slug = tag.replace('post-', '');
        revalidatePath(`/blog/${slug}`);
      }
    }

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
