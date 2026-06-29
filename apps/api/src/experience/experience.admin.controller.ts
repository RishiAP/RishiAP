import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateExperienceSchema, UpdateExperienceSchema,
  CreateExperienceDto, UpdateExperienceDto,
  ReorderSchema, ReorderDto,
} from '@rishicodes/shared-types';

@ApiTags('Experience (Admin)')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('admin/experience')
export class ExperienceAdminController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'List all experience entries' })
  findAll() {
    return this.experienceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get experience entry by ID' })
  findById(@Param('id') id: string) {
    return this.experienceService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create experience entry' })
  @UsePipes(new ZodValidationPipe(CreateExperienceSchema))
  create(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder experience entries' })
  @UsePipes(new ZodValidationPipe(ReorderSchema))
  reorder(@Body() items: ReorderDto) {
    return this.experienceService.reorder(items);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update experience entry' })
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateExperienceSchema)) dto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete experience entry' })
  delete(@Param('id') id: string) {
    return this.experienceService.delete(id);
  }
}
