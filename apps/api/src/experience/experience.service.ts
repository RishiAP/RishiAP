import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto } from '@rishicodes/shared-types';
import { RevalidationService } from '../revalidation/revalidation.service';

@Injectable()
export class ExperienceService {
  constructor(
    private prisma: PrismaService,
    private revalidation: RevalidationService,
  ) {}

  async findAllPublished() {
    return this.prisma.experience.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }

  async findAll() {
    return this.prisma.experience.findMany({ orderBy: { order: 'asc' } });
  }

  async findById(id: string) {
    const experience = await this.prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new NotFoundException(`Experience with id '${id}' not found`);
    return experience;
  }

  async create(dto: CreateExperienceDto) {
    const experience = await this.prisma.experience.create({ data: dto });
    this.revalidation.revalidate(['experience-list']).catch(console.error);
    return experience;
  }

  async update(id: string, dto: UpdateExperienceDto) {
    const experience = await this.prisma.experience.update({ where: { id }, data: dto });
    this.revalidation.revalidate(['experience-list']).catch(console.error);
    return experience;
  }

  async delete(id: string) {
    await this.prisma.experience.delete({ where: { id } });
    this.revalidation.revalidate(['experience-list']).catch(console.error);
    return { deleted: true };
  }

  async reorder(items: { id: string; order: number }[]) {
    for (const item of items) {
      await this.prisma.experience.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    this.revalidation.revalidate(['experience-list']).catch(console.error);
    return { success: true };
  }
}
