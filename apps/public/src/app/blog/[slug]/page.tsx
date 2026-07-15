import { getPostBySlug } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ProseCopyButtons } from '@/components/ui/prose-copy-buttons';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    const images = post.coverUrl ? [post.coverUrl] : undefined;
    
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        images,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images,
      },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/api');
  const posts = await getPosts().catch(() => []);
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <main className="h-full bg-background pt-8 pb-32">
      <div className="container px-4 md:px-6 mx-auto max-w-3xl">
        <Link href="/blog" className="text-primary hover:underline font-mono text-sm inline-flex items-center mb-12">
          <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back to blog
        </Link>
        
        <header className="mb-16">
          <div className="flex items-center gap-x-4 text-sm font-mono text-muted-foreground mb-6">
            <time dateTime={post.publishedAt || post.createdAt} className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight mb-8">
            {post.title}
          </h1>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverUrl && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl border border-white/5 relative aspect-video">
            <img 
              src={post.coverUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* The rich text content rendered natively from HTML */}
        <article 
          id="post-content"
          className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-a:text-primary prose-a:no-underline [&_a:hover]:underline"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <ProseCopyButtons articleSelector="#post-content" />
      </div>
    </main>
  );
}
