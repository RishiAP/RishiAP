import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from '@rishicodes/shared-types';
import { RevalidationService } from '../revalidation/revalidation.service';
import DOMPurify from 'isomorphic-dompurify';
import { lexicalJSONToHTML } from '@rishiap/lexiform/headless';
import { UploadService } from '../upload/upload.service';
import { JSDOM } from 'jsdom';

const dom = new JSDOM();
function withDOM<T>(fn: () => T): T {
  const globalsToMock = ['window', 'document', 'DocumentFragment', 'Element', 'navigator'];
  const oldGlobals: any = {};

  // Save old globals and set new ones
  for (const key of globalsToMock) {
    oldGlobals[key] = Object.getOwnPropertyDescriptor(global, key);
    Object.defineProperty(global, key, {
      value: (dom.window as any)[key],
      writable: true,
      configurable: true
    });
  }

  try {
    return fn();
  } finally {
    // Restore old globals
    for (const key of globalsToMock) {
      if (oldGlobals[key]) {
        Object.defineProperty(global, key, oldGlobals[key]);
      } else {
        delete (global as any)[key];
      }
    }
  }
}

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private revalidation: RevalidationService,
    private uploadService: UploadService,
  ) {}

  /**
   * Sanitize HTML content to prevent XSS attacks.
   * Allows MathML, SVG, and specific safe iframes (like YouTube).
   */
  private sanitizeHtml(dirty: string): string {
    return DOMPurify.sanitize(dirty, {
      USE_PROFILES: { html: true, mathMl: true, svg: true },
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allowfullscreen', 'frameborder', 'allow', 'target'],
    });
  }

  async findAllPublished() {
    return this.prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverUrl: true,
        published: true,
        publishedAt: true,
        tags: true,
        updatedAt: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<any> {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post || !post.published) {
      throw new NotFoundException(`Post '${slug}' not found`);
    }
    return post;
  }

  async findAll(): Promise<any> {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<any> {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException(`Post with id '${id}' not found`);
    return post;
  }

  async findByIdOrSlug(identifier: string): Promise<any> {
    const post = await this.prisma.post.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      }
    });
    if (!post) throw new NotFoundException(`Post '${identifier}' not found`);
    return post;
  }

  async create(dto: CreatePostDto): Promise<any> {
    const isValidLexical = dto.contentJson && (dto.contentJson as any).root;
    const rawHtml = isValidLexical ? withDOM(() => lexicalJSONToHTML(dto.contentJson)) : '';
    const sanitizedHtml = this.sanitizeHtml(rawHtml);

    const post = await this.prisma.post.create({
      data: {
        ...dto,
        contentHtml: sanitizedHtml,
        contentJson: dto.contentJson ? dto.contentJson : {},
        publishedAt: dto.published ? new Date().toISOString() : null,
      },
    });
    this.revalidation.revalidate([`post-${post.slug}`, 'posts-list']).catch(console.error);
    return post;
  }

  async update(identifier: string, dto: UpdatePostDto): Promise<any> {
    const existing = await this.findByIdOrSlug(identifier);
    const id = existing.id;

    const data: Record<string, unknown> = { ...dto };

    if (dto.contentJson) {
      data.contentJson = dto.contentJson;
      const isValidLexical = (dto.contentJson as any).root;
      const rawHtml = isValidLexical ? withDOM(() => lexicalJSONToHTML(dto.contentJson)) : '';
      data.contentHtml = this.sanitizeHtml(rawHtml);
    }

    if (dto.published === true && !existing.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const post = await this.prisma.post.update({
      where: { id },
      data,
    });

    await this.cleanupOrphanImage(existing.coverUrl, dto.coverUrl);

    // Trigger ISR revalidation
    this.revalidation
      .revalidate([`post-${post.slug}`, 'posts-list'])
      .catch((err) => console.error('Revalidation failed:', err));

    return post;
  }

  async delete(identifier: string) {
    const post = await this.findByIdOrSlug(identifier);
    const id = post.id;

    await this.prisma.post.delete({ where: { id } });

    await this.cleanupOrphanImage(post.coverUrl, null);

    this.revalidation
      .revalidate(['posts-list'])
      .catch((err) => console.error('Revalidation failed:', err));

    return { deleted: true };
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
