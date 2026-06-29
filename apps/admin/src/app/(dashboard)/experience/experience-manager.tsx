"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateExperienceSchema, type CreateExperienceDto, type ExperienceResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import { CustomModal } from '@/components/ui/custom-modal';
import { TagInput } from '@/components/ui/tag-input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { SortableTable, SortableTableRow } from '@/components/ui/sortable-table';

const typeLabels: Record<string, { label: string; classes: string }> = {
  WORK: { label: 'Work', classes: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  INTERNSHIP: { label: 'Internship', classes: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  VOLUNTEER: { label: 'Volunteer', classes: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  FREELANCE: { label: 'Freelance', classes: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  OPEN_SOURCE: { label: 'Open Source', classes: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  LEADERSHIP: { label: 'Leadership', classes: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
};

export function ExperienceManager({ initialData }: { initialData: ExperienceResponse[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleReorder = async (reorderedItems: ExperienceResponse[]) => {
    setItems(reorderedItems);
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    toast.promise(
      fetchApi('/admin/experience/reorder', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }).then(() => router.refresh()),
      {
        loading: 'Saving order...',
        success: 'Order saved successfully',
        error: (err: any) => {
          setItems(initialData);
          return 'Failed to save order: ' + err.message;
        }
      }
    );
  };

  const form = useForm<z.input<typeof CreateExperienceSchema>, any, CreateExperienceDto>({
    resolver: zodResolver(CreateExperienceSchema),
    defaultValues: {
      type: 'WORK',
      role: '',
      org: '',
      orgUrl: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      techStack: [],
      published: false,
      order: 0,
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      type: 'WORK',
      role: '',
      org: '',
      orgUrl: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      techStack: [],
      published: false,
      order: items.length,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: ExperienceResponse) => {
    form.reset({
      type: exp.type,
      role: exp.role,
      org: exp.org,
      orgUrl: exp.orgUrl || '',
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description || '',
      techStack: exp.techStack || [],
      published: exp.published,
      order: exp.order,
    });
    setEditingId(exp.id);
    setIsModalOpen(true);
  };

  async function onSubmit(data: CreateExperienceDto) {
    setIsSubmitting(true);
    try {
      const payload = { ...data, order: Number(data.order) };
      if (editingId) {
        await fetchApi(`/admin/experience/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/experience', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      router.refresh();
      toast.success(editingId ? 'Experience updated' : 'Experience added');
    } catch (err: any) {
      toast.error('Failed to save experience', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this experience entry?')) return;
    toast.promise(
      fetchApi(`/admin/experience/${id}`, { method: 'DELETE' }).then(() => {
        setIsModalOpen(false);
        router.refresh();
      }),
      {
        loading: 'Deleting...',
        success: 'Experience deleted',
        error: (err: any) => 'Failed to delete: ' + err.message
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Experience</h1>
          <p className="text-muted-foreground mt-2">
            Manage your work experience, internships, and leadership roles.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experience History</CardTitle>
          <CardDescription>A list of your professional and volunteer experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <SortableTable items={items} onReorder={handleReorder}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[40px] px-2"></TableHead>
                    <TableHead className="w-[250px]">Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No experience entries found. Add your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((exp) => {
                      const typeInfo = typeLabels[exp.type] ?? { label: exp.type, classes: 'bg-muted text-muted-foreground' };
                      const period = exp.endDate
                        ? `${exp.startDate} – ${exp.endDate}`
                        : `${exp.startDate} – Present`;

                      return (
                        <SortableTableRow key={exp.id} id={exp.id} className="group">
                          <TableCell className="font-medium">{exp.role}</TableCell>
                          <TableCell>{exp.org}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${typeInfo.classes}`}>
                              {typeInfo.label}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{period}</TableCell>
                          <TableCell>
                            {exp.published ? (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                                Draft
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(exp)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </SortableTableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </SortableTable>
          </div>
        </CardContent>
      </Card>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Experience" : "Add Experience"}
        description="Enter your role and organization details."
        className="max-w-3xl"
        footer={
          <div className="flex justify-between gap-4 w-full">
            {editingId ? (
              <Button type="button" variant="destructive" onClick={() => handleDelete(editingId)} disabled={isSubmitting}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            ) : <div />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" form="experience-form" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
              </Button>
            </div>
          </div>
        }
      >
        <Form {...form}>
          <form id="experience-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="org"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Google" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <MonthYearPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <MonthYearPicker value={field.value || ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What did you do?" 
                      className="resize-y min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Add technology and press enter..."
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Press enter or comma to add a tag</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pb-4">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Published</FormLabel>
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
            </div>
          </form>
        </Form>
      </CustomModal>
    </div>
  );
}
