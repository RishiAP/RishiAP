import { revalidateTag } from 'next/cache';
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
      revalidateTag(tag, 'max');
    }

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
