"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateSocialLinkSchema, type CreateSocialLinkDto, type SocialLinkResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Link as LinkIcon } from 'lucide-react';
import { CustomModal } from '@/components/ui/custom-modal';
import {
  Form,
  FormControl,
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
} from "@/components/ui/select";
import { SortableTable, SortableTableRow } from '@/components/ui/sortable-table';
import { Switch } from '@/components/ui/switch';

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X (Twitter)' },
  { value: 'resume', label: 'Resume (PDF)' },
  { value: 'email', label: 'Email Address' },
  { value: 'website', label: 'Personal Website' },
];

export function SocialLinksManager({ initialData }: { initialData: SocialLinkResponse[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleReorder = async (reorderedItems: SocialLinkResponse[]) => {
    setItems(reorderedItems);
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    toast.promise(
      fetchApi('/v1/social-links/reorder', {
        method: 'PUT',
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

  const form = useForm<z.input<typeof CreateSocialLinkSchema>, any, CreateSocialLinkDto>({
    resolver: zodResolver(CreateSocialLinkSchema),
    defaultValues: {
      platform: '',
      url: '',
      label: '',
      order: 0,
      isActive: true,
    },
  });

  const handleOpenCreate = () => {
    form.reset({
      platform: '',
      url: '',
      label: '',
      order: items.length,
      isActive: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link: SocialLinkResponse) => {
    let displayUrl = link.url;
    if (link.platform === 'email' && displayUrl.toLowerCase().startsWith('mailto:')) {
      displayUrl = displayUrl.substring(7); // remove 'mailto:'
    }

    form.reset({
      platform: link.platform,
      url: displayUrl,
      label: link.label || '',
      order: link.order,
      isActive: link.isActive,
    });
    setEditingId(link.id);
    setIsModalOpen(true);
  };

  async function onSubmit(data: CreateSocialLinkDto) {
    setIsSubmitting(true);
    try {
      let finalUrl = data.url;
      if (data.platform === 'email' && !finalUrl.toLowerCase().startsWith('mailto:')) {
        finalUrl = `mailto:${finalUrl}`;
      }

      const payload = {
        ...data,
        url: finalUrl,
        order: Number(data.order),
      };

      if (editingId) {
        await fetchApi(`/v1/social-links/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/v1/social-links', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setIsModalOpen(false);
      router.refresh();
      toast.success(editingId ? 'Link updated' : 'Link added');
    } catch (err: any) {
      toast.error('Failed to save link', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    toast.promise(
      fetchApi(`/v1/social-links/${id}`, { method: 'DELETE' }).then(() => {
        setIsModalOpen(false);
        router.refresh();
      }),
      {
        loading: 'Deleting...',
        success: 'Link deleted',
        error: (err: any) => 'Failed to delete: ' + err.message
      }
    );
  }

  async function toggleActive(id: string, currentActive: boolean) {
    try {
      await fetchApi(`/v1/social-links/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentActive }),
      });
      router.refresh();
      toast.success(currentActive ? 'Link hidden' : 'Link activated');
    } catch (err: any) {
      toast.error('Failed to toggle status', { description: err.message });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Social Links & Resume</h1>
          <p className="text-muted-foreground mt-2">
            Manage your public profiles, resume, and contact links.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Link
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Links</CardTitle>
          <CardDescription>Drag and drop to reorder how they appear on your site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <SortableTable items={items} onReorder={handleReorder}>
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[40px] px-2"></TableHead>
                    <TableHead className="w-[200px]">Platform</TableHead>
                    <TableHead>URL / Details</TableHead>
                    <TableHead className="w-[100px] text-center">Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        No links found. Add your first one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((link) => (
                      <SortableTableRow key={link.id} id={link.id} className="group">
                        <TableCell className="font-medium capitalize flex items-center gap-2 mt-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          {link.platform}
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[300px] text-sm" title={link.url}>
                            {link.platform === 'email' && link.url.toLowerCase().startsWith('mailto:') 
                              ? link.url.substring(7) 
                              : link.url}
                          </div>
                          {link.label && <div className="text-xs text-muted-foreground">{link.label}</div>}
                        </TableCell>
                        <TableCell className="text-center">
                           <Switch 
                             checked={link.isActive} 
                             onCheckedChange={() => toggleActive(link.id, link.isActive)}
                           />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEdit(link)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDelete(link.id)}
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
        title={editingId ? "Edit Link" : "Add Link"}
        description="Select a platform and provide the target URL."
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform (Type)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => {
                const selectedPlatform = form.watch('platform');
                const isEmail = selectedPlatform === 'email';
                return (
                  <FormItem>
                    <FormLabel>{isEmail ? 'Email Address' : 'URL / Link'}</FormLabel>
                    <FormControl>
                      <Input placeholder={isEmail ? 'hello@example.com' : 'https://...'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="@rishicodes" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Link'}
              </Button>
            </div>
          </form>
        </Form>
      </CustomModal>
    </div>
  );
}
