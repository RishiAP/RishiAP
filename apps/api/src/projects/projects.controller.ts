import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';

@ApiTags('Projects (Public)')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'List all published projects' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by project category' })
  findAllPublished(@Query('category') category?: string) {
    return this.projectsService.findAllPublished(category);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published project by slug' })
  @ApiParam({ name: 'slug', description: 'Project URL slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get(':slug/enriched')
  @ApiOperation({ summary: 'Get a project with GitHub data (stars, README)' })
  @ApiParam({ name: 'slug', description: 'Project URL slug' })
  findBySlugEnriched(@Param('slug') slug: string) {
    return this.projectsService.findBySlugEnriched(slug);
  }
}
