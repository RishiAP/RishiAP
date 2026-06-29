import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto, UpdateEducationDto } from '@rishicodes/shared-types';

import { RevalidationService } from '../revalidation/revalidation.service';

@Injectable()
export class EducationService {
  constructor(
    private prisma: PrismaService,
    private revalidation: RevalidationService,
  ) {}

  async findAll() {
    return this.prisma.education.findMany({ orderBy: { order: 'asc' } });
  }

  async create(dto: CreateEducationDto) {
    const education = await this.prisma.education.create({ data: dto });
    this.revalidation.revalidate(['education-list']).catch(console.error);
    return education;
  }

  async update(id: string, dto: UpdateEducationDto) {
    const education = await this.prisma.education.update({ where: { id }, data: dto });
    this.revalidation.revalidate(['education-list']).catch(console.error);
    return education;
  }

  async delete(id: string) {
    await this.prisma.education.delete({ where: { id } });
    this.revalidation.revalidate(['education-list']).catch(console.error);
    return { deleted: true };
  }

  async reorder(items: { id: string; order: number }[]) {
    for (const item of items) {
      await this.prisma.education.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    this.revalidation.revalidate(['education-list']).catch(console.error);
    return { success: true };
  }
}
