import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { type PostResponse } from '@rishicodes/shared-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const posts = await fetchApi<PostResponse[]>('/admin/posts').catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Write, edit, and publish content for your blog.
          </p>
        </div>
        <Link href="/posts/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles</CardTitle>
          <CardDescription>A list of all your drafted and published blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No blog posts found. Create your first post!
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} className="group">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{post.title}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 font-mono">/{post.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.published ? (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-500 border-amber-500/20">
                            Draft
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right space-x-2">

                        <Link href={`/posts/${post.slug}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
