import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSkillCategoryDto, UpdateSkillCategoryDto,
  CreateSkillDto, UpdateSkillDto, ReorderDto
} from '@rishicodes/shared-types';

import { RevalidationService } from '../revalidation/revalidation.service';

@Injectable()
export class SkillsService {
  constructor(
    private prisma: PrismaService,
    private revalidation: RevalidationService,
  ) {}

  async findAll() {
    return this.prisma.skillCategory.findMany({
      orderBy: { order: 'asc' },
      include: { 
        skills: {
          orderBy: { order: 'asc' }
        } 
      },
    });
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.skillCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(dto: CreateSkillCategoryDto) {
    const category = await this.prisma.skillCategory.create({ data: dto });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return category;
  }

  async updateCategory(id: string, dto: UpdateSkillCategoryDto) {
    const category = await this.prisma.skillCategory.update({ where: { id }, data: dto });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return category;
  }

  async deleteCategory(id: string) {
    await this.prisma.skillCategory.delete({ where: { id } });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return { deleted: true };
  }

  async reorderCategories(dto: ReorderDto) {
    for (const item of dto) {
      await this.prisma.skillCategory.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return { success: true };
  }

  async findSkillById(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async createSkill(dto: CreateSkillDto) {
    const skill = await this.prisma.skill.create({ data: dto });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return skill;
  }

  async updateSkill(id: string, dto: UpdateSkillDto) {
    const skill = await this.prisma.skill.update({ where: { id }, data: dto });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return skill;
  }

  async deleteSkill(id: string) {
    await this.prisma.skill.delete({ where: { id } });
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return { deleted: true };
  }

  async reorderSkills(dto: ReorderDto) {
    for (const item of dto) {
      await this.prisma.skill.update({
        where: { id: item.id },
        data: { order: item.order },
      });
    }
    this.revalidation.revalidate(['skills-list']).catch(console.error);
    return { success: true };
  }
}
