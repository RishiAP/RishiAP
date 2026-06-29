import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateSkillCategorySchema, UpdateSkillCategorySchema,
  CreateSkillSchema, UpdateSkillSchema,
  CreateSkillCategoryDto, UpdateSkillCategoryDto,
  CreateSkillDto, UpdateSkillDto,
  ReorderDto, ReorderSchema
} from '@rishicodes/shared-types';

@ApiTags('Skills (Admin)')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('admin/skills')
export class SkillsAdminController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'List all skill categories' })
  findAll() {
    return this.skillsService.findAll();
  }

  // ── Categories ──
  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  findCategoryById(@Param('id') id: string) {
    return this.skillsService.findCategoryById(id);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create skill category' })
  @UsePipes(new ZodValidationPipe(CreateSkillCategorySchema))
  createCategory(@Body() dto: CreateSkillCategoryDto) {
    return this.skillsService.createCategory(dto);
  }

  @Patch('categories/reorder')
  @ApiOperation({ summary: 'Reorder skill categories' })
  reorderCategories(@Body(new ZodValidationPipe(ReorderSchema)) dto: ReorderDto) {
    return this.skillsService.reorderCategories(dto);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update skill category' })
  updateCategory(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateSkillCategorySchema)) dto: UpdateSkillCategoryDto,
  ) {
    return this.skillsService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete skill category (cascades skills)' })
  deleteCategory(@Param('id') id: string) {
    return this.skillsService.deleteCategory(id);
  }

  // ── Skills ──
  @Get('items/:id')
  @ApiOperation({ summary: 'Get skill by ID' })
  findSkillById(@Param('id') id: string) {
    return this.skillsService.findSkillById(id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create a skill' })
  @UsePipes(new ZodValidationPipe(CreateSkillSchema))
  createSkill(@Body() dto: CreateSkillDto) {
    return this.skillsService.createSkill(dto);
  }

  @Patch('items/reorder')
  @ApiOperation({ summary: 'Reorder skills' })
  reorderSkills(@Body(new ZodValidationPipe(ReorderSchema)) dto: ReorderDto) {
    return this.skillsService.reorderSkills(dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a skill' })
  updateSkill(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateSkillSchema)) dto: UpdateSkillDto,
  ) {
    return this.skillsService.updateSkill(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a skill' })
  deleteSkill(@Param('id') id: string) {
    return this.skillsService.deleteSkill(id);
  }
}
