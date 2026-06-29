import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from '@rishicodes/shared-types';

import { RevalidationService } from '../revalidation/revalidation.service';

@Injectable()
export class SocialLinksService {
  constructor(
    private prisma: PrismaService,
    private revalidationService: RevalidationService,
  ) {}

  async create(createSocialLinkDto: CreateSocialLinkDto) {
    // If order not provided, put at the end
    if (createSocialLinkDto.order === undefined) {
      const maxOrderLink = await this.prisma.socialLink.findFirst({
        orderBy: { order: 'desc' },
      });
      createSocialLinkDto.order = maxOrderLink ? maxOrderLink.order + 1 : 0;
    }

    const result = await this.prisma.socialLink.create({
      data: createSocialLinkDto,
    });
    this.revalidationService.revalidate(['social-links']).catch(console.error);
    return result;
  }

  findAll() {
    return this.prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const link = await this.prisma.socialLink.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException(`Social Link with ID ${id} not found`);
    }
    return link;
  }

  async update(id: string, updateSocialLinkDto: UpdateSocialLinkDto) {
    const result = await this.prisma.socialLink.update({
      where: { id },
      data: updateSocialLinkDto,
    });
    this.revalidationService.revalidate(['social-links']).catch(console.error);
    return result;
  }

  async reorder(items: { id: string; order: number }[]) {
    // Run sequentially to prevent Supabase PgBouncer transaction deadlocks (P2028)
    const result = [];
    for (const item of items) {
      result.push(
        await this.prisma.socialLink.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      );
    }
    this.revalidationService.revalidate(['social-links']).catch(console.error);
    return result;
  }

  async remove(id: string) {
    const result = await this.prisma.socialLink.delete({
      where: { id },
    });
    this.revalidationService.revalidate(['social-links']).catch(console.error);
    return result;
  }
}
