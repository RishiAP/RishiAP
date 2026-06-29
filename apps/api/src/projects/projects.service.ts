import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from '@rishicodes/shared-types';
import { RevalidationService } from '../revalidation/revalidation.service';
import { GithubService } from '../github/github.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private revalidation: RevalidationService,
    private github: GithubService,
    private uploadService: UploadService,
  ) {}

  async findAllPublished(category?: string) {
    return this.prisma.project.findMany({
      where: {
        published: true,
        ...(category ? { category: category as any } : {}),
      },
      orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });
    if (!project) throw new NotFoundException(`Project '${slug}' not found`);
    return project;
  }

  /**
   * Get a project with enriched GitHub data (stars, README, etc.)
   * Used by the public site detail page.
   */
  async findBySlugEnriched(slug: string) {
    const project = await this.findBySlug(slug);

    let githubData = null;
    if (project.repoName) {
      try {
        githubData = await this.github.getRepoEnriched(project.repoName);
      } catch {
        // GitHub data is optional — don't fail the whole request
      }
    }

    return {
      ...project,
      github: githubData,
    };
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: [{ tier: 'asc' }, { order: 'asc' }],
    });
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException(`Project with id '${id}' not found`);
    return project;
  }

  async findByIdOrSlug(identifier: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      }
    });
    if (!project) throw new NotFoundException(`Project '${identifier}' not found`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    const project = await this.prisma.project.create({ data: dto });
    this.revalidation.revalidate(['projects-list']).catch(console.error);
    return project;
  }

  async update(identifier: string, dto: UpdateProjectDto) {
    const existing = await this.findByIdOrSlug(identifier);
    const id = existing.id;

    const project = await this.prisma.project.update({
      where: { id },
      data: dto,
    });

    await this.cleanupOrphanImage(existing.coverUrl, dto.coverUrl);
    await this.cleanupOrphanImage(existing.diagramUrl, dto.diagramUrl);

    // Trigger ISR revalidation for the public site
    this.revalidation
      .revalidate([`project-${project.slug}`, 'projects-list'])
      .catch((err) => console.error('Revalidation failed:', err));

    return project;
  }

  async delete(identifier: string) {
    const project = await this.findByIdOrSlug(identifier);
    const id = project.id;

    await this.prisma.project.delete({ where: { id } });

    await this.cleanupOrphanImage(project.coverUrl, null);
    await this.cleanupOrphanImage(project.diagramUrl, null);

    // Revalidate public site
    this.revalidation
      .revalidate(['projects-list'])
      .catch((err) => console.error('Revalidation failed:', err));

    return { deleted: true };
  }

  async reorder(items: { id: string; order: number }[]) {
    for (const item of items) {
      await this.prisma.project.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }

    // Revalidate public site list
    this.revalidation
      .revalidate(['projects-list'])
      .catch((err) => console.error('Revalidation failed:', err));

    return { success: true };
  }

  private async cleanupOrphanImage(oldUrl: string | null | undefined, newUrl: string | null | undefined) {
    if (!oldUrl || oldUrl === newUrl || !oldUrl.includes('cloudinary.com')) return;

    // Check if oldUrl is still used in any Project
    const projectCount = await this.prisma.project.count({
      where: {
        OR: [
          { coverUrl: oldUrl },
          { diagramUrl: oldUrl }
        ]
      }
    });

    // Check if used in Posts
    const postCount = await this.prisma.post.count({
      where: { coverUrl: oldUrl }
    });

    if (projectCount === 0 && postCount === 0) {
      const publicId = this.uploadService.getPublicIdFromUrl(oldUrl);
      if (publicId) {
        await this.uploadService.deleteImage(publicId).catch((err) => {
          console.error(`Failed to delete orphaned image ${publicId}:`, err);
        });
      }
    }
  }
}
