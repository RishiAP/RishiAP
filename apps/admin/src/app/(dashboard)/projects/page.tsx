import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api-client';
import { type ProjectResponse } from '@rishicodes/shared-types';
import { ProjectsTableClient } from './projects-table-client';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await fetchApi<ProjectResponse[]>('/admin/projects');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio projects — case studies, packages, firmware, and more.
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all your projects across all categories.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectsTableClient initialData={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
