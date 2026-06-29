import { getPosts } from '@/lib/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Thoughts on software engineering, architecture, and building products.',
};
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getPosts().catch(() => []);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] h-full">
      {/* Middle Prose Pane */}
      <div className="px-6 py-12 md:px-12 max-w-3xl mx-auto lg:mx-0 w-full">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 mb-4">
          Writing
        </h1>
        <p className="text-xl text-zinc-400 mb-8">
          Thoughts on software engineering, architecture, and building products.
        </p>

        <div className="space-y-12 mt-12">
          {posts.length === 0 ? (
            <p className="text-zinc-500 italic">No articles published yet.</p>
          ) : (
            posts.map((post: import("@rishicodes/shared-types").PostResponse) => (
              <article key={post.id} className="group flex flex-col items-start justify-between scroll-mt-24" id={`post-${post.slug}`}>
                <div className="flex items-center gap-x-4 text-xs font-mono text-zinc-500 mb-4">
                  <time dateTime={post.publishedAt || post.createdAt} className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-zinc-800/50 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="group relative">
                  <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-indigo-400 text-sm font-medium">
                  Read article <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <hr className="w-full mt-12 border-zinc-800" />
              </article>
            ))
          )}
        </div>
      </div>

      {/* Right Code Snippet Pane */}
      <div className="bg-zinc-900 border-l border-zinc-800 p-6 hidden lg:block sticky top-0 max-h-[calc(100vh-7.5rem)] overflow-y-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Request</div>
          <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 font-mono text-sm text-zinc-300">
            <span className="text-indigo-400 font-bold">GET</span> /api/v1/posts?status=published
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Response</div>
          <div className="bg-zinc-950 rounded-md p-4 border border-zinc-800 font-mono text-sm text-zinc-300 overflow-x-auto">
            <pre>
{JSON.stringify(posts.slice(0, 2).map((p: import("@rishicodes/shared-types").PostResponse) => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  publishedAt: p.publishedAt
})), null, 2)}
            </pre>
          </div>
          {posts.length > 2 && (
            <div className="text-xs text-zinc-500 mt-2 ml-4">... {posts.length - 2} more items omitted</div>
          )}
        </div>
      </div>
    </div>
  );
}
