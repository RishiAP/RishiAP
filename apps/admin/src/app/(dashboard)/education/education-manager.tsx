"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEducationSchema, type CreateEducationDto, type EducationResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import { CustomModal } from '@/components/ui/custom-modal';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MonthYearPicker } from '@/components/ui/month-year-picker';
import { SortableTable, SortableTableRow } from '@/components/ui/sortable-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EducationManager({ initialData }: { initialData: EducationResponse[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<EducationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleReorder = async (reorderedItems: EducationResponse[]) => {
    setItems(reorderedItems);
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    toast.promise(
      fetchApi('/admin/education/reorder', {
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

  const form = useForm<z.input<typeof CreateEducationSchema>, any, CreateEducationDto>({
    resolver: zodResolver(CreateEducationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      branch: '',
      startDate: '',
      endDate: '',
      description: '',
      order: 0,
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      institution: '',
      degree: '',
      branch: '',
      startDate: '',
      endDate: '',
      description: '',
      order: items.length, // Put at end by default
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: EducationResponse) => {
    form.reset({
      institution: edu.institution,
      degree: edu.degree,
      branch: edu.branch || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      description: edu.description || '',
      order: edu.order,
    });
    setEditingId(edu.id);
    setIsModalOpen(true);
  };

  async function onSubmit(data: CreateEducationDto) {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        order: Number(data.order),
      };

      if (editingId) {
        await fetchApi(`/admin/education/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/admin/education', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      router.refresh();
      toast.success(editingId ? 'Education updated' : 'Education added');
    } catch (err: any) {
      toast.error('Failed to save education', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDeleteClick(item: EducationResponse) {
    setDeletingItem(item);
  }

  async function confirmDelete() {
    if (!deletingItem) return;
    const id = deletingItem.id;
    setDeletingItem(null);
    toast.promise(
      fetchApi(`/admin/education/${id}`, { method: 'DELETE' }).then(() => {
        setIsModalOpen(false);
        router.refresh();
      }),
      {
        loading: 'Deleting...',
        success: 'Education deleted',
        error: (err: any) => 'Failed to delete: ' + err.message
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Education</h1>
          <p className="text-muted-foreground mt-2">
            Manage your educational background and degrees.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Education History</CardTitle>
          <CardDescription>A list of your degrees and institutions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <SortableTable items={items} onReorder={handleReorder}>
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[40px] px-2"></TableHead>
                    <TableHead className="w-[300px]">Institution</TableHead>
                    <TableHead>Degree & Branch</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No education entries found. Add your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((edu) => (
                      <SortableTableRow key={edu.id} id={edu.id} className="group">
                        <TableCell className="font-medium">{edu.institution}</TableCell>
                        <TableCell>
                          {edu.degree}
                          {edu.branch && <span className="text-muted-foreground"> • {edu.branch}</span>}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {edu.startDate} – {edu.endDate || 'Present'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(edu)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost-destructive" 
                            size="icon" 
                            onClick={() => handleDeleteClick(edu)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </SortableTableRow>
                    ))
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
        title={editingId ? "Edit Education" : "Add Education"}
        description="Enter your degree and institution details below."
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="B.Tech" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch / Major (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Computer Engineering" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormDescription>Leave blank if currently enrolled</FormDescription>
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Key achievements, societies, etc." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </div>
          </form>
        </Form>
      </CustomModal>

      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-red-500 dark:bg-destructive/20 dark:text-red-400 size-12">
              <Trash2 className="size-6" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Education?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your degree at <span className="text-red-500 dark:text-red-400 font-semibold">{deletingItem?.institution}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
