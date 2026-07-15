"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatePostSchema, type CreatePostDto } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

export default function NewPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
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

  const form = useForm<z.input<typeof CreatePostSchema>, any, CreatePostDto>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      contentJson: {},
      published: false,
    },
  });

  async function onSubmit(data: CreatePostDto) {
    setIsSubmitting(true);
    try {
      // The editor state is stored in contentJson
      const rawJsonString = data.contentJson as unknown;
      
      let jsonObj = {};
      
      if (typeof rawJsonString === 'string' && rawJsonString) {
        jsonObj = JSON.parse(rawJsonString);
      } else if (typeof rawJsonString === 'object' && rawJsonString !== null) {
        jsonObj = rawJsonString;
      }

      let finalCoverUrl = data.coverUrl;
      if (coverFile) {
        finalCoverUrl = await uploadFile(coverFile);
      }

      const payload: CreatePostDto = {
        ...data,
        coverUrl: finalCoverUrl,
        contentJson: jsonObj,
      };

      await fetchApi('/admin/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast.success('Post created successfully');
      window.location.href = `/posts/${payload.slug}/edit`;
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to create post', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Post</h1>
        <p className="text-muted-foreground mt-2">
          Write a new article using the Lexiform editor.
        </p>
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
                    <Input 
                      placeholder="My Awesome Post" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug
                        if (!form.formState.dirtyFields.slug) {
                          form.setValue(
                            'slug', 
                            e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                          );
                        }
                      }}
                    />
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
                  <div className="border rounded-xl shadow-sm bg-card overflow-hidden min-w-0 w-full">
                    <LexicalEditor
                      value={typeof field.value === 'string' && field.value.trim() !== '' ? field.value : undefined}
                      onChange={(val) => field.onChange(val)}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : 'Create Post'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
