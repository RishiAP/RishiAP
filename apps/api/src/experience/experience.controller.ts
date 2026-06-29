import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ExperienceService } from './experience.service';

@ApiTags('Experience (Public)')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published experience entries' })
  findAllPublished() {
    return this.experienceService.findAllPublished();
  }
}
