"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePostSchema, type UpdatePostDto, type PostResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, FileX2 } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  LexicalEditor,
  ExtendedNodes,
  ComponentPickerPlugin,
  ImagesPlugin,
  YouTubePlugin
} from '@rishiap/lexiform';
import { EquationsPlugin } from '@rishiap/lexiform/equations';
import { ExcalidrawPlugin } from '@rishiap/lexiform/excalidraw';
import '@rishiap/lexiform/styles.css';
import '@rishiap/lexiform/equations.css';
import '@rishiap/lexiform/excalidraw.css';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postSlug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [initialJson, setInitialJson] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const loadTime = useRef(0);
  const { getToken } = useAuth();

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = await getToken();
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!res.ok) throw new Error('Failed to upload image');
    
    const data = await res.json();
    return data.url;
  }

  const form = useForm<z.input<typeof UpdatePostSchema>, any, UpdatePostDto>({
    resolver: zodResolver(UpdatePostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      contentJson: {},
      published: false,
    },
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await fetchApi<PostResponse>(`/admin/posts/${postSlug}`);
        
        // Populate form
        form.reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          coverUrl: post.coverUrl || '',
          published: post.published,
          contentJson: post.contentJson && Object.keys(post.contentJson).length > 0 
            ? JSON.stringify(post.contentJson)
            : undefined,
        });

        // Set the Lexical editor's initial JSON state
        if (post.contentJson && Object.keys(post.contentJson).length > 0) {
          setInitialJson(JSON.stringify(post.contentJson));
        }
      } catch (err: any) {
        console.error(err);
        setLoadError(err.message || 'Post not found');
        toast.error('Failed to load post', { description: err.message });
      } finally {
        loadTime.current = Date.now();
        setIsLoading(false);
      }
    }
    loadPost();
  }, [postSlug, form]);

  async function onSubmit(data: UpdatePostDto) {
    setIsSubmitting(true);
    try {
      const rawJsonString = data.contentJson as unknown as string;
      
      let jsonObj = data.contentJson;
      
      // If editor was modified, contentJson will be a string from LexicalEditor onChange
      if (typeof rawJsonString === 'string' && rawJsonString) {
        jsonObj = JSON.parse(rawJsonString);
      } else if (typeof rawJsonString === 'object') {
        // If it wasn't modified, it might still be the object we set initially
        jsonObj = rawJsonString;
      }

      let finalCoverUrl = data.coverUrl;
      if (coverFile) {
        finalCoverUrl = await uploadFile(coverFile);
      }

      const payload: UpdatePostDto = {
        ...data,
        coverUrl: finalCoverUrl,
        contentJson: jsonObj,
      };

      await fetchApi(`/admin/posts/${postSlug}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      router.refresh();
      form.reset(form.getValues());
      toast.success('Post updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update post', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete() {
    try {
      setIsDeleting(true);
      await fetchApi(`/admin/posts/${postSlug}`, { method: 'DELETE' });
      setDeleteDialogOpen(false);
      toast.success('Post deleted successfully');
      window.location.href = '/posts';
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete post', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading post...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <FileX2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Post Not Found</h2>
          <p className="text-muted-foreground max-w-sm">
            The post <strong className="font-mono">{postSlug}</strong> does not exist or could not be loaded.
          </p>
          <Link href="/posts">
            <Button variant="outline">← Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-2">
            Update your article content and settings.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href={`${process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 'http://localhost:3000'}/blog/${postSlug}`} target="_blank" rel="noopener noreferrer">
            View Live
          </a>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="my-awesome-post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief summary of the post..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={coverFile || field.value} 
                    onChange={(val) => {
                      if (val instanceof File) {
                        setCoverFile(val);
                        field.onChange("");
                      } else {
                        setCoverFile(null);
                        field.onChange(val || "");
                      }
                    }} 
                  />
                </FormControl>
                <FormDescription>Recommended size: 1200x630px (Standard SEO/OpenGraph ratio)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contentJson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
                    <LexicalEditor
                      value={(typeof field.value === 'string' && field.value.trim() !== '' ? field.value : undefined) || initialJson || undefined}
                      onChange={(val) => {
                        field.onChange(val);
                        // If Lexical normalizes its JSON within 1.5 seconds of mounting, 
                        // reset the form baseline for this field so it doesn't trigger isDirty.
                        if (Date.now() - loadTime.current < 1500) {
                          form.resetField('contentJson', { defaultValue: val });
                        }
                      }}
                      outputFormat="json"
                      placeholder="Start typing your post here... Use / for quick commands."
                      nodes={ExtendedNodes}
                      plugins={
                        <>
                          <ComponentPickerPlugin />
                          <EquationsPlugin />
                          <ExcalidrawPlugin />
                          <ImagesPlugin />
                          <YouTubePlugin />
                        </>
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  This editor uses @rishiap/lexiform. Content is converted to HTML safely on the backend.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish Post</FormLabel>
                  <FormDescription>
                    Make this post visible on the public site immediately.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (!form.formState.isDirty && !coverFile)}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Danger Zone */}
      <div className="mt-12 rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete a post, there is no going back. This action will permanently remove the post.
        </p>
        
        <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setDeleteConfirmText(''); }}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isSubmitting || isDeleting}>
              Delete Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (deleteConfirmText === form.getValues('title') && !isDeleting) {
                onDelete();
              }
            }}>
              <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the post
                <strong> {form.getValues('title') || 'this post'}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-foreground">
                Please type <strong className="font-mono bg-muted px-1 py-0.5 rounded select-all">{form.getValues('title') || 'this post'}</strong> to confirm.
              </p>
              <Input 
                value={deleteConfirmText} 
                onChange={(e) => setDeleteConfirmText(e.target.value)} 
                placeholder={form.getValues('title') || 'Post Title'}
              />
            </div>
              <DialogFooter>
              <Button 
                type="submit"
                variant="destructive" 
                disabled={deleteConfirmText !== form.getValues('title') || isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'I understand, delete this post'}
              </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
