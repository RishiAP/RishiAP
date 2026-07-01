"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { type ProjectResponse } from '@rishicodes/shared-types';
import { fetchApiAction as fetchApi } from '@/lib/actions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortableTable, SortableTableRow } from '@/components/ui/sortable-table';
import { useRouter } from 'next/navigation';

const categoryLabels: Record<string, string> = {
  CASE_STUDY: 'Case Study',
  PACKAGE: 'Package',
  LIBRARY: 'Library',
  EXPERIMENT: 'Experiment',
  FIRMWARE: 'Firmware',
  TOOL: 'Tool',
  APPLICATION: 'Application',
  OTHER: 'Other',
};

export function ProjectsTableClient({ initialData }: { initialData: ProjectResponse[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleReorder = async (reorderedItems: ProjectResponse[]) => {
    setItems(reorderedItems);
    const payload = reorderedItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    toast.promise(
      fetchApi('/admin/projects/reorder', {
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

  return (
    <div className="rounded-md border">
      <SortableTable items={items} onReorder={handleReorder}>
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40px] px-2"></TableHead>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No projects found. Create your first project!
                </TableCell>
              </TableRow>
            ) : (
              items.map((project) => (
                <SortableTableRow key={project.id} id={project.id} className="group">
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                      {categoryLabels[project.category] ?? project.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      project.tier === 'FLAGSHIP' 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {project.tier}
                    </span>
                  </TableCell>
                  <TableCell>
                    {project.published ? (
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
                    <Link href={`/projects/${project.slug}/edit`}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </SortableTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </SortableTable>
    </div>
  );
}
