"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProjectSchema, type UpdateProjectDto, type ProjectResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';
import { Loader2, FileX2 } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { TagInput } from '@/components/ui/tag-input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const categoryOptions = [
  { value: 'CASE_STUDY', label: 'Case Study — full portfolio piece' },
  { value: 'PACKAGE', label: 'Package — npm, pypi, maven, etc.' },
  { value: 'LIBRARY', label: 'Library — reusable code, not published' },
  { value: 'EXPERIMENT', label: 'Experiment — ML, PoC, hackathon' },
  { value: 'FIRMWARE', label: 'Firmware — embedded/IoT' },
  { value: 'TOOL', label: 'Tool — CLI, dev utility' },
  { value: 'APPLICATION', label: 'Application — full app' },
  { value: 'OTHER', label: 'Other' },
];

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<z.input<typeof UpdateProjectSchema>, any, UpdateProjectDto>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      description: '',
      category: 'CASE_STUDY',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      repoOwner: '',
      repoName: '',
      diagramUrl: '',
      coverUrl: '',
      tier: 'SUPPORTING',
      published: false,
      order: 0,
      problem: '',
      architectureNote: '',
      keyDecision: '',
      packageName: '',
      packageRegistry: '',
      packageUrl: '',
      languages: [],
      topics: [],
    },
  });

  const category = useWatch({ control: form.control, name: 'category' });
  const isCaseStudy = category === 'CASE_STUDY';
  const isPackageOrLibrary = category === 'PACKAGE' || category === 'LIBRARY';

  useEffect(() => {
    async function loadProject() {
      try {
        const project = await fetchApi<ProjectResponse>(`/admin/projects/${projectSlug}`);
        
        form.reset({
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description || '',
          category: project.category || 'CASE_STUDY',
          techStack: project.techStack,
          liveUrl: project.liveUrl || '',
          repoUrl: project.repoUrl || '',
          repoOwner: project.repoOwner || '',
          repoName: project.repoName || '',
          diagramUrl: project.diagramUrl || '',
          coverUrl: project.coverUrl || '',
          tier: project.tier,
          published: project.published,
          order: project.order,
          problem: project.problem || '',
          architectureNote: project.architectureNote || '',
          keyDecision: project.keyDecision || '',
          packageName: project.packageName || '',
          packageRegistry: project.packageRegistry || '',
          packageUrl: project.packageUrl || '',
          languages: project.languages || [],
          topics: project.topics || [],
        });


      } catch (err: any) {
        console.error(err);
        setLoadError(err.message || 'Project not found');
        toast.error('Failed to load project', { description: err.message });
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [projectSlug, form]);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [diagramFile, setDiagramFile] = useState<File | null>(null);
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

  async function onSubmit(data: UpdateProjectDto) {
    setIsSubmitting(true);
    try {
      let finalCoverUrl = data.coverUrl;
      let finalDiagramUrl = data.diagramUrl;

      // Handle file uploads first
      if (coverFile) {
        finalCoverUrl = await uploadFile(coverFile);
      }
      if (diagramFile) {
        finalDiagramUrl = await uploadFile(diagramFile);
      }

      const payload: UpdateProjectDto = {
        ...data,
        coverUrl: finalCoverUrl,
        diagramUrl: finalDiagramUrl,
        order: Number(data.order),
      };

      await fetchApi(`/admin/projects/${projectSlug}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      router.refresh();
      form.reset(form.getValues());
      toast.success('Project updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update project', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete() {
    try {
      setIsDeleting(true);
      await fetchApi(`/admin/projects/${projectSlug}`, { method: 'DELETE' });
      setDeleteDialogOpen(false);
      toast.success('Project deleted successfully');
      window.location.href = '/projects';
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete project', { description: err.message });
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading project...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center space-y-4">
          <FileX2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Project Not Found</h2>
          <p className="text-muted-foreground max-w-sm">
            The project <strong className="font-mono">{projectSlug}</strong> does not exist or could not be loaded.
          </p>
          <Link href="/projects">
            <Button variant="outline">← Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Project</h1>
          <p className="text-muted-foreground mt-2">
            Update your project details and metrics.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href={`${process.env.NEXT_PUBLIC_PUBLIC_APP_URL || 'http://localhost:3000'}/projects/${projectSlug}`} target="_blank" rel="noopener noreferrer">
            View Live
          </a>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Core Fields ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Name" {...field} />
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
                    <Input placeholder="project-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Determines which fields are shown and how the project renders on the public site</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Languages</FormLabel>
                  <FormControl>
                    <TagInput 
                      placeholder="Add languages (e.g. TypeScript)..." 
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Press enter or comma to add a language</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief 1-2 sentence overview" 
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Markdown)</FormLabel>
                <FormControl>
                  <MarkdownEditor
                    placeholder="Detailed description — supports markdown" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>General project description. For case studies, use the dedicated fields below instead.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Case Study Fields (conditional) ── */}
          {isCaseStudy && (
            <div className="space-y-6 rounded-lg border p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground">Case Study Details</h3>
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Statement</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What problem does this solve?" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="architectureNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Architecture Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Key architectural patterns..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyDecision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Decision</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Major technical decision made..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* ── Package/Library Fields (conditional) ── */}
          {isPackageOrLibrary && (
            <div className="space-y-6 rounded-lg border p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground">Package Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="packageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input placeholder="@scope/name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packageRegistry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select registry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="npm">npm</SelectItem>
                          <SelectItem value="pypi">PyPI</SelectItem>
                          <SelectItem value="maven">Maven</SelectItem>
                          <SelectItem value="crates">Crates.io</SelectItem>
                          <SelectItem value="pub">Pub.dev</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registry URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://npmjs.com/package/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* ── Tech & Tags ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <TagInput 
                      placeholder="Add tech stack..." 
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Press enter or comma to add a tag</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics / Tags</FormLabel>
                  <FormControl>
                    <TagInput 
                      placeholder="Add topics..." 
                      value={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Press enter or comma to add a tag</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ── Links ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="liveUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="repoOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="RishiAP" {...field} />
                  </FormControl>
                  <FormDescription>Defaults to RishiAP if empty</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repoName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repo Name</FormLabel>
                  <FormControl>
                    <Input placeholder="stress-management-system" {...field} />
                  </FormControl>
                  <FormDescription>Used to fetch README and stats</FormDescription>
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
          </div>

          <FormField
            control={form.control}
            name="diagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Architecture Diagram</FormLabel>
                <FormControl>
                    <ImageUpload 
                      value={diagramFile || field.value} 
                      onChange={(val) => {
                        if (val instanceof File) {
                          setDiagramFile(val);
                          field.onChange("");
                        } else {
                          setDiagramFile(null);
                          field.onChange(val || "");
                        }
                      }} 
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ── Metadata ── */}
          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Tier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FLAGSHIP">Flagship (Featured)</SelectItem>
                      <SelectItem value="SUPPORTING">Supporting</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish Project</FormLabel>
                  <FormDescription>
                    Make this project visible on the public site immediately.
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
            <Button type="submit" disabled={isSubmitting || (!form.formState.isDirty && !coverFile && !diagramFile)}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Danger Zone */}
      <div className="mt-12 rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete a project, there is no going back. This action will permanently remove the project and all associated data.
        </p>
        
        <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setDeleteConfirmText(''); }}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isSubmitting || isDeleting}>
              Delete Project
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
                This action cannot be undone. This will permanently delete the project
                <strong> {form.getValues('title') || 'this project'}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-foreground">
                Please type <strong className="font-mono bg-muted px-1 py-0.5 rounded select-all">{form.getValues('title') || 'this project'}</strong> to confirm.
              </p>
              <Input 
                value={deleteConfirmText} 
                onChange={(e) => setDeleteConfirmText(e.target.value)} 
                placeholder={form.getValues('title') || 'Project Title'}
              />
            </div>
              <DialogFooter>
              <Button 
                type="submit"
                variant="destructive" 
                disabled={deleteConfirmText !== form.getValues('title') || isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : 'I understand, delete this project'}
              </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
