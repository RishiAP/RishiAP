"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  CreateSkillCategorySchema, 
  CreateSkillSchema, 
  type CreateSkillCategoryDto, 
  type CreateSkillDto,
  type UpdateSkillCategoryDto,
  type UpdateSkillDto
} from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, FolderPlus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { CustomModal } from '@/components/ui/custom-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Skill extends UpdateSkillDto {
  id: string;
}

interface Category extends UpdateSkillCategoryDto {
  id: string;
  skills: Skill[];
}

// --- Sortable Components ---

function SortableCategory({ category, children, onEdit }: { category: Category, children: React.ReactNode, onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    data: { type: 'Category', category }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative bg-background rounded-xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:text-primary p-1 -ml-2 text-muted-foreground">
            <GripVertical className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {category.name}
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-6 w-6 text-muted-foreground">
                <Pencil className="h-3 w-3" />
              </Button>
            </CardTitle>
            <CardDescription className="mt-1">
              {category.skills.length} skills
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </div>
  );
}

function SortableSkillRow({ skill, onEdit }: { skill: Skill, onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: skill.id,
    data: { type: 'Skill', skill }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className="group bg-background">
      <TableCell className="w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-primary text-muted-foreground">
          <GripVertical className="h-4 w-4" />
        </div>
      </TableCell>
      <TableCell className="font-medium">{skill.name}</TableCell>
      <TableCell className="text-muted-foreground">{skill.field}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={onEdit} className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// --- Main Component ---

export function SkillsManager({ initialData }: { initialData: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCategories(initialData);
  }, [initialData]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const categoryForm = useForm<z.input<typeof CreateSkillCategorySchema>, any, CreateSkillCategoryDto>({
    resolver: zodResolver(CreateSkillCategorySchema),
    defaultValues: { name: '', order: 0 },
  });

  const skillForm = useForm<z.input<typeof CreateSkillSchema>, any, CreateSkillDto>({
    resolver: zodResolver(CreateSkillSchema),
    defaultValues: { name: '', field: '', categoryId: '', order: 0 },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const type = active.data.current?.type;

    if (type === 'Category') {
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);
      
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);
      
      const payload = newCategories.map((c, i) => ({ id: c.id, order: i }));
      toast.promise(
        fetchApi('/admin/skills/categories/reorder', { method: 'PATCH', body: JSON.stringify(payload) })
          .then(() => router.refresh()),
        {
          loading: 'Reordering categories...',
          success: 'Categories reordered successfully',
          error: (err: any) => `Failed to reorder: ${err.message}`
        }
      );
    } 
    else if (type === 'Skill') {
      const activeSkill = active.data.current?.skill as Skill;
      const categoryId = activeSkill.categoryId;
      const categoryIndex = categories.findIndex(c => c.id === categoryId);
      if (categoryIndex === -1) return;
      
      const category = categories[categoryIndex];
      const oldIndex = category.skills.findIndex(s => s.id === active.id);
      const newIndex = category.skills.findIndex(s => s.id === over.id);
      
      const newSkills = arrayMove(category.skills, oldIndex, newIndex);
      const newCategories = [...categories];
      newCategories[categoryIndex] = { ...category, skills: newSkills };
      
      setCategories(newCategories);
      
      const payload = newSkills.map((s, i) => ({ id: s.id, order: i }));
      toast.promise(
        fetchApi('/admin/skills/items/reorder', { method: 'PATCH', body: JSON.stringify(payload) })
          .then(() => router.refresh()),
        {
          loading: 'Reordering skills...',
          success: 'Skills reordered successfully',
          error: (err: any) => `Failed to reorder: ${err.message}`
        }
      );
    }
  }

  const openCategoryCreate = () => {
    categoryForm.reset({ name: '', order: categories.length });
    setEditingCategoryId(null);
    setIsCategoryModalOpen(true);
  };

  const openCategoryEdit = (cat: Category) => {
    categoryForm.reset({ name: cat.name, order: cat.order });
    setEditingCategoryId(cat.id);
    setIsCategoryModalOpen(true);
  };

  async function onCategorySubmit(data: CreateSkillCategoryDto) {
    setIsSubmitting(true);
    try {
      const payload = { ...data, order: Number(data.order) };
      if (editingCategoryId) {
        await fetchApi(`/admin/skills/categories/${editingCategoryId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await fetchApi('/admin/skills/categories', { method: 'POST', body: JSON.stringify(payload) });
      }
      setIsCategoryModalOpen(false);
      router.refresh();
      toast.success(editingCategoryId ? 'Category updated' : 'Category created');
    } catch (err: any) {
      toast.error('Failed to save category', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCategoryDelete(id: string) {
    if (!window.confirm('Delete this category and all its skills?')) return;
    
    toast.promise(
      fetchApi(`/admin/skills/categories/${id}`, { method: 'DELETE' }).then(() => {
        setIsCategoryModalOpen(false);
        router.refresh();
      }),
      {
        loading: 'Deleting category...',
        success: 'Category deleted',
        error: (err: any) => `Failed to delete category: ${err.message}`
      }
    );
  }

  const openSkillCreate = () => {
    skillForm.reset({ name: '', field: '', categoryId: categories[0]?.id || '', order: 0 });
    setEditingSkillId(null);
    setIsSkillModalOpen(true);
  };

  const openSkillEdit = (skill: Skill) => {
    skillForm.reset({ name: skill.name, field: skill.field, categoryId: skill.categoryId, order: skill.order || 0 });
    setEditingSkillId(skill.id);
    setIsSkillModalOpen(true);
  };

  async function onSkillSubmit(data: CreateSkillDto) {
    setIsSubmitting(true);
    try {
      if (!editingSkillId) {
        const parentCategory = categories.find(c => c.id === data.categoryId);
        data.order = parentCategory ? parentCategory.skills.length : 0;
      }
      
      if (editingSkillId) {
        await fetchApi(`/admin/skills/items/${editingSkillId}`, { method: 'PATCH', body: JSON.stringify(data) });
      } else {
        await fetchApi('/admin/skills/items', { method: 'POST', body: JSON.stringify(data) });
      }
      setIsSkillModalOpen(false);
      router.refresh();
      toast.success(editingSkillId ? 'Skill updated' : 'Skill created');
    } catch (err: any) {
      toast.error('Failed to save skill', { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSkillDelete(id: string) {
    if (!window.confirm('Delete this skill?')) return;
    
    toast.promise(
      fetchApi(`/admin/skills/items/${id}`, { method: 'DELETE' }).then(() => {
        setIsSkillModalOpen(false);
        router.refresh();
      }),
      {
        loading: 'Deleting skill...',
        success: 'Skill deleted',
        error: (err: any) => `Failed to delete skill: ${err.message}`
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Skills</h1>
          <p className="text-muted-foreground mt-2">Manage your technical skills and their categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={openCategoryCreate} className="gap-2">
            <FolderPlus className="h-4 w-4" /> New Category
          </Button>
          <Button onClick={openSkillCreate} className="gap-2">
            <PlusCircle className="h-4 w-4" /> New Skill
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6">
          {categories.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No skills found.</CardContent></Card>
          ) : (
            <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {categories.map((category) => (
                <SortableCategory key={category.id} category={category} onEdit={() => openCategoryEdit(category)}>
                  <div className="mt-4 rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="w-10"></TableHead>
                          <TableHead className="w-[300px]">Name</TableHead>
                          <TableHead>Field</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.skills.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No skills in this category.</TableCell>
                          </TableRow>
                        ) : (
                          <SortableContext items={category.skills.map(s => s.id)} strategy={verticalListSortingStrategy}>
                            {category.skills.map((skill) => (
                              <SortableSkillRow key={skill.id} skill={skill} onEdit={() => openSkillEdit(skill)} />
                            ))}
                          </SortableContext>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </SortableCategory>
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

      {/* Category Modal */}
      <CustomModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={editingCategoryId ? "Edit Category" : "New Category"} description="Organize your skills into groups.">
        <Form {...categoryForm}>
          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-6 mt-4">
            <FormField control={categoryForm.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Category Name</FormLabel><FormControl><Input placeholder="e.g. Core Skills, Backend..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-between gap-4 pt-4 border-t">
              {editingCategoryId ? <Button type="button" variant="destructive" onClick={() => handleCategoryDelete(editingCategoryId)} disabled={isSubmitting}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button> : <div />}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCategoryModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || !categoryForm.formState.isDirty}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CustomModal>

      {/* Skill Modal */}
      <CustomModal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title={editingSkillId ? "Edit Skill" : "New Skill"} description="Add a specific skill to a category.">
        <Form {...skillForm}>
          <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-6 mt-4">
            <FormField control={skillForm.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Skill Name</FormLabel><FormControl><Input placeholder="React, Python, etc." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={skillForm.control} name="categoryId" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={skillForm.control} name="field" render={({ field }) => (
                <FormItem><FormLabel>Field Tag</FormLabel><FormControl><Input placeholder="e.g. languages, tools" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <div className="flex justify-between gap-4 pt-4 border-t">
              {editingSkillId ? <Button type="button" variant="destructive" onClick={() => handleSkillDelete(editingSkillId)} disabled={isSubmitting}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button> : <div />}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsSkillModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting || !skillForm.formState.isDirty}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CustomModal>
    </div>
  );
}
