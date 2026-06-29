import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateProjectDto,
  UpdateProjectDto,
  ReorderSchema,
  ReorderDto,
} from '@rishicodes/shared-types';

@ApiTags('Projects (Admin)')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('admin/projects')
export class ProjectsAdminController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects (including drafts)' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get project by Slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findByIdOrSlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @UsePipes(new ZodValidationPipe(CreateProjectSchema))
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch('reorder')
  @ApiOperation({ summary: 'Reorder projects' })
  @UsePipes(new ZodValidationPipe(ReorderSchema))
  reorder(@Body() items: ReorderDto) {
    return this.projectsService.reorder(items);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update a project by Slug' })
  update(
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(UpdateProjectSchema)) dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(slug, dto);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete a project by Slug' })
  delete(@Param('slug') slug: string) {
    return this.projectsService.delete(slug);
  }
}
